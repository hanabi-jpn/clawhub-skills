#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════
create-bots.py — Automated Poe Bot Registration via Playwright
═══════════════════════════════════════════════════════════════════

Uses Playwright browser automation to create all 40 bots on poe.com.
This is the most reliable method since it mimics real browser interaction.

PREREQUISITES:
  pip install playwright
  playwright install chromium

USAGE:
  # Interactive mode (opens visible browser, you log in manually first):
  python3 create-bots.py

  # With saved auth state (after first login):
  python3 create-bots.py --auth-state poe_auth.json

  # Create a single bot:
  python3 create-bots.py --bot capability-evolver-pro

  # Create a specific batch:
  python3 create-bots.py --batch 1

  # Dry run (just prints what would be done):
  python3 create-bots.py --dry-run

  # Headless mode (no visible browser):
  python3 create-bots.py --headless --auth-state poe_auth.json

SERVER URL:
  Set your deployed server URL:
  export POE_SERVER_URL="https://your-modal-or-vps-url.com"
  export POE_ACCESS_KEY="your_poe_access_key"

  Or pass as arguments:
  python3 create-bots.py --server-url URL --access-key KEY
═══════════════════════════════════════════════════════════════════
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
import time
from pathlib import Path

# ── Logging setup ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("create-bots-playwright.log"),
    ],
)
log = logging.getLogger("poe-creator")

# ── Constants ──
SCRIPT_DIR = Path(__file__).parent
CONFIGS_DIR = SCRIPT_DIR / "configs"
ALL_BOTS_JSON = CONFIGS_DIR / "_all_bots.json"

POE_CREATE_URL = "https://poe.com/create_bot"
POE_LOGIN_URL = "https://poe.com/login"

# ── Bot batches (same ordering as create-bots.sh) ──
BATCH1_P1 = [
    "capability-evolver-pro",
    "self-learning-agent",
    "summarize-pro",
    "humanize-ai-pro",
    "nano-banana-ultra",
    "google-ads-agent",
    "google-workspace-agent",
    "ga4-search-console",
    "google-maps-biz",
]

BATCH2_P2 = [
    "skill-guardian",
    "fx-trader-pro",
    "brain-trust",
    "context-slim",
    "agent-dashboard",
    "stripe-japan-agent",
    "social-media-publisher",
    "chatwork-agent",
    "kintone-agent",
]

BATCH3_P3A = [
    "line-agent",
    "ec-cube-operator",
    "freee-agent",
    "rakuten-seller",
    "paypay-biz",
    "jp-tax-calc",
    "notion-jp",
    "jp-humanizer",
    "lark-workflow",
    "jp-seo-writer",
    "smarthr-agent",
]

BATCH4_P3B = [
    "backlog-agent",
    "sansan-agent",
    "moneyforward-agent",
    "kingof-time-agent",
    "line-works-agent",
    "jooto-agent",
    "base-stores-agent",
    "yayoi-agent",
    "mac-sentinel",
    "repo-guardian",
    "credential-vault",
]

ALL_BOTS = BATCH1_P1 + BATCH2_P2 + BATCH3_P3A + BATCH4_P3B


def load_bot_config(slug: str) -> dict | None:
    """Load a single bot's config from configs/ directory."""
    config_path = CONFIGS_DIR / f"{slug}.json"
    if not config_path.exists():
        log.warning(f"Config not found: {config_path}")
        return None

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    # Merge with _all_bots.json for model/tier info
    if ALL_BOTS_JSON.exists():
        with open(ALL_BOTS_JSON, "r", encoding="utf-8") as f:
            all_bots = json.load(f)
        if slug in all_bots:
            config.update({
                "model": all_bots[slug].get("model", "GPT-4o"),
                "tier": all_bots[slug].get("tier", "P2"),
                "suggested_replies": all_bots[slug].get("suggested_replies", []),
            })

    return config


def load_all_bot_configs(slugs: list[str]) -> list[dict]:
    """Load configs for multiple bots."""
    configs = []
    for slug in slugs:
        config = load_bot_config(slug)
        if config:
            config["_slug"] = slug
            configs.append(config)
        else:
            log.warning(f"Skipping {slug}: no config found")
    return configs


