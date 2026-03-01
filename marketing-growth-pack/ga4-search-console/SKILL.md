---
name: ga4-search-console
description: Query GA4 analytics and Google Search Console data in natural language — traffic, SEO, conversions
author: hanabi-jpn
version: 1.0.0
tags:
  - ga4
  - google-analytics
  - search-console
  - seo
  - analytics
  - traffic-analysis
  - conversion-tracking
  - web-analytics
---

```
╔═══════════════════════════════════════════════════╗
║  ┌─────────────────────────────────────────────┐  ║
║  │  G A 4  &  S E A R C H   C O N S O L E    │  ║
║  │          ━━━━━━━━━━━━━━━━━━━━              │  ║
║  │  📈 Traffic ── Rankings ── Conversions     │  ║
║  │  🔍 Queries ── Indexing ── Core Vitals     │  ║
║  │     Data-Driven Decisions in Terminal      │  ║
║  └─────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════╝
```

`ga4-analytics` `search-console` `seo-diagnostics` `traffic-analysis` `conversion-funnels`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-blue)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green)]()
[![License](https://img.shields.io/badge/license-MIT-yellow)]()
[![Metrics](https://img.shields.io/badge/metrics-200%2B_dimensions-purple)]()
[![GA4 Data API](https://img.shields.io/badge/GA4_Data_API-v1beta-E37400)]()

> **Transform raw GA4 and Search Console data into actionable SEO and conversion insights -- no dashboards, no clicks, just answers.**

---

## Overview

GA4 & Search Console Analyst turns Claude Code into a powerful web analytics workstation. Instead of building custom Looker Studio dashboards, writing complex GA4 exploration reports, or manually exporting CSVs from Search Console, you query your data in natural language and receive formatted, contextualized results with built-in recommendations. The agent speaks both the GA4 Data API and the Search Console API fluently, enabling unified analysis that correlates organic search performance with on-site behavior and conversion outcomes.

The agent supports all 200+ GA4 dimensions and metrics, including custom events, user properties, and e-commerce data layers. For Search Console, it covers URL inspection, search analytics (queries, pages, countries, devices), sitemaps, and index coverage. The real power emerges in cross-platform analysis: correlate a drop in organic impressions from Search Console with changes in GA4 engagement metrics to diagnose whether an SEO issue is a ranking problem, a click-through rate problem, or a content quality problem. Scheduled reports and threshold-based alerts let you monitor key metrics without constant manual checking.

```
Architecture:

  +------------------+       +---------------------------+
  |   Claude Code    | ----> |  GA4 & GSC Analyst Agent  |
  |   (User CLI)     |       |  (Query Engine)           |
  +------------------+       +---------------------------+
                                       |
                    +------------------+------------------+
                    |                                     |
                    v                                     v
           +------------------+                 +------------------+
           |  GA4 Data API    |                 | Search Console   |
           |  (v1beta)        |                 | API (v3)         |
           +------------------+                 +------------------+
           |  - runReport     |                 | - searchAnalytics|
           |  - runRealtimeRpt|                 | - urlInspection  |
           |  - runFunnelRpt  |                 | - sitemaps       |
           |  - getMetadata   |                 | - indexing       |
           +------------------+                 +------------------+
                    |                                     |
                    v                                     v
           +------------------+                 +------------------+
           | Sessions, Users  |                 | Queries, Pages   |
           | Conversions,     |                 | Impressions,     |
           | Revenue, Events  |                 | Clicks, Position |
           +------------------+                 +------------------+
                    |                                     |
                    +------------------+------------------+
                                       |
                                       v
                             +-------------------+
                             |  ~/.ga4-agent/    |
                             |  Cache, Reports,  |
                             |  Alert Rules      |
                             +-------------------+
```

---

## System Prompt Instructions

You are GA4 & Search Console Analyst, an expert web analytics assistant operating within Claude Code. Follow these rules precisely:

1. Authenticate using OAuth 2.0 credentials from environment variables. Use the GA4 Data API v1beta for analytics queries and the Search Console API v3 for SEO data.
2. When querying GA4, always validate dimension and metric names against the GA4 Metadata API before constructing the report request. Surface clear errors for invalid fields.
3. Default date range is the last 30 days unless the user specifies otherwise. Support relative date expressions: "last week", "this month", "yesterday", "last 90 days", "Q1 2026".
4. All traffic numbers must distinguish between "sessions" and "users" (active users). Never conflate these metrics. Default to sessions unless the user specifies users.
5. When displaying percentage changes, always show the direction (up/down arrow or +/-) and the absolute numbers alongside percentages to provide context.
6. For Search Console queries, default to "web" search type. Support "image", "video", and "news" search types when specified.
7. SEO audit recommendations must be ranked by estimated impact. Priority should be: indexing issues > ranking drops > click-through rate improvements > content gaps.
8. Conversion funnel analysis must show drop-off rates between each step and highlight the step with the highest abandonment rate.
9. When comparing date ranges, align day-of-week to avoid misleading comparisons (e.g., compare Mon-Sun to Mon-Sun, not arbitrary 7-day windows).
10. Real-time data from GA4 must be clearly labeled as "real-time" with a disclaimer about data freshness (up to 30 minutes lag).
11. For e-commerce properties, include transaction-level metrics: revenue, transactions, average order value, items per transaction.
12. Cache query results locally in `~/.ga4-agent/cache/` with a 15-minute TTL for non-realtime data. Always serve fresh data for realtime queries.
13. When presenting Search Console data, distinguish between "impressions" (search result appearances) and "clicks" (actual visits) to avoid confusion.
14. URL inspection results must include: indexing status, canonical URL, crawl date, mobile usability, and rich result eligibility.
15. Support natural language filtering: "show me traffic from Japan on mobile devices" should translate to dimension filters for country=JP and deviceCategory=mobile.
16. Export support: all commands accept `--export csv`, `--export json`, or `--export pdf`. Files are saved to `~/.ga4-agent/reports/`.
17. Alert thresholds can be set with `seo alert` and are checked on every `ga traffic` or `gsc rankings` command. Trigger notifications when metrics cross thresholds.
18. Always show data sampling status. If GA4 returns sampled data, warn the user and suggest narrowing the date range for accurate results.
19. When analyzing keyword rankings, group keywords by intent category (informational, navigational, transactional, commercial) when presenting results.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GA4_PROPERTY_ID` | Yes | -- | GA4 property ID (numeric, e.g., 123456789) |
| `GSC_SITE_URL` | Yes | -- | Search Console property URL (e.g., `https://example.com/` or `sc-domain:example.com`) |
| `GOOGLE_CLIENT_ID` | Yes | -- | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | -- | OAuth 2.0 client secret |
| `GOOGLE_REFRESH_TOKEN` | Yes | -- | OAuth 2.0 refresh token with Analytics and Search Console scopes |
| `GA4_AGENT_CACHE_DIR` | No | `~/.ga4-agent/` | Local cache and report directory |
| `GA4_AGENT_DEFAULT_RANGE` | No | `last_30_days` | Default date range for queries |
| `GA4_AGENT_SAMPLING_WARN` | No | `true` | Show warnings when data is sampled |
| `GA4_AGENT_CURRENCY` | No | Account default | Override currency display (e.g., `USD`, `JPY`) |

---

## Commands

### `ga traffic`
View traffic overview with key engagement metrics.

```
$ ga traffic

 GA4 Traffic Report — Property: 123456789 (acmecorp.com)
 Period: 2026-02-01 to 2026-02-28 vs. 2026-01-01 to 2026-01-31

 Key Metrics:
 ┌──────────────────────┬──────────────┬──────────────┬───────────┐
 │ Metric               │ This Period  │ Last Period  │ Change    │
 ├──────────────────────┼──────────────┼──────────────┼───────────┤
 │ Active Users         │ 84,219       │ 78,402       │ +7.4%     │
 │ Sessions             │ 142,847      │ 131,290      │ +8.8%     │
 │ Pageviews            │ 387,512      │ 352,108      │ +10.1%    │
 │ Avg. Session Duration│ 3m 24s       │ 3m 12s       │ +6.3%     │
 │ Bounce Rate          │ 41.2%        │ 43.8%        │ -2.6pp    │
 │ Pages/Session        │ 2.71         │ 2.68         │ +1.1%     │
 └──────────────────────┴──────────────┴──────────────┴───────────┘

 Traffic by Channel:
 ┌──────────────────────┬──────────┬────────┬──────────────────────────────────┐
 │ Channel              │ Sessions │ Share  │ Trend                            │
 ├──────────────────────┼──────────┼────────┼──────────────────────────────────┤
 │ Organic Search       │ 58,412   │ 40.9%  │ ██████████████████████░░ +12.3%  │
 │ Direct               │ 34,284   │ 24.0%  │ ████████████████░░░░░░░░ +3.1%   │
 │ Paid Search          │ 22,108   │ 15.5%  │ █████████████░░░░░░░░░░░ +8.7%   │
 │ Social               │ 14,205   │ 9.9%   │ ██████████░░░░░░░░░░░░░░ +15.2%  │
 │ Referral             │ 8,412    │ 5.9%   │ ██████░░░░░░░░░░░░░░░░░░ -2.4%   │
 │ Email                │ 5,426    │ 3.8%   │ ████░░░░░░░░░░░░░░░░░░░░ +22.1%  │
 └──────────────────────┴──────────┴────────┴──────────────────────────────────┘

 Data Status: Unsampled | Property Timezone: Asia/Tokyo
```

### `ga conversions`
Analyze conversion events and goal completions.

```
$ ga conversions --event "purchase"

 Conversion Analysis — Event: purchase
 Period: 2026-02-01 to 2026-02-28

 Summary:
  Total Conversions:  1,847
  Conversion Rate:    1.29% (of sessions)
  Total Revenue:      $127,482.00
  Avg. Order Value:   $69.02

 Conversions by Source/Medium:
 ┌────────────────────────────┬──────────┬───────────┬──────────┬──────────┐
 │ Source / Medium            │ Convrsns │ Revenue   │ Conv Rate│ AOV      │
 ├────────────────────────────┼──────────┼───────────┼──────────┼──────────┤
 │ google / organic           │ 712      │ $48,210   │ 1.22%    │ $67.71   │
 │ google / cpc               │ 389      │ $31,408   │ 1.76%    │ $80.74   │
 │ (direct) / (none)          │ 298      │ $19,247   │ 0.87%    │ $64.59   │
 │ instagram / social         │ 187      │ $11,890   │ 1.32%    │ $63.58   │
 │ newsletter / email         │ 142      │ $9,847    │ 2.62%    │ $69.35   │
 │ Other                      │ 119      │ $6,880    │ 0.71%    │ $57.82   │
 └────────────────────────────┴──────────┴───────────┴──────────┴──────────┘

 Insight: Email has the highest conversion rate (2.62%) at 3x the account
 average. Consider increasing email campaign frequency or list size.
```

### `ga realtime`
View real-time active users and events.

```
$ ga realtime

 GA4 Real-Time Report — acmecorp.com
 Snapshot: 2026-03-01 09:47:23 JST

 Active Users (last 30 min): 247

 By Page:
  /products/ergonomic-chair-pro     42 users  ████████████████████
  /                                 38 users  ██████████████████
  /checkout                         27 users  █████████████
  /blog/spring-sale-guide           24 users  ████████████
  /products/standing-desk-xl        19 users  █████████

 By Country:
  Japan          112 (45.3%)
  United States   58 (23.5%)
  United Kingdom  21 (8.5%)
  Germany         18 (7.3%)
  Other           38 (15.4%)

 By Device:
  Mobile:  148 (59.9%) | Desktop: 87 (35.2%) | Tablet: 12 (4.9%)

 Events (last 5 min):
  page_view: 89 | scroll: 67 | add_to_cart: 12 | purchase: 3

 Data freshness: Near real-time (up to 30-minute lag for some metrics)
```

### `ga funnel`
Analyze conversion funnels step by step.

```
$ ga funnel --steps "session_start,view_item,add_to_cart,begin_checkout,purchase"

 Conversion Funnel Analysis
 Period: 2026-02-01 to 2026-02-28

 ┌─────┬──────────────────┬──────────┬──────────────┬──────────────┐
 │ Step│ Event            │ Users    │ Drop-off     │ Rate         │
 ├─────┼──────────────────┼──────────┼──────────────┼──────────────┤
 │  1  │ session_start    │ 84,219   │ --           │ 100.0%       │
 │  2  │ view_item        │ 31,482   │ -52,737      │ 37.4%        │
 │  3  │ add_to_cart      │ 6,218    │ -25,264      │ 7.4%         │
 │  4  │ begin_checkout   │ 3,104    │ -3,114       │ 3.7%         │
 │  5  │ purchase         │ 1,847    │ -1,257       │ 2.2%         │
 └─────┴──────────────────┴──────────┴──────────────┴──────────────┘

 Funnel Visualization:
  session_start   ████████████████████████████████████████  84,219
  view_item       ███████████████                          31,482 (-62.6%)
  add_to_cart     ███                                       6,218 (-80.2%) *** BIGGEST DROP
  begin_checkout  ██                                        3,104 (-50.1%)
  purchase        █                                         1,847 (-40.5%)

 Overall Conversion Rate: 2.19%

 Bottleneck: view_item -> add_to_cart (-80.2% drop-off)
 Recommendation: Review product page UX — add social proof, improve CTAs,
 test price display format. Consider exit-intent offers on product pages.
```

### `gsc rankings`
View Search Console keyword ranking data.

```
$ gsc rankings --limit 10

 Search Console Rankings — acmecorp.com
 Period: 2026-02-01 to 2026-02-28

 ┌────┬────────────────────────────────┬────────┬────────┬───────┬──────────┬──────────┐
 │ #  │ Query                          │ Clicks │ Impr.  │ CTR   │ Position │ Change   │
 ├────┼────────────────────────────────┼────────┼────────┼───────┼──────────┼──────────┤
 │ 1  │ ergonomic office chair         │ 2,847  │ 48,210 │ 5.9%  │ 3.2      │ +0.4     │
 │ 2  │ best standing desk 2026        │ 1,928  │ 31,442 │ 6.1%  │ 4.1      │ +1.2     │
 │ 3  │ acme corporation               │ 1,412  │ 8,204  │ 17.2% │ 1.1      │ 0.0      │
 │ 4  │ adjustable desk chair          │ 987    │ 22,108 │ 4.5%  │ 5.8      │ -0.7     │
 │ 5  │ office chair lumbar support    │ 842    │ 18,920 │ 4.5%  │ 6.2      │ +0.3     │
 │ 6  │ ergonomic keyboard tray        │ 718    │ 14,208 │ 5.1%  │ 4.9      │ +1.8     │
 │ 7  │ home office setup guide        │ 612    │ 24,180 │ 2.5%  │ 8.4      │ -1.1     │
 │ 8  │ standing desk converter        │ 548    │ 12,847 │ 4.3%  │ 7.1      │ +0.5     │
 │ 9  │ monitor arm clamp mount        │ 421    │ 9,812  │ 4.3%  │ 5.4      │ +2.1     │
 │ 10 │ ergonomic mouse pad            │ 387    │ 11,204 │ 3.5%  │ 9.2      │ -0.3     │
 └────┴────────────────────────────────┴────────┴────────┴───────┴──────────┴──────────┘

 Top Mover: "monitor arm clamp mount" improved +2.1 positions
 Declining: "home office setup guide" dropped -1.1 positions — review content freshness
 Total queries with impressions: 4,218
```

### `gsc inspect`
Inspect a specific URL for indexing and SEO status.

```
$ gsc inspect "https://acmecorp.com/products/ergonomic-chair-pro"

 URL Inspection — acmecorp.com

 URL: https://acmecorp.com/products/ergonomic-chair-pro

 Indexing:
  Status:          Indexed (submitted and indexed)
  Canonical:       https://acmecorp.com/products/ergonomic-chair-pro (Google-selected, matches user)
  Last Crawl:      2026-02-27 14:32:18 UTC
  Crawl Method:    Googlebot Smartphone
  Robots.txt:      Allowed
  Page Fetch:      Successful (HTTP 200)

 Mobile Usability:
  Status:          Page is mobile friendly
  Viewport:        Set correctly
  Font size:       Legible
  Tap targets:     Appropriately sized

 Rich Results:
  Product:         Eligible (name, price, availability, rating detected)
  Breadcrumb:      Eligible
  FAQ:             Not detected (consider adding FAQ schema)

 Enhancements:
  AMP:             Not implemented
  Page Experience:  Core Web Vitals: GOOD (LCP: 1.8s, FID: 42ms, CLS: 0.05)

 Recommendation: Add FAQ structured data to this product page to qualify
 for FAQ rich results in search. Estimated CTR improvement: +10-15%.
```

### `gsc sitemap`
View sitemap status and index coverage.

```
$ gsc sitemap

 Sitemaps — acmecorp.com

 ┌──────────────────────────────┬──────────┬──────────┬──────────┬─────────────────────┐
 │ Sitemap                      │ Type     │ Submitted│ Indexed  │ Last Submitted      │
 ├──────────────────────────────┼──────────┼──────────┼──────────┼─────────────────────┤
 │ /sitemap.xml                 │ Index    │ 1,247    │ 1,198    │ 2026-02-28 06:00    │
 │ /sitemap-products.xml        │ Product  │ 342      │ 338      │ 2026-02-28 06:00    │
 │ /sitemap-blog.xml            │ Blog     │ 478      │ 462      │ 2026-02-28 06:00    │
 │ /sitemap-pages.xml           │ Pages    │ 127      │ 124      │ 2026-02-28 06:00    │
 │ /sitemap-categories.xml      │ Category │ 300      │ 274      │ 2026-02-28 06:00    │
 └──────────────────────────────┴──────────┴──────────┴──────────┴─────────────────────┘

 Index Coverage Summary:
  Submitted: 1,247 URLs
  Indexed:   1,198 URLs (96.1%)
  Excluded:  49 URLs

 Exclusion Reasons:
  - Duplicate without user-selected canonical: 22
  - Crawled, currently not indexed: 15
  - Excluded by noindex tag: 8
  - Redirect: 4

 Action Item: 15 URLs are "crawled, currently not indexed" — review content
 quality and internal linking for these pages. Run `gsc inspect <url>` for details.
```

### `seo audit`
Run a comprehensive SEO health check combining GA4 and GSC data.

```
$ seo audit

 SEO Audit — acmecorp.com
 Score: 82/100 (Good)

 INDEX HEALTH
 [PASS]  96.1% of submitted URLs are indexed (1,198/1,247)
 [WARN]  15 pages crawled but not indexed — weak content signals
 [PASS]  No manual actions or security issues detected

 CORE WEB VITALS
 [PASS]  LCP: 1.8s (Good, threshold: 2.5s)
 [PASS]  FID: 42ms (Good, threshold: 100ms)
 [PASS]  CLS: 0.05 (Good, threshold: 0.1)

 MOBILE USABILITY
 [PASS]  100% of tested pages are mobile-friendly
 [PASS]  Viewport correctly configured

 CONTENT & RANKINGS
 [PASS]  4,218 queries generating impressions (+8.2% MoM)
 [WARN]  Average position: 12.4 — 847 queries on page 2 (positions 11-20)
 [WARN]  CTR for position 1-3 keywords: 8.2% (industry avg: 12.1%)
 [FAIL]  Blog content older than 12 months: 142 posts need refresh

 STRUCTURED DATA
 [PASS]  Product schema on 98% of product pages
 [WARN]  FAQ schema missing from 45 eligible pages
 [PASS]  Breadcrumb schema sitewide

 TECHNICAL
 [PASS]  Sitemap auto-updated daily
 [PASS]  robots.txt properly configured
 [WARN]  22 duplicate content URLs — consolidate with canonical tags

 Priority Actions (ranked by impact):
  1. Refresh 142 stale blog posts (>12 months old)      Impact: HIGH
  2. Add FAQ schema to 45 eligible pages                 Impact: HIGH
  3. Optimize title tags for 847 page-2 keywords         Impact: HIGH
  4. Resolve 22 duplicate content issues                  Impact: MEDIUM
  5. Improve content on 15 not-indexed pages              Impact: MEDIUM
```

### `seo report`
Generate a comprehensive SEO performance report.

```
$ seo report --period "last 7 days"

 SEO Performance Report
 Period: 2026-02-22 to 2026-02-28

 Organic Search (GA4):
  Sessions:      14,218 (+5.2% WoW)
  Users:         11,847 (+4.8% WoW)
  Bounce Rate:   38.4% (-1.2pp WoW)
  Conversions:   178 (+12.0% WoW)
  Revenue:       $12,284 (+9.8% WoW)

 Search Console:
  Impressions:   248,120 (+3.1% WoW)
  Clicks:        12,847 (+6.4% WoW)
  Avg CTR:       5.18% (+0.16pp WoW)
  Avg Position:  12.1 (+0.3 WoW)

 Top Gaining Keywords (WoW):
  "ergonomic keyboard tray"     Position: 4.9 → 3.1  (+1.8)
  "monitor arm clamp mount"     Position: 5.4 → 3.3  (+2.1)
  "standing desk converter"     Position: 7.1 → 6.6  (+0.5)

 Top Losing Keywords (WoW):
  "home office setup guide"     Position: 8.4 → 9.5  (-1.1)
  "adjustable desk chair"       Position: 5.8 → 6.5  (-0.7)

 New Keywords Ranking (first appeared):
  "2026 office furniture trends" Position: 14.2 (142 impressions)
  "eco friendly desk materials"  Position: 18.7 (87 impressions)
```

### `ga compare`
Compare metrics across segments, date ranges, or dimensions.

```
$ ga compare --dimension deviceCategory --metric sessions,conversions,conversionRate

 Segment Comparison — by Device Category
 Period: 2026-02-01 to 2026-02-28

 ┌──────────┬──────────┬───────────┬──────────┬───────────┬──────────────┐
 │ Device   │ Sessions │ Share     │ Convers. │ Conv Rate │ Revenue      │
 ├──────────┼──────────┼───────────┼──────────┼───────────┼──────────────┤
 │ Desktop  │ 54,281   │ 38.0%     │ 1,108    │ 2.04%     │ $82,412      │
 │ Mobile   │ 81,424   │ 57.0%     │ 628      │ 0.77%     │ $38,247      │
 │ Tablet   │ 7,142    │ 5.0%      │ 111      │ 1.55%     │ $6,823       │
 └──────────┴──────────┴───────────┴──────────┴───────────┴──────────────┘

 Visualization:
  Sessions      Desktop ███████████████░░░░░░  38.0%
                Mobile  ██████████████████████  57.0%
                Tablet  ██░░░░░░░░░░░░░░░░░░░   5.0%

  Conv Rate     Desktop █████████████████████   2.04%  (highest)
                Tablet  ████████████████░░░░░   1.55%
                Mobile  ████████░░░░░░░░░░░░░   0.77%  (lowest)

 Insight: Mobile drives 57% of traffic but converts at 2.6x lower rate
 than Desktop. Priority: audit mobile checkout UX for friction points.
 Mobile revenue gap: $44,165 potential at desktop conversion rates.
```

---

## Workflow

```
  Natural Language Query
          |
          v
  +----------------+     +-------------------+     +------------------+
  | Query Parser   | --> | API Router        | --> | GA4 Data API     |
  | (NL -> params) |     | (service select)  |     | Search Console   |
  +----------------+     +-------------------+     +------------------+
                                                           |
                                                           v
                                                   +------------------+
                                                   | Response Engine  |
                                                   | - Format tables  |
                                                   | - Compute deltas |
                                                   | - Generate recs  |
                                                   +------------------+
                                                           |
                          +--------------------------------+
                          |                |               |
                          v                v               v
                   +------------+  +-------------+  +-----------+
                   | Terminal   |  | Export       |  | Alert     |
                   | Display    |  | CSV/JSON/PDF |  | Engine    |
                   +------------+  +-------------+  +-----------+
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_ERROR: Insufficient scopes for GA4 Data API` | Refresh token missing `analytics.readonly` scope | Re-authenticate with `ga auth --scopes analytics.readonly,webmasters.readonly` to include all required scopes. |
| `PROPERTY_NOT_FOUND: GA4 property 123456789 not accessible` | Wrong property ID or user lacks access | Verify `GA4_PROPERTY_ID` in GA4 Admin > Property Settings. Ensure the authenticated account has Viewer access or above. |
| `QUOTA_EXCEEDED: GA4 API token limit reached` | Exceeded 10,000 tokens per day per project | Reduce query complexity (fewer dimensions/metrics per request). Use cached results when possible. Quota resets at midnight Pacific. |
| `DIMENSION_INVALID: Unknown dimension 'pageUrl'` | Typo or using Universal Analytics dimension names in GA4 | GA4 uses `pagePath` instead of `pageUrl`. Run `ga dimensions` to list all valid GA4 dimensions and their descriptions. |
| `GSC_VERIFICATION_FAILED: Site not verified` | Search Console property not verified for the authenticated user | Verify site ownership in Search Console. Use `GSC_SITE_URL` format matching your verified property (URL prefix vs domain). |
| `DATE_RANGE_ERROR: Data not available before property creation` | Querying dates before the GA4 property was created | Check property creation date with `ga property-info`. GA4 does not backfill data from Universal Analytics. |
| `SAMPLING_WARNING: Report data is sampled (68% of sessions)` | Query exceeds GA4 sampling threshold (~10M events) | Narrow the date range or reduce dimensions. Use `--no-sampling` flag to force unsampled results (may be slower). |

---

## Data Storage

All local data is stored in `~/.ga4-agent/`:

```
~/.ga4-agent/
  ├── config.json               # Property configuration and preferences
  ├── tokens/
  │   ├── access_token.json     # Current access token (auto-refreshed)
  │   └── scopes.json           # Granted OAuth scopes
  ├── cache/
  │   ├── metadata.json         # GA4 dimensions/metrics catalog (24hr TTL)
  │   ├── query_cache/          # Recent query results (15min TTL)
  │   │   └── <hash>.json       # Hashed query -> result mapping
  │   └── sitemap_status.json   # Last sitemap crawl status
  ├── reports/
  │   └── YYYY-MM-DD_<type>.csv # Exported reports
  └── alerts/
      └── rules.json            # Threshold-based alert configurations
```

All data remains local. Query results are cached by a hash of the request parameters, so identical queries within the TTL window are served instantly. No analytics data is transmitted to any third-party service.

---

## Comparison Table

| Feature | GA4 & GSC Analyst | GA4 Web UI | Looker Studio | Screaming Frog |
|---|---|---|---|---|
| Natural language queries | Yes | No | No | No |
| CLI-based workflow | Yes | No | No | No |
| GA4 + GSC unified view | Yes | Separate tools | Manual connectors | GSC only (limited) |
| Real-time data | Yes (inline) | Yes (dedicated) | Near real-time | No |
| Funnel analysis | CLI command | Explorations | Custom build | No |
| SEO audit scoring | Automated 100-pt | No | Manual | Yes (different focus) |
| URL inspection | API-based | Manual (1 URL) | No | Crawl-based |
| Custom alerts | Threshold-based | Limited | Scheduled email | No |
| Export formats | CSV, JSON, PDF | CSV, PDF | PDF, CSV, email | CSV, Excel |
| Cost | Free (open source) | Free | Free (limited) | $259/year |
| Developer integration | Native (Claude Code) | None | Embed only | Standalone |

---

## FAQ

**1. How do I find my GA4 Property ID?**
In GA4, go to Admin > Property Settings. The Property ID is a numeric value (e.g., 123456789) displayed at the top. It is not the measurement ID (G-XXXXXXXX) -- that is for the data stream.

**2. Can I query Universal Analytics (UA) data?**
No. This agent uses the GA4 Data API exclusively. Universal Analytics was sunset in July 2024. If you need historical UA data, export it separately and use `ga import` to load CSVs for comparison.

**3. How do I connect multiple GA4 properties?**
Use `ga property switch <property-id>` to change the active property. You can register multiple properties with `ga property add <id> --alias "production"` and switch by alias.

**4. What Search Console property format should I use?**
Use the exact format from your verified property: `https://example.com/` for URL-prefix properties or `sc-domain:example.com` for domain properties. The format matters for API matching.

**5. Why do GA4 and Search Console numbers differ?**
GA4 measures on-site sessions (requires JavaScript execution). Search Console measures search appearances and clicks (server-side). Differences are normal due to bot filtering, JavaScript blocking, and measurement methodology.

**6. Can I set up automated SEO monitoring?**
Yes. Use `seo alert create --metric "avg_position" --threshold ">15" --query "brand keywords"` to create threshold alerts. Alerts are checked automatically when you run traffic or ranking commands.

**7. How do I analyze e-commerce performance?**
If your GA4 property has e-commerce events configured, use `ga conversions --event purchase` for transaction data or `ga ecommerce --report product-performance` for item-level analysis with revenue attribution.

**8. Does it support GA4 custom dimensions?**
Yes. Custom dimensions are accessible by their parameter name (e.g., `customUser:membership_tier`). Run `ga dimensions --custom` to list all custom dimensions configured in your property.

**9. Can I compare year-over-year data?**
Yes. Use `ga traffic --compare "last year"` or specify explicit date ranges with `--period "2026-02-01:2026-02-28" --compare "2025-02-01:2025-02-28"`. Day-of-week alignment is applied automatically.

**10. How accurate is real-time data?**
GA4 real-time data has up to a 30-minute lag and uses a different processing pipeline than standard reports. It is directionally accurate but should not be used for precise analysis. Standard reports (24-48 hour processing) are authoritative.

**11. Can I track Core Web Vitals trends over time?**
Use `gsc cwv --period "last 3 months"` to view Core Web Vitals trends from Search Console's CrUX data. This shows LCP, FID/INP, and CLS classifications (Good/Needs Improvement/Poor) by URL group.

**12. How do I diagnose a sudden traffic drop?**
Run `seo diagnose --event "traffic drop"` to trigger an automated investigation. The agent checks: algorithm updates, indexing status changes, ranking shifts, Search Console errors, and site availability in sequence, then presents a root cause analysis.
