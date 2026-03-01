---
name: line-works-agent
description: Enterprise LINE communication — bots, messages, groups, calendar on Japan's business-grade LINE platform
author: hanabi-jpn
version: 1.0.0
tags:
  - messaging
  - enterprise
  - line
  - japan
  - collaboration
  - bots
  - calendar
  - communication
---

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   ██╗     ██╗███╗   ██╗███████╗                                  ║
  ║   ██║     ██║████╗  ██║██╔════╝                                  ║
  ║   ██║     ██║██╔██╗ ██║█████╗                                    ║
  ║   ██║     ██║██║╚██╗██║██╔══╝                                    ║
  ║   ███████╗██║██║ ╚████║███████╗                                  ║
  ║   ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝                                ║
  ║                                                                  ║
  ║   ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗                    ║
  ║   ██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝                    ║
  ║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ ███████╗                    ║
  ║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗ ╚════██║                    ║
  ║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗███████║                    ║
  ║    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝                  ║
  ║                                                                  ║
  ║                   A G E N T                                      ║
  ║      Enterprise Messaging from Your Terminal                     ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
```

`skill: line-works-agent` `platform: LINE WORKS` `protocol: OAuth2 REST` `lang: en/ja` `comms: enterprise`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/line-works-agent)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Enterprise](https://img.shields.io/badge/platform-enterprise_LINE-00C300)]()

> **Bring the full power of LINE WORKS to your command line -- send messages, manage bots, schedule meetings, and orchestrate enterprise communication without leaving the terminal.**

---

## Overview

LINE WORKS Agent puts Japan's dominant enterprise messaging platform at your fingertips through a comprehensive CLI. LINE WORKS (formerly known as Works Mobile) serves over 470,000 organizations across Japan and Southeast Asia, functioning as the business-grade evolution of LINE -- the messaging app used by 96 million people in Japan alone. While consumer LINE dominates personal communication, LINE WORKS adds enterprise features: admin-controlled accounts, audit logging, device management, and compliance-grade message retention. This agent gives you API-level access to every communication channel.

The agent supports the full LINE WORKS API surface: sending rich messages (text, images, stickers, flex messages, carousels), managing bot accounts for automated workflows, organizing groups and multi-party rooms, integrating with the built-in calendar for meeting scheduling, managing shared files and drives, and administering organization-wide settings. Japanese businesses rely heavily on LINE WORKS for both internal communication and external client contact, making it a critical integration point. The authentication uses service account JWT flow with RSA private key signing, ensuring secure server-to-server communication. Message delivery is confirmed via read receipts, and the agent can monitor delivery status for broadcast operations across hundreds of recipients.

```
  ┌─────────────────────────────────────────────────────────────┐
  │             LINE WORKS AGENT ARCHITECTURE                    │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │   Terminal CLI                                              │
  │       │                                                     │
  │       ▼                                                     │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Command    │───▶│  JWT Auth     │───▶│  LW API     │  │
  │   │  Router     │    │  (RSA Sign)   │    │  api.worksmobile │
  │   └─────────────┘    └───────────────┘    │   .com      │  │
  │        │                                  └──────┬──────┘  │
  │        ▼                                         │         │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Message    │    │  Bot          │    │  Group       │  │
  │   │  Composer   │    │  Manager      │    │  Controller  │  │
  │   └──────┬──────┘    └───────┬───────┘    └──────┬──────┘  │
  │          │                   │                   │         │
  │          └───────────────────┼───────────────────┘         │
  │                              │                             │
  │                              ▼                             │
  │                    ┌───────────────────┐                   │
  │                    │  Delivery Engine  │                   │
  │                    │  + Read Receipts  │                   │
  │                    └────────┬──────────┘                   │
  │                             │                              │
  │                ┌────────────┼────────────┐                 │
  │                ▼            ▼            ▼                 │
  │          ┌──────────┐ ┌──────────┐ ┌──────────┐           │
  │          │ Calendar │ │  File    │ │  Admin   │           │
  │          │ Sync     │ │  Share   │ │  Console │           │
  │          └──────────┘ └──────────┘ └──────────┘           │
  │                                                            │
  └─────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

When operating as the LINE WORKS Agent, adhere to the following rules:

