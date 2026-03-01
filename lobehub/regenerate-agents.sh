#!/usr/bin/env bash
# ============================================================================
# regenerate-agents.sh
# Regenerate lobehub/agents.json from all SKILL.md files across 5 package dirs.
#
# Usage:
#   ./regenerate-agents.sh          # writes agents.json next to this script
#   ./regenerate-agents.sh --dry    # print to stdout instead of writing
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec python3 "$SCRIPT_DIR/regenerate_agents.py" "$@"
