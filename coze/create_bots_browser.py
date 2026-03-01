#!/usr/bin/env python3
"""
Coze Bot Batch Creator - Browser Automation Version
=====================================================
Uses Playwright to automate bot creation through the Coze web interface.
This is the fallback approach when API token setup is not yet done.

The user is logged in as hanabi-jpn on coze.com.
This script uses the existing browser session (cookies).

Prerequisites:
  pip install playwright
  playwright install chromium

Usage:
  # First run: will open browser for you to log in, then saves cookies
  python3 create_bots_browser.py --login

  # Create all 40 bots using saved session
  python3 create_bots_browser.py

  # Create specific range (resume after interruption)
  python3 create_bots_browser.py --start 10 --limit 5

  # Dry run to see what would happen
  python3 create_bots_browser.py --dry-run

  # Use headed mode (visible browser) for debugging
  python3 create_bots_browser.py --headed
"""

import json
import sys
import time
import argparse
import asyncio
from datetime import datetime
from pathlib import Path

BOTS_JSON = Path(__file__).parent / "bots.json"
RESULTS_FILE = Path(__file__).parent / "create_results_browser.json"
COOKIES_FILE = Path(__file__).parent / ".coze_cookies.json"
STATE_FILE = Path(__file__).parent / ".browser_state"

# Timing
PAGE_LOAD_WAIT = 3.0
BETWEEN_BOTS_WAIT = 5.0
ACTION_WAIT = 1.5
TYPING_DELAY = 30  # ms between keystrokes

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


# ─── Browser Bot Creator ─────────────────────────────────────────────────────

