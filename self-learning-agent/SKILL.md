```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   🧠 S E L F - L E A R N I N G 🧠       │
    │          A  G  E  N  T                   │
    │                                          │
    │            ┌─────────┐                   │
    │            │  📚  📚 │   "I remember     │
    │            │    💡   │    everything."   │
    │            │  ╰───╯  │                   │
    │            └────┬────┘                   │
    │         ┌───────┼───────┐                │
    │         ▼       ▼       ▼                │
    │       [PJ-A] [PJ-B]  [PJ-C]             │
    │         └───────┼───────┘                │
    │              🌐 GLOBAL                   │
    ╰──────────────────────────────────────────╯
```

# Self-Learning Agent

`🧠 Cross-Project` `⚡ Auto-Capture` `📊 Analytics` `🗜 Compressed` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

> Cross-project learning engine with automatic failure capture, intelligent knowledge promotion, and context-aware memory compression.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `ai` `learning` `memory` `cross-project` `self-improvement`

---

## Overview

Self-Learning Agent captures errors, corrections, and patterns across ALL your projects — not just one. It automatically detects failures, logs learnings, promotes cross-project knowledge, and compresses context to prevent memory bloat.

```
┌─────────────────────────────────────────────────┐
│              LEARNING PIPELINE                   │
│                                                 │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐  │
│  │ CAPTURE  │───▶│  ANALYZE  │───▶│  STORE   │  │
│  │ Auto/Man │    │ Categorize│    │ Project  │  │
│  └──────────┘    └───────────┘    └──────────┘  │
│                                        │        │
│                                        ▼        │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐  │
│  │  APPLY   │◀───│  PROMOTE  │◀───│  SCORE   │  │
│  │ Context  │    │ Proj→Glob │    │ Relevance│  │
│  └──────────┘    └───────────┘    └──────────┘  │
│       │                                         │
│       ▼                                         │
│  ┌──────────────────────────────────────────┐   │
│  │  COMPRESS — Keep context under budget    │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Self-Learning Agent**, a cross-project learning system. Follow these rules:

### Automatic Failure Capture

After EVERY tool execution that results in an error:

1. **Capture** the error context:
   - Command or tool that failed
   - Error message and exit code
   - Current working directory and project
   - Relevant file paths

2. **Categorize** the error:
   - `syntax` — Code syntax errors
   - `runtime` — Runtime failures, crashes
   - `config` — Configuration issues, missing env vars
   - `network` — API failures, timeouts, DNS errors
   - `permission` — File/directory permission issues
   - `dependency` — Missing packages, version conflicts
   - `logic` — Wrong output, unexpected behavior

3. **Search** for similar past errors:
   - Check project-level learnings first: `<project>/.self-learning/learnings.jsonl`
   - Then check global learnings: `~/.openclaw/self-learning/global/errors.jsonl`
   - If a match is found, immediately suggest the known fix

4. **Log** the learning:
   ```json
   {
     "id": "learn-{timestamp}",
     "type": "error",
     "category": "runtime",
     "context": "Running pytest on auth module",
     "error": "ImportError: cannot import name 'jwt' from 'jose'",
     "fix": "Install python-jose[cryptography] instead of python-jose",
     "project": "web-api",
     "frequency": 1,
     "impact": 0.8,
     "created": "2026-03-01T10:00:00Z",
     "status": "active"
   }
   ```

### Cross-Project Knowledge Graph

Knowledge lives at two levels:

**Global** (`~/.openclaw/self-learning/global/`):
- `errors.jsonl` — Errors seen across multiple projects
- `patterns.jsonl` — Workflow patterns that work everywhere
- `preferences.json` — User preferences (coding style, tools, etc.)
- `index.json` — Fast lookup index by category and keyword

**Project** (`<project>/.self-learning/`):
- `learnings.jsonl` — Project-specific learnings
- `overrides.json` — Project-specific settings that override global defaults

**Knowledge Flow:**
- **UP** (Project → Global): When a learning occurs in 3+ different projects, it auto-promotes to global
- **DOWN** (Global → Project): When starting a new session, top 10 most relevant global learnings are loaded as context hints
- **LATERAL** (Project → Project): When working in Project B, if an error matches a learning from Project A, suggest the fix

### Intelligent Promotion Engine

Each learning has a **promotion score**:

```
score = frequency × impact × recency_weight

where:
  frequency  = times this learning was useful (1-10, capped)
  impact     = severity of the problem it solves (0.0-1.0)
  recency    = 1.0 if used today, decays 0.1 per week of non-use
