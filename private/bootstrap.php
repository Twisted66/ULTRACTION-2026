<?php

declare(strict_types=1);

if (defined('ULTRACTION_BOOTSTRAPPED')) {
    return;
}

define('ULTRACTION_BOOTSTRAPPED', true);
define('ULTRACTION_ROOT', dirname(__DIR__));
define('ULTRACTION_PRIVATE_ROOT', __DIR__);
define('ULTRACTION_PUBLIC_ROOT', ULTRACTION_ROOT . DIRECTORY_SEPARATOR . 'public_html');

/** @return array<string, string> */
function ultraction_parse_dotenv(string $path): array
{
    $values = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim($value);
        if ($value === '') {
            $values[$key] = '';
            continue;
        }

        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        $values[$key] = str_replace('\\n', "\n", $value);
    }

    return $values;
}

function ultraction_load_dotenv(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    foreach (ultraction_parse_dotenv($path) as $key => $value) {
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
        putenv("$key=$value");
    }
}

$dotenvPath = ULTRACTION_ROOT . DIRECTORY_SEPARATOR . '.env';
if (file_exists($dotenvPath)) {
    ultraction_load_dotenv($dotenvPath);
}

$ultractionConfig = require ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'config.php';

function ultraction_config(?string $path = null, mixed $default = null): mixed
{
    global $ultractionConfig;

    if ($path === null || $path === '') {
        return $ultractionConfig;
    }

    $segments = explode('.', $path);
    $value = $ultractionConfig;

    foreach ($segments as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $default;
        }

        $value = $value[$segment];
    }

    return $value;
}

$timezone = (string) ultraction_config('app.timezone', 'UTC');
if ($timezone !== '') {
    date_default_timezone_set($timezone);
}

require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'db.php';
require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'auth.php';
require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'validation.php';
require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'response.php';
require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'rate_limit.php';
require_once ULTRACTION_PRIVATE_ROOT . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'mail.php';
