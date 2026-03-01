#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════
All-Platform Launcher — Gumroad + Poe + Coze + GPT Store
═══════════════════════════════════════════════════════════════════
Auto-detects login state. No interactive input needed.
Browser opens → user logs in → script detects and proceeds.
"""
import json, os, sys, time, re
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

SKILLS_ROOT = Path(__file__).parent.parent
AUTH_DIR = SKILLS_ROOT / "automation" / "auth"
AUTH_DIR.mkdir(parents=True, exist_ok=True)

def extract_skills():
    packs = ["ec-master-pack", "finance-accounting-pack", "marketing-growth-pack",
             "business-ops-pack", "security-devops-pack"]
    skills = []
    for pack in packs:
        pack_dir = SKILLS_ROOT / pack
        if not pack_dir.exists():
            continue
        for skill_dir in sorted(pack_dir.iterdir()):
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.exists():
                continue
            content = skill_md.read_text(encoding="utf-8")
            fm_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
            name = skill_dir.name
            description = ""
            if fm_match and yaml:
                try:
                    fm = yaml.safe_load(fm_match.group(1))
                    name = fm.get("name", name)
                    description = fm.get("description", "")
                except:
                    pass
            elif fm_match:
                for line in fm_match.group(1).split("\n"):
                    if line.startswith("name:"):
                        name = line.split(":", 1)[1].strip().strip('"').strip("'")
                    elif line.startswith("description:"):
                        description = line.split(":", 1)[1].strip().strip('"').strip("'")

            # Extract behavioral guidelines as system prompt
            guidelines = ""
            lines = content.split("\n")
            in_guidelines = False
            for line in lines:
                if "behavioral" in line.lower() or "guideline" in line.lower() or "ルール" in line:
                    in_guidelines = True
                    continue
                if in_guidelines:
                    if line.startswith("## ") or line.startswith("---"):
                        break
                    guidelines += line + "\n"

            system_prompt = guidelines.strip()[:4000] if guidelines.strip() else content[:4000]

            skills.append({
                "id": skill_dir.name,
                "name": name,
                "description": description[:200],
                "system_prompt": system_prompt,
                "pack": pack
            })
    return skills


def wait_for_login(page, check_selector, platform_name, timeout=180):
    """Wait for login by checking for a logged-in indicator element."""
    print(f"  ブラウザでログインしてください... (最大{timeout}秒待機)")
    start = time.time()
    while time.time() - start < timeout:
        try:
            if page.locator(check_selector).first.is_visible(timeout=3000):
                print(f"  ✓ {platform_name} ログイン検出!")
                return True
        except:
            pass
        time.sleep(2)
    print(f"  ✗ タイムアウト: {platform_name} ログインが検出できませんでした")
    return False


# ────────────────────────────────────────────
# Gumroad
# ────────────────────────────────────────────
def create_gumroad_products():
    from playwright.sync_api import sync_playwright

    products = [
        {"name": "EC Master Pack — 9 AI Agent Skills for Japanese E-Commerce", "price": "49",
         "desc": "9 Claude Code skills for EC operations: Rakuten, Amazon, Yahoo Shopping, Mercari, Shopify, EC-CUBE, BASE/STORES, MakeShop, Stripe. Manage all platforms from your terminal."},
        {"name": "Finance & Accounting Pack — 10 AI Agent Skills", "price": "49",
         "desc": "10 Claude Code skills: freee, MoneyForward, Yayoi, Misoca, PayPay, AirPay, Square, Tax Calc, e-Tax, Invoice. Automate Japanese accounting from CLI."},
        {"name": "Marketing & Growth Pack — 8 AI Agent Skills", "price": "39",
         "desc": "8 Claude Code skills: SEO Writer, Humanizer, Google Ads, GA4+Search Console, Google Maps, Social Media, Sansan, HubSpot. Growth marketing from terminal."},
        {"name": "Business Ops Pack — 13 AI Agent Skills", "price": "49",
         "desc": "13 Claude Code skills: LINE, Chatwork, Slack, LINE WORKS, Lark, kintone, Backlog, Jooto, Notion, SmartHR, KING OF TIME, Garoon, Google Workspace."},
        {"name": "All-in-One Bundle — 43 AI Agent Skills (Save 37%)", "price": "149",
         "desc": "All 43 Claude Code skills across 5 packs. EC, Finance, Marketing, Business Ops, Security. Complete Japanese business AI toolkit. Save 37% vs buying separately ($236)."},
    ]

    auth_file = AUTH_DIR / "gumroad.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)
        ctx = browser.new_context(storage_state=str(auth_file) if auth_file.exists() else None)
        page = ctx.new_page()

        page.goto("https://app.gumroad.com/products")
        time.sleep(3)

        # Check if already logged in
        if not page.locator('a[href*="products/new"], button:has-text("New product")').first.is_visible(timeout=5000):
            page.goto("https://app.gumroad.com/login")
            if not wait_for_login(page, 'a[href*="products/new"], button:has-text("New product"), [data-testid="products"]', "Gumroad"):
                browser.close()
                return

        for i, product in enumerate(products):
            print(f"\n[{i+1}/5] Creating: {product['name']}")
            try:
                page.goto("https://app.gumroad.com/products/new")
                time.sleep(3)

                # Fill name
                name_sel = page.locator('input[name="name"], input[placeholder*="Name"], input[aria-label*="Name"]').first
                name_sel.click()
                name_sel.fill(product["name"])
                time.sleep(0.5)

                # Fill price
                price_sel = page.locator('input[name="price"], input[placeholder*="0"], input[type="number"]').first
                if price_sel.is_visible(timeout=2000):
                    price_sel.click()
                    price_sel.fill(product["price"])
                time.sleep(0.5)

                # Fill description
                desc_sel = page.locator('textarea, [contenteditable="true"], .ProseMirror').first
                if desc_sel.is_visible(timeout=2000):
                    desc_sel.click()
                    desc_sel.fill(product["desc"])
                time.sleep(1)

                # Click create/add
                for btn in ["Add product", "Create product", "Publish", "Save", "Next"]:
                    b = page.locator(f'button:has-text("{btn}")').first
                    if b.is_visible(timeout=1000):
                        b.click()
                        time.sleep(3)
                        break

                print(f"  ✓ Done: {product['name']}")
            except Exception as e:
                print(f"  ✗ Error: {e}")

        ctx.storage_state(path=str(auth_file))
        print("\n✓ Gumroad: 5 products complete!")
        browser.close()


# ────────────────────────────────────────────
# Poe Prompt Bots
# ────────────────────────────────────────────
def create_poe_bots(skills):
    from playwright.sync_api import sync_playwright

    auth_file = AUTH_DIR / "poe.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=300)
        ctx = browser.new_context(storage_state=str(auth_file) if auth_file.exists() else None)
        page = ctx.new_page()

        page.goto("https://poe.com/create_bot")
        time.sleep(3)

        # Check login
        if page.url and "login" in page.url.lower():
            if not wait_for_login(page, '[class*="BotCreator"], [class*="CreateBot"]', "Poe"):
                browser.close()
                return

        for i, skill in enumerate(skills):
            bot_name = "hanabi_" + skill["id"].replace("-", "_")[:15]
            print(f"\n[{i+1}/{len(skills)}] {bot_name}: {skill['name']}")
            try:
                page.goto("https://poe.com/create_bot")
                time.sleep(4)

                # Handle name input
                inputs = page.locator('input[type="text"]')
                if inputs.count() > 0:
                    inputs.first.fill(bot_name)
                    time.sleep(0.5)

                # Handle description/prompt textareas
                textareas = page.locator('textarea')
                ta_count = textareas.count()
                if ta_count >= 1:
                    # First textarea = description or prompt
                    textareas.nth(0).fill(skill["description"][:300])
                if ta_count >= 2:
                    # Second textarea = system prompt
                    textareas.nth(ta_count - 1).fill(skill["system_prompt"][:4000])
                elif ta_count == 1:
                    # Single textarea = prompt
                    textareas.nth(0).fill(skill["system_prompt"][:4000])

                time.sleep(1)

                # Create bot
                create_btn = page.locator('button:has-text("Create bot"), button:has-text("Create")').first
                if create_btn.is_visible(timeout=3000):
                    create_btn.click()
                    time.sleep(4)

                print(f"  ✓ Created")
            except Exception as e:
                print(f"  ✗ {e}")
                time.sleep(1)

        ctx.storage_state(path=str(auth_file))
        print(f"\n✓ Poe: {len(skills)} bots complete!")
        browser.close()


# ────────────────────────────────────────────
# Coze
# ────────────────────────────────────────────
def create_coze_bots(skills):
    from playwright.sync_api import sync_playwright

    auth_file = AUTH_DIR / "coze.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=300)
        ctx = browser.new_context(storage_state=str(auth_file) if auth_file.exists() else None)
        page = ctx.new_page()

        page.goto("https://www.coze.com/space")
        time.sleep(3)

        if "login" in page.url.lower() or "sign" in page.url.lower():
            if not wait_for_login(page, '[class*="space"], [class*="bot"]', "Coze"):
                browser.close()
                return

        for i, skill in enumerate(skills):
            print(f"\n[{i+1}/{len(skills)}] Coze: {skill['name']}")
            try:
                page.goto("https://www.coze.com/space/bot/new")
                time.sleep(4)

                # Name
                name_input = page.locator('input').first
                if name_input.is_visible(timeout=5000):
                    name_input.fill(skill["name"][:30])

                # Find prompt/persona textarea
                textareas = page.locator('textarea')
                for j in range(textareas.count()):
                    ta = textareas.nth(j)
                    if ta.is_visible():
                        ta.fill(skill["system_prompt"][:4000])
                        break

                time.sleep(1)

                # Publish
                for btn_text in ["Publish", "Create", "Save"]:
                    btn = page.locator(f'button:has-text("{btn_text}")').first
                    if btn.is_visible(timeout=2000):
                        btn.click()
                        time.sleep(3)

                        # Handle publish dialog
                        for confirm in ["Confirm", "OK", "Publish"]:
                            c = page.locator(f'button:has-text("{confirm}")').first
                            if c.is_visible(timeout=2000):
                                c.click()
                                time.sleep(2)
                                break
                        break

                print(f"  ✓ Created")
            except Exception as e:
                print(f"  ✗ {e}")
                time.sleep(1)

        ctx.storage_state(path=str(auth_file))
        print(f"\n✓ Coze: {len(skills)} bots complete!")
        browser.close()


# ────────────────────────────────────────────
# GPT Store
# ────────────────────────────────────────────
def create_gpts(skills):
    from playwright.sync_api import sync_playwright

    auth_file = AUTH_DIR / "gpt.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=300)
        ctx = browser.new_context(storage_state=str(auth_file) if auth_file.exists() else None)
        page = ctx.new_page()

        page.goto("https://chatgpt.com/gpts/editor")
        time.sleep(5)

        if "auth" in page.url.lower() or "login" in page.url.lower():
            if not wait_for_login(page, 'button:has-text("Configure"), button:has-text("Create")', "ChatGPT", timeout=300):
                browser.close()
                return

        for i, skill in enumerate(skills):
            print(f"\n[{i+1}/{len(skills)}] GPT: {skill['name']}")
            try:
                page.goto("https://chatgpt.com/gpts/editor")
                time.sleep(5)

                # Click Configure tab
                config_tab = page.locator('button:has-text("Configure")').first
                if config_tab.is_visible(timeout=5000):
                    config_tab.click()
                    time.sleep(2)

                # Fill Name
                inputs = page.locator('input[type="text"]')
                if inputs.count() > 0:
                    inputs.first.fill(skill["name"][:50])
                    time.sleep(0.5)

                # Fill Description
                textareas = page.locator('textarea')
                if textareas.count() >= 1:
                    textareas.nth(0).fill(skill["description"][:200])
                # Fill Instructions
                if textareas.count() >= 2:
                    textareas.nth(1).fill(skill["system_prompt"][:4000])

                time.sleep(1)

                # Save
                save_btn = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Update")').first
                if save_btn.is_visible(timeout=3000):
                    save_btn.click()
                    time.sleep(2)

                    # Select "Everyone" and confirm
                    everyone = page.locator('label:has-text("Everyone"), div:has-text("Everyone")').first
                    if everyone.is_visible(timeout=3000):
                        everyone.click()
                        time.sleep(1)

                    confirm = page.locator('button:has-text("Confirm"), button:has-text("Save")').last
                    if confirm.is_visible(timeout=3000):
                        confirm.click()
                        time.sleep(4)

                print(f"  ✓ Created")
            except Exception as e:
                print(f"  ✗ {e}")
                time.sleep(1)

        ctx.storage_state(path=str(auth_file))
        print(f"\n✓ GPT Store: {len(skills)} GPTs complete!")
        browser.close()


# ────────────────────────────────────────────
# Main
# ────────────────────────────────────────────
def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", choices=["gumroad", "poe", "coze", "gpt", "all"], default="all")
    parser.add_argument("--start-from", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    print("╔══════════════════════════════════════════════════╗")
    print("║  All-Platform Launcher — hanabi-jpn 43 Skills   ║")
    print("╚══════════════════════════════════════════════════╝")

    skills = extract_skills()
    print(f"\n{len(skills)} skills extracted")

    if args.start_from > 0:
        skills = skills[args.start_from:]

    if args.dry_run:
        for s in skills:
            print(f"  [{s['pack']}] {s['id']}: {s['name']}")
        return

    platforms = ["gumroad", "poe", "coze", "gpt"] if args.platform == "all" else [args.platform]

    for platform in platforms:
        print(f"\n{'='*60}")
        print(f"  {platform.upper()}")
        print(f"{'='*60}")
        try:
            if platform == "gumroad":
                create_gumroad_products()
            elif platform == "poe":
                create_poe_bots(skills)
            elif platform == "coze":
                create_coze_bots(skills)
            elif platform == "gpt":
                create_gpts(skills)
        except Exception as e:
            print(f"  Platform error: {e}")

    print("\n" + "=" * 60)
    print("  ALL DONE!")
    print("=" * 60)

if __name__ == "__main__":
    main()
