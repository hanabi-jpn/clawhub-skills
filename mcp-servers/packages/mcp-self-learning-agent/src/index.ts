#!/usr/bin/env node
/**
 * MCP Server: Self-Learning Agent
 * Cross-project learning engine with automatic failure capture and context-aware memory compression
 * Author: hanabi-jpn | License: MIT
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const SERVER_NAME = "self-learning-agent";
const SERVER_VERSION = "1.0.0";
const SERVER_DESCRIPTION = "Cross-project learning engine with automatic failure capture and context-aware memory compression";

const TOOLS = [
  { name: "learn", description: "Manually log a learning", inputSchema: { type: "object" as const, properties: { description: { type: "string", description: "Learning description" } }, required: ["description"] } },
  { name: "learn_auto", description: "Toggle automatic learning mode", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "learn_recall", description: "Search knowledge base for relevant learnings", inputSchema: { type: "object" as const, properties: { topic: { type: "string", description: "Topic to search for" } }, required: ["topic"] } },
  { name: "learn_stats", description: "Show learning analytics and knowledge base size", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "learn_promote", description: "Force promotion check for project-level learnings to global", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "learn_export", description: "Export all learnings as JSON", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "learn_import", description: "Import learnings from JSON file", inputSchema: { type: "object" as const, properties: { file: { type: "string", description: "Path to learnings JSON file" } }, required: ["file"] } },
  { name: "learn_prune", description: "Clean up knowledge base by removing stale or low-value entries", inputSchema: { type: "object" as const, properties: {}, required: [] } },
  { name: "learn_graph", description: "Show knowledge graph visualization", inputSchema: { type: "object" as const, properties: {}, required: [] } },
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
      return [`=== Self-Learning Agent: ${name} ===`, "", tool.description, "", argLines ? `Arguments:\n${argLines}` : "No arguments provided.", "", "Status: Ready."].join("\n");
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
