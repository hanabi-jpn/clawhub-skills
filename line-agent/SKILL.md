# LINE Agent

> LINE公式アカウント自動応答・CRM連携エージェント。メッセージ管理、リッチメニュー、セグメント配信、顧客管理をAIで自動化。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** line, messaging, crm, japan, automation, chatbot

---

## Overview

LINE Agent connects your OpenClaw agent to LINE's Messaging API, enabling automated customer support, CRM management, and marketing automation for Japan's #1 messaging platform (96M+ monthly active users).

## System Prompt Instructions

You are equipped with **LINE Agent** for LINE Official Account management.

### Setup Requirements

Environment variables:
- `LINE_CHANNEL_ACCESS_TOKEN` — LINE Messaging API channel access token
- `LINE_CHANNEL_SECRET` — Channel secret for webhook verification
- Optional: `LINE_LIFF_ID` — LIFF app ID for rich interactions

API Base: `https://api.line.me/v2/bot/`

### Core Capabilities

**1. Message Management:**
- Send text, image, video, audio, location, sticker messages
- Rich messages: Flex Messages (card-style), Template Messages (buttons, carousel, confirm)
- Reply to incoming messages with context-aware responses
- Broadcast to all followers or targeted segments
- Multicast to specific user groups
- Schedule messages for future delivery

**2. Rich Menu Control:**
- Create/update/delete rich menus (bottom menu bar)
- Swap menus based on user state (new user vs returning)
- Track menu tap analytics
- Template library: EC shop menu, support menu, restaurant menu

**3. Customer Segmentation:**
- Tag users based on interactions (購入者, 問い合わせ, VIP)
- Segment by: interaction frequency, purchase history, join date
- Create audience groups for targeted messaging
- Track segment sizes and engagement rates

**4. Auto-Response Rules:**
- Keyword matching: 「営業時間」→ 営業時間情報を返信
- AI response: Use LLM for natural conversation
- Handoff: Escalate complex queries to human staff
- FAQ database with fuzzy matching
- Multi-turn conversation support

**5. Analytics:**
- Message delivery/read rates
- Follower growth trend
- Response time metrics
- Popular keywords and topics
- Revenue attribution (if EC connected)

### Commands

**`line send <user-id|all> <message>`** — Send message
**`line send <user-id> --flex <template>`** — Send Flex Message
**`line broadcast <message>`** — Broadcast to all followers
**`line multicast <segment> <message>`** — Send to segment
**`line menu list`** — List rich menus
**`line menu create <template>`** — Create rich menu
**`line menu swap <user-id> <menu-id>`** — Assign menu to user
**`line users`** — List recent active users
**`line users tag <user-id> <tag>`** — Tag user
**`line segment create <name> <criteria>`** — Create segment
**`line segment list`** — List segments
**`line auto add <keyword> <response>`** — Add auto-response rule
**`line auto list`** — List auto-response rules
**`line stats [--period day|week|month]`** — Analytics dashboard
**`line webhook setup <url>`** — Configure webhook endpoint

### Japanese-Specific Features

- 敬語レベル自動調整（顧客ランクに応じて）
- 絵文字・スタンプの適切な使用
- 営業時間外の自動応答
- 日本の祝日カレンダー連携
- 「お問い合わせ」「注文確認」「配送通知」テンプレート

### Data Storage

```
.line-agent/
├── config.json          # Channel settings
├── users/
│   └── profiles.jsonl   # User profiles and tags
├── segments/
│   └── definitions.json # Segment rules
├── auto-responses/
│   └── rules.json       # Auto-response rules
├── templates/
│   └── flex/             # Flex Message templates
└── analytics/
    └── stats.jsonl       # Usage statistics
```
