import type { APIRoute } from 'astro';
import {
  archiveJob,
  createJob,
  JobConflictError,
  JobNotFoundError,
  listJobs,
  updateJob,
} from '../../lib/jobs-store';
import type { JobStatus } from '../../lib/jobs-store';

const READ_RATE_LIMIT_WINDOW_MS = 60_000;
const READ_RATE_LIMIT_MAX_REQUESTS = 120;
const WRITE_RATE_LIMIT_WINDOW_MS = 60_000;
const WRITE_RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_RETENTION_MS = WRITE_RATE_LIMIT_WINDOW_MS * 2;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

interface JobWriteRequestBody {
  id?: string;
  title?: string;
  location?: string;
  description?: string;
  department?: string;
  employmentType?: string;
  postedAt?: string;
  status?: JobStatus;
  confirmArchive?: boolean;
  confirmRemove?: boolean;
  confirmTitle?: string;
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

function getApiKeyFromRequest(request: Request): string | null {
  const directHeader = request.headers.get('x-jobs-api-key');
  if (directHeader?.trim()) {
    return directHeader.trim();
  }

  const authHeader = request.headers.get('authorization')?.trim();
  if (!authHeader) {
    return null;
  }

  const bearerPrefix = 'Bearer ';
  if (!authHeader.startsWith(bearerPrefix)) {
    return null;
  }

  return authHeader.slice(bearerPrefix.length).trim();
}

function isValidStatus(value: string): value is JobStatus | 'all' {
  return value === 'open' || value === 'closed' || value === 'all';
}

function validateWriteBody(body: JobWriteRequestBody, method: 'POST' | 'PATCH'): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = body.title?.trim() ?? '';
  const location = body.location?.trim() ?? '';
  const description = body.description?.trim() ?? '';

  if (method === 'POST' || body.title !== undefined) {
    if (title.length < 2 || title.length > 120) {
      errors.title = 'Title must be between 2 and 120 characters.';
    }
  }

  if (method === 'POST' || body.location !== undefined) {
    if (location.length < 2 || location.length > 120) {
      errors.location = 'Location must be between 2 and 120 characters.';
    }
  }

  if (method === 'POST' || body.description !== undefined) {
    if (description.length < 20 || description.length > 5000) {
      errors.description = 'Description must be between 20 and 5000 characters.';
    }
  }

  if (body.department && body.department.trim().length > 120) {
    errors.department = 'Department must be 120 characters or fewer.';
  }

  if (body.employmentType && body.employmentType.trim().length > 80) {
    errors.employmentType = 'Employment type must be 80 characters or fewer.';
  }

  if (body.postedAt) {
    const postedAtDate = new Date(body.postedAt);
    if (Number.isNaN(postedAtDate.getTime())) {
      errors.postedAt = 'postedAt must be a valid ISO date string.';
    }
  }

  if (body.status && body.status !== 'open' && body.status !== 'closed') {
    errors.status = 'Status must be either open or closed.';
  }

  return errors;
}

function isRateLimited(ip: string, scope: 'read' | 'write'): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_RETENTION_MS) {
      rateLimitMap.delete(key);
    }
  }

  const windowMs = scope === 'write' ? WRITE_RATE_LIMIT_WINDOW_MS : READ_RATE_LIMIT_WINDOW_MS;
  const maxRequests = scope === 'write' ? WRITE_RATE_LIMIT_MAX_REQUESTS : READ_RATE_LIMIT_MAX_REQUESTS;
  const key = `${scope}:${ip}`;

  const existing = rateLimitMap.get(key);
  if (!existing || now - existing.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return false;
  }

  existing.count += 1;
  rateLimitMap.set(key, existing);

  return existing.count > maxRequests;
}

function ensureWriteAuth(request: Request): { ok: true } | { ok: false; response: Response } {
  const expectedApiKey = process.env.JOBS_API_KEY?.trim();
  if (!expectedApiKey) {
    return {
      ok: false,
      response: jsonResponse(503, {
        ok: false,
        error: {
          code: 'jobs_api_misconfigured',
          message: 'Jobs API write operations are not configured.',
        },
      }),
    };
  }

  const receivedApiKey = getApiKeyFromRequest(request);
  if (!receivedApiKey) {
    return {
      ok: false,
      response: jsonResponse(401, {
        ok: false,
        error: {
          code: 'auth_required',
          message: 'Missing jobs API credentials.',
        },
      }),
    };
  }

  if (receivedApiKey !== expectedApiKey) {
    return {
      ok: false,
      response: jsonResponse(403, {
        ok: false,
        error: {
          code: 'invalid_credentials',
          message: 'Invalid jobs API credentials.',
        },
      }),
    };
  }

  return { ok: true };
}

