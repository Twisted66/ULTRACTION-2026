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

/**
 * Sets the empty state for pre elements with a visual indicator
 */
function setEmptyState(element: HTMLElement, message: string = "No data") {
  element.textContent = "";
  element.setAttribute("data-empty", "true");
  element.setAttribute("data-empty-text", message);
}

/**
 * Clears the empty state and sets content
 */
function setContent(element: HTMLElement, content: string) {
  element.removeAttribute("data-empty");
  element.removeAttribute("data-empty-text");
  element.textContent = content;
}

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

/**
 * Formats a bounding box object for display
 */
function formatBoundingBox(bbox: { x: number; y: number; width: number; height: number }): string {
  return `Position: x=${bbox.x}, y=${bbox.y}
Size: width=${bbox.width}px, height=${bbox.height}px`;
}

/**
 * Renders a map/object as formatted key-value pairs
 */
function renderMap(target: HTMLElement, map: Record<string, string>) {
  const keys = Object.keys(map);
  if (keys.length === 0) {
    setEmptyState(target, "None");
    return;
  }
  const lines = keys.sort().map((key) => `${key}: ${map[key]}`);
  setContent(target, lines.join("\n"));
}

/**
 * Main render function for inspection results
 */
function renderInspection(result: CallToolResult) {
  const payload = extractInspection(result);
  if (!payload) {
    statusEl.textContent = "No structured inspection data in tool result.";
    return;
  }
  const { inspection, summary } = payload;

  // Update status with success message
  statusEl.textContent = "Inspection loaded successfully.";
  statusEl.style.background = "var(--color-background-info)";

  // Populate all fields
  setContent(summaryEl, summary);
  setContent(selectorEl, inspection.selector);
  setContent(pageUrlEl, inspection.pageUrl);
  setContent(tagNameEl, inspection.tagName);

  // Handle text content - may be empty
  if (inspection.textContent?.trim()) {
    setContent(textContentEl, inspection.textContent.trim());
  } else {
    setEmptyState(textContentEl, "(empty element)");
  }

  // Format bounding box for better readability
  setContent(boundingBoxEl, formatBoundingBox(inspection.boundingBox));

  // Render attributes and styles
  renderMap(attributesEl, inspection.attributes);
  renderMap(stylesEl, inspection.computedStyles);

  // Handle notes - may be empty
  if (inspection.notes?.trim()) {
    setContent(notesEl, inspection.notes.trim());
  } else {
    setEmptyState(notesEl, "(no notes)");
  }
}

/**
 * Initializes the app with empty states
 */
function initializeEmptyStates() {
  setEmptyState(selectorEl, "No selector");
  setEmptyState(pageUrlEl, "No URL");
  setEmptyState(tagNameEl, "No tag");
  setEmptyState(textContentEl, "No text content");
  setEmptyState(boundingBoxEl, "No dimensions");
  setEmptyState(attributesEl, "No attributes");
  setEmptyState(stylesEl, "No styles");
  setEmptyState(notesEl, "No notes");
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
  statusEl.style.background = "var(--color-background-info)";
};

app.ontoolresult = (result) => {
  renderInspection(result);
};

app.ontoolcancelled = (params) => {
  statusEl.textContent = `Tool call cancelled: ${params.reason ?? "unknown"}`;
  statusEl.style.background = "var(--color-background-error)";
  statusEl.style.color = "var(--color-text-error)";
};

app.onerror = (error) => {
  console.error("Element Inspector App Error:", error);
  statusEl.textContent = "An error occurred. Check console for details.";
  statusEl.style.background = "var(--color-background-error)";
  statusEl.style.color = "var(--color-text-error)";
};

app.onhostcontextchanged = handleHostContextChanged;

app.connect().then(() => {
  // Initialize with empty states
  initializeEmptyStates();

  statusEl.textContent = "Connected. Run show-element-inspection to populate this view.";
  statusEl.style.background = "var(--color-background-info)";
  statusEl.style.color = "var(--color-text-info)";

  const ctx = app.getHostContext();
  if (ctx) {
    handleHostContextChanged(ctx);
  }
}).catch((error) => {
  console.error("Failed to connect to MCP host:", error);
  statusEl.textContent = "Failed to connect to MCP host.";
  statusEl.style.background = "var(--color-background-error)";
  statusEl.style.color = "var(--color-text-error)";
});
