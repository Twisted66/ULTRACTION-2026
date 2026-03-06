<?php

declare(strict_types=1);

function ultraction_mail_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function ultraction_mime_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function ultraction_contact_subject(array $submission): string
{
    $prefix = (string) ultraction_config('contact.subject_prefix', '[ULTRACTION Contact]');
    $subjectLabel = (string) ($submission['subject_label'] ?? 'Contact');
    $name = (string) ($submission['name'] ?? 'Unknown Sender');

    return sprintf('%s %s - %s', $prefix, $subjectLabel, $name);
}

function ultraction_contact_html_body(array $submission): string
{
    $attachmentSummary = '';
    if (!empty($submission['attachment_name'])) {
        $attachmentSummary = '<p><strong>Attachment:</strong> ' . ultraction_mail_escape((string) $submission['attachment_name']) . '</p>';
    }

    return implode('', [
        '<h2>New Contact Form Submission</h2>',
        '<p><strong>Name:</strong> ' . ultraction_mail_escape((string) ($submission['name'] ?? '')) . '</p>',
        '<p><strong>Email:</strong> ' . ultraction_mail_escape((string) ($submission['email'] ?? '')) . '</p>',
        '<p><strong>Topic:</strong> ' . ultraction_mail_escape((string) ($submission['subject_label'] ?? '')) . ' (' . ultraction_mail_escape((string) ($submission['subject'] ?? '')) . ')</p>',
        '<p><strong>Submitted At:</strong> ' . ultraction_mail_escape((string) ($submission['submitted_at_iso'] ?? '')) . '</p>',
        '<p><strong>IP:</strong> ' . ultraction_mail_escape((string) ($submission['ip'] ?? '')) . '</p>',
        '<p><strong>User Agent:</strong> ' . ultraction_mail_escape((string) ($submission['user_agent'] ?? '')) . '</p>',
        $attachmentSummary,
        '<hr />',
        '<p><strong>Message</strong></p>',
        '<pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">' . ultraction_mail_escape((string) ($submission['message'] ?? '')) . '</pre>',
    ]);
}

function ultraction_contact_text_body(array $submission): string
{
    $lines = [
        'New Contact Form Submission',
        '',
        'Name: ' . (string) ($submission['name'] ?? ''),
        'Email: ' . (string) ($submission['email'] ?? ''),
        'Topic: ' . (string) ($submission['subject_label'] ?? '') . ' (' . (string) ($submission['subject'] ?? '') . ')',
        'Submitted At: ' . (string) ($submission['submitted_at_iso'] ?? ''),
        'IP: ' . (string) ($submission['ip'] ?? ''),
        'User Agent: ' . (string) ($submission['user_agent'] ?? ''),
    ];

    if (!empty($submission['attachment_name'])) {
        $lines[] = 'Attachment: ' . (string) $submission['attachment_name'];
    }

    $lines[] = '';
    $lines[] = 'Message';
    $lines[] = (string) ($submission['message'] ?? '');

    return implode("\r\n", $lines);
}

function ultraction_log_contact_mail(array $submission): bool
{
    $logPath = (string) ultraction_config('paths.mail_log');
    $directory = dirname($logPath);

    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        return false;
    }

    $payload = [
        'logged_at' => gmdate(DATE_ATOM),
        'to' => ultraction_config('contact.receiver_email', 'info@ultraction.ae'),
        'subject' => ultraction_contact_subject($submission),
        'submission' => $submission,
    ];

    return file_put_contents($logPath, json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND | LOCK_EX) !== false;
}

function ultraction_send_contact_mail(array $submission): bool
{
    $transport = strtolower((string) ultraction_config('contact.mail_transport', 'mail'));
    if ($transport === 'log') {
        return ultraction_log_contact_mail($submission);
    }

    $to = (string) ultraction_config('contact.receiver_email', 'info@ultraction.ae');
    $fromEmail = (string) ultraction_config('contact.from_email', 'info@ultraction.ae');
    $fromName = (string) ultraction_config('contact.from_name', 'ULTRACTION Website');
    $subject = ultraction_contact_subject($submission);
    $htmlBody = ultraction_contact_html_body($submission);
    $textBody = ultraction_contact_text_body($submission);

    $headers = [
        'MIME-Version: 1.0',
        'From: ' . ultraction_mime_header($fromName) . ' <' . $fromEmail . '>',
        'Reply-To: ' . ultraction_mime_header((string) ($submission['name'] ?? '')) . ' <' . (string) ($submission['email'] ?? $fromEmail) . '>',
    ];

    $attachmentPath = $submission['attachment_path'] ?? null;
    $attachmentName = $submission['attachment_name'] ?? null;
    $attachmentMime = $submission['attachment_mime'] ?? 'application/octet-stream';

    if (is_string($attachmentPath) && $attachmentPath !== '' && is_readable($attachmentPath)) {
        $boundaryMixed = 'mixed-' . bin2hex(random_bytes(12));
        $boundaryAlternative = 'alt-' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundaryMixed . '"';

        $body = [];
        $body[] = '--' . $boundaryMixed;
        $body[] = 'Content-Type: multipart/alternative; boundary="' . $boundaryAlternative . '"';
        $body[] = '';
        $body[] = '--' . $boundaryAlternative;
        $body[] = 'Content-Type: text/plain; charset=UTF-8';
        $body[] = 'Content-Transfer-Encoding: 8bit';
        $body[] = '';
        $body[] = $textBody;
        $body[] = '';
        $body[] = '--' . $boundaryAlternative;
        $body[] = 'Content-Type: text/html; charset=UTF-8';
        $body[] = 'Content-Transfer-Encoding: 8bit';
        $body[] = '';
        $body[] = $htmlBody;
        $body[] = '';
        $body[] = '--' . $boundaryAlternative . '--';
        $body[] = '';
        $body[] = '--' . $boundaryMixed;
        $body[] = 'Content-Type: ' . (string) $attachmentMime . '; name="' . addslashes((string) $attachmentName) . '"';
        $body[] = 'Content-Transfer-Encoding: base64';
        $body[] = 'Content-Disposition: attachment; filename="' . addslashes((string) $attachmentName) . '"';
        $body[] = '';
        $body[] = chunk_split(base64_encode((string) file_get_contents($attachmentPath)));
        $body[] = '--' . $boundaryMixed . '--';

        return mail($to, ultraction_mime_header($subject), implode("\r\n", $body), implode("\r\n", $headers));
    }

    $boundary = 'alt-' . bin2hex(random_bytes(12));
    $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
    $body = [];
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/plain; charset=UTF-8';
    $body[] = 'Content-Transfer-Encoding: 8bit';
    $body[] = '';
    $body[] = $textBody;
    $body[] = '';
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/html; charset=UTF-8';
    $body[] = 'Content-Transfer-Encoding: 8bit';
    $body[] = '';
    $body[] = $htmlBody;
    $body[] = '';
    $body[] = '--' . $boundary . '--';

    return mail($to, ultraction_mime_header($subject), implode("\r\n", $body), implode("\r\n", $headers));
}
