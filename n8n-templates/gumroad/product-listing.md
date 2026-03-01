# n8n Japan Business Automation Pack by hanabi-jpn

## Gumroad Product Listing

---

### Product Name
**n8n Japan Business Automation Pack by hanabi-jpn**

### Tagline
5 production-ready n8n workflow templates built for businesses operating in Japan. ChatWork, Stripe JPY, kintone, LINE, GA4 -- everything wired together, ready to deploy in minutes.

### Price
- **Bundle (all 5 templates): $49** (save $46 vs. buying individually)
- **Individual templates: $19 each**

---

## Product Description (Gumroad Body)

### Stop Building From Scratch. Start Automating Today.

If you run a business in Japan, you already know the pain: ChatWork notifications that never got built, Stripe webhooks you keep meaning to set up, that kintone-to-Sheets sync you've been doing by hand every week.

These 5 n8n workflow templates solve the automation problems that every Japan-based business faces. They are not toy demos. They are production-grade workflows with real error handling, Japanese locale support, and JST timezone awareness baked in.

**Import. Configure. Activate. Done.**

Each template took 10-20 hours to build and test. You get all five for the price of a team lunch.

---

### What You Get

This pack includes **5 complete n8n workflow JSON files** plus a detailed setup guide. Every template is:

- Importable with one click into any n8n instance (cloud or self-hosted)
- Built with n8n v1.x compatible nodes (HTTP Request v4.2, Code v2, Schedule Trigger v1.2)
- Configured for JST (Asia/Tokyo) timezone
- Documented with every required environment variable listed
- Production-tested on live systems

---

### The 5 Templates

#### 1. ChatWork Notification Hub -- Multi-Source Alert Router
**The foundation of your ops stack.**

Route deployment notifications, error alerts, and daily team greetings through ChatWork -- Japan's most-used business chat platform.

- **Webhook endpoint** receives deployment and error events from any CI/CD system, monitoring tool, or custom app
- **Smart routing** sends deployments to your deploy room and errors to your error room
- **Automatic task creation** assigns error investigation tasks with deadlines to your on-call engineer using ChatWork's `[To:ID]` mention syntax
- **Daily morning greeting** posts at 9 AM JST on weekdays with a task reminder to keep your team aligned
- 8 nodes, 2 triggers (Webhook + Schedule)

*Value: Replaces manual Slack-to-ChatWork bridges and custom notification scripts.*

---

#### 2. Stripe Japan Payment Flow -- PayPay, Konbini & Card Processing
**Real payment processing for the Japanese market.**

Handle Stripe webhook events with full support for Japan-specific payment methods that most templates completely ignore.

- **HMAC-SHA256 signature verification** -- no unverified webhooks getting through
- **Event routing** for payment succeeded, payment failed, and dispute created
- **JPY zero-decimal formatting** -- displays amounts correctly with the yen symbol (no dividing by 100 for JPY)
- **Japan payment method tracking** -- Card, PayPay, Konbini (convenience store), Bank Transfer
- **Automatic Google Sheets logging** for your accountant
- **ChatWork notifications** to your sales team for every payment event
- **Dispute alerts** with deadline warnings and on-call engineer mentions
- 10 nodes, 1 trigger (Webhook)

*Value: A Stripe Japan integration that actually handles konbini and PayPay correctly. Try finding that in the free template library.*

---

#### 3. Social Media Cross-Post Scheduler -- X, Instagram, LINE
**One content calendar. Three platforms. Zero manual posting.**

Manage your entire social media presence from a Google Sheets content calendar with automated posting to X/Twitter, Instagram, and LINE.

- **Scheduled posting** at optimal engagement times (10 AM, 12 PM, 6 PM JST, weekdays)
- **Google Sheets content calendar** with per-platform text columns, image URLs, and status tracking
- **X/Twitter posting** via API v2 (OAuth 1.0a)
- **Instagram two-step publishing** -- creates media container, then publishes (the correct way)
- **LINE broadcast messaging** to all your followers
- **Aggregated results summary** -- see which platforms succeeded or failed
- **ChatWork notification** to your marketing team after every posting round
- 9 nodes, 1 trigger (Schedule)

