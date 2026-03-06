<?php

declare(strict_types=1);

function ultraction_json_response(int $status, array $payload, array $headers = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');

    foreach ($headers as $name => $value) {
        header($name . ': ' . $value);
    }

    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function ultraction_method_not_allowed(array $allowedMethods): never
{
    ultraction_json_response(405, [
        'ok' => false,
        'message' => 'Method not allowed.',
    ], [
        'Allow' => implode(', ', $allowedMethods),
    ]);
}
