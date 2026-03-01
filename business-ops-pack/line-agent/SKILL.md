---
name: "LINE Agent"
description: "LINE公式アカウント自動応答・CRM — 96M+ users, Flex Messages, AI auto-response"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - line
  - japan
  - messaging
  - crm
  - automation
---

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

![Version](https://img.shields.io/badge/version-1.0.0-06C755)
![LINE](https://img.shields.io/badge/LINE-Messaging_API-06C755?logo=line&logoColor=white)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![Users](https://img.shields.io/badge/96M+-Monthly_Active-06C755)

`claude-code` `line` `messaging-api` `chatbot` `japan`

> **LINE公式アカウント自動応答・CRM連携エージェント。メッセージ管理、リッチメニュー、セグメント配信、顧客管理をAIで自動化。**

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

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API channel access token | Yes | — |
| `LINE_CHANNEL_SECRET` | Channel secret for webhook verification | Yes | — |
| `LINE_LIFF_ID` | LIFF app ID for rich interactions | No | — |
| `LINE_NOTIFY_TOKEN` | LINE Notify token for admin alerts | No | — |
| `LINE_BUSINESS_HOURS` | Business hours JSON (e.g., `{"start":"09:00","end":"18:00","tz":"Asia/Tokyo"}`) | No | — |

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

### Behavioral Guidelines

1. **Language**: すべての応答・テンプレートは日本語。敬語レベルはビジネス丁寧語をデフォルト
2. **Safety**: メッセージ送信・セグメント操作は実行前に確認。`--force` で省略可能
3. **Rate Limiting**: LINE Messaging APIの制限を遵守。バルク送信時は自動スロットリング
4. **Privacy**: ユーザーの個人情報（LINE ID、表示名）はローカル暗号化保存
5. **Error Handling**: Webhook受信エラーは自動リトライ（最大3回、Exponential Backoff）
6. **Message Validation**: 送信前にメッセージ形式（文字数制限、画像サイズ）を自動検証
7. **Timezone**: 配信時間は日本時間(JST)をデフォルト。深夜配信(22:00-8:00)は警告
8. **Audit Trail**: 全送信メッセージをローカルログに記録。`line history` で参照可能
9. **Consent**: オプトアウトユーザーへの配信を自動ブロック
10. **Template Safety**: Flex Messageテンプレートは送信前にプレビュー表示
11. **Quota Awareness**: 月間メッセージ上限の80%到達時に自動アラート
12. **Webhook Security**: 署名検証（X-Line-Signature）を常に実行
13. **Fallback**: リッチメッセージ非対応端末には自動的にテキスト版を送信
14. **Batch Protection**: 100件以上の一括送信は段階的実行（10件ずつ）
15. **Data Retention**: ユーザーデータは90日で自動ローテーション。法令遵守

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
    "url": "https://cdn.line-scdn.net/img/matcha-set.jpg",
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
      {"type": "button", "action": {"type": "uri", "label": "今すぐ購入", "uri": "https://liff.line.me/product/123"}, "style": "primary", "color": "#E52D27"},
      {"type": "button", "action": {"type": "uri", "label": "詳細を見る", "uri": "https://liff.line.me/product/123"}, "style": "secondary"}
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

### `line send <user-id|all> <message>`

Send a text message to a specific user or all followers.

```
$ line send U1234abcd "本日限定クーポンをお届けします！"
✓ Message sent to U1234abcd
  Message ID: 1234567890
  Type: text
  Timestamp: 2026-03-01 14:00:00 JST
  Quota used: 1,847 / 5,000 (36.9%)
```

### `line send <user-id> --flex <template>`

Send a Flex Message using a predefined template.

```
$ line send U1234abcd --flex product-card --data '{"name":"有機抹茶セット","price":4980}'
✓ Flex Message sent to U1234abcd
  Template: product-card (商品カード)
  Message ID: 1234567891
  Timestamp: 2026-03-01 14:05:00 JST
  Preview: https://liff.line.me/preview/1234567891
```

### `line broadcast <message>`

Broadcast a message to all followers.

```
$ line broadcast "【お知らせ】3月のセール情報を更新しました！詳細はリッチメニューからご確認ください。"
⚠ Broadcast to 12,847 followers. Estimated quota usage: 12,847
  Current quota: 1,847 / 5,000 used
  ✗ WARNING: Quota will be exceeded by 9,694 messages
  Proceed anyway? (y/N): y
✓ Broadcast queued
  Message ID: 1234567892
  Recipients: 12,847
  Estimated delivery: ~2 minutes
  Quota remaining: 0 (exceeded — overage charges apply)
```

### `line menu list`

List all configured rich menus.

```
$ line menu list
╔══════════════════════════════════════════════════════════╗
║              LINE Rich Menu 一覧                        ║
╠══════════════════════════════════════════════════════════╣
║  ID              │ Name              │ Status   │ Users ║
╠══════════════════╪═══════════════════╪══════════╪═══════╣
║  richmenu-001    │ メインメニュー     │ DEFAULT  │ 11,234║
║  richmenu-002    │ VIPメニュー        │ ACTIVE   │   234 ║
║  richmenu-003    │ 新規ユーザー用     │ ACTIVE   │ 1,379 ║
║  richmenu-004    │ セール用(下書き)   │ DRAFT    │     0 ║
╚══════════════════════════════════════════════════════════╝
  Total: 4 menus (3 active, 1 draft)
```

### `line users`

List recent active users with tags and last interaction.

```
$ line users
╔══════════════════════════════════════════════════════════════════╗
║              最近のアクティブユーザー (上位20件)                 ║
╠══════════════════════════════════════════════════════════════════╣
║  User ID       │ 表示名       │ タグ          │ 最終応答       ║
╠════════════════╪══════════════╪═══════════════╪════════════════╣
║  U1234abcd     │ 田中太郎      │ VIP, 購入者    │ 2026-03-01 13:45║
║  U5678efgh     │ 鈴木花子      │ リピーター     │ 2026-03-01 12:30║
║  U9012ijkl     │ 佐藤一郎      │ 問い合わせ     │ 2026-03-01 11:20║
║  U3456mnop     │ 山田美咲      │ 新規          │ 2026-03-01 10:05║
║  ...           │ ...          │ ...           │ ...            ║
╚══════════════════════════════════════════════════════════════════╝
  Total active (30 days): 4,892 users
```

### `line user <user-id>`

Display full user profile with interaction history.

```
$ line user U1234abcd
╔══════════════════════════════════════════════════════════╗
║              ユーザープロフィール                        ║
╠══════════════════════════════════════════════════════════╣
║  User ID:      U1234abcd                                ║
║  表示名:        田中太郎                                 ║
║  プロフィール画像: https://profile.line-scdn.net/...     ║
║  ステータス:     フォロー中                               ║
║  フォロー日:     2025-08-15                               ║
║  タグ:          VIP, 購入者, メルマガ登録                  ║
║  セグメント:     VIP (234人)                              ║
║  リッチメニュー:  VIPメニュー (richmenu-002)               ║
╠══════════════════════════════════════════════════════════╣
║  直近のやり取り (5件):                                   ║
║  03-01 13:45 ← 「注文した商品の配送状況を教えて」        ║
║  03-01 13:45 → 「ご注文 #EC-047 は本日発送済みです」     ║
║  02-28 10:20 ← 「ポイント残高を確認したい」              ║
║  02-28 10:20 → 「現在のポイント残高は 2,480pt です」     ║
║  02-25 09:00 → [Flex] セール告知カード                   ║
╠══════════════════════════════════════════════════════════╣
║  EC連携:                                                 ║
║  購入回数: 8回 │ 累計金額: ¥78,400 │ 平均客単価: ¥9,800  ║
║  最終購入: 2026-02-20 (有機抹茶セット ¥4,980)            ║
╚══════════════════════════════════════════════════════════╝
```

### `line auto list`

List all configured auto-response rules.

```
$ line auto list
╔══════════════════════════════════════════════════════════════════╗
║              自動応答ルール一覧                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  # │ キーワード       │ 応答タイプ │ 応答内容(要約)     │ 発動数║
╠═══╪══════════════════╪══════════╪═══════════════════╪════════╣
║  1 │ 営業時間          │ FAQ      │ 平日9:00-18:00... │  312  ║
║  2 │ 返品              │ FAQ      │ 返品ポリシー...    │  187  ║
║  3 │ 送料              │ FAQ      │ ¥5,000以上で無料.. │  156  ║
║  4 │ ポイント          │ FAQ      │ ポイント照会案内.. │   98  ║
║  5 │ 注文確認          │ EC連携   │ 注文ステータス照会 │  245  ║
║  6 │ **(AI fallback)** │ AI応答   │ LLM自由応答       │ 2,847 ║
╚══════════════════════════════════════════════════════════════════╝
  Total rules: 6 (5 keyword + 1 AI fallback)
  AI応答成功率: 89.2%
```

### `line auto test <message>`

Test auto-response matching without actually sending a reply.

```
$ line auto test "営業時間を教えてください"
╔══════════════════════════════════════════════════════════╗
║              自動応答テスト (ドライラン)                  ║
╠══════════════════════════════════════════════════════════╣
║  入力: 「営業時間を教えてください」                       ║
║  マッチ: ルール #1 (キーワード: 営業時間)                ║
║  Confidence: 0.97                                       ║
║                                                         ║
║  応答プレビュー:                                         ║
║  ┌────────────────────────────────────────────┐          ║
║  │ 営業時間のご案内です。                       │          ║
║  │                                            │          ║
║  │ 平日: 9:00〜18:00                           │          ║
║  │ 土曜: 10:00〜15:00                          │          ║
║  │ 日祝: 定休日                                │          ║
║  │                                            │          ║
║  │ お急ぎの場合はメールでお問い合わせください。  │          ║
║  └────────────────────────────────────────────┘          ║
║                                                         ║
║  ✓ テスト完了 (送信されていません)                        ║
╚══════════════════════════════════════════════════════════╝
```

### `line quota`

Check message quota and current usage.

```
$ line quota
╔══════════════════════════════════════════════════════════╗
║              LINE メッセージ配信枠                       ║
╠══════════════════════════════════════════════════════════╣
║  プラン:         スタンダード (¥15,000/月)               ║
║  月間配信枠:      30,000通                               ║
║  使用済み:        8,234通 (27.4%)                        ║
║  残り:           21,766通                                ║
║  ████████░░░░░░░░░░░░░░░░░░░░  27.4%                   ║
║                                                         ║
║  今月の内訳:                                             ║
║    Broadcast:    4,120通                                 ║
║    Multicast:    2,890通                                 ║
║    Push:         1,224通                                 ║
║    Reply (無料):  4,114通 (枠にカウントされません)        ║
║                                                         ║
║  超過時料金:  ¥3/通 (追加メッセージ)                     ║
║  リセット日:  2026-04-01                                 ║
╚══════════════════════════════════════════════════════════╝
```

### `line health`

Check API connectivity and token validity.

```
$ line health
╔══════════════════════════════════════════════════════════╗
║              LINE API ヘルスチェック                     ║
╠══════════════════════════════════════════════════════════╣
║  Channel Access Token:  ✓ VALID (期限: 2026-04-15)      ║
║  Channel Secret:        ✓ CONFIGURED                    ║
║  Webhook URL:           ✓ ACTIVE (https://example.com/webhook)║
║  Webhook 検証:          ✓ 署名検証OK                     ║
║  LIFF ID:               ✓ CONFIGURED (1234567890-abcdefg)║
║  LINE Notify:           ✓ CONNECTED                     ║
║                                                         ║
║  API接続テスト:                                          ║
║    /v2/bot/info          → 200 OK (48ms)                ║
║    /v2/bot/message/quota → 200 OK (52ms)                ║
║    /v2/bot/followers/ids → 200 OK (61ms)                ║
║                                                         ║
║  ステータス: ✓ 全システム正常                             ║
╚══════════════════════════════════════════════════════════╝
```

**`line multicast <segment> <message>`** — Send to segment
**`line narrowcast <audience-id> <message>`** — Send to audience group
**`line menu create <template>`** — Create rich menu
**`line menu swap <user-id> <menu-id>`** — Assign menu to user
**`line users tag <user-id> <tag>`** — Tag user
**`line segment create <name> <criteria>`** — Create segment
**`line segment list`** — List segments
**`line auto add <keyword> <response>`** — Add auto-response rule
**`line stats [--period day|week|month]`** — Analytics dashboard
**`line stats --demographic`** — Follower demographics (age, gender, region)
**`line webhook setup <url>`** — Configure webhook endpoint

### Comparison: LINE Agent vs Other LINE Marketing Tools

| Feature                          | LINE Agent (本スキル)           | Liny                            | エルメ (L Message)              | 自社開発Bot                     |
|----------------------------------|--------------------------------|--------------------------------|--------------------------------|--------------------------------|
| 初期費用                          | 無料 (OSS)                     | ¥49,800                        | 無料 (フリープラン)             | 開発コスト依存                  |
| 月額費用                          | LINE API料金のみ               | ¥5,280〜¥76,780/月            | ¥0〜¥33,000/月                 | サーバー費用のみ                |
| AI自動応答                        | LLM搭載 (敬語自動調整)         | テンプレート応答のみ            | シナリオ応答                    | 自前実装が必要                  |
| セグメント配信                    | タグ+AI行動分析                | リッチなセグメント              | 詳細セグメント                  | 自前実装が必要                  |
| Flex Message                     | テンプレート同梱 + カスタム    | ビジュアルエディタ              | テンプレート選択式              | JSON手書き                      |
| Rich Menu動的切替                 | ユーザー状態に応じて自動       | 条件分岐で切替                  | シナリオで切替                  | API実装が必要                   |
| EC連携 (EC-CUBE等)                | リアルタイム注文通知・自動タグ | Shopify連携あり                 | 一部EC連携あり                  | 個別開発                        |
| CRM/顧客管理                     | タグ + 行動履歴 + 会話ログ     | 高機能CRM内蔵                   | 友だち管理あり                  | DB設計が必要                    |
| 分析ダッシュボード                | CLI + 詳細レポート出力         | Web管理画面                     | Web管理画面                     | 自前BI連携                      |
| API/CLI操作                       | 全機能CLIコマンド対応          | Web UIのみ                      | Web UIのみ                      | 自由度最大                      |
| 開封率・CVRトラッキング           | Insight API連携で自動集計      | 標準搭載                        | 標準搭載                        | 自前実装が必要                  |
| 学習コスト                        | CLI操作の知識が必要            | GUI操作で低い                   | GUI操作で低い                   | 開発スキル必須                  |

**When to use LINE Agent:**
- コスト最小で高機能なLINE運用をしたい → **LINE Agent**
- AI自動応答で人件費を削減したい → **LINE Agent**
- GUIで直感的に操作したい → Liny or エルメ
- 大規模マーケ組織で多人数運用 → Liny
- 既存システムと完全統合したい → LINE Agent or 自社開発Bot

### Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| 400 | Invalid request (bad user ID, invalid message) | Validate user ID format, check message structure |
| 401 | Invalid channel access token | Prompt user to regenerate token in LINE Developers console |
| 403 | Insufficient permissions | Check channel permissions (messaging, profile, etc.) |
| 404 | Resource not found (user unfollowed or invalid rich menu ID) | Verify resource exists, remove stale references from local cache |
| 408 | Request timeout (large multicast or slow network) | Split multicast into smaller batches (max 500), retry with shorter timeout |
| 429 | Rate limit (default: 100k/min) | Queue messages, retry with backoff |
| 500 | LINE platform error | Retry once, log for monitoring |
| WEBHOOK_VERIFY_FAIL | Signature mismatch | Check `LINE_CHANNEL_SECRET` is correct |
| QUOTA_EXCEEDED | Monthly message quota exhausted | Alert user, suggest plan upgrade, switch to reply-only mode (free) |

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

**Q: LINE Notifyとの違いは何ですか？**
A: LINE NotifyはシンプルなPush通知専用ですが、LINE Agentはメッセージング APIを使用した双方向通信、リッチメニュー管理、ユーザーセグメント分析まで対応します。LINE Notifyの機能も `line notify send` コマンドで内包しています。

**Q: LIFF（LINE Front-end Framework）に対応していますか？**
A: はい、`LIFF_ID` 環境変数を設定することでLIFFアプリとの連携が可能です。`line liff deploy` でLIFFアプリのデプロイ、`line liff url` でLIFF URLの生成ができます。

**Q: 友だち数の上限やメッセージ配信の制限は？**
A: LINE公式アカウントのプランに依存します。フリープラン(200通/月)、ライトプラン(5,000通)、スタンダードプラン(30,000通〜)。`line quota check` で残り配信数と使用率を確認でき、上限接近時にアラートを出します。