1. Authenticate using service account JWT flow: sign with `LINEWORKS_PRIVATE_KEY`, include `LINEWORKS_SERVICE_ACCOUNT` and `LINEWORKS_CLIENT_ID` in token requests.
2. Always include `LINEWORKS_DOMAIN_ID` in API requests to scope to the correct organization.
3. Default API base to `https://www.worksapis.com/v1.0` for all endpoints.
4. Message content must respect LINE WORKS character limits: 10,000 chars for text, 5,000 chars for rich messages.
5. Bot messages must use a registered bot ID; validate bot ownership before sending.
6. Group operations require the acting user to have group admin privileges or domain admin role.
7. Calendar events must include timezone (default: Asia/Tokyo) and validate against double-booking when `--check-conflict` is set.
8. File uploads must not exceed 50 MB per file; warn and block larger files.
9. Broadcast messages must confirm recipient count before sending; require `--confirm` for groups larger than 100 members.
10. Never delete messages or groups without `--confirm` flag; prefer archiving groups over deletion.
11. Display all timestamps in JST (Asia/Tokyo) by default unless `--utc` flag is provided.
12. Rich message templates (flex, carousel) must be validated against LINE WORKS schema before sending.
13. Contact/address book operations must respect organization visibility rules; do not expose contacts across departments without admin scope.
14. Read receipt data should be displayed as percentages for broadcast messages and individual status for direct messages.
15. Rate limit API calls to 600 requests per minute for messaging, 100 for admin endpoints; implement backoff on 429.
16. Log all sent messages to `~/.lw-agent/sent.log` with timestamp, recipient, and message hash for audit.
17. Sticker messages must use valid LINE WORKS sticker package IDs; validate before sending.
18. Handle webhook callbacks for bot interactions by providing a local server mode with `lw bot --listen`.
19. Template messages must support variable substitution using `{{variable}}` syntax.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `LINEWORKS_CLIENT_ID` | Yes | -- | OAuth2 client ID from Developer Console |
| `LINEWORKS_CLIENT_SECRET` | Yes | -- | OAuth2 client secret |
| `LINEWORKS_SERVICE_ACCOUNT` | Yes | -- | Service account ID for server-to-server auth |
| `LINEWORKS_PRIVATE_KEY` | Yes | -- | Path to RSA private key PEM file or the key string |
| `LINEWORKS_DOMAIN_ID` | Yes | -- | Organization domain ID |

Set these in your shell profile or `.env` file:

```bash
export LINEWORKS_CLIENT_ID="lw_client_abc123"
export LINEWORKS_CLIENT_SECRET="lw_secret_xyz789"
export LINEWORKS_SERVICE_ACCOUNT="svc-account@mydomain"
export LINEWORKS_PRIVATE_KEY="/path/to/private_key.pem"
export LINEWORKS_DOMAIN_ID="domain_12345"
```

---

## Commands

### `lw send` -- Send messages to users or groups

```bash
$ lw send --to tanaka.kenji@mydomain --message "Meeting moved to 15:00. Please confirm."

  Message Sent
  ══════════════════════════════════════════════════════════════

  To:          Tanaka Kenji (tanaka.kenji@mydomain)
  Type:        Text
  Content:     Meeting moved to 15:00. Please confirm.
  Sent at:     2026-03-01 09:15:22 JST
  Message ID:  msg_7f8a9b0c1d2e3f4a
  Status:      Delivered
  Read:        Pending

  ── message sent in 0.21s ──

$ lw send --to tanaka.kenji@mydomain --type flex --template meeting-update \
    --vars '{"time":"15:00","room":"5F-A","agenda":"Q4 Review"}'

  Rich Message Sent
  ══════════════════════════════════════════════════════════════

  To:          Tanaka Kenji (tanaka.kenji@mydomain)
  Type:        Flex Message (template: meeting-update)
  Variables:   time=15:00, room=5F-A, agenda=Q4 Review
  Sent at:     2026-03-01 09:16:05 JST
  Message ID:  msg_8a9b0c1d2e3f4a5b
  Status:      Delivered

  ── rich message sent in 0.34s ──
```

### `lw bot` -- Manage bot accounts and automation

