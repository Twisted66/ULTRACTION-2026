<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    ultraction_method_not_allowed(['POST']);
}

$ip = ultraction_client_ip();
$userAgent = ultraction_request_header('User-Agent') ?? 'unknown';
$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));

try {
    $rateLimit = ultraction_rate_limit_check(
        'contact',
        $ip,
        (int) ultraction_config('contact.rate_limit_window_seconds', 60),
        (int) ultraction_config('contact.rate_limit_max_requests', 5)
    );
} catch (Throwable $exception) {
    error_log('Contact rate limit failed: ' . $exception->getMessage());
    ultraction_json_response(500, [
        'ok' => false,
        'message' => 'Unable to send your message right now. Please try again shortly.',
    ]);
}

if (($rateLimit['limited'] ?? false) === true) {
    ultraction_json_response(429, [
        'ok' => false,
        'message' => 'Too many requests. Please wait a minute and try again.',
    ], [
        'Retry-After' => (string) ($rateLimit['retry_after'] ?? 60),
    ]);
}

$payload = [];
$attachment = null;

if (str_contains($contentType, 'application/json')) {
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode(is_string($rawBody) ? $rawBody : '', true);

    if (!is_array($decoded)) {
        ultraction_json_response(400, [
            'ok' => false,
            'message' => 'Invalid JSON payload.',
        ]);
    }

    $payload = $decoded;
} elseif (str_contains($contentType, 'application/x-www-form-urlencoded') || str_contains($contentType, 'multipart/form-data')) {
    $payload = $_POST;
    $attachment = $_FILES['attachment'] ?? null;
} else {
    ultraction_json_response(415, [
        'ok' => false,
        'message' => 'Unsupported content type.',
    ]);
}

$name = ultraction_trimmed_string($payload['name'] ?? null);
$email = ultraction_trimmed_string($payload['email'] ?? null);
$subject = strtolower(ultraction_trimmed_string($payload['subject'] ?? null));
$message = ultraction_trimmed_string($payload['message'] ?? null);
$company = ultraction_trimmed_string($payload['company'] ?? null);
$allowedSubjects = (array) ultraction_config('contact.allowed_subjects', []);
$errors = [];

if ($company !== '') {
    ultraction_json_response(200, [
        'ok' => true,
        'message' => 'Your message has been sent.',
    ]);
}

if (!ultraction_string_length_between($name, 2, 100)) {
    $errors['name'] = 'Name must be between 2 and 100 characters.';
}

if (!ultraction_valid_email($email) || !ultraction_string_length_between($email, 3, 254)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if (!ultraction_allowed_value($subject, $allowedSubjects)) {
    $errors['subject'] = 'Please select a valid subject.';
}

if (!ultraction_string_length_between($message, 10, 5000)) {
    $errors['message'] = 'Message must be between 10 and 5000 characters.';
}

$attachmentError = ultraction_validate_uploaded_file(
    is_array($attachment) ? $attachment : null,
    (array) ultraction_config('contact.allowed_extensions', []),
    (array) ultraction_config('contact.allowed_mime_types', []),
    (int) ultraction_config('contact.max_attachment_bytes', 10 * 1024 * 1024)
);
if ($attachmentError !== null) {
    $errors['attachment'] = $attachmentError;
}

if ($errors !== []) {
    ultraction_json_response(400, [
        'ok' => false,
        'message' => 'Please fix the highlighted fields and try again.',
        'fieldErrors' => $errors,
    ]);
}

$storedAttachment = null;
if (ultraction_upload_present(is_array($attachment) ? $attachment : null)) {
    try {
        $storedAttachment = ultraction_store_uploaded_file(
            $attachment,
            (string) ultraction_config('paths.contact_upload_dir')
        );
    } catch (Throwable $exception) {
        error_log('Unable to store contact attachment: ' . $exception->getMessage());
        ultraction_json_response(500, [
            'ok' => false,
            'message' => 'Unable to send your message right now. Please try again shortly.',
        ]);
    }
}

$submission = [
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'subject_label' => (string) ($allowedSubjects[$subject] ?? $subject),
    'message' => $message,
    'company' => $company,
    'ip' => $ip,
    'user_agent' => $userAgent,
    'submitted_at_iso' => gmdate(DATE_ATOM),
    'attachment_path' => $storedAttachment['path'] ?? null,
    'attachment_name' => $storedAttachment['original_name'] ?? null,
    'attachment_mime' => $storedAttachment['mime_type'] ?? null,
    'attachment_size' => $storedAttachment['size'] ?? null,
];

try {
    $sent = ultraction_send_contact_mail($submission);
    if (!$sent) {
        throw new RuntimeException('mail transport reported failure');
    }

    ultraction_json_response(200, [
        'ok' => true,
        'message' => 'Your message has been sent.',
    ]);
} catch (Throwable $exception) {
    error_log('Contact form submission failed: ' . $exception->getMessage());
    ultraction_json_response(500, [
        'ok' => false,
        'message' => 'Unable to send your message right now. Please try again shortly.',
    ]);
}
