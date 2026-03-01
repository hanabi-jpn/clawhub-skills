"""
Bot configurations for all 43 hanabi-jpn Poe bots.

Each bot has:
  - bot_name: Poe bot slug (used in URL)
  - display_name: Human-readable name
  - description: Short description for Poe listing
  - model: Underlying LLM to use via Poe server bot
  - tier: P1 (Premium), P2 (Standard), P3 (Lite)
  - suggested_replies: 3 conversation starters
  - system_prompt: Loaded from configs/ JSON files at runtime
"""

import json
import os

CONFIGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "configs")

# ─────────────────────────────────────────────────────────
# Bot definitions (system prompts loaded from configs/)
# ─────────────────────────────────────────────────────────

BOT_DEFINITIONS = {
    # ═══════════════════════════════════════════════════════════
    # ec-master-pack (9 skills)
    # ═══════════════════════════════════════════════════════════
    "ec-cube-operator": {
        "bot_name": "ECCubeOperator",
        "display_name": "EC-CUBE Operator",
        "description": "EC-CUBE 4.x store management. Products, inventory, orders, customers, and RFM analytics for Japan's largest open-source EC platform.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I manage products via EC-CUBE API?",
            "Run an RFM analysis on my customers",
            "Show me the order management commands",
        ],
    },
    "rakuten-seller": {
        "bot_name": "RakutenSeller",
        "display_name": "Rakuten Seller",
        "description": "Rakuten Ichiba shop automation. Product listing, inventory, orders, reviews, and ranking optimization via RMS API.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I list a product on Rakuten?",
            "Optimize my product listing for Rakuten search",
            "Show me my shop analytics",
        ],
    },
    "stripe-japan-agent": {
        "bot_name": "StripeJapanAgent",
        "display_name": "Stripe Japan Agent",
        "description": "Payment management for Japan via Stripe. PayPay, konbini payments, subscriptions, invoicing, and revenue analytics.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Show my Stripe payment dashboard for this month",
            "Set up konbini payment for my checkout flow",
            "Create a subscription plan with tiered pricing",
        ],
    },
    "base-stores-agent": {
        "bot_name": "BaseStoresAgent",
        "display_name": "BASE & STORES Agent",
        "description": "Manage Japanese EC shops on BASE and STORES. Products, orders, inventory, and analytics for instant-commerce platforms.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my BASE shop's sales for this month",
            "List low-stock products across my stores",
            "Update product pricing in bulk from this CSV",
        ],
    },
    "amazon-japan-seller": {
        "bot_name": "AmazonJapanSeller",
        "display_name": "Amazon Japan Seller",
        "description": "Amazon.co.jp seller automation via SP-API. Product listings, FBA inventory, orders, advertising, and performance analytics.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Amazon Japan sales performance this month",
            "Check FBA inventory levels for low-stock items",
            "Optimize my product listing for Amazon Japan search",
        ],
    },
    "yahoo-shopping-agent": {
        "bot_name": "YahooShoppingAgent",
        "display_name": "Yahoo! Shopping Agent",
        "description": "Yahoo! Shopping store automation via Commerce API. Product management, orders, promotions, and analytics.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Yahoo! Shopping store analytics",
            "Create a promotional campaign for this weekend",
            "Sync inventory across my Yahoo! store",
        ],
    },
    "mercari-shops-agent": {
        "bot_name": "MercariShopsAgent",
        "display_name": "Mercari Shops Agent",
        "description": "Mercari Shops seller management. Product listings, order fulfillment, messaging, and sales analytics for Japan's largest flea market app.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "List my active Mercari Shops products",
            "Check pending orders and fulfillment status",
            "Analyze my sales trends on Mercari Shops",
        ],
    },
    "shopify-japan": {
        "bot_name": "ShopifyJapan",
        "display_name": "Shopify Japan",
        "description": "Shopify store management optimized for Japan. Products, orders, inventory, Japanese payment methods, and Shopify Flow automation.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Shopify store dashboard",
            "Set up Japanese payment methods (konbini, bank transfer)",
            "Create a Shopify Flow automation for order processing",
        ],
    },
    "makeshop-agent": {
        "bot_name": "MakeShopAgent",
        "display_name": "MakeShop Agent",
        "description": "MakeShop by GMO store automation. Product management, orders, customer data, and analytics for Japan's feature-rich EC platform.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my MakeShop store performance",
            "Update product prices in bulk",
            "Generate a customer segment report",
        ],
    },

    # ═══════════════════════════════════════════════════════════
    # finance-accounting-pack (10 skills)
    # ═══════════════════════════════════════════════════════════
    "freee-agent": {
        "bot_name": "FreeeAgent",
        "display_name": "Freee Agent",
        "description": "freee accounting automation. AI bookkeeping, expense management, invoicing, and P/L reports for Japanese businesses. Invoice system compliant.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I automate bookkeeping with freee?",
            "Create an invoice for a client",
            "Generate a monthly P/L report",
        ],
    },
    "paypay-biz": {
        "bot_name": "PayPayBiz",
        "display_name": "PayPay Biz",
        "description": "PayPay payment management. Payment status, refunds, sales analytics, and QR code generation for Japan's largest mobile payment (65M+ users).",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I integrate PayPay payments?",
            "Check today's payment status",
            "Process a refund for a customer",
        ],
    },
    "jp-tax-calc": {
        "bot_name": "JPTaxCalc",
        "display_name": "JP Tax Calc",
        "description": "Japanese tax calculation and filing support. Income tax, consumption tax, corporate tax, and e-Tax integration. Updated for 2026.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Calculate my income tax for 2025",
            "How does consumption tax work for my business?",
            "Help me prepare my kakutei shinkoku (tax return)",
        ],
    },
    "moneyforward-agent": {
        "bot_name": "MoneyForwardAgent",
        "display_name": "MoneyForward Agent",
        "description": "Cloud accounting automation via MoneyForward. Invoices, expenses, journal entries, and bank reconciliation for Japanese businesses.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show this month's profit and loss summary",
            "Auto-categorize my bank transactions",
            "Create an invoice for a new client",
        ],
    },
    "yayoi-agent": {
        "bot_name": "YayoiAgent",
        "display_name": "Yayoi Agent",
        "description": "Accounting automation for Yayoi. Smart transaction import, Misoca invoicing, bank reconciliation, and tax filing support.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Import bank transactions and auto-categorize them",
            "Create a Misoca invoice for a client",
            "Generate my quarterly tax filing summary",
        ],
    },
    "misoca-agent": {
        "bot_name": "MisocaAgent",
        "display_name": "Misoca Agent",
        "description": "Misoca cloud invoicing automation by Yayoi. Invoice creation, sending, status tracking, and Tekikaku Invoice compliance.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Create a new invoice for a client",
            "Show all unpaid invoices this month",
            "Generate a Tekikaku-compliant invoice",
        ],
    },
    "airpay-agent": {
        "bot_name": "AirPayAgent",
        "display_name": "AirPay Agent",
        "description": "AirPay payment terminal management by Recruit. Transaction history, settlement reports, and multi-payment method analytics.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show today's transaction summary",
            "Generate a settlement report for this week",
            "Compare payment method usage trends",
        ],
    },
    "square-japan": {
        "bot_name": "SquareJapan",
        "display_name": "Square Japan",
        "description": "Square POS and payment management for Japan. Transactions, invoices, inventory, customer directory, and sales analytics via Square API.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Square POS sales dashboard",
            "Create an invoice for a customer",
            "Analyze payment trends by method",
        ],
    },
    "e-tax-agent": {
        "bot_name": "ETaxAgent",
        "display_name": "e-Tax Agent",
        "description": "e-Tax electronic tax filing assistant. Guides kakutei shinkoku preparation, validates forms, and generates XML for NTA submission.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Help me prepare my kakutei shinkoku",
            "Validate my tax return form data",
            "What documents do I need for e-Tax filing?",
        ],
    },
    "japan-invoice": {
        "bot_name": "JapanInvoice",
        "display_name": "Japan Invoice",
        "description": "Tekikaku Invoice System compliance agent. Generate, validate, and manage invoices meeting Japan's qualified invoice requirements.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Generate a Tekikaku-compliant invoice",
            "Validate this invoice for compliance",
            "What are the Tekikaku Invoice System requirements?",
        ],
    },

    # ═══════════════════════════════════════════════════════════
    # marketing-growth-pack (8 skills)
    # ═══════════════════════════════════════════════════════════
    "jp-humanizer": {
        "bot_name": "JPHumanizer",
        "display_name": "JP Humanizer",
        "description": "Japanese AI text humanization specialist. 500+ patterns, 4 modes (keigo/business/casual/SNS). Achieve 0% AI detection for Japanese text.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Humanize this Japanese text (paste your text)",
            "Convert this formal text to casual Japanese",
            "Make this business email sound more natural",
        ],
    },
    "jp-seo-writer": {
        "bot_name": "JPSEOWriter",
        "display_name": "JP SEO Writer",
        "description": "Japanese SEO article generator. Keyword research, co-occurrence analysis, content structure, and E-E-A-T compliance.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Write an SEO article about 'AI business automation'",
            "Analyze keywords for my niche",
            "Create an article outline with co-occurrence analysis",
        ],
    },
    "google-ads-agent": {
        "bot_name": "GoogleAdsAgent",
        "display_name": "Google Ads Agent",
        "description": "AI-powered Google Ads campaign management. Create, optimize, audit, and report on PPC campaigns with bid optimization and keyword research.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Audit my Google Ads account for optimization opportunities",
            "Create a search campaign for my product launch",
            "Analyze my campaign performance and suggest bid adjustments",
        ],
    },
    "ga4-search-console": {
        "bot_name": "GA4SearchConsole",
        "display_name": "GA4 & Search Console",
        "description": "Query GA4 analytics and Google Search Console in natural language. Traffic analysis, SEO insights, conversion tracking, and performance reports.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Show my top pages by traffic this month",
            "What keywords am I ranking for in Search Console?",
            "Analyze my conversion funnel in GA4",
        ],
    },
    "google-maps-biz": {
        "bot_name": "GoogleMapsBiz",
        "display_name": "Google Maps Biz",
        "description": "Location intelligence for business. Geocoding, places search, routing optimization, and Google Business Profile management.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Find all competitors within 5km of my store",
            "Optimize my Google Business Profile listing",
            "Calculate the best delivery route for these 10 addresses",
        ],
    },
    "social-media-publisher": {
        "bot_name": "SocialMediaPublisher",
        "display_name": "Social Media Publisher",
        "description": "Cross-platform social media posting and analytics. X/Twitter, Instagram, TikTok, and LINE scheduling, content creation, and engagement tracking.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Draft a week of social media posts for my product launch",
            "Analyze my engagement metrics across all platforms",
            "Schedule a cross-platform campaign for next Monday",
        ],
    },
    "sansan-agent": {
        "bot_name": "SansanAgent",
        "display_name": "Sansan Agent",
        "description": "Business card and contact intelligence. Search, manage, and sync digitized cards for Japanese B2B networking with Sansan.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Search my business cards for contacts at Toyota",
            "Show recently scanned business cards this week",
            "Export contacts from a specific event or meeting",
        ],
    },
    "hubspot-japan": {
        "bot_name": "HubSpotJapan",
        "display_name": "HubSpot Japan",
        "description": "HubSpot CRM and marketing automation for Japanese businesses. Contacts, deals, email campaigns, forms, and analytics.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Show my HubSpot deal pipeline summary",
            "Create an email campaign for our new product",
            "Analyze contact engagement trends this month",
        ],
    },

    # ═══════════════════════════════════════════════════════════
    # business-ops-pack (13 skills)
    # ═══════════════════════════════════════════════════════════
    "line-agent": {
        "bot_name": "LINEAgent",
        "display_name": "LINE Agent",
        "description": "LINE Official Account automation. Messaging, Rich Menus, CRM, and AI auto-response for Japan's #1 messaging platform (96M+ users).",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I set up LINE Messaging API?",
            "Create a product card Flex Message",
            "Show me LINE analytics dashboard format",
        ],
    },
    "lark-workflow": {
        "bot_name": "LarkWorkflow",
        "display_name": "Lark Workflow",
        "description": "Lark/Feishu workspace automation. Approval workflows, bot notifications, document management, and calendar integration.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "How do I set up a Lark approval workflow?",
            "Send a bot notification to my team",
            "Create a document from a meeting",
        ],
    },
    "notion-jp": {
        "bot_name": "NotionJP",
        "display_name": "Notion JP",
        "description": "Notion workspace with Japanese-optimized templates. Meeting notes, daily reports, project management, and approval workflows.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Create a meeting notes template in Japanese",
            "Set up a project management database",
            "Generate a daily report (nippo) template",
        ],
    },
    "google-workspace-agent": {
        "bot_name": "GoogleWorkspaceAgent",
        "display_name": "Google Workspace Agent",
        "description": "Unified Gmail, Calendar, Drive, Sheets, and Docs management. Automate your entire Google Workspace from a single agent.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Search my Gmail for unread messages from today",
            "Create a Google Sheets report from this data",
            "Schedule a meeting on my Google Calendar",
        ],
    },
    "chatwork-agent": {
        "bot_name": "ChatworkAgent",
        "display_name": "Chatwork Agent",
        "description": "Automate Japan's #1 business chat. Messages, tasks, rooms, and bot integration via ChatWork API v2.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Send a message to my project room",
            "Create tasks for all team members from this list",
            "Show unread messages across my Chatwork rooms",
        ],
    },
    "kintone-agent": {
        "bot_name": "KintoneAgent",
        "display_name": "Kintone Agent",
        "description": "Build, query, and automate Cybozu kintone apps. Japan's leading no-code business platform with 30,000+ companies.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Query my kintone CRM app for this month's leads",
            "Create a new kintone app for project tracking",
            "Automate a workflow between two kintone apps",
        ],
    },
    "smarthr-agent": {
        "bot_name": "SmartHRAgent",
        "display_name": "SmartHR Agent",
        "description": "HR and labor management automation. Employee onboarding, documents, payroll, and compliance on Japan's leading HR cloud.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Start the onboarding process for a new employee",
            "Generate a labor compliance report",
            "List all employees with expiring contracts this month",
        ],
    },
    "backlog-agent": {
        "bot_name": "BacklogAgent",
        "display_name": "Backlog Agent",
        "description": "Project management on Nulab Backlog. Issues, wikis, milestones, Git integration, and sprint management for Japan's top PM tool.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my open issues sorted by priority",
            "Create a new sprint with these user stories",
            "Generate a burndown chart for the current sprint",
        ],
    },
    "kingof-time-agent": {
        "bot_name": "KingOfTimeAgent",
        "display_name": "King of Time Agent",
        "description": "Attendance and time tracking automation. Daily/monthly reports, overtime alerts, and payroll sync via Japan's leading attendance system.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show today's attendance summary for my team",
            "Who has overtime exceeding 45 hours this month?",
            "Generate the monthly attendance report for payroll",
        ],
    },
    "line-works-agent": {
        "bot_name": "LINEWorksAgent",
        "display_name": "LINE WORKS Agent",
        "description": "Enterprise LINE communication. Bots, messages, groups, and calendar on Japan's business-grade LINE platform.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Send a notification to my LINE WORKS group",
            "Set up a bot for automated daily reports",
            "Show my LINE WORKS calendar for this week",
        ],
    },
    "jooto-agent": {
        "bot_name": "JootoAgent",
        "display_name": "Jooto Agent",
        "description": "Task and project management on Jooto. Kanban boards, task automation, and team workflows via PR TIMES' project management tool.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Jooto board with task status summary",
            "Create a new project board with standard columns",
            "Move all completed tasks to the Done column",
        ],
    },
    "slack-japan-agent": {
        "bot_name": "SlackJapanAgent",
        "display_name": "Slack Japan Agent",
        "description": "Slack workspace automation for Japanese teams. Channel management, workflow builder, app integrations, and bilingual bot responses.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show unread messages in my Slack channels",
            "Create a workflow for daily standup reports",
            "Set up a bilingual auto-response bot",
        ],
    },
    "cybozu-garoon": {
        "bot_name": "CybozuGaroon",
        "display_name": "Cybozu Garoon",
        "description": "Cybozu Garoon groupware automation. Schedule, workflow, bulletin board, and facility management for large Japanese enterprises.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Show my Garoon schedule for this week",
            "Create a workflow approval request",
            "Post an announcement to the bulletin board",
        ],
    },

    # ═══════════════════════════════════════════════════════════
    # security-devops-pack (3 skills)
    # ═══════════════════════════════════════════════════════════
    "mac-sentinel": {
        "bot_name": "MacSentinel",
        "display_name": "Mac Sentinel",
        "description": "macOS security hardening for Claude Code. Pre-execution validation, malicious config detection, credential hygiene, and endpoint protection.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Run a full security audit of my Mac",
            "Check my system for known CVE vulnerabilities",
            "Harden my macOS security settings",
        ],
    },
    "repo-guardian": {
        "bot_name": "RepoGuardian",
        "display_name": "Repo Guardian",
        "description": "Pre-clone security scanner. Detect malicious hooks, poisoned MCP configs, credential-harvesting patterns before processing repos.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Scan this GitHub repo before I clone it",
            "Check this repository for malicious git hooks",
            "Audit the MCP configs in this project",
        ],
    },
    "credential-vault": {
        "bot_name": "CredentialVault",
        "display_name": "Credential Vault",
        "description": "Secure API key management. Encrypted storage, auto-rotation, leak detection, and safe injection for Claude Code credentials.",
        "model": "GPT-4o",
        "tier": "P3",
        "suggested_replies": [
            "Store my new API key securely",
            "Check for leaked credentials in my project",
            "Rotate all API keys older than 90 days",
        ],
    },
}


def load_system_prompts() -> dict:
    """Load system prompts from configs/ JSON files and merge into BOT_DEFINITIONS."""
    bots = {}
    for slug, definition in BOT_DEFINITIONS.items():
        config_path = os.path.join(CONFIGS_DIR, f"{slug}.json")
        system_prompt = ""
        if os.path.exists(config_path):
            with open(config_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)
                system_prompt = config_data.get("system_prompt", "")

        bots[slug] = {
            **definition,
            "system_prompt": system_prompt,
        }
    return bots


def get_all_bots() -> dict:
    """Return all bot configs with system prompts loaded."""
    return load_system_prompts()


if __name__ == "__main__":
    bots = get_all_bots()
    print(f"Loaded {len(bots)} bot configurations:")
    for slug, bot in bots.items():
        prompt_len = len(bot.get("system_prompt", ""))
        print(f"  [{bot['tier']}] {bot['display_name']:30s} model={bot['model']:15s} prompt={prompt_len:>6d} chars")
