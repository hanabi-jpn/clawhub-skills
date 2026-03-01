#!/usr/bin/env node
/** MCP Server: PayPay Biz. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "paypay-biz", V = "1.0.0", D = "PayPay for Business API agent for QR payments, analytics, and subscription management";
const ENV_VARS = [{ name: "PAYPAY_API_KEY", required: true }, { name: "PAYPAY_API_SECRET", required: true }, { name: "PAYPAY_MERCHANT_ID", required: true }];
const TOOLS = [
  { name: "paypay_status", description: "Today's payment summary", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "paypay_payments", description: "Payment list", inputSchema: { type: "object" as const, properties: { from: { type: "string", description: "Start" }, to: { type: "string", description: "End" } }, required: [] } },
  { name: "paypay_payment", description: "Payment details", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "paypay_create_qr", description: "Generate QR code (MPM)", inputSchema: { type: "object" as const, properties: { amount: { type: "number", description: "Amount" }, description: { type: "string", description: "Description" } }, required: ["amount", "description"] } },
  { name: "paypay_charge", description: "Barcode payment (CPM)", inputSchema: { type: "object" as const, properties: { barcode: { type: "string", description: "Barcode" }, amount: { type: "number", description: "Amount" } }, required: ["barcode", "amount"] } },
  { name: "paypay_refund", description: "Process refund", inputSchema: { type: "object" as const, properties: { payment_id: { type: "string", description: "Payment ID" }, amount: { type: "number", description: "Amount (optional)" } }, required: ["payment_id"] } },
  { name: "paypay_analytics", description: "Sales analytics", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month" } }, required: [] } },
  { name: "paypay_deposits", description: "Settlement schedule", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "paypay_fees", description: "Fee calculation", inputSchema: { type: "object" as const, properties: { month: { type: "string", description: "YYYY-MM" } }, required: [] } },
  { name: "paypay_reconcile", description: "Daily reconciliation", inputSchema: { type: "object" as const, properties: { date: { type: "string", description: "YYYY-MM-DD" } }, required: [] } },
  { name: "paypay_subscription_list", description: "List subscriptions", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "paypay_subscription_create", description: "Create recurring charge", inputSchema: { type: "object" as const, properties: { user_auth_id: { type: "string", description: "User" }, amount: { type: "number", description: "Amount" } }, required: ["user_auth_id", "amount"] } },
  { name: "paypay_health", description: "API check", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`), "", "Env:", ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : "MISSING"}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0) return `Missing: ${missing.join(", ")}`;
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== PayPay Biz: ${name} ===`, "", tool.description, "", al || "No args.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