```bash
$ lw bot list

  Bot Accounts
  ══════════════════════════════════════════════════════════════

  Bot ID       Name                 Status    Members   Messages/Day
  ───────────  ───────────────────  ────────  ────────  ────────────
  bot_001      Attendance Bot       Active    280       450
  bot_002      IT Helpdesk          Active    280       120
  bot_003      Sales Notifier       Active    45        35
  bot_004      Meeting Reminder     Active    280       85
  bot_005      Onboarding Guide     Paused    0         0

  ── 5 registered bots (4 active) ──

$ lw bot send --bot bot_003 --group grp_sales_team \
    --message "New lead: Sakura Design Inc. requested a demo. Contact: sato@sakura-design.co.jp"

  Bot Message Sent
  ══════════════════════════════════════════════════════════════

  Bot:         Sales Notifier (bot_003)
  Group:       Sales Team (grp_sales_team, 12 members)
  Content:     New lead: Sakura Design Inc. requested a demo...
  Sent at:     2026-03-01 10:22:00 JST
  Message ID:  bmsg_3c4d5e6f7a8b9c0d
  Delivered:   12/12 members

  ── bot message sent in 0.28s ──
```

### `lw groups` -- Group and room management

```bash
$ lw groups list --type internal

  Groups (Internal)
  ══════════════════════════════════════════════════════════════

  Group ID       Name                    Members  Last Activity      Admin
  ─────────────  ──────────────────────  ───────  ─────────────────  ──────────────
  grp_all_staff  All Staff               280      2026-03-01 09:45   System
  grp_eng_team   Engineering Team         18      2026-03-01 09:30   Nakamura H.
  grp_sales_team Sales Team               12      2026-03-01 10:22   Suzuki Y.
  grp_mgmt       Management               8      2026-02-28 18:00   CEO
  grp_hr_admin   HR & Admin               6      2026-02-28 17:30   Yamamoto D.
  grp_project_x  Project X (Temp)        15      2026-03-01 08:55   Tanaka K.

  ── 6 internal groups ──

$ lw groups create --name "Q4 Planning Committee" --members tanaka.kenji,suzuki.yui,sato.mio

  Group Created
  ══════════════════════════════════════════════════════════════

  Group ID:    grp_q4_planning
  Name:        Q4 Planning Committee
  Members:     3
    - Tanaka Kenji (tanaka.kenji@mydomain)
    - Suzuki Yui (suzuki.yui@mydomain)
    - Sato Mio (sato.mio@mydomain)
  Admin:       You (creator)
  Created:     2026-03-01 10:30:00 JST

  [OK] Group created. Bot access: disabled (enable with --allow-bots)
```

### `lw calendar` -- Calendar and meeting management

```bash
$ lw calendar --user tanaka.kenji --date 2026-03-01

  Calendar: Tanaka Kenji (2026-03-01, Monday)
  ══════════════════════════════════════════════════════════════

  Time          Duration  Title                         Room         Attendees
  ────────────  ────────  ────────────────────────────  ───────────  ─────────
  09:00-09:30   30min     Morning Standup               5F-A         8
  10:00-11:00   60min     Client Call: Toyota Systems   (Online)     3
  13:00-14:00   60min     Design Review                 3F-B         5
  15:00-16:30   90min     Q4 Planning Kickoff           7F-Main      12
  17:00-17:30   30min     1-on-1 with Nakamura          (Online)     2

  Free slots:  09:30-10:00, 11:00-13:00, 14:00-15:00, 16:30-17:00, 17:30+

  ── 5 events today ──

$ lw calendar create \
    --title "Partnership Discussion" \
    --start "2026-03-05 14:00" \
    --end "2026-03-05 15:00" \
    --attendees tanaka.kenji,suzuki.yui,external@sakura-design.co.jp \
    --room "5F-A"

  Event Created
  ══════════════════════════════════════════════════════════════

  Event ID:    evt_9a8b7c6d5e4f
  Title:       Partnership Discussion
  Date:        2026-03-05 (Thursday) 14:00-15:00 JST
  Room:        5F-A (confirmed, no conflict)
  Attendees:   3
    - Tanaka Kenji (internal)        Pending
    - Suzuki Yui (internal)          Pending
    - external@sakura-design.co.jp   Invited (external)

  Invitations sent via LINE WORKS notification.

  ── event created in 0.45s ──
```

