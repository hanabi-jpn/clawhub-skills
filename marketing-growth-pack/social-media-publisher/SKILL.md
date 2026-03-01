---
name: social-media-publisher
description: "Cross-platform social media posting and analytics — X/Twitter, Instagram, TikTok, LINE"
author: hanabi-jpn
version: 1.0.0
tags:
  - social-media
  - twitter
  - instagram
  - tiktok
  - line
  - analytics
  - publishing
  - scheduling
---

```
   _____ ____  _____ ___    _    __
  / ___// __ \/ ___//   |  / |  / /
  \__ \/ / / / /   / /| | / / / /
 ___/ / /_/ / /___/ ___ |/ /_/ /
/____/\____/\____/_/  |_/\____/

 __  __ _____ ____  ___    _
|  \/  | ____|  _ \|_ _|  / \
| |\/| |  _| | | | || |  / _ \
| |  | | |___| |_| || | / ___ \
|_|  |_|_____|____/|___/_/   \_\

 ____  _   _ ____  _     ___ ____  _   _ _____ ____
|  _ \| | | | __ )| |   |_ _/ ___|| | | | ____|  _ \
| |_) | | | |  _ \| |    | |\___ \| |_| |  _| | |_) |
|  __/| |_| | |_) | |___ | | ___) |  _  | |___|  _ <
|_|    \___/|____/|_____|___|____/|_| |_|_____|_| \_\

       >>> Broadcast Everywhere at Once <<<
```

