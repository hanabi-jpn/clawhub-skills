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

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

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

**`dashboard tasks [--period day|week|month]`** — Task analytics:
- Completed, failed, in-progress counts
- Average completion time
- Success rate trend
- Most common task types

**`dashboard skills`** — Skill performance ranking:
- Most used skills
- Fastest/slowest skills
- Error rates per skill
- Token consumption per skill
- Unused skills (installed but never called)

**`dashboard cost [--period day|week|month]`** — Cost analytics:
- Cost by provider (Anthropic, OpenAI, Google)
- Cost by skill
- Cost per task
- Daily/weekly/monthly trends
- Projected monthly cost

**`dashboard alerts`** — Show active alerts

**`dashboard alert set <type> <threshold>`** — Configure alerts:
- `error-rate 10` — Alert if error rate exceeds 10%
- `daily-cost 5` — Alert if daily cost exceeds $5
- `monthly-cost 50` — Alert if monthly cost exceeds $50
- `skill-error <skill> 3` — Alert if skill fails 3+ times
- `health 60` — Alert if health score drops below 60

**`dashboard report [daily|weekly|monthly]`** — Generate markdown report:
- Summary statistics
- Trends and comparisons
- Top achievements
- Issues and recommendations
- Cost forecast

**`dashboard --web`** — Generate HTML dashboard:
- Self-contained HTML file with inline CSS/JS
- Interactive charts (line graphs, pie charts)
- Dark mode support
- Mobile responsive
- Auto-refresh every 60 seconds if served locally

**`dashboard replay [--session <id>]`** — Session replay:
- Timeline of all actions in a session
- Filter by skill, outcome, or time range
- Debug failed operations

**`dashboard export <json|csv|html>`** — Export all data

**`dashboard reset`** — Clear all tracking data (confirmation required)

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
