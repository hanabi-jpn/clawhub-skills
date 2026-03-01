# Notion JP

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║              NOTION JP v1.0                      ║
    ║                                                  ║
    ║         ┌─────────────────────┐                  ║
    ║         │  📝 ┌───────────┐   │                  ║
    ║         │     │ ■ 議事録  │   │                  ║
    ║         │     │ ■ 日報    │   │                  ║
    ║         │     │ ■ 稟議書  │   │                  ║
    ║         │     │ ■ KPT     │   │                  ║
    ║         │     └─────┬─────┘   │                  ║
    ║         │           ▼         │                  ║
    ║         │     ┌───────────┐   │                  ║
    ║         │     │ AI自動生成 │   │                  ║
    ║         │     │ 20+テンプレ│   │                  ║
    ║         │     └───────────┘   │                  ║
    ║         └─────────────────────┘                  ║
    ║                                                  ║
    ║   ─── 日本のビジネスに最適化されたNotion ───     ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-000000?style=for-the-badge)
![Notion](https://img.shields.io/badge/Notion-API連携-000000?style=for-the-badge&logo=notion&logoColor=white)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000?style=for-the-badge)
![Templates](https://img.shields.io/badge/📝-20+テンプレート-blue?style=for-the-badge)

> Notion日本語テンプレート＋議事録自動生成＋プロジェクト管理AIアシスタント。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** notion, productivity, japan, meeting-notes, project-management

---

## Overview

Notion JP connects to the Notion API with Japanese-optimized templates, automatic meeting notes generation, and project management workflows designed for Japanese business culture.

## System Prompt Instructions

You are equipped with **Notion JP** for Notion workspace management in Japanese.

### Setup

- `NOTION_API_KEY` — Notion Integration Token
- `NOTION_WORKSPACE_ID` — (optional) Default workspace

API Base: `https://api.notion.com/v1/`

### Core Capabilities

**1. 議事録自動生成:**
- 会議テンプレート自動作成（日時、参加者、議題、決定事項、TODO）
- 議論要約の自動生成
- アクションアイテム抽出・担当者割当
- 前回議事録からのフォローアップ項目自動追加
- テンプレート: 定例ミーティング、ブレスト、レビュー、1on1

**2. プロジェクト管理:**
- プロジェクトDBの作成・管理
- タスクの作成・更新・完了
- ガントチャート的ビュー（テーブル形式）
- 進捗レポート自動生成
- スプリント管理
- リソース配分ビュー

**3. 日本語テンプレート集 (20+):**
- 📋 議事録 (Meeting Notes)
- 📊 週次報告書 (Weekly Report)
- 📝 日報 (Daily Report)
- 🎯 OKR管理 (OKR Tracker)
- 📅 スプリント計画 (Sprint Planning)
- 💡 企画書 (Proposal)
- 📖 ナレッジベース (Knowledge Base)
- 👥 1on1テンプレート (1on1 Template)
- 🔄 振り返り (Retrospective)
- 📈 KPIダッシュボード (KPI Dashboard)
- 📞 商談記録 (Sales Meeting Record)
- 🎓 新人研修チェック (Onboarding Checklist)
- 🐛 バグレポート (Bug Report)
- 📋 要件定義書 (Requirements Doc)
- ✅ リリースチェックリスト (Release Checklist)
- And more...

**4. ページ管理:**
- ページの作成・読取・更新・削除
- データベースの検索・フィルタ・ソート
- ブロックの追加・編集
- ページプロパティの一括更新
- ページ間のリレーション管理

**5. 自動化:**
- 定期レポート生成（日報、週報）
- リマインダー設定
- ステータス変更時の通知
- テンプレートからの自動ページ作成

### Commands

**`notion pages [--db <database-id>]`** — ページ一覧
**`notion page <id>`** — ページ内容表示
**`notion create <template> [--title <title>]`** — テンプレートからページ作成
**`notion meeting <title> [--attendees <names>]`** — 議事録作成
**`notion meeting summarize <page-id>`** — 議事録要約＋TODO抽出
**`notion tasks [--status <status>]`** — タスク一覧
**`notion task create <title> [--assignee <name>]`** — タスク作成
**`notion task update <id> --status <status>`** — タスク更新
**`notion report weekly`** — 週次報告書自動生成
**`notion report daily`** — 日報自動生成
**`notion templates`** — テンプレート一覧
**`notion search <query>`** — ワークスペース検索
**`notion db <id> --filter <filter>`** — DB検索

---

## Notion API Integration Details

This skill interfaces with the Notion API v2022-06-28 or later. The agent MUST follow these API conventions precisely.

### Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│               Notion JP Authentication Flow                   │
│                                                              │
│  ┌────────────┐    ┌───────────────┐    ┌────────────────┐   │
│  │ User sets   │───>│ Agent reads   │───>│ API calls with │   │
│  │ NOTION_API  │    │ env variable  │    │ Bearer token   │   │
│  │ _KEY        │    │ at runtime    │    │ in header      │   │
│  └────────────┘    └───────────────┘    └────────┬───────┘   │
│                                                   │           │
│                                          ┌────────v───────┐  │
│                                          │ Notion API     │  │
│                                          │ v2022-06-28    │  │
│                                          │                │  │
│                                          │ Headers:       │  │
│                                          │  Authorization │  │
│                                          │  Notion-Version│  │
│                                          │  Content-Type  │  │
│                                          └────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Required Headers for every API call:**
```
Authorization: Bearer {NOTION_API_KEY}
Notion-Version: 2022-06-28
Content-Type: application/json
```

### Key API Endpoints Used

| Endpoint                              | Method | Purpose                          |
|---------------------------------------|--------|----------------------------------|
| `/v1/pages`                           | POST   | Create a new page                |
| `/v1/pages/{id}`                      | GET    | Retrieve page details            |
| `/v1/pages/{id}`                      | PATCH  | Update page properties           |
| `/v1/databases`                       | POST   | Create a database                |
| `/v1/databases/{id}`                  | GET    | Retrieve database                |
| `/v1/databases/{id}/query`            | POST   | Query database with filters      |
| `/v1/blocks/{id}/children`            | GET    | List child blocks                |
| `/v1/blocks/{id}/children`            | PATCH  | Append blocks                    |
| `/v1/search`                          | POST   | Search workspace                 |
| `/v1/users`                           | GET    | List workspace users             |
| `/v1/comments`                        | POST   | Add comments to pages            |

---

## Meeting Notes Generation Workflow

The meeting notes workflow is the most frequently used feature. Below is the detailed pipeline from creation to follow-up.

```
┌─────────────────────────────────────────────────────────────┐
│            Meeting Notes Pipeline (議事録フロー)              │
│                                                             │
│  Step 1: テンプレート選択                                    │
│    │  notion meeting "Q1 Planning" --template review         │
│    v                                                        │
│  Step 2: メタデータ自動入力                                  │
│    │  日時: 自動 (現在時刻)                                  │
│    │  参加者: --attendees から取得                            │
│    │  前回議事録: 同シリーズの直近を自動リンク                │
│    v                                                        │
│  Step 3: 議事録ページ作成 (Notion API POST /v1/pages)        │
│    │  テンプレートブロックを自動展開                          │
│    v                                                        │
│  Step 4: 会議中リアルタイム更新                              │
│    │  ユーザーが議論内容を入力                                │
│    │  Agent が随時整理・要約                                  │
│    v                                                        │
│  Step 5: 会議後処理 (notion meeting summarize <page-id>)     │
│    │  決定事項の抽出                                         │
│    │  アクションアイテムの一覧化                              │
│    │  担当者・期日の割当                                     │
│    │  タスクDBへの自動登録                                    │
│    v                                                        │
│  Step 6: 通知・共有                                          │
│    参加者への議事録リンク共有                                 │
│    未参加者への要約送付                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Template Examples

### 議事録テンプレート (Meeting Notes Template)

When `notion meeting` is called, the agent creates a page with the following block structure:

```markdown
# [会議名] 議事録

## 基本情報
| 項目     | 内容                     |
|----------|--------------------------|
| 日時     | 2026-03-01 14:00-15:00   |
| 場所     | Zoom / 会議室A           |
| 参加者   | 田中、鈴木、佐藤         |
| 議事録作成| AI (Notion JP)          |

## 前回フォローアップ
- [ ] [前回TODO 1] — 担当: 田中 → 完了 / 未完了
- [ ] [前回TODO 2] — 担当: 鈴木 → 完了 / 未完了

## アジェンダ
1. [議題1]
2. [議題2]
3. [議題3]

## 議論内容

### 議題1: [タイトル]
**議論:**
- [発言要旨]

**決定事項:**
- [決定内容]

### 議題2: [タイトル]
**議論:**
- [発言要旨]

**決定事項:**
- [決定内容]

## アクションアイテム
| TODO           | 担当   | 期限       | ステータス |
|----------------|--------|------------|------------|
| [アクション1]  | 田中   | 2026-03-08 | 未着手     |
| [アクション2]  | 鈴木   | 2026-03-15 | 未着手     |

## 次回会議
- 日時: [候補]
- アジェンダ案: [内容]
```

### 週次報告書テンプレート (Weekly Report)

```markdown
# 週次報告書 — [YYYY年MM月第N週]

## 今週の成果
### 完了タスク
- [タスク1] — 想定工数: Xh / 実績: Yh
- [タスク2] — 想定工数: Xh / 実績: Yh

### 進捗中タスク
- [タスク3] — 進捗: XX% — 完了予定: MM/DD

## KPI実績
| 指標         | 目標   | 実績   | 達成率 |
|-------------|--------|--------|--------|
| [KPI1]      | XXX    | YYY    | ZZ%    |
| [KPI2]      | XXX    | YYY    | ZZ%    |

## 課題・リスク
- [課題1]: [対応策]
- [課題2]: [対応策]

## 来週の計画
- [予定タスク1]
- [予定タスク2]

## 所感・メモ
[自由記述]
```

---

## Project Management Workflow

The agent manages projects using a structured Notion database with the following schema:

### Project Database Schema

```
Database: プロジェクト管理
├── タスク名        (title)
├── ステータス      (select: 未着手/進行中/レビュー中/完了/保留)
├── 優先度          (select: 最優先/高/中/低)
├── 担当者          (people)
├── 期限            (date)
├── スプリント      (select: Sprint 1/2/3...)
├── 見積もり工数    (number, hours)
├── 実績工数        (number, hours)
├── カテゴリ        (multi_select: 開発/デザイン/マーケ/運用)
├── 関連ドキュメント (relation → ナレッジベースDB)
└── 備考            (rich_text)
```

### Sprint Management Cycle

```
┌──────────────────────────────────────────────────┐
│            Sprint Cycle (2週間)                    │
│                                                  │
│  Day 1: Sprint Planning                          │
│    notion create sprint-planning --sprint 5      │
│    → バックログからタスク選定                     │
│    → 見積もり工数の確認                           │
│                                                  │
│  Day 2-9: Execution                              │
│    notion tasks --status 進行中                   │
│    → 日報で進捗更新                               │
│    → ブロッカー発生時にアラート                   │
│                                                  │
│  Day 10: Sprint Review                           │
│    notion report weekly --sprint 5               │
│    → 完了タスクのデモ                             │
│    → ベロシティ計算                               │
│                                                  │
│  Day 10: Retrospective                           │
│    notion create retrospective                   │
│    → Keep / Problem / Try の振り返り              │
│    → 改善アクションをバックログに追加             │
└──────────────────────────────────────────────────┘
```

---

## Integration with Other Tools

Notion JP is designed to work alongside other skills in the ecosystem. Below are the primary integration points.

| Integration Target   | Method                | Use Case                                       |
|----------------------|-----------------------|------------------------------------------------|
| Lark Workflow        | Webhook notification  | 議事録作成完了時にLarkチャットへ通知            |
| JP SEO Writer        | Page content export   | SEO記事の下書きをNotionで管理、公開時にCMS連携  |
| JP Tax Calc          | Data embedding        | 経費データをNotionDBからtax計算へ入力           |
| Google Calendar      | Sync via Zapier/API   | カレンダーイベントから自動議事録ページ生成       |
| Slack                | Webhook               | タスクステータス変更時にSlack通知               |
| GitHub               | Relation property     | PRとNotionタスクを紐付け、マージ時に自動完了    |

---

## Data Storage & Persistence

```
~/.notion-jp/
  config.yaml           # API key, default DB IDs, user preferences
  templates/
    meeting_default.json     # 標準議事録テンプレート
    meeting_review.json      # レビュー議事録
    meeting_1on1.json        # 1on1テンプレート
    meeting_brainstorm.json  # ブレスト議事録
    weekly_report.json       # 週次報告書
    daily_report.json        # 日報
    sprint_planning.json     # スプリント計画
    retrospective.json       # 振り返り
    okr_tracker.json         # OKR管理
  cache/
    workspace_users.json     # ユーザーキャッシュ (TTL: 1h)
    db_schemas.json          # DBスキーマキャッシュ (TTL: 24h)
  sessions/
    meeting_2026-03-01.json  # 議事録セッション記録
```

---

## FAQ

**Q: NOTION_API_KEY はどこで取得できますか？**
A: [Notion Developers](https://developers.notion.com/) にアクセスし、「New Integration」で Internal Integration を作成してください。作成後に表示される「Internal Integration Secret」が API Key です。その後、連携したいページやデータベースで「コネクト」からこの Integration を追加する必要があります。

**Q: 議事録テンプレートをカスタマイズできますか？**
A: はい。`~/.notion-jp/templates/` 内の JSON ファイルを編集するか、`notion create` コマンドの `--template` で Notion 上のテンプレートページ ID を指定することで、完全にカスタマイズできます。

**Q: 既存の Notion データベースを使えますか？**
A: はい。`notion tasks --db <database-id>` のように DB ID を指定すれば、既存のデータベースに対して読み書きできます。ただし、Integration がそのデータベースに接続されている必要があります（ページ右上の「...」→「コネクト」から追加）。

**Q: 日報の自動生成はどう設定しますか？**
A: `notion report daily` を cron や macOS の launchd でスケジュール実行してください。コマンドは当日のタスク DB を自動集計し、日報ページを生成します。前日との差分も自動計算されます。

**Q: Notion API のレート制限は？**
A: Notion API は平均3リクエスト/秒のレート制限があります。本スキルはバッチ操作時に自動的にレート制限を尊重し、429レスポンスを受けた場合は Retry-After ヘッダーに従って待機します。大量のページ操作時でもエラーなく処理されます。

**Q: 日本語の検索精度は？**
A: Notion の検索APIは英語に最適化されていますが、本スキルではクエリの前処理（形態素解析で主要キーワードを抽出）を行い、日本語検索の精度を向上させています。完全一致でヒットしない場合は部分一致での再検索も自動実行します。

**Q: 複数ワークスペースに対応していますか？**
A: `config.yaml` で複数の API Key とワークスペース ID を定義し、`--workspace` フラグで切り替えることができます。デフォルトのワークスペースは `NOTION_WORKSPACE_ID` 環境変数で設定されます。
