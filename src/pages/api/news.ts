import type { APIRoute } from 'astro';
import {
  archiveNews,
  createNews,
  listNews,
  NewsConflictError,
  NewsNotFoundError,
  updateNews,
} from '../../lib/news-store';
import type { NewsStatus } from '../../lib/news-store';

const READ_RATE_LIMIT_WINDOW_MS = 60_000;
const READ_RATE_LIMIT_MAX_REQUESTS = 120;
const WRITE_RATE_LIMIT_WINDOW_MS = 60_000;
const WRITE_RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_RETENTION_MS = WRITE_RATE_LIMIT_WINDOW_MS * 2;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

interface NewsWriteRequestBody {
  id?: unknown;
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  category?: unknown;
  tags?: unknown;
  author?: unknown;
  image?: unknown;
  sourceName?: unknown;
  sourceUrl?: unknown;
  sourcePublishedAt?: unknown;
  status?: unknown;
  publishedAt?: unknown;
  confirmArchive?: boolean;
  confirmRemove?: boolean;
  confirmTitle?: unknown;
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
  const directHeader = request.headers.get('x-news-api-key');
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

function isNewsStatus(value: string): value is NewsStatus {
  return value === 'draft' || value === 'published' || value === 'archived';
}

function isValidStatus(value: string): value is NewsStatus | 'all' {
  return value === 'draft' || value === 'published' || value === 'archived' || value === 'all';
}

function toOptionalTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  return value.trim();
}

