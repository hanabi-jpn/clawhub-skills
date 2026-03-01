# Notion JP

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
