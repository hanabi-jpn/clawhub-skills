#!/usr/bin/env node
/** MCP Server: LINE Agent. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "line-agent", V = "1.0.0", D = "LINE Messaging API agent for automated customer support, CRM, and marketing automation";
const ENV_VARS = [{ name: "LINE_CHANNEL_ACCESS_TOKEN", required: true }, { name: "LINE_CHANNEL_SECRET", required: true }, { name: "LINE_LIFF_ID", required: false }, { name: "LINE_NOTIFY_TOKEN", required: false }];
const TOOLS = [
  { name: "line_send", description: "Send message to user", inputSchema: { type: "object" as const, properties: { target: { type: "string", description: "User ID or 'all'" }, message: { type: "string", description: "Message" } }, required: ["target", "message"] } },
  { name: "line_send_flex", description: "Send Flex Message", inputSchema: { type: "object" as const, properties: { user_id: { type: "string", description: "User ID" }, template: { type: "string", description: "Template" } }, required: ["user_id", "template"] } },
  { name: "line_broadcast", description: "Broadcast to all followers", inputSchema: { type: "object" as const, properties: { message: { type: "string", description: "Message" } }, required: ["message"] } },
  { name: "line_menu_list", description: "List rich menus", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "line_menu_create", description: "Create rich menu", inputSchema: { type: "object" as const, properties: { template: { type: "string", description: "Template" } }, required: ["template"] } },
  { name: "line_users", description: "List recent active users", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "line_user", description: "Full user profile", inputSchema: { type: "object" as const, properties: { user_id: { type: "string", description: "User ID" } }, required: ["user_id"] } },
  { name: "line_segment_create", description: "Create user segment", inputSchema: { type: "object" as const, properties: { name: { type: "string", description: "Name" }, criteria: { type: "string", description: "Criteria" } }, required: ["name", "criteria"] } },
  { name: "line_auto_add", description: "Add auto-response rule", inputSchema: { type: "object" as const, properties: { keyword: { type: "string", description: "Keyword" }, response: { type: "string", description: "Response" } }, required: ["keyword", "response"] } },
  { name: "line_auto_list", description: "List auto-response rules", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "line_stats", description: "Analytics dashboard", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month" } }, required: [] } },
  { name: "line_quota", description: "Check message quota", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "line_health", description: "API connectivity check", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`), "", "Env:", ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : e.required ? "MISSING" : "not set"}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0) return `Missing required env vars: ${missing.join(", ")}`;
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== LINE Agent: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
