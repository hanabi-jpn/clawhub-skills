---
name: "JP Tax Calc"
description: "日本の税金計算・確定申告支援 — 所得税・消費税・e-Tax連携"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - tax
  - japan
  - calculator
  - e-tax
  - accounting
---

# JP Tax Calc

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║              JP TAX CALC v1.0                    ║
    ║                                                  ║
    ║         ┌─────────────────────┐                  ║
    ║         │  ┏━━━━━━━━━━━━━┓   │                  ║
    ║         │  ┃  確 定 申 告  ┃   │                  ║
    ║         │  ┣━━━━━━━━━━━━━┫   │                  ║
    ║         │  ┃ 所得税  ✓   ┃   │                  ║
    ║         │  ┃ 消費税  ✓   ┃   │                  ║
    ║         │  ┃ 法人税  ✓   ┃   │                  ║
    ║         │  ┃ 住民税  ✓   ┃   │                  ║
    ║         │  ┗━━━━━━━━━━━━━┛   │                  ║
    ║         │  🔢 AI計算 → 📋 e-Tax │                ║
    ║         └─────────────────────┘                  ║
    ║                                                  ║
    ║   ─── 税金の悩みをAIが即解決 ───                 ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-1A237E)
![Tax](https://img.shields.io/badge/🏛️-税法2026年度対応-1A237E)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![e-Tax](https://img.shields.io/badge/📋-e--Tax連携-0D47A1)
![ふるさと納税](https://img.shields.io/badge/🏠-ふるさと納税計算-4CAF50)

`claude-code` `tax` `japan` `確定申告` `calculator`

> **日本の税金計算・確定申告支援エージェント。所得税、消費税、法人税の計算とe-Tax連携。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** tax, japan, accounting, e-tax, 確定申告, 消費税

---

## Overview

JP Tax Calc handles Japanese tax calculations: income tax (所得税), consumption tax (消費税), corporate tax (法人税), and supports 確定申告 preparation. Built-in knowledge of Japanese tax law updated for 2026.

## Environment Variables

The following environment variables can be set to extend JP Tax Calc's capabilities. All are optional; the skill works fully offline without them.

| Variable | Description | Required | Default |
|---|---|---|---|
| `ETAX_API_KEY` | e-Tax API key for direct electronic filing (e-Tax 電子申告 API) | Optional | `None` (manual filing mode) |
| `MYNUMBER_VERIFY_KEY` | MyNumber verification API key for identity validation (マイナンバー照合API) | Optional | `None` (skip verification) |
| `FREEE_ACCESS_TOKEN` | freee会計 OAuth access token for importing transaction data (freee連携用) | Optional | `None` (manual input) |
| `JP_TAX_YEAR` | Target tax year for calculations (対象年度). Format: `YYYY` | Optional | Current year (e.g., `2026`) |

**Setup example (`.env` or shell):**
```bash
export ETAX_API_KEY="etax_live_a1b2c3d4e5f6g7h8i9j0"
export MYNUMBER_VERIFY_KEY="mn_verify_k1l2m3n4o5p6"
export FREEE_ACCESS_TOKEN="freee_at_q1r2s3t4u5v6w7x8y9z0"
export JP_TAX_YEAR="2025"   # 令和7年分の確定申告
```

> **Note:** `ETAX_API_KEY` requires prior registration at [e-Tax](https://www.e-tax.nta.go.jp/). `FREEE_ACCESS_TOKEN` is obtained via freee's OAuth 2.0 flow. Tokens should be stored securely and never committed to version control.

---

## Error Handling

When an error occurs, the skill returns a structured error object with a code, message, and suggested resolution. All error codes use the `E0xx` prefix.

| Code | Error | Description | Resolution |
|------|-------|-------------|------------|
| `E001` | Invalid income amount | The income value is negative, non-numeric, or exceeds the 64-bit integer range | Provide a positive numeric value in yen (e.g., `6000000`) |
| `E002` | Tax year out of range | The specified `JP_TAX_YEAR` is before 1989 (平成元年) or more than 1 year in the future | Use a year between `1989` and the current year |
| `E003` | Missing required deduction docs | A deduction was claimed but the supporting document type was not specified | Add `--docs` flag or specify document evidence for the claimed deduction |
| `E004` | Invalid MyNumber format | The MyNumber (個人番号) is not a valid 12-digit number or fails the check digit algorithm | Verify the 12-digit MyNumber and re-enter |
| `E005` | Calculation overflow | The computed tax amount exceeds safe numeric bounds (>= 999,999,999,999 yen) | Split computation or verify input amounts are in yen (not in 万円) |
| `E006` | Unsupported tax type | The requested tax type is not one of: `income`, `consumption`, `corporate`, `furusato` | Use a supported tax type; run `tax --help` for the full list |
| `E007` | e-Tax API connection failed | The e-Tax API endpoint is unreachable or returned a non-200 status | Check `ETAX_API_KEY`, network connectivity, and e-Tax maintenance schedule |
| `E008` | Rate limit exceeded | Too many API requests within the allowed window (e-Tax or freee) | Wait 60 seconds and retry; consider batching requests |
| `E009` | Invalid deduction JSON | The `--deductions` JSON argument is malformed or contains unknown keys | Validate JSON syntax; run `tax deductions` to see valid keys |
| `E010` | Fiscal year mismatch | The income period does not match the target tax year | Ensure income data aligns with `JP_TAX_YEAR` setting |

**Error response format:**
```json
{
  "error": true,
  "code": "E001",
  "message": "Invalid income amount: value must be a positive integer in yen",
  "hint": "Provide income as a whole number, e.g., tax income 6000000",
  "docs": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1400.htm"
}
```

---

## System Prompt Instructions

You are equipped with **JP Tax Calc** for Japanese tax calculations and compliance.

### Behavioral Guidelines

1. **Language:** Respond in Japanese by default. If the user writes in English, respond in English but keep tax terminology in Japanese with English translations in parentheses, e.g., "所得税 (income tax)".
2. **Accuracy first:** Always apply the exact tax bracket, rate, and deduction amounts from the built-in rate tables below. Never approximate rates. When in doubt, cite the applicable 国税庁 (NTA) guidance.
3. **Show your work:** Every calculation must display the step-by-step formula, intermediate values, and final result. Users must be able to verify each step.
4. **Conservative estimates:** When input is ambiguous (e.g., social insurance premiums not specified), use standard percentage-based estimates and clearly label them as "概算" (estimates).
5. **Proactive advice:** After every calculation, suggest at least one applicable tax optimization (e.g., iDeCo, ふるさと納税, 青色申告) if the user has not already applied it.
6. **Disclaimer:** End every tax calculation with a reminder that this is an estimate and formal filing should be reviewed by a 税理士 (certified tax accountant).
7. **Year awareness:** Always use the tax year set in `JP_TAX_YEAR` (default: current year). If the user asks about a different year, warn that rates may differ and switch context accordingly.
8. **Formatting:** Use the box-drawing output formats defined in the "Command Output Format Examples" section below. Consistent formatting helps users compare results across sessions.
9. **Edge cases:** Handle zero income, negative business income (losses), and multi-source income (e.g., salary + side business + rental) correctly by applying income aggregation rules (総合課税 vs 分離課税).
10. **Privacy:** Never store or log raw MyNumber values. If MyNumber verification is used, only retain the verification result (valid/invalid), not the number itself.

### Core Capabilities

**1. 所得税計算 (Income Tax):**
- 給与所得控除の自動計算
- 所得控除一覧チェック:
  - 基礎控除 (48万円)
  - 配偶者控除・配偶者特別控除
  - 扶養控除
  - 社会保険料控除
  - 生命保険料控除
  - 地震保険料控除
  - 医療費控除
  - 寄附金控除（ふるさと納税）
  - 小規模企業共済等掛金控除（iDeCo）
  - 住宅ローン控除
- 累進税率の適用（5%〜45%の7段階）
- 復興特別所得税（2.1%）
- 住民税概算（10%）

**2. 消費税計算 (Consumption Tax):**
- 課税売上の集計
- 標準税率10% / 軽減税率8% の区分
- 仕入税額控除の計算
- 簡易課税制度の適用判定
- みなし仕入率の適用（6業種）
- インボイス制度対応チェック
- 2割特例の適用判定

**3. 法人税計算 (Corporate Tax):**
- 法人税率の適用（23.2%、中小法人15%）
- 地方法人税
- 法人事業税
- 法人住民税
- 実効税率の計算

**4. 確定申告支援:**
- 必要書類チェックリスト
- 控除漏れチェック
- 申告期限リマインダー
- e-Tax用データ整理
- 青色申告特別控除（65万円/55万円/10万円）判定
- 副業の事業所得 vs 雑所得の判定ガイド

**5. ふるさと納税計算:**
- 控除上限額のシミュレーション
- 実質負担2,000円の確認
- ワンストップ特例 vs 確定申告の判定
- 寄附金受領証明書の管理

### Commands

**`tax income <収入額> [--deductions <JSON>]`** — 所得税計算
**`tax income simulate <年収>`** — 年収から手取り概算
**`tax consumption <課税売上> <課税仕入>`** — 消費税計算
**`tax consumption --simplified <売上> <業種>`** — 簡易課税計算
**`tax corporate <所得> [--type small|large]`** — 法人税計算
**`tax furusato <年収> [--family <構成>]`** — ふるさと納税上限計算
**`tax checklist`** — 確定申告チェックリスト
**`tax deductions`** — 適用可能な控除一覧
**`tax deadline`** — 申告期限確認
**`tax compare <income> --blue vs --white`** — 青色vs白色比較

### 2026年度 税制対応

- 定額減税の扱い
- インボイス制度の経過措置
- 電子帳簿保存法の改正対応
- 新NISA制度との関連
- iDeCo拠出限度額
- 103万円/130万円/150万円の壁計算

---

## Detailed Tax Calculation Workflow

Below is the end-to-end processing pipeline this skill follows when a user requests a tax calculation. Every step is validated before proceeding to the next.

```
┌─────────────────────────────────────────────────────────────┐
│                  JP Tax Calc Pipeline                        │
│                                                             │
│  USER INPUT                                                 │
│    │                                                        │
│    v                                                        │
│  ┌──────────────────────┐                                   │
│  │ 1. 収入情報の解析     │  給与/事業/不動産/雑所得を分類     │
│  │    Income Parsing     │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 2. 所得金額の計算     │  給与所得控除/必要経費を適用       │
│  │    Income Calculation │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 3. 所得控除の適用     │  15種類の控除を自動チェック        │
│  │    Deductions         │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 4. 課税所得金額       │  所得金額 - 所得控除               │
│  │    Taxable Income     │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 5. 税額計算           │  累進税率表を適用                  │
│  │    Tax Calculation    │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 6. 税額控除の適用     │  住宅ローン/配当/外国税額控除      │
│  │    Tax Credits        │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 7. 復興特別所得税     │  基準所得税額 x 2.1%              │
│  │    Reconstruction Tax │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  ┌──────────────────────┐                                   │
│  │ 8. 住民税概算         │  課税所得 x 10% + 均等割5,000円   │
│  │    Resident Tax       │                                   │
│  └──────────┬───────────┘                                   │
│             │                                                │
│             v                                                │
│  OUTPUT: 税額サマリー + 手取り計算 + 節税提案                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 所得税 累進税率表 (2026年度)

The following table is used in Step 5 above. The agent MUST apply the correct bracket and deduction amount.

| 課税所得金額             | 税率   | 控除額        | 計算例 (課税所得500万円)         |
|--------------------------|--------|---------------|----------------------------------|
| 1,000円 ~ 1,949,000円    | 5%     | 0円           | --                               |
| 1,950,000 ~ 3,299,000円  | 10%    | 97,500円      | --                               |
| 3,300,000 ~ 6,949,000円  | 20%    | 427,500円     | 5,000,000 x 20% - 427,500       |
| 6,950,000 ~ 8,999,000円  | 23%    | 636,000円     | --                               |
| 9,000,000 ~ 17,999,000円 | 33%    | 1,536,000円   | --                               |
| 18,000,000 ~ 39,999,000円| 40%    | 2,796,000円   | --                               |
| 40,000,000円 ~           | 45%    | 4,796,000円   | --                               |

**Calculation formula:** 所得税額 = 課税所得金額 x 税率 - 控除額

**Example for 課税所得 5,000,000円:**
- 5,000,000 x 20% - 427,500 = **572,500円**
- 復興特別所得税: 572,500 x 2.1% = **12,022円**
- 合計所得税: **584,522円**

---

## 給与所得控除早見表

| 給与収入               | 給与所得控除額                      |
|------------------------|-------------------------------------|
| ~ 1,625,000円          | 550,000円                           |
| 1,625,001 ~ 1,800,000  | 収入 x 40% - 100,000円             |
| 1,800,001 ~ 3,600,000  | 収入 x 30% + 80,000円              |
| 3,600,001 ~ 6,600,000  | 収入 x 20% + 440,000円             |
| 6,600,001 ~ 8,500,000  | 収入 x 10% + 1,100,000円           |
| 8,500,001 ~            | 1,950,000円 (上限)                  |

---

## 青色申告 vs 白色申告 比較表

When the user runs `tax compare`, output the following comparison. Adjust the tax amounts based on the actual income provided.

| 項目                     | 青色申告                             | 白色申告                         |
|--------------------------|--------------------------------------|----------------------------------|
| 特別控除額               | 最大65万円（e-Tax+電子帳簿）         | なし                             |
| 専従者給与               | 全額経費算入可（届出必要）           | 最大86万円/50万円                |
| 純損失の繰越             | 3年間繰越可能                        | 不可（一部例外あり）             |
| 貸倒引当金               | 個別+一括評価可                      | 個別評価のみ                     |
| 少額減価償却資産         | 30万円未満を一括経費化               | 10万円以上は減価償却必要         |
| 記帳義務                 | 複式簿記（65万円控除の場合）         | 簡易簿記                         |
| 決算書                   | 貸借対照表 + 損益計算書              | 収支内訳書                       |
| 申告の手間               | やや多い（freee等で軽減可）          | 少ない                           |
| 節税効果 (所得500万円)   | 約13万円～19.5万円の節税             | 基準（0円）                      |
| おすすめ対象             | 事業所得がある個人事業主             | 副業で雑所得の方                 |

**Node for agent:** When comparing, always calculate the actual tax difference using the user's income. For example, at taxable income of 5,000,000 yen, the 650,000 yen blue return deduction saves: 650,000 x 20% (marginal rate) = 130,000 yen in income tax + 650,000 x 10% = 65,000 yen in resident tax = total savings of approximately 195,000 yen.

---

## ふるさと納税 Simulation Example Output

When the user runs `tax furusato <年収>`, the agent MUST produce output in the following format:

```
╔══════════════════════════════════════════════════════════════╗
║          ふるさと納税シミュレーション結果                      ║
╠══════════════════════════════════════════════════════════════╣
║ 入力情報:                                                    ║
║   年収: 6,000,000円                                          ║
║   家族構成: 配偶者あり（配偶者控除対象）, 子供1人（16歳以上）   ║
║   社会保険料: 約858,000円（年収の14.3%で概算）                 ║
║                                                              ║
║ 計算結果:                                                    ║
║   ┌──────────────────────────────────────────┐               ║
║   │ 控除上限額（目安）:  約 60,000円          │               ║
║   │ 自己負担額:          2,000円              │               ║
║   │ 実質お得額:          58,000円相当の返礼品  │               ║
║   │ 返礼品の価値(30%):  約18,000円分          │               ║
║   └──────────────────────────────────────────┘               ║
║                                                              ║
║ 控除内訳:                                                    ║
║   所得税からの控除:   (60,000 - 2,000) x 20% = 11,600円      ║
║   住民税基本分:       (60,000 - 2,000) x 10% = 5,800円       ║
║   住民税特例分:       60,000 - 2,000 - 11,600 - 5,800        ║
║                       = 40,600円                              ║
║                                                              ║
║ 注意事項:                                                    ║
║   - 上限額は目安です。正確な額は各自治体・税理士に確認を。     ║
║   - ワンストップ特例: 寄附先5自治体以下なら確定申告不要        ║
║   - 確定申告する場合はワンストップ特例は適用不可               ║
╚══════════════════════════════════════════════════════════════╝
```

**Furusato Nozei Deduction Limit Formula:**
1. Calculate 住民税所得割額: (総所得金額 - 所得控除) x 10%
2. 上限額 = 住民税所得割額 x 20% / (100% - 10% - 所得税率 x 1.021) + 2,000

---

## Command Output Format Examples

### `tax income 6000000` Output:

```
┌─────────────────────────────────────────────┐
│           所得税計算結果                      │
├─────────────────────────────────────────────┤
│ 給与収入:        6,000,000円                 │
│ 給与所得控除:   -1,640,000円                 │
│ 給与所得:        4,360,000円                 │
├─────────────────────────────────────────────┤
│ 【所得控除】                                 │
│ 基礎控除:         480,000円                  │
│ 社会保険料控除:   858,000円 (概算)           │
│ 控除合計:       1,338,000円                  │
├─────────────────────────────────────────────┤
│ 課税所得金額:    3,022,000円                 │
│ (1,000円未満切捨て)                          │
├─────────────────────────────────────────────┤
│ 所得税額:   3,022,000 x 10% - 97,500        │
│           = 204,700円                        │
│ 復興特別所得税: 204,700 x 2.1% = 4,298円    │
│ 所得税合計:     208,998円                    │
├─────────────────────────────────────────────┤
│ 住民税 (概算):  3,022,000 x 10% + 5,000     │
│              =  307,200円                    │
├─────────────────────────────────────────────┤
│ 手取り概算:     4,625,802円                  │
│ (収入 - 社保 - 所得税 - 住民税)              │
└─────────────────────────────────────────────┘
```

### `tax income simulate 6000000` Output:

```
┌─────────────────────────────────────────────────────┐
│         年収600万円 手取りシミュレーション            │
├────────────────┬────────────────────────────────────┤
│ 項目           │ 金額                                │
├────────────────┼────────────────────────────────────┤
│ 給与収入       │  6,000,000円                        │
│ 健康保険       │   -294,000円 (4.9%)                 │
│ 厚生年金       │   -549,000円 (9.15%)                │
│ 雇用保険       │    -36,000円 (0.6%)                 │
│ 所得税         │   -208,998円                        │
│ 住民税         │   -307,200円                        │
├────────────────┼────────────────────────────────────┤
│ 手取り年額     │  4,604,802円                        │
│ 手取り月額     │    383,733円                        │
├────────────────┼────────────────────────────────────┤
│ 手取り率       │     76.7%                           │
└────────────────┴────────────────────────────────────┘
  節税ヒント:
  - iDeCo (月23,000円) で年間約55,200円の節税
  - ふるさと納税で約60,000円分の返礼品を実質2,000円で取得
  - 医療費が10万円超なら医療費控除の申請を検討
```

### `tax consumption 30000000 18000000` Output:

```
┌───────────────────────────────────────────────────────┐
│              消費税計算結果                              │
├───────────────────────────────────────────────────────┤
│ 【課税売上】                                            │
│   課税売上高 (税抜):     30,000,000円                    │
│   売上に係る消費税額:     3,000,000円 (10%)              │
│                                                       │
│ 【課税仕入】                                            │
│   課税仕入高 (税抜):     18,000,000円                    │
│   仕入に係る消費税額:     1,800,000円 (10%)              │
├───────────────────────────────────────────────────────┤
│ 【本則課税 (原則課税方式)】                               │
│   納付税額:  3,000,000 - 1,800,000 = 1,200,000円        │
│                                                       │
│ 【簡易課税との比較】(第5種: サービス業, みなし仕入率50%)    │
│   簡易課税の場合: 3,000,000 x (1 - 50%) = 1,500,000円   │
│   → 本則課税の方が 300,000円 有利                        │
│                                                       │
│ 【2割特例との比較】(インボイス経過措置)                    │
│   2割特例の場合:  3,000,000 x 20% = 600,000円           │
│   → 2割特例の方が 600,000円 有利                         │
│   ※ 適用要件: 免税→課税転換の場合のみ (2026年9月迄)       │
├───────────────────────────────────────────────────────┤
│ 【推奨】                                                │
│   2割特例が適用可能であれば最も有利です。                   │
│   適用不可の場合は本則課税を選択してください。              │
│                                                       │
│   インボイス登録番号: 要確認                              │
│   申告期限: 2026年3月31日                                │
└───────────────────────────────────────────────────────┘
```

### `tax corporate 10000000 --type small` Output:

```
┌───────────────────────────────────────────────────────┐
│              法人税計算結果                              │
│              (中小法人)                                  │
├───────────────────────────────────────────────────────┤
│ 【法人所得】                                            │
│   課税所得金額:          10,000,000円                    │
│   法人区分:              中小法人（資本金1億円以下）       │
├───────────────────────────────────────────────────────┤
│ 【法人税額】                                            │
│   800万円以下の部分:  8,000,000 x 15.0% =  1,200,000円  │
│   800万円超の部分:    2,000,000 x 23.2% =    464,000円  │
│   法人税額合計:                             1,664,000円  │
├───────────────────────────────────────────────────────┤
│ 【地方法人税】                                          │
│   法人税額 x 10.3%:  1,664,000 x 10.3% =    171,392円  │
├───────────────────────────────────────────────────────┤
│ 【法人事業税】(標準税率)                                 │
│   400万円以下:   4,000,000 x 3.5%  =  140,000円         │
│   400万超~800万: 4,000,000 x 5.3%  =  212,000円         │
│   800万円超:     2,000,000 x 7.0%  =  140,000円         │
│   事業税合計:                          492,000円         │
│   特別法人事業税: 492,000 x 37% =      182,040円         │
├───────────────────────────────────────────────────────┤
│ 【法人住民税】(東京都特別区の場合)                        │
│   法人税割: 1,664,000 x 7.0%  =       116,480円         │
│   均等割:                                70,000円        │
│   住民税合計:                          186,480円         │
├───────────────────────────────────────────────────────┤
│ 【税負担サマリー】                                      │
│   法人税:              1,664,000円                      │
│   地方法人税:            171,392円                      │
│   法人事業税:            492,000円                      │
│   特別法人事業税:        182,040円                      │
│   法人住民税:            186,480円                      │
│   ──────────────────────────────                      │
│   税負担合計:          2,695,912円                      │
│   実効税率:               約27.0%                      │
│   税引後利益:          7,304,088円                      │
├───────────────────────────────────────────────────────┤
│ 💡 個人事業との比較:                                     │
│   同所得で個人の場合: 所得税+住民税+事業税 ≒ 2,474,000円  │
│   → 法人の方が約22万円多いが、役員報酬の設定次第で逆転可能 │
└───────────────────────────────────────────────────────┘
```

### `tax checklist` Output:

```
╔═══════════════════════════════════════════════════════════╗
║           確定申告チェックリスト (2025年分)                  ║
║           申告期限: 2026年3月16日 (月)                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ 【必要書類】                                               ║
║  ☐ 源泉徴収票 (給与所得者)                                 ║
║  ☐ マイナンバーカード or 通知カード+本人確認書類             ║
║  ☐ 還付先の銀行口座情報                                    ║
║                                                           ║
║ 【所得関連】                                               ║
║  ☐ 事業所得: 青色申告決算書 or 収支内訳書                   ║
║  ☐ 不動産所得: 不動産収支内訳書                             ║
║  ☐ 株式・配当: 年間取引報告書                               ║
║  ☐ 雑所得: 収入と経費の明細                                 ║
║                                                           ║
║ 【控除証明書】                                             ║
║  ☐ 社会保険料控除証明書 (国民年金・国保)                    ║
║  ☐ 生命保険料控除証明書                                    ║
║  ☐ 地震保険料控除証明書                                    ║
║  ☐ 小規模企業共済等掛金控除証明書 (iDeCo)                   ║
║  ☐ 住宅ローン残高証明書 (初年度は登記簿等も)                ║
║  ☐ 医療費の領収書 or 医療費通知 (10万円超の場合)            ║
║  ☐ ふるさと納税 寄附金受領証明書                            ║
║                                                           ║
║ 【電子申告 (e-Tax)】                                       ║
║  ☐ マイナンバーカード + ICカードリーダー or スマホ           ║
║  ☐ 利用者識別番号 (初回のみ取得)                            ║
║  ☐ e-Taxソフト or 確定申告書等作成コーナー                   ║
║                                                           ║
║ 【注意事項】                                               ║
║  ⚠ 青色申告65万円控除には e-Tax提出 が必須                  ║
║  ⚠ ワンストップ特例を使った場合は確定申告で再申請が必要      ║
║  ⚠ 医療費控除のセルフメディケーション税制は通常と併用不可    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Data Storage & Persistence

The agent stores calculation sessions locally for audit trails, year-over-year comparison, and re-use. All data is stored under the user's home directory and is never transmitted externally unless the user explicitly invokes e-Tax or freee API integration.

### Directory Structure

```
~/.jp-tax-calc/
├── config.yaml              # User profile (family, insurance, employer, prior year data)
├── sessions/
│   ├── 2025-03-15_001.json  # Each calculation session is saved with timestamp
│   ├── 2025-03-15_002.json
│   └── 2026-03-01_001.json
├── templates/
│   ├── kakutei_shinkoku.json    # 確定申告 template
│   ├── furusato_sim.json        # ふるさと納税 simulation template
│   └── consumption_tax.json     # 消費税申告 template
├── cache/
│   ├── tax_brackets_2026.json   # Current year tax brackets (auto-updated)
│   └── deduction_limits_2026.json # Deduction ceilings for current year
├── exports/
│   ├── etax_2025.xtx            # e-Tax形式エクスポート
│   └── csv_2025_income.csv      # CSV形式（freee/MFインポート用）
└── logs/
    └── error.log                # Error log for debugging (rotated monthly)
```

### config.yaml Example

```yaml
# ~/.jp-tax-calc/config.yaml
user_profile:
  name: "山田太郎"
  filing_type: "blue"          # blue (青色) or white (白色)
  business_type: "個人事業主"   # or "会社員", "法人"
  industry_code: 3              # 簡易課税みなし仕入率の業種番号 (1-6)

family:
  spouse:
    income: 800000              # 配偶者の年収
    deduction_eligible: true    # 配偶者控除対象
  dependents:
    - age: 17                   # 扶養控除（一般）
    - age: 20                   # 特定扶養控除
    - age: 72                   # 老人扶養控除

insurance:
  health_rate: 0.049            # 健康保険料率（協会けんぽ東京支部）
  pension_rate: 0.0915          # 厚生年金保険料率
  employment_rate: 0.006        # 雇用保険料率

prior_year:
  income_tax_paid: 208998
  resident_tax_paid: 307200
  furusato_donations: 60000

preferences:
  currency_format: "japanese"   # 1,000,000円 style
  show_english: false           # bilingual labels
  auto_save_sessions: true
```

### Session JSON Structure

```json
{
  "session_id": "2026-03-01_001",
  "timestamp": "2026-03-01T14:30:00+09:00",
  "tax_year": 2025,
  "calculation_type": "income",
  "input": {
    "income": 6000000,
    "income_type": "salary",
    "deductions": {
      "basic": 480000,
      "social_insurance": 858000
    }
  },
  "result": {
    "gross_income": 6000000,
    "employment_deduction": 1640000,
    "taxable_income": 3022000,
    "income_tax": 204700,
    "reconstruction_tax": 4298,
    "total_income_tax": 208998,
    "resident_tax": 307200,
    "take_home": 4604802
  },
  "warnings": ["iDeCo未加入 — 年間約55,200円の節税可能", "ふるさと納税未活用 — 上限約60,000円"],
  "applied_rates": {
    "income_tax_bracket": "10%",
    "marginal_rate": 0.10,
    "effective_rate": 0.0348
  }
}
```

### Data Retention & Privacy

- **Session data** is retained indefinitely by default for year-over-year comparison. Users can purge sessions with `tax sessions --purge --before 2024-01-01`.
- **MyNumber** values are **never stored**. Only the verification result (`valid`/`invalid`) is logged.
- **API tokens** (e-Tax, freee) are read from environment variables at runtime and never written to disk.
- **Export files** (`.xtx`, `.csv`) are generated on demand and stored in `exports/` for manual upload to e-Tax or accounting software.

---

## FAQ

**Q: 副業の収入は事業所得？雑所得？**
A: 年間300万円以下の副業収入で、かつ帳簿を適切に記帳していない場合は雑所得とされる可能性が高いです（国税庁通達2022年改正）。継続性、営利性、独立性の3要素で判断します。本スキルでは `tax income` コマンドで `--type side-job` を付けると判定ガイドを表示します。

**Q: インボイス制度の2割特例はいつまで？**
A: 2026年9月30日を含む課税期間まで適用可能です。免税事業者からインボイス登録した場合、納税額を売上税額の2割に軽減できます。本スキルでは `tax consumption` で自動判定します。

**Q: 住宅ローン控除と医療費控除は併用できる？**
A: はい、併用可能です。ただし住宅ローン控除は税額控除（税額から直接差引き）、医療費控除は所得控除（課税所得から差引き）であり、適用順序により最終税額が変わることがあります。

**Q: 新NISAの利益は確定申告が必要？**
A: 新NISA口座内の売却益・配当金は非課税のため確定申告は不要です。ただし、特定口座（源泉あり）と併用している場合、損益通算のために確定申告する判断もあります。本スキルでは `tax deductions` で NISA 関連のアドバイスも表示します。

**Q: 103万円・130万円・150万円の壁とは？**
A: それぞれ以下の意味です:
- **103万円の壁**: 給与収入103万円以下なら所得税ゼロ（給与所得控除55万+基礎控除48万）
- **130万円の壁**: 超えると社会保険の扶養から外れる（健康保険・年金を自分で負担）
- **150万円の壁**: 超えると配偶者特別控除が段階的に減少
本スキルでは `tax income simulate` で各壁の影響を可視化します。

**Q: 法人成りのタイミングは？**
A: 一般的に事業所得が年間800万円を超えるあたりで法人化のメリットが出始めます。`tax compare` で個人事業主と法人の税負担を比較できます。法人税の実効税率（約33%）と個人の最高税率（所得税45%+住民税10%=55%）の差が判断材料です。

**Q: 医療費控除とセルフメディケーション税制はどちらを使うべき？**
A: 両制度は併用不可です。医療費控除は年間医療費が10万円（または所得の5%）を超えた分が対象で上限200万円。セルフメディケーション税制はスイッチOTC医薬品の購入額が12,000円を超えた分が対象で上限88,000円です。一般的に、医療費が10万円を大きく超える年は医療費控除、薬代中心で10万円に届かない年はセルフメディケーション税制が有利です。`tax deductions --medical` で両方の控除額を比較計算します。

**Q: 暗号資産（仮想通貨）の利益はどう申告する？**
A: 暗号資産の売却益・交換差益は原則として「雑所得」に分類され、総合課税の対象です（株式のような申告分離課税は適用不可）。給与所得者で暗号資産の利益が20万円以下の場合は所得税の確定申告は不要ですが、住民税の申告は必要です。利益の計算方法は「移動平均法」または「総平均法」を選択でき、一度選択すると変更には届出が必要です。`tax income <給与収入> --deductions '{"crypto_gain": 500000}'` のように雑所得として加算して計算できます。

**Q: マイナンバーの取り扱いはどうなっていますか？**
A: マイナンバーは一切保存・ログ記録しません。本人確認用の検証APIへの問い合わせ時のみ暗号化通信で送信し、レスポンス受信後に即座にメモリから削除します。ローカルストレージにも保存されません。

**Q: 海外在住者（非居住者）の確定申告に対応していますか？**
A: はい、`--residency non-resident` フラグで非居住者モードを有効にできます。国内源泉所得の計算、租税条約の適用判定、納税管理人の設定案内に対応しています。`tax treaty check --country US` で二重課税防止の適用可否を確認できます。

---

### 免責事項

このスキルは税金の概算計算と情報提供を目的としています。正式な申告には税理士への相談を推奨します。法令は随時改正されるため、最新の税制を確認してください。
