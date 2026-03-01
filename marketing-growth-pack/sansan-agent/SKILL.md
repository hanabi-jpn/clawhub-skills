---
name: sansan-agent
description: Business card and contact intelligence — search, manage, sync digitized cards for Japanese B2B networking
author: hanabi-jpn
version: 1.0.0
tags:
  - crm
  - business-cards
  - contacts
  - japan
  - b2b
  - networking
  - ocr
  - sales
---

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║   ███████╗ █████╗ ███╗   ██╗███████╗ █████╗ ███╗   ██╗      ║
  ║   ██╔════╝██╔══██╗████╗  ██║██╔════╝██╔══██╗████╗  ██║      ║
  ║   ███████╗███████║██╔██╗ ██║███████╗███████║██╔██╗ ██║      ║
  ║   ╚════██║██╔══██║██║╚██╗██║╚════██║██╔══██║██║╚██╗██║      ║
  ║   ███████║██║  ██║██║ ╚████║███████║██║  ██║██║ ╚████║      ║
  ║   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝  ║
  ║                      A G E N T                               ║
  ║          Business Card Intelligence Platform                 ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
```

`skill: sansan-agent` `platform: sansan` `protocol: REST API` `lang: en/ja` `cards: digitized`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/sansan-agent)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Accuracy](https://img.shields.io/badge/OCR-99.9%25_accuracy-gold)]()

> **Turn every business card into actionable intelligence -- your CLI command center for Japan's #1 contact management platform.**

---

## Overview

Sansan Agent bridges the gap between physical business card exchange (meishi koukan) and modern CRM workflows. In Japanese business culture, the ritualized exchange of business cards remains the foundational act of professional relationship building. Sansan has digitized this process for over 9,000 companies, and this agent gives you direct CLI access to search, manage, tag, and sync every contact in your Sansan database without ever opening a browser.

The agent connects to the Sansan Open API to provide full-spectrum contact intelligence: real-time search across hundreds of thousands of digitized cards, company database lookups, duplicate detection, lead scoring based on interaction history, and seamless CRM synchronization. Whether you are preparing for a client meeting, cleaning up contact data after a trade show, or building an automated lead pipeline, Sansan Agent handles it from your terminal. The architecture is designed for reliability, with built-in rate limiting, pagination support, and offline caching of frequently accessed contacts.

```
  ┌─────────────────────────────────────────────────────────┐
  │                    SANSAN AGENT                          │
  │                   Architecture                           │
  ├─────────────────────────────────────────────────────────┤
  │                                                         │
  │   Terminal CLI                                          │
  │       │                                                 │
  │       ▼                                                 │
  │   ┌─────────┐    ┌──────────────┐    ┌──────────────┐  │
  │   │ Command │───▶│   API Auth   │───▶│  Sansan API  │  │
  │   │ Parser  │    │  (API Key)   │    │  api.sansan   │  │
  │   └─────────┘    └──────────────┘    │    .com       │  │
  │       │                              └──────┬───────┘  │
  │       │                                     │          │
  │       ▼                                     ▼          │
  │   ┌─────────┐    ┌──────────────┐    ┌──────────────┐  │
  │   │  Local  │◀───│  Response    │◀───│  Card/User   │  │
  │   │  Cache  │    │  Formatter   │    │  Database    │  │
  │   └─────────┘    └──────────────┘    └──────────────┘  │
  │       │                                     │          │
  │       ▼                                     ▼          │
  │   ┌─────────┐                        ┌──────────────┐  │
  │   │  CRM    │                        │  OCR Engine  │  │
  │   │  Sync   │                        │  99.9% Acc.  │  │
  │   └─────────┘                        └──────────────┘  │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

When operating as the Sansan Agent, adhere to the following rules:

