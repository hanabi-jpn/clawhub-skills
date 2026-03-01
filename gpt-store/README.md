# GPT Store Registration Guide -- hanabi-jpn Skills (20 GPTs)

Complete step-by-step guide to register all 20 hanabi-jpn skills as custom GPTs on the OpenAI GPT Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure](#directory-structure)
3. [Quick Start](#quick-start)
4. [Step-by-Step GPT Builder Instructions](#step-by-step-gpt-builder-instructions)
5. [Config File Format](#config-file-format)
6. [All 20 GPTs -- Reference Table](#all-20-gpts----reference-table)
7. [SEO Tips for GPT Store](#seo-tips-for-gpt-store)
8. [Monetization Setup](#monetization-setup)
9. [Registration Checklist](#registration-checklist)
10. [Regenerating Configs](#regenerating-configs)
11. [Troubleshooting](#troubleshooting)

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
└── configs/               # 20 JSON config files (generated)
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
    └── jp-seo-writer.json
```

---

## Quick Start

```bash
# 1. Generate all config files from SKILL.md sources
cd clawhub-skills/gpt-store
python3 generate-configs.py

# 2. Open the first config to review
cat configs/capability-evolver-pro.json | python3 -m json.tool | head -20

# 3. Go to GPT Builder and start creating
open "https://chat.openai.com/gpts/editor"
```

---

## Step-by-Step GPT Builder Instructions

Repeat these steps for each of the 20 GPTs:

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
  - Only needed for: Nano Banana Ultra
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

## All 20 GPTs -- Reference Table

### Priority 1: Core Skills (5 GPTs)

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 1 | Capability Evolver Pro | Programming | Code | 5-layer safe self-evolution with rollback |
| 2 | Self-Learning Agent | Productivity | Code | Cross-project learning with auto-capture |
| 3 | Summarize Pro | Productivity | Web, Code | 7 modes, 8 languages, Chain-of-Density |
| 4 | Humanize AI Pro | Writing | Code | 12 languages, 1200+ patterns, model detection |
| 5 | Nano Banana Ultra | DALL-E | DALL-E, Code | Multi-model image gen, 30+ templates |

### Priority 2: Developer Tools (5 GPTs)

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 6 | Skill Guardian | Programming | Web, Code | 5-layer security scanner, ClawHavoc DB |
| 7 | FX Trader Pro | Research | Web, Code | OANDA FX trading, 28 pairs, risk mgmt |
| 8 | Brain Trust | Programming | Code | Multi-agent orchestration, 10+ roles |
| 9 | Context Slim | Programming | Code | 40-70% context window compression |
| 10 | Agent Dashboard | Programming | Code | Real-time monitoring, health scoring |

### Priority 3: Japan Business Suite (10 GPTs)

| # | GPT Name | Category | Capabilities | Key Feature |
|---|----------|----------|-------------|-------------|
| 11 | LINE Agent | Lifestyle | Web, Code | LINE Official Account automation (96M+ users) |
| 12 | EC-CUBE Operator | Productivity | Web, Code | EC-CUBE 4.x e-commerce management |
| 13 | Freee Agent | Productivity | Web, Code | freee accounting automation + tax filing |
| 14 | Rakuten Seller | Productivity | Web, Code | Rakuten Ichiba shop management via RMS API |
| 15 | PayPay Biz | Productivity | Web, Code | PayPay payment management (65M+ users) |
| 16 | JP Tax Calc | Research | Web, Code | Japanese tax calculation + e-Tax |
| 17 | Notion JP | Productivity | Web, Code | Japanese Notion templates (20+) |
| 18 | JP Humanizer | Writing | Code | Japanese-only AI humanizer (500+ patterns) |
| 19 | Lark Workflow | Productivity | Web, Code | Lark/Feishu workflow automation |
| 20 | JP SEO Writer | Writing | Web, Code | Japanese SEO article generation + E-E-A-T |

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
  - Japanese: for JP skills, add Japanese keywords in description
- Avoid generic terms: "helpful assistant", "powerful tool"

### Conversation Starters as Keywords

- Each starter should contain a searchable phrase
- Example: "Summarize this PDF in executive brief format" hits: summarize, PDF, executive
- Include the skill's primary command as a starter

### Category Selection

Choose the category that maximizes discoverability:
- **Programming**: For developer-focused tools
- **Productivity**: For business/workflow tools
- **Writing**: For content creation tools
- **Research**: For data analysis and investigation tools
- **DALL-E**: For image generation tools
- **Lifestyle**: For consumer-facing tools

### Profile Image Best Practices

- Use consistent brand colors across all 20 GPTs
- Include a recognizable icon or symbol per skill
- Avoid text-heavy images (hard to read at small sizes)
- Test how the image looks at 40x40px (Store grid size)

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

- **Publish all 20 GPTs** to maximize total engagement surface
- **Optimize for retention**: Good system prompts = users come back
- **Cross-promote**: Reference other hanabi-jpn GPTs in conversation starters
- **Update regularly**: Refreshed GPTs rank higher in Store search
- **Japan Business Suite** has unique positioning -- few competitors in JP market

---

## Registration Checklist

Track your progress registering all 20 GPTs:

### Priority 1 (Register First)
- [ ] Capability Evolver Pro by hanabi-jpn
- [ ] Self-Learning Agent by hanabi-jpn
- [ ] Summarize Pro by hanabi-jpn
- [ ] Humanize AI Pro by hanabi-jpn
- [ ] Nano Banana Ultra by hanabi-jpn

### Priority 2 (Register Second)
- [ ] Skill Guardian by hanabi-jpn
- [ ] FX Trader Pro by hanabi-jpn
- [ ] Brain Trust by hanabi-jpn
- [ ] Context Slim by hanabi-jpn
- [ ] Agent Dashboard by hanabi-jpn

### Priority 3 (Register Third)
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

### Post-Registration
- [ ] Verify all 20 GPTs appear in "My GPTs"
- [ ] Test each GPT with its conversation starters
- [ ] Check GPT Store search visibility (may take 24-48h)
- [ ] Set up monetization/revenue sharing
- [ ] Create profile images for all 20 GPTs
- [ ] Cross-link related GPTs in their descriptions

---

## Regenerating Configs

If you update any SKILL.md files and need to regenerate:

```bash
cd clawhub-skills/gpt-store
python3 generate-configs.py
```

The script will:
1. Read all 20 SKILL.md files from the parent directory
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
