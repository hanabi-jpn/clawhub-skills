#!/usr/bin/env python3
"""
Coze Bot Batch Creator - API Version
=====================================
Creates 40 bots on Coze (coze.com) using the official Coze API.

API Endpoints (discovered):
  POST https://api.coze.com/v1/bot/create   - Create a bot
  POST https://api.coze.com/v1/bot/update   - Update a bot
  POST https://api.coze.com/v1/bot/publish  - Publish a bot
  GET  https://api.coze.com/v1/workspaces   - List workspaces
  GET  https://api.coze.com/v1/space/published_bots_list - List published bots

Authentication:
  Personal Access Token (PAT) from https://www.coze.com/open/api
  Set as: Authorization: Bearer pat_xxxxx

Usage:
  1. Get your PAT from Coze: Settings -> API Keys -> Create
  2. Get your workspace/space ID from the Coze URL
  3. Run: python3 create_bots_api.py --token pat_xxxxx --space-id 123456

Docs: https://www.coze.com/docs/developer_guides/coze_api_overview
"""

import json
import os
import sys
import time
import argparse
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime
from pathlib import Path

# ─── Config ───────────────────────────────────────────────────────────────────

COZE_API_BASE = "https://api.coze.com"
BOTS_JSON = Path(__file__).parent / "bots.json"
RESULTS_FILE = Path(__file__).parent / "create_results.json"
RATE_LIMIT_DELAY = 2.0  # seconds between API calls
MAX_RETRIES = 3
RETRY_DELAY = 5.0  # seconds between retries

# ─── Color output ─────────────────────────────────────────────────────────────

class C:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

def log_ok(msg):
    print(f"{C.GREEN}[OK]{C.RESET} {msg}")

def log_err(msg):
    print(f"{C.RED}[ERR]{C.RESET} {msg}")

def log_warn(msg):
    print(f"{C.YELLOW}[WARN]{C.RESET} {msg}")

def log_info(msg):
    print(f"{C.BLUE}[INFO]{C.RESET} {msg}")

def log_step(msg):
    print(f"\n{C.CYAN}{C.BOLD}>>> {msg}{C.RESET}")

# ─── API Client ───────────────────────────────────────────────────────────────

