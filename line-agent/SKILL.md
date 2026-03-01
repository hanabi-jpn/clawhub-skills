# LINE Agent

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║         ┌─────────┐    ╭──────────────╮          ║
    ║         │  LINE    │    │ こんにちは！  │          ║
    ║         │  ┌───┐   │    │ AIが自動応答  │          ║
    ║         │  │ ◉ │   │───▶│ いたします♪  │          ║
    ║         │  └───┘   │    ╰──────────────╯          ║
    ║         │ ▄▄▄▄▄▄▄ │                              ║
    ║         │ █ TALK █ │    📊 CRM  📨 配信           ║
    ║         │ ▀▀▀▀▀▀▀ │    🎯 分析  🤖 Bot           ║
    ║         └─────────┘                              ║
    ║                                                  ║
    ║      L I N E   A G E N T   v1.0                  ║
    ║      ─── 96M+ユーザーをAIで攻略 ───              ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-06C755?style=for-the-badge)
![LINE](https://img.shields.io/badge/LINE-Messaging_API-06C755?style=for-the-badge&logo=line&logoColor=white)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000?style=for-the-badge)
![Users](https://img.shields.io/badge/96M+-Monthly_Active-06C755?style=for-the-badge)

> LINE公式アカウント自動応答・CRM連携エージェント。メッセージ管理、リッチメニュー、セグメント配信、顧客管理をAIで自動化。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** line, messaging, crm, japan, automation, chatbot

---

## Overview

LINE Agent connects your OpenClaw agent to LINE's Messaging API, enabling automated customer support, CRM management, and marketing automation for Japan's #1 messaging platform (96M+ monthly active users). Full support for Flex Messages, Rich Menus, LIFF apps, and AI-powered conversational commerce.

```
┌──────────────────────────────────────────────────────────────────┐
│                    LINE AGENT ARCHITECTURE                       │
│                                                                  │
│  ┌──────────┐   Webhook    ┌──────────────┐   API    ┌────────┐ │
│  │  LINE     │────────────▶│  LINE Agent   │────────▶│  LINE   │ │
│  │  Users    │◀────────────│  (OpenClaw)   │◀────────│Messaging│ │
│  │  96M+     │   Messages  └──────┬───────┘  Reply   │  API    │ │
│  └──────────┘                     │                  └────────┘ │
│                          ┌────────┼────────┐                    │
│                          ▼        ▼        ▼                    │
│                    ┌────────┐┌────────┐┌────────┐               │
│                    │ AI     ││ CRM    ││ Rich   │               │
│                    │ Auto   ││ Segment││ Menu   │               │
│                    │Response││ Engine ││ Control│               │
│                    └───┬────┘└───┬────┘└───┬────┘               │
│                        │         │         │                    │
│                        ▼         ▼         ▼                    │
│                    ┌──────────────────────────────┐              │
│                    │     Conversation Flow        │              │
│                    │                              │              │
│                    │  User Message                │              │
│                    │    ├─ Keyword Match? ──▶ FAQ │              │
│                    │    ├─ Purchase Intent? ▶ EC  │              │
│                    │    ├─ Support Need? ──▶ AI   │              │
│                    │    └─ Complex? ──────▶ Human │              │
│                    └──────────────────────────────┘              │
│                                   │                              │
│                                   ▼                              │
│                    ┌──────────────────────────────┐              │
│                    │  Analytics & Reporting       │              │
│                    │  配信率, 開封率, CVR, 売上   │              │
│                    └──────────────────────────────┘              │
└──────────────────────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **LINE Agent** for LINE Official Account management. Follow these rules precisely when the user invokes LINE commands. Always consider the context of Japan's messaging culture — appropriate keigo (敬語), emoji usage, and response timing.

### Setup Requirements

Environment variables:
- `LINE_CHANNEL_ACCESS_TOKEN` — LINE Messaging API channel access token
- `LINE_CHANNEL_SECRET` — Channel secret for webhook verification
- Optional: `LINE_LIFF_ID` — LIFF app ID for rich interactions
- Optional: `LINE_NOTIFY_TOKEN` — LINE Notify token for admin alerts
- Optional: `LINE_BUSINESS_HOURS` — Business hours JSON (e.g., `{"start":"09:00","end":"18:00","tz":"Asia/Tokyo"}`)

API Base: `https://api.line.me/v2/bot/`

### LINE Messaging API Endpoint Reference

Authentication: Bearer token via `LINE_CHANNEL_ACCESS_TOKEN` in Authorization header.

**Messaging:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/message/reply` | Reply to webhook event (free, within 1 min) |
| POST | `/message/push` | Push message to specific user |
| POST | `/message/multicast` | Send to multiple users (max 500) |
| POST | `/message/broadcast` | Broadcast to all followers |
| POST | `/message/narrowcast` | Send to audience segment |
| GET | `/message/quota` | Check monthly message quota |
| GET | `/message/quota/consumption` | Current month usage |
| GET | `/message/delivery/reply` | Reply message delivery stats |
| GET | `/message/delivery/push` | Push message delivery stats |

**User Profile:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/{userId}` | Get user display name, picture, status |
| GET | `/group/{groupId}/member/{userId}` | Group member profile |
| GET | `/followers/ids` | List follower user IDs (paginated) |

**Rich Menu:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/richmenu` | Create rich menu |
| GET | `/richmenu/list` | List all rich menus |
| DELETE | `/richmenu/{richMenuId}` | Delete rich menu |
| POST | `/richmenu/{id}/content` | Upload rich menu image |
| POST | `/user/{userId}/richmenu/{id}` | Link menu to user |
| POST | `/richmenu/default/{id}` | Set default menu |

**Audience:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/audienceGroup/upload` | Create audience by user IDs |
| GET | `/audienceGroup/list` | List audience groups |
| DELETE | `/audienceGroup/{id}` | Delete audience |

**Insight:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insight/followers` | Follower count over time |
| GET | `/insight/message/delivery` | Message delivery statistics |
| GET | `/insight/demographic` | Follower demographics (age, gender, area) |

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

### Flex Message Template Examples

**Product Card (商品カード):**
```json
{
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://shop.example.com/img/matcha-set.jpg",
    "size": "full",
    "aspectRatio": "20:13"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {"type": "text", "text": "有機抹茶セット", "weight": "bold", "size": "xl"},
      {"type": "text", "text": "京都産有機抹茶 × 茶筅 × 茶碗のギフトセット", "size": "sm", "color": "#666666", "wrap": true},
      {
        "type": "box", "layout": "baseline",
        "contents": [
          {"type": "text", "text": "¥4,980", "size": "xl", "weight": "bold", "color": "#E52D27"},
          {"type": "text", "text": "¥6,200", "size": "sm", "decoration": "line-through", "color": "#999999"}
        ]
      }
    ]
  },
  "footer": {
    "type": "box", "layout": "vertical",
    "contents": [
      {"type": "button", "action": {"type": "uri", "label": "今すぐ購入", "uri": "https://shop.example.com/product/123"}, "style": "primary", "color": "#E52D27"},
      {"type": "button", "action": {"type": "uri", "label": "詳細を見る", "uri": "https://shop.example.com/product/123"}, "style": "secondary"}
    ]
  }
}
```

**Order Confirmation (注文確認):**
```json
{
  "type": "bubble",
  "header": {"type": "box", "layout": "vertical", "contents": [
    {"type": "text", "text": "ご注文ありがとうございます", "weight": "bold", "color": "#FFFFFF"}
  ], "backgroundColor": "#27AE60"},
  "body": {"type": "box", "layout": "vertical", "contents": [
    {"type": "text", "text": "注文番号: #EC-20260301-047"},
    {"type": "separator"},
    {"type": "box", "layout": "horizontal", "contents": [
      {"type": "text", "text": "有機抹茶セット x1"},
      {"type": "text", "text": "¥4,980", "align": "end"}
    ]},
    {"type": "box", "layout": "horizontal", "contents": [
      {"type": "text", "text": "送料"},
      {"type": "text", "text": "無料", "align": "end", "color": "#27AE60"}
    ]},
    {"type": "separator"},
    {"type": "box", "layout": "horizontal", "contents": [
      {"type": "text", "text": "合計", "weight": "bold"},
      {"type": "text", "text": "¥4,980", "weight": "bold", "align": "end"}
    ]}
  ]}
}
```

### AI Auto-Response Conversation Flow

```
┌──────────────────────────────────────────────────┐
│         AI AUTO-RESPONSE DECISION TREE           │
│                                                  │
│  User Message Received                           │
│        │                                         │
│        ▼                                         │
│  ┌─────────────┐  Yes  ┌───────────────────┐     │
│  │Keyword Match?│──────▶│Return FAQ Answer  │     │
│  └──────┬──────┘       │+ suggest related  │     │
│         │ No           └───────────────────┘     │
│         ▼                                        │
│  ┌─────────────┐  Yes  ┌───────────────────┐     │
│  │Business Hour?│──────▶│Process with AI    │     │
│  └──────┬──────┘       │敬語 level: auto   │     │
│         │ No           └───────────────────┘     │
│         ▼                                        │
│  ┌───────────────────┐                           │
│  │Send 営業時間外     │                           │
│  │auto-reply message │                           │
│  │+ next open time   │                           │
│  └───────────────────┘                           │
│                                                  │
│  AI Response Process:                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Context  │─▶│ Generate │─▶│ 敬語     │       │
│  │ Retrieve │  │ Response │  │ Adjust   │       │
│  └──────────┘  └──────────┘  └────┬─────┘       │
│                                    │             │
│                              ┌─────┴─────┐       │
│                              │Confidence │       │
│                              │  > 0.8?   │       │
│                              └─────┬─────┘       │
│                          Yes ┌─────┴─────┐ No    │
│                              ▼           ▼       │
│                         ┌────────┐ ┌──────────┐  │
│                         │Auto    │ │Escalate  │  │
│                         │Send    │ │to Human  │  │
│                         └────────┘ │+ notify  │  │
│                                    └──────────┘  │
└──────────────────────────────────────────────────┘
```

### Analytics Dashboard Format

**`line stats --period month`:**
```
╔═══════════════════════════════════════════════════════════╗
║        LINE公式アカウント分析 — 2026年2月                ║
╠═══════════════════════════════════════════════════════════╣
║ フォロワー:     12,847人 (+423 新規, -31 ブロック)        ║
║ 月間メッセージ: 8,234件 (配信4,120 / 受信4,114)          ║
║ 配信到達率:     98.7%                                    ║
║ 開封率:         67.3%  (業界平均: 55%)                   ║
║ クリック率:     12.8%  (業界平均: 8%)                    ║
╠═══════════════════════════════════════════════════════════╣
║ 自動応答:                                                 ║
║   AI応答:      2,847件 (成功率: 89.2%)                   ║
║   FAQ応答:     1,023件 (トップ: 「営業時間」「返品」)     ║
║   人間エスカレ:   244件 (平均応答: 4.2分)                ║
╠═══════════════════════════════════════════════════════════╣
║ セグメント別:                                             ║
║   VIP (234人)       — 開封率 89% │ CVR 8.2%              ║
║   リピーター (1,892人) — 開封率 72% │ CVR 4.1%            ║
║   新規 (3,421人)    — 開封率 58% │ CVR 1.9%              ║
║   休眠 (7,300人)    — 開封率 23% │ CVR 0.3%              ║
╠═══════════════════════════════════════════════════════════╣
║ 売上貢献 (EC連携):                                        ║
║   LINE経由売上:  ¥1,847,200 (全体の23.4%)                ║
║   LINE経由注文:  187件                                    ║
║   LINE経由客単価: ¥9,878 (+12% vs 全体平均)              ║
╚═══════════════════════════════════════════════════════════╝
```

### Commands

**`line send <user-id|all> <message>`** — Send message
**`line send <user-id> --flex <template>`** — Send Flex Message
**`line broadcast <message>`** — Broadcast to all followers
**`line multicast <segment> <message>`** — Send to segment
**`line narrowcast <audience-id> <message>`** — Send to audience group
**`line menu list`** — List rich menus
**`line menu create <template>`** — Create rich menu
**`line menu swap <user-id> <menu-id>`** — Assign menu to user
**`line users`** — List recent active users
**`line users tag <user-id> <tag>`** — Tag user
**`line user <user-id>`** — Full user profile with interaction history
**`line segment create <name> <criteria>`** — Create segment
**`line segment list`** — List segments
**`line auto add <keyword> <response>`** — Add auto-response rule
**`line auto list`** — List auto-response rules
**`line auto test <message>`** — Test auto-response without sending
**`line stats [--period day|week|month]`** — Analytics dashboard
**`line stats --demographic`** — Follower demographics (age, gender, region)
**`line webhook setup <url>`** — Configure webhook endpoint
**`line quota`** — Check message quota and current usage
**`line health`** — API connectivity and token validity check

### Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| 400 | Invalid request (bad user ID, invalid message) | Validate user ID format, check message structure |
| 401 | Invalid channel access token | Prompt user to regenerate token in LINE Developers console |
| 403 | Insufficient permissions | Check channel permissions (messaging, profile, etc.) |
| 429 | Rate limit (default: 100k/min) | Queue messages, retry with backoff |
| 500 | LINE platform error | Retry once, log for monitoring |
| WEBHOOK_VERIFY_FAIL | Signature mismatch | Check `LINE_CHANNEL_SECRET` is correct |

**Message quota awareness:** Free plan = 200 messages/month. Standard = 5,000. Pro = 30,000. The agent checks quota before broadcast/multicast and warns if approaching the limit.

### Japanese-Specific Features

- 敬語レベル自動調整（顧客ランクに応じて）
- 絵文字・スタンプの適切な使用
- 営業時間外の自動応答
- 日本の祝日カレンダー連携
- 「お問い合わせ」「注文確認」「配送通知」テンプレート
- 年末年始・お盆の特別応答メッセージ
- 「様」「さん」の適切な使い分け
- 季節の挨拶（年賀状、暑中見舞い）テンプレート

### Data Storage

```
.line-agent/
├── config.json             # Channel settings and business hours
├── users/
│   ├── profiles.jsonl      # User profiles and tags
│   └── conversations/      # Per-user conversation history
│       └── {userId}.jsonl  # Message log for context
├── segments/
│   ├── definitions.json    # Segment rules
│   └── audiences.json      # LINE audience group IDs
├── auto-responses/
│   ├── rules.json          # Keyword-based auto-response rules
│   ├── faq.json            # FAQ database with fuzzy match index
│   └── ai-config.json      # AI response settings (敬語 level, tone)
├── templates/
│   └── flex/
│       ├── product-card.json    # 商品カード
│       ├── order-confirm.json   # 注文確認
│       ├── shipping-notify.json # 配送通知
│       └── coupon.json          # クーポン配布
├── analytics/
│   ├── stats.jsonl         # Usage statistics
│   ├── demographics.json   # Follower demographics cache
│   └── revenue.jsonl       # EC attribution data
└── logs/
    ├── api-calls.jsonl     # API call log
    ├── escalations.jsonl   # Human escalation log
    └── errors.jsonl        # Error log