def get_poe_bot_name(config: dict) -> str:
    """Get the PascalCase bot name for Poe registration."""
    # bot_configs.py defines bot_name in PascalCase (e.g., "CapabilityEvolverPro")
    # but the JSON files may use slug form. Check _all_bots.json first.
    if ALL_BOTS_JSON.exists():
        with open(ALL_BOTS_JSON, "r", encoding="utf-8") as f:
            all_bots = json.load(f)
        slug = config.get("_slug", "")
        if slug in all_bots:
            return all_bots[slug].get("bot_name", config.get("bot_name", ""))
    return config.get("bot_name", "")


def create_single_bot(
    page,
    config: dict,
    server_url: str,
    access_key: str,
    delay: float = 3.0,
) -> bool:
    """
    Create a single bot on poe.com/create_bot using Playwright.

    Poe's create_bot page has a form with fields for:
    - Bot type selector (Server bot vs Prompt bot)
    - Bot handle (unique name)
    - Display name
    - Description
    - Server URL (for server bots)
    - Access key
    - Model dependencies

    The exact selectors may change. This script uses multiple strategies
    (label text, placeholder text, data attributes) to find form fields.

    Returns True if bot was created successfully, False otherwise.
    """
    slug = config.get("_slug", "unknown")
    bot_name = get_poe_bot_name(config)
    display_name = config.get("display_name", "")
    description = config.get("description", "")
    model = config.get("model", "GPT-4o")

    log.info(f"Creating bot: {display_name} ({bot_name}) [{config.get('tier', '?')}/{model}]")

    try:
        # Navigate to create bot page
        page.goto(POE_CREATE_URL, wait_until="networkidle", timeout=30000)
        time.sleep(2)

        # ── Step 1: Select "Server bot" type ──
        # Poe shows a choice between "Prompt bot" and "Server bot"
        # Try multiple selectors for the server bot option
        server_bot_selectors = [
            'text="Server bot"',
            'button:has-text("Server bot")',
            '[data-testid="server-bot-option"]',
            'div:has-text("Server bot"):not(:has(div:has-text("Server bot")))',
            'label:has-text("Server bot")',
            'text="API bot"',
            'button:has-text("API bot")',
        ]

        clicked_server = False
        for selector in server_bot_selectors:
            try:
                element = page.locator(selector).first
                if element.is_visible(timeout=2000):
                    element.click()
                    clicked_server = True
                    log.info("  Selected 'Server bot' type")
                    time.sleep(1)
                    break
            except Exception:
                continue

        if not clicked_server:
            log.warning("  Could not find 'Server bot' selector. Page may have a different layout.")
            log.info("  Attempting to fill form fields directly (may already be on server bot form).")

        # ── Step 2: Fill in bot handle (unique name) ──
        handle_filled = False
        handle_selectors = [
            'input[placeholder*="bot name" i]',
            'input[placeholder*="handle" i]',
            'input[placeholder*="Bot handle" i]',
            'input[name="handle"]',
            'input[name="botName"]',
            '[data-testid="bot-handle-input"] input',
            '[data-testid="handle-input"] input',
        ]
        for selector in handle_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(bot_name)
                    handle_filled = True
                    log.info(f"  Filled handle: {bot_name}")
                    break
            except Exception:
                continue

        if not handle_filled:
            # Fallback: try the first visible text input
            log.warning("  Could not find handle input by known selectors. Trying first input.")
            try:
                inputs = page.locator('input[type="text"]')
                for i in range(inputs.count()):
                    inp = inputs.nth(i)
                    if inp.is_visible():
                        inp.clear()
                        inp.fill(bot_name)
                        handle_filled = True
                        log.info(f"  Filled handle via fallback input #{i}: {bot_name}")
                        break
            except Exception as e:
                log.error(f"  Failed to fill handle: {e}")

        # ── Step 3: Fill display name ──
        display_selectors = [
            'input[placeholder*="display name" i]',
            'input[placeholder*="Display name" i]',
            'input[name="displayName"]',
            '[data-testid="display-name-input"] input',
        ]
        for selector in display_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(display_name)
                    log.info(f"  Filled display name: {display_name}")
                    break
            except Exception:
                continue

        # ── Step 4: Fill description ──
        desc_selectors = [
            'textarea[placeholder*="description" i]',
            'textarea[placeholder*="Description" i]',
            'textarea[name="description"]',
            '[data-testid="description-input"] textarea',
            '[data-testid="bot-description"] textarea',
        ]
        for selector in desc_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(description)
                    log.info(f"  Filled description: {description[:60]}...")
                    break
            except Exception:
                continue

        # ── Step 5: Fill server URL ──
        url_selectors = [
            'input[placeholder*="server" i]',
            'input[placeholder*="Server URL" i]',
            'input[placeholder*="API URL" i]',
            'input[placeholder*="url" i]',
            'input[placeholder*="endpoint" i]',
            'input[name="apiUrl"]',
            'input[name="serverUrl"]',
            '[data-testid="server-url-input"] input',
        ]
        for selector in url_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(server_url)
                    log.info(f"  Filled server URL: {server_url}")
                    break
            except Exception:
                continue

        # ── Step 6: Fill access key ──
        key_selectors = [
            'input[placeholder*="access key" i]',
            'input[placeholder*="Access key" i]',
            'input[placeholder*="API key" i]',
            'input[name="apiKey"]',
            'input[name="accessKey"]',
            'input[type="password"]',
            '[data-testid="access-key-input"] input',
        ]
        for selector in key_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(access_key)
                    log.info("  Filled access key: ****")
                    break
            except Exception:
                continue

        # ── Step 7: Add server bot dependency (model) ──
        # This is usually a search/select widget where you type the model name
        dep_selectors = [
            'input[placeholder*="dependency" i]',
            'input[placeholder*="server bot" i]',
            'input[placeholder*="Search" i]',
            '[data-testid="dependency-input"] input',
            '[data-testid="bot-dependency-search"] input',
        ]
        for selector in dep_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible(timeout=2000):
                    el.clear()
                    el.fill(model)
                    time.sleep(1)
                    # Click the dropdown result
                    try:
                        dropdown = page.locator(f'text="{model}"').first
                        if dropdown.is_visible(timeout=2000):
                            dropdown.click()
                            log.info(f"  Selected model dependency: {model}")
                    except Exception:
                        # Try pressing Enter to select
                        el.press("Enter")
                        log.info(f"  Set model dependency via Enter: {model}")
                    break
            except Exception:
                continue

        # ── Step 8: Enable markdown rendering (if checkbox exists) ──
        try:
            markdown_checkbox = page.locator('text="Markdown"').first
            if markdown_checkbox.is_visible(timeout=1000):
                # Check if it's already enabled
                checkbox = markdown_checkbox.locator("xpath=ancestor::label//input[@type='checkbox']").first
                if not checkbox.is_checked():
                    markdown_checkbox.click()
                    log.info("  Enabled markdown rendering")
        except Exception:
            pass  # Optional field, skip if not found

        time.sleep(1)

        # ── Step 9: Click Create button ──
        create_selectors = [
            'button:has-text("Create bot")',
            'button:has-text("Create Bot")',
            'button:has-text("Create")',
            'button[type="submit"]',
            '[data-testid="create-bot-button"]',
            'button:has-text("Save")',
        ]

        created = False
        for selector in create_selectors:
            try:
                btn = page.locator(selector).first
                if btn.is_visible(timeout=2000) and btn.is_enabled():
                    btn.click()
                    created = True
                    log.info("  Clicked Create button")
                    break
            except Exception:
                continue

        if not created:
            log.error("  Could not find Create button!")
            # Take screenshot for debugging
            screenshot_path = SCRIPT_DIR / f"debug_{slug}.png"
            page.screenshot(path=str(screenshot_path))
            log.info(f"  Debug screenshot saved: {screenshot_path}")
            return False

        # ── Step 10: Wait for creation and verify ──
        time.sleep(3)

        # Check for success indicators
        current_url = page.url
        if bot_name.lower() in current_url.lower() or "edit_bot" in current_url.lower():
            log.info(f"  SUCCESS: Bot created! URL: {current_url}")
            return True

        # Check for error messages
        try:
            error_el = page.locator('[class*="error" i], [class*="Error" i], [role="alert"]').first
            if error_el.is_visible(timeout=2000):
                error_text = error_el.inner_text()
                log.error(f"  ERROR on page: {error_text}")
                # Take screenshot
                screenshot_path = SCRIPT_DIR / f"error_{slug}.png"
                page.screenshot(path=str(screenshot_path))
                return False
        except Exception:
            pass

        # If we reach here, assume success (page navigated away from create_bot)
        if current_url != POE_CREATE_URL:
            log.info(f"  Likely success (navigated to: {current_url})")
            return True

        log.warning(f"  Uncertain result. Current URL: {current_url}")
        screenshot_path = SCRIPT_DIR / f"uncertain_{slug}.png"
        page.screenshot(path=str(screenshot_path))
        return True  # Optimistic

    except Exception as e:
        log.error(f"  Exception creating {bot_name}: {e}")
        try:
            screenshot_path = SCRIPT_DIR / f"crash_{slug}.png"
            page.screenshot(path=str(screenshot_path))
            log.info(f"  Crash screenshot saved: {screenshot_path}")
        except Exception:
            pass
        return False


