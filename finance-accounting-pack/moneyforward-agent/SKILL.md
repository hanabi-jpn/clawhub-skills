---
name: moneyforward-agent
description: Cloud accounting automation — invoices, expenses, journal entries, bank reconciliation on Japan's leading fintech
author: hanabi-jpn
version: 1.0.0
tags:
  - accounting
  - fintech
  - invoices
  - japan
  - bookkeeping
  - tax
  - bank-reconciliation
  - cloud-accounting
---

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   $$\      $$\  $$$$$$\  $$\   $$\ $$$$$$$$\ $$\   $$\          ║
  ║   $$$\    $$$ |$$  __$$\ $$$\  $$ |$$  _____|$$ |  $$ |         ║
  ║   $$$$\  $$$$ |$$ /  $$ |$$$$\ $$ |$$ |      \$$\ $$  |         ║
  ║   $$\$$\$$ $$ |$$ |  $$ |$$ $$\$$ |$$$$$\     \$$$$  /          ║
  ║   $$ \$$$  $$ |$$ |  $$ |$$ \$$$$ |$$  __|     \$$  /           ║
  ║   $$ |\$  /$$ |$$ |  $$ |$$ |\$$$ |$$ |         $$ |            ║
  ║   $$ | \_/ $$ | $$$$$$  |$$ | \$$ |$$$$$$$$\    $$ |            ║
  ║   \__|     \__| \______/ \__|  \__|\________|   \__|            ║
  ║                                                                  ║
  ║         F O R W A R D    A G E N T                               ║
  ║     Cloud Accounting from Your Terminal                          ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
```

`skill: moneyforward-agent` `platform: MoneyForward` `protocol: OAuth2 REST` `lang: en/ja` `fintech: cloud`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/moneyforward-agent)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Fintech](https://img.shields.io/badge/fintech-cloud_accounting-009688)]()

> **Automate your entire Japanese accounting workflow from the command line -- invoices, expenses, reconciliation, and tax reports on MoneyForward Cloud.**

---

## Overview

MoneyForward Agent transforms your terminal into a full-featured accounting workstation connected to Japan's most widely adopted cloud accounting platform. MoneyForward Cloud serves over 300,000 businesses in Japan, from solo freelancers filing blue-form returns to mid-market companies managing multi-entity consolidation. This agent provides direct API access to every core accounting function: creating and sending invoices, recording expenses, posting journal entries, reconciling bank transactions, and generating financial statements.

The Japanese accounting landscape has unique requirements -- consumption tax (shouhizei) with multiple rates (10% standard, 8% reduced), invoice system compliance (tekikaku invoice), fiscal year conventions, and integration with tax filing via e-Tax. MoneyForward Agent handles all of these natively. It supports the qualified invoice system (tekikaku seikyu-sho) mandated since October 2023, automatically calculates tax breakdowns, and formats reports to Japanese GAAP standards. The OAuth2 authentication flow ensures secure, token-based access with automatic refresh, and every mutation operation logs an audit trail for your tax advisor.

```
  ┌─────────────────────────────────────────────────────────────┐
  │              MONEYFORWARD AGENT ARCHITECTURE                 │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │   Terminal CLI                                              │
  │       │                                                     │
  │       ▼                                                     │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Command    │───▶│  OAuth2 Auth  │───▶│  MF Cloud   │  │
  │   │  Router     │    │  Token Mgmt   │    │  API v3     │  │
  │   └─────────────┘    └───────────────┘    └──────┬──────┘  │
  │        │                                         │         │
  │        ▼                                         ▼         │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Invoice    │    │  Expense      │    │  Journal    │  │
  │   │  Engine     │    │  Processor    │    │  Entry Mgr  │  │
  │   └──────┬──────┘    └───────┬───────┘    └──────┬──────┘  │
  │          │                   │                   │         │
  │          └───────────────────┼───────────────────┘         │
  │                              │                             │
  │                              ▼                             │
  │                    ┌───────────────────┐                   │
  │                    │  Bank Reconcile   │                   │
  │                    │  + Tax Compute    │                   │
  │                    └────────┬──────────┘                   │
  │                             │                              │
  │                ┌────────────┼────────────┐                 │
  │                ▼            ▼            ▼                 │
  │          ┌──────────┐ ┌──────────┐ ┌──────────┐           │
  │          │ PL / BS  │ │ Tax Rpt  │ │ CSV/PDF  │           │
  │          │ Reports  │ │ e-Tax    │ │ Export   │           │
  │          └──────────┘ └──────────┘ └──────────┘           │
  │                                                            │
  └─────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

