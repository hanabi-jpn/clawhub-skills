# hanabi-jpn Poe Bots

Serve all 20 hanabi-jpn ClawHub skills as Poe bots through a single FastAPI server.

## Architecture

```
User on Poe  -->  Poe Platform  -->  Your Bot Server  -->  Underlying LLM
                                      (FastAPI + Poe SDK)   (GPT-4o / GPT-4o-Mini)
```

Each bot:
1. Receives the user's message from Poe
2. Prepends its extracted system prompt (from `SKILL.md`)
3. Forwards to the configured LLM via Poe's server bot protocol
4. Streams the response back to the user

## Directory Structure

```
poe-bots/
├── server.py              # Main FastAPI server (all 20 bots)
├── requirements.txt       # Python dependencies
├── bot_configs.py         # Bot configurations (names, models, suggested replies)
├── extract_prompts.py     # Extracts system prompts from SKILL.md files
├── deploy.sh              # Deployment script (Modal or local)
├── README.md              # This file
└── configs/               # Generated bot configs (JSON)
    ├── _all_bots.json     # Combined config for all 20 bots
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

## The 20 Bots

### P1 -- Premium (GPT-4o)

| Bot Name | Poe Slug | Description |
|----------|----------|-------------|
| Capability Evolver Pro | `CapabilityEvolverPro` | Safe self-evolution engine with rollback |
| Self-Learning Agent | `SelfLearningAgent` | Cross-project learning with failure capture |
| Summarize Pro | `SummarizePro` | 7 modes, 8 languages, Chain-of-Density |
| Humanize AI Pro | `HumanizeAIPro` | 12+ language AI text humanizer |
| Nano Banana Ultra | `NanoBananaUltra` | Multi-model image generation |

### P2 -- Standard (GPT-4o)

| Bot Name | Poe Slug | Description |
|----------|----------|-------------|
| Skill Guardian | `SkillGuardian` | 5-layer security scanner for AI skills |
| FX Trader Pro | `FXTraderPro` | Forex trading with OANDA, 28 pairs |
| Brain Trust | `BrainTrust` | Multi-agent orchestration (CEO/CTO/CFO) |
| Context Slim | `ContextSlim` | Context window optimizer, save 40-70% |
| Agent Dashboard | `AgentDashboard` | Real-time agent monitoring and analytics |

### P3 -- Lite (GPT-4o-Mini)

| Bot Name | Poe Slug | Description |
|----------|----------|-------------|
| LINE Agent | `LINEAgent` | LINE Official Account automation |
| EC-CUBE Operator | `ECCubeOperator` | EC-CUBE 4.x store management |
| Freee Agent | `FreeeAgent` | freee accounting automation |
| Rakuten Seller | `RakutenSeller` | Rakuten Ichiba shop automation |
| PayPay Biz | `PayPayBiz` | PayPay payment management |
| JP Tax Calc | `JPTaxCalc` | Japanese tax calculation |
| Notion JP | `NotionJP` | Notion with Japanese templates |
| JP Humanizer | `JPHumanizer` | Japanese text humanization |
| Lark Workflow | `LarkWorkflow` | Lark/Feishu automation |
| JP SEO Writer | `JPSEOWriter` | Japanese SEO article generator |

## Setup

### 1. Extract System Prompts

Run this first to generate the `configs/` directory from your SKILL.md files:

```bash
python3 extract_prompts.py
```

This reads all 20 `SKILL.md` files from the parent `clawhub-skills/` directory
and saves each system prompt as a JSON file in `configs/`.

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables

```bash
export POE_ACCESS_KEY="your_poe_access_key_here"
```

Get your access key from [Poe Creator Dashboard](https://poe.com/api_key).

### 4. Local Testing

```bash
python3 server.py
```

The server starts on port 8080. For local testing with Poe, you need a public
URL. Use ngrok or similar:

```bash
ngrok http 8080
```

Then use the ngrok URL when registering your bot on Poe.

### 5. Deploy to Modal

Modal provides serverless deployment with automatic HTTPS.

```bash
# Install Modal
pip install modal

# Authenticate
modal token new

# Create secret with your Poe access key
modal secret create poe-access-key POE_ACCESS_KEY=your_key_here

# Deploy
modal deploy server.py
```

Or use the deploy script:

```bash
chmod +x deploy.sh
./deploy.sh
```

After deployment, Modal gives you a URL like:
`https://your-username--hanabi-poe-bots-fastapi-app.modal.run`

### 6. Register Bots on Poe

For each of the 20 bots, go to [https://poe.com/create_bot](https://poe.com/create_bot):

1. **Bot Name**: Use the Poe Slug from the table above (e.g., `CapabilityEvolverPro`)
2. **Bot Type**: Select "Server bot"
3. **Server URL**: Your Modal URL (e.g., `https://your-username--hanabi-poe-bots-fastapi-app.modal.run`)
4. **Access Key**: The same `POE_ACCESS_KEY` you configured
5. **Description**: Copy from the bot table above
6. **Profile Picture**: Optional (use skill ASCII art or a logo)

Click "Create Bot" and test it.

### 7. Enable Monetization

Once your bots are live and tested:

1. Go to your [Poe Creator Dashboard](https://poe.com/settings)
2. Navigate to each bot's settings
3. Set pricing tier:
   - P1 bots: Set as premium (higher point cost per message)
   - P2 bots: Set as standard
   - P3 bots: Set as free or low-cost (to drive adoption)
4. Enable monetization and set up payment information

## Configuration Reference

### Changing the Underlying Model

Edit `bot_configs.py` to change the `model` field for any bot:

```python
"summarize-pro": {
    ...
    "model": "Claude-3.5-Sonnet",  # Changed from GPT-4o
    ...
},
```

Available Poe server bot models:
- `GPT-4o` (recommended for P1/P2)
- `GPT-4o-Mini` (recommended for P3, lower cost)
- `Claude-3.5-Sonnet`
- `Claude-3-Opus`
- `Gemini-1.5-Pro`
- `Llama-3.1-405B`

### Adding a New Bot

1. Add the skill directory to `SKILL_DIRS` in `extract_prompts.py`
2. Add metadata to `SKILL_META` in `extract_prompts.py`
3. Add bot definition to `BOT_DEFINITIONS` in `bot_configs.py`
4. Run `python3 extract_prompts.py` to generate the config
5. Restart the server

### Updating System Prompts

When you update a SKILL.md file:

```bash
python3 extract_prompts.py   # Re-extract prompts
# Then restart/redeploy the server
```

## Cost Estimation

| Tier | Model | Poe Points/Message | Monthly Revenue (100 msg/day) |
|------|-------|--------------------|-------------------------------|
| P1   | GPT-4o | ~250 points | ~$75/bot |
| P2   | GPT-4o | ~250 points | ~$75/bot |
| P3   | GPT-4o-Mini | ~20 points | ~$6/bot |

Note: Actual costs depend on system prompt length (which counts as input tokens)
and user message length. P3 bots use GPT-4o-Mini to keep costs low.

## Troubleshooting

### Bot returns errors

- Verify `POE_ACCESS_KEY` is set correctly
- Check Modal logs: `modal logs hanabi-poe-bots`
- Ensure `configs/` directory has all 20 JSON files

### System prompt not loading

- Run `python3 extract_prompts.py` to regenerate configs
- Check that SKILL.md files contain a `## System Prompt Instructions` section
- Verify JSON files in `configs/` are valid

### Modal deployment fails

- Run `modal token list` to verify authentication
- Run `modal secret list` to verify the secret exists
- Check Python version compatibility (3.9+)

## License

MIT -- by hanabi-jpn
