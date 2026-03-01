#!/usr/bin/env python3
"""
GPT Store Batch Creator
=======================
Reads all 40 GPT config JSONs and outputs pre-formatted blocks
for pasting into GPT Builder's "Configure" tab on chat.openai.com.

Usage:
    python3 batch-create.py              # Start from beginning
    python3 batch-create.py --resume     # Resume from last progress
    python3 batch-create.py --list       # Show all GPTs with status
    python3 batch-create.py --skip N     # Skip to GPT #N
    python3 batch-create.py --priority   # Use priority order (most valuable first)

Workflow per GPT:
    1. Displays formatted config block
    2. Copies Name to clipboard -> press Enter
    3. Copies Description to clipboard -> press Enter
    4. Copies Instructions to clipboard -> press Enter
    5. Copies Conversation Starters (one at a time) -> press Enter each
    6. Shows capability checkboxes to toggle
    7. Marks GPT as done in state file
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime

# --- Configuration ---
CONFIGS_DIR = Path(__file__).parent / "configs"
STATE_FILE = Path(__file__).parent / "progress.json"

# Priority order: most impactful / broadest appeal first
PRIORITY_ORDER = [
    # Tier 1: High-value universal tools (appeal to everyone)
    "humanize-ai-pro",
    "summarize-pro",
    "jp-humanizer",
    "jp-seo-writer",
    "context-slim",
    # Tier 2: Business/SaaS integration (Japan market)
    "brain-trust",
    "fx-trader-pro",
    "ec-cube-operator",
    "social-media-publisher",
    "google-ads-agent",
    # Tier 3: Productivity & monitoring
    "agent-dashboard",
    "nano-banana-ultra",
    "self-learning-agent",
    "capability-evolver-pro",
    "skill-guardian",
    "repo-guardian",
    "mac-sentinel",
    # Tier 4: Japan SaaS integrations
    "freee-agent",
    "moneyforward-agent",
    "yayoi-agent",
    "jp-tax-calc",
    "smarthr-agent",
    "kingof-time-agent",
    "kintone-agent",
    "sansan-agent",
    # Tier 5: Communication & project management
    "line-agent",
    "line-works-agent",
    "chatwork-agent",
    "lark-workflow",
    "jooto-agent",
    "backlog-agent",
    "notion-jp",
    # Tier 6: Google & payment tools
    "ga4-search-console",
    "google-workspace-agent",
    "google-maps-biz",
    "stripe-japan-agent",
    "paypay-biz",
    # Tier 7: E-commerce & other
    "rakuten-seller",
    "base-stores-agent",
    "credential-vault",
]


def copy_to_clipboard(text: str):
    """Copy text to macOS clipboard using pbcopy."""
    process = subprocess.Popen(
        ["pbcopy"], stdin=subprocess.PIPE, env={**os.environ, "LANG": "en_US.UTF-8"}
    )
    process.communicate(text.encode("utf-8"))


def load_state() -> dict:
    """Load progress state from file."""
    if STATE_FILE.exists():
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"completed": [], "started_at": datetime.now().isoformat(), "total_time_sec": 0}


def save_state(state: dict):
    """Save progress state to file."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def load_config(filename: str) -> dict:
    """Load a single GPT config JSON."""
    with open(CONFIGS_DIR / filename, "r") as f:
        return json.load(f)


def get_all_configs() -> list[tuple[str, dict]]:
    """Load all config files and return as (slug, config) pairs."""
    configs = []
    for f in sorted(CONFIGS_DIR.glob("*.json")):
        slug = f.stem
        config = load_config(f.name)
        configs.append((slug, config))
    return configs


def get_ordered_configs(priority: bool = False) -> list[tuple[str, dict]]:
    """Get configs in the desired order."""
    all_configs = {slug: config for slug, config in get_all_configs()}

    if priority:
        ordered = []
        for slug in PRIORITY_ORDER:
            if slug in all_configs:
                ordered.append((slug, all_configs[slug]))
        # Add any configs not in priority list at the end
        for slug, config in sorted(all_configs.items()):
            if slug not in PRIORITY_ORDER:
                ordered.append((slug, config))
        return ordered
    else:
        return sorted(all_configs.items())


