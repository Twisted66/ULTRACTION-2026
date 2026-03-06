<?php

declare(strict_types=1);

function ultraction_rate_limit_check(string $scope, string $key, int $windowSeconds, int $maxRequests): array
{
    $directory = (string) ultraction_config('paths.rate_limit_dir');
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Unable to prepare rate limit storage.');
    }

    $filePath = rtrim($directory, DIRECTORY_SEPARATOR)
        . DIRECTORY_SEPARATOR
        . preg_replace('/[^A-Za-z0-9_-]+/', '-', $scope)
        . '-'
        . hash('sha256', $key)
        . '.json';

    $handle = fopen($filePath, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Unable to open rate limit storage.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Unable to lock rate limit storage.');
        }

        $raw = stream_get_contents($handle);
        $now = time();
        $state = [
            'window_started_at' => $now,
            'count' => 0,
        ];

        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $state['window_started_at'] = isset($decoded['window_started_at']) ? (int) $decoded['window_started_at'] : $now;
                $state['count'] = isset($decoded['count']) ? (int) $decoded['count'] : 0;
            }
        }

        if (($now - $state['window_started_at']) >= $windowSeconds) {
            $state['window_started_at'] = $now;
            $state['count'] = 0;
        }

        $state['count']++;
        $limited = $state['count'] > $maxRequests;
        $retryAfter = max(0, $windowSeconds - ($now - $state['window_started_at']));

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($state, JSON_UNESCAPED_SLASHES));
        fflush($handle);
        flock($handle, LOCK_UN);

        return [
            'limited' => $limited,
            'count' => $state['count'],
            'retry_after' => $retryAfter,
            'remaining' => max(0, $maxRequests - min($state['count'], $maxRequests)),
        ];
    } finally {
        fclose($handle);
    }
}
