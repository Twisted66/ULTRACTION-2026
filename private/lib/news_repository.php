<?php

declare(strict_types=1);

final class UltractionNewsNotFoundException extends RuntimeException
{
}

final class UltractionNewsConflictException extends RuntimeException
{
}

function ultraction_news_repository_list(string $status): array
{
    $pdo = ultraction_news_repository_connection();
    ultraction_news_repository_ensure_schema($pdo);

    if ($status === 'all') {
        $statement = $pdo->query(
            'SELECT * FROM news ORDER BY COALESCE(published_at, source_published_at, created_at) DESC, created_at DESC'
        );
    } else {
        $statement = $pdo->prepare(
            'SELECT * FROM news WHERE status = :status ORDER BY COALESCE(published_at, source_published_at, created_at) DESC, created_at DESC'
        );
        $statement->execute(['status' => $status]);
    }

    $rows = $statement->fetchAll();
    if (!is_array($rows) || $rows === []) {
        return [];
    }

    $tagsMap = ultraction_news_repository_fetch_tags_map($pdo, array_map(
        static fn(array $row): string => (string) $row['id'],
        $rows
    ));

    return array_map(
        static fn(array $row): array => ultraction_news_repository_map_row($row, $tagsMap[(string) $row['id']] ?? []),
        $rows
    );
}

function ultraction_news_repository_create(array $input): array
{
    $pdo = ultraction_news_repository_connection();
    ultraction_news_repository_ensure_schema($pdo);

    $now = gmdate('Y-m-d H:i:s');
    $title = ultraction_news_repository_normalize_text($input['title'] ?? null) ?? 'Untitled News';
    $sourceUrl = ultraction_news_repository_normalize_text($input['sourceUrl'] ?? null) ?? '';
    $record = [
        'id' => ultraction_news_repository_uuid(),
        'slug' => ultraction_news_repository_generate_slug($pdo, $title),
        'title' => $title,
        'excerpt' => ultraction_news_repository_normalize_text($input['excerpt'] ?? null) ?? '',
        'content' => ultraction_news_repository_normalize_text($input['content'] ?? null) ?? '',
        'category' => ultraction_news_repository_normalize_text($input['category'] ?? null) ?? 'general',
        'author' => ultraction_news_repository_normalize_text($input['author'] ?? null) ?? 'Unknown',
        'image' => ultraction_news_repository_normalize_text($input['image'] ?? null) ?? '',
        'sourceName' => ultraction_news_repository_normalize_text($input['sourceName'] ?? null) ?? 'Unknown',
        'sourceUrl' => $sourceUrl,
        'sourcePublishedAt' => ultraction_news_repository_iso_from_db(
            ultraction_news_repository_db_timestamp($input['sourcePublishedAt'] ?? null, $now)
        ),
        'status' => 'draft',
        'publishedAt' => null,
        'archivedAt' => null,
        'createdAt' => ultraction_news_repository_iso_from_db($now),
        'updatedAt' => ultraction_news_repository_iso_from_db($now),
        'tags' => ultraction_news_repository_normalize_tags($input['tags'] ?? []),
    ];

    ultraction_news_repository_assert_unique_source_url($pdo, $sourceUrl);

    $pdo->beginTransaction();
    try {
        $statement = $pdo->prepare(
            'INSERT INTO news (id, slug, title, excerpt, content, category, author, image, source_name, source_url, source_url_hash, source_published_at, status, published_at, archived_at, created_at, updated_at)
             VALUES (:id, :slug, :title, :excerpt, :content, :category, :author, :image, :source_name, :source_url, :source_url_hash, :source_published_at, :status, :published_at, :archived_at, :created_at, :updated_at)'
        );
        $statement->execute(ultraction_news_repository_row_from_record($record));
        ultraction_news_repository_replace_tags($pdo, $record['id'], $record['tags']);
        $pdo->commit();
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }

    return $record;
}

