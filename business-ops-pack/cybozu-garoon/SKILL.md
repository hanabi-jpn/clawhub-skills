---
name: "Cybozu Garoon Agent"
description: "サイボウズGaroonグループウェア管理エージェント — スケジュール・ワークフロー・施設予約をAIで統合管理"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - garoon
  - cybozu
  - groupware
  - japan
  - workflow
---

# Cybozu Garoon Agent

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║       ┌─────────────────────────────────────────┐            ║
║       │   C Y B O Z U   G A R O O N            │            ║
║       │   A G E N T   v1.0                      │            ║
║       └─────────────────────────────────────────┘            ║
║                                                              ║
║    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              ║
║    │Schedule│ │Facility│ │Workflow│ │Bulletin│              ║
║    │  予定  │ │ 施設   │ │ 申請   │ │ 掲示板 │              ║
║    └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘              ║
║        └─────┬────┴─────┬────┴─────┬────┘                    ║
║              ▼          ▼          ▼                          ║
║        ┌────────────────────────────────┐                    ║
║        │     Garoon REST API + SOAP     │                    ║
║        │     Unified Gateway            │                    ║
║        └────────────────────────────────┘                    ║
║                                                              ║
║    ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐                  ║
║    │ File │ │Addr  │ │ Report │ │ Notify │                  ║
║    │管理  │ │帳    │ │レポート│ │ 通知   │                  ║
║    └──────┘ └──────┘ └────────┘ └────────┘                  ║
║                                                              ║
║   CYBOZU GAROON --- AI GROUPWARE MANAGEMENT                  ║
║   ─── 日本企業6,900社導入のグループウェアをAI制御 ───        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/clawhub-skills)
[![Garoon](https://img.shields.io/badge/Garoon-REST_API-00a1e9)](https://developer.cybozu.io/)
[![Cybozu](https://img.shields.io/badge/Cybozu-Certified-003f8e)](https://cybozu.co.jp/)
[![Japan](https://img.shields.io/badge/Japan-Enterprise-ff0000)](https://github.com/hanabi-jpn/clawhub-skills)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/hanabi-jpn/clawhub-skills)

`claude-code` `garoon` `cybozu` `groupware` `japan`

> **サイボウズGaroon完全管理エージェント。日本企業6,900社以上が導入する大規模グループウェアをClaude Codeから直接操作。スケジュール管理、施設予約、ワークフロー(申請・承認)、掲示板、ファイル管理、アドレス帳、マルチレポートまで全機能をAIが統合管理する。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** garoon, cybozu, groupware, japan, workflow, schedule, enterprise

---

## Overview

Cybozu Garoon Agent は、サイボウズ社が提供する大規模向けグループウェア「Garoon」の統合管理エージェントです。Garoon は日本国内の大企業・官公庁を中心に6,900社以上で導入されており、スケジュール管理、施設予約、ワークフロー（申請・承認）、掲示板、ファイル管理、アドレス帳、マルチレポートなど、組織運営に必要な全機能を網羅しています。

本スキルは Garoon REST API（v1）および SOAP API を通じて、日常業務で発生するグループウェア操作を Claude Code 上で効率的に実行します。特にワークフロー申請の一括処理、会議室予約の空き検索、スケジュール調整（空き時間検索）など、手動では時間がかかる操作をAIが瞬時に処理します。

Garoon のクラウド版（cybozu.com）およびオンプレミス版の両方に対応しており、認証方式も API トークン、パスワード認証、OAuth2.0 をサポートします。

```
┌────────────────────────────────────────────────────────────────────┐
│                 CYBOZU GAROON AGENT ARCHITECTURE                   │
│                                                                    │
│  ┌────────────┐     ┌────────────────┐     ┌──────────────────┐   │
│  │ Claude Code │────▶│  Garoon Agent  │────▶│  Garoon Server   │   │
│  │ (User)      │◀────│  Controller    │◀────│  (Cloud/OnPrem)  │   │
│  └────────────┘     └───────┬────────┘     └────────┬─────────┘   │
│                              │                       │             │
│                    ┌─────────┼─────────┐             │             │
│                    ▼         ▼         ▼             ▼             │
│             ┌──────────┐┌────────┐┌────────┐  ┌────────────┐      │
│             │Schedule  ││Workflow││Facility│  │  Garoon    │      │
│             │Manager   ││Engine  ││Booking │  │  Database  │      │
│             └────┬─────┘└───┬────┘└───┬────┘  └────────────┘      │
│                  │          │         │                             │
│         ┌────────┼──────────┼─────────┤                            │
│         ▼        ▼          ▼         ▼                            │
│  ┌──────────┐┌────────┐┌────────┐┌─────────┐                      │
│  │Bulletin  ││ File   ││Address ││ Report  │                      │
│  │Board     ││Manager ││Book    ││ Engine  │                      │
│  └────┬─────┘└───┬────┘└───┬────┘└────┬────┘                      │
│       │          │         │          │                            │
│       └──────────┴─────────┴──────────┘                            │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Notification & Alert Hub    │                           │
│        │   Slack/Teams/Webhook連携     │                           │
│        └──────────────┬────────────────┘                           │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Local Cache & Sync Store    │                           │
│        │   .garoon-agent/              │                           │
│        └───────────────────────────────┘                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

You are an agent equipped with **Cybozu Garoon Agent** for enterprise groupware management. Follow these rules precisely when the user invokes Garoon commands.

### Behavioral Guidelines

1. **Authenticate with the appropriate method.** Support three authentication modes: (a) API Token via `GAROON_API_TOKEN`, (b) Password authentication via `GAROON_USERNAME` and `GAROON_PASSWORD`, (c) OAuth2.0 session. Prioritize API Token if available. If no credentials are set, guide the user to the Garoon cybozu.com 管理画面 > API Token 設定.

2. **Respond in Japanese by default.** All schedule titles, workflow names, facility names, and output messages must be in Japanese. Preserve original language for user-entered data that may contain English or other languages.

3. **Respect organizational hierarchy.** Garoon operates with Organization (組織) and User (ユーザー) structures. Always scope operations to the user's visible organizations unless explicitly overridden with admin privileges.

4. **Handle timezone correctly.** All datetime values in Garoon are stored in UTC. Convert to JST (Asia/Tokyo, UTC+9) for display. Accept both JST and UTC input, converting automatically. Display format: `YYYY-MM-DD HH:MM (JST)`.

5. **Use REST API preferentially.** Garoon provides both REST API and SOAP API. Use REST API for all supported endpoints (schedule, workflow, notification). Fall back to SOAP API only for features not yet available in REST (file management, address book in some versions).

6. **Cache organization and user data.** Organization tree and user lists change infrequently. Cache with a 24-hour TTL. Schedule and workflow data are always fetched live.

7. **Log all write operations.** Every schedule creation, workflow approval, facility booking, and bulletin post must be logged to `.garoon-agent/logs/operations.jsonl` with timestamp, actor, operation type, and target ID.

8. **Handle workflow approval chains carefully.** Before approving or rejecting a workflow request, display the full approval chain (申請者 > 承認者1 > 承認者2 > ... > 決裁者) with current status at each step. Confirm the user's action before executing.

9. **Check facility availability before booking.** Always run a conflict check before creating a facility reservation. If a conflict is found, suggest the nearest available time slot and alternative facilities.

10. **Respect Garoon access control.** Do not attempt to access or modify data that the authenticated user does not have permission for. When a 403 error occurs, explain which permission is needed and how to request it from the system administrator.

11. **Support recurring events.** For schedule creation, support daily, weekly, monthly, and yearly recurrence patterns. Display the recurrence summary clearly (e.g., "毎週月曜 10:00-11:00, 2026-03-01から12回").

12. **Batch operations with safety limits.** When processing bulk workflow approvals or schedule changes, limit to 20 items per batch. Display a summary before executing and require explicit confirmation.

13. **Integrate notification context.** When creating schedules or updating workflows, automatically determine whether Garoon notifications should be sent to affected parties. Default to sending notifications unless the user specifies `--silent`.

14. **Handle large organizations efficiently.** Garoon deployments can have 10,000+ users. Use pagination (limit=100) for user and organization queries. Implement incremental search for user name lookups.

15. **Preserve workflow form data integrity.** Workflow forms contain structured data (日付、金額、テキスト、ドロップダウン). When creating or updating workflow requests, validate each field against the form definition before submission.

16. **Support Garoon Space integration.** Detect if Garoon Space (スペース) is enabled and support discussion thread creation and commenting within spaces.

17. **Monitor system notifications proactively.** When running `garoon notify`, also check for unread workflow requests pending the user's approval and overdue schedule reminders.

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GAROON_SUBDOMAIN` | Yes | Garoonのサブドメイン（cybozu.com版）またはオンプレミスURL | `mycompany` (cybozu.com) or `garoon.mycompany.co.jp` |
| `GAROON_USERNAME` | Cond. | ログインユーザー名（パスワード認証時） | `taro.yamada` |
| `GAROON_PASSWORD` | Cond. | ログインパスワード（パスワード認証時） | `(管理画面で設定したパスワード)` |
| `GAROON_API_TOKEN` | Cond. | APIトークン（トークン認証時、推奨） | `grt_AbCdEf1234567890` |
| `GAROON_AUTH_MODE` | No | 認証方式 (token/password/oauth、デフォルト: auto) | `token` |
| `GAROON_VERSION` | No | Garoonバージョン（自動検出、オンプレミス時指定推奨） | `6.0` |
| `GAROON_TIMEZONE` | No | 表示タイムゾーン（デフォルト: Asia/Tokyo） | `Asia/Tokyo` |
| `GAROON_NOTIFY_WEBHOOK` | No | 通知転送先Webhook URL | `https://hooks.slack.com/services/T00/B00/abcdef` |
| `GAROON_CACHE_TTL` | No | キャッシュTTL秒（デフォルト: 86400） | `43200` |
| `GAROON_LOG_LEVEL` | No | ログレベル (debug/info/warn/error) | `info` |

**認証の優先順位:** `GAROON_API_TOKEN` が設定されている場合はトークン認証。未設定の場合は `GAROON_USERNAME` + `GAROON_PASSWORD` でパスワード認証。`GAROON_AUTH_MODE=oauth` が指定されている場合はOAuth2.0フローを開始。

---

## Commands

### `garoon schedule`

スケジュールの取得、作成、更新、削除、空き時間検索を行います。

```
$ garoon schedule list --date 2026-03-03 --user me

╔═══════════════════════════════════════════════════════════════╗
║              スケジュール — 2026年3月3日（火）                  ║
║              ユーザー: 山田 太郎                               ║
╠═══════════════════════════════════════════════════════════════╣
║ 時間            │ 予定名                     │ 場所          ║
║─────────────────┼───────────────────────────┼─────────────  ║
║ 09:00 - 09:30  │ 朝礼                       │ 本社3F大会議室 ║
║ 10:00 - 11:00  │ 営業戦略会議                │ Zoom連携      ║
║ 11:30 - 12:00  │ 新商品企画レビュー          │ 本社5F-A      ║
║ 13:00 - 14:30  │ クライアントA 定例MTG       │ 訪問先        ║
║ 15:00 - 15:30  │ 週次1on1（上長）            │ 本社3F小会議室 ║
║ 16:00 - 17:00  │ 開発チーム進捗確認          │ Teams連携     ║
║ 17:30 - 18:00  │ 日報作成                    │ デスク        ║
╠═══════════════════════════════════════════════════════════════╣
║ 予定数: 7件  │  空き時間: 09:30-10:00, 12:00-13:00,          ║
║               14:30-15:00, 15:30-16:00, 18:00以降            ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ garoon schedule create --title "Q2キックオフ会議" --date 2026-04-01 --start 10:00 --end 12:00 --attendees "営業部全員" --facility "本社7F大ホール" --notes "Q2目標発表、各チームプレゼン"

✓ スケジュールを作成しました
  予定ID:      SCH-2026040100123
  タイトル:    Q2キックオフ会議
  日時:        2026-04-01 10:00 - 12:00 (JST)
  参加者:      営業部全員 (42名)
  施設:        本社7F大ホール ✓ 空き確認済み
  メモ:        Q2目標発表、各チームプレゼン
  通知:        参加者全員に予定通知を送信しました
```

### `garoon facility`

施設（会議室・備品）の予約、空き検索、予約管理を行います。

```
$ garoon facility search --date 2026-03-05 --start 14:00 --end 15:30 --capacity 10

╔═══════════════════════════════════════════════════════════════╗
║    空き施設検索 — 2026-03-05 14:00-15:30 (10名以上)           ║
╠═══════════════════════════════════════════════════════════════╣
║ 施設名              │ 定員 │ 設備            │ 状態          ║
║─────────────────────┼─────┼────────────────┼─────────────  ║
║ 本社3F大会議室       │  20 │ PJ,WB,VC       │ ✓ 空き        ║
║ 本社5F-A会議室       │  12 │ PJ,WB          │ ✓ 空き        ║
║ 本社5F-B会議室       │  12 │ PJ,WB,VC       │ x 予約済み    ║
║ 本社7F大ホール       │  80 │ PJ,音響,VC     │ ✓ 空き        ║
║ 別館2F会議室         │  15 │ PJ,WB          │ ✓ 空き        ║
╠═══════════════════════════════════════════════════════════════╣
║ PJ=プロジェクター WB=ホワイトボード VC=ビデオ会議             ║
║ 推奨: 本社5F-A会議室（定員12名、空き、設備十分）             ║
╚═══════════════════════════════════════════════════════════════╝
```

### `garoon workflow`

ワークフロー申請の作成、承認、差戻し、一覧確認を行います。

```
$ garoon workflow pending --user me

╔═══════════════════════════════════════════════════════════════╗
║              承認待ちワークフロー一覧                          ║
║              ユーザー: 山田 太郎（承認者として）               ║
╠═══════════════════════════════════════════════════════════════╣
║ 申請ID   │ 種別         │ 申請者     │ 金額      │ 提出日    ║
║──────────┼─────────────┼───────────┼──────────┼─────────  ║
║ WF-4521  │ 経費精算      │ 佐藤 花子 │ ¥34,800  │ 02-28     ║
║ WF-4518  │ 出張申請      │ 田中 一郎 │ ¥128,000 │ 02-27     ║
║ WF-4515  │ 備品購入      │ 高橋 健太 │ ¥15,400  │ 02-27     ║
║ WF-4510  │ 休暇申請      │ 伊藤 直美 │ ---      │ 02-26     ║
║ WF-4508  │ 稟議(契約)    │ 鈴木 美咲 │ ¥480,000 │ 02-25     ║
╠═══════════════════════════════════════════════════════════════╣
║ 承認待ち: 5件  │  最古: 4日前 (WF-4508)                       ║
║ ⚠ WF-4508 は提出から4日経過。早期対応を推奨します            ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ garoon workflow approve WF-4521 --comment "確認しました。問題ありません。"

✓ ワークフローを承認しました
  申請ID:    WF-4521
  種別:      経費精算
  申請者:    佐藤 花子
  金額:      ¥34,800
  承認ステップ:
    [✓] 佐藤 花子（申請者）
    [✓] 山田 太郎（課長承認）← 今ここ
    [ ] 中村 部長（部長承認）
    [ ] 経理部（最終決裁）
  コメント:  確認しました。問題ありません。
  次の承認者に通知しました: 中村 部長
```

### `garoon bulletin`

掲示板の投稿、閲覧、コメントを行います。

```
$ garoon bulletin post --category "全社連絡" --title "3月度全社会議の開催について" --body "下記の通り全社会議を開催します。\n日時: 2026-03-15 15:00-16:30\n場所: 本社7F大ホール + Zoom\n議題: Q1振り返り、Q2方針発表" --notify all

✓ 掲示板に投稿しました
  投稿ID:      BLT-2026030100045
  カテゴリ:    全社連絡
  タイトル:    3月度全社会議の開催について
  投稿者:      山田 太郎
  投稿日時:    2026-03-01 09:15 (JST)
  通知:        全社員 (386名) に通知を送信しました
  閲覧確認:    有効（`garoon bulletin views BLT-2026030100045` で確認可能）
```

### `garoon file`

ファイル管理（キャビネット）のアップロード、ダウンロード、検索を行います。

```
$ garoon file list --folder "営業部/2026年度/提案書"

╔═══════════════════════════════════════════════════════════════╗
║          ファイル管理 — 営業部/2026年度/提案書                  ║
╠═══════════════════════════════════════════════════════════════╣
║ ファイル名                    │ サイズ │ 更新者    │ 更新日   ║
║──────────────────────────────┼───────┼──────────┼─────────  ║
║ クライアントA_提案書_v3.pptx  │ 4.2MB │ 佐藤花子 │ 02-28    ║
║ クライアントB_見積書.xlsx     │ 856KB │ 田中一郎 │ 02-27    ║
║ テンプレート_提案書.pptx      │ 2.1MB │ 山田太郎 │ 02-15    ║
║ 競合分析_2026Q1.pdf           │ 1.8MB │ 高橋健太 │ 02-10    ║
╠═══════════════════════════════════════════════════════════════╣
║ ファイル数: 4  │  合計: 8.96MB                                ║
╚═══════════════════════════════════════════════════════════════╝
```

### `garoon address`

共有アドレス帳の検索、登録、更新を行います。

```
$ garoon address search --query "ABC商事"

╔═══════════════════════════════════════════════════════════════╗
║              アドレス帳検索結果: "ABC商事"                     ║
╠═══════════════════════════════════════════════════════════════╣
║ 氏名           │ 会社名      │ 部署      │ 電話            ║
║────────────────┼────────────┼──────────┼───────────────  ║
║ 松本 浩二      │ ABC商事     │ 営業部    │ 03-1234-5678   ║
║ 木村 真理子    │ ABC商事     │ 総務部    │ 03-1234-5679   ║
║ 渡辺 大輔      │ ABC商事     │ 開発部    │ 03-1234-5680   ║
╠═══════════════════════════════════════════════════════════════╣
║ 該当: 3件                                                     ║
╚═══════════════════════════════════════════════════════════════╝
```

### `garoon report`

マルチレポートの作成、閲覧、集計を行います。

```
$ garoon report summary --type "日報" --period 2026-02 --team "営業部"

╔═══════════════════════════════════════════════════════════════╗
║          日報集計レポート — 営業部 2026年2月                    ║
╠═══════════════════════════════════════════════════════════════╣
║ 提出状況:                                                     ║
║   提出率:     94.2% (営業日20日 × 12名 = 240件中226件提出)    ║
║   未提出:     14件 (3名が各4-5日未提出)                        ║
║                                                               ║
║ 活動集計:                                                     ║
║   訪問件数:   187件 (前月比 +12%)                              ║
║   商談件数:   89件  (前月比 +8%)                               ║
║   受注件数:   23件  (前月比 +15%)                              ║
║   受注金額:   ¥14,520,000 (前月比 +18%)                       ║
║                                                               ║
║ 個人別実績TOP3:                                               ║
║   1. 佐藤 花子  ¥4,200,000 (7件受注)                         ║
║   2. 田中 一郎  ¥3,800,000 (6件受注)                         ║
║   3. 高橋 健太  ¥2,900,000 (4件受注)                         ║
╠═══════════════════════════════════════════════════════════════╣
║ AIインサイト:                                                 ║
║ - 訪問→商談の転換率47.6%は前月44.2%から改善                  ║
║ - 未提出が特定3名に集中。個別フォローを推奨                   ║
║ - 受注単価¥631,000は目標¥600,000を上回っており好調            ║
╚═══════════════════════════════════════════════════════════════╝
```

### `garoon notify`

通知の確認、設定、外部連携を行います。

```
$ garoon notify check

╔═══════════════════════════════════════════════════════════════╗
║              未読通知一覧 — 山田 太郎                          ║
╠═══════════════════════════════════════════════════════════════╣
║ 種別          │ 内容                              │ 日時     ║
║───────────────┼──────────────────────────────────┼─────────  ║
║ [WF] 承認依頼 │ 経費精算: 鈴木美咲 ¥22,400       │ 10分前   ║
║ [SC] 予定変更 │ 営業戦略会議 14:00→15:00に変更   │ 30分前   ║
║ [BL] 新着投稿 │ 全社連絡: 年度末棚卸しのお願い    │ 1時間前  ║
║ [FL] ファイル │ クライアントA提案書v4.pptx 更新   │ 2時間前  ║
║ [SC] 予定招待 │ 新年度方針説明会 4/1 10:00        │ 3時間前  ║
╠═══════════════════════════════════════════════════════════════╣
║ 未読: 5件  │  承認待ち: 1件（要対応）                         ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  GAROON AGENT WORKFLOW                           │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐                  │
│  │ユーザー   │───▶│コマンド   │───▶│認証       │                  │
│  │コマンド入力│    │パーサー   │    │チェック    │                  │
│  └──────────┘    └──────────┘    └─────┬─────┘                  │
│                                        │                        │
│                              ┌─────────▼─────────┐              │
│                              │ REST or SOAP 判定  │              │
│                              │ エンドポイント選択 │              │
│                              └─────────┬─────────┘              │
│                                        │                        │
│               ┌────────────────────────┼────────────┐           │
│               ▼            ▼           ▼            ▼           │
│         ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│         │Schedule  │ │Workflow  │ │Facility  │ │Bulletin  │   │
│         │Handler   │ │Handler   │ │Handler   │ │Handler   │   │
│         └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│              │            │            │            │           │
│              └────────────┼────────────┼────────────┘           │
│                           ▼            ▼                        │
│                    ┌────────────┐ ┌──────────────┐              │
│                    │権限チェック│ │競合チェック   │              │
│                    │ACL検証    │ │(施設・時間)   │              │
│                    └─────┬─────┘ └──────┬───────┘              │
│                          │              │                       │
│                          └──────┬───────┘                       │
│                                 ▼                               │
│                        ┌──────────────┐                         │
│                        │API実行       │                         │
│                        │Garoon Server │                         │
│                        └───────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │通知処理     │                         │
│                         │関係者通知   │                         │
│                         └──────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │ログ・キャッシュ│                      │
│                         │更新          │                         │
│                         └──────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │結果表示     │                         │
│                         └─────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### 1. 認証エラー (401 Authentication Failed)

```
[ERROR] Garoon認証エラー
  原因:  APIトークンが無効またはユーザー名/パスワードが誤っています
  確認:
    1. GAROON_API_TOKEN が正しく設定されているか確認
    2. cybozu.com管理画面 > APIトークン で有効期限を確認
    3. パスワード認証の場合、2段階認証が有効だとパスワード認証は使用不可
  対処:  garoon health で接続状態を確認してください
```

### 2. 権限不足エラー (403 Forbidden)

```
[ERROR] アクセス権限エラー
  操作:    garoon workflow approve WF-4508
  原因:    この申請の承認権限がありません
  承認経路: 申請者 → 課長 → [部長] → 経理部
  現在位置: 部長承認ステップ（あなたは課長承認済み）
  対処:    部長（中村部長）が承認するまでお待ちください
```

### 3. 施設予約競合エラー (409 Conflict)

```
[ERROR] 施設予約が競合しています
  施設:     本社3F大会議室
  希望時間: 2026-03-05 14:00 - 15:30
  競合:     「月次営業会議」14:00-16:00 (予約者: 中村部長)
  代替候補:
    1. 本社5F-A会議室 14:00-15:30 ✓ 空き (定員12名)
    2. 本社3F大会議室 16:00-17:30 ✓ 空き
    3. 別館2F会議室   14:00-15:30 ✓ 空き (定員15名)
  対処:  `garoon facility book --facility "本社5F-A" --date 2026-03-05 --start 14:00 --end 15:30`
```

### 4. ワークフロー入力バリデーションエラー (422)

```
[ERROR] ワークフロー申請バリデーションエラー
  フォーム:    経費精算
  エラー項目:
    - 日付: "2026-13-01" は無効な日付です (月は1-12)
    - 金額: 空欄です（必須項目）
    - 領収書添付: ¥10,000以上の場合は必須です
  対処:  各項目を修正して再申請してください
```

### 5. ネットワーク/サーバーエラー

```
[ERROR] Garoonサーバーに接続できません
  サブドメイン: mycompany.cybozu.com
  タイムアウト: 30秒
  確認:
    1. https://mycompany.cybozu.com にブラウザでアクセス可能か確認
    2. cybozu.com のステータスページ: https://status.cybozu.com/
    3. 社内VPN接続が必要な場合はVPN接続を確認
  リトライ: 5秒後に自動リトライします (1/3)
```

### 6. レート制限エラー (429)

```
[WARN] APIレートリミットに到達
  制限: 600リクエスト/10分
  現在: 598/600
  リセットまで: 3分42秒
  対処: 自動的にリセットを待機してからリトライします
```

### 7. SOAP APIフォールバックエラー

```
[WARN] REST APIで未対応のエンドポイントです
  操作:    garoon file upload
  REST:    未対応（Garoon REST API v1ではファイル管理APIは限定的）
  SOAP:    フォールバック実行中...
  状態:    SOAP API経由でファイルアップロードを実行しました ✓
```

---

## FAQ

**Q1: Garoonクラウド版とオンプレミス版の両方に対応していますか？**
A: はい。`GAROON_SUBDOMAIN` にcybozu.comのサブドメイン（例: `mycompany`）を設定するとクラウド版、フルURL（例: `garoon.mycompany.co.jp`）を設定するとオンプレミス版として接続します。オンプレミス版の場合は `GAROON_VERSION` を明示的に設定することを推奨します。

**Q2: APIトークンとパスワード認証はどちらが推奨ですか？**
A: APIトークン認証を強く推奨します。パスワード認証は2段階認証有効時に使用できず、パスワード変更時にも影響を受けます。APIトークンは管理画面から個別に発行・無効化でき、権限スコープも細かく制御できます。

**Q3: スケジュールの繰り返し予定にはどのパターンが対応していますか？**
A: 日次（毎日/平日のみ/指定曜日）、週次（毎週/隔週）、月次（毎月X日/毎月第X曜日）、年次（毎年X月X日）に対応しています。終了条件は回数指定または終了日指定が可能です。

**Q4: 大規模組織（1,000人以上）で使用する際の注意点は？**
A: ユーザー・組織データの取得にはページネーションが自動適用されます（100件/ページ）。組織ツリーは24時間キャッシュされるため、初回以降は高速に動作します。ワークフローの一括承認は20件ずつのバッチ処理で安全に実行されます。

**Q5: Garoon Space（スペース）には対応していますか？**
A: はい。スペースのディスカッション一覧取得、スレッド作成、コメント投稿に対応しています。`garoon space list` でスペース一覧、`garoon space post --space <id>` で投稿が可能です。

**Q6: kintoneとのデータ連携はできますか？**
A: Garoon Agent は Garoon のみを操作対象としています。kintone との連携が必要な場合は、別途 kintone-agent スキルと組み合わせて使用してください。ただし、Garoon のポートレットに表示される kintone アプリの情報は参照可能です。

**Q7: ワークフローの申請フォームはカスタムフォームに対応していますか？**
A: はい。Garoon のワークフロー機能で定義されたカスタム申請フォームのフィールド定義を自動取得し、各フィールドの型（テキスト、数値、日付、ドロップダウン等）に応じたバリデーションを実行します。

**Q8: 通知をSlackやTeamsに転送できますか？**
A: `GAROON_NOTIFY_WEBHOOK` にSlackの Incoming Webhook URL を設定すると、承認依頼や予定変更の通知を自動転送します。Microsoft Teams の Webhook にも対応しています。

**Q9: オフラインでの利用は可能ですか？**
A: キャッシュ済みのデータ（組織ツリー、ユーザーリスト）の参照は可能ですが、スケジュールやワークフローの操作はオンライン接続が必須です。オフライン時は操作キューに保存し、オンライン復帰時に自動実行する機能があります。

**Q10: 監査ログは取得できますか？**
A: Agent のローカルログ（`.garoon-agent/logs/operations.jsonl`）に全操作が記録されます。Garoon サーバー側の監査ログはシステム管理者権限で `garoon admin audit` コマンドから取得可能です。

**Q11: 複数ユーザーの代理操作は可能ですか？**
A: Garoon の代理設定が有効な場合、`--as <user>` オプションで代理操作が可能です。ただし、Garoon 管理画面で事前に代理権限を設定する必要があります。

**Q12: パフォーマンスの目安は？**
A: Garoon クラウド版では1リクエストあたり平均200-500msのレスポンスタイムです。ユーザー一覧（100件取得）で約300ms、スケジュール取得（1日分）で約200ms、ワークフロー承認で約400msが目安です。

---

## Data Storage

```
.garoon-agent/
├── config.json                  # 接続設定（サブドメイン、認証方式）
├── cache/
│   ├── organizations.json       # 組織ツリー (TTL: 24時間)
│   ├── users.json               # ユーザーリスト (TTL: 24時間)
│   ├── facilities.json          # 施設一覧 (TTL: 24時間)
│   ├── workflow-forms.json      # WF申請フォーム定義 (TTL: 12時間)
│   └── spaces.json              # スペース一覧 (TTL: 24時間)
├── schedules/
│   ├── my-schedule.json         # 自分のスケジュール (キャッシュなし)
│   └── team-schedule.json       # チームスケジュール (キャッシュなし)
├── workflows/
│   ├── pending.json             # 承認待ちリスト (キャッシュなし)
│   ├── my-requests.json         # 自分の申請リスト
│   └── templates/               # WF申請テンプレート
├── files/
│   └── downloads/               # ダウンロードファイル一時保存
├── reports/
│   ├── daily-summary.jsonl      # 日次サマリー
│   └── team-analytics.json      # チーム分析データ
├── logs/
│   ├── operations.jsonl         # 全操作ログ（書込み操作）
│   ├── api-calls.jsonl          # APIコールログ（直近7日）
│   └── errors.jsonl             # エラーログ
└── offline-queue/
    └── pending-operations.jsonl  # オフライン時の操作キュー
```

---

## Comparison Table

| 機能 | Garoon Agent | kintone | Google Workspace | Microsoft 365 | desknet's NEO |
|------|-------------|---------|-----------------|---------------|---------------|
| 運営元 | **サイボウズ** | サイボウズ | Google | Microsoft | ネオジャパン |
| 主要用途 | **グループウェア** | 業務アプリ | コラボレーション | コラボレーション | グループウェア |
| 導入企業数 | **6,900社以上** | 32,000社以上 | 非公開 | 非公開 | 5,500社以上 |
| スケジュール管理 | **標準搭載** | なし | Google Calendar | Outlook | 標準搭載 |
| 施設予約 | **標準搭載** | なし | Rooms | Room Finder | 標準搭載 |
| ワークフロー | **標準搭載(高機能)** | プロセス管理 | なし(要アドオン) | Power Automate | 標準搭載 |
| 掲示板 | **標準搭載** | なし | なし | SharePoint | 標準搭載 |
| ファイル管理 | **標準搭載** | 添付のみ | Drive | OneDrive | 標準搭載 |
| アドレス帳 | **共有対応** | なし | Contacts | Outlook | 共有対応 |
| マルチレポート | **標準搭載** | アプリで代替 | なし | なし | 一部対応 |
| 日本語対応 | **ネイティブ** | ネイティブ | 翻訳 | 翻訳 | ネイティブ |
| API | **REST + SOAP** | REST | REST | Graph API | REST(限定的) |
| 月額費用(1人) | **¥845~** | ¥780~ | ¥680~ | ¥650~ | ¥400~ |
| オンプレミス | **対応** | なし | なし | 対応 | 対応 |
| 大規模対応 | **数万人規模** | 数百人規模 | 無制限 | 無制限 | 数千人規模 |
| AI Agent対応 | **Garoon Agent** | kintone-agent | 複数あり | Copilot | なし |

---

## Garoon REST API Endpoint Reference

全エンドポイントは `https://{GAROON_SUBDOMAIN}.cybozu.com/g/api/v1/` をベースとします（クラウド版）。オンプレミス版は `https://{GAROON_SUBDOMAIN}/g/api/v1/`。

**Schedule:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/schedule/events` | 予定一覧取得（日付範囲指定） |
| GET | `/schedule/events/{id}` | 予定詳細取得 |
| POST | `/schedule/events` | 予定作成 |
| PATCH | `/schedule/events/{id}` | 予定更新 |
| DELETE | `/schedule/events/{id}` | 予定削除 |
| GET | `/schedule/facilities` | 施設一覧取得 |

**Workflow:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflow/admin/requests` | 申請一覧取得 |
| GET | `/workflow/admin/requests/{id}` | 申請詳細取得 |
| POST | `/workflow/admin/requests/{id}/approve` | 申請承認 |
| POST | `/workflow/admin/requests/{id}/reject` | 申請差戻し |

**Notification:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notification/items` | 通知一覧取得 |
| PATCH | `/notification/items/{id}/read` | 既読処理 |