*Value: Replace Buffer/Hootsuite ($100+/month) with a workflow you own and control forever.*

---

#### 4. GA4 Weekly Report -- Automated SEO & Traffic Analysis
**Your Monday morning analytics briefing, delivered automatically.**

Pulls GA4 and Google Search Console data every Monday and delivers a formatted report to ChatWork.

- **Week-over-week comparison** for all key metrics
- **GA4 overview**: Active Users, Sessions, Pageviews, Avg Duration, Bounce Rate, Conversions, Revenue (JPY)
- **Traffic by channel**: Organic, Paid, Direct, Social, Referral -- with sessions, conversions, and revenue per channel
- **Top 10 Search Console keywords** with clicks, impressions, and average position
- **Formatted ChatWork message** using `[info]` blocks for clean, readable reports
- 6 nodes, 1 trigger (Schedule, Monday 9 AM JST)

*Value: Stop manually pulling GA4 reports every week. This runs itself and your whole team sees the numbers.*

---

#### 5. kintone Bi-Directional Sync -- Google Sheets to kintone Records
**Finally, kintone and Google Sheets that actually stay in sync.**

Two-way synchronization between Google Sheets and Cybozu kintone, the CRM/database platform used by 30,000+ Japanese companies.

- **Bi-directional sync** -- changes in Sheets push to kintone, changes in kintone push to Sheets
- **Scheduled sync every 15 minutes** plus real-time sync via kintone webhook
- **Smart difference calculation** -- only creates, updates, or syncs back records that actually changed
- **Bulk record operations** via kintone REST API for efficiency
- **Japanese field name support** -- works with fields named in Japanese (company name: 会社名, status: ステータス, estimated revenue: 売上見込, etc.)
- **ChatWork notifications** for every sync operation
- 11 nodes, 2 triggers (Schedule + Webhook)

*Value: Eliminates the "which system has the latest data?" problem that plagues every kintone + Sheets setup.*

---

### What's Inside the ZIP

```
hanabi-jpn-n8n-japan-business-pack-v1/
  README.txt                          -- Quick start guide
  setup-guide.md                      -- Detailed setup instructions
  workflows/
    chatwork-notification.json        -- Template 1
    stripe-payment-flow.json          -- Template 2
    social-media-scheduler.json       -- Template 3
    ga4-weekly-report.json            -- Template 4
    kintone-sync.json                 -- Template 5
```

---

### Screenshots / Preview

**ChatWork Notification Hub Workflow Canvas**
A clean 8-node workflow with two entry points: a Webhook Trigger for incoming events and a Schedule Trigger for the daily 9 AM greeting. Events flow through conditional routing (Is Deployment? / Is Error?) to the appropriate ChatWork room, with automatic task creation for errors.

**Stripe Payment Flow Workflow Canvas**
A 10-node workflow starting from a Stripe Webhook, through HMAC signature verification, then a 3-way Switch node routing to Payment Succeeded (with Google Sheets logging), Payment Failed, and Dispute Alert paths. Each path ends with a ChatWork notification.

**Social Media Scheduler Workflow Canvas**
A 9-node workflow that fans out from a Google Sheets content calendar to three parallel posting paths (X/Twitter, Instagram with two-step publish, LINE broadcast), then aggregates results and notifies your marketing team via ChatWork.

**GA4 Weekly Report Workflow Canvas**
A 6-node workflow that fires every Monday, makes three parallel API calls (GA4 overview, GA4 channels, Search Console keywords), merges them in a Code node that builds a formatted report, and sends it to ChatWork.

**kintone Sync Workflow Canvas**
An 11-node workflow with two entry points (Schedule every 15 min + kintone Webhook). The scheduled path fetches both Sheets and kintone data in parallel, calculates differences, and executes the appropriate sync operations. The webhook path handles real-time updates from kintone back to Sheets.

