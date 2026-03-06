<?php

declare(strict_types=1);

function ultraction_trimmed_string(mixed $value): string
{
    return is_string($value) ? trim($value) : '';
}

function ultraction_valid_email(string $value): bool
{
    return $value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
}

function ultraction_string_length_between(string $value, int $min, int $max): bool
{
    $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    return $length >= $min && $length <= $max;
}

function ultraction_allowed_value(string $value, array $allowed): bool
{
    return array_key_exists($value, $allowed) || in_array($value, $allowed, true);
}

function ultraction_upload_present(?array $file): bool
{
    return is_array($file)
        && isset($file['error'])
        && (int) $file['error'] !== UPLOAD_ERR_NO_FILE;
}

function ultraction_sanitize_filename(string $filename): string
{
    $filename = preg_replace('/[^A-Za-z0-9._-]+/', '-', $filename) ?? 'attachment';
    $filename = trim($filename, '.-');
    return $filename !== '' ? $filename : 'attachment';
}

function ultraction_detect_mime_type(string $path, ?string $fallback = null): ?string
{
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo !== false) {
            $mimeType = finfo_file($finfo, $path);
            finfo_close($finfo);
            if (is_string($mimeType) && $mimeType !== '') {
                return $mimeType;
            }
        }
    }

    return $fallback !== null && $fallback !== '' ? $fallback : null;
}

function ultraction_validate_uploaded_file(?array $file, array $allowedExtensions, array $allowedMimeTypes, int $maxBytes): ?string
{
    if (!ultraction_upload_present($file)) {
        return null;
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        return 'Attachment upload failed. Please try again.';
    }

    $size = isset($file['size']) ? (int) $file['size'] : 0;
    if ($size > $maxBytes) {
        return 'File size must be less than 10MB.';
    }

    $originalName = strtolower((string) ($file['name'] ?? ''));
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    if ($extension === '' || !in_array($extension, $allowedExtensions, true)) {
        return 'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG, ZIP, RAR.';
    }

    $mimeType = ultraction_detect_mime_type((string) ($file['tmp_name'] ?? ''), (string) ($file['type'] ?? ''));
    if ($mimeType !== null && !in_array($mimeType, $allowedMimeTypes, true)) {
        return 'Invalid file type.';
    }

    return null;
}

function ultraction_store_uploaded_file(array $file, string $destinationDir): array
{
    if (!is_dir($destinationDir) && !mkdir($destinationDir, 0775, true) && !is_dir($destinationDir)) {
        throw new RuntimeException('Unable to prepare upload directory.');
    }

    $safeOriginalName = ultraction_sanitize_filename((string) ($file['name'] ?? 'attachment'));
    $extension = strtolower(pathinfo($safeOriginalName, PATHINFO_EXTENSION));
    $baseName = pathinfo($safeOriginalName, PATHINFO_FILENAME);
    $storedName = sprintf(
        '%s-%s%s',
        $baseName !== '' ? $baseName : 'attachment',
        bin2hex(random_bytes(8)),
        $extension !== '' ? '.' . $extension : ''
    );

    $destinationPath = rtrim($destinationDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $storedName;
    $tmpName = (string) ($file['tmp_name'] ?? '');

    $moved = is_uploaded_file($tmpName)
        ? move_uploaded_file($tmpName, $destinationPath)
        : rename($tmpName, $destinationPath);

    if (!$moved) {
        throw new RuntimeException('Unable to store uploaded attachment.');
    }

    return [
        'original_name' => $safeOriginalName,
        'stored_name' => $storedName,
        'path' => $destinationPath,
        'mime_type' => ultraction_detect_mime_type($destinationPath, (string) ($file['type'] ?? 'application/octet-stream')),
        'size' => isset($file['size']) ? (int) $file['size'] : filesize($destinationPath),
    ];
}
