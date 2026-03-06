import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

/**
 * OpenAPI Specification Endpoint
 *
 * Serves the CUSTOM_GPT_JOBS_ACTIONS_OPENAPI.yaml file for direct import
 * into Custom GPT Actions configuration.
 *
 * Usage in Custom GPT:
 * 1. Create a Custom GPT at https://chat.openai.com/
 * 2. Go to Configure → Actions
 * 3. Import from: https://your-domain.com/api/openapi.yaml
 * 4. Set authentication: Bearer token (use your JOBS_API_KEY)
 *
 * For local testing with ngrok:
 * ngrok http 4321
 * # Use the https://xxx.ngrok.io/api/openapi.yaml URL
 */

// Get the OpenAPI spec file path
function getOpenApiSpecPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Go up from src/pages/api to project root, then to docs
  return path.resolve(__dirname, '../../../docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI.yaml');
}

export const GET: APIRoute = async () => {
  try {
    const specPath = getOpenApiSpecPath();
    const specContent = readFileSync(specPath, 'utf8');

    return new Response(specContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-yaml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        // CORS headers for Custom GPT import
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-jobs-api-key',
      },
    });
  } catch (error) {
    console.error('Unable to read OpenAPI spec:', error);

    // Return a helpful error message
    const errorResponse = {
      ok: false,
      error: {
        code: 'spec_not_found',
        message: 'Unable to load OpenAPI specification.',
        hint: 'Ensure docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI.yaml exists.',
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-jobs-api-key',
    },
  });
};

// Other methods not allowed
export const ALL: APIRoute = async () =>
  new Response(JSON.stringify({
    ok: false,
    error: {
      code: 'method_not_allowed',
      message: 'Only GET method is allowed for OpenAPI spec.',
    },
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Allow': 'GET, OPTIONS',
    },
  });
