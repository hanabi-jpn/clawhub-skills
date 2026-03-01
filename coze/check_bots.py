#!/usr/bin/env python3
"""
Coze Bot Status Checker
========================
Check creation results and list bots in a workspace.

Usage:
  python3 check_bots.py                         # Show creation results
  python3 check_bots.py --token pat_xxx          # List bots via API
  python3 check_bots.py --retry-failed           # Retry failed bots
"""

import json
import sys
import os
import argparse
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
RESULTS_FILE = SCRIPT_DIR / "create_results.json"
RESULTS_BROWSER = SCRIPT_DIR / "create_results_browser.json"
BOTS_JSON = SCRIPT_DIR / "bots.json"

# Colors
class C:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"


def show_results(results_file: Path):
    """Display creation results from a results file."""
    if not results_file.exists():
        print(f"No results file found: {results_file}")
        return

    with open(results_file) as f:
        data = json.load(f)

    print(f"\n{C.CYAN}{C.BOLD}Creation Results{C.RESET}")
    print(f"  Created:   {data.get('created_at', '?')}")
    print(f"  Method:    {data.get('method', 'api')}")
    print(f"  Space:     {data.get('space_id', '?')}")
    print(f"  Total:     {data.get('total', 0)}")
    print(f"  {C.GREEN}Success:   {data.get('succeeded', 0)}{C.RESET}")
    print(f"  {C.RED}Failed:    {data.get('failed', 0)}{C.RESET}")
    print()

    results = data.get("results", [])
    if not results:
        return

    # Show each bot
    print(f"{'#':>3}  {'Status':<10}  {'Bot ID':<20}  Name")
    print(f"{'─'*3}  {'─'*10}  {'─'*20}  {'─'*40}")

    for r in results:
        idx = r.get("index", "?")
        status = r.get("status", "?")
        bot_id = r.get("bot_id", "-") or "-"
        name = r.get("name", "?")

        if status == "success":
            status_colored = f"{C.GREEN}{status:<10}{C.RESET}"
        elif status == "failed":
            status_colored = f"{C.RED}{status:<10}{C.RESET}"
        elif status == "dry_run":
            status_colored = f"{C.YELLOW}{status:<10}{C.RESET}"
        else:
            status_colored = f"{status:<10}"

        print(f"{idx:>3}  {status_colored}  {str(bot_id):<20}  {name}")

    # Show failed bots detail
    failed = [r for r in results if r.get("status") == "failed"]
    if failed:
        print(f"\n{C.RED}{C.BOLD}Failed Bots Detail:{C.RESET}")
        for r in failed:
            print(f"  {r.get('index', '?'):>3}. {r['name']}")
            print(f"       Error: {r.get('error', 'unknown')}")
            print(f"       Code:  {r.get('code', '?')}")
            print()


def get_failed_indices(results_file: Path) -> list:
    """Get indices of failed bots for retry."""
    if not results_file.exists():
        return []

    with open(results_file) as f:
        data = json.load(f)

    failed = []
    for r in data.get("results", []):
        if r.get("status") == "failed":
            failed.append(r.get("index", 0) - 1)  # Convert to 0-based

    return failed


def list_bots_via_api(token: str, space_id: str):
    """List published bots in a space via API."""
    import urllib.request
    import urllib.parse

    url = f"https://api.coze.com/v1/space/published_bots_list?space_id={space_id}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })

    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read().decode())

        if data.get("code", 0) != 0:
            print(f"{C.RED}API Error: {data.get('msg', 'unknown')}{C.RESET}")
            return

        bots = data.get("data", {}).get("space_bots", [])
        print(f"\n{C.CYAN}{C.BOLD}Published Bots in Space {space_id}{C.RESET}")
        print(f"  Total: {len(bots)}\n")

        for i, bot in enumerate(bots):
            bot_name = bot.get("bot_name", "unnamed")
            bot_id = bot.get("bot_id", "?")
            desc = bot.get("description", "")[:60]
            print(f"  {i+1:>3}. {bot_name}")
            print(f"       ID: {bot_id}")
            if desc:
                print(f"       {desc}...")
            print()

    except Exception as e:
        print(f"{C.RED}Error: {e}{C.RESET}")


def main():
    parser = argparse.ArgumentParser(description="Check Coze bot creation results")
    parser.add_argument("--token", "-t", help="API token (to list bots via API)")
    parser.add_argument("--space-id", "-s", help="Space ID")
    parser.add_argument("--retry-failed", action="store_true", help="Show retry command for failed bots")
    parser.add_argument("--browser", action="store_true", help="Check browser automation results")

    args = parser.parse_args()

    # Load .env
    env_file = SCRIPT_DIR / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip('"'))

    token = args.token or os.environ.get("COZE_API_TOKEN")
    space_id = args.space_id or os.environ.get("COZE_SPACE_ID")

    # Show results
    results_file = RESULTS_BROWSER if args.browser else RESULTS_FILE
    show_results(results_file)

    # Retry command
    if args.retry_failed:
        failed = get_failed_indices(results_file)
        if failed:
            print(f"\n{C.YELLOW}To retry failed bots, run each individually:{C.RESET}")
            for idx in failed:
                print(f"  python3 create_bots_api.py --start {idx} --limit 1")
            print()
            print(f"Or retry all from first failure ({failed[0]}):")
            print(f"  python3 create_bots_api.py --start {failed[0]}")
        else:
            print(f"\n{C.GREEN}No failed bots to retry!{C.RESET}")

    # List via API
    if token and space_id:
        list_bots_via_api(token, space_id)


if __name__ == "__main__":
    main()
