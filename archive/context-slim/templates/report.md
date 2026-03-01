# Context Analysis Report

**Session:** {{session_id}}
**Model:** {{model_name}}
**Analysis Date:** {{analysis_date}}
**Turns Analyzed:** {{turns_analyzed}}

---

## Executive Summary

{{summary}}

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Tokens Used | {{total_tokens_used}} |
| Context Window Capacity | {{context_capacity}} |
| Current Utilization | {{utilization_pct}}% |
| Estimated Turns Remaining | ~{{turns_remaining}} |
| Total Cost (session) | ${{total_cost}} |
| Average Cost per Turn | ${{avg_cost_per_turn}} |
| Waste Detected | {{waste_tokens}} tokens ({{waste_pct}}%) |
| Compression Opportunity | {{compression_opportunity}} tokens |

### Health Score: {{health_score}}/100

---

## Context Composition

### By Category

| Category | Tokens | % of Used | % of Total | Budget % | Over/Under |
|----------|--------|-----------|-----------|----------|------------|
| System Prompt | {{system_tokens}} | {{system_pct_used}}% | {{system_pct_total}}% | {{system_budget}}% | {{system_delta}} |
| User Instructions | {{user_tokens}} | {{user_pct_used}}% | {{user_pct_total}}% | {{user_budget}}% | {{user_delta}} |
| Active Context | {{active_tokens}} | {{active_pct_used}}% | {{active_pct_total}}% | {{active_budget}}% | {{active_delta}} |
| File Contents | {{file_tokens}} | {{file_pct_used}}% | {{file_pct_total}}% | {{file_budget}}% | {{file_delta}} |
| Tool Results | {{tool_tokens}} | {{tool_pct_used}}% | {{tool_pct_total}}% | {{tool_budget}}% | {{tool_delta}} |
| Historical | {{hist_tokens}} | {{hist_pct_used}}% | {{hist_pct_total}}% | {{hist_budget}}% | {{hist_delta}} |
| **Free Space** | **{{free_tokens}}** | | **{{free_pct_total}}%** | | |

### Composition Chart

```
{{composition_chart}}
```

---

## Token Usage Over Time

### Per-Turn Usage

