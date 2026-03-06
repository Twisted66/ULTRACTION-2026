<?php

declare(strict_types=1);

function ultraction_db_connection(): ?PDO
{
    static $connection = null;
    static $attempted = false;

    if ($attempted) {
        return $connection;
    }

    $attempted = true;

    $dsn = ultraction_config('db.dsn');
    if (is_string($dsn) && $dsn !== '') {
        try {
            $connection = new PDO(
                $dsn,
                (string) ultraction_config('db.user', ''),
                (string) ultraction_config('db.password', ''),
                (array) ultraction_config('db.options', [])
            );
        } catch (Throwable $exception) {
            error_log('ULTRACTION DB connection failed: ' . $exception->getMessage());
            $connection = null;
        }

        return $connection;
    }

    $databaseName = (string) ultraction_config('db.name', '');
    $databaseUser = (string) ultraction_config('db.user', '');
    if ($databaseName === '' || $databaseUser === '') {
        return null;
    }

    $charset = (string) ultraction_config('db.charset', 'utf8mb4');
    $host = (string) ultraction_config('db.host', 'localhost');
    $port = (int) ultraction_config('db.port', 3306);
    $composedDsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $host, $port, $databaseName, $charset);

    try {
        $connection = new PDO(
            $composedDsn,
            $databaseUser,
            (string) ultraction_config('db.password', ''),
            (array) ultraction_config('db.options', [])
        );
    } catch (Throwable $exception) {
        error_log('ULTRACTION DB connection failed: ' . $exception->getMessage());
        $connection = null;
    }

    return $connection;
}

function ultraction_db_available(): bool
{
    return ultraction_db_connection() instanceof PDO;
}
