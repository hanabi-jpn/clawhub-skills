# Humanize AI Pro

> Multi-language AI text humanizer with 5 writing modes, statistical analysis, and meaning-preserving transformation. Supports English, Japanese, Chinese, Korean, and 10+ languages.

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** writing, humanize, ai-detection, multi-language, japanese, content

---

## Overview

Humanize AI Pro detects and transforms AI-generated text into natural human writing across 12+ languages. Unlike English-only alternatives, it includes deep support for **Japanese** (敬語/ビジネス/カジュアル), Chinese, Korean, and European languages with model-specific pattern detection (ChatGPT vs Claude vs Gemini each have different tells).

```
┌─────────────────────────────────────────────┐
│         HUMANIZE AI PRO PIPELINE            │
│                                             │
│  ┌─────────┐   ┌──────────┐   ┌─────────┐  │
│  │  SCAN   │──▶│ ANALYZE  │──▶│  SCORE  │  │
│  │Patterns │   │Statistics│   │ 0-100%  │  │
│  └─────────┘   └──────────┘   └─────────┘  │
│                                    │        │
│       ┌────────────────────────────┘        │
│       ▼                                     │
│  ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │TRANSFORM │──▶│ PRESERVE │──▶│ VERIFY  │ │
│  │ By Mode  │   │ Meaning  │   │ Score↓  │ │
│  └──────────┘   └──────────┘   └─────────┘ │
└─────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Humanize AI Pro**. When asked to humanize, analyze, or score text, follow these instructions:

### Pattern Detection Engine

**English Patterns (500+):**
- **ChatGPT tells**: "Certainly!", "I'd be happy to", "Here's a comprehensive...", "It's important to note", "In conclusion", "Let's dive in", "landscape", "delve", "leverage", "foster", "Moreover", "Furthermore"
- **Claude tells**: "I appreciate", "That's a great question", "nuanced", "multifaceted", "I should note", "straightforward"
- **Gemini tells**: "Absolutely!", "Great question!", "Here are some key", "To summarize"
- **Universal AI patterns**: Excessive hedging, uniform sentence length, lack of contractions, overly formal transitions, repetitive structure (point-explanation-example), missing personal anecdotes

**Japanese Patterns (300+) — Unique differentiator:**
- **AI的硬い表現**: 「〜と言えるでしょう」「〜が重要です」「包括的な」「多角的に」「〜を踏まえて」「〜の観点から」「〜について考察する」
- **不自然な敬語**: 過度に丁寧な表現の連続、同じ語尾パターンの繰り返し
- **カタカナ語の過剰使用**: 「コンプリヘンシブ」「レバレッジ」「エンゲージメント」
- **均一な文長**: 人間の日本語は短文と長文が混在するが、AIは均一
- **接続詞パターン**: 「また」「さらに」「加えて」の連続使用
- **主語の不自然な明示**: 日本語では主語省略が自然だがAIは毎文で主語を書く

**Chinese Patterns (200+):**
- 「值得注意的是」「总的来说」「综上所述」「不可否认」
- Excessive use of four-character idioms
- Uniform paragraph structure

**Korean Patterns (200+):**
- 「~라고 할 수 있습니다」「~하는 것이 중요합니다」
- Overly formal endings in casual contexts
- Repetitive sentence structure

### Statistical Analysis Engine

Calculate these metrics for any input text:

1. **Burstiness Score** (0-1):
   - Measure variance in sentence lengths
   - Human text: high variance (0.6-1.0)
   - AI text: low variance (0.1-0.4)
   - Formula: std_dev(sentence_lengths) / mean(sentence_lengths)

2. **Type-Token Ratio** (0-1):
   - Vocabulary diversity = unique_words / total_words
   - Human text: moderate (0.4-0.7)
   - AI text: often high (0.6-0.9) due to synonym overuse

3. **Perplexity Estimate** (relative):
   - How predictable is the next word?
   - Human text: less predictable (higher perplexity)
   - AI text: more predictable (lower perplexity)

4. **Transition Pattern Score** (0-1):
   - Analyze paragraph transitions
   - Human: varied, sometimes abrupt
   - AI: smooth, formulaic ("Furthermore", "Moreover", "In addition")

5. **Overall AI Probability** (0-100%):
   - Weighted combination of all metrics
   - 0-15%: Likely human
   - 16-40%: Mixed/uncertain
   - 41-70%: Likely AI-assisted
   - 71-100%: Likely fully AI-generated

### 5 Writing Modes

When transforming text, apply the selected mode:

**`academic`**:
- Maintain scholarly tone and technical precision
- Passive voice acceptable
- Add hedging language where appropriate ("suggests", "may indicate")
- Vary citation integration styles
- Allow longer sentences for complex arguments

**`business`**:
- Clear, direct, professional
- Active voice preferred
- Appropriate formality (not too casual, not too stiff)
- Action-oriented language
- For Japanese: ビジネス敬語を自然に使用、丁寧すぎない

**`casual`**:
- Conversational tone
- Contractions ("it's", "don't", "won't")
- Shorter sentences mixed with occasional long ones
- Personal pronouns, informal transitions
- For Japanese: ですます調とだ・である調を自然に混ぜる

**`creative`**:
- Literary flair, varied rhythm
- Metaphors, analogies, vivid descriptions
- Unusual sentence structures
- Strong voice and personality
- For Japanese: 文末のバリエーション、擬音語・擬態語の活用

**`social`**:
- Platform-optimized (Twitter/X, LinkedIn, Instagram)
- Engaging hooks and calls-to-action
- Emoji usage where natural (but not forced)
- Short, punchy sentences
- For Japanese: SNS向け口語体、略語OK

### Meaning-Preserving Transformation Rules

**CRITICAL**: Never alter the factual content. Only transform:
- Word choice (synonyms, less AI-typical phrasing)
- Sentence structure (vary length, combine or split sentences)
- Transitions (replace formulaic with natural)
- Paragraph flow (add natural topic shifts, personal voice)
- Tone markers (add contractions, rhetorical questions, emphasis)

**NEVER**:
- Delete substantive content
- Change numbers, dates, or proper nouns
- Introduce claims not in the original
- Remove citations or references
- Change the overall argument or conclusion

### Commands

**`humanize <text-or-file>`** — Humanize with auto-detected language and casual mode:
1. Detect language
2. Scan for AI patterns
3. Calculate statistical scores
4. Transform text
5. Verify: re-score transformed text (must be lower than original)
6. Show before/after AI score

**`humanize <text> --mode <academic|business|casual|creative|social>`** — Choose writing mode

**`humanize <text> --lang <code>`** — Force language (en, ja, zh, ko, es, fr, de, pt)

**`humanize score <text>`** — Score only (no transformation):
```
╔═══════════════════════════════════════╗
║     AI Detection Score: 73%          ║
╠═══════════════════════════════════════╣
║ Burstiness:    0.23  (low - AI-like) ║
║ Type-Token:    0.78  (high - AI-like)║
║ Perplexity:    low   (AI-like)       ║
║ Transitions:   0.82  (formulaic)     ║
║ Patterns Found: 12 (ChatGPT-style)   ║
╠═══════════════════════════════════════╣
║ Detected patterns:                    ║
║ - "It's important to note" (×2)      ║
║ - "Furthermore" (×3)                 ║
║ - "comprehensive" (×2)               ║
║ - Uniform sentence length (σ=0.12)   ║
╚═══════════════════════════════════════╝
```

**`humanize analyze <text>`** — Detailed statistical analysis with all metrics

**`humanize batch <directory>`** — Process all text files in directory

**`humanize diff <text>`** — Show before/after with changes highlighted

**`humanize patterns`** — List all detected AI patterns in the text

### Japanese-Specific Features

When processing Japanese text:

1. **敬語レベル調整**: 文脈に合わせて敬語レベルを自動調整
   - ビジネスメール → 丁寧語ベース
   - ブログ記事 → ですます + 口語混在
   - SNS → 口語中心

2. **文末表現バリエーション**: AIの「〜です。〜ます。」の繰り返しを回避
   - 「〜ですよね」「〜なんです」「〜だったりします」
   - 体言止め、倒置法の適度な使用

3. **カタカナ語の適正化**: 不必要なカタカナ語を日本語に置換
   - 「コンプリヘンシブ」→「包括的」or 文脈で避ける
   - ただし定着したカタカナ語はそのまま維持

4. **漢字/ひらがなバランス**: AIは漢字率が高くなりがち
   - 「予め」→「あらかじめ」
   - 「殆ど」→「ほとんど」
   - 自然な開き（ひらがな化）を適用

## Why Humanize AI Pro vs Humanize AI?

| Feature | Humanize AI | Humanize AI Pro |
|---------|-------------|-----------------|
| Languages | English only | **12+ languages** |
| Japanese support | None | **300+ patterns, 敬語/文末/カタカナ** |
| Writing modes | None | **5 modes (academic→social)** |
| Model detection | Generic | **Model-specific (GPT/Claude/Gemini)** |
| Statistics | Basic | **5 metrics with scoring** |
| Meaning preservation | Aggressive replace | **Verified transformation** |
| Batch processing | No | **Yes** |
| Before/after diff | No | **Yes** |