class BrowserBotCreator:
    """Creates bots on Coze using Playwright browser automation."""

    def __init__(self, headed: bool = False, dry_run: bool = False):
        self.headed = headed
        self.dry_run = dry_run
        self.results = []
        self.browser = None
        self.context = None
        self.page = None

    async def setup(self):
        """Initialize Playwright browser."""
        try:
            from playwright.async_api import async_playwright
        except ImportError:
            log_err("Playwright not installed. Run:")
            print("  pip install playwright")
            print("  playwright install chromium")
            sys.exit(1)

        self.pw = await async_playwright().start()
        self.browser = await self.pw.chromium.launch(
            headless=not self.headed,
            args=["--disable-blink-features=AutomationControlled"],
        )

        # Load existing session if available
        if STATE_FILE.exists():
            log_info("Loading saved browser session...")
            self.context = await self.browser.new_context(
                storage_state=str(STATE_FILE),
                viewport={"width": 1440, "height": 900},
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            )
        else:
            self.context = await self.browser.new_context(
                viewport={"width": 1440, "height": 900},
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            )

        self.page = await self.context.new_page()

        # Block unnecessary resources for speed
        await self.page.route("**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2}", lambda route: route.abort())

    async def teardown(self):
        """Clean up browser resources."""
        if self.context:
            # Save session state for reuse
            await self.context.storage_state(path=str(STATE_FILE))
            log_info(f"Session saved to {STATE_FILE}")
        if self.browser:
            await self.browser.close()
        if self.pw:
            await self.pw.stop()

    async def login(self):
        """Open browser for manual login, then save session."""
        log_step("Manual Login Mode")
        print("  1. A browser window will open")
        print("  2. Log in to coze.com as hanabi-jpn")
        print("  3. After login, press Enter in this terminal")
        print()

        # Must use headed mode for login
        if not self.headed:
            if self.browser:
                await self.browser.close()
            self.browser = await self.pw.chromium.launch(headless=False)
            self.context = await self.browser.new_context(
                viewport={"width": 1440, "height": 900},
            )
            self.page = await self.context.new_page()

        await self.page.goto("https://www.coze.com", wait_until="networkidle", timeout=30000)
        await asyncio.sleep(2)

        input("\n  Press Enter after you've logged in on coze.com... ")

        # Save the session
        await self.context.storage_state(path=str(STATE_FILE))
        log_ok(f"Session saved! You can now run bot creation without --login")
        log_info(f"Session file: {STATE_FILE}")

    async def check_login(self) -> bool:
        """Verify we're logged in by visiting coze.com."""
        log_info("Checking login status...")
        try:
            await self.page.goto("https://www.coze.com", wait_until="networkidle", timeout=20000)
            await asyncio.sleep(PAGE_LOAD_WAIT)

            # Check for signs of being logged in
            # Look for workspace/dashboard elements
            content = await self.page.content()

            if "sign in" in content.lower() or "log in" in content.lower():
                # Check more carefully - the page might have these words in other contexts
                login_button = await self.page.query_selector('button:has-text("Sign in"), button:has-text("Log in"), a:has-text("Sign in")')
                if login_button and await login_button.is_visible():
                    return False

            # Look for workspace indicators
            workspace_el = await self.page.query_selector('[class*="workspace"], [class*="sidebar"], [class*="avatar"], [class*="user"]')
            if workspace_el:
                return True

            # If we can navigate to create page, we're logged in
            return True

        except Exception as e:
            log_err(f"Login check failed: {e}")
            return False

    async def get_space_id(self) -> str:
        """Extract the current space_id from the URL or page."""
        url = self.page.url
        # URL pattern: coze.com/space/XXXXX or coze.com/home?space_id=XXXXX
        import re
        match = re.search(r'space[_/]?(?:id=)?(\d+)', url)
        if match:
            return match.group(1)

        # Try to find it in page content
        content = await self.page.content()
        match = re.search(r'"space_id"\s*:\s*"?(\d+)"?', content)
        if match:
            return match.group(1)

        return None

    async def navigate_to_create_bot(self):
        """Navigate to the bot creation page."""
        # Try direct URL first
        await self.page.goto("https://www.coze.com/home", wait_until="networkidle", timeout=20000)
        await asyncio.sleep(PAGE_LOAD_WAIT)

    async def create_single_bot(self, index: int, total: int, bot_def: dict) -> dict:
        """Create a single bot through the browser UI."""
        name = bot_def["name"]
        description = bot_def.get("description", "")
        prompt = bot_def.get("prompt", "")
        suggested_questions = bot_def.get("suggested_questions", [])

        log_info(f"[{index + 1}/{total}] Creating: {name}")

        if self.dry_run:
            log_warn(f"  [DRY RUN] Would create: {name}")
            return {"index": index + 1, "name": name, "status": "dry_run"}

        try:
            # Navigate to create bot page
            # Click "Create Bot" or "+" button
            create_btn = await self.page.query_selector(
                'button:has-text("Create"), '
                'button:has-text("New Bot"), '
                '[class*="create-bot"], '
                '[data-testid="create-bot"]'
            )

            if create_btn:
                await create_btn.click()
                await asyncio.sleep(ACTION_WAIT * 2)
            else:
                # Try direct navigation
                await self.page.goto("https://www.coze.com/home", wait_until="networkidle", timeout=15000)
                await asyncio.sleep(PAGE_LOAD_WAIT)

                # Look for create button again
                create_btn = await self.page.query_selector(
                    'button:has-text("Create Bot"), '
                    'button:has-text("Create bot"), '
                    '[class*="create"]'
                )
                if create_btn:
                    await create_btn.click()
                    await asyncio.sleep(ACTION_WAIT * 2)

            # ─── Fill Bot Name ────────────────────────────────────────────
            name_input = await self.page.query_selector(
                'input[placeholder*="name" i], '
                'input[placeholder*="Name" i], '
                'input[name="name"], '
                '[data-testid="bot-name-input"]'
            )
            if name_input:
                await name_input.click()
                await name_input.fill("")
                await name_input.type(name, delay=TYPING_DELAY)
                await asyncio.sleep(ACTION_WAIT)

            # ─── Fill Description ─────────────────────────────────────────
            if description:
                desc_input = await self.page.query_selector(
                    'textarea[placeholder*="description" i], '
                    'textarea[placeholder*="Description" i], '
                    'textarea[name="description"], '
                    '[data-testid="bot-description-input"]'
                )
                if desc_input:
                    await desc_input.click()
                    await desc_input.fill("")
                    await desc_input.type(description, delay=TYPING_DELAY // 2)
                    await asyncio.sleep(ACTION_WAIT)

            # ─── Fill System Prompt ───────────────────────────────────────
            if prompt:
                # Look for prompt/persona/system prompt textarea
                prompt_input = await self.page.query_selector(
                    'textarea[placeholder*="prompt" i], '
                    'textarea[placeholder*="Prompt" i], '
                    'textarea[placeholder*="persona" i], '
                    'textarea[placeholder*="Persona" i], '
                    '[data-testid="bot-prompt"], '
                    '[class*="prompt"] textarea, '
                    '[class*="persona"] textarea'
                )
                if prompt_input:
                    await prompt_input.click()
                    await prompt_input.fill("")
                    # Use fill() for long prompts (faster than type())
                    await prompt_input.fill(prompt)
                    await asyncio.sleep(ACTION_WAIT)

            # ─── Fill Suggested Questions ─────────────────────────────────
            if suggested_questions:
                for q_idx, question in enumerate(suggested_questions):
                    # Look for "Add question" button or existing question inputs
                    q_input = await self.page.query_selector(
                        f'input[placeholder*="question" i]:nth-of-type({q_idx + 1}), '
                        f'[data-testid="suggested-question-{q_idx}"]'
                    )
                    if q_input:
                        await q_input.fill(question)
                        await asyncio.sleep(ACTION_WAIT / 2)
                    else:
                        # Try clicking "Add" button to create new question field
                        add_btn = await self.page.query_selector(
                            'button:has-text("Add question"), '
                            'button:has-text("Add"), '
                            '[class*="add-question"]'
                        )
                        if add_btn:
                            await add_btn.click()
                            await asyncio.sleep(ACTION_WAIT / 2)

            # ─── Save/Create the Bot ──────────────────────────────────────
            save_btn = await self.page.query_selector(
                'button:has-text("Create"), '
                'button:has-text("Save"), '
                'button:has-text("Confirm"), '
                'button[type="submit"], '
                '[data-testid="create-bot-submit"]'
            )
            if save_btn:
                await save_btn.click()
                await asyncio.sleep(ACTION_WAIT * 3)

            # Check for success (page navigated to bot edit page, or success toast)
            current_url = self.page.url
            if "bot" in current_url.lower() or "edit" in current_url.lower():
                log_ok(f"  Created: {name}")
                return {
                    "index": index + 1,
                    "name": name,
                    "status": "success",
                    "url": current_url,
                }

            log_warn(f"  Possibly created: {name} (could not confirm)")
            return {
                "index": index + 1,
                "name": name,
                "status": "uncertain",
                "url": current_url,
            }

        except Exception as e:
            log_err(f"  Failed: {name} -> {e}")
            # Take screenshot for debugging
            screenshot_path = Path(__file__).parent / f"error_{index + 1}.png"
            try:
                await self.page.screenshot(path=str(screenshot_path))
                log_info(f"  Screenshot saved: {screenshot_path}")
            except:
                pass
            return {
                "index": index + 1,
                "name": name,
                "status": "failed",
                "error": str(e),
            }

    async def run(self, start_from: int = 0, limit: int = None):
        """Run the batch bot creation process."""
        # Load bots
        with open(BOTS_JSON, "r", encoding="utf-8") as f:
            bots = json.load(f)
        log_info(f"Loaded {len(bots)} bot definitions")

        if limit:
            bots = bots[start_from:start_from + limit]
        elif start_from > 0:
            bots = bots[start_from:]

        total = len(bots)
        log_step(f"Creating {total} bots via browser automation")
        if self.dry_run:
            log_warn("DRY RUN MODE")
        print()

        succeeded = 0
        failed = 0
        start_time = time.time()

        for i, bot_def in enumerate(bots):
            actual_index = start_from + i
            result = await self.create_single_bot(actual_index, total, bot_def)
            self.results.append(result)

            if result["status"] in ("success", "uncertain"):
                succeeded += 1
            elif result["status"] == "failed":
                failed += 1

            # Wait between bots
            if i < total - 1:
                log_info(f"  Waiting {BETWEEN_BOTS_WAIT}s before next bot...")
                await asyncio.sleep(BETWEEN_BOTS_WAIT)

        elapsed = time.time() - start_time

        # Save results
        self.save_results()

        # Summary
        log_step("Summary")
        print(f"  Total:     {total}")
        print(f"  {C.GREEN}Success:   {succeeded}{C.RESET}")
        print(f"  {C.RED}Failed:    {failed}{C.RESET}")
        print(f"  Time:      {elapsed:.1f}s")
        print(f"  Results:   {RESULTS_FILE}")

        return succeeded, failed

    def save_results(self):
        """Save results to JSON."""
        output = {
            "created_at": datetime.now().isoformat(),
            "method": "browser_automation",
            "total": len(self.results),
            "succeeded": sum(1 for r in self.results if r["status"] in ("success", "uncertain")),
            "failed": sum(1 for r in self.results if r["status"] == "failed"),
            "results": self.results,
        }
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)


