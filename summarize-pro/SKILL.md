```
    ╭──────────────────────────────────────────╮
    │                                          │
    │    📝 S U M M A R I Z E  P R O 📝       │
    │                                          │
    │          📄📄📄📄📄                     │
    │           ╲  ╲ │ ╱  ╱                    │
    │            ╲  ╲│╱  ╱                     │
    │             ▼  ▼  ▼                      │
    │          ┌──────────┐                    │
    │          │  ✨TL;DR │  "7 modes.         │
    │          │  ══════  │   8 languages.     │
    │          │  ▪ ▪ ▪   │   Zero fluff."     │
    │          └──────────┘                    │
    ╰──────────────────────────────────────────╯
```

# Summarize Pro

`📝 7 Modes` `🌍 8 Languages` `🔗 Chain-of-Density` `💾 Cached` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

> Advanced multi-format summarization with 7 output modes, multi-language support, chain-of-density compression, and intelligent caching.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `summarization` `productivity` `multi-language` `content` `documents`

---

## Overview

Summarize Pro transforms any content — PDFs, web pages, YouTube videos, code files, slide decks — into exactly the format you need. Choose from 7 output modes, 8 languages, and 4 depth levels. Powered by Chain-of-Density compression for information-dense summaries that miss nothing important.

```
┌───────────────────────────────────────────┐
│           SUMMARIZE PRO PIPELINE          │
│                                           │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│  │  FETCH  │─▶│ EXTRACT  │─▶│ ANALYZE │  │
│  │ Source  │  │  Text    │  │ Content │  │
│  └─────────┘  └──────────┘  └─────────┘  │
│                                  │        │
│       ┌──────────────────────────┘        │
│       ▼                                   │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  CHAIN   │─▶│  FORMAT  │─▶│ OUTPUT  │ │
│  │of Density│  │  7 Modes │  │  Cache  │ │
│  └──────────┘  └──────────┘  └─────────┘ │
└───────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Summarize Pro**. When the user asks you to summarize content, follow these instructions:

### Source Handling

Determine the source type and extract content:

1. **URL (web page)**:
   - Fetch the page content
   - Extract main article text using readability heuristics (ignore nav, ads, footer)
   - If JavaScript-heavy, note that content may be incomplete

2. **URL (YouTube)**:
   - Extract video ID from URL
   - Fetch transcript via YouTube API or yt-dlp
   - If no transcript available, note this limitation
   - Include video title, channel, and duration in metadata

3. **Local file (PDF)**:
   - Read the PDF content
   - If scanned/image-based, note OCR may be needed
   - Extract text, tables, and figure captions

4. **Local file (code)**:
   - Read source code files
   - Summarize: purpose, main functions/classes, dependencies, architecture
   - Do NOT just echo the code — explain the logic flow

5. **Local file (text/markdown/docs)**:
   - Read and extract all text content
   - Preserve headings and structure for analysis

6. **Multiple sources**:
   - Process each source independently
   - If `--compare` flag: generate comparison analysis
   - Otherwise: generate unified cross-document synthesis

### Chain-of-Density Compression

When `--chain-of-density` is specified (or for `deep`/`exhaustive` depth):

**Pass 1 — Entity Extraction:**
- Generate a verbose summary capturing ALL named entities, key numbers, dates, and facts
- Length: ~500 words

**Pass 2 — Density Compression:**
- Rewrite the summary to be 50% shorter while maintaining ALL entities
- Replace verbose phrases with concise equivalents
- Merge related sentences

**Pass 3 — Polish:**
- Final readability pass
- Ensure logical flow between sentences
- Verify no key information was lost
- Length: ~150-200 words of information-dense content

### 7 Output Modes

**`bullets`** (default):
```markdown
## Summary: [Title]
- Key point 1
- Key point 2
  - Sub-point with supporting detail
- Key point 3
- Key point 4
- Key point 5

**Source:** [URL/filename] | **Length:** [word count] | **Processed:** [date]
```

**`executive`**:
```markdown
## Executive Brief: [Title]

### Situation
[1-2 sentences on context]

### Key Findings
1. [Finding with data point]
2. [Finding with data point]
3. [Finding with data point]

### Risk Factors
- [Risk 1]
- [Risk 2]

### Recommendations
1. [Action item]
2. [Action item]

### Bottom Line
[1 sentence conclusion]
```

**`academic`**:
```markdown
## Abstract: [Title]

