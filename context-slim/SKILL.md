---
name: "Context Slim"
description: "Context window optimizer — save 40-70% with 3 compression strategies"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - context
  - optimization
  - compression
  - tokens
  - efficiency
---

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

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Updated](https://img.shields.io/badge/Updated-2026-blue)]()

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

Output:
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
║ ⚠️ Warning: 68% used. Optimize soon.    ║
╚══════════════════════════════════════════╝
```

**`slim analyze`** — Detailed analysis with top consumers, duplicates, recommendations

Output:
```
╔═══════════════════════════════════════════════════════╗
║           Context Slim — Deep Analysis                ║
╠═══════════════════════════════════════════════════════╣
║  Total Usage: 87,400 / 128,000 tokens (68%)          ║
║                                                       ║
║  Top Consumers:                                       ║
║  ──────────────────────────────────────────────        ║
║  1. Conversation (42 turns):   34,200 tokens (39%)   ║
║  2. byterover context:         18,200 tokens (21%)   ║
║  3. project README.md:          6,400 tokens  (7%)   ║
║  4. self-learning data:         4,300 tokens  (5%)   ║
║  5. skill-guardian threats:     3,200 tokens  (4%)   ║
║                                                       ║
║  Duplicates Found: 3                                  ║
║  ──────────────────────────────────────────────        ║
║  • Project description appears in 3 skill contexts    ║
║    (est. 2,100 tokens recoverable)                    ║
║  • Auth config repeated in 2 memory files             ║
║    (est. 1,200 tokens recoverable)                    ║
║  • Package.json contents duplicated in tool results   ║
║    (est. 900 tokens recoverable)                      ║
║                                                       ║
║  Stale Content: 5 items (est. 8,100 tokens)          ║
║  ──────────────────────────────────────────────        ║
║  • 12 conversation turns older than 30 minutes        ║
║  • 3 tool results from completed tasks                ║
║                                                       ║
║  Recommendations:                                     ║
║  1. Run `slim dedup` to save ~4,200 tokens           ║
║  2. Compress conversation (save ~17,000 tokens)       ║
║  3. Set budget for byterover (currently unbounded)    ║
║  4. Total potential savings: ~29,300 tokens (34%)    ║
╚═══════════════════════════════════════════════════════╝
```

**`slim compress`** — Auto-compress (picks best strategy per content type):
- Conversation history -> semantic compression
- Code/structured docs -> structural compression
- Skill instructions -> priority compression

Output:
```
╔═══════════════════════════════════════════════════════╗
║           Context Slim — Auto-Compress                ║
╠═══════════════════════════════════════════════════════╣
║  Analyzing content types and selecting strategies...  ║
║                                                       ║
║  Conversation (42 turns) → semantic compression       ║
║    Before: 34,200 tokens                              ║
║    After:  12,400 tokens                              ║
║    Saved:  21,800 tokens (63.7%)  ✅                  ║
║                                                       ║
║  Code files → structural compression                  ║
║    Before: 8,200 tokens                               ║
║    After:  4,100 tokens                               ║
║    Saved:  4,100 tokens (50.0%)  ✅                   ║
║                                                       ║
║  Skill instructions → priority compression            ║
║    Before: 12,300 tokens                              ║
║    After:  8,900 tokens                               ║
║    Saved:  3,400 tokens (27.6%)  ✅                   ║
║                                                       ║
║  Tool results → semantic compression                  ║
║    Before: 12,000 tokens                              ║
║    After:  5,200 tokens                               ║
║    Saved:  6,800 tokens (56.7%)  ✅                   ║
║                                                       ║
║  ═══════════════════════════════════════════════════   ║
║  Total saved: 36,100 tokens (41.3%)                   ║
║  New usage: 51,300 / 128,000 tokens (40%)            ║
║  Status: ████████░░░░░░░░░░░░ 40% — HEALTHY          ║
╚═══════════════════════════════════════════════════════╝
```

**`slim compress --strategy <semantic|structural|priority>`** — Force strategy

Output:
```
╔═══════════════════════════════════════════════════════╗
║     Context Slim — Semantic Compression               ║
╠═══════════════════════════════════════════════════════╣
║  Strategy: semantic (forced)                          ║
║  Target: All compressible content blocks              ║
║                                                       ║
║  Processing 6 content blocks...                       ║
║  [1/6] Conversation history:  34,200 → 11,800  ✅    ║
║  [2/6] byterover context:    18,200 →  6,400  ✅    ║
║  [3/6] Tool results:          12,000 →  4,800  ✅    ║
║  [4/6] self-learning data:     4,300 →  2,100  ✅    ║
║  [5/6] README.md:              6,400 →  3,200  ✅    ║
║  [6/6] Skill instructions:   12,300 →  9,800  ✅    ║
║                                                       ║
║  Total saved: 39,000 tokens (44.6%)                   ║
║  Key entities preserved: 142/142 (100%)              ║
║  New usage: 48,400 / 128,000 tokens (38%)            ║
╚═══════════════════════════════════════════════════════╝
```

**`slim budget set <category> <tokens>`** — Set budget:
- Categories: system_skills, conversation, memory_files, active_files, tool_results

Output:
```
✅ Budget updated: conversation → 30,000 tokens

  Category         │ Old Budget │ New Budget │ Current Use
  ─────────────────┼────────────┼────────────┼───────────
  system_skills    │    3,000   │    3,000   │   2,800
  conversation     │   40,000   │   30,000   │  34,200 ⚠️
  memory_files     │   15,000   │   15,000   │  12,400
  active_files     │   20,000   │   20,000   │   8,200
  tool_results     │   10,000   │   10,000   │   6,800
  buffer           │    5,000   │    5,000   │     —

  ⚠️ conversation is currently over the new budget.
  Run `slim compress` to bring it within limits.
```

**`slim budget show`** — Show current budgets and usage

Output:
```
╔═══════════════════════════════════════════════════════╗
║          Context Slim — Budget Overview               ║
╠═══════════════════════════════════════════════════════╣
║  Category       │ Budget  │ Used    │ %    │ Status   ║
║  ───────────────┼─────────┼─────────┼──────┼──────── ║
║  system_skills  │  3,000  │  2,800  │ 93%  │ ⚠️      ║
║  conversation   │ 30,000  │ 12,400  │ 41%  │ ✅      ║
║  memory_files   │ 15,000  │ 12,400  │ 83%  │ ⚠️      ║
║  active_files   │ 20,000  │  8,200  │ 41%  │ ✅      ║
║  tool_results   │ 10,000  │  6,800  │ 68%  │ ✅      ║
║  buffer         │  5,000  │    —    │  —   │ ✅      ║
║  ───────────────┼─────────┼─────────┼──────┼──────── ║
║  Total          │ 83,000  │ 42,600  │ 51%  │ ✅      ║
║                                                       ║
║  Model max: 128,000 tokens                            ║
║  Unallocated: 45,000 tokens                          ║
╚═══════════════════════════════════════════════════════╝
```

**`slim dedup`** — Run deduplication:
- Find and merge duplicates
- Report savings

Output:
```
╔═══════════════════════════════════════════════════════╗
║           Context Slim — Deduplication                ║
╠═══════════════════════════════════════════════════════╣
║  Scanning content blocks for duplicates...            ║
║  Hashing 48 content blocks...                         ║
║                                                       ║
║  Exact Duplicates Found: 2                            ║
║  ──────────────────────────────────────────────        ║
║  • Project description (3 copies → 1 canonical)      ║
║    Saved: 2,100 tokens                                ║
║  • Package.json in tool results (2 copies → 1)       ║
║    Saved: 900 tokens                                  ║
║                                                       ║
║  Near-Duplicates Found: 1 (>80% similarity)          ║
║  ──────────────────────────────────────────────        ║
║  • Auth config in memory vs active file (87% match)  ║
║    Merged into canonical version                      ║
║    Saved: 1,200 tokens                                ║
║                                                       ║
║  Total deduplicated: 3 items                          ║
║  Total saved: 4,200 tokens                            ║
║  New usage: 83,200 / 128,000 tokens (65%)            ║
╚═══════════════════════════════════════════════════════╝
```

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

Output:
```
╔═══════════════════════════════════════════════════════╗
║        Context Slim — Full Optimization               ║
╠═══════════════════════════════════════════════════════╣
║  Step 1: Analyze...                              ✅   ║
║    Found 3 duplicates, 5 stale items, 2 over-budget  ║
║                                                       ║
║  Step 2: Dedup...                                ✅   ║
║    Removed 3 duplicates (saved 4,200 tokens)         ║
║                                                       ║
║  Step 3: Compress...                             ✅   ║
║    Conversation: semantic  (saved 21,800 tokens)     ║
║    Code files: structural  (saved 4,100 tokens)      ║
║    Skills: priority        (saved 3,400 tokens)      ║
║    Tool results: semantic  (saved 6,800 tokens)      ║
║                                                       ║
║  ═══════════════════════════════════════════════════   ║
║  Before: 87,400 tokens (68%)                         ║
║  After:  47,100 tokens (37%)                         ║
║  Saved:  40,300 tokens (46.1%)                       ║
║                                                       ║
║  Status: ████████░░░░░░░░░░░░ 37% — HEALTHY          ║
║  Optimization logged to .context-slim/history.jsonl  ║
╚═══════════════════════════════════════════════════════╝
```

**`slim history`** — Show compression history and cumulative savings

Output:
```
╔═══════════════════════════════════════════════════════╗
║         Context Slim — Compression History            ║
╠═══════════════════════════════════════════════════════╣
║  Date        │ Action     │ Saved    │ Method         ║
║  ────────────┼────────────┼──────────┼──────────────  ║
║  Mar 01 14:30│ optimize   │ 40,300   │ auto-select    ║
║  Mar 01 12:15│ dedup      │  4,200   │ hash-compare   ║
║  Feb 28 16:45│ compress   │ 28,100   │ semantic       ║
║  Feb 28 10:20│ auto-90%   │ 12,400   │ priority       ║
║  Feb 27 14:00│ compress   │ 22,300   │ structural     ║
║  Feb 26 09:30│ dedup      │  3,800   │ hash-compare   ║
║                                                       ║
║  Cumulative Savings (7 days):                         ║
║  Total tokens saved:   111,100                        ║
║  Optimization runs:    6                              ║
║  Auto-triggers:        1 (90% threshold)              ║
║  Avg savings per run:  18,517 tokens                  ║
║                                                       ║
║  Data: .context-slim/history.jsonl                    ║
╚═══════════════════════════════════════════════════════╝
```

**`slim reset`** — Reset budgets and settings to defaults

Output:
```
╔═══════════════════════════════════════════════════════╗
║         Context Slim — Reset to Defaults              ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ⚠️ This will reset all budgets and settings.         ║
║  Compression history will be preserved.               ║
║                                                       ║
║  Confirm reset? (yes/no): yes                         ║
║                                                       ║
║  Budgets reset:                                       ║
║    system_skills:  3,000  (was 3,000 — unchanged)    ║
║    conversation:  40,000  (was 30,000 — restored)    ║
║    memory_files:  15,000  (was 15,000 — unchanged)   ║
║    active_files:  20,000  (was 20,000 — unchanged)   ║
║    tool_results:  10,000  (was 10,000 — unchanged)   ║
║    buffer:         5,000  (was 5,000 — unchanged)    ║
║                                                       ║
║  Custom priority overrides: cleared (3 removed)       ║
║  Skill profiles: preserved                            ║
║  Hash cache: cleared (will rebuild on next dedup)     ║
║                                                       ║
║  ✅ Settings reset to defaults.                        ║
╚═══════════════════════════════════════════════════════╝
```

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

## Error Handling

Context Slim handles compression and token management failures to prevent data loss and ensure context integrity.

### Compression Failure

| Scenario | Handling |
|---|---|
| **Semantic compression produces empty output** | Fall back to structural compression. If that also fails, keep original content unchanged and log the failure. Never replace content with an empty or corrupted summary. |
| **Compressed output is LARGER than original** | Discard the compressed version and keep the original. This can happen with very short content blocks where the summary overhead exceeds savings. Log the event for optimization. |
| **Compression loses critical entities (names, numbers, dates)** | Validate compressed output against a key-entity checklist extracted from the original. If any critical entity is missing, re-run compression with explicit entity preservation instructions. |
| **Multiple compression strategies all fail** | Mark the content block as "incompressible" and exclude it from future auto-compression. Apply budget enforcement by compressing other blocks instead. |

### Token Counting Errors

| Scenario | Handling |
|---|---|
| **Token count estimate diverges from actual** | Context Slim uses heuristic estimation (approximately 1 token per 4 characters for English). Actual tokenizer counts vary by model. Build in a 10% safety margin on all budget calculations. |
| **Model-specific tokenizer unavailable** | Fall back to the character-based heuristic. Display a warning that token counts are approximate. Never block operations due to missing tokenizer. |
| **Negative token count calculated** | Floor all values at 0. Log the anomaly. This typically indicates a bug in the deduplication accounting — run `slim analyze` to reconcile. |
| **Token count overflow on very large contexts** | Cap tracking at the model's maximum context window size. Any content beyond the cap is flagged for immediate compression or removal. |

### Budget Overflow

| Scenario | Handling |
|---|---|
| **Category exceeds budget after new content added** | Trigger automatic compression for that category (strategy selected by content type). If still over budget after compression, truncate oldest/lowest-priority items. Log every truncation with the removed content hash for recovery. |
| **Multiple categories over budget simultaneously** | Process in priority order: tool_results first (most ephemeral), then conversation, then memory_files, then active_files, then system_skills (most critical, compressed last). |
| **Total context exceeds model maximum** | Emergency mode: compress ALL categories to minimum viable content. Keep only: current user message, current task instructions, and most recent 2 conversation turns. Display warning with savings report. |
| **Budget configuration invalid (negative values, exceeds model max)** | Reject the configuration. Display current valid budgets. Suggest `slim reset` to restore defaults. |

### Deduplication Errors

| Scenario | Handling |
|---|---|
| **False positive: non-duplicate flagged as duplicate** | Deduplication uses >80% similarity threshold. If merged content loses distinct information, undo the merge. Users can exclude specific blocks with `slim priority set <item> 5` (critical items are never deduped). |
| **Hash collision** | Use content-length as secondary check. If two blocks have the same hash but different lengths, treat them as distinct. |
| **Cache file corrupted** | Rebuild hash cache from scratch by re-scanning all context blocks. This is slower but ensures correctness. Store backup in `.context-slim/cache/hashes.json.bak`. |

### Recovery

- All compression events are logged to `.context-slim/history.jsonl` with before/after token counts and content hashes.
- Use `slim history` to review what was compressed and when.
- Original content can be reconstructed from disk files — Context Slim never modifies source files.

## Context Slim vs Manual Context Management

| Feature | Context Slim | Manual Summarization | No Management (Default) | Simple Truncation |
|---|---|---|---|---|
| **Token Savings** | 40-70% through intelligent compression | 30-50% (depends on skill) | 0% — context fills until error | 20-40% but loses recent context |
| **Information Preservation** | Priority-scored: critical content kept in full | Varies — human judgment | N/A — everything kept until overflow | Poor — oldest content dropped blindly |
| **Effort Required** | Zero — automatic or one-command (`slim optimize`) | High — manual rewriting each session | Zero but hits `context_length_exceeded` errors | Low but lossy |
| **Deduplication** | Automatic — exact and near-duplicate detection | Manual — easy to miss duplicates | None — duplicates accumulate | None |
| **Per-Skill Profiling** | Tracks each skill's token footprint and growth rate | Not practical manually | No visibility | No visibility |
| **Budget Enforcement** | Hard limits per category with auto-compression | No enforcement — relies on discipline | No limits — first-come-first-served | Global limit only |
| **Compression Strategies** | 3 specialized strategies (semantic, structural, priority) | One approach (manual rewriting) | None | One approach (drop oldest) |
| **Recovery** | Full history log, original files untouched | Lossy — original phrasing lost | N/A | Lossy — truncated content gone |
| **Cost** | Free (included with skill) | Engineer time per session | Free but causes errors and degraded performance | Free but loses information |
| **Multi-Skill Awareness** | Profiles each skill, identifies unbounded growth | No cross-skill visibility | No visibility | No visibility |
| **Automatic Triggers** | 70% warn, 80% suggest, 90% auto-compress | None — must remember to summarize | None — crashes at 100% | None — must set up manually |

## FAQ

**Q: Does Context Slim modify my actual files?**
A: No. It only manages what's loaded into the agent's context window. Your files on disk remain unchanged.

**Q: How does it know what's in my context?**
A: It estimates based on loaded skills, conversation length, and active files. Exact token counts may vary by model.

**Q: Will it remove important information?**
A: The priority system ensures critical content (current task, recent messages) is never removed. Only low-priority and duplicate content is compressed or dropped.

**Q: Which compression strategy should I use?**
A: Use `slim compress` (automatic) and let Context Slim choose per content type. If you want manual control: use `semantic` for conversation history and documentation, `structural` for code files, and `priority` when you have many skills loaded but only need a few for the current task.

**Q: How accurate are the token count estimates?**
A: Context Slim uses a heuristic of approximately 1 token per 4 characters (English text). This is within 10-15% of actual tokenizer counts for most models. A 10% safety margin is built into all budget calculations. For precise counts, the estimates are sufficient for budget management.

**Q: Can I undo a compression?**
A: Compression only affects the in-memory context, not files on disk. If you need the full original content re-loaded, simply reference the source file again. All compression events are logged in `.context-slim/history.jsonl` for audit purposes.

**Q: Does it work with all LLM models?**
A: Yes. Context Slim is model-agnostic. It works with any model supported by OpenClaw (Claude, GPT, Gemini, etc.). Token estimates may vary slightly between models, but the 10% safety margin accounts for this difference.

**Q: What is the deduplication similarity threshold?**
A: Near-duplicate detection uses an 80% similarity threshold. Content blocks that share more than 80% of their key entities and structure are flagged as duplicates and merged into a single canonical version. You can protect specific blocks from deduplication by setting their priority to 5 (critical).

**Q: How does Context Slim interact with other skills?**
A: Context Slim monitors all loaded skills' token footprints via `slim profile`. It can identify which skills consume the most context and which have unbounded growth. It does not modify other skills' behavior — it only manages how their output is stored in context.

**Q: What happens during the automatic 90% trigger?**
A: When context usage reaches 90%, Context Slim automatically compresses the lowest-priority content blocks. It starts with priority 1 (background) content, then priority 2 (low) if needed. It never auto-compresses priority 4-5 content. A notification is displayed showing what was compressed and how many tokens were saved.