def capability_str(capabilities: dict) -> str:
    """Format capabilities as toggle instructions."""
    lines = []
    if capabilities.get("web_browsing"):
        lines.append("  [x] Web Browsing")
    else:
        lines.append("  [ ] Web Browsing  (OFF)")
    if capabilities.get("dall_e"):
        lines.append("  [x] DALL-E Image Generation")
    else:
        lines.append("  [ ] DALL-E Image Generation  (OFF)")
    if capabilities.get("code_interpreter"):
        lines.append("  [x] Code Interpreter & Data Analysis")
    else:
        lines.append("  [ ] Code Interpreter  (OFF)")
    return "\n".join(lines)


def truncate_instructions(instructions: str, max_chars: int = 8000) -> str:
    """
    GPT Builder has a character limit for instructions.
    OpenAI's limit is ~8000 chars. Truncate if needed.
    """
    if len(instructions) <= max_chars:
        return instructions
    truncated = instructions[:max_chars - 100]
    # Find last complete sentence or paragraph
    last_newline = truncated.rfind("\n\n")
    if last_newline > max_chars * 0.7:
        truncated = truncated[:last_newline]
    truncated += "\n\n[... Instructions truncated for GPT Builder character limit. Full version at github.com/hanabi-jpn/clawhub-skills ...]"
    return truncated


def display_header(index: int, total: int, slug: str, config: dict):
    """Display the GPT info header."""
    elapsed_pct = (index / total) * 100
    print("\n" + "=" * 70)
    print(f"  GPT [{index + 1}/{total}]  ({elapsed_pct:.0f}% done)")
    print(f"  Slug: {slug}")
    print(f"  Category: {config.get('category', 'N/A')}")
    print("=" * 70)


def wait_and_copy(label: str, text: str, auto_copy: bool = True):
    """Copy text to clipboard and wait for user confirmation."""
    if auto_copy:
        copy_to_clipboard(text)
    preview = text[:120].replace("\n", " ")
    if len(text) > 120:
        preview += "..."
    print(f"\n  >> {label} copied to clipboard ({len(text)} chars)")
    print(f"     Preview: {preview}")
    input("     Press Enter after pasting... ")


def process_gpt(index: int, total: int, slug: str, config: dict) -> bool:
    """Process a single GPT creation. Returns True if completed."""
    display_header(index, total, slug, config)

    name = config["name"]
    description = config["description"]
    instructions = config["instructions"]
    starters = config.get("conversation_starters", [])
    capabilities = config.get("capabilities", {})
    category = config.get("category", "Other")

    # Show overview
    print(f"\n  Name:        {name}")
    print(f"  Description: {description[:80]}...")
    print(f"  Category:    {category}")
    print(f"  Instructions: {len(instructions)} chars")
    print(f"  Starters:    {len(starters)}")
    print(f"\n  Capabilities:")
    print(capability_str(capabilities))

    print(f"\n  {'~' * 50}")
    print(f"  Open: https://chatgpt.com/gpts/editor")
    print(f"  Click 'Configure' tab, then paste each field:")
    print(f"  {'~' * 50}")

    # Step-by-step clipboard copy
    input("\n  Press Enter to start copying fields (or 's' to skip)... ")

    # 1. Name
    wait_and_copy("NAME", name)

    # 2. Description
    wait_and_copy("DESCRIPTION", description)

    # 3. Instructions (may need truncation)
    instr = truncate_instructions(instructions)
    if len(instr) < len(instructions):
        print(f"\n  ** Instructions truncated: {len(instructions)} -> {len(instr)} chars **")
    wait_and_copy("INSTRUCTIONS", instr)

    # 4. Conversation Starters (one at a time)
    for i, starter in enumerate(starters, 1):
        wait_and_copy(f"STARTER {i}/{len(starters)}", starter)

    # 5. Capabilities reminder
    print(f"\n  Set capabilities:")
    print(capability_str(capabilities))

    # 6. Category
    print(f"\n  Set category to: {category}")

    # 7. Confirmation
    print(f"\n  {'~' * 50}")
    result = input("  Done? Press Enter to mark complete, or 'r' to redo: ").strip().lower()
    return result != "r"


