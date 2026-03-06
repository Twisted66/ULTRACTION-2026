import type { APIRoute } from 'astro';
import { createJob } from '../../lib/jobs-store';
import { getSampleJobResponse, getSampleListResponse } from '../../lib/gpt-test-data';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Reuse helpers from jobs.ts
function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      // CORS headers for Custom GPT Actions
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-jobs-api-key',
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

async function parseJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    const data = (await request.json()) as Record<string, unknown>;
    return data;
  } catch {
    return null;
  }
}

// Get the OpenAPI spec file path
function getOpenApiSpecPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Go up from src/pages/api to project root, then to docs
  return path.resolve(__dirname, '../../../docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI.yaml');
}

export const GET: APIRoute = async ({ request, url }) => {
  const echo = url.searchParams.get('echo')?.trim().toLowerCase() === 'true' ? true : false;
  const sample = url.searchParams.get('sample')?.trim();
  const spec = url.searchParams.get('spec')?.trim();

  // 1. Echo endpoint
  if (echo) {
    return jsonResponse(200, {
      ok: true,
      message: 'API is reachable',
      timestamp: new Date().toISOString(),
      serverInfo: {
        environment: process.env.NODE_ENV ?? 'development',
      },
    });
  }

  // 2. Sample job endpoint
  if (sample === 'job') {
    return jsonResponse(200, getSampleJobResponse());
  }

  // 3. Sample list endpoint
  if (sample === 'list') {
    return jsonResponse(200, getSampleListResponse());
  }

  // 4. OpenAPI spec endpoint
  if (spec === 'openapi') {
    try {
      const specPath = getOpenApiSpecPath();
      const specContent = readFileSync(specPath, 'utf8');
      return new Response(specContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (error) {
      console.error('Unable to read OpenAPI spec:', error);
      return jsonResponse(500, {
        ok: false,
        error: {
          code: 'spec_not_found',
          message: 'Unable to load OpenAPI specification.',
        },
      });
    }
  }

  // 5. Default: test suite info
  return jsonResponse(200, {
    ok: true,
    data: {
      name: 'ULTRACTION Jobs API Test Suite',
      version: '1.0.0',
      endpoints: ['echo', 'sample=job', 'sample=list', 'spec=openapi', 'create=mock'],
      documentation: '/gpt-test',
    },
  });
};

export const POST: APIRoute = async ({ request, url }) => {
  const createMock = url.searchParams.get('create')?.trim().toLowerCase() === 'mock' ? true : false;

  if (!createMock) {
    return jsonResponse(405, {
      ok: false,
      error: {
        code: 'method_not_allowed',
        message: 'Method not allowed. Use ?create=mock to create a test job.',
      },
    });
  }

  // Require authentication for creating test jobs
  const authResult = ensureWriteAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  // Parse request body for optional overrides
  const body = await parseJsonBody(request);

  // Create test job with [TEST] tag in department
  const title = (body?.title as string)?.trim() ?? 'Test Position';
  const location = (body?.location as string)?.trim() ?? 'Dubai, UAE';
  const description = (body?.description as string)?.trim() ??
    'This is a test job created via the GPT test endpoint. It can be safely deleted.';
  const department = (body?.department as string)?.trim() ?? '[TEST] Department';
  const employmentType = body?.employmentType as string | undefined;
  const postedAt = body?.postedAt as string | undefined;

  try {
    const created = await createJob({
      title,
      location,
      description,
      department,
      employmentType: employmentType?.trim(),
      postedAt,
    });

    return jsonResponse(201, {
      ok: true,
      data: {
        job: created,
      },
    });
  } catch (error) {
    console.error('Unable to create test job:', error);
    return jsonResponse(500, {
      ok: false,
      error: {
        code: 'internal_error',
        message: 'Unable to create test job right now.',
      },
    });
  }
};

// Handle OPTIONS preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-jobs-api-key',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    },
  });
};

export const ALL: APIRoute = async (context) => {
  // Return 405 for unsupported methods (but OPTIONS is handled above)
  const method = context.request.method;
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-jobs-api-key',
      },
    });
  }
  return jsonResponse(405, {
    ok: false,
    error: {
      code: 'method_not_allowed',
      message: 'Method not allowed.',
    },
  });
};
