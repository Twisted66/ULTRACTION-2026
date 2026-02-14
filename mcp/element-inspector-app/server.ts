import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

const boundingBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const inspectionInputSchema = z.object({
  pageUrl: z.string().url(),
  selector: z.string().min(1),
  tagName: z.string().min(1),
  textContent: z.string().optional(),
  boundingBox: boundingBoxSchema,
  attributes: z.record(z.string(), z.string()).default({}),
  computedStyles: z.record(z.string(), z.string()).default({}),
  notes: z.string().optional(),
});

type InspectionInput = z.infer<typeof inspectionInputSchema>;

function buildSummary(input: InspectionInput): string {
  const text = input.textContent?.trim() ? ` text="${input.textContent.trim().slice(0, 80)}"` : "";
  return `${input.tagName} at ${input.selector}${text}`;
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Element Inspector MCP App",
    version: "1.0.0",
  });

  const resourceUri = "ui://element-inspector/mcp-app.html";

  registerAppTool(
    server,
    "show-element-inspection",
    {
      title: "Show Element Inspection",
      description: "Display a captured element inspection payload inside an interactive MCP App view.",
      inputSchema: inspectionInputSchema.shape,
      outputSchema: z.object({
        summary: z.string(),
        inspection: inspectionInputSchema,
      }),
      _meta: { ui: { resourceUri } },
    },
    async (input): Promise<CallToolResult> => {
      const parsed = inspectionInputSchema.parse(input);
      const summary = buildSummary(parsed);

      return {
        content: [
          {
            type: "text",
            text: `Inspection captured: ${summary}`,
          },
        ],
        structuredContent: {
          summary,
          inspection: parsed,
        },
      };
    },
  );

  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    },
  );

  return server;
}
