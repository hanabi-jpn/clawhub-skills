#!/usr/bin/env python3
"""
Extract system prompts from all 43 hanabi-jpn SKILL.md files.

Reads each SKILL.md from the package directories (ec-master-pack/,
finance-accounting-pack/, marketing-growth-pack/, business-ops-pack/,
security-devops-pack/), extracts the content between "## System Prompt
Instructions" (or "## System Prompt") and the next "##" heading at the
same level, then saves each as a JSON file in the configs/ directory.
"""

import json
import os
import re
import sys

# All 43 skill directories (organized by package)
# Maps skill_slug → package_dir/skill_slug
SKILL_PACKAGES = {
    # ── ec-master-pack (9) ──
    "ec-cube-operator": "ec-master-pack",
    "rakuten-seller": "ec-master-pack",
    "stripe-japan-agent": "ec-master-pack",
    "base-stores-agent": "ec-master-pack",
    "amazon-japan-seller": "ec-master-pack",
    "yahoo-shopping-agent": "ec-master-pack",
    "mercari-shops-agent": "ec-master-pack",
    "shopify-japan": "ec-master-pack",
    "makeshop-agent": "ec-master-pack",

    # ── finance-accounting-pack (10) ──
    "freee-agent": "finance-accounting-pack",
    "paypay-biz": "finance-accounting-pack",
    "jp-tax-calc": "finance-accounting-pack",
    "moneyforward-agent": "finance-accounting-pack",
    "yayoi-agent": "finance-accounting-pack",
    "misoca-agent": "finance-accounting-pack",
    "airpay-agent": "finance-accounting-pack",
    "square-japan": "finance-accounting-pack",
    "e-tax-agent": "finance-accounting-pack",
    "japan-invoice": "finance-accounting-pack",

    # ── marketing-growth-pack (8) ──
    "jp-humanizer": "marketing-growth-pack",
    "jp-seo-writer": "marketing-growth-pack",
    "google-ads-agent": "marketing-growth-pack",
    "ga4-search-console": "marketing-growth-pack",
    "google-maps-biz": "marketing-growth-pack",
    "social-media-publisher": "marketing-growth-pack",
    "sansan-agent": "marketing-growth-pack",
    "hubspot-japan": "marketing-growth-pack",

    # ── business-ops-pack (13) ──
    "line-agent": "business-ops-pack",
    "lark-workflow": "business-ops-pack",
    "notion-jp": "business-ops-pack",
    "google-workspace-agent": "business-ops-pack",
    "chatwork-agent": "business-ops-pack",
    "kintone-agent": "business-ops-pack",
    "smarthr-agent": "business-ops-pack",
    "backlog-agent": "business-ops-pack",
    "kingof-time-agent": "business-ops-pack",
    "line-works-agent": "business-ops-pack",
    "jooto-agent": "business-ops-pack",
    "slack-japan-agent": "business-ops-pack",
    "cybozu-garoon": "business-ops-pack",

    # ── security-devops-pack (3) ──
    "mac-sentinel": "security-devops-pack",
    "repo-guardian": "security-devops-pack",
    "credential-vault": "security-devops-pack",
}

SKILL_DIRS = list(SKILL_PACKAGES.keys())