| Turn | Input Tokens | Output Tokens | Cumulative | Cost |
|------|-------------|---------------|-----------|------|
{{#each turn_data}}
| {{turn}} | {{input}} | {{output}} | {{cumulative}} | ${{cost}} |
{{/each}}

### Growth Rate

```
{{growth_chart}}
```

- **Average growth per turn:** {{avg_growth}} tokens
- **Peak growth turn:** Turn {{peak_turn}} (+{{peak_growth}} tokens)
- **Projected exhaustion:** Turn ~{{exhaustion_turn}}

---

## File Content Analysis

### Files in Context

| # | File | Tokens | Read Count | Last Accessed | Still Relevant |
|---|------|--------|------------|---------------|---------------|
{{#each files_in_context}}
| {{index}} | `{{path}}` | {{tokens}} | {{read_count}} | Turn {{last_accessed}} | {{relevant}} |
{{/each}}

### File Optimization Opportunities

{{#each file_optimizations}}
- **`{{path}}`** ({{tokens}} tokens)
  - Issue: {{issue}}
  - Recommendation: {{recommendation}}
  - Potential savings: {{savings}} tokens
{{/each}}

---

## Tool Result Analysis

### Tool Usage Summary

| Tool | Invocations | Avg Output Tokens | Total Tokens | Truncation Needed |
|------|-------------|-------------------|-------------|-------------------|
{{#each tool_usage}}
| {{name}} | {{count}} | {{avg_tokens}} | {{total_tokens}} | {{truncation}} |
{{/each}}

### Large Tool Outputs

{{#each large_outputs}}
- **Turn {{turn}}:** `{{tool}}` produced {{tokens}} tokens
  - Could be reduced to ~{{reduced_tokens}} tokens ({{savings_pct}}% savings)
  - Method: {{compression_method}}
{{/each}}

---

## Waste Analysis

### Detected Waste Patterns

{{#each waste_patterns}}
#### {{severity_icon}} {{name}} ({{severity}})

- **Occurrences:** {{occurrences}}
- **Tokens Wasted:** {{tokens_wasted}}
- **Description:** {{description}}
- **Examples:**
{{#each examples}}
  - Turn {{turn}}: {{detail}}
{{/each}}
- **Fix:** {{fix}}

{{/each}}

### Waste Summary

| Category | Tokens | % of Total Used |
|----------|--------|----------------|
{{#each waste_summary}}
| {{category}} | {{tokens}} | {{pct}}% |
{{/each}}
| **Total Waste** | **{{total_waste}}** | **{{total_waste_pct}}%** |

---

## Compression Analysis

### Current Compression State

| Strategy | Active | Tokens Before | Tokens After | Savings | Quality |
|----------|--------|--------------|-------------|---------|---------|
{{#each compression_state}}
| {{name}} | {{active}} | {{before}} | {{after}} | {{savings}} | {{quality}}% |
{{/each}}

### Recommended Compression Plan

{{#each compression_plan}}
#### Step {{step}}: {{strategy}}

- **Target:** {{target_category}}
- **Current tokens:** {{current_tokens}}
- **Projected tokens:** {{projected_tokens}}
- **Savings:** {{savings}} tokens ({{savings_pct}}%)
- **Quality impact:** {{quality_impact}}
- **Trigger condition:** Context utilization reaches {{trigger_pct}}%
{{/each}}

### Projected Impact

| Scenario | Tokens Freed | New Utilization | Additional Turns | Quality Score |
|----------|-------------|-----------------|-----------------|---------------|
| No compression | 0 | {{current_util}}% | {{current_turns}} | 100% |
| Conservative | {{conservative_freed}} | {{conservative_util}}% | {{conservative_turns}} | {{conservative_quality}}% |
| Moderate | {{moderate_freed}} | {{moderate_util}}% | {{moderate_turns}} | {{moderate_quality}}% |
| Aggressive | {{aggressive_freed}} | {{aggressive_util}}% | {{aggressive_turns}} | {{aggressive_quality}}% |

---

## Cost Analysis

### Cost Breakdown

| Category | Input Cost | Output Cost | Total |
|----------|-----------|-------------|-------|
| Conversation | ${{conv_input_cost}} | ${{conv_output_cost}} | ${{conv_total}} |
| File Reading | ${{file_input_cost}} | - | ${{file_total}} |
| Tool Usage | ${{tool_input_cost}} | ${{tool_output_cost}} | ${{tool_total}} |
| System/Instructions | ${{system_input_cost}} | - | ${{system_total}} |
| **Total** | **${{total_input_cost}}** | **${{total_output_cost}}** | **${{grand_total}}** |

### Cost Optimization

- **Wasted spend:** ${{wasted_cost}} ({{wasted_cost_pct}}% of total)
- **Potential savings with compression:** ${{compression_cost_savings}}
- **Projected session total cost:** ${{projected_total_cost}}
- **Optimized session total cost:** ${{optimized_total_cost}}

---

## Recommendations

{{#each recommendations}}
### {{priority}} Priority: {{title}}

- **Category:** {{category}}
- **Token Impact:** {{token_impact}} tokens
- **Cost Impact:** ${{cost_impact}}
- **Action:** {{action}}
- **Trade-off:** {{tradeoff}}
- **Automated:** {{automatable}}
{{/each}}

---

## Report Metadata

```json
{
  "report_id": "{{report_id}}",
  "engine_version": "context-slim-v{{version}}",
  "model": "{{model_name}}",
  "session_id": "{{session_id}}",
  "analysis_depth": "{{analysis_depth}}",
  "turns_analyzed": {{turns_analyzed}},
  "timestamp": "{{analysis_date}}"
}
```

---

*Generated by Context Slim v{{version}}*
*Token counts are estimates based on cl100k_base tokenizer equivalents.*
