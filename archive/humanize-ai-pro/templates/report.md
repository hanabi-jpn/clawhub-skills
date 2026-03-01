# Humanize AI Pro - Analysis Report

**Generated:** {{timestamp}}
**Input Language:** {{detected_language}} ({{language_confidence}}% confidence)
**Input Length:** {{input_word_count}} words / {{input_char_count}} characters
**Mode:** {{writing_mode}}

---

## AI Detection Score

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     AI Detection Score:  {{ai_score}}%             ║
║     Verdict: {{verdict}}                           ║
║                                                   ║
║     [{{score_bar}}]                                ║
║      0%          25%          50%         100%     ║
║      Human       Mixed        AI-Assist   AI-Gen  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## Statistical Metrics

| Metric | Value | Range | Assessment |
|--------|-------|-------|------------|
| Burstiness Score | {{burstiness_value}} | 0.0 - 1.0 | {{burstiness_assessment}} |
| Type-Token Ratio | {{ttr_value}} | 0.0 - 1.0 | {{ttr_assessment}} |
| Perplexity Estimate | {{perplexity_value}} | low / mid / high | {{perplexity_assessment}} |
| Transition Pattern Score | {{transition_value}} | 0.0 - 1.0 | {{transition_assessment}} |
| Sentence Length CV | {{sentence_cv}} | -- | {{sentence_cv_assessment}} |

### Burstiness Distribution
```
Sentence Lengths:
{{burstiness_histogram}}

Human range (high variance):  ████████████████░░░░ 0.6-1.0
AI range (low variance):      ████░░░░░░░░░░░░░░░░ 0.1-0.4
Your text:                    {{burstiness_indicator}}  {{burstiness_value}}
```

---

## Model Attribution

| Model | Confidence | Matching Patterns |
|-------|------------|-------------------|
| {{model_1_name}} | {{model_1_confidence}}% | {{model_1_pattern_count}} patterns |
| {{model_2_name}} | {{model_2_confidence}}% | {{model_2_pattern_count}} patterns |
| {{model_3_name}} | {{model_3_confidence}}% | {{model_3_pattern_count}} patterns |

**Most Likely Source:** {{most_likely_model}} ({{most_likely_confidence}}% confidence)

---

## Detected AI Patterns

### High Confidence Patterns (weight > 0.7)

{{#high_confidence_patterns}}
| # | Pattern | Category | Count | Model |
|---|---------|----------|-------|-------|
{{/high_confidence_patterns}}

### Medium Confidence Patterns (weight 0.4 - 0.7)

{{#medium_confidence_patterns}}
| # | Pattern | Category | Count | Model |
|---|---------|----------|-------|-------|
{{/medium_confidence_patterns}}

### Low Confidence Patterns (weight < 0.4)

{{#low_confidence_patterns}}
| # | Pattern | Category | Count | Model |
|---|---------|----------|-------|-------|
{{/low_confidence_patterns}}

**Total Patterns Found:** {{total_patterns_found}}

---

## Pattern Category Breakdown

```
{{category_1_name}}     {{category_1_bar}}  {{category_1_count}} ({{category_1_pct}}%)
{{category_2_name}}     {{category_2_bar}}  {{category_2_count}} ({{category_2_pct}}%)
{{category_3_name}}     {{category_3_bar}}  {{category_3_count}} ({{category_3_pct}}%)
{{category_4_name}}     {{category_4_bar}}  {{category_4_count}} ({{category_4_pct}}%)
{{category_5_name}}     {{category_5_bar}}  {{category_5_count}} ({{category_5_pct}}%)
```

---

## Transformation Preview

{{#show_transformation}}

### Before (AI Score: {{before_score}}%)
```
{{before_text_excerpt}}
```

### After (AI Score: {{after_score}}%)
```
{{after_text_excerpt}}
```

### Changes Applied
{{#changes}}
- **{{change_type}}:** {{change_description}}
{{/changes}}

### Score Improvement
```
Before:  [{{before_bar}}] {{before_score}}%
After:   [{{after_bar}}] {{after_score}}%
Delta:   -{{score_delta}} points
```

{{/show_transformation}}

---

## Language-Specific Analysis

{{#english_analysis}}
### English Analysis
| Aspect | Finding |
|--------|---------|
| Contraction Usage | {{contraction_rate}}% (human avg: 40-60%) |
| Passive Voice Rate | {{passive_rate}}% ({{passive_assessment}}) |
| Hedging Density | {{hedging_density}}% |
| Transition Word Density | {{transition_density}}% |
| Mean Sentence Length | {{mean_sentence_length}} words |
| Sentence Length Std Dev | {{sentence_std_dev}} words |
{{/english_analysis}}

{{#japanese_analysis}}
### Japanese Analysis (日本語分析)
| 項目 | 分析結果 |
|------|---------|
| 敬語レベル | {{keigo_level}} ({{keigo_assessment}}) |
| 文末パターン多様性 | {{bunmatsu_diversity}} / 10 |
| 接続詞パターン | {{conjunction_assessment}} |
| 主語省略率 | {{subject_omission_rate}}% (人間の平均: 60-80%) |
| カタカナ語密度 | {{katakana_density}}% |
| 漢字率 | {{kanji_ratio}}% (適正: 25-35%) |
| 文長のばらつき | {{sentence_variance_ja}} ({{sentence_variance_assessment}}) |
| 体言止め使用 | {{taigen_dome_count}} 回 |
{{/japanese_analysis}}

---

## Recommendations for Humanization

{{#recommendations}}
### {{rec_priority}}. {{rec_title}}
**Impact:** {{rec_impact}} | **Difficulty:** {{rec_difficulty}}

{{rec_detail}}

**Example:**
- Before: {{rec_before}}
- After: {{rec_after}}

{{/recommendations}}

---

## Meaning Preservation Check

| Check | Status |
|-------|--------|
| All factual claims preserved | {{fact_check}} |
| Numbers and dates unchanged | {{number_check}} |
| Proper nouns preserved | {{name_check}} |
| Citations maintained | {{citation_check}} |
| Core argument intact | {{argument_check}} |
| Tone appropriate for context | {{tone_check}} |

---

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| AI Score | {{before_score}}% | {{after_score}}% | {{score_delta_display}} |
| Burstiness | {{before_burstiness}} | {{after_burstiness}} | {{burstiness_delta}} |
| TTR | {{before_ttr}} | {{after_ttr}} | {{ttr_delta}} |
| Perplexity | {{before_perplexity}} | {{after_perplexity}} | {{perplexity_delta}} |
| Patterns Eliminated | -- | -- | {{patterns_eliminated}} |
| Word Count | {{before_words}} | {{after_words}} | {{word_delta}} |

---

*Report generated by Humanize AI Pro v1.0.0*
*Mode: {{writing_mode}} | Language: {{detected_language}} | Patterns DB: v{{pattern_db_version}}*