1. Always authenticate using the `SANSAN_API_KEY` header (`X-Sansan-Api-Key`) before any API call.
2. Default the API base to `https://api.sansan.com/v3.0` unless overridden by `SANSAN_API_BASE`.
3. Paginate all list endpoints automatically; never truncate results silently.
4. Respect Sansan API rate limits (100 requests/minute); implement exponential backoff on 429 responses.
5. Display all Japanese names in their original order (family name first) unless the user specifies Western order.
6. When searching contacts, use fuzzy matching by default; exact match only when `--exact` flag is provided.
7. Always show the card's digitization date and last-updated timestamp in output.
8. Mask email addresses in output when `--privacy` flag is set, showing only domain.
9. Export operations must confirm row count before writing to disk.
10. Duplicate detection should compare across name, email, company, and phone with configurable thresholds.
11. Lead scoring must use Sansan's built-in interaction metadata (last contacted, meeting count, shared connections).
12. Tag operations are idempotent -- applying an existing tag is a no-op, not an error.
13. Company lookups should return subsidiary and parent relationships when available.
14. CRM sync operations must log every created/updated/skipped record with a reason.
15. All timestamps must be displayed in JST (Asia/Tokyo) unless `--utc` flag is used.
16. Cache search results locally for 15 minutes to reduce API calls during iterative workflows.
17. Handle network errors gracefully with retry logic and clear user-facing messages.
18. Never delete contacts or cards without explicit `--confirm` flag; always prompt by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SANSAN_API_KEY` | Yes | -- | Your Sansan Open API key from admin console |
| `SANSAN_API_BASE` | No | `https://api.sansan.com` | API base URL (for staging/proxy) |

Set these in your shell profile or `.env` file:

```bash
export SANSAN_API_KEY="ssn_live_abc123def456ghi789"
export SANSAN_API_BASE="https://api.sansan.com"
```

---

## Commands

### `san search` -- Search contacts across all digitized cards

```bash
$ san search "Tanaka" --company "Toyota"

  Sansan Search Results (3 matches)
  ══════════════════════════════════════════════════════════════

  1. Tanaka Kenji (田中 健二)
     Title:    Senior Manager, Procurement Division
     Company:  Toyota Motor Corporation
     Email:    k.tanaka@toyota.co.jp
     Phone:    +81-50-3155-XXXX
     Card ID:  card_8f2a1b3c4d5e
     Scanned:  2025-11-03  |  Updated: 2026-01-15
     Tags:     [automotive] [tier-1] [nagoya]

  2. Tanaka Yuki (田中 裕樹)
     Title:    Deputy General Manager, IT Strategy
     Company:  Toyota Systems Corporation
     Email:    yuki.tanaka@toyotasystems.co.jp
     Phone:    +81-52-747-XXXX
     Card ID:  card_9a3b2c1d0e4f
     Scanned:  2024-06-22  |  Updated: 2025-09-30
     Tags:     [IT] [subsidiary]

  3. Tanaka Mio (田中 美緒)
     Title:    Manager, Global Purchasing
     Company:  Toyota Boshoku Corporation
     Email:    m-tanaka@toyota-boshoku.com
     Phone:    +81-566-26-XXXX
     Card ID:  card_1d2e3f4a5b6c
     Scanned:  2026-02-10  |  Updated: 2026-02-10
     Tags:     [automotive] [new-contact]

  ── 3 results in 0.42s ──
```

### `san contacts` -- List and filter contact database

```bash
$ san contacts --tag "automotive" --limit 5 --sort recent

  Contacts [tag: automotive] (showing 5 of 847)
  ══════════════════════════════════════════════════════════════

  Name                   Company                  Title                    Last Contact
  ─────────────────────  ───────────────────────  ───────────────────────  ────────────
  Suzuki Haruto          Honda Motor Co.          VP Engineering           2026-02-28
  Tanaka Mio             Toyota Boshoku Corp.     Manager, Global Purch.   2026-02-10
  Yamamoto Rin           Denso Corporation        Section Chief, R&D       2026-01-22
  Sato Takeshi           Nissan Motor Co.         Director, Supply Chain   2026-01-15
  Watanabe Yui           Mazda Motor Corp.        GM, Quality Assurance    2025-12-08

  ── Page 1/170 | Next: san contacts --page 2 ──
```

### `san cards` -- View raw card image and OCR data