function ultraction_news_repository_update(string $newsId, array $input): array
{
    $pdo = ultraction_news_repository_connection();
    ultraction_news_repository_ensure_schema($pdo);

    $existing = ultraction_news_repository_find($pdo, $newsId, true);
    $status = isset($input['status']) ? (string) $input['status'] : $existing['status'];
    $title = ultraction_news_repository_normalize_text($input['title'] ?? null) ?? $existing['title'];
    $sourceUrl = ultraction_news_repository_normalize_text($input['sourceUrl'] ?? null) ?? $existing['sourceUrl'];
    $now = gmdate('Y-m-d H:i:s');

    ultraction_news_repository_assert_unique_source_url($pdo, $sourceUrl, $existing['id']);

    $publishedAt = array_key_exists('publishedAt', $input)
        ? ultraction_news_repository_iso_from_db(
            ultraction_news_repository_db_timestamp($input['publishedAt'], $existing['publishedAt'] ?? $now)
        )
        : ($status === 'published' ? ($existing['publishedAt'] ?? ultraction_news_repository_iso_from_db($now)) : $existing['publishedAt']);

    $archivedAt = $status === 'archived'
        ? ($existing['status'] === 'archived' ? ($existing['archivedAt'] ?? ultraction_news_repository_iso_from_db($now)) : ultraction_news_repository_iso_from_db($now))
        : null;

    $updated = [
        'id' => $existing['id'],
        'slug' => $title !== $existing['title']
            ? ultraction_news_repository_generate_slug($pdo, $title, $existing['id'])
            : $existing['slug'],
        'title' => $title,
        'excerpt' => ultraction_news_repository_normalize_text($input['excerpt'] ?? null) ?? $existing['excerpt'],
        'content' => ultraction_news_repository_normalize_text($input['content'] ?? null) ?? $existing['content'],
        'category' => ultraction_news_repository_normalize_text($input['category'] ?? null) ?? $existing['category'],
        'author' => ultraction_news_repository_normalize_text($input['author'] ?? null) ?? $existing['author'],
        'image' => ultraction_news_repository_normalize_text($input['image'] ?? null) ?? $existing['image'],
        'sourceName' => ultraction_news_repository_normalize_text($input['sourceName'] ?? null) ?? $existing['sourceName'],
        'sourceUrl' => $sourceUrl,
        'sourcePublishedAt' => ultraction_news_repository_iso_from_db(
            ultraction_news_repository_db_timestamp($input['sourcePublishedAt'] ?? null, $existing['sourcePublishedAt'])
        ),
        'status' => $status,
        'publishedAt' => $publishedAt,
        'archivedAt' => $archivedAt,
        'createdAt' => $existing['createdAt'],
        'updatedAt' => ultraction_news_repository_iso_from_db($now),
        'tags' => array_key_exists('tags', $input)
            ? ultraction_news_repository_normalize_tags($input['tags'])
            : $existing['tags'],
    ];

    $pdo->beginTransaction();
    try {
        $statement = $pdo->prepare(
            'UPDATE news
             SET slug = :slug,
                 title = :title,
                 excerpt = :excerpt,
                 content = :content,
                 category = :category,
                 author = :author,
                 image = :image,
                 source_name = :source_name,
                 source_url = :source_url,
                 source_url_hash = :source_url_hash,
                 source_published_at = :source_published_at,
                 status = :status,
                 published_at = :published_at,
                 archived_at = :archived_at,
                 updated_at = :updated_at
             WHERE id = :id'
        );
        $statement->execute(ultraction_news_repository_row_from_record($updated));
        ultraction_news_repository_replace_tags($pdo, $updated['id'], $updated['tags']);
        $pdo->commit();
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }

    return $updated;
}

function ultraction_news_repository_archive(string $newsId, string $confirmTitle): array
{
    $pdo = ultraction_news_repository_connection();
    ultraction_news_repository_ensure_schema($pdo);

    $existing = ultraction_news_repository_find($pdo, $newsId, true);
    if ($existing['status'] === 'archived') {
        throw new UltractionNewsConflictException('News item is already archived.');
    }

    $normalizedConfirmTitle = ultraction_news_repository_normalize_text($confirmTitle);
    if ($normalizedConfirmTitle === null || $normalizedConfirmTitle !== $existing['title']) {
        throw new UltractionNewsConflictException('confirmTitle must exactly match the current news title.');
    }

    $now = gmdate('Y-m-d H:i:s');
    $archived = $existing;
    $archived['status'] = 'archived';
    $archived['updatedAt'] = ultraction_news_repository_iso_from_db($now);
    $archived['archivedAt'] = ultraction_news_repository_iso_from_db($now);

    $statement = $pdo->prepare(
        'UPDATE news
         SET status = :status,
             archived_at = :archived_at,
             updated_at = :updated_at
         WHERE id = :id'
    );
    $statement->execute([
        'status' => $archived['status'],
        'archived_at' => ultraction_news_repository_db_timestamp($archived['archivedAt'], $now),
        'updated_at' => ultraction_news_repository_db_timestamp($archived['updatedAt'], $now),
        'id' => $archived['id'],
    ]);

    return $archived;
}