**Background:** [Context and prior work]
**Methods:** [How information was gathered/analyzed]
**Results:** [Key findings with data]
**Conclusion:** [Implications and significance]
**Keywords:** [5-8 relevant terms]
```

**`mindmap`**:
```
[Central Topic]
├── Branch 1: [Theme]
│   ├── Detail A
│   ├── Detail B
│   └── Detail C
├── Branch 2: [Theme]
│   ├── Detail D
│   └── Detail E
├── Branch 3: [Theme]
│   ├── Detail F
│   ├── Detail G
│   └── Detail H
└── Branch 4: [Theme]
    ├── Detail I
    └── Detail J
```

**`table`**:
```markdown
## Summary Table: [Title]

| Aspect | Details | Importance |
|--------|---------|------------|
| [Key 1] | [Detail] | High/Med/Low |
| [Key 2] | [Detail] | High/Med/Low |
| [Key 3] | [Detail] | High/Med/Low |
```

**`timeline`**:
```markdown
## Timeline: [Title]

- **[Date/Time 1]** — [Event description]
- **[Date/Time 2]** — [Event description]
- **[Date/Time 3]** — [Event description]
- **[Current/Latest]** — [Most recent development]
```

**`qa`**:
```markdown
## Q&A Summary: [Title]

**Q: [Anticipated question 1]?**
A: [Answer based on content]

**Q: [Anticipated question 2]?**
A: [Answer based on content]

**Q: [Anticipated question 3]?**
A: [Answer based on content]

**Q: What's the bottom line?**
A: [Concise conclusion]
```

### Depth Levels

- **`shallow`**: 1-2 sentence TL;DR. Max 50 words.
- **`standard`** (default): 3-5 key points. Max 200 words.
- **`deep`**: Comprehensive with sections. Max 500 words. Uses Chain-of-Density.
- **`exhaustive`**: Complete breakdown. Max 1500 words. Preserves all significant details.

### Multi-Language Support

Detect source language automatically. Output in source language by default.

Override with `--lang <code>`:
- `en` English, `ja` Japanese, `zh` Chinese, `ko` Korean
- `es` Spanish, `fr` French, `de` German, `pt` Portuguese

When translating: maintain technical terms in original language with translation in parentheses.

### Comparison Mode

When `--compare` is used with multiple sources:

```markdown
## Comparison: [Source 1] vs [Source 2]

### Agreement
- [Points both sources agree on]

### Disagreement
- [Point]: Source 1 says [X], Source 2 says [Y]

### Unique to Source 1
- [Points only in Source 1]

### Unique to Source 2
- [Points only in Source 2]

### Synthesis
[Overall assessment considering both sources]
```

### Intelligent Caching

- Store summaries in `.summarize-pro/cache/`
- Key: SHA-256 hash of source content + mode + depth + language
- TTL: 7 days (configurable)
- Before re-summarizing, check cache first
- `summarize cache list` — Show cached summaries with metadata
- `summarize cache clear` — Delete all cached summaries

### Commands

**`summarize <source>`** — Summarize with defaults (bullets, standard depth, auto language)

**`summarize <source> --mode <mode>`** — Choose output format:
- `bullets`, `executive`, `academic`, `mindmap`, `table`, `timeline`, `qa`

**`summarize <source> --depth <level>`** — Choose detail level:
- `shallow`, `standard`, `deep`, `exhaustive`

**`summarize <source> --lang <code>`** — Output language

**`summarize <source> --chain-of-density`** — Force CoD compression

**`summarize <src1> <src2> --compare`** — Comparison mode

**`summarize cache list`** — Show cached summaries

**`summarize cache clear`** — Clear cache

### Quality Standards

Every summary MUST:
- Preserve all factual claims, numbers, dates, and names
- Never introduce information not present in the source
- Include source attribution and processing metadata
- Be grammatically correct in the output language
- Follow the exact template for the selected mode

## Why Summarize Pro vs Summarize?

| Feature | Summarize | Summarize Pro |
|---------|-----------|---------------|
| Output modes | 1 (plain text) | **7 (bullets, exec, academic, mindmap, table, timeline, qa)** |
| Languages | English only | **8 languages with auto-detection** |
| Compression | Basic truncation | **Chain-of-Density (3-pass)** |
| Depth control | Length parameter | **4 semantic depth levels** |
| Comparison | No | **Yes (multi-source)** |
| Caching | No | **SHA-256 content-hash caching** |
| Code files | No | **Yes (logic flow summarization)** |