When operating as the MoneyForward Agent, adhere to the following rules:

1. Authenticate using OAuth2 with `MF_CLIENT_ID`, `MF_CLIENT_SECRET`, and `MF_REFRESH_TOKEN`; auto-refresh access tokens before expiry.
2. Always include `MF_COMPANY_ID` in API requests to scope operations to the correct business entity.
3. All monetary values must be displayed in JPY with comma separators (e.g., 1,234,567 JPY) unless the account uses a different currency.
4. Consumption tax calculations must follow the qualified invoice system (tekikaku seikyu-sho) rules: 10% standard, 8% reduced rate.
5. Invoice creation must validate the seller's registration number (T + 13 digits) for tekikaku compliance.
6. Journal entries must use standard Japanese account codes (kanjou kamoku) mapped to MoneyForward's chart of accounts.
7. Bank reconciliation must never auto-match transactions below 70% confidence; flag those for manual review.
8. All dates must default to Japanese fiscal year conventions (April 1 to March 31) unless overridden.
9. Expense submissions must attach receipt images when the amount exceeds 30,000 JPY (tax office requirement).
10. Never delete invoices or journal entries without `--confirm` flag; soft-delete (void) is preferred.
11. Export operations must include a header row with field names and encode output as UTF-8 with BOM for Excel compatibility.
12. Partner (torihiki-saki) management must validate corporate numbers (houjin bangou) when provided.
13. PL and BS reports must show comparison columns (current period vs. prior period) by default.
14. Rate-limit API calls to 300 requests per 5-minute window; queue excess requests automatically.
15. Log every financial mutation (create, update, void) to `~/.mf-agent/audit.log` with timestamp, user, and payload hash.
16. Display account balances with debit/credit indicators following Japanese bookkeeping conventions.
17. Tax report generation must separate standard-rate and reduced-rate consumption tax automatically.
18. Handle API pagination transparently; never truncate financial data silently.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MF_CLIENT_ID` | Yes | -- | OAuth2 client ID from MF developer console |
| `MF_CLIENT_SECRET` | Yes | -- | OAuth2 client secret |
| `MF_REFRESH_TOKEN` | Yes | -- | Long-lived refresh token for automated access |
| `MF_COMPANY_ID` | Yes | -- | Target company/business entity ID |

Set these in your shell profile or `.env` file:

```bash
export MF_CLIENT_ID="mf_client_abc123"
export MF_CLIENT_SECRET="mf_secret_xyz789"
export MF_REFRESH_TOKEN="mf_refresh_token_long_string"
export MF_COMPANY_ID="comp_12345"
```

---

## Commands

### `mf invoices` -- List and filter invoices

```bash
$ mf invoices --status unpaid --period 2026-02

  Invoices [status: unpaid, period: 2026-02]
  ══════════════════════════════════════════════════════════════

  Invoice #     Partner                    Issue Date   Due Date     Amount (JPY)    Tax
  ────────────  ─────────────────────────  ──────────   ──────────   ────────────    ────────
  INV-2026-041  Sakura Design Inc.         2026-02-01   2026-03-31     550,000       50,000
  INV-2026-043  Fujisan Trading Co.        2026-02-05   2026-03-31   1,320,000      120,000
  INV-2026-047  Nihon Systems K.K.         2026-02-10   2026-03-31     880,000       80,000
  INV-2026-052  Green Energy Partners      2026-02-15   2026-04-30     275,000       25,000
  INV-2026-058  Tokyo Bay Logistics        2026-02-20   2026-04-30   2,200,000      200,000

  ── 5 unpaid invoices | Total: 5,225,000 JPY (tax: 475,000 JPY) ──
