# Context Health Dashboard

**Session:** {{session_id}}
**Model:** {{model_name}}
**Updated:** {{timestamp}}
**Turn:** {{current_turn}} / ~{{estimated_max_turns}}

---

## Context Usage

```
[{{usage_bar}}] {{usage_pct}}% ({{used_tokens}} / {{max_tokens}} tokens)
```

| Status | Indicator |
|--------|-----------|
| Health | {{health_icon}} {{health_label}} |
| Estimated Turns Remaining | ~{{turns_remaining}} |
| Estimated Cost So Far | ${{cost_so_far}} |
| Cost per Turn (avg) | ${{cost_per_turn}} |

---

## Budget Allocation

```
System Prompt     [{{system_bar}}] {{system_pct}}%  {{system_tokens}} tokens
User Instructions [{{user_bar}}]   {{user_pct}}%    {{user_tokens}} tokens
Active Context    [{{active_bar}}] {{active_pct}}%  {{active_tokens}} tokens
File Contents     [{{file_bar}}]   {{file_pct}}%    {{file_tokens}} tokens
Tool Results      [{{tool_bar}}]   {{tool_pct}}%    {{tool_tokens}} tokens
Historical        [{{hist_bar}}]   {{hist_pct}}%    {{hist_tokens}} tokens
Free Space        [{{free_bar}}]   {{free_pct}}%    {{free_tokens}} tokens
```

### Budget vs Actual

| Category | Budget | Actual | Status |
|----------|--------|--------|--------|
| System Prompt | {{system_budget}}% | {{system_pct}}% | {{system_status}} |
| User Instructions | {{user_budget}}% | {{user_pct}}% | {{user_status}} |
| Active Context | {{active_budget}}% | {{active_pct}}% | {{active_status}} |
| File Contents | {{file_budget}}% | {{file_pct}}% | {{file_status}} |
| Tool Results | {{tool_budget}}% | {{tool_pct}}% | {{tool_status}} |
| Historical | {{hist_budget}}% | {{hist_pct}}% | {{hist_status}} |

---

## Trend (Last {{trend_window}} Turns)

```
Tokens
{{y_axis_max}} |{{trend_chart}}
               |
{{y_axis_mid}} |
               |
{{y_axis_min}} |___________________________
                {{x_axis_labels}}
                         Turn
```

---

## Waste Detection

{{#if waste_items}}
| # | Type | Tokens Wasted | Severity | Detail |
|---|------|--------------|----------|--------|
{{#each waste_items}}
| {{index}} | {{type}} | {{tokens}} | {{severity}} | {{detail}} |
{{/each}}

**Total Waste:** {{total_waste_tokens}} tokens ({{waste_pct}}% of used context)
**Potential Savings:** {{potential_savings}} tokens
{{else}}
No waste patterns detected. Context usage is efficient.
{{/if}}

---

## Compression Status

| Strategy | Status | Tokens Saved | Quality Impact |
|----------|--------|-------------|----------------|
{{#each compression_strategies}}
| {{name}} | {{status}} | {{tokens_saved}} | {{quality_impact}} |
{{/each}}

**Total Compression Savings:** {{total_savings}} tokens
**Effective Context Gain:** {{effective_gain_pct}}%

---

## Top Token Consumers

| # | Item | Type | Tokens | % of Total |
|---|------|------|--------|-----------|
{{#each top_consumers}}
| {{rank}} | {{name}} | {{type}} | {{tokens}} | {{pct}}% |
{{/each}}

---

## Recommendations

{{#each recommendations}}
### {{priority_icon}} {{title}}
- **Impact:** Save ~{{token_savings}} tokens ({{savings_pct}}%)
- **Action:** {{action}}
- **Trade-off:** {{tradeoff}}
{{/each}}

---

## Quick Actions

| Action | Command | Expected Savings |
|--------|---------|-----------------|
| Compress file contents | `/context-slim compress files` | ~{{file_compress_savings}} tokens |
| Prune old conversation | `/context-slim prune history` | ~{{history_prune_savings}} tokens |
| Truncate tool results | `/context-slim truncate tools` | ~{{tool_truncate_savings}} tokens |
| Full optimization | `/context-slim optimize` | ~{{full_optimize_savings}} tokens |

---

*Context Slim v{{version}} | Auto-refresh every {{refresh_interval}} turns*
