# Full Security Audit Report

**Audit ID:** `{{audit_id}}`
**Date:** {{date}}
**Auditor:** Skill Guardian v{{version}}
**Classification:** {{classification}}

---

## 1. Executive Summary

This audit was performed on **{{skill_name}}** (v{{skill_version}}) published by `{{publisher}}`. The audit encompasses static analysis, behavioral analysis, dependency review, permission analysis, and network traffic inspection.

**Overall Assessment:** {{overall_assessment}}
**Risk Rating:** {{risk_rating}}/10 ({{risk_label}})
**Recommendation:** {{final_recommendation}}

### Key Findings

| # | Finding | Severity | Status |
|---|---------|----------|--------|
{{#each key_findings}}
| {{index}} | {{title}} | {{severity}} | {{status}} |
{{/each}}

---

## 2. Audit Scope

### 2.1 Target Information

| Field | Value |
|-------|-------|
| Skill Name | `{{skill_name}}` |
| Version | `{{skill_version}}` |
| Publisher | `{{publisher}}` |
| Repository | {{repository_url}} |
| Registry | {{registry}} |
| Install Method | {{install_method}} |
| Last Updated | {{last_updated}} |
| License | {{license}} |

### 2.2 Audit Parameters

| Parameter | Value |
|-----------|-------|
| Scan Depth | {{scan_depth}} |
| Pattern DB Version | {{pattern_db_version}} |
| Patterns Loaded | {{patterns_loaded}} |
| Static Analysis | {{static_analysis_enabled}} |
| Behavioral Analysis | {{behavioral_analysis_enabled}} |
| Network Monitoring | {{network_monitoring_enabled}} |
| Sandbox Execution | {{sandbox_enabled}} |

### 2.3 Files Audited

| Category | Count |
|----------|-------|
| Source Files | {{source_file_count}} |
| Configuration Files | {{config_file_count}} |
| Binary Files | {{binary_file_count}} |
| Total Lines of Code | {{total_loc}} |
| Total File Size | {{total_size}} |

---

## 3. Static Analysis

### 3.1 Threat Pattern Matches

{{#each threat_matches}}
#### {{severity_icon}} {{pattern_id}}: {{pattern_name}}

- **Severity:** {{severity}}
- **Category:** {{category}}
- **MITRE ATT&CK:** {{mitre_id}}
- **Confidence:** {{confidence}}%
- **File:** `{{file_path}}:{{line_number}}`

**Matched Code:**
```{{language}}
{{code_snippet}}
```

**Context:**
```{{language}}
{{code_context}}
```

**Analysis:**
{{analysis}}

**Risk Assessment:**
{{risk_assessment}}

---
{{/each}}

### 3.2 Code Quality Assessment

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Cyclomatic Complexity (avg) | {{complexity_avg}} | < 10 | {{complexity_status}} |
| Code Duplication | {{duplication_pct}}% | < 15% | {{duplication_status}} |
| Obfuscation Score | {{obfuscation_score}}/10 | < 3 | {{obfuscation_status}} |
| Dynamic Evaluation Count | {{eval_count}} | 0 | {{eval_status}} |
| Unsafe Function Calls | {{unsafe_count}} | 0 | {{unsafe_status}} |

### 3.3 Obfuscation Analysis

{{#if obfuscation_findings}}
| Technique | Instances | Severity | Files |
|-----------|-----------|----------|-------|
{{#each obfuscation_findings}}
| {{technique}} | {{count}} | {{severity}} | {{files}} |
{{/each}}
{{else}}
No obfuscation techniques detected.
{{/if}}

---

## 4. Permission Analysis

### 4.1 Declared vs Actual Permissions

| Permission | Declared | Used | Gap |
|------------|----------|------|-----|
{{#each permissions}}
| {{name}} | {{declared}} | {{used}} | {{gap}} |
{{/each}}

### 4.2 File System Access

| Access Type | Paths | Justified |
|-------------|-------|-----------|
{{#each fs_access}}
| {{type}} | `{{paths}}` | {{justified}} |
{{/each}}

### 4.3 Privilege Escalation Vectors

{{#if priv_esc_vectors}}
{{#each priv_esc_vectors}}
- **{{name}}:** {{description}} (Severity: {{severity}})
{{/each}}
{{else}}
No privilege escalation vectors identified.
{{/if}}

---

## 5. Dependency Audit

### 5.1 Dependency Tree

| Package | Version | Direct | Vulnerabilities | License |
|---------|---------|--------|-----------------|---------|
{{#each dependencies}}
| `{{name}}` | {{version}} | {{direct}} | {{vuln_count}} | {{license}} |
{{/each}}

### 5.2 Vulnerability Report

{{#if vulnerabilities}}
{{#each vulnerabilities}}
#### {{severity_icon}} {{cve_id}}: {{title}}

| Field | Value |
|-------|-------|
| Package | `{{package}}@{{version}}` |
| Severity | {{severity}} (CVSS: {{cvss}}) |
| Fixed In | {{fixed_in}} |
| Exploitability | {{exploitability}} |

**Description:** {{description}}
**Recommendation:** {{recommendation}}

---
{{/each}}
{{else}}
No known vulnerabilities found in dependencies.
{{/if}}

### 5.3 Typosquatting Analysis

| Declared Package | Closest Legitimate | Edit Distance | Verdict |
|------------------|--------------------|---------------|---------|
{{#each typosquat_analysis}}
| `{{declared}}` | `{{legitimate}}` | {{distance}} | {{verdict}} |
{{/each}}

### 5.4 Supply Chain Risk

| Risk Factor | Assessment |
|-------------|------------|
| Publisher Reputation | {{publisher_reputation}} |
| Package Age | {{package_age}} |
| Download Count | {{download_count}} |
| Maintainer Count | {{maintainer_count}} |
| Recent Ownership Changes | {{ownership_changes}} |
| Build Reproducibility | {{reproducibility}} |

---

## 6. Network Behavior Analysis

### 6.1 Outbound Connections

{{#if outbound_connections}}
| # | Destination | Port | Protocol | Frequency | Purpose | Risk |
|---|-------------|------|----------|-----------|---------|------|
{{#each outbound_connections}}
| {{index}} | {{host}} | {{port}} | {{protocol}} | {{frequency}} | {{purpose}} | {{risk}} |
{{/each}}
{{else}}
No outbound connections observed.
{{/if}}

### 6.2 DNS Activity

{{#if dns_activity}}
| Domain | Query Type | Count | Suspicious |
|--------|------------|-------|------------|
{{#each dns_activity}}
| {{domain}} | {{type}} | {{count}} | {{suspicious}} |
{{/each}}
{{else}}
No DNS activity observed.
{{/if}}

### 6.3 C2 Indicator Analysis

| Indicator | Detected | Details |
|-----------|----------|---------|
| Periodic Callbacks | {{periodic_callbacks}} | {{periodic_details}} |
| Encoded Commands | {{encoded_commands}} | {{encoded_details}} |
| Beaconing Pattern | {{beaconing}} | {{beaconing_details}} |
| Domain Generation | {{dga}} | {{dga_details}} |

---

## 7. Behavioral Analysis (Sandbox)

### 7.1 Sandbox Execution Summary

| Metric | Value |
|--------|-------|
| Execution Time | {{sandbox_duration}}ms |
| CPU Usage (peak) | {{cpu_peak}}% |
| Memory Usage (peak) | {{memory_peak}}MB |
| File Operations | {{file_ops_count}} |
| Network Operations | {{net_ops_count}} |
| Process Spawns | {{process_spawn_count}} |

### 7.2 Behavioral Anomalies

{{#if behavioral_anomalies}}
{{#each behavioral_anomalies}}
- **{{category}}:** {{description}} (Confidence: {{confidence}}%)
{{/each}}
{{else}}
No behavioral anomalies detected during sandbox execution.
{{/if}}

### 7.3 Resource Access Timeline

```
{{timeline}}
```

---

## 8. MCP Protocol Compliance

| Check | Status | Details |
|-------|--------|---------|
| Valid tool schema | {{schema_valid}} | {{schema_details}} |
| Proper error handling | {{error_handling}} | {{error_details}} |
| No tool shadowing | {{no_shadowing}} | {{shadow_details}} |
| Output sanitization | {{output_sanitized}} | {{sanitize_details}} |
| Input validation | {{input_validated}} | {{input_details}} |
| Idempotent operations | {{idempotent}} | {{idempotent_details}} |
| Timeout compliance | {{timeout_compliant}} | {{timeout_details}} |

---

## 9. Risk Matrix

| Category | Score | Weight | Weighted Score |
|----------|-------|--------|---------------|
| Code Safety | {{code_safety_score}}/10 | 25% | {{code_safety_weighted}} |
| Permissions | {{permission_score}}/10 | 20% | {{permission_weighted}} |
| Dependencies | {{dependency_score}}/10 | 20% | {{dependency_weighted}} |
| Network Behavior | {{network_score}}/10 | 15% | {{network_weighted}} |
| Publisher Trust | {{publisher_score}}/10 | 10% | {{publisher_weighted}} |
| MCP Compliance | {{mcp_score}}/10 | 10% | {{mcp_weighted}} |
| **Overall** | | | **{{overall_score}}/10** |

---

## 10. Recommendations

### Critical (Immediate Action Required)
{{#each critical_recommendations}}
{{index}}. **{{title}}**
   {{description}}
   *Remediation:* {{remediation}}
{{/each}}

### High Priority
{{#each high_recommendations}}
{{index}}. **{{title}}**
   {{description}}
   *Remediation:* {{remediation}}
{{/each}}

### Medium Priority
{{#each medium_recommendations}}
{{index}}. **{{title}}**
   {{description}}
   *Remediation:* {{remediation}}
{{/each}}

### Informational
{{#each info_recommendations}}
{{index}}. **{{title}}**
   {{description}}
{{/each}}

---

## 11. Conclusion

{{conclusion}}

### Decision

| Action | Details |
|--------|---------|
| **Verdict** | {{verdict}} |
| **Safe to Install** | {{safe_to_install}} |
| **Conditions** | {{conditions}} |
| **Re-audit Required** | {{reaudit_required}} |
| **Next Audit Date** | {{next_audit_date}} |

---

## Appendices

### A. Full File Listing
```
{{file_listing}}
```

### B. Raw Pattern Match Data
```json
{{raw_pattern_data}}
```

### C. Scan Configuration
```json
{{scan_config}}
```

---

## Audit Metadata

```json
{
  "audit_id": "{{audit_id}}",
  "engine_version": "{{version}}",
  "pattern_db_version": "{{pattern_db_version}}",
  "audit_start": "{{audit_start}}",
  "audit_end": "{{audit_end}}",
  "total_duration_ms": {{total_duration}},
  "report_checksum": "{{report_checksum}}",
  "signature": "{{report_signature}}"
}
```

---

*Generated by Skill Guardian v{{version}} | Full Audit Mode*
*This audit report is provided as-is. Critical findings require human review and validation.*
*Report integrity can be verified using the checksum and signature above.*
