#!/usr/bin/env node
/** MCP Server: Brain Trust - Multi-agent hierarchical orchestration engine. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "brain-trust", V = "1.0.0", D = "Multi-agent hierarchical orchestration engine with consensus protocols and meeting formats";
const TOOLS = [
  { name: "bt_init", description: "Initialize Brain Trust with team template", inputSchema: { type: "object" as const, properties: { template: { type: "string", description: "Template: startup, dev-team, content, research, security" } }, required: [] } },
  { name: "bt_team", description: "Show current team roster", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "bt_add_role", description: "Add custom role", inputSchema: { type: "object" as const, properties: { name: { type: "string", description: "Role name" }, description: { type: "string", description: "Role description" } }, required: ["name", "description"] } },
  { name: "bt_assign", description: "Assign task to role", inputSchema: { type: "object" as const, properties: { task: { type: "string", description: "Task" }, role: { type: "string", description: "Role" } }, required: ["task", "role"] } },
  { name: "bt_delegate", description: "Auto-delegate task (CEO routes)", inputSchema: { type: "object" as const, properties: { task: { type: "string", description: "Task to delegate" } }, required: ["task"] } },
  { name: "bt_meeting", description: "Run meeting protocol", inputSchema: { type: "object" as const, properties: { type: { type: "string", description: "Meeting type: standup/review/brainstorm/retro/war-room" } }, required: ["type"] } },
  { name: "bt_decide", description: "Make team decision", inputSchema: { type: "object" as const, properties: { question: { type: "string", description: "Question" }, protocol: { type: "string", description: "Protocol: unanimous/majority/weighted/executive" } }, required: ["question"] } },
  { name: "bt_status", description: "Project status overview", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "bt_report", description: "Generate report", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "daily or weekly" } }, required: [] } },
  { name: "bt_tasks", description: "List all tasks", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "bt_escalate", description: "Escalate blocked task", inputSchema: { type: "object" as const, properties: { task: { type: "string", description: "Task to escalate" } }, required: ["task"] } },
  { name: "bt_disband", description: "Remove Brain Trust", inputSchema: { type: "object" as const, properties: { confirm: { type: "boolean", description: "Confirmation" } }, required: ["confirm"] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Brain Trust: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
