<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'bootstrap.php';
require_once dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'news_repository.php';

const ULTRACTION_NEWS_READ_RATE_LIMIT_WINDOW_SECONDS = 60;
const ULTRACTION_NEWS_READ_RATE_LIMIT_MAX_REQUESTS = 120;
const ULTRACTION_NEWS_WRITE_RATE_LIMIT_WINDOW_SECONDS = 60;
const ULTRACTION_NEWS_WRITE_RATE_LIMIT_MAX_REQUESTS = 30;

$ultractionNewsMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($ultractionNewsMethod === 'OPTIONS') {
    header('Allow: GET, POST, PATCH, DELETE, OPTIONS');
    http_response_code(204);
    exit;
}

try {
    switch ($ultractionNewsMethod) {
        case 'GET':
            ultraction_news_handle_get();
            break;
        case 'POST':
            ultraction_news_handle_post();
            break;
        case 'PATCH':
            ultraction_news_handle_patch();
            break;
        case 'DELETE':
            ultraction_news_handle_delete();
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
    ultraction_news_handle_runtime_exception($exception, 'Unable to process this request right now.');
}

function ultraction_news_handle_get(): void
{
    ultraction_news_check_rate_limit('read');

    $requestedStatus = strtolower(trim((string) ($_GET['status'] ?? 'published')));
    if (!in_array($requestedStatus, ['draft', 'published', 'archived', 'all'], true)) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_status',
                'message' => 'status must be one of: published, draft, archived, all.',
            ],
        ]);
    }

    if ($requestedStatus !== 'published') {
        ultraction_news_ensure_write_auth();
    }

    try {
        $news = ultraction_news_repository_list($requestedStatus);
        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'news' => $news,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_news_handle_runtime_exception($exception, 'Unable to load news right now.');
    }
}

function ultraction_news_handle_post(): void
{
    ultraction_news_check_rate_limit('write');
    ultraction_news_ensure_write_auth();

    $body = ultraction_news_parse_json_body(true);
    $fieldErrors = ultraction_news_validate_write_body($body, 'POST');
    if ($fieldErrors !== []) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid news payload.',
                'fieldErrors' => $fieldErrors,
            ],
        ]);
    }

    try {
        $created = ultraction_news_repository_create([
            'title' => $body['title'] ?? '',
            'excerpt' => $body['excerpt'] ?? '',
            'content' => $body['content'] ?? '',
            'category' => $body['category'] ?? '',
            'tags' => $body['tags'] ?? [],
            'author' => $body['author'] ?? '',
            'image' => $body['image'] ?? '',
            'sourceName' => $body['sourceName'] ?? '',
            'sourceUrl' => $body['sourceUrl'] ?? '',
            'sourcePublishedAt' => $body['sourcePublishedAt'] ?? null,
        ]);

        ultraction_json_response(201, [
            'ok' => true,
            'data' => [
                'news' => $created,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_news_handle_runtime_exception($exception, 'Unable to create this news entry right now.');
    }
}

function ultraction_news_handle_patch(): void
{
    ultraction_news_check_rate_limit('write');
    ultraction_news_ensure_write_auth();

    $body = ultraction_news_parse_json_body(true);
    $newsId = trim((string) ($_GET['id'] ?? ''));
    if ($newsId === '') {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'missing_id',
                'message' => 'A news id is required via ?id=...',
            ],
        ]);
    }

    $bodyId = ultraction_news_optional_string($body['id'] ?? null);
    if ($bodyId !== null && $bodyId !== $newsId) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid news payload.',
                'fieldErrors' => [
                    'id' => 'body.id must match query parameter id.',
                ],
            ],
        ]);
    }

    $fieldErrors = ultraction_news_validate_write_body($body, 'PATCH');
    if ($fieldErrors !== []) {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'validation_error',
                'message' => 'Invalid news payload.',
                'fieldErrors' => $fieldErrors,
            ],
        ]);
    }

    $hasUpdatableField =
        array_key_exists('title', $body) ||
        array_key_exists('excerpt', $body) ||
        array_key_exists('content', $body) ||
        array_key_exists('category', $body) ||
        array_key_exists('tags', $body) ||
        array_key_exists('author', $body) ||
        array_key_exists('image', $body) ||
        array_key_exists('sourceName', $body) ||
        array_key_exists('sourceUrl', $body) ||
        array_key_exists('sourcePublishedAt', $body) ||
        array_key_exists('status', $body) ||
        array_key_exists('publishedAt', $body);

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
        $updated = ultraction_news_repository_update($newsId, [
            'title' => array_key_exists('title', $body) ? $body['title'] : null,
            'excerpt' => array_key_exists('excerpt', $body) ? $body['excerpt'] : null,
            'content' => array_key_exists('content', $body) ? $body['content'] : null,
            'category' => array_key_exists('category', $body) ? $body['category'] : null,
            'tags' => array_key_exists('tags', $body) ? ($body['tags'] ?? []) : null,
            'author' => array_key_exists('author', $body) ? $body['author'] : null,
            'image' => array_key_exists('image', $body) ? $body['image'] : null,
            'sourceName' => array_key_exists('sourceName', $body) ? $body['sourceName'] : null,
            'sourceUrl' => array_key_exists('sourceUrl', $body) ? $body['sourceUrl'] : null,
            'sourcePublishedAt' => array_key_exists('sourcePublishedAt', $body) ? $body['sourcePublishedAt'] : null,
            'status' => array_key_exists('status', $body) ? $body['status'] : null,
            'publishedAt' => array_key_exists('publishedAt', $body) ? $body['publishedAt'] : null,
        ]);

        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'news' => $updated,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_news_handle_runtime_exception($exception, 'Unable to update this news entry right now.');
    }
}

