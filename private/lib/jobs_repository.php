<?php

declare(strict_types=1);

final class UltractionJobNotFoundException extends RuntimeException
{
}

final class UltractionJobConflictException extends RuntimeException
{
}

function ultraction_jobs_repository_list(string $status): array
{
    $pdo = ultraction_jobs_repository_connection();
    ultraction_jobs_repository_ensure_schema($pdo);

    if ($status === 'all') {
        $statement = $pdo->query('SELECT * FROM jobs ORDER BY posted_at DESC, created_at DESC');
    } else {
        $statement = $pdo->prepare('SELECT * FROM jobs WHERE status = :status ORDER BY posted_at DESC, created_at DESC');
        $statement->execute(['status' => $status]);
    }

    $rows = $statement->fetchAll();
    return array_map('ultraction_jobs_repository_map_row', is_array($rows) ? $rows : []);
}

function ultraction_jobs_repository_create(array $input): array
{
    $pdo = ultraction_jobs_repository_connection();
    ultraction_jobs_repository_ensure_schema($pdo);

    $now = gmdate('Y-m-d H:i:s');
    $title = ultraction_jobs_repository_normalize_text($input['title'] ?? null) ?? 'Untitled Role';
    $job = [
        'id' => ultraction_jobs_repository_uuid(),
        'slug' => ultraction_jobs_repository_generate_slug($pdo, $title),
        'title' => $title,
        'location' => ultraction_jobs_repository_normalize_text($input['location'] ?? null) ?? 'UAE',
        'description' => ultraction_jobs_repository_normalize_text($input['description'] ?? null) ?? '',
        'department' => ultraction_jobs_repository_normalize_text($input['department'] ?? null),
        'employmentType' => ultraction_jobs_repository_normalize_text($input['employmentType'] ?? null),
        'status' => 'open',
        'createdAt' => ultraction_jobs_repository_iso_from_db($now),
        'updatedAt' => ultraction_jobs_repository_iso_from_db($now),
        'postedAt' => ultraction_jobs_repository_iso_from_db(
            ultraction_jobs_repository_db_timestamp($input['postedAt'] ?? null, $now)
        ),
        'closedAt' => null,
    ];

    $statement = $pdo->prepare(
        'INSERT INTO jobs (id, slug, title, location, description, department, employment_type, status, posted_at, closed_at, created_at, updated_at)
         VALUES (:id, :slug, :title, :location, :description, :department, :employment_type, :status, :posted_at, :closed_at, :created_at, :updated_at)'
    );
    $statement->execute(ultraction_jobs_repository_row_from_record($job));

    return $job;
}

function ultraction_jobs_repository_update(string $jobId, array $input): array
{
    $pdo = ultraction_jobs_repository_connection();
    ultraction_jobs_repository_ensure_schema($pdo);

    $existing = ultraction_jobs_repository_find($pdo, $jobId);
    $updatedStatus = isset($input['status']) ? (string) $input['status'] : $existing['status'];

    if ($existing['status'] === 'closed' && $updatedStatus === 'closed') {
        throw new UltractionJobConflictException('Job is already archived.');
    }

    $title = ultraction_jobs_repository_normalize_text($input['title'] ?? null) ?? $existing['title'];
    $now = gmdate('Y-m-d H:i:s');
    $updated = [
        'id' => $existing['id'],
        'slug' => $title !== $existing['title']
            ? ultraction_jobs_repository_generate_slug($pdo, $title, $existing['id'])
            : $existing['slug'],
        'title' => $title,
        'location' => ultraction_jobs_repository_normalize_text($input['location'] ?? null) ?? $existing['location'],
        'description' => ultraction_jobs_repository_normalize_text($input['description'] ?? null) ?? $existing['description'],
        'department' => array_key_exists('department', $input)
            ? ultraction_jobs_repository_normalize_text($input['department'])
            : $existing['department'],
        'employmentType' => array_key_exists('employmentType', $input)
            ? ultraction_jobs_repository_normalize_text($input['employmentType'])
            : $existing['employmentType'],
        'status' => $updatedStatus,
        'createdAt' => $existing['createdAt'],
        'updatedAt' => ultraction_jobs_repository_iso_from_db($now),
        'postedAt' => ultraction_jobs_repository_iso_from_db(
            ultraction_jobs_repository_db_timestamp($input['postedAt'] ?? null, $existing['postedAt'])
        ),
        'closedAt' => $updatedStatus === 'closed' ? ultraction_jobs_repository_iso_from_db($now) : null,
    ];

    $statement = $pdo->prepare(
        'UPDATE jobs
         SET slug = :slug,
             title = :title,
             location = :location,
             description = :description,
             department = :department,
             employment_type = :employment_type,
             status = :status,
             posted_at = :posted_at,
             closed_at = :closed_at,
             updated_at = :updated_at
         WHERE id = :id'
    );
    $statement->execute(ultraction_jobs_repository_row_from_record($updated));

    return $updated;
}

