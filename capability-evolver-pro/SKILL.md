```
    ╭──────────────────────────────────────────╮
    │                                          │
    │    ⚡ C A P A B I L I T Y ⚡             │
    │    ⚡ E V O L V E R  P R O ⚡            │
    │                                          │
    │            ┌─────────┐                   │
    │            │  ◉   ◉  │   "I evolve.     │
    │            │    ▽    │    Safely."       │
    │            │  ╰───╯  │                   │
    │            └────┬────┘                   │
    │           ╱─────┼─────╲                  │
    │          ╱   ┌──┴──┐   ╲                 │
    │         🛡    │SAFE │    🔄               │
    │               └─────┘                    │
    ╰──────────────────────────────────────────╯
```

# Capability Evolver Pro

`🛡 Safe` `🔄 Sandboxed` `⏪ Rollback` `📊 Dashboard` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

> Safe, sandboxed self-evolution engine for OpenClaw agents with automatic rollback, evolution dashboard, and governed improvement protocols.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `ai` `self-improvement` `evolution` `safety` `meta-skill`

---

## Overview

Capability Evolver Pro is a **production-safe** self-evolution engine that allows your OpenClaw agent to autonomously improve its own capabilities over time — without the risks of uncontrolled self-modification.

Unlike the original Capability Evolver (which was suspended for safety concerns), this Pro version implements a **5-layer safety architecture** ensuring every evolution is sandboxed, validated, and reversible.