```bash
$ san cards card_8f2a1b3c4d5e

  Card Detail: card_8f2a1b3c4d5e
  ══════════════════════════════════════════════════════════════

  ┌────────────────────────────────────┐
  │  TOYOTA MOTOR CORPORATION          │
  │                                    │
  │  Senior Manager                    │
  │  Procurement Division              │
  │                                    │
  │  Tanaka Kenji  田中 健二            │
  │                                    │
  │  k.tanaka@toyota.co.jp             │
  │  +81-50-3155-XXXX                  │
  │  1 Toyota-cho, Toyota City,        │
  │  Aichi 471-8571, Japan             │
  └────────────────────────────────────┘

  OCR Confidence:  99.7%
  Front/Back:      Front only
  Scanned by:      Ito Sakura (2025-11-03)
  Owner:           Nakamura Daiki
  Digitized:       2025-11-03T14:22:00+09:00

  ── card data retrieved in 0.18s ──
```

### `san tags` -- Manage contact tags and groups

```bash
$ san tags list

  Tag Management
  ══════════════════════════════════════════════════════════════

  Tag Name        Contacts    Created         Color
  ──────────────  ──────────  ──────────────  ──────
  automotive      847         2024-01-10      #E53935
  IT              312         2024-01-10      #1E88E5
  tier-1          198         2024-03-22      #43A047
  nagoya          156         2024-05-15      #FB8C00
  new-contact     89          2025-01-01      #8E24AA
  trade-show-25   234         2025-10-01      #00ACC1
  vip             42          2024-02-14      #FFD600

  ── 7 tags total ──

$ san tags add "partnership" --contacts card_8f2a1b3c4d5e,card_9a3b2c1d0e4f
  [OK] Tag "partnership" applied to 2 contacts.
```

### `san company` -- Company database lookup

```bash
$ san company "Toyota Motor"

  Company Intelligence: Toyota Motor Corporation
  ══════════════════════════════════════════════════════════════

  Company:        Toyota Motor Corporation (トヨタ自動車株式会社)
  Industry:       Automotive Manufacturing
  HQ:             Toyota City, Aichi Prefecture
  Employees:      ~375,000 (consolidated)
  Revenue:        45.1 trillion JPY (FY2025)
  Listed:         TSE Prime 7203 / NYSE TM

  Your Connections:
  ─────────────────────────────────────────────────────────────
  Direct contacts:      14
  Unique departments:   6
  Most recent card:     2026-02-10
  Key contact:          Tanaka Kenji (Procurement)

  Subsidiaries in DB:
  ─────────────────────────────────────────────────────────────
  Toyota Systems Corporation        5 contacts
  Toyota Boshoku Corporation        3 contacts
  Toyota Tsusho Corporation         8 contacts
  Daihatsu Motor Co., Ltd.          2 contacts

  ── company data retrieved in 0.31s ──
```

### `san export` -- Export contacts to CSV/JSON

```bash
$ san export --tag "trade-show-25" --format csv --output trade_show_contacts.csv

  Export Preview
  ══════════════════════════════════════════════════════════════

  Tag filter:     trade-show-25
  Total records:  234
  Format:         CSV
  Fields:         name, company, title, email, phone, tags
  Output:         ./trade_show_contacts.csv

  Proceed? (y/N): y

  [████████████████████████████████████████] 234/234

  [OK] Exported 234 contacts to trade_show_contacts.csv (48.2 KB)
```

### `san sync` -- Synchronize with external CRM

```bash
$ san sync --target salesforce --dry-run

  CRM Sync Preview (Salesforce)
  ══════════════════════════════════════════════════════════════

  Direction:       Sansan → Salesforce
  Mode:            Dry Run (no changes applied)

  Summary:
  ─────────────────────────────────────────────────────────────
  New contacts to create:     67
  Existing contacts to update: 143
  Contacts already in sync:   1,024
  Conflicts (manual review):  12

  Conflicts:
    - Suzuki Haruto: email differs (sansan: h.suzuki@honda.co.jp vs SF: haruto.s@honda.co.jp)
    - Kobayashi Ren: company name mismatch (sansan: NTT Data vs SF: NTT DATA Corporation)
    ...and 10 more

  Run without --dry-run to apply changes.
```

