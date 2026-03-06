<?php

declare(strict_types=1);

if (!function_exists('ultraction_env_value')) {
    function ultraction_env_value(string $key, mixed $default = null): mixed
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if ($value === false || $value === null) {
            return $default;
        }

        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed === '' ? $default : $trimmed;
        }

        return $value;
    }
}

if (!function_exists('ultraction_env_bool')) {
    function ultraction_env_bool(string $key, bool $default = false): bool
    {
        $value = ultraction_env_value($key, null);
        if ($value === null) {
            return $default;
        }

        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower((string) $value);
        if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }

        if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
            return false;
        }

        return $default;
    }
}

if (!function_exists('ultraction_env_int')) {
    function ultraction_env_int(string $key, int $default): int
    {
        $value = ultraction_env_value($key, null);
        if ($value === null) {
            return $default;
        }

        $filtered = filter_var($value, FILTER_VALIDATE_INT);
        return $filtered === false ? $default : (int) $filtered;
    }
}

$ultractionRoot = dirname(__DIR__);
$ultractionPrivateRoot = __DIR__;
$ultractionPublicRoot = $ultractionRoot . DIRECTORY_SEPARATOR . 'public_html';

return [
    'app' => [
        'name' => (string) ultraction_env_value('APP_NAME', 'ULTRACTION'),
        'env' => (string) ultraction_env_value('APP_ENV', 'production'),
        'timezone' => (string) ultraction_env_value('APP_TIMEZONE', 'UTC'),
    ],
    'paths' => [
        'root' => $ultractionRoot,
        'private_root' => $ultractionPrivateRoot,
        'public_root' => $ultractionPublicRoot,
        'contact_upload_dir' => (string) ultraction_env_value(
            'CONTACT_UPLOAD_DIR',
            $ultractionPrivateRoot . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'contact-attachments'
        ),
        'rate_limit_dir' => (string) ultraction_env_value(
            'RATE_LIMIT_STORAGE_DIR',
            $ultractionPrivateRoot . DIRECTORY_SEPARATOR . 'var' . DIRECTORY_SEPARATOR . 'rate_limits'
        ),
        'mail_log' => (string) ultraction_env_value(
            'CONTACT_MAIL_LOG_PATH',
            $ultractionPrivateRoot . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'contact-mail.log'
        ),
    ],
    'db' => [
        'dsn' => ultraction_env_value('DB_DSN', ultraction_env_value('DATABASE_URL', null)),
        'host' => (string) ultraction_env_value('DB_HOST', 'localhost'),
        'port' => ultraction_env_int('DB_PORT', 3306),
        'name' => (string) ultraction_env_value('DB_NAME', ''),
        'user' => (string) ultraction_env_value('DB_USER', ''),
        'password' => (string) ultraction_env_value('DB_PASSWORD', ''),
        'charset' => (string) ultraction_env_value('DB_CHARSET', 'utf8mb4'),
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    ],
    'contact' => [
        'receiver_email' => (string) ultraction_env_value('CONTACT_RECEIVER_EMAIL', 'info@ultraction.ae'),
        'from_email' => (string) ultraction_env_value('CONTACT_FROM_EMAIL', 'info@ultraction.ae'),
        'from_name' => (string) ultraction_env_value('CONTACT_FROM_NAME', 'ULTRACTION Website'),
        'subject_prefix' => (string) ultraction_env_value('CONTACT_SUBJECT_PREFIX', '[ULTRACTION Contact]'),
        'mail_transport' => (string) ultraction_env_value('CONTACT_MAIL_TRANSPORT', 'mail'),
        'log_submissions_to_db' => ultraction_env_bool('CONTACT_STORE_SUBMISSIONS', false),
        'rate_limit_window_seconds' => ultraction_env_int('CONTACT_RATE_LIMIT_WINDOW_SECONDS', 60),
        'rate_limit_max_requests' => ultraction_env_int('CONTACT_RATE_LIMIT_MAX_REQUESTS', 5),
        'max_attachment_bytes' => ultraction_env_int('CONTACT_MAX_ATTACHMENT_BYTES', 10 * 1024 * 1024),
        'allowed_subjects' => [
            'project' => 'New Project Inquiry',
            'careers' => 'Careers',
            'other' => 'Other',
        ],
        'allowed_extensions' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
        'allowed_mime_types' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/zip',
            'application/x-zip-compressed',
            'application/x-rar-compressed',
            'application/vnd.rar',
            'application/octet-stream',
        ],
    ],
];
