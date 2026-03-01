```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   ✍  H U M A N I Z E  A I  P R O  ✍    │
    │                                          │
    │         🤖 ──────────▶ 👤              │
    │                                          │
    │        ┌──────────┐                      │
    │        │ AI Score │                      │
    │        │ ████░░░░ │  73% ──▶ 12%        │
    │        │ "Making  │                      │
    │        │  robots  │  🇺🇸🇯🇵🇨🇳🇰🇷🇪🇸🇫🇷       │
    │        │  sound   │  12 languages        │
    │        │  human." │                      │
    │        └──────────┘                      │
    ╰──────────────────────────────────────────╯
```

# Humanize AI Pro

`✍ 12 Languages` `🇯🇵 Japanese Deep` `📊 AI Scoring` `🔀 5 Modes` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

> Multi-language AI text humanizer with 5 writing modes, statistical analysis, and meaning-preserving transformation. Supports English, Japanese, Chinese, Korean, and 10+ languages.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `writing` `humanize` `ai-detection` `multi-language` `japanese` `content`

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

## FAQ

**Q: How much does it cost in tokens per humanization?**
A: A typical humanization pass costs 1.5-3x the input text length in tokens. The process involves scanning (input tokens), analysis (200-400 tokens for scoring), transformation (output roughly equal to input length), and verification re-scoring (200-400 tokens). Scoring-only mode (`humanize score`) is cheapest at approximately input length + 400 tokens.

**Q: How accurate is the AI detection scoring?**
A: The scoring system provides a statistical estimate, not a definitive judgment. It combines 5 metrics (burstiness, type-token ratio, perplexity, transition patterns, known AI phrases) for a composite score. Accuracy is highest for unmodified AI outputs (85-90% agreement with commercial detectors) and lower for lightly edited or mixed human-AI text. It should be treated as a guideline, not a guarantee.

**Q: Does humanization change the meaning of my text?**
A: No. Meaning preservation is a core design principle. The skill only transforms word choice, sentence structure, transitions, and tone markers. It explicitly never deletes substantive content, changes numbers/dates/names, introduces new claims, or removes citations. After transformation, the factual content should be identical to the original.

**Q: Can I use it for academic papers without risking plagiarism?**
A: Humanize AI Pro transforms AI-generated text to sound more natural, but it does not address academic integrity concerns. Using AI to generate academic work and then disguising it as human-written may violate your institution's policies regardless of detection scores. The `academic` mode is designed for legitimate use cases like polishing AI-assisted drafts where the ideas are your own.

**Q: How does Japanese support compare to English?**
A: Japanese support is a key differentiator with 300+ language-specific patterns covering keigo levels, sentence-ending variations, katakana overuse, kanji/hiragana balance, and subject omission. English has 500+ patterns but Japanese analysis goes deeper into cultural and stylistic nuances that English-only tools miss entirely. The 5 writing modes each have Japanese-specific transformation rules.

**Q: Does it work offline?**
A: Yes. All pattern detection and statistical analysis happens within your LLM session. No external API calls are made for scoring or transformation. The pattern databases are embedded in the skill instructions. No network access is required at any point.

**Q: Can I use Humanize AI Pro with Summarize Pro?**
A: Yes, this is a common and effective combination. Use Summarize Pro first to condense content, then apply Humanize AI Pro to make the summary sound natural. The pipeline is: source content -> `summarize` -> `humanize`. Both skills operate independently and their outputs are compatible.

**Q: Does it support batch processing of multiple files?**
A: Yes. Use `humanize batch <directory>` to process all text files in a directory. Each file is processed independently with the same mode and language settings. Results include before/after AI scores for each file. Processing speed depends on your LLM's throughput — expect roughly 1-3 seconds per file for typical document lengths.

**Q: Can it detect which specific AI model generated the text?**
A: It provides model-specific pattern matching for ChatGPT, Claude, and Gemini. Each model has distinctive tells (e.g., ChatGPT's "Certainly!", Claude's "nuanced", Gemini's "Absolutely!"). The detection reports which model's patterns are most prevalent, but this is probabilistic — heavily edited text or newer model versions may not match known patterns.

**Q: How do I customize the transformation strength?**
A: The 5 writing modes (academic, business, casual, creative, social) control the transformation style rather than strength. For lighter transformations, use `academic` or `business` modes which preserve more formal structure. For heavier transformations, use `casual` or `social` modes which introduce more natural speech patterns. There is no explicit "strength" slider — the mode selection determines how aggressively the text is restyled.

## Error Handling

| Error | Cause | Agent Action |
|-------|-------|-------------|
| Language detection fails | Input text is too short (under 20 words) or contains mixed languages | Default to English. Inform user that auto-detection was inconclusive and suggest using `--lang <code>` to specify the language explicitly. |
| Unsupported language code | User specified a `--lang` code not in the supported set | Report the unsupported code and list all 12 supported languages. Do not attempt transformation in an unsupported language. |
| Transformation increases AI score | Humanized output scores higher than the original (rare edge case) | Discard the transformation. Retry with a different writing mode. If still higher after retry, return the original text with a note explaining the issue and suggest trying a different mode manually. |
| Empty input text | User provides empty string or whitespace-only input | Report that no text was provided. Prompt user to provide text content or a file path. Do not attempt to score or transform empty input. |
| File read error | Specified file path does not exist or is not readable | Report the exact file path and error (not found, permission denied, unsupported format). Suggest verifying the path or providing the text directly as inline input. |
| Batch directory empty | `humanize batch` is run on a directory with no text files | Report that no processable text files were found in the directory. List the file types the skill supports (.txt, .md, .doc). Do not create empty output files. |
| Scoring metrics out of range | Statistical calculation produces NaN or infinity (e.g., single-sentence input) | Clamp all metrics to valid ranges (0-1 for sub-scores, 0-100% for overall). Note in the output that the text was too short for reliable statistical analysis. Recommend a minimum of 100 words for accurate scoring. |
| Pattern database version mismatch | AI models release new versions with different writing patterns | The embedded pattern database may not catch patterns from the newest model versions. Report that some patterns may be undetected. The scoring still works via statistical metrics even when pattern matching is incomplete. |
| Meaning preservation violation detected | Transformation accidentally alters a factual claim or number | This should not happen under normal operation. If detected during verification, discard the transformation and retry. Log the specific violation for debugging. Return original text if retry also fails. |
| Concurrent batch file conflict | Two batch processes attempt to write to the same output directory | Use file locking to prevent conflicts. If a lock is detected, queue the second batch and process sequentially. Report the queuing to the user. |
