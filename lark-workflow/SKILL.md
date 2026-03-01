# Lark Workflow

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║            LARK WORKFLOW v1.0                    ║
    ║                                                  ║
    ║         ┌─────────────────────┐                  ║
    ║         │   🐦 Lark / Feishu  │                  ║
    ║         │   ┌───┐  ┌───┐     │                  ║
    ║         │   │申請│─▶│承認│     │                  ║
    ║         │   └───┘  └─┬─┘     │                  ║
    ║         │            ▼       │                  ║
    ║         │   ┌───┐  ┌───┐     │                  ║
    ║         │   │通知│◀─│実行│     │                  ║
    ║         │   └───┘  └───┘     │                  ║
    ║         │                     │                  ║
    ║         │  📨 Bot   📅 予定   │                  ║
    ║         │  📄 文書  ✅ 承認   │                  ║
    ║         └─────────────────────┘                  ║
    ║                                                  ║
    ║   ─── ワークフローを完全自動化 ───               ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-3370FF?style=for-the-badge)
![Lark](https://img.shields.io/badge/Lark-Open_API-3370FF?style=for-the-badge)
![Feishu](https://img.shields.io/badge/飛書-Feishu対応-3370FF?style=for-the-badge)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_対応-ff0000?style=for-the-badge)
![Workflow](https://img.shields.io/badge/⚡-承認フロー自動化-orange?style=for-the-badge)

> Lark/Feishu自動化エージェント。承認フロー、Bot通知、ドキュメント管理、カレンダー連携をAIで自動化。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** lark, feishu, workflow, automation, bot, japan

---

## Overview

Lark Workflow automates your Lark (Feishu) workspace: messaging, approval workflows, document management, calendar, and bot notifications. Perfect for teams using Lark as their primary workspace.

## System Prompt Instructions

You are equipped with **Lark Workflow** for Lark/Feishu automation.

### Setup

- `LARK_APP_ID` — Lark app ID
- `LARK_APP_SECRET` — Lark app secret
- `LARK_WEBHOOK_URL` — (optional) Bot webhook URL for quick notifications
- `LARK_TENANT_KEY` — (optional) Tenant key for multi-tenant apps

API Base: `https://open.larksuite.com/open-apis/` (Global) or `https://open.feishu.cn/open-apis/` (China)

### Core Capabilities

**1. メッセージング:**
- テキスト/リッチテキスト/カードメッセージ送信
- グループチャットへの投稿
- メンション（@ユーザー）
- スレッド返信
- 画像・ファイル送信
- Interactive Card（ボタン付きカード）

**2. Webhook Bot通知:**
- シンプルなWebhook送信（API keyなしで使える）
- テキスト/リッチテキスト/カードフォーマット
- カスタムBot作成
- スケジュール通知

**3. 承認フロー (Approval):**
- 承認申請の作成
- 承認ステータス確認
- 承認/却下
- 承認履歴の取得
- カスタム承認フォーム
- テンプレート: 経費申請、休暇申請、稟議書

**4. ドキュメント管理:**
- Doc/Sheet/Mindnote作成・編集
- ドキュメント検索
- フォルダ管理
- 権限設定
- ドキュメントテンプレート
- エクスポート（PDF/DOCX）

**5. カレンダー:**
- イベント作成・更新・削除
- 参加者管理
- 空き時間検索
- 会議室予約
- リマインダー設定
- 定期イベント管理

**6. スプレッドシート:**
- セルの読み書き
- シート操作（追加、削除、コピー）
- データフィルタ・ソート
- グラフ作成
- 自動集計

### Commands

**`lark send <chat-id|user-id> <message>`** — メッセージ送信
**`lark send --card <template> <data>`** — カードメッセージ
**`lark webhook <message>`** — Webhook Bot通知
**`lark webhook --card <title> <content>`** — カード形式通知
**`lark chats`** — チャット一覧
**`lark approval create <template> <data>`** — 承認申請作成
**`lark approval list [--status pending|approved|rejected]`** — 承認一覧
**`lark approval <id>`** — 承認詳細
**`lark docs [--search <query>]`** — ドキュメント検索
**`lark doc create <title> [--template <template>]`** — ドキュメント作成
**`lark doc <id>`** — ドキュメント内容
**`lark calendar events [--from <date>] [--to <date>]`** — イベント一覧
**`lark calendar create <title> <start> <end>`** — イベント作成
**`lark sheet <id> read <range>`** — シート読み取り
**`lark sheet <id> write <range> <data>`** — シート書き込み

### Lark Specific

- Lark Suite (グローバル版) と Feishu (中国版) の両対応
- Tenant Token / User Token の使い分け
- Interactive Card Builder
- Event Subscription (Webhook受信)
- 多言語対応（日本語/英語/中国語）
- Lark Approval の定義済みテンプレート活用

---

## Lark/Feishu API Documentation

### Authentication Flow

The agent manages two token types automatically, choosing the correct one for each operation.

```
┌──────────────────────────────────────────────────────────────┐
│              Lark Authentication Flow                          │
│                                                              │
│  ┌─────────────────┐                                         │
│  │ LARK_APP_ID +   │                                         │
│  │ LARK_APP_SECRET │                                         │
│  └────────┬────────┘                                         │
│           │                                                   │
│           v                                                   │
│  ┌─────────────────────────────────────┐                      │
│  │ POST /auth/v3/tenant_access_token/  │                      │
│  │ internal                            │                      │
│  │                                     │                      │
│  │ Body: { app_id, app_secret }        │                      │
│  └────────┬────────────────────────────┘                      │
│           │                                                   │
│           v                                                   │
│  ┌─────────────────────┐   ┌─────────────────────────┐       │
│  │ Tenant Access Token │   │ User Access Token       │       │
│  │ (App-level actions) │   │ (User-level actions)    │       │
│  │                     │   │ Requires OAuth2 flow    │       │
│  │ For: send message,  │   │ For: personal calendar, │       │
│  │ read docs, approval │   │ user-specific data      │       │
│  └─────────────────────┘   └─────────────────────────┘       │
│                                                              │
│  Token TTL: 2 hours → Agent auto-refreshes before expiry     │
└──────────────────────────────────────────────────────────────┘
```

### Key API Endpoints

| Category     | Endpoint                                        | Method | Description                    |
|-------------|------------------------------------------------|--------|--------------------------------|
| Auth        | `/auth/v3/tenant_access_token/internal`        | POST   | Get tenant token               |
| Message     | `/im/v1/messages`                              | POST   | Send message                   |
| Message     | `/im/v1/messages/{id}/reply`                   | POST   | Reply to message               |
| Chat        | `/im/v1/chats`                                 | GET    | List chats                     |
| Chat        | `/im/v1/chats/{id}`                            | GET    | Get chat details               |
| Approval    | `/approval/v4/instances`                       | POST   | Create approval instance       |
| Approval    | `/approval/v4/instances/{id}`                  | GET    | Get approval status            |
| Approval    | `/approval/v4/instances/{id}/approve`          | POST   | Approve request                |
| Approval    | `/approval/v4/instances/{id}/reject`           | POST   | Reject request                 |
| Doc         | `/docx/v1/documents`                           | POST   | Create document                |
| Doc         | `/docx/v1/documents/{id}`                      | GET    | Read document                  |
| Drive       | `/drive/v1/files`                              | GET    | List files                     |
| Calendar    | `/calendar/v4/calendars/{id}/events`           | POST   | Create event                   |
| Calendar    | `/calendar/v4/calendars/{id}/events`           | GET    | List events                    |
| Sheet       | `/sheets/v3/spreadsheets/{id}/values/{range}`  | GET    | Read cells                     |
| Sheet       | `/sheets/v3/spreadsheets/{id}/values/{range}`  | PUT    | Write cells                    |
| Webhook     | Custom Bot URL                                  | POST   | Send webhook notification      |

---

## Approval Workflow Diagram

The following diagram shows the complete approval lifecycle managed by the agent:

```
┌─────────────────────────────────────────────────────────────┐
│              Approval Workflow (承認フロー)                    │
│                                                             │
│  ┌──────────────┐                                           │
│  │ 申請者が      │  lark approval create expense \           │
│  │ 申請作成      │    --amount 50000 --reason "出張費"       │
│  └──────┬───────┘                                           │
│         │                                                    │
│         v                                                    │
│  ┌──────────────┐                                           │
│  │ 自動通知      │  承認者へカードメッセージ送信              │
│  │ (Bot Card)   │  [承認] [却下] ボタン付き                  │
│  └──────┬───────┘                                           │
│         │                                                    │
│         v                                                    │
│  ┌──────────────────────────────────────┐                    │
│  │  承認者のアクション                    │                    │
│  │                                      │                    │
│  │  ┌──────────┐    ┌──────────┐        │                    │
│  │  │ 承認      │    │ 却下      │        │                    │
│  │  │ Approve  │    │ Reject   │        │                    │
│  │  └────┬─────┘    └────┬─────┘        │                    │
│  │       │               │              │                    │
│  └───────┼───────────────┼──────────────┘                    │
│          │               │                                   │
│          v               v                                   │
│  ┌──────────────┐ ┌──────────────┐                          │
│  │ 次の承認者へ  │ │ 申請者へ      │                          │
│  │ 自動回付      │ │ 却下通知      │                          │
│  │ (多段承認)   │ │ + 理由       │                          │
│  └──────┬───────┘ └──────────────┘                          │
│         │                                                    │
│         v                                                    │
│  ┌──────────────┐                                           │
│  │ 最終承認      │  全承認者がApproveした場合                 │
│  │ 完了通知      │  → 申請者・関係者へ完了通知               │
│  │ + 記録保存   │  → 承認履歴をDB保存                       │
│  └──────────────┘                                           │
│                                                             │
│  承認テンプレート:                                            │
│    経費申請 (expense)     — 金額、用途、日付、領収書          │
│    休暇申請 (leave)       — 種別、期間、引継ぎ先             │
│    稟議書   (ringi)       — 件名、金額、効果、リスク         │
│    購買申請 (purchase)    — 品目、数量、金額、業者            │
└─────────────────────────────────────────────────────────────┘
```

---

## Interactive Card Builder Examples

Interactive Cards are the most powerful messaging format in Lark. The agent builds these cards programmatically.

### Approval Notification Card

```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "経費申請: 出張費 ¥50,000" },
      "template": "orange"
    },
    "elements": [
      {
        "tag": "div",
        "fields": [
          { "is_short": true, "text": { "tag": "lark_md", "content": "**申請者:** 田中太郎" } },
          { "is_short": true, "text": { "tag": "lark_md", "content": "**日付:** 2026-03-01" } },
          { "is_short": true, "text": { "tag": "lark_md", "content": "**金額:** ¥50,000" } },
          { "is_short": true, "text": { "tag": "lark_md", "content": "**用途:** 東京-大阪 出張" } }
        ]
      },
      { "tag": "hr" },
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": { "tag": "plain_text", "content": "承認" },
            "type": "primary",
            "value": { "action": "approve", "instance_id": "abc123" }
          },
          {
            "tag": "button",
            "text": { "tag": "plain_text", "content": "却下" },
            "type": "danger",
            "value": { "action": "reject", "instance_id": "abc123" }
          },
          {
            "tag": "button",
            "text": { "tag": "plain_text", "content": "詳細を見る" },
            "type": "default",
            "url": "https://your-lark-instance.larksuite.com/approval/..."
          }
        ]
      }
    ]
  }
}
```

### Daily Report Card

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": { "tag": "plain_text", "content": "日報 — 2026-03-01 (田中)" },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "**今日の成果:**\n- ECサイトの商品ページ更新 (15件)\n- 在庫データ同期スクリプト修正\n- チームMTG参加\n\n**明日の予定:**\n- メルマガ配信準備\n- GA4レポート作成\n\n**課題:**\n- API連携でタイムアウト発生中 → 調査継続"
        }
      }
    ]
  }
}
```

---

## Webhook Integration Guide

Webhook Bots are the simplest way to send notifications without full API setup.

### Quick Setup (3 steps)

1. Lark Group Chat → Settings → Bots → Add Bot → Custom Bot
2. Copy the Webhook URL → Set as `LARK_WEBHOOK_URL`
3. Send: `lark webhook "デプロイ完了しました"`

### Webhook Payload Formats

**Text Message:**
```json
{ "msg_type": "text", "content": { "text": "デプロイ完了しました" } }
```

**Rich Text with Mentions:**
```json
{
  "msg_type": "post",
  "content": {
    "post": {
      "ja_jp": {
        "title": "サーバーアラート",
        "content": [
          [
            { "tag": "text", "text": "CPU使用率が90%を超えました " },
            { "tag": "at", "user_id": "all", "user_name": "全員" }
          ]
        ]
      }
    }
  }
}
```

**Signed Webhook (Security):**
When signature verification is enabled, add a timestamp and sign:
```
timestamp = current_time_seconds
sign = base64(hmac_sha256(timestamp + "\n" + secret))
payload = { "timestamp": "...", "sign": "...", "msg_type": "text", ... }
```

---

## Automation Recipes (Common Workflows)

Below are pre-built automation patterns the agent can deploy with minimal configuration.

### Recipe 1: Morning Stand-up Reminder
```
Trigger:  Cron (毎朝 9:50 JST)
Action:   lark webhook --card "standup_reminder" \
            --message "10:00からスタンドアップです。昨日の成果と今日の予定を準備してください。"
