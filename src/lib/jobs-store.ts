import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

export type JobStatus = 'open' | 'closed';

export interface JobRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  department?: string;
  employmentType?: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  postedAt: string;
  closedAt?: string;
}

interface JobsStoreData {
  version: 1;
  jobs: JobRecord[];
}

export interface CreateJobInput {
  title: string;
  location: string;
  description: string;
  department?: string;
  employmentType?: string;
  postedAt?: string;
}

export interface UpdateJobInput {
  title?: string;
  location?: string;
  description?: string;
  department?: string;
  employmentType?: string;
  postedAt?: string;
  status?: JobStatus;
}

export interface ArchiveJobInput {
  confirmTitle: string;
}

export class JobNotFoundError extends Error {
  constructor(jobId: string) {
    super(`Job not found: ${jobId}`);
    this.name = 'JobNotFoundError';
  }
}

export class JobConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JobConflictError';
  }
}

const DEFAULT_STORAGE_PATH = 'tmp/jobs-data.json';
const DB_TABLE_NAME = 'jobs';
const require = createRequire(import.meta.url);

let pgPool: any | null = null;
let pgAvailable = true;
let dbBootstrapped = false;
let writeQueue = Promise.resolve();

function resolveStoragePath(): string {
  const fromEnv = process.env.JOBS_STORAGE_PATH?.trim();
  const storagePath = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_STORAGE_PATH;
  return path.isAbsolute(storagePath) ? storagePath : path.join(process.cwd(), storagePath);
}

const storagePath = resolveStoragePath();

function hasDatabaseConfigured(): boolean {
  return Boolean(process.env.JOBS_DATABASE_URL?.trim());
}

function normalizeText(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : undefined;
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

function sortByPostedDateDescending(a: JobRecord, b: JobRecord): number {
  const postedDiff = new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  if (postedDiff !== 0) {
    return postedDiff;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function mapDbRowToJob(row: any): JobRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    description: row.description,
    department: row.department ?? undefined,
    employmentType: row.employment_type ?? undefined,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    postedAt: new Date(row.posted_at).toISOString(),
    closedAt: row.closed_at ? new Date(row.closed_at).toISOString() : undefined,
  };
}

function mapJobToDbParams(job: JobRecord): any[] {
  return [
    job.id,
    job.slug,
    job.title,
    job.location,
    job.description,
    job.department ?? null,
    job.employmentType ?? null,
    job.status,
    job.createdAt,
    job.updatedAt,
    job.postedAt,
    job.closedAt ?? null,
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
      connectionString: process.env.JOBS_DATABASE_URL,
      ssl: process.env.JOBS_DATABASE_SSL === 'false' ? undefined : { rejectUnauthorized: false },
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
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      department TEXT,
      employment_type TEXT,
      status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      posted_at TIMESTAMPTZ NOT NULL,
      closed_at TIMESTAMPTZ
    );
  `);

  await queryable.query(`CREATE INDEX IF NOT EXISTS idx_${DB_TABLE_NAME}_status_posted ON ${DB_TABLE_NAME} (status, posted_at DESC);`);
  await queryable.query(`CREATE INDEX IF NOT EXISTS idx_${DB_TABLE_NAME}_posted_created ON ${DB_TABLE_NAME} (posted_at DESC, created_at DESC);`);

  dbBootstrapped = true;
}

async function generateUniqueSlugDb(pool: any, title: string, currentId?: string): Promise<string> {
  const base = slugify(title) || 'role';
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

async function listJobsDb(status: JobStatus | 'all'): Promise<JobRecord[]> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const query =
    status === 'all'
      ? `SELECT * FROM ${DB_TABLE_NAME} ORDER BY posted_at DESC, created_at DESC`
      : `SELECT * FROM ${DB_TABLE_NAME} WHERE status = $1 ORDER BY posted_at DESC, created_at DESC`;

  const result = status === 'all' ? await pool.query(query) : await pool.query(query, [status]);
  return result.rows.map(mapDbRowToJob);
}

async function createJobDb(input: CreateJobInput): Promise<JobRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const now = new Date().toISOString();
  const title = normalizeText(input.title) ?? 'Untitled Role';
  const slug = await generateUniqueSlugDb(pool, title);

  const job: JobRecord = {
    id: randomUUID(),
    slug,
    title,
    location: normalizeText(input.location) ?? 'UAE',
    description: normalizeText(input.description) ?? '',
    department: normalizeText(input.department),
    employmentType: normalizeText(input.employmentType),
    status: 'open',
    createdAt: now,
    updatedAt: now,
    postedAt: toIsoDate(input.postedAt, now),
  };

  await pool.query(
    `INSERT INTO ${DB_TABLE_NAME} (id, slug, title, location, description, department, employment_type, status, created_at, updated_at, posted_at, closed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    mapJobToDbParams(job),
  );

  return job;
}

async function updateJobDb(jobId: string, input: UpdateJobInput): Promise<JobRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const currentResult = await pool.query(`SELECT * FROM ${DB_TABLE_NAME} WHERE id = $1 LIMIT 1`, [jobId]);
  if (currentResult.rowCount === 0) {
    throw new JobNotFoundError(jobId);
  }

  const existing = mapDbRowToJob(currentResult.rows[0]);
  const updatedStatus = input.status ?? existing.status;

  if (existing.status === 'closed' && updatedStatus === 'closed') {
    throw new JobConflictError('Job is already closed.');
  }

  const title = normalizeText(input.title) ?? existing.title;
  const now = new Date().toISOString();
  const slug = title !== existing.title ? await generateUniqueSlugDb(pool, title, existing.id) : existing.slug;

  const next: JobRecord = {
    ...existing,
    title,
    slug,
    location: normalizeText(input.location) ?? existing.location,
    description: normalizeText(input.description) ?? existing.description,
    department: normalizeText(input.department) ?? existing.department,
    employmentType: normalizeText(input.employmentType) ?? existing.employmentType,
    status: updatedStatus,
    postedAt: toIsoDate(input.postedAt, existing.postedAt),
    updatedAt: now,
    closedAt: updatedStatus === 'closed' ? now : undefined,
  };

  await pool.query(
    `UPDATE ${DB_TABLE_NAME}
     SET slug=$2, title=$3, location=$4, description=$5, department=$6, employment_type=$7,
         status=$8, updated_at=$9, posted_at=$10, closed_at=$11
     WHERE id=$1`,
    [
      next.id,
      next.slug,
      next.title,
      next.location,
      next.description,
      next.department ?? null,
      next.employmentType ?? null,
      next.status,
      next.updatedAt,
      next.postedAt,
      next.closedAt ?? null,
    ],
  );

  return next;
}

