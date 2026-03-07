const FALLBACK_API_HEADERS = ['x-jobs-api-key', 'x-news-api-key'] as const;
const SHARED_API_KEY_ENV = 'ULTRACTION_API_KEY';

export function getManagementApiKeyFromRequest(
  request: Request,
  preferredHeaderName: string,
): string | null {
  const headerNames = new Set<string>([preferredHeaderName, ...FALLBACK_API_HEADERS]);

  for (const headerName of headerNames) {
    const headerValue = request.headers.get(headerName)?.trim();
    if (headerValue) {
      return headerValue;
    }
  }

  const authorization = request.headers.get('authorization')?.trim();
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

export function getManagementExpectedApiKey(primaryEnvKey: string): string | null {
  for (const envKey of [primaryEnvKey, SHARED_API_KEY_ENV]) {
    const value = process.env[envKey]?.trim();
    if (value) {
      return value;
    }
  }

  return null;
}

