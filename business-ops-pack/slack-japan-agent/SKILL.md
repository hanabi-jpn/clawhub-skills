---
name: slack-japan-agent
description: Slack日本語ワークフロー自動化エージェント - チャンネル管理・メッセージ自動化・日報収集・承認フローを統合的に運用するClaude Codeスキル
version: "1.0.0"
author: hanabi-jpn
tags:
  - slack
  - workflow
  - automation
  - japan
  - business
  - communication
  - daily-report
  - approval
  - reminder
  - japanese
---

```
┌─────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────────────────────────────────────┐ │
│  │ ╔══╗ │  │   SLACK JAPAN AGENT                  │ │
│  │ ║##║ │  │   ━━━━━━━━━━━━━━━━━━                │ │
│  │ ║##║ │  │   日本語ワークフロー自動化            │ │
│  │ ╚══╝ │  │   Workflow Automation for JP Teams    │ │
│  │  ▓▓  │  │                                      │ │
│  │ ▓▓▓▓ │  │   ◆ チャンネル管理                   │ │
│  │▓▓▓▓▓▓│  │   ◆ 日報収集・集計                   │ │
│  │ ▓▓▓▓ │  │   ◆ 承認フロー                       │ │
│  │  ▓▓  │  │   ◆ 会議リマインダー                  │ │
│  └──────┘  └──────────────────────────────────────┘ │
│  Powered by Claude Code + Slack Web API             │
└─────────────────────────────────────────────────────┘
```