async function archiveJobDb(jobId: string, input: ArchiveJobInput): Promise<JobRecord> {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('db_unavailable');
  }

  await ensureDbSchema(pool);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query(`SELECT * FROM ${DB_TABLE_NAME} WHERE id = $1 FOR UPDATE`, [jobId]);

    if (result.rowCount === 0) {
      throw new JobNotFoundError(jobId);
    }

    const existing = mapDbRowToJob(result.rows[0]);
    if (existing.status === 'closed') {
      throw new JobConflictError('Job is already archived.');
    }

    const confirmedTitle = normalizeText(input.confirmTitle);
    if (!confirmedTitle || confirmedTitle !== existing.title) {
      throw new JobConflictError('confirmTitle must exactly match the current job title.');
    }

    const now = new Date().toISOString();
    const archived: JobRecord = {
      ...existing,
      status: 'closed',
      updatedAt: now,
      closedAt: now,
    };

    await client.query(
      `UPDATE ${DB_TABLE_NAME}
       SET status = 'closed', updated_at = $2, closed_at = $3
       WHERE id = $1`,
      [jobId, archived.updatedAt, archived.closedAt],
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

function createUniqueSlugFile(title: string, jobs: JobRecord[], currentJobId?: string): string {
  const base = slugify(title) || 'role';
  const taken = new Set(jobs.filter(job => job.id !== currentJobId).map(job => job.slug));

  if (!taken.has(base)) {
    return base;
  }

  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }

  return `${base}-${index}`;
}

async function ensureStorageDirectory(): Promise<void> {
  await mkdir(path.dirname(storagePath), { recursive: true });
}

async function readStore(): Promise<JobsStoreData> {
  try {
    const raw = await readFile(storagePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<JobsStoreData>;

    if (!parsed || !Array.isArray(parsed.jobs)) {
      return { version: 1, jobs: [] };
    }

    return {
      version: 1,
      jobs: parsed.jobs,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, jobs: [] };
    }

    throw error;
  }
}

async function writeStore(data: JobsStoreData): Promise<void> {
  await ensureStorageDirectory();
  const tempPath = `${storagePath}.${randomUUID()}.tmp`;

  await writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await rename(tempPath, storagePath);
}

