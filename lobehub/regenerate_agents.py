#!/usr/bin/env python3
"""
regenerate_agents.py
Regenerate lobehub/agents.json from all SKILL.md files across 5 package dirs.

Reads YAML frontmatter (name, description, author, tags) and the
"## System Prompt" section from each SKILL.md, then emits a single
agents.json in LobeHub schemaVersion-1 format.

Usage:
  python3 regenerate_agents.py          # writes agents.json next to this script
  python3 regenerate_agents.py --dry    # print to stdout instead of writing
"""

import sys
import json
import re
import os
import glob as globmod

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT = os.path.join(SCRIPT_DIR, "agents.json")

PACKS = [
    "ec-master-pack",
    "finance-accounting-pack",
    "marketing-growth-pack",
    "business-ops-pack",
    "security-devops-pack",
]


def parse_yaml_frontmatter(content):
    """Extract YAML frontmatter between --- markers."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return {}

    yaml_text = match.group(1)
    result = {}

    current_key = None
    current_list = None

    for line in yaml_text.split('\n'):
        # List item
        list_match = re.match(r'^\s+-\s+(.+)$', line)
        if list_match and current_key:
            if current_list is None:
                current_list = []
            val = list_match.group(1).strip().strip('"').strip("'")
            current_list.append(val)
            result[current_key] = current_list
            continue

        # Key: value
        kv_match = re.match(r'^(\w[\w-]*):\s*(.*)$', line)
        if kv_match:
            key = kv_match.group(1)
            value = kv_match.group(2).strip().strip('"').strip("'")
            current_key = key
            current_list = None
            if value:
                result[key] = value
            continue

    return result


def extract_system_prompt(content):
    """Extract everything between '## System Prompt...' and the next '## ' heading or '---' separator."""
    pattern = r'^## System Prompt[^\n]*\n'
    match = re.search(pattern, content, re.MULTILINE)
    if not match:
        return ""

    start = match.end()
    rest = content[start:]

    # Find the next ## heading or standalone --- separator
    end_match = re.search(r'^(?:## |\-\-\-\s*$)', rest, re.MULTILINE)
    if end_match:
        prompt_text = rest[:end_match.start()]
    else:
        prompt_text = rest

    return prompt_text.strip()


def pick_avatar(pack_name):
    """Pick an emoji avatar based on the pack."""
    avatars = {
        "ec-master-pack": "\U0001f6d2",           # shopping cart
        "finance-accounting-pack": "\U0001f4b0",   # money bag
        "marketing-growth-pack": "\U0001f4c8",     # chart increasing
        "business-ops-pack": "\U0001f3e2",         # office building
        "security-devops-pack": "\U0001f512",      # lock
    }
    return avatars.get(pack_name, "\U0001f916")    # robot


def main():
    dry_run = "--dry" in sys.argv

    # Collect all SKILL.md paths
    skill_files = []
    for pack in PACKS:
        pack_dir = os.path.join(REPO_ROOT, pack)
        if not os.path.isdir(pack_dir):
            print(f"WARNING: Pack directory not found: {pack_dir}", file=sys.stderr)
            continue
        for entry in sorted(os.listdir(pack_dir)):
            skill_file = os.path.join(pack_dir, entry, "SKILL.md")
            if os.path.isfile(skill_file):
                skill_files.append(skill_file)

    print(f"Found {len(skill_files)} SKILL.md files across {len(PACKS)} packs", file=sys.stderr)

    agents = []

    for filepath in skill_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"ERROR reading {filepath}: {e}", file=sys.stderr)
            continue

        meta = parse_yaml_frontmatter(content)
        system_prompt = extract_system_prompt(content)

        if not system_prompt:
            print(f"WARNING: No system prompt found in {filepath}", file=sys.stderr)
            continue

        # Determine pack name from path
        parts = filepath.split('/')
        pack_name = ""
        for p in parts:
            if p.endswith("-pack"):
                pack_name = p
                break

        # Identifier = directory name
        identifier = os.path.basename(os.path.dirname(filepath))
        name = meta.get("name", identifier)
        description = meta.get("description", "")
        author = meta.get("author", "hanabi-jpn")
        tags = meta.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",")]

        avatar = pick_avatar(pack_name)

        agent = {
            "identifier": identifier,
            "meta": {
                "title": name,
                "description": description,
                "tags": tags,
                "avatar": avatar,
            },
            "config": {
                "systemRole": system_prompt,
            },
            "author": author,
            "homepage": f"https://github.com/hanabi-jpn/clawhub-skills/tree/main/{pack_name}/{identifier}",
            "createdAt": "2026-03-02",
            "schemaVersion": 1,
        }
        agents.append(agent)
        print(f"  OK: {pack_name}/{identifier} ({len(system_prompt):,} chars)", file=sys.stderr)

    # Sort by identifier for deterministic output
    agents.sort(key=lambda a: a["identifier"])

    output_obj = {
        "schemaVersion": 1,
        "agents": agents,
    }

    json_str = json.dumps(output_obj, indent=2, ensure_ascii=False)

    if dry_run:
        print(json_str)
    else:
        with open(OUTPUT, 'w', encoding='utf-8') as f:
            f.write(json_str)
            f.write('\n')
        print(f"\nWrote {len(agents)} agents to {OUTPUT}", file=sys.stderr)
        print(f"File size: {os.path.getsize(OUTPUT):,} bytes", file=sys.stderr)


if __name__ == "__main__":
    main()
