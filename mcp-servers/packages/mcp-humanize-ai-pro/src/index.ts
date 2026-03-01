#!/usr/bin/env node
/** MCP Server: Humanize AI Pro. Author: hanabi-jpn | License: MIT */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "humanize-ai-pro", V = "1.0.0", D = "Multi-language AI text humanizer with 5 writing modes and statistical evasion";
const TOOLS = [
  { name: "humanize", description: "Humanize text with auto-detected language and casual mode", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text or file path to humanize" } }, required: ["text"] } },
  { name: "humanize_mode", description: "Humanize with specific writing mode (academic/business/casual/creative/social)", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text" }, mode: { type: "string", description: "Writing mode" } }, required: ["text", "mode"] } },
  { name: "humanize_lang", description: "Force output language", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text" }, lang: { type: "string", description: "Language code" } }, required: ["text", "lang"] } },
  { name: "humanize_score", description: "Score text for AI detection probability", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text to score" } }, required: ["text"] } },
  { name: "humanize_analyze", description: "Detailed statistical analysis with all metrics", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text" } }, required: ["text"] } },
  { name: "humanize_batch", description: "Process all text files in directory", inputSchema: { type: "object" as const, properties: { directory: { type: "string", description: "Directory path" } }, required: ["directory"] } },
  { name: "humanize_diff", description: "Show before/after with changes highlighted", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text" } }, required: ["text"] } },
  { name: "humanize_patterns", description: "List all detected AI patterns", inputSchema: { type: "object" as const, properties: { text: { type: "string", description: "Text" } }, required: ["text"] } },
  { name: "help", description: "Show available tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version info", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Humanize AI Pro: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
