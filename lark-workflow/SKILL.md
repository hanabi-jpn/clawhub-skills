# Lark Workflow

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
