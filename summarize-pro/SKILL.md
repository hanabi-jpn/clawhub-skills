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

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Modes](https://img.shields.io/badge/modes-7-orange)]()

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

```
> summarize https://example.com/blog/ai-trends-2026

📄 Fetching: https://example.com/blog/ai-trends-2026
  Source: Web page | Language: English | Words: 2,847

## Summary: AI Trends Shaping 2026
- Multi-modal AI models now handle text, image, audio, and video in a single pipeline
- Enterprise adoption reached 78%, up from 55% in 2024
  - Manufacturing and healthcare lead with 89% and 82% adoption respectively
- Open-source models closed the gap with proprietary offerings, reaching 92% benchmark parity
- AI regulation frameworks enacted in 43 countries, with EU AI Act enforcement beginning Q1
- Agentic AI workflows replaced 34% of traditional automation pipelines

**Source:** example.com/blog/ai-trends-2026 | **Length:** 2,847 words | **Processed:** 2026-03-01
```

**`summarize <source> --mode <mode>`** — Choose output format:
- `bullets`, `executive`, `academic`, `mindmap`, `table`, `timeline`, `qa`

```
> summarize quarterly-report.pdf --mode executive

📄 Reading: quarterly-report.pdf
  Source: PDF (12 pages) | Language: English | Words: 4,521

## Executive Brief: Q4 2025 Quarterly Report

### Situation
Company revenue grew 23% YoY to $45.2M in Q4, driven primarily by
enterprise SaaS expansion in APAC markets.

### Key Findings
1. ARR reached $180M (+31% YoY), exceeding $170M target
2. Customer churn decreased to 4.2% (from 6.1% in Q3)
3. APAC revenue grew 67%, now representing 28% of total revenue

### Risk Factors
- Rising infrastructure costs (+18%) eroding margins
- Two enterprise deals ($2.1M combined) slipped to Q1

### Recommendations
1. Accelerate APAC hiring to sustain growth trajectory
2. Renegotiate cloud provider contracts before Q2 renewal

### Bottom Line
Strong quarter with all KPIs met except gross margin, which needs
attention as infrastructure costs scale.

**Source:** quarterly-report.pdf | **Length:** 4,521 words | **Processed:** 2026-03-01
```

**`summarize <source> --depth <level>`** — Choose detail level:
- `shallow`, `standard`, `deep`, `exhaustive`

```
> summarize research-paper.pdf --depth shallow

📄 Reading: research-paper.pdf
  Source: PDF (28 pages) | Language: English | Words: 8,934

**TL;DR:** Researchers demonstrate a novel attention mechanism that reduces
transformer inference latency by 40% while maintaining 99.2% accuracy on
standard benchmarks, with significant implications for edge deployment.

**Source:** research-paper.pdf | **Length:** 8,934 words | **Depth:** shallow | **Processed:** 2026-03-01
```

**`summarize <source> --lang <code>`** — Output language

```
> summarize https://example.com/press-release --lang ja

📄 Fetching: https://example.com/press-release
  Source: Web page | Language: English → Japanese | Words: 1,203

## 要約: 新製品発表プレスリリース
- AIアシスタント「Nova」の一般提供を2026年4月に開始
- 12言語に対応、enterprise（エンタープライズ）プラン月額$49から
- Beta版で500社が導入済み、顧客満足度92%を記録
- API連携でSalesforce、Slack、Microsoft Teamsと統合可能
- SOC 2 Type IIおよびGDPR準拠のsecurity（セキュリティ）認証を取得

**ソース:** example.com/press-release | **文字数:** 1,203語 | **処理日:** 2026-03-01
```

**`summarize <source> --chain-of-density`** — Force CoD compression

```
> summarize long-report.pdf --chain-of-density

📄 Reading: long-report.pdf
  Source: PDF (45 pages) | Language: English | Words: 15,230

🔗 Chain-of-Density Compression:
  Pass 1 — Entity extraction (487 words, 34 entities captured)
  Pass 2 — Density compression (231 words, 34/34 entities retained)
  Pass 3 — Polish & readability (198 words, final)

## Summary: Global Supply Chain Resilience Report 2025
- Supply chain disruptions decreased 28% YoY (ITC data), though semiconductor
  lead times remain at 18 weeks (vs. pre-2020 baseline of 12 weeks). The $2.1T
  reshoring investment across US, EU, and Japan created 340K manufacturing jobs.
  ASEAN emerged as the primary "China+1" destination with 43% of redirected FDI,
  led by Vietnam ($28B) and Indonesia ($19B). AI-driven demand forecasting
  reduced inventory waste by 31% among early adopters (McKinsey, n=850 firms).
  Climate events caused $67B in logistics losses, prompting 62% of Fortune 500
  companies to add climate risk to supplier evaluation criteria. The WTO
  projects 3.2% trade volume growth in 2026, contingent on no further
  geopolitical escalation.

**Source:** long-report.pdf | **Length:** 15,230 words | **CoD:** 3-pass | **Processed:** 2026-03-01
```

**`summarize <src1> <src2> --compare`** — Comparison mode

```
> summarize analyst-report-a.pdf analyst-report-b.pdf --compare

📄 Reading: analyst-report-a.pdf (Goldman Sachs)
📄 Reading: analyst-report-b.pdf (Morgan Stanley)

## Comparison: Goldman Sachs vs Morgan Stanley — AI Market Outlook

### Agreement
- Both project AI market to exceed $900B by 2028
- Both identify healthcare and finance as top adoption sectors
- Both expect open-source models to capture 35-40% market share

### Disagreement
- **Growth rate**: GS projects 34% CAGR, MS projects 28% CAGR
- **Regulation impact**: GS sees minimal drag (−2%), MS sees significant drag (−8%)
- **China market**: GS bullish ($180B by 2028), MS cautious ($120B)

### Unique to Goldman Sachs
- Detailed analysis of AI infrastructure spending ($200B capex forecast)
- Semiconductor supply chain risk assessment

### Unique to Morgan Stanley
- Consumer AI adoption survey data (n=12,000)
- AI talent shortage projections by region

### Synthesis
Both reports agree on strong AI market growth but diverge on pace and risk
factors. Goldman Sachs takes a more optimistic view driven by capex data,
while Morgan Stanley emphasizes regulatory and talent headwinds.

**Sources:** analyst-report-a.pdf, analyst-report-b.pdf | **Processed:** 2026-03-01
```

**`summarize cache list`** — Show cached summaries

```
> summarize cache list

📦 Cached Summaries (7 entries)

| # | Source | Mode | Depth | Lang | Cached | Expires | Size |
|---|--------|------|-------|------|--------|---------|------|
| 1 | ai-trends-2026 (web) | bullets | standard | en | Mar 01 | Mar 08 | 1.2 KB |
| 2 | quarterly-report.pdf | executive | standard | en | Mar 01 | Mar 08 | 2.1 KB |
| 3 | research-paper.pdf | bullets | shallow | en | Feb 28 | Mar 07 | 0.4 KB |
| 4 | long-report.pdf | bullets | deep | en | Feb 27 | Mar 06 | 3.8 KB |
| 5 | press-release (web) | bullets | standard | ja | Feb 27 | Mar 06 | 1.5 KB |
| 6 | analyst-a.pdf | bullets | standard | en | Feb 25 | Mar 04 | 1.8 KB |
| 7 | analyst-b.pdf | bullets | standard | en | Feb 25 | Mar 04 | 1.9 KB |

Total: 7 entries | 12.7 KB | Oldest expires: Mar 04
```

**`summarize cache clear`** — Clear cache

```
> summarize cache clear

🗑 Clearing summary cache...

  Deleted: 7 cached summaries
  Freed: 12.7 KB
  Cache directory: .summarize-pro/cache/

  ✅ Cache cleared. Next summarization will generate fresh results.
```

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

## Comparison with Alternatives

| Feature | ChatGPT Summarize | TLDR This | Wordtune Read | **Summarize Pro** |
|---------|-------------------|-----------|---------------|-------------------|
| Output modes | 1 (plain text) | 1 (bullets) | 1 (bullets) | **7 modes (bullets/exec/academic/mindmap/table/timeline/qa)** |
| Languages | Multi (no control) | English only | English only | **8 languages with auto-detect + override** |
| Compression method | Single-pass | Extractive | Extractive | **Chain-of-Density (3-pass, 40-60% more entities)** |
| Depth control | Manual prompt | Short/long | None | **4 semantic levels (shallow/standard/deep/exhaustive)** |
| Multi-source comparison | No | No | No | **Yes (side-by-side analysis)** |
| Caching | No | Server-side | Server-side | **Local SHA-256 content-hash cache** |
| Source types | Text/URL | URL only | URL only | **PDF, URL, YouTube, code, text, markdown** |
| Code summarization | Generic | No | No | **Logic flow analysis** |
| Privacy | Cloud-processed | Cloud-processed | Cloud-processed | **Local LLM (no external service)** |
| Cost | $20/mo (ChatGPT+) | Free / $3.99/mo | $9.99/mo | **Free (uses your existing LLM)** |
| Offline support | No | No | No | **Yes (local files)** |
| Template enforcement | No | No | No | **Strict mode templates** |

## FAQ

**Q: How much does each summarization cost in tokens?**
A: Token usage depends on the depth level and source size. `shallow` summaries use 100-300 tokens of output. `standard` uses 300-600 tokens. `deep` with Chain-of-Density uses 800-1500 tokens (3 passes). `exhaustive` can use 2000-4000 tokens. Input tokens depend entirely on the source content length. Cached summaries cost zero tokens on subsequent requests.

**Q: Does Chain-of-Density slow down summarization?**
A: Yes, moderately. CoD runs 3 sequential passes (extract, compress, polish), taking roughly 3x longer than a single-pass summary. For `standard` depth, CoD is not used. It activates automatically for `deep` and `exhaustive` depths, or when explicitly requested with `--chain-of-density`. The quality improvement is significant — summaries retain 40-60% more key entities.

**Q: Can I summarize private or sensitive documents?**
A: Yes. All processing happens within your current LLM session. Cached summaries are stored locally in `.summarize-pro/cache/` on your filesystem. No content is sent to external services beyond your configured LLM provider. You can disable caching entirely by passing `--no-cache` to prevent any local storage of sensitive content.

**Q: What are the limitations on source size?**
A: The main limitation is your LLM's context window. For very large documents (100+ pages), the skill automatically chunks the content and summarizes in segments before creating a unified summary. YouTube transcripts are limited by the availability of captions. JavaScript-heavy web pages may return incomplete content since the fetcher does not execute client-side scripts.

**Q: Can I use Summarize Pro with other skills?**
A: Yes. Common combinations include: Summarize Pro + Self-Learning Agent (summarize error logs for pattern detection), Summarize Pro + Humanize AI Pro (summarize then humanize for natural-sounding briefs), and Summarize Pro + Nano Banana Ultra (summarize content then generate visual summaries). Each skill operates independently on the output of the other.

**Q: Does it support offline summarization?**
A: The summarization engine itself runs through your LLM, so it works wherever your LLM works. URL fetching (web pages, YouTube) requires network access. Local file summarization (PDFs, code, text) works fully offline. Cached summaries are served from local disk without any network dependency.

**Q: How does the caching system work?**
A: Caching uses a SHA-256 hash of the source content combined with the mode, depth, and language settings as the cache key. If the same content is summarized with the same settings, the cached result is returned instantly. Cache entries expire after 7 days by default (configurable in `.summarize-pro/config.json`). Use `summarize cache list` to inspect cached entries and `summarize cache clear` to purge.

**Q: Can I customize the output templates?**
A: The 7 built-in modes (bullets, executive, academic, mindmap, table, timeline, qa) use fixed templates to ensure consistent formatting. You cannot add custom templates directly, but you can post-process any mode's output. For specialized formats, use `executive` or `qa` mode as a starting point and modify the output in a follow-up instruction.

**Q: How does multi-language summarization handle technical terms?**
A: When translating, the skill maintains technical terms in their original language with a translation in parentheses on first occurrence. For example, summarizing an English paper into Japanese would render "machine learning" as "machine learning（機械学習）" on first use, then use the translated term thereafter. This preserves searchability and precision.

**Q: What happens if the source URL is behind a paywall or requires authentication?**
A: The skill will fetch whatever content is publicly accessible at the URL. If the page returns a login wall or paywall content, the summary will be based on whatever text is available (often just the headline and preview). The skill will note this limitation in the output metadata. For paywalled content, save the article locally and summarize the local file instead.

## Error Handling

| Error | Cause | Agent Action |
|-------|-------|-------------|
| URL fetch fails (404/500) | Target web page is unavailable or URL is invalid | Report the HTTP status code and URL. Suggest verifying the URL or trying again later. Do not attempt to summarize partial error page content. |
| YouTube transcript unavailable | Video has no captions or transcript is disabled by creator | Report that no transcript is available. Suggest checking if the video has auto-generated captions enabled, or provide the video URL for manual transcript extraction. |
| PDF read error | Corrupted PDF, password-protected, or scanned image-only PDF | Report the specific error (corruption, password, or image-based). For password-protected PDFs, ask user for the password. For image-based PDFs, note that OCR is required and suggest an OCR tool. |
| Context window exceeded | Source content is too large for a single LLM pass | Automatically chunk the content into segments that fit within the context window. Summarize each chunk independently, then create a unified meta-summary. Log the chunking in output metadata. |
| Cache read failure | Corrupted cache file or incompatible cache format | Delete the corrupted cache entry, log the event, and re-generate the summary from source. Cache corruption does not block summarization. |
| Unsupported language code | User specified a `--lang` code not in the supported 8 languages | Report the unsupported code and list all supported language codes (en, ja, zh, ko, es, fr, de, pt). Do not attempt to summarize in an unsupported language. |
| Comparison mode with single source | User used `--compare` but provided only one source | Report that comparison mode requires 2 or more sources. Fall back to standard summarization of the single source and inform the user. |
| Chain-of-Density pass failure | One of the 3 CoD passes produces empty or degraded output | Retry the failed pass once. If it fails again, fall back to single-pass summarization and note the degradation in output. Never return an empty summary. |
| File encoding error | Source file uses an encoding other than UTF-8 | Attempt to detect encoding (UTF-16, Shift-JIS, ISO-8859-1). If detection succeeds, convert and proceed. If detection fails, report the encoding issue and suggest converting the file to UTF-8. |
| Rate limit on URL fetching | Too many URL fetches in a short period | Wait 5 seconds and retry once. If still rate-limited, report the issue and suggest fetching the URL manually or providing the content as a local file. |
