#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# generate-package.sh
#
# Generates a complete MCP server package from a ClawHub skill's SKILL.md.
#
# Usage:
#   ./scripts/generate-package.sh <skill-directory-name>
#   ./scripts/generate-package.sh fx-trader-pro
#
# Reads:  /Users/ishiharatatsuya/clawhub-skills/<skill-name>/SKILL.md
# Writes: mcp-servers/packages/mcp-<skill-name>/
#           ├── package.json
#           ├── tsconfig.json
#           ├── server.json
#           └── src/index.ts
# =============================================================================

SKILLS_ROOT="/Users/ishiharatatsuya/clawhub-skills"
MCP_ROOT="/Users/ishiharatatsuya/clawhub-skills/mcp-servers"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <skill-directory-name>"
  echo "Example: $0 fx-trader-pro"
  exit 1
fi

SKILL_NAME="$1"
SKILL_DIR="${SKILLS_ROOT}/${SKILL_NAME}"
SKILL_MD="${SKILL_DIR}/SKILL.md"

if [ ! -f "${SKILL_MD}" ]; then
  echo "ERROR: ${SKILL_MD} not found"
  exit 1
fi

PKG_NAME="mcp-${SKILL_NAME}"
PKG_DIR="${MCP_ROOT}/packages/${PKG_NAME}"

echo "==> Generating MCP package: ${PKG_NAME}"
echo "    Source: ${SKILL_MD}"
echo "    Target: ${PKG_DIR}"

# ---------------------------------------------------------------------------
# Parse SKILL.md
# ---------------------------------------------------------------------------

# Extract name from frontmatter or first heading
DISPLAY_NAME=""
if head -5 "${SKILL_MD}" | grep -q "^---"; then
  # Has YAML frontmatter
  DISPLAY_NAME=$(sed -n '/^---$/,/^---$/{ /^name:/{ s/^name:[[:space:]]*["'"'"']*//; s/["'"'"']*[[:space:]]*$//; p; } }' "${SKILL_MD}" | head -1)
fi
if [ -z "${DISPLAY_NAME}" ]; then
  # Try first h1 heading
  DISPLAY_NAME=$(grep -m1 "^# " "${SKILL_MD}" | sed 's/^# //')
fi
if [ -z "${DISPLAY_NAME}" ]; then
  DISPLAY_NAME="${SKILL_NAME}"
fi

# Extract description from frontmatter or > blockquote
DESCRIPTION=""
if head -20 "${SKILL_MD}" | grep -q "^description:"; then
  DESCRIPTION=$(sed -n '/^description:/{ s/^description:[[:space:]]*["'"'"']*//; s/["'"'"']*[[:space:]]*$//; p; }' "${SKILL_MD}" | head -1)
fi
if [ -z "${DESCRIPTION}" ]; then
  DESCRIPTION=$(grep -m1 "^> " "${SKILL_MD}" | sed 's/^> //')
fi
if [ -z "${DESCRIPTION}" ]; then
  DESCRIPTION="MCP server for ${DISPLAY_NAME}"
fi

# Extract version from frontmatter
VERSION=""
if head -20 "${SKILL_MD}" | grep -q "^version:"; then
  VERSION=$(sed -n '/^version:/{ s/^version:[[:space:]]*["'"'"']*//; s/["'"'"']*[[:space:]]*$//; p; }' "${SKILL_MD}" | head -1)
fi
if [ -z "${VERSION}" ]; then
  VERSION="1.0.0"
fi

# Extract tags from frontmatter
TAGS_LINE=""
IN_TAGS=false
while IFS= read -r line; do
  if [[ "${line}" =~ ^tags: ]]; then
    IN_TAGS=true
    continue
  fi
  if ${IN_TAGS}; then
    if [[ "${line}" =~ ^[[:space:]]*-[[:space:]]+(.*) ]]; then
      tag="${BASH_REMATCH[1]}"
      if [ -z "${TAGS_LINE}" ]; then
        TAGS_LINE="\"${tag}\""
      else
        TAGS_LINE="${TAGS_LINE}, \"${tag}\""
      fi
    else
      IN_TAGS=false
    fi
  fi
