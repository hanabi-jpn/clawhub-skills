---
name: yayoi-agent
description: "Accounting automation for Yayoi — smart transaction import, Misoca invoicing, bank reconciliation"
author: hanabi-jpn
version: 1.0.0
tags:
  - accounting
  - yayoi
  - misoca
  - invoicing
  - bookkeeping
  - tax-filing
  - japan-accounting
  - bank-reconciliation
---

```
  ╔═════════════════════════════════════════════════════════════════╗
  ║                                                                 ║
  ║    ╦ ╦╔═╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╦ ╦╔╗╔╔╦╗╦╔╗╔╔═╗             ║
  ║    ╚╦╝╠═╣╚╦╝║ ║║    ╠═╣║  ║  ║ ║║ ║║║║ ║ ║║║║║ ╦             ║
  ║     ╩ ╩ ╩ ╩ ╚═╝╩═╝  ╩ ╩╚═╝╚═╝╚═╝╚═╝╝╚╝ ╩ ╩╝╚╝╚═╝             ║
  ║                     A G E N T                                   ║
  ║                                                                 ║
  ║    ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ║
  ║    │  Bank   │──>│ Categorize│──>│  Books   │──>│  Tax     │   ║
  ║    │  Data   │   │  (AI)    │   │  (PL/BS) │   │  Report  │   ║
  ║    └─────────┘   └──────────┘   └──────────┘   └──────────┘   ║
  ║         │                                            │         ║
  ║         │        ┌──────────┐                        │         ║
  ║         └───────>│  Misoca  │  Invoices & Estimates  │         ║
  ║                  │  Engine  │────────────────────────>│         ║
  ║                  └──────────┘                        │         ║
  ╚═════════════════════════════════════════════════════════════════╝
```