async function withWriteLock<T>(callback: (store: JobsStoreData) => Promise<T>): Promise<T> {
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

async function listJobsFile(status: JobStatus | 'all' = 'open'): Promise<JobRecord[]> {
  const store = await readStore();
  const jobs = status === 'all' ? store.jobs : store.jobs.filter(job => job.status === status);

  return [...jobs].sort(sortByPostedDateDescending);
}

async function createJobFile(input: CreateJobInput): Promise<JobRecord> {
  return withWriteLock(async store => {
    const now = new Date().toISOString();
    const title = normalizeText(input.title) ?? 'Untitled Role';

    const job: JobRecord = {
      id: randomUUID(),
      slug: createUniqueSlugFile(title, store.jobs),
      title,
      location: normalizeText(input.location) ?? 'UAE',
      description: normalizeText(input.description) ?? '',
      department: normalizeText(input.department),
      employmentType: normalizeText(input.employmentType),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      postedAt: toIsoDate(input.postedAt, now),
    };

    store.jobs.push(job);
    return job;
  });
}

async function updateJobFile(jobId: string, input: UpdateJobInput): Promise<JobRecord> {
  return withWriteLock(async store => {
    const index = store.jobs.findIndex(job => job.id === jobId);
    if (index === -1) {
      throw new JobNotFoundError(jobId);
    }

    const existing = store.jobs[index];
    const updatedStatus = input.status ?? existing.status;

    if (existing.status === 'closed' && updatedStatus === 'closed') {
      throw new JobConflictError('Job is already closed.');
    }

    const title = normalizeText(input.title) ?? existing.title;
    const now = new Date().toISOString();

    const next: JobRecord = {
      ...existing,
      title,
      slug: title !== existing.title ? createUniqueSlugFile(title, store.jobs, existing.id) : existing.slug,
      location: normalizeText(input.location) ?? existing.location,
      description: normalizeText(input.description) ?? existing.description,
      department: normalizeText(input.department) ?? existing.department,
      employmentType: normalizeText(input.employmentType) ?? existing.employmentType,
      status: updatedStatus,
      postedAt: toIsoDate(input.postedAt, existing.postedAt),
      updatedAt: now,
      closedAt: updatedStatus === 'closed' ? now : undefined,
    };

    store.jobs[index] = next;
    return next;
  });
}

async function archiveJobFile(jobId: string, input: ArchiveJobInput): Promise<JobRecord> {
  return withWriteLock(async store => {
    const index = store.jobs.findIndex(job => job.id === jobId);
    if (index === -1) {
      throw new JobNotFoundError(jobId);
    }

    const existing = store.jobs[index];
    if (existing.status === 'closed') {
      throw new JobConflictError('Job is already archived.');
    }

    const confirmedTitle = normalizeText(input.confirmTitle);
    if (!confirmedTitle || confirmedTitle !== existing.title) {
      throw new JobConflictError('confirmTitle must exactly match the current job title.');
    }

    const now = new Date().toISOString();
    const archived: JobRecord = {
      ...existing,
      status: 'closed',
      updatedAt: now,
      closedAt: now,
    };

    store.jobs[index] = archived;
    return archived;
  });
}

function logFallback(operation: string, error: unknown): void {
  console.warn(`[jobs-store] Falling back to file store for ${operation}.`, error);
}

export async function listJobs(status: JobStatus | 'all' = 'open'): Promise<JobRecord[]> {
  if (hasDatabaseConfigured()) {
    try {
      return await listJobsDb(status);
    } catch (error) {
      logFallback('listJobs', error);
    }
  }

  return listJobsFile(status);
}

export async function createJob(input: CreateJobInput): Promise<JobRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await createJobDb(input);
    } catch (error) {
      logFallback('createJob', error);
    }
  }

  return createJobFile(input);
}

export async function updateJob(jobId: string, input: UpdateJobInput): Promise<JobRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await updateJobDb(jobId, input);
    } catch (error) {
      if (error instanceof JobNotFoundError || error instanceof JobConflictError) {
        throw error;
      }

      logFallback('updateJob', error);
    }
  }

  return updateJobFile(jobId, input);
}

export async function archiveJob(jobId: string, input: ArchiveJobInput): Promise<JobRecord> {
  if (hasDatabaseConfigured()) {
    try {
      return await archiveJobDb(jobId, input);
    } catch (error) {
      if (error instanceof JobNotFoundError || error instanceof JobConflictError) {
        throw error;
      }

      logFallback('archiveJob', error);
    }
  }

  return archiveJobFile(jobId, input);
}

export async function resetJobsStore(): Promise<void> {
  try {
    await rm(storagePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