# Metadata for each skill (display_name, description, tier)
SKILL_META = {
    # ── ec-master-pack ──
    "ec-cube-operator": {
        "display_name": "EC-CUBE Operator",
        "description": "EC-CUBE 4.x store management agent. Products, inventory, orders, customers, and analytics for Japan's largest open-source e-commerce platform.",
        "tier": "P3",
    },
    "rakuten-seller": {
        "display_name": "Rakuten Seller",
        "description": "Rakuten Ichiba shop automation via RMS API. Products, inventory, orders, reviews, and analytics for Japan's largest marketplace (55M+ monthly users).",
        "tier": "P3",
    },
    "stripe-japan-agent": {
        "display_name": "Stripe Japan Agent",
        "description": "Payment management for Japan via Stripe. PayPay, konbini payments, subscriptions, invoicing, and revenue analytics.",
        "tier": "P2",
    },
    "base-stores-agent": {
        "display_name": "BASE & STORES Agent",
        "description": "Manage Japanese EC shops on BASE and STORES. Products, orders, inventory, and analytics for instant-commerce platforms.",
        "tier": "P3",
    },
    "amazon-japan-seller": {
        "display_name": "Amazon Japan Seller",
        "description": "Amazon.co.jp seller automation via SP-API. Product listings, FBA inventory, orders, advertising, and performance analytics for Japan's largest marketplace.",
        "tier": "P3",
    },
    "yahoo-shopping-agent": {
        "display_name": "Yahoo! Shopping Agent",
        "description": "Yahoo! Shopping store automation via Commerce API. Product management, orders, promotions, and analytics for Yahoo! Japan's marketplace.",
        "tier": "P3",
    },
    "mercari-shops-agent": {
        "display_name": "Mercari Shops Agent",
        "description": "Mercari Shops seller management. Product listings, order fulfillment, messaging, and sales analytics for Japan's largest flea market app (20M+ MAU).",
        "tier": "P3",
    },
    "shopify-japan": {
        "display_name": "Shopify Japan",
        "description": "Shopify store management optimized for Japan. Products, orders, inventory, Japanese payment methods, and Shopify Flow automation.",
        "tier": "P3",
    },
    "makeshop-agent": {
        "display_name": "MakeShop Agent",
        "description": "MakeShop by GMO store automation. Product management, orders, customer data, and analytics for Japan's feature-rich EC platform (22,000+ shops).",
        "tier": "P3",
    },

    # ── finance-accounting-pack ──
    "freee-agent": {
        "display_name": "Freee Agent",
        "description": "freee accounting and HR automation. Bookkeeping, expense management, invoicing, and financial reporting for Japanese businesses. Invoice system compliant.",
        "tier": "P3",
    },
    "paypay-biz": {
        "display_name": "PayPay Biz",
        "description": "PayPay payment management and analytics agent. Payment status, refunds, sales analysis, QR code generation for Japan's largest mobile payment platform (65M+ users).",
        "tier": "P3",
    },
    "jp-tax-calc": {
        "display_name": "JP Tax Calc",
        "description": "Japanese tax calculation and filing support. Income tax, consumption tax, corporate tax with e-Tax integration. Updated for 2026 tax law.",
        "tier": "P3",
    },
    "moneyforward-agent": {
        "display_name": "MoneyForward Agent",
        "description": "Cloud accounting automation via MoneyForward. Invoices, expenses, journal entries, and bank reconciliation for Japanese businesses.",
        "tier": "P3",
    },
    "yayoi-agent": {
        "display_name": "Yayoi Agent",
        "description": "Accounting automation for Yayoi. Smart transaction import, Misoca invoicing, bank reconciliation, and tax filing support.",
        "tier": "P3",
    },
    "misoca-agent": {
        "display_name": "Misoca Agent",
        "description": "Misoca cloud invoicing automation by Yayoi. Invoice creation, sending, status tracking, and Tekikaku Invoice compliance for Japanese businesses.",
        "tier": "P3",
    },
    "airpay-agent": {
        "display_name": "AirPay Agent",
        "description": "AirPay payment terminal management by Recruit. Transaction history, settlement reports, and multi-payment method analytics (credit, QR, e-money).",
        "tier": "P3",
    },
    "square-japan": {
        "display_name": "Square Japan",
        "description": "Square POS and payment management for Japan. Transactions, invoices, inventory, customer directory, and sales analytics via Square API.",
        "tier": "P3",
    },
    "e-tax-agent": {
        "display_name": "e-Tax Agent",
        "description": "e-Tax electronic tax filing assistant for Japan. Guides kakutei shinkoku preparation, validates forms, and generates XML for National Tax Agency submission.",
        "tier": "P3",
    },
    "japan-invoice": {
        "display_name": "Japan Invoice",
        "description": "Tekikaku Invoice System (qualified invoice) compliance agent. Generate, validate, and manage invoices meeting Japan's 2023 invoice requirements.",
        "tier": "P3",
    },

    # ── marketing-growth-pack ──
    "jp-humanizer": {
        "display_name": "JP Humanizer",
        "description": "Japanese AI text humanization specialist. 500+ patterns, 4 modes (keigo/business/casual/SNS), achieving 0% AI detection for Japanese text.",
        "tier": "P3",
    },
    "jp-seo-writer": {
        "display_name": "JP SEO Writer",
        "description": "Japanese SEO article generator with keyword research, co-occurrence analysis, content structure planning, and E-E-A-T compliance.",
        "tier": "P3",
    },
    "google-ads-agent": {
        "display_name": "Google Ads Agent",
        "description": "AI-powered Google Ads campaign management. Create, optimize, audit, and report on PPC campaigns with bid optimization and keyword research.",
        "tier": "P1",
    },
    "ga4-search-console": {
        "display_name": "GA4 & Search Console",
        "description": "Query GA4 analytics and Google Search Console in natural language. Traffic analysis, SEO insights, conversion tracking, and performance reports.",
        "tier": "P1",
    },
    "google-maps-biz": {
        "display_name": "Google Maps Biz",
        "description": "Location intelligence for business. Geocoding, places search, routing optimization, and Google Business Profile management.",
        "tier": "P1",
    },
    "social-media-publisher": {
        "display_name": "Social Media Publisher",
        "description": "Cross-platform social media posting and analytics. X/Twitter, Instagram, TikTok, and LINE scheduling, content creation, and engagement tracking.",
        "tier": "P2",
    },
    "sansan-agent": {
        "display_name": "Sansan Agent",
        "description": "Business card and contact intelligence. Search, manage, and sync digitized cards for Japanese B2B networking with Sansan.",
        "tier": "P3",
    },
    "hubspot-japan": {
        "display_name": "HubSpot Japan",
        "description": "HubSpot CRM and marketing automation for Japanese businesses. Contacts, deals, email campaigns, forms, and analytics with Japanese language support.",
        "tier": "P2",
    },

    # ── business-ops-pack ──
    "line-agent": {
        "display_name": "LINE Agent",
        "description": "LINE Official Account automation. Messaging, Rich Menus, segment delivery, CRM, and AI auto-response for Japan's #1 messaging platform (96M+ users).",
        "tier": "P3",
    },
    "lark-workflow": {
        "display_name": "Lark Workflow",
        "description": "Lark/Feishu workspace automation. Approval workflows, bot notifications, document management, and calendar integration.",
        "tier": "P3",
    },
    "notion-jp": {
        "display_name": "Notion JP",
        "description": "Notion workspace management with Japanese-optimized templates. Meeting notes, daily reports, project management, and approval workflows for Japanese businesses.",
        "tier": "P3",
    },
    "google-workspace-agent": {
        "display_name": "Google Workspace Agent",
        "description": "Unified Gmail, Calendar, Drive, Sheets, and Docs management. Automate your entire Google Workspace from a single agent.",
        "tier": "P1",
    },
    "chatwork-agent": {
        "display_name": "Chatwork Agent",
        "description": "Automate Japan's #1 business chat. Messages, tasks, rooms, and bot integration via ChatWork API v2.",
        "tier": "P2",
    },
    "kintone-agent": {
        "display_name": "Kintone Agent",
        "description": "Build, query, and automate Cybozu kintone apps. Japan's leading no-code business platform with 30,000+ companies.",
        "tier": "P2",
    },
    "smarthr-agent": {
        "display_name": "SmartHR Agent",
        "description": "HR and labor management automation. Employee onboarding, documents, payroll, and compliance on Japan's leading HR cloud.",
        "tier": "P3",
    },
    "backlog-agent": {
        "display_name": "Backlog Agent",
        "description": "Project management on Nulab Backlog. Issues, wikis, milestones, Git integration, and sprint management for Japan's top PM tool.",
        "tier": "P3",
    },
    "kingof-time-agent": {
        "display_name": "King of Time Agent",
        "description": "Attendance and time tracking automation. Daily/monthly reports, overtime alerts, and payroll sync via Japan's leading attendance system.",
        "tier": "P3",
    },
    "line-works-agent": {
        "display_name": "LINE WORKS Agent",
        "description": "Enterprise LINE communication. Bots, messages, groups, and calendar on Japan's business-grade LINE platform.",
        "tier": "P3",
    },
    "jooto-agent": {
        "display_name": "Jooto Agent",
        "description": "Task and project management on Jooto. Kanban boards, task automation, and team workflows via PR TIMES' project management tool.",
        "tier": "P3",
    },
    "slack-japan-agent": {
        "display_name": "Slack Japan Agent",
        "description": "Slack workspace automation for Japanese teams. Channel management, workflow builder, app integrations, and bilingual bot responses.",
        "tier": "P3",
    },
    "cybozu-garoon": {
        "display_name": "Cybozu Garoon",
        "description": "Cybozu Garoon groupware automation. Schedule, workflow, bulletin board, and facility management for large Japanese enterprises (6,600+ companies).",
        "tier": "P3",
    },

    # ── security-devops-pack ──
    "mac-sentinel": {
        "display_name": "Mac Sentinel",
        "description": "macOS security hardening for Claude Code. Pre-execution validation, malicious config detection, credential hygiene, and endpoint protection.",
        "tier": "P3",
    },
    "repo-guardian": {
        "display_name": "Repo Guardian",
        "description": "Pre-clone security scanner. Detect malicious hooks, poisoned MCP configs, credential-harvesting patterns before processing repos.",
        "tier": "P3",
    },
    "credential-vault": {
        "display_name": "Credential Vault",
        "description": "Secure API key management. Encrypted storage, auto-rotation, leak detection, and safe injection for Claude Code credentials.",
        "tier": "P3",
    },
}