```

### `mf invoice-create` -- Create and send a new invoice

```bash
$ mf invoice-create \
    --partner "Sakura Design Inc." \
    --items '[{"desc":"Web design","qty":1,"unit_price":500000,"tax_rate":10}]' \
    --due 2026-04-30

  Invoice Created
  ══════════════════════════════════════════════════════════════

  Invoice #:      INV-2026-063
  Partner:        Sakura Design Inc.
  Reg. Number:    T1234567890123 (tekikaku verified)
  Issue Date:     2026-03-01
  Due Date:       2026-04-30

  Line Items:
  ─────────────────────────────────────────────────────────────
  #  Description          Qty   Unit Price    Tax Rate   Amount
  1  Web design            1     500,000       10%       550,000

  Subtotal:       500,000 JPY
  Tax (10%):       50,000 JPY
  Total:          550,000 JPY

  Status:         Draft
  [TIP] Run: mf invoice-send INV-2026-063 to email to partner

  ── invoice created in 0.65s ──
```

### `mf expenses` -- Manage expense claims

```bash
$ mf expenses --month 2026-02

  Expense Report (February 2026)
  ══════════════════════════════════════════════════════════════

  Date        Category          Vendor                   Amount (JPY)  Receipt  Status
  ──────────  ────────────────  ───────────────────────  ────────────  ───────  ────────
  2026-02-03  Transportation    JR East (Suica charge)       12,400    auto     Approved
  2026-02-05  Entertainment     Gonpachi Roppongi            35,200    img      Approved
  2026-02-08  Supplies          Amazon Business               8,750    pdf      Approved
  2026-02-12  Transportation    ANA (HND-ITM)                32,800    img      Pending
  2026-02-14  Communication     Zoom Pro (monthly)            2,200    auto     Approved
  2026-02-18  Entertainment     Imperial Hotel bar           48,600    img      Pending
  2026-02-22  Supplies          Yodobashi Camera             15,400    img      Approved
  2026-02-27  Transportation    Taxi (Uber Japan)             4,800    auto     Approved

  Total:          160,150 JPY
  Approved:       124,750 JPY
  Pending:         35,400 JPY (2 items awaiting approval)

  ── 8 expenses in period ──
```

### `mf journals` -- View and create journal entries

```bash
$ mf journals --date 2026-02-28

  Journal Entries (2026-02-28)
  ══════════════════════════════════════════════════════════════

  Entry #    Debit Account           Credit Account          Amount (JPY)   Memo
  ─────────  ──────────────────────  ──────────────────────  ────────────   ──────────────
  JE-4201    売掛金 (Acct Recv)      売上高 (Revenue)         1,320,000    Fujisan Feb inv
  JE-4202    通信費 (Communication)  未払金 (Acct Payable)        2,200    Zoom monthly
  JE-4203    交際費 (Entertainment)  現金 (Cash)                 35,200    Client dinner
  JE-4204    仮払消費税 (Input Tax)  未払金 (Acct Payable)        3,520    Tax on JE-4203

  ── 4 entries on 2026-02-28 ──