function ultraction_jobs_repository_archive(string $jobId, string $confirmTitle): array
{
    $pdo = ultraction_jobs_repository_connection();
    ultraction_jobs_repository_ensure_schema($pdo);

    $existing = ultraction_jobs_repository_find($pdo, $jobId, true);
    if ($existing['status'] === 'closed') {
        throw new UltractionJobConflictException('Job is already archived.');
    }

    $normalizedConfirmTitle = ultraction_jobs_repository_normalize_text($confirmTitle);
    if ($normalizedConfirmTitle === null || $normalizedConfirmTitle !== $existing['title']) {
        throw new UltractionJobConflictException('confirmTitle must exactly match the current job title.');
    }

    $now = gmdate('Y-m-d H:i:s');
    $archived = $existing;
    $archived['status'] = 'closed';
    $archived['updatedAt'] = ultraction_jobs_repository_iso_from_db($now);
    $archived['closedAt'] = ultraction_jobs_repository_iso_from_db($now);

    $statement = $pdo->prepare(
        'UPDATE jobs
         SET status = :status,
             closed_at = :closed_at,
             updated_at = :updated_at
         WHERE id = :id'
    );
    $statement->execute([
        'status' => $archived['status'],
        'closed_at' => ultraction_jobs_repository_db_timestamp($archived['closedAt'], $now),
        'updated_at' => ultraction_jobs_repository_db_timestamp($archived['updatedAt'], $now),
        'id' => $archived['id'],
    ]);

    return $archived;
}

function ultraction_jobs_repository_connection(): PDO
{
    $pdo = ultraction_db_connection();
    if (!$pdo instanceof PDO) {
        throw new RuntimeException('jobs_db_unavailable');
    }

    return $pdo;
}

