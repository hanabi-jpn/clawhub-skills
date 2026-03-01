# :chart_with_upwards_trend: Marketing & Growth Pack -- マーケティング・集客パック

> **SEO・広告・SNS・CRMまで集客を全方位カバー。日本市場に最適化されたAIマーケティングスイート。**

[![Skills](https://img.shields.io/badge/skills-8-blue)](.) [![License](https://img.shields.io/badge/license-MIT-green)](.) [![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)](.)

---

## What's Included

| # | Skill | Description | Key API |
|---|-------|-------------|---------|
| 1 | **jp-humanizer** | AI文章の日本語自然化 -- 500+パターン, 4モード | 独自エンジン |
| 2 | **jp-seo-writer** | 日本語SEO記事自動生成 -- 共起語分析・E-E-A-T対応 | Google NLP / 独自分析 |
| 3 | **google-ads-agent** | Google広告運用AI -- キャンペーン・入札・レポート自動化 | Google Ads API |
| 4 | **ga4-search-console** | GA4 + Search Console統合分析 -- PV・CV・検索順位一元管理 | GA4 Data API / SC API |
| 5 | **google-maps-biz** | Googleビジネスプロフィール管理 -- MEO対策・口コミ対応 | Google Business Profile API |
| 6 | **social-media-publisher** | SNS一括投稿 -- X/Instagram/Facebook/LINE公式 同時配信 | 各SNS API |
| 7 | **sansan-agent** | Sansan名刺管理連携 -- 名刺データ活用・リード管理 | Sansan API |
| 8 | **hubspot-japan** | HubSpot CRM日本語対応 -- リード育成・営業パイプライン | HubSpot API |

---

## Who Is This For?

**マーケター・広報・営業・CMO** のためのグロースハックパッケージです。

- SEO記事の量産と品質を両立させたい **コンテンツマーケター**
- Google広告のROASを最大化したい **リスティング広告担当**
- GA4とSearch Consoleのデータを統合分析したい **Webアナリスト**
- 複数SNSへの投稿を一括管理したい **SNS運用担当者**
- 名刺データをCRMに活かし営業効率を上げたい **営業マネージャー**
- MEO対策でローカル集客を強化したい **店舗ビジネスオーナー**
- AI生成コンテンツを自然な日本語に仕上げたい **全コンテンツ制作者**

---

## Quick Start

```bash
# パッケージごとインストール
npx clawhub@latest install hanabi-jpn/marketing-growth-pack

# 個別スキルのインストール
npx clawhub@latest install hanabi-jpn/jp-seo-writer
npx clawhub@latest install hanabi-jpn/google-ads-agent

# 同期して最新版に更新
npx clawhub@latest sync
```

Google APIの認証情報を設定すれば、検索順位チェックから広告レポートまで即座に取得できます。

---

## Package Architecture

```
                 MARKETING & GROWTH PACK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          |
       ┌──────────────────┼──────────────────┐
       |                  |                  |
  ┌────┴─────┐     ┌──────┴──────┐    ┌─────┴──────┐
  | 集客      |     | 分析        |    | 顧客管理    |
  | Acquire  |     | Analyze    |    | Nurture    |
  └────┬─────┘     └──────┬──────┘    └─────┬──────┘
       |                  |                  |
  ┌────┼────┬────┐   ┌───┼───┐        ┌────┼────┐
  |    |    |    |   |   |   |        |    |    |
 SEO  Ads  SNS  MEO GA4  SC Maps   HubSpot Sansan
  |    |    |    |   |   |   |        |    |    |
  └──┬─┘    |    |   └─┬─┘   |        └──┬─┘    |
     |      |    |     |     |           |      |
     v      v    v     v     v           v      v
  ┌──────────────────────────────────────────────┐
  |           jp-humanizer                        |
  |     AI文章 → 自然な日本語に変換               |
  |  SEO記事/広告文/SNS投稿/メール全てに適用      |
  └──────────────────────────┬───────────────────┘
                             |
  ┌──────────────────────────┴───────────────────┐
  |         GROWTH FEEDBACK LOOP                  |
  |                                               |
  |  記事公開 → GA4で効果測定 → 順位確認(SC)      |
  |  → 広告調整(Ads) → SNS拡散 → CRM育成          |
  |  → コンバージョン → 再分析 → 改善サイクル      |
  └───────────────────────────────────────────────┘
```

**8スキルが連携してマーケティングファネルの全段階をカバー。** jp-seo-writerで記事を生成、jp-humanizerで自然化、social-media-publisherで拡散、ga4-search-consoleで効果測定、google-ads-agentで広告最適化、hubspot-japanでリード育成まで一気通貫。

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 全8スキル利用可能（MIT License） |
| **Pro Support** | $29/月 | 優先サポート + SEO戦略テンプレート + 月次グロースレビュー |
| **Enterprise** | 要相談 | カスタムレポート + 代理店向けマルチアカウント + SLA保証 |

---

## Comparison with Alternatives

| 観点 | Marketing Pack | SEMrush | Ahrefs | 代理店委託 |
|------|---------------|---------|--------|----------|
| SEO記事生成 | **日本語最適化AI** | 英語中心 | 非対応 | ライター委託 |
| 文章自然化 | **jp-humanizer内蔵** | 非対応 | 非対応 | 人力校正 |
| Google広告連携 | **API直接操作** | モニタリングのみ | 非対応 | 代理店経由 |
| GA4/SC分析 | **CLI統合分析** | Web UI | Web UI | レポート |
| SNS一括投稿 | **X/IG/FB/LINE** | 非対応 | 非対応 | 別ツール |
| MEO対策 | **GBP API連携** | 限定的 | 非対応 | 別サービス |
| CRM連携 | **HubSpot + Sansan** | 非対応 | 非対応 | 別契約 |
| 月額コスト | **$0 (OSS)** | $130~ | $99~ | 30-100万円/月 |
| 日本語対応 | **ネイティブ** | 一部対応 | 一部対応 | 対応 |
| CLI操作 | **完全対応** | Web UI | Web UI | 対面 |

---

<p align="center">
  <b>Built by hanabi-jpn</b><br>
  <i>日本市場のグロースをAIで加速する</i>
</p>
