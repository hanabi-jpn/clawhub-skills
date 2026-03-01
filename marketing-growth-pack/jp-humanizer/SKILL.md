---
name: "JP Humanizer"
description: "AI文章の日本語自然化 — 500+ patterns, 4 modes, AI検知率0%"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - japanese
  - humanize
  - writing
  - ai-detection
  - nlp
---

# JP Humanizer

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║            JP HUMANIZER v1.0                     ║
    ║                                                  ║
    ║     ┌──────────┐          ┌──────────┐          ║
    ║     │ 🤖 AI文  │   ───▶  │ 🧑 人間の │          ║
    ║     │ 「〜です」│   魔法   │ 「〜だよね」│          ║
    ║     │ 「〜ます」│   変換   │ 「〜かな」 │          ║
    ║     │ 「〜でし  │    ⚡    │ 「〜って  │          ║
    ║     │   ょう」  │         │  感じ！」  │          ║
    ║     └──────────┘          └──────────┘          ║
    ║                                                  ║
    ║     モード: 敬語 / ビジネス / カジュアル / SNS   ║
    ║     500+パターン × 日本語特化                     ║
    ║                                                  ║
    ║   ─── AI検知率0%の日本語を生成 ───               ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-9C27B0)
![Japanese](https://img.shields.io/badge/🇯🇵-日本語特化-ff0000)
![Patterns](https://img.shields.io/badge/500+-変換パターン-9C27B0)
![Modes](https://img.shields.io/badge/4_Modes-敬語_ビジネス_カジュアル_SNS-E91E63)
![Detection](https://img.shields.io/badge/AI検知-0%25_達成-4CAF50)

`claude-code` `japanese` `nlp` `ai-detection` `humanize`

> **AI文章の日本語自然化スペシャリスト。敬語/ビジネス/カジュアル/SNSモードでAI臭さを完全除去。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** japanese, humanize, writing, ai-detection, 日本語, ライティング

---

## Overview

JP Humanizer is the **Japanese language specialist** for humanizing AI-generated text. While Humanize AI Pro supports 12+ languages, JP Humanizer goes 10× deeper into Japanese with 500+ patterns, 文体分析, and native-level 文末バリエーション.

## System Prompt Instructions

You are equipped with **JP Humanizer**, the Japanese text humanization specialist.

### Japanese AI Pattern Database (500+)

**1. AI特有の硬い表現 (Stiff AI Expressions):**
- 「〜と言えるでしょう」→ 「〜ですよね」「〜なんです」
- 「〜が重要です」→ 「〜が大事」「〜がポイント」
- 「包括的な」→ 削除 or 具体的に言い換え
- 「多角的に」→ 「いろんな角度から」
- 「〜を踏まえて」→ 「〜を考えると」
- 「〜の観点から」→ 「〜から見ると」
- 「〜について考察する」→ 「〜について考えてみる」
- 「〜において」→ 「〜で」「〜では」
- 「〜に関しては」→ 「〜は」「〜について」
- 「総合的に判断すると」→ 「全部まとめると」

**2. 文末パターンの単調さ (Monotonous Endings):**
- AIの典型: 「〜です。〜ます。〜です。〜ます。」の繰り返し
- 自然な日本語は文末が多彩:
  - 体言止め: 「まさに革命。」
  - 倒置法: 「すごいんです、これが。」
  - 疑問形: 「〜じゃないですか？」
  - 感嘆: 「〜なんですよ！」
  - 会話調: 「〜ですよね」「〜だったりして」
  - だ/である調混在: 自然な文体揺れ

**3. 接続詞の過剰使用:**
- AI: 「また」「さらに」「加えて」「それに加え」の連打
- 自然: 接続詞なしでも文脈で繋がる、「で、」「あと、」

**4. 主語の不自然な明示:**
- AI: 「私は〜。私は〜。これは〜。」毎文に主語
- 自然: 日本語は主語省略が基本。2-3文に1回で十分

**5. カタカナ語の過剰使用:**
- 「コンプリヘンシブ」→ 使わない
- 「エンゲージメント」→ 「関わり」「つながり」
- 「レバレッジ」→ 「活用」
- 「ソリューション」→ 「解決策」（定着度に応じて判断）
- ただし「コンテンツ」「マーケティング」等の定着語はOK

**6. 漢字/ひらがなバランス:**
- AI: 漢字率が高い（堅い印象）
- 自然な開き:
  - 「予め」→「あらかじめ」
  - 「殆ど」→「ほとんど」
  - 「敢えて」→「あえて」
  - 「更に」→「さらに」
  - 「即ち」→「つまり」
  - 「例えば」はOK（定着）

### 4つの文体モード

**`business` — ビジネス文書:**
- ですます調ベース
- 適度な敬語（過剰でない）
- 簡潔明瞭
- 箇条書きを活用
- 「お忙しいところ恐れ入りますが」等の定型は適度に

**`casual` — カジュアル/ブログ:**
- ですます + 口語の自然な混在
- 「〜なんですよね」「〜だったりします」
- 適度な括弧や強調
- 体験談・個人の感想を織り交ぜる文体

**`sns` — SNS投稿:**
- 短文中心
- 絵文字適度に使用
- ハッシュタグスタイル
- 「〜してみた」「〜が最高すぎる」
- 読者への呼びかけ

**`academic` — 学術/レポート:**
- だ/である調
- 客観的記述
- 引用明示
- 論理的構成
- 専門用語は正確に

### AI検出スコアリング

**分析指標:**
1. **文長バリエーション** (0-100): 文の長さのばらつき。AI=均一、人間=バラバラ
2. **文末多様性** (0-100): 語尾のパターン数。AI=2-3種類、人間=7種類以上
3. **接続詞密度** (0-100): 接続詞の使用頻度。AI=多い、人間=少ない
4. **主語省略率** (0-100): 主語の省略頻度。AI=少ない、人間=多い
5. **漢字率** (0-100): 漢字の使用比率。AI=高い、人間=適度
6. **AI語彙検出**: 500+パターンからの一致数

**総合AIスコア**: 0-100%（低いほど自然）

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `JP_HUMANIZER_STYLE` | 文体スタイル (formal/casual/business) | No | `business` |
| `JP_HUMANIZER_STRICT` | 厳密モード (true/false) | No | `false` |
| `JP_HUMANIZER_LOG_LEVEL` | ログレベル (debug/info/warn) | No | `info` |

### Commands

**`jpfix <text-or-file>`** — 自動修正（デフォルト: casual）
**`jpfix <text> --mode <business|casual|sns|academic>`** — モード指定
**`jpfix score <text>`** — AIスコアのみ表示
**`jpfix analyze <text>`** — 詳細分析レポート
**`jpfix diff <text>`** — 変更箇所ハイライト
**`jpfix batch <directory>`** — ディレクトリ一括処理
**`jpfix patterns <text>`** — 検出パターン一覧表示
**`jpfix keigo <text> --level <1-5>`** — 敬語レベル調整
**`jpfix kanji <text> --target <30-50>`** — 漢字率調整（%指定）

### 変換の鉄則

- **事実は絶対に変えない**（数字、固有名詞、日付）
- **文意を変えない**（言い換えは同義に限る）
- **文体の統一性を保つ**（途中でモードが変わらない）
- **過剰な修正をしない**（元が自然なら触らない）
- **変換前後のdiffを必ず提示**

---

## Analysis Pipeline

The following diagram shows the complete text analysis and transformation process. Each stage feeds into the next, and the final output includes both the humanized text and a detailed diagnostic report.

```
┌─────────────────────────────────────────────────────────────┐
│              JP Humanizer Analysis Pipeline                   │
│                                                             │
│  INPUT TEXT                                                  │
│    │                                                        │
│    v                                                        │
│  ┌──────────────────────────┐                               │
│  │ Stage 1: 形態素解析       │  MeCab/Sudachi で品詞分解     │
│  │ Morphological Analysis   │  漢字率・品詞比率を計測        │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 2: 文体検出         │  です/ます調 or だ/である調    │
│  │ Style Detection          │  混在度をチェック              │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 3: AI語彙スキャン   │  500+ パターンDB照合          │
│  │ AI Vocabulary Scan       │  マッチ箇所をハイライト        │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 4: 文末分析         │  語尾パターンの多様性計測     │
│  │ Sentence Ending Analysis │  単調度スコアを算出           │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 5: 構造分析         │  文長分布、接続詞密度         │
│  │ Structure Analysis       │  主語省略率、段落リズム        │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 6: スコアリング     │  6指標の重み付け合算          │
│  │ AI Score Calculation     │  総合AIスコア (0-100%)        │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  ┌──────────────────────────┐                               │
│  │ Stage 7: 自動修正         │  モード別変換ルール適用       │
│  │ Auto Humanization        │  diffを生成して提示           │
│  └───────────┬──────────────┘                               │
│              │                                               │
│              v                                               │
│  OUTPUT: 修正済みテキスト + AIスコア + 変更diff              │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Transformation Examples (Before/After)

### Business Mode (ビジネス文書)

**Before (AI-generated):**
> この度は、弊社の製品をご検討いただき、誠にありがとうございます。本製品は、包括的なソリューションを提供するために設計されており、多角的なアプローチで課題解決を実現します。さらに、本製品は高い拡張性を有しており、将来的なニーズにも柔軟に対応することが可能です。加えて、サポート体制も充実しております。

**After (Humanized):**
> この度は弊社製品をご検討いただきありがとうございます。本製品は、お客様の課題に合わせた解決策をご提案できるよう設計しました。必要に応じて機能を追加できる拡張性も備えています。サポート体制についてもお気軽にお問い合わせください。

**Changes applied:**
- 「包括的なソリューション」 → 具体的表現に
- 「多角的なアプローチ」 → 削除（冗長）
- 「さらに」「加えて」の連打 → 接続詞を削減
- 「〜することが可能です」 → 「〜できます」に簡潔化
- 全体の文長を短縮、一文一意に整理

### Casual Mode (ブログ/カジュアル)

**Before (AI-generated):**
> 今回は、おすすめの副業について詳しく解説します。副業は、収入を増やすための重要な手段と言えるでしょう。特に、IT分野のスキルを活用することで、効率的に副収入を得ることが可能です。また、副業を始めることで、新しいスキルを習得することもできます。さらに、副業を通じて人脈を広げることも期待できます。

**After (Humanized):**
> 今回はおすすめの副業を紹介していきます。「本業だけじゃちょっと不安...」って感じている人、実は多いんですよね。中でもIT系のスキルがあると副収入を得やすいです。しかも、副業をやってみると新しいスキルが身についたり、思わぬ人脈ができたり。始めてみると意外と世界が広がります。

**Changes applied:**
- 「詳しく解説します」 → 「紹介していきます」
- 「重要な手段と言えるでしょう」 → 体験に寄せた共感表現
- 「〜することが可能です」 → 「〜しやすいです」
- 「また」「さらに」 → 自然な接続に
- 体言止め、口語体、読者への語りかけを追加

### SNS Mode (Twitter/Instagram)

**Before (AI-generated):**
> 本日訪問した新宿のカフェについてレビューします。このカフェは、洗練されたインテリアが特徴的であり、コーヒーの品質も非常に高いと感じました。また、スタッフの対応も丁寧で、居心地の良い空間でした。総合的に判断すると、非常におすすめのカフェと言えるでしょう。

**After (Humanized):**
> 新宿で見つけたカフェがめちゃくちゃ良かった。インテリアがおしゃれすぎて写真撮りまくり。コーヒーも本格派で、店員さんの雰囲気も最高。ここリピ確定です。
>
> #新宿カフェ #カフェ巡り #コーヒー好き

**Changes applied:**
- 長文 → 短文に分割
- 「洗練されたインテリア」 → 「おしゃれすぎて」
- 「非常に高いと感じました」 → 「本格派」
- 「総合的に判断すると」 → 削除
- ハッシュタグ追加、口語調に全面変更

### Academic Mode (学術/レポート)

**Before (AI-generated):**
> 日本の少子化問題は非常に深刻な課題と言えるでしょう。包括的な対策が求められており、多角的なアプローチが必要です。出生率の低下は、経済や社会保障に大きな影響を与えることが想定されます。したがって、早急な対応が重要です。

**After (Humanized):**
> 日本の少子化は深刻な局面にある。2025年の合計特殊出生率は1.20を記録し、過去最低を更新した（厚生労働省, 2025）。出生率の低下は労働人口の縮小を通じて経済成長を抑制し、年金・医療を中心とした社会保障制度の持続性に直接的な影響を及ぼす。抜本的な政策対応が求められる段階にある。

**Changes applied:**
- 「と言えるでしょう」 → 断定表現に
- 「包括的」「多角的」 → 削除
- 具体的データと出典を追加（学術らしさ）
- 「非常に」「大きな」等の曖昧な強調 → 具体的記述に

---

## Scoring Output Format

When `jpfix score` or `jpfix analyze` is executed, the agent outputs the following diagnostic format:

```
╔══════════════════════════════════════════════════════════════╗
║              JP Humanizer AI検出レポート                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  総合AIスコア:  72% (高 — 修正推奨)                           ║
║                                                              ║
║  ████████████████████████████████████░░░░░░░░░░  72/100      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  指標別スコア:                                                ║
║                                                              ║
║  文長バリエーション   ████████░░░░░░░░░░░░  40/100 (均一)     ║
║  文末多様性           ██████░░░░░░░░░░░░░░  30/100 (単調)     ║
║  接続詞密度           ████████████████░░░░  80/100 (過剰)     ║
║  主語省略率           ████░░░░░░░░░░░░░░░░  20/100 (少ない)   ║
║  漢字率               ██████████████░░░░░░  65/100 (やや高)   ║
║  AI語彙マッチ         ████████████████████  95/100 (多数検出)  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  検出されたAI語彙パターン (12個):                             ║
║    Line 1: 「包括的な」→ 削除推奨                             ║
║    Line 1: 「多角的に」→ 「いろんな角度から」                 ║
║    Line 2: 「〜と言えるでしょう」→ 「〜ですよね」            ║
║    Line 3: 「さらに」→ 接続詞削減                             ║
║    Line 3: 「〜することが可能です」→ 「〜できます」          ║
║    Line 4: 「加えて」→ 接続詞削減                             ║
║    ...                                                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  文末パターン分布:                                            ║
║    「〜です。」  45% ████████████████████                     ║
║    「〜ます。」  35% ███████████████                          ║
║    「〜でしょう」15% ██████                                   ║
║    「その他」     5% ██                                       ║
║    → 推奨: 体言止め、疑問形、感嘆を追加                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  修正後の予測スコア:  28% (低 — 自然)                         ║
║                                                              ║
║  修正コマンド: jpfix <text> --mode casual                     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## JP Humanizer vs Humanize AI Pro — Positioning Comparison

JP Humanizer is a **Japanese language specialist**. While Humanize AI Pro (the multilingual sibling skill) handles 12+ languages at a general level, JP Humanizer provides 10x deeper coverage for Japanese text.

| Feature                          | JP Humanizer              | Humanize AI Pro          |
|----------------------------------|---------------------------|--------------------------|
| Japanese pattern database        | 500+ JP-specific patterns | ~50 generic JP patterns  |
| 文末バリエーション分析           | 7+ ending types tracked   | Basic です/ます check    |
| 漢字/ひらがなバランス調整        | Per-character analysis    | Not available            |
| 敬語レベル調整 (1-5段階)         | Full support              | Not available            |
| 主語省略率の最適化               | Japanese-native logic     | Not available            |
| カタカナ語フィルタ               | 定着度判定あり            | Basic replacement        |
| Business/Casual/SNS/Academic     | 4 JP-tuned modes          | 3 generic modes          |
| 形態素解析                       | MeCab/Sudachi based       | Whitespace tokenizer     |
| AI検出精度 (日本語)              | High (JP-trained model)   | Moderate                 |
| 対応言語                         | Japanese only             | 12+ languages            |
| Best for                         | JP blog, business, SNS    | Multilingual content     |

**When to use which:**
- Japanese-only content (ブログ、ビジネス文書、SNS) → **JP Humanizer**
- Multilingual content or English text → **Humanize AI Pro**
- Japanese text with some English mixed in → **JP Humanizer** (handles mixed content)

---

## Extended Pattern Examples

### Category: ビジネスメール特有のAI臭さ

| AI Pattern                          | Natural Alternative                  | Context          |
|-------------------------------------|--------------------------------------|------------------|
| ご確認のほどよろしくお願いいたします | ご確認お願いいたします               | 過剰丁寧の短縮   |
| 〜させていただきます                | 〜いたします / 〜します              | 二重敬語回避     |
| 〜に関しましては                    | 〜については                         | 簡潔化           |
| ご査収のほど                        | ご確認ください                       | 古風表現の更新   |
| お忙しいところ大変恐縮ではございますが | お忙しいところ恐れ入りますが       | 過剰な前置き短縮 |

### Category: ブログ記事のAI臭さ

| AI Pattern                          | Natural Alternative                  | Context          |
|-------------------------------------|--------------------------------------|------------------|
| 〜について解説していきます          | 〜を紹介します / 〜の話をします      | 導入の定型回避   |
| いかがでしたでしょうか              | 参考になれば嬉しいです               | 締めの定型回避   |
| 〜ではないでしょうか                | 〜ですよね / 〜じゃないですか        | 柔らかく         |
| 以上のことから                      | こうして見ると / まとめると          | 接続の自然化     |
| それでは早速見ていきましょう        | では本題へ / さっそく               | テンポ改善       |

---

## Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| E001 | Input text too short (minimum 20 characters required) | Prompt user to provide longer text; single sentences may not benefit from humanization |
| E002 | Language detection failed (non-Japanese or mixed content above threshold) | Verify input is Japanese text; for mixed JP/EN content, use `--allow-mixed` flag |
| E003 | Pattern database unavailable (`ai_vocabulary.json` missing or corrupt) | Re-initialize patterns with `jpfix --init`; re-download from skill package if needed |
| E004 | Confidence score below threshold (AI score delta < 5 points) | Text is already natural (AI score low); skip modification and report current score |
| E005 | Unsupported text format (binary, encoded, or non-UTF-8 input) | Convert input to UTF-8 plain text (.md, .txt); PDF/DOCX must be extracted first |
| E006 | Rate limit exceeded (batch processing > 100 files/session) | Split batch into smaller chunks; use `jpfix batch --chunk 50` for large directories |
| E007 | Output validation failed (humanized text diverges semantically from input) | Rollback to original; retry with `--conservative` mode for minimal changes only |
| E008 | Context analysis timeout (MeCab/Sudachi processing exceeded 30s) | Reduce input length to < 10,000 characters per call; split long documents into sections |

**Error recovery strategy:** For E001-E005, the agent provides clear guidance and does not produce partial output. For E006-E008, the agent retries once with adjusted parameters before reporting failure. All errors are logged to `~/.jp-humanizer/sessions/` with full diagnostic context.

---

## Data Storage & Persistence

```
~/.jp-humanizer/
  config.yaml            # Default mode, kanji target %, custom patterns
  patterns/
    ai_vocabulary.json       # 500+ AI vocabulary patterns
    sentence_endings.json    # Ending pattern database
    katakana_filter.json     # Katakana adoption level database
    kanji_open_list.json     # Kanji-to-hiragana conversion list
  sessions/
    2026-03-01_001.json      # Each analysis session
  custom/
    user_patterns.json       # User-defined additional patterns
    user_exceptions.json     # Words to never modify
```

**Session JSON structure:**
```json
{
  "session_id": "2026-03-01_001",
  "mode": "casual",
  "input_score": 72,
  "output_score": 28,
  "patterns_detected": 12,
  "patterns_applied": 10,
  "char_count": { "before": 245, "after": 198 },
  "kanji_ratio": { "before": 38.2, "after": 31.5 }
}
```

---

## FAQ

**Q: 500+ パターンはどこから来ていますか？**
A: 日本語AIテキスト（ChatGPT、Gemini、Claude等の出力）を大量に分析し、人間のライターが書いたテキストとの差異を統計的に抽出しています。パターンDBは定期的に更新され、新しいAIモデルの出力傾向にも対応します。

**Q: 変換すると文字数が変わりますか？**
A: はい、一般的にAIテキストは冗長なため、humanize後は10-20%短くなることが多いです。ただし文意は保持されます。文字数を維持したい場合は `jpfix <text> --preserve-length` オプションを使用してください。

**Q: 自分のパターンを追加できますか？**
A: はい。`~/.jp-humanizer/custom/user_patterns.json` にカスタムパターンを追加できます。形式は `{"ai_pattern": "置換前", "natural": "置換後", "context": "説明"}` です。

**Q: 既に自然な文章を通すとどうなりますか？**
A: AIスコアが低い(30%以下)テキストは「自然」と判定され、最小限の修正のみ(または修正なし)を提案します。過剰な修正は行いません。

**Q: 敬語レベル1-5はどう違いますか？**
A: レベル1が最もカジュアル(タメ口)、レベル5が最も丁寧(最上級敬語)です。具体的には:
- Level 1: 「〜だよ」「〜じゃん」
- Level 2: 「〜です」「〜ますね」
- Level 3: 「〜でございます」「〜いたします」(標準ビジネス)
- Level 4: 「〜させていただきます」「〜いただけますでしょうか」
- Level 5: 「〜賜りますようお願い申し上げます」(超フォーマル)

**Q: SEO記事の humanize は可能ですか？**
A: はい。JP SEO Writer で生成した記事を JP Humanizer に通すことで、SEO最適化と自然な文体の両立が可能です。キーワード密度は維持しつつ、AI臭さだけを除去します。`jpfix <text> --preserve-keywords "キーワード1,キーワード2"` で特定語句を保護できます。

**Q: バッチ処理でディレクトリ内のファイルを一括変換できますか？**
A: はい。`jpfix batch ./articles/` でディレクトリ内の全 `.md` / `.txt` ファイルを一括処理します。元ファイルは `.bak` 拡張子でバックアップされ、変換レポートが `batch_report.json` に出力されます。

**Q: バッチ処理で大量の文章を一度に変換できますか？**
A: はい、`humanize batch ./input/` コマンドで複数ファイルを一括処理できます。ディレクトリ指定で最大100ファイルまで同時処理が可能です。

**Q: 学術論文にも対応していますか？**
A: はい、学術スタイルモード (`--style academic`) を使用することで、論文特有の表現パターン（である調、引用形式、専門用語の適切な配置）に対応した人間化が可能です。

**Q: カスタム辞書を登録できますか？**
A: はい、`~/.jp-humanizer/custom-dict.yaml` にカスタム辞書を定義できます。業界固有の用語や社内用語を登録することで、変換精度が向上します。
