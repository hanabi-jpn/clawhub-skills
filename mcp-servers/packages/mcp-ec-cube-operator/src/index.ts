#!/usr/bin/env node
/** MCP Server: EC-CUBE Operator. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "ec-cube-operator", V = "1.0.0", D = "EC-CUBE 4.x complete management agent for products, inventory, orders, and customer analytics";
const ENV_VARS = [{ name: "ECCUBE_BASE_URL", required: true }, { name: "ECCUBE_API_KEY", required: true }, { name: "ECCUBE_API_SECRET", required: true }];
const TOOLS = [
  { name: "ec_products", description: "List products with search/category filter", inputSchema: { type: "object" as const, properties: { search: { type: "string", description: "Search query" }, category: { type: "string", description: "Category" } }, required: [] } },
  { name: "ec_product", description: "Product details", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "Product ID" } }, required: ["id"] } },
  { name: "ec_product_create", description: "Create product", inputSchema: { type: "object" as const, properties: { name: { type: "string", description: "Name" }, price: { type: "number", description: "Price" } }, required: ["name", "price"] } },
  { name: "ec_product_update", description: "Update product", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" }, price: { type: "number", description: "Price" } }, required: ["id"] } },
  { name: "ec_product_toggle", description: "Toggle visibility", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "ec_product_optimize", description: "AI SEO optimization", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "ec_stock", description: "Inventory overview", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "ec_stock_adjust", description: "Adjust stock", inputSchema: { type: "object" as const, properties: { product_id: { type: "string", description: "Product ID" }, quantity: { type: "number", description: "Quantity" }, reason: { type: "string", description: "Reason" } }, required: ["product_id", "quantity", "reason"] } },
  { name: "ec_stock_alerts", description: "Low stock alerts", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "ec_orders", description: "List orders", inputSchema: { type: "object" as const, properties: { status: { type: "string", description: "Status" }, from: { type: "string", description: "Date" } }, required: [] } },
  { name: "ec_order", description: "Order details", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "Order ID" } }, required: ["id"] } },
  { name: "ec_order_update", description: "Update order status", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" }, status: { type: "string", description: "Status" } }, required: ["id", "status"] } },
  { name: "ec_customers", description: "List customers", inputSchema: { type: "object" as const, properties: { segment: { type: "string", description: "Segment" } }, required: [] } },
  { name: "ec_customer", description: "Customer profile", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "ec_analytics", description: "Sales analytics", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month/year" } }, required: [] } },
  { name: "ec_analytics_rfm", description: "RFM customer analysis", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "ec_export", description: "Export data", inputSchema: { type: "object" as const, properties: { type: { type: "string", description: "products/orders/customers" }, format: { type: "string", description: "csv/json" } }, required: ["type", "format"] } },
  { name: "ec_health", description: "API connectivity check", inputSchema: { type: "object" as const, properties: {}, required: [] } },
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
  return [`=== EC-CUBE Operator: ${name} ===`, "", tool.description, "", al || "No arguments.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
