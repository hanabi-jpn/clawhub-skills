"""
Bot configurations for all 40 hanabi-jpn Poe bots.

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
    # ═══════ P1 — Premium (GPT-4o) ═══════
    "capability-evolver-pro": {
        "bot_name": "CapabilityEvolverPro",
        "display_name": "Capability Evolver Pro",
        "description": "Safe, sandboxed self-evolution engine for AI agents. Automatic rollback, health scoring, and governed improvement protocols.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "evolve",
            "evolve status",
            "evolve dashboard",
        ],
    },
    "self-learning-agent": {
        "bot_name": "SelfLearningAgent",
        "display_name": "Self-Learning Agent",
        "description": "Cross-project learning engine with automatic failure capture, intelligent knowledge promotion, and context-aware memory compression.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "learn status",
            "What have you learned from my recent errors?",
            "learn promote — share learnings across projects",
        ],
    },
    "summarize-pro": {
        "bot_name": "SummarizePro",
        "display_name": "Summarize Pro",
        "description": "7 output modes, 8 languages, Chain-of-Density compression. Summarize PDFs, web pages, YouTube, code files, and more.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Summarize this article for me (paste a URL or text)",
            "Summarize in executive brief mode",
            "Compare two documents side by side",
        ],
    },
    "humanize-ai-pro": {
        "bot_name": "HumanizeAIPro",
        "display_name": "Humanize AI Pro",
        "description": "Transform AI-generated text into natural human writing. 12+ languages, 5 writing modes, statistical AI detection scoring.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Humanize this text (paste your AI-generated text)",
            "Score this text for AI detection",
            "Humanize in business mode for a professional email",
        ],
    },
    "nano-banana-ultra": {
        "bot_name": "NanoBananaUltra",
        "display_name": "Nano Banana Ultra",
        "description": "Multi-model AI image generation (Gemini, DALL-E, Stability AI). 30+ templates, batch workflows, and gallery management.",
        "model": "GPT-4o",
        "tier": "P1",
        "suggested_replies": [
            "Generate a product photo for an e-commerce listing",
            "Create a social media banner image",
            "Generate variations of a logo concept",
        ],
    },

    # ═══════ P2 — Standard (GPT-4o) ═══════
    "skill-guardian": {
        "bot_name": "SkillGuardian",
        "display_name": "Skill Guardian",
        "description": "5-layer security scanner for AI agent skills. Detects malicious code, supply chain attacks, data exfiltration, and backdoors.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Scan this skill for security issues",
            "What are the most common AI skill attack vectors?",
            "Explain the 5-layer security scan process",
        ],
    },
    "fx-trader-pro": {
        "bot_name": "FXTraderPro",
        "display_name": "FX Trader Pro",
        "description": "Professional forex trading agent. Multi-timeframe technical analysis, risk management, and trade execution across 28 currency pairs.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Analyze EUR/USD on the H4 timeframe",
            "Scan all 28 pairs for trading opportunities",
            "Explain your risk management system",
        ],
    },
    "brain-trust": {
        "bot_name": "BrainTrust",
        "display_name": "Brain Trust",
        "description": "Multi-agent orchestration engine. CEO, CTO, CFO, CMO perspectives. Delegate tasks, run meetings, make decisions through consensus.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Analyze this business idea as a Brain Trust team",
            "Run a CTO review of my architecture",
            "Hold a meeting to decide our Q2 strategy",
        ],
    },
    "context-slim": {
        "bot_name": "ContextSlim",
        "display_name": "Context Slim",
        "description": "Intelligent context window optimizer. Compress, prioritize, and manage context to save 40-70% of your token budget.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Analyze my current context usage",
            "Compress this text while preserving key information",
            "What strategies reduce context window bloat?",
        ],
    },
    "agent-dashboard": {
        "bot_name": "AgentDashboard",
        "display_name": "Agent Dashboard",
        "description": "Real-time monitoring for AI agents. Track performance, API costs, task completion, and skill health with beautiful dashboards.",
        "model": "GPT-4o",
        "tier": "P2",
        "suggested_replies": [
            "Show my agent dashboard",
            "How much have I spent on API calls this month?",
            "Generate a performance report for the last 7 days",
        ],
    },

    # ═══════ P3 — Lite (GPT-4o-Mini to save costs) ═══════
    "line-agent": {
        "bot_name": "LINEAgent",
        "display_name": "LINE Agent",
        "description": "LINE Official Account automation. Messaging, Rich Menus, CRM, and AI auto-response for Japan's #1 messaging platform (96M+ users).",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "How do I set up LINE Messaging API?",
            "Create a product card Flex Message",
            "Show me LINE analytics dashboard format",
        ],
    },
    "ec-cube-operator": {
        "bot_name": "ECCubeOperator",
        "display_name": "EC-CUBE Operator",
        "description": "EC-CUBE 4.x store management. Products, inventory, orders, customers, and RFM analytics for Japan's largest open-source EC platform.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "How do I manage products via EC-CUBE API?",
            "Run an RFM analysis on my customers",
            "Show me the order management commands",
        ],
    },
    "freee-agent": {
        "bot_name": "FreeeAgent",
        "display_name": "Freee Agent",
        "description": "freee accounting automation. AI bookkeeping, expense management, invoicing, and P/L reports for Japanese businesses. Invoice system compliant.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "How do I automate bookkeeping with freee?",
            "Create an invoice for a client",
            "Generate a monthly P/L report",
        ],
    },
    "rakuten-seller": {
        "bot_name": "RakutenSeller",
        "display_name": "Rakuten Seller",
        "description": "Rakuten Ichiba shop automation. Product listing, inventory, orders, reviews, and ranking optimization via RMS API.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "How do I list a product on Rakuten?",
            "Optimize my product listing for Rakuten search",
            "Show me my shop analytics",
        ],
    },
    "paypay-biz": {
        "bot_name": "PayPayBiz",
        "display_name": "PayPay Biz",
        "description": "PayPay payment management. Payment status, refunds, sales analytics, and QR code generation for Japan's largest mobile payment (65M+ users).",
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Calculate my income tax for 2025",
            "How does consumption tax work for my business?",
            "Help me prepare my kakutei shinkoku (tax return)",
        ],
    },
    "notion-jp": {
        "bot_name": "NotionJP",
        "display_name": "Notion JP",
        "description": "Notion workspace with Japanese-optimized templates. Meeting notes, daily reports, project management, and approval workflows.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Create a meeting notes template in Japanese",
            "Set up a project management database",
            "Generate a daily report (nippo) template",
        ],
    },
    "jp-humanizer": {
        "bot_name": "JPHumanizer",
        "display_name": "JP Humanizer",
        "description": "Japanese AI text humanization specialist. 500+ patterns, 4 modes (keigo/business/casual/SNS). Achieve 0% AI detection for Japanese text.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Humanize this Japanese text (paste your text)",
            "Convert this formal text to casual Japanese",
            "Make this business email sound more natural",
        ],
    },
    "lark-workflow": {
        "bot_name": "LarkWorkflow",
        "display_name": "Lark Workflow",
        "description": "Lark/Feishu workspace automation. Approval workflows, bot notifications, document management, and calendar integration.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "How do I set up a Lark approval workflow?",
            "Send a bot notification to my team",
            "Create a document from a meeting",
        ],
    },
    "jp-seo-writer": {
        "bot_name": "JPSEOWriter",
        "display_name": "JP SEO Writer",
        "description": "Japanese SEO article generator. Keyword research, co-occurrence analysis, content structure, and E-E-A-T compliance.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Write an SEO article about 'AI business automation'",
            "Analyze keywords for my niche",
            "Create an article outline with co-occurrence analysis",
        ],
    },

    # ═══════════════════════════════════════════════════════════
    # NEW WAVE — 20 additional skills (Wave 2)
    # ═══════════════════════════════════════════════════════════

    # ═══════ P1 — Premium (GPT-4o) — Google Suite ═══════
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

    # ═══════ P2 — Standard (GPT-4o) — Payment & Social ═══════
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

    # ═══════ P2 — Standard (GPT-4o) — Japan SaaS ═══════
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

    # ═══════ P3 — Lite (GPT-4o-Mini) — Japan HR/Biz SaaS ═══════
    "smarthr-agent": {
        "bot_name": "SmartHRAgent",
        "display_name": "SmartHR Agent",
        "description": "HR and labor management automation. Employee onboarding, documents, payroll, and compliance on Japan's leading HR cloud.",
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Show my open issues sorted by priority",
            "Create a new sprint with these user stories",
            "Generate a burndown chart for the current sprint",
        ],
    },
    "sansan-agent": {
        "bot_name": "SansanAgent",
        "display_name": "Sansan Agent",
        "description": "Business card and contact intelligence. Search, manage, and sync digitized cards for Japanese B2B networking with Sansan.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Search my business cards for contacts at Toyota",
            "Show recently scanned business cards this week",
            "Export contacts from a specific event or meeting",
        ],
    },
    "moneyforward-agent": {
        "bot_name": "MoneyForwardAgent",
        "display_name": "MoneyForward Agent",
        "description": "Cloud accounting automation via MoneyForward. Invoices, expenses, journal entries, and bank reconciliation for Japanese businesses.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Show this month's profit and loss summary",
            "Auto-categorize my bank transactions",
            "Create an invoice for a new client",
        ],
    },
    "kingof-time-agent": {
        "bot_name": "KingOfTimeAgent",
        "display_name": "King of Time Agent",
        "description": "Attendance and time tracking automation. Daily/monthly reports, overtime alerts, and payroll sync via Japan's leading attendance system.",
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Show my Jooto board with task status summary",
            "Create a new project board with standard columns",
            "Move all completed tasks to the Done column",
        ],
    },
    "base-stores-agent": {
        "bot_name": "BaseStoresAgent",
        "display_name": "BASE & STORES Agent",
        "description": "Manage Japanese EC shops on BASE and STORES. Products, orders, inventory, and analytics for instant-commerce platforms.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Show my BASE shop's sales for this month",
            "List low-stock products across my stores",
            "Update product pricing in bulk from this CSV",
        ],
    },
    "yayoi-agent": {
        "bot_name": "YayoiAgent",
        "display_name": "Yayoi Agent",
        "description": "Accounting automation for Yayoi. Smart transaction import, Misoca invoicing, bank reconciliation, and tax filing support.",
        "model": "GPT-4o-Mini",
        "tier": "P3",
        "suggested_replies": [
            "Import bank transactions and auto-categorize them",
            "Create a Misoca invoice for a client",
            "Generate my quarterly tax filing summary",
        ],
    },

    # ═══════ P3 — Security Suite (GPT-4o-Mini) ═══════
    "mac-sentinel": {
        "bot_name": "MacSentinel",
        "display_name": "Mac Sentinel",
        "description": "macOS security hardening for Claude Code. Pre-execution validation, malicious config detection, credential hygiene, and endpoint protection.",
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
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
        "model": "GPT-4o-Mini",
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
