# :shield: Security & DevOps Pack -- セキュリティ・インフラパック

> **Mac環境・リポジトリ・認証情報の三位一体セキュリティ。Claude Codeを安全に運用するための防衛スイート。**

[![Skills](https://img.shields.io/badge/skills-3-blue)](.) [![License](https://img.shields.io/badge/license-MIT-green)](.) [![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)](.)

---

## What's Included

| # | Skill | Description | Key API |
|---|-------|-------------|---------|
| 1 | **mac-sentinel** | macOSセキュリティ強化 -- 事前検証・悪意ある設定検出・エンドポイント防御 | macOS Security Framework |
| 2 | **repo-guardian** | リポジトリ事前スキャナー -- 悪意あるフック・MCP設定・クレデンシャル収集パターン検出 | Git / FS Inspection |
| 3 | **credential-vault** | 認証情報セキュア管理 -- 暗号化保管・自動ローテーション・漏洩検出・安全注入 | macOS Keychain / AES-256 |

---

## Who Is This For?

**エンジニア・IT管理者・CISO** のためのセキュリティ基盤パッケージです。

- Claude Codeを業務利用する際のセキュリティリスクを最小化したい **開発者**
- 外部リポジトリのクローン前に安全性を検証したい **DevOpsエンジニア**
- APIキーやシークレットの管理を暗号化・自動化したい **SRE / インフラ担当**
- macOSの社用PCをセキュリティポリシーに準拠させたい **IT管理者**
- プロンプトインジェクションや悪意あるMCP設定から組織を守りたい **CISO**
- ClawHavoc以降の脅威環境でClaude Codeスキルを安全に運用したい **全ユーザー**

---

## Quick Start

```bash
# パッケージごとインストール
npx clawhub@latest install hanabi-jpn/security-devops-pack

# 個別スキルのインストール
npx clawhub@latest install hanabi-jpn/mac-sentinel
npx clawhub@latest install hanabi-jpn/repo-guardian

# 同期して最新版に更新
npx clawhub@latest sync
```

インストール直後からmac-sentinelがmacOS環境のセキュリティ診断を開始します。追加設定は不要です。

---

## Package Architecture

```
                  SECURITY & DEVOPS PACK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          |
          ┌───────────────┼───────────────┐
          |               |               |
     ┌────┴─────┐   ┌────┴─────┐   ┌─────┴──────┐
     | Endpoint |   | Code     |   | Secrets    |
     | Defense  |   | Supply   |   | Management |
     | Layer    |   | Chain    |   | Layer      |
     └────┬─────┘   └────┬─────┘   └─────┬──────┘
          |               |               |
     mac-sentinel    repo-guardian   credential-vault
          |               |               |
     ┌────┴─────┐   ┌────┴─────┐   ┌─────┴──────┐
     | Gatekeeper|   | Git Hook |   | AES-256    |
     | FileVault |   | Scanner  |   | Encryption |
     | ClamAV    |   |          |   |            |
     | Firewall  |   | MCP Cfg  |   | Keychain   |
     | SIP Check |   | Validator|   | Integration|
     |           |   |          |   |            |
     | CVE       |   | Prompt   |   | Auto       |
     | Mitigation|   | Injection|   | Rotation   |
     |           |   | Detector |   |            |
     | Credential|   | Dep.     |   | Leak       |
     | Hygiene   |   | Confusion|   | Detection  |
     └────┬─────┘   └────┬─────┘   └─────┬──────┘
          |               |               |
          └───────────────┼───────────────┘
                          |
               ┌──────────┴──────────┐
               |  DEFENSE IN DEPTH   |
               |                     |
               |  Layer 1: Endpoint  |
               |   macOS hardening   |
               |                     |
               |  Layer 2: Supply    |
               |   repo inspection   |
               |                     |
               |  Layer 3: Secrets   |
               |   encrypted vault   |
               |                     |
               |  = Zero Trust for   |
               |    Claude Code      |
               └─────────────────────┘
```

**3スキルが多層防御（Defense in Depth）を構成。** mac-sentinelがエンドポイントを守り、repo-guardianがコードサプライチェーンを検証し、credential-vaultがシークレットを暗号化管理。Claude Code実行環境全体をゼロトラストモデルで保護します。

---

## Threat Coverage

| 脅威カテゴリ | 対応スキル | 具体的な防御機能 |
|------------|----------|----------------|
| 悪意あるGitフック | repo-guardian | pre-commit/post-checkout等のフック内容を事前検査 |
| プロンプトインジェクション | repo-guardian | .claude, .mcp.json内の悪意あるプロンプトを検出 |
| MCP設定改ざん | repo-guardian | MCPサーバー設定の妥当性検証・不正エンドポイント検出 |
| 依存関係攻撃 | repo-guardian | package.json等のtyposquatting・dependency confusion検出 |
| APIキー漏洩 | credential-vault | 暗号化保管・Git diff内のシークレットスキャン |
| クレデンシャル失効 | credential-vault | 有効期限追跡・自動ローテーションリマインダー |
| macOS脆弱性 | mac-sentinel | Gatekeeper/SIP/FileVault状態確認・CVE軽減策 |
| マルウェア | mac-sentinel | ClamAV連携・不審プロセス検出 |
| 設定ドリフト | mac-sentinel | ファイアウォール・暗号化設定の定期監査 |

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 全3スキル利用可能（MIT License） |
| **Pro Support** | $19/月 | 優先サポート + セキュリティ監査テンプレート + インシデント対応ガイド |
| **Enterprise** | 要相談 | SOC2対応支援 + カスタムポリシー + 組織展開サポート + SLA保証 |

---

## Comparison with Alternatives

| 観点 | Security Pack | Snyk | GitGuardian | 手動管理 |
|------|-------------|------|-------------|---------|
| Claude Code特化 | **専用設計** | 汎用 | 汎用 | -- |
| MCP設定検証 | **対応** | 非対応 | 非対応 | 手動レビュー |
| Gitフック検査 | **事前スキャン** | 非対応 | 非対応 | 手動確認 |
| プロンプトインジェクション | **検出対応** | 非対応 | 非対応 | 不可 |
| シークレット管理 | **暗号化Vault** | 部分対応 | **検出特化** | .env手動 |
| macOSハードニング | **包括診断** | 非対応 | 非対応 | 手動 |
| 漏洩検出 | **リアルタイム** | リポジトリ内 | **リアルタイム** | 事後発見 |
| 自動ローテーション | **リマインダー** | 非対応 | 非対応 | 手動 |
| 月額コスト | **$0 (OSS)** | $25~ | $12~ | 人件費 |
| CLI操作 | **完全対応** | CLI/Web | Web UI | -- |
| 日本語対応 | **ネイティブ** | 英語 | 英語 | -- |

---

<p align="center">
  <b>Built by hanabi-jpn</b><br>
  <i>Claude Codeをセキュアに運用するための防衛線</i>
</p>
