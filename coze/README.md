# ClawHub Skills — Coze Bot Store Registration Guide

## Overview

This directory contains the configuration for publishing all 40 ClawHub skills as bots on the [Coze Bot Store](https://www.coze.com/store/bot). Each bot entry in `bots.json` includes the system prompt, suggested questions, and icon generation prompt ready for Coze registration.

## Prerequisites

1. **Coze Account** — Register at [coze.com](https://www.coze.com) (supports Google/GitHub login)
2. **Bot Store Publisher Access** — Apply at Settings > Developer > Bot Store Publisher
3. **API Keys** (optional) — For bots that integrate with external services, you will need the relevant API credentials

## Step-by-Step Registration

### Step 1: Create a New Bot

1. Log in to [coze.com](https://www.coze.com)
2. Click **"Create Bot"** in the top navigation
3. Select **"Start from Scratch"**

### Step 2: Configure Bot Identity

For each bot in `bots.json`, fill in:

| Field | Source |
|-------|--------|
| Bot Name | `name` field |
| Description | `description` field |
| Bot Icon | Generate using the `icon_prompt` field with any AI image generator, or upload a custom icon |

### Step 3: Set Up the System Prompt

1. Navigate to the **"Persona & Prompt"** section
2. Paste the `prompt` field content into the **System Prompt** box
3. Review and adjust tone/capabilities as needed for the Coze environment

### Step 4: Add Suggested Questions

1. Scroll to **"Opening Dialog"** or **"Suggested Questions"**
2. Add each question from the `suggested_questions` array
3. These appear as quick-start buttons for users

### Step 5: Configure Plugins

1. Go to the **"Plugins"** tab
2. Enable the plugins listed in the `plugins` array:
   - `web_search` — Enables real-time web search capability
3. For bots requiring API integration, consider creating custom plugins:
   - Navigate to **"Plugin Store"** > **"Create Plugin"**
   - Define API endpoints matching the skill's environment variables

### Step 6: Select Model

1. In **"Model"** settings, select the model specified in the `model` field
2. Recommended: `gpt-4o` for best performance
3. Alternative: `gpt-4o-mini` for cost optimization on simpler bots

### Step 7: Test the Bot

1. Use the **"Preview"** panel on the right side
2. Test each suggested question
3. Test edge cases and error handling
4. Verify Japanese language support where applicable

### Step 8: Publish to Bot Store

1. Click **"Publish"** in the top right
2. Select **"Bot Store"** as the publishing target
3. Fill in the store listing:
   - **Category**: Choose the most relevant (Business, Productivity, Finance, etc.)
   - **Tags**: Use the tags from the original SKILL.md frontmatter
   - **Language**: Select Japanese + English for bilingual bots
   - **Privacy Policy**: Link to your privacy policy URL
4. Submit for review (typically 1-3 business days)

## Batch Registration Script

For efficiency, you can use the Coze API to automate bot creation:

```python
import json
import requests

COZE_API_BASE = "https://api.coze.com/v1"
COZE_API_TOKEN = "your_coze_api_token"

with open("bots.json", "r") as f:
    bots = json.load(f)

headers = {
    "Authorization": f"Bearer {COZE_API_TOKEN}",
    "Content-Type": "application/json"
}

for bot in bots:
    payload = {
        "name": bot["name"],
        "description": bot["description"],
        "prompt_info": {
            "prompt": bot["prompt"]
        },
        "onboarding_info": {
            "suggested_questions": bot["suggested_questions"]
        },
        "model_info": {
            "model_id": bot["model"]
        },
        "plugin_info": {
            "plugin_ids": bot["plugins"]
        }
    }

    response = requests.post(
        f"{COZE_API_BASE}/bot/create",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        bot_id = response.json().get("data", {}).get("bot_id")
        print(f"Created: {bot['name']} (ID: {bot_id})")
    else:
        print(f"Failed: {bot['name']} - {response.status_code}: {response.text}")
```

## Bot Categories Mapping

| Category | Bots |
|----------|------|
| Business & Productivity | Google Workspace, ChatWork, kintone, LINE WORKS, Jooto, Backlog, Notion JP, Lark Workflow |
| Marketing & Sales | Google Ads, GA4 & Search Console, Social Media Publisher, LINE Agent, Rakuten Seller, JP SEO Writer |
| Finance & Payments | Stripe Japan, FX Trader Pro, Freee, MoneyForward, Yayoi, PayPay Biz, JP Tax Calc |
| HR & Operations | SmartHR, KING OF TIME |
| E-Commerce | EC-CUBE Operator, BASE & STORES |
| Developer Tools | Mac Sentinel, Repo Guardian, Credential Vault, Agent Dashboard |
| AI Enhancement | Capability Evolver Pro, Self-Learning Agent, Context Slim, Brain Trust, Skill Guardian |
| Content & Writing | Summarize Pro, Humanize AI Pro, JP Humanizer, Nano Banana Ultra |
| Location & CRM | Google Maps Biz, Sansan |

## Pricing Strategy

Coze Bot Store supports both free and paid bots:

- **Free Tier**: All 40 bots free for basic usage (generates awareness)
- **Premium Features**: Consider gating advanced features:
  - Batch operations (bulk import/export)
  - Advanced analytics and reporting
  - Custom template libraries
  - Priority API quota allocation

## Localization Notes

- All 40 bots support Japanese output by default
- System prompts include Japanese terminology where relevant
- Suggested questions are in English but bots respond in both languages
- For Japanese-first bots (LINE Agent, ChatWork, etc.), consider creating separate Japanese-language bot listings

## Support

- Repository: https://github.com/hanabi-jpn/clawhub-skills
- Issues: https://github.com/hanabi-jpn/clawhub-skills/issues
- Author: hanabi-jpn