```

**Promotion rules:**
- Score > 0.7 → Auto-promote to global (with notification)
- Score 0.3-0.7 → Candidate for promotion (suggest to user)
- Score < 0.3 for 30 days → Archive (move to `.self-learning/archive/`)
- Conflicting learnings → Ask user to resolve

### Context-Aware Compression

**CRITICAL**: Never load more than 2000 tokens of learning context per session.

Compression strategies:
1. **Merge**: Combine similar learnings into unified rules
   - "Use python-jose[cryptography]" + "Install cryptography for JWT" → "JWT: always use python-jose[cryptography]"
2. **Summarize**: Convert verbose learnings into concise one-liners
3. **Prioritize**: Load highest-scoring learnings first
4. **Truncate**: If still over budget, drop lowest-score items

### Commands

**`learn`** — Manually log a learning:
1. Ask user: What did you learn?
2. Categorize and score
3. Store in project learnings
4. Check if similar learning exists globally (merge if so)

**`learn --auto`** — Toggle automatic learning mode:
- When ON: capture all errors and corrections automatically
- When OFF: only manual logging
- Status persists in `.self-learning/config.json`

**`learn recall <topic>`** — Search knowledge base:
1. Search project learnings for topic
2. Search global learnings for topic
3. Rank by relevance and score
4. Display top 10 matches with context

**`learn stats`** — Show learning analytics:
```
╔═══════════════════════════════════════════╗
║        Self-Learning Agent Stats          ║
╠═══════════════════════════════════════════╣
║ Total Learnings:     142 (37 global)      ║
║ Categories:                               ║
║   errors:    67  ████████████░░░░  47%    ║
║   patterns:  41  ██████████░░░░░░  29%    ║
║   prefs:     19  █████░░░░░░░░░░░  13%    ║
║   workflows: 15  ████░░░░░░░░░░░░  11%    ║
║                                           ║
║ Top Impact Learnings:                     ║
║ 1. JWT: use python-jose[crypto] (score 9) ║
║ 2. Docker: always set platform (score 8)  ║
║ 3. Git: rebase before merge (score 7)     ║
║                                           ║
║ Cross-Project Promotions: 37              ║
║ Archived (stale): 23                      ║
║ Context Budget: 1,847 / 2,000 tokens      ║
╚═══════════════════════════════════════════╝
```

**`learn promote`** — Force promotion check:
- Re-score all project learnings
- Promote qualifying ones to global
- Show what was promoted

**`learn export`** — Export all learnings as JSON:
- Global + all project learnings in one file
- Portable format for backup or sharing

**`learn import <file>`** — Import learnings:
- Merge with existing knowledge
- Deduplicate automatically
- Report conflicts

**`learn prune`** — Clean up knowledge base:
- Archive stale learnings (no use in 30 days)
- Merge duplicates
- Recalculate all scores
- Report space savings

**`learn graph`** — Show knowledge graph:
- Category tree with learning counts
- Cross-project connections
- Most connected learnings (hub nodes)

### Session Lifecycle

**Session Start:**
1. Load config from `.self-learning/config.json`
2. Load top 10 most relevant global learnings for current project
3. Load all project-specific learnings (compressed to fit budget)
4. Total context: ≤ 2000 tokens

**During Session:**
- If auto-learn is ON: capture errors and corrections in real-time
- If a known error pattern is detected: immediately suggest fix
- Track user corrections as implicit learnings

**Session End:**
1. Extract new learnings from session
2. Score and store new learnings
3. Run promotion check
4. Compress if over budget

### Data Storage

```
~/.openclaw/self-learning/
├── global/
│   ├── errors.jsonl          # Cross-project errors
│   ├── patterns.jsonl        # Universal patterns
│   ├── preferences.json      # User preferences
│   └── index.json            # Fast lookup index
├── projects/
│   └── {project-hash}/
│       ├── learnings.jsonl   # Project learnings
│       ├── overrides.json    # Project-specific config
│       └── archive.jsonl     # Archived learnings
├── analytics/
│   └── stats.json            # Aggregate statistics
└── config.json               # Global config
```

## Why Self-Learning Agent vs Self-Improving Agent?

| Feature | Self-Improving Agent | Self-Learning Agent |
|---------|---------------------|---------------------|
| Cross-project memory | No (project-scoped) | **Yes (global + project)** |
| Automatic capture | Manual only | **Auto + manual** |
| Context management | Grows unbounded | **2000 token hard cap** |
| Knowledge promotion | Manual status updates | **Automatic scoring** |
| Stale knowledge cleanup | None | **30-day auto-archive** |
| Knowledge search | File-based | **Indexed + scored** |
| Import/Export | No | **Yes** |
| Deduplication | No | **Automatic** |

## FAQ

**Q: How much context does it use?**
A: Maximum 2000 tokens per session, strictly enforced. Most sessions use 500-1500 tokens. The compression engine automatically merges, summarizes, and prioritizes learnings to stay within this budget.

**Q: Does it slow down my agent?**
A: No. Captures happen asynchronously after tool calls. The only sync operation is loading learnings at session start (~100ms). Even with 500+ learnings in the knowledge base, the indexed lookup keeps query time under 50ms.

**Q: Can I share learnings with my team?**
A: Yes. Use `learn export` to create a portable JSON file, then `learn import` on another machine. The import process automatically deduplicates and merges with existing knowledge.

**Q: How much does it cost in tokens?**
A: The learning capture itself costs zero additional tokens — it piggybacks on existing tool call results. Loading context at session start costs 500-2000 tokens depending on the number of relevant learnings. The `learn stats` and `learn graph` commands each cost approximately 200-400 tokens for rendering.

**Q: What happens when learnings conflict across projects?**
A: The promotion engine detects conflicts when a learning from Project A contradicts one from Project B. Conflicting learnings are flagged and presented to the user for resolution. Until resolved, both learnings remain at project level and neither is promoted to global.

**Q: Can I use Self-Learning Agent with Capability Evolver Pro?**
A: Yes, they complement each other well. Self-Learning Agent captures error patterns and knowledge, while Capability Evolver Pro acts on that knowledge to improve agent behavior. Evolver Pro can read Self-Learning Agent's `learnings.jsonl` as input for its `repair` strategy.

**Q: Does it work offline?**
A: Fully offline. All knowledge storage is local filesystem-based (JSONL and JSON files). No network requests, no cloud sync, no external dependencies. The skill works entirely through standard file operations.

**Q: How does auto-archive work and can I recover archived learnings?**
A: Learnings with a promotion score below 0.3 for 30 consecutive days are automatically moved to `.self-learning/archive/`. Archived learnings are not loaded into context but remain on disk. Use `learn recall <topic>` to search across both active and archived learnings. You can manually re-activate an archived learning by moving it back to `learnings.jsonl`.

**Q: Is my learning data private?**
A: All data stays on your local machine in `~/.openclaw/self-learning/` (global) and `<project>/.self-learning/` (project-level). No telemetry is collected. The `learn export` function creates a local file — sharing is entirely manual and user-initiated.

**Q: How do I reset or start fresh?**
A: Delete the `.self-learning/` directory in the specific project, or `~/.openclaw/self-learning/` for global learnings. Alternatively, use `learn prune` to clean up stale learnings without a full reset. There is no `learn reset` command by design — the prune approach is safer and preserves high-value learnings.

## Error Handling

| Error | Cause | Agent Action |
|-------|-------|-------------|
| Learning capture fails | Disk full or permissions issue on `.self-learning/` directory | Log a warning to stderr. Do not interrupt the user's workflow — learning capture is non-blocking. Retry on next error event. Suggest checking disk space if failures persist. |
| JSONL parse error | Corrupted entry in `learnings.jsonl` or `errors.jsonl` | Skip the corrupted line, log its line number, and continue processing remaining entries. Suggest running `learn prune` to clean up corrupted records. |
| Context budget exceeded (>2000 tokens) | Too many high-scoring learnings loaded at session start | Apply compression strategies in order: merge similar → summarize verbose → prioritize by score → truncate lowest-score items. Never exceed the 2000-token hard cap. |
| Duplicate learning detected | Same error or pattern captured multiple times | Merge with existing learning: increment `frequency`, update `created` timestamp, recalculate promotion score. Do not create a duplicate entry. |
| Promotion conflict | Two project-level learnings contradict each other | Flag both learnings as `conflicted` status. Present both to user with context. Do not auto-promote either. Wait for user resolution via `learn promote`. |
| Index corruption | `index.json` is out of sync with actual learnings | Rebuild index from source JSONL files automatically. Log the rebuild event. This is a self-healing operation — no user action required. |
| Import merge failure | Imported file has incompatible schema or version | Report the specific incompatibility (missing fields, wrong version). Attempt partial import of compatible entries. Show count of skipped vs imported entries. |
| Global directory missing | `~/.openclaw/self-learning/global/` does not exist (first run) | Create the full directory structure with empty JSONL files, default `config.json`, and empty `index.json`. Log initialization event. Continue normally. |
| Archive directory full | Large number of archived learnings consuming disk space | Report disk usage of archive directory. Suggest running `learn prune` with `--hard` flag to permanently delete archived learnings older than 90 days. |
| Cross-project lookup timeout | Searching across many projects takes too long | Set a 5-second timeout on cross-project searches. Return partial results with a note indicating which projects were not searched. Suggest narrowing the search topic. |
