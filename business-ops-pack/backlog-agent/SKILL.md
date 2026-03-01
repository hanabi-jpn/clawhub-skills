---
name: backlog-agent
description: Manage projects on Nulab Backlog — issues, wikis, milestones, Git, sprints for Japan's top PM tool
author: hanabi-jpn
version: 1.0.0
tags:
  - backlog
  - nulab
  - project-management
  - issue-tracking
  - git
  - wiki
  - sprint
  - japan
---

```
╔═══════════════════════════════════════════════════╗
║  ┌───────────────────────────────────────────┐    ║
║  │  B A C K L O G   A G E N T               │    ║
║  │     ━━━━━━━━━━━━━━━━━━━━━━                │    ║
║  │  📋 Issues → Wiki → Git → Sprints        │    ║
║  │     Nulab Project Management CLI          │    ║
║  └───────────────────────────────────────────┘    ║
╚═══════════════════════════════════════════════════╝
```

`backlog` `nulab` `project-management` `issue-tracker` `git-hosting`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![PM](https://img.shields.io/badge/PM-Nulab_Backlog-009688)]()
[![API](https://img.shields.io/badge/Backlog_API-v2-2C3E50)]()

> **Command your entire project from the terminal -- create issues, track sprints, update wikis, and manage Git repos on Japan's most trusted project management platform.**

---

## Overview

Backlog Agent delivers full programmatic control over Nulab Backlog, the project management platform trusted by development teams, agencies, and enterprises across Japan and Asia-Pacific. Backlog uniquely combines issue tracking, wiki documentation, Git/SVN repository hosting, and Gantt chart planning in a single integrated platform -- a combination that has made it the go-to tool for Japanese software teams who need everything in one place without the fragmentation of using Jira plus Confluence plus GitHub plus separate Gantt tools. This skill makes every Backlog operation accessible from your terminal, enabling seamless integration into development workflows, CI/CD pipelines, and automated reporting systems.

The agent covers the complete Backlog feature set through its comprehensive REST API v2: issue lifecycle management with custom fields, statuses, priorities, and resolution tracking; wiki page creation and editing with Markdown and Backlog's native markup support; milestone and version management for release planning; sprint board operations for agile teams; Git repository management including branches, pull requests, and webhooks; file attachment handling; notification configuration; and bulk operations for project-wide changes. The agent understands Backlog's project key convention (e.g., `PROJ-123`) and translates between human-readable references and internal IDs seamlessly. It also supports cross-project operations for organizations managing multiple simultaneous projects -- a common pattern in Japanese IT consulting firms (SIer) managing client portfolios.

```
Architecture:

  ┌──────────────────────────────────────────────────────────────┐
  │                     Backlog Agent CLI                         │
  │                                                              │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
  │  │  Issues  │ │   Wiki   │ │   Git    │ │    Sprint     │   │
  │  │  Engine  │ │  Manager │ │  Bridge  │ │    Board      │   │
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬────────┘   │
  │       │            │            │               │            │
  │  ┌────▼────────────▼────────────▼───────────────▼──────────┐ │
  │  │        Project Key Resolver & ID Mapper                 │ │
  │  │     (PROJ-123 ↔ internal IDs, cross-project)            │ │
  │  └──────────────────────┬──────────────────────────────────┘ │
  │                         │                                    │
  │  ┌──────────────────────▼──────────────────────────────────┐ │
  │  │         API Key / OAuth2 Auth Layer                     │ │
  │  │    ({space}.backlog.com or {space}.backlog.jp)           │ │
  │  └──────────────────────┬──────────────────────────────────┘ │
  └─────────────────────────┼────────────────────────────────────┘
                            │ HTTPS
                            ▼
               ┌──────────────────────────┐
               │  {space}.backlog.com/api  │
               │    Backlog REST API v2    │
               └──────────────────────────┘
```

---

## System Prompt Instructions

You are the Backlog Agent, a project management automation specialist for Nulab Backlog. Follow these rules precisely:

1. Authenticate using API key (`apiKey` query parameter) by default. Support OAuth2 for user-context operations. Never embed API keys in log output.
2. All API requests target `https://{BACKLOG_SPACE_ID}.backlog.com/api/v2/` or `https://{BACKLOG_SPACE_ID}.backlog.jp/api/v2/`. Auto-detect the correct domain based on space configuration.
3. Issue keys follow the `{PROJECT_KEY}-{NUMBER}` convention (e.g., `DEV-42`). Always resolve project keys and issue numbers to internal numeric IDs before making API calls. Display keys in human-readable format in output.
4. Support all issue fields: `issueType`, `priority` (High/Medium/Low), `status` (Open/In Progress/Resolved/Closed), `assignee`, `category`, `version`, `milestone`, `startDate`, `dueDate`, `estimatedHours`, `actualHours`, `resolution`, and custom fields.
5. When creating issues, validate that the specified issue type, priority, and assignee exist in the target project. Provide helpful suggestions on mismatch.
6. Wiki pages use Backlog's native markup format by default. Support Markdown when the project has Markdown enabled. Auto-detect the project's wiki format setting.
7. Git operations proxy through the Backlog API, not direct Git protocol. Support branch listing, pull request creation and review, and webhook management.
8. Pull requests require: `summary`, `description`, `base` branch, `branch` (source), and optionally `assigneeId` and `issueId` (to link to an issue).
9. Milestone operations must respect the project's milestone list. Auto-suggest existing milestones when creating issues. Milestones have `startDate`, `releaseDueDate`, and optional `description`.
10. Sprint board operations map to Backlog's "Board" feature. Issues move between statuses on the board. Track velocity by summing estimated hours across sprint milestones.
11. File attachments upload to the space's shared storage first (`/api/v2/space/attachment`), returning an `id` that can then be linked to issues, wiki pages, or pull requests.
12. Bulk operations use individual API calls (Backlog has no native bulk endpoint). The agent batches these with concurrency control and progress reporting. Maximum recommended: 100 operations per batch.
13. Notification preferences: respect the user's notification settings. Do not trigger excessive notifications during bulk operations -- use the `notifiedUserId` parameter selectively.
14. Custom fields are project-scoped. Fetch the project's custom field definitions before validating create/update payloads. Support types: Text, TextArea, Numeric, Date, SingleList, MultipleList, CheckBox, RadioButton.
15. Cross-project queries use the `/api/v2/issues` endpoint with `projectId` array. Always scope queries to specific projects unless the user explicitly requests space-wide search.
16. Gantt chart data is derived from issue start dates and due dates. When generating reports, validate that issues have both dates set. Warn about issues missing scheduling data.
17. Rate limiting: Backlog allows varying limits based on plan (Free: 60/min, Standard: 300/min, Premium: 600/min). Detect the plan from the space info endpoint and configure accordingly.
18. Handle Backlog's webhook events for CI/CD integration. Support event types: issue creation/update, wiki update, Git push, pull request, and file upload.
19. Always display timestamps in the project's configured timezone. Default to JST (Asia/Tokyo) for Japanese spaces.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `BACKLOG_SPACE_ID` | Yes | - | Your Backlog space identifier (e.g., `myteam` for `myteam.backlog.com`) |
| `BACKLOG_API_KEY` | Yes | - | API key from Personal Settings > API in Backlog |
| `BACKLOG_PROJECT_KEY` | No | - | Default project key (e.g., `DEV`) used when `--project` is omitted |
| `BACKLOG_DOMAIN` | No | `backlog.com` | Domain suffix: `backlog.com` (international) or `backlog.jp` (Japan) |
| `BACKLOG_OUTPUT_FORMAT` | No | `table` | Default output format: `table`, `json`, `csv` |
| `BACKLOG_CONCURRENCY` | No | `3` | Maximum concurrent API calls for bulk operations |
| `BACKLOG_TIMEZONE` | No | `Asia/Tokyo` | Timezone for displaying timestamps |

---

## Commands

### `bl issues`
List issues with filtering.

```bash
$ bl issues --project DEV --status "In Progress" --assignee me

  Key       Type     Priority  Summary                          Assignee     Due Date     Updated
  ────────  ───────  ────────  ───────────────────────────────  ───────────  ───────────  ──────────
  DEV-142   Task     High      API認証モジュールのリファクタ     石原 達也     2026-03-07   2h ago
  DEV-138   Bug      High      ログイン時のCSRFトークンエラー    石原 達也     2026-03-05   5h ago
  DEV-135   Task     Medium    CI/CDパイプライン最適化           石原 達也     2026-03-10   1d ago
  DEV-131   Feature  Medium    ダッシュボード通知機能追加        石原 達也     2026-03-15   2d ago
  DEV-127   Task     Low       ドキュメント英語化対応            石原 達也     2026-03-20   3d ago

  Showing 5 issues (In Progress, assigned to 石原 達也) in project DEV
```

### `bl create`
Create a new issue.

```bash
$ bl create --project DEV --type Bug --priority High \
    --summary "本番環境でのメモリリーク検出" \
    --description "Production server memory usage increasing 2%/hour since deploy v2.3.1. GC logs show unreleased connections in ConnectionPool." \
    --assignee ishihara --milestone "v2.3.2" --due "2026-03-05"

  Issue created successfully
  Key:         DEV-143
  Type:        Bug
  Priority:    High
  Summary:     本番環境でのメモリリーク検出
  Assignee:    石原 達也
  Milestone:   v2.3.2
  Due Date:    2026-03-05
  Status:      Open
  Created:     2026-03-01 11:42:18 JST
  URL:         https://myteam.backlog.com/view/DEV-143
```

### `bl update`
Update an existing issue.

```bash
$ bl update DEV-143 --status "In Progress" --actual-hours 2.5 \
    --comment "Root cause identified: connection pool not closing idle connections. Fix in PR #89."

  Issue updated successfully
  Key:         DEV-143
  Changes:
    Status:        Open → In Progress
    Actual Hours:  0 → 2.5h
  Comment:     Added (ID: 45678)
  Updated:     2026-03-01 14:15:33 JST
  URL:         https://myteam.backlog.com/view/DEV-143
```

### `bl wiki`
Create and manage wiki pages.

```bash
$ bl wiki --project DEV --list

  Page ID   Title                              Updated By     Updated        Tags
  ────────  ─────────────────────────────────  ─────────────  ─────────────  ──────────────
  W-001     プロジェクト概要                    石原 達也      2026-02-28     overview
  W-002     開発環境セットアップ手順            佐藤 花子      2026-02-25     setup, dev
  W-003     API設計ガイドライン                 田中 太郎      2026-02-20     api, design
  W-004     デプロイ手順書                      石原 達也      2026-03-01     deploy, ops
  W-005     障害対応フロー                      山田 次郎      2026-02-15     incident

  Total: 5 wiki pages in project DEV
```

### `bl milestone`
Manage project milestones and versions.

```bash
$ bl milestone --project DEV

  Name       Start Date   Release Due   Issues   Progress   Status
  ─────────  ───────────  ────────────  ───────  ─────────  ────────
  v2.3.0     2026-01-15   2026-02-15    28/28    100%       Released
  v2.3.1     2026-02-01   2026-02-28    24/24    100%       Released
  v2.3.2     2026-03-01   2026-03-15    8/18     44%        Active
  v2.4.0     2026-03-15   2026-04-30    0/32     0%         Planned

  Active: v2.3.2 (10 open issues, 8 closed, target: 2026-03-15)
```

### `bl sprint`
View and manage sprint boards.

```bash
$ bl sprint --project DEV --current

  Sprint: v2.3.2 Sprint 1 (2026-03-01 → 2026-03-15)

  ┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
  │  Open (3)       │  In Progress(5) │  Resolved (6)   │  Closed (4)     │
  ├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
  │  DEV-140 [M]    │  DEV-142 [H]    │  DEV-130 [H]    │  DEV-125 [M]    │
  │  デプロイ自動化  │  API認証リファ   │  DB最適化        │  UIテスト追加    │
  │                 │                 │                 │                 │
  │  DEV-139 [L]    │  DEV-138 [H]    │  DEV-129 [M]    │  DEV-124 [L]    │
  │  コード整理      │  CSRFバグ修正   │  キャッシュ導入   │  README更新     │
  │                 │                 │                 │                 │
  │  DEV-137 [M]    │  DEV-135 [M]    │  DEV-128 [M]    │  DEV-123 [M]    │
  │  E2Eテスト      │  CI/CD最適化     │  ログ集約        │  依存関係更新    │
  │                 │                 │                 │                 │
  │                 │  DEV-131 [M]    │  DEV-126 [H]    │  DEV-122 [H]    │
  │                 │  通知機能追加    │  セキュリティ    │  認証バグ修正    │
  │                 │                 │                 │                 │
  │                 │  DEV-127 [L]    │  DEV-133 [L]    │                 │
  │                 │  ドキュメント    │  型定義整理      │                 │
  │                 │                 │                 │                 │
  │                 │                 │  DEV-134 [M]    │                 │
  │                 │                 │  APIテスト       │                 │
  └─────────────────┴─────────────────┴─────────────────┴─────────────────┘

  Velocity: 42h estimated | 28h completed | Burndown: 56% at day 1/14
```

### `bl git`
Manage Git repositories and pull requests.

```bash
$ bl git --project DEV --repos

  Repository     Default Branch  Last Push        Commits  PRs Open
  ─────────────  ──────────────  ───────────────  ───────  ────────
  dev-api        main            2026-03-01 10:22  1,842    3
  dev-frontend   main            2026-03-01 09:45  2,156    2
  dev-infra      main            2026-02-28 18:30  487      0

  Total: 3 repositories | 5 open pull requests

$ bl git --project DEV --repo dev-api --prs

  PR #    Title                              Author       Base    Branch          Status
  ─────  ───────────────────────────────────  ───────────  ──────  ──────────────  ────────
  #89    Fix connection pool memory leak      石原 達也     main    fix/mem-leak    Open
  #88    Add rate limiting middleware          佐藤 花子     main    feat/rate-limit Review
  #87    Update dependency versions            田中 太郎     main    chore/deps      Merged
```

### `bl search`
Search across issues, wiki, and comments.

```bash
$ bl search "memory leak" --project DEV --scope issues,wiki

  Issues (3 matches):
  DEV-143  [Bug/High]     本番環境でのメモリリーク検出        In Progress
  DEV-098  [Bug/Medium]   ステージングメモリリーク調査         Closed
  DEV-055  [Task/Low]     メモリプロファイリングツール導入     Closed

  Wiki (1 match):
  W-005  障害対応フロー  Section: "メモリリーク発生時の対応手順"

  Total: 4 results across issues and wiki
```

### `bl report`
Generate project status reports.

```bash
$ bl report --project DEV --type weekly

  Weekly Report: DEV (2026-02-24 → 2026-03-01)

  Summary:
    Issues Created:    12
    Issues Closed:     8
    Issues In Review:  4
    Avg Resolution:    3.2 days

  By Priority:
    High:    3 created / 2 closed
    Medium:  7 created / 5 closed
    Low:     2 created / 1 closed

  By Assignee:
    石原 達也     4 closed (16.5h actual)
    佐藤 花子     2 closed (8.0h actual)
    田中 太郎     1 closed (4.5h actual)
    山田 次郎     1 closed (3.0h actual)

  Milestone Progress:
    v2.3.2: 44% (8/18 issues closed, 7 days remaining)

  Blockers:
    DEV-143 [High] Memory leak in production — needs immediate attention
```

### `bl bulk`
Perform bulk operations on issues.

```bash
$ bl bulk --project DEV --action update --query "milestone:v2.3.1 AND status:Resolved" \
    --set '{"status": "Closed", "resolution": "Fixed"}'

  Bulk update preview:
  Project:    DEV
  Matching:   12 issues
  Action:     Set status → Closed, resolution → Fixed

  Proceed? [y/N]: y

  Processing: [████████████████████████████████████████] 12/12

  Bulk update complete
  Updated:    12 issues
  Failed:     0
  Duration:   4.8 seconds

  Affected:   DEV-112, DEV-113, DEV-114, DEV-115, DEV-116, DEV-117,
              DEV-118, DEV-119, DEV-120, DEV-121, DEV-122, DEV-124
```

---

## Workflow

```
  Developer                  Backlog Agent                 Backlog API
  ─────────                  ─────────────                 ───────────
      │                            │                            │
      │  bl create --project DEV   │                            │
      │  --type Bug --priority H   │                            │
      ├───────────────────────────►│                            │
      │                            │  Resolve project key → ID  │
      │                            │  Validate issue type       │
      │                            │  Validate assignee         │
      │                            │  Resolve milestone name    │
      │                            │                            │
      │                            │  POST /api/v2/issues       │
      │                            ├───────────────────────────►│
      │                            │  201 {id, issueKey, ...}   │
      │                            │◄───────────────────────────┤
      │  DEV-143 created           │  Map IDs → readable keys   │
      │◄───────────────────────────┤                            │
      │                            │                            │
      │  bl update DEV-143         │                            │
      │  --status "In Progress"    │                            │
      ├───────────────────────────►│                            │
      │                            │  Resolve DEV-143 → ID      │
      │                            │  Map status → statusId     │
      │                            │  PATCH /api/v2/issues/{id} │
      │                            ├───────────────────────────►│
      │                            │  200 OK                    │
      │                            │◄───────────────────────────┤
      │  DEV-143 updated           │                            │
      │◄───────────────────────────┤                            │
      │                            │                            │
      │  bl sprint --current       │                            │
      ├───────────────────────────►│  GET milestones, issues    │
      │                            ├───────────────────────────►│
      │                            │◄───────────────────────────┤
      │  Sprint board rendered     │  Group by status           │
      │◄───────────────────────────┤  Calculate velocity        │
      │                            │                            │
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `401 Unauthorized: Authentication failed` | API key is invalid, expired, or not set | Regenerate your API key at Personal Settings > API in Backlog. Verify `BACKLOG_API_KEY` is correctly set. |
| `404 Not Found: Project not found` | Project key is invalid or you do not have access | Verify the project key with `bl issues --list-projects`. Ensure your account has been added to the project. |
| `400 Invalid issue type` | The specified issue type does not exist in this project | Each project defines its own issue types. Use `bl issues --project KEY --types` to list valid types for the project. |
| `400 Duplicate issue key` | Attempting to create an issue with a key that already exists | Issue keys are auto-generated. This error typically indicates a race condition. Retry the creation. |
| `403 Forbidden: Insufficient privileges` | Your role does not permit this operation (e.g., guest trying to delete) | Contact the project admin to upgrade your role. Guests have read-only access by default. |
| `413 File too large` | Attachment exceeds the space's file size limit (varies by plan) | Free plan: 100MB total storage. Compress files or use external storage with links. Check `bl status` for storage usage. |
| `429 Rate Limit Exceeded` | Too many requests for your plan tier | Agent automatically backs off. Free: 60/min, Standard: 300/min, Premium: 600/min. Use `--concurrency 1` for conservative mode. |

---

## FAQ

**1. How do I get a Backlog API key?**
Log in to Backlog, go to Personal Settings > API > Register new API key. Copy the key and set it as `BACKLOG_API_KEY`.

**2. What is the difference between `backlog.com` and `backlog.jp`?**
`backlog.jp` is the legacy Japanese domain. `backlog.com` is the current international domain. Both work identically. Set `BACKLOG_DOMAIN` to match your space's domain.

**3. Can I create issues across multiple projects in one command?**
Yes, use `bl create --project DEV,QA,OPS --type Task --summary "Quarterly review"` to create the same issue template across projects.

**4. How do I link issues to Git pull requests?**
Include the issue key in the PR description or use `bl git --pr-create --issue DEV-143`. Backlog automatically links PRs that reference issue keys in commit messages.

**5. Can I export Gantt chart data?**
Yes. `bl report --project DEV --type gantt --format csv` exports all issues with start/due dates suitable for external Gantt tools. Include `--include-subtasks` for work breakdown structures.

**6. How do sprint boards work in Backlog?**
Sprints map to milestones with date ranges. `bl sprint --current` shows issues grouped by status for the active milestone. Velocity is calculated from estimated vs actual hours.

**7. Can I manage multiple spaces from one CLI?**
Yes. Use `--space other-team` to override `BACKLOG_SPACE_ID` per command, or maintain multiple config profiles in `~/.backlog-agent/config.yaml`.

**8. How do I bulk-import issues from CSV?**
Use `bl bulk --import ./issues.csv --project DEV`. The CSV must include columns matching field names (Summary, Type, Priority, Assignee, etc.). The agent validates all rows before importing.

**9. Does the agent support Backlog's webhook events?**
Yes. `bl webhook --create --project DEV --url https://ci.jenkins-server.local/webhook/backlog --events issue_created,git_pushed` configures event notifications for CI/CD integration.

**10. Can I track time spent on issues?**
Yes. Use `bl update DEV-143 --actual-hours 4.5` to log time. `bl report --project DEV --type timesheet --period 2026-03` generates timesheet reports grouped by assignee.

**11. How do I manage wiki page attachments?**
Upload: `bl wiki --project DEV --page W-001 --attach ./diagram.png`. The file is uploaded to shared storage and linked to the wiki page.

**12. What markup formats does the wiki support?**
Backlog supports its own markup and Markdown (project setting). The agent auto-detects the format. Use `--format markdown` or `--format backlog` to force a specific format.

---

## Data Storage

The Backlog Agent maintains local state for efficient operations:

```
~/.backlog-agent/
├── config.yaml                # Space, API key, default project settings
├── cache/
│   ├── spaces/
│   │   └── myteam.json        # Space info cache (TTL: 1 hour)
│   ├── projects/
│   │   ├── DEV.json           # Project metadata cache (TTL: 15 min)
│   │   ├── DEV_types.json     # Issue types cache (TTL: 1 hour)
│   │   ├── DEV_statuses.json  # Status list cache (TTL: 1 hour)
│   │   └── DEV_members.json   # Member list cache (TTL: 15 min)
│   └── recent_issues.json     # Recently accessed issues (TTL: 5 min)
├── templates/
│   ├── bug_report.json        # Issue creation templates
│   ├── feature_request.json
│   └── weekly_report.md       # Report generation templates
├── logs/
│   ├── api-2026-03.log        # Monthly API log (keys redacted)
│   ├── bulk_operations.log    # Bulk operation audit trail
│   └── errors.log             # Error details with context
└── exports/
    └── DEV_report_20260301.csv  # Generated reports (auto-cleanup: 30 days)
```

Project metadata and type definitions are cached aggressively since they change infrequently, dramatically reducing API calls during interactive sessions. Issue caches use short TTLs to ensure data freshness. All API keys are redacted from logs.

---

## Comparison

| Feature | Backlog Agent | Jira CLI | GitHub CLI | Linear CLI | Redmine CLI |
|---|---|---|---|---|---|
| Japanese UI/docs | Native (JP + EN) | Plugin required | EN only | EN only | Plugin |
| Issue tracking | Full CRUD + custom fields | Full CRUD | Issues only | Full CRUD | Full CRUD |
| Wiki built-in | Yes (native) | Confluence (separate) | No (use repo) | No | Yes |
| Git hosting | Built-in | Bitbucket (separate) | Native | No | Plugin |
| Gantt charts | Native | Plugin/Cloud | No | Cycles | Plugin |
| Sprint boards | Milestone-based | Scrum/Kanban | Projects | Cycles | Plugin |
| File storage | Per-space quota | Unlimited (Cloud) | LFS | No | Per-project |
| Pull requests | Built-in | Bitbucket | Native | No | No |
| Cross-project search | Yes | JQL | Limited | Yes | Yes |
| Pricing (small team) | Free (10 users) | Free (10 users) | Free (unlimited) | Free (250 issues) | Free (OSS) |
| Target market | Japan / APAC | Global | Global (developers) | Startups | Self-hosted |