### `san leads` -- Lead scoring and prioritization

```bash
$ san leads --min-score 70 --limit 5

  Lead Scoring Report
  ══════════════════════════════════════════════════════════════

  Rank  Name               Company              Score   Signal
  ────  ─────────────────  ───────────────────  ──────  ──────────────────────
  1     Suzuki Haruto      Honda Motor Co.      94/100  3 meetings, replied 2x
  2     Yamamoto Rin       Denso Corporation    87/100  Opened proposal, new dept.
  3     Nakamura Aoi       Sony Group Corp.     82/100  Referred by VIP contact
  4     Ito Sakura         Fujitsu Limited      78/100  Downloaded whitepaper
  5     Tanaka Kenji       Toyota Motor Corp.   73/100  Long-term, quarterly mtg

  ── Scoring model: interaction-weighted v2 ──
```

### `san duplicates` -- Detect and merge duplicate contacts

```bash
$ san duplicates --threshold 80

  Duplicate Detection (threshold: 80%)
  ══════════════════════════════════════════════════════════════

  Found 6 potential duplicate pairs:

  Pair 1 (similarity: 95%)
  ─────────────────────────────────────────────────────────────
  A: Sato Takeshi (佐藤 健)     | Nissan Motor Co. | sato.t@nissan.co.jp
  B: Satou Takeshi (佐藤 健)    | Nissan Motor Co. | t-sato@nissan.co.jp
  Reason: Same kanji name, same company, different romanization

  Pair 2 (similarity: 88%)
  ─────────────────────────────────────────────────────────────
  A: Kobayashi Ren              | NTT Data         | ren.k@nttdata.com
  B: Kobayashi Ren              | NTT DATA Corp.   | kobayashi.ren@nttdata.com
  Reason: Same name, company name variant, different email format

  ...4 more pairs

  Merge all high-confidence pairs (>90%)? (y/N):
```

### `san report` -- Generate usage and networking analytics

```bash
$ san report --period monthly

  Monthly Networking Report (February 2026)
  ══════════════════════════════════════════════════════════════

  Cards Scanned:          48
  New Contacts Added:     41
  Duplicates Merged:      3
  Tags Applied:           127

  Top Companies (new contacts):
    Toyota Group          +6
    Sony Group            +4
    NTT Group             +3

  Department Breakdown:
    Engineering           35%   ██████████████
    Sales                 25%   ██████████
    Management            20%   ████████
    Procurement           12%   █████
    Other                  8%   ███

  Networking Velocity:    +12% vs Jan 2026
  Active Connections:     1,234 (30-day window)

  ── report generated in 1.2s ──
```

---

