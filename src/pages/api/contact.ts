import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/graph-mail';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_RETENTION_MS = RATE_LIMIT_WINDOW_MS * 2;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

const SUBJECT_LABELS: Record<string, string> = {
  project: 'New Project Inquiry',
  careers: 'Careers',
  other: 'Other',
};

// Allowed file extensions and MIME types
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.zip', '.rar'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/octet-stream',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  attachment?: File;
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
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getFieldValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function parseRequestBody(request: Request): Promise<ContactRequestBody | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const data = (await request.json()) as Partial<ContactRequestBody>;
    return {
      name: (data.name ?? '').trim(),
      email: (data.email ?? '').trim(),
      subject: (data.subject ?? '').trim().toLowerCase(),
      message: (data.message ?? '').trim(),
      company: (data.company ?? '').trim(),
    };
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();
    const attachment = formData.get('attachment') as File | null;
    return {
      name: getFieldValue(formData.get('name')),
      email: getFieldValue(formData.get('email')),
      subject: getFieldValue(formData.get('subject')).toLowerCase(),
      message: getFieldValue(formData.get('message')),
      company: getFieldValue(formData.get('company')),
      attachment: attachment && attachment.size > 0 ? attachment : undefined,
    };
  }

  return null;
}

function validateBody(body: ContactRequestBody): Record<string, string> {
  const errors: Record<string, string> = {};

  if (body.name.length < 2 || body.name.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters.';
  }

  if (!isValidEmail(body.email) || body.email.length > 254) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!SUBJECT_LABELS[body.subject]) {
    errors.subject = 'Please select a valid subject.';
  }

  if (body.message.length < 10 || body.message.length > 5_000) {
    errors.message = 'Message must be between 10 and 5000 characters.';
  }

  // Validate attachment if present
  if (body.attachment) {
    const file = body.attachment;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.attachment = 'File size must be less than 10MB.';
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.attachment = 'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG, ZIP, RAR.';
    }

    // Check MIME type (if available)
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      errors.attachment = 'Invalid file type.';
    }
  }

  return errors;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [entryIp, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_RETENTION_MS) {
      rateLimitMap.delete(entryIp);
    }
  }

  const existing = rateLimitMap.get(ip);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  existing.count += 1;
  rateLimitMap.set(ip, existing);
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  if (isRateLimited(ip)) {
    return jsonResponse(429, {
      ok: false,
      message: 'Too many requests. Please wait a minute and try again.',
    });
  }

  const body = await parseRequestBody(request);
  if (!body) {
    return jsonResponse(415, {
      ok: false,
      message: 'Unsupported content type.',
    });
  }

  if (body.company) {
    return jsonResponse(200, {
      ok: true,
      message: 'Your message has been sent.',
    });
  }

  const fieldErrors = validateBody(body);
  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(400, {
      ok: false,
      message: 'Please fix the highlighted fields and try again.',
      fieldErrors,
    });
  }

  try {
    await sendContactEmail({
      name: body.name,
      email: body.email,
      subject: body.subject,
      subjectLabel: SUBJECT_LABELS[body.subject],
      message: body.message,
      ip,
      userAgent,
      submittedAtIso: new Date().toISOString(),
      attachment: body.attachment,
    });

    return jsonResponse(200, {
      ok: true,
      message: 'Your message has been sent.',
    });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return jsonResponse(500, {
      ok: false,
      message: 'Unable to send your message right now. Please try again shortly.',
    });
  }
};

export const ALL: APIRoute = async () =>
  jsonResponse(405, {
    ok: false,
    message: 'Method not allowed.',
  });
