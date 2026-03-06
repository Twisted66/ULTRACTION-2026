<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'bootstrap.php';
require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'jobs_repository.php';

const ULTRACTION_JOBS_READ_RATE_LIMIT_WINDOW_SECONDS = 60;
const ULTRACTION_JOBS_READ_RATE_LIMIT_MAX_REQUESTS = 120;
const ULTRACTION_JOBS_WRITE_RATE_LIMIT_WINDOW_SECONDS = 60;
const ULTRACTION_JOBS_WRITE_RATE_LIMIT_MAX_REQUESTS = 30;

$ultractionJobsMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($ultractionJobsMethod === 'OPTIONS') {
    header('Allow: GET, POST, PATCH, DELETE, OPTIONS');
    http_response_code(204);
    exit;
}

try {
    switch ($ultractionJobsMethod) {
        case 'GET':
            ultraction_jobs_handle_get();
            break;
        case 'POST':
            ultraction_jobs_handle_post();
            break;
        case 'PATCH':
            ultraction_jobs_handle_patch();
            break;
        case 'DELETE':
            ultraction_jobs_handle_delete();
            break;
        default:
            ultraction_json_response(405, [
                'ok' => false,
                'error' => [
                    'code' => 'method_not_allowed',
                    'message' => 'Method not allowed.',
                ],
            ], [
                'Allow' => 'GET, POST, PATCH, DELETE, OPTIONS',
            ]);
    }
} catch (Throwable $exception) {
    ultraction_jobs_handle_runtime_exception($exception, 'Unable to process this request right now.');
}

function ultraction_jobs_handle_get(): void
{
    ultraction_jobs_check_rate_limit('read');

    $requestedStatus = strtolower(trim((string) ($_GET['status'] ?? 'open')));
    if (!in_array($requestedStatus, ['open', 'closed', 'all'], true)) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_status',
                'message' => 'status must be one of: open, closed, all.',
            ],
        ]);
    }

    if ($requestedStatus !== 'open') {
        ultraction_jobs_ensure_write_auth();
    }

    try {
        $jobs = ultraction_jobs_repository_list($requestedStatus);
        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'jobs' => $jobs,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_jobs_handle_runtime_exception($exception, 'Unable to load jobs right now.');
    }
}

function ultraction_jobs_handle_post(): void
{
    ultraction_jobs_check_rate_limit('write');
    ultraction_jobs_ensure_write_auth();

    $body = ultraction_jobs_parse_json_body(true);
    $fieldErrors = ultraction_jobs_validate_write_body($body, 'POST');
    if ($fieldErrors !== []) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid job payload.',
                'fieldErrors' => $fieldErrors,
            ],
        ]);
    }

    try {
        $created = ultraction_jobs_repository_create([
            'title' => $body['title'] ?? '',
            'location' => $body['location'] ?? '',
            'description' => $body['description'] ?? '',
            'department' => $body['department'] ?? null,
            'employmentType' => $body['employmentType'] ?? null,
            'postedAt' => $body['postedAt'] ?? null,
        ]);

        ultraction_json_response(201, [
            'ok' => true,
            'data' => [
                'job' => $created,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_jobs_handle_runtime_exception($exception, 'Unable to create this job right now.');
    }
}

function ultraction_jobs_handle_patch(): void
{
    ultraction_jobs_check_rate_limit('write');
    ultraction_jobs_ensure_write_auth();

    $body = ultraction_jobs_parse_json_body(true);
    $jobId = trim((string) ($_GET['id'] ?? ''));
    if ($jobId === '') {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'missing_id',
                'message' => 'A job id is required via ?id=...',
            ],
        ]);
    }

    $bodyId = ultraction_jobs_optional_string($body['id'] ?? null);
    if ($bodyId !== null && $bodyId !== $jobId) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid job payload.',
                'fieldErrors' => [
                    'id' => 'body.id must match query parameter id.',
                ],
            ],
        ]);
    }

    $fieldErrors = ultraction_jobs_validate_write_body($body, 'PATCH');
    if ($fieldErrors !== []) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid job payload.',
                'fieldErrors' => $fieldErrors,
            ],
        ]);
    }

    $hasUpdatableField =
        array_key_exists('title', $body) ||
        array_key_exists('location', $body) ||
        array_key_exists('description', $body) ||
        array_key_exists('department', $body) ||
        array_key_exists('employmentType', $body) ||
        array_key_exists('status', $body) ||
        array_key_exists('postedAt', $body);

    if (!$hasUpdatableField) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'empty_update',
                'message' => 'At least one updatable field is required.',
            ],
        ]);
    }

    try {
        $updated = ultraction_jobs_repository_update($jobId, [
            'title' => array_key_exists('title', $body) ? $body['title'] : null,
            'location' => array_key_exists('location', $body) ? $body['location'] : null,
            'description' => array_key_exists('description', $body) ? $body['description'] : null,
            'department' => array_key_exists('department', $body) ? $body['department'] : null,
            'employmentType' => array_key_exists('employmentType', $body) ? $body['employmentType'] : null,
            'status' => array_key_exists('status', $body) ? $body['status'] : null,
            'postedAt' => array_key_exists('postedAt', $body) ? $body['postedAt'] : null,
        ]);

        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'job' => $updated,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_jobs_handle_runtime_exception($exception, 'Unable to update this job right now.');
    }
}