done < "${SKILL_MD}"

# Extract environment variables
# Look for lines like: - `ENV_VAR_NAME` --- description
# or: - `ENV_VAR_NAME` -- description
# or: - ENV_VAR_NAME -- description
ENV_VARS_JSON="[]"
ENV_VARS_TS=""
ENVVAR_BLOCK=""

# Capture environment variable section
IN_ENV=false
while IFS= read -r line; do
  # Detect start of environment variables section
  if [[ "${line}" =~ ^###.*[Ee]nvironment|^###.*[Ss]etup|^Environment.variables ]]; then
    IN_ENV=true
    ENVVAR_BLOCK=""
    continue
  fi
  if ${IN_ENV}; then
    # End on next section
    if [[ "${line}" =~ ^### ]] && ! [[ "${line}" =~ [Ee]nvironment|[Ss]etup ]]; then
      IN_ENV=false
      continue
    fi
    # Capture env var lines
    if [[ "${line}" =~ ^\-[[:space:]]+\`([A-Z_][A-Z0-9_]+)\` ]]; then
      ENVVAR_BLOCK="${ENVVAR_BLOCK}${line}"$'\n'
    elif [[ "${line}" =~ ^\-[[:space:]]+([A-Z_][A-Z0-9_]+)[[:space:]] ]]; then
      ENVVAR_BLOCK="${ENVVAR_BLOCK}${line}"$'\n'
    fi
  fi
done < "${SKILL_MD}"

# Parse env vars into JSON array and TypeScript code
ENV_VARS_JSON="["
ENV_VARS_TS=""
FIRST_ENV=true
while IFS= read -r line; do
  if [ -z "${line}" ]; then continue; fi

  # Extract var name
  VAR_NAME=""
  if [[ "${line}" =~ \`([A-Z_][A-Z0-9_]+)\` ]]; then
    VAR_NAME="${BASH_REMATCH[1]}"
  elif [[ "${line}" =~ ^\-[[:space:]]+([A-Z_][A-Z0-9_]+) ]]; then
    VAR_NAME="${BASH_REMATCH[1]}"
  fi

  if [ -z "${VAR_NAME}" ]; then continue; fi

  # Extract description (everything after the var name pattern)
  VAR_DESC=$(echo "${line}" | sed 's/^.*`[A-Z_][A-Z0-9_]*`[[:space:]]*[—–-]*//' | sed 's/^[[:space:]]*//' | sed 's/^.*[A-Z_][A-Z0-9_]*[[:space:]]*[—–-]*//' | sed 's/^[[:space:]]*//')
  if [ -z "${VAR_DESC}" ]; then
    VAR_DESC="${VAR_NAME}"
  fi
  # Escape quotes in description
  VAR_DESC=$(echo "${VAR_DESC}" | sed 's/"/\\"/g')

  # Determine if required
  REQUIRED="false"
  if echo "${line}" | grep -qi "required\|必須"; then
    REQUIRED="true"
  fi
  if echo "${line}" | grep -qi "optional\|任意"; then
    REQUIRED="false"
  fi
  # Heuristic: first 1-3 env vars in a list are usually required
  # (unless explicitly marked optional)
  if ! echo "${line}" | grep -qi "optional\|任意\|default"; then
    REQUIRED="true"
  fi

  if ! ${FIRST_ENV}; then
    ENV_VARS_JSON="${ENV_VARS_JSON},"
  fi
  FIRST_ENV=false

  ENV_VARS_JSON="${ENV_VARS_JSON}
        {
          \"name\": \"${VAR_NAME}\",
          \"description\": \"${VAR_DESC}\",
          \"required\": ${REQUIRED}
        }"

  ENV_VARS_TS="${ENV_VARS_TS}
  { name: \"${VAR_NAME}\", description: \"${VAR_DESC}\", required: ${REQUIRED} },"

done <<< "${ENVVAR_BLOCK}"
ENV_VARS_JSON="${ENV_VARS_JSON}
      ]"

# Extract commands -- look for **`command`** patterns after "### Commands"
COMMANDS=""
IN_COMMANDS=false
while IFS= read -r line; do
  if [[ "${line}" =~ ^###[[:space:]]+Commands ]]; then
    IN_COMMANDS=true
    continue
  fi
  if ${IN_COMMANDS}; then
    # End on next ## section
    if [[ "${line}" =~ ^## ]] && ! [[ "${line}" =~ ^### ]]; then
      IN_COMMANDS=false
      continue
    fi
    # Capture command definition lines
    if [[ "${line}" =~ ^\*\*\` ]]; then
      COMMANDS="${COMMANDS}${line}"$'\n'
    fi
  fi
done < "${SKILL_MD}"

# Parse commands into tool definitions
TOOL_DEFS=""
TOOL_LIST_CODE=""
TOOL_HANDLER_CASES=""

while IFS= read -r line; do
  if [ -z "${line}" ]; then continue; fi

  # Extract command name and args from **`cmd arg [opt]`** -- description
  # Patterns:
  #   **`fx status`** -- description
  #   **`ec products [--search <query>]`** -- description
  #   **`learn`** -- description

  CMD_FULL=$(echo "${line}" | sed -n 's/^\*\*`\([^`]*\)`\*\*.*/\1/p')
  if [ -z "${CMD_FULL}" ]; then continue; fi

  # Extract description after ** -- or **
  CMD_DESC=$(echo "${line}" | sed 's/^\*\*`[^`]*`\*\*[[:space:]]*[—–-]*//' | sed 's/^[[:space:]]*//')
  if [ -z "${CMD_DESC}" ]; then
    CMD_DESC="Execute ${CMD_FULL}"
  fi
  # Escape quotes
  CMD_DESC=$(echo "${CMD_DESC}" | sed 's/"/\\"/g')

  # Get the base command and args
  CMD_BASE=$(echo "${CMD_FULL}" | awk '{print $1}')
  CMD_SUBCOMMAND=$(echo "${CMD_FULL}" | awk '{print $2}')
  CMD_REST=$(echo "${CMD_FULL}" | cut -d' ' -f3-)

  # Build tool name: replace spaces and hyphens with underscore
  TOOL_NAME="${CMD_BASE}"
  if [ -n "${CMD_SUBCOMMAND}" ] && ! [[ "${CMD_SUBCOMMAND}" =~ ^\< ]] && ! [[ "${CMD_SUBCOMMAND}" =~ ^\[ ]] && ! [[ "${CMD_SUBCOMMAND}" =~ ^\- ]]; then
    TOOL_NAME="${TOOL_NAME}_${CMD_SUBCOMMAND}"
  fi
  # Clean up tool name: replace hyphens with underscores, remove special chars
  TOOL_NAME=$(echo "${TOOL_NAME}" | tr '-' '_' | sed 's/[^a-zA-Z0-9_]//g')

  # Parse arguments for input schema
  ARGS_JSON=""
  REQUIRED_ARGS=""
  # Find <required> and [optional] args
  ARGS_IN_CMD=$(echo "${CMD_FULL}" | grep -oE '<[^>]+>|\[--[a-z_-]+ <[^>]+>\]|\[[^]]+\]' || true)

  while IFS= read -r arg_raw; do
    if [ -z "${arg_raw}" ]; then continue; fi

    if [[ "${arg_raw}" =~ ^\<(.+)\>$ ]]; then
      # Required argument
      ARG_NAME="${BASH_REMATCH[1]}"
      ARG_NAME_CLEAN=$(echo "${ARG_NAME}" | tr '-' '_' | sed 's/[^a-zA-Z0-9_]//g' | tr '|' '_')
      ARGS_JSON="${ARGS_JSON}
        \"${ARG_NAME_CLEAN}\": { \"type\": \"string\", \"description\": \"${ARG_NAME}\" },"
      REQUIRED_ARGS="${REQUIRED_ARGS}\"${ARG_NAME_CLEAN}\", "
    elif [[ "${arg_raw}" =~ ^\[--([a-z_-]+) ]]; then
      # Optional flag argument
      ARG_NAME="${BASH_REMATCH[1]}"
      ARG_NAME_CLEAN=$(echo "${ARG_NAME}" | tr '-' '_')
      ARGS_JSON="${ARGS_JSON}
        \"${ARG_NAME_CLEAN}\": { \"type\": \"string\", \"description\": \"${ARG_NAME} (optional)\" },"
    elif [[ "${arg_raw}" =~ ^\[(.+)\]$ ]]; then
      # Optional positional
      ARG_NAME="${BASH_REMATCH[1]}"
      ARG_NAME_CLEAN=$(echo "${ARG_NAME}" | tr '-' '_' | sed 's/[^a-zA-Z0-9_]//g')
      ARGS_JSON="${ARGS_JSON}
        \"${ARG_NAME_CLEAN}\": { \"type\": \"string\", \"description\": \"${ARG_NAME} (optional)\" },"
    fi
  done <<< "${ARGS_IN_CMD}"

  # Remove trailing comma from args
  ARGS_JSON=$(echo "${ARGS_JSON}" | sed 's/,[[:space:]]*$//')
  REQUIRED_ARGS=$(echo "${REQUIRED_ARGS}" | sed 's/,[[:space:]]*$//')

  # Build the tool definition for the tools array
  TOOL_DEFS="${TOOL_DEFS}
  {
    name: \"${TOOL_NAME}\",
    description: \"${CMD_DESC}\",
    inputSchema: {
      type: \"object\" as const,
      properties: {${ARGS_JSON}
      },
      required: [${REQUIRED_ARGS}],
    },
  },"

  # Build the handler case
  TOOL_HANDLER_CASES="${TOOL_HANDLER_CASES}
    case \"${TOOL_NAME}\": {
      const envMissing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
      if (envMissing.length > 0) {
        return \`Missing required environment variables: \${envMissing.join(\", \")}. Configure them before using this tool.\`;
      }
      const argSummary = Object.entries(args).filter(([_, v]) => v !== undefined).map(([k, v]) => \`  \${k}: \${v}\`).join(\"\\n\");
      return [
        \"=== ${DISPLAY_NAME}: ${TOOL_NAME} ===\",
        \"\",
        \"${CMD_DESC}\",
        \"\",
        argSummary ? \`Arguments:\\n\${argSummary}\` : \"No arguments provided.\",
        \"\",
        \"Command: ${CMD_FULL}\",
        \"Status: Ready to execute. Configure environment variables and connect to the service API.\",
      ].join(\"\\n\");
    }"

done <<< "${COMMANDS}"

# Add built-in help and version tools
TOOL_DEFS="${TOOL_DEFS}
  {
    name: \"help\",
    description: \"Show available tools and usage for ${DISPLAY_NAME}\",
    inputSchema: { type: \"object\" as const, properties: {}, required: [] },
  },
  {
    name: \"version\",
    description: \"Show version information for ${DISPLAY_NAME}\",
    inputSchema: { type: \"object\" as const, properties: {}, required: [] },
  },"

# ---------------------------------------------------------------------------
# Create output directory
# ---------------------------------------------------------------------------

mkdir -p "${PKG_DIR}/src"

# ---------------------------------------------------------------------------
# Generate package.json
# ---------------------------------------------------------------------------

cat > "${PKG_DIR}/package.json" << PKGJSON
{
  "name": "@hanabi-jpn/${PKG_NAME}",
  "version": "${VERSION}",
  "description": "MCP server for ${DISPLAY_NAME} -- ${DESCRIPTION}",
  "type": "module",
  "mcpName": "io.github.hanabi-jpn/${SKILL_NAME}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "${PKG_NAME}": "dist/index.js"
  },
  "files": [
    "dist",
    "server.json"
  ],
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "npx tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/hanabi-jpn/clawhub-skills",
    "directory": "mcp-servers/packages/${PKG_NAME}"
  },
  "keywords": ["mcp", "mcp-server", ${TAGS_LINE}],
  "author": "hanabi-jpn",
  "license": "MIT"
}
PKGJSON

# ---------------------------------------------------------------------------
# Generate tsconfig.json
# ---------------------------------------------------------------------------

cat > "${PKG_DIR}/tsconfig.json" << TSCONF
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
TSCONF

# ---------------------------------------------------------------------------
# Generate server.json (MCP Registry manifest)
# ---------------------------------------------------------------------------

cat > "${PKG_DIR}/server.json" << SRVJSON
{
  "\$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.hanabi-jpn/${SKILL_NAME}",
  "description": "${DESCRIPTION}",
  "repository": {
    "url": "https://github.com/hanabi-jpn/clawhub-skills",
    "source": "github"
  },
  "version": "${VERSION}",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "@hanabi-jpn/${PKG_NAME}",
      "version": "${VERSION}",
      "transport": {
        "type": "stdio"
      },
      "environmentVariables": ${ENV_VARS_JSON}
    }
  ]
}
SRVJSON

# ---------------------------------------------------------------------------
# Generate src/index.ts
# ---------------------------------------------------------------------------

cat > "${PKG_DIR}/src/index.ts" << 'TSHEADER'
#!/usr/bin/env node

/**
TSHEADER

cat >> "${PKG_DIR}/src/index.ts" << TSCOMMENT
 * MCP Server: ${DISPLAY_NAME}
 *
 * ${DESCRIPTION}
 *
 * Auto-generated from ${SKILL_NAME}/SKILL.md
 * Author: hanabi-jpn
 * License: MIT
 */
TSCOMMENT

cat >> "${PKG_DIR}/src/index.ts" << 'TSIMPORTS'

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

TSIMPORTS

cat >> "${PKG_DIR}/src/index.ts" << TSCONST
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SERVER_NAME = "${SKILL_NAME}";
const SERVER_VERSION = "${VERSION}";
const SERVER_DESCRIPTION = "${DESCRIPTION}";

const ENV_VARS = [${ENV_VARS_TS}
];

TSCONST

cat >> "${PKG_DIR}/src/index.ts" << TSTOOLS
// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [${TOOL_DEFS}
];

TSTOOLS

cat >> "${PKG_DIR}/src/index.ts" << TSHANDLER
// ---------------------------------------------------------------------------
// Tool handler
// ---------------------------------------------------------------------------

async function handleTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {${TOOL_HANDLER_CASES}

    case "help": {
      const lines = [
        \`=== \${SERVER_NAME} v\${SERVER_VERSION} ===\`,
        SERVER_DESCRIPTION,
        "",
        "Available tools:",
      ];
      for (const tool of TOOLS) {
        lines.push(\`  \${tool.name} - \${tool.description}\`);
      }
      lines.push("");
      lines.push("Environment variables:");
      for (const ev of ENV_VARS) {
        const status = process.env[ev.name] ? "set" : ev.required ? "MISSING" : "not set";
        lines.push(\`  \${ev.name} (\${ev.required ? "required" : "optional"}): \${status}\`);
      }
      return lines.join("\\n");
    }

    case "version": {
      return JSON.stringify(
        { name: SERVER_NAME, version: SERVER_VERSION, description: SERVER_DESCRIPTION, author: "hanabi-jpn", license: "MIT" },
        null,
        2
      );
    }

    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
}

TSHANDLER

cat >> "${PKG_DIR}/src/index.ts" << 'TSSERVER'
// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, (args as Record<string, unknown>) ?? {});
    return { content: [{ type: "text" as const, text: result }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text" as const, text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.on("SIGINT", async () => { await server.close(); process.exit(0); });
  process.on("SIGTERM", async () => { await server.close(); process.exit(0); });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
TSSERVER

echo "    DONE: ${PKG_NAME} generated successfully"
echo "    Tools: $(echo "${COMMANDS}" | grep -c '^\*\*' || echo 0) + 2 built-in (help, version)"