function ultraction_news_handle_delete(): void
{
    ultraction_news_check_rate_limit('write');
    ultraction_news_ensure_write_auth();

    $body = ultraction_news_parse_json_body(false);
    $newsId = trim((string) ($_GET['id'] ?? ''));
    if ($newsId === '') {
        ultraction_json_response(400, [
            'ok' => false,
            'error' => [
                'code' => 'missing_id',
                'message' => 'A news id is required via ?id=...',
            ],
        ]);
    }

    $bodyId = ultraction_news_optional_string($body['id'] ?? null);
    if ($bodyId !== null && $bodyId !== $newsId) {
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
    $confirmTitle = ultraction_news_optional_string($body['confirmTitle'] ?? null)
        ?? ultraction_news_optional_string($_GET['confirmTitle'] ?? null)
        ?? ultraction_news_optional_string($_GET['title'] ?? null)
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
        $archived = ultraction_news_repository_archive($newsId, $confirmTitle);
        ultraction_json_response(200, [
            'ok' => true,
            'data' => [
                'news' => $archived,
            ],
        ]);
    } catch (Throwable $exception) {
        ultraction_news_handle_runtime_exception($exception, 'Unable to archive this news entry right now.');
    }
}

function ultraction_news_check_rate_limit(string $scope): void
{
    $ip = ultraction_client_ip();
    $result = ultraction_rate_limit_check(
        'news-' . $scope,
        $ip,
        $scope === 'write' ? ULTRACTION_NEWS_WRITE_RATE_LIMIT_WINDOW_SECONDS : ULTRACTION_NEWS_READ_RATE_LIMIT_WINDOW_SECONDS,
        $scope === 'write' ? ULTRACTION_NEWS_WRITE_RATE_LIMIT_MAX_REQUESTS : ULTRACTION_NEWS_READ_RATE_LIMIT_MAX_REQUESTS
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

function ultraction_news_ensure_write_auth(): void
{
    $expectedApiKey = ultraction_env_value('NEWS_API_KEY', null);
    if (!is_string($expectedApiKey) || trim($expectedApiKey) === '') {
        ultraction_json_response(503, [
            'ok' => false,
            'error' => [
                'code' => 'news_api_misconfigured',
                'message' => 'News API protected operations are not configured.',
            ],
        ]);
    }

    $receivedApiKey = ultraction_request_header('x-news-api-key') ?? ultraction_bearer_token();
    if ($receivedApiKey === null || trim($receivedApiKey) === '') {
        ultraction_json_response(401, [
            'ok' => false,
            'error' => [
                'code' => 'auth_required',
                'message' => 'Missing news API credentials.',
            ],
        ]);
    }

    if (!hash_equals(trim($expectedApiKey), trim($receivedApiKey))) {
        ultraction_json_response(403, [
            'ok' => false,
            'error' => [
                'code' => 'invalid_credentials',
                'message' => 'Invalid news API credentials.',
            ],
        ]);
    }
}

function ultraction_news_parse_json_body(bool $required): array
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

function ultraction_news_validate_write_body(array $body, string $method): array
{
    $errors = [];
    $title = ultraction_news_optional_string($body['title'] ?? null) ?? '';
    $excerpt = ultraction_news_optional_string($body['excerpt'] ?? null) ?? '';
    $content = ultraction_news_optional_string($body['content'] ?? null) ?? '';
    $category = ultraction_news_optional_string($body['category'] ?? null) ?? '';
    $author = ultraction_news_optional_string($body['author'] ?? null) ?? '';
    $image = ultraction_news_optional_string($body['image'] ?? null) ?? '';
    $sourceName = ultraction_news_optional_string($body['sourceName'] ?? null) ?? '';
    $sourceUrl = ultraction_news_optional_string($body['sourceUrl'] ?? null) ?? '';
    $sourcePublishedAt = ultraction_news_optional_string($body['sourcePublishedAt'] ?? null);
    $publishedAt = ultraction_news_optional_string($body['publishedAt'] ?? null);

    if ($method === 'POST' || array_key_exists('title', $body)) {
        if (!ultraction_string_length_between($title, 2, 180)) {
            $errors['title'] = 'Title must be between 2 and 180 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('excerpt', $body)) {
        if (!ultraction_string_length_between($excerpt, 10, 600)) {
            $errors['excerpt'] = 'Excerpt must be between 10 and 600 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('content', $body)) {
        if (!ultraction_string_length_between($content, 20, 50000)) {
            $errors['content'] = 'Content must be between 20 and 50000 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('category', $body)) {
        if (!ultraction_string_length_between($category, 2, 80)) {
            $errors['category'] = 'Category must be between 2 and 80 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('author', $body)) {
        if (!ultraction_string_length_between($author, 2, 120)) {
            $errors['author'] = 'Author must be between 2 and 120 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('image', $body)) {
        if (!ultraction_string_length_between($image, 3, 2048)) {
            $errors['image'] = 'Image must be between 3 and 2048 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('sourceName', $body)) {
        if (!ultraction_string_length_between($sourceName, 2, 120)) {
            $errors['sourceName'] = 'sourceName must be between 2 and 120 characters.';
        }
    }

    if ($method === 'POST' || array_key_exists('sourceUrl', $body)) {
        if (!ultraction_string_length_between($sourceUrl, 8, 2048)) {
            $errors['sourceUrl'] = 'sourceUrl must be between 8 and 2048 characters.';
        } elseif (!filter_var($sourceUrl, FILTER_VALIDATE_URL)) {
            $errors['sourceUrl'] = 'sourceUrl must be a valid absolute URL.';
        }
    }

    if ($sourcePublishedAt !== null) {
        try {
            new DateTimeImmutable($sourcePublishedAt);
        } catch (Throwable) {
            $errors['sourcePublishedAt'] = 'sourcePublishedAt must be a valid ISO date string.';
        }
    }

    if (array_key_exists('tags', $body)) {
        if (!is_array($body['tags'])) {
            $errors['tags'] = 'tags must be an array of strings.';
        } else {
            if (count($body['tags']) > 25) {
                $errors['tags'] = 'tags cannot contain more than 25 items.';
            } else {
                foreach ($body['tags'] as $tag) {
                    $normalizedTag = ultraction_news_optional_string($tag);
                    if ($normalizedTag === null || !ultraction_string_length_between($normalizedTag, 1, 40)) {
                        $errors['tags'] = 'Each tag must be between 1 and 40 characters.';
                        break;
                    }
                }
            }
        }
    }

    if (array_key_exists('status', $body)) {
        $status = ultraction_news_optional_string($body['status'] ?? null);
        if ($status === null || !in_array($status, ['draft', 'published', 'archived'], true)) {
            $errors['status'] = 'Status must be one of: draft, published, archived.';
        }
    }

    if ($publishedAt !== null) {
        try {
            new DateTimeImmutable($publishedAt);
        } catch (Throwable) {
            $errors['publishedAt'] = 'publishedAt must be a valid ISO date string.';
        }
    }

    return $errors;
}

function ultraction_news_handle_runtime_exception(Throwable $exception, string $fallbackMessage): void
{
    if ($exception instanceof UltractionNewsNotFoundException) {
        ultraction_json_response(404, [
            'ok' => false,
            'error' => [
                'code' => 'not_found',
                'message' => $exception->getMessage(),
            ],
        ]);
    }

    if ($exception instanceof UltractionNewsConflictException) {
        ultraction_json_response(409, [
            'ok' => false,
            'error' => [
                'code' => 'conflict',
                'message' => $exception->getMessage(),
            ],
        ]);
    }

    if ($exception instanceof RuntimeException && $exception->getMessage() === 'news_db_unavailable') {
        ultraction_json_response(503, [
            'ok' => false,
            'error' => [
                'code' => 'news_storage_misconfigured',
                'message' => 'News data storage is not configured.',
            ],
        ]);
    }

    error_log('[news.php] ' . $exception->getMessage());
    ultraction_json_response(500, [
        'ok' => false,
        'error' => [
            'code' => 'internal_error',
            'message' => $fallbackMessage,
        ],
    ]);
}

function ultraction_news_optional_string(mixed $value): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $trimmed = trim($value);
    return $trimmed === '' ? null : $trimmed;
}
