# Agent Performance Report

**Report Period:** {{period_start}} to {{period_end}}
**Generated:** {{generated_date}}
**Active Agents:** {{active_agent_count}}
**Total Invocations:** {{total_invocations}}

---

## Executive Summary

{{summary}}

### System Health: {{system_health}}

| Metric | Value | Trend |
|--------|-------|-------|
| Total Cost | ${{total_cost}} | {{cost_trend}} |
| Average Response Time | {{avg_response_time}}ms | {{response_trend}} |
| Error Rate | {{error_rate}}% | {{error_trend}} |
| Uptime | {{uptime_pct}}% | {{uptime_trend}} |
| Tasks Completed | {{tasks_completed}} | {{tasks_trend}} |
| Tokens Consumed | {{total_tokens}} | {{tokens_trend}} |

---

## Cost Analysis

### Total Spend: ${{total_cost}}

#### By Provider

| Provider | Model | Input Tokens | Output Tokens | Cost | % of Total |
|----------|-------|-------------|---------------|------|-----------|
{{#each provider_costs}}
| {{provider}} | {{model}} | {{input_tokens}} | {{output_tokens}} | ${{cost}} | {{pct}}% |
{{/each}}
| **Total** | | **{{total_input}}** | **{{total_output}}** | **${{total_cost}}** | **100%** |

#### By Agent

| Agent | Role | Model | Invocations | Cost | Avg Cost/Invocation |
|-------|------|-------|------------|------|---------------------|
{{#each agent_costs}}
| {{name}} | {{role}} | {{model}} | {{invocations}} | ${{cost}} | ${{avg_cost}} |
{{/each}}

#### Cost Trend

```
{{cost_trend_chart}}
```

#### Budget Status

| Budget | Allocated | Spent | Remaining | Projected |
|--------|-----------|-------|-----------|-----------|
| Daily | ${{daily_budget}} | ${{daily_spent}} | ${{daily_remaining}} | ${{daily_projected}} |
| Weekly | ${{weekly_budget}} | ${{weekly_spent}} | ${{weekly_remaining}} | ${{weekly_projected}} |
| Monthly | ${{monthly_budget}} | ${{monthly_spent}} | ${{monthly_remaining}} | ${{monthly_projected}} |

---

## Agent Performance

### Individual Agent Metrics

{{#each agents}}
#### {{name}} ({{role}})

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Invocations | {{invocations}} | - | - |
| Success Rate | {{success_rate}}% | > 95% | {{success_status}} |
| Avg Response Time | {{avg_response}}ms | < {{target_response}}ms | {{response_status}} |
| Avg Tokens/Turn | {{avg_tokens}} | < {{target_tokens}} | {{tokens_status}} |
| Error Count | {{error_count}} | 0 | {{error_status}} |
| Context Utilization | {{context_util}}% | < 80% | {{context_status}} |
| Uptime | {{uptime}}% | > 99% | {{uptime_status}} |

{{#if errors}}
**Recent Errors:**
{{#each errors}}
- `{{timestamp}}`: {{message}} ({{category}})
{{/each}}
{{/if}}

---
{{/each}}

### Comparative Performance

| Rank | Agent | Efficiency Score | Cost Efficiency | Quality |
|------|-------|-----------------|-----------------|---------|
{{#each agent_rankings}}
| {{rank}} | {{name}} | {{efficiency}}/100 | ${{cost_per_task}} /task | {{quality}}/10 |
{{/each}}

---

## Task Analysis

### Task Completion

| Status | Count | % |
|--------|-------|---|
| Completed Successfully | {{completed}} | {{completed_pct}}% |
| Completed with Errors | {{completed_errors}} | {{completed_errors_pct}}% |
| Failed | {{failed}} | {{failed_pct}}% |
| Timed Out | {{timed_out}} | {{timed_out_pct}}% |
| In Progress | {{in_progress}} | {{in_progress_pct}}% |

### Task Duration Distribution

```
{{duration_histogram}}
```

### Slowest Tasks

| # | Task | Agent | Duration | Tokens | Status |
|---|------|-------|----------|--------|--------|
{{#each slowest_tasks}}
| {{rank}} | {{description}} | {{agent}} | {{duration}}ms | {{tokens}} | {{status}} |
{{/each}}

### Most Expensive Tasks

| # | Task | Agent | Cost | Tokens | Duration |
|---|------|-------|------|--------|----------|
{{#each expensive_tasks}}
| {{rank}} | {{description}} | {{agent}} | ${{cost}} | {{tokens}} | {{duration}}ms |
{{/each}}

---

## Error Analysis

### Error Summary

| Error Category | Count | % of Total | Trend |
|---------------|-------|-----------|-------|
{{#each error_categories}}
| {{category}} | {{count}} | {{pct}}% | {{trend}} |
{{/each}}

### Error Timeline

```
{{error_timeline_chart}}
```

### Top Errors

{{#each top_errors}}
#### {{index}}. {{message}}

- **Count:** {{count}}
- **Agent(s):** {{agents}}
- **First Seen:** {{first_seen}}
- **Last Seen:** {{last_seen}}
- **Impact:** {{impact}}
- **Root Cause:** {{root_cause}}
- **Resolution:** {{resolution}}
{{/each}}

---

## Alert History

| Time | Severity | Alert | Agent | Resolved | Duration |
|------|----------|-------|-------|----------|----------|
{{#each alerts}}
| {{time}} | {{severity}} | {{message}} | {{agent}} | {{resolved}} | {{duration}} |
{{/each}}

### Alert Statistics

| Severity | Triggered | Auto-Resolved | Manual-Resolved | Open |
|----------|-----------|--------------|-----------------|------|
| Critical | {{critical_triggered}} | {{critical_auto}} | {{critical_manual}} | {{critical_open}} |
| Warning | {{warning_triggered}} | {{warning_auto}} | {{warning_manual}} | {{warning_open}} |
| Info | {{info_triggered}} | {{info_auto}} | {{info_manual}} | {{info_open}} |

---

## Resource Utilization

### Token Consumption Over Time

```
{{token_chart}}
```

### Model Usage Distribution

| Model | Invocations | % of Total | Avg Tokens | Total Cost |
|-------|------------|-----------|------------|-----------|
{{#each model_usage}}
| {{model}} | {{invocations}} | {{pct}}% | {{avg_tokens}} | ${{cost}} |
{{/each}}

### Efficiency Metrics

| Metric | Value | Previous Period | Change |
|--------|-------|-----------------|--------|
| Cost per Successful Task | ${{cost_per_success}} | ${{prev_cost_per_success}} | {{cost_change}} |
| Tokens per Successful Task | {{tokens_per_success}} | {{prev_tokens_per_success}} | {{tokens_change}} |
| Tasks per Dollar | {{tasks_per_dollar}} | {{prev_tasks_per_dollar}} | {{tpd_change}} |
| Avg Agent Utilization | {{avg_utilization}}% | {{prev_utilization}}% | {{util_change}} |

---

## Recommendations

{{#each recommendations}}
### {{priority}} --- {{title}}

- **Impact:** {{impact}}
- **Effort:** {{effort}}
- **Description:** {{description}}
- **Action:** {{action}}
- **Expected Savings:** {{savings}}
{{/each}}

---

## Report Metadata

```json
{
  "report_id": "{{report_id}}",
  "engine_version": "agent-dashboard-v{{version}}",
  "period_start": "{{period_start}}",
  "period_end": "{{period_end}}",
  "agents_monitored": {{agent_count}},
  "data_points": {{data_points}},
  "generated": "{{generated_date}}"
}
```

---

*Generated by Agent Dashboard v{{version}}*
*Cost estimates are based on published API pricing as of {{pricing_date}}.*
