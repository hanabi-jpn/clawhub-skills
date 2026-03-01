#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "airpay-agent",
  version: "1.0.0",
});

server.tool("status", "Check airpay-agent server status", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify({ status: "ok", server: "airpay-agent", version: "1.0.0" }, null, 2) }],
}));

server.tool("help", "Show available commands for airpay-agent", {}, async () => ({
  content: [{ type: "text", text: "Available tools: status, help. See SKILL.md for full documentation." }],
}));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
