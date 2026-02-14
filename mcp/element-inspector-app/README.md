# Element Inspector MCP App

MCP App that renders captured element-inspection payloads in a structured UI.

## What It Provides

- Tool: `show-element-inspection`
- Linked UI resource: `ui://element-inspector/mcp-app.html`
- Structured display for selector, tag, page URL, text, bounding box, attributes, and computed styles

## Project Files

- `server.ts`: registers the tool and UI resource
- `main.ts`: runs the MCP server over HTTP (`/mcp`) or stdio
- `mcp-app.html` + `src/mcp-app.ts`: in-host app UI

## Run Locally

```bash
cd mcp/element-inspector-app
npm install
npm run build
npm run serve:http
```

Server endpoint: `http://localhost:3001/mcp`

For stdio mode:

```bash
npm run serve:stdio
```

## Example Tool Input

```json
{
  "pageUrl": "https://ultraction-website.vercel.app/",
  "selector": "header nav a[href='/services']",
  "tagName": "A",
  "textContent": "Services",
  "boundingBox": { "x": 122, "y": 24, "width": 88, "height": 32 },
  "attributes": { "href": "/services", "class": "nav-link" },
  "computedStyles": { "color": "rgb(255, 255, 255)", "font-size": "16px" },
  "notes": "Captured from top navigation"
}
```