---

### Who This Is For

- **Startups and SMBs operating in Japan** that use ChatWork, kintone, Stripe, or LINE
- **Digital agencies** serving Japanese clients who need repeatable automation templates
- **Solo developers and freelancers** building n8n automations for Japanese companies
- **n8n enthusiasts** who want production-quality Japan-market templates instead of building from scratch
- **Anyone tired of manually doing** what a workflow can do in seconds

### Who This Is NOT For

- People looking for Zapier or Make templates (these are n8n-specific JSON files)
- Businesses that don't use any Japan-market tools (ChatWork, kintone, LINE, PayPay)
- People who have never used n8n before (learn the basics first at n8n.io)

---

### Requirements

- **n8n instance** (self-hosted or n8n Cloud) running v1.0 or later
- **API keys** for the services each template connects to (listed in the setup guide)
- **15-30 minutes** per template for initial configuration
- Basic familiarity with n8n's interface (importing workflows, setting credentials)

---

### FAQ

**Q: Do I need all the APIs set up before I buy?**
A: No. The templates will import fine without any API keys. You configure credentials after import. The setup guide tells you exactly which keys you need for each template.

**Q: Will these work with n8n Cloud?**
A: Yes. These templates use standard n8n nodes and work identically on self-hosted and cloud instances.

**Q: Can I modify the templates?**
A: Absolutely. These are standard n8n workflow JSON files. Once imported, you own them and can modify anything -- swap ChatWork for Slack, change the schedule, add nodes, remove nodes.

**Q: I don't use ChatWork. Can I use Slack instead?**
A: Yes. Every ChatWork notification node can be replaced with a Slack node. The message formatting will need minor adjustments, but the core logic remains the same. The setup guide includes notes on this.

**Q: What if a template doesn't work?**
A: Check the troubleshooting section in the setup guide first. If you're still stuck, email hanabi.jpn.dev@gmail.com and we'll help you debug it. If we can't fix it, you get a full refund.

**Q: Do you offer updates?**
A: Yes. When n8n releases breaking changes or when we improve the templates, buyers will receive updated versions via Gumroad's product update feature at no additional cost.

**Q: Can I use these for client projects?**
A: Yes. The license permits use in your own projects and client projects. You may not resell the templates as-is or redistribute them as part of a competing template pack.

**Q: Are the templates in Japanese?**
A: The template names, node names, and documentation are in English. However, the workflows are built for the Japanese market -- they handle Japanese text, JST timezone, yen formatting, and Japanese field names (in kintone) correctly. ChatWork message templates include Japanese text where appropriate.

---

### Money-Back Guarantee

**30-Day No-Questions-Asked Refund**

If these templates don't save you time, email hanabi.jpn.dev@gmail.com within 30 days of purchase and we'll refund your full purchase price. No questions asked, no hoops to jump through.

We built these templates because we needed them ourselves. We're confident they'll work for you too.

---

### About hanabi-jpn

We build automation tools for businesses operating in Japan. Our templates are born from real production systems -- not theoretical exercises. Every workflow in this pack runs (or has run) on live systems processing real data.

- GitHub: [github.com/hanabi-jpn](https://github.com/hanabi-jpn)
- Support: hanabi.jpn.dev@gmail.com
- Updates: Follow [@hanabi_jpn](https://twitter.com/hanabi_jpn) on X/Twitter

---

### Pricing Summary

| Option | Price | Savings |
|--------|-------|---------|
| Full Bundle (all 5 templates) | **$49** | Save $46 (48% off) |
| ChatWork Notification Hub | $19 | -- |
| Stripe Japan Payment Flow | $19 | -- |
| Social Media Cross-Post Scheduler | $19 | -- |
| GA4 Weekly Report | $19 | -- |
| kintone Bi-Directional Sync | $19 | -- |

---

*Built in Japan. For Japan. By automation engineers who actually use ChatWork.*
