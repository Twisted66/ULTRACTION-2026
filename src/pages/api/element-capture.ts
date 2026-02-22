import type { APIRoute } from "astro";

type CaptureRecord = {
  id: string;
  createdAt: string;
  targetId?: string;
  pageUrl: string;
  targetPagePath?: string;
  targetSourceFile?: string;
  selector: string;
  tagName: string;
  textContent?: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes: Record<string, string>;
  computedStyles: Record<string, string>;
  title?: string;
  timestamp?: string;
};

const MAX_RECORDS = 100;
const records: CaptureRecord[] = [];
const SUPPORTED_AGENTS = new Set(["generic", "codex", "claude", "gemini", "antigravity"]);
const captureApiKey = process.env.ELEMENT_CAPTURE_API_KEY?.trim() ?? "";

function isCaptureAuthorized(request: Request): boolean {
  if (import.meta.env.DEV) return true;
  if (!captureApiKey) return false;
  const providedKey = request.headers.get("x-element-capture-key")?.trim() ?? "";
  return providedKey.length > 0 && providedKey === captureApiKey;
}

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ ok: false, error: "Element capture API is disabled." }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringMap(value: unknown): Record<string, string> {
  if (!isObject(value)) return {};
  const entries = Object.entries(value).filter((entry) => typeof entry[1] === "string") as Array<[string, string]>;
  return Object.fromEntries(entries);
}

function validatePayload(payload: unknown): Omit<CaptureRecord, "id" | "createdAt"> | null {
  if (!isObject(payload)) return null;

  const targetId = typeof payload.targetId === "string" ? payload.targetId.trim() : "";
  const rawPageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl.trim() : "";
  const rawSelector = typeof payload.selector === "string" ? payload.selector.trim() : "";
  const rawTagName = typeof payload.tagName === "string" ? payload.tagName.trim() : "";
  const targetPagePath = typeof payload.targetPagePath === "string" ? payload.targetPagePath.trim() : "";
  const targetSourceFile = typeof payload.targetSourceFile === "string" ? payload.targetSourceFile.trim() : "";
  const textContent = typeof payload.textContent === "string" ? payload.textContent : undefined;
  const title = typeof payload.title === "string" ? payload.title : undefined;
  const timestamp = typeof payload.timestamp === "string" ? payload.timestamp : undefined;

  const box = isObject(payload.boundingBox) ? payload.boundingBox : {};
  const boundingBox = {
    x: typeof box.x === "number" ? box.x : 0,
    y: typeof box.y === "number" ? box.y : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };

  const tagName = rawTagName || "UNKNOWN";
  const selector = rawSelector || tagName.toLowerCase();
  const pageUrl = rawPageUrl || "about:blank";

  return {
    targetId: targetId || undefined,
    pageUrl,
    targetPagePath: targetPagePath || undefined,
    targetSourceFile: targetSourceFile || undefined,
    selector,
    tagName,
    textContent,
    boundingBox,
    attributes: toStringMap(payload.attributes),
    computedStyles: toStringMap(payload.computedStyles),
    title,
    timestamp,
  };
}

export const POST: APIRoute = async ({ request, url }) => {
  if (!isCaptureAuthorized(request)) {
    return unauthorizedResponse();
  }

  const raw = await request.text();
  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : null;
    // Tolerate double-encoded JSON payloads.
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Invalid JSON syntax";
    return new Response(JSON.stringify({ ok: false, error: `Malformed JSON: ${reason}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = validatePayload(body);
    if (!parsed) {
      const type = Array.isArray(body) ? "array" : typeof body;
      const keys = isObject(body) ? Object.keys(body) : [];
      return new Response(JSON.stringify({ ok: false, error: "Invalid payload", type, keys }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const queryTargetId = (url.searchParams.get("target") ?? "").trim();
    if (queryTargetId && !parsed.targetId) {
      parsed.targetId = queryTargetId;
    }

    const record: CaptureRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...parsed,
    };

    records.unshift(record);
    if (records.length > MAX_RECORDS) records.length = MAX_RECORDS;

    return new Response(JSON.stringify({ ok: true, id: record.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown server error";
    return new Response(JSON.stringify({ ok: false, error: `Server error: ${reason}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET: APIRoute = async ({ request, url }) => {
  if (!isCaptureAuthorized(request)) {
    return unauthorizedResponse();
  }

  const limitRaw = Number(url.searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
  const targetId = (url.searchParams.get("target") ?? "").trim();
  const format = (url.searchParams.get("format") ?? "json").trim().toLowerCase();
  const requestedAgent = (url.searchParams.get("agent") ?? "generic").trim().toLowerCase();
  const agent = SUPPORTED_AGENTS.has(requestedAgent) ? requestedAgent : "generic";
  const filtered = targetId
    ? records.filter((item) => item.targetId === targetId)
    : records;
  const items = filtered.slice(0, limit);

  if (format === "agent") {
    const latest = items[0];
    if (!latest) {
      const emptyMessage = [
        `Agent profile: ${agent}`,
        `Target: ${targetId || "(none)"}`,
        "No capture records found.",
      ].join("\n");
      return new Response(emptyMessage, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    const prompt = [
      `Agent profile: ${agent}`,
      `Target: ${targetId || latest.targetId || "(none)"}`,
      "Task: Review this captured element payload and propose the exact UI/code fix.",
      "Payload:",
      JSON.stringify(latest, null, 2),
    ].join("\n");
    return new Response(prompt, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      targetId: targetId || null,
      count: Math.min(filtered.length, limit),
      items,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