def show_list(state: dict, priority: bool = False):
    """Show all GPTs with completion status."""
    configs = get_ordered_configs(priority)
    completed = set(state.get("completed", []))

    print("\n" + "=" * 70)
    print("  GPT Store - All 40 GPTs")
    print("=" * 70)

    for i, (slug, config) in enumerate(configs, 1):
        status = "[DONE]" if slug in completed else "[    ]"
        name = config["name"]
        cat = config.get("category", "N/A")
        print(f"  {i:2d}. {status} {name:<45s} [{cat}]")

    done = len(completed)
    print(f"\n  Progress: {done}/{len(configs)} ({done/len(configs)*100:.0f}%)")
    remaining = len(configs) - done
    est_minutes = remaining * 3  # ~3 min per GPT
    print(f"  Estimated time remaining: {est_minutes} min ({est_minutes/60:.1f} hours)")
    print()


def main():
    args = sys.argv[1:]
    priority = "--priority" in args
    resume = "--resume" in args
    show = "--list" in args

    state = load_state()

    if show:
        show_list(state, priority)
        return

    configs = get_ordered_configs(priority)
    completed = set(state.get("completed", []))
    total = len(configs)

    # Find starting index
    start_index = 0
    if "--skip" in args:
        skip_idx = args.index("--skip")
        if skip_idx + 1 < len(args):
            start_index = int(args[skip_idx + 1]) - 1

    if resume:
        # Find first uncompleted
        for i, (slug, _) in enumerate(configs):
            if slug not in completed:
                start_index = i
                break

    # Show banner
    print("\n" + "=" * 70)
    print("  GPT Store Batch Creator - hanabi-jpn")
    print("  " + "=" * 66)
    print(f"  Total GPTs:     {total}")
    print(f"  Completed:      {len(completed)}")
    print(f"  Remaining:      {total - len(completed)}")
    print(f"  Starting from:  #{start_index + 1}")
    print(f"  Order:          {'Priority (most valuable first)' if priority else 'Alphabetical'}")
    print(f"  State file:     {STATE_FILE}")
    print("=" * 70)

    print("\n  Workflow per GPT:")
    print("    1. Open https://chatgpt.com/gpts/editor")
    print("    2. Click 'Create' for each new GPT")
    print("    3. Switch to 'Configure' tab")
    print("    4. Paste each field (auto-copied to clipboard)")
    print("    5. Set capabilities & category")
    print("    6. Click 'Create' (top-right)")
    print("    7. Choose 'Everyone' for visibility")
    print("    8. Click 'Confirm'")

    input("\n  Press Enter to begin...")

    session_start = time.time()

    for i in range(start_index, total):
        slug, config = configs[i]

        if slug in completed:
            print(f"\n  Skipping {slug} (already completed)")
            continue

        gpt_start = time.time()
        success = process_gpt(i, total, slug, config)

        if success:
            completed.add(slug)
            state["completed"] = list(completed)
            elapsed = time.time() - gpt_start
            state["total_time_sec"] = state.get("total_time_sec", 0) + elapsed
            state["last_completed"] = slug
            state["last_completed_at"] = datetime.now().isoformat()
            save_state(state)

            remaining = total - len(completed)
            avg_time = state["total_time_sec"] / len(completed)
            est_remaining = remaining * avg_time

            print(f"\n  Saved! {len(completed)}/{total} done.")
            print(f"  This GPT: {elapsed:.0f}s | Avg: {avg_time:.0f}s | Est remaining: {est_remaining/60:.0f} min")

            if remaining > 0:
                cont = input("\n  Continue to next? (Enter=yes, q=quit): ").strip().lower()
                if cont == "q":
                    print(f"\n  Progress saved. Run with --resume to continue.")
                    break
        else:
            print(f"\n  Re-doing {slug}...")
            # Don't increment, will re-process this GPT
            continue

    # Final summary
    session_time = time.time() - session_start
    print("\n" + "=" * 70)
    print("  Session Complete!")
    print(f"  GPTs created this session: {len(completed) - len(set(load_state().get('completed', [])))}")
    print(f"  Total completed: {len(completed)}/{total}")
    print(f"  Session time: {session_time/60:.1f} minutes")
    if state.get("total_time_sec") and len(completed) > 0:
        print(f"  Overall avg: {state['total_time_sec']/len(completed):.0f}s per GPT")
    print("=" * 70)


if __name__ == "__main__":
    main()