Channel:  #dev-team
```

### Recipe 2: Approval Auto-Escalation
```
Trigger:  Approval pending > 24 hours
Action:   1. lark send <approver-id> "承認待ちの申請があります（24h経過）"
          2. If 48h → Escalate to manager
          3. If 72h → Notify admin
```

### Recipe 3: Weekly Report Compilation
```
Trigger:  Every Friday 17:00 JST
Action:   1. lark sheet <id> read A1:Z100  (collect weekly data)
          2. Generate summary card
          3. lark send --card weekly_summary #management
```

### Recipe 4: New Employee Onboarding
```
Trigger:  New user added to "新入社員" group
Action:   1. lark send <user-id> welcome card with onboarding checklist
          2. lark doc create "オンボーディングチェックリスト" --template onboarding
          3. lark calendar create "1on1 with Manager" <date>
          4. Add to relevant chat groups
```

### Recipe 5: Incident Alert Pipeline
```
Trigger:  External webhook (Datadog, PagerDuty, etc.)
Action:   1. lark webhook --card incident_alert --data <payload>
          2. lark approval create incident_response --assignee <on-call>
          3. Create incident doc from template
          4. Start thread for real-time updates
```

---

## Data Storage & Persistence

```
~/.lark-workflow/
  config.yaml              # App credentials, default chat IDs, preferences
  tokens/
    tenant_token.json          # Cached tenant token (auto-refresh)
    user_tokens/
      user_abc.json            # Per-user OAuth tokens
  templates/
    cards/
      approval_notify.json     # Approval notification card template
      daily_report.json        # Daily report card
      weekly_summary.json      # Weekly summary card
      incident_alert.json      # Incident alert card
      standup_reminder.json    # Stand-up reminder card
    approvals/
      expense.json             # 経費申請テンプレート
      leave.json               # 休暇申請テンプレート
      ringi.json               # 稟議書テンプレート
      purchase.json            # 購買申請テンプレート
  webhooks/
    registered.json            # Registered webhook URLs
    event_subscriptions.json   # Active event subscriptions
  logs/
    messages_2026-03.json      # Message send log (monthly rotation)
    approvals_2026-03.json     # Approval action log
  cache/
    chat_list.json             # Chat list cache (TTL: 1h)
    user_list.json             # User list cache (TTL: 1h)
