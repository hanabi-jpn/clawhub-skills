# Seller Guide: Setting Up Your Gumroad Listing

*Instructions for hanabi-jpn to create and manage the Gumroad product listing.*

---

## Table of Contents

1. [Gumroad Account Setup](#1-gumroad-account-setup)
2. [Creating the Product Listing](#2-creating-the-product-listing)
3. [Pricing Strategy](#3-pricing-strategy)
4. [Uploading the ZIP](#4-uploading-the-zip)
5. [Product Page Optimization](#5-product-page-optimization)
6. [Marketing Plan](#6-marketing-plan)
7. [Alternative: Selling on Etsy](#7-alternative-selling-on-etsy)
8. [Alternative: Lemon Squeezy](#8-alternative-lemon-squeezy)
9. [Post-Launch Checklist](#9-post-launch-checklist)

---

## 1. Gumroad Account Setup

### Why Gumroad?

- **No monthly fee** -- you only pay when you make a sale
- **Fee structure**: 10% flat fee on every sale (includes payment processing)
- **Instant payouts** to your bank or PayPal (available in Japan)
- **Built-in** email delivery, license keys, product updates, and analytics
- **Audience**: Developers, designers, and digital creators -- your exact target market

### Account Creation Steps

1. Go to [https://gumroad.com](https://gumroad.com)
2. Click "Start selling" or "Sign up"
3. Create an account with email: hanabi.jpn.dev@gmail.com
4. Set your profile:
   - **Name**: hanabi-jpn
   - **Bio**: "Automation templates for Japan-market businesses. n8n workflows, ChatWork integrations, kintone sync tools."
   - **Profile picture**: Use the hanabi-jpn logo or a professional avatar
   - **Profile URL**: `gumroad.com/hanabijpn` (or similar)
5. Go to Settings > Payments:
   - Connect your PayPal account or bank account for payouts
   - Payouts happen every Friday for the previous week's sales
6. Go to Settings > Profile:
   - Set your timezone to JST
   - Enable "Show profile page" so people can browse your products

### Tax Information (Important for Japan)

- Gumroad handles US sales tax automatically
- For Japan tax reporting: Gumroad income is classified as miscellaneous income (雑所得) or business income (事業所得) depending on scale
- Download your Gumroad analytics CSV at year-end for tax filing
- Gumroad does not withhold Japanese taxes -- you are responsible for reporting

---

## 2. Creating the Product Listing

### Step-by-Step in Gumroad Dashboard

1. Log in to [app.gumroad.com](https://app.gumroad.com)
2. Click **"New product"** in the left sidebar
3. Choose **"Digital product"**

4. **Product name**: `n8n Japan Business Automation Pack`

5. **Price**: $49
   - Check "Allow customers to pay what they want" -- set minimum to $49
   - This lets enthusiastic buyers tip more while keeping the base price firm

6. **Description**: Copy the body text from `product-listing.md` (everything from "Stop Building From Scratch" through the FAQ section)
   - Gumroad supports markdown in descriptions
   - Preview the formatting before publishing

7. **Cover image**: Create a cover image (1280x720 recommended):
   - Use Canva with a clean template
   - Show the n8n workflow canvas screenshots
   - Include text: "n8n Japan Business Automation Pack" / "5 Production-Ready Templates" / "$49"
   - Color scheme: Use n8n's brand orange (#FF6D5A) on dark background

8. **Product files**: Upload `hanabi-jpn-n8n-japan-business-pack-v1.zip`
   - Run `bash bundle.sh` first to generate the ZIP (see bundle.sh)

9. **Content** tab:
   - You can also add the setup guide as inline content (visible after purchase)
   - Paste the contents of `setup-guide.md` here as a "bonus" post-purchase page

10. **Checkout** tab:
    - Enable "Offer a discounted upsell" if you create individual template products later
    - Enable "Show on profile" so it appears on your hanabi-jpn profile page

11. Click **"Publish"**

### Creating Individual Template Products ($19 each)

For buyers who only want one template:

1. Create 5 separate products, one for each template
2. Name them:
   - "n8n ChatWork Notification Hub -- Japan Business Template"
   - "n8n Stripe Japan Payment Flow -- PayPay, Konbini & Card"
   - "n8n Social Media Scheduler -- X, Instagram, LINE Cross-Poster"
   - "n8n GA4 Weekly Report -- Automated Analytics to ChatWork"
   - "n8n kintone Sync -- Bi-Directional Google Sheets Integration"
3. Price each at $19
4. Each ZIP should contain only that template's JSON file plus the relevant section of the setup guide
5. In each individual product description, mention: "Save $46 by getting the full bundle for $49"

---

## 3. Pricing Strategy

### Current Pricing

| Product | Price | Gumroad Fee (10%) | Your Revenue |
|---------|-------|--------------------|-------------|
| Full Bundle | $49 | $4.90 | $44.10 |
| Individual Template | $19 | $1.90 | $17.10 |

### Pricing Rationale

- **$19 per template** is standard for premium n8n/Zapier/Make templates on the market
- **$49 for 5 templates** ($9.80 each) creates a strong incentive to buy the bundle
- Competitors charge $29-79 per individual automation template
- The Japan-specific angle (ChatWork, kintone, PayPay, konbini, LINE) has almost zero competition

### Discount Strategy

- **Launch discount**: Offer $29 for the first 50 buyers (40% off), then raise to $49
  - In Gumroad: Create a discount code `LAUNCH40` for 40% off, limited to 50 uses
- **Bundle vs. individual**: Always push the bundle. The $49 vs. 5x$19=$95 gap drives bundle purchases
- **Seasonal sales**: Run promotions during:
  - New Year / Year-end (12月-1月) -- common Japan business buying season
  - Golden Week (5月) -- people have time to set up automations
  - Black Friday (11月) -- global digital product sale event

### Future Pricing Evolution

| Phase | Timeframe | Action |
|-------|-----------|--------|
| Launch | Month 1-2 | $29 early bird, then $49 |
| Growth | Month 3-6 | Add 2-3 more templates, raise bundle to $69 |
| Mature | Month 6+ | Introduce Enterprise tier ($199) with support |

---

## 4. Uploading the ZIP

### Build the ZIP

```bash
cd /Users/ishiharatatsuya/clawhub-skills/n8n-templates/gumroad/
chmod +x bundle.sh
bash bundle.sh
```

This creates: `hanabi-jpn-n8n-japan-business-pack-v1.zip`

### Verify the ZIP contents

```bash
unzip -l hanabi-jpn-n8n-japan-business-pack-v1.zip
```

Expected output:
```
  hanabi-jpn-n8n-japan-business-pack-v1/README.txt
  hanabi-jpn-n8n-japan-business-pack-v1/setup-guide.md
  hanabi-jpn-n8n-japan-business-pack-v1/workflows/chatwork-notification.json
  hanabi-jpn-n8n-japan-business-pack-v1/workflows/ga4-weekly-report.json
  hanabi-jpn-n8n-japan-business-pack-v1/workflows/kintone-sync.json
  hanabi-jpn-n8n-japan-business-pack-v1/workflows/social-media-scheduler.json
  hanabi-jpn-n8n-japan-business-pack-v1/workflows/stripe-payment-flow.json
```

### Upload to Gumroad

1. In your product editor, go to the **"Content"** tab
2. Click **"Add file"**
3. Upload the ZIP file
4. Gumroad will host it and deliver it automatically on purchase

### Updating the Product

When you release an update:
1. Rebuild the ZIP: `bash bundle.sh`
2. In Gumroad, edit the product > replace the uploaded file
3. Click "Email all buyers" to notify them of the update
4. Increment the version in the ZIP name: `v1` -> `v2`

---

## 5. Product Page Optimization

### SEO-Friendly Product Name

Use: **"n8n Japan Business Automation Pack -- ChatWork, Stripe JPY, kintone, LINE, GA4 Templates"**

This includes keywords people actually search for:
- "n8n templates"
- "n8n ChatWork"
- "n8n kintone"
- "n8n Stripe Japan"
- "n8n LINE"

### Tags (Gumroad allows tags)

Add these tags to your product:
- n8n
- automation
- workflow
- ChatWork
- kintone
- Stripe
- Japan
- business
- templates
- no-code

### Thumbnail / Preview Images

Create 3-5 images for the product gallery:

1. **Cover**: Product name + price + template count on branded background
2. **Workflow canvas screenshots**: Show each of the 5 workflows in n8n's editor (take real screenshots after importing)
3. **Feature highlight**: A grid showing "ChatWork + kintone + Stripe + LINE + GA4" logos
4. **Before/After**: "Manual process: 2 hours/week" vs. "Automated: 0 minutes/week"
5. **Social proof**: Add testimonials once you have them

Tools: Use Canva (you already have it) or Figma for these images.

---

## 6. Marketing Plan

### Channel 1: X/Twitter (@hanabi_jpn)

**Launch thread (Pin this):**
```
I just released 5 n8n workflow templates for businesses in Japan.

ChatWork alerts, Stripe JPY payments (PayPay + konbini), kintone sync,
social media scheduler (X + Instagram + LINE), GA4 weekly reports.

All production-tested. Import and go.

$49 for all 5: [Gumroad link]

Thread with details:
```

Then reply with one tweet per template, showing a screenshot and 2-3 bullet points.

**Ongoing content:**
- Tweet automation tips 2-3 times per week
- Share n8n tricks and node configurations
- Post "before and after" comparisons (manual vs. automated)
- Engage with the #n8n and #automation hashtags
- Reply to people asking about ChatWork/kintone integrations with helpful advice + a soft pitch

**Hashtags to use:**
- #n8n #automation #nocode #lowcode
- #ChatWork #kintone #Stripe #LINE
- #日本 #ビジネス自動化 (for Japanese-language tweets)

### Channel 2: n8n Community

**n8n Community Forum ([community.n8n.io](https://community.n8n.io)):**
1. Create a "Show & Tell" post introducing your template pack
2. Include screenshots and a brief description of each template
3. Link to Gumroad (community rules generally allow this in Show & Tell)
4. Help others with ChatWork/kintone/Japan-specific questions -- build credibility first

**n8n Discord:**
- Share your templates in the #showcase channel
- Be helpful in #help channels -- answer Japan-market integration questions
- Don't spam -- build reputation by being genuinely useful

### Channel 3: Product Hunt

**Launch on Product Hunt:**
1. Create a maker account at [producthunt.com](https://www.producthunt.com)
2. Schedule a launch (aim for Tuesday-Thursday for best visibility)
3. Product name: "n8n Japan Business Automation Pack"
4. Tagline: "5 ready-to-deploy n8n templates for ChatWork, Stripe JPY, kintone, LINE, and GA4"
5. Ask 5-10 friends/contacts to upvote on launch day (but don't buy votes)
6. Be active in comments all day -- respond to every question

### Channel 4: Reddit

Post in these subreddits (follow each sub's self-promotion rules):
- r/n8n -- Direct target audience
- r/automation -- Broader automation community
- r/SaaS -- If positioned as a micro-SaaS product
- r/japanlife or r/JapanFinance -- If the person asking about Japan business tools

### Channel 5: Japanese Market

- **Note.com** (ノート): Write a Japanese article about automating Japan business processes with n8n. Link to Gumroad.
- **Qiita**: Write a technical article about n8n + ChatWork or n8n + kintone integration. Include a mention of the template pack.
- **Zenn**: Similar to Qiita -- write a technical article with value, soft-link the product.

### Channel 6: YouTube/Loom

Create a 5-10 minute video walkthrough:
1. Show the import process
2. Walk through one template (Stripe Payment Flow is most visually interesting)
3. Show the ChatWork notification arriving
4. Mention the bundle price and link in description

Upload to YouTube and embed on the Gumroad product page.

---

## 7. Alternative: Selling on Etsy

Etsy has emerged as a platform for digital products including templates and automation tools.

### Etsy Fee Structure

| Fee Type | Amount |
|----------|--------|
| Listing fee | $0.20 per listing (renewed every 4 months) |
| Transaction fee | 6.5% of sale price |
| Payment processing | 3% + $0.25 per transaction |
| Total effective fee | ~10-11% (comparable to Gumroad) |

### Etsy Pros

- Massive existing buyer base (90+ million active buyers)
- Built-in search/discovery (people search Etsy for templates)
- Trust factor -- buyers feel safer on a known marketplace
- Good for the "kintone templates" and "Japan business" niche keywords

### Etsy Cons

- Etsy's audience skews toward crafts/design -- automation templates are a newer category
- More competition for generic "automation template" searches
- Less control over product page design
- Listing management is more time-consuming

### Setting Up on Etsy

1. Go to [etsy.com/sell](https://www.etsy.com/sell) and create a seller account
2. Shop name: `HanabiJpnTemplates` or similar
3. Create a listing:
   - **Title**: "n8n Workflow Templates Bundle Japan Business Pack ChatWork Stripe kintone LINE GA4 Automation" (front-load keywords)
   - **Category**: Digital Downloads > Software > Templates
   - **Price**: $49
   - **Description**: Adapted from product-listing.md (Etsy has its own formatting)
   - **Tags** (13 max): n8n template, workflow automation, ChatWork integration, kintone sync, Stripe Japan, LINE bot, GA4 report, business automation, digital download, Japan business, no code, n8n workflow, automation pack
   - **Digital files**: Upload the same ZIP
4. Etsy requires at least one product image (listing photo)
5. Set "Instant download" as the delivery method

### Recommendation: List on Both

Gumroad and Etsy serve different audiences. List on both:
- **Gumroad**: Primary. Better for developer/technical audience. Higher margins after fees.
- **Etsy**: Secondary. Catches people searching for templates on Etsy. Extra discovery channel.

---

## 8. Alternative: Lemon Squeezy

Another option worth considering alongside Gumroad.

### Lemon Squeezy Fee Structure

| Plan | Monthly Fee | Transaction Fee |
|------|-------------|----------------|
| Free | $0 | 5% + 50 cents |
| Growth | $0 | 3.5% + 50 cents |

### Why Consider It

- Lower transaction fees than Gumroad (5% vs. 10% on free plan)
- Built-in affiliate system
- EU VAT handling included
- Modern, developer-friendly platform
- Software license key generation built in

### When to Use

If your sales volume exceeds ~$500/month, Lemon Squeezy's lower fees make it more cost-effective than Gumroad.

---

## 9. Post-Launch Checklist

### Week 1: Launch

- [ ] Build the ZIP with `bash bundle.sh`
- [ ] Create Gumroad account and product listing
- [ ] Upload ZIP and product images
- [ ] Set price to $29 (early bird) with plan to raise to $49 after 50 sales
- [ ] Create `LAUNCH40` discount code (40% off, 50 uses)
- [ ] Publish the product
- [ ] Post launch thread on X/Twitter
- [ ] Post in n8n community forum (Show & Tell)
- [ ] Share in n8n Discord #showcase

### Week 2: Expand

- [ ] Create Etsy listing
- [ ] Write a Qiita or Zenn article (Japanese, technical)
- [ ] Write a Note.com article (Japanese, broader audience)
- [ ] Post on Reddit r/n8n
- [ ] Record a 5-minute walkthrough video

### Week 3-4: Iterate

- [ ] Review first buyer feedback (check Gumroad messages)
- [ ] Fix any issues reported by buyers
- [ ] Collect testimonials from happy buyers
- [ ] Add testimonials to product page
- [ ] Consider Product Hunt launch timing

### Monthly: Maintain

- [ ] Check for n8n version compatibility issues
- [ ] Release updates if needed (new n8n node versions, bug fixes)
- [ ] Post new content on X/Twitter (automation tips)
- [ ] Respond to support emails within 24 hours
- [ ] Review analytics: conversion rate, traffic sources, revenue

### Revenue Targets

| Month | Target Sales | Revenue (at $49) | Cumulative |
|-------|-------------|-------------------|------------|
| 1 | 10 | $441 | $441 |
| 2 | 15 | $661 | $1,102 |
| 3 | 20 | $882 | $1,984 |
| 6 | 30/mo | $1,323/mo | ~$6,000 |
| 12 | 50/mo | $2,205/mo | ~$20,000 |

These are conservative estimates. The Japan-market niche reduces competition significantly.

---

*Last updated: 2026-03-01*
*For questions about this guide, it's your own notes -- just update this file.*
