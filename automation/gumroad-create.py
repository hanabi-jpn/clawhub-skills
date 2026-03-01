#!/usr/bin/env python3
"""Gumroad product creator using user's Chrome profile (already logged in)."""
import time
from playwright.sync_api import sync_playwright

PRODUCTS = [
    {
        "name": "EC Master Pack — 9 AI Agent Skills for Japanese E-Commerce",
        "price": "4900",
        "desc": "9 Claude Code skills for EC operations: Rakuten, Amazon Japan, Yahoo Shopping, Mercari Shops, Shopify Japan, EC-CUBE, BASE/STORES, MakeShop, Stripe Japan. Manage all Japanese e-commerce platforms from your terminal with natural language commands.",
        "tags": ["ai", "claude", "ecommerce", "japan", "rakuten", "amazon"]
    },
    {
        "name": "Finance & Accounting Pack — 10 AI Agent Skills",
        "price": "4900",
        "desc": "10 Claude Code skills for Japanese accounting: freee, MoneyForward, Yayoi, Misoca, PayPay Biz, AirPay, Square Japan, JP Tax Calc, e-Tax, Japan Invoice. Automate bookkeeping, tax filing, and payment processing from CLI.",
        "tags": ["ai", "claude", "finance", "accounting", "freee", "tax"]
    },
    {
        "name": "Marketing & Growth Pack — 8 AI Agent Skills",
        "price": "3900",
        "desc": "8 Claude Code skills for growth: JP SEO Writer, JP Humanizer, Google Ads Agent, GA4 Search Console, Google Maps Biz, Social Media Publisher, Sansan, HubSpot Japan. Content, ads, analytics, and CRM from terminal.",
        "tags": ["ai", "claude", "marketing", "seo", "ads", "analytics"]
    },
    {
        "name": "Business Ops Pack — 13 AI Agent Skills",
        "price": "4900",
        "desc": "13 Claude Code skills: LINE, Chatwork, Slack Japan, LINE WORKS, Lark Workflow, kintone, Backlog, Jooto, Notion JP, SmartHR, KING OF TIME, Cybozu Garoon, Google Workspace. Complete Japanese business operations toolkit.",
        "tags": ["ai", "claude", "business", "slack", "kintone", "line"]
    },
    {
        "name": "All-in-One Bundle — Complete 43 AI Agent Skills (Save 37%)",
        "price": "14900",
        "desc": "ALL 43 Claude Code skills across 5 packs: EC (9), Finance (10), Marketing (8), Business Ops (13), Security (3). Complete Japanese business AI toolkit. Save 37% vs buying separately (¥23,600). Includes n8n workflow templates as bonus.",
        "tags": ["ai", "claude", "bundle", "japan", "business", "complete"]
    },
]

def main():
    print("╔══════════════════════════════════════════════════╗")
    print("║  Gumroad Product Creator — 5 Packs              ║")
    print("╚══════════════════════════════════════════════════╝")

    with sync_playwright() as p:
        # Use channel="chrome" to use the installed Chrome with user's cookies
        try:
            browser = p.chromium.launch(channel="chrome", headless=False, slow_mo=500)
        except:
            browser = p.chromium.launch(headless=False, slow_mo=500)

        page = browser.new_page()
        page.goto("https://app.gumroad.com/products")
        time.sleep(5)

        # Check if on dashboard (logged in)
        url = page.url
        print(f"Current URL: {url}")

        if "login" in url or "sign" in url:
            print("ログインが必要です。ブラウザでGumroadにログインしてください...")
            page.wait_for_url("**/products**", timeout=300000)
            print("ログイン検出!")

        for i, product in enumerate(PRODUCTS):
            print(f"\n[{i+1}/5] Creating: {product['name'][:50]}...")
            page.goto("https://app.gumroad.com/products/new")
            time.sleep(4)

            try:
                # Try to find and fill the name field
                page.fill('input[placeholder*="Name of product"]', product["name"], timeout=5000)
            except:
                try:
                    page.locator('input').first.fill(product["name"])
                except:
                    print(f"  Could not find name input")

            time.sleep(1)

            try:
                # Price (Gumroad uses cents, or might be in yen)
                price_input = page.locator('input[data-testid="price-input"], input[placeholder*="0"], input[name*="price"]').first
                if price_input.is_visible(timeout=3000):
                    price_input.fill(product["price"])
            except:
                pass

            time.sleep(1)

            # Click "Add product" or equivalent
            try:
                for btn_text in ["Add product", "Create product", "Save", "Next"]:
                    btn = page.locator(f'button:has-text("{btn_text}")').first
                    if btn.is_visible(timeout=2000):
                        btn.click()
                        time.sleep(3)
                        print(f"  ✓ Clicked '{btn_text}'")
                        break
            except:
                print(f"  Could not find create button")

            time.sleep(2)

            # After product created, try to add description
            try:
                desc_area = page.locator('textarea, .ProseMirror, [contenteditable="true"]').first
                if desc_area.is_visible(timeout=3000):
                    desc_area.click()
                    desc_area.fill(product["desc"])
                    print(f"  ✓ Description added")
            except:
                pass

            time.sleep(1)

            # Try to save/publish
            try:
                for btn_text in ["Save", "Publish", "Update"]:
                    btn = page.locator(f'button:has-text("{btn_text}")').first
                    if btn.is_visible(timeout=2000):
                        btn.click()
                        time.sleep(2)
                        print(f"  ✓ Saved")
                        break
            except:
                pass

            print(f"  Done: {product['name'][:40]}")

        print("\n✓ All 5 Gumroad products created!")
        print("Products page: https://app.gumroad.com/products")
        time.sleep(3)
        browser.close()

if __name__ == "__main__":
    main()