def wait_for_login(page, timeout_minutes: int = 5):
    """Wait for the user to manually log in to Poe."""
    log.info("=" * 60)
    log.info("MANUAL LOGIN REQUIRED")
    log.info("=" * 60)
    log.info("A browser window has opened at poe.com/login")
    log.info(f"Please log in within {timeout_minutes} minutes.")
    log.info("The script will continue automatically after login.")
    log.info("=" * 60)

    page.goto(POE_LOGIN_URL, wait_until="networkidle", timeout=30000)

    deadline = time.time() + timeout_minutes * 60
    while time.time() < deadline:
        current_url = page.url
        # After login, Poe redirects away from /login
        if "/login" not in current_url and "poe.com" in current_url:
            log.info("Login detected! Continuing...")
            return True
        time.sleep(2)

    log.error("Login timeout. Please try again.")
    return False


def save_auth_state(page, context, path: str):
    """Save browser auth state for reuse."""
    context.storage_state(path=path)
    log.info(f"Auth state saved to: {path}")


def main():
    parser = argparse.ArgumentParser(
        description="Create Poe bots via Playwright browser automation"
    )
    parser.add_argument(
        "--bot", type=str, default="",
        help="Create a single bot by its config slug"
    )
    parser.add_argument(
        "--batch", type=int, default=0,
        help="Create only batch N (1=P1, 2=P2, 3=P3-first, 4=P3-rest)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print what would be done without opening browser"
    )
    parser.add_argument(
        "--headless", action="store_true",
        help="Run browser in headless mode (requires --auth-state)"
    )
    parser.add_argument(
        "--auth-state", type=str, default="",
        help="Path to saved auth state JSON (from previous login)"
    )
    parser.add_argument(
        "--server-url", type=str,
        default=os.environ.get("POE_SERVER_URL", ""),
        help="Your deployed server URL"
    )
    parser.add_argument(
        "--access-key", type=str,
        default=os.environ.get("POE_ACCESS_KEY", ""),
        help="Your Poe API access key"
    )
    parser.add_argument(
        "--delay", type=float, default=5.0,
        help="Seconds to wait between bot creations (default: 5)"
    )
    parser.add_argument(
        "--save-auth", type=str, default="",
        help="Path to save auth state after login (for future runs)"
    )

    args = parser.parse_args()

    # ── Validate inputs ──
    if not args.server_url:
        log.error(
            "Server URL is required. Set POE_SERVER_URL env var or use --server-url"
        )
        sys.exit(1)

    if not args.access_key:
        log.error(
            "Access key is required. Set POE_ACCESS_KEY env var or use --access-key"
        )
        sys.exit(1)

    if args.headless and not args.auth_state:
        log.error(
            "Headless mode requires --auth-state. "
            "Run once without --headless to login and use --save-auth to save state."
        )
        sys.exit(1)

    # ── Determine which bots to create ──
    if args.bot:
        slugs = [args.bot]
    elif args.batch == 1:
        slugs = BATCH1_P1
    elif args.batch == 2:
        slugs = BATCH2_P2
    elif args.batch == 3:
        slugs = BATCH3_P3A
    elif args.batch == 4:
        slugs = BATCH4_P3B
    else:
        slugs = ALL_BOTS

    configs = load_all_bot_configs(slugs)
    log.info(f"Loaded {len(configs)} bot configs")

    # ── Dry run ──
    if args.dry_run:
        print("\n" + "=" * 60)
        print("DRY RUN - Would create the following bots:")
        print("=" * 60)
        for i, config in enumerate(configs, 1):
            bot_name = get_poe_bot_name(config)
            print(
                f"  [{i:2d}] {config['display_name']:30s} "
                f"({bot_name}) "
                f"[{config.get('tier', '?')}/{config.get('model', '?')}]"
            )
        print(f"\nServer URL: {args.server_url}")
        print(f"Access key: ****{args.access_key[-4:]}")
        print(f"Delay: {args.delay}s between bots")
        print("=" * 60)
        return

    # ── Launch browser ──
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.error(
            "Playwright not installed. Install with:\n"
            "  pip install playwright\n"
            "  playwright install chromium"
        )
        sys.exit(1)

    with sync_playwright() as p:
        # Launch browser
        browser_args = {
            "headless": args.headless,
            "slow_mo": 500,  # Slow down actions for visibility
        }

        browser = p.chromium.launch(**browser_args)

        # Create context with or without saved auth
        context_args = {
            "viewport": {"width": 1280, "height": 900},
            "user_agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            ),
        }

        if args.auth_state and os.path.exists(args.auth_state):
            context_args["storage_state"] = args.auth_state
            log.info(f"Using saved auth state: {args.auth_state}")

        context = browser.new_context(**context_args)
        page = context.new_page()

        # ── Login if needed ──
        if not args.auth_state or not os.path.exists(args.auth_state):
            if not wait_for_login(page, timeout_minutes=5):
                browser.close()
                sys.exit(1)

            # Save auth state for future runs
            if args.save_auth:
                save_auth_state(page, context, args.save_auth)
            else:
                # Auto-save to default location
                default_auth = str(SCRIPT_DIR / "poe_auth.json")
                save_auth_state(page, context, default_auth)
                log.info(
                    f"Auth state auto-saved to: {default_auth}\n"
                    f"Use --auth-state {default_auth} for future runs"
                )

        # ── Create bots ──
        created = 0
        failed = 0
        total = len(configs)

        print("\n" + "=" * 60)
        print(f"Creating {total} bots on poe.com")
        print(f"Server: {args.server_url}")
        print(f"Delay: {args.delay}s between bots")
        print("=" * 60 + "\n")

        for i, config in enumerate(configs):
            counter = i + 1
            slug = config.get("_slug", "unknown")
            bot_name = get_poe_bot_name(config)

            print(f"\n[{counter}/{total}] {slug}")

            success = create_single_bot(
                page=page,
                config=config,
                server_url=args.server_url,
                access_key=args.access_key,
                delay=args.delay,
            )

            if success:
                created += 1
                log.info(f"  [{counter}/{total}] {bot_name}: OK")
            else:
                failed += 1
                log.error(f"  [{counter}/{total}] {bot_name}: FAILED")

            # Rate limiting
            if counter < total:
                log.info(f"  Waiting {args.delay}s before next bot...")
                time.sleep(args.delay)

        # ── Summary ──
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"  Total:   {total}")
        print(f"  Created: {created}")
        print(f"  Failed:  {failed}")
        print("=" * 60)

        if failed > 0:
            print("\nFailed bots - check screenshots in:")
            print(f"  {SCRIPT_DIR}/error_*.png")
            print(f"  {SCRIPT_DIR}/crash_*.png")
            print("\nYou can retry failed bots individually:")
            print("  python3 create-bots.py --bot <slug> --auth-state poe_auth.json")

        print("\nNext steps:")
        print("  1. Visit each bot at: poe.com/<BotName>")
        print("  2. Test with suggested replies")
        print("  3. Set visibility to Public in bot settings")
        print("  4. Enable monetization at poe.com/settings")

        # Cleanup
        context.close()
        browser.close()


if __name__ == "__main__":
    main()
