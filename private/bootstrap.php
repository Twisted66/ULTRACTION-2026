<?php

declare(strict_types=1);

if (defined('ULTRACTION_BOOTSTRAPPED')) {
    return;
}

define('ULTRACTION_BOOTSTRAPPED', true);
define('ULTRACTION_ROOT', dirname(__DIR__));
define('ULTRACTION_PRIVATE_ROOT', __DIR__);
define('ULTRACTION_PUBLIC_ROOT', ULTRACTION_ROOT . DIRECTORY_SEPARATOR . 'public_html');

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