async function parseJsonBody(request: Request): Promise<JobWriteRequestBody | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    const data = (await request.json()) as JobWriteRequestBody;
    return data;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request, url }) => {
  const ip = getClientIp(request);
  if (isRateLimited(ip, 'read')) {
    return jsonResponse(429, {
      ok: false,
      error: {
        code: 'rate_limited',
        message: 'Too many read requests. Please try again shortly.',
      },
    });
  }

  const requestedStatus = url.searchParams.get('status')?.trim().toLowerCase() ?? 'open';
  if (!isValidStatus(requestedStatus)) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'invalid_status',
        message: 'status must be one of: open, closed, all.',
      },
    });
  }

  if (requestedStatus !== 'open') {
    const authResult = ensureWriteAuth(request);
    if (!authResult.ok) {
      return authResult.response;
    }
  }

  try {
    const jobs = await listJobs(requestedStatus);
    return jsonResponse(200, {
      ok: true,
      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error('Unable to list jobs:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to load jobs right now.',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  if (isRateLimited(ip, 'write')) {
    return jsonResponse(429, {
      ok: false,
      error: {
        code: 'rate_limited',
        message: 'Too many write requests. Please try again shortly.',
      },
    });
  }

  const authResult = ensureWriteAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(415, {
      ok: false,
      error: {
        code: 'unsupported_media_type',
        message: 'Content-Type must be application/json.',
      },
    });
  }

  const fieldErrors = validateWriteBody(body, 'POST');
  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid job payload.',
        fieldErrors,
      },
    });
  }

  try {
    const created = await createJob({
      title: body.title ?? '',
      location: body.location ?? '',
      description: body.description ?? '',
      department: body.department,
      employmentType: body.employmentType,
      postedAt: body.postedAt,
    });

    return jsonResponse(201, {
      ok: true,
      data: {
        job: created,
      },
    });
  } catch (error) {
    console.error('Unable to create job:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to create this job right now.',
      },
    });
  }
};

export const PATCH: APIRoute = async ({ request, url }) => {
  const ip = getClientIp(request);
  if (isRateLimited(ip, 'write')) {
    return jsonResponse(429, {
      ok: false,
      error: {
        code: 'rate_limited',
        message: 'Too many write requests. Please try again shortly.',
      },
    });
  }

  const authResult = ensureWriteAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(415, {
      ok: false,
      error: {
        code: 'unsupported_media_type',
        message: 'Content-Type must be application/json.',
      },
    });
  }

  const jobId = (url.searchParams.get('id') ?? '').trim();
  if (!jobId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'missing_id',
        message: 'A job id is required via ?id=...',
      },
    });
  }

  const bodyId = body.id?.trim();
  if (bodyId && bodyId !== jobId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid job payload.',
        fieldErrors: {
          id: 'body.id must match query parameter id.',
        },
      },
    });
  }

  const fieldErrors = validateWriteBody(body, 'PATCH');
  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid job payload.',
        fieldErrors,
      },
    });
  }

  if (
    body.title === undefined &&
    body.location === undefined &&
    body.description === undefined &&
    body.department === undefined &&
    body.employmentType === undefined &&
    body.status === undefined &&
    body.postedAt === undefined
  ) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'empty_update',
        message: 'At least one updatable field is required.',
      },
    });
  }

  try {
    const updated = await updateJob(jobId, {
      title: body.title,
      location: body.location,
      description: body.description,
      department: body.department,
      employmentType: body.employmentType,
      status: body.status,
      postedAt: body.postedAt,
    });

    return jsonResponse(200, {
      ok: true,
      data: {
        job: updated,
      },
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return jsonResponse(404, {
        ok: false,
        error: {
          code: 'not_found',
          message: error.message,
        },
      });
    }

    if (error instanceof JobConflictError) {
      return jsonResponse(409, {
        ok: false,
        error: {
          code: 'conflict',
          message: error.message,
        },
      });
    }

    console.error('Unable to update job:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to update this job right now.',
      },
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const ip = getClientIp(request);
  if (isRateLimited(ip, 'write')) {
    return jsonResponse(429, {
      ok: false,
      error: {
        code: 'rate_limited',
        message: 'Too many write requests. Please try again shortly.',
      },
    });
  }

  const authResult = ensureWriteAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const body = await parseJsonBody(request);
  const jobId = (url.searchParams.get('id') ?? '').trim();

  if (!jobId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'missing_id',
        message: 'A job id is required via ?id=...',
      },
    });
  }

  const bodyId = body?.id?.trim();
  if (bodyId && bodyId !== jobId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid archive payload.',
        fieldErrors: {
          id: 'body.id must match query parameter id.',
        },
      },
    });
  }

  const confirmParam = url.searchParams.get('confirm')?.trim().toLowerCase();
  const confirmFromQuery =
    confirmParam === 'true' ? true : confirmParam === 'false' ? false : undefined;
  const confirmArchive = body?.confirmArchive ?? body?.confirmRemove ?? confirmFromQuery;
  const confirmTitle =
    body?.confirmTitle?.trim() ??
    url.searchParams.get('confirmTitle')?.trim() ??
    url.searchParams.get('title')?.trim() ??
    '';

  const confirmationErrors: Record<string, string> = {};
  if (confirmArchive !== true) {
    confirmationErrors.confirmArchive = 'confirmArchive must be true.';
  }

  if (!confirmTitle) {
    confirmationErrors.confirmTitle = 'confirmTitle is required.';
  }

  if (Object.keys(confirmationErrors).length > 0) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid archive confirmation.',
        fieldErrors: confirmationErrors,
      },
    });
  }

  try {
    const archived = await archiveJob(jobId, { confirmTitle });
    return jsonResponse(200, {
      ok: true,
      data: {
        job: archived,
      },
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return jsonResponse(404, {
        ok: false,
        error: {
          code: 'not_found',
          message: error.message,
        },
      });
    }

    if (error instanceof JobConflictError) {
      return jsonResponse(409, {
        ok: false,
        error: {
          code: 'conflict',
          message: error.message,
        },
      });
    }

    console.error('Unable to archive job:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to archive this job right now.',
      },
    });
  }
};

export const ALL: APIRoute = async () =>
  jsonResponse(405, {
    ok: false,
    error: {
      code: 'method_not_allowed',
      message: 'Method not allowed.',
    },
  });
