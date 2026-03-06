import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

export type NewsStatus = 'draft' | 'published' | 'archived';

export interface NewsRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  image: string;
  sourceName: string;
  sourceUrl: string;
  sourcePublishedAt: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
}

interface NewsStoreData {
  version: 1;
  news: NewsRecord[];
}

export interface CreateNewsInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  author: string;
  image: string;
  sourceName: string;
  sourceUrl: string;
  sourcePublishedAt?: string;
}

export interface UpdateNewsInput {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  author?: string;
  image?: string;
  sourceName?: string;
  sourceUrl?: string;
  sourcePublishedAt?: string;
  status?: NewsStatus;
  publishedAt?: string;
}

export interface ArchiveNewsInput {
  confirmTitle: string;
}

export class NewsNotFoundError extends Error {
  constructor(newsId: string) {
    super(`News not found: ${newsId}`);
    this.name = 'NewsNotFoundError';
  }
}

export class NewsConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewsConflictError';
  }
}

const DEFAULT_STORAGE_PATH = 'tmp/news-data.json';
const DB_TABLE_NAME = 'news';
const require = createRequire(import.meta.url);

let pgPool: any | null = null;
let pgAvailable = true;
let dbBootstrapped = false;
let writeQueue = Promise.resolve();

function resolveStoragePath(): string {
  const fromEnv = process.env.NEWS_STORAGE_PATH?.trim();
  const storagePath = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_STORAGE_PATH;
  return path.isAbsolute(storagePath) ? storagePath : path.join(process.cwd(), storagePath);
}

const storagePath = resolveStoragePath();

function hasDatabaseConfigured(): boolean {
  return Boolean(process.env.NEWS_DATABASE_URL?.trim());
}

