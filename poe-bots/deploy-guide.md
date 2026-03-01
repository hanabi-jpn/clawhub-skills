# Poe Bot Deployment Guide -- 40 hanabi-jpn Skills

Complete step-by-step guide to deploy all 40 hanabi-jpn skills as Poe bots, including server deployment, bot registration, and monetization setup.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Option A: Deploy to Modal (Free Tier)](#option-a-deploy-to-modal-free-tier)
4. [Option B: Deploy to Railway/Render](#option-b-deploy-to-railwayrender)
5. [Option C: Self-Host on VPS](#option-c-self-host-on-vps)
6. [Poe Bot Registration Steps](#poe-bot-registration-steps)
7. [All 40 Bots Reference Table](#all-40-bots-reference-table)
8. [Monetization Setup](#monetization-setup)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
User on Poe  -->  Poe Platform  -->  Your Server (server.py)
                                         |
                                    bot_configs.py (40 bot definitions)
                                         |
                                    configs/*.json (40 system prompts)
                                         |
                                    Poe Server Bot API
                                         |
                                    GPT-4o / GPT-4o-Mini
```

**How it works:**
- `server.py` runs a single FastAPI server that hosts all 40 bots
- Each bot has its own system prompt extracted from the corresponding SKILL.md
- When a user messages a bot, the server prepends the system prompt and forwards to the configured LLM (GPT-4o for P1/P2, GPT-4o-Mini for P3)
- Poe handles user auth, rate limiting, and the chat UI

**Resource requirements:**
- CPU: Minimal (server just proxies requests)
- RAM: ~128MB (system prompts are loaded in memory)
- Storage: ~50MB (configs + dependencies)
- Network: Low latency to Poe API servers

---

## Prerequisites

Before deploying, ensure you have:

- [ ] **Poe creator account** at [poe.com/create_bot](https://poe.com/create_bot)
- [ ] **Poe API access key** -- get from [poe.com/api_key](https://poe.com/api_key)
- [ ] **Python 3.10+** installed locally
- [ ] All 40 config JSON files generated in `configs/` (run `python3 extract_prompts.py`)
- [ ] `requirements.txt` dependencies:

```
fastapi-poe>=0.0.47
uvicorn>=0.27.0
```

### Verify configs exist

```bash
cd /Users/ishiharatatsuya/clawhub-skills/poe-bots
python3 -c "from bot_configs import get_all_bots; b=get_all_bots(); print(f'{len(b)} bots loaded')"
# Expected output: 40 bots loaded
```

---

## Option A: Deploy to Modal (Free Tier)

**Best for:** Getting started quickly, zero-cost hosting, automatic scaling.

Modal provides a generous free tier (30 hours/month of compute) which is more than enough for a Poe bot server since it only runs when handling requests.

### Step 1: Install Modal CLI

```bash
pip install modal
modal token new
# This opens a browser to authenticate with your Modal account
```

### Step 2: Set the Poe access key as a Modal secret

```bash
modal secret create poe-access-key POE_ACCESS_KEY=your_actual_key_here
```

### Step 3: Deploy

```bash
cd /Users/ishiharatatsuya/clawhub-skills/poe-bots
modal deploy server.py
```

Modal will output a URL like:
```
https://hanabi-jpn--hanabi-poe-bots-fastapi-app.modal.run
```

### Step 4: Verify deployment

```bash
curl https://hanabi-jpn--hanabi-poe-bots-fastapi-app.modal.run/
# Should return a 200 response
```

### Step 5: Update each Poe bot's server URL

Use the Modal URL as the server URL when registering each bot on Poe (see [Registration Steps](#poe-bot-registration-steps) below).

### Modal tips

- **Cold starts:** First request after idle may take 2-3 seconds. Poe handles this gracefully.
- **Logs:** `modal app logs hanabi-poe-bots` to view server logs
- **Scaling:** Modal auto-scales; no configuration needed
- **Cost:** Free tier covers ~1,000+ daily conversations easily

---

## Option B: Deploy to Railway/Render

**Best for:** Always-on hosting, custom domains, simple Git-based deploys.

### Railway Deployment

#### Step 1: Create Railway project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project** > **Deploy from GitHub Repo** (or **Empty Project**)
3. If using GitHub, push the `poe-bots/` directory to a repo first

#### Step 2: Configure environment

In Railway dashboard, add environment variable:
```
POE_ACCESS_KEY=your_actual_key_here
PORT=8080
```

#### Step 3: Set the start command

In Settings > Deploy:
```
python server.py
```

Or use a `Procfile`:
```
web: python server.py
```

#### Step 4: Add requirements.txt

Ensure `/Users/ishiharatatsuya/clawhub-skills/poe-bots/requirements.txt` contains:
```
fastapi-poe>=0.0.47
uvicorn>=0.27.0
```

#### Step 5: Deploy and get URL

Railway provides a URL like:
```
https://hanabi-poe-bots-production.up.railway.app
```

#### Railway pricing

- **Free tier:** 500 hours/month + $5 credit (enough for a bot server)
- **Hobby:** $5/month for always-on hosting
- **Pro:** $20/month for production workloads

### Render Deployment

Similar process to Railway:

1. Go to [render.com](https://render.com) > **New Web Service**
2. Connect your GitHub repo or upload the code
3. Set **Start Command:** `python server.py`
4. Add env var `POE_ACCESS_KEY`
5. Deploy (free tier available with some cold-start latency)

---

## Option C: Self-Host on VPS

**Best for:** Full control, lowest latency, running alongside other services.

### Recommended VPS options

| Provider | Plan | Cost | Specs |
|----------|------|------|-------|
| Oracle Cloud | Always Free | $0/mo | 1 OCPU, 1GB RAM, 24/7 |
| Hetzner | CX22 | ~$4/mo | 2 vCPU, 4GB RAM |
| Xserver VPS | Entry | ~$3/mo | 1 vCPU, 2GB RAM |
| DigitalOcean | Basic Droplet | $6/mo | 1 vCPU, 1GB RAM |

### Step 1: Provision VPS and install Python

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y python3 python3-pip python3-venv

# Create project directory
mkdir -p ~/poe-bots
```

### Step 2: Upload files

```bash
# From your Mac
scp -r /Users/ishiharatatsuya/clawhub-skills/poe-bots/* user@your-vps:~/poe-bots/
```

### Step 3: Install dependencies

```bash
cd ~/poe-bots
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Set environment variables

```bash
export POE_ACCESS_KEY="your_actual_key_here"
```

Or create `~/poe-bots/.env`:
```
POE_ACCESS_KEY=your_actual_key_here
```

### Step 5: Run with systemd (production)

Create `/etc/systemd/system/poe-bots.service`:

```ini
[Unit]
Description=Hanabi Poe Bots Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/poe-bots
Environment="POE_ACCESS_KEY=your_actual_key_here"
ExecStart=/home/ubuntu/poe-bots/venv/bin/python server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable poe-bots
sudo systemctl start poe-bots
sudo systemctl status poe-bots
```

### Step 6: Set up reverse proxy with nginx (optional)

```nginx
server {
    listen 80;
    server_name poe-bots.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d poe-bots.yourdomain.com
```

### Step 7: Quick run for testing (nohup)

```bash
cd ~/poe-bots
source venv/bin/activate
nohup python3 server.py > /tmp/poe-bots.log 2>&1 &
echo $! > /tmp/poe-bots.pid
```

---

## Poe Bot Registration Steps

After deploying your server, register each of the 40 bots on Poe.

### Step 1: Go to Poe Bot Creator

1. Visit [poe.com/create_bot](https://poe.com/create_bot)
2. Sign in to your Poe account

### Step 2: Create a Server Bot

For **each** of the 40 bots:

1. Click **Create a bot** (or **Create server bot** if available)
2. Select **Server bot** (not a prompt bot)
3. Fill in the details:

| Field | Value |
|-------|-------|
| **Bot name** | Use the `bot_name` from bot_configs.py (e.g., `CapabilityEvolverPro`) |
| **Description** | Use the `description` field |
| **Server URL** | Your deployed server URL (from Modal/Railway/VPS) |
| **Access key** | Your `POE_ACCESS_KEY` |

4. Under **Server bot dependencies**, add the model:
   - P1/P2 bots: Add `GPT-4o` as a dependency
   - P3 bots: Add `GPT-4o-Mini` as a dependency

5. Add **Suggested replies** (3 per bot, from bot_configs.py)

6. Click **Create bot**

### Step 3: Test Each Bot

1. After creating, click the bot name to open its chat
2. Try each of the 3 suggested replies
3. Verify the system prompt is working (bot should respond in character)
4. Check server logs for any errors

### Step 4: Publish to Explore

1. Go to your bot's settings
2. Set visibility to **Public**
3. The bot will appear in Poe Explore after review

### Batch Registration Strategy

Register in priority order to maximize early engagement:

**Batch 1 (Day 1): P1 Premium bots -- 9 bots**
- CapabilityEvolverPro, SelfLearningAgent, SummarizePro, HumanizeAIPro, NanoBananaUltra
- GoogleAdsAgent, GoogleWorkspaceAgent, GA4SearchConsole, GoogleMapsBiz

**Batch 2 (Day 2): P2 Standard bots -- 9 bots**
- SkillGuardian, FXTraderPro, BrainTrust, ContextSlim, AgentDashboard
- StripeJapanAgent, SocialMediaPublisher, ChatworkAgent, KintoneAgent

**Batch 3 (Day 3): P3 Lite bots -- first 11**
- LINEAgent, ECCubeOperator, FreeeAgent, RakutenSeller, PayPayBiz
- JPTaxCalc, NotionJP, JPHumanizer, LarkWorkflow, JPSEOWriter
- SmartHRAgent

**Batch 4 (Day 4): P3 Lite bots -- remaining 11**
- BacklogAgent, SansanAgent, MoneyForwardAgent, KingOfTimeAgent
- LINEWorksAgent, JootoAgent, BaseStoresAgent, YayoiAgent
- MacSentinel, RepoGuardian, CredentialVault

**Estimated time:** ~5 minutes per bot = ~3.5 hours total

---

## All 40 Bots Reference Table

### P1 -- Premium (GPT-4o) -- 9 Bots

| # | Bot Name | Slug | Description |
|---|----------|------|-------------|
| 1 | Capability Evolver Pro | CapabilityEvolverPro | Self-evolution engine with 5-layer safety |
| 2 | Self-Learning Agent | SelfLearningAgent | Cross-project learning with auto-capture |
| 3 | Summarize Pro | SummarizePro | 7 modes, 8 languages, Chain-of-Density |
| 4 | Humanize AI Pro | HumanizeAIPro | 12+ languages, 1200+ AI detection patterns |
| 5 | Nano Banana Ultra | NanoBananaUltra | Multi-model image gen, 30+ templates |
| 6 | Google Ads Agent | GoogleAdsAgent | PPC campaign management and optimization |
| 7 | Google Workspace Agent | GoogleWorkspaceAgent | Gmail, Calendar, Drive, Sheets, Docs |
| 8 | GA4 & Search Console | GA4SearchConsole | Analytics and SEO in natural language |
| 9 | Google Maps Biz | GoogleMapsBiz | Location intelligence and Business Profile |

### P2 -- Standard (GPT-4o) -- 9 Bots

| # | Bot Name | Slug | Description |
|---|----------|------|-------------|
| 10 | Skill Guardian | SkillGuardian | 5-layer security scanner, ClawHavoc DB |
| 11 | FX Trader Pro | FXTraderPro | OANDA FX trading, 28 pairs, risk mgmt |
| 12 | Brain Trust | BrainTrust | Multi-agent orchestration, 10+ roles |
| 13 | Context Slim | ContextSlim | 40-70% context window compression |
| 14 | Agent Dashboard | AgentDashboard | Real-time monitoring, health scoring |
| 15 | Stripe Japan Agent | StripeJapanAgent | Stripe payments for Japan (PayPay, konbini) |
| 16 | Social Media Publisher | SocialMediaPublisher | Cross-platform posting (X, IG, TikTok, LINE) |
| 17 | Chatwork Agent | ChatworkAgent | Japan's #1 business chat automation |
| 18 | Kintone Agent | KintoneAgent | Cybozu kintone no-code platform automation |

### P3 -- Lite (GPT-4o-Mini) -- 22 Bots

| # | Bot Name | Slug | Description |
|---|----------|------|-------------|
| 19 | LINE Agent | LINEAgent | LINE Official Account automation (96M+ users) |
| 20 | EC-CUBE Operator | ECCubeOperator | EC-CUBE 4.x e-commerce management |
| 21 | Freee Agent | FreeeAgent | freee accounting automation + tax filing |
| 22 | Rakuten Seller | RakutenSeller | Rakuten Ichiba shop management via RMS API |
| 23 | PayPay Biz | PayPayBiz | PayPay payment management (65M+ users) |
| 24 | JP Tax Calc | JPTaxCalc | Japanese tax calculation + e-Tax |
| 25 | Notion JP | NotionJP | Japanese Notion templates (20+) |
| 26 | JP Humanizer | JPHumanizer | Japanese AI text humanizer (500+ patterns) |
| 27 | Lark Workflow | LarkWorkflow | Lark/Feishu workflow automation |
| 28 | JP SEO Writer | JPSEOWriter | Japanese SEO article generation + E-E-A-T |
| 29 | SmartHR Agent | SmartHRAgent | HR/labor management on SmartHR cloud |
| 30 | Backlog Agent | BacklogAgent | Nulab Backlog project management |
| 31 | Sansan Agent | SansanAgent | Business card & contact intelligence |
| 32 | MoneyForward Agent | MoneyForwardAgent | Cloud accounting via MoneyForward |
| 33 | King of Time Agent | KingOfTimeAgent | Attendance tracking & payroll sync |
| 34 | LINE WORKS Agent | LINEWorksAgent | Enterprise LINE communication |
| 35 | Jooto Agent | JootoAgent | Kanban project management on Jooto |
| 36 | BASE & STORES Agent | BaseStoresAgent | BASE/STORES EC shop management |
| 37 | Yayoi Agent | YayoiAgent | Yayoi accounting & Misoca invoicing |
| 38 | Mac Sentinel | MacSentinel | macOS security hardening for Claude Code |
| 39 | Repo Guardian | RepoGuardian | Pre-clone security scanner |
| 40 | Credential Vault | CredentialVault | Secure API key management & rotation |

---

## Monetization Setup

### Poe Creator Monetization Program

Poe offers direct monetization for bot creators:

#### 1. Per-Message Revenue

Poe pays creators based on message volume:
- Bots using GPT-4o earn more per message (higher compute cost = higher payout)
- P1/P2 bots (GPT-4o) will generate more revenue per interaction
- P3 bots (GPT-4o-Mini) have lower per-message revenue but higher volume potential

#### 2. Enable Monetization

1. Go to [poe.com/settings](https://poe.com/settings)
2. Navigate to **Creator Monetization** section
3. Connect your payment method (Stripe)
4. Accept the Creator Terms of Service
5. Monetization activates for all your published bots

#### 3. Pricing Strategy

Consider setting access controls:
- **Free bots:** P3 (Lite) bots to attract users and build audience
- **Subscriber-only:** P1 (Premium) bots restricted to Poe subscribers
- **Points-based:** P2 (Standard) bots cost Poe points per message

#### 4. Revenue Optimization

- **Daily active users (DAU)** is the key metric
- System prompts that encourage follow-up conversations increase revenue
- Suggested replies help guide users to keep chatting
- Cross-reference your other bots in responses:
  - "For Japanese text, try JP Humanizer by hanabi-jpn"
  - "Need accounting help? Check out Freee Agent by hanabi-jpn"

#### 5. Estimated Revenue

Based on Poe creator program benchmarks:
- 1,000 messages/day across 40 bots = ~$30-100/month
- 10,000 messages/day = ~$300-1,000/month
- Japan Business Suite has unique positioning with low competition

---

## Monitoring and Maintenance

### Server Logs

```bash
# Modal
modal app logs hanabi-poe-bots

# VPS (systemd)
journalctl -u poe-bots -f

# VPS (nohup)
tail -f /tmp/poe-bots.log
```

### Health Checks

```bash
# Verify all bots are loaded
curl -s your-server-url/ | python3 -m json.tool

# Check specific bot response
curl -X POST your-server-url/ \
  -H "Content-Type: application/json" \
  -d '{"type": "settings", "version": "1.0"}'
```

### Updating System Prompts

When you update a SKILL.md file:

```bash
cd /Users/ishiharatatsuya/clawhub-skills/poe-bots
python3 extract_prompts.py   # Re-extract all prompts
# Then redeploy:
modal deploy server.py       # Modal
# or restart the service on VPS
```

### Adding New Skills

1. Add the new skill directory under `clawhub-skills/`
2. Add entry to `SKILL_DIRS` and `SKILL_META` in `extract_prompts.py`
3. Add entry to `BOT_DEFINITIONS` in `bot_configs.py`
4. Run `python3 extract_prompts.py`
5. Redeploy the server
6. Register the new bot on Poe

---

## Troubleshooting

### "Bot not responding" on Poe

- Verify your server is running: `curl your-server-url/`
- Check that `POE_ACCESS_KEY` is set correctly
- Verify the bot name in Poe matches the `bot_name` in bot_configs.py exactly
- Check server logs for errors

### "Server bot dependency not found"

- Ensure you added the correct model dependency when creating the bot
- P1/P2 bots need `GPT-4o`, P3 bots need `GPT-4o-Mini`
- Some model names may change -- check Poe's current server bot list

### "System prompt too long" errors

- Some SKILL.md files produce very long prompts (FX Trader Pro: 22K chars)
- Poe may have token limits for system prompts
- Solution: Trim ASCII art, example outputs, and verbose tables from the prompt
- The extract script already handles this; if issues persist, edit the config JSON manually

### Modal deployment fails

```bash
# Check Modal status
modal app list

# Re-authenticate if needed
modal token new

# View deployment logs
modal app logs hanabi-poe-bots --follow
```

### Bot responds but ignores system prompt

- Verify the config JSON file exists in `configs/` with a non-empty `system_prompt`
- Run `python3 bot_configs.py` to check prompt lengths
- If prompt length shows 0, re-run `python3 extract_prompts.py`

---

## Quick Reference: Deployment Commands

```bash
# ── Generate configs ──
cd /Users/ishiharatatsuya/clawhub-skills/poe-bots
python3 extract_prompts.py

# ── Verify configs ──
python3 bot_configs.py

# ── Deploy to Modal ──
modal secret create poe-access-key POE_ACCESS_KEY=xxx
modal deploy server.py

# ── Run locally ──
export POE_ACCESS_KEY=xxx
python3 server.py

# ── Deploy to VPS ──
scp -r . user@vps:~/poe-bots/
ssh user@vps "cd ~/poe-bots && source venv/bin/activate && nohup python3 server.py &"
```
