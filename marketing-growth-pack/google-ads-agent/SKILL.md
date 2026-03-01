---
name: google-ads-agent
description: AI-powered Google Ads campaign management — create, optimize, audit, and report on PPC campaigns
author: hanabi-jpn
version: 1.0.0
tags:
  - google-ads
  - ppc
  - advertising
  - campaign-management
  - bid-optimization
  - keyword-research
  - marketing
---

```
╔═══════════════════════════════════════════════╗
║  ┌─────────────────────────────────────────┐  ║
║  │  G O O G L E   A D S   A G E N T      │  ║
║  │       ━━━━━━━━━━━━━━━━━━━━             │  ║
║  │  📊 Campaign → Keywords → Optimize     │  ║
║  │        AI-Powered Ad Management        │  ║
║  └─────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════╝
```

`google-ads` `ppc-automation` `bid-optimizer` `quality-score` `campaign-manager`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-blue)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green)]()
[![License](https://img.shields.io/badge/license-MIT-yellow)]()
[![Campaigns](https://img.shields.io/badge/campaigns-unlimited-orange)]()
[![Google Ads API](https://img.shields.io/badge/Google_Ads_API-v17-4285F4)]()

> **Turn Google Ads complexity into conversational simplicity -- manage million-dollar ad budgets with natural language commands.**

---

## Overview

Google Ads Agent transforms Claude Code into a full-featured PPC campaign management console. Instead of navigating the labyrinthine Google Ads UI or writing raw API calls against the Google Ads API, you issue plain-English commands and receive structured, actionable results. The agent handles everything from initial campaign creation to ongoing bid optimization, keyword expansion, quality score remediation, and executive-ready reporting.

Under the hood, the agent authenticates via OAuth 2.0, constructs Google Ads Query Language (GAQL) queries, and translates API responses into human-readable output with inline recommendations. It maintains session context so you can drill down from account-level metrics to individual ad group performance without re-specifying parameters. The architecture supports multi-account (MCC) setups, enabling agency workflows where a single operator manages dozens of client accounts from one terminal session.

```
Architecture:

  +------------------+       +---------------------+       +--------------------+
  |   Claude Code    | ----> |  Google Ads Agent   | ----> |  Google Ads API    |
  |   (User CLI)     |       |  (SKILL Engine)     |       |  (v17 REST/gRPC)   |
  +------------------+       +---------------------+       +--------------------+
          |                          |                              |
          |  Natural Language        |  GAQL Query Builder          |  Campaign Data
          |  Commands                |  OAuth2 Token Mgmt           |  Keyword Planner
          |                          |  Response Formatter          |  Bid Simulator
          v                          v                              v
  +------------------+       +---------------------+       +--------------------+
  |  Terminal Output  |       |  Local Cache Layer  |       |  Google Keyword    |
  |  Tables / Charts  |       |  ~/.ads-agent/      |       |  Planner API       |
  +------------------+       +---------------------+       +--------------------+
```

---

## System Prompt Instructions

You are Google Ads Agent, an expert PPC campaign management assistant operating within Claude Code. Follow these rules precisely:

1. Always authenticate using the provided environment variables before making any API calls. Never prompt the user for credentials interactively.
2. Construct all queries using Google Ads Query Language (GAQL). Never use deprecated AdWords API syntax.
3. When displaying campaign data, always include: campaign name, status, budget, impressions, clicks, CTR, CPC, conversions, and cost.
4. Format all currency values with two decimal places and the appropriate currency symbol based on account settings.
5. When optimizing bids, never exceed the user's stated maximum CPC unless explicitly authorized. Always show the projected impact before applying changes.
6. For keyword research, return a minimum of 20 keyword suggestions with search volume, competition level, and suggested bid ranges.
7. Quality score analysis must break down into the three sub-components: expected CTR, ad relevance, and landing page experience.
8. Never pause or delete campaigns without explicit user confirmation. Always show a preview of affected entities first.
9. Budget recommendations must account for the remaining days in the billing period to avoid overspend.
10. A/B test analysis requires a minimum of 100 impressions per variant before declaring statistical significance. Report confidence intervals.
11. When generating reports, default to the last 30 days unless the user specifies a different date range. Support relative ranges like "last week" or "this quarter."
12. Always warn the user if a proposed change would affect more than 50 keywords or 10 ad groups in a single operation.
13. Cache account structure locally in `~/.ads-agent/` to reduce API calls. Invalidate cache after 1 hour or on explicit refresh.
14. For multi-account (MCC) operations, always confirm the target customer ID before executing write operations.
15. Rate-limit API calls to stay within Google Ads API quotas: 15,000 operations per day for standard access.
16. When reporting conversion data, clearly distinguish between "Conversions" (default) and "All Conversions" to avoid misinterpretation.
17. Surface actionable recommendations after every data query. Identify the top three optimization opportunities ranked by estimated impact.
18. Support undo for the last write operation by storing the previous state in the local cache.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Yes | -- | Developer token from Google Ads API Center |
| `GOOGLE_ADS_CLIENT_ID` | Yes | -- | OAuth 2.0 client ID |
| `GOOGLE_ADS_CLIENT_SECRET` | Yes | -- | OAuth 2.0 client secret |
| `GOOGLE_ADS_REFRESH_TOKEN` | Yes | -- | OAuth 2.0 refresh token for offline access |
| `GOOGLE_ADS_CUSTOMER_ID` | Yes | -- | Target account customer ID (without dashes) |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | No | Same as CUSTOMER_ID | MCC manager account ID for multi-account access |
| `ADS_AGENT_CACHE_DIR` | No | `~/.ads-agent/` | Local cache directory for account structure |
| `ADS_AGENT_DEFAULT_DATE_RANGE` | No | `LAST_30_DAYS` | Default reporting date range |

---

## Commands

### `ads campaigns`
List all campaigns with key performance metrics.

```
$ ads campaigns

 Google Ads Agent v1.0.0 — Account: 123-456-7890 (Acme Corp)
 Date Range: 2026-02-01 to 2026-02-28

 ┌─────────────────────────────┬──────────┬───────────┬────────────┬────────┬───────┬────────┬───────────┬──────┐
 │ Campaign                    │ Status   │ Budget/d  │ Impress.   │ Clicks │ CTR   │ Avg CPC│ Conversns │ Cost │
 ├─────────────────────────────┼──────────┼───────────┼────────────┼────────┼───────┼────────┼───────────┼──────┤
 │ Brand - Exact Match         │ ENABLED  │ $150.00   │ 42,318     │ 8,912  │ 21.1% │ $0.42  │ 1,247     │ $3,743│
 │ Non-Brand - General         │ ENABLED  │ $500.00   │ 318,204    │ 6,441  │ 2.0%  │ $2.14  │ 389       │ $13,784│
 │ Shopping - All Products     │ ENABLED  │ $300.00   │ 156,890    │ 4,210  │ 2.7%  │ $1.08  │ 612       │ $4,547│
 │ Display - Remarketing       │ PAUSED   │ $100.00   │ 0          │ 0      │ 0.0%  │ $0.00  │ 0         │ $0   │
 │ Performance Max - Lead Gen  │ ENABLED  │ $250.00   │ 89,512     │ 2,108  │ 2.4%  │ $2.87  │ 278       │ $6,050│
 └─────────────────────────────┴──────────┴───────────┴────────────┴────────┴───────┴────────┴───────────┴──────┘

 Total Spend: $28,124.00 | Total Conversions: 2,526 | Avg CPA: $11.13

 Recommendations:
  1. "Display - Remarketing" is paused — consider reactivating to capture warm audiences
  2. "Non-Brand - General" CPA ($35.43) is 3.2x account average — review keyword list
  3. "Brand - Exact Match" has headroom — budget utilization at 89%, consider +15%
```

### `ads create`
Create a new campaign with guided configuration.

```
$ ads create --type search --name "Spring Sale 2026" --budget 200 --target-cpa 15

 Creating Search Campaign...

 Campaign: Spring Sale 2026
 ├── Type:        Search
 ├── Budget:      $200.00/day
 ├── Bidding:     Target CPA ($15.00)
 ├── Networks:    Google Search + Search Partners
 ├── Locations:   United States (inherited from account)
 ├── Languages:   English
 └── Start Date:  2026-03-01 (today)

 Default Ad Group Created: "Spring Sale - General"
  └── Status: PAUSED (add keywords and ads to activate)

 Next steps:
  1. Run `ads keywords add "Spring Sale 2026"` to add keywords
  2. Create responsive search ads with `ads create-ad "Spring Sale - General"`
  3. Enable campaign with `ads enable "Spring Sale 2026"`

 Campaign ID: 20461893027 — Created successfully.
```

### `ads keywords`
Research and manage keywords for a campaign.

```
$ ads keywords research "ergonomic office chair" --limit 10

 Keyword Research — Seed: "ergonomic office chair"

 ┌──────────────────────────────────┬──────────────┬─────────────┬───────────┬──────────────┐
 │ Keyword                         │ Avg Monthly  │ Competition │ Low Bid   │ High Bid     │
 ├──────────────────────────────────┼──────────────┼─────────────┼───────────┼──────────────┤
 │ ergonomic office chair           │ 201,000      │ HIGH        │ $1.22     │ $4.87        │
 │ best ergonomic chair             │ 110,000      │ HIGH        │ $0.98     │ $3.91        │
 │ ergonomic desk chair             │ 74,000       │ HIGH        │ $1.05     │ $4.12        │
 │ office chair lumbar support      │ 49,500       │ MEDIUM      │ $0.87     │ $3.24        │
 │ ergonomic chair for back pain    │ 33,100       │ MEDIUM      │ $0.92     │ $3.56        │
 │ adjustable office chair          │ 27,100       │ MEDIUM      │ $0.74     │ $2.98        │
 │ ergonomic task chair             │ 18,100       │ LOW         │ $0.68     │ $2.41        │
 │ mesh ergonomic office chair      │ 14,800       │ MEDIUM      │ $0.91     │ $3.77        │
 │ ergonomic chair under 300        │ 12,100       │ MEDIUM      │ $0.82     │ $3.15        │
 │ standing desk chair ergonomic    │ 8,100        │ LOW         │ $0.71     │ $2.89        │
 └──────────────────────────────────┴──────────────┴─────────────┴───────────┴──────────────┘

 Estimated monthly traffic at $3.00 max CPC: 4,200-6,800 clicks
 Suggested negative keywords: "used", "repair", "diy", "reddit"
```

### `ads optimize`
Run bid optimization with projected impact analysis.

```
$ ads optimize "Non-Brand - General" --target-cpa 20

 Bid Optimization Analysis — "Non-Brand - General"
 Current Target CPA: $35.43 | Proposed: $20.00

 Projected Impact (next 30 days):
 ┌────────────────────┬──────────────┬──────────────┬─────────────┐
 │ Metric             │ Current      │ Projected    │ Change      │
 ├────────────────────┼──────────────┼──────────────┼─────────────┤
 │ Daily Budget       │ $500.00      │ $500.00      │ --          │
 │ Impressions        │ 318,204      │ 245,100      │ -23.0%      │
 │ Clicks             │ 6,441        │ 5,820        │ -9.6%       │
 │ Conversions        │ 389          │ 485          │ +24.7%      │
 │ CPA                │ $35.43       │ $20.62       │ -41.8%      │
 │ ROAS               │ 2.8x         │ 4.1x         │ +46.4%      │
 └────────────────────┴──────────────┴──────────────┴─────────────┘

 Low-performing keywords to reduce/pause (5):
  - "office supplies general"     CPA: $89.12  → Recommend: PAUSE
  - "cheap furniture online"      CPA: $67.40  → Recommend: PAUSE
  - "workspace setup ideas"       CPA: $52.18  → Recommend: Reduce bid 40%
  - "home office decor"           CPA: $48.90  → Recommend: Reduce bid 35%
  - "desk accessories bulk"       CPA: $41.22  → Recommend: Reduce bid 20%

 Apply these changes? (y/n):
```

### `ads budget`
Analyze and adjust campaign budgets.

```
$ ads budget summary

 Budget Summary — Account: 123-456-7890
 Billing Period: 2026-03-01 to 2026-03-31 (31 days remaining)

 ┌─────────────────────────────┬───────────┬───────────┬───────────┬──────────┐
 │ Campaign                    │ Daily Cap │ MTD Spend │ Projected │ Utiliz.  │
 ├─────────────────────────────┼───────────┼───────────┼───────────┼──────────┤
 │ Brand - Exact Match         │ $150.00   │ $0.00     │ $4,185    │ 89%      │
 │ Non-Brand - General         │ $500.00   │ $0.00     │ $14,920   │ 96%      │
 │ Shopping - All Products     │ $300.00   │ $0.00     │ $8,742    │ 94%      │
 │ Performance Max - Lead Gen  │ $250.00   │ $0.00     │ $7,440    │ 96%      │
 ├─────────────────────────────┼───────────┼───────────┼───────────┼──────────┤
 │ TOTAL                       │ $1,200/d  │ $0.00     │ $35,287   │ 95%      │
 └─────────────────────────────┴───────────┴───────────┴───────────┴──────────┘

 Budget is on track. No overspend risk detected.
```

### `ads quality-score`
Diagnose quality score issues at the keyword level.

```
$ ads quality-score "Brand - Exact Match" --below 7

 Quality Score Analysis — "Brand - Exact Match"
 Showing keywords with QS < 7

 ┌────────────────────────┬────┬──────────────┬──────────────┬────────────────┐
 │ Keyword                │ QS │ Expected CTR │ Ad Relevance │ Landing Page   │
 ├────────────────────────┼────┼──────────────┼──────────────┼────────────────┤
 │ acme corporation       │ 6  │ Average      │ Above Avg    │ Below Average  │
 │ acme corp products     │ 5  │ Below Avg    │ Average      │ Below Average  │
 │ acme online store      │ 4  │ Below Avg    │ Below Avg    │ Below Average  │
 └────────────────────────┴────┴──────────────┴──────────────┴────────────────┘

 Remediation Plan:
  1. Landing Page (3 keywords affected):
     - Page load time is 4.2s (target: <2.5s) — optimize images and defer JS
     - Mobile usability score: 62/100 — fix viewport and tap targets
  2. Expected CTR (2 keywords affected):
     - Add keyword insertion {KeyWord:Acme} to headline 1
     - Test countdown customizers for urgency
  3. Ad Relevance (1 keyword affected):
     - "acme online store" not present in any ad copy — create dedicated ad
```

### `ads report`
Generate formatted performance reports.

```
$ ads report --period "last 7 days" --format summary

 Performance Report — 2026-02-22 to 2026-02-28
 Account: 123-456-7890 (Acme Corp)

 Account Highlights:
  Spend:        $6,842.18
  Impressions:  148,291
  Clicks:       5,417
  CTR:          3.65%
  Conversions:  632
  CPA:          $10.83
  ROAS:         5.2x

 Week-over-Week Trends:
  Spend        ████████████████░░░░  +8.2%
  Clicks       ███████████████░░░░░  +5.1%
  Conversions  ██████████████████░░  +12.4%
  CPA          ██████░░░░░░░░░░░░░░  -3.7% (improving)

 Top Performing Campaign: "Brand - Exact Match" (ROAS: 12.4x)
 Needs Attention: "Non-Brand - General" (CPA up 18% WoW)
```

### `ads ab-test`
Create and analyze A/B tests for ad variants.

```
$ ads ab-test analyze "Spring Sale - General"

 A/B Test Results — Ad Group: "Spring Sale - General"
 Test Duration: 14 days | Status: SIGNIFICANT

 ┌──────────────────┬──────────────┬──────────────┬─────────────┐
 │ Metric           │ Variant A    │ Variant B    │ Winner      │
 ├──────────────────┼──────────────┼──────────────┼─────────────┤
 │ Impressions      │ 12,418       │ 12,205       │ --          │
 │ Clicks           │ 496          │ 612          │ B (+23.4%)  │
 │ CTR              │ 4.00%        │ 5.01%        │ B           │
 │ Conversions      │ 41           │ 58           │ B (+41.5%)  │
 │ Conv. Rate       │ 8.27%        │ 9.48%        │ B           │
 │ CPA              │ $14.22       │ $10.18       │ B (-28.4%)  │
 └──────────────────┴──────────────┴──────────────┴─────────────┘

 Statistical Confidence: 94.7% (threshold: 90%)
 Recommendation: Pause Variant A, allocate full budget to Variant B.
 Variant B headline: "Ergonomic Chairs — 40% Off Spring Sale"
```

### `ads audit`
Run a comprehensive account health audit.

```
$ ads audit

 Account Audit — 123-456-7890 (Acme Corp)
 Score: 74/100 (Good)

 [PASS]  Conversion tracking is active (Google Tag + Enhanced Conversions)
 [PASS]  Brand/Non-Brand campaigns are properly segmented
 [PASS]  Negative keyword lists are shared across campaigns (3 lists)
 [WARN]  12 ad groups have only 1 ad variant — add at least 2 for testing
 [WARN]  47 keywords have QS below 5 — review landing pages
 [FAIL]  No audience lists applied to Search campaigns for observation
 [FAIL]  Display - Remarketing has been paused for 45+ days — remove or reactivate
 [WARN]  5 campaigns missing sitelink extensions — expected coverage: 100%

 Priority Actions:
  1. Add audience observation to all Search campaigns      Impact: HIGH
  2. Fix quality scores on 47 keywords                     Impact: HIGH
  3. Add second ad variant to 12 ad groups                 Impact: MEDIUM
  4. Resolve paused Display campaign                       Impact: LOW
  5. Add sitelinks to 5 campaigns                          Impact: MEDIUM
```

### `ads pause`
Pause campaigns, ad groups, or keywords with confirmation.

```
$ ads pause keyword "cheap furniture online" --campaign "Non-Brand - General"

 Pause Confirmation:

 Target:    Keyword "cheap furniture online" [BROAD]
 Campaign:  Non-Brand - General
 Ad Group:  Furniture - General
 Last 30d:  142 clicks | 0 conversions | $304.12 spend

 This keyword has spent $304.12 with zero conversions. Pausing is recommended.
 Proceed? (y/n): y

 Keyword paused successfully.
 Estimated monthly savings: $304.12
 Remaining keywords in ad group: 23 (18 active)
```

---

## Workflow

```
                              ads create
                                  |
                                  v
  ┌─────────────┐     ┌─────────────────────┐     ┌──────────────────┐
  │  Keyword     │────>│  Campaign Setup      │────>│  Launch          │
  │  Research    │     │  Budget / Bids / Geo  │     │  Monitor         │
  └─────────────┘     └─────────────────────┘     └──────────────────┘
                                                           |
                  ┌────────────────────────────────────────┘
                  v
  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
  │  Performance     │────>│  Optimize         │────>│  A/B Test        │
  │  Monitoring      │     │  Bids / Keywords  │     │  Ad Variants     │
  └──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           |
                  ┌────────────────────────────────────────┘
                  v
  ┌──────────────────┐     ┌──────────────────┐
  │  Quality Score   │────>│  Reporting &      │
  │  Remediation     │     │  Audit            │
  └──────────────────┘     └──────────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_ERROR: Invalid refresh token` | Refresh token expired or revoked | Re-generate refresh token via `ads auth refresh`. Tokens expire if unused for 6 months. |
| `QUOTA_EXCEEDED: Daily operation limit reached` | Exceeded 15,000 daily API operations | Wait until midnight PT for quota reset. Use `--dry-run` for testing queries without consuming quota. |
| `CUSTOMER_NOT_FOUND: Invalid customer ID` | Wrong customer ID or missing MCC access | Verify `GOOGLE_ADS_CUSTOMER_ID` format (no dashes). For MCC, set `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. |
| `MUTATE_ERROR: Campaign budget below minimum` | Budget set below Google's $1.00/day minimum | Set daily budget to at least $1.00. Google requires a minimum for all campaign types. |
| `KEYWORD_ERROR: Duplicate keyword in ad group` | Attempting to add a keyword that already exists with the same match type | Use `ads keywords list` to check existing keywords. Change match type or target a different ad group. |
| `RESOURCE_NOT_FOUND: Campaign ID does not exist` | Referencing a deleted or non-existent campaign | Run `ads campaigns --include-removed` to check. Campaign may have been removed from another interface. |
| `RATE_LIMIT: Too many requests` | Burst of API calls exceeded per-second limit | Agent automatically retries with exponential backoff. If persistent, reduce concurrent operations. |

---

## Data Storage

All local data is stored in `~/.ads-agent/`:

```
~/.ads-agent/
  ├── config.json          # Account configuration and preferences
  ├── cache/
  │   ├── account_tree.json    # Campaign/ad group structure (1hr TTL)
  │   ├── keyword_cache.json   # Recent keyword research results
  │   └── quality_scores.json  # Latest QS snapshot
  ├── history/
  │   ├── mutations.log        # All write operations with timestamps
  │   └── undo_stack.json      # Last 10 reversible operations
  └── reports/
      └── YYYY-MM-DD_report.json  # Exported report data
```

Data is stored locally only. No telemetry or external data transmission occurs beyond Google Ads API calls. The cache can be cleared with `ads cache clear`.

---

## Comparison Table

| Feature | Google Ads Agent | Google Ads UI | Google Ads Editor | Optmyzr |
|---|---|---|---|---|
| Natural language queries | Yes | No | No | Limited |
| CLI-based workflow | Yes | No | No | No |
| Bulk operations | Yes | Limited | Yes | Yes |
| AI-powered recommendations | Yes (inline) | Basic | No | Yes |
| A/B test analysis | Automated | Manual | No | Semi-auto |
| Quality score diagnostics | Detailed breakdown | Basic view | Basic view | Yes |
| Multi-account (MCC) | Yes | Yes | Yes | Yes |
| Custom reporting | Yes (terminal) | Yes (web) | Export only | Yes |
| Offline editing | Cache-based | No | Yes | No |
| Cost | Free (open source) | Free | Free | $208+/mo |
| Integration with dev tools | Native (Claude Code) | None | None | API only |

---

## FAQ

**1. How do I get a Google Ads Developer Token?**
Apply through your Google Ads Manager account under Tools > API Center. Basic access is granted for test accounts; standard access requires a review application describing your use case. The process typically takes 3-5 business days.

**2. Can I manage multiple Google Ads accounts?**
Yes. Set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` to your MCC manager account ID, then switch between child accounts using `ads account switch <customer-id>`. All commands will target the selected account.

**3. Will the agent make changes without my approval?**
Never. All write operations (create, update, pause, delete) require explicit confirmation. Use `--dry-run` on any command to preview changes without applying them.

**4. How does bid optimization work?**
The agent queries Google's Bid Simulator API to project performance at different bid levels, then recommends adjustments based on your target CPA or ROAS. It respects maximum bid caps and shows the projected impact before applying changes.

**5. Is there a risk of overspending my budget?**
The agent checks remaining billing period days before any budget change and warns if projected spend would exceed your monthly target. It never increases budgets without confirmation.

**6. Can I export reports to CSV or PDF?**
Yes. Append `--export csv` or `--export pdf` to any report command. Files are saved to `~/.ads-agent/reports/`.

**7. How fresh is the data?**
Campaign metrics are queried in real-time from the Google Ads API. Some metrics (like conversions) have a 24-72 hour attribution delay inherent to Google Ads, not the agent.

**8. Does it support Performance Max campaigns?**
Yes. Performance Max campaigns are fully supported for monitoring, budget management, and reporting. Asset group management is available via `ads pmax-assets`.

**9. What happens if my API quota runs out?**
The agent displays a clear error message with the reset time (midnight Pacific). It also shows remaining quota at the end of every session. Use `ads quota` to check anytime.

**10. Can I undo a change?**
Yes. The last 10 write operations are stored in the undo stack. Run `ads undo` to reverse the most recent change. Multi-step undos are available with `ads undo --steps 3`.

**11. How do I handle seasonal campaigns?**
Use `ads create --start-date 2026-12-01 --end-date 2026-12-31` to set campaign flight dates. The agent will automatically factor in the limited date range when projecting performance and budgets.

**12. Can I schedule commands to run automatically?**
The agent itself does not include a scheduler, but you can combine it with cron jobs or CI/CD pipelines. Example: `0 8 * * 1 ads report --period "last 7 days" --export csv` sends a weekly report every Monday at 8 AM.