```

### `mf reconcile` -- Bank transaction reconciliation

```bash
$ mf reconcile --account "MUFG Main" --period 2026-02

  Bank Reconciliation: MUFG Main (February 2026)
  ══════════════════════════════════════════════════════════════

  Bank transactions:     142
  Auto-matched:          128 (90.1%)
  Suggested matches:       9 (confidence 70-89%)
  Unmatched:               5 (manual review needed)

  Unmatched Transactions:
  ─────────────────────────────────────────────────────────────
  Date        Description              Amount (JPY)  Direction
  ──────────  ───────────────────────  ────────────  ─────────
  2026-02-06  AMAZON MARKETPLACE        -15,800      Debit
  2026-02-11  PAYPAY TRANSFER            +8,000      Credit
  2026-02-16  ATM DEPOSIT              +200,000      Credit
  2026-02-21  SEVENELEVEN *1234          -1,230      Debit
  2026-02-26  WIRE FROM UNKNOWN         +55,000      Credit

  Actions: mf reconcile --match JE-XXXX --txn TXN-YYYY
           mf reconcile --ignore TXN-YYYY --reason "personal"

  ── reconciliation completed in 3.1s ──
```

### `mf reports` -- Generate PL/BS financial statements

```bash
$ mf reports --type pl --period 2026-02

  Profit & Loss Statement (February 2026)
  ══════════════════════════════════════════════════════════════

  Account                        This Month      Last Month      YTD (Apr-Feb)
  ─────────────────────────────  ──────────────  ──────────────  ──────────────
  REVENUE
    売上高 (Sales)                 8,450,000       7,820,000      89,100,000
    Other Revenue                    120,000         150,000       1,340,000
  ─────────────────────────────  ──────────────  ──────────────  ──────────────
  Total Revenue                    8,570,000       7,970,000      90,440,000

  EXPENSES
    仕入高 (COGS)                  3,200,000       2,980,000      33,600,000
    給料手当 (Payroll)             2,400,000       2,400,000      26,400,000
    地代家賃 (Rent)                  350,000         350,000       3,850,000
    通信費 (Communication)            85,000          82,000         920,000
    交際費 (Entertainment)           148,000         195,000       1,670,000
    消耗品費 (Supplies)               62,000          45,000         580,000
    その他 (Other)                   125,000         118,000       1,280,000
  ─────────────────────────────  ──────────────  ──────────────  ──────────────
  Total Expenses                   6,370,000       6,170,000      68,300,000

  ═══════════════════════════════════════════════════════════════
  NET INCOME                       2,200,000       1,800,000      22,140,000
  ═══════════════════════════════════════════════════════════════

  ── MoM change: +22.2% | YTD margin: 24.5% ──
```

### `mf partners` -- Manage business partners (torihiki-saki)

```bash
$ mf partners --search "Sakura"

  Partner Search Results
  ══════════════════════════════════════════════════════════════

  ID         Name                    Corp. Number        Balance (JPY)   Status
  ─────────  ──────────────────────  ──────────────────  ──────────────  ────────
  P-001234   Sakura Design Inc.      4010001098765       550,000 (AR)    Active
  P-001567   Sakura Foods K.K.       1020001054321       -82,500 (AP)    Active
  P-002890   Sakura Tech Solutions   7030001076543            0          Inactive

  ── 3 results ──
```

### `mf tax` -- Tax calculation and filing preparation

```bash
$ mf tax --type consumption --period 2025

  Consumption Tax Report (FY2025: Apr 2025 - Mar 2026)
  ══════════════════════════════════════════════════════════════

  OUTPUT TAX (売上に係る消費税)
    Standard rate (10%):       7,840,000 JPY on  78,400,000 JPY sales
    Reduced rate (8%):           480,000 JPY on   6,000,000 JPY sales
  ─────────────────────────────────────────────────────────────
  Total Output Tax:            8,320,000 JPY

  INPUT TAX (仕入に係る消費税)
    Standard rate (10%):       5,120,000 JPY on  51,200,000 JPY purchases
    Reduced rate (8%):           160,000 JPY on   2,000,000 JPY purchases
  ─────────────────────────────────────────────────────────────
  Total Input Tax:             5,280,000 JPY

  ═══════════════════════════════════════════════════════════════
  TAX PAYABLE:                 3,040,000 JPY
  ═══════════════════════════════════════════════════════════════

  Filing deadline:  2026-05-31 (2-month extension applied)
  e-Tax ready:      Yes (XML export available)

  ── Run: mf tax --export etax to generate filing XML ──
