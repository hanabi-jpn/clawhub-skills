---
name: google-workspace-agent
description: Unified Gmail, Calendar, Drive, Sheets, and Docs management from Claude Code
author: hanabi-jpn
version: 1.0.0
tags:
  - google-workspace
  - gmail
  - calendar
  - drive
  - sheets
  - docs
  - productivity
  - automation
---

```
   ____                   __       _       __         __
  / ___| ___   ___   __ _| | ___  | |     / /__  _ __| | _____ _ __   __ _  ___ ___
 | |  _ / _ \ / _ \ / _` | |/ _ \ | | /| / / _ \| '__| |/ / __| '_ \ / _` |/ __/ _ \
 | |_| | (_) | (_) | (_| | |  __/ | |/ |/ / (_) | |  |   <\__ \ |_) | (_| | (_|  __/
  \____|\___/ \___/ \__, |_|\___| |__/|__/ \___/|_|  |_|\_\___/ .__/ \__,_|\___\___|
                    |___/                                      |_|
     _                    _
    / \   __ _  ___ _ __ | |_
   / _ \ / _` |/ _ \ '_ \| __|     [Gmail] [Calendar] [Drive] [Sheets] [Docs]
  / ___ \ (_| |  __/ | | | |_        ===================================
 /_/   \_\__, |\___|_| |_|\__|       Five services. One command line.
         |___/
```

`gmail-cli` `calendar-sync` `drive-manager` `sheets-api` `docs-editor`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-blue)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green)]()
[![License](https://img.shields.io/badge/license-MIT-yellow)]()
[![Services](https://img.shields.io/badge/services-5_integrated-blueviolet)]()
[![Google API](https://img.shields.io/badge/Google_APIs-OAuth2.0-4285F4)]()

> **Your entire Google Workspace in the terminal -- read mail, schedule meetings, query spreadsheets, and edit documents without ever leaving Claude Code.**

---

## Overview

Google Workspace Agent bridges the gap between your development workflow and everyday productivity tools. Rather than context-switching between browser tabs for email, calendar, file storage, and spreadsheets, you issue concise commands within Claude Code and receive structured, actionable results. The agent unifies five core Google services under a single `gw` command prefix, enabling workflows that would otherwise require manual coordination across multiple interfaces.

The agent authenticates once via OAuth 2.0 with granular scopes for each service, ensuring you grant only the permissions you need. Session tokens are refreshed automatically, and all API interactions are logged locally for auditability. Cross-service automation is a first-class feature: you can extract data from a Sheet, compose a Gmail draft referencing that data, and attach a Drive file -- all in a single pipeline. The architecture is designed around composability, so individual commands can be chained together using standard shell pipes or the built-in `gw automate` workflow engine.

```
Architecture:

  +------------------+       +-------------------------+
  |   Claude Code    | ----> |  Google Workspace Agent |
  |   (User CLI)     |       |  (Unified Router)       |
  +------------------+       +-------------------------+
                                    |
                 +------------------+------------------+
                 |          |        |        |        |
                 v          v        v        v        v
           +---------+ +--------+ +------+ +------+ +------+
           |  Gmail  | |Calendar| | Drive| |Sheets| | Docs |
           |  API    | |  API   | |  API | |  API | |  API |
           +---------+ +--------+ +------+ +------+ +------+
                 |          |        |        |        |
                 v          v        v        v        v
           +---------+ +--------+ +------+ +------+ +------+
           | Messages| | Events | | Files| | Data | | Text |
           | Threads | | Slots  | |Folders| Ranges| |Edits |
           +---------+ +--------+ +------+ +------+ +------+
                                    |
                                    v
                          +-------------------+
                          |  ~/.gw-agent/     |
                          |  Local Cache &    |
                          |  Automation Rules |
                          +-------------------+
```

---

## System Prompt Instructions

You are Google Workspace Agent, a unified productivity assistant for Gmail, Calendar, Drive, Sheets, and Docs operating within Claude Code. Follow these rules precisely:

1. Authenticate using OAuth 2.0 credentials from environment variables. Request only the minimum required scopes for the operation being performed.
2. For Gmail operations, always display sender, subject, date, and a snippet preview. Never display full message bodies unless explicitly requested with `--full`.
3. When sending emails, always show a full preview of the message (To, CC, BCC, Subject, Body) and require explicit confirmation before sending.
4. Calendar events must include timezone information. Default to the user's system timezone detected from the OS. Convert all times for display using the local timezone.
5. When creating calendar events, check for scheduling conflicts and warn the user before confirming. Show overlapping events with their attendees.
6. Drive file listings must show: name, type, size, last modified date, owner, and sharing status. Sort by last modified descending by default.
7. For Sheets operations, preserve cell formatting and formulas. When writing data, show a diff preview before applying changes.
8. Docs editing must maintain existing document structure (headings, lists, tables). Insert content at the specified location without disrupting surrounding formatting.
9. Never delete emails, calendar events, Drive files, or document content without explicit confirmation. Always show what will be affected.
10. Cross-service references must be validated before execution. If a referenced file, event, or message does not exist, report the error clearly.
11. Attachment handling: support attaching Drive files to Gmail drafts by file ID or search query. Maximum attachment size is 25MB for Gmail.
12. Search queries across all services support natural language. Translate user intent into the appropriate service-specific query syntax (Gmail search operators, Drive query language, etc.).
13. Rate-limit API calls according to Google Workspace quotas: Gmail 250 quota units/second, Drive 1000 queries/100 seconds, Calendar 500 requests/100 seconds per user.
14. Cache frequently accessed data (contact list, calendar list, Drive folder tree) locally in `~/.gw-agent/cache/` with a 30-minute TTL.
15. For batch operations (bulk email, multi-file upload), show a progress indicator and support resumption if interrupted.
16. Maintain conversation context within a session. If the user says "reply to that email," resolve "that" to the most recently displayed message.
17. All timestamps in output must use ISO 8601 format with timezone offset, followed by a human-readable relative time (e.g., "2 hours ago").
18. Support piping output between services: `gw sheets read | gw mail-send --template` should compose an email using spreadsheet data as the body.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GOOGLE_CLIENT_ID` | Yes | -- | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | -- | OAuth 2.0 client secret |
| `GOOGLE_REFRESH_TOKEN` | Yes | -- | OAuth 2.0 refresh token with Workspace scopes |
| `GOOGLE_WORKSPACE_DOMAIN` | No | -- | Restrict operations to a specific Workspace domain |
| `GW_AGENT_CACHE_DIR` | No | `~/.gw-agent/` | Local cache and config directory |
| `GW_AGENT_DEFAULT_TIMEZONE` | No | System TZ | Override timezone for calendar operations |
| `GW_AGENT_MAX_RESULTS` | No | `25` | Default page size for list operations |
| `GW_AGENT_SEND_CONFIRM` | No | `true` | Require confirmation before sending emails |

---

## Commands

### `gw mail`
Search and read Gmail messages.

```
$ gw mail --unread --limit 5

 Gmail — 5 unread messages (142 total unread)

 ┌────┬──────────────────────────┬───────────────────────────────────────┬─────────────────────┐
 │ #  │ From                     │ Subject                              │ Date                │
 ├────┼──────────────────────────┼───────────────────────────────────────┼─────────────────────┤
 │ 1  │ Sarah Chen               │ Q1 Marketing Budget Approval         │ 2026-03-01 09:14 JST│
 │    │ sarah@acmecorp.com       │ "Hi team, please review the attached │ (32 minutes ago)    │
 │    │                          │  budget proposal for Q1..."          │                     │
 ├────┼──────────────────────────┼───────────────────────────────────────┼─────────────────────┤
 │ 2  │ GitHub                   │ [acme/api] Pull request #847 merged  │ 2026-03-01 08:52 JST│
 │    │ notifications@github.com │ "feat: add rate limiting middleware  │ (54 minutes ago)    │
 │    │                          │  has been merged into main..."       │                     │
 ├────┼──────────────────────────┼───────────────────────────────────────┼─────────────────────┤
 │ 3  │ Jira                     │ PROJ-1234 moved to In Review         │ 2026-03-01 08:30 JST│
 │    │ jira@acmecorp.atlassian  │ "Taro moved PROJ-1234 'Payment      │ (1 hour ago)        │
 │    │                          │  gateway integration' to review..."  │                     │
 ├────┼──────────────────────────┼───────────────────────────────────────┼─────────────────────┤
 │ 4  │ AWS Billing              │ Your March 2026 invoice is available │ 2026-03-01 06:00 JST│
 │    │ no-reply@aws.amazon.com  │ "Your total charges for February     │ (3 hours ago)       │
 │    │                          │  2026: $1,247.83..."                 │                     │
 ├────┼──────────────────────────┼───────────────────────────────────────┼─────────────────────┤
 │ 5  │ Tanaka Yuki              │ Re: Partnership Proposal             │ 2026-02-28 23:41 JST│
 │    │ tanaka@partner.co.jp     │ "Thank you for the detailed proposal.│ (10 hours ago)      │
 │    │                          │  We'd like to schedule a call..."    │                     │
 └────┴──────────────────────────┴───────────────────────────────────────┴─────────────────────┘

 Actions: gw mail read 1 | gw mail reply 5 | gw mail archive 3
```

### `gw mail-send`
Compose and send emails with preview.

```
$ gw mail-send --to "tanaka@partner.co.jp" --subject "Re: Partnership Proposal" \
  --body "Thank you for your interest. I'm available Thursday at 2 PM JST."

 Email Preview:

 To:      tanaka@partner.co.jp
 From:    me@acmecorp.com
 Subject: Re: Partnership Proposal
 Thread:  Re: Partnership Proposal (matched existing thread)

 Body:
 ────────────────────────────────────────────────────
 Thank you for your interest. I'm available Thursday
 at 2 PM JST. Would that work for your team?

 Best regards
 ────────────────────────────────────────────────────

 Attachments: None
 Send this email? (y/n): y

 Email sent successfully.
 Message ID: 18e4a2b7c9d3f1e0
 Thread ID: 18e4920ab1c2d3e4 (3 messages in thread)
```

### `gw calendar`
View upcoming calendar events.

```
$ gw calendar --days 3

 Calendar — Next 3 Days (2026-03-01 to 2026-03-03)

 SUNDAY, MARCH 1
 ─────────────────────────────────────────────────────────────
  09:00-09:30  Daily Standup                    [Engineering]
               Google Meet: meet.google.com/abc-defg-hij
               Attendees: team-eng@acmecorp.com (8 people)

  13:00-14:00  Product Review                   [Product]
               Room: Conference Room A (3F)
               Attendees: Sarah, Taro, Yuki

  16:00-16:30  1:1 with Manager                 [Personal]
               Google Meet: meet.google.com/xyz-uvwx-rst

 MONDAY, MARCH 2
 ─────────────────────────────────────────────────────────────
  09:00-09:30  Daily Standup                    [Engineering]
  10:00-11:00  Sprint Planning                  [Engineering]
  14:00-15:00  Client Call - Partner Corp       [Sales]
               Zoom: us02web.zoom.us/j/12345678

 TUESDAY, MARCH 3
 ─────────────────────────────────────────────────────────────
  09:00-09:30  Daily Standup                    [Engineering]
  11:00-12:00  Design Review                    [Design]
               Figma link attached

 Summary: 8 events across 3 days | 2 conflicts detected: None
```

### `gw calendar-create`
Create a new calendar event with conflict detection.

```
$ gw calendar-create --title "Partnership Discussion" --date "2026-03-05" \
  --time "14:00" --duration 60 --attendees "tanaka@partner.co.jp"

 Event Preview:

 Title:     Partnership Discussion
 Date:      2026-03-05 (Thursday)
 Time:      14:00 - 15:00 JST
 Duration:  60 minutes
 Location:  (none — add with --location or --meet)
 Attendees: tanaka@partner.co.jp

 Conflict Check:
  No conflicts found in 14:00-15:00 window.

 Add Google Meet link? (y/n): y

 Event created successfully.
 Event ID: ev_8x7k2m9p4q
 Google Meet: meet.google.com/pqr-stuv-wxy
 Calendar invite sent to: tanaka@partner.co.jp
```

### `gw drive`
Browse, search, and manage Drive files.

```
$ gw drive list --folder "Projects/2026"

 Google Drive — Projects/2026/

 ┌────┬──────────────────────────────┬──────────┬──────────┬─────────────────────┬──────────┐
 │ #  │ Name                         │ Type     │ Size     │ Modified            │ Sharing  │
 ├────┼──────────────────────────────┼──────────┼──────────┼─────────────────────┼──────────┤
 │ 1  │ Q1 Marketing Plan            │ Document │ --       │ 2026-02-28 15:22    │ Team     │
 │ 2  │ Budget_2026_v3.xlsx          │ Sheet    │ 245 KB   │ 2026-02-27 09:11    │ Private  │
 │ 3  │ Product Roadmap              │ Sheet    │ --       │ 2026-02-25 14:33    │ Company  │
 │ 4  │ Brand Guidelines v2.pdf      │ PDF      │ 12.4 MB  │ 2026-02-20 11:05    │ Anyone   │
 │ 5  │ Meeting Notes/               │ Folder   │ --       │ 2026-02-18 16:42    │ Team     │
 │ 6  │ Client Proposals/            │ Folder   │ --       │ 2026-02-15 10:30    │ Private  │
 └────┴──────────────────────────────┴──────────┴──────────┴─────────────────────┴──────────┘

 6 items | Total size: 12.7 MB | Storage used: 2.4 GB of 15 GB
```

### `gw sheets`
Read and write Google Sheets data.

```
$ gw sheets read "Budget_2026_v3" --range "A1:E6"

 Google Sheets — Budget_2026_v3 (Sheet1)
 Range: A1:E6

 ┌──────────────────┬───────────┬───────────┬───────────┬───────────┐
 │ Category         │ Q1 Budget │ Q1 Actual │ Q2 Budget │ Variance  │
 ├──────────────────┼───────────┼───────────┼───────────┼───────────┤
 │ Engineering      │ $450,000  │ $438,200  │ $470,000  │ -2.6%     │
 │ Marketing        │ $180,000  │ $192,400  │ $200,000  │ +6.9%     │
 │ Sales            │ $220,000  │ $215,800  │ $230,000  │ -1.9%     │
 │ Operations       │ $95,000   │ $91,300   │ $100,000  │ -3.9%     │
 │ TOTAL            │ $945,000  │ $937,700  │ $1,000,000│ -0.8%     │
 └──────────────────┴───────────┴───────────┴───────────┴───────────┘

 Last modified: 2026-02-27 09:11 by sarah@acmecorp.com
 Formulas detected in column E (Variance): =((C-B)/B)*100
```

### `gw docs`
Read and edit Google Docs documents.

```
$ gw docs read "Q1 Marketing Plan" --section "Executive Summary"

 Google Docs — Q1 Marketing Plan
 Section: Executive Summary (lines 4-18)

 ────────────────────────────────────────────────────────────────
 Executive Summary

 Q1 2026 focuses on three strategic pillars: brand awareness
 expansion in the APAC region, conversion rate optimization for
 the e-commerce platform, and launching the partner referral
 program. Total marketing budget is $180,000, a 12% increase
 from Q4 2025.

 Key targets:
   - Website traffic: 500K monthly sessions (+25% QoQ)
   - Conversion rate: 3.2% (+0.4pp)
   - New partner signups: 50 companies
   - Brand search volume: +30% YoY
 ────────────────────────────────────────────────────────────────

 Document stats: 2,847 words | 14 sections | Last edited: 2 days ago
```

### `gw search`
Search across all Workspace services simultaneously.

```
$ gw search "partnership proposal Q1"

 Cross-Service Search Results — "partnership proposal Q1"

 Gmail (3 results):
  1. From: tanaka@partner.co.jp — "Re: Partnership Proposal" (Feb 28)
  2. From: sarah@acmecorp.com — "FW: Partnership Proposal Draft" (Feb 25)
  3. From: me — "Partnership Proposal - Q1 Terms" (Feb 22)

 Drive (2 results):
  1. Partnership Proposal Q1 2026.docx (Document, Feb 24)
  2. Client Proposals/Partner Corp/terms_v2.pdf (PDF, Feb 20)

 Calendar (1 result):
  1. "Partnership Discussion" — 2026-03-05 14:00 JST

 Total: 6 results across 3 services (0.8s)
```

### `gw automate`
Create cross-service automation workflows.

```
$ gw automate create --name "Weekly Report Distribution" \
  --trigger "every Monday 09:00" \
  --steps 'sheets read "Weekly KPIs" A1:F10 | mail-send --to team@acmecorp.com --subject "Weekly KPIs"'

 Automation Created:

 Name:     Weekly Report Distribution
 Trigger:  Every Monday at 09:00 JST
 Steps:
  1. Read Google Sheet "Weekly KPIs" range A1:F10
  2. Format data as HTML table
  3. Send via Gmail to team@acmecorp.com
     Subject: "Weekly KPIs — {date}"

 Schedule:  Active
 Next run:  2026-03-02 09:00 JST (Monday)
 Rule ID:   auto_wkly_rpt_001

 Manage: gw automate list | gw automate pause auto_wkly_rpt_001
```

---

## Workflow

```
  User Command
       |
       v
  +-----------+     +-----------------+     +-------------------+
  | gw router | --> | Auth Manager    | --> | Service Dispatcher |
  | (parse)   |     | (OAuth2 tokens) |     | (Gmail/Cal/Drive/ |
  +-----------+     +-----------------+     |  Sheets/Docs)     |
                                            +-------------------+
                                                    |
                          +-------------------------+-------------------------+
                          |            |            |            |            |
                          v            v            v            v            v
                     +--------+  +--------+  +--------+  +--------+  +--------+
                     | Gmail  |  |Calendar|  | Drive  |  | Sheets |  |  Docs  |
                     | Module |  | Module |  | Module |  | Module |  | Module |
                     +--------+  +--------+  +--------+  +--------+  +--------+
                          |            |            |            |            |
                          v            v            v            v            v
                     +-----------------------------------------------------------+
                     |              Response Formatter                           |
                     |    (Tables, Previews, Diffs, Confirmations)               |
                     +-----------------------------------------------------------+
                                            |
                                            v
                                    Terminal Output
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_SCOPE_INSUFFICIENT: Missing Gmail scope` | Token does not include the required scope for the requested service | Re-authenticate with `gw auth --scopes gmail,calendar,drive,sheets,docs` to grant all necessary permissions. |
| `QUOTA_EXCEEDED: Gmail API rate limit` | Exceeded 250 quota units per second for Gmail | Reduce batch size. Use `--batch-size 10` for bulk operations. The agent will automatically queue and retry. |
| `FILE_NOT_FOUND: No file matching query` | Drive search returned zero results | Verify the file name and location. Use `gw drive search "partial name"` for fuzzy matching. Check Trash with `--include-trashed`. |
| `PERMISSION_DENIED: Cannot edit shared document` | User has view-only access to the target document | Request edit access from the file owner, or create a copy with `gw drive copy <file-id>`. |
| `CALENDAR_CONFLICT: Overlapping event detected` | New event overlaps with an existing event | Use `gw calendar free-slots --date <date>` to find available times. Add `--force` to create despite conflicts. |
| `ATTACHMENT_TOO_LARGE: File exceeds 25MB limit` | Gmail attachment size limit exceeded | Upload the file to Drive first with `gw drive upload`, then share the Drive link in the email body instead. |
| `SHEET_RANGE_INVALID: Range A1:ZZ9999 is out of bounds` | Requested range exceeds the sheet dimensions | Check sheet dimensions with `gw sheets info <name>`. Use valid ranges within the sheet's row/column count. |

---

## Data Storage

All local data is stored in `~/.gw-agent/`:

```
~/.gw-agent/
  ├── config.json               # Service configuration and preferences
  ├── tokens/
  │   ├── access_token.json     # Current access token (auto-refreshed)
  │   └── scopes.json           # Granted OAuth scopes
  ├── cache/
  │   ├── contacts.json         # Frequently used contacts (30min TTL)
  │   ├── calendars.json        # Calendar list and colors
  │   ├── drive_tree.json       # Folder structure snapshot
  │   └── labels.json           # Gmail label mappings
  ├── automations/
  │   └── rules.json            # Saved automation workflows
  └── drafts/
      └── draft_<id>.json       # Unsent email drafts
```

Sensitive tokens are stored with file permissions set to `600` (owner read/write only). No data is transmitted to any service other than Google APIs. The full cache can be purged with `gw cache clear`.

---

## Comparison Table

| Feature | GW Agent | Gmail Web | Google Apps Script | Zapier |
|---|---|---|---|---|
| Unified multi-service CLI | Yes | No (Gmail only) | Scriptable | Workflow-based |
| Natural language queries | Yes | Basic search | No | No |
| Cross-service automation | Built-in | No | Yes (code) | Yes (visual) |
| Real-time terminal output | Yes | Browser-based | Logs only | Dashboard |
| Email composition preview | Yes (inline) | Yes (UI) | No preview | Template-based |
| Calendar conflict detection | Automatic | Visual only | Manual code | Limited |
| Sheets formula preservation | Yes | N/A | Yes | Limited |
| Offline draft support | Yes | Browser cache | N/A | No |
| Setup complexity | 3 env vars | Browser login | Script project | OAuth + config |
| Cost | Free (open source) | Free | Free | $19.99+/mo |
| Developer workflow integration | Native (Claude Code) | None | IDE-based | Separate tool |

---

## FAQ

**1. How do I set up OAuth 2.0 credentials?**
Create a project in Google Cloud Console, enable the Gmail, Calendar, Drive, Sheets, and Docs APIs, create OAuth 2.0 credentials (Desktop app type), and run `gw auth init` to complete the authorization flow. The refresh token is saved automatically.

**2. Can I use this with a personal Gmail account?**
Yes. The agent works with both personal Google accounts and Google Workspace (business) accounts. Some features like domain-wide delegation require a Workspace account.

**3. Is my email data stored locally?**
Only metadata (subject lines, sender, date) is cached temporarily for performance. Full message bodies are fetched on-demand and never persisted to disk. Clear the cache anytime with `gw cache clear`.

**4. Can I send emails with attachments?**
Yes. Use `gw mail-send --attach /path/to/file.pdf` for local files or `gw mail-send --attach-drive <file-id>` for Drive files. Multiple attachments are supported. Total size must be under 25MB.

**5. How does cross-service search work?**
The `gw search` command queries Gmail, Drive, and Calendar APIs in parallel using the same search term, then merges and ranks results by relevance and recency.

**6. Can I edit Google Sheets formulas?**
Yes. The agent preserves formulas when reading and supports writing formulas with `gw sheets write --cell "E2" --formula "=SUM(B2:D2)"`. Formula validation is performed before writing.

**7. Does it support multiple Google accounts?**
Yes. Use `gw account add <alias>` to register additional accounts and switch with `gw account use <alias>`. Each account maintains its own token and cache.

**8. How do automations work?**
Automations are stored locally as cron-like rules in `~/.gw-agent/automations/rules.json`. They run when the agent is active. For persistent scheduling, export the rule to a system cron job with `gw automate export-cron`.

**9. Can I manage shared drives?**
Yes. Shared drives are listed with `gw drive list --shared-drives`. You can read, write, and manage files in shared drives if you have the appropriate permissions.

**10. Is there a way to bulk-send personalized emails?**
Yes. Use `gw mail-send --template draft.txt --data contacts.csv` to send personalized emails from a template with CSV data. Each email is sent individually (not BCC) with field substitution for personalization.

**11. How do I handle meeting room booking?**
Use `gw calendar-create --room "Conference Room A"` to book a room. The agent queries available rooms from your Workspace directory and shows availability before booking.

**12. Can I export calendar events to other formats?**
Yes. Use `gw calendar export --format ics --range "this week"` to export events as ICS files compatible with any calendar application.