```

## FAQ

**Q: LINE Messaging APIの料金は？**
A: 月間無料メッセージ数はプランにより異なります。フリープラン=200通、ライトプラン(¥5,000/月)=5,000通、スタンダードプラン(¥15,000/月)=30,000通。超過分は1通あたり¥3-5。Reply Message（1分以内の返信）は無料枠にカウントされません。

**Q: Webhook URLはどう設定しますか？**
A: LINE Developers Console > Messaging API設定でWebhook URLを登録します。HTTPS必須です。自前サーバーがない場合、ngrokやCloudflare Tunnelで一時URLを作成できます。

**Q: Flex Messageのデザインツールは？**
A: LINE公式の「Flex Message Simulator」(https://developers.line.biz/flex-message-simulator/) でビジュアルに編集できます。本エージェントには主要テンプレート（商品カード、注文確認、配送通知、クーポン）が同梱されています。

**Q: AI自動応答の精度は？**
A: FAQ登録済みの質問には95%以上の精度で応答します。未登録のフリーテキストはLLMで応答し、confidence 80%未満の場合は自動的にスタッフへエスカレーションします。

**Q: EC-CUBEと連携できますか？**
A: はい。EC-CUBE Operatorと同時に有効化すると、注文完了時にLINEで自動通知、配送状況の自動更新、購入者への自動タグ付けが可能です。

**Q: ブロックされたユーザーへの送信は？**
A: LINE APIはブロックユーザーへの送信時にエラーを返しません（課金もされません）。ただしフォロワー数のInsight APIでブロック数を追跡できます。

**Q: 複数のLINE公式アカウントを管理できますか？**
A: はい。環境変数を切り替えるか、config.jsonに複数チャンネルを登録して切り替えられます。