function isIsoDateString(value: string): boolean {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function normalizeTagsFromBody(value: unknown): string[] | undefined {
  if (!isStringArray(value)) {
    return undefined;
  }

  return value.map(tag => tag.trim()).filter(tag => tag.length > 0);
}

function validateWriteBody(body: NewsWriteRequestBody, method: 'POST' | 'PATCH'): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = toOptionalTrimmedString(body.title) ?? '';
  const excerpt = toOptionalTrimmedString(body.excerpt) ?? '';
  const content = toOptionalTrimmedString(body.content) ?? '';
  const category = toOptionalTrimmedString(body.category) ?? '';
  const author = toOptionalTrimmedString(body.author) ?? '';
  const image = toOptionalTrimmedString(body.image) ?? '';
  const sourceName = toOptionalTrimmedString(body.sourceName) ?? '';
  const sourceUrl = toOptionalTrimmedString(body.sourceUrl) ?? '';
  const sourcePublishedAt = toOptionalTrimmedString(body.sourcePublishedAt) ?? '';
  const publishedAt = toOptionalTrimmedString(body.publishedAt) ?? '';
  const status = toOptionalTrimmedString(body.status);

  if (method === 'POST' || body.title !== undefined) {
    if (typeof body.title !== 'string' || title.length < 2 || title.length > 180) {
      errors.title = 'Title must be between 2 and 180 characters.';
    }
  }

  if (method === 'POST' || body.excerpt !== undefined) {
    if (typeof body.excerpt !== 'string' || excerpt.length < 10 || excerpt.length > 600) {
      errors.excerpt = 'Excerpt must be between 10 and 600 characters.';
    }
  }

  if (method === 'POST' || body.content !== undefined) {
    if (typeof body.content !== 'string' || content.length < 20 || content.length > 50_000) {
      errors.content = 'Content must be between 20 and 50000 characters.';
    }
  }

  if (method === 'POST' || body.category !== undefined) {
    if (typeof body.category !== 'string' || category.length < 2 || category.length > 80) {
      errors.category = 'Category must be between 2 and 80 characters.';
    }
  }

  if (method === 'POST' || body.author !== undefined) {
    if (typeof body.author !== 'string' || author.length < 2 || author.length > 120) {
      errors.author = 'Author must be between 2 and 120 characters.';
    }
  }

  if (method === 'POST' || body.image !== undefined) {
    if (typeof body.image !== 'string' || image.length < 3 || image.length > 2048) {
      errors.image = 'Image must be between 3 and 2048 characters.';
    }
  }

  if (method === 'POST' || body.sourceName !== undefined) {
    if (typeof body.sourceName !== 'string' || sourceName.length < 2 || sourceName.length > 120) {
      errors.sourceName = 'sourceName must be between 2 and 120 characters.';
    }
  }

  if (method === 'POST' || body.sourceUrl !== undefined) {
    if (typeof body.sourceUrl !== 'string' || sourceUrl.length < 8 || sourceUrl.length > 2048) {
      errors.sourceUrl = 'sourceUrl must be between 8 and 2048 characters.';
    } else {
      try {
        // URL parsing guards against malformed source references.
        new URL(sourceUrl);
      } catch {
        errors.sourceUrl = 'sourceUrl must be a valid absolute URL.';
      }
    }
  }

  if (body.sourcePublishedAt !== undefined) {
    if (typeof body.sourcePublishedAt !== 'string' || !isIsoDateString(sourcePublishedAt)) {
      errors.sourcePublishedAt = 'sourcePublishedAt must be a valid ISO date string.';
    }
  }

  if (body.tags !== undefined) {
    if (!isStringArray(body.tags)) {
      errors.tags = 'tags must be an array of strings.';
    } else if (body.tags.length > 25) {
      errors.tags = 'tags cannot contain more than 25 items.';
    } else if (body.tags.some(tag => tag.trim().length < 1 || tag.trim().length > 40)) {
      errors.tags = 'Each tag must be between 1 and 40 characters.';
    }
  }

  if (status && !isNewsStatus(status)) {
    errors.status = 'Status must be one of: draft, published, archived.';
  }

  if (body.publishedAt !== undefined) {
    if (typeof body.publishedAt !== 'string' || !isIsoDateString(publishedAt)) {
      errors.publishedAt = 'publishedAt must be a valid ISO date string.';
    }
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

function ensureProtectedAuth(request: Request): { ok: true } | { ok: false; response: Response } {
  const expectedApiKey = process.env.NEWS_API_KEY?.trim();
  if (!expectedApiKey) {
    return {
      ok: false,
      response: jsonResponse(503, {
        ok: false,
        error: {
          code: 'news_api_misconfigured',
          message: 'News API protected operations are not configured.',
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
          message: 'Missing news API credentials.',
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
          message: 'Invalid news API credentials.',
        },
      }),
    };
  }

  return { ok: true };
}

async function parseJsonBody(request: Request): Promise<NewsWriteRequestBody | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    const data = (await request.json()) as NewsWriteRequestBody;
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

  const requestedStatus = url.searchParams.get('status')?.trim().toLowerCase() ?? 'published';
  if (!isValidStatus(requestedStatus)) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'invalid_status',
        message: 'status must be one of: published, draft, archived, all.',
      },
    });
  }

  if (requestedStatus !== 'published') {
    const authResult = ensureProtectedAuth(request);
    if (!authResult.ok) {
      return authResult.response;
    }
  }

  try {
    const news = await listNews(requestedStatus);
    return jsonResponse(200, {
      ok: true,
      data: {
        news,
      },
    });
  } catch (error) {
    console.error('Unable to list news:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to load news right now.',
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

  const authResult = ensureProtectedAuth(request);
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
        message: 'Invalid news payload.',
        fieldErrors,
      },
    });
  }

  try {
    const created = await createNews({
      title: toOptionalTrimmedString(body.title) ?? '',
      excerpt: toOptionalTrimmedString(body.excerpt) ?? '',
      content: toOptionalTrimmedString(body.content) ?? '',
      category: toOptionalTrimmedString(body.category) ?? '',
      tags: normalizeTagsFromBody(body.tags),
      author: toOptionalTrimmedString(body.author) ?? '',
      image: toOptionalTrimmedString(body.image) ?? '',
      sourceName: toOptionalTrimmedString(body.sourceName) ?? '',
      sourceUrl: toOptionalTrimmedString(body.sourceUrl) ?? '',
      sourcePublishedAt: toOptionalTrimmedString(body.sourcePublishedAt),
    });

    return jsonResponse(201, {
      ok: true,
      data: {
        news: created,
      },
    });
  } catch (error) {
    if (error instanceof NewsConflictError) {
      return jsonResponse(409, {
        ok: false,
        error: {
          code: 'conflict',
          message: error.message,
        },
      });
    }

    console.error('Unable to create news:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to create this news entry right now.',
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

  const authResult = ensureProtectedAuth(request);
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

  const newsId = (url.searchParams.get('id') ?? '').trim();
  if (!newsId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'missing_id',
        message: 'A news id is required via ?id=...',
      },
    });
  }

  const bodyId = toOptionalTrimmedString(body.id);
  if (bodyId && bodyId !== newsId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Invalid news payload.',
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
        message: 'Invalid news payload.',
        fieldErrors,
      },
    });
  }

  if (
    body.title === undefined &&
    body.excerpt === undefined &&
    body.content === undefined &&
    body.category === undefined &&
    body.tags === undefined &&
    body.author === undefined &&
    body.image === undefined &&
    body.sourceName === undefined &&
    body.sourceUrl === undefined &&
    body.sourcePublishedAt === undefined &&
    body.status === undefined &&
    body.publishedAt === undefined
  ) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'empty_update',
        message: 'At least one updatable field is required.',
      },
    });
  }

  const status = toOptionalTrimmedString(body.status);

  try {
    const updated = await updateNews(newsId, {
      title: toOptionalTrimmedString(body.title),
      excerpt: toOptionalTrimmedString(body.excerpt),
      content: toOptionalTrimmedString(body.content),
      category: toOptionalTrimmedString(body.category),
      tags: body.tags !== undefined ? normalizeTagsFromBody(body.tags) ?? [] : undefined,
      author: toOptionalTrimmedString(body.author),
      image: toOptionalTrimmedString(body.image),
      sourceName: toOptionalTrimmedString(body.sourceName),
      sourceUrl: toOptionalTrimmedString(body.sourceUrl),
      sourcePublishedAt: toOptionalTrimmedString(body.sourcePublishedAt),
      status: status && isNewsStatus(status) ? status : undefined,
      publishedAt: toOptionalTrimmedString(body.publishedAt),
    });

    return jsonResponse(200, {
      ok: true,
      data: {
        news: updated,
      },
    });
  } catch (error) {
    if (error instanceof NewsNotFoundError) {
      return jsonResponse(404, {
        ok: false,
        error: {
          code: 'not_found',
          message: error.message,
        },
      });
    }

    if (error instanceof NewsConflictError) {
      return jsonResponse(409, {
        ok: false,
        error: {
          code: 'conflict',
          message: error.message,
        },
      });
    }

    console.error('Unable to update news:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to update this news entry right now.',
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

  const authResult = ensureProtectedAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const body = await parseJsonBody(request);
  const newsId = (url.searchParams.get('id') ?? '').trim();

  if (!newsId) {
    return jsonResponse(400, {
      ok: false,
      error: {
        code: 'missing_id',
        message: 'A news id is required via ?id=...',
      },
    });
  }

  const bodyId = toOptionalTrimmedString(body?.id);
  if (bodyId && bodyId !== newsId) {
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
    toOptionalTrimmedString(body?.confirmTitle) ??
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
    const archived = await archiveNews(newsId, { confirmTitle });
    return jsonResponse(200, {
      ok: true,
      data: {
        news: archived,
      },
    });
  } catch (error) {
    if (error instanceof NewsNotFoundError) {
      return jsonResponse(404, {
        ok: false,
        error: {
          code: 'not_found',
          message: error.message,
        },
      });
    }

    if (error instanceof NewsConflictError) {
      return jsonResponse(409, {
        ok: false,
        error: {
          code: 'conflict',
          message: error.message,
        },
      });
    }

    console.error('Unable to archive news:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to archive this news entry right now.',
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
