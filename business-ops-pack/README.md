# :gear: Business Ops Pack -- 業務効率化プロパック

> **日本企業が使う主要業務SaaS全13サービスをAIで統合。コミュニケーション・プロジェクト管理・人事労務を完全自動化。**

[![Skills](https://img.shields.io/badge/skills-13-blue)](.) [![License](https://img.shields.io/badge/license-MIT-green)](.) [![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)](.)

---

## What's Included

| # | Skill | Description | Key API |
|---|-------|-------------|---------|
| 1 | **line-agent** | LINE公式アカウント自動応答・CRM -- 96M+ユーザー | LINE Messaging API |
| 2 | **lark-workflow** | Lark/Feishu自動化 -- 承認フロー・Bot・文書管理 | Lark Open API |
| 3 | **notion-jp** | Notion日本語テンプレート -- 20+テンプレート・議事録自動生成 | Notion API |
| 4 | **google-workspace-agent** | Google Workspace管理 -- Gmail・Calendar・Drive・Meet統合 | Google Workspace API |
| 5 | **chatwork-agent** | Chatwork自動化 -- メッセージ・タスク・ファイル管理 | Chatwork API |
| 6 | **kintone-agent** | kintone業務アプリ管理 -- レコード操作・アプリ構築・集計 | kintone API |
| 7 | **smarthr-agent** | SmartHR人事労務 -- 入退社・年末調整・給与明細自動化 | SmartHR API |
| 8 | **backlog-agent** | Backlogプロジェクト管理 -- 課題・Wiki・Gitリポジトリ連携 | Backlog API |
| 9 | **kingof-time-agent** | KING OF TIME勤怠管理 -- 打刻・シフト・残業アラート | KING OF TIME API |
| 10 | **line-works-agent** | LINE WORKS業務コミュニケーション -- Bot・掲示板・カレンダー | LINE WORKS API |
| 11 | **jooto-agent** | Jootoタスク管理 -- カンバン・ガントチャート・進捗追跡 | Jooto API |
| 12 | **slack-japan-agent** | Slack日本語ワークフロー -- チャンネル管理・Bot・自動化 | Slack API |
| 13 | **cybozu-garoon** | サイボウズGaroon -- スケジュール・施設予約・ワークフロー | Garoon API |

---

## Who Is This For?

**総務・人事・プロマネ・COO** のための業務効率化パッケージです。

- 社内コミュニケーションツール(Slack/Chatwork/LINE WORKS)を統合管理したい **総務担当者**
- 入退社・勤怠・年末調整を自動化したい **人事労務担当者**
- Backlog/Jootoでプロジェクトを効率管理したい **プロジェクトマネージャー**
- kintone業務アプリの構築・運用を効率化したい **DX推進担当**
- Notion/Google Workspaceで社内ナレッジを整備したい **情報システム部門**
- LINE公式アカウントで顧客対応を自動化したい **カスタマーサクセス**
- KING OF TIMEの勤怠データを分析したい **管理部門**

---

## Quick Start

```bash
# パッケージごとインストール
npx clawhub@latest install hanabi-jpn/business-ops-pack

# 個別スキルのインストール
npx clawhub@latest install hanabi-jpn/kintone-agent
npx clawhub@latest install hanabi-jpn/slack-japan-agent

# 同期して最新版に更新
npx clawhub@latest sync
```

各SaaSのAPIトークンを環境変数に設定すれば、即座にクロスツール連携が開始できます。

---

## Package Architecture

```
                    BUSINESS OPS PACK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          |
     ┌────────────────────┼────────────────────┐
     |                    |                    |
┌────┴──────┐     ┌───────┴───────┐    ┌───────┴──────┐
| コミュニケーション |  | プロジェクト管理  |  | 人事・労務    |
| Communication |  | Project Mgmt  |  | HR & Admin  |
└────┬──────┘     └───────┬───────┘    └───────┬──────┘
     |                    |                    |
┌────┼─────┬────┐   ┌────┼────┐         ┌─────┼────┐
|    |     |    |   |    |    |         |     |    |
LINE Slack CW   LW Backlog Jooto    SmartHR  KOT Garoon
     |     |         |    |              |     |
     |   Lark      Notion kintone        |     |
     |                    |              |     |
└────┼─────┴────┘   └────┼────┘    └────┼─────┘
     |                    |              |
     └────────────┬───────┘              |
                  |                      |
     ┌────────────┴──────────────────────┘
     |
┌────┴─────────────────────────────────┐
| Google Workspace (Hub)                |
|                                       |
|  Gmail ──── Calendar ──── Drive       |
|    |           |            |         |
|  通知集約     予定統合     ファイル統合 |
└────┬─────────────────────────────────┘
     |
┌────┴─────────────────────────────────┐
|     Cross-Tool Automation Layer       |
|                                       |
|  Slack通知 → kintoneレコード作成       |
|  KING OF TIME打刻 → SmartHR勤怠連携    |
|  Backlog課題完了 → LINE WORKS通知       |
|  Notion議事録 → Chatworkタスク化        |
└───────────────────────────────────────┘
```

**13スキルがクロスツール連携で業務プロセスを完全自動化。** Slackでの会話からkintoneにレコード作成、Backlogの課題完了をLINE WORKSに通知、KING OF TIMEの打刻データをSmartHRに反映など、ツール間の手作業をゼロにします。

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 全13スキル利用可能（MIT License） |
| **Pro Support** | $39/月 | 優先サポート + ワークフロー設計テンプレート + 月次効率化レビュー |
| **Enterprise** | 要相談 | オンプレ対応 + カスタムワークフロー + 専任コンサルティング + SLA保証 |

---

## Comparison with Alternatives

| 観点 | Business Ops Pack | Zapier | IFTTT | 手動連携 |
|------|------------------|--------|-------|---------|
| 対応ツール数 | **13 日本SaaS** | 7000+ (海外中心) | 800+ (海外中心) | 各ツール個別 |
| 日本SaaS対応 | **kintone/CW/Backlog/KOT/SmartHR** | 限定的 | 非対応多数 | -- |
| LINE連携 | **公式アカウント+LINE WORKS** | 限定的 | 基本のみ | API開発必要 |
| AI搭載 | **Claude Code統合** | AI機能限定 | なし | なし |
| 議事録自動化 | **Notion JP 20+テンプレート** | 非対応 | 非対応 | 手動 |
| 勤怠分析 | **KING OF TIME連携** | 限定的 | 非対応 | CSV手動 |
| 人事労務 | **SmartHR API連携** | 非対応 | 非対応 | 手動 |
| 月額コスト | **$0 (OSS)** | $20-600/月 | $3-15/月 | 人件費 |
| CLI操作 | **完全対応** | Web UI | Web/App | -- |
| カスタマイズ | **無制限** | ワークフロー限定 | レシピ限定 | 開発必要 |

---

<p align="center">
  <b>Built by hanabi-jpn</b><br>
  <i>日本企業のバックオフィスをAIで変革する</i>
</p>