`skill: yayoi-agent` | `version: 1.0.0` | `engine: Yayoi Online API + Misoca` | `standard: JP-GAAP` | `tax: consumption tax 10%/8%`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Japan](https://img.shields.io/badge/accounting-JP_%231_brand-gold)]()

> **Automate your Japanese bookkeeping from the terminal -- import transactions, issue Misoca invoices, reconcile bank accounts, and close your fiscal year without touching a spreadsheet.**

---

## Overview

Yayoi (by Yayoi Co., Ltd., an Intuit group company) is Japan's number-one accounting software brand, with over 3.4 million registered users and a dominant market share among SMEs, sole proprietors (kojin jigyo-nushi), and tax accountants. The Yayoi product family includes Yayoi Kaikei Online (cloud accounting), Yayoi Aoiro Shinkoku Online (blue-form tax filing), and Misoca (cloud-based invoicing and estimates). Together, these tools cover the complete financial lifecycle of a Japanese business -- from daily bookkeeping through year-end tax filing.

Yayoi Accounting Agent brings this entire ecosystem to your command line. It connects to Yayoi's public API and Misoca's API to provide transaction import, smart AI-assisted categorization, bank reconciliation, invoice and estimate management, profit-and-loss statements, balance sheets, and tax report generation. The agent understands Japanese accounting standards (JP-GAAP), consumption tax rules (standard 10% and reduced 8% rates), and the distinction between blue-form (aoiro) and white-form (shiroiro) tax filings. Whether you are a freelance developer filing your own taxes or an accounting firm managing dozens of clients, Yayoi Agent eliminates repetitive data entry and lets you focus on the numbers that matter.

```
  Architecture Overview
  =====================

  ┌──────────────┐        ┌──────────────────────────────┐
  │   Terminal   │        │      Yayoi Agent             │
  │              │        │                              │
  │  yy import   │───────>│  ┌────────────────────────┐  │
  │  yy invoices │        │  │  Command Dispatcher    │  │
  │  yy tax-rpt  │        │  └───────────┬────────────┘  │
  │  yy pl-bs    │        │              │               │
  └──────────────┘        │    ┌─────────┴─────────┐     │
                          │    ▼                   ▼     │
                          │ ┌────────────┐  ┌──────────┐ │
                          │ │ Yayoi API  │  │ Misoca   │ │
                          │ │ (Kaikei)   │  │ API      │ │
                          │ │            │  │          │ │
                          │ │ - Journals │  │- Invoice │ │
                          │ │ - Accounts │  │- Estimate│ │
                          │ │ - Banks    │  │- Receipt │ │
                          │ └─────┬──────┘  └────┬─────┘ │
                          │       │              │       │
                          │       ▼              ▼       │
                          │ ┌────────────────────────┐   │
                          │ │  Categorization Engine  │   │
                          │ │  (Rule-based + AI)      │   │
                          │ └────────────────────────┘   │
                          └──────────────────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │  ~/.yayoi/              │
                          │  - rules.yaml           │
                          │  - categories-cache.json│
                          │  - reconciliation.db    │
                          └─────────────────────────┘
```

---

## System Prompt Instructions

You are the Yayoi Accounting Agent, an expert in Japanese bookkeeping, tax filing, and invoicing via Yayoi and Misoca. Follow these rules precisely:

1. Authenticate using `YAYOI_CLIENT_ID`, `YAYOI_CLIENT_SECRET`, and `YAYOI_REFRESH_TOKEN` for Yayoi Online API access. Use `MISOCA_API_KEY` for Misoca invoice operations. If any required credential is missing, guide the user to the Yayoi Developer portal.
2. All monetary values must be displayed in Japanese Yen (JPY) with comma separators and the yen sign (e.g., 1,234,567). Never use decimal points for JPY amounts.
3. Understand and apply Japanese consumption tax rules: standard rate 10%, reduced rate 8% for food and beverages (excluding alcohol and dining out). Always specify the tax rate on each line item.
4. When importing bank transactions, accept CSV files from major Japanese banks: MUFG, SMBC, Mizuho, Rakuten Bank, Japan Post Bank, SBI Shinsei. Auto-detect the bank format from CSV header patterns.
5. For smart categorization, use a rule-based engine first (matching payee names to account categories), then fall back to AI-based inference for unrecognized transactions. Store learned rules in `~/.yayoi/rules.yaml`.
6. Map all transactions to the standard Japanese chart of accounts (kanjokamoku). Common categories: sales (uriage), cost of goods (shiire), travel (ryohi koutsuuhi), communication (tsushinhi), office supplies (jimuhin), rent (chinshakuryo), utilities (suido konetuhi).
7. When creating Misoca invoices, require: client name, line items (description, quantity, unit price, tax rate), payment due date. Auto-calculate subtotal, tax, and total.
8. For bank reconciliation, match imported bank transactions against existing journal entries using amount, date (plus/minus 3 days tolerance), and payee name similarity scoring. Flag unmatched items for manual review.
9. Generate PL (profit and loss) statements in standard Japanese format with account categories grouped by: sales, cost of sales, gross profit, operating expenses, operating income, non-operating items, and net income.
10. Generate BS (balance sheet) reports with assets, liabilities, and equity sections following JP-GAAP presentation standards.
11. For year-end closing (kessan), verify all accounts are reconciled, generate closing journal entries, carry forward retained earnings, and produce the final trial balance.
12. Support both aoiro (blue-form) and shiroiro (white-form) tax filing formats. Default to aoiro as it provides larger deductions (650,000 yen special deduction for e-filing).
13. When generating tax reports, calculate deductible expenses, depreciation schedules (teigaku-hou straight-line or teiritsu-hou declining balance), and estimated tax liability.
14. Format all dates as YYYY-MM-DD internally but display in Japanese fiscal year context when relevant (e.g., Reiwa 7 for fiscal year 2025-2026).
15. Log all financial data operations to `~/.yayoi/audit.log` with timestamps. Financial data modifications must include before/after values for auditability.
16. For export operations, support CSV (Shift-JIS for Yayoi desktop import compatibility), UTF-8 CSV, JSON, and Yayoi-native format (.yayoi). Default to Yayoi-native format.
17. Warn the user before any destructive operation (deleting journal entries, voiding invoices, reversing reconciliation). Require `--force` to skip confirmation.
18. Cache account category mappings and chart of accounts with a 1-hour TTL. Use `--refresh` to force re-fetch from Yayoi API.
19. When handling invoice numbers, follow sequential numbering with configurable prefix (e.g., INV-2026-0001). Never reuse or skip invoice numbers to maintain audit trail compliance.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `YAYOI_CLIENT_ID` | Yes | -- | Yayoi OAuth2 client ID |
| `YAYOI_CLIENT_SECRET` | Yes | -- | Yayoi OAuth2 client secret |
| `YAYOI_REFRESH_TOKEN` | Yes | -- | Long-lived refresh token for API access |
| `MISOCA_API_KEY` | No | -- | Misoca API key for invoicing (optional if not using invoices) |
| `YAYOI_FISCAL_YEAR_START` | No | `04` | Fiscal year start month (01-12) |
| `YAYOI_TAX_FORM` | No | `aoiro` | Tax filing form: aoiro or shiroiro |
| `YAYOI_LOG_LEVEL` | No | `info` | Logging verbosity: debug, info, warn, error |
| `YAYOI_EXPORT_FORMAT` | No | `yayoi` | Default export format: yayoi, csv, json |

---

## Commands

### `yy transactions` -- List Journal Entries

```bash
$ yy transactions --period 2026-02
┌────────────┬────────────────────────────┬───────────┬───────────┬──────────┐
│  Date      │  Description               │  Debit    │  Credit   │ Category │
├────────────┼────────────────────────────┼───────────┼───────────┼──────────┤
│ 2026-02-28 │ AWS monthly hosting        │  ¥12,800  │           │ Comms    │
│ 2026-02-27 │ Client: ABC Corp payment   │           │ ¥330,000  │ Sales    │
│ 2026-02-25 │ Office supplies Amazon     │   ¥4,280  │           │ Supplies │
│ 2026-02-22 │ Shinkansen Tokyo-Osaka     │  ¥13,870  │           │ Travel   │
│ 2026-02-20 │ Coworking space Feb rent   │  ¥55,000  │           │ Rent     │
│ 2026-02-18 │ Adobe Creative Cloud       │   ¥6,480  │           │ Comms    │
│ 2026-02-15 │ Client: XYZ Inc payment    │           │ ¥220,000  │ Sales    │
│ 2026-02-10 │ Mobile phone bill          │   ¥8,900  │           │ Comms    │
│ 2026-02-05 │ Electricity bill Jan       │   ¥7,200  │           │ Utility  │
│ 2026-02-01 │ Internet provider Feb      │   ¥5,500  │           │ Comms    │
└────────────┴────────────────────────────┴───────────┴───────────┴──────────┘
  10 entries | Debit total: ¥114,030 | Credit total: ¥550,000
```

### `yy import` -- Import Bank Transactions

```bash
$ yy import --file ./mufg_202602.csv --bank mufg
Importing MUFG bank statement...
  File:        mufg_202602.csv
  Bank:        MUFG (Mitsubishi UFJ)
  Period:      2026-02-01 to 2026-02-28
  Rows parsed: 34

  Auto-categorized:  28 (82.4%)
  Needs review:       6 (17.6%)

  ┌────────────┬────────────────────────────┬──────────┬───────────┐
  │  Date      │  Payee                     │  Amount  │ Suggested │
  ├────────────┼────────────────────────────┼──────────┼───────────┤
  │ 2026-02-14 │  AMAZON.CO.JP              │  ¥3,280  │ Supplies? │
  │ 2026-02-16 │  PAYPAL *UNKNOWN           │  ¥9,800  │ ???       │
  │ 2026-02-19 │  SUICA CHARGE              │  ¥5,000  │ Travel?   │
  │ 2026-02-21 │  LAWSON 3812               │    ¥680  │ Meals?    │
  │ 2026-02-23 │  TRANSFER FROM TANAKA      │ ¥50,000  │ Sales?    │
  │ 2026-02-26 │  ATM WITHDRAWAL            │ ¥30,000  │ Owner?    │
  └────────────┴────────────────────────────┴──────────┴───────────┘
  Review and categorize with: yy categorize --pending
```

### `yy categorize` -- Smart Categorization

```bash
$ yy categorize --pending
6 transactions pending review:

  [1/6] AMAZON.CO.JP - ¥3,280 (2026-02-14)
        Suggested: Office Supplies (jimuhin) [confidence: 72%]
        Accept? (y/n/custom): y
        -> Categorized as: Office Supplies

  [2/6] PAYPAL *UNKNOWN - ¥9,800 (2026-02-16)
        Suggested: Unable to determine
        Enter category: Software subscription (tsushinhi)
        -> Categorized as: Communication Expenses
        -> Rule saved: "PAYPAL *UNKNOWN" => Communication Expenses

  ... (4 more items)

  Categorization complete. 6/6 resolved.
  New rules learned: 3 (saved to ~/.yayoi/rules.yaml)
```

### `yy invoices` -- Misoca Invoice Management

```bash
$ yy invoices create --client "ABC Corporation" --due 2026-03-31
Creating invoice via Misoca...

  Invoice: INV-2026-0042
  Client:  ABC Corporation
  ┌──────────────────────────────────┬─────┬──────────┬─────┬──────────┐
  │  Item                           │ Qty │ Unit (¥) │ Tax │ Total    │
  ├──────────────────────────────────┼─────┼──────────┼─────┼──────────┤
  │  Web development (Feb 2026)     │  1  │  250,000 │ 10% │ ¥275,000 │
  │  Server maintenance             │  1  │   30,000 │ 10% │  ¥33,000 │
  │  SSL certificate renewal        │  1  │   20,000 │ 10% │  ¥22,000 │
  └──────────────────────────────────┴─────┴──────────┴─────┴──────────┘
  Subtotal:       ¥300,000
  Consumption Tax: ¥30,000
  Total:          ¥330,000
  Due Date:       2026-03-31
  Status:         Draft (send with: yy invoices send INV-2026-0042)
```

### `yy estimates` -- Create Estimates

```bash
$ yy estimates create --client "XYZ Inc" --valid-until 2026-04-15
Estimate created via Misoca.
  Estimate:  EST-2026-0018
  Client:    XYZ Inc
  Subtotal:  ¥480,000
  Tax:        ¥48,000
  Total:     ¥528,000
  Valid:     Until 2026-04-15
  Status:    Sent
  Convert to invoice: yy estimates convert EST-2026-0018
```

### `yy reconcile` -- Bank Reconciliation

```bash
$ yy reconcile --bank mufg --period 2026-02
Bank Reconciliation: MUFG | February 2026
═══════════════════════════════════════════
  Bank transactions:     34
  Journal entries:       31
  Auto-matched:          27 (87.1%)
  Partial match:          2 (amount OK, date off by 1-2 days)
  Unmatched (bank):       5
  Unmatched (books):      2

  Unmatched Bank Items:
  ┌────────────┬────────────────────────┬──────────┐
  │  Date      │  Description           │  Amount  │
  ├────────────┼────────────────────────┼──────────┤
  │ 2026-02-08 │  VISA CARD PAYMENT     │ ¥42,300  │
  │ 2026-02-12 │  TAX OFFICE REFUND     │  ¥8,500  │
  │ 2026-02-17 │  INTEREST INCOME       │     ¥12  │
  │ 2026-02-22 │  BANK FEE              │    ¥440  │
  │ 2026-02-28 │  DIVIDEND INCOME       │  ¥2,800  │
  └────────────┴────────────────────────┴──────────┘
  Create journal entries for unmatched? (y/n):
```

### `yy tax-report` -- Tax Report Generation

```bash
$ yy tax-report --year 2025 --form aoiro
Generating Blue-Form Tax Report (Aoiro Shinkoku)
Fiscal Year: 2025-04-01 to 2026-03-31
═══════════════════════════════════════════════════

  Revenue (uriage):                    ¥6,840,000
  Cost of sales (shiire):               ¥420,000
  Gross profit:                        ¥6,420,000

  Operating Expenses:
    Rent (chinshakuryo):                 ¥660,000
    Communication (tsushinhi):           ¥398,400
    Travel (ryohi koutsuuhi):            ¥186,200
    Supplies (jimuhin):                   ¥92,800
    Utilities (suido konetuhi):           ¥86,400
    Depreciation (genkashokyaku):        ¥145,000
    Other:                               ¥128,600
  Total expenses:                      ¥1,697,400

  Operating Income:                    ¥4,722,600
  Blue-form deduction:                  -¥650,000
  Taxable income:                      ¥4,072,600

  Estimated tax:
    Income tax:                          ¥467,130
    Resident tax:                        ¥407,260
    Business tax:                        ¥153,630
  Total estimated:                     ¥1,028,020

  Report saved: ~/.yayoi/exports/tax-report-2025.pdf
```

### `yy pl-bs` -- Profit & Loss / Balance Sheet

```bash
$ yy pl-bs --type pl --period 2026-02
Profit & Loss Statement | February 2026
════════════════════════════════════════
  Sales Revenue:                       ¥550,000
  Cost of Sales:                        ¥35,000
  ────────────────────────────────────────────
  Gross Profit:                        ¥515,000

  Operating Expenses:
    Rent:                               ¥55,000
    Communication:                      ¥33,680
    Travel:                             ¥13,870
    Supplies:                            ¥7,560
    Utilities:                           ¥7,200
  ────────────────────────────────────────────
  Total Expenses:                      ¥117,310
  Operating Income:                    ¥397,690
  Non-operating Income:                  ¥2,812
  ────────────────────────────────────────────
  Net Income:                          ¥400,502
```

### `yy close` -- Year-End Closing

```bash
$ yy close --year 2025 --confirm
Year-End Closing: Fiscal Year 2025
═══════════════════════════════════
  Pre-checks:
    [OK] All bank accounts reconciled
    [OK] Depreciation schedules calculated
    [OK] Accounts receivable verified (3 open invoices: ¥280,000)
    [OK] Accounts payable cleared
    [WARN] 2 unmatched transactions remain - review recommended

  Closing entries generated:
    1. Close revenue accounts to retained earnings
    2. Close expense accounts to retained earnings
    3. Record depreciation for fixed assets
    4. Carry forward beginning balances

  Retained earnings (kurikoshi rieki): ¥4,072,600
  Closing complete. New fiscal year 2026 initialized.
  Trial balance saved: ~/.yayoi/exports/trial-balance-2025.csv
```

### `yy export` -- Export Financial Data

```bash
$ yy export --type transactions --period 2026-02 --format csv
Exporting transactions for February 2026...
  Entries:  31
  Format:   CSV (Shift-JIS, Yayoi Desktop compatible)
  Output:   ./yayoi_transactions_202602.csv
  Size:     8.4 KB

  Also available:
    --format json     UTF-8 JSON
    --format yayoi    Yayoi native import format
    --format freee    freee-compatible CSV (for migration)
Export complete.
```

---

## Workflow Diagram

```
  Japanese Accounting Lifecycle via Yayoi Agent
  ══════════════════════════════════════════════

  ┌───────────┐     yy import     ┌──────────────┐
  │ Bank CSV  │ ────────────────> │ Raw          │
  │ (MUFG,   │                   │ Transactions │
  │  SMBC,..)│                   │              │
  └───────────┘                   └──────┬───────┘
                                         │
                              yy categorize
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Categorized  │
                                  │ Journal      │
                                  │ Entries      │
                                  └──────┬───────┘
                                         │
                    ┌────────────────────┬┴────────────────────┐
                    │                    │                     │
              yy reconcile         yy pl-bs              yy invoices
                    │                    │                     │
                    ▼                    ▼                     ▼
             ┌────────────┐     ┌──────────────┐     ┌──────────────┐
             │ Reconciled │     │  PL / BS     │     │   Misoca     │
             │ Accounts   │     │  Reports     │     │  Invoices    │
             └──────┬─────┘     └──────┬───────┘     └──────┬───────┘
                    │                  │                     │
                    └─────────┬────────┘                     │
                              │                              │
                       yy tax-report                         │
                              │                              │
                              ▼                              │
                     ┌──────────────┐                        │
                     │  Tax Report  │<───────────────────────┘
                     │  (Aoiro /    │     (invoice revenue)
                     │   Shiroiro)  │
                     └──────┬───────┘
                            │
                      yy close
                            │
                            ▼
                     ┌──────────────┐
                     │  Year-End    │
                     │  Closing     │──> New Fiscal Year
                     └──────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_EXPIRED: Refresh token invalid` | Yayoi OAuth refresh token has expired (typically 90-day lifetime). | Re-authenticate at the Yayoi Developer portal and update `YAYOI_REFRESH_TOKEN`. |
| `MISOCA_401: API key rejected` | Misoca API key is invalid or the associated account is inactive. | Verify the key in Misoca Settings > API. Regenerate if the account plan was changed. |
| `IMPORT_PARSE: Unknown bank format` | The CSV file does not match any known Japanese bank export format. | Specify the bank explicitly with `--bank <name>` or convert to the generic Yayoi import CSV format. |
| `CATEGORY_UNKNOWN: No rule matched` | A transaction could not be auto-categorized by rules or AI. | Run `yy categorize --pending` to manually assign categories. New rules are saved automatically. |
| `RECONCILE_MISMATCH: Balance difference ¥1,203` | Bank balance and book balance do not match after reconciliation. | Review unmatched items with `yy reconcile --show-diff`. Common causes: timing differences, bank fees, interest. |
| `TAX_CALC_ERROR: Mixed tax rates on single entry` | A journal entry has line items mixing 10% and 8% tax without proper separation. | Split the entry into separate line items per tax rate. Use `yy transactions edit <id>` to fix. |
| `CLOSE_BLOCKED: Unreconciled accounts exist` | Year-end closing attempted with unreconciled bank accounts. | Complete reconciliation for all accounts first. Use `--allow-unreconciled` to force (not recommended). |

---

## FAQ

**1. Which Yayoi products does this agent support?**
Yayoi Kaikei Online, Yayoi Aoiro Shinkoku Online, and Misoca. Desktop versions (Yayoi Kaikei desktop) are supported via CSV export/import only.

**2. Do I need a Misoca account for invoicing?**
Yes. Misoca is a separate service (also by Yayoi/Intuit). Set `MISOCA_API_KEY` to enable invoice commands. All other features work without it.

**3. Which banks are supported for CSV import?**
MUFG, SMBC, Mizuho, Rakuten Bank, Japan Post Bank, SBI Shinsei, and Sony Bank. Generic CSV format is also supported.

**4. How does smart categorization learn?**
When you manually categorize a transaction, the agent saves a payee-to-category rule in `~/.yayoi/rules.yaml`. Future transactions from the same payee are auto-matched.

**5. Can I handle both 10% and 8% consumption tax?**
Yes. The agent tracks tax rates per line item. Food and beverage items (except alcohol and restaurant dining) are auto-suggested at 8%.

**6. What is the difference between aoiro and shiroiro?**
Aoiro (blue-form) provides a 650,000 yen special deduction for e-filing taxpayers. Shiroiro (white-form) is simpler but offers no special deduction. Most freelancers should use aoiro.

**7. Can I migrate data from freee to Yayoi?**
Yes. Use `yy export --format freee` to export in freee-compatible format, or `yy import --format freee` to import from a freee CSV export.

**8. How does year-end closing work?**
The agent generates closing journal entries, transfers revenue/expense balances to retained earnings, and initializes the new fiscal year. It runs pre-checks for unreconciled accounts and open invoices.

**9. Can I generate invoices in English?**
Yes. Use `--lang en` on `yy invoices create` to generate English-language invoices. Useful for international clients of Japanese businesses.

**10. Is my financial data stored securely?**
All data is stored locally on your machine. API communication uses HTTPS. Tokens are stored in the config file; use environment variables for production deployments.

**11. Does it support consumption tax filing (shouhizei shinkoku)?**
Yes. Use `yy tax-report --include-consumption-tax` to generate the consumption tax return alongside income tax calculations.

**12. Can I track fixed assets and depreciation?**
Yes. Use `yy assets list` to view fixed assets and `yy assets depreciate --year 2025` to calculate annual depreciation using straight-line (teigaku) or declining-balance (teiritsu) methods.

---

## Data Storage

```
~/.yayoi/
├── config.yaml               # API credentials, fiscal year settings, preferences
├── rules.yaml                # Learned categorization rules (payee-to-category map)
├── categories-cache.json     # Cached chart of accounts from Yayoi API (1-hour TTL)
├── reconciliation.db         # SQLite database tracking reconciliation status
├── exports/
│   ├── tax-report-2025.pdf   # Generated tax reports
│   ├── trial-balance-2025.csv # Trial balance exports
│   └── transactions/         # CSV/JSON transaction exports
├── invoices/
│   ├── drafts/               # Draft Misoca invoice PDFs
│   └── sent/                 # Sent invoice PDF archives
├── assets/
│   └── depreciation/         # Fixed asset depreciation schedules
└── logs/
    └── audit.log             # Financial operation log (7-year retention)
```

Financial audit logs are retained for 7 years by default, matching Japan's tax document retention requirements. All data is stored locally; no third-party services beyond Yayoi and Misoca APIs are contacted.

---

## Comparison Table

| Feature | Yayoi Agent (CLI) | Yayoi Online (Web) | freee (Web) | MoneyForward (Web) |
|---|---|---|---|---|
| Transaction import | CLI + CSV auto-detect | Manual upload | Bank API sync | Bank API sync |
| Smart categorization | Rule-based + AI | Manual | AI-assisted | AI-assisted |
| Bank reconciliation | CLI with diff view | Semi-auto | Auto | Auto |
| Invoice (Misoca) | Full CRUD from CLI | Separate web app | Built-in | Built-in |
| PL/BS generation | Instant CLI output | Dashboard | Dashboard | Dashboard |
| Tax report | Aoiro + Shiroiro | Aoiro + Shiroiro | Aoiro only | Aoiro only |
| Consumption tax | 10% / 8% auto-split | Manual selection | Auto | Auto |
| Export formats | CSV(SJIS), JSON, Yayoi | CSV | CSV | CSV |
| Offline operation | Cached data available | No | No | No |
| API automation | Full scripting | No | Partial API | Partial API |
| Desktop compatibility | Export to Yayoi Desktop | Cloud only | Cloud only | Cloud only |
| Price | Free (OSS) | ¥8,800/year~ | ¥23,760/year~ | ¥11,760/year~ |

---

*Yayoi Agent -- because your books should close from the terminal, not from a browser with 47 open tabs.*
