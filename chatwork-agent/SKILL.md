---
name: chatwork-agent
description: Automate Japan's #1 business chat — messages, tasks, rooms, bots via ChatWork API v2
author: hanabi-jpn
version: 1.0.0
tags:
  - chatwork
  - business-chat
  - japan
  - messaging
  - task-management
  - webhook
  - automation
  - api-v2
---

```
   ██████╗██╗  ██╗ █████╗ ████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
  ██╔════╝██║  ██║██╔══██╗╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
  ██║     ███████║███████║   ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝
  ██║     ██╔══██║██╔══██║   ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗
  ╚██████╗██║  ██║██║  ██║   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
              █████╗  ██████╗ ███████╗███╗   ██╗████████╗
             ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
             ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
             ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
             ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
             ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
```

`chatwork` `api-v2` `business-chat` `japan-saas` `task-automation`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Companies](https://img.shields.io/badge/companies-410K%2B-ff6b6b)]()
[![API](https://img.shields.io/badge/ChatWork_API-v2-4A154B)]()

> **Command the chat platform that powers 410,000+ Japanese businesses -- send messages, orchestrate tasks, and build bots without ever opening a browser.**

---

## Overview

ChatWork Agent is a comprehensive CLI skill that brings the full power of ChatWork API v2 directly into your terminal workflow. ChatWork (now officially "Chatwork") dominates the Japanese business communication landscape, serving as the primary hub for inter-company messaging, project task management, and file exchange across industries from manufacturing to IT consulting. This skill eliminates the context-switching overhead of managing chat operations through the web interface, allowing developers and operations teams to script, automate, and integrate ChatWork into their existing CI/CD pipelines, monitoring systems, and daily routines.

The agent handles the complete lifecycle of ChatWork operations: sending and reading messages with full Markdown and mention support, creating and tracking tasks with deadlines and assignees, managing rooms and their members with fine-grained permission control, uploading and retrieving files, processing webhook events for real-time bot development, and managing your contact network. Every command produces structured output suitable for piping into other tools, and the agent respects ChatWork's rate limits (5 requests/second) automatically with built-in retry logic and exponential backoff.

```
Architecture:

  ┌──────────────────────────────────────────────────────┐
  │                   ChatWork Agent CLI                  │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
  │  │ Messages │ │  Tasks   │ │  Rooms   │ │Webhooks │ │
  │  │  Module  │ │  Module  │ │  Module  │ │ Module  │ │
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
  │       │            │            │             │      │
  │  ┌────▼────────────▼────────────▼─────────────▼────┐ │
  │  │           Rate Limiter & Auth Layer             │ │
  │  │         (5 req/s, token management)             │ │
  │  └────────────────────┬────────────────────────────┘ │
  └───────────────────────┼──────────────────────────────┘
                          │ HTTPS
                          ▼
              ┌───────────────────────┐
              │  ChatWork API v2      │
              │  api.chatwork.com/v2  │
              └───────────────────────┘
```

---

## System Prompt Instructions

You are the ChatWork Agent, an automation specialist for ChatWork API v2. Follow these rules precisely:

1. Always authenticate using the `CHATWORK_API_TOKEN` header (`X-ChatWorkToken`). Never embed tokens in URLs.
2. Respect ChatWork API rate limits: maximum 5 requests per second. Implement automatic backoff when receiving HTTP 429 responses.
3. When sending messages, preserve ChatWork's message syntax: `[To:ACCOUNT_ID]` for mentions, `[info]...[/info]` for info blocks, `[code]...[/code]` for code blocks, `[hr]` for horizontal rules.
4. Room IDs are always integers. Validate input before making API calls. Use `CHATWORK_DEFAULT_ROOM_ID` as fallback when no room is specified.
5. Task deadlines must be Unix timestamps. Convert human-readable dates (e.g., "next Friday", "2026-03-15") to Unix timestamps before submission.
6. For bulk operations (sending to multiple rooms, creating multiple tasks), execute sequentially with 200ms delays to avoid rate limiting.
7. File uploads must use multipart/form-data encoding. Maximum file size is 5MB per the ChatWork API specification.
8. When listing messages, default to the last 100 messages unless `force=1` is specified. Warn users that `force=1` marks messages as read.
9. Handle webhook payloads by validating the `X-ChatWorkWebhookSignature` header using HMAC-SHA256 with `CHATWORK_WEBHOOK_SECRET`.
10. Format all output as structured text by default. Support `--json` flag for machine-readable JSON output on every command.
11. When creating tasks, require at least one assignee (`account_id`). Tasks without assignees are rejected by the API.
12. Preserve message encoding: ChatWork uses UTF-8 with support for emoji and Japanese characters (kanji, hiragana, katakana). Never strip or re-encode.
13. For contact management, distinguish between "contacts" (approved) and "requests" (pending). Never auto-approve contact requests.
14. Room operations require appropriate permissions: admin for deletion, member for posting. Check permissions before executing destructive operations.
15. Paginate results automatically: ChatWork API returns 100 items per page. Fetch subsequent pages transparently when total exceeds page size.
16. Log all API interactions to `~/.chatwork-agent/logs/` with timestamps for audit trails. Redact tokens from log output.
17. Support `[piconname:ACCOUNT_ID]` and `[picon:ACCOUNT_ID]` tags for avatar rendering references in messages.
18. When errors occur, provide the ChatWork error code, HTTP status, and a human-readable explanation with suggested remediation.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `CHATWORK_API_TOKEN` | Yes | - | API token from chatwork.com/service/packages/chatwork/subpackages/api/token |
| `CHATWORK_WEBHOOK_SECRET` | No | - | Secret for validating incoming webhook signatures (HMAC-SHA256) |
| `CHATWORK_DEFAULT_ROOM_ID` | No | - | Default room ID used when `--room` flag is omitted |
| `CHATWORK_RATE_LIMIT` | No | `5` | Maximum API requests per second (lower for shared tokens) |
| `CHATWORK_LOG_DIR` | No | `~/.chatwork-agent/logs` | Directory for API interaction audit logs |
| `CHATWORK_OUTPUT_FORMAT` | No | `text` | Default output format: `text` or `json` |

---

## Commands

### `cw send`
Send a message to a ChatWork room.

```bash
$ cw send --room 123456789 "Deployment complete for v2.3.1 on production"

  Message sent successfully
  Room:       #123456789 (開発チーム)
  Message ID: 1987654321
  Timestamp:  2026-03-01 14:32:05 JST
  Body:       Deployment complete for v2.3.1 on production
```

### `cw rooms`
List all rooms you belong to.

```bash
$ cw rooms

  ID           Name                    Type     Unread  Mentions  Members
  ───────────  ──────────────────────  ───────  ──────  ────────  ───────
  123456789    開発チーム               group    3       1         12
  234567890    営業部連絡               group    0       0         28
  345678901    田中さんDM              direct   1       1         2
  456789012    外部パートナー共有       group    15      3         8
  567890123    全社アナウンス           group    2       0         156

  Total: 5 rooms | 21 unread messages | 5 mentions
```

### `cw tasks`
List tasks in a room with status filtering.

```bash
$ cw tasks --room 123456789 --status open

  ID        Title                          Assignee     Deadline       Status
  ────────  ─────────────────────────────  ───────────  ─────────────  ──────
  90001     API認証修正                     石原さん     2026-03-05     open
  90002     テスト環境デプロイ              佐藤さん     2026-03-03     open
  90003     ドキュメント更新                山田さん     2026-03-07     open
  90004     クライアントレビュー準備        田中さん     2026-03-10     open

  Open: 4 | Done: 12 | Total: 16
```

### `cw task-create`
Create a new task with assignees and deadline.

```bash
$ cw task-create --room 123456789 --body "Review PR #482 for security audit" \
    --assignees 1001,1002 --deadline "2026-03-05"

  Task created successfully
  Task ID:    90005
  Room:       #123456789 (開発チーム)
  Body:       Review PR #482 for security audit
  Assignees:  石原 達也, 佐藤 花子
  Deadline:   2026-03-05 23:59:59 JST
  Status:     open
```

### `cw members`
List members of a room with their roles.

```bash
$ cw members --room 123456789

  Account ID   Name           Role          Department
  ───────────  ─────────────  ────────────  ──────────────
  1001         石原 達也       admin         Engineering
  1002         佐藤 花子       member        Engineering
  1003         田中 太郎       member        Design
  1004         山田 次郎       readonly      QA

  Total: 4 members (1 admin, 2 members, 1 readonly)
```

### `cw files`
List and manage files in a room.

```bash
$ cw files --room 123456789

  File ID   Name                       Size      Uploaded By    Date
  ────────  ─────────────────────────  ────────  ─────────────  ──────────
  5001      設計書_v3.pdf               2.4 MB    石原 達也      2026-02-28
  5002      wireframe_final.png         890 KB    田中 太郎      2026-02-27
  5003      meeting_notes_0225.md       12 KB     佐藤 花子      2026-02-25
  5004      quarterly_report.xlsx       1.1 MB    山田 次郎      2026-02-20

  Total: 4 files | 4.4 MB used
```

### `cw search`
Search messages across rooms.

```bash
$ cw search "deploy production" --limit 5

  Results for "deploy production" (5 of 23 matches):

  Room: 開発チーム (#123456789)
  [2026-03-01 14:32] 石原 達也:
    Deployment complete for v2.3.1 on production

  Room: 開発チーム (#123456789)
  [2026-02-25 09:15] 佐藤 花子:
    Ready to deploy production build. All tests passing.

  Room: 外部パートナー共有 (#456789012)
  [2026-02-20 16:45] 田中 太郎:
    Production deploy scheduled for Friday 18:00 JST

  ... 20 more results (use --limit to show more)
```

### `cw webhook`
Configure and manage webhook endpoints.

```bash
$ cw webhook list

  Webhook ID   Room            Events              URL                           Status
  ───────────  ──────────────  ──────────────────  ────────────────────────────  ──────
  WH-001       開発チーム       message_created     https://bot.example.com/cw    active
  WH-002       営業部連絡       message_created     https://crm.example.com/hook  active
  WH-003       全社アナウンス   member_joined        https://hr.example.com/hook   paused

  Total: 3 webhooks (2 active, 1 paused)
```

### `cw contacts`
Manage your contact list.

```bash
$ cw contacts

  Account ID   Name             Organization           Department
  ───────────  ───────────────  ─────────────────────  ──────────────
  1001         石原 達也         ClawHub Inc.           Engineering
  2001         鈴木 一郎         Partner Corp.          Sales
  2002         高橋 美咲         Client LLC             Marketing
  3001         渡辺 健太         Vendor Co.             Support

  Total: 4 contacts | 0 pending requests
```

### `cw status`
Show account status and API usage.

```bash
$ cw status

  Account:     石原 達也 (ID: 1001)
  Plan:        Business (ビジネスプラン)
  Org:         ClawHub Inc.
  API Limit:   5 req/s
  Used Today:  342 / 100,000 requests
  Remaining:   99,658
  Reset:       2026-03-02 00:00:00 JST

  Rooms:  5   Tasks (open): 4   Unread: 21   Mentions: 5
```

---

## Workflow

```
  User Input                   ChatWork Agent                  ChatWork API
  ──────────                   ──────────────                  ────────────
      │                              │                              │
      │  cw send --room 123 "msg"    │                              │
      ├─────────────────────────────►│                              │
      │                              │  Validate token & room ID    │
      │                              │  Format message body         │
      │                              │  POST /v2/rooms/123/messages │
      │                              ├─────────────────────────────►│
      │                              │                              │
      │                              │  200 OK {message_id: 999}    │
      │                              │◄─────────────────────────────┤
      │                              │  Log to audit trail          │
      │  ✓ Message sent (ID: 999)    │  Format output               │
      │◄─────────────────────────────┤                              │
      │                              │                              │
      │  cw tasks --status open      │                              │
      ├─────────────────────────────►│                              │
      │                              │  GET /v2/rooms/DEF/tasks     │
      │                              ├─────────────────────────────►│
      │                              │  200 OK [{task}, {task}...]  │
      │                              │◄─────────────────────────────┤
      │  Table of open tasks         │  Filter by status            │
      │◄─────────────────────────────┤  Render table                │
      │                              │                              │
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `401 Unauthorized: Invalid API token` | Token is missing, expired, or revoked | Regenerate token at ChatWork admin panel > API Token. Verify `CHATWORK_API_TOKEN` is set correctly. |
| `403 Forbidden: Insufficient permissions` | Your role in the room does not permit this action (e.g., readonly posting) | Request admin to upgrade your role. Use `cw members --room ID` to check your current role. |
| `429 Too Many Requests` | API rate limit exceeded (5 req/s) | Agent retries automatically with exponential backoff. For bulk operations, reduce `CHATWORK_RATE_LIMIT` to 3. |
| `404 Not Found: Room does not exist` | Room ID is invalid or you have been removed from the room | Verify room ID with `cw rooms`. Confirm you are still a member. Check for typos in the room ID. |
| `413 Payload Too Large` | File upload exceeds 5MB limit | Compress the file before upload. Split large files. ChatWork Business plan allows up to 5GB storage total. |
| `400 Bad Request: Missing assignee` | Task creation without at least one assignee | Always specify `--assignees` with one or more comma-separated account IDs. Use `cw members` to get valid IDs. |
| `Connection timeout` | Network issues or ChatWork service disruption | Check https://status.chatwork.com for outages. Verify network connectivity. Agent retries up to 3 times. |

---

## FAQ

**1. How do I get a ChatWork API token?**
Log in to ChatWork, go to Settings > API Token (or visit `chatwork.com/service/packages/chatwork/subpackages/api/token`). Copy the token and set it as `CHATWORK_API_TOKEN`.

**2. Can I send messages to multiple rooms at once?**
Yes, use a comma-separated list: `cw send --room 111,222,333 "message"`. The agent sends sequentially with rate-limit-safe delays.

**3. How do I mention someone in a message?**
Use ChatWork's mention syntax: `cw send --room 123 "[To:1001]石原さん Please review the PR"`. The account ID is required.

**4. What is the message format for info blocks?**
Wrap content in `[info][title]Title Here[/title]Body content here[/info]` for highlighted information blocks.

**5. Can I use this with ChatWork free plan?**
Yes, the API is available on all plans. Free plan has lower rate limits and fewer integrations, but core messaging and task APIs work identically.

**6. How do webhook signatures work?**
Set `CHATWORK_WEBHOOK_SECRET`, and the agent validates incoming payloads using HMAC-SHA256 against the `X-ChatWorkWebhookSignature` header automatically.

**7. How do I create a task with a deadline?**
Use human-readable dates: `cw task-create --room 123 --body "Review docs" --assignees 1001 --deadline "2026-03-15"`. The agent converts to Unix timestamp automatically.

**8. Can I download files from a room?**
Yes: `cw files --room 123 --download 5001 --output ./downloads/`. The agent handles authentication and streaming.

**9. What happens when I exceed the API rate limit?**
The agent automatically queues requests and retries with exponential backoff (1s, 2s, 4s). No data is lost.

**10. Can I filter rooms by type?**
Yes: `cw rooms --type group` shows only group chats. Options are `direct`, `group`, and `my` (your personal chat).

**11. How do I bulk-update task statuses?**
Use `cw tasks --room 123 --status open --mark-done --ids 90001,90002,90003` to close multiple tasks at once.

**12. Is there support for ChatWork's organization management API?**
Organization-level APIs (member provisioning, plan management) require OAuth2 and admin privileges. Set `CHATWORK_ORG_TOKEN` for these operations.

---

## Data Storage

The ChatWork Agent stores operational data locally for performance and auditability:

```
~/.chatwork-agent/
├── config.yaml          # Connection settings and defaults
├── cache/
│   ├── rooms.json       # Room list cache (TTL: 5 minutes)
│   ├── members/         # Per-room member cache (TTL: 10 minutes)
│   └── contacts.json    # Contact list cache (TTL: 30 minutes)
├── logs/
│   ├── api-2026-03.log  # Monthly API interaction logs (tokens redacted)
│   └── errors.log       # Error log with stack traces
└── webhooks/
    └── payloads/        # Incoming webhook payload archive (7-day retention)
```

All cached data respects TTL values and is refreshed automatically. Logs rotate monthly and retain 90 days by default. Sensitive tokens are never written to disk in plaintext.

---

## Comparison

| Feature | ChatWork Agent | Slack CLI | Teams CLI | LINE WORKS CLI |
|---|---|---|---|---|
| Japanese business focus | Native (410K+ companies) | Limited | Limited | Partial |
| Task management built-in | Yes (full CRUD) | No (needs apps) | No (needs Planner) | No |
| API rate handling | Automatic backoff | Manual | Manual | Manual |
| File sharing | Yes (5MB/file) | Yes (1GB/file) | Yes | Yes |
| Webhook support | Native + signature | Native | Connector-based | Partial |
| Mention syntax | `[To:ID]` native | `@user` | `@user` | `@user` |
| Info/code blocks | `[info]` `[code]` tags | Markdown | Markdown | Limited |
| Offline CLI mode | Cached reads | No | No | No |
| Inter-company chat | Native feature | Connect (paid) | External access | Limited |
| Pricing | Free tier available | Free tier available | Bundled w/ M365 | Paid only |
