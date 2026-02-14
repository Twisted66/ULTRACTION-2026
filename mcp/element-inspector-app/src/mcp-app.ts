import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import "./global.css";
import "./mcp-app.css";

type InspectionPayload = {
  summary: string;
  inspection: {
    pageUrl: string;
    selector: string;
    tagName: string;
    textContent?: string;
    boundingBox: { x: number; y: number; width: number; height: number };
    attributes: Record<string, string>;
    computedStyles: Record<string, string>;
    notes?: string;
  };
};

function extractInspection(result: CallToolResult): InspectionPayload | null {
  const payload = (result.structuredContent as InspectionPayload | undefined) ?? null;
  if (!payload?.inspection || !payload?.summary) {
    return null;
  }
  return payload;
}

const mainEl = document.querySelector(".main") as HTMLElement;
const statusEl = document.getElementById("status") as HTMLElement;
const summaryEl = document.getElementById("summary") as HTMLElement;
const selectorEl = document.getElementById("selector") as HTMLElement;
const pageUrlEl = document.getElementById("page-url") as HTMLElement;
const tagNameEl = document.getElementById("tag-name") as HTMLElement;
const textContentEl = document.getElementById("text-content") as HTMLElement;
const boundingBoxEl = document.getElementById("bounding-box") as HTMLElement;
const attributesEl = document.getElementById("attributes") as HTMLElement;
const stylesEl = document.getElementById("styles") as HTMLElement;
const notesEl = document.getElementById("notes") as HTMLElement;

function handleHostContextChanged(ctx: McpUiHostContext) {
  if (ctx.theme) {
    applyDocumentTheme(ctx.theme);
  }
  if (ctx.styles?.variables) {
    applyHostStyleVariables(ctx.styles.variables);
  }
  if (ctx.styles?.css?.fonts) {
    applyHostFonts(ctx.styles.css.fonts);
  }
  if (ctx.safeAreaInsets) {
    mainEl.style.paddingTop = `${ctx.safeAreaInsets.top}px`;
    mainEl.style.paddingRight = `${ctx.safeAreaInsets.right}px`;
    mainEl.style.paddingBottom = `${ctx.safeAreaInsets.bottom}px`;
    mainEl.style.paddingLeft = `${ctx.safeAreaInsets.left}px`;
  }
}

function renderMap(target: HTMLElement, map: Record<string, string>) {
  const keys = Object.keys(map);
  if (keys.length === 0) {
    target.textContent = "None";
    return;
  }
  const lines = keys.sort().map((key) => `${key}: ${map[key]}`);
  target.textContent = lines.join("\n");
}

function renderInspection(result: CallToolResult) {
  const payload = extractInspection(result);
  if (!payload) {
    statusEl.textContent = "No structured inspection data in tool result.";
    return;
  }
  const { inspection, summary } = payload;
  statusEl.textContent = "Inspection loaded.";
  summaryEl.textContent = summary;
  selectorEl.textContent = inspection.selector;
  pageUrlEl.textContent = inspection.pageUrl;
  tagNameEl.textContent = inspection.tagName;
  textContentEl.textContent = inspection.textContent?.trim() || "(empty)";
  boundingBoxEl.textContent = JSON.stringify(inspection.boundingBox, null, 2);
  renderMap(attributesEl, inspection.attributes);
  renderMap(stylesEl, inspection.computedStyles);
  notesEl.textContent = inspection.notes?.trim() || "(none)";
}

const app = new App({ name: "Element Inspector App", version: "1.0.0" });

app.onteardown = async () => {
  return {};
};

app.ontoolinput = (params) => {
  const selector = typeof params.arguments?.selector === "string"
    ? params.arguments.selector
    : "unknown selector";
  statusEl.textContent = `Receiving inspection input for ${selector}...`;
};

app.ontoolresult = (result) => {
  renderInspection(result);
};

app.ontoolcancelled = (params) => {
  statusEl.textContent = `Tool call cancelled: ${params.reason ?? "unknown"}`;
};

app.onerror = console.error;

app.onhostcontextchanged = handleHostContextChanged;

app.connect().then(() => {
  statusEl.textContent = "Connected. Run show-element-inspection to populate this view.";
  const ctx = app.getHostContext();
  if (ctx) {
    handleHostContextChanged(ctx);
  }
});
