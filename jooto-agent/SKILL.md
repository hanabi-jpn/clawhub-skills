---
name: jooto-agent
description: "Task and project management on Jooto — create tasks, manage boards, automate workflows via PR TIMES' tool"
author: hanabi-jpn
version: 1.0.0
tags:
  - project-management
  - jooto
  - task-automation
  - kanban
  - team-collaboration
  - pr-times
  - workflow
  - japan-saas
---

```
       ╔═══════════════════════════════════════════════════════╗
       ║        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓        ║
       ║        ┃   ╦╔═╗╔═╗╔╦╗╔═╗                   ┃        ║
       ║        ┃   ║║ ║║ ║ ║ ║ ║                   ┃        ║
       ║        ┃  ╚╝╚═╝╚═╝ ╩ ╚═╝                   ┃        ║
       ║        ┃      A G E N T                     ┃        ║
       ║        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛        ║
       ║                                                       ║
       ║   [ TODO ]──>[ IN PROGRESS ]──>[ REVIEW ]──>[ DONE ] ║
       ║     ┃             ┃               ┃           ┃      ║
       ║     ▼             ▼               ▼           ▼      ║
       ║   ┌───┐       ┌───┐           ┌───┐       ┌───┐     ║
       ║   │ 5 │       │ 3 │           │ 2 │       │12 │     ║
       ║   └───┘       └───┘           └───┘       └───┘     ║
       ╚═══════════════════════════════════════════════════════╝
```

