#!/usr/bin/env python3
"""
GPT Store Configuration Generator for hanabi-jpn Skills
========================================================
Reads all 20 SKILL.md files from the clawhub-skills directory
and generates GPT Store-compatible JSON configuration files.

Usage:
    python3 generate-configs.py

Output:
    configs/<skill-slug>.json  (20 files)
"""

import json
import os
import re
import sys
from pathlib import Path

# Base directory containing all skill folders
SKILLS_DIR = Path(__file__).parent.parent
OUTPUT_DIR = Path(__file__).parent / "configs"

# Skill definitions with metadata for GPT Store
SKILL_CONFIGS = {
    "capability-evolver-pro": {
        "display_name": "Capability Evolver Pro",
        "category": "Programming",
        "description": (
            "Safe, sandboxed self-evolution engine for AI agents with 5-layer safety architecture, "
            "automatic rollback, health scoring, and governed improvement protocols. "
            "Evolve your agent's capabilities without risk."
        ),
        "conversation_starters": [
            "Run an evolution cycle to improve my agent",
            "Show my agent's health score and evolution status",
            "Evolve with the harden strategy for security improvements",
            "Show my evolution history and dashboard"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "self-learning-agent": {
        "display_name": "Self-Learning Agent",
        "category": "Productivity",
        "description": (
            "Cross-project learning engine that captures errors, corrections, and patterns "
            "across ALL your projects. Features automatic failure capture, intelligent knowledge "
            "promotion, and context-aware memory compression within a 2000-token budget."
        ),
        "conversation_starters": [
            "Search my knowledge base for Docker-related learnings",
            "Show my learning stats and knowledge graph",
            "Log a new learning from today's debugging session",
            "Export all my learnings for backup"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "summarize-pro": {
        "display_name": "Summarize Pro",
        "category": "Productivity",
        "description": (
            "Advanced multi-format summarization with 7 output modes (bullets, executive, academic, "
            "mindmap, table, timeline, Q&A), 8 languages, Chain-of-Density compression, and "
            "intelligent caching. Summarize PDFs, web pages, YouTube videos, and code."
        ),
        "conversation_starters": [
            "Summarize this article in executive brief format",
            "Create a mindmap summary of this PDF in Japanese",
            "Compare these two research papers side by side",
            "Summarize this YouTube video with Chain-of-Density compression"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "humanize-ai-pro": {
        "display_name": "Humanize AI Pro",
        "category": "Writing",
        "description": (
            "Multi-language AI text humanizer with 12+ languages, 1200+ detection patterns, "
            "5 writing modes, and model-specific detection (ChatGPT/Claude/Gemini). "
            "Deep Japanese support with keigo, katakana, and kanji balance analysis."
        ),
        "conversation_starters": [
            "Humanize this AI-generated text to sound natural",
            "Score this text for AI detection probability",
            "Humanize this Japanese business email in business mode",
            "Show detailed AI pattern analysis of this paragraph"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "nano-banana-ultra": {
        "display_name": "Nano Banana Ultra",
        "category": "DALL-E",
        "description": (
            "Professional AI image generation with multi-model support (Gemini, DALL-E, Stability AI), "
            "30+ prompt engineering templates, batch workflows, image editing suite, "
            "quality scoring, and organized gallery management."
        ),
        "conversation_starters": [
            "Generate a product photo of red headphones on white background",
            "Create 4 logo variations for a tech startup",
            "Show me all available prompt templates",
            "Compare the same prompt across all available AI models"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": True,
            "code_interpreter": True
        }
    },
    "skill-guardian": {
        "display_name": "Skill Guardian",
        "category": "Programming",
        "description": (
            "5-layer AI security scanner that detects malicious code, supply chain attacks, "
            "data exfiltration, and C2 backdoors in AI agent skills. Built with ClawHavoc "
            "threat signatures from 341+ real-world malicious skills discovered."
        ),
        "conversation_starters": [
            "Scan this skill for security threats",
            "Run a full audit of all my installed skills",
            "Generate a security report for my agent",
            "Show my scan history and blocked skills"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "fx-trader-pro": {
        "display_name": "FX Trader Pro",
        "category": "Research",
        "description": (
            "Professional forex trading agent for OANDA with multi-timeframe technical analysis "
            "across 28 currency pairs, disciplined risk management, automated trade execution, "
            "trading journal, and backtesting. The first traditional FX trading skill on ClawHub."
        ),
        "conversation_starters": [
            "Show my OANDA account status and open positions",
            "Analyze EUR/USD on the 30-minute timeframe",
            "Scan all 28 pairs for trading opportunities",
            "Show my trading journal with win rate and P&L stats"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "brain-trust": {
        "display_name": "Brain Trust",
        "category": "Programming",
        "description": (
            "Multi-agent hierarchical orchestration engine. Define specialist roles "
            "(CEO, CTO, Developer, Designer...), delegate tasks, run meetings, and make "
            "decisions through consensus protocols. Like having a virtual AI company at your command."
        ),
        "conversation_starters": [
            "Initialize a startup team with CEO, CTO, Developer, and Designer",
            "Delegate this task to the best team member",
            "Run a brainstorm meeting about our product strategy",
            "Make a team decision: should we migrate to GraphQL?"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "context-slim": {
        "display_name": "Context Slim",
        "category": "Programming",
        "description": (
            "Context window optimizer that saves 40-70% of your token budget with 3 compression "
            "strategies. Automatically detects bloated context, compresses intelligently, "
            "and frees up space for longer productive sessions."
        ),
        "conversation_starters": [
            "Analyze my current context window usage",
            "Compress my conversation to free up tokens",
            "Show context optimization recommendations",
            "How much context budget am I using right now?"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "agent-dashboard": {
        "display_name": "Agent Dashboard",
        "category": "Programming",
        "description": (
            "Real-time agent monitoring with health scoring, cost tracking, task analytics, "
            "and a web dashboard. See everything your AI agent does — task completion rates, "
            "error rates, token costs, and performance trends at a glance."
        ),
        "conversation_starters": [
            "Show my agent's health score and performance metrics",
            "How much have I spent on API costs today?",
            "Generate a performance report for this week",
            "Launch the web dashboard for real-time monitoring"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "line-agent": {
        "display_name": "LINE Agent",
        "category": "Lifestyle",
        "description": (
            "LINE Official Account automation and CRM for Japan's #1 messaging platform "
            "(96M+ users). Features AI auto-response, Flex Messages, audience segmentation, "
            "broadcast campaigns, and customer analytics."
        ),
        "conversation_starters": [
            "Set up AI auto-response for my LINE Official Account",
            "Create a Flex Message template for a campaign",
            "Analyze my LINE audience demographics",
            "Schedule a broadcast message to all followers"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "ec-cube-operator": {
        "display_name": "EC-CUBE Operator",
        "category": "Productivity",
        "description": (
            "Complete EC-CUBE 4.x e-commerce management agent for Japanese online stores. "
            "Handles product management, inventory control, order processing, RFM customer "
            "analysis, and sales reporting through the EC-CUBE API."
        ),
        "conversation_starters": [
            "Show today's order summary and sales report",
            "Check inventory levels for low-stock products",
            "Run RFM analysis on our customer database",
            "Update product prices in bulk from this CSV"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "freee-agent": {
        "display_name": "Freee Agent",
        "category": "Productivity",
        "description": (
            "Automated accounting and HR management via freee API. Features AI-powered "
            "journal entries, profit & loss statements, balance sheets, tax filing support, "
            "and payroll processing for Japanese businesses."
        ),
        "conversation_starters": [
            "Show this month's profit and loss statement",
            "Auto-categorize these transactions with AI",
            "Generate a balance sheet for Q4",
            "Help me prepare my tax filing (kakutei shinkoku)"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "rakuten-seller": {
        "display_name": "Rakuten Seller",
        "category": "Productivity",
        "description": (
            "Rakuten Ichiba shop management AI using the RMS API. Handles product listings, "
            "review management, sales analytics, price optimization, and ranking strategy "
            "for Japan's largest e-commerce marketplace."
        ),
        "conversation_starters": [
            "Analyze my Rakuten shop's sales performance this month",
            "Check and respond to new product reviews",
            "Optimize product pricing based on competitor analysis",
            "What keywords should I target for better ranking?"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "paypay-biz": {
        "display_name": "PayPay Biz",
        "category": "Productivity",
        "description": (
            "PayPay business payment management and analytics for Japan's leading QR payment "
            "platform (65M+ users). Features payment tracking, refund processing, sales "
            "analysis, and settlement reporting."
        ),
        "conversation_starters": [
            "Show today's PayPay payment transactions",
            "Process a refund for this transaction",
            "Analyze my PayPay sales trends this month",
            "Generate a settlement report for this period"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "jp-tax-calc": {
        "display_name": "JP Tax Calc",
        "category": "Research",
        "description": (
            "Comprehensive Japanese tax calculator and filing assistant. Covers income tax "
            "(shotokuzei), consumption tax, corporate tax, resident tax, and e-Tax integration. "
            "Helps freelancers and businesses with kakutei shinkoku (tax filing)."
        ),
        "conversation_starters": [
            "Calculate my income tax for this year",
            "What deductions am I eligible for as a freelancer?",
            "Help me estimate quarterly consumption tax",
            "Walk me through the kakutei shinkoku process"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "notion-jp": {
        "display_name": "Notion JP",
        "category": "Productivity",
        "description": (
            "Japanese Notion template generator with 20+ templates. Auto-generates meeting notes "
            "(gijiroku), daily reports (nippo), approval requests (ringisho), KPT retrospectives, "
            "and more with proper Japanese business formatting."
        ),
        "conversation_starters": [
            "Create a meeting notes template (gijiroku) in Notion",
            "Generate a daily report template for my team",
            "Set up a KPT retrospective board in Notion",
            "Create an approval request (ringisho) template"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "jp-humanizer": {
        "display_name": "JP Humanizer",
        "category": "Writing",
        "description": (
            "Japanese-specialized AI text humanizer with 500+ transformation patterns. "
            "4 modes: keigo (formal), business, casual, and SNS. Achieves 0% AI detection "
            "by fixing sentence endings, katakana overuse, kanji balance, and unnatural keigo."
        ),
        "conversation_starters": [
            "Humanize this AI-generated Japanese text",
            "Rewrite this in natural casual Japanese (kudaketa nihongo)",
            "Convert this to proper business keigo that sounds human",
            "Score this Japanese text for AI detection patterns"
        ],
        "capabilities": {
            "web_browsing": False,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "lark-workflow": {
        "display_name": "Lark Workflow",
        "category": "Productivity",
        "description": (
            "Lark (Feishu) workflow automation using the Open API. Automates approval flows, "
            "bot messaging, document generation, calendar management, and notifications "
            "for Japanese and Asian business teams."
        ),
        "conversation_starters": [
            "Set up an approval workflow in Lark",
            "Send a bot notification to my team channel",
            "Create a document from this template",
            "Show pending approval requests in my workflow"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    },
    "jp-seo-writer": {
        "display_name": "JP SEO Writer",
        "category": "Writing",
        "description": (
            "Japanese SEO content generator that creates search-rank-optimized articles. "
            "Features keyword analysis, co-occurrence word research (kyokigo bunseki), "
            "article structure planning, E-E-A-T optimization, and Google Japan ranking strategies."
        ),
        "conversation_starters": [
            "Write an SEO article targeting this Japanese keyword",
            "Analyze co-occurrence words for my target keyword",
            "Create an article structure optimized for Google Japan",
            "Score my existing article for E-E-A-T compliance"
        ],
        "capabilities": {
            "web_browsing": True,
            "dall_e": False,
            "code_interpreter": True
        }
    }
}


def extract_system_prompt(skill_md_path: Path) -> str:
    """Extract the system prompt section from a SKILL.md file."""
    content = skill_md_path.read_text(encoding="utf-8")

    # Try to find "## System Prompt Instructions" section
    system_prompt_patterns = [
        r"## System Prompt Instructions\n(.*?)(?=\n## (?!#)|$)",
        r"## System Prompt\n(.*?)(?=\n## (?!#)|$)",
    ]

    for pattern in system_prompt_patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
            return match.group(1).strip()

    # Fallback: extract everything between "## System Prompt Instructions" and
    # next major section (## without being ###)
    lines = content.split("\n")
    in_system_prompt = False
    prompt_lines = []
    section_count = 0

    for line in lines:
        if re.match(r"^## System Prompt", line):
            in_system_prompt = True
            continue

        if in_system_prompt:
            # Stop at the next ## section that is NOT ### (subsection)
            if re.match(r"^## [^#]", line):
                # Check if we've seen some content (avoid stopping on adjacent sections)
                if prompt_lines:
                    # Check if it's a comparison/FAQ/error section - stop there
                    if any(
                        kw in line.lower()
                        for kw in [
                            "comparison",
                            "faq",
                            "error handling",
                            "why ",
                            "vs ",
                        ]
                    ):
                        break

            prompt_lines.append(line)

    if prompt_lines:
        return "\n".join(prompt_lines).strip()

    # Final fallback: extract from ## Overview onward (but not the header/badges)
    overview_match = re.search(r"## Overview\n(.*?)(?=\n## (?:Comparison|FAQ|Error|Why ))", content, re.DOTALL)
    if overview_match:
        return overview_match.group(1).strip()

    # Last resort: return description from frontmatter
    desc_match = re.search(r'^description:\s*"(.+?)"', content, re.MULTILINE)
    if desc_match:
        return desc_match.group(1)

    return "System prompt not found. Please manually add the instructions from the SKILL.md file."


def extract_full_instructions(skill_slug: str, skill_md_path: Path) -> str:
    """Extract full instructions for GPT system prompt.

    For GPT Store, we want the complete system prompt section
    including all commands, rules, and behavior definitions.
    """
    content = skill_md_path.read_text(encoding="utf-8")

    # Find the start of the system prompt / instructions section
    start_patterns = [
        "## System Prompt Instructions",
        "## System Prompt",
    ]

    start_idx = -1
    for pattern in start_patterns:
        idx = content.find(pattern)
        if idx != -1:
            start_idx = idx
            break

    if start_idx == -1:
        # Try Overview as fallback
        idx = content.find("## Overview")
        if idx != -1:
            start_idx = idx

    if start_idx == -1:
        return f"You are {SKILL_CONFIGS[skill_slug]['display_name']} by hanabi-jpn. {SKILL_CONFIGS[skill_slug]['description']}"

    # Find the end: stop at Comparison, FAQ, Error Handling, or "Why X vs Y" sections
    end_patterns = [
        "\n## Comparison",
        "\n## Why ",
        "\n## FAQ",
        "\n## Error Handling",
        "\n## Error ",
        f"\n## {SKILL_CONFIGS[skill_slug]['display_name']} vs",
    ]

    end_idx = len(content)
    for pattern in end_patterns:
        idx = content.find(pattern, start_idx)
        if idx != -1 and idx < end_idx:
            end_idx = idx

    instructions = content[start_idx:end_idx].strip()

    # Prepend a GPT-specific preamble
    preamble = (
        f"You are **{SKILL_CONFIGS[skill_slug]['display_name']}** by hanabi-jpn. "
        f"{SKILL_CONFIGS[skill_slug]['description']}\n\n"
        "Follow the instructions below precisely.\n\n"
    )

    return preamble + instructions


def generate_config(skill_slug: str) -> dict:
    """Generate a GPT Store config JSON for a single skill."""
    skill_dir = SKILLS_DIR / skill_slug
    skill_md = skill_dir / "SKILL.md"

    if not skill_md.exists():
        print(f"  WARNING: {skill_md} not found, skipping.", file=sys.stderr)
        return None

    config = SKILL_CONFIGS[skill_slug]
    instructions = extract_full_instructions(skill_slug, skill_md)

    return {
        "name": f"{config['display_name']} by hanabi-jpn",
        "description": config["description"],
        "instructions": instructions,
        "conversation_starters": config["conversation_starters"],
        "capabilities": config["capabilities"],
        "category": config["category"],
        "_meta": {
            "skill_slug": skill_slug,
            "source": f"clawhub-skills/{skill_slug}/SKILL.md",
            "author": "hanabi-jpn",
            "generated_by": "generate-configs.py"
        }
    }


def main():
    """Generate all 20 GPT Store config files."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("  GPT Store Config Generator for hanabi-jpn Skills")
    print("=" * 60)
    print(f"\n  Skills directory: {SKILLS_DIR}")
    print(f"  Output directory: {OUTPUT_DIR}")
    print(f"  Skills to process: {len(SKILL_CONFIGS)}")
    print()

    generated = 0
    failed = 0

    for skill_slug in sorted(SKILL_CONFIGS.keys()):
        print(f"  [{generated + failed + 1:2d}/20] Processing {skill_slug}...", end=" ")

        config = generate_config(skill_slug)
        if config is None:
            failed += 1
            print("FAILED")
            continue

        output_path = OUTPUT_DIR / f"{skill_slug}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        # Report instruction length
        inst_len = len(config["instructions"])
        inst_tokens_est = inst_len // 4  # rough estimate
        print(f"OK ({inst_tokens_est:,} tokens est.)")
        generated += 1

    print()
    print("-" * 60)
    print(f"  Generated: {generated}")
    print(f"  Failed:    {failed}")
    print(f"  Output:    {OUTPUT_DIR}/")
    print()

    if generated == 20:
        print("  All 20 configs generated successfully!")
    else:
        print(f"  WARNING: Expected 20, got {generated}. Check errors above.")

    print()

    # Summary table
    print("  Skill                     | Category      | Capabilities")
    print("  " + "-" * 70)
    for slug in sorted(SKILL_CONFIGS.keys()):
        cfg = SKILL_CONFIGS[slug]
        caps = []
        if cfg["capabilities"]["web_browsing"]:
            caps.append("Web")
        if cfg["capabilities"]["dall_e"]:
            caps.append("DALL-E")
        if cfg["capabilities"]["code_interpreter"]:
            caps.append("Code")
        caps_str = ", ".join(caps) if caps else "None"
        print(f"  {cfg['display_name']:<27s} | {cfg['category']:<13s} | {caps_str}")

    print()


if __name__ == "__main__":
    main()