`social-media-publisher` `hashtag-optimizer` `multi-platform` `scheduler` `analytics`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Platforms](https://img.shields.io/badge/platforms-4_networks-blue)]()

> **One command, four platforms -- publish, schedule, and analyze your social presence from a single terminal.**

---

## Overview

Social Media Publisher eliminates the tab-switching chaos of managing multiple social platforms. Instead of logging into X, then Instagram, then TikTok, then LINE -- you compose once and publish everywhere with a single command. The agent handles the platform-specific formatting rules: 280-character limits on X, square aspect ratios on Instagram, vertical video requirements on TikTok, and rich message templates on LINE. What reaches each platform is optimized for that platform, not a lowest-common-denominator cross-post.

Beyond publishing, the agent provides a unified analytics layer. Engagement metrics from all four platforms are normalized into comparable units -- impressions, engagements, engagement rate, and follower growth -- so you can answer "which platform is performing best?" without opening four dashboards. The trending command monitors real-time hashtag velocity across X and TikTok to help you time your posts for maximum organic reach. Scheduling uses a priority queue that respects each platform's optimal posting windows based on your historical engagement data.

```
 CONTENT CREATION
       |
       v
 +---------------+
 | Content       |     +--------+    +--------+    +--------+    +--------+
 | Adapter Layer |---->|   X    |    |  Insta  |    | TikTok |    |  LINE  |
 | (per-platform |     | 280chr |    | square  |    | 9:16   |    | rich   |
 |  optimization)|     | + tags |    | + #30   |    | + sound|    | + flex |
 +---------------+     +---+----+    +---+-----+    +---+----+    +---+----+
       |                    |             |              |              |
       v                    v             v              v              v
 +---------------+     +-------------------------------------------+
 | Scheduler     |     |          Platform APIs                     |
 | (priority     |     |  X API v2 | Graph API | TikTok | LINE MSG |
 |  queue, cron) |     +-------------------------------------------+
 +---------------+                        |
       |                                  v
       v                          +---------------+
 +---------------+                | Webhook Ingest|
 | Analytics     |<---------------| (engagement   |
 | Normalizer    |                |  events)      |
 +-------+-------+                +---------------+
         |
         v
 +---------------+
 | Unified       |
 | Dashboard     |
 | (terminal)    |
 +---------------+
```

The agent is designed for the Japanese market first, with native support for LINE (the dominant messaging platform in Japan with 96M monthly active users) alongside global platforms. Hashtag analysis includes both Japanese and English trending topics, and the scheduling engine accounts for JST time zones by default.

---

## System Prompt Instructions

You are Social Media Publisher, a cross-platform social media management assistant. Follow these rules precisely:

1. Only use platforms for which the user has configured valid API tokens. If a token is missing, skip that platform and note it in the output instead of failing the entire command.
2. For X/Twitter posts, enforce the 280-character limit. If content exceeds this, automatically truncate with "..." and append the link to the full content if available.
3. For Instagram posts, require at least one image attachment. Text-only posts are not supported by the Instagram API. Warn the user if no image is provided.
4. For TikTok posts, require a video attachment. Validate that the video meets TikTok's requirements: 9:16 aspect ratio recommended, minimum 1 second, maximum 10 minutes, maximum 4GB file size.
5. For LINE messages, default to text messages but support Flex Message templates for rich content. Use the narrowcast API for targeted segments when `--audience` is specified.
6. Hashtag optimization: Analyze hashtag performance data and suggest the optimal mix of high-volume (>100K posts) and niche (<10K posts) hashtags. Limit to 30 hashtags for Instagram, 5 for X, and 5 for TikTok.
7. Scheduling must use ISO 8601 datetime format with timezone. Default timezone is `Asia/Tokyo`. Validate that scheduled time is in the future.
8. Cross-posting must adapt content per platform. Never send identical content to all platforms. Adjust character count, hashtag count, and media format for each target.
9. Analytics queries must normalize metrics across platforms. Define engagement rate as `(likes + comments + shares + saves) / impressions * 100`.
10. Never store full API tokens in logs. Mask as `****XXXX` (last 4 characters visible) in all output and log files.
11. For reply commands, always fetch the parent post context first to ensure the reply is contextually relevant.
12. DM commands require explicit `--confirm` flag to prevent accidental mass messaging. Rate limit DMs to 50 per hour per platform.
13. Report generation must include comparative analysis across platforms and time periods. Always show week-over-week and month-over-month deltas.
14. Image uploads must be validated: JPEG or PNG, maximum 5MB for X, 8MB for Instagram. Auto-compress if oversized using 85% quality JPEG.
15. Audience insights must respect privacy: never display individual user data. Aggregate all demographics to cohorts of 100+ users minimum.
16. Error messages must include the specific platform that failed and a direct link to the relevant API documentation for troubleshooting.
17. When posting content with links, automatically generate platform-appropriate link previews. For X, ensure Twitter Card metadata is present. For LINE, generate a rich link preview using OGP tags.
18. Support A/B testing with `--variant` flag: post different content versions to measure which performs better. Track variants in analytics.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `X_API_KEY` | No | -- | X/Twitter API key (OAuth 1.0a or OAuth 2.0) |
| `X_API_SECRET` | No | -- | X/Twitter API secret |
| `X_ACCESS_TOKEN` | No | -- | X/Twitter user access token |
| `INSTAGRAM_ACCESS_TOKEN` | No | -- | Instagram Graph API long-lived access token |
| `TIKTOK_ACCESS_TOKEN` | No | -- | TikTok for Developers access token |
| `LINE_CHANNEL_TOKEN` | No | -- | LINE Messaging API channel access token |

All tokens are optional. Configure only the platforms you use. The agent activates platform support dynamically based on which tokens are present.

---

## Commands

### `social post`

Publish content to one or more platforms.

```bash
$ social post "New spring menu launching this Friday! Cherry blossom latte and sakura mochi donut. Limited time only." --platforms x,instagram --image menu_spring.jpg

 Publishing to 2 platforms...

 X/Twitter ............... POSTED
   Tweet ID:    1896543210987654321
   URL:         https://x.com/hanabi_cafe/status/1896543210987654321
   Characters:  108/280
   Image:       Uploaded (1.2MB JPEG)

 Instagram ............... POSTED
   Post ID:     17920345678901234
   URL:         https://www.instagram.com/p/C4xYzAbCdEf/
   Hashtags:    Added 15 optimized tags
   Image:       Uploaded (1.2MB JPEG, 1:1 crop applied)

 Summary: 2/2 platforms published successfully
 Estimated reach: ~4,200 followers combined
```

### `social schedule`

Schedule a post for future publication.

```bash
$ social schedule "Weekend special: Buy 2 get 1 free on all pastries!" --platforms x,line --at "2026-03-07T10:00:00+09:00" --image pastry_deal.jpg

 Scheduled Post Created
 ─────────────────────────────────────────
 Schedule ID:   sch_a1b2c3d4e5f6
 Publish At:    2026-03-07 10:00 AM JST (Saturday)
 Platforms:     X/Twitter, LINE

 Platform Preview:
   X:    "Weekend special: Buy 2 get 1 free on all pastries!" + image (108 chars)
   LINE: Flex Message with image hero, title, body, and action button

 Optimal timing analysis:
   Saturday 10:00 JST is in your TOP 3 engagement windows
   Expected engagement: +23% vs. average post

 Status: SCHEDULED | Cancel with: social schedule cancel sch_a1b2c3d4e5f6
```

### `social analytics`

View engagement analytics across platforms.

```bash
$ social analytics --period 7d

 Social Analytics: Last 7 Days (2026-02-22 to 2026-03-01)
 ═══════════════════════════════════════════════════════════

 Platform     Impressions   Engagements   Eng. Rate   Followers   +/-
 ─────────────────────────────────────────────────────────────────────
 X/Twitter    28,412        1,847         6.5%        3,219       +84
 Instagram    19,803        2,641         13.3%       5,102       +127
 TikTok       142,300       8,921         6.3%        2,847       +412
 LINE         8,240         1,204         14.6%       12,400      +38
 ─────────────────────────────────────────────────────────────────────
 TOTAL        198,755       14,613        7.4%        23,568      +661

 Top Performing Post:
   Platform: TikTok
   Content:  "Behind the scenes: Making our matcha latte art"
   Views:    89,200 | Likes: 5,421 | Shares: 892 | Comments: 234

 Week-over-Week: Impressions +18.2% | Engagements +22.7% | Followers +2.9%
```

### `social trending`

Monitor trending hashtags and topics.

```bash
$ social trending --region JP --limit 10

 Trending Now in Japan (2026-03-01 14:30 JST)
 ═══════════════════════════════════════════════

 #   Hashtag/Topic           Platform   Volume     Velocity    Category
 1   #春コーデ                X+TikTok   248K       +340%/hr    Fashion
 2   #桜2026                 X+Insta    182K       +210%/hr    Seasonal
 3   #確定申告               X          156K       +89%/hr     Finance
 4   #ワンピースネタバレ       X          134K       +520%/hr    Anime
 5   #SpringSale             X+Insta    98K        +150%/hr    Shopping
 6   #カフェ巡り              Insta      87K        +45%/hr     Food
 7   #新生活準備              X+TikTok   76K        +120%/hr    Lifestyle
 8   #朝活                   Insta      64K        +32%/hr     Lifestyle
 9   #TikTokレシピ           TikTok     58K        +180%/hr    Food
 10  #推し活                 X+TikTok   52K        +67%/hr     Entertainment

 Recommendation: Posts about spring/seasonal content have 3.2x higher
 engagement this week. Consider incorporating #春コーデ or #桜2026.
```

### `social hashtags`

Get optimized hashtag suggestions for a post.

```bash
$ social hashtags "Cherry blossom latte at our Shibuya cafe" --platform instagram

 Hashtag Suggestions for Instagram (optimized mix of 20)
 ─────────────────────────────────────────────────────────

 High Volume (>500K):
   #sakura #cherryblossom #tokyo #cafe #latte #coffeelover

 Medium Volume (50K-500K):
   #tokyocafe #shibuyacafe #sakuralatte #springdrinks #japancafe
   #カフェ巡り #桜ラテ #渋谷カフェ

 Niche (<50K, high engagement):
   #cherryblossomlatte #sakuraseason2026 #花見カフェ
   #春限定ドリンク #桜スイーツ #渋谷グルメ

 Copy-ready:
 #sakura #cherryblossom #tokyo #cafe #latte #coffeelover #tokyocafe
 #shibuyacafe #sakuralatte #springdrinks #japancafe #カフェ巡り #桜ラテ
 #渋谷カフェ #cherryblossomlatte #sakuraseason2026 #花見カフェ #春限定ドリンク
 #桜スイーツ #渋谷グルメ

 Estimated reach boost: +45% vs. no hashtags
```

### `social reply`

Reply to mentions and comments.

```bash
$ social reply --platform x --to 1896500000000000000 "Thank you for visiting! We're glad you enjoyed the sakura latte. See you again soon!"

 Reply Posted
 ─────────────────────────────────────────
 Platform:    X/Twitter
 In Reply To: @coffee_lover_jp (1896500000000000000)
 Original:    "Best sakura latte I've ever had @hanabi_cafe!"
 Reply ID:    1896543999888777666
 Characters:  86/280
 URL:         https://x.com/hanabi_cafe/status/1896543999888777666

 Response time: 12 minutes from original mention
```

### `social dm`

Send direct messages to users or segments.

```bash
$ social dm --platform line --audience "vip_customers" --template welcome_spring --confirm

 LINE Direct Message Campaign
 ─────────────────────────────────────────
 Audience:     VIP Customers (segment: vip_customers)
 Recipients:   847 users
 Template:     welcome_spring (Flex Message)
 API Method:   Narrowcast

 Sending.......... COMPLETE

 Delivery Report:
   Sent:        847
   Delivered:   839  (99.1%)
   Opened:      612  (72.3%)  <- within first hour
   Link Clicks: 234  (27.6%)

 Cost: 0 messages (within free tier: 200/1000 used this month)
```

### `social report`

Generate a comprehensive social media performance report.

```bash
$ social report --period 30d --format table

 Social Media Report: February 2026
 ═══════════════════════════════════════════════════════════

 PUBLISHING SUMMARY
 Posts Published:    48 (X: 22, Instagram: 12, TikTok: 8, LINE: 6)
 Avg Posts/Week:     12.0
 Best Day:           Tuesday (avg +34% engagement)
 Best Time:          11:00-12:00 JST (lunch hour)

 AUDIENCE GROWTH
 Platform     Start      End        Growth    Rate
 X/Twitter    3,135      3,219      +84       +2.7%
 Instagram    4,975      5,102      +127      +2.6%
 TikTok       2,435      2,847      +412      +16.9%
 LINE         12,362     12,400     +38       +0.3%

 ENGAGEMENT LEADERS (Top 3 Posts)
 #  Platform   Content                              Eng. Rate
 1  TikTok     "Matcha art behind the scenes"       12.4%
 2  Instagram  "Valentine's special menu reveal"     9.8%
 3  X          "Snow day at the cafe + hot cocoa"    8.1%

 CONTENT TYPE PERFORMANCE
 Type         Avg Engagement Rate
 Video        9.7%  █████████████████████
 Carousel     7.2%  ████████████████
 Image        5.8%  █████████████
 Text Only    3.1%  ███████

 Month-over-Month: Total engagement +18.4% | Followers +3.1%
```

### `social cross-post`

Publish adapted content to all configured platforms at once.

```bash
$ social cross-post "Grand opening of our new Ikebukuro location! First 50 customers get a free drink." --image store_ikebukuro.jpg --video opening_reel.mp4

 Cross-Post Adaptation
 ─────────────────────────────────────────

 X/Twitter (text + image):
   "Grand opening of our new Ikebukuro location! First 50 customers
    get a free drink. #池袋 #NewOpen #GrandOpening #カフェ #春"
   Characters: 142/280 | Image: store_ikebukuro.jpg
   Status: POSTED

 Instagram (image + hashtags):
   Caption: "Grand opening of our new Ikebukuro location!
   First 50 customers get a free drink."
   + 20 optimized hashtags
   Image: store_ikebukuro.jpg (1:1 center crop)
   Status: POSTED

 TikTok (video):
   Caption: "We're OPEN in Ikebukuro! First 50 = free drink"
   Video: opening_reel.mp4 (verified 9:16, 45s)
   Status: POSTED

 LINE (Flex Message):
   Hero image + title + body + "Visit us" button with map link
   Audience: All friends (12,400)
   Status: POSTED

 Summary: 4/4 platforms published | Total potential reach: ~43,000
```

### `social audience`

View audience demographics and insights.

```bash
$ social audience --platform instagram

 Instagram Audience Insights (@hanabi_cafe)
 ═══════════════════════════════════════════════

 Total Followers: 5,102

 Gender:
   Female:   62%  ████████████████████████████████
   Male:     35%  ██████████████████
   Other:     3%  ██

 Age Groups:
   13-17:     2%  █
   18-24:    28%  ██████████████
   25-34:    41%  █████████████████████
   35-44:    18%  █████████
   45-54:     8%  ████
   55+:       3%  ██

 Top Locations:
   Tokyo:       47%  ████████████████████████
   Osaka:       12%  ██████
   Yokohama:     8%  ████
   Nagoya:       5%  ███
   Other JP:    22%  ███████████
   International: 6% ███

 Active Hours (JST):
   Peak 1:  12:00-13:00 (lunch)     ████████████████████
   Peak 2:  21:00-22:00 (evening)   ██████████████████
   Peak 3:  08:00-09:00 (commute)   ████████████████

 Recommendation: Target 25-34F in Tokyo during lunch hour for optimal reach.
```

---

## Workflow Diagram

```
  CONTENT LIFECYCLE
  =================

  Idea / Content Brief
       |
       v
  +-----------+
  | Compose   |---> Write once, adapt per platform
  +-----------+
       |
       v
  +-----------+     Immediate?     +-----------+
  | Timing    |------ Yes -------->| Publish   |
  | Decision  |                    | Now       |
  +-----------+                    +-----------+
       |                                |
       | Schedule?                      |
       v                                v
  +-----------+                    +-----------+
  | Queue     |--- at time ----->>| Multi-    |
  | (cron)    |                    | Platform  |
  +-----------+                    | Adapter   |
                                   +-----+-----+
                                         |
                      +------+------+----+----+------+
                      |      |      |         |      |
                      v      v      v         v      v
                     [X]  [Insta] [TikTok]  [LINE]  ...
                      |      |      |         |
                      +------+------+---------+
                                   |
                                   v
                            +-----------+
                            | Analytics |
                            | Collector |
                            +-----------+
                                   |
                                   v
                            +-----------+
                            | Unified   |
                            | Report    |
                            +-----------+
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `X_AUTH_FAILED: 401 Unauthorized` | Expired or invalid X API tokens | Regenerate tokens at developer.x.com. Ensure your app has Read and Write permissions. |
| `INSTA_NO_IMAGE: Image required` | Attempted text-only post on Instagram | Instagram API requires at least one image. Add `--image photo.jpg` to your command. |
| `TIKTOK_VIDEO_FORMAT: Unsupported codec` | Video uses unsupported codec or container | Re-encode with: `ffmpeg -i input.mov -c:v h264 -c:a aac output.mp4`. TikTok requires H.264/AAC in MP4 container. |
| `LINE_QUOTA_EXCEEDED: Monthly message limit` | Free tier LINE message limit reached (1,000/month) | Upgrade to LINE Official Account Light plan (5,000 messages) or Standard plan (unlimited, ¥15,000/month). |
| `RATE_LIMITED: Too many requests` | Platform API rate limit hit (X: 300 posts/3hr, Insta: 25 posts/day) | The agent auto-queues excess posts. Check queue with `social schedule list`. Spread posts across the day. |
| `MEDIA_TOO_LARGE: File exceeds limit` | Image >5MB (X) or >8MB (Instagram) | The agent auto-compresses at 85% JPEG quality. For videos, use `--compress` flag to transcode to target bitrate. |
| `SCHEDULE_PAST: Cannot schedule in the past` | Scheduled time has already passed | Ensure datetime is in the future and includes timezone. Use ISO 8601 format: `2026-03-07T10:00:00+09:00`. |

---

## Data Storage

All persistent data is stored under `~/.clawhub/social-media-publisher/`:

| Path | Purpose | Format | Retention |
|---|---|---|---|
| `schedule_queue.db` | Scheduled posts waiting for publication | SQLite | Until published or cancelled |
| `analytics.db` | Normalized engagement metrics from all platforms | SQLite | 1 year, aggregated monthly |
| `posts.log` | Log of all published posts with platform IDs | JSON lines | 1 year |
| `media_cache/` | Uploaded media files for scheduled posts | JPEG/PNG/MP4 | Until post published, then 7 days |
| `templates/` | Reusable post templates and LINE Flex Messages | JSON | Permanent |
| `hashtag_performance.db` | Historical hashtag engagement data | SQLite | 6 months |

---

## Comparison Table

| Feature | social-media-publisher | Buffer | Hootsuite | Later | Loomly |
|---|---|---|---|---|---|
| X/Twitter | Yes | Yes | Yes | Yes | Yes |
| Instagram | Yes | Yes | Yes | Yes | Yes |
| TikTok | Yes | Yes | Yes | Yes | Yes |
| LINE | Yes (native) | No | No | No | No |
| CLI Interface | Yes | No | No | No | No |
| Hashtag Optimization | AI-powered + JP | Basic | Basic | Yes | Basic |
| Cross-post Adaptation | Per-platform AI | Basic resize | Basic | Basic | Templates |
| Analytics Normalization | Unified metrics | Per-platform | Unified | Per-platform | Unified |
| Scheduling | Cron + optimal time | Calendar | Calendar | Calendar | Calendar |
| A/B Testing | Built-in variants | No | Enterprise | No | Yes |
| Audience Insights | Aggregated, privacy-safe | Basic | Yes | Basic | Basic |
| Japanese Market | Native (LINE, JP hashtags) | No | Limited | No | No |
| Price | Free (API costs only) | $6-120/mo | $99-739/mo | $25-80/mo | $42-369/mo |
| Self-hosted Data | Yes (local SQLite) | Cloud only | Cloud only | Cloud only | Cloud only |

---

## FAQ

**1. Do I need API access for all four platforms?**
No. Configure tokens only for the platforms you use. The agent dynamically enables features based on which environment variables are set. You can start with just X and add platforms later.

**2. How do I get an X/Twitter API key?**
Apply at [developer.x.com](https://developer.x.com). You need at minimum a Free tier account ($0) which allows 1,500 tweets/month. The Basic tier ($100/month) adds analytics API access.

**3. Can I post to Instagram without a Business account?**
No. The Instagram Graph API requires a Business or Creator account connected to a Facebook Page. Personal accounts cannot use the publishing API.

**4. How does cross-posting adapt content?**
The agent transforms your single post into platform-optimized versions: truncates text for X's 280-char limit, adds optimized hashtags for Instagram (up to 30), converts media to the right aspect ratio, and generates LINE Flex Messages with action buttons.

**5. Is LINE messaging free?**
LINE Official Accounts have a free tier of 1,000 messages per month. Beyond that, the Light plan costs approximately ¥5,000/month for 5,000 messages, and the Standard plan offers unlimited messages for ¥15,000/month.

**6. How does the scheduler determine optimal posting time?**
The agent analyzes your historical engagement data to identify time slots with the highest average engagement rate. If you have fewer than 30 posts of history, it uses platform-wide best practices (lunch hour 12:00 and evening 21:00 JST for Japan).

**7. Can I schedule posts weeks in advance?**
Yes. The schedule queue has no time limit. You can schedule posts months in advance. Posts are stored locally in SQLite, so your machine must be running at the scheduled time (or use a cron daemon).

**8. How are analytics normalized across platforms?**
All platforms report metrics differently. The agent normalizes to a common schema: impressions (total views), engagements (likes + comments + shares + saves), engagement rate (engagements/impressions * 100), and follower delta. This allows apples-to-apples comparison.

**9. Can I manage multiple accounts per platform?**
Yes. Set up profile aliases in `~/.clawhub/social-media-publisher/config.json`. Use `--profile work` or `--profile personal` to switch between accounts within the same command.

**10. Does the agent support Instagram Reels and Stories?**
Instagram Reels are supported via the Content Publishing API. Stories require the Instagram Stories API, which is currently in limited beta. The agent will post to Reels when you include a video under 90 seconds with `--type reel`.

**11. How do I handle platform outages gracefully?**
If a platform API is unreachable, the agent retries 3 times with exponential backoff. If all retries fail, the post is saved to the local retry queue and attempted again in 15 minutes. Use `social schedule retry-failed` to manually trigger retries.

**12. Can I preview how a post will look before publishing?**
Yes. Add `--dry-run` to any post or cross-post command. The agent shows the exact content, character count, hashtags, and media that would be sent to each platform without actually publishing.

**13. Is there an undo/delete function?**
Yes. Use `social delete --platform x --id 1896543210987654321` to remove a published post. Note that deletion is permanent and cannot be reversed. Some platforms may take up to 30 minutes to fully propagate the deletion.
