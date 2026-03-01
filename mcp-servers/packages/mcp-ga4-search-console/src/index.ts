#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "ga4-search-console",
  version: "1.0.0",
});

server.tool("status", "Check ga4-search-console server status", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify({ status: "ok", server: "ga4-search-console", version: "1.0.0" }, null, 2) }],
}));

server.tool("help", "Show available commands for ga4-search-console", {}, async () => ({
  content: [{ type: "text", text: "Available tools: status, help. See SKILL.md for full documentation." }],
}));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