function ultraction_jobs_handle_delete(): void
{
    ultraction_jobs_check_rate_limit('write');
    ultraction_jobs_ensure_write_auth();

    $body = ultraction_jobs_parse_json_body(false);
    $jobId = trim((string) ($_GET['id'] ?? ''));
    if ($jobId === '') {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'missing_id',
                'message' => 'A job id is required via ?id=...',
            ],
        ]);
    }

    $bodyId = ultraction_jobs_optional_string($body['id'] ?? null);
    if ($bodyId !== null && $bodyId !== $jobId) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid archive payload.',
                'fieldErrors' => [
                    'id' => 'body.id must match query parameter id.',
                ],
            ],
        ]);
    }

    $confirmParam = strtolower(trim((string) ($_GET['confirm'] ?? '')));
    $confirmFromQuery = $confirmParam === 'true' ? true : ($confirmParam === 'false' ? false : null);
    $confirmArchive = $body['confirmArchive'] ?? $body['confirmRemove'] ?? $confirmFromQuery;
    $confirmTitle = ultraction_jobs_optional_string($body['confirmTitle'] ?? null)
        ?? ultraction_jobs_optional_string($_GET['confirmTitle'] ?? null)
        ?? ultraction_jobs_optional_string($_GET['title'] ?? null)
        ?? '';

    $confirmationErrors = [];
    if ($confirmArchive !== true) {
        $confirmationErrors['confirmArchive'] = 'confirmArchive must be true.';
    }

    if ($confirmTitle === '') {
        $confirmationErrors['confirmTitle'] = 'confirmTitle is required.';
    }

    if ($confirmationErrors !== []) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid archive confirmation.',
                'fieldErrors' => $confirmationErrors,
            ],
        ]);
    }

    try {
        $archived = ultraction_jobs_repository_archive($jobId, $confirmTitle);
        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'job' => $archived,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_jobs_handle_runtime_exception($exception, 'Unable to archive this job right now.');
    }
}

function ultraction_jobs_check_rate_limit(string $scope): void
{
    $ip = ultraction_client_ip();
    $result = ultraction_rate_limit_check(
        'jobs-' . $scope,
        $ip,
        $scope === 'write' ? ULTRACTION_JOBS_WRITE_RATE_LIMIT_WINDOW_SECONDS : ULTRACTION_JOBS_READ_RATE_LIMIT_WINDOW_SECONDS,
        $scope === 'write' ? ULTRACTION_JOBS_WRITE_RATE_LIMIT_MAX_REQUESTS : ULTRACTION_JOBS_READ_RATE_LIMIT_MAX_REQUESTS
    );

    if (($result['limited'] ?? false) !== true) {
        return;
    }

    ultraction_json_response(429, [
        'ok' => false,
        'error' => [
            'code' => 'rate_limited',
            'message' => 'Too many ' . $scope . ' requests. Please try again shortly.',
        ],
    ], [
        'Retry-After' => (string) ($result['retry_after'] ?? 60),
    ]);
}

function ultraction_jobs_ensure_write_auth(): void
{
    $expectedApiKey = ultraction_env_value('JOBS_API_KEY', null);
    if (!is_string($expectedApiKey) || trim($expectedApiKey) === '') {
        ultraction_json_response(503, [
            'ok' => false,
            'error' => [
                'code' => 'jobs_api_misconfigured',
                'message' => 'Jobs API write operations are not configured.',
            ],
        ]);
    }

    $receivedApiKey = ultraction_request_header('x-jobs-api-key') ?? ultraction_bearer_token();
    if ($receivedApiKey === null || trim($receivedApiKey) === '') {
        ultraction_json_response(401, [
            'ok' => false,
            'error' => [
                'code' => 'auth_required',
                'message' => 'Missing jobs API credentials.',
            ],
        ]);
    }

    if (!hash_equals(trim($expectedApiKey), trim($receivedApiKey))) {
        ultraction_json_response(403, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_credentials',
                'message' => 'Invalid jobs API credentials.',
            ],
        ]);
    }
}