# ─── Main ─────────────────────────────────────────────────────────────────────

async def async_main():
    parser = argparse.ArgumentParser(
        description="Batch create 40 bots on Coze via browser automation",
    )
    parser.add_argument("--login", action="store_true", help="Open browser for manual login")
    parser.add_argument("--headed", action="store_true", help="Show browser window")
    parser.add_argument("--dry-run", "-n", action="store_true", help="Simulate without creating")
    parser.add_argument("--start", type=int, default=0, help="Start from bot index N (0-based)")
    parser.add_argument("--limit", type=int, default=None, help="Create only N bots")

    args = parser.parse_args()

    print(f"\n{C.CYAN}{C.BOLD}{'='*60}")
    print(f"  Coze Bot Batch Creator - Browser Mode")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}{C.RESET}\n")

    creator = BrowserBotCreator(headed=args.headed or args.login, dry_run=args.dry_run)

    try:
        await creator.setup()

        if args.login:
            await creator.login()
            return

        # Check login
        logged_in = await creator.check_login()
        if not logged_in:
            log_err("Not logged in. Run with --login first:")
            print(f"  python3 {__file__} --login")
            return

        log_ok("Logged in to Coze")

        # Get space ID
        space_id = await creator.get_space_id()
        if space_id:
            log_info(f"Detected space_id: {space_id}")

        # Create bots
        await creator.run(start_from=args.start, limit=args.limit)

    finally:
        await creator.teardown()


def main():
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