### `lw contacts` -- Organization address book

```bash
$ lw contacts --dept engineering

  Address Book: Engineering Department
  ══════════════════════════════════════════════════════════════

  Name              Account ID                  Title                  Phone (ext.)
  ────────────────  ──────────────────────────  ─────────────────────  ────────────
  Nakamura Haruto   nakamura.h@mydomain         Lead Engineer          3042
  Tanaka Kenji      tanaka.kenji@mydomain       Senior Engineer        3045
  Sato Mio          sato.mio@mydomain           Engineer               3048
  Kimura Yuto       kimura.yuto@mydomain        Junior Engineer        3051
  Chen Wei          chen.wei@mydomain           Contract Engineer      3055

  ── 5 contacts in Engineering ──
```

### `lw files` -- Shared file and drive management

```bash
$ lw files list --group grp_project_x --recent 10

  Shared Files: Project X
  ══════════════════════════════════════════════════════════════

  Name                              Size      Uploaded          By
  ──────────────────────────────    ────────  ────────────────  ──────────────
  Q4_proposal_v3.pptx               4.2 MB   2026-03-01 08:55  Tanaka K.
  budget_breakdown.xlsx              1.1 MB   2026-02-28 16:20  Kobayashi A.
  meeting_minutes_0228.pdf           320 KB   2026-02-28 18:15  Sato M.
  architecture_diagram.png           2.8 MB   2026-02-27 14:00  Nakamura H.
  vendor_comparison.docx             890 KB   2026-02-26 11:30  Suzuki Y.
  timeline_gantt.xlsx                560 KB   2026-02-25 09:45  Tanaka K.

  Storage used: 48.2 MB / 5.0 GB (0.9%)

  ── showing 6 most recent files ──

$ lw files upload --group grp_project_x --file ./status_report_0301.pdf

  File Uploaded
  ══════════════════════════════════════════════════════════════

  File:        status_report_0301.pdf
  Size:        245 KB
  Group:       Project X (grp_project_x)
  File ID:     file_2a3b4c5d6e7f
  Uploaded:    2026-03-01 10:45:00 JST
  Access:      Group members (15 users)

  [OK] File uploaded and shared with group.
```

### `lw tasks` -- Task board management

```bash
$ lw tasks --group grp_project_x

  Task Board: Project X
  ══════════════════════════════════════════════════════════════

  TO DO (4):
  ─────────────────────────────────────────────────────────────
  [ ] Finalize vendor selection          Due: Mar 5   Assignee: Suzuki Y.
  [ ] Update security requirements       Due: Mar 7   Assignee: Nakamura H.
  [ ] Prepare client demo environment    Due: Mar 10  Assignee: Kimura Y.
  [ ] Write integration test plan        Due: Mar 10  Assignee: Sato M.

  IN PROGRESS (2):
  ─────────────────────────────────────────────────────────────
  [~] API gateway implementation         Due: Mar 3   Assignee: Tanaka K.
  [~] Database migration script          Due: Mar 4   Assignee: Chen W.

  DONE (6):
  ─────────────────────────────────────────────────────────────
  [x] Requirements gathering             Done: Feb 20  Assignee: Tanaka K.
  [x] Architecture design doc            Done: Feb 22  Assignee: Nakamura H.
  [x] Prototype approval                 Done: Feb 25  Assignee: Suzuki Y.
  ...and 3 more

  ── 12 total tasks | 4 todo | 2 in progress | 6 done ──
```

### `lw search` -- Search messages across channels

```bash
$ lw search "proposal deadline" --period 2026-02

  Message Search: "proposal deadline"
  ══════════════════════════════════════════════════════════════

  Found 4 messages in February 2026:

  1. [2026-02-15 11:22] grp_project_x
     Tanaka Kenji: The proposal deadline has been moved to March 5th.
     Please update your sections by EOD March 3rd.

  2. [2026-02-18 09:05] grp_sales_team
     Suzuki Yui: Reminder - Sakura Design proposal deadline is Feb 28.
     Anyone need help with pricing section?

  3. [2026-02-22 16:40] Direct: Sato Mio → Tanaka Kenji
     Sato Mio: Can we discuss the proposal deadline extension?
     I need 2 more days for the technical appendix.

  4. [2026-02-28 08:30] grp_sales_team
     Suzuki Yui: Sakura Design proposal submitted before deadline!
     Great teamwork everyone.

  ── 4 results in 0.67s ──
```

