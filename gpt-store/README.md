# GPT Store Registration Guide -- hanabi-jpn Skills (40 GPTs)

Complete step-by-step guide to register all 40 hanabi-jpn skills as custom GPTs on the OpenAI GPT Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure](#directory-structure)
3. [Quick Start](#quick-start)
4. [Step-by-Step GPT Builder Instructions](#step-by-step-gpt-builder-instructions)
5. [Config File Format](#config-file-format)
6. [All 40 GPTs -- Complete Reference Table](#all-40-gpts----complete-reference-table)
7. [Batch Registration Strategy](#batch-registration-strategy)
8. [SEO Tips for GPT Store](#seo-tips-for-gpt-store)
9. [Monetization Setup](#monetization-setup)
10. [Registration Checklist](#registration-checklist)
11. [Regenerating Configs](#regenerating-configs)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- [ ] **ChatGPT Plus or Team subscription** ($20/month minimum) -- required to create custom GPTs
- [ ] **OpenAI account** at [chat.openai.com](https://chat.openai.com)
- [ ] **GPT Builder access** (available to all Plus subscribers)
- [ ] **Builder Profile set up** -- required for GPT Store listing:
  - Go to [chat.openai.com/gpts/mine](https://chat.openai.com/gpts/mine)
  - Click your profile icon > Settings > Builder Profile
  - Set your name/domain to "hanabi-jpn" or your brand name
  - Verify your domain if possible (improves Store ranking)
- [ ] **Python 3.8+** installed (to run the config generator script)

---

## Directory Structure

```
gpt-store/
├── generate-configs.py    # Script: reads SKILL.md files -> JSON configs
├── README.md              # This guide
└── configs/               # 40 JSON config files (generated)
    ├── capability-evolver-pro.json
    ├── self-learning-agent.json
    ├── summarize-pro.json
    ├── humanize-ai-pro.json
    ├── nano-banana-ultra.json
    ├── skill-guardian.json
    ├── fx-trader-pro.json
    ├── brain-trust.json
    ├── context-slim.json
    ├── agent-dashboard.json
    ├── line-agent.json
    ├── ec-cube-operator.json
    ├── freee-agent.json
    ├── rakuten-seller.json
    ├── paypay-biz.json
    ├── jp-tax-calc.json
    ├── notion-jp.json
    ├── jp-humanizer.json
    ├── lark-workflow.json
    ├── jp-seo-writer.json
    ├── google-ads-agent.json          # NEW
    ├── google-workspace-agent.json    # NEW
    ├── ga4-search-console.json        # NEW
    ├── google-maps-biz.json           # NEW
    ├── stripe-japan-agent.json        # NEW
    ├── social-media-publisher.json    # NEW
    ├── chatwork-agent.json            # NEW
    ├── kintone-agent.json             # NEW
    ├── smarthr-agent.json             # NEW
    ├── backlog-agent.json             # NEW
    ├── sansan-agent.json              # NEW
    ├── moneyforward-agent.json        # NEW
    ├── kingof-time-agent.json         # NEW
    ├── line-works-agent.json          # NEW
    ├── jooto-agent.json               # NEW
    ├── base-stores-agent.json         # NEW
    ├── yayoi-agent.json               # NEW
    ├── mac-sentinel.json              # NEW
    ├── repo-guardian.json             # NEW
    └── credential-vault.json          # NEW
```

---

## Quick Start

```bash
# 1. Generate all 40 config files from SKILL.md sources
cd clawhub-skills/gpt-store
python3 generate-configs.py

# 2. Open the first config to review
cat configs/capability-evolver-pro.json | python3 -m json.tool | head -20

# 3. Go to GPT Builder and start creating
open "https://chat.openai.com/gpts/editor"
```

---

## Step-by-Step GPT Builder Instructions

Repeat these steps for each of the 40 GPTs:

### Step 1: Open GPT Builder

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click **Explore GPTs** in the left sidebar
3. Click **+ Create** in the top right corner
4. Switch to the **Configure** tab (not the Create tab)

### Step 2: Fill in Basic Information

Open the corresponding JSON config file (e.g., `configs/capability-evolver-pro.json`).

1. **Name**: Copy the `"name"` field
   - Example: `Capability Evolver Pro by hanabi-jpn`
   - Keep "by hanabi-jpn" for brand consistency

2. **Description**: Copy the `"description"` field
   - This appears in GPT Store search results
   - Keep it under 300 characters for optimal display

3. **Instructions**: Copy the entire `"instructions"` field
   - This is the full system prompt extracted from SKILL.md
   - Paste it into the "Instructions" text box
   - The instructions box supports markdown formatting

### Step 3: Set Conversation Starters

Copy each item from the `"conversation_starters"` array:

1. Click "Add" next to "Conversation starters"
2. Paste each starter one at a time (4 starters per GPT)
3. These appear as clickable buttons when users first open the GPT

### Step 4: Configure Capabilities

Based on the `"capabilities"` field in the config:

- **Web Browsing**: Toggle ON if `"web_browsing": true`
  - Needed for: API-based skills, URL fetching, real-time data
- **DALL-E Image Generation**: Toggle ON if `"dall_e": true`
  - Only needed for: Nano Banana Ultra, Social Media Publisher
- **Code Interpreter**: Toggle ON if `"code_interpreter": true`
  - Recommended for all skills (enables data analysis, file handling)

### Step 5: Add Profile Image (Optional but Recommended)

Generate a profile image for each GPT:
- Use DALL-E or your preferred image tool
- Recommended: 512x512 PNG
- Style: Clean, professional, matches the skill's theme
- Tip: Include the skill name or icon in the image

### Step 6: Save and Publish

1. Click **Save** in the top right
2. Choose visibility:
   - **Only me**: For testing first
   - **Anyone with a link**: For beta testing
   - **Everyone**: For GPT Store listing (requires Builder Profile)
3. Click **Confirm**

### Step 7: Submit to GPT Store

After saving with "Everyone" visibility:
1. The GPT will be automatically submitted for review
2. Review typically takes 1-3 business days
3. Once approved, it appears in GPT Store search
4. Check status at [chat.openai.com/gpts/mine](https://chat.openai.com/gpts/mine)

---

## Config File Format

Each JSON config file contains:

```json
{
  "name": "Skill Name by hanabi-jpn",
  "description": "2-3 sentence description for Store listing",
  "instructions": "Full system prompt (extracted from SKILL.md)",
  "conversation_starters": [
    "Starter 1 based on the skill's primary command",
    "Starter 2 based on another key feature",
    "Starter 3 showing a specific use case",
    "Starter 4 for getting started / help"
  ],
  "capabilities": {
    "web_browsing": true,
    "dall_e": false,
    "code_interpreter": true
  },
  "category": "Programming|Productivity|Writing|Research|Lifestyle|DALL-E",
  "_meta": {
    "skill_slug": "skill-name",
    "source": "clawhub-skills/skill-name/SKILL.md",
    "author": "hanabi-jpn",
    "generated_by": "generate-configs.py"
  }
}
```

The `_meta` field is for your reference only and is NOT used in GPT Builder.

---

## All 40 GPTs -- Complete Reference Table

### Wave 1: Core AI Tools (5 GPTs) -- Register First

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 1 | Capability Evolver Pro | Programming | Code | 5-layer safe self-evolution with rollback |
| 2 | Self-Learning Agent | Productivity | Code | Cross-project learning with auto-capture |
| 3 | Summarize Pro | Productivity | Web, Code | 7 modes, 8 languages, Chain-of-Density |
| 4 | Humanize AI Pro | Writing | Code | 12 languages, 1200+ patterns, model detection |
| 5 | Nano Banana Ultra | DALL-E | DALL-E, Code | Multi-model image gen, 30+ templates |

### Wave 2: Developer & Agent Tools (5 GPTs)

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 6 | Skill Guardian | Programming | Web, Code | 5-layer security scanner, ClawHavoc DB |
| 7 | FX Trader Pro | Research | Web, Code | OANDA FX trading, 28 pairs, risk mgmt |
| 8 | Brain Trust | Programming | Code | Multi-agent orchestration, 10+ roles |
| 9 | Context Slim | Programming | Code | 40-70% context window compression |
| 10 | Agent Dashboard | Programming | Code | Real-time monitoring, health scoring |

### Wave 3: Google Suite (4 GPTs) -- NEW

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 11 | Google Ads Agent | Productivity | Web, Code | PPC campaign management, bid optimization |
| 12 | Google Workspace Agent | Productivity | Web, Code | Gmail, Calendar, Drive, Sheets, Docs |
| 13 | GA4 & Search Console | Research | Web, Code | Natural language analytics, SEO insights |
| 14 | Google Maps Biz | Productivity | Web, Code | Location intelligence, Business Profile |

### Wave 4: Payment & Social (2 GPTs) -- NEW

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 15 | Stripe Japan Agent | Productivity | Web, Code | Stripe + PayPay/konbini for Japan |
| 16 | Social Media Publisher | Lifestyle | Web, DALL-E, Code | X, IG, TikTok, LINE cross-platform |

### Wave 5: Japan SaaS Tools (2 GPTs) -- NEW

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 17 | Chatwork Agent | Productivity | Web, Code | Japan's #1 biz chat, API v2 automation |
| 18 | Kintone Agent | Productivity | Web, Code | Cybozu no-code platform, 30K+ companies |

### Wave 6: Japan Business Suite -- Original (10 GPTs)

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 19 | LINE Agent | Lifestyle | Web, Code | LINE Official Account automation (96M+ users) |
| 20 | EC-CUBE Operator | Productivity | Web, Code | EC-CUBE 4.x e-commerce management |
| 21 | Freee Agent | Productivity | Web, Code | freee accounting automation + tax filing |
| 22 | Rakuten Seller | Productivity | Web, Code | Rakuten Ichiba shop management via RMS API |
| 23 | PayPay Biz | Productivity | Web, Code | PayPay payment management (65M+ users) |
| 24 | JP Tax Calc | Research | Web, Code | Japanese tax calculation + e-Tax |
| 25 | Notion JP | Productivity | Web, Code | Japanese Notion templates (20+) |
| 26 | JP Humanizer | Writing | Code | Japanese-only AI humanizer (500+ patterns) |
| 27 | Lark Workflow | Productivity | Web, Code | Lark/Feishu workflow automation |
| 28 | JP SEO Writer | Writing | Web, Code | Japanese SEO article generation + E-E-A-T |

### Wave 7: Japan HR & Business SaaS (9 GPTs) -- NEW

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 29 | SmartHR Agent | Productivity | Web, Code | HR cloud, onboarding, labor compliance |
| 30 | Backlog Agent | Productivity | Web, Code | Nulab PM tool, issues, sprints, Git |
| 31 | Sansan Agent | Productivity | Web, Code | Business card CRM, B2B networking |
| 32 | MoneyForward Agent | Productivity | Web, Code | Cloud accounting, invoices, reconciliation |
| 33 | King of Time Agent | Productivity | Web, Code | Attendance tracking, overtime, payroll |
| 34 | LINE WORKS Agent | Productivity | Web, Code | Enterprise LINE, 430K+ organizations |
| 35 | Jooto Agent | Productivity | Web, Code | Kanban PM by PR TIMES |
| 36 | BASE & STORES Agent | Productivity | Web, Code | Instant-commerce EC, 2M+ shops |
| 37 | Yayoi Agent | Productivity | Web, Code | Yayoi accounting + Misoca invoicing |

### Wave 8: Security Suite (3 GPTs) -- NEW

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 38 | Mac Sentinel | Programming | Web, Code | macOS security hardening, CVE scanning |
| 39 | Repo Guardian | Programming | Web, Code | Pre-clone repo security scanner |
| 40 | Credential Vault | Programming | Code | Encrypted API key management, rotation |

---

## Batch Registration Strategy

**Total estimated time: 5 minutes per GPT x 40 = ~3.5 hours**

### Recommended registration order (most impactful first)

#### Day 1: High-Impact Universal Tools (10 GPTs, ~50 min)

Register these first because they have the broadest appeal:

1. **Summarize Pro** -- Universal appeal, everyone needs summarization
2. **Humanize AI Pro** -- Huge demand for AI text humanization
3. **JP Humanizer** -- Unique Japanese niche, minimal competition
4. **JP SEO Writer** -- High-search-volume SEO niche
5. **Nano Banana Ultra** -- Image generation is always popular
6. **Google Ads Agent** -- Massive Google Ads user base
7. **GA4 & Search Console** -- Every website owner needs analytics
8. **Social Media Publisher** -- High demand for social media tools
9. **Google Workspace Agent** -- Gmail/Calendar automation appeals broadly
10. **Brain Trust** -- Unique multi-agent concept

#### Day 2: Japan Business Suite (15 GPTs, ~75 min)

Register these next for Japan market dominance:

11. **LINE Agent** -- Japan's largest platform (96M users)
12. **Freee Agent** -- Japan's top accounting SaaS
13. **EC-CUBE Operator** -- Japan's leading open-source EC
14. **Rakuten Seller** -- Japan's largest marketplace
15. **PayPay Biz** -- Japan's largest QR payment (65M users)
16. **Chatwork Agent** -- Japan's #1 business chat
17. **Kintone Agent** -- Cybozu's no-code platform
18. **MoneyForward Agent** -- Japan's leading fintech
19. **Stripe Japan Agent** -- Stripe + JP payment methods
20. **SmartHR Agent** -- Japan's top HR cloud
21. **King of Time Agent** -- Japan's leading attendance system
22. **Backlog Agent** -- Japan's top PM tool
23. **Sansan Agent** -- Japan's top B2B CRM
24. **LINE WORKS Agent** -- Enterprise LINE
25. **JP Tax Calc** -- Tax season always drives traffic

#### Day 3: Remaining Tools (15 GPTs, ~75 min)

26. **Capability Evolver Pro** -- Unique AI evolution concept
27. **Self-Learning Agent** -- Cross-project learning
28. **Skill Guardian** -- Security appeal
29. **FX Trader Pro** -- Forex trading niche
30. **Context Slim** -- Token optimization
31. **Agent Dashboard** -- Agent monitoring
32. **Google Maps Biz** -- Location intelligence
33. **Notion JP** -- Japanese Notion templates
34. **Lark Workflow** -- Lark/Feishu automation
35. **Jooto Agent** -- Kanban PM
36. **BASE & STORES Agent** -- Instant EC
37. **Yayoi Agent** -- Yayoi accounting
38. **Mac Sentinel** -- macOS security
39. **Repo Guardian** -- Repo security scanner
40. **Credential Vault** -- API key management

---

## SEO Tips for GPT Store

### Naming Strategy

- Always include "by hanabi-jpn" in the name for brand recognition
- Put the primary keyword first: "FX Trader Pro" not "Pro FX Trader"
- Keep names under 40 characters (excluding "by hanabi-jpn")

### Description Optimization

- Front-load key features in the first sentence
- Include numbers: "12 languages", "28 currency pairs", "30+ templates"
- Use high-search-volume keywords:
  - English: "AI agent", "automation", "trading", "summarize", "humanize"
  - Japanese market: "LINE", "EC-CUBE", "freee", "Rakuten", "PayPay"
  - For JP skills, add Japanese keywords in description
- Avoid generic terms: "helpful assistant", "powerful tool"

### Conversation Starters as Keywords

- Each starter should contain a searchable phrase
- Example: "Summarize this PDF in executive brief format" hits: summarize, PDF, executive
- Include the skill's primary command as a starter

### Category Selection

Choose the category that maximizes discoverability:
- **Programming**: Developer tools (7 GPTs: Evolver, Guardian, Brain Trust, Context, Dashboard, Mac Sentinel, Repo Guardian, Credential Vault)
- **Productivity**: Business/workflow tools (22 GPTs: most Japan SaaS tools)
- **Writing**: Content creation tools (4 GPTs: Humanize AI, JP Humanizer, JP SEO Writer, JP SEO)
- **Research**: Data analysis and investigation (3 GPTs: FX Trader, JP Tax Calc, GA4)
- **DALL-E**: Image generation (1 GPT: Nano Banana Ultra)
- **Lifestyle**: Consumer-facing (2 GPTs: LINE Agent, Social Media Publisher)

### Profile Image Best Practices

- Use consistent brand colors across all 40 GPTs
- Include a recognizable icon or symbol per skill
- Avoid text-heavy images (hard to read at small sizes)
- Test how the image looks at 40x40px (Store grid size)
- Consider using a consistent template with color-coded tiers:
  - Gold: P1 Premium tools
  - Blue: P2 Standard tools
  - Green: P3 Lite tools

---

## Monetization Setup

### GPT Store Revenue Sharing (Current Program)

As of 2026, OpenAI offers revenue sharing for GPT creators:

1. **Eligibility Requirements**:
   - Builder Profile verified with domain
   - GPT published with "Everyone" visibility
   - Must meet minimum usage thresholds (varies by quarter)

2. **Revenue Calculation**:
   - Based on user engagement (conversations started, messages sent)
   - Paid quarterly
   - Requires US tax information (W-9 or W-8BEN for international)

3. **Setup Steps**:
   - Go to Settings > Builder Profile
   - Click "Revenue" or "Payments" section
   - Add payment method (Stripe account)
   - Submit tax documentation
   - Revenue tracking appears in your GPT dashboard

### Maximizing Revenue

- **Publish all 40 GPTs** to maximize total engagement surface (2x the previous 20)
- **Optimize for retention**: Good system prompts = users come back
- **Cross-promote**: Reference other hanabi-jpn GPTs in conversation starters
- **Update regularly**: Refreshed GPTs rank higher in Store search
- **Japan Business Suite** has unique positioning -- very few competitors in JP market
- **Google Suite** (Ads, Workspace, GA4, Maps) targets massive global audience
- **Security Suite** (Mac Sentinel, Repo Guardian, Credential Vault) serves growing AI security market

### Revenue Potential by Segment

| Segment | GPT Count | Target Audience | Revenue Potential |
|---------|-----------|-----------------|-------------------|
| Core AI Tools | 5 | Global developers | High (broad appeal) |
| Developer Tools | 5 | AI/agent developers | Medium-High |
| Google Suite | 4 | All Google users | High (massive TAM) |
| Payment & Social | 2 | Businesses, creators | Medium |
| Japan SaaS | 2 | Japanese businesses | Medium (niche) |
| Japan Business (Original) | 10 | Japanese businesses | Medium (unique niche) |
| Japan HR/Business | 9 | Japanese HR/finance | Medium (unique niche) |
| Security Suite | 3 | Developers, security | Medium-High (growing) |

---

## Registration Checklist

Track your progress registering all 40 GPTs:

### Wave 1: Core AI Tools
- [ ] Capability Evolver Pro by hanabi-jpn
- [ ] Self-Learning Agent by hanabi-jpn
- [ ] Summarize Pro by hanabi-jpn
- [ ] Humanize AI Pro by hanabi-jpn
- [ ] Nano Banana Ultra by hanabi-jpn

### Wave 2: Developer & Agent Tools
- [ ] Skill Guardian by hanabi-jpn
- [ ] FX Trader Pro by hanabi-jpn
- [ ] Brain Trust by hanabi-jpn
- [ ] Context Slim by hanabi-jpn
- [ ] Agent Dashboard by hanabi-jpn

### Wave 3: Google Suite (NEW)
- [ ] Google Ads Agent by hanabi-jpn
- [ ] Google Workspace Agent by hanabi-jpn
- [ ] GA4 & Search Console by hanabi-jpn
- [ ] Google Maps Biz by hanabi-jpn

### Wave 4: Payment & Social (NEW)
- [ ] Stripe Japan Agent by hanabi-jpn
- [ ] Social Media Publisher by hanabi-jpn

### Wave 5: Japan SaaS (NEW)
- [ ] Chatwork Agent by hanabi-jpn
- [ ] Kintone Agent by hanabi-jpn

### Wave 6: Japan Business Suite (Original)
- [ ] LINE Agent by hanabi-jpn
- [ ] EC-CUBE Operator by hanabi-jpn
- [ ] Freee Agent by hanabi-jpn
- [ ] Rakuten Seller by hanabi-jpn
- [ ] PayPay Biz by hanabi-jpn
- [ ] JP Tax Calc by hanabi-jpn
- [ ] Notion JP by hanabi-jpn
- [ ] JP Humanizer by hanabi-jpn
- [ ] Lark Workflow by hanabi-jpn
- [ ] JP SEO Writer by hanabi-jpn

### Wave 7: Japan HR & Business SaaS (NEW)
- [ ] SmartHR Agent by hanabi-jpn
- [ ] Backlog Agent by hanabi-jpn
- [ ] Sansan Agent by hanabi-jpn
- [ ] MoneyForward Agent by hanabi-jpn
- [ ] King of Time Agent by hanabi-jpn
- [ ] LINE WORKS Agent by hanabi-jpn
- [ ] Jooto Agent by hanabi-jpn
- [ ] BASE & STORES Agent by hanabi-jpn
- [ ] Yayoi Agent by hanabi-jpn

### Wave 8: Security Suite (NEW)
- [ ] Mac Sentinel by hanabi-jpn
- [ ] Repo Guardian by hanabi-jpn
- [ ] Credential Vault by hanabi-jpn

### Post-Registration
- [ ] Verify all 40 GPTs appear in "My GPTs"
- [ ] Test each GPT with its conversation starters
- [ ] Check GPT Store search visibility (may take 24-48h)
- [ ] Set up monetization/revenue sharing
- [ ] Create profile images for all 40 GPTs
- [ ] Cross-link related GPTs in their descriptions

---

## Regenerating Configs

If you update any SKILL.md files and need to regenerate:

```bash
cd clawhub-skills/gpt-store
python3 generate-configs.py
```

The script will:
1. Read all 40 SKILL.md files from the parent directory
2. Extract system prompts (## System Prompt Instructions section)
3. Generate JSON configs with proper formatting
4. Save to `configs/` directory (overwrites existing files)
5. Print a summary table with token estimates

### Customizing the Generator

Edit `SKILL_CONFIGS` in `generate-configs.py` to:
- Change GPT Store descriptions
- Update conversation starters
- Modify capability toggles
- Change categories

The system prompt extraction is automatic from SKILL.md files.

---

## Troubleshooting

### "Instructions too long" Error

Some SKILL.md files produce very long system prompts. GPT Builder has a character limit for instructions (approximately 8,000 characters or ~32,000 tokens for the system prompt).

**Solutions**:
- Remove the example outputs (```...``` blocks) from instructions -- they are illustrative but not required
- Keep the rules, commands, and core behavior; remove verbose ASCII art displays
- Summarize the error handling table into a brief paragraph

### GPT Not Appearing in Store Search

- Ensure Builder Profile is complete and verified
- Wait 24-48 hours after publishing
- Check that visibility is set to "Everyone"
- Ensure the GPT name and description contain searchable keywords
- Short, generic descriptions rank poorly

### Capabilities Not Working

- **Web Browsing**: Only works if toggled ON in Configure tab
- **DALL-E**: Only available to Plus subscribers using the GPT
- **Code Interpreter**: Needs to be explicitly enabled per GPT

### Japanese Characters in Instructions

The config files use `ensure_ascii=False` in JSON encoding, so Japanese characters are preserved correctly. If you see encoding issues in GPT Builder:
- Copy-paste from the JSON file directly (not from terminal output)
- Ensure your text editor and terminal use UTF-8 encoding

### Updating a Published GPT

1. Go to [chat.openai.com/gpts/mine](https://chat.openai.com/gpts/mine)
2. Click the GPT you want to update
3. Click "Edit" (pencil icon)
4. Make changes in the Configure tab
5. Click "Update" > "Confirm"
6. Changes take effect immediately (no re-review needed for minor updates)