`skill: jooto-agent` | `version: 1.0.0` | `platform: Jooto API v1` | `tasks: unlimited` | `boards: multi-project`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![PM](https://img.shields.io/badge/PM-PR_TIMES_Jooto-4CAF50)]()

> **Command your entire Jooto workspace from the terminal -- create tasks, orchestrate boards, and automate team workflows without ever opening a browser.**

---

## Overview

Jooto Agent transforms your CLI into a full-featured Jooto project management cockpit. Jooto, developed by PR TIMES (a leading Japanese PR and communications platform), is one of Japan's most popular kanban-style task management tools, trusted by over 1,800 organizations including agencies, startups, and enterprise teams. This skill bridges the gap between developer workflows and project management by bringing every Jooto capability directly into your terminal session.

With Jooto Agent, you can create and manage tasks across multiple boards, assign team members, set priorities and due dates, attach files, and generate progress reports -- all through intuitive CLI commands. The skill supports advanced workflows including recurring task automation, bulk operations, label-based filtering, and cross-board analytics. Whether you are running a sprint for a software team in Tokyo or coordinating a marketing campaign across distributed offices, Jooto Agent keeps your project data at your fingertips without context-switching.

```
  Architecture Overview
  =====================

  ┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
  │  Developer   │     │   Jooto Agent    │     │   Jooto API     │
  │  Terminal    │────>│   CLI Layer      │────>│   (PR TIMES)    │
  │             │     │                  │     │                 │
  │  jo tasks   │     │  ┌────────────┐  │     │  ┌───────────┐  │
  │  jo create  │     │  │ Auth Mgr   │  │     │  │ Boards    │  │
  │  jo boards  │     │  ├────────────┤  │     │  │ Tasks     │  │
  │  jo report  │     │  │ Cmd Router │  │     │  │ Users     │  │
  │             │     │  ├────────────┤  │     │  │ Labels    │  │
  └─────────────┘     │  │ Formatter  │  │     │  │ Comments  │  │
                      │  └────────────┘  │     │  └───────────┘  │
                      └──────────────────┘     └─────────────────┘
                               │
                      ┌────────▼────────┐
                      │  Local Cache    │
                      │  ~/.jooto/      │
                      │  - boards.json  │
                      │  - config.yaml  │
                      └─────────────────┘
```

---

## System Prompt Instructions

You are the Jooto Agent, an expert project management assistant specialized in Jooto (PR TIMES). Follow these rules precisely:

1. Always authenticate using the `JOOTO_API_KEY` environment variable before making any API calls. If the key is missing, prompt the user to set it and provide the URL for Jooto API key generation.
2. Default to the organization specified by `JOOTO_ORGANIZATION_ID`. If not set, fetch and cache the user's primary organization on first run.
3. When creating tasks, require at minimum a title and board ID. Infer the board from context if the user has only one active board.
4. Always display task status using kanban-style labels: `[TODO]`, `[IN PROGRESS]`, `[REVIEW]`, `[DONE]`. Map these to Jooto's internal list IDs automatically.
5. Format all dates in `YYYY-MM-DD` format for consistency. When the user says "tomorrow" or "next Friday," calculate the absolute date from the current system date.
6. When listing tasks, default to showing the current user's assigned tasks sorted by due date. Support `--all` flag to show all board tasks.
7. Support Japanese task titles and descriptions natively. Output headers in English but preserve Japanese content as-is.
8. For recurring tasks, validate the cron expression or natural-language interval before scheduling. Supported intervals: daily, weekly, biweekly, monthly, quarterly.
9. When attaching files, verify the file exists locally before uploading. Enforce a 10MB file size limit per Jooto API constraints.
10. Rate-limit API calls to a maximum of 60 requests per minute. Queue excess requests and notify the user of estimated wait time.
11. Cache board metadata locally in `~/.jooto/boards.json` with a 5-minute TTL. Force refresh with `--refresh` flag.
12. For `jo report`, aggregate task counts by status, assignee, and label. Calculate completion percentages and velocity metrics over the specified time range.
13. When updating tasks, confirm destructive changes (deletion, status regression) with the user before executing. Use `--force` to skip confirmation.
14. Color-code priority levels in terminal output: `[P1]` red, `[P2]` yellow, `[P3]` green, `[P4]` gray. Fall back to text labels if the terminal does not support colors.
15. On any API error, display the HTTP status code, Jooto error message, and a suggested remediation action. Retry transient errors (429, 500, 502, 503) up to 3 times with exponential backoff.
16. When managing team members, respect Jooto role permissions. Do not attempt admin-only operations unless the authenticated user has admin privileges.
17. For export operations, support CSV, JSON, and Markdown formats. Default to CSV if no format is specified.
18. Log all write operations (create, update, delete) to `~/.jooto/audit.log` with timestamps for traceability.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `JOOTO_API_KEY` | Yes | -- | API key from Jooto account settings |
| `JOOTO_ORGANIZATION_ID` | No | auto-detect | Organization ID for multi-org accounts |
| `JOOTO_DEFAULT_BOARD` | No | -- | Default board ID for task operations |
| `JOOTO_CACHE_TTL` | No | `300` | Cache time-to-live in seconds |
| `JOOTO_LOG_LEVEL` | No | `info` | Logging verbosity: debug, info, warn, error |
| `JOOTO_LOCALE` | No | `ja` | Output locale (ja, en) |

---

## Commands

### `jo tasks` -- List Tasks

```bash
$ jo tasks
┌─────────────────────────────────────────────────────────────────────┐
│  Board: Website Redesign (board-4821)                              │
├──────┬──────────────────────────┬────────┬──────────┬──────────────┤
│  ID  │  Title                   │ Status │ Priority │ Due Date     │
├──────┼──────────────────────────┼────────┼──────────┼──────────────┤
│ 1042 │ Design hero section      │ [DONE] │   [P1]   │ 2026-02-28   │
│ 1043 │ Implement nav component  │ [IP]   │   [P1]   │ 2026-03-03   │
│ 1044 │ Write product copy       │ [TODO] │   [P2]   │ 2026-03-05   │
│ 1045 │ QA responsive layout     │ [TODO] │   [P2]   │ 2026-03-07   │
│ 1046 │ Deploy staging           │ [TODO] │   [P3]   │ 2026-03-10   │
└──────┴──────────────────────────┴────────┴──────────┴──────────────┘
  Showing 5 tasks assigned to you | Total on board: 23
```

### `jo create` -- Create a Task

```bash
$ jo create --board 4821 --title "Add footer links" --priority P2 --due 2026-03-08 --assign tanaka
Task created successfully.
  ID:       1047
  Board:    Website Redesign (board-4821)
  Title:    Add footer links
  Priority: [P2]
  Due:      2026-03-08
  Assignee: Tanaka Yuki (@tanaka)
  Status:   [TODO]
```

### `jo boards` -- List Boards

```bash
$ jo boards
┌────────┬────────────────────────┬────────┬───────────┬─────────────┐
│  ID    │  Name                  │ Tasks  │ Members   │ Updated     │
├────────┼────────────────────────┼────────┼───────────┼─────────────┤
│  4821  │ Website Redesign       │   23   │    5      │ 2026-03-01  │
│  4805  │ Q1 Marketing Campaign  │   47   │    8      │ 2026-02-28  │
│  4799  │ Mobile App Sprint 3    │   31   │    4      │ 2026-02-27  │
│  4788  │ Internal Tools         │   12   │    3      │ 2026-02-25  │
└────────┴────────────────────────┴────────┴───────────┴─────────────┘
  4 boards in organization: ClawHub Inc.
```

### `jo update` -- Update a Task

```bash
$ jo update 1043 --status done --comment "Navigation merged in PR #287"
Task #1043 updated.
  Title:    Implement nav component
  Status:   [IN PROGRESS] -> [DONE]
  Comment:  "Navigation merged in PR #287" added.
  Updated:  2026-03-01 14:32:05 JST
```

### `jo comments` -- View or Add Comments

```bash
$ jo comments 1043
Task #1043: Implement nav component
───────────────────────────────────────
  [2026-02-27 09:15] @suzuki:
    Started working on this. Using shadcn/ui for base components.

  [2026-02-28 16:42] @tanaka:
    Looks good. Please add mobile hamburger menu too.

  [2026-03-01 14:32] @ishihara:
    Navigation merged in PR #287

  3 comments total
```

### `jo labels` -- Manage Labels

```bash
$ jo labels --board 4821
┌────────┬──────────────────┬─────────┬────────────┐
│  ID    │  Label           │ Color   │ Task Count │
├────────┼──────────────────┼─────────┼────────────┤
│  L01   │  Bug             │  red    │     4      │
│  L02   │  Feature         │  blue   │    11      │
│  L03   │  Design          │  purple │     5      │
│  L04   │  Documentation   │  gray   │     3      │
└────────┴──────────────────┴─────────┴────────────┘

$ jo labels create --board 4821 --name "Urgent" --color red
Label "Urgent" (L05) created on board Website Redesign.
```

### `jo recurring` -- Manage Recurring Tasks

```bash
$ jo recurring create --board 4821 --title "Weekly standup notes" --interval weekly --day monday --assign team
Recurring task created.
  ID:       R-0012
  Title:    Weekly standup notes
  Board:    Website Redesign
  Schedule: Every Monday
  Assignee: All team members
  Next:     2026-03-02 (Monday)

$ jo recurring list
┌────────┬──────────────────────────┬───────────┬─────────────┐
│  ID    │  Title                   │ Interval  │ Next Run    │
├────────┼──────────────────────────┼───────────┼─────────────┤
│ R-0010 │ Monthly retrospective    │ monthly   │ 2026-03-31  │
│ R-0011 │ Daily bug triage         │ daily     │ 2026-03-02  │
│ R-0012 │ Weekly standup notes     │ weekly    │ 2026-03-02  │
└────────┴──────────────────────────┴───────────┴─────────────┘
```

### `jo report` -- Generate Reports

```bash
$ jo report --board 4821 --period 2026-02
Board: Website Redesign | Period: February 2026
════════════════════════════════════════════════
  Status Breakdown:
    [DONE]        ████████████████░░░░  12 (52%)
    [IN PROGRESS] ████░░░░░░░░░░░░░░░░   4 (17%)
    [REVIEW]      ███░░░░░░░░░░░░░░░░░   2  (9%)
    [TODO]        █████░░░░░░░░░░░░░░░   5 (22%)

  Team Velocity:
    @tanaka     8 tasks completed   (top performer)
    @suzuki     5 tasks completed
    @ishihara   3 tasks completed

  Overdue: 1 task (#1039 - missed deadline 2026-02-25)
  Avg completion time: 3.2 days
```

### `jo export` -- Export Board Data

```bash
$ jo export --board 4821 --format csv --output ./tasks.csv
Exporting board "Website Redesign"...
  Tasks exported:  23
  Format:          CSV
  Output:          ./tasks.csv
  Size:            4.2 KB
Export complete.
```

### `jo team` -- Manage Team Members

```bash
$ jo team --board 4821
┌──────────────┬───────────────────┬──────────┬──────────────┐
│  Username    │  Name             │ Role     │ Active Tasks │
├──────────────┼───────────────────┼──────────┼──────────────┤
│  @ishihara   │  Ishihara Tatsuya │  Admin   │      3       │
│  @tanaka     │  Tanaka Yuki      │  Member  │      6       │
│  @suzuki     │  Suzuki Aoi       │  Member  │      4       │
│  @yamamoto   │  Yamamoto Ken     │  Member  │      2       │
│  @sato       │  Sato Mika        │  Viewer  │      0       │
└──────────────┴───────────────────┴──────────┴──────────────┘
  5 members | Board: Website Redesign
```

---

## Workflow Diagram

```
  Task Lifecycle in Jooto Agent
  ═════════════════════════════

  ┌──────────┐    jo create    ┌──────────┐    jo update     ┌──────────┐
  │          │ ──────────────> │          │ ───────────────> │          │
  │  INBOX   │                 │   TODO   │                  │    IP    │
  │          │                 │          │ <─── jo update   │          │
  └──────────┘                 └──────────┘    (revert)      └──────────┘
                                                                  │
                                                    jo update     │
                                                  ┌───────────────┘
                                                  ▼
  ┌──────────┐   jo update     ┌──────────┐
  │          │ <────────────── │          │
  │   DONE   │                 │  REVIEW  │
  │          │                 │          │
  └──────────┘                 └──────────┘
       │
       ▼
  ┌──────────────────┐
  │  jo report       │──> Analytics & Metrics
  │  jo export       │──> CSV / JSON / Markdown
  └──────────────────┘

  Recurring Tasks:
  ┌────────────┐    cron/interval    ┌──────────┐
  │ jo recurring│ ─────────────────> │ Auto-    │──> TODO list
  │   create    │                    │ generate │
  └────────────┘                     └──────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_001: Invalid API key` | The `JOOTO_API_KEY` is expired or incorrect. | Regenerate your API key at Jooto Settings > API and update the environment variable. |
| `BOARD_404: Board not found` | The specified board ID does not exist or you lack access. | Run `jo boards` to list accessible boards. Verify the ID and your membership. |
| `RATE_429: Too many requests` | API rate limit of 60 requests/minute exceeded. | Wait 60 seconds or reduce batch size. The agent auto-retries with backoff. |
| `TASK_CONFLICT: Duplicate title` | A task with the same title already exists on the board in the same list. | Use `--allow-duplicate` flag or rename the task. |
| `FILE_TOO_LARGE: Exceeds 10MB` | Attachment file exceeds Jooto's upload limit. | Compress the file or host it externally and add a link in the task description. |
| `PERM_403: Insufficient privileges` | Your role (Member/Viewer) cannot perform admin operations like deleting boards. | Contact your organization admin to elevate your role, or use an admin API key. |
| `NET_TIMEOUT: Connection timeout` | Network issue or Jooto service is temporarily unavailable. | Check your internet connection. The agent retries up to 3 times automatically. |

---

## FAQ

**1. How do I get a Jooto API key?**
Log in to Jooto, go to Settings > API Integration, and generate a new key. Copy it to your `JOOTO_API_KEY` environment variable.

**2. Can I manage multiple organizations?**
Yes. Set `JOOTO_ORGANIZATION_ID` to switch between organizations, or use `--org <id>` on any command.

**3. Does Jooto Agent work with Jooto's free plan?**
Yes. All core task and board operations work on the free plan. Some advanced features like file attachments may be limited by your plan.

**4. How do recurring tasks work?**
The agent uses Jooto's API scheduling or, if unavailable, creates a local cron job that generates tasks at the specified interval.

**5. Can I use Japanese in task titles?**
Absolutely. The agent fully supports UTF-8 including Japanese, Chinese, and emoji characters in titles and descriptions.

**6. Is there an offline mode?**
The agent caches recent board data locally. You can view cached tasks offline, but creating or updating tasks requires an active connection.

**7. How do I filter tasks by label?**
Use `jo tasks --label Bug` or `jo tasks --label L01` to filter by label name or ID.

**8. Can I bulk-create tasks from a CSV?**
Yes. Use `jo create --from-csv tasks.csv` where the CSV has columns: title, priority, due_date, assignee.

**9. How does the report calculate velocity?**
Velocity is measured as tasks moved to DONE per week, averaged over the specified reporting period.

**10. Does it integrate with GitHub or Slack?**
Jooto Agent focuses on Jooto's API. For GitHub integration, pair it with other ClawHub skills. Jooto's native Slack integration works independently.

**11. What happens if I delete a task by accident?**
Deleted tasks are soft-deleted in Jooto for 30 days. Contact Jooto support or check the trash in the web UI to restore.

**12. Can I customize the kanban columns?**
The agent maps to Jooto's list structure. Create custom lists in Jooto's web UI, and the agent will recognize them automatically.

---

## Data Storage

| Location | Purpose | Retention |
|---|---|---|
| `~/.jooto/config.yaml` | API key, org ID, preferences | Persistent until user deletes |
| `~/.jooto/boards.json` | Cached board metadata | 5-minute TTL (configurable) |
| `~/.jooto/audit.log` | Write operation log | Rolling 30 days, max 10MB |
| `~/.jooto/exports/` | Exported CSV/JSON/MD files | User-managed |
| `~/.jooto/recurring.json` | Recurring task schedules | Persistent |

All data is stored locally on disk. No data is sent to third-party services beyond the official Jooto API. API keys are stored in plaintext in the config file; for enhanced security, use environment variables instead.

---

## Comparison Table

| Feature | Jooto Agent (CLI) | Jooto Web UI | Trello CLI | Asana CLI |
|---|---|---|---|---|
| Task CRUD | Full | Full | Full | Full |
| Bulk operations | Yes (CSV import) | Limited | No | Yes |
| Offline viewing | Yes (cache) | No | No | No |
| Japanese-native | Yes | Yes | No | No |
| Recurring tasks | Yes | Web only | No | Yes |
| CLI reports | Bar charts + metrics | Dashboard | No | Basic |
| Export formats | CSV, JSON, MD | CSV | JSON | CSV |
| PR TIMES ecosystem | Native | Native | No | No |
| Team management | Yes | Yes | Limited | Yes |
| Custom workflows | Label + priority | Drag-drop | Power-ups | Rules |
| Price | Free (OSS) | Freemium | Free | Paid |
| Setup time | 2 minutes | Browser login | 5 minutes | 10 minutes |

---

*Jooto Agent -- because your kanban board belongs in your terminal, not your browser tab.*
