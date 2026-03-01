"""
Bot configurations for all 20 hanabi-jpn Poe bots.

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
