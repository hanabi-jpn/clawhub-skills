#!/usr/bin/env python3
"""
Extract system prompts from all hanabi-jpn SKILL.md files.

Reads each SKILL.md, extracts the content between "## System Prompt Instructions"
(or "## System Prompt") and the next "##" heading at the same level, then saves
each as a JSON file in the configs/ directory.
"""

import json
import os
import re
import sys

# All 20 skill directories
SKILL_DIRS = [
    # P1 — Premium
    "capability-evolver-pro",
    "self-learning-agent",
    "summarize-pro",
    "humanize-ai-pro",
    "nano-banana-ultra",
    # P2 — Standard
    "skill-guardian",
    "fx-trader-pro",
    "brain-trust",
    "context-slim",
    "agent-dashboard",
    # P3 — Lite
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
]

# Metadata for each skill (display_name, description, tier)
SKILL_META = {
    "capability-evolver-pro": {
        "display_name": "Capability Evolver Pro",
        "description": "Safe, sandboxed self-evolution engine for AI agents with automatic rollback, evolution dashboard, and governed improvement protocols.",
        "tier": "P1",
    },
    "self-learning-agent": {
        "display_name": "Self-Learning Agent",
        "description": "Cross-project learning engine with automatic failure capture, intelligent knowledge promotion, and context-aware memory compression.",
        "tier": "P1",
    },
    "summarize-pro": {
        "display_name": "Summarize Pro",
        "description": "Advanced multi-format summarization with 7 output modes, multi-language support, chain-of-density compression, and intelligent caching.",
        "tier": "P1",
    },
    "humanize-ai-pro": {
        "display_name": "Humanize AI Pro",
        "description": "Multi-language AI text humanizer with 5 writing modes, statistical analysis, and meaning-preserving transformation. 12+ languages including deep Japanese support.",
        "tier": "P1",
    },
    "nano-banana-ultra": {
        "display_name": "Nano Banana Ultra",
        "description": "Advanced AI image generation and editing with multi-model support (Gemini, DALL-E, Stability AI), 30+ prompt templates, batch workflows, and gallery management.",
        "tier": "P1",
    },
    "skill-guardian": {
        "display_name": "Skill Guardian",
        "description": "5-layer security scanner for AI agent skills. Detects malicious code, supply chain attacks, data exfiltration, and C2 backdoors.",
        "tier": "P2",
    },
    "fx-trader-pro": {
        "display_name": "FX Trader Pro",
        "description": "Professional forex trading agent for OANDA with multi-timeframe technical analysis, risk management, and automated trade execution across 28 currency pairs.",
        "tier": "P2",
    },
    "brain-trust": {
        "display_name": "Brain Trust",
        "description": "Multi-agent hierarchical orchestration engine. Define specialist roles (CEO, CTO, etc.), delegate tasks, run meetings, and make decisions through consensus.",
        "tier": "P2",
    },
    "context-slim": {
        "display_name": "Context Slim",
        "description": "Intelligent context window optimizer. Compresses, prioritizes, and manages context to prevent overflow while preserving critical information. Save 40-70% tokens.",
        "tier": "P2",
    },
    "agent-dashboard": {
        "display_name": "Agent Dashboard",
        "description": "Real-time monitoring and analytics for AI agents. Track performance, costs, task completion, and skill health with terminal and web dashboards.",
        "tier": "P2",
    },
    "line-agent": {
        "display_name": "LINE Agent",
        "description": "LINE Official Account automation. Messaging, Rich Menus, segment delivery, CRM, and AI auto-response for Japan's #1 messaging platform (96M+ users).",
        "tier": "P3",
    },
    "ec-cube-operator": {
        "display_name": "EC-CUBE Operator",
        "description": "EC-CUBE 4.x store management agent. Products, inventory, orders, customers, and analytics for Japan's largest open-source e-commerce platform.",
        "tier": "P3",
    },
    "freee-agent": {
        "display_name": "Freee Agent",
        "description": "freee accounting and HR automation. Bookkeeping, expense management, invoicing, and financial reporting for Japanese businesses. Invoice system compliant.",
        "tier": "P3",
    },
    "rakuten-seller": {
        "display_name": "Rakuten Seller",
        "description": "Rakuten Ichiba shop automation via RMS API. Products, inventory, orders, reviews, and analytics for Japan's largest marketplace (55M+ monthly users).",
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
    "notion-jp": {
        "display_name": "Notion JP",
        "description": "Notion workspace management with Japanese-optimized templates. Meeting notes, daily reports, project management, and approval workflows for Japanese businesses.",
        "tier": "P3",
    },
    "jp-humanizer": {
        "display_name": "JP Humanizer",
        "description": "Japanese AI text humanization specialist. 500+ patterns, 4 modes (keigo/business/casual/SNS), achieving 0% AI detection for Japanese text.",
        "tier": "P3",
    },
    "lark-workflow": {
        "display_name": "Lark Workflow",
        "description": "Lark/Feishu workspace automation. Approval workflows, bot notifications, document management, and calendar integration.",
        "tier": "P3",
    },
    "jp-seo-writer": {
        "display_name": "JP SEO Writer",
        "description": "Japanese SEO article generator with keyword research, co-occurrence analysis, content structure planning, and E-E-A-T compliance.",
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
        skill_md = os.path.join(skills_dir, skill_slug, "SKILL.md")

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
