#!/usr/bin/env node
/** MCP Server: Summarize Pro - 7-mode intelligent summarizer with Chain-of-Density, 8 languages, and smart caching. Author: hanabi-jpn | License: MIT */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "summarize-pro", V = "1.0.0", D = "7-mode intelligent summarizer with Chain-of-Density, 8 languages, and smart caching";
const TOOLS = [
  { name: "summarize", description: "Summarize content with auto-detected settings", inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "URL, file path, or text to summarize" } }, required: ["source"] } },
  { name: "summarize_mode", description: "Summarize with specific output format (bullets/executive/academic/mindmap/table/timeline/qa)", inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "Source" }, mode: { type: "string", description: "Output mode" } }, required: ["source", "mode"] } },
  { name: "summarize_depth", description: "Summarize with specific detail level (shallow/standard/deep/exhaustive)", inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "Source" }, depth: { type: "string", description: "Depth level" } }, required: ["source", "depth"] } },
  { name: "summarize_lang", description: "Summarize and output in specific language", inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "Source" }, lang: { type: "string", description: "Language code: en/ja/zh/ko/es/fr/de/pt" } }, required: ["source", "lang"] } },
  { name: "summarize_chain_of_density", description: "Force Chain-of-Density 3-pass compression", inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "Source" } }, required: ["source"] } },
  { name: "summarize_compare", description: "Compare and contrast multiple sources", inputSchema: { type: "object" as const, properties: { source1: { type: "string", description: "First source" }, source2: { type: "string", description: "Second source" } }, required: ["source1", "source2"] } },
  { name: "summarize_cache_list", description: "Show cached summaries with metadata", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "summarize_cache_clear", description: "Delete all cached summaries", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show available tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version info", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") { return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n"); }
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Summarize Pro: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); process.on("SIGTERM", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
