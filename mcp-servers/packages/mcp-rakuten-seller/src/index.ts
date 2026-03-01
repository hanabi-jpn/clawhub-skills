#!/usr/bin/env node
/** MCP Server: Rakuten Seller. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const S = "rakuten-seller", V = "1.0.0", D = "Rakuten marketplace management agent for products, orders, reviews, and competitive analysis";
const ENV_VARS = [{ name: "RAKUTEN_SERVICE_SECRET", required: true }, { name: "RAKUTEN_LICENSE_KEY", required: true }, { name: "RAKUTEN_SHOP_URL", required: true }];
const TOOLS = [
  { name: "rakuten_products", description: "List products", inputSchema: { type: "object" as const, properties: { search: { type: "string", description: "Search" } }, required: [] } },
  { name: "rakuten_product", description: "Product details", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "rakuten_product_create", description: "Create product", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "rakuten_product_optimize", description: "SEO optimization", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "rakuten_stock", description: "Inventory overview", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "rakuten_stock_update", description: "Update stock", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" }, quantity: { type: "number", description: "Quantity" } }, required: ["id", "quantity"] } },
  { name: "rakuten_orders", description: "List orders", inputSchema: { type: "object" as const, properties: { status: { type: "string", description: "Status" } }, required: [] } },
  { name: "rakuten_order", description: "Order details", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" } }, required: ["id"] } },
  { name: "rakuten_order_ship", description: "Process shipment", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "ID" }, tracking: { type: "string", description: "Tracking" } }, required: ["id", "tracking"] } },
  { name: "rakuten_reviews", description: "List reviews", inputSchema: { type: "object" as const, properties: { rating: { type: "string", description: "1-5" } }, required: [] } },
  { name: "rakuten_review_reply", description: "AI review reply", inputSchema: { type: "object" as const, properties: { id: { type: "string", description: "Review ID" } }, required: ["id"] } },
  { name: "rakuten_analytics", description: "Sales analytics", inputSchema: { type: "object" as const, properties: { period: { type: "string", description: "day/week/month" } }, required: [] } },
  { name: "rakuten_compete", description: "Competitive analysis", inputSchema: { type: "object" as const, properties: { keyword: { type: "string", description: "Keyword" } }, required: ["keyword"] } },
  { name: "rakuten_sale_prepare", description: "Super SALE preparation", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "rakuten_health", description: "API check", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "help", description: "Show tools", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Version", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") return [`=== ${S} v${V} ===`, D, "", "Tools:", ...TOOLS.map(t => `  ${t.name} - ${t.description}`), "", "Env:", ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : "MISSING"}`)].join("\n");
  if (name === "version") return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn" }, null, 2);
  const tool = TOOLS.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool: ${name}`);
  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0) return `Missing required env vars: ${missing.join(", ")}`;
  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return [`=== Rakuten Seller: ${name} ===`, "", tool.description, "", al || "No args.", "", "Status: Ready."].join("\n");
}
const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => { try { return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] }; } catch (e) { return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true }; } });
async function main() { const t = new StdioServerTransport(); await server.connect(t); process.on("SIGINT", async () => { await server.close(); process.exit(0); }); }
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
