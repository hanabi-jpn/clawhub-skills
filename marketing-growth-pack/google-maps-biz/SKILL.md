---
name: google-maps-biz
description: "Location intelligence for business — geocoding, places search, routing optimization, Google Business Profile"
author: hanabi-jpn
version: 1.0.0
tags:
  - google-maps
  - geocoding
  - places-api
  - routing
  - business-profile
  - location-intelligence
  - store-locator
---

```
╔═══════════════════════════════════════════════════╗
║  ┌─────────────────────────────────────────────┐  ║
║  │  G O O G L E   M A P S   B U S I N E S S  │  ║
║  │          ━━━━━━━━━━━━━━━━━━━━              │  ║
║  │  📍 Geocode ── Places ── Routes            │  ║
║  │  🏪 Reviews ── Competitors ── Profile      │  ║
║  │     Location Intelligence for Business     │  ║
║  └─────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════╝
```

`google-maps-biz` `business-profile` `geocoding` `places-api` `route-optimizer`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Places](https://img.shields.io/badge/places-200M%2B_POI-green)]()

> **Turn raw addresses into business decisions -- geocode, search, route, and dominate your local market with the full power of Google Maps Platform.**

---

## Overview

Google Maps Business Agent transforms the Google Maps Platform into a command-line business intelligence tool. Instead of writing boilerplate API integration code, you issue natural commands like `maps search "ramen near Shibuya"` and receive structured, actionable data. The agent handles API key management, quota tracking, pagination, and result enrichment behind the scenes so you can focus on extracting location insights.

The architecture is built around a layered pipeline. Raw requests flow through an authentication layer that injects your API key, then through a request builder that translates human-readable commands into properly formatted API calls, and finally through a response parser that normalizes the heterogeneous outputs from Places, Directions, Geocoding, and Business Profile APIs into a consistent tabular format. A local cache layer prevents redundant API calls for repeated queries, and a quota monitor warns you before you hit billing thresholds.

```
 USER COMMAND
      |
      v
 +----------------+     +------------------+     +-------------------+
 | Command Parser |---->| Auth & Key Mgmt  |---->| Google Maps APIs   |
 +----------------+     +------------------+     | - Places API       |
      |                       |                  | - Directions API   |
      |                       |                  | - Geocoding API    |
      |                       |                  | - Business Profile |
      |                       v                  +-------------------+
      |                 +------------------+            |
      |                 | Local Cache      |<-----------+
      |                 | (SQLite, 24h TTL)|
      |                 +------------------+
      |                       |
      v                       v
 +----------------+     +------------------+
 | Output Render  |<----| Response Parser  |
 | (table/json/   |     | & Normalizer     |
 |  csv/map-url)  |     +------------------+
 +----------------+
      |
      v
  TERMINAL OUTPUT
```

For businesses operating in Japan and across Asia-Pacific, the agent includes region-aware defaults such as Japanese-language place results, metric distance units, and address formatting that respects the Japanese postal system. Multi-stop route optimization uses a nearest-neighbor heuristic with optional TSP solver integration for delivery fleet planning.

---

## System Prompt Instructions

You are Google Maps Business Agent, a location intelligence assistant. Follow these rules precisely:

1. Always validate the `GOOGLE_MAPS_API_KEY` environment variable before making any API call. If missing, return a clear error with setup instructions.
2. Default all queries to the region specified in `MAPS_DEFAULT_REGION` (default: JP). Users can override per-command with `--region`.
3. For Places API searches, always request these fields: `name`, `formatted_address`, `geometry`, `rating`, `user_ratings_total`, `business_status`, `opening_hours`, `types`, `price_level`.
4. Geocoding results must always include `lat`, `lng`, `formatted_address`, `place_id`, and `plus_code` when available.
5. Route optimization must account for real-time traffic when `--traffic` flag is set. Default to `best_guess` departure time model.
6. Never expose the raw API key in output. Mask it as `GMAP-****XXXX` in logs and debug output.
7. Cache all geocoding results locally in `~/.clawhub/google-maps-biz/cache.db` with a 24-hour TTL to reduce API costs.
8. When returning place results, sort by relevance unless `--sort rating`, `--sort distance`, or `--sort reviews` is specified.
9. For bulk operations (bulk-geocode, competitor mapping), implement exponential backoff starting at 200ms with a max of 5 retries per request.
10. Business Profile operations require `GOOGLE_BUSINESS_ACCOUNT_ID`. If not set, return a warning and skip profile-specific fields.
11. Always display distances in the unit system appropriate for the region (metric for JP/EU, imperial for US) unless overridden with `--units`.
12. Format currency values according to locale. JPY uses no decimal places; USD uses two decimal places.
13. Rate-limit all API calls to stay within the free tier threshold ($200/month) unless `--no-rate-limit` is explicitly passed.
14. Output format defaults to a human-readable table. Support `--format json`, `--format csv`, and `--format map-url` for programmatic use.
15. For competitor mapping, calculate a competitive density score based on the number of similar businesses within a configurable radius (default: 1km).
16. When handling Japanese addresses, parse both kanji and romaji formats. Accept postal codes in `NNN-NNNN` format.
17. Log all API calls with timestamps and quota usage to `~/.clawhub/google-maps-biz/api.log` for cost auditing.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Yes | -- | Google Maps Platform API key with Places, Directions, and Geocoding APIs enabled |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | No | -- | Google Business Profile account ID for profile management commands |
| `MAPS_DEFAULT_REGION` | No | `JP` | ISO 3166-1 alpha-2 region code for default query bias |

---

## Commands

### `maps search`

Search for places by keyword and location.

```bash
$ maps search "ramen near Shibuya Station" --limit 5

 #  Name                          Rating  Reviews  Address                               Status
 1  Fuunji                        4.3     4,812    3-7-2 Yoyogi, Shibuya-ku, Tokyo       OPERATIONAL
 2  Afuri Shibuya                 4.1     3,204    1-1-7 Ebisu, Shibuya-ku, Tokyo         OPERATIONAL
 3  Ichiran Shibuya               3.9     6,519    1-22-7 Jinnan, Shibuya-ku, Tokyo       OPERATIONAL
 4  Nagi Shinjuku Golden Gai      4.4     2,891    1-1-10 Kabukicho, Shinjuku-ku, Tokyo   OPERATIONAL
 5  Menya Musashi Kosho           4.0     1,733    3-26-1 Yoyogi, Shibuya-ku, Tokyo       OPERATIONAL

 Found 5 results | Region: JP | Cached: No | API cost: ~$0.032
```

### `maps geocode`

Convert an address to coordinates or coordinates to an address.

```bash
$ maps geocode "東京都渋谷区神宮前1-1-1"

 Address:    1-1-1 Jingumae, Shibuya-ku, Tokyo 150-0001, Japan
 Latitude:   35.6694
 Longitude:  139.7027
 Place ID:   ChIJe_oF2COOGLARYP-hnfTHsms
 Plus Code:  8Q7XMMG2+QV
 Postal:     150-0001
 Confidence: ROOFTOP

 API cost: ~$0.005
```

### `maps route`

Calculate directions between two or more points.

```bash
$ maps route "Tokyo Station" "Yokohama Station" --mode driving --traffic

 Route: Tokyo Station -> Yokohama Station
 Distance:     31.4 km
 Duration:     42 min (in traffic: 58 min)
 Toll Cost:    ¥1,320 (ETC: ¥920)
 Via:          Shuto Expressway -> Bay Shore Route

 Step  Instruction                              Distance   Duration
 1     Head south on Yaesu-dori                  0.8 km     3 min
 2     Merge onto Shuto Expressway               18.2 km    22 min
 3     Continue onto Bay Shore Route              9.1 km     12 min
 4     Take exit toward Yokohama Station          3.3 km     5 min

 Departure: now | Traffic model: best_guess | API cost: ~$0.010
```

### `maps business`

Manage your Google Business Profile listings.

```bash
$ maps business status --account my-ramen-shop

 Business:    Hanabi Ramen Shibuya
 Status:      VERIFIED
 Category:    Ramen Restaurant
 Phone:       +81-3-1234-5678
 Website:     https://hanabi-ramen.jp
 Hours:       Mon-Sat 11:00-23:00, Sun 11:00-21:00
 Rating:      4.6 (823 reviews)
 Photos:      34 uploaded
 Posts:       Last post: 3 days ago
 Q&A:         12 unanswered questions

 Profile completeness: 92% | Suggestion: Answer pending Q&A to improve ranking
```

### `maps nearby`

Find businesses within a radius of a given location.

```bash
$ maps nearby "35.6595,139.7004" --type restaurant --radius 500 --limit 5

 #  Name                   Type        Dist   Rating  Price
 1  Trattoria Ciao         Italian     120m   4.5     ¥¥
 2  Sushi Dai              Sushi       230m   4.7     ¥¥¥
 3  CoCo Ichibanya         Curry       310m   3.8     ¥
 4  Wendy's First Kitchen  Fast Food   380m   3.4     ¥
 5  Uobei Shibuya          Sushi       450m   4.1     ¥

 Radius: 500m | Results: 5/47 | Region: JP
```

### `maps reviews`

Fetch and analyze reviews for a place.

```bash
$ maps reviews "Fuunji Ramen" --analyze

 Place:   Fuunji (ふうんじ)
 Rating:  4.3/5.0 (4,812 reviews)

 Sentiment Breakdown:
   Positive:  78%  ████████████████░░░░
   Neutral:   14%  ███░░░░░░░░░░░░░░░░░
   Negative:   8%  ██░░░░░░░░░░░░░░░░░░

 Top Themes:
   "tsukemen"     mentioned 1,204 times  (positive: 91%)
   "queue/wait"   mentioned 892 times    (negative: 67%)
   "fish broth"   mentioned 634 times    (positive: 88%)
   "portion size" mentioned 412 times    (positive: 72%)

 Recent Trend: Rating stable at 4.3 over last 6 months
```

### `maps optimize`

Optimize a multi-stop delivery or visit route.

```bash
$ maps optimize --stops "Shibuya,Shinjuku,Ikebukuro,Ueno,Tokyo,Shinagawa" --start "Shibuya"

 Optimized Route (6 stops, round-trip):
 Total Distance: 28.7 km | Total Time: 1h 14min

 Order  Stop          Arrive   Depart   Leg Dist   Leg Time
 1      Shibuya       --       09:00    --         --
 2      Shinjuku      09:12    09:22    4.2 km     12 min
 3      Ikebukuro     09:35    09:45    5.1 km     13 min
 4      Ueno          10:02    10:12    7.3 km     17 min
 5      Tokyo         10:22    10:32    3.8 km     10 min
 6      Shinagawa     10:44    10:54    5.2 km     12 min
 ->     Shibuya       11:07    --       3.1 km     13 min

 Savings vs. original order: 6.3 km / 18 min
 Algorithm: nearest-neighbor | API cost: ~$0.015
```

### `maps competitor`

Analyze competitor density and positioning around a location.

```bash
$ maps competitor "ramen" --center "Shibuya Station" --radius 1km

 Competitor Analysis: "ramen" within 1km of Shibuya Station
 Total Competitors: 23

 Rating Distribution:
   5.0       ░░ 1
   4.0-4.9   ████████████ 12
   3.0-3.9   ███████ 8
   <3.0      ██ 2

 Price Level:
   ¥         ████ 4
   ¥¥        ████████████ 13
   ¥¥¥       ████ 5
   ¥¥¥¥      ░ 1

 Density Score: 7.3/10 (HIGH COMPETITION)
 Avg Rating: 3.9 | Avg Reviews: 1,247 | Median Price: ¥¥

 Opportunity: Low competition in ¥¥¥ segment with 4.5+ rating
```

### `maps bulk-geocode`

Geocode a batch of addresses from a CSV file.

```bash
$ maps bulk-geocode addresses.csv --output geocoded.csv

 Processing 150 addresses...
 [████████████████████████████░░]  142/150  (94.7%)

 Results:
   Success:     142  (94.7%)
   Partial:       5  (3.3%)   <- low confidence matches
   Failed:        3  (2.0%)   <- unresolvable addresses

 Failed addresses written to: geocode_errors.csv
 Output saved to: geocoded.csv (columns: address, lat, lng, place_id, confidence)

 Total API cost: ~$0.750 | Time: 34s | Rate: 4.4 req/s
```

---

## Workflow Diagram

```
                     +-----------+
                     |  User CLI |
                     +-----+-----+
                           |
              +------------+-------------+
              |            |             |
         [search]     [geocode]     [route]
              |            |             |
              v            v             v
         +--------+  +--------+   +----------+
         | Places |  | Geocode|   | Directions|
         |  API   |  |  API   |   |   API     |
         +---+----+  +---+----+   +-----+-----+
              |            |             |
              +------+-----+------+------+
                     |            |
                     v            v
              +----------+  +---------+
              |  Cache   |  | Quota   |
              | (SQLite) |  | Monitor |
              +----+-----+  +----+----+
                   |              |
                   v              v
              +----------+  +---------+
              | Response |  | Cost    |
              | Renderer |  | Logger  |
              +----+-----+  +---------+
                   |
                   v
              FORMATTED OUTPUT
              (table/json/csv)
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_FAILED: Invalid API key` | Expired or misconfigured API key | Run `echo $GOOGLE_MAPS_API_KEY` to verify. Regenerate at console.cloud.google.com if needed. |
| `QUOTA_EXCEEDED: Daily limit reached` | API usage exceeded the $200/month free tier or daily cap | Check usage at console.cloud.google.com/billing. Set `--no-rate-limit` if you accept higher costs. |
| `ZERO_RESULTS: No places found` | Query too specific or region mismatch | Broaden the search radius with `--radius`, or change `--region` to match target location. |
| `GEOCODE_PARTIAL: Low confidence match` | Ambiguous or incomplete address | Provide full postal code and prefecture. Use `--strict` to reject partial matches entirely. |
| `ROUTE_NOT_FOUND: No route between points` | Points are on different islands or unreachable by the specified mode | Try `--mode transit` for island-to-island routes, or verify coordinates are on road-accessible land. |
| `BUSINESS_UNVERIFIED: Profile not claimed` | Attempting profile management on unverified listing | Complete Google Business verification flow at business.google.com before using `maps business` commands. |
| `RATE_LIMITED: Too many requests` | Burst of requests exceeded per-second QPS limit | The agent automatically retries with exponential backoff. If persistent, reduce `--concurrency` for bulk ops. |

---

## Data Storage

All persistent data is stored under `~/.clawhub/google-maps-biz/`:

| Path | Purpose | Format | Retention |
|---|---|---|---|
| `cache.db` | Geocoding and Places result cache | SQLite | 24 hours TTL, auto-pruned |
| `api.log` | API call log with timestamps and costs | JSON lines | 90 days, rotated monthly |
| `favorites.json` | Saved locations and frequent searches | JSON | Permanent until user deletes |
| `routes/` | Saved optimized routes | JSON per route | Permanent |
| `exports/` | CSV and GeoJSON export files | CSV / GeoJSON | Permanent |

---

## Comparison Table

| Feature | google-maps-biz | Google Maps Console | Mapbox CLI | OpenStreetMap / Nominatim |
|---|---|---|---|---|
| Places Search (200M+ POI) | Yes | Yes | Limited POI | Community-sourced |
| Real-time Traffic Routing | Yes | Yes | Yes | No |
| Japanese Address Parsing | Native (kanji + romaji) | Yes | Limited | Partial |
| Google Business Profile | Yes | Yes | No | No |
| Bulk Geocoding | Yes (CSV pipeline) | Manual only | Yes | Yes (rate-limited) |
| Route Optimization (TSP) | Yes (built-in) | No | Yes (Optimization API) | No |
| Competitor Analysis | Yes (density score) | No | No | No |
| Cost Tracking | Per-command breakdown | Monthly aggregate | Per-request | Free |
| Offline Cache | SQLite, 24h TTL | No | No | Self-hosted option |
| CLI-native Output | Table, JSON, CSV, map-url | Web UI only | JSON | JSON/XML |
| Price | API costs ($0.005-$0.03/req) | Same API costs | $0.005-$0.06/req | Free (self-host) |

---

## FAQ

**1. How do I get a Google Maps API key?**
Go to [console.cloud.google.com](https://console.cloud.google.com), create a project, enable Places API, Directions API, and Geocoding API, then create an API key under Credentials. Restrict the key to these three APIs for security.

**2. How much does this cost to use?**
Google offers $200/month in free credits. A typical search costs $0.032, geocoding costs $0.005, and routing costs $0.010. The agent tracks spending per-command so you always know your burn rate.

**3. Can I use this without a Google Business Profile?**
Yes. All commands except `maps business` work without a Business Profile. The `GOOGLE_BUSINESS_ACCOUNT_ID` variable is optional.

**4. How does the cache work?**
Every geocoding and places result is cached locally in SQLite with a 24-hour TTL. Repeated queries hit the cache instead of the API, saving money. Use `--no-cache` to force a fresh request.

**5. Can I geocode Japanese addresses in kanji?**
Yes. The agent accepts both kanji addresses like "東京都渋谷区神宮前1-1-1" and romaji like "1-1-1 Jingumae, Shibuya-ku, Tokyo". Postal codes in NNN-NNNN format are also supported.

**6. How does route optimization work?**
The `maps optimize` command uses a nearest-neighbor heuristic by default. For routes with 10+ stops, it applies a 2-opt improvement pass. This is not a guaranteed optimal solution for large TSP instances but produces near-optimal results in seconds.

**7. What output formats are supported?**
Table (default for terminal), JSON (`--format json`), CSV (`--format csv`), and map URL (`--format map-url`) which generates a Google Maps link you can open in a browser.

**8. Can I use this for delivery fleet routing?**
Yes. Combine `maps optimize` with `--start` and `--end` flags for depot-to-depot routing. For multiple vehicles, split stops into groups and optimize each independently.

**9. How does competitor analysis calculate the density score?**
The density score (0-10) is based on the number of matching businesses per square kilometer, weighted by their average rating and review count. A score above 7 indicates high competition.

**10. Is there a rate limit?**
Google enforces 50 QPS (queries per second) by default. The agent self-limits to stay within free tier spending unless you pass `--no-rate-limit`. Bulk operations use configurable concurrency with `--concurrency`.

**11. Can I export results as GeoJSON for mapping tools?**
Yes. Use `--format geojson` on any search or geocode command to produce a GeoJSON FeatureCollection compatible with QGIS, Mapbox, or Leaflet.

**12. Does the agent handle API key rotation?**
Not automatically. However, the quota monitor warns you at 80% of your monthly budget. You can set up multiple keys and switch with `export GOOGLE_MAPS_API_KEY=new_key`.