function ultraction_news_repository_connection(): PDO
{
    $pdo = ultraction_db_connection();
    if (!$pdo instanceof PDO) {
        throw new RuntimeException('news_db_unavailable');
    }

    return $pdo;
}

function ultraction_news_repository_ensure_schema(PDO $pdo): void
{
    static $schemaEnsured = false;

    if ($schemaEnsured) {
        return;
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS news (
            id CHAR(36) NOT NULL PRIMARY KEY,
            slug VARCHAR(191) NOT NULL,
            title VARCHAR(180) NOT NULL,
            excerpt VARCHAR(600) NOT NULL,
            content MEDIUMTEXT NOT NULL,
            category VARCHAR(80) NOT NULL,
            author VARCHAR(120) NOT NULL,
            image VARCHAR(2048) NOT NULL,
            source_name VARCHAR(120) NOT NULL,
            source_url VARCHAR(2048) NOT NULL,
            source_url_hash CHAR(64) NOT NULL,
            source_published_at DATETIME NOT NULL,
            status VARCHAR(20) NOT NULL,
            published_at DATETIME DEFAULT NULL,
            archived_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            UNIQUE KEY uniq_news_slug (slug),
            UNIQUE KEY uniq_news_source_url_hash (source_url_hash),
            KEY idx_news_status_published_at (status, published_at),
            KEY idx_news_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS news_tags (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            news_id CHAR(36) NOT NULL,
            tag VARCHAR(40) NOT NULL,
            UNIQUE KEY uniq_news_tag (news_id, tag),
            KEY idx_news_tags_news_id (news_id),
            CONSTRAINT fk_news_tags_news FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $schemaEnsured = true;
}

function ultraction_news_repository_find(PDO $pdo, string $newsId, bool $forUpdate = false): array
{
    $sql = 'SELECT * FROM news WHERE id = :id';
    if ($forUpdate) {
        $sql .= ' FOR UPDATE';
    }

    $statement = $pdo->prepare($sql);
    $statement->execute(['id' => $newsId]);
    $row = $statement->fetch();

    if (!is_array($row)) {
        throw new UltractionNewsNotFoundException('News not found: ' . $newsId);
    }

    $tagsMap = ultraction_news_repository_fetch_tags_map($pdo, [$newsId]);
    return ultraction_news_repository_map_row($row, $tagsMap[$newsId] ?? []);
}

function ultraction_news_repository_map_row(array $row, array $tags): array
{
    return [
        'id' => (string) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'excerpt' => (string) $row['excerpt'],
        'content' => (string) $row['content'],
        'category' => (string) $row['category'],
        'tags' => array_values($tags),
        'author' => (string) $row['author'],
        'image' => (string) $row['image'],
        'sourceName' => (string) $row['source_name'],
        'sourceUrl' => (string) $row['source_url'],
        'sourcePublishedAt' => ultraction_news_repository_iso_from_db((string) $row['source_published_at']),
        'status' => (string) $row['status'],
        'createdAt' => ultraction_news_repository_iso_from_db((string) $row['created_at']),
        'updatedAt' => ultraction_news_repository_iso_from_db((string) $row['updated_at']),
        'publishedAt' => $row['published_at'] !== null ? ultraction_news_repository_iso_from_db((string) $row['published_at']) : null,
        'archivedAt' => $row['archived_at'] !== null ? ultraction_news_repository_iso_from_db((string) $row['archived_at']) : null,
    ];
}

function ultraction_news_repository_row_from_record(array $record): array
{
    return [
        'id' => $record['id'],
        'slug' => $record['slug'],
        'title' => $record['title'],
        'excerpt' => $record['excerpt'],
        'content' => $record['content'],
        'category' => $record['category'],
        'author' => $record['author'],
        'image' => $record['image'],
        'source_name' => $record['sourceName'],
        'source_url' => $record['sourceUrl'],
        'source_url_hash' => hash('sha256', strtolower($record['sourceUrl'])),
        'source_published_at' => ultraction_news_repository_db_timestamp($record['sourcePublishedAt'], gmdate('Y-m-d H:i:s')),
        'status' => $record['status'],
        'published_at' => $record['publishedAt'] !== null
            ? ultraction_news_repository_db_timestamp($record['publishedAt'], gmdate('Y-m-d H:i:s'))
            : null,
        'archived_at' => $record['archivedAt'] !== null
            ? ultraction_news_repository_db_timestamp($record['archivedAt'], gmdate('Y-m-d H:i:s'))
            : null,
        'created_at' => ultraction_news_repository_db_timestamp($record['createdAt'], gmdate('Y-m-d H:i:s')),
        'updated_at' => ultraction_news_repository_db_timestamp($record['updatedAt'], gmdate('Y-m-d H:i:s')),
    ];
}

function ultraction_news_repository_fetch_tags_map(PDO $pdo, array $newsIds): array
{
    if ($newsIds === []) {
        return [];
    }

    $placeholders = implode(', ', array_fill(0, count($newsIds), '?'));
    $statement = $pdo->prepare("SELECT news_id, tag FROM news_tags WHERE news_id IN ($placeholders) ORDER BY tag ASC");
    $statement->execute(array_values($newsIds));
    $rows = $statement->fetchAll();

    $tagsMap = [];
    foreach ($newsIds as $newsId) {
        $tagsMap[$newsId] = [];
    }

    foreach (is_array($rows) ? $rows : [] as $row) {
        $newsId = (string) $row['news_id'];
        if (!array_key_exists($newsId, $tagsMap)) {
            $tagsMap[$newsId] = [];
        }

        $tagsMap[$newsId][] = (string) $row['tag'];
    }

    return $tagsMap;
}

function ultraction_news_repository_replace_tags(PDO $pdo, string $newsId, array $tags): void
{
    $pdo->prepare('DELETE FROM news_tags WHERE news_id = :news_id')->execute(['news_id' => $newsId]);

    if ($tags === []) {
        return;
    }

    $statement = $pdo->prepare('INSERT INTO news_tags (news_id, tag) VALUES (:news_id, :tag)');
    foreach ($tags as $tag) {
        $statement->execute([
            'news_id' => $newsId,
            'tag' => $tag,
        ]);
    }
}

function ultraction_news_repository_assert_unique_source_url(PDO $pdo, string $sourceUrl, ?string $ignoreId = null): void
{
    $statement = $pdo->prepare('SELECT id FROM news WHERE source_url_hash = :source_url_hash LIMIT 1');
    $statement->execute([
        'source_url_hash' => hash('sha256', strtolower($sourceUrl)),
    ]);
    $row = $statement->fetch();

    if (!is_array($row)) {
        return;
    }

    if ($ignoreId !== null && (string) $row['id'] === $ignoreId) {
        return;
    }

    throw new UltractionNewsConflictException('A news item with this sourceUrl already exists.');
}

function ultraction_news_repository_generate_slug(PDO $pdo, string $title, ?string $ignoreId = null): string
{
    $base = ultraction_news_repository_slugify($title);
    $candidate = $base !== '' ? $base : 'news-item';
    $suffix = 2;

    while (true) {
        $statement = $pdo->prepare('SELECT id FROM news WHERE slug = :slug LIMIT 1');
        $statement->execute(['slug' => $candidate]);
        $row = $statement->fetch();

        if (!is_array($row) || ($ignoreId !== null && (string) $row['id'] === $ignoreId)) {
            return $candidate;
        }

        $candidate = ($base !== '' ? $base : 'news-item') . '-' . $suffix;
        $suffix++;
    }
}

function ultraction_news_repository_slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9\s-]/', '', $value) ?? '';
    $value = preg_replace('/\s+/', '-', $value) ?? '';
    $value = preg_replace('/-+/', '-', $value) ?? '';
    return trim($value, '-');
}

function ultraction_news_repository_db_timestamp(mixed $value, string $fallback): string
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

function ultraction_news_repository_iso_from_db(string $value): string
{
    $date = new DateTimeImmutable($value, new DateTimeZone('UTC'));
    return $date->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM);
}

function ultraction_news_repository_normalize_text(mixed $value): ?string
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

function ultraction_news_repository_normalize_tags(mixed $value): array
{
    if (!is_array($value)) {
        return [];
    }

    $normalizedTags = [];
    $seen = [];

    foreach ($value as $tag) {
        $normalized = ultraction_news_repository_normalize_text($tag);
        if ($normalized === null) {
            continue;
        }

        $key = strtolower($normalized);
        if (isset($seen[$key])) {
            continue;
        }

        $seen[$key] = true;
        $normalizedTags[] = $normalized;
    }

    return $normalizedTags;
}

function ultraction_news_repository_uuid(): string
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
