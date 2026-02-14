import type { APIRoute } from "astro";

type CaptureRecord = {
  id: string;
  createdAt: string;
  pageUrl: string;
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

  const pageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl : "";
  const selector = typeof payload.selector === "string" ? payload.selector : "";
  const tagName = typeof payload.tagName === "string" ? payload.tagName : "";
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

  if (!pageUrl || !selector || !tagName) return null;

  return {
    pageUrl,
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = validatePayload(body);
    if (!parsed) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Malformed JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const limitRaw = Number(url.searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
  return new Response(
    JSON.stringify({
      ok: true,
      count: Math.min(records.length, limit),
      items: records.slice(0, limit),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
