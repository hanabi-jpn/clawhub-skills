---
name: "Notion JP"
description: "Notion日本語テンプレート — 20+ templates, 議事録自動生成"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - notion
  - japan
  - templates
  - productivity
  - documents
---

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

![Version](https://img.shields.io/badge/version-1.0.0-000000)
![Notion](https://img.shields.io/badge/Notion-API連携-000000?logo=notion&logoColor=white)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![Templates](https://img.shields.io/badge/📝-20+テンプレート-blue)

`claude-code` `notion` `japan` `productivity` `templates`

> **Notion日本語テンプレート＋議事録自動生成＋プロジェクト管理AIアシスタント。**

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

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NOTION_API_KEY` | Notion Integration Token | Yes | — |
| `NOTION_WORKSPACE_ID` | Default workspace ID | No | — |

API Base: `https://api.notion.com/v1/`

### Behavioral Guidelines

1. **Language**: すべての応答は日本語で行う。技術用語はNotionの日本語UIに準拠
2. **Safety**: 書き込み操作は必ず確認プロンプトを表示。`--force` 指定時のみスキップ
3. **Formatting**: Notionのブロック構造を理解し、適切なブロックタイプを自動選択
4. **Context Awareness**: ワークスペースの既存構造を分析してから提案を行う
5. **Error Transparency**: APIエラーは原因と対処法を日本語で説明
6. **Rate Limiting**: Notion APIの制限(3req/sec)を遵守し、バッチ処理時は自動スロットリング
7. **Data Privacy**: ページ内容をログに記録しない。キャッシュは24時間で自動削除
8. **Idempotency**: 同じコマンドを複数回実行しても副作用が発生しない設計
9. **Incremental Updates**: 大規模変更は段階的に実行し、各ステップで確認を取る
10. **Template Localization**: テンプレートは日本のビジネス慣行に最適化（年度表記、敬称等）
11. **Backup First**: 破壊的操作の前に自動バックアップを作成
12. **Progressive Disclosure**: 初回は基本機能を案内し、習熟度に応じて高度な機能を提案
13. **Cross-Reference**: 関連ページやデータベース間のリレーションを自動検出・提案
14. **Version Awareness**: Notion APIバージョンの互換性を常に確認
15. **Audit Trail**: すべての変更操作をローカルログに記録し、`notion history` で参照可能

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

### `notion pages [--db <database-id>]`

List pages, optionally filtered by database.

```
$ notion pages --db db_abc123
╔══════════════════════════════════════════════════════════════╗
║              ページ一覧 (プロジェクト管理DB)                 ║
╠══════════════════════════════════════════════════════════════╣
║  # │ タイトル              │ ステータス │ 担当者 │ 更新日     ║
╠═══╪═══════════════════════╪══════════╪════════╪════════════╣
║  1 │ ECサイトリニューアル   │ 進行中    │ 田中   │ 2026-03-01 ║
║  2 │ メルマガ配信基盤構築   │ 進行中    │ 鈴木   │ 2026-02-28 ║
║  3 │ GA4レポート自動化      │ レビュー中│ 佐藤   │ 2026-02-27 ║
║  4 │ 在庫管理API連携        │ 未着手    │ 山田   │ 2026-02-25 ║
║  5 │ SEO対策 Phase2         │ 完了     │ 田中   │ 2026-02-20 ║
╚══════════════════════════════════════════════════════════════╝
  Total: 5 pages in database
```

### `notion page <id>`

Display page content with block structure.

```
$ notion page page_def456
╔══════════════════════════════════════════════════════════╗
║  ECサイトリニューアル                                    ║
╠══════════════════════════════════════════════════════════╣
║  Properties:                                            ║
║    ステータス: 進行中                                    ║
║    担当者:     田中太郎                                  ║
║    期限:       2026-03-31                                ║
║    優先度:     高                                        ║
║    スプリント:  Sprint 5                                 ║
╠══════════════════════════════════════════════════════════╣
║  Content (12 blocks):                                   ║
║    [h2] 概要                                            ║
║    [text] EC-CUBEサイトのフロントエンドをリニューアル... ║
║    [h2] 要件                                            ║
║    [bullet] レスポンシブ対応の改善                       ║
║    [bullet] 商品ページのUI刷新                          ║
║    [bullet] カート導線の最適化                           ║
║    [h2] スケジュール                                    ║
║    [table] 4x3 (フェーズ/期間/担当/ステータス)          ║
║    ...                                                  ║
╚══════════════════════════════════════════════════════════╝
  Page ID: page_def456
  Last edited: 2026-03-01 13:45 by 田中太郎
```

### `notion meeting <title> [--attendees <names>]`

Create a new meeting notes page from template.

```
$ notion meeting "Q1計画レビュー" --attendees "田中,鈴木,佐藤"
✓ 議事録ページ作成完了
  Page ID:    page_mtg_789
  タイトル:    Q1計画レビュー 議事録 — 2026-03-01
  テンプレート: 標準議事録
  参加者:      田中太郎, 鈴木花子, 佐藤一郎
  日時:        2026-03-01 14:00 JST (自動入力)
  前回議事録:   リンク済み (page_mtg_756)
  URL:         https://notion.so/Q1-review-page_mtg_789

  ブロック構成:
    ✓ 基本情報テーブル
    ✓ 前回フォローアップ (2件自動追加)
    ✓ アジェンダセクション
    ✓ 議論内容セクション
    ✓ アクションアイテムテーブル
    ✓ 次回会議セクション
```

### `notion meeting summarize <page-id>`

Summarize meeting notes and extract action items.

```
$ notion meeting summarize page_mtg_789
╔══════════════════════════════════════════════════════════╗
║              議事録要約 — Q1計画レビュー                  ║
╠══════════════════════════════════════════════════════════╣
║  要約:                                                   ║
║  Q1の進捗を確認。ECリニューアルは予定通り進行中。         ║
║  メルマガ基盤は1週間遅延のため追加リソースを検討。        ║
║  GA4レポートは来週リリース予定。                          ║
║                                                         ║
║  決定事項:                                               ║
║  1. メルマガ基盤に外部パートナーを追加投入                ║
║  2. GA4レポートのレビューは3/5までに完了                  ║
║  3. 次回Q2計画ミーティングは3/15に設定                   ║
╠══════════════════════════════════════════════════════════╣
║  抽出されたアクションアイテム (3件):                      ║
║  ┌──────────────────────┬────────┬────────────┐          ║
║  │ TODO                 │ 担当   │ 期限       │          ║
║  ├──────────────────────┼────────┼────────────┤          ║
║  │ パートナー選定・発注  │ 鈴木   │ 2026-03-08 │          ║
║  │ GA4レポートレビュー   │ 佐藤   │ 2026-03-05 │          ║
║  │ Q2計画ドラフト作成    │ 田中   │ 2026-03-12 │          ║
║  └──────────────────────┴────────┴────────────┘          ║
║                                                         ║
║  ✓ タスクDB に3件自動登録済み                             ║
║  ✓ 議事録ページに要約ブロック追加済み                     ║
╚══════════════════════════════════════════════════════════╝
```

### `notion tasks [--status <status>]`

List tasks from the project management database.

```
$ notion tasks --status 進行中
╔══════════════════════════════════════════════════════════════════╗
║              タスク一覧 (ステータス: 進行中)                     ║
╠══════════════════════════════════════════════════════════════════╣
║  # │ タスク名              │ 担当   │ 優先度 │ 期限       │ 進捗 ║
╠═══╪═══════════════════════╪════════╪═══════╪════════════╪══════╣
║  1 │ ECフロントUI改修       │ 田中   │ 最優先 │ 2026-03-15 │ 60%  ║
║  2 │ メルマガAPI連携        │ 鈴木   │ 高    │ 2026-03-20 │ 35%  ║
║  3 │ 商品画像一括更新       │ 山田   │ 中    │ 2026-03-10 │ 80%  ║
║  4 │ パートナー選定・発注   │ 鈴木   │ 高    │ 2026-03-08 │ 10%  ║
╚══════════════════════════════════════════════════════════════════╝
  Total: 4 tasks in progress (Sprint 5)
```

### `notion report weekly`

Auto-generate a weekly report from task database.

```
$ notion report weekly
✓ 週次報告書を自動生成しました
  Page ID:   page_rpt_weekly_0301
  タイトル:   週次報告書 — 2026年3月第1週
  URL:       https://notion.so/weekly-report-page_rpt_weekly_0301

  集計結果:
    完了タスク:     3件 (見積もり: 18h / 実績: 21h)
    進行中タスク:   4件 (平均進捗: 46%)
    新規追加:       2件
    ブロッカー:     1件 (メルマガ基盤遅延)

  KPI実績:
    ベロシティ:     21pt (目標: 25pt) — 84%
    バグ修正率:     100% (3/3件)
    レビュー待ち:   1件 (GA4レポート)

  ✓ ページ作成完了 (16ブロック)
```

### `notion templates`

List all available Japanese templates.

```
$ notion templates
╔══════════════════════════════════════════════════════════╗
║              テンプレート一覧 (20+)                      ║
╠══════════════════════════════════════════════════════════╣
║  カテゴリ         │ テンプレート名          │ ブロック数  ║
╠══════════════════╪═══════════════════════╪════════════╣
║  会議             │ 議事録 (標準)          │ 14         ║
║  会議             │ 議事録 (レビュー)       │ 16         ║
║  会議             │ 1on1テンプレート       │ 12         ║
║  会議             │ ブレスト議事録          │ 10         ║
║  報告             │ 日報                   │  9         ║
║  報告             │ 週次報告書              │ 12         ║
║  計画             │ スプリント計画          │ 11         ║
║  計画             │ OKR管理                │ 13         ║
║  振り返り         │ KPT振り返り             │  8         ║
║  ドキュメント     │ 企画書                  │ 15         ║
║  ドキュメント     │ 要件定義書              │ 18         ║
║  ドキュメント     │ ナレッジベース           │  7         ║
║  営業             │ 商談記録                │ 10         ║
║  開発             │ バグレポート             │  9         ║
║  開発             │ リリースチェックリスト    │ 11         ║
║  HR               │ 新人研修チェック         │ 14         ║
║  KPI              │ KPIダッシュボード        │ 12         ║
║  ...              │ (他3テンプレート)        │ ...        ║
╚══════════════════════════════════════════════════════════╝
  Total: 20 templates
  Usage: notion create <template-name> [--title <title>]
```

### `notion search <query>`

Search across the entire workspace.

```
$ notion search "GA4レポート"
╔══════════════════════════════════════════════════════════════╗
║              ワークスペース検索: "GA4レポート"                ║
╠══════════════════════════════════════════════════════════════╣
║  # │ 種類  │ タイトル                    │ 更新日     │ 作成者║
╠═══╪═══════╪═══════════════════════════════╪════════════╪═════╣
║  1 │ Page  │ GA4レポート自動化            │ 2026-02-27 │ 佐藤 ║
║  2 │ Page  │ GA4レポート 要件定義書       │ 2026-02-15 │ 佐藤 ║
║  3 │ DB    │ GA4 KPIダッシュボード        │ 2026-02-20 │ 田中 ║
║  4 │ Page  │ Q1計画レビュー議事録 (言及)   │ 2026-03-01 │ AI   ║
╚══════════════════════════════════════════════════════════════╝
  Found: 4 results (形態素解析 + 部分一致)
```

**`notion create <template> [--title <title>]`** — テンプレートからページ作成
**`notion task create <title> [--assignee <name>]`** — タスク作成
**`notion task update <id> --status <status>`** — タスク更新
**`notion report daily`** — 日報自動生成
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

## Comparison: Notion JP vs Other Documentation Platforms

| Feature                          | Notion JP (本スキル)            | Confluence                      | Google Docs                     | Kibela                          |
|----------------------------------|--------------------------------|--------------------------------|--------------------------------|--------------------------------|
| API連携                          | Notion API完全対応 + AI拡張    | REST API v2対応                 | Google Docs API対応             | API提供あり（基本CRUD）         |
| 日本語テンプレート               | 20+種類同梱（議事録/日報/OKR等）| 英語テンプレート中心            | テンプレートギャラリー          | 日本語テンプレート少数          |
| 議事録自動生成                   | AI要約 + TODO自動抽出          | 手動作成                        | 手動作成                        | 手動作成                        |
| プロジェクト管理                 | DB + スプリント + ガントビュー | Jira連携で高機能                | 非対応（Sheets連携が必要）      | 基本的なタスク管理              |
| リアルタイム共同編集             | Notion標準機能                  | 対応                            | 最も得意（業界最高水準）        | 対応                            |
| データベース機能                 | リレーション/フィルタ/ビュー   | 非対応（表形式のみ）            | 非対応                          | 非対応                          |
| CLI/エージェント操作             | 全機能CLIコマンド対応          | CLI非公式のみ                   | Google Apps Script              | Web UIのみ                      |
| 日本語検索                       | 形態素解析 + 部分一致再検索    | 日本語対応あり                  | 高精度                          | 日本語対応                      |
| 料金                             | Notion Free〜 + 本スキル無料   | Standard $6.05/user/月          | 無料 (Google Workspace内)       | ¥550/user/月〜                  |
| オフライン対応                   | 一部対応                        | 対応                            | 限定的                          | 非対応                          |
| Slack/Lark連携                   | Webhook通知対応                 | Slack連携あり                   | Google Chat連携                 | Slack連携あり                   |
| 学習コスト                       | Notion + CLI操作               | 高い（機能が複雑）              | 低い（直感的UI）                | 低い                            |
| 対象規模                         | 個人〜中小チーム                | 中堅〜大企業                    | 個人〜大企業                    | 小〜中規模チーム                |

**When to use Notion JP:**
- 日本語テンプレートで即座に議事録/日報を運用したい → **Notion JP**
- AIで議事録を自動要約し、TODOを自動抽出したい → **Notion JP**
- Jiraレベルのプロジェクト管理が必要 → Confluence + Jira
- Google Workspace中心の組織 → Google Docs
- 日本のスタートアップでシンプルに情報共有 → Kibela

---

## Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|-------------|
| 400 | Invalid request (malformed JSON, missing required fields) | Parse error details, show which field is invalid, suggest correction |
| 401 | Unauthorized (invalid or expired API key) | Prompt user to check `NOTION_API_KEY` and re-create Integration if needed |
| 403 | Restricted resource (Integration not connected to page/DB) | Guide user: page「...」→「コネクト」→ Integration追加 |
| 404 | Object not found (page/DB deleted or ID wrong) | Verify page/DB ID, suggest `notion search` to find correct resource |
| 409 | Conflict (transaction conflict on concurrent edits) | Retry once after 1s, if persists, show conflict details to user |
| 429 | Rate limited (3 req/sec exceeded) | Auto-wait per `Retry-After` header, queue remaining requests |
| 500 | Notion internal server error | Retry up to 3 times with exponential backoff (1s, 2s, 4s) |
| 502/503 | Service unavailable / maintenance | Check [Notion Status](https://status.notion.so/), retry after 30s |

**Retry strategy:** On 429 or 5xx errors, retry up to 3 times with delays of 1s, 2s, 4s. Log each retry attempt. For 403 errors, never retry — always prompt user action.

---

## Additional Template Examples

### 日報テンプレート (Daily Report)

```markdown
# 日報 — [YYYY-MM-DD] [名前]

## 本日の業務内容
| 時間帯    | 業務内容               | 区分   | 進捗  |
|----------|----------------------|--------|------|
| 09:00-10:00 | [業務1]             | 開発   | 完了  |
| 10:00-12:00 | [業務2]             | MTG    | -    |
| 13:00-15:00 | [業務3]             | 調査   | 80%  |
| 15:00-17:30 | [業務4]             | 開発   | 50%  |

## 完了タスク
- [x] [タスク1]
- [x] [タスク2]

## 明日の予定
- [ ] [予定1]
- [ ] [予定2]

## 課題・相談事項
- [課題]: [対応状況]

## 所感
[一言コメント]
```

### OKR管理テンプレート (OKR Tracker)

```markdown
# OKR — [YYYY年 Q1/Q2/Q3/Q4]

## Objective 1: [目標]
進捗: ██████████░░░░░░░░░░ 50%

| Key Result | 目標値 | 現在値 | 達成率 | ステータス |
|-----------|-------|-------|-------|----------|
| KR1: [指標] | 100   | 62    | 62%   | 🟡 要注意 |
| KR2: [指標] | 50    | 48    | 96%   | 🟢 順調  |
| KR3: [指標] | 200   | 89    | 45%   | 🔴 遅延  |

## Objective 2: [目標]
進捗: ████████████████░░░░ 80%

| Key Result | 目標値 | 現在値 | 達成率 | ステータス |
|-----------|-------|-------|-------|----------|
| KR1: [指標] | 30    | 28    | 93%   | 🟢 順調  |
| KR2: [指標] | 15    | 11    | 73%   | 🟡 要注意 |

## 振り返り・Next Action
- [学び]
- [次のアクション]
```

### 1on1テンプレート (1on1 Meeting)

```markdown
# 1on1 — [上司名] × [部下名] — [YYYY-MM-DD]

## 前回のフォローアップ
- [ ] [前回TODO 1] → 状況:
- [ ] [前回TODO 2] → 状況:

## 今週のトピック
### 業務の進捗
- [プロジェクトA]: [状況]
- [プロジェクトB]: [状況]

### 困っていること・相談
- [相談1]
- [相談2]

### キャリア・成長
- [学びたいこと / 挑戦したいこと]

### フィードバック
**良かった点:**
- [ポジティブFB]

**改善点:**
- [建設的FB]

## アクションアイテム
| TODO | 担当 | 期限 |
|------|------|------|
| [アクション1] | [名前] | [日付] |
| [アクション2] | [名前] | [日付] |

## 次回日程
[候補日時]
```

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

**Q: Notion APIのレート制限に引っかかった場合は？**
A: 自動的にExponential Backoff（最大5回リトライ）を実行します。429エラー時はRetry-Afterヘッダーの値を尊重し、バッチ処理では自動的にリクエスト間隔を調整します。`notion rate-limit status` で現在の使用状況を確認できます。

**Q: 日本語の全文検索は正確ですか？**
A: Notion APIの検索機能に加えて、ローカルキャッシュでの形態素解析（MeCab互換）による日本語トークナイズを実行し、部分一致・類義語検索にも対応しています。

**Q: 既存のNotionワークスペースを壊さずに使えますか？**
A: はい、全ての書き込み操作は確認プロンプト付きで実行されます。`--dry-run` フラグでプレビュー可能で、`notion backup` コマンドで操作前の自動バックアップも取得します。
