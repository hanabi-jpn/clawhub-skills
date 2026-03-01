# Project Report

**Project:** {{project_name}}
**Report Period:** {{period_start}} to {{period_end}}
**Generated:** {{generated_date}}
**Team:** {{team_name}}
**Status:** {{project_status}}

---

## Executive Summary

{{executive_summary}}

### Key Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Completion | {{target_completion}}% | {{actual_completion}}% | {{completion_status}} |
| Budget Spent | ${{budget_target}} | ${{budget_actual}} | {{budget_status}} |
| Timeline | {{timeline_target}} | {{timeline_actual}} | {{timeline_status}} |
| Quality Score | {{quality_target}} | {{quality_actual}} | {{quality_status}} |

### Overall Health: {{overall_health}}

---

## Team Composition

| Role | Agent | Model | Status | Utilization |
|------|-------|-------|--------|-------------|
{{#each team_members}}
| {{role}} | {{name}} | {{model}} | {{status}} | {{utilization}}% |
{{/each}}

---

## Progress Summary

### Completed This Period
{{#each completed_tasks}}
{{index}}. **{{title}}** ({{owner}})
   - Outcome: {{outcome}}
   - Duration: {{duration}}
   - Quality: {{quality_rating}}/5
{{/each}}

### In Progress
{{#each in_progress_tasks}}
{{index}}. **{{title}}** ({{owner}})
   - Progress: {{progress}}%
   - ETA: {{eta}}
   - Blockers: {{blockers}}
{{/each}}

### Upcoming
{{#each upcoming_tasks}}
{{index}}. **{{title}}** ({{owner}})
   - Priority: {{priority}}
   - Scheduled: {{scheduled_date}}
   - Dependencies: {{dependencies}}
{{/each}}

---

## Decision Log

| # | Date | Decision | Rationale | Made By | Impact |
|---|------|----------|-----------|---------|--------|
{{#each decisions}}
| {{index}} | {{date}} | {{decision}} | {{rationale}} | {{made_by}} | {{impact}} |
{{/each}}

---

## Agent Performance

### Token Usage

| Agent | Input Tokens | Output Tokens | Total Cost | Efficiency |
|-------|-------------|---------------|-----------|------------|
{{#each agent_metrics}}
| {{name}} | {{input_tokens}} | {{output_tokens}} | ${{cost}} | {{efficiency_rating}} |
{{/each}}
| **Total** | **{{total_input}}** | **{{total_output}}** | **${{total_cost}}** | |

### Quality Metrics

| Agent | Tasks Completed | Accuracy | Revision Rate | Avg Response Time |
|-------|----------------|----------|---------------|-------------------|
{{#each agent_quality}}
| {{name}} | {{tasks}} | {{accuracy}}% | {{revision_rate}}% | {{avg_response_time}}s |
{{/each}}

### Collaboration Metrics

| Interaction | Count | Avg Tokens | Escalation Rate |
|-------------|-------|------------|-----------------|
{{#each collaboration_metrics}}
| {{pair}} | {{count}} | {{avg_tokens}} | {{escalation_rate}}% |
{{/each}}

---

## Risk Register

| # | Risk | Probability | Impact | Mitigation | Owner | Status |
|---|------|------------|--------|-----------|-------|--------|
{{#each risks}}
| {{index}} | {{description}} | {{probability}} | {{impact}} | {{mitigation}} | {{owner}} | {{status}} |
{{/each}}

---

## Lessons Learned

### What Went Well
{{#each positives}}
- {{description}}
{{/each}}

### What Could Be Improved
{{#each improvements}}
- {{description}}
{{/each}}

### Action Items from Retrospective
{{#each retro_actions}}
- [ ] {{description}} (Owner: {{owner}}, Due: {{due_date}})
{{/each}}

---

## Budget Analysis

### Cost Breakdown

| Category | Budgeted | Actual | Variance |
|----------|----------|--------|----------|
| Opus 4.6 API | ${{opus_budget}} | ${{opus_actual}} | {{opus_variance}} |
| Gemini 2.5 Pro API | ${{gemini_pro_budget}} | ${{gemini_pro_actual}} | {{gemini_pro_variance}} |
| Gemini 2.5 Flash API | ${{flash_budget}} | ${{flash_actual}} | {{flash_variance}} |
| Claude Max Subscription | ${{max_budget}} | ${{max_actual}} | {{max_variance}} |
| Infrastructure | ${{infra_budget}} | ${{infra_actual}} | {{infra_variance}} |
| **Total** | **${{total_budget}}** | **${{total_actual}}** | **{{total_variance}}** |

### Burn Rate
- Daily average: ${{daily_burn}}
- Projected month-end: ${{projected_total}}
- Budget remaining: ${{budget_remaining}} ({{budget_remaining_pct}}%)

---

## Next Period Plan

### Priorities
{{#each next_priorities}}
{{index}}. **{{title}}** ({{owner}})
   - Objective: {{objective}}
   - Success criteria: {{success_criteria}}
   - Resources needed: {{resources}}
{{/each}}

### Milestones
| Milestone | Target Date | Dependencies | Owner |
|-----------|-------------|-------------|-------|
{{#each milestones}}
| {{name}} | {{target_date}} | {{dependencies}} | {{owner}} |
{{/each}}

### Resource Requests
{{#each resource_requests}}
- **{{request}}:** {{justification}} (Impact if not fulfilled: {{impact}})
{{/each}}

---

## Appendix

### A. Full Task Log
```
{{task_log}}
```

### B. Meeting Notes Summary
{{#each meeting_summaries}}
#### {{date}} - {{topic}}
{{summary}}
{{/each}}

### C. Report Metadata
```json
{
  "report_id": "{{report_id}}",
  "generated_by": "Brain Trust v{{version}}",
  "team_template": "{{team_template}}",
  "period": "{{period_start}} - {{period_end}}",
  "agents_active": {{agents_active}},
  "total_interactions": {{total_interactions}}
}
```

---

*Generated by Brain Trust v{{version}} | Team: {{team_name}}*
*This report is auto-generated from agent activity logs and should be reviewed for accuracy.*
