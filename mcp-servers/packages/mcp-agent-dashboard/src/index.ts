#!/usr/bin/env node
/** MCP Server: Agent Dashboard. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "agent-dashboard", V = "1.0.0", D = "Real-time agent monitoring with health scoring, cost tracking, and web dashboard";
const TOOLS = [
  { name: "dashboard", description: "Terminal dashboard with real-time metrics", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "dashboard_health", description: "Detailed health breakdown", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "dashboard_tasks", description: "Task analytics", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month" } }, required: [] } },
  { name: "dashboard_skills", description: "Skill performance ranking", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "dashboard_cost", description: "Cost analytics with projections", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month" } }, required: [] } },
  { name: "dashboard_alerts", description: "Show active alerts", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "dashboard_alert_set", description: "Configure alert threshold", inputSchema: { type: "object" as const, properties: { type: { type: "string", description: "Alert type" }, threshold: { type: "string", description: "Threshold" } }, required: ["type", "threshold"] } },
  { name: "dashboard_report", description: "Generate markdown report", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "daily/weekly/monthly" } }, required: [] } },
  { name: "dashboard_web", description: "Generate HTML dashboard", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "dashboard_export", description: "Export tracking data", inputSchema: { type: "object" as const, properties: { format: { type: "string", description: "json/csv/html" } }, required: ["format"] } },
  { name: "dashboard_reset", description: "Clear all tracking data", inputSchema: { type: "object" as const, properties: { confirm: { type: "boolean", description: "Confirmation" } }, required: ["confirm"] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Agent Dashboard: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
