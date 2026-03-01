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

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Safety](https://img.shields.io/badge/safety-5_layer-brightgreen)]()

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

```
> evolve

🔍 Analyzing agent state...
  - Error rate: 12% (3 errors in last 25 operations)
  - Recurring pattern: "file not found" errors in project scaffold
  - Strategy selected: repair

📸 Checkpoint created: chk-20260301-143022

🧪 Sandbox testing...
  - Proposed fix: Add existence check before file read operations
  - Running validation... ✓ 12/12 checks passed

✅ Evolution applied successfully
  Health Score: 78 → 84 (+6)
  Evolution #48 logged to evolution-log.jsonl
```

**`evolve --continuous`** — Background evolution loop:
1. Run `evolve` every 30 minutes
2. Use `conservative` tier unless user specified otherwise
3. Stop after 5 cycles or when no improvements found
4. Generate summary report

```
> evolve --continuous

⚡ Continuous evolution started (conservative tier, max 5 cycles)

[Cycle 1/5 — 14:30] Strategy: repair
  Fixed: file path validation pattern
  Health: 78 → 84 (+6) ✅

[Cycle 2/5 — 15:00] Strategy: optimize
  Improved: prompt caching for repeated queries
  Health: 84 → 87 (+3) ✅

[Cycle 3/5 — 15:30] Strategy: optimize
  No improvements found. Stopping early.

📊 Continuous Evolution Summary
  Cycles run: 3 / 5
  Evolutions applied: 2
  Evolutions skipped: 1
  Health Score: 78 → 87 (+9)
  Duration: 1h 0m
```

**`evolve --review`** — Human-in-the-loop mode:
1. Analyze and propose changes
2. Present each change to user with explanation
3. Wait for approval/rejection
4. Apply only approved changes

```
> evolve --review

🔍 Analyzing agent state...
  Found 3 potential improvements:

[1/3] Repair: Add retry logic for API timeout errors
  File: .evolver-pro/memory/patterns.json
  Impact: Reduces timeout failures by ~60%
  Risk: Low
  → Approve? (y/n): y
  ✅ Applied

[2/3] Optimize: Cache repeated file reads in current session
  File: .evolver-pro/memory/patterns.json
  Impact: ~15% fewer tokens per session
  Risk: Low
  → Approve? (y/n): y
  ✅ Applied

[3/3] Innovate: Add auto-format detection for unknown file types
  File: .evolver-pro/memory/patterns.json
  Impact: Handles 5 new file types
  Risk: Medium
  → Approve? (y/n): n
  ⏭ Skipped

Summary: 2 applied, 1 skipped | Health: 84 → 89
```

**`evolve --strategy <repair|optimize|innovate|harden>`** — Force specific strategy

```
> evolve --strategy harden

🛡 Forcing strategy: harden

📸 Checkpoint created: chk-20260301-160045

🔒 Security hardening scan:
  [1] Reviewing custom instructions for injection vectors... clean
  [2] Scanning memory files for leaked credentials... clean
  [3] Checking file access patterns... 2 issues found
      - Pattern reads outside expected directory scope
      - Unbounded wildcard in file search
  [4] Strengthening input validation rules... 2 rules added

✅ Harden evolution applied
  Health Score: 87 → 89 (+2)
  Security improvements: 2 access rules tightened, 2 validations added
```

**`evolve --tier <conservative|balanced|aggressive>`** — Override safety tier

```
> evolve --tier balanced

⚙ Safety tier set to: balanced (80%+ validation threshold)

🔍 Analyzing... Strategy selected: optimize
📸 Checkpoint created: chk-20260301-161500

🧪 Sandbox testing...
  - Validation: 9/11 checks passed (82%) — meets balanced threshold

✅ Evolution applied (balanced tier)
  Health Score: 89 → 91 (+2)
  Note: 2 non-critical validations were skipped under balanced tier
```

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

```
> evolve history

Evolution History (last 20 events)
──────────────────────────────────────────────────────────
#48  2026-03-01 14:30  repair     APPLIED    78→84 (+6)
     Fixed file path validation pattern
#47  2026-02-28 22:15  optimize   APPLIED    75→78 (+3)
     Reduced token usage in prompt templates
#46  2026-02-28 20:00  innovate   SKIPPED    75→75 (0)
     Proposed auto-translate — failed validation (2/12)
#45  2026-02-27 16:45  harden     APPLIED    72→75 (+3)
     Tightened file access scope rules
#44  2026-02-27 10:20  repair     ROLLED-BACK 74→68→74
     Fix caused regression in task completion rate
...
──────────────────────────────────────────────────────────
Showing 5 of 48 events. Total: 39 applied, 7 skipped, 2 rolled-back
```

**`evolve rollback [checkpoint-id]`** — Restore to a previous checkpoint:
1. If no ID given, rollback to last checkpoint
2. Show diff between current state and checkpoint
3. Confirm with user before applying
4. Log rollback event

```
> evolve rollback chk-20260228-2215

⏪ Rollback target: chk-20260228-2215 (2026-02-28 22:15)

Diff (current → checkpoint):
  - patterns.json: 3 entries removed (added after checkpoint)
  - config.json: tier changed back to "conservative"
  - evolution-log.jsonl: 3 entries will be marked as rolled-back

⚠ This will undo evolutions #46, #47, #48.
  Health score will revert from 84 to 75.
  → Confirm rollback? (y/n): y

✅ Rolled back to chk-20260228-2215
  Health Score: 84 → 75
  3 evolutions undone
  Rollback event logged (#49)
```

**`evolve dashboard`** — Generate comprehensive markdown report:
- Evolution timeline
- Health score trend graph (ASCII)
- Strategy distribution pie chart (text)
- Top 5 most impactful evolutions
- Current blocklist (patterns that caused regressions)
- Recommendations for next evolution

```
> evolve dashboard

╔══════════════════════════════════════════════════╗
║         Capability Evolver Pro Dashboard         ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║ Health Score Trend (last 30 days):                ║
║  100│                                            ║
║   90│                          ╭──●              ║
║   80│               ╭───●────╯                   ║
║   70│        ╭─●───╯                             ║
║   60│  ●────╯                                    ║
║   50│                                            ║
║     └──────────────────────────                  ║
║      Feb 01  Feb 08  Feb 15  Feb 22  Mar 01      ║
║                                                  ║
║ Strategy Distribution:                           ║
║   repair:   18 (38%) ████████████░░░░░░░░░       ║
║   optimize: 15 (31%) █████████░░░░░░░░░░░       ║
║   innovate:  9 (19%) ██████░░░░░░░░░░░░░░       ║
║   harden:    6 (12%) ████░░░░░░░░░░░░░░░░       ║
║                                                  ║
║ Top 5 Most Impactful Evolutions:                 ║
║   1. #32 repair: +12 health (error handler fix)  ║
║   2. #41 optimize: +8 health (prompt caching)    ║
║   3. #48 repair: +6 health (path validation)     ║
║   4. #38 harden: +5 health (access rules)        ║
║   5. #45 harden: +3 health (scope tightening)    ║
║                                                  ║
║ Blocklist (3 patterns):                          ║
║   - Auto-translate modification (regression)     ║
║   - Recursive file scan expansion (timeout)      ║
║   - Dynamic prompt injection (security)          ║
║                                                  ║
║ Recommendations:                                 ║
║   → Run "optimize" — 3 bottlenecks detected      ║
║   → Consider "innovate" for new file format       ║
╚══════════════════════════════════════════════════╝
```

**`evolve reset`** — Reset all evolution data (requires confirmation)

```
> evolve reset

⚠ WARNING: This will permanently delete ALL evolution data:
  - 23 checkpoints (1.2 MB)
  - 48 evolution log entries
  - 15 discovered patterns
  - 3 blocklist entries
  - Health score history

This action cannot be undone.
→ Type "RESET" to confirm: RESET

🗑 All evolution data deleted.
  .evolver-pro/ directory cleared.
  Default config.json recreated.
  Health score reset to 50 (baseline).
  Ready for fresh evolution cycle.
```

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

## Comparison with Alternatives

| Feature | Manual Config Tuning | Basic Self-Tune | AutoGPT Evolve | **Capability Evolver Pro** |
|---------|---------------------|-----------------|----------------|---------------------------|
| Sandbox testing | No | No | Partial | **Full sandbox + validation** |
| Automatic rollback | No | No | No | **Yes (health-score triggered)** |
| Safety tiers | N/A | N/A | None | **3 tiers (conservative/balanced/aggressive)** |
| Health scoring | No | No | No | **Composite 0-100 score** |
| Evolution strategies | Manual | Single (tune) | Generic | **4 specialized (repair/optimize/innovate/harden)** |
| Checkpoints | Manual backup | No | No | **Automatic per-evolution snapshots** |
| Rate limiting | N/A | No | No | **5/hour cap with queueing** |
| Blocklist (regression prevention) | No | No | No | **Automatic pattern blocklist** |
| Human-in-the-loop mode | Always manual | No | No | **Optional review mode** |
| Cross-session memory | No | Session only | Session only | **Persistent patterns + logs** |
| Dashboard & analytics | No | No | Basic logs | **Full ASCII dashboard + history** |
| Cost per cycle | High (manual time) | ~500 tokens | ~2000-5000 tokens | **~500-2000 tokens** |

## FAQ

**Q: How is this different from the original Capability Evolver?**
A: The original had no sandbox, no rollback, and its developer's account was suspended. This Pro version adds 5-layer safety (sandbox → validate → checkpoint → apply → monitor), automatic rollback, health scoring, and strict modification boundaries.

**Q: Can it break my agent?**
A: Every change is sandboxed and validated before applying. If anything goes wrong, automatic rollback restores the previous state. The `conservative` tier (default) requires 100% validation before any change is applied.

**Q: How much context does it use?**
A: Minimal. The skill loads only the last 5 evolution events and current health score (~200 tokens). Full history is stored on disk and loaded only when explicitly requested.

**Q: Does it work with all LLM providers?**
A: Yes. The evolution engine works through standard OpenClaw tool calls and file operations. It's model-agnostic.

**Q: How much does it cost in tokens per evolution cycle?**
A: A single evolution cycle typically consumes 500-2000 tokens depending on the strategy. `repair` and `optimize` are lighter (~500-800 tokens) since they analyze structured logs. `innovate` is heavier (~1500-2000 tokens) as it reviews broader session history. The `--continuous` mode caps at 5 cycles, so worst case is ~10,000 tokens per continuous run.

**Q: What happens if I hit the 5-evolutions-per-hour rate limit?**
A: The system will log the attempt and queue the evolution for the next available window. You will see a message: "Rate limit reached. Next evolution available at [time]." No data is lost — the analysis is saved and reused when the limit resets.

**Q: Can I use Capability Evolver Pro alongside other self-improvement skills?**
A: Yes, but with boundaries. Capability Evolver Pro only modifies files within its own `.evolver-pro/` directory. It reads other skills' outputs for analysis but never writes to them without explicit user approval via `evolve --review`. Avoid running two self-modification skills simultaneously to prevent conflicting changes.

**Q: Does it work offline or require network access?**
A: Capability Evolver Pro works entirely offline. It explicitly prohibits network requests as part of its safety rules. All evolution operations use local file reads, writes, and standard tool calls. No external API calls are made.

**Q: How do I customize the health score weights?**
A: Edit `.evolver-pro/config.json` and adjust the `health_weights` object. Default weights are `error_rate: 0.3`, `task_completion: 0.3`, `response_quality: 0.2`, `efficiency: 0.2`. The values must sum to 1.0. Changes take effect on the next evolution cycle.

**Q: Is my data private? Does evolution data leave my machine?**
A: All evolution data stays local in the `.evolver-pro/` directory. No telemetry, no cloud sync, no external reporting. The safety rules explicitly forbid network requests during evolution. Your checkpoint snapshots, logs, and patterns remain entirely on your filesystem.

## Error Handling

| Error | Cause | Agent Action |
|-------|-------|-------------|
| Checkpoint creation fails | Disk full or permissions issue on `.evolver-pro/checkpoints/` | Abort evolution immediately. Report error with path and suggest checking disk space or directory permissions. Never proceed without a checkpoint. |
| Sandbox validation timeout | Evolution strategy takes longer than 60 seconds to validate | Terminate sandbox, log the timeout in `evolution-log.jsonl`, skip this evolution. Suggest running with a simpler strategy or smaller scope. |
| Health score drop >10 points | Applied evolution caused regression | Trigger automatic rollback to the most recent checkpoint. Log the regression pattern in `blocklist.json` to prevent future attempts. Notify user of rollback. |
| Rate limit exceeded (5/hour) | Too many evolution requests in one hour | Queue the evolution request. Display time until next available slot. Do not retry automatically — wait for the cooldown window. |
| Conflicting checkpoint state | Checkpoint file is corrupted or incomplete | Attempt to load the previous checkpoint. If no valid checkpoint exists, refuse to evolve and prompt user to run `evolve reset` or manually verify `.evolver-pro/checkpoints/`. |
| Evolution log parse error | `evolution-log.jsonl` contains malformed JSON entries | Skip corrupted entries, log a warning, and continue with valid entries. Suggest running `evolve dashboard` to identify and clean corrupted records. |
| Blocklist match | Proposed evolution matches a pattern in `blocklist.json` | Skip the evolution silently, log the skip reason, and move to the next candidate. Never attempt a blocklisted modification. |
| File permission denied | Agent lacks read/write access to `.evolver-pro/` directory | Report the specific file path and required permission. Do not attempt workarounds or alternative paths. Suggest `chmod` or ownership fix. |
| Core file modification attempt | Evolution strategy targets system files or other skills' files | Hard block. Log the violation attempt. Do not proceed. This is a safety rule violation — alert the user and recommend reviewing the evolution strategy. |
| Config file missing | `.evolver-pro/config.json` not found on first run | Create default config with `conservative` tier, default health weights, and auto-learn enabled. Log the initialization event. |