class CozeAPI:
    """Coze API client for bot management."""

    def __init__(self, token: str):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "ClawHub-Bot-Creator/1.0",
        }

    def _request(self, method: str, path: str, data: dict = None) -> dict:
        """Make an API request with retry logic."""
        url = f"{COZE_API_BASE}{path}"

        for attempt in range(MAX_RETRIES):
            try:
                body = json.dumps(data).encode() if data else None
                req = urllib.request.Request(url, headers=self.headers, data=body, method=method)
                resp = urllib.request.urlopen(req, timeout=30)
                result = json.loads(resp.read().decode())

                # Coze returns code 0 for success
                if result.get("code", 0) != 0:
                    error_msg = result.get("msg", "Unknown error")
                    error_code = result.get("code", -1)

                    # Rate limit
                    if error_code == 4029:
                        wait = RETRY_DELAY * (attempt + 1)
                        log_warn(f"Rate limited. Waiting {wait}s... (attempt {attempt + 1}/{MAX_RETRIES})")
                        time.sleep(wait)
                        continue

                    return {"success": False, "error": error_msg, "code": error_code, "raw": result}

                return {"success": True, "data": result.get("data", result)}

            except urllib.error.HTTPError as e:
                body_text = e.read().decode()
                try:
                    err_data = json.loads(body_text)
                    error_msg = err_data.get("msg", body_text)
                except:
                    error_msg = body_text

                if e.code == 429:
                    wait = RETRY_DELAY * (attempt + 1)
                    log_warn(f"HTTP 429 Rate limited. Waiting {wait}s... (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait)
                    continue

                if e.code >= 500 and attempt < MAX_RETRIES - 1:
                    wait = RETRY_DELAY * (attempt + 1)
                    log_warn(f"HTTP {e.code} Server error. Retrying in {wait}s...")
                    time.sleep(wait)
                    continue

                return {"success": False, "error": f"HTTP {e.code}: {error_msg}", "code": e.code}

            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    log_warn(f"Request error: {e}. Retrying...")
                    time.sleep(RETRY_DELAY)
                    continue
                return {"success": False, "error": str(e), "code": -1}

        return {"success": False, "error": "Max retries exceeded", "code": -1}

    def get(self, path: str, params: dict = None) -> dict:
        if params:
            query = urllib.parse.urlencode(params)
            path = f"{path}?{query}"
        return self._request("GET", path)

    def post(self, path: str, data: dict = None) -> dict:
        return self._request("POST", path, data)

    # ─── Workspace ────────────────────────────────────────────────────────

    def list_workspaces(self) -> dict:
        """List all available workspaces."""
        return self.get("/v1/workspaces")

    # ─── Bot CRUD ─────────────────────────────────────────────────────────

    def create_bot(self, space_id: str, name: str, description: str = "",
                   prompt: str = "", model: str = None,
                   onboarding_info: dict = None) -> dict:
        """
        Create a new bot in a workspace.

        Coze API: POST /v1/bot/create
        Required: space_id, name
        Optional: description, prompt_info, model, onboarding_info
        """
        payload = {
            "space_id": str(space_id),
            "name": name,
        }

        if description:
            payload["description"] = description

        # System prompt configuration
        if prompt:
            payload["prompt_info"] = {
                "prompt": prompt,
            }

        # Model configuration (if supported by Coze API)
        if model:
            payload["model_info_config"] = {
                "model_id": model
            }

        # Opening/suggested questions
        if onboarding_info:
            payload["onboarding_info"] = onboarding_info

        return self.post("/v1/bot/create", payload)

    def update_bot(self, bot_id: str, **kwargs) -> dict:
        """Update an existing bot."""
        payload = {"bot_id": str(bot_id)}
        payload.update(kwargs)
        return self.post("/v1/bot/update", payload)

    def publish_bot(self, bot_id: str, connector_ids: list = None) -> dict:
        """Publish a bot to specified connectors."""
        payload = {
            "bot_id": str(bot_id),
        }
        if connector_ids:
            payload["connector_ids"] = connector_ids
        return self.post("/v1/bot/publish", payload)

    def list_published_bots(self, space_id: str) -> dict:
        """List published bots in a space."""
        return self.get("/v1/space/published_bots_list", {"space_id": space_id})

# ─── Bot Creator ──────────────────────────────────────────────────────────────

class BotCreator:
    """Batch bot creation orchestrator."""

    def __init__(self, api: CozeAPI, space_id: str, dry_run: bool = False, delay: float = 2.0):
        self.api = api
        self.space_id = space_id
        self.dry_run = dry_run
        self.delay = delay
        self.results = []

    def load_bots(self, path: Path = BOTS_JSON) -> list:
        """Load bot definitions from JSON file."""
        with open(path, "r", encoding="utf-8") as f:
            bots = json.load(f)
        log_info(f"Loaded {len(bots)} bot definitions from {path}")
        return bots

    def prepare_onboarding_info(self, bot_def: dict) -> dict:
        """Prepare onboarding_info (suggested questions) for Coze API format."""
        questions = bot_def.get("suggested_questions", [])
        if not questions:
            return {}

        # Coze API format for onboarding/opening dialog
        return {
            "prologue": bot_def.get("description", ""),
            "suggested_questions": questions,
        }

    def create_single_bot(self, index: int, bot_def: dict) -> dict:
        """Create a single bot and return the result."""
        name = bot_def["name"]
        description = bot_def.get("description", "")
        prompt = bot_def.get("prompt", "")
        model = bot_def.get("model", None)
        onboarding = self.prepare_onboarding_info(bot_def)

        log_info(f"[{index + 1}/40] Creating: {name}")

        if self.dry_run:
            log_warn(f"  [DRY RUN] Would create bot: {name}")
            return {
                "index": index + 1,
                "name": name,
                "status": "dry_run",
                "bot_id": None,
            }

        result = self.api.create_bot(
            space_id=self.space_id,
            name=name,
            description=description,
            prompt=prompt,
            model=model,
            onboarding_info=onboarding if onboarding else None,
        )

        if result["success"]:
            bot_id = None
            data = result.get("data", {})
            # Extract bot_id from response - Coze may return it in different fields
            if isinstance(data, dict):
                bot_id = data.get("bot_id") or data.get("id") or data.get("bot", {}).get("id")
            elif isinstance(data, str):
                bot_id = data

            log_ok(f"  Created: {name} (bot_id: {bot_id})")
            return {
                "index": index + 1,
                "name": name,
                "status": "success",
                "bot_id": bot_id,
                "response": data,
            }
        else:
            log_err(f"  Failed: {name} -> {result.get('error', 'unknown')}")
            return {
                "index": index + 1,
                "name": name,
                "status": "failed",
                "error": result.get("error"),
                "code": result.get("code"),
            }

    def run(self, start_from: int = 0, limit: int = None):
        """Create all bots from bots.json."""
        bots = self.load_bots()

        if limit:
            bots = bots[start_from:start_from + limit]
        elif start_from > 0:
            bots = bots[start_from:]

        total = len(bots)
        log_step(f"Creating {total} bots in space {self.space_id}")
        if self.dry_run:
            log_warn("DRY RUN MODE - No actual API calls will be made")
        print()

        succeeded = 0
        failed = 0
        start_time = time.time()

        for i, bot_def in enumerate(bots):
            actual_index = start_from + i
            result = self.create_single_bot(actual_index, bot_def)
            self.results.append(result)

            if result["status"] == "success":
                succeeded += 1
            elif result["status"] == "failed":
                failed += 1

            # Rate limiting between calls
            if i < total - 1:
                time.sleep(self.delay)

        elapsed = time.time() - start_time

        # Save results
        self.save_results()

        # Print summary
        log_step("Summary")
        print(f"  Total:     {total}")
        print(f"  {C.GREEN}Success:   {succeeded}{C.RESET}")
        print(f"  {C.RED}Failed:    {failed}{C.RESET}")
        print(f"  Time:      {elapsed:.1f}s")
        print(f"  Results:   {RESULTS_FILE}")

        if failed > 0:
            print(f"\n{C.YELLOW}Failed bots:{C.RESET}")
            for r in self.results:
                if r["status"] == "failed":
                    print(f"  {r['index']:2d}. {r['name']}: {r.get('error', 'unknown')}")

        return succeeded, failed

    def save_results(self):
        """Save creation results to JSON."""
        output = {
            "created_at": datetime.now().isoformat(),
            "space_id": self.space_id,
            "dry_run": self.dry_run,
            "total": len(self.results),
            "succeeded": sum(1 for r in self.results if r["status"] == "success"),
            "failed": sum(1 for r in self.results if r["status"] == "failed"),
            "results": self.results,
        }
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

# ─── Token Discovery ─────────────────────────────────────────────────────────

def find_token() -> str:
    """Try to find the Coze API token from environment or config files."""
    # 1. Environment variable
    token = os.environ.get("COZE_API_TOKEN") or os.environ.get("COZE_PAT")
    if token:
        return token

    # 2. .env file in same directory
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line.startswith("COZE_API_TOKEN=") or line.startswith("COZE_PAT="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")

    # 3. Config file
    config_file = Path(__file__).parent / "config.json"
    if config_file.exists():
        with open(config_file) as f:
            config = json.load(f)
            return config.get("token") or config.get("api_token") or config.get("pat")

    return None

def find_space_id() -> str:
    """Try to find the space ID from config."""
    # Environment variable
    space_id = os.environ.get("COZE_SPACE_ID") or os.environ.get("COZE_WORKSPACE_ID")
    if space_id:
        return space_id

    # .env file
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line.startswith("COZE_SPACE_ID=") or line.startswith("COZE_WORKSPACE_ID="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")

    # Config file
    config_file = Path(__file__).parent / "config.json"
    if config_file.exists():
        with open(config_file) as f:
            config = json.load(f)
            return config.get("space_id") or config.get("workspace_id")

    return None

# ─── Validation ───────────────────────────────────────────────────────────────

def validate_token(api: CozeAPI) -> bool:
    """Validate the token by listing workspaces."""
    log_info("Validating API token...")
    result = api.list_workspaces()
    if result["success"]:
        data = result.get("data", {})
        workspaces = data.get("workspaces", []) if isinstance(data, dict) else []
        log_ok(f"Token valid. Found {len(workspaces)} workspace(s).")
        for ws in workspaces:
            ws_name = ws.get("name", "unnamed")
            ws_id = ws.get("id", "?")
            log_info(f"  Workspace: {ws_name} (id: {ws_id})")
        return True
    else:
        log_err(f"Token validation failed: {result.get('error')}")
        return False

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Batch create 40 bots on Coze using the API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry run (no actual API calls)
  python3 create_bots_api.py --token pat_xxx --space-id 123 --dry-run

  # Create all 40 bots
  python3 create_bots_api.py --token pat_xxx --space-id 123

  # Create bots 10-20 only (resume after failure)
  python3 create_bots_api.py --token pat_xxx --space-id 123 --start 10 --limit 10

  # Just validate your token
  python3 create_bots_api.py --token pat_xxx --validate-only

  # Use .env file for credentials
  echo 'COZE_API_TOKEN=pat_xxx' > .env
  echo 'COZE_SPACE_ID=123' >> .env
  python3 create_bots_api.py

How to get your token:
  1. Go to https://www.coze.com/open/api
  2. Click "Create API Key" or "Personal Access Token"
  3. Copy the token (starts with pat_)

How to find your space_id:
  1. Go to https://www.coze.com
  2. Open a workspace
  3. The URL will contain the space_id: coze.com/space/XXXXXXXXX
  4. Or use --validate-only to list workspaces
        """
    )
    parser.add_argument("--token", "-t", help="Coze API token (Personal Access Token)")
    parser.add_argument("--space-id", "-s", help="Workspace/Space ID to create bots in")
    parser.add_argument("--dry-run", "-n", action="store_true", help="Simulate without making API calls")
    parser.add_argument("--start", type=int, default=0, help="Start from bot index N (0-based)")
    parser.add_argument("--limit", type=int, default=None, help="Create only N bots")
    parser.add_argument("--validate-only", "-v", action="store_true", help="Only validate token and list workspaces")
    parser.add_argument("--delay", type=float, default=RATE_LIMIT_DELAY, help=f"Delay between API calls in seconds (default: {RATE_LIMIT_DELAY})")
    parser.add_argument("--publish", action="store_true", help="Auto-publish bots after creation")
    parser.add_argument("--bots-file", type=str, default=None, help="Path to bots.json (default: same directory)")

    args = parser.parse_args()

    # Banner
    print(f"\n{C.CYAN}{C.BOLD}{'='*60}")
    print(f"  Coze Bot Batch Creator - API Mode")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}{C.RESET}\n")

    # Resolve token
    token = args.token or find_token()
    if not token:
        log_err("No API token provided.")
        print(f"""
  Provide a token via one of:
    1. --token pat_xxxxx
    2. Environment: export COZE_API_TOKEN=pat_xxxxx
    3. File: echo 'COZE_API_TOKEN=pat_xxx' > {Path(__file__).parent / '.env'}
    4. File: {Path(__file__).parent / 'config.json'} with {{"token": "pat_xxx"}}

  Get your token at: https://www.coze.com/open/api
""")
        sys.exit(1)

    # Mask token for display
    masked = token[:8] + "..." + token[-4:] if len(token) > 12 else "***"
    log_info(f"Using token: {masked}")

    # Set delay
    rate_delay = args.delay

    # Initialize API
    api = CozeAPI(token)

    # Validate (skip for dry-run)
    if not args.dry_run:
        if not validate_token(api):
            sys.exit(1)

        if args.validate_only:
            log_ok("Validation complete.")
            sys.exit(0)
    else:
        log_warn("Dry run mode - skipping token validation")

    # Resolve space_id
    space_id = args.space_id or find_space_id()
    if not space_id:
        log_err("No space_id provided.")
        print(f"""
  Provide a space_id via one of:
    1. --space-id 123456789
    2. Environment: export COZE_SPACE_ID=123456789
    3. File: echo 'COZE_SPACE_ID=123' >> {Path(__file__).parent / '.env'}

  Find your space_id:
    - Look at the URL when viewing a workspace on coze.com
    - Or check the workspace list above
""")
        sys.exit(1)

    log_info(f"Target space: {space_id}")

    # Bots file
    bots_file = Path(args.bots_file) if args.bots_file else BOTS_JSON
    if not bots_file.exists():
        log_err(f"Bots file not found: {bots_file}")
        sys.exit(1)

    # Create bots
    creator = BotCreator(api, space_id, dry_run=args.dry_run, delay=rate_delay)
    succeeded, failed = creator.run(start_from=args.start, limit=args.limit)

    # Auto-publish if requested
    if args.publish and succeeded > 0 and not args.dry_run:
        log_step("Publishing bots...")
        for result in creator.results:
            if result["status"] == "success" and result.get("bot_id"):
                pub_result = api.publish_bot(result["bot_id"])
                if pub_result["success"]:
                    log_ok(f"  Published: {result['name']}")
                else:
                    log_warn(f"  Publish failed: {result['name']} -> {pub_result.get('error')}")
                time.sleep(rate_delay)

    # Exit code
    sys.exit(1 if failed > 0 else 0)


if __name__ == "__main__":
    main()
