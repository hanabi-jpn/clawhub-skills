#!/usr/bin/env node
/** MCP Server: Freee Agent. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "freee-agent", V = "1.0.0", D = "freee accounting API agent for journal entries, expense management, invoicing, and financial reports";
const ENV_VARS = [{ name: "FREEE_CLIENT_ID", required: true }, { name: "FREEE_CLIENT_SECRET", required: true }, { name: "FREEE_COMPANY_ID", required: true }, { name: "FREEE_REFRESH_TOKEN", required: true }];
const TOOLS = [
  { name: "freee_journal", description: "List journal entries", inputSchema: { type: "object" as const, properties: { from: { type: "string", description: "Start date" }, to: { type: "string", description: "End date" } }, required: [] } },
  { name: "freee_journal_create", description: "Create journal entry", inputSchema: { type: "object" as const, properties: { debit: { type: "string", description: "Debit account" }, credit: { type: "string", description: "Credit account" }, amount: { type: "number", description: "Amount" }, description: { type: "string", description: "Description" } }, required: ["debit", "credit", "amount", "description"] } },
  { name: "freee_journal_suggest", description: "AI account suggestion", inputSchema: { type: "object" as const, properties: { description: { type: "string", description: "Transaction description" } }, required: ["description"] } },
  { name: "freee_expense_create", description: "Register expense", inputSchema: { type: "object" as const, properties: { amount: { type: "number", description: "Amount" }, category: { type: "string", description: "Category" }, description: { type: "string", description: "Description" } }, required: ["amount", "category", "description"] } },
  { name: "freee_expense_report", description: "Expense report", inputSchema: { type: "object" as const, properties: { month: { type: "string", description: "YYYY-MM" } }, required: [] } },
  { name: "freee_expense_receipt", description: "Receipt OCR to expense", inputSchema: { type: "object" as const, properties: { image_path: { type: "string", description: "Receipt image path" } }, required: ["image_path"] } },
  { name: "freee_invoice_create", description: "Create invoice", inputSchema: { type: "object" as const, properties: { customer: { type: "string", description: "Customer" }, items: { type: "string", description: "Items JSON" } }, required: ["customer", "items"] } },
  { name: "freee_invoice_list", description: "List invoices", inputSchema: { type: "object" as const, properties: { status: { type: "string", description: "unpaid/paid/overdue" } }, required: [] } },
  { name: "freee_report_pl", description: "Profit & loss statement", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "month/quarter/year" } }, required: [] } },
  { name: "freee_report_bs", description: "Balance sheet", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "freee_report_tax", description: "Consumption tax summary", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "freee_report_cashflow", description: "Cash flow report", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "freee_close", description: "Month-end closing", inputSchema: { type: "object" as const, properties: { month: { type: "string", description: "YYYY-MM" } }, required: [] } },
  { name: "freee_status", description: "Accounting status overview", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "freee_health", description: "API connectivity check", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`), "", "Env:", ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : "MISSING"}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0) return `Missing required env vars: ${missing.join(", ")}`;
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Freee Agent: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