```

### `mf export` -- Export financial data

```bash
$ mf export --type journals --period 2026-02 --format csv

  Export: Journal Entries (February 2026)
  ══════════════════════════════════════════════════════════════

  Records:     187
  Format:      CSV (UTF-8 with BOM)
  Columns:     date, entry_no, debit_account, credit_account, amount, tax, memo
  Output:      ./journals_2026-02.csv

  [████████████████████████████████████████] 187/187

  [OK] Exported 187 journal entries to journals_2026-02.csv (24.8 KB)
```

### `mf dashboard` -- Real-time financial overview

```bash
$ mf dashboard

  Financial Dashboard (as of 2026-03-01)
  ══════════════════════════════════════════════════════════════

  Cash Position:
    MUFG Main:          12,450,000 JPY
    SMBC Operating:      3,200,000 JPY
    PayPay Business:       185,000 JPY
  ─────────────────────────────────────────────────────────────
  Total Cash:           15,835,000 JPY

  Receivables:           5,225,000 JPY  (5 unpaid invoices)
  Payables:             -2,180,000 JPY  (8 outstanding bills)

  MTD Revenue:           8,570,000 JPY  (+7.5% vs last month)
  MTD Expenses:          6,370,000 JPY  (+3.2% vs last month)
  MTD Net Income:        2,200,000 JPY

  Upcoming:
    Mar 10  Payroll run           -2,400,000 JPY
    Mar 15  Rent payment            -350,000 JPY
    Mar 31  Quarterly tax est.    -1,520,000 JPY

  ── dashboard refreshed at 09:15 JST ──
```

---

## Workflow Diagram

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Bank APIs   │     │  Receipt     │     │  Invoice     │
  │  (MUFG,SMBC) │     │  Scanner     │     │  Incoming    │
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  MoneyForward Agent │
                   │  (mf commands)      │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  Auto-match  │   │  Categorize  │   │  Post        │
  │  Bank Txns   │   │  Expenses    │   │  Journals    │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Trial Balance      │
                   │  Verification       │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  PL / BS     │   │  Tax Filing  │   │  Audit       │
  │  Reports     │   │  (e-Tax XML) │   │  Export      │
  └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `OAUTH_EXPIRED: Refresh token invalid` | Token revoked or expired beyond 90 days | Re-authenticate via `mf auth` to generate a new refresh token |
| `COMPANY_NOT_FOUND: Invalid MF_COMPANY_ID` | Wrong company ID or insufficient permissions | Verify ID in MoneyForward settings; ensure API scope includes the target company |
| `INVOICE_VALIDATION: Missing registration number` | Tekikaku invoice requires seller T-number | Add T-number via `mf partners --update P-XXXX --reg-number T1234567890123` |
| `RECONCILE_CONFLICT: Transaction already matched` | Bank txn linked to another journal entry | Use `mf reconcile --unmatch TXN-XXXX` first, then re-match |
| `TAX_RATE_MISMATCH: 8% applied to non-food item` | Reduced rate used on standard-rate goods | Edit journal entry tax rate; audit with `mf tax --audit` |
| `EXPORT_SIZE_LIMIT: >10,000 rows` | Export exceeds single-file limit | Split by period: `--period 2026-01` and `--period 2026-02` separately |
| `BALANCE_MISMATCH: Trial balance off by 1,230 JPY` | Rounding or missing entry | Run `mf journals --unbalanced` to find orphaned single-sided entries |

---

## Data Storage

```
~/.moneyforward-agent/
├── config/
│   └── config.yaml          # Company ID, preferences, API settings
├── cache/
│   ├── accounts.json        # Chart of accounts cache (1-hour TTL)
│   ├── categories.json      # Expense category cache
│   └── journals.json        # Recent journal entries cache
├── tokens/
│   └── oauth2.json          # Access/refresh tokens (encrypted at rest)
├── reports/
│   ├── monthly/             # Monthly PL/BS report archives
│   └── annual/              # Annual financial statement archives
├── exports/
│   └── csv/                 # CSV/PDF/XML export output files
├── templates/
│   ├── invoice/             # Invoice templates
│   └── expense/             # Expense report templates
├── reconciliation/
│   └── cache/               # Bank txn matching state (30-day retention)
└── logs/
    └── audit.log            # Financial mutation log (7-year retention)
