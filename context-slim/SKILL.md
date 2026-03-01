```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   🗜  C O N T E X T  S L I M  🗜        │
    │                                          │
    │   BEFORE:                                │
    │   ████████████████████████░░ 92% FULL!   │
    │                                          │
    │            ╔═══════╗                     │
    │     ──────▶║ SLIM  ║──────▶              │
    │            ╚═══════╝                     │
    │                                          │
    │   AFTER:                                 │
    │   ████████░░░░░░░░░░░░░░░░ 34% FREE!    │
    │                                          │
    │    "Save 40-70% of your context."        │
    ╰──────────────────────────────────────────╯
```

# Context Slim

`🗜 -70% Tokens` `📊 Dashboard` `🔍 Dedup` `⚡ Auto-Compress` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

> Intelligent context window optimizer. Compresses, prioritizes, and manages context to prevent overflow while preserving critical information. Save 40-70% of your context budget.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `context` `optimization` `memory` `compression` `performance` `tokens`

---

## Overview

Context window bloat is the #1 pain point in the OpenClaw ecosystem. Memory skills, conversation history, and project files accumulate until your agent hits `context_length_exceeded` errors. Context Slim solves this with intelligent compression, priority-based loading, and automatic deduplication.

```
┌──────────────────────────────────────────┐
│          CONTEXT SLIM PIPELINE           │
│                                          │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │ MEASURE │─▶│ PRIORITZE│─▶│COMPRESS│  │
│  │ Tokens  │  │ Score    │  │ 3 modes│  │
│  └─────────┘  └──────────┘  └────────┘  │
│       │                          │       │
│       ▼                          ▼       │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │ DEDUP   │─▶│  BUDGET  │─▶│ REPORT │  │
│  │ Merge   │  │  Enforce │  │ Savings│  │
│  └─────────┘  └──────────┘  └────────┘  │
└──────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Context Slim**. When the user requests context optimization or when you detect context is getting large, follow these instructions:

### Context Analysis

When `slim status` or `slim analyze` is requested:

1. **Estimate current token usage** by category:
   - System prompt and skill instructions
   - Conversation history (messages so far)
   - Loaded memory/knowledge files
   - Active file contents
   - Tool results in context

2. **Identify top consumers**:
   - Which skills contribute most tokens?
   - How many conversation turns are in context?
   - Are there duplicate or near-duplicate content blocks?

3. **Display status**:
```
╔══════════════════════════════════════════╗
║          Context Slim Status             ║
╠══════════════════════════════════════════╣
║ Total Usage:  87,400 / 128,000 tokens   ║
║ Budget Used:  ████████████████░░░  68%   ║
╠══════════════════════════════════════════╣
║ Breakdown:                               ║
║  System/Skills:  12,300  (14%)  ████     ║
║  Conversation:   34,200  (39%)  ████████ ║
║  Memory/Files:   28,900  (33%)  ███████  ║
║  Tool Results:   12,000  (14%)  ████     ║
╠══════════════════════════════════════════╣
║ Top Consumers:                           ║
║  1. byterover context:  18,200 tokens    ║
║  2. conversation (42 turns): 34,200      ║
║  3. project README.md: 6,400             ║
║  4. self-learning data: 4,300            ║
║  5. skill-guardian threats: 3,200        ║
╠══════════════════════════════════════════╣
║ Duplicates Found: 3 (est. 4,200 tokens) ║
║ Stale Content: 5 items (est. 8,100)     ║
║                                          ║
║ ⚠️ Warning: 68% used. Optimize soon.    ║
╚══════════════════════════════════════════╝
```

### Compression Strategies

**`semantic`** — Meaning-preserving compression:
- Summarize verbose content into dense representations
- Keep all facts, names, numbers, and key conclusions
- Remove filler words, redundant explanations, examples
- Best for: conversation history, documentation
- Typical savings: 50-70%

**`structural`** — Structure-preserving compression:
- Keep headers, function signatures, file paths, code structure
- Summarize body content within each section
- Preserve the skeleton, compress the flesh
- Best for: code files, structured documents
- Typical savings: 40-60%

**`priority`** — Relevance-based compression:
- Score each context chunk by relevance to current task
- Keep high-relevance content in full
- Compress medium-relevance content
- Drop low-relevance content entirely
- Best for: multi-skill agents with lots of background context
- Typical savings: 30-50%

### Priority System

Each context chunk is scored (1-5):

- **5 (Critical)**: Current task instructions, active file being edited, most recent user message
- **4 (High)**: Last 3 conversation turns, active skill context, current project config
- **3 (Medium)**: Project memory, frequently used patterns, installed skill instructions
- **2 (Low)**: Older conversation history (>5 turns ago), inactive skill data, cached results
- **1 (Background)**: General knowledge, stale memory, unused tool results

User can override: `slim priority set <item> <1-5>`

### Token Budgets

Set hard limits per category to prevent any single source from consuming too much:

```json
{
  "system_skills": 3000,
  "conversation": 40000,
  "memory_files": 15000,
  "active_files": 20000,
  "tool_results": 10000,
  "buffer": 5000
}
```

When a category exceeds its budget:
1. Try compression (strategy based on content type)
2. If still over: truncate oldest/lowest-priority items
3. Log what was removed

### Deduplication Engine

Detect and merge:
- **Exact duplicates**: Same content appearing in multiple places
- **Near-duplicates**: Content with >80% similarity (different wording, same information)
- **Stale versions**: Older version of content that's been updated

Algorithm:
1. Hash each content block (sentence-level)
2. Compare hashes for exact matches
3. For non-exact: compare key entity overlap
4. Merge duplicates into single canonical version
5. Replace all references to point to canonical

### Automatic Optimization

Context Slim can run automatically:
- When context reaches 70% capacity: warn
- When context reaches 80% capacity: suggest optimization
- When context reaches 90% capacity: auto-compress lowest-priority content

### Commands

**`slim status`** — Quick context usage overview

**`slim analyze`** — Detailed analysis with top consumers, duplicates, recommendations

**`slim compress`** — Auto-compress (picks best strategy per content type):
- Conversation history → semantic compression
- Code/structured docs → structural compression
- Skill instructions → priority compression

**`slim compress --strategy <semantic|structural|priority>`** — Force strategy

**`slim budget set <category> <tokens>`** — Set budget:
- Categories: system_skills, conversation, memory_files, active_files, tool_results

**`slim budget show`** — Show current budgets and usage

**`slim dedup`** — Run deduplication:
- Find and merge duplicates
- Report savings

**`slim profile`** — Profile each installed skill's context footprint:
```
╔═══════════════════════════════════════════╗
║     Skill Context Profile                 ║
╠═══════════════════════════════════════════╣
║ Skill            │ Tokens │ Growth/Session║
║ byterover        │ 18,200 │ +2,400 ⚠️    ║
║ self-learning    │  4,300 │ +200         ║
║ capability-evlvr │  1,800 │ +50          ║
║ summarize-pro    │    900 │ 0            ║
║ skill-guardian   │  3,200 │ 0            ║
╠═══════════════════════════════════════════╣
║ ⚠️ byterover is growing unbounded        ║
║ Recommendation: Set budget to 10,000      ║
╚═══════════════════════════════════════════╝
```

**`slim optimize`** — Full optimization run (analyze + compress + dedup):
- One command does everything
- Report savings

**`slim history`** — Show compression history and cumulative savings

**`slim reset`** — Reset budgets and settings to defaults

### Data Storage

```
.context-slim/
├── config.json          # Budgets and settings
├── history.jsonl        # Compression events
├── profiles/
│   └── {skill}.json     # Skill context profiles
└── cache/
    └── hashes.json      # Content hashes for dedup
```

## FAQ

**Q: Does Context Slim modify my actual files?**
A: No. It only manages what's loaded into the agent's context window. Your files on disk remain unchanged.

**Q: How does it know what's in my context?**
A: It estimates based on loaded skills, conversation length, and active files. Exact token counts may vary by model.

**Q: Will it remove important information?**
A: The priority system ensures critical content (current task, recent messages) is never removed. Only low-priority and duplicate content is compressed or dropped.
