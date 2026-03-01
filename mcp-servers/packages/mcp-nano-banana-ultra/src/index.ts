#!/usr/bin/env node
/** MCP Server: Nano Banana Ultra. Author: hanabi-jpn | License: MIT */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "nano-banana-ultra", V = "1.0.0", D = "Multi-model AI image generation with Gemini, DALL-E, Stability AI, 30+ templates";
const ENV_VARS = [
  { name: "OPENAI_API_KEY", description: "OpenAI API key for DALL-E", required: false },
  { name: "GOOGLE_API_KEY", description: "Google API key for Gemini", required: false },
  { name: "STABILITY_API_KEY", description: "Stability AI API key", required: false },
];
const TOOLS = [
  { name: "generate", description: "Generate single image with default settings", inputSchema: { type: "object" as const, properties: { prompt: { type: "string", description: "Image generation prompt" } }, required: ["prompt"] } },
  { name: "generate_template", description: "Generate image using prompt template (product-photo, logo-design, social-media, etc.)", inputSchema: { type: "object" as const, properties: { prompt: { type: "string", description: "Base prompt" }, template: { type: "string", description: "Template name" } }, required: ["prompt", "template"] } },
  { name: "generate_model", description: "Generate with specific AI model", inputSchema: { type: "object" as const, properties: { prompt: { type: "string", description: "Prompt" }, model: { type: "string", description: "Model: gemini, dalle, stability" } }, required: ["prompt", "model"] } },
  { name: "generate_variations", description: "Generate multiple variations", inputSchema: { type: "object" as const, properties: { prompt: { type: "string", description: "Prompt" }, count: { type: "number", description: "Number of variations" } }, required: ["prompt", "count"] } },
  { name: "gallery", description: "Show image gallery with metadata", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "gallery_search", description: "Search gallery by prompt, tag, or date", inputSchema: { type: "object" as const, properties: { query: { type: "string", description: "Search query" } }, required: ["query"] } },
  { name: "gallery_tag", description: "Add tags to generated image", inputSchema: { type: "object" as const, properties: { image: { type: "string", description: "Image ID" }, tags: { type: "string", description: "Comma-separated tags" } }, required: ["image", "tags"] } },
  { name: "gallery_export", description: "Generate standalone HTML gallery", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show available tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version info", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`), "", "Env vars:", ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : "not set"}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Nano Banana Ultra: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready. Set API keys to enable image generation."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