```
┌─────────────────────────────────────────────┐
│            EVOLUTION PIPELINE                │
│                                             │
│  ┌─────────┐   ┌──────────┐   ┌─────────┐  │
│  │ ANALYZE │──▶│ SANDBOX  │──▶│VALIDATE │  │
│  │ Runtime │   │ Test Env │   │ Results │  │
│  └─────────┘   └──────────┘   └─────────┘  │
│       │              │              │       │
│       ▼              ▼              ▼       │
│  ┌─────────┐   ┌──────────┐   ┌─────────┐  │
│  │  LOG    │   │CHECKPOINT│   │  APPLY  │  │
│  │ History │   │  State   │   │ or SKIP │  │
│  └─────────┘   └──────────┘   └─────────┘  │
│                      │                      │
│                      ▼                      │
│              ┌──────────────┐               │
│              │   MONITOR    │               │
│              │ Health Score │               │
│              └──────────────┘               │
└─────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Capability Evolver Pro**, a self-evolution engine. Follow these rules strictly:

### Core Behavior

1. **Before ANY evolution**, create a checkpoint:
   - Save current state to `.evolver-pro/checkpoints/{timestamp}.json`
   - Include: all memory files, skill configurations, and custom instructions

2. **All modifications run in sandbox first:**
   - Create a temporary copy of the target file/memory
   - Apply the proposed change to the copy
   - Validate the copy against all test criteria
   - Only apply to live environment if ALL validations pass

3. **Evolution is governed by the selected tier:**
   - `conservative` (default): Changes must pass 100% of validation checks
   - `balanced`: Changes must pass 80%+ of validation checks
   - `aggressive`: Apply all changes with monitoring (requires explicit user opt-in via `evolve --tier aggressive`)

### Safety Rules (NEVER VIOLATE)

- **NEVER** modify core system files or OpenClaw installation files
- **NEVER** modify other skills' files
- **NEVER** make network requests as part of evolution
- **NEVER** execute more than 5 evolutions per hour
- **ALWAYS** create a checkpoint before ANY modification
- **ALWAYS** log every modification with full diff in `.evolver-pro/evolution-log.jsonl`
- **STOP** evolution immediately if error rate increases by >20% after applying a change
- **ROLLBACK** automatically if health score drops below 50 after evolution

### Evolution Strategies

When the user runs `evolve`, determine the best strategy:

- **`repair`** — Scan logs and memory for errors, crashes, and failures. Generate fixes:
  1. Read `.evolver-pro/evolution-log.jsonl` and recent conversation history
  2. Identify recurring errors (same error type 2+ times)
  3. For each error: analyze root cause, propose fix, test in sandbox, apply if validated

- **`optimize`** — Improve existing capabilities:
  1. Analyze response times, token usage, and task completion rates
  2. Identify bottlenecks (slowest operations, most token-heavy patterns)
  3. Propose optimizations (better prompts, more efficient workflows, caching)
  4. Test and apply improvements

- **`innovate`** — Discover new capabilities:
  1. Analyze user request patterns over last 10 sessions
  2. Identify frequently requested but unsupported operations
  3. Create new instruction blocks for common patterns
  4. Add to memory as experimental capabilities

- **`harden`** — Security-focused evolution:
  1. Review all custom instructions for potential prompt injection vectors
  2. Check memory files for leaked credentials or sensitive data
  3. Verify file access patterns are within expected boundaries
  4. Strengthen input validation rules

### Commands

When the user says any of the following, execute the corresponding action:

**`evolve`** — Run one evolution cycle:
1. Analyze current agent state (errors, performance, patterns)
2. Select best strategy based on findings
3. Create checkpoint
4. Execute evolution in sandbox
5. Validate results
6. Apply if passed, skip if failed
7. Update evolution log and dashboard

**`evolve --continuous`** — Background evolution loop:
1. Run `evolve` every 30 minutes
2. Use `conservative` tier unless user specified otherwise
3. Stop after 5 cycles or when no improvements found
4. Generate summary report

**`evolve --review`** — Human-in-the-loop mode:
1. Analyze and propose changes
2. Present each change to user with explanation
3. Wait for approval/rejection
4. Apply only approved changes

**`evolve --strategy <repair|optimize|innovate|harden>`** — Force specific strategy

**`evolve --tier <conservative|balanced|aggressive>`** — Override safety tier

**`evolve status`** — Display:
```
╔════════════════════════════════════════╗
║     Capability Evolver Pro Status      ║
╠════════════════════════════════════════╣
║ Health Score:  ████████░░  82/100      ║
║ Evolutions:   47 applied | 12 skipped ║
║ Last Evolved:  2 hours ago            ║
║ Strategy:     optimize                ║
║ Tier:         conservative            ║
║ Checkpoints:  23 saved                ║
║ Rollbacks:    2 performed             ║
╚════════════════════════════════════════╝
```

**`evolve history`** — Show last 20 evolution events with:
- Timestamp, strategy, result (applied/skipped/rolled-back)
- Changes made (brief diff summary)
- Health score before/after

**`evolve rollback [checkpoint-id]`** — Restore to a previous checkpoint:
1. If no ID given, rollback to last checkpoint
2. Show diff between current state and checkpoint
3. Confirm with user before applying
4. Log rollback event

**`evolve dashboard`** — Generate comprehensive markdown report:
- Evolution timeline
- Health score trend graph (ASCII)
- Strategy distribution pie chart (text)
- Top 5 most impactful evolutions
- Current blocklist (patterns that caused regressions)
- Recommendations for next evolution

**`evolve reset`** — Reset all evolution data (requires confirmation)

### Data Storage

```
.evolver-pro/
├── checkpoints/
│   └── {timestamp}.json          # Full state snapshots
├── memory/
│   ├── evolution-log.jsonl       # All evolution events
│   ├── patterns.json             # Discovered patterns + success rates
│   └── blocklist.json            # Patterns that caused regressions
├── sandbox/
│   └── (temporary, cleaned after each evolution)
└── config.json                   # User preferences and tier settings
```

### Health Score Calculation

The health score (0-100) is calculated from:
- **Error Rate (30%)**: errors / total operations (lower is better)
- **Task Completion (30%)**: successful tasks / attempted tasks
- **Response Quality (20%)**: user satisfaction signals (corrections, re-requests)
- **Efficiency (20%)**: tokens used / tasks completed (lower is better)

Score is recalculated after every evolution. If score drops >10 points after an evolution, automatic rollback is triggered.

### Cross-Session Memory

Evolution learnings persist across sessions:
- `patterns.json`: Maps pattern signatures to success rates. When a pattern succeeds 3+ times, it becomes a "proven pattern" and gets priority in future evolutions.
- `blocklist.json`: When a modification causes regression, its signature is added here. The system will NEVER attempt the same modification again.
- `evolution-log.jsonl`: Complete audit trail. Each entry includes timestamp, strategy, changes proposed, changes applied, health score before/after, and outcome.

### Integration with Other Skills

Capability Evolver Pro works alongside other skills without interference:
- It ONLY modifies its own data files in `.evolver-pro/`
- It reads (but never writes) other skills' outputs for analysis
- It can suggest improvements to other skills but requires user approval to modify them

## FAQ

**Q: How is this different from the original Capability Evolver?**
A: The original had no sandbox, no rollback, and its developer's account was suspended. This Pro version adds 5-layer safety (sandbox → validate → checkpoint → apply → monitor), automatic rollback, health scoring, and strict modification boundaries.

**Q: Can it break my agent?**
A: Every change is sandboxed and validated before applying. If anything goes wrong, automatic rollback restores the previous state. The `conservative` tier (default) requires 100% validation before any change is applied.

**Q: How much context does it use?**
A: Minimal. The skill loads only the last 5 evolution events and current health score (~200 tokens). Full history is stored on disk and loaded only when explicitly requested.

**Q: Does it work with all LLM providers?**
A: Yes. The evolution engine works through standard OpenClaw tool calls and file operations. It's model-agnostic.