### `lw broadcast` -- Send messages to multiple groups/users

```bash
$ lw broadcast --groups grp_all_staff \
    --message "Office will close early at 16:00 on March 3 due to building maintenance. Please plan accordingly." \
    --priority high

  Broadcast Preview
  ══════════════════════════════════════════════════════════════

  Recipients:   All Staff (280 members)
  Priority:     High (push notification)
  Content:      Office will close early at 16:00 on March 3...
  Sender:       System Admin Bot (bot_001)

  Confirm broadcast to 280 recipients? (y/N): y

  Sending...
  [████████████████████████████████████████] 280/280

  Delivery Report:
  ─────────────────────────────────────────────────────────────
  Delivered:    278 (99.3%)
  Failed:         2 (inactive accounts)
  Read (5min):  142 (50.7%)

  Failed recipients logged to ~/.lw-agent/broadcast_failures.log

  ── broadcast completed in 4.2s ──
```

### `lw admin` -- Organization administration

```bash
$ lw admin stats

  Organization Statistics
  ══════════════════════════════════════════════════════════════

  Domain:          mydomain (domain_12345)
  Plan:            LINE WORKS Premium
  Active Users:    280 / 300 (93.3% utilization)

  Usage (February 2026):
  ─────────────────────────────────────────────────────────────
  Messages sent:           124,500
  Files shared:              2,340 (18.5 GB)
  Calendar events:           1,890
  Bot interactions:          8,450
  Video calls:                 320 (avg duration: 42 min)

  Top Active Groups:
    All Staff            12,400 messages
    Engineering Team      8,200 messages
    Sales Team            5,100 messages

  Storage:
    Used:     245 GB / 1 TB (24.5%)
    Growth:   +12 GB this month

  ── admin stats as of 2026-03-01 ──
```

---

## Workflow Diagram

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  CLI User    │     │  Bot Webhook │     │  Calendar    │
  │  (Terminal)  │     │  (Incoming)  │     │  Event Trig. │
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  LINE WORKS Agent   │
                   │  (lw commands)      │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  Compose     │   │  Route to    │   │  Schedule    │
  │  Message     │   │  Bot/Group   │   │  Event       │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  LINE WORKS API     │
                   │  (Delivery Engine)  │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  Push        │   │  Read        │   │  Audit       │
  │  Notification│   │  Receipts    │   │  Log         │
  └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `JWT_SIGN_FAILED: Cannot read private key` | `LINEWORKS_PRIVATE_KEY` path wrong or key corrupted | Verify PEM file exists and has correct permissions (chmod 600); regenerate key pair in Developer Console |
| `AUTH_SCOPE_DENIED: bot.message scope required` | Service account lacks messaging permission | Add required scopes in Developer Console > App > OAuth Scopes |
| `GROUP_NOT_FOUND: grp_xxxx` | Group deleted or ID incorrect | List available groups with `lw groups list`; archived groups require `--include-archived` |
| `MESSAGE_TOO_LONG: 10,432 chars exceeds 10,000 limit` | Text message exceeds LINE WORKS character limit | Split message with `--auto-split` flag or shorten content |
| `FILE_TOO_LARGE: 62 MB exceeds 50 MB limit` | Upload exceeds per-file size limit | Compress file or split into parts; use external file share for larger assets |
| `RATE_LIMIT: 429 on messaging endpoint` | Exceeded 600 msg/min rate limit | Agent auto-retries with backoff; reduce broadcast batch size with `--batch 100` |
| `CALENDAR_CONFLICT: Room 5F-A booked 14:00-15:30` | Meeting room double-booking detected | Use `lw calendar --free-rooms` to find available rooms for the time slot |
| `DOMAIN_MISMATCH: external@other.com not in domain` | Attempting to manage user outside organization | External users can only receive messages, not be managed; use `--external` flag for cross-domain messaging |

---

## Data Storage