function normalizeText(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSlug(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSourceUrlKey(value: string | undefined): string | undefined {
  const normalized = normalizeText(value);
  return normalized ? normalized.toLowerCase() : undefined;
}

function normalizeTags(value: string[] | undefined): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const result: string[] = [];
  const seen = new Set<string>();

  for (const tag of value) {
    const normalized = normalizeText(tag);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function toIsoDate(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getSortTimestamp(record: NewsRecord): number {
  const source = record.publishedAt ?? record.sourcePublishedAt ?? record.createdAt;
  const timestamp = new Date(source).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortByPublishedDateDescending(a: NewsRecord, b: NewsRecord): number {
  const publishedDiff = getSortTimestamp(b) - getSortTimestamp(a);
  if (publishedDiff !== 0) {
    return publishedDiff;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function mapDbRowToNews(row: any): NewsRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags.filter((tag: unknown): tag is string => typeof tag === 'string') : [],
    author: row.author,
    image: row.image,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    sourcePublishedAt: new Date(row.source_published_at).toISOString(),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
    archivedAt: row.archived_at ? new Date(row.archived_at).toISOString() : undefined,
  };
}

function mapNewsToDbParams(news: NewsRecord): any[] {
  return [
    news.id,
    news.slug,
    news.title,
    news.excerpt,
    news.content,
    news.category,
    news.tags,
    news.author,
    news.image,
    news.sourceName,
    news.sourceUrl,
    news.sourcePublishedAt,
    news.status,
    news.createdAt,
    news.updatedAt,
    news.publishedAt ?? null,
    news.archivedAt ?? null,
  ];
}

async function getDbPool(): Promise<any | null> {
  if (!hasDatabaseConfigured() || !pgAvailable) {
    return null;
  }

  if (pgPool) {
    return pgPool;
  }

  try {
    const pg = require('pg');
    const Pool = pg.Pool;

    pgPool = new Pool({
      connectionString: process.env.NEWS_DATABASE_URL,
      ssl: process.env.NEWS_DATABASE_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    });

    return pgPool;
  } catch {
    pgAvailable = false;
    return null;
  }
}

async function ensureDbSchema(queryable: { query: (sql: string, params?: unknown[]) => Promise<any> }): Promise<void> {
  if (dbBootstrapped) {
    return;
  }

  await queryable.query(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLE_NAME} (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      author TEXT NOT NULL,
      image TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      source_published_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      published_at TIMESTAMPTZ,
      archived_at TIMESTAMPTZ
    );
  `);

  await queryable.query(
    `CREATE INDEX IF NOT EXISTS idx_${DB_TABLE_NAME}_status_published_created ON ${DB_TABLE_NAME} (status, published_at DESC, created_at DESC);`,
  );
  await queryable.query(
    `CREATE INDEX IF NOT EXISTS idx_${DB_TABLE_NAME}_source_published ON ${DB_TABLE_NAME} (source_published_at DESC);`,
  );

  dbBootstrapped = true;
}

async function generateUniqueSlugDb(pool: any, title: string, currentId?: string): Promise<string> {
  const base = slugify(title) || 'news-item';
  let candidate = base;
  let attempt = 2;

  for (;;) {
    const result = await pool.query(`SELECT id FROM ${DB_TABLE_NAME} WHERE slug = $1 LIMIT 1`, [candidate]);

    if (result.rowCount === 0) {
      return candidate;
    }

    if (currentId && result.rows[0]?.id === currentId) {
      return candidate;
    }

    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
}

async function ensureUniqueSourceUrlDb(pool: any, sourceUrl: string | undefined, currentId?: string): Promise<void> {
  const sourceUrlKey = normalizeSourceUrlKey(sourceUrl);
  if (!sourceUrlKey) {
    return;
  }

  const result = await pool.query(`SELECT id FROM ${DB_TABLE_NAME} WHERE LOWER(source_url) = $1 LIMIT 1`, [
    sourceUrlKey,
  ]);

  if (result.rowCount === 0) {
    return;
  }

  if (currentId && result.rows[0]?.id === currentId) {
    return;
  }

  throw new NewsConflictError('A news item with this sourceUrl already exists.');
}

async function listNewsDb(status: NewsStatus | 'all'): Promise<NewsRecord[]> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const query =
    status === 'all'
      ? `SELECT * FROM ${DB_TABLE_NAME} ORDER BY COALESCE(published_at, source_published_at, created_at) DESC, created_at DESC`
      : `SELECT * FROM ${DB_TABLE_NAME} WHERE status = $1 ORDER BY COALESCE(published_at, source_published_at, created_at) DESC, created_at DESC`;

  const result = status === 'all' ? await pool.query(query) : await pool.query(query, [status]);
  return result.rows.map(mapDbRowToNews);
}

async function getNewsBySlugDb(slug: string, status: NewsStatus | 'all'): Promise<NewsRecord | null> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const query =
    status === 'all'
      ? `SELECT * FROM ${DB_TABLE_NAME} WHERE LOWER(slug) = $1 LIMIT 1`
      : `SELECT * FROM ${DB_TABLE_NAME} WHERE LOWER(slug) = $1 AND status = $2 LIMIT 1`;

  const result =
    status === 'all'
      ? await pool.query(query, [normalizedSlug])
      : await pool.query(query, [normalizedSlug, status]);

  if (result.rowCount === 0) {
    return null;
  }

  return mapDbRowToNews(result.rows[0]);
}

async function createNewsDb(input: CreateNewsInput): Promise<NewsRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const now = new Date().toISOString();
  const title = normalizeText(input.title) ?? 'Untitled News';
  const slug = await generateUniqueSlugDb(pool, title);
  const sourceUrl = normalizeText(input.sourceUrl) ?? '';
  await ensureUniqueSourceUrlDb(pool, sourceUrl);

  const article: NewsRecord = {
    id: randomUUID(),
    slug,
    title,
    excerpt: normalizeText(input.excerpt) ?? '',
    content: normalizeText(input.content) ?? '',
    category: normalizeText(input.category) ?? 'general',
    tags: normalizeTags(input.tags) ?? [],
    author: normalizeText(input.author) ?? 'Unknown',
    image: normalizeText(input.image) ?? '',
    sourceName: normalizeText(input.sourceName) ?? 'Unknown',
    sourceUrl,
    sourcePublishedAt: toIsoDate(input.sourcePublishedAt, now),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  await pool.query(
    `INSERT INTO ${DB_TABLE_NAME}
      (id, slug, title, excerpt, content, category, tags, author, image, source_name, source_url, source_published_at, status, created_at, updated_at, published_at, archived_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    mapNewsToDbParams(article),
  );

  return article;
}

async function updateNewsDb(newsId: string, input: UpdateNewsInput): Promise<NewsRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const currentResult = await pool.query(`SELECT * FROM ${DB_TABLE_NAME} WHERE id = $1 LIMIT 1`, [newsId]);
  if (currentResult.rowCount === 0) {
    throw new NewsNotFoundError(newsId);
  }

  const existing = mapDbRowToNews(currentResult.rows[0]);
  const updatedStatus = input.status ?? existing.status;
  const title = normalizeText(input.title) ?? existing.title;
  const nextSourceUrl = normalizeText(input.sourceUrl) ?? existing.sourceUrl;
  const now = new Date().toISOString();

  const slug = title !== existing.title ? await generateUniqueSlugDb(pool, title, existing.id) : existing.slug;
  await ensureUniqueSourceUrlDb(pool, nextSourceUrl, existing.id);

  const updatedPublishedAt =
    input.publishedAt !== undefined
      ? toIsoDate(input.publishedAt, existing.publishedAt ?? now)
      : updatedStatus === 'published'
        ? existing.publishedAt ?? now
        : existing.publishedAt;

  const updatedArchivedAt =
    updatedStatus === 'archived'
      ? existing.status === 'archived'
        ? existing.archivedAt ?? now
        : now
      : undefined;

  const next: NewsRecord = {
    ...existing,
    title,
    slug,
    excerpt: normalizeText(input.excerpt) ?? existing.excerpt,
    content: normalizeText(input.content) ?? existing.content,
    category: normalizeText(input.category) ?? existing.category,
    tags: input.tags !== undefined ? normalizeTags(input.tags) ?? [] : existing.tags,
    author: normalizeText(input.author) ?? existing.author,
    image: normalizeText(input.image) ?? existing.image,
    sourceName: normalizeText(input.sourceName) ?? existing.sourceName,
    sourceUrl: nextSourceUrl,
    sourcePublishedAt: toIsoDate(input.sourcePublishedAt, existing.sourcePublishedAt),
    status: updatedStatus,
    updatedAt: now,
    publishedAt: updatedPublishedAt,
    archivedAt: updatedArchivedAt,
  };

  await pool.query(
    `UPDATE ${DB_TABLE_NAME}
     SET slug=$2, title=$3, excerpt=$4, content=$5, category=$6, tags=$7, author=$8, image=$9,
         source_name=$10, source_url=$11, source_published_at=$12, status=$13, updated_at=$14, published_at=$15, archived_at=$16
     WHERE id=$1`,
    [
      next.id,
      next.slug,
      next.title,
      next.excerpt,
      next.content,
      next.category,
      next.tags,
      next.author,
      next.image,
      next.sourceName,
      next.sourceUrl,
      next.sourcePublishedAt,
      next.status,
      next.updatedAt,
      next.publishedAt ?? null,
      next.archivedAt ?? null,
    ],
  );

  return next;
}

async function archiveNewsDb(newsId: string, input: ArchiveNewsInput): Promise<NewsRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query(`SELECT * FROM ${DB_TABLE_NAME} WHERE id = $1 FOR UPDATE`, [newsId]);

    if (result.rowCount === 0) {
      throw new NewsNotFoundError(newsId);
    }

    const existing = mapDbRowToNews(result.rows[0]);
    if (existing.status === 'archived') {
      throw new NewsConflictError('News item is already archived.');
    }

    const confirmedTitle = normalizeText(input.confirmTitle);
    if (!confirmedTitle || confirmedTitle !== existing.title) {
      throw new NewsConflictError('confirmTitle must exactly match the current news title.');
    }

    const now = new Date().toISOString();
    const archived: NewsRecord = {
      ...existing,
      status: 'archived',
      updatedAt: now,
      archivedAt: now,
    };

    await client.query(
      `UPDATE ${DB_TABLE_NAME}
       SET status = 'archived', updated_at = $2, archived_at = $3
       WHERE id = $1`,
      [newsId, archived.updatedAt, archived.archivedAt],
    );

    await client.query('COMMIT');
    return archived;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function createUniqueSlugFile(title: string, records: NewsRecord[], currentId?: string): string {
  const base = slugify(title) || 'news-item';
  const taken = new Set(records.filter(record => record.id !== currentId).map(record => record.slug));

  if (!taken.has(base)) {
    return base;
  }

  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }

  return `${base}-${index}`;
}

function ensureUniqueSourceUrlFile(records: NewsRecord[], sourceUrl: string | undefined, currentId?: string): void {
  const sourceUrlKey = normalizeSourceUrlKey(sourceUrl);
  if (!sourceUrlKey) {
    return;
  }

  const duplicate = records.find(record => {
    if (record.id === currentId) {
      return false;
    }

    return normalizeSourceUrlKey(record.sourceUrl) === sourceUrlKey;
  });

  if (duplicate) {
    throw new NewsConflictError('A news item with this sourceUrl already exists.');
  }
}

async function ensureStorageDirectory(): Promise<void> {
  await mkdir(path.dirname(storagePath), { recursive: true });
}

async function readStore(): Promise<NewsStoreData> {
  try {
    const raw = await readFile(storagePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<NewsStoreData>;

    if (!parsed || !Array.isArray(parsed.news)) {
      return { version: 1, news: [] };
    }

    return {
      version: 1,
      news: parsed.news,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, news: [] };
    }

    throw error;
  }
}

async function writeStore(data: NewsStoreData): Promise<void> {
  await ensureStorageDirectory();
  const tempPath = `${storagePath}.${randomUUID()}.tmp`;

  await writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await rename(tempPath, storagePath);
}

async function withWriteLock<T>(callback: (store: NewsStoreData) => Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const store = await readStore();
    const result = await callback(store);
    await writeStore(store);
    return result;
  });

  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

async function listNewsFile(status: NewsStatus | 'all' = 'published'): Promise<NewsRecord[]> {
  const store = await readStore();
  const records = status === 'all' ? store.news : store.news.filter(record => record.status === status);

  return [...records].sort(sortByPublishedDateDescending);
}

async function getNewsBySlugFile(slug: string, status: NewsStatus | 'all' = 'published'): Promise<NewsRecord | null> {
  const store = await readStore();
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const record = store.news.find(item => {
    if (item.slug.toLowerCase() !== normalizedSlug) {
      return false;
    }

    return status === 'all' ? true : item.status === status;
  });

  return record ?? null;
}

async function createNewsFile(input: CreateNewsInput): Promise<NewsRecord> {
  return withWriteLock(async store => {
    const now = new Date().toISOString();
    const title = normalizeText(input.title) ?? 'Untitled News';
    const sourceUrl = normalizeText(input.sourceUrl) ?? '';
    ensureUniqueSourceUrlFile(store.news, sourceUrl);

    const article: NewsRecord = {
      id: randomUUID(),
      slug: createUniqueSlugFile(title, store.news),
      title,
      excerpt: normalizeText(input.excerpt) ?? '',
      content: normalizeText(input.content) ?? '',
      category: normalizeText(input.category) ?? 'general',
      tags: normalizeTags(input.tags) ?? [],
      author: normalizeText(input.author) ?? 'Unknown',
      image: normalizeText(input.image) ?? '',
      sourceName: normalizeText(input.sourceName) ?? 'Unknown',
      sourceUrl,
      sourcePublishedAt: toIsoDate(input.sourcePublishedAt, now),
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    store.news.push(article);
    return article;
  });
}

async function updateNewsFile(newsId: string, input: UpdateNewsInput): Promise<NewsRecord> {
  return withWriteLock(async store => {
    const index = store.news.findIndex(record => record.id === newsId);
    if (index === -1) {
      throw new NewsNotFoundError(newsId);
    }

    const existing = store.news[index];
    const updatedStatus = input.status ?? existing.status;
    const title = normalizeText(input.title) ?? existing.title;
    const nextSourceUrl = normalizeText(input.sourceUrl) ?? existing.sourceUrl;
    const now = new Date().toISOString();
    ensureUniqueSourceUrlFile(store.news, nextSourceUrl, existing.id);

    const updatedPublishedAt =
      input.publishedAt !== undefined
        ? toIsoDate(input.publishedAt, existing.publishedAt ?? now)
        : updatedStatus === 'published'
          ? existing.publishedAt ?? now
          : existing.publishedAt;

    const updatedArchivedAt =
      updatedStatus === 'archived'
        ? existing.status === 'archived'
          ? existing.archivedAt ?? now
          : now
        : undefined;

    const next: NewsRecord = {
      ...existing,
      title,
      slug: title !== existing.title ? createUniqueSlugFile(title, store.news, existing.id) : existing.slug,
      excerpt: normalizeText(input.excerpt) ?? existing.excerpt,
      content: normalizeText(input.content) ?? existing.content,
      category: normalizeText(input.category) ?? existing.category,
      tags: input.tags !== undefined ? normalizeTags(input.tags) ?? [] : existing.tags,
      author: normalizeText(input.author) ?? existing.author,
      image: normalizeText(input.image) ?? existing.image,
      sourceName: normalizeText(input.sourceName) ?? existing.sourceName,
      sourceUrl: nextSourceUrl,
      sourcePublishedAt: toIsoDate(input.sourcePublishedAt, existing.sourcePublishedAt),
      status: updatedStatus,
      updatedAt: now,
      publishedAt: updatedPublishedAt,
      archivedAt: updatedArchivedAt,
    };

    store.news[index] = next;
    return next;
  });
}

async function archiveNewsFile(newsId: string, input: ArchiveNewsInput): Promise<NewsRecord> {
  return withWriteLock(async store => {
    const index = store.news.findIndex(record => record.id === newsId);
    if (index === -1) {
      throw new NewsNotFoundError(newsId);
    }

    const existing = store.news[index];
    if (existing.status === 'archived') {
      throw new NewsConflictError('News item is already archived.');
    }

    const confirmedTitle = normalizeText(input.confirmTitle);
    if (!confirmedTitle || confirmedTitle !== existing.title) {
      throw new NewsConflictError('confirmTitle must exactly match the current news title.');
    }

    const now = new Date().toISOString();
    const archived: NewsRecord = {
      ...existing,
      status: 'archived',
      updatedAt: now,
      archivedAt: now,
    };

    store.news[index] = archived;
    return archived;
  });
}

function logFallback(operation: string, error: unknown): void {
  console.warn(`[news-store] Falling back to file store for ${operation}.`, error);
}

export async function listNews(status: NewsStatus | 'all' = 'published'): Promise<NewsRecord[]> {
  if (hasDatabaseConfigured()) {
    try {
      return await listNewsDb(status);
    } catch (error) {
      logFallback('listNews', error);
    }
  }

  return listNewsFile(status);
}

export async function getNewsBySlug(slug: string, status: NewsStatus | 'all' = 'published'): Promise<NewsRecord | null> {
  if (hasDatabaseConfigured()) {
    try {
      return await getNewsBySlugDb(slug, status);
    } catch (error) {
      logFallback('getNewsBySlug', error);
    }
  }

  return getNewsBySlugFile(slug, status);
}

export async function createNews(input: CreateNewsInput): Promise<NewsRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await createNewsDb(input);
    } catch (error) {
      logFallback('createNews', error);
    }
  }

  return createNewsFile(input);
}

export async function updateNews(newsId: string, input: UpdateNewsInput): Promise<NewsRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await updateNewsDb(newsId, input);
    } catch (error) {
      if (error instanceof NewsNotFoundError || error instanceof NewsConflictError) {
        throw error;
      }

      logFallback('updateNews', error);
    }
  }

  return updateNewsFile(newsId, input);
}

export async function archiveNews(newsId: string, input: ArchiveNewsInput): Promise<NewsRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await archiveNewsDb(newsId, input);
    } catch (error) {
      if (error instanceof NewsNotFoundError || error instanceof NewsConflictError) {
        throw error;
      }

      logFallback('archiveNews', error);
    }
  }

  return archiveNewsFile(newsId, input);
}

export async function resetNewsStore(): Promise<void> {
  try {
    await rm(storagePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
