# ClawHub Skills by hanabi-jpn

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║    ██╗  ██╗ █████╗ ███╗   ██╗ █████╗ ██████╗ ██╗                    ║
║    ██║  ██║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██║                    ║
║    ███████║███████║██╔██╗ ██║███████║██████╔╝██║                    ║
║    ██╔══██║██╔══██║██║╚██╗██║██╔══██║██╔══██╗██║                    ║
║    ██║  ██║██║  ██║██║ ╚████║██║  ██║██████╔╝██║                    ║
║    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚═╝                    ║
║                                                                      ║
║              🔥 20 Premium Skills for OpenClaw / ClawHub 🔥          ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

![Skills](https://img.shields.io/badge/Skills-20-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000?style=for-the-badge)
![ClawHub](https://img.shields.io/badge/ClawHub-Published-purple?style=for-the-badge)

---

## Overview

**20 high-quality ClawHub skills** across 3 categories: improved versions of popular skills, innovative new products, and Japan-first business tools. Built by **hanabi-jpn** for the OpenClaw ecosystem.

---

## Skill Catalog

### Pattern 1: Enhanced Versions of Top Skills

| # | Skill | Description | Key Feature |
|---|-------|-------------|-------------|
| 1 | **[Capability Evolver Pro](capability-evolver-pro/)** | Safe sandboxed self-evolution engine | 5-layer safety + GEP v2 |
| 2 | **[Self-Learning Agent](self-learning-agent/)** | Cross-project learning & knowledge base | Global + project knowledge |
| 3 | **[Summarize Pro](summarize-pro/)** | 7-mode intelligent summarizer | Chain-of-Density, 8 languages |
| 4 | **[Humanize AI Pro](humanize-ai-pro/)** | Multi-language text humanizer | 12 languages, 500+ patterns |
| 5 | **[Nano Banana Ultra](nano-banana-ultra/)** | Multi-model image generation | Gemini + DALL-E + Stability |

### Pattern 2: New Market Innovations

| # | Skill | Description | Key Feature |
|---|-------|-------------|-------------|
| 6 | **[Skill Guardian](skill-guardian/)** | 5-layer security scanner | Post-ClawHavoc protection |
| 7 | **[FX Trader Pro](fx-trader-pro/)** | First FX trading skill on ClawHub | OANDA API, 28 pairs |
| 8 | **[Brain Trust](brain-trust/)** | Multi-agent hierarchical orchestration | 10+ roles, consensus protocol |
| 9 | **[Context Slim](context-slim/)** | Context window optimizer | 3 compression strategies |
| 10 | **[Agent Dashboard](agent-dashboard/)** | Real-time agent monitoring | Health scoring, cost tracking |

### Pattern 3: Japan-First Business Tools (日本向け)

| # | Skill | Description | Key Feature |
|---|-------|-------------|-------------|
| 11 | **[LINE Agent](line-agent/)** | LINE公式アカウント自動応答・CRM | 96M+ users, Flex Messages |
| 12 | **[EC-CUBE Operator](ec-cube-operator/)** | EC-CUBE 4.x 完全管理 | 商品・在庫・注文・RFM分析 |
| 13 | **[Freee Agent](freee-agent/)** | freee会計・人事労務 自動化 | 仕訳・P/L・B/S・確定申告 |
| 14 | **[Rakuten Seller](rakuten-seller/)** | 楽天市場ショップ運営AI | RMS API, レビュー・売上分析 |
| 15 | **[PayPay Biz](paypay-biz/)** | PayPay決済管理・売上分析 | 65M+ users, QR決済 |
| 16 | **[JP Tax Calc](jp-tax-calc/)** | 日本の税金計算・確定申告支援 | 所得税・消費税・e-Tax |
| 17 | **[Notion JP](notion-jp/)** | Notion日本語テンプレート | 20+ templates, 議事録自動生成 |
| 18 | **[JP Humanizer](jp-humanizer/)** | AI文章の日本語自然化 | 500+ patterns, 4 modes |
| 19 | **[Lark Workflow](lark-workflow/)** | Lark/Feishu自動化 | 承認フロー・Bot・文書管理 |
| 20 | **[JP SEO Writer](jp-seo-writer/)** | 日本語SEO記事自動生成 | 共起語分析・E-E-A-T対応 |

---

## Architecture

```
clawhub-skills/
├── README.md
├── publish-all.sh              # Batch publisher
│
├── capability-evolver-pro/     # P1: Safe self-evolution
├── self-learning-agent/        # P1: Cross-project learning
├── summarize-pro/              # P1: 7-mode summarizer
├── humanize-ai-pro/            # P1: Multi-lang humanizer
├── nano-banana-ultra/          # P1: Multi-model image gen
│
├── skill-guardian/             # P2: Security scanner
├── fx-trader-pro/              # P2: FX trading (OANDA)
├── brain-trust/                # P2: Multi-agent orchestration
├── context-slim/               # P2: Context optimizer
├── agent-dashboard/            # P2: Agent monitoring
│
├── line-agent/                 # P3: LINE automation
├── ec-cube-operator/           # P3: EC-CUBE management
├── freee-agent/                # P3: freee accounting
├── rakuten-seller/             # P3: Rakuten marketplace
├── paypay-biz/                 # P3: PayPay payment
├── jp-tax-calc/                # P3: Tax calculator
├── notion-jp/                  # P3: Notion JP templates
├── jp-humanizer/               # P3: Japanese humanizer
├── lark-workflow/              # P3: Lark/Feishu workflow
└── jp-seo-writer/              # P3: Japanese SEO writer
```

---

## Installation

Each skill can be installed individually via ClawHub:

```bash
# Install any skill
npx clawhub@latest install hanabi-jpn/<skill-name>

# Examples
npx clawhub@latest install hanabi-jpn/fx-trader-pro
npx clawhub@latest install hanabi-jpn/line-agent
npx clawhub@latest install hanabi-jpn/ec-cube-operator
```

---

## Why These Skills?

### Pattern 1 — Better Than the Originals
We analyzed the top 20 skills on ClawHub by downloads, identified their weaknesses (no safety systems, single-language, no caching), and built **dramatically improved** versions with enterprise-grade features.

### Pattern 2 — Filling Market Gaps
Post-ClawHavoc, users need security. FX traders need tools. Complex projects need multi-agent orchestration. We built what the market was missing.

### Pattern 3 — Japan First
**Zero Japanese business tools existed on ClawHub.** We created 10 skills covering Japan's biggest platforms: LINE, Rakuten, EC-CUBE, freee, PayPay, and more. Each skill is deeply localized — not just translated, but built for Japanese business culture, tax law, and payment systems.

---

## License

MIT License - See individual skill directories for details.

---

<p align="center">
  <b>Built with 🔥 by hanabi-jpn</b><br>
  <i>Making AI agents work for Japan</i>
</p>