def extract_system_prompt(skill_md_path: str) -> str:
    """Extract the system prompt section from a SKILL.md file.

    Looks for a heading containing 'System Prompt' and extracts everything
    until the next same-level heading (## or end of file).
    """
    with open(skill_md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the System Prompt section - try multiple patterns
    patterns = [
        r"## System Prompt Instructions\n",
        r"## System Prompt\n",
    ]

    start_idx = -1
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            start_idx = match.end()
            break

    if start_idx == -1:
        print(f"  WARNING: No system prompt section found in {skill_md_path}")
        # Fall back to extracting everything after Overview section
        overview_match = re.search(r"## Overview\n", content)
        if overview_match:
            # Return the description from the file header instead
            desc_match = re.search(r"^> (.+?)$", content, re.MULTILINE)
            if desc_match:
                return desc_match.group(1)
        return ""

    # Find the next ## heading (same level) after the system prompt section
    next_heading = re.search(r"\n## [^#]", content[start_idx:])
    if next_heading:
        end_idx = start_idx + next_heading.start()
    else:
        end_idx = len(content)

    system_prompt = content[start_idx:end_idx].strip()
    return system_prompt


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    skills_dir = os.path.dirname(base_dir)  # parent = clawhub-skills/
    configs_dir = os.path.join(base_dir, "configs")
    os.makedirs(configs_dir, exist_ok=True)

    results = {}
    success_count = 0
    fail_count = 0

    for skill_slug in SKILL_DIRS:
        package = SKILL_PACKAGES[skill_slug]
        skill_md = os.path.join(skills_dir, package, skill_slug, "SKILL.md")

        if not os.path.exists(skill_md):
            print(f"  SKIP: {skill_md} not found")
            fail_count += 1
            continue

        print(f"  Extracting: {skill_slug}...", end=" ")
        system_prompt = extract_system_prompt(skill_md)

        if not system_prompt:
            print("EMPTY")
            fail_count += 1
            continue

        meta = SKILL_META.get(skill_slug, {})
        config = {
            "bot_name": skill_slug,
            "display_name": meta.get("display_name", skill_slug),
            "description": meta.get("description", ""),
            "tier": meta.get("tier", "P3"),
            "system_prompt": system_prompt,
            "prompt_length": len(system_prompt),
            "prompt_tokens_est": len(system_prompt) // 4,  # rough estimate
        }

        # Save individual config
        config_path = os.path.join(configs_dir, f"{skill_slug}.json")
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)

        results[skill_slug] = config
        word_count = len(system_prompt.split())
        print(f"OK ({word_count} words, ~{config['prompt_tokens_est']} tokens)")
        success_count += 1

    # Save combined config
    combined_path = os.path.join(configs_dir, "_all_bots.json")
    with open(combined_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"Extraction complete: {success_count} succeeded, {fail_count} failed")
    print(f"Configs saved to: {configs_dir}/")
    print(f"Combined config: {combined_path}")


if __name__ == "__main__":
    main()
