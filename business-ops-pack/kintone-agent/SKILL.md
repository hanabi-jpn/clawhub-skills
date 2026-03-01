---
name: kintone-agent
description: Build, query, and automate Cybozu kintone apps — Japan's leading no-code business platform
author: hanabi-jpn
version: 1.0.0
tags:
  - kintone
  - cybozu
  - no-code
  - business-apps
  - japan
  - database
  - workflow
  - automation
---

```
╔═══════════════════════════════════════════════════╗
║  ┌───────────────────────────────────────────┐    ║
║  │  K I N T O N E   A G E N T               │    ║
║  │     ━━━━━━━━━━━━━━━━━━━━━━                │    ║
║  │  🔧 Apps → Records → Workflow → Bulk     │    ║
║  │     Cybozu No-Code Platform CLI           │    ║
║  └───────────────────────────────────────────┘    ║
╚═══════════════════════════════════════════════════╝
```

`kintone` `cybozu` `no-code` `business-apps` `workflow-engine`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Apps](https://img.shields.io/badge/apps-no--code_platform-blueviolet)]()
[![Platform](https://img.shields.io/badge/Cybozu-kintone-003DA5)]()

> **Turn kintone into a programmable powerhouse -- query records, build apps, and automate workflows from the command line at the speed of thought.**

---

## Overview

kintone Agent bridges the gap between Cybozu kintone's intuitive no-code interface and the power-user demands of developers, system integrators, and IT administrators who need programmatic control over their business applications. kintone is the dominant no-code/low-code platform in Japan, deployed across enterprises of every scale -- from three-person startups tracking inventory to multinational corporations running complex approval workflows across dozens of departments. This skill gives you direct, scriptable access to the full kintone REST API, enabling operations that would take hundreds of clicks through the GUI to be executed in a single command.

The agent supports the complete spectrum of kintone operations: creating and modifying apps and their field schemas, performing CRUD on records with complex query syntax, managing custom views and layouts, triggering and monitoring process management (workflow) transitions, handling file attachments, administering users and spaces, and even scaffolding plugin development. Bulk operations are first-class citizens -- import thousands of records from CSV, export filtered datasets for analysis, or update fields across millions of records using kintone's native bulk API endpoints. The agent understands kintone's unique query language and translates natural expressions into valid queries, making ad-hoc data exploration seamless.

```
Architecture:

  ┌──────────────────────────────────────────────────────────┐
  │                    kintone Agent CLI                      │
  │                                                          │
  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
  │  │  Apps   │ │ Records │ │ Workflow │ │    Bulk      │  │
  │  │ Manager │ │  Engine │ │  Engine  │ │  Processor   │  │
  │  └────┬────┘ └────┬────┘ └────┬─────┘ └──────┬───────┘  │
  │       │           │           │               │          │
  │  ┌────▼───────────▼───────────▼───────────────▼────────┐ │
  │  │            Query Builder & Validator                 │ │
  │  │    (kintone query syntax ↔ natural language)         │ │
  │  └──────────────────────┬──────────────────────────────┘ │
  │                         │                                │
  │  ┌──────────────────────▼──────────────────────────────┐ │
  │  │       Auth Layer (API Token / Password / OAuth)      │ │
  │  └──────────────────────┬──────────────────────────────┘ │
  └─────────────────────────┼────────────────────────────────┘
                            │ HTTPS
                            ▼
               ┌─────────────────────────┐
               │   {subdomain}.cybozu.com │
               │     kintone REST API     │
               └─────────────────────────┘
```

---

## System Prompt Instructions

You are the kintone Agent, a specialist in Cybozu kintone platform automation. Follow these rules precisely:

1. Authenticate using API tokens (`X-Cybozu-API-Token` header) by default. Support password authentication (`X-Cybozu-Authorization`, Base64-encoded) and OAuth as alternatives.
2. All API requests target `https://{KINTONE_DOMAIN}/k/v1/`. Validate the domain format before making requests; it must end with `.cybozu.com` or `.kintone.com`.
3. Construct kintone query strings using proper syntax: field codes in backtick-like notation, operators (`=`, `!=`, `>`, `<`, `>=`, `<=`, `in`, `not in`, `like`, `not like`), and combinators (`and`, `or`). Always validate query syntax before execution.
4. Handle kintone's unique field types correctly: `SINGLE_LINE_TEXT`, `MULTI_LINE_TEXT`, `NUMBER`, `CALC`, `RICH_TEXT`, `CHECK_BOX`, `RADIO_BUTTON`, `DROP_DOWN`, `MULTI_SELECT`, `DATE`, `TIME`, `DATETIME`, `FILE`, `LINK`, `USER_SELECT`, `ORGANIZATION_SELECT`, `GROUP_SELECT`, `SUBTABLE`, `RECORD_NUMBER`, `CREATOR`, `MODIFIER`, `CREATED_TIME`, `UPDATED_TIME`, `STATUS`, `STATUS_ASSIGNEE`, `CATEGORY`.
5. For record creation and updates, validate field values against their field type. Reject invalid data before making API calls (e.g., non-numeric values for NUMBER fields).
6. Bulk operations must use the `/records.json` endpoint with arrays. Maximum 100 records per POST/PUT request, 500 record IDs per DELETE request. Chunk automatically for larger datasets.
7. When exporting data, default to CSV format. Support JSON, TSV, and Excel formats. Include header row with field labels (not field codes) by default.
8. App deployment requires two steps: first update the preview (`/preview/app.json`), then deploy (`/preview/app/deploy.json`). Always confirm deployment status before reporting success.
9. File operations use the `/file.json` endpoint. Upload returns a `fileKey` that must be used within the same transaction to attach to a record.
10. Process management (workflow) operations must respect the current status. Only valid transitions from the current status are permitted. Use `/record/status.json` for transitions.
11. Space and thread operations target `/space.json` and `/space/thread.json`. Guest spaces have separate endpoints under `/guest/{spaceId}/`.
12. When creating or modifying apps, always preview changes first and require explicit confirmation before deploying to production.
13. Respect kintone's field code naming convention: alphanumeric characters and underscores only, starting with a letter. Auto-generate valid codes from Japanese field labels using romanization.
14. Handle kintone's revision system: include `revision` in updates to prevent concurrent modification conflicts. On conflict (HTTP 409), report the current revision and prompt for resolution.
15. Support lookup fields by resolving related app references. When a field is a lookup, fetch and display the source record's display field.
16. Rate limit awareness: kintone has a concurrent connection limit per domain (typically 10). Queue requests and process with appropriate concurrency.
17. For plugin development scaffolding, generate the `manifest.json`, `config.json`, and directory structure per Cybozu's plugin specification.
18. Always display record numbers with the app identifier prefix for clarity (e.g., `APP-42 #1234`).

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `KINTONE_DOMAIN` | Yes | - | Your kintone subdomain (e.g., `mycompany.cybozu.com`) |
| `KINTONE_API_TOKEN` | Yes | - | API token generated from app settings (can be comma-separated for multi-app access) |
| `KINTONE_USERNAME` | No | - | Login username for password-based authentication (alternative to API token) |
| `KINTONE_PASSWORD` | No | - | Login password (used with `KINTONE_USERNAME`, Base64-encoded in transit) |
| `KINTONE_GUEST_SPACE_ID` | No | - | Guest space ID for accessing guest space apps |
| `KINTONE_OUTPUT_FORMAT` | No | `table` | Default output format: `table`, `json`, `csv` |
| `KINTONE_CONCURRENCY` | No | `5` | Maximum concurrent API connections (max 10 per domain) |

---

## Commands

### `kt apps`
List all accessible kintone apps.

```bash
$ kt apps

  App ID  Name                      Creator        Records  Updated
  ──────  ────────────────────────  ─────────────  ───────  ────────────
  1       顧客管理                   石原 達也      12,847   2026-03-01
  5       案件管理                   佐藤 花子      3,291    2026-02-28
  12      日報アプリ                 田中 太郎      45,102   2026-03-01
  18      経費申請                   山田 次郎      8,553    2026-02-27
  24      在庫管理                   鈴木 一郎      1,205    2026-03-01
  31      採用管理                   高橋 美咲      423      2026-02-25

  Total: 6 apps accessible with current token
```

### `kt records`
Fetch records from an app with optional query filtering.

```bash
$ kt records --app 1 --query "会社名 like \"Tech\" and ステータス in (\"商談中\", \"提案済\")" --limit 5

  #      会社名              担当者      ステータス  売上見込     最終連絡
  ─────  ──────────────────  ──────────  ──────────  ──────────  ──────────
  #1042  Tech Solutions      石原 達也   商談中      ¥5,400,000  2026-02-28
  #1089  TechBridge Corp     佐藤 花子   提案済      ¥3,200,000  2026-02-25
  #1134  NextTech Inc.       石原 達也   商談中      ¥8,100,000  2026-03-01
  #1201  TechForward Ltd.    田中 太郎   提案済      ¥1,800,000  2026-02-20
  #1256  GreenTech Japan     山田 次郎   商談中      ¥4,500,000  2026-02-27

  Showing 5 of 23 matching records (App: 顧客管理)
```

### `kt create`
Create a new record in an app.

```bash
$ kt create --app 1 --data '{"会社名": "New Startup Inc.", "担当者": "石原 達也", "ステータス": "初回接触", "電話番号": "03-1234-5678"}'

  Record created successfully
  App:        顧客管理 (App ID: 1)
  Record:     #12848
  Revision:   1
  Fields set: 会社名, 担当者, ステータス, 電話番号
  Timestamp:  2026-03-01 15:22:10 JST
```

### `kt update`
Update an existing record.

```bash
$ kt update --app 1 --id 1042 --data '{"ステータス": "受注", "売上見込": 5800000}'

  Record updated successfully
  App:        顧客管理 (App ID: 1)
  Record:     #1042
  Revision:   14 → 15
  Changed:    ステータス (商談中 → 受注), 売上見込 (¥5,400,000 → ¥5,800,000)
  Timestamp:  2026-03-01 15:25:33 JST
```

### `kt search`
Search across multiple apps with natural language.

```bash
$ kt search "overdue tasks assigned to Ishihara" --apps 5,12

  App: 案件管理 (ID: 5) — 3 matches
  #301  サーバー移行プロジェクト   期限: 2026-02-20  ステータス: 進行中
  #445  API連携開発                期限: 2026-02-25  ステータス: 進行中
  #512  セキュリティ監査対応       期限: 2026-02-28  ステータス: 進行中

  App: 日報アプリ (ID: 12) — 0 matches

  Total: 3 overdue records across 2 apps
```

### `kt bulk`
Perform bulk operations on records.

```bash
$ kt bulk --app 1 --action update --query "ステータス = \"初回接触\" and 最終連絡 < \"2025-12-01\"" \
    --set '{"ステータス": "休眠"}'

  Bulk update preview:
  App:         顧客管理 (App ID: 1)
  Matching:    847 records
  Action:      Set ステータス → "休眠"

  Proceed? [y/N]: y

  Processing: [████████████████████████████████████████] 847/847

  Bulk update complete
  Updated:  847 records
  Failed:   0 records
  Duration: 12.3 seconds (9 API calls)
```

### `kt fields`
Inspect the field schema of an app.

```bash
$ kt fields --app 1

  Field Code       Label         Type              Required  Unique
  ───────────────  ────────────  ────────────────  ────────  ──────
  会社名           会社名        SINGLE_LINE_TEXT  Yes       Yes
  担当者           担当者        USER_SELECT       Yes       No
  ステータス       ステータス    DROP_DOWN         Yes       No
  電話番号         電話番号      SINGLE_LINE_TEXT  No        No
  売上見込         売上見込      NUMBER            No        No
  最終連絡         最終連絡      DATE              No        No
  添付ファイル     添付ファイル  FILE              No        No
  備考             備考          MULTI_LINE_TEXT   No        No

  Total: 8 fields (+3 system fields: Record number, Creator, Updated)
```

### `kt export`
Export records to a file.

```bash
$ kt export --app 1 --format csv --query "ステータス != \"休眠\"" --output ./customers_active.csv

  Exporting records from 顧客管理 (App ID: 1)
  Query:    ステータス != "休眠"
  Format:   CSV (UTF-8 with BOM for Excel compatibility)
  Records:  12,000 matching

  Downloading: [████████████████████████████████████████] 12,000/12,000

  Export complete
  File:     ./customers_active.csv
  Size:     4.2 MB
  Records:  12,000
  Columns:  8 fields + Record number
```

### `kt import`
Import records from a file.

```bash
$ kt import --app 1 --file ./new_customers.csv --mode insert

  Import preview:
  App:        顧客管理 (App ID: 1)
  File:       ./new_customers.csv
  Mode:       Insert (new records only)
  Records:    250
  Validation: All 250 records pass schema validation

  Proceed? [y/N]: y

  Importing: [████████████████████████████████████████] 250/250

  Import complete
  Inserted: 250 records (#12849 - #13098)
  Skipped:  0
  Errors:   0
```

### `kt workflow`
Manage process management (workflow) transitions.

```bash
$ kt workflow --app 5 --id 301 --action "承認"

  Workflow transition executed
  App:        案件管理 (App ID: 5)
  Record:     #301 (サーバー移行プロジェクト)
  Action:     承認
  Previous:   レビュー待ち → Assignee: 石原 達也
  Current:    承認済み → Assignee: 佐藤 花子
  Revision:   22 → 23
  Timestamp:  2026-03-01 16:05:44 JST
```

---

## Workflow

```
  Developer                  kintone Agent                kintone API
  ─────────                  ─────────────                ───────────
      │                            │                           │
      │  kt records --app 1       │                           │
      │  --query "status=active"   │                           │
      ├───────────────────────────►│                           │
      │                            │  Parse & validate query   │
      │                            │  Translate field names     │
      │                            │                           │
      │                            │  GET /k/v1/records.json   │
      │                            ├──────────────────────────►│
      │                            │  {records: [...], total}  │
      │                            │◄──────────────────────────┤
      │                            │                           │
      │                            │  More pages? Auto-fetch   │
      │                            ├──────────────────────────►│
      │                            │◄──────────────────────────┤
      │                            │                           │
      │  Formatted table output    │  Merge & format results   │
      │◄───────────────────────────┤                           │
      │                            │                           │
      │  kt bulk --action update   │                           │
      ├───────────────────────────►│                           │
      │                            │  Count matching records   │
      │  "847 records. Proceed?"   │  Show preview             │
      │◄───────────────────────────┤                           │
      │  y                         │                           │
      ├───────────────────────────►│  Chunk into 100-record    │
      │                            │  batches, execute in      │
      │                            │  parallel (concurrency=5) │
      │                            ├──────────────────────────►│
      │                            │◄──────────────────────────┤
      │  "847 updated. 0 errors."  │  Aggregate results        │
      │◄───────────────────────────┤                           │
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `520 CB_ILLEGAL_TOKEN: API token is invalid` | Token does not have permission for the target app or is malformed | Regenerate the API token in the app's settings. Ensure the token has the required permissions (view, add, edit, delete). |
| `409 CB_CONFLICT: Record revision mismatch` | Another user modified the record between your read and update | Fetch the latest revision with `kt records --app ID --id RECORD_ID`, review changes, then retry with the current revision number. |
| `400 CB_VA01: Missing required field` | A required field was not included in the create/update payload | Use `kt fields --app ID` to check required fields. Include all required fields in your `--data` payload. |
| `400 CB_VA01: Invalid field value` | Value does not match field type (e.g., text in a NUMBER field) | Verify the field type with `kt fields --app ID`. Ensure numbers are unquoted, dates use `YYYY-MM-DD`, and dropdown values match exactly. |
| `403 CB_NO02: No permission to proceed` | User or token lacks permission for the requested operation | Check app permissions in kintone admin. API tokens are scoped per-app; you may need a separate token. |
| `414 Request-URI Too Long` | Query string exceeds URL length limit (common with `in` operator) | Break large `in (...)` clauses into multiple queries. Use bulk endpoint for large ID lists. |
| `500 CB_IJ01: Internal server error` | kintone server issue, often during heavy load or complex calculations | Retry after 30 seconds. If persistent, check Cybozu status page. Simplify CALC field dependencies if triggered by specific records. |

---

## FAQ

**1. What is the difference between API token and password authentication?**
API tokens are scoped to individual apps and are the recommended method. Password auth grants access to all apps the user can access but requires username/password storage. Use API tokens for production; password auth for ad-hoc admin tasks.

**2. Can I access multiple apps with one command?**
Yes. Provide comma-separated API tokens in `KINTONE_API_TOKEN` for multi-app access, or use password auth for cross-app operations.

**3. How does the query syntax work?**
kintone uses its own query language: `field_code operator "value"`. Example: `ステータス in ("商談中", "提案済") and 売上見込 > 1000000 order by 最終連絡 desc`.

**4. What is the maximum number of records per bulk operation?**
100 records per POST/PUT call, 500 IDs per DELETE call. The agent automatically chunks larger operations into batches.

**5. Can I create new apps from the CLI?**
Yes. Use `kt apps --create --name "New App" --fields ./schema.json` to create an app with a predefined field schema. The agent handles preview and deployment.

**6. How do I handle subtable (table) fields?**
Subtables are arrays of objects. In `--data`, provide them as: `{"テーブル": [{"value": {"品名": {"value": "Widget"}, "数量": {"value": "10"}}}]}`.

**7. Does the agent support guest spaces?**
Yes. Set `KINTONE_GUEST_SPACE_ID` or use `--guest-space ID` per command. API endpoints are adjusted automatically.

**8. Can I rollback a bulk update?**
kintone does not support native rollback. The agent creates a backup export before bulk operations (when `--backup` flag is used) so you can restore via `kt import`.

**9. How do I handle file attachments?**
Upload: `kt records --app 1 --id 42 --upload-file ./doc.pdf --field 添付ファイル`. Download: `kt records --app 1 --id 42 --download-field 添付ファイル`.

**10. What are kintone's API rate limits?**
kintone limits concurrent connections (typically 10 per domain) rather than requests-per-second. The agent manages connection pooling automatically.

**11. Can I scaffold a kintone plugin project?**
Yes. `kt plugin init --name "My Plugin"` generates the full directory structure with `manifest.json`, config pages, and build scripts per Cybozu's specification.

**12. How do I export data for BI tools?**
Use `kt export --app ID --format csv` for Tableau/Power BI, or `--format json` for custom pipelines. Add `--scheduled` for daily automated exports.

---

## Data Storage

The kintone Agent maintains local state for efficient operations:

```
~/.kintone-agent/
├── config.yaml              # Domain, auth method, default app settings
├── cache/
│   ├── apps.json            # App list cache (TTL: 15 minutes)
│   ├── schemas/
│   │   ├── app_1.json       # Field schema cache per app (TTL: 1 hour)
│   │   └── app_5.json
│   └── query_history.json   # Recent queries for autocomplete
├── backups/
│   └── bulk_20260301_1.csv  # Pre-bulk-operation backup snapshots
├── logs/
│   ├── api-2026-03.log      # Monthly API log (tokens redacted)
│   └── bulk_operations.log  # Bulk operation audit trail
└── plugins/
    └── templates/           # Plugin scaffolding templates
```

Schema caches dramatically speed up validation and field resolution. Backups are created before destructive bulk operations and retained for 30 days. All authentication credentials are stored in the system keychain, never in plaintext files.

---

## Comparison

| Feature | kintone Agent | Airtable CLI | Notion CLI | Google Sheets CLI | Salesforce CLI |
|---|---|---|---|---|---|
| Japanese field names | Native UTF-8 | Limited | Unicode | Unicode | Limited |
| No-code app builder | Full API | No | No | No | No |
| Workflow/process mgmt | Built-in | No | No | No | Apex required |
| Bulk operations | 100/call native | 10/call | Limited | Batch API | Bulk API 2.0 |
| File attachments | Per-record | Per-record | Blocks | Drive link | Content |
| Subtables | Native | Linked records | Databases | No | Related lists |
| Plugin ecosystem | Cybozu marketplace | Extensions | Integrations | Add-ons | AppExchange |
| Guest space access | Native | Shared views | Shared pages | Shared sheets | Communities |
| On-premise option | Yes (cybozu.com) | No | No | No | Private Cloud |
| Query language | kintone QL | Formula | Filter API | Sheets formula | SOQL |
