# Self-Learning Agent Analytics Report

**Generated:** {{timestamp}}
**Scope:** {{scope}} ({{project_name}})
**Period:** {{period_start}} to {{period_end}}

---

## Knowledge Base Overview

| Metric | Global | This Project | Total |
|--------|--------|--------------|-------|
| Active Learnings | {{global_active}} | {{project_active}} | {{total_active}} |
| Archived | {{global_archived}} | {{project_archived}} | {{total_archived}} |
| Promoted | {{promoted_count}} | -- | {{promoted_count}} |
| Merged | {{merged_count}} | {{project_merged}} | {{total_merged}} |
| Conflicted | {{conflicted_count}} | {{project_conflicted}} | {{total_conflicted}} |

---

## Category Distribution

```
syntax       {{syntax_bar}}  {{syntax_count}} ({{syntax_pct}}%)
runtime      {{runtime_bar}}  {{runtime_count}} ({{runtime_pct}}%)
config       {{config_bar}}  {{config_count}} ({{config_pct}}%)
network      {{network_bar}}  {{network_count}} ({{network_pct}}%)
permission   {{permission_bar}}  {{permission_count}} ({{permission_pct}}%)
dependency   {{dependency_bar}}  {{dependency_count}} ({{dependency_pct}}%)
logic        {{logic_bar}}  {{logic_count}} ({{logic_pct}}%)
workflow     {{workflow_bar}}  {{workflow_count}} ({{workflow_pct}}%)
style        {{style_bar}}  {{style_count}} ({{style_pct}}%)
tooling      {{tooling_bar}}  {{tooling_count}} ({{tooling_pct}}%)
```

---

## Learning Type Breakdown

| Type | Count | Avg Impact | Avg Score | Top Example |
|------|-------|------------|-----------|-------------|
| Errors | {{error_count}} | {{error_avg_impact}} | {{error_avg_score}} | {{error_top_example}} |
| Patterns | {{pattern_count}} | {{pattern_avg_impact}} | {{pattern_avg_score}} | {{pattern_top_example}} |
| Preferences | {{pref_count}} | {{pref_avg_impact}} | {{pref_avg_score}} | {{pref_top_example}} |
| Workflows | {{workflow_type_count}} | {{workflow_avg_impact}} | {{workflow_avg_score}} | {{workflow_top_example}} |

---

## Top 10 Highest-Scoring Learnings

| # | Score | Type | Category | Summary | Projects |
|---|-------|------|----------|---------|----------|
{{#top_learnings}}
| {{rank}} | {{score}} | {{type}} | {{category}} | {{summary}} | {{projects}} |
{{/top_learnings}}

---

## Cross-Project Knowledge Graph

```
{{project_1}} ──────── {{shared_count_1_2}} shared learnings ──────── {{project_2}}
    │                                                              │
    │ {{shared_count_1_3}} shared                    {{shared_count_2_3}} shared │
    │                                                              │
{{project_3}} ──────── {{shared_count_3_4}} shared learnings ──────── {{project_4}}
```

**Hub Learnings** (connected to 3+ projects):
{{#hub_learnings}}
- **{{hub_learning_summary}}** -- seen in {{hub_project_count}} projects (score: {{hub_score}})
{{/hub_learnings}}

---

## Promotion Pipeline

### Recently Promoted to Global
{{#recent_promotions}}
- **{{promo_summary}}** -- from {{promo_source_project}} (score: {{promo_score}}, seen in {{promo_project_count}} projects)
{{/recent_promotions}}

### Candidates for Promotion (score 0.3 - 0.7)
{{#promotion_candidates}}
- **{{candidate_summary}}** -- score: {{candidate_score}}, seen in {{candidate_project_count}} projects, needs {{candidate_projects_needed}} more
{{/promotion_candidates}}

### Stale Learnings (no use in 30+ days)
{{#stale_learnings}}
- **{{stale_summary}}** -- last used: {{stale_last_used}}, score: {{stale_score}}
{{/stale_learnings}}

---

## Source Distribution

| Source | Count | Percentage |
|--------|-------|-----------|
| Auto-capture | {{auto_count}} | {{auto_pct}}% |
| Manual | {{manual_count}} | {{manual_pct}}% |
| Import | {{import_count}} | {{import_pct}}% |
| Lateral Transfer | {{lateral_count}} | {{lateral_pct}}% |
| Promotion | {{promotion_source_count}} | {{promotion_source_pct}}% |

---

## Context Budget Analysis

```
Budget: {{budget_total}} tokens
Used:   {{budget_used}} tokens
Free:   {{budget_free}} tokens

[{{budget_bar}}] {{budget_pct}}% utilized

Breakdown:
  Global learnings:   {{budget_global}} tokens ({{budget_global_count}} learnings)
  Project learnings:  {{budget_project}} tokens ({{budget_project_count}} learnings)
  Index overhead:     {{budget_index}} tokens
```

### Compression History (This Period)
{{#compression_events}}
- **{{compress_date}}** -- {{compress_strategy}}: {{compress_before}} -> {{compress_after}} tokens (saved {{compress_saved}} tokens, {{compress_affected}} learnings affected)
{{/compression_events}}

---

## Error Resolution Effectiveness

| Metric | Value |
|--------|-------|
| Errors auto-resolved by past learnings | {{auto_resolved_count}} |
| Average time to re-resolution | {{avg_resolution_time}} |
| Unique error types resolved | {{unique_errors_resolved}} |
| Errors requiring new learning | {{new_errors_count}} |
| Resolution rate | {{resolution_rate}}% |

### Most Frequently Triggered Learnings
{{#frequent_learnings}}
| {{freq_rank}} | {{freq_summary}} | triggered {{freq_count}} times | saved ~{{freq_time_saved}} |
{{/frequent_learnings}}

---

## Trends

### Learning Capture Rate
```
Week 1:  {{week1_bar}}  {{week1_count}} learnings
Week 2:  {{week2_bar}}  {{week2_count}} learnings
Week 3:  {{week3_bar}}  {{week3_count}} learnings
Week 4:  {{week4_bar}}  {{week4_count}} learnings
```

### Knowledge Quality Trend
```
Avg Impact:  {{impact_trend}}
Avg Score:   {{score_trend}}
Compression: {{compress_trend}}
```

---

## Recommendations

{{#recommendations}}
{{rec_index}}. **{{rec_title}}:** {{rec_detail}}
{{/recommendations}}

---

## Export Information

- **Full export available:** `learn export` ({{export_size}} estimated)
- **Global learnings:** {{global_count}} entries
- **Project learnings:** {{project_count}} entries across {{project_total}} projects
- **Archive:** {{archive_count}} entries (recoverable)

---

*Report generated by Self-Learning Agent v1.0.0*
*Context budget: {{budget_used}} / {{budget_total}} tokens*
