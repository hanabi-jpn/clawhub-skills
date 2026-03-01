#!/usr/bin/env node

/**
 * Base MCP Server class for hanabi-jpn skills.
 *
 * Provides reusable infrastructure for building MCP servers from ClawHub skills:
 * - Stdio transport setup
 * - Common tool patterns (help, status, version)
 * - Structured error handling
 * - Environment variable validation
 *
 * Usage:
 *   import { BaseMcpServer, ToolDefinition, EnvVar } from '../shared/base-server.js';
 *   const server = new BaseMcpServer({ name, version, description, tools, envVars });
 *   server.start();
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnvVar {
  name: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface ToolDefinition {
  /** Tool name (snake_case). Example: "fx_status" */
  name: string;
  /** Human-readable description shown in MCP tool listing */
  description: string;
  /** JSON-Schema for the tool's input parameters */
  inputSchema: Record<string, unknown>;
  /**
   * Handler function.  Receives the validated arguments object and
   * returns a text result (or throws for error responses).
   */
  handler: (args: Record<string, unknown>) => Promise<string>;
}

export interface BaseMcpServerOptions {
  /** MCP server name, e.g. "fx-trader-pro" */
  name: string;
  /** Semver version */
  version: string;
  /** One-line description */
  description: string;
  /** Skill-specific tools */
  tools: ToolDefinition[];
  /** Environment variable declarations (for documentation / validation) */
  envVars?: EnvVar[];
}

// ---------------------------------------------------------------------------
// Base MCP Server
// ---------------------------------------------------------------------------

export class BaseMcpServer {
  private server: Server;
  private tools: ToolDefinition[];
  private options: BaseMcpServerOptions;

  constructor(options: BaseMcpServerOptions) {
    this.options = options;
    this.tools = [
      // Built-in tools available on every server
      {
        name: "help",
        description: `Show available tools and usage for ${options.name}`,
        inputSchema: { type: "object", properties: {}, required: [] },
        handler: async () => this.helpText(),
      },
      {
        name: "version",
        description: `Show version information for ${options.name}`,
        inputSchema: { type: "object", properties: {}, required: [] },
        handler: async () =>
          JSON.stringify(
            {
              name: options.name,
              version: options.version,
              description: options.description,
            },
            null,
            2
          ),
      },
      {
        name: "status",
        description: `Show server status and environment variable configuration for ${options.name}`,
        inputSchema: { type: "object", properties: {}, required: [] },
        handler: async () => this.statusText(),
      },
      // Append skill-specific tools
      ...options.tools,
    ];

    this.server = new Server(
      { name: options.name, version: options.version },
      { capabilities: { tools: {} } }
    );

    this.registerHandlers();
  }

  // -----------------------------------------------------------------------
  // Built-in tool helpers
  // -----------------------------------------------------------------------

  private helpText(): string {
    const lines: string[] = [
      `=== ${this.options.name} v${this.options.version} ===`,
      this.options.description,
      "",
      "Available tools:",
      "",
    ];

    for (const tool of this.tools) {
      lines.push(`  ${tool.name}`);
      lines.push(`    ${tool.description}`);
      lines.push("");
    }

    if (this.options.envVars && this.options.envVars.length > 0) {
      lines.push("Environment variables:");
      lines.push("");
      for (const ev of this.options.envVars) {
        const req = ev.required ? "(required)" : `(optional, default: ${ev.default ?? "none"})`;
        lines.push(`  ${ev.name} ${req}`);
        lines.push(`    ${ev.description}`);
      }
    }

    return lines.join("\n");
  }

  private statusText(): string {
    const lines: string[] = [
      `Server: ${this.options.name} v${this.options.version}`,
      `Status: running`,
      `Tools:  ${this.tools.length} registered`,
      "",
    ];

    if (this.options.envVars && this.options.envVars.length > 0) {
      lines.push("Environment variables:");
      for (const ev of this.options.envVars) {
        const val = process.env[ev.name];
        const status = val
          ? "set"
          : ev.required
            ? "MISSING (required)"
            : `not set (default: ${ev.default ?? "none"})`;
        lines.push(`  ${ev.name}: ${status}`);
      }
    }

    return lines.join("\n");
  }

  // -----------------------------------------------------------------------
  // MCP handler registration
  // -----------------------------------------------------------------------

  private registerHandlers(): void {
    // tools/list
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolList: Tool[] = this.tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema as Tool["inputSchema"],
      }));
      return { tools: toolList };
    });

    // tools/call
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const tool = this.tools.find((t) => t.name === name);

      if (!tool) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Unknown tool "${name}". Use the "help" tool to see available tools.`,
            },
          ],
          isError: true,
        };
      }

      try {
        const result = await tool.handler((args as Record<string, unknown>) ?? {});
        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error executing "${name}": ${message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // -----------------------------------------------------------------------
  // Utilities available to sub-classes / tool handlers
  // -----------------------------------------------------------------------

  /** Check that all required env vars are set; returns missing var names. */
  static validateEnvVars(envVars: EnvVar[]): string[] {
    return envVars
      .filter((ev) => ev.required && !process.env[ev.name])
      .map((ev) => ev.name);
  }

  /** Convenience: get an env var or its default. */
  static env(name: string, fallback?: string): string | undefined {
    return process.env[name] ?? fallback;
  }

  // -----------------------------------------------------------------------
  // Start
  // -----------------------------------------------------------------------

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      await this.server.close();
      process.exit(0);
    });
  }
}
