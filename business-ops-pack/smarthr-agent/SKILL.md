---
name: smarthr-agent
description: Automate HR and labor management — employee onboarding, documents, payroll on Japan's leading HR cloud
author: hanabi-jpn
version: 1.0.0
tags:
  - smarthr
  - hr-management
  - japan
  - payroll
  - onboarding
  - labor-compliance
  - employee-management
  - electronic-signatures
---

```
╔═══════════════════════════════════════════════════╗
║  ┌───────────────────────────────────────────┐    ║
║  │  S M A R T H R   A G E N T               │    ║
║  │     ━━━━━━━━━━━━━━━━━━━━━━                │    ║
║  │  👤 Employees → Documents → Payroll      │    ║
║  │     Japan's Leading HR Cloud Platform     │    ║
║  └───────────────────────────────────────────┘    ║
╚═══════════════════════════════════════════════════╝
```

`smarthr` `hr-cloud` `payroll` `onboarding` `labor-compliance`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Companies](https://img.shields.io/badge/registered-70K%2B_companies-green)]()
[![Platform](https://img.shields.io/badge/SmartHR-Cloud_HR-00C4CC)]()

> **Streamline every HR operation from hire to retire -- onboard employees, generate documents, and stay compliant with Japanese labor law, all from the terminal.**

---

## Overview

SmartHR Agent brings programmatic control to Japan's most widely adopted cloud HR platform. SmartHR serves over 70,000 registered companies and has become the de facto standard for managing employee lifecycle operations, labor compliance documentation (roumu kanri), social insurance procedures, and year-end tax adjustments (nenmatsu chosei) in the Japanese market. This skill eliminates the manual overhead that HR teams face daily -- inputting employee data, generating government-mandated documents, tracking department changes, and coordinating payroll data handoffs -- by exposing these operations through a clean, scriptable CLI interface.

The agent covers the full breadth of SmartHR's API capabilities: employee master data management with full CRUD operations, department and position hierarchy management, document generation for labor and social insurance forms, payroll data extraction and synchronization, custom field management for company-specific data requirements, electronic signature workflows for employment contracts and NDAs, and comprehensive compliance reporting. It understands the intricacies of Japanese labor law terminology -- from shakai hoken (social insurance) to koyo hoken (employment insurance) -- and produces output that aligns with the formats expected by government agencies like the Japan Pension Service (Nenkin Jimusho) and Hello Work. Batch operations enable HR administrators to process hundreds of employees during peak periods like April mass hiring (ikkatsu saiyo) or year-end adjustments.

```
Architecture:

  ┌─────────────────────────────────────────────────────────────┐
  │                    SmartHR Agent CLI                         │
  │                                                             │
  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌────────────┐  │
  │  │ Employee  │ │ Document  │ │  Payroll  │ │ Compliance │  │
  │  │  Manager  │ │ Generator │ │  Sync     │ │  Reporter  │  │
  │  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬──────┘  │
  │        │             │             │              │         │
  │  ┌─────▼─────────────▼─────────────▼──────────────▼───────┐ │
  │  │         Custom Field Mapper & Validator                │ │
  │  │    (SmartHR schema ↔ company-specific fields)          │ │
  │  └────────────────────────┬───────────────────────────────┘ │
  │                           │                                 │
  │  ┌────────────────────────▼───────────────────────────────┐ │
  │  │      OAuth2 / Access Token Auth Layer                  │ │
  │  │   (tenant-scoped, subdomain routing)                   │ │
  │  └────────────────────────┬───────────────────────────────┘ │
  └───────────────────────────┼─────────────────────────────────┘
                              │ HTTPS
                              ▼
                ┌──────────────────────────┐
                │  {subdomain}.smarthr.jp   │
                │    SmartHR Public API     │
                └──────────────────────────┘
```

---

## System Prompt Instructions

You are the SmartHR Agent, an HR automation specialist for the SmartHR platform. Follow these rules precisely:

1. Authenticate using OAuth2 access tokens via `Authorization: Bearer {SMARTHR_ACCESS_TOKEN}`. Tokens are tenant-scoped; always include `SMARTHR_TENANT_ID` in the request context.
2. All API requests target `https://{SMARTHR_SUBDOMAIN}.smarthr.jp/api/v1/`. Validate the subdomain format before making requests.
3. Employee records are the core entity. Always use the SmartHR employee ID (UUID format) for operations, not employee numbers or names. Support lookup by employee number via search.
4. Handle Japanese name fields correctly: `last_name`, `first_name` for kanji, `last_name_yomi`, `first_name_yomi` for furigana (katakana reading). Both are required for most operations.
5. Date fields follow ISO 8601 (`YYYY-MM-DD`). Understand Japanese fiscal year (April 1 start) when generating compliance reports. Convert nengo dates (Reiwa, Heisei) to ISO format.
6. Department hierarchies are tree structures. When moving employees between departments, validate that the target department exists and handle effective dates for the transfer (jinji ido).
7. Document generation must specify the template type. Common types: employment certificate (zaiseki shomeisho), income certificate (shotoku shomeisho), withholding tax slip (gensen choshuhyo), social insurance forms, and custom templates.
8. Payroll data export must align with pay period boundaries. Never split a pay period across exports. Validate period dates before execution.
9. Custom fields use the SmartHR crew custom field API. Each custom field has a unique `field_template_id`. Map company-specific field names to template IDs via the schema endpoint.
10. Electronic signatures follow a workflow: create document, assign signers, send for signature, track status. Never bypass signature order when multiple signers are specified.
11. For onboarding workflows, execute steps in order: create employee record, set department/position, generate employment contract, send for e-signature, register for social insurance. Validate each step before proceeding.
12. Bulk operations (mass import, department reorganization) must be previewed before execution. Show a diff of changes and require explicit confirmation.
13. Compliance reports must include all legally required fields. Warn if mandatory fields are empty. Japanese social insurance forms require: name, date of birth, address, My Number (individual number), insurance numbers.
14. My Number (Individual Number / マイナンバー) handling: NEVER log, cache, or display My Number values in plaintext. Always mask as `****-****-****` in output. Transmit only over encrypted channels.
15. Support employee status transitions: `active`, `on_leave` (kyushoku-chu), `retired` (taishoku-zumi), `suspended`. Each transition may trigger document generation and government notifications.
16. When handling dependents (fuyousha), validate relationship types, income limits (1,030,000 yen for tax dependents, 1,300,000 yen for social insurance dependents), and age requirements.
17. Year-end adjustment (nenmatsu chosei) operations are seasonal (November-January). Validate all deduction certificates and dependent information before generating final calculations.
18. Rate limits: SmartHR API allows 60 requests per minute. Queue and throttle automatically. Show progress for long-running operations.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMARTHR_ACCESS_TOKEN` | Yes | - | OAuth2 access token from SmartHR developer console |
| `SMARTHR_TENANT_ID` | Yes | - | Tenant ID for multi-tenant isolation (UUID format) |
| `SMARTHR_SUBDOMAIN` | Yes | - | Company subdomain (e.g., `mycompany` for `mycompany.smarthr.jp`) |
| `SMARTHR_RATE_LIMIT` | No | `60` | Maximum API requests per minute |
| `SMARTHR_LOG_DIR` | No | `~/.smarthr-agent/logs` | Directory for API audit logs |
| `SMARTHR_MASK_PII` | No | `true` | Mask personally identifiable information in output (My Number, addresses) |
| `SMARTHR_FISCAL_YEAR_START` | No | `04-01` | Fiscal year start (MM-DD), defaults to Japanese standard April 1 |

---

## Commands

### `hr employees`
List employees with filtering and sorting.

```bash
$ hr employees --status active --department "Engineering" --limit 10

  ID (UUID)    Emp No.  Name           Name (Kana)        Department    Position     Hire Date
  ───────────  ───────  ─────────────  ─────────────────  ────────────  ───────────  ──────────
  a1b2c3d4..   EMP-001  石原 達也      イシハラ タツヤ     Engineering   Manager      2020-04-01
  e5f6g7h8..   EMP-015  佐藤 花子      サトウ ハナコ       Engineering   Senior Eng   2021-04-01
  i9j0k1l2..   EMP-042  田中 太郎      タナカ タロウ       Engineering   Engineer     2022-10-01
  m3n4o5p6..   EMP-067  山田 次郎      ヤマダ ジロウ       Engineering   Junior Eng   2024-04-01
  q7r8s9t0..   EMP-089  鈴木 一郎      スズキ イチロウ     Engineering   Engineer     2023-04-01

  Showing 5 of 5 active employees in Engineering
```

### `hr onboard`
Execute the full onboarding workflow for a new employee.

```bash
$ hr onboard --file ./new_hire_tanaka.json

  Onboarding: 高橋 美咲 (タカハシ ミサキ)

  Step 1/5: Create employee record ............. DONE
    Employee ID: u1v2w3x4-y5z6-...
    Employee No: EMP-103

  Step 2/5: Assign department & position ....... DONE
    Department:  Marketing
    Position:    Associate

  Step 3/5: Generate employment contract ....... DONE
    Document ID: doc-789abc
    Template:    Standard Employment Contract (正社員雇用契約書)

  Step 4/5: Send for electronic signature ...... DONE
    Signers:     高橋 美咲, 石原 達也 (HR Manager)
    Status:      Awaiting signatures

  Step 5/5: Register social insurance .......... DONE
    Health Insurance:  Application prepared (資格取得届)
    Pension:           Application prepared (厚生年金資格取得届)
    Employment Ins:    Application prepared (雇用保険資格取得届)

  Onboarding complete for 高橋 美咲
  Start date: 2026-04-01
  Next steps: Awaiting e-signatures, submit insurance forms to Pension Office
```

### `hr documents`
Generate and manage HR documents.

```bash
$ hr documents --generate --type "zaiseki-shomeisho" --employee EMP-001

  Document generated successfully
  Type:        在籍証明書 (Certificate of Employment)
  Employee:    石原 達也 (EMP-001)
  Document ID: doc-456def
  Generated:   2026-03-01 10:15:22 JST
  Format:      PDF (A4)
  Status:      Ready for download

  Download: hr documents --download doc-456def --output ./certificates/
```

### `hr departments`
Manage department hierarchy.

```bash
$ hr departments --tree

  Organization Structure:

  ClawHub Inc. (本社)
  ├── Engineering (技術部)
  │   ├── Backend Team (バックエンドチーム)     [5 members]
  │   ├── Frontend Team (フロントエンドチーム)  [4 members]
  │   └── Infrastructure (インフラチーム)       [3 members]
  ├── Marketing (マーケティング部)              [6 members]
  ├── Sales (営業部)                            [8 members]
  │   ├── Domestic (国内営業)                   [5 members]
  │   └── International (海外営業)              [3 members]
  ├── HR & Admin (人事総務部)                   [4 members]
  └── Finance (経理部)                          [3 members]

  Departments: 10 | Total employees: 33
```

### `hr payroll`
Extract and synchronize payroll data.

```bash
$ hr payroll --period 2026-02 --export

  Payroll Data Export: February 2026
  Period:     2026-02-01 to 2026-02-28

  Emp No.  Name           Base Salary   Overtime    Transport   Deductions   Net Pay
  ───────  ─────────────  ────────────  ──────────  ──────────  ───────────  ──────────
  EMP-001  石原 達也       ¥450,000      ¥45,000     ¥15,000    ¥128,500     ¥381,500
  EMP-015  佐藤 花子       ¥380,000      ¥22,800     ¥12,000    ¥104,700     ¥310,100
  EMP-042  田中 太郎       ¥320,000      ¥38,400     ¥15,000    ¥93,200      ¥280,200
  ...      (30 more)       ...           ...         ...        ...          ...

  Total Gross:  ¥14,850,000
  Total Net:    ¥11,284,500
  Exported to:  ./payroll_202602.csv
```

### `hr custom-fields`
Manage custom field templates.

```bash
$ hr custom-fields --list

  Field ID     Label               Type          Group           Required
  ───────────  ──────────────────  ────────────  ──────────────  ────────
  cf-001       血液型               DROPDOWN      Health Info     No
  cf-002       緊急連絡先           TEXT          Emergency       Yes
  cf-003       資格・免許           MULTI_SELECT  Qualifications  No
  cf-004       前職経験年数         NUMBER        Career          No
  cf-005       リモートワーク可否   BOOLEAN       Work Style      No

  Total: 5 custom field templates
```

### `hr export`
Bulk export employee data.

```bash
$ hr export --scope active --format csv --fields "emp_no,name,department,position,hire_date" \
    --output ./employees_active.csv

  Export: Active employees
  Fields: Employee No, Name, Department, Position, Hire Date
  Format: CSV (UTF-8 with BOM)

  Exporting: [████████████████████████████████████████] 33/33

  Export complete
  File:      ./employees_active.csv
  Records:   33
  Size:      8.4 KB
```

### `hr search`
Search employees by various criteria.

```bash
$ hr search "joined after 2025-04-01 in Engineering"

  Search results: 2 employees

  Emp No.  Name           Department    Position     Hire Date    Status
  ───────  ─────────────  ────────────  ───────────  ──────────  ──────
  EMP-067  山田 次郎       Engineering   Junior Eng   2025-04-01  Active
  EMP-089  鈴木 一郎       Engineering   Engineer     2025-10-01  Active

  Matched: 2 of 33 total employees
```

### `hr report`
Generate compliance and analytics reports.

```bash
$ hr report --type headcount --period 2026-Q4

  Headcount Report: Q4 FY2025 (January - March 2026)

  Department          Jan    Feb    Mar    Change
  ──────────────────  ─────  ─────  ─────  ──────
  Engineering          11     12     12     +1
  Marketing             6      6      6      0
  Sales                 8      8      8      0
  HR & Admin            4      4      4      0
  Finance               3      3      3      0
  ──────────────────  ─────  ─────  ─────  ──────
  Total                32     33     33     +1

  New hires: 1 | Departures: 0 | Turnover rate: 0.0%
```

### `hr compliance`
Check compliance status for government filings.

```bash
$ hr compliance --check

  Compliance Status Check: March 2026

  Check                                          Status    Due Date     Action
  ─────────────────────────────────────────────  ────────  ───────────  ──────────────
  36協定 (Overtime agreement) renewal             OK        2026-03-31   Filed
  社会保険 算定基礎届 (Standard monthly)          PENDING   2026-07-10   4 months ahead
  労働保険 年度更新 (Labor insurance renewal)      PENDING   2026-07-10   4 months ahead
  住民税 特別徴収 (Resident tax withholding)       OK        Monthly      Current
  源泉徴収 (Income tax withholding)               OK        Monthly      Current
  マイナンバー収集 (My Number collection)          WARNING   -            2 employees missing

  Status: 4 OK | 2 PENDING | 1 WARNING
  Action required: Collect My Number from EMP-067, EMP-089
```

---

## Workflow

```
  HR Admin                   SmartHR Agent                SmartHR API
  ────────                   ─────────────                ───────────
      │                            │                           │
      │  hr onboard                │                           │
      │  --file new_hire.json      │                           │
      ├───────────────────────────►│                           │
      │                            │  Validate JSON payload    │
      │                            │  Check required fields    │
      │                            │                           │
      │                            │  POST /api/v1/crews       │
      │                            ├──────────────────────────►│
      │                            │  201 {id: "uuid..."}      │
      │                            │◄──────────────────────────┤
      │  Step 1: Record created    │                           │
      │◄───────────────────────────┤                           │
      │                            │  PUT /api/v1/crews/{id}   │
      │                            │  (department, position)   │
      │                            ├──────────────────────────►│
      │                            │◄──────────────────────────┤
      │  Step 2: Dept assigned     │                           │
      │◄───────────────────────────┤                           │
      │                            │  POST /api/v1/documents   │
      │                            │  (contract template)      │
      │                            ├──────────────────────────►│
      │                            │◄──────────────────────────┤
      │  Step 3-5: Contract,       │  Generate, sign, insure   │
      │  signature, insurance      │──────────────────────────►│
      │◄───────────────────────────┤◄──────────────────────────┤
      │                            │                           │
      │  Onboarding complete       │                           │
      │◄───────────────────────────┤                           │
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `401 Unauthorized: Invalid access token` | Token expired or revoked | Regenerate the access token in SmartHR developer console. Tokens expire after 2 hours; use refresh tokens for long-running scripts. |
| `403 Forbidden: Insufficient scope` | Token does not have required permission scope | Request additional scopes when creating the OAuth application (e.g., `employees:read`, `documents:write`). |
| `404 Not Found: Employee does not exist` | Employee UUID is invalid or employee has been permanently deleted | Verify the employee ID. Retired employees remain accessible; only purged records return 404. Use `hr search` to find the correct ID. |
| `422 Unprocessable Entity: Missing furigana` | Katakana reading (yomi) fields are required but empty | Provide `last_name_yomi` and `first_name_yomi` in katakana. SmartHR requires these for all employee records. |
| `422 My Number format invalid` | My Number must be exactly 12 digits with valid check digit | Verify the My Number with the employee. The agent validates the check digit algorithm locally before submission. |
| `429 Rate Limit Exceeded` | More than 60 requests per minute | Agent automatically queues and retries. For bulk imports, use the dedicated bulk endpoint which has separate limits. |
| `409 Conflict: Concurrent modification` | Another user modified the same record simultaneously | Refresh the record with `hr employees --id UUID`, review changes, and retry the operation. |

---

## FAQ

**1. What SmartHR plans support API access?**
API access is available on SmartHR Standard and Professional plans. The free plan (SmartHR Free) does not include API access.

**2. How do I handle the April mass hiring (一括採用)?**
Use `hr onboard --bulk --file ./april_hires.csv` to process multiple new hires. The agent executes onboarding workflows in parallel (up to 5 concurrent) with proper rate limiting.

**3. Can I generate year-end adjustment (年末調整) forms?**
Yes. Use `hr documents --generate --type "nenmatsu-chosei" --year 2025 --scope all-active`. This generates the withholding tax slip and deduction summaries for each employee.

**4. How is My Number (マイナンバー) handled securely?**
My Number values are never logged, cached, or displayed in plaintext. The agent masks them as `****-****-****` in all output. Transmission occurs only over TLS. Set `SMARTHR_MASK_PII=true` (default) for additional protection.

**5. Can I sync payroll data with external payroll providers?**
Yes. `hr payroll --export --format freee` exports in freee-compatible CSV format. Also supports Money Forward, Yayoi, and generic CSV formats.

**6. How do I manage employee status transitions?**
Use `hr employees --id UUID --status on_leave --reason "maternity"` for leave, or `--status retired --last-day 2026-03-31` for departures. Each transition triggers appropriate document generation.

**7. What document types can be generated?**
Employment certificates (在籍証明書), income certificates (所得証明書), withholding tax slips (源泉徴収票), social insurance forms (社会保険届出書), employment contracts, and custom templates.

**8. How do I handle dependent (扶養家族) management?**
Use `hr employees --id UUID --dependents` to view/manage dependents. The agent validates income thresholds (1,030,000 yen for tax, 1,300,000 yen for insurance) automatically.

**9. Can I create custom document templates?**
Yes. Upload custom templates via `hr documents --upload-template ./template.docx --name "Custom NDA"`. SmartHR supports variable substitution using `{{employee.name}}` syntax.

**10. How does the electronic signature workflow work?**
Create the document, assign signers in order, and send. `hr documents --sign --doc doc-123 --signers EMP-001,EMP-015`. Track status with `hr documents --status doc-123`.

**11. What is the data retention policy?**
SmartHR retains data per your plan. The agent's local cache is cleared on TTL expiration. Audit logs are retained for 90 days locally. Configure `SMARTHR_LOG_DIR` for custom retention paths.

**12. Can I integrate with Slack or ChatWork for HR notifications?**
Yes. Use `hr report --notify slack` or `--notify chatwork` to send compliance alerts and onboarding status updates to your messaging platform via webhook.

---

## Data Storage

The SmartHR Agent stores operational data securely:

```
~/.smarthr-agent/
├── config.yaml              # Tenant, subdomain, auth settings
├── cache/
│   ├── departments.json     # Department tree cache (TTL: 30 minutes)
│   ├── positions.json       # Position list cache (TTL: 1 hour)
│   ├── custom_fields.json   # Custom field schema cache (TTL: 1 hour)
│   └── employees/           # Employee list cache (TTL: 10 minutes)
├── templates/
│   ├── onboard_default.json # Default onboarding workflow template
│   └── custom/              # User-defined workflow templates
├── exports/
│   └── payroll_202602.csv   # Recent export files (auto-cleanup: 30 days)
├── logs/
│   ├── api-2026-03.log      # Monthly API log (PII masked)
│   ├── audit.log            # Compliance-relevant action log
│   └── errors.log           # Error details with remediation hints
└── secrets/
    └── .token               # Encrypted access token (keychain-backed)
```

All PII is masked in logs by default. The secrets directory uses OS-level keychain integration (macOS Keychain, Linux secret-tool) for token storage. Cache TTLs are tuned to balance performance with data freshness for HR-critical operations.

---

## Comparison

| Feature | SmartHR Agent | BambooHR CLI | Workday CLI | freee HR CLI | KING OF TIME CLI |
|---|---|---|---|---|---|
| Japanese labor law compliance | Native (社保/労保/年調) | No | Partial | Partial | Attendance only |
| My Number handling | Secure (masked/encrypted) | N/A | N/A | Yes | N/A |
| Document generation | 10+ templates native | Limited | Complex | Limited | No |
| Electronic signatures | Built-in workflow | Third-party | DocuSign | Third-party | No |
| Furigana support | Native (katakana yomi) | No | No | Yes | No |
| Year-end adjustment | Full workflow | N/A | N/A | Yes | N/A |
| Payroll export formats | freee, MF, Yayoi, CSV | CSV only | Proprietary | Native | N/A |
| Onboarding automation | 5-step workflow | Basic | Complex | Basic | No |
| Department tree | Full hierarchy CRUD | Flat list | Hierarchy | Flat list | N/A |
| Companies served | 70,000+ (Japan) | 33,000+ (Global) | Enterprise | 400,000+ (Japan) | 56,000+ (Japan) |