function ultraction_jobs_parse_json_body(bool $required): array
{
    $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if (!str_contains($contentType, 'application/json')) {
        if ($required) {
            ultraction_json_response(415, [
                'ok' => false,
                'error' => [
                    'code' => 'unsupported_media_type',
                    'message' => 'Content-Type must be application/json.',
                ],
            ]);
        }

        return [];
    }

    $raw = file_get_contents('php://input');
    try {
        $decoded = json_decode(is_string($raw) ? $raw : '', true, 512, JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_json',
                'message' => 'Invalid JSON payload.',
            ],
        ]);
    }

    if (!is_array($decoded)) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_json',
                'message' => 'Invalid JSON payload.',
            ],
        ]);
    }

    return $decoded;
}

function ultraction_jobs_validate_write_body(array $body, string $method): array
{
    $errors = [];
    $title = ultraction_jobs_optional_string($body['title'] ?? null) ?? '';
    $location = ultraction_jobs_optional_string($body['location'] ?? null) ?? '';
    $description = ultraction_jobs_optional_string($body['description'] ?? null) ?? '';

    if ($method === 'POST' || array_key_exists('title', $body)) {
        if (!ultraction_string_length_between($title, 2, 120)) {
            $errors['title'] = 'Title must be between 2 and 120 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('location', $body)) {
        if (!ultraction_string_length_between($location, 2, 120)) {
            $errors['location'] = 'Location must be between 2 and 120 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('description', $body)) {
        if (!ultraction_string_length_between($description, 20, 5000)) {
            $errors['description'] = 'Description must be between 20 and 5000 characters.';
        }
    }

    $department = ultraction_jobs_optional_string($body['department'] ?? null);
    if ($department !== null && !ultraction_string_length_between($department, 1, 120)) {
        $errors['department'] = 'Department must be 120 characters or fewer.';
    }

    $employmentType = ultraction_jobs_optional_string($body['employmentType'] ?? null);
    if ($employmentType !== null && !ultraction_string_length_between($employmentType, 1, 80)) {
        $errors['employmentType'] = 'Employment type must be 80 characters or fewer.';
    }

    $postedAt = ultraction_jobs_optional_string($body['postedAt'] ?? null);
    if ($postedAt !== null) {
        try {
            new DateTimeImmutable($postedAt);
        } catch (Throwable) {
            $errors['postedAt'] = 'postedAt must be a valid ISO date string.';
        }
    }

    if (array_key_exists('status', $body)) {
        $status = ultraction_jobs_optional_string($body['status'] ?? null);
        if ($status === null || !in_array($status, ['open', 'closed'], true)) {
            $errors['status'] = 'Status must be either open or closed.';
        }
    }

    return $errors;
}

function ultraction_jobs_handle_runtime_exception(Throwable $exception, string $fallbackMessage): void
{
    if ($exception instanceof UltractionJobNotFoundException) {
        ultraction_json_response(404, [
            'ok' => false,
            'error' => [
                'code' => 'not_found',
                'message' => $exception->getMessage(),
            ],
        ]);
    }

    if ($exception instanceof UltractionJobConflictException) {
        ultraction_json_response(409, [
            'ok' => false,
            'error' => [
                'code' => 'conflict',
                'message' => $exception->getMessage(),
            ],
        ]);
    }

    if ($exception instanceof RuntimeException && $exception->getMessage() === 'jobs_db_unavailable') {
        ultraction_json_response(503, [
            'ok' => false,
            'error' => [
                'code' => 'jobs_storage_misconfigured',
                'message' => 'Jobs data storage is not configured.',
            ],
        ]);
    }

    error_log('[jobs.php] ' . $exception->getMessage());
    ultraction_json_response(500, [
        'ok' => false,
        'error' => [
            'code' => 'internal_error',
            'message' => $fallbackMessage,
        ],
    ]);
}

function ultraction_jobs_optional_string(mixed $value): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $trimmed = trim($value);
    return $trimmed === '' ? null : $trimmed;
}