function ultraction_jobs_repository_ensure_schema(PDO $pdo): void
{
    static $schemaEnsured = false;

    if ($schemaEnsured) {
        return;
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS jobs (
            id CHAR(36) NOT NULL PRIMARY KEY,
            slug VARCHAR(191) NOT NULL,
            title VARCHAR(120) NOT NULL,
            location VARCHAR(120) NOT NULL,
            description MEDIUMTEXT NOT NULL,
            department VARCHAR(120) DEFAULT NULL,
            employment_type VARCHAR(80) DEFAULT NULL,
            status VARCHAR(20) NOT NULL,
            posted_at DATETIME NOT NULL,
            closed_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            UNIQUE KEY uniq_jobs_slug (slug),
            KEY idx_jobs_status_posted_at (status, posted_at),
            KEY idx_jobs_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $schemaEnsured = true;
}

function ultraction_jobs_repository_find(PDO $pdo, string $jobId, bool $forUpdate = false): array
{
    $sql = 'SELECT * FROM jobs WHERE id = :id';
    if ($forUpdate) {
        $sql .= ' FOR UPDATE';
    }

    $statement = $pdo->prepare($sql);
    $statement->execute(['id' => $jobId]);
    $row = $statement->fetch();

    if (!is_array($row)) {
        throw new UltractionJobNotFoundException('Job not found: ' . $jobId);
    }

    return ultraction_jobs_repository_map_row($row);
}

function ultraction_jobs_repository_map_row(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'location' => (string) $row['location'],
        'description' => (string) $row['description'],
        'department' => $row['department'] !== null ? (string) $row['department'] : null,
        'employmentType' => $row['employment_type'] !== null ? (string) $row['employment_type'] : null,
        'status' => (string) $row['status'],
        'createdAt' => ultraction_jobs_repository_iso_from_db((string) $row['created_at']),
        'updatedAt' => ultraction_jobs_repository_iso_from_db((string) $row['updated_at']),
        'postedAt' => ultraction_jobs_repository_iso_from_db((string) $row['posted_at']),
        'closedAt' => $row['closed_at'] !== null ? ultraction_jobs_repository_iso_from_db((string) $row['closed_at']) : null,
    ];
}

function ultraction_jobs_repository_row_from_record(array $record): array
{
    return [
        'id' => $record['id'],
        'slug' => $record['slug'],
        'title' => $record['title'],
        'location' => $record['location'],
        'description' => $record['description'],
        'department' => $record['department'],
        'employment_type' => $record['employmentType'],
        'status' => $record['status'],
        'posted_at' => ultraction_jobs_repository_db_timestamp($record['postedAt'], gmdate('Y-m-d H:i:s')),
        'closed_at' => $record['closedAt'] !== null
            ? ultraction_jobs_repository_db_timestamp($record['closedAt'], gmdate('Y-m-d H:i:s'))
            : null,
        'created_at' => ultraction_jobs_repository_db_timestamp($record['createdAt'], gmdate('Y-m-d H:i:s')),
        'updated_at' => ultraction_jobs_repository_db_timestamp($record['updatedAt'], gmdate('Y-m-d H:i:s')),
    ];
}

function ultraction_jobs_repository_generate_slug(PDO $pdo, string $title, ?string $ignoreId = null): string
{
    $base = ultraction_jobs_repository_slugify($title);
    $candidate = $base !== '' ? $base : 'role';
    $suffix = 2;

    while (true) {
        $statement = $pdo->prepare('SELECT id FROM jobs WHERE slug = :slug LIMIT 1');
        $statement->execute(['slug' => $candidate]);
        $row = $statement->fetch();

        if (!is_array($row) || ($ignoreId !== null && (string) $row['id'] === $ignoreId)) {
            return $candidate;
        }

        $candidate = ($base !== '' ? $base : 'role') . '-' . $suffix;
        $suffix++;
    }
}

function ultraction_jobs_repository_slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9\s-]/', '', $value) ?? '';
    $value = preg_replace('/\s+/', '-', $value) ?? '';
    $value = preg_replace('/-+/', '-', $value) ?? '';
    return trim($value, '-');
}

function ultraction_jobs_repository_db_timestamp(mixed $value, string $fallback): string
{
    try {
        $date = $value instanceof DateTimeInterface
            ? DateTimeImmutable::createFromInterface($value)
            : new DateTimeImmutable((string) $value, new DateTimeZone('UTC'));
    } catch (Throwable) {
        $date = new DateTimeImmutable($fallback, new DateTimeZone('UTC'));
    }

    return $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

function ultraction_jobs_repository_iso_from_db(string $value): string
{
    $date = new DateTimeImmutable($value, new DateTimeZone('UTC'));
    return $date->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM);
}

function ultraction_jobs_repository_normalize_text(mixed $value): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $normalized = preg_replace('/\s+/', ' ', trim($value));
    if (!is_string($normalized) || $normalized === '') {
        return null;
    }

    return $normalized;
}

function ultraction_jobs_repository_uuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);

    return sprintf(
        '%s-%s-%s-%s-%s',
        substr($hex, 0, 8),
        substr($hex, 8, 4),
        substr($hex, 12, 4),
        substr($hex, 16, 4),
        substr($hex, 20, 12)
    );
}