`claude-code` `slack` `workflow` `automation` `japan`

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/clawhub-skills)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/hanabi-jpn/clawhub-skills/blob/main/LICENSE)
[![Platform](https://img.shields.io/badge/platform-Slack_Web_API-4A154B)](https://api.slack.com/)
[![Language](https://img.shields.io/badge/language-Japanese-red)](https://github.com/hanabi-jpn/clawhub-skills)
[![Claude](https://img.shields.io/badge/claude-opus_4.6-orange)](https://claude.ai)

> **Slack日本語ワークフロー自動化エージェント** -- 日本企業のSlack運用に特化したClaude Codeスキル。チャンネル管理、メッセージテンプレート、日報収集、承認フロー、会議リマインダーを自然言語で操作し、日本のビジネス文化に適合したコミュニケーション自動化を実現します。

---

## Overview

Slack Japan Agentは、日本企業のSlackワークスペース運用を包括的に自動化するClaude Codeスキルです。Slack Web APIとEvents APIを統合し、日本のビジネス慣習に最適化されたワークフローを提供します。敬語テンプレート、曜日ベースのリマインダー、稟議ベースの承認フロー、和暦対応の日報フォーマットなど、日本企業固有の要件に対応しています。

### アーキテクチャ図

```
┌────────────────────────────────────────────────────────────────┐
│                     Claude Code CLI                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Slack Japan Agent Core                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │  │
│  │  │ Command    │ │ Template   │ │ Workflow Engine      │  │  │
│  │  │ Parser     │ │ Manager    │ │ (承認/日報/通知)      │  │  │
│  │  └─────┬──────┘ └─────┬──────┘ └──────────┬───────────┘  │  │
│  │        │              │                    │              │  │
│  │  ┌─────▼──────────────▼────────────────────▼───────────┐  │  │
│  │  │              API Gateway Layer                       │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │  │  │
│  │  │  │ Web API  │ │ Events   │ │ Webhook Handler      │ │  │  │
│  │  │  │ Client   │ │ API      │ │ (Socket Mode)        │ │  │  │
│  │  │  └────┬─────┘ └────┬─────┘ └──────────┬───────────┘ │  │  │
│  │  └───────┼────────────┼──────────────────┼─────────────┘  │  │
│  └──────────┼────────────┼──────────────────┼────────────────┘  │
│             │            │                  │                   │
│  ┌──────────▼────────────▼──────────────────▼─────────────────┐ │
│  │                  Slack Workspace                            │ │
│  │  #general  #daily-report  #approval  #meeting  #analytics  │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## System Prompt / Behavioral Guidelines

このスキルを使用する際、エージェントは以下のガイドラインに従います。

1. すべてのSlack操作はSlack Web APIの公式エンドポイントを使用し、非公式APIやスクレイピングは行わない
2. メッセージ送信前に必ず宛先チャンネルとメンション対象を確認し、誤送信を防止する
3. 日本語メッセージは敬語（です・ます調）をデフォルトとし、社内カジュアル設定が有効な場合のみ砕けた表現を許容する
4. 日報テンプレートは「本日の業務内容」「進捗状況」「明日の予定」「課題・相談事項」の4セクション構成を標準とする
5. 承認フローは「申請→一次承認→最終承認→完了通知」の多段階構成をサポートし、各段階でSlackメッセージ通知を送信する
6. 会議リマインダーは開始30分前・5分前の2段階通知をデフォルトとし、カスタマイズ可能とする
7. ワークフロー作成時はSlack Workflow Builder互換のJSON形式で出力し、直接インポート可能な形式を維持する
8. APIレートリミットを遵守し、Web APIのTier制限（Tier1: 1/min, Tier2: 20/min, Tier3: 50/min, Tier4: 100/min）に従ったリクエスト制御を行う
9. Bot Tokenのスコープは最小権限原則に従い、必要なスコープのみを要求する（channels:read, chat:write, users:read, reactions:write等）
10. エラー発生時は日本語でわかりやすいエラーメッセージを表示し、復旧手順を提示する
11. 個人情報を含むメッセージ（電話番号、住所、マイナンバー等）の送信時は警告を表示する
12. チャンネル作成時は命名規則（プレフィックス: pj-, team-, info-, tmp-）を推奨し、説明文の設定を促す
13. 分析・検索結果は最大100件をデフォルトとし、大量データの場合はページネーションを適用する
14. タイムゾーンはAsia/Tokyo（JST, UTC+9）を標準とし、すべての日時表示をJST基準で行う
15. Slack接続状態を定期的に確認し、WebSocket切断時は自動再接続を試行する（最大5回、指数バックオフ）
16. メッセージ内のURLはunfurl設定を尊重し、プレビュー展開の有無をコントロールする
17. 監査ログとして、すべてのAPI操作をローカルの操作ログファイルに記録する

---

## Environment Variables

| 変数名 | 必須 | 説明 | 取得方法 |
|--------|------|------|----------|
| `SLACK_BOT_TOKEN` | はい | Slack Bot User OAuth Token（xoxb-で始まる） | Slack App管理画面 > OAuth & Permissions > Bot User OAuth Token |
| `SLACK_APP_TOKEN` | はい | Slack App-Level Token（xapp-で始まる、Socket Mode用） | Slack App管理画面 > Basic Information > App-Level Tokens |
| `SLACK_SIGNING_SECRET` | はい | リクエスト署名検証用シークレット | Slack App管理画面 > Basic Information > Signing Secret |
| `SLACK_WORKSPACE_ID` | はい | ワークスペースID（Tで始まる） | ワークスペース設定 > ワークスペースID |
| `SLACK_DEFAULT_CHANNEL` | いいえ | デフォルト投稿チャンネル名 | 任意のチャンネル名（例: general） |
| `SLACK_DAILY_REPORT_CHANNEL` | いいえ | 日報投稿先チャンネル | 任意のチャンネル名（例: daily-report） |
| `SLACK_APPROVAL_CHANNEL` | いいえ | 承認フロー通知チャンネル | 任意のチャンネル名（例: approval） |
| `SLACK_LOG_LEVEL` | いいえ | ログレベル（DEBUG/INFO/WARN/ERROR） | デフォルト: INFO |

---

## Commands

### 1. `slack channel`

チャンネルの作成・管理・情報取得を行います。

```bash
# チャンネル作成
slack channel create --name "pj-website-renewal" --description "ウェブサイトリニューアルプロジェクト" --private

# 出力:
# ✅ チャンネル作成完了
# ┌──────────────────────────────────────────┐
# │ チャンネル名:  #pj-website-renewal       │
# │ タイプ:        プライベート               │
# │ 説明:          ウェブサイトリニューアル... │
# │ 作成日時:      2026-03-01 10:30:00 JST   │
# │ チャンネルID:  C07A2B3C4D5               │
# └──────────────────────────────────────────┘
```

```bash
# チャンネル一覧取得
slack channel list --type public --sort members

# 出力:
# 📋 パブリックチャンネル一覧（メンバー数順）
# ┌────┬──────────────────────┬────────┬──────────────┐
# │ #  │ チャンネル名          │ メンバー│ 最終投稿      │
# ├────┼──────────────────────┼────────┼──────────────┤
# │  1 │ #general             │    142 │ 3分前         │
# │  2 │ #random              │    138 │ 12分前        │
# │  3 │ #pj-website-renewal  │     23 │ 1時間前       │
# │  4 │ #team-engineering    │     18 │ 30分前        │
# │  5 │ #info-release        │     15 │ 2時間前       │
# └────┴──────────────────────┴────────┴──────────────┘
# 合計: 47チャンネル（上位5件表示）
```

### 2. `slack message`

メッセージの送信・テンプレート管理を行います。

```bash
# テンプレートを使ったメッセージ送信
slack message send --channel "general" --template "announcement" --vars "title=システムメンテナンスのお知らせ,date=2026年3月5日,time=22:00-翌6:00"

# 出力:
# ✅ メッセージ送信完了
# ┌──────────────────────────────────────────────────┐
# │ 送信先:    #general                               │
# │ 送信日時:  2026-03-01 14:00:00 JST               │
# │ メッセージID: 1709276400.123456                   │
# │                                                   │
# │ 【プレビュー】                                     │
# │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
# │ :mega: *システムメンテナンスのお知らせ*            │
# │                                                   │
# │ いつもお疲れさまです。                              │
# │ 下記の通りシステムメンテナンスを実施いたします。    │
# │                                                   │
# │ 日時: 2026年3月5日 22:00-翌6:00                   │
# │                                                   │
# │ ご不便をおかけしますが、ご協力をお願いいたします。  │
# │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
# └──────────────────────────────────────────────────┘
```

### 3. `slack workflow`

ワークフローの作成・管理を行います。

```bash
# 新入社員オンボーディングワークフロー作成
slack workflow create --name "onboarding" --trigger "member_joined_channel" --channel "newcomers"

# 出力:
# ✅ ワークフロー作成完了
# ┌──────────────────────────────────────────────────┐
# │ ワークフロー名: 新入社員オンボーディング          │
# │ トリガー:       チャンネル参加時                   │
# │ 対象:           #newcomers                        │
# │ ステップ数:     4                                  │
# │                                                   │
# │ Step 1: ウェルカムメッセージ送信                   │
# │ Step 2: 自己紹介フォーム表示                       │
# │ Step 3: 必読チャンネル招待（5ch）                  │
# │ Step 4: メンター通知送信                           │
# │                                                   │
# │ ステータス: 有効                                   │
# └──────────────────────────────────────────────────┘
```

### 4. `slack daily-report`

日報の収集・集計・テンプレート管理を行います。

```bash
# 日報テンプレートで投稿
slack daily-report submit --user "tatsuya.ishihara"

# 出力:
# 📝 日報テンプレート（2026年3月1日 月曜日）
# ┌──────────────────────────────────────────────────┐
# │ ■ 本日の業務内容                                  │
# │   1. クライアントA社とのキックオフMTG（10:00-11:30）│
# │   2. 要件定義書のレビュー・修正                    │
# │   3. 新機能のプロトタイプ作成                      │
# │                                                   │
# │ ■ 進捗状況                                        │
# │   ・プロジェクトA: 45% → 52%（+7%）               │
# │   ・プロジェクトB: 80%（変更なし）                 │
# │                                                   │
# │ ■ 明日の予定                                      │
# │   1. 要件定義書の最終版提出                        │
# │   2. デザインレビュー会議（14:00-）                │
# │                                                   │
# │ ■ 課題・相談事項                                   │
# │   ・A社の追加要件について上長判断が必要             │
# │                                                   │
# │ 投稿先: #daily-report                             │
# │ ステータス: 送信完了                                │
# └──────────────────────────────────────────────────┘
```

```bash
# 日報集計レポート
slack daily-report summary --date "2026-03-01"

# 出力:
# 📊 日報集計レポート（2026年3月1日）
# ┌──────────────────────────────────────────────────┐
# │ 提出状況: 18/22名（提出率 81.8%）                 │
# │                                                   │
# │ 未提出者:                                         │
# │   ・佐藤太郎（営業部）                             │
# │   ・鈴木花子（マーケティング部）                    │
# │   ・田中一郎（開発部）                             │
# │   ・山田次郎（経理部）                             │
# │                                                   │
# │ リマインダー: 未提出者へDM送信済み                  │
# └──────────────────────────────────────────────────┘
```

### 5. `slack remind`

会議リマインダーの設定・管理を行います。

```bash
# 定例会議リマインダー設定
slack remind create --title "週次定例会議" --schedule "every monday 09:30" --channel "team-engineering" --mentions "@channel"

# 出力:
# ⏰ リマインダー設定完了
# ┌──────────────────────────────────────────────────┐
# │ タイトル:    週次定例会議                          │
# │ スケジュール: 毎週月曜日 09:30 JST                │
# │ 通知先:      #team-engineering                    │
# │ メンション:  @channel                             │
# │ 事前通知:    30分前・5分前                         │
# │ リマインダーID: REM-20260301-001                  │
# │ ステータス:  有効                                  │
# └──────────────────────────────────────────────────┘
```

### 6. `slack approve`

承認フローの作成・管理を行います。

```bash
# 経費精算の承認申請
slack approve request --type "expense" --amount 35000 --description "クライアント訪問交通費（東京-大阪往復）" --approver "manager.tanaka"

# 出力:
# 📋 承認申請作成完了
# ┌──────────────────────────────────────────────────┐
# │ 申請番号:  APR-2026-0301-001                     │
# │ 種別:      経費精算                                │
# │ 金額:      ¥35,000                               │
# │ 内容:      クライアント訪問交通費（東京-大阪往復） │
# │ 申請者:    石原達也                                │
# │ 承認者:    田中マネージャー                        │
# │ ステータス: 承認待ち                               │
# │                                                   │
# │ 承認フロー:                                        │
# │  [申請] ──→ [一次承認] ──→ [経理確認] ──→ [完了]  │
# │    ✅         ⏳            ○              ○      │
# │                                                   │
# │ 通知: #approval チャンネルに投稿済み               │
# │ DM: @manager.tanaka に承認依頼送信済み             │
# └──────────────────────────────────────────────────┘
```

### 7. `slack search`

メッセージ・ファイルの検索を行います。

```bash
# メッセージ検索
slack search messages --query "リリース予定" --channel "pj-website-renewal" --from "2026-02-01" --to "2026-03-01"

# 出力:
# 🔍 検索結果: 「リリース予定」（8件）
# ┌──────────────────────────────────────────────────┐
# │ 1. 佐藤太郎 (2026-02-28 15:30)                   │
# │    #pj-website-renewal                            │
# │    「リリース予定日を3月15日に変更します」          │
# │                                                   │
# │ 2. 鈴木花子 (2026-02-25 10:15)                    │
# │    #pj-website-renewal                            │
# │    「リリース予定のスケジュール表を共有します」     │
# │                                                   │
# │ 3. 田中一郎 (2026-02-20 09:00)                    │
# │    #pj-website-renewal                            │
# │    「当初のリリース予定から2週間の遅延が発生」      │
# │                                                   │
# │ ... 残り5件                                        │
# └──────────────────────────────────────────────────┘
```

### 8. `slack analytics`

ワークスペースの利用状況分析を行います。

```bash
# チャンネル活動分析
slack analytics channel --period "2026-02" --top 10

# 出力:
# 📊 チャンネル活動分析（2026年2月）
# ┌────┬────────────────────┬────────┬────────┬──────────┐
# │ #  │ チャンネル          │ 投稿数 │ 反応数 │ アクティブ│
# ├────┼────────────────────┼────────┼────────┼──────────┤
# │  1 │ #general           │  1,247 │  3,891 │   138名  │
# │  2 │ #random            │    892 │  2,456 │   125名  │
# │  3 │ #pj-web-renewal    │    634 │  1,203 │    23名  │
# │  4 │ #team-engineering  │    521 │    987 │    18名  │
# │  5 │ #daily-report      │    440 │    220 │    22名  │
# │  6 │ #info-release      │    312 │    876 │    15名  │
# │  7 │ #approval          │    298 │    594 │    31名  │
# │  8 │ #team-sales        │    267 │    534 │    12名  │
# │  9 │ #team-marketing    │    234 │    468 │    10名  │
# │ 10 │ #tmp-event-march   │    189 │    567 │    45名  │
# └────┴────────────────────┴────────┴────────┴──────────┘
# 合計投稿数: 8,923 / 前月比: +12.3%
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Slack Japan Agent ワークフロー                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ユーザー入力                                                    │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │ コマンド解析 │───→│ 認証・権限確認 │───→│ APIエンドポイント │  │
│  └─────────────┘    └──────────────┘    │ 選択              │  │
│                           │              └────────┬──────────┘  │
│                           │ 権限不足              │              │
│                           ▼                       ▼              │
│                     ┌──────────┐          ┌──────────────┐      │
│                     │ エラー   │          │ リクエスト    │      │
│                     │ 通知     │          │ 構築・送信    │      │
│                     └──────────┘          └──────┬───────┘      │
│                                                  │               │
│                                    ┌─────────────┼──────────┐   │
│                                    │             │          │   │
│                                    ▼             ▼          ▼   │
│                              ┌──────────┐ ┌──────────┐ ┌─────┐ │
│                              │ 成功     │ │ レート   │ │失敗 │ │
│                              │ レスポンス│ │ リミット │ │     │ │
│                              └────┬─────┘ └────┬─────┘ └──┬──┘ │
│                                   │            │          │    │
│                                   ▼            ▼          ▼    │
│                              ┌──────────┐ ┌──────────┐ ┌────┐ │
│                              │ 結果整形 │ │ リトライ │ │復旧│ │
│                              │ ・表示   │ │ (待機)   │ │案内│ │
│                              └────┬─────┘ └──────────┘ └────┘ │
│                                   │                             │
│                                   ▼                             │
│                              ┌──────────┐                      │
│                              │ ログ記録 │                      │
│                              └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### 1. Bot Token無効エラー

```
❌ エラー: Slack Bot Tokenが無効です
┌──────────────────────────────────────────────────┐
│ エラーコード: SLACK_AUTH_ERROR                     │
│ 原因: SLACK_BOT_TOKENの値が無効または期限切れです  │
│                                                   │
│ 対処方法:                                         │
│  1. Slack App管理画面にアクセスしてください         │
│     https://api.slack.com/apps                    │
│  2. 該当アプリを選択                               │
│  3. OAuth & Permissions > Bot User OAuth Token    │
│  4. トークンを再生成し環境変数を更新               │
│                                                   │
│  export SLACK_BOT_TOKEN="xoxb-新しいトークン"      │
└──────────────────────────────────────────────────┘
```

### 2. チャンネル未発見エラー

```
❌ エラー: チャンネルが見つかりません
┌──────────────────────────────────────────────────┐
│ エラーコード: CHANNEL_NOT_FOUND                    │
│ 対象: #nonexistent-channel                        │
│                                                   │
│ 対処方法:                                         │
│  1. チャンネル名のスペルを確認してください          │
│  2. プライベートチャンネルの場合、Botが招待         │
│     されているか確認してください                    │
│  3. 「slack channel list」で一覧を確認できます     │
└──────────────────────────────────────────────────┘
```

### 3. レートリミット超過エラー

```
❌ エラー: APIレートリミットに到達しました
┌──────────────────────────────────────────────────┐
│ エラーコード: RATE_LIMITED                         │
│ リトライ可能時間: 30秒後                           │
│                                                   │
│ 対処方法:                                         │
│  ・自動リトライを実行中です（30秒待機）             │
│  ・頻繁に発生する場合はリクエスト間隔を              │
│    調整してください                                 │
│  ・バルク操作はslack batch コマンドの使用を          │
│    推奨します                                      │
└──────────────────────────────────────────────────┘
```

### 4. 権限不足エラー

```
❌ エラー: 操作に必要な権限がありません
┌──────────────────────────────────────────────────┐
│ エラーコード: MISSING_SCOPE                        │
│ 必要なスコープ: channels:manage                    │
│ 現在のスコープ: channels:read, chat:write          │
│                                                   │
│ 対処方法:                                         │
│  1. Slack App管理画面 > OAuth & Permissions       │
│  2. Bot Token Scopesに channels:manage を追加     │
│  3. ワークスペースにアプリを再インストール          │
└──────────────────────────────────────────────────┘
```

### 5. Socket Mode接続エラー

```
❌ エラー: Socket Mode接続に失敗しました
┌──────────────────────────────────────────────────┐
│ エラーコード: SOCKET_CONNECTION_FAILED             │
│ リトライ回数: 3/5                                  │
│                                                   │
│ 対処方法:                                         │
│  1. SLACK_APP_TOKENが正しいか確認してください       │
│  2. Socket Modeが有効になっているか確認             │
│     Slack App管理画面 > Socket Mode > Enable       │
│  3. ネットワーク接続を確認してください               │
│  4. ファイアウォールがWSS接続をブロック             │
│     していないか確認してください                     │
└──────────────────────────────────────────────────┘
```

---

## FAQ

**Q1: Slack Appの作成方法を教えてください**
A1: https://api.slack.com/apps にアクセスし「Create New App」から「From scratch」を選択してください。App名とワークスペースを指定した後、Bot Token Scopesで必要な権限（channels:read, chat:write, users:read, reactions:write, channels:manage, files:read）を設定し、ワークスペースにインストールしてください。

**Q2: 日報テンプレートをカスタマイズできますか？**
A2: はい。`slack daily-report template edit` コマンドでテンプレートを編集できます。デフォルトの4セクション（業務内容/進捗/明日の予定/課題）に加え、独自セクションの追加やセクション名の変更が可能です。

**Q3: 承認フローの段階数を変更できますか？**
A3: はい。`slack approve config --steps 3` のように段階数を1～5の範囲で設定できます。各段階の承認者はロールベースまたは個人指定が可能です。

**Q4: 複数ワークスペースに対応していますか？**
A4: 現在は単一ワークスペースのみ対応しています。複数ワークスペースを管理する場合は、環境変数をワークスペースごとに切り替えるか、プロファイル機能（`slack profile switch`）を使用してください。

**Q5: メッセージの予約投稿はできますか？**
A5: はい。`slack message send --schedule "2026-03-05 09:00"` のように `--schedule` オプションで投稿日時を指定できます。Slack Web APIの`chat.scheduleMessage`を使用しており、最大120日先まで予約可能です。

**Q6: 日本語以外の言語にも対応していますか？**
A6: テンプレートは日本語がデフォルトですが、`--lang en` オプションで英語テンプレートも利用可能です。多言語対応の組織向けに、チャンネルごとの言語設定機能も提供しています。

**Q7: 既存のSlack Botと競合しますか？**
A7: 競合しません。本スキルは独立したSlack Appとして動作し、他のBotとは別のトークンで認証されます。ただし、同じチャンネルで複数Botが同種のワークフローを実行する場合は、重複通知が発生する可能性があるため設定の調整をお勧めします。

**Q8: APIの利用料金はかかりますか？**
A8: Slack Web API自体は無料で利用できます。ただし、Slack側のプラン（Free/Pro/Business+/Enterprise Grid）によって利用可能な機能やメッセージ履歴の保持期間が異なります。本スキルの全機能を利用するにはProプラン以上を推奨します。

**Q9: 日報の未提出者への自動リマインドを設定できますか？**
A9: はい。`slack daily-report config --auto-remind 18:00` で指定時刻に未提出者へ自動的にDMリマインダーを送信します。リマインド回数の上限（デフォルト2回）も設定可能です。

**Q10: 監査ログはどこに保存されますか？**
A10: `~/.slack-japan-agent/logs/audit.log` に保存されます。ログローテーションは7日間保持がデフォルトで、`slack config --log-retention 30` で保持期間を変更できます。

**Q11: Webhookによる外部連携は可能ですか？**
A11: はい。`slack webhook create --url` コマンドでIncoming Webhookを設定できます。外部システム（Jira、GitHub、CI/CDパイプライン等）からの通知をSlackチャンネルに転送する設定をサポートしています。

---

## Data Storage

```
~/.slack-japan-agent/
├── config/
│   ├── workspace.json          # ワークスペース設定
│   ├── channels.json           # チャンネル設定キャッシュ
│   ├── templates/
│   │   ├── daily-report.json   # 日報テンプレート
│   │   ├── announcement.json   # お知らせテンプレート
│   │   ├── onboarding.json     # オンボーディングテンプレート
│   │   └── meeting.json        # 会議通知テンプレート
│   └── approval-flows/
│       ├── expense.json        # 経費精算フロー
│       ├── leave.json          # 休暇申請フロー
│       └── purchase.json       # 購買申請フロー
├── data/
│   ├── daily-reports/
│   │   └── 2026-03/
│   │       ├── 2026-03-01.json # 日次日報データ
│   │       └── summary.json    # 月次集計
│   ├── approvals/
│   │   ├── pending/            # 承認待ち申請
│   │   ├── approved/           # 承認済み申請
│   │   └── rejected/           # 却下申請
│   └── analytics/
│       └── 2026-03-report.json # 月次分析レポート
├── logs/
│   ├── audit.log               # 監査ログ
│   ├── api-calls.log           # API呼び出しログ
│   └── errors.log              # エラーログ
└── cache/
    ├── users.json              # ユーザー情報キャッシュ
    └── channels.json           # チャンネル情報キャッシュ
```

---

## Comparison vs Competitors

| 機能 | Slack Japan Agent | Chatwork | LINE WORKS | Microsoft Teams |
|------|------------------|----------|------------|-----------------|
| Claude Code統合 | 自然言語操作、コンテキスト理解 | 非対応 | 非対応 | Copilot（英語中心） |
| 日本語テンプレート | 敬語/カジュアル切替、業種別テンプレート | 基本テンプレートのみ | テンプレート機能なし | 英語中心テンプレート |
| 日報収集・集計 | 自動収集、未提出リマインド、集計レポート | グループチャット手動運用 | フォーム機能で代替 | Formsで代替（手動設定） |
| 承認フロー | 多段階承認、自動通知、履歴管理 | 非対応（外部連携必要） | 承認機能あり（基本的） | Power Automate連携必要 |
| 会議リマインダー | 多段階通知、繰り返し、カレンダー連携 | タスク機能で代替 | カレンダー連携あり | Outlook連携（強力） |
| ワークフロー自動化 | コマンドベース、条件分岐、自動実行 | 非対応 | Bot連携（限定的） | Power Automate（高機能） |
| API拡張性 | Slack Web API全機能アクセス | API限定的 | API提供あり | Graph API（広範） |
| 導入コスト | Slackプラン + Claude API | 月額700円/ユーザー～ | 月額450円/ユーザー～ | Microsoft 365に含まれる |
| 分析・レポート | チャンネル活動分析、利用統計 | 基本統計のみ | 管理者統計あり | 管理センター統計 |
| 和暦・JST対応 | 完全対応（和暦表示、祝日考慮） | 日本語UI | 日本語UI | タイムゾーン設定 |

### Slack Japan Agentの優位性

1. **Claude Codeとの直接統合**: 自然言語でSlack操作を実行でき、コーディング作業とコミュニケーション管理をシームレスに切り替えられます
2. **日本企業文化への最適化**: 敬語テンプレート、稟議ベースの承認フロー、和暦対応など、日本のビジネス慣習を深く理解した設計です
3. **自動化の深度**: 単なるメッセージ送信にとどまらず、日報収集から集計、分析、リマインドまでの一連のワークフローを自動化します
4. **拡張性**: Slack Web APIの全機能にアクセスでき、カスタムワークフローの構築が容易です

---

## Advanced Configuration

### メッセージテンプレートのカスタマイズ

Slack Japan Agentは、日本のビジネスシーンで頻出するメッセージパターンを網羅したテンプレートシステムを搭載しています。テンプレートはJSON形式で管理され、変数展開、条件分岐、ループ処理をサポートしています。

**テンプレート変数の使い方:**

テンプレート内では `{{variable_name}}` の形式で変数を埋め込むことができます。日時変数は自動的にJST（Asia/Tokyo）で展開されます。また、`{{#if condition}}...{{/if}}` による条件分岐や、`{{#each items}}...{{/each}}` によるループ処理も利用可能です。

**敬語レベルの設定:**

テンプレートごとに敬語レベルを設定できます。レベル1（カジュアル）からレベル5（最上級敬語）まで5段階が用意されており、社内向け通知にはレベル2～3、社外向けにはレベル4～5の使用を推奨しています。

### 承認フローの詳細設定

承認フローは柔軟なルーティング機能を備えており、金額による承認者の自動振り分けが可能です。例えば、10万円未満は課長承認のみ、10万円以上50万円未満は課長と部長の二段階承認、50万円以上は役員承認を追加する三段階承認といった設定ができます。

承認者が不在の場合の代理承認機能も搭載しています。Slackのステータス（外出中、休暇中等）と連動し、主承認者が応答できない場合は設定された代理承認者に自動的にエスカレーションされます。エスカレーションの待機時間（デフォルト: 4時間）はカスタマイズ可能です。

### 日報分析のAI活用

日報データはClaude Codeの自然言語処理能力を活用した分析が可能です。週次・月次の日報集計に加えて、以下の高度な分析機能を提供しています。

- **キーワード頻出分析**: チーム全体の日報からプロジェクト名、技術用語、課題キーワードの出現頻度を集計し、チームの関心事や課題の傾向を可視化します
- **感情分析**: 日報の文面からチームメンバーのモチベーション傾向を推定し、マネージャーに早期アラートを提供します
- **進捗トレンド**: プロジェクトごとの進捗率推移をグラフ化し、遅延リスクのあるプロジェクトを自動検出します
- **ワークロード分析**: メンバーごとの業務量の偏りを可視化し、タスク再配分の提案を行います

### Slack Connect対応

社外パートナーとのSlack Connectチャンネルにも対応しています。外部組織とのチャンネルでは自動的に敬語レベルが上がり、機密情報の送信時には確認ダイアログを表示します。また、外部チャンネルへのBot投稿は管理者承認が必要な設定も可能です。

### セキュリティとコンプライアンス

すべてのBot操作は監査ログとして記録され、情報セキュリティ管理者への月次レポート自動送信に対応しています。ISMS（ISO 27001）やPマーク（JIS Q 15001）の要件に沿った操作ログ管理が可能で、特定のキーワード（個人情報、機密等）を含むメッセージの送信時には自動的にフラグが立ち、セキュリティ担当者に通知されます。

DLP（Data Loss Prevention）機能として、マイナンバー、クレジットカード番号、電話番号などのパターンを自動検出し、これらの情報がSlack上に平文で送信されることを防止します。検出パターンはカスタマイズ可能で、企業固有の機密情報パターンを追加登録できます。

### バッチ処理と定期実行

Slack Japan Agentはバッチ処理モードを搭載しており、大量のメッセージ送信やチャンネル操作を一括で実行できます。CSVファイルから宛先リストを読み込み、テンプレート変数を差し替えながら個別メッセージを送信するメールマージ機能が利用可能です。

cronジョブやlaunchdと組み合わせることで、以下のような定期タスクを自動実行できます。毎朝9時の全チャンネルへのおはようメッセージ配信、毎日17時30分の日報提出リマインダー、毎週月曜日の週次定例会議アジェンダ投稿、毎月月末の月次レポート自動集計と配信、四半期ごとのチャンネル棚卸し通知（3ヶ月間投稿がないチャンネルのアーカイブ提案）などです。

バッチ処理では、Slack APIのレートリミットを自動的に管理し、Tier制限を超えないようリクエスト間隔を自動調整します。大量送信時はプログレスバーを表示し、処理状況をリアルタイムで確認できます。処理結果のサマリーレポートは、成功件数、失敗件数、スキップ件数をCSV形式で出力します。

### 他システムとの統合

Slack Japan Agentは、他のClaude Codeスキルやビジネスツールとの統合により、より高度なワークフロー自動化を実現します。Google Calendar APIと連携することで会議リマインダーをカレンダーイベントと自動同期し、Google Sheetsと連携することで日報データをスプレッドシートに自動エクスポートできます。

Jira、GitHub、GitLabなどの開発ツールとのWebhook連携により、コードレビュー依頼やデプロイ通知、障害アラートなどをSlackチャンネルに自動投稿する設定が可能です。また、freee-agentやmoneyforward-agentとの連携により、経費精算の承認フローと会計システムの連動が実現します。

### Performance Optimization and Rate Limit Management

The Slack Japan Agent implements sophisticated rate limit management that goes beyond simple request throttling. The agent maintains a token bucket algorithm for each API tier, tracking consumed and available capacity in real time. When approaching tier limits, the agent automatically queues requests and processes them in optimal batches, ensuring maximum throughput without triggering rate limit errors.

For large workspace operations such as bulk channel creation, mass user invitation, or company-wide announcement distribution, the agent pre-calculates the required API calls and provides an estimated completion time before execution begins. Progress is reported incrementally, and partial failures are handled gracefully with automatic retry for transient errors and detailed failure reports for permanent errors.

The caching layer reduces unnecessary API calls by maintaining a local cache of frequently accessed data including user profiles, channel metadata, and workspace configuration. Cache invalidation follows a configurable TTL strategy with default values optimized for typical Japanese enterprise usage patterns. Channel data is cached for 5 minutes, user data for 15 minutes, and workspace configuration for 1 hour.

Memory usage is optimized for long-running operations through streaming processing of large datasets. When analyzing channel history or generating reports spanning months of data, the agent processes messages in configurable page sizes rather than loading entire histories into memory. This approach allows the agent to handle workspaces with millions of messages without exceeding system resource limits.

---

## License

MIT License - hanabi-jpn
