<?php

declare(strict_types=1);

function ultraction_request_headers(): array
{
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (is_array($headers)) {
            return $headers;
        }
    }

    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (!is_string($value) || !str_starts_with($key, 'HTTP_')) {
            continue;
        }

        $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
        $headers[$name] = $value;
    }

    return $headers;
}

function ultraction_request_header(string $name): ?string
{
    $target = strtolower($name);

    foreach (ultraction_request_headers() as $headerName => $headerValue) {
        if (strtolower($headerName) === $target && is_string($headerValue)) {
            return trim($headerValue);
        }
    }

    return null;
}

function ultraction_bearer_token(): ?string
{
    $authorization = ultraction_request_header('Authorization');
    if ($authorization === null) {
        return null;
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
        return null;
    }

    return trim($matches[1]);
}

function ultraction_request_api_key(array $headerNames = []): ?string
{
    $candidates = array_values(array_unique(array_merge(
        $headerNames,
        ['x-jobs-api-key', 'x-news-api-key']
    )));

    foreach ($candidates as $headerName) {
        $value = ultraction_request_header($headerName);
        if ($value !== null && $value !== '') {
            return $value;
        }
    }

    return ultraction_bearer_token();
}

function ultraction_expected_api_key(string $primaryEnvKey): ?string
{
    foreach ([$primaryEnvKey, 'ULTRACTION_API_KEY'] as $envKey) {
        $value = ultraction_env_value($envKey, null);
        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }
    }

    return null;
}

function ultraction_safe_equals(?string $received, ?string $expected): bool
{
    if ($received === null || $expected === null) {
        return false;
    }

    return hash_equals($expected, $received);
}

function ultraction_client_ip(): string
{
    $forwardedFor = ultraction_request_header('X-Forwarded-For');
    if ($forwardedFor !== null && $forwardedFor !== '') {
        $parts = explode(',', $forwardedFor);
        $candidate = trim($parts[0] ?? '');
        if ($candidate !== '') {
            return $candidate;
        }
    }

    $realIp = ultraction_request_header('X-Real-IP');
    if ($realIp !== null && $realIp !== '') {
        return $realIp;
    }

    $remoteAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return is_string($remoteAddress) && trim($remoteAddress) !== '' ? trim($remoteAddress) : 'unknown';
}

function ultraction_authenticate_api_key(string $expectedEnvKey, string $customHeaderName): array
{
    $expected = ultraction_env_value($expectedEnvKey, null);
    if (!is_string($expected) || $expected === '') {
        return [
            'ok' => false,
            'status' => 503,
            'code' => 'api_misconfigured',
            'message' => 'API credentials are not configured.',
        ];
    }

    $candidate = ultraction_request_header($customHeaderName) ?? ultraction_bearer_token();
    if ($candidate === null || $candidate === '') {
        return [
            'ok' => false,
            'status' => 401,
            'code' => 'auth_required',
            'message' => 'Missing API credentials.',
        ];
    }

    if (!ultraction_safe_equals($candidate, $expected)) {
        return [
            'ok' => false,
            'status' => 403,
            'code' => 'invalid_credentials',
            'message' => 'Invalid API credentials.',
        ];
    }

    return ['ok' => true];
}