## Workflow Diagram

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Physical   │     │   Sansan     │     │   Sansan     │
  │  Card Scan   │────▶│  OCR Engine  │────▶│  Cloud DB    │
  │  (Scanner)   │     │  99.9% Acc.  │     │              │
  └──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
                            ┌──────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Sansan Agent CLI   │
                 │  (san commands)     │
                 └──────────┬──────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Search &   │ │  Tag/Group   │ │   Lead       │
    │   Filter     │ │  Management  │ │   Scoring    │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
            │               │               │
            └───────────────┼───────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  CSV / JSON  │ │  CRM Sync    │ │  Analytics   │
    │  Export      │ │  (Salesforce) │ │  Reports     │
    └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_FAILED: Invalid API key` | Expired or incorrect `SANSAN_API_KEY` | Regenerate key in Sansan admin console under API settings |
| `RATE_LIMIT: 429 Too Many Requests` | Exceeded 100 req/min limit | Agent auto-retries with backoff; reduce batch size with `--batch 50` |
| `NOT_FOUND: Card card_xxxx does not exist` | Card deleted or ID typo | Verify card ID with `san search`; cards removed by admin are permanent |
| `SYNC_CONFLICT: Field mismatch on 12 records` | CRM data diverges from Sansan | Run `san sync --dry-run` first, then resolve conflicts in `--conflicts` file |
| `EXPORT_PERMISSION: Insufficient role` | API key lacks export scope | Request `export` permission from your Sansan administrator |
| `NETWORK_TIMEOUT: Connection timed out after 30s` | Sansan API unreachable | Check network; retry with `--retry 3`; verify API status at status.sansan.com |
| `DUPLICATE_TAG: Tag "vip" already exists` | Attempting to create existing tag | Use `san tags add` to assign existing tag; no error if applying to contacts |

---

## Data Storage

Sansan Agent stores minimal data locally for performance:

| Item | Location | Purpose | Retention |
|---|---|---|---|
| Search cache | `~/.sansan-agent/cache/` | Avoid redundant API calls | 15 minutes (auto-purge) |
| Export files | Current working directory | CSV/JSON output | User-managed |
| Sync logs | `~/.sansan-agent/logs/sync/` | Audit trail for CRM operations | 90 days |
| Config | `~/.sansan-agent/config.json` | API key, preferences | Persistent |
| Offline index | `~/.sansan-agent/index.db` | Local SQLite for fast name lookups | Rebuilt daily |

All cached data is encrypted at rest using AES-256. No card images are stored locally -- only metadata.

---

## Comparison Table

| Feature | Sansan Agent (CLI) | Sansan Web UI | HubSpot CRM | Salesforce |
|---|---|---|---|---|
| Business card OCR | via Sansan (99.9%) | 99.9% | No | No |
| CLI access | Yes | No | Limited | Limited |
| Japanese name handling | Native (kanji/kana) | Native | Basic | Basic |
| Bulk operations | Yes (batch mode) | Manual | API only | API only |
| Offline search | Cached index | No | No | No |
| CRM sync | Salesforce, HubSpot | Salesforce | Native | Native |
| Lead scoring | Interaction-based | Basic | Advanced | Advanced |
| Duplicate detection | Multi-field fuzzy | Basic | Email only | Email only |
| Export formats | CSV, JSON, TSV | CSV | CSV | CSV, XLSX |
| Setup time | 2 minutes | N/A | 30+ minutes | 60+ minutes |
| Automation friendly | Full CLI/scripting | No | Partial | Partial |

---

## FAQ

**Q1: How do I get a Sansan API key?**
Log into Sansan as an admin, navigate to Settings > External Services > API, and generate a new key with the required scopes.

**Q2: Can I search by Japanese kanji and romaji simultaneously?**
Yes. The search engine normalizes both kanji and romanized inputs. `san search "田中"` and `san search "Tanaka"` return the same results.

**Q3: What happens if I exceed the API rate limit?**
The agent implements automatic exponential backoff. It will retry up to 5 times with increasing delays (1s, 2s, 4s, 8s, 16s).

**Q4: Can I sync bidirectionally with Salesforce?**
Currently, sync is Sansan-to-CRM (one-way). Bidirectional sync is on the roadmap for v1.2.0.

**Q5: How accurate is the duplicate detection?**
The fuzzy matching algorithm compares name (kanji + romaji), email, phone, and company with configurable weight. Default threshold of 80% catches most real duplicates with minimal false positives.

**Q6: Is card image data downloaded locally?**
No. Card images remain on Sansan servers. Only OCR-extracted text metadata is accessed via API.

**Q7: Can I use this with Sansan's free plan?**
The API is available on Sansan's paid plans only. Contact your Sansan account manager for API access.

**Q8: How does lead scoring work?**
Scores are calculated from interaction signals: meeting frequency, email replies, shared connections, recency of contact, and department relevance. Weights are configurable.

**Q9: Can I filter exports by date range?**
Yes. Use `san export --from 2026-01-01 --to 2026-02-28` to export contacts scanned within a date range.

**Q10: Does the agent support multiple Sansan organizations?**
Yes. Set different `SANSAN_API_KEY` values per profile using `san config --profile client-a`.

**Q11: How do I handle contacts with no email address?**
Use `san contacts --missing email` to list contacts lacking email data, then prioritize manual enrichment.

**Q12: Can I pipe search results to other commands?**
Absolutely. Use `--format json` with any command for machine-readable output: `san search "Honda" --format json | jq '.contacts[].email'`.