```

OAuth tokens are encrypted at rest. The audit log uses append-only writes to prevent tampering. Financial exports should be stored according to your organization's document retention policy (typically 7 years for Japanese tax law compliance).

---

## Comparison Table

| Feature | MF Agent (CLI) | MF Web UI | freee | Yayoi Online | QuickBooks |
|---|---|---|---|---|---|
| Invoice creation | CLI + template | Web form | Web form | Web form | Web form |
| Tekikaku invoice | Native | Native | Native | Native | No |
| Bank reconciliation | Auto + manual | Auto + manual | Auto | Semi-auto | Auto |
| Journal entry | Direct CLI post | Web form | Web form | Import only | Web form |
| Consumption tax calc | Dual-rate auto | Dual-rate auto | Auto | Auto | US sales tax |
| e-Tax XML export | Yes | Yes | Yes | Yes | No |
| CLI/scripting | Full automation | No | Limited API | No | Limited |
| Japanese GAAP | Native | Native | Native | Native | US GAAP |
| Multi-entity | Per company ID | Per login | Per login | Per login | Per subscription |
| Batch operations | Yes (pipe/script) | Manual | No | No | No |
| Offline access | Cached data | No | No | No | No |
| Setup time | 5 minutes | N/A | N/A | N/A | N/A |

---

## FAQ

**Q1: How do I obtain OAuth2 credentials for MoneyForward API?**
Register a developer application at MoneyForward Developer Portal. You will receive a client ID and secret. Use the authorization code flow to get your initial refresh token.

**Q2: Can I manage multiple companies with one agent?**
Yes. Switch between companies using `mf config --company comp_67890` or pass `--company` to any command.

**Q3: How does the tekikaku invoice validation work?**
The agent verifies the seller's T-registration number against MoneyForward's registry. If the number is missing or invalid, invoice creation will warn you but still allow draft creation.

**Q4: Is the audit log tamper-proof?**
The audit log uses append-only writes with SHA-256 hashes chaining each entry. While not blockchain-level immutable, it provides strong evidence for tax audits.

**Q5: Can I automate monthly closing?**
Yes. Script the workflow: `mf reconcile --auto && mf journals --post-accruals && mf reports --type pl --type bs && mf export --type trial-balance`.

**Q6: How does bank API reconciliation work?**
MoneyForward connects to 2,600+ Japanese financial institutions via account aggregation. The agent pulls transaction data and matches against journal entries using amount, date, and payee heuristics.

**Q7: What happens if a reconciliation match is wrong?**
Use `mf reconcile --unmatch TXN-XXXX` to break the link. The transaction returns to the unmatched queue for re-assignment.

**Q8: Can I create recurring invoices?**
Yes. Use `mf invoice-create --recurring monthly --partner "Partner Name"` to set up automatic monthly invoice generation.

**Q9: How are reduced-rate items handled?**
Items tagged with food/beverage categories automatically use the 8% reduced rate. Override with `--tax-rate 8` or `--tax-rate 10` per line item.

**Q10: Does the agent support payroll integration?**
Payroll is managed through MoneyForward Payroll (a separate product). Journal entries from payroll can be imported via `mf journals --import payroll`.

**Q11: Can I generate reports for a custom date range?**
Yes. Use `--from 2025-10-01 --to 2026-02-28` on any report command for arbitrary date ranges.

**Q12: How do I handle foreign currency transactions?**
Use `--currency USD` when creating entries. The agent fetches the BOJ reference rate for the transaction date and records the JPY equivalent automatically.
