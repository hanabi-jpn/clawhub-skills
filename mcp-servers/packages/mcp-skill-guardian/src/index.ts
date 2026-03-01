#!/usr/bin/env node
/** MCP Server: Skill Guardian - 5-layer security scanner for AI agent skills. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "skill-guardian", V = "1.0.0", D = "5-layer security scanner for AI agent skills";
const TOOLS = [
  { name: "guard_scan", description: "Full 5-layer security scan of a skill", inputSchema: { type: "object" as const, properties: { skill: { type: "string", description: "Skill slug or path" } }, required: ["skill"] } },
  { name: "guard_audit", description: "Scan ALL installed skills", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "guard_report", description: "Generate comprehensive security report", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "guard_monitor", description: "Continuous monitoring mode", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "guard_score", description: "Quick risk score for a skill", inputSchema: { type: "object" as const, properties: { skill: { type: "string", description: "Skill slug" } }, required: ["skill"] } },
  { name: "guard_block", description: "Add skill to blocklist", inputSchema: { type: "object" as const, properties: { skill: { type: "string", description: "Skill slug" } }, required: ["skill"] } },
  { name: "guard_allow", description: "Remove from blocklist", inputSchema: { type: "object" as const, properties: { skill: { type: "string", description: "Skill slug" } }, required: ["skill"] } },
  { name: "guard_update_db", description: "Update threat signature database", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "guard_history", description: "Show scan history", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show available tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Skill Guardian: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
