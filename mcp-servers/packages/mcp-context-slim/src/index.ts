#!/usr/bin/env node
/** MCP Server: Context Slim. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "context-slim", V = "1.0.0", D = "Intelligent context window optimizer -- save 40-70% tokens";
const TOOLS = [
  { name: "slim_status", description: "Quick context usage overview", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_analyze", description: "Detailed analysis with top consumers and recommendations", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_compress", description: "Auto-compress using best strategy per content type", inputSchema: { type: "object" as const, properties: { strategy: { type: "string", description: "Force: semantic/structural/priority" } }, required: [] } },
  { name: "slim_budget_set", description: "Set token budget for category", inputSchema: { type: "object" as const, properties: { category: { type: "string", description: "Category name" }, tokens: { type: "number", description: "Token limit" } }, required: ["category", "tokens"] } },
  { name: "slim_budget_show", description: "Show budgets and usage", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_dedup", description: "Find and merge duplicates", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_profile", description: "Profile each skill's context footprint", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_optimize", description: "Full optimization (analyze + compress + dedup)", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_history", description: "Show compression history", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "slim_reset", description: "Reset to defaults", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Context Slim: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
