#!/usr/bin/env node
/**
 * MCP Server: Capability Evolver Pro
 * Safe sandboxed self-evolution engine with 5-layer safety, automatic rollback, and evolution dashboard
 * Auto-generated from capability-evolver-pro/SKILL.md
 * Author: hanabi-jpn | License: MIT
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const SERVER_NAME = "capability-evolver-pro";
const SERVER_VERSION = "1.0.0";
const SERVER_DESCRIPTION = "Safe sandboxed self-evolution engine with 5-layer safety, automatic rollback, and evolution dashboard";
const ENV_VARS: Array<{ name: string; description: string; required: boolean }> = [];

const TOOLS = [
  { name: "evolve", description: "Run one evolution cycle", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_continuous", description: "Background evolution loop with configurable interval", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_review", description: "Human-in-the-loop evolution mode", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_strategy", description: "Force specific evolution strategy", inputSchema: { type: "object" as const, properties: { strategy: { type: "string", description: "Strategy: repair, optimize, innovate, or harden" } }, required: ["strategy"] } },
  { name: "evolve_tier", description: "Override safety tier", inputSchema: { type: "object" as const, properties: { tier: { type: "string", description: "Tier: conservative, balanced, or aggressive" } }, required: ["tier"] } },
  { name: "evolve_status", description: "Display evolution status, performance metrics, and pending candidates", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_history", description: "Show last 20 evolution events with details", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_rollback", description: "Restore to a previous checkpoint", inputSchema: { type: "object" as const, properties: { checkpoint_id: { type: "string", description: "Checkpoint ID to restore" } }, required: [] } },
  { name: "evolve_dashboard", description: "Generate comprehensive evolution dashboard report", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "evolve_reset", description: "Reset all evolution data (requires confirmation)", inputSchema: { type: "object" as const, properties: { confirm: { type: "boolean", description: "Safety confirmation" } }, required: ["confirm"] } },
  { name: "help", description: "Show available tools and usage", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "version", description: "Show version information", inputSchema: { type: "object" as const, properties: {}, required: [] } },
];

async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "help": {
      const lines = [`=== ${SERVER_NAME} v${SERVER_VERSION} ===`, SERVER_DESCRIPTION, "", "Available tools:"];
      for (const tool of TOOLS) lines.push(`  ${tool.name} - ${tool.description}`);
      return lines.join("\n");
    }
    case "version":
      return JSON.stringify({ name: SERVER_NAME, version: SERVER_VERSION, description: SERVER_DESCRIPTION, author: "hanabi-jpn" }, null, 2);
    default: {
      const tool = TOOLS.find(t => t.name === name);
      if (!tool) throw new Error(`Unknown tool: ${name}`);
      const argLines = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
      return [`=== Capability Evolver Pro: ${name} ===`, "", tool.description, "", argLines ? `Arguments:\n${argLines}` : "No arguments provided.", "", "Status: Ready. Configure environment and connect to execute."].join("\n");
    }
  }
}

const server = new Server({ name: SERVER_NAME, version: SERVER_VERSION }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, (args as Record<string, unknown>) ?? {});
    return { content: [{ type: "text" as const, text: result }] };
  } catch (error) {
    return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
  }
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.on("SIGINT", async () => { await server.close(); process.exit(0); });
  process.on("SIGTERM", async () => { await server.close(); process.exit(0); });
}
main().catch((err) => { console.error("Fatal error:", err); process.exit(1); });