```
~/.lw-agent/
├── config/
│   └── config.json
├── auth/
│   └── tokens.json
├── cache/
│   ├── contacts.json
│   └── groups.json
├── templates/
│   ├── flex/
│   └── carousel/
├── broadcasts/
│   └── reports/
├── logs/
│   ├── sent.log
│   └── errors.log
└── secrets/
    └── .private_key_ref
```

Private keys are never copied or cached -- only the file path is stored. JWT tokens are encrypted at rest. All message content in the sent log is stored as SHA-256 hashes, not plaintext, to comply with data protection policies.

---

## Comparison Table

| Feature | LW Agent (CLI) | LINE WORKS Web | Slack | Microsoft Teams | Chatwork |
|---|---|---|---|---|---|
| Rich messages (Flex) | Yes (template + vars) | Partial | Block Kit | Adaptive Cards | No |
| Bot automation | Full API control | Web console | Full API | Full API | Webhook only |
| CLI messaging | Native | No | Limited (slackcat) | No | No |
| Calendar integration | Built-in | Built-in | Google/Outlook | Native (Outlook) | No |
| File sharing | Upload/download CLI | Web upload | Drag-drop | Drag-drop | Upload |
| Task boards | Group tasks | Group tasks | No (use Asana) | Planner | Task feature |
| Read receipts | Per-message tracking | Per-message | No | Partial | Read flag |
| External contacts | Yes (cross-domain) | Yes | Connect channels | Guest access | Contact rooms |
| Japanese localization | Native | Native | Basic | Basic | Native |
| Organization admin | Full CLI control | Web console | Web console | Admin center | Web console |
| Broadcast + reports | Batch + delivery stats | Manual | Channel post | Channel post | Group msg |
| Setup time | 5 minutes | N/A | N/A | N/A | N/A |

---

## FAQ

**Q1: How do I set up service account authentication?**
In the LINE WORKS Developer Console, create a new App, enable the Service Account, generate an RSA key pair, download the private key PEM file, and set the environment variables as described above.

**Q2: Can I send messages to external LINE WORKS users?**
Yes. Use `--external` flag with the full email address. The recipient's organization must allow external messaging. External contacts appear in a separate address book section.

**Q3: How do Flex Messages work?**
Flex Messages are rich, structured messages (like cards). Define templates in `~/.lw-agent/templates/` as JSON, then reference them with `--template name --vars '{}'`. The agent validates template structure before sending.

**Q4: Can bots respond to user messages automatically?**
Yes. Use `lw bot --listen --bot bot_001 --port 8080` to start a local webhook server. Configure the callback URL in Developer Console to point to your server (use ngrok for development).

**Q5: Is message content stored locally?**
No. The sent log stores only message metadata (recipient, timestamp, hash). Actual message content is stored on LINE WORKS servers per your organization's retention policy.

**Q6: Can I schedule messages for later delivery?**
Yes. Use `--schedule "2026-03-05 09:00"` to queue a message for future delivery. The agent uses a local scheduler that must be running (`lw daemon start`).

**Q7: How do I manage multiple LINE WORKS organizations?**
Use profiles: `lw config --profile org-b --domain-id domain_67890`. Switch between profiles with `--profile org-b` on any command.

**Q8: What sticker packages are available?**
LINE WORKS supports a subset of LINE stickers. Use `lw stickers --list` to see available packages. Custom stickers require LINE WORKS Premium plan.

**Q9: Can I export chat history for compliance?**
Admins can export message logs with `lw admin export --type messages --period 2026-02`. This requires admin-level API scope and complies with Japan's e-document storage requirements (denshi bunsho hozon hou).

**Q10: How do I integrate with other tools (Salesforce, Jira)?**
Use bot webhooks to bridge LINE WORKS with external services. The agent can pipe incoming bot messages to shell commands: `lw bot --listen | process_webhook.sh`.

**Q11: What happens if a broadcast partially fails?**
The delivery report lists all failed recipients with error reasons. Use `lw broadcast --retry --from broadcast_report_20260301.json` to retry only failed deliveries.

**Q12: Can I use LINE WORKS Agent in CI/CD pipelines?**
Absolutely. The agent runs headlessly with environment variable authentication. Common use case: `lw send --group grp_eng_team --message "Deploy v2.3.1 complete"` in your deployment script.