```

---

## Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|-------------|
| 99991400 | Invalid params (missing or malformed field) | Parse `msg` field for specific error, show which param needs fixing |
| 99991401 | Authentication failed (invalid app credentials) | Prompt user to verify `LARK_APP_ID` and `LARK_APP_SECRET` |
| 99991402 | Insufficient permissions (scope not granted) | Show required scope, guide: Lark Admin → App → Permissions → Add scope |
| 99991663 | Tenant token expired | Auto-refresh token via `/auth/v3/tenant_access_token/internal` |
| 99991672 | User token expired | Prompt user to re-authorize via OAuth2 flow |
| 99991400 | Chat not found (invalid chat_id) | Verify chat_id with `lark chats`, suggest search |
| 99991668 | Rate limit exceeded | Auto-wait, exponential backoff (1s, 2s, 4s), max 3 retries |
| 99991403 | Bot not in chat (cannot send message) | Guide: Group Settings → Bots → Add this app's bot |
| 230001 | Approval definition not found | Verify approval code, list available with `lark approval list` |
| 230004 | Approval instance already completed | Show current status, no action possible |
| 1254043 | Document permission denied | Guide: Share document with app or use user token |
| 500 | Lark internal server error | Retry up to 3 times with exponential backoff |

**Retry strategy:** On rate limit or 5xx errors, retry up to 3 times with delays of 1s, 2s, 4s. Token expiry errors trigger automatic token refresh before retry.

---

## Lark Workflow vs Other Collaboration Tools

| Feature | Lark Workflow | Slack Bot | Microsoft Teams Bot |
|---------|-------------|----------|-------------------|
| Platform | Lark / Feishu | Slack | Microsoft Teams |
| **Approval Workflows** | **Native (20段承認)** | Third-party app | Power Automate |
| Message Cards | **Interactive Cards** | Block Kit | Adaptive Cards |
| Document Integration | **Native Docs/Sheets** | Third-party | Office 365 |
| Calendar | **Built-in** | Google Cal integration | Outlook |
| Spreadsheet | **Native Sheets** | None | Excel Online |
| Webhook Setup | **1-step (URL only)** | 3-step (app + scope) | 5-step (Azure AD) |
| Multi-language | **JP/EN/CN native** | EN-first | EN-first |
| Pricing | Free tier generous | Free tier limited | Requires M365 |
| China Support | **Feishu (飛書) native** | Blocked in China | Limited |
| Bot Development | Simple JSON cards | Complex Block Kit | Azure Bot Framework |

---

## FAQ

**Q: Lark Suite と Feishu の違いは？**
A: Lark Suite はグローバル版（larksuite.com）、Feishu は中国版（feishu.cn）です。API構造はほぼ同じですが、エンドポイントのベースURLが異なります。本スキルは `config.yaml` の `region: global|china` 設定で自動切り替えします。

**Q: Webhook Bot とフルAPI の使い分けは？**
A: Webhook Bot は「通知を送るだけ」の場面に最適で、セットアップが簡単です（URL1つだけ）。メッセージの読み取り、ユーザー情報取得、承認フロー、ドキュメント操作などの双方向機能にはフルAPI（APP_ID + APP_SECRET）が必要です。

**Q: Interactive Card のボタンが押された時の処理は？**
A: Card のボタンアクションは、Lark の Event Subscription (callback URL) で受け取ります。本スキルではローカルの ngrok トンネルまたは外部エンドポイントを設定し、ボタンイベントを処理します。`config.yaml` で `callback_url` を設定してください。

**Q: 承認フローの段数は何段まで対応？**
A: Lark Approval API は最大20段の承認ステップに対応しています。本スキルでは `lark approval create` の `--steps` オプションで承認者チェーンを定義できます。並列承認（OR条件）や全員承認（AND条件）の設定も可能です。

**Q: メッセージの送信レート制限は？**
A: Lark API のレート制限はエンドポイントにより異なりますが、メッセージ送信は概ね5回/秒です。バッチ送信時は自動的にレート制限を尊重し、429エラー時はリトライします。大量送信（100件以上）はバッチAPIの利用を推奨します。

**Q: Lark のスプレッドシートで日本語データを読み書きできますか？**
A: はい、完全対応しています。`lark sheet <id> read A1:D10` でセルデータを取得し、日本語テキスト・数値・日付を正しくパースします。書き込みも同様に `lark sheet <id> write A1:D10 <data>` で JSON 形式のデータを書き込みます。

**Q: 他のツール（Notion, Slack等）との連携は可能ですか？**
A: はい。Webhook を介して外部サービスと双方向に連携できます。例えば Notion JP スキルと組み合わせて「Notionのタスク更新 → Larkに通知」や「Larkの承認完了 → Notionのステータス更新」といったワークフローを構築できます。
