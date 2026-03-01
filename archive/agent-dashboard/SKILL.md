---
name: "Agent Dashboard"
description: "Real-time agent monitoring with health scoring, cost tracking, and web dashboard"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - monitoring
  - dashboard
  - analytics
  - cost-tracking
  - observability
---

```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   📊 A G E N T  D A S H B O A R D 📊   │
    │                                          │
    │   ┌──────────────────────────────┐       │
    │   │ Health: ████████░░  82/100   │       │
    │   │ Tasks:  47 ✓  3 ✗  2 ●      │       │
    │   │ Cost:   $4.23 today          │       │
    │   │ ─────────────────────────    │       │
    │   │  📈 ╱╲  ╱╲  ╱╲              │       │
    │   │    ╱  ╲╱  ╲╱  ╲ trend       │       │
    │   └──────────────────────────────┘       │
    │                                          │
    │    "See everything. Miss nothing."       │
    ╰──────────────────────────────────────────╯
```

# Agent Dashboard

`📊 Real-Time` `💰 Cost Tracking` `🔔 Alerts` `🌐 Web Export` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Commands](https://img.shields.io/badge/Commands-12+-orange)]()

> Real-time monitoring and analytics for OpenClaw agents. Track performance, costs, task completion, and skill health with terminal and web dashboards.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `monitoring` `analytics` `dashboard` `performance` `cost-tracking`

---

## Overview

Agent Dashboard gives you full visibility into your OpenClaw agent's operations. Track health scores, task metrics, API costs, skill performance, and session history — all in beautiful terminal displays or exportable web dashboards.

```
┌─────────────────────────────────────────────┐
│       AGENT DASHBOARD ARCHITECTURE          │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ COLLECT │─▶│ ANALYZE  │─▶│ VISUALIZE │  │
│  │ Metrics │  │ Trends   │  │ Terminal  │  │
│  └─────────┘  └──────────┘  └───────────┘  │
│       │                          │          │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │  STORE  │  │  ALERT   │  │  EXPORT   │  │
│  │  JSONL  │  │ Threshld │  │ HTML/JSON │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Agent Dashboard**. Track and report on agent performance when requested.

### Metric Collection

After every significant action, log metrics to `.agent-dashboard/metrics/`:

**Health Metrics** (`health.jsonl`):
```json
{
  "timestamp": "2026-03-01T14:30:00Z",
  "session_id": "sess-abc123",
  "response_time_ms": 2300,
  "tokens_input": 4500,
  "tokens_output": 1200,
  "tool_calls": 3,
  "errors": 0,
  "task_completed": true
}
```

**Cost Tracking** (`costs.jsonl`):
```json
{
  "timestamp": "2026-03-01T14:30:00Z",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "tokens_input": 4500,
  "tokens_output": 1200,
  "cost_usd": 0.0234
}
```

**Skill Usage** (`skills.jsonl`):
```json
{
  "timestamp": "2026-03-01T14:30:00Z",
  "skill": "summarize-pro",
  "command": "summarize",
  "response_time_ms": 2300,
  "success": true,
  "tokens_used": 5700
}
```

### Health Score Calculation (0-100)

```
health = (
  error_rate_score × 0.30 +
  task_completion_score × 0.30 +
  response_quality_score × 0.20 +
  efficiency_score × 0.20
)

where:
  error_rate_score = max(0, 100 - (errors/total × 200))
  task_completion_score = (completed/attempted) × 100
  response_quality_score = 100 - (corrections/responses × 200)
  efficiency_score = max(0, 100 - (avg_tokens/1000 × 10))
```

### Commands

**`dashboard`** — Terminal dashboard:
```
╔═══════════════════════════════════════════════════╗
║              Agent Dashboard v1.0                 ║
╠═══════════════════════════════════════════════════╣
║ Health:   ████████░░  82/100    Uptime: 99.2%     ║
║ Tasks:    47 completed │ 3 failed │ 2 active      ║
║ Cost:     $4.23 today  │ $28.91 this week         ║
║ Tokens:   1.2M input   │ 340K output              ║
╠═══════════════════════════════════════════════════╣
║ Skill Performance        │ Calls │ Errs │ Avg ms  ║
║ summarize-pro            │  23   │  0   │ 2,300   ║
║ fx-trader-pro            │  18   │  1   │ 4,700   ║
║ brain-trust              │  12   │  0   │ 8,100   ║
║ humanize-ai-pro          │   8   │  0   │ 1,900   ║
║ skill-guardian            │   5   │  0   │ 12,400  ║
╠═══════════════════════════════════════════════════╣
║ Cost Breakdown (Today)                            ║
║ Anthropic:  $2.89  ██████████████░░░  68%         ║
║ Google:     $0.84  ████░░░░░░░░░░░░░  20%         ║
║ OpenAI:     $0.50  ███░░░░░░░░░░░░░░  12%         ║
╠═══════════════════════════════════════════════════╣
║ Recent Activity                                   ║
║ 14:32 ✅ Analyzed EUR/USD M15                     ║
║ 14:28 ✅ Generated summary for report.pdf         ║
║ 14:25 ❌ API timeout on Gemini (retried → ok)     ║
║ 14:20 ✅ Humanized blog post (score 73%→12%)      ║
║ 14:15 ✅ Brain Trust standup completed             ║
╚═══════════════════════════════════════════════════╝
```

**`dashboard health`** — Detailed health breakdown

Output:
```
╔══════════════════════════════════════════════════════╗
║           Agent Health — Detailed Breakdown           ║
╠══════════════════════════════════════════════════════╣
║  Overall Health Score: 82/100                        ║
║  ████████████████░░░░ 82%                            ║
║                                                      ║
║  Component Scores:                                   ║
║  ──────────────────────────────────────────────       ║
║  Error Rate:         92/100  (2.1% error rate)       ║
║    Weight: 30% │ Contribution: 27.6                  ║
║                                                      ║
║  Task Completion:    88/100  (47/52 completed)       ║
║    Weight: 30% │ Contribution: 26.4                  ║
║                                                      ║
║  Response Quality:   75/100  (5 corrections in 52)   ║
║    Weight: 20% │ Contribution: 15.0                  ║
║                                                      ║
║  Efficiency:         65/100  (avg 3,500 tokens/task) ║
║    Weight: 20% │ Contribution: 13.0                  ║
║                                                      ║
║  Trend: ▲ +4 points from yesterday (78 → 82)        ║
║  Recommendation: Response quality can improve —      ║
║    review common correction patterns.                ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard tasks [--period day|week|month]`** — Task analytics:
- Completed, failed, in-progress counts
- Average completion time
- Success rate trend
- Most common task types

Output:
```
╔══════════════════════════════════════════════════════╗
║          Task Analytics — This Week                  ║
╠══════════════════════════════════════════════════════╣
║  Completed: 47  │  Failed: 3  │  Active: 2           ║
║  Success Rate: 94.0%  (▲ +2.1% from last week)      ║
║  Avg Completion Time: 45 seconds                     ║
║                                                      ║
║  Daily Breakdown:                                    ║
║  Mon: ████████████ 12 tasks (100% success)           ║
║  Tue: ██████████░ 10 tasks (90% success)             ║
║  Wed: ████████░░ 8 tasks (87.5% success)             ║
║  Thu: ███████████ 11 tasks (100% success)            ║
║  Fri: █████████░ 9 tasks (88.9% success)             ║
║  Sat: ██░░░░░░░░ 2 tasks (100% success)              ║
║                                                      ║
║  Most Common Task Types:                             ║
║  1. Code analysis/editing:     18 (34%)              ║
║  2. FX trading operations:     12 (23%)              ║
║  3. Content generation:         8 (15%)              ║
║  4. File search/navigation:     7 (13%)              ║
║  5. Other:                      7 (13%)              ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard skills`** — Skill performance ranking:
- Most used skills
- Fastest/slowest skills
- Error rates per skill
- Token consumption per skill
- Unused skills (installed but never called)

Output:
```
╔══════════════════════════════════════════════════════════╗
║            Skill Performance Ranking                     ║
╠══════════════════════════════════════════════════════════╣
║  Skill              │ Calls │ Errs │ Avg ms │ Tokens    ║
║  ───────────────────┼───────┼──────┼────────┼────────── ║
║  summarize-pro      │  23   │  0   │ 2,300  │ 131,100   ║
║  fx-trader-pro      │  18   │  1   │ 4,700  │  84,600   ║
║  brain-trust        │  12   │  0   │ 8,100  │  97,200   ║
║  humanize-ai-pro    │   8   │  0   │ 1,900  │  45,600   ║
║  skill-guardian     │   5   │  0   │ 12,400 │  62,000   ║
║  context-slim       │   3   │  0   │  800   │   2,400   ║
║  agent-dashboard    │   2   │  0   │  200   │   1,200   ║
║                                                          ║
║  Fastest: context-slim (800ms avg)                       ║
║  Slowest: skill-guardian (12,400ms avg)                   ║
║  Most tokens: summarize-pro (131,100 total)              ║
║                                                          ║
║  Unused Skills (installed but never called):             ║
║  • byterover (installed 14 days ago)                     ║
║  • capability-evolver (installed 21 days ago)            ║
╚══════════════════════════════════════════════════════════╝
```

**`dashboard cost [--period day|week|month]`** — Cost analytics:
- Cost by provider (Anthropic, OpenAI, Google)
- Cost by skill
- Cost per task
- Daily/weekly/monthly trends
- Projected monthly cost

Output:
```
╔══════════════════════════════════════════════════════╗
║          Cost Analytics — This Month                 ║
╠══════════════════════════════════════════════════════╣
║  Total:    $28.91 (1 day into March)                 ║
║  Projected: $867.30 /month (at current rate)        ║
║                                                      ║
║  By Provider:                                        ║
║  Anthropic:  $19.84  ██████████████░░  69%           ║
║  Google:      $5.78  █████░░░░░░░░░░░  20%           ║
║  OpenAI:      $3.29  ███░░░░░░░░░░░░░  11%           ║
║                                                      ║
║  By Skill:                                           ║
║  brain-trust:     $9.72  (34%)                       ║
║  summarize-pro:   $6.55  (23%)                       ║
║  fx-trader-pro:   $5.20  (18%)                       ║
║  skill-guardian:  $3.89  (13%)                       ║
║  other:           $3.55  (12%)                       ║
║                                                      ║
║  Cost per Task: $0.56 avg                            ║
║  Cheapest task:  $0.02 (file search)                 ║
║  Most expensive: $4.82 (full security audit)         ║
║                                                      ║
║  Daily Trend:                                        ║
║  Feb 24: $3.21 │ Feb 25: $4.89 │ Feb 26: $3.78     ║
║  Feb 27: $5.12 │ Feb 28: $4.23 │ Mar 01: $4.23     ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard alerts`** — Show active alerts

Output:
```
╔══════════════════════════════════════════════════════╗
║            Active Alerts                             ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ⚠️ [Mar 01 14:25] Daily cost ($5.23) exceeded       ║
║     threshold ($5.00). Current: $5.23                ║
║     Triggered by: brain-trust meeting ($1.82)        ║
║                                                      ║
║  ⚠️ [Mar 01 14:25] fx-trader-pro error count: 3      ║
║     threshold: 3. Last error: API timeout on         ║
║     candle fetch for GBP_NZD                         ║
║                                                      ║
║  Resolved Today:                                     ║
║  ✅ [Mar 01 10:15] Health score dropped to 58        ║
║     Recovered to 82 after 2 successful tasks         ║
║                                                      ║
║  Alert Configuration:                                ║
║  error-rate: 10% │ daily-cost: $5 │ health: 60      ║
║  monthly-cost: $50 │ fx-trader-pro errors: 3         ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard alert set <type> <threshold>`** — Configure alerts:
- `error-rate 10` -- Alert if error rate exceeds 10%
- `daily-cost 5` -- Alert if daily cost exceeds $5
- `monthly-cost 50` -- Alert if monthly cost exceeds $50
- `skill-error <skill> 3` -- Alert if skill fails 3+ times
- `health 60` -- Alert if health score drops below 60

Output:
```
✅ Alert configured: daily-cost → $8.00

  Current Alert Thresholds:
  ─────────────────────────────────────────
  error-rate:       10%     (current: 2.1%)    ✅
  daily-cost:       $8.00   (current: $5.23)   ✅
  monthly-cost:     $50.00  (current: $28.91)  ✅
  health:           60      (current: 82)      ✅
  fx-trader-pro:    3 errors (current: 1)      ✅

  Saved to: .agent-dashboard/alerts/config.json
```

**`dashboard report [daily|weekly|monthly]`** — Generate markdown report:
- Summary statistics
- Trends and comparisons
- Top achievements
- Issues and recommendations
- Cost forecast

Output:
```
📄 Weekly Report generated: .agent-dashboard/reports/2026-03-01.md

  # Agent Dashboard Weekly Report — 2026-03-01

  ## Summary
  - Tasks completed: 47 (94% success rate)
  - Total cost: $28.91 ($4.13/day avg)
  - Health score: 82 (▲ +4 from last week)
  - Most active skill: summarize-pro (23 calls)
  - API calls: 1,247 (Anthropic: 842, Google: 312, OpenAI: 93)

  ## Highlights
  - Zero errors on summarize-pro (23 consecutive successes)
  - Health score trending upward 3 days straight
  - Cost per task decreased 12% from last week

  ## Issues
  - fx-trader-pro: 1 API timeout (auto-recovered)
  - Response quality dip on Wednesday (3 corrections)

  ## Cost Forecast
  - Projected March total: $124.00 (within $150 budget)

  Report saved to .agent-dashboard/reports/2026-03-01.md (5.1 KB)
```

**`dashboard --web`** — Generate HTML dashboard:
- Self-contained HTML file with inline CSS/JS
- Interactive charts (line graphs, pie charts)
- Dark mode support
- Mobile responsive
- Auto-refresh every 60 seconds if served locally

Output:
```
╔══════════════════════════════════════════════════════╗
║         Web Dashboard Generated                      ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Output: .agent-dashboard/web/dashboard.html         ║
║  Size:   142 KB (self-contained, no dependencies)    ║
║                                                      ║
║  Includes:                                           ║
║  ✅ Health score gauge with trend chart              ║
║  ✅ Task completion line graph (7 days)              ║
║  ✅ Cost breakdown pie chart by provider             ║
║  ✅ Skill performance table (sortable)               ║
║  ✅ Recent activity timeline                         ║
║  ✅ Alert history panel                              ║
║  ✅ Dark mode toggle                                 ║
║  ✅ Mobile responsive layout                         ║
║                                                      ║
║  To view: open .agent-dashboard/web/dashboard.html   ║
║  To serve: python3 -m http.server 8080               ║
║           (auto-refresh every 60s)                    ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard replay [--session <id>]`** — Session replay:
- Timeline of all actions in a session
- Filter by skill, outcome, or time range
- Debug failed operations

Output:
```
╔══════════════════════════════════════════════════════╗
║       Session Replay: sess-abc123                    ║
║       Started: 2026-03-01 14:00 UTC                  ║
║       Duration: 47 minutes                           ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  14:00:12  [START] Session initialized               ║
║  14:01:30  [fx-trader-pro] fx status                 ║
║            ✅ 2,300ms │ 4,500 in / 1,200 out         ║
║  14:05:45  [fx-trader-pro] fx scan                   ║
║            ✅ 12,400ms │ 28,000 in / 8,400 out       ║
║  14:08:22  [fx-trader-pro] fx signal GBP_JPY         ║
║            ✅ 4,700ms │ 8,200 in / 2,100 out         ║
║  14:12:00  [fx-trader-pro] fx trade GBP_JPY buy      ║
║            ✅ 3,100ms │ 6,400 in / 1,800 out         ║
║  14:20:10  [brain-trust] bt meeting standup           ║
║            ✅ 8,100ms │ 12,000 in / 6,200 out        ║
║  14:25:33  [summarize-pro] summarize report.pdf       ║
║            ❌ TIMEOUT │ Retried → ✅ 4,200ms          ║
║  14:32:15  [context-slim] slim optimize               ║
║            ✅ 800ms │ 2,400 in / 600 out              ║
║  14:47:00  [END] Session complete                    ║
║                                                      ║
║  Session totals: 7 actions │ 1 error │ $4.23 cost    ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard export <json|csv|html>`** — Export all data

Output:
```
╔══════════════════════════════════════════════════════╗
║         Data Export — JSON                           ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Exporting all metric data...                        ║
║                                                      ║
║  Files generated:                                    ║
║  ✅ health-metrics.json      (1,247 entries, 2.1 MB) ║
║  ✅ task-records.json        (  312 entries, 840 KB) ║
║  ✅ skill-usage.json         (  189 entries, 420 KB) ║
║  ✅ cost-tracking.json       (  892 entries, 1.4 MB) ║
║  ✅ session-data.json        (   42 sessions, 3.2 MB)║
║  ✅ alert-history.json       (   28 entries, 64 KB)  ║
║                                                      ║
║  Total: 6 files, 8.0 MB                             ║
║  Output: .agent-dashboard/exports/2026-03-01/        ║
║                                                      ║
║  Format: JSON (UTF-8, pretty-printed)                ║
║  Compatible with: jq, Elasticsearch, Grafana, etc.   ║
╚══════════════════════════════════════════════════════╝
```

**`dashboard reset`** — Clear all tracking data (confirmation required)

Output:
```
╔══════════════════════════════════════════════════════╗
║         Dashboard Reset                              ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ⚠️ This will permanently delete all tracking data.  ║
║                                                      ║
║  Data to be cleared:                                 ║
║    Health metrics:    1,247 entries (2.1 MB)          ║
║    Task records:        312 entries (840 KB)          ║
║    Skill usage:         189 entries (420 KB)          ║
║    Cost tracking:       892 entries (1.4 MB)          ║
║    Session replays:      42 sessions (3.2 MB)        ║
║    Alert history:        28 entries (64 KB)           ║
║                                                      ║
║  Tip: Run `dashboard export json` first to backup.   ║
║                                                      ║
║  Confirm reset? (yes/no): yes                        ║
║                                                      ║
║  ✅ All tracking data cleared.                        ║
║  Alert configuration preserved.                      ║
║  Health score reset to 100 (fresh start).            ║
╚══════════════════════════════════════════════════════╝
```

### Token Pricing (built-in)

```json
{
  "anthropic": {
    "claude-opus-4-20250514": {"input": 15.0, "output": 75.0},
    "claude-sonnet-4-20250514": {"input": 3.0, "output": 15.0},
    "claude-haiku-3-5-20241022": {"input": 0.80, "output": 4.0}
  },
  "openai": {
    "gpt-4o": {"input": 2.5, "output": 10.0},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60}
  },
  "google": {
    "gemini-2.5-pro": {"input": 1.25, "output": 10.0},
    "gemini-2.5-flash": {"input": 0.15, "output": 0.60}
  }
}
```
Prices per 1M tokens in USD. Updated periodically.

### Data Storage

```
.agent-dashboard/
├── metrics/
│   ├── health.jsonl      # Health metrics per action
│   ├── tasks.jsonl       # Task records
│   ├── skills.jsonl      # Skill usage records
│   └── costs.jsonl       # Cost tracking
├── alerts/
│   └── config.json       # Alert thresholds
├── reports/
│   └── {date}.md         # Generated reports
├── sessions/
│   └── {session-id}.jsonl # Session replay data
└── config.json            # Dashboard settings
```

### Automatic Alerts

When enabled, alerts fire when thresholds are crossed:
- Notification appears in agent response
- Alert logged to `.agent-dashboard/alerts/history.jsonl`
- Daily summary includes active alerts

```
⚠️ ALERT: Daily cost ($5.23) exceeded threshold ($5.00)
⚠️ ALERT: Health score dropped to 58 (threshold: 60)
```

## Error Handling

Agent Dashboard handles metric collection, export, and notification failures gracefully to ensure monitoring continuity.

### Metric Collection Failure

| Scenario | Handling |
|---|---|
| **Unable to log health metrics after an action** | Write to a local buffer (`/tmp/agent-dashboard-buffer.jsonl`). Retry writing to `.agent-dashboard/metrics/health.jsonl` on next successful action. Never block the user's operation to log metrics. |
| **Metrics file locked by another process** | Wait up to 2 seconds for lock release. If still locked, buffer the entry and append on next write. Use file-level locking to prevent corruption. |
| **Disk full — cannot write metrics** | Switch to in-memory-only mode. Display a warning: "Dashboard metrics storage full. Monitoring continues in memory only." Suggest `dashboard reset` or clearing old data. |
| **Token/cost data unavailable from provider** | Record the action with `cost_usd: null` and `tokens: null`. Mark the entry as "incomplete" for later reconciliation. Dashboard totals exclude null entries with a footnote. |
| **Skill usage tracking fails for unknown skill** | Log the event with the raw skill name. Create a new entry in skills.jsonl. Do not discard usage data for unrecognized skills. |

### Export Errors

| Scenario | Handling |
|---|---|
| **HTML export fails (template rendering error)** | Fall back to plain JSON export. Display the raw data with a note that HTML generation failed. Log the template error for debugging. |
| **CSV export with special characters in data** | Escape all fields with double-quote wrapping. Handle Unicode, commas, and newlines in field values. Use UTF-8 BOM for Excel compatibility. |
| **Export file too large (>50MB)** | Split into multiple files by date range (monthly chunks). Alert user with file count and total size. |
| **Web dashboard generation fails** | Provide the static terminal dashboard as fallback. Log the error. Common cause: corrupted metrics data — suggest `dashboard reset` with date range to clean specific periods. |

### Notification / Alert Failures

| Scenario | Handling |
|---|---|
| **Alert threshold crossed but notification cannot be displayed** | Buffer the alert in `.agent-dashboard/alerts/pending.jsonl`. Display all pending alerts at the start of the next agent interaction. |
| **Alert config file corrupted** | Fall back to default thresholds (error-rate: 10%, daily-cost: $10, health: 50). Warn user that custom alert settings need reconfiguration. |
| **Alert storm (>10 alerts in 1 minute)** | Consolidate into a single summary alert: "Multiple alerts triggered (12 events in last minute). Run `dashboard alerts` for details." Prevents alert fatigue. |
| **False positive alert (metric spike then recovery)** | Alerts fire on threshold crossing, not sustained state. Include "current value" and "threshold" in every alert so the user can assess. Historical alerts are always available in `alerts/history.jsonl`. |

### Session Replay Errors

| Scenario | Handling |
|---|---|
| **Session data incomplete (agent crashed mid-session)** | Display available data up to the last recorded event. Mark the session as "incomplete" in the replay timeline. |
| **Session ID not found** | List available session IDs with dates. Suggest closest match if the ID looks like a typo. |

### Recovery

- All metric files use append-only JSONL format for crash resilience (partial writes only lose the last entry, not the entire file).
- Run `dashboard export json` periodically to create backups.
- `dashboard reset --before <date>` clears old data while preserving recent metrics.

## Agent Dashboard vs Other Monitoring Tools

| Feature | Agent Dashboard | Manual Logging (print/console) | Console Output (Default) | Langfuse | Weights & Biases |
|---|---|---|---|---|---|
| **Setup** | Zero config — installs with skill | None needed | None needed | Account + SDK integration | Account + SDK integration |
| **Health Score** | Composite 0-100 score (error rate, completion, quality, efficiency) | None | None | Trace-level scoring | Custom metrics only |
| **Cost Tracking** | Automatic per-provider, per-model, per-skill breakdown | Manual calculation | None | Automatic with SDK | Custom logging required |
| **Token Tracking** | Automatic input/output per action | Manual if coded | None | Automatic with SDK | Custom logging required |
| **Skill-Level Metrics** | Per-skill calls, errors, avg response time, token usage | Not practical manually | None | Per-trace breakdown | Custom tagging |
| **Alerting** | Built-in threshold alerts (cost, health, error rate) | None | None | Custom alerts (paid plan) | Custom alerts |
| **Terminal Dashboard** | Rich ASCII dashboard with real-time data | N/A | Raw text only | Web UI only | Web UI only |
| **Web Dashboard** | Self-contained HTML export (offline capable) | N/A | N/A | Cloud-hosted web UI | Cloud-hosted web UI |
| **Session Replay** | Full action timeline per session | Not feasible manually | Scroll through terminal | Trace replay (paid plan) | Not available |
| **Data Storage** | Local JSONL files (private, no cloud dependency) | Scattered log files | Ephemeral (lost on close) | Cloud-hosted (their servers) | Cloud-hosted (their servers) |
| **Privacy** | 100% local — no data leaves your machine | Local | Local | Data sent to Langfuse cloud | Data sent to W&B cloud |
| **Cost of Tool** | Free (MIT license) | Free | Free | Free tier limited / $59+/mo | Free tier limited / $50+/mo |
| **OpenClaw Integration** | Native — tracks all OpenClaw skills automatically | None | None | Requires custom integration | Requires custom integration |

## FAQ

**Q: How much does Agent Dashboard cost?**
A: The skill itself is completely free (MIT license). It tracks your existing API costs but does not add any additional API calls or fees. All data is stored locally.

**Q: What data does Agent Dashboard collect?**
A: It tracks response times, token counts (input/output), tool calls, error counts, task completion status, and API costs. It estimates costs based on built-in pricing tables for major providers (Anthropic, OpenAI, Google). No personal data or conversation content is stored — only operational metrics.

**Q: How long is metric data retained?**
A: Indefinitely by default. Data is stored in JSONL files that grow over time. Use `dashboard reset --before <date>` to clear old data, or `dashboard export` to archive before clearing. For long-running agents, consider monthly exports and resets to keep file sizes manageable.

**Q: Does it affect agent performance?**
A: Negligible impact. Metric logging is append-only to JSONL files (microseconds per write). The dashboard display itself uses only data already collected — no additional API calls are made. Health score calculation is lightweight arithmetic.

**Q: Can I set up alerts for specific skills?**
A: Yes. Use `dashboard alert set skill-error <skill-name> <threshold>` to alert when a specific skill exceeds a failure count. You can also set global alerts for error rate, daily cost, monthly cost, and health score.

**Q: How do I integrate with external monitoring tools?**
A: Use `dashboard export json` to get all metrics as JSON. This can be piped to any external tool, ingested by Grafana, or processed by custom scripts. The JSONL format is compatible with standard log processing pipelines (jq, Elasticsearch, etc.).

**Q: Is my data sent to any cloud service?**
A: No. Agent Dashboard is 100% local. All data is stored in `.agent-dashboard/` in your project directory. No telemetry, no cloud sync, no external API calls. The web dashboard export generates a self-contained HTML file that works offline.

**Q: How accurate are the cost estimates?**
A: Cost estimates use built-in pricing tables that are updated periodically. They are accurate to within 5% for standard API usage. Variations can occur if your provider offers custom pricing, volume discounts, or if prices have changed since the last pricing table update. You can update pricing in `.agent-dashboard/config.json`.

**Q: Can I track multiple agents or projects?**
A: Each project has its own `.agent-dashboard/` directory with independent metrics. To get a cross-project view, use `dashboard export json` from each project and aggregate externally. A multi-project dashboard feature is planned for a future version.

**Q: What happens if I forget to check the dashboard?**
A: Alerts are your safety net. Set thresholds for the metrics you care about most (daily cost, error rate, health score), and Agent Dashboard will notify you inline whenever a threshold is crossed. Pending alerts are displayed at the start of each new session.
