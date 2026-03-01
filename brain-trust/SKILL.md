```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   🏛  B R A I N  T R U S T  🏛          │
    │                                          │
    │              ┌─────┐                     │
    │              │ CEO │                     │
    │              └──┬──┘                     │
    │         ┌───────┼───────┐                │
    │      ┌──┴──┐ ┌──┴──┐ ┌─┴───┐            │
    │      │ CTO │ │ CFO │ │ CMO │            │
    │      └──┬──┘ └──┬──┘ └──┬──┘            │
    │    ┌────┼────┐  │   ┌───┼───┐           │
    │   🧑‍💻  🔍  🧪  📊  ✍  🎨  📢          │
    │   Dev  Rev  QA  Ana  Wri Des SEO        │
    │                                          │
    │    "Your AI company. One command."       │
    ╰──────────────────────────────────────────╯
```

# Brain Trust

`🏛 Multi-Agent` `👥 10+ Roles` `🗳 Consensus` `📋 Meetings` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Platform](https://img.shields.io/badge/Platform-OpenClaw-blueviolet)]()

> Multi-agent hierarchical orchestration engine. Define specialist roles, delegate tasks, aggregate results, and manage complex projects with AI teams of 3-20 agents.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `multi-agent` `orchestration` `teamwork` `delegation` `project-management`

---

## Overview

Brain Trust lets you organize your OpenClaw agent into a team of specialists. Define roles (CEO, CTO, Developer, Designer...), delegate tasks, run meetings, and make decisions through consensus protocols. Like having a virtual company at your command.

```
┌─────────────────────────────────────────────────┐
│            BRAIN TRUST HIERARCHY                │
│                                                 │
│                  ┌───────┐                      │
│                  │  CEO  │                      │
│                  └───┬───┘                      │
│            ┌─────────┼─────────┐                │
│        ┌───┴───┐ ┌───┴───┐ ┌──┴────┐           │
│        │  CTO  │ │  CFO  │ │  CMO  │           │
│        └───┬───┘ └───┬───┘ └───┬───┘           │
│      ┌─────┼─────┐   │    ┌───┼───┐            │
│   ┌──┴──┐┌┴───┐┌┴┐ ┌┴┐  ┌┴┐ ┌┴┐  ┌┴┐         │
│   │ Dev ││Rev ││QA│ │An│ │Wr││De││SEO│         │
│   └─────┘└────┘└──┘ └──┘ └──┘└──┘└───┘         │
│                                                 │
│  Tasks flow DOWN ↓    Results flow UP ↑         │
└─────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Brain Trust**. When the user invokes Brain Trust commands, you adopt the requested role or orchestrate multiple role perspectives.

### Role System

Each role has specific expertise and behavior:

**`ceo`** — Strategic leader:
- Makes final decisions when consensus fails
- Focuses on big picture, business impact, ROI
- Delegates details to specialists
- Resolves conflicts between team members

**`cto`** — Technical authority:
- Architecture decisions, technology choices
- Code quality standards, technical debt assessment
- Performance and scalability concerns
- Security architecture

**`researcher`** — Deep analyst:
- Thorough investigation before conclusions
- Cites sources and evidence
- Considers multiple perspectives
- Identifies unknowns and risks

**`developer`** — Implementation expert:
- Writes clean, efficient code
- Follows project conventions
- Tests thoroughly
- Documents as they go

**`reviewer`** — Quality gatekeeper:
- Reviews code for bugs, style, security
- Checks documentation completeness
- Verifies test coverage
- Provides constructive feedback

**`writer`** — Content specialist:
- Clear, engaging documentation
- Technical writing standards
- Audience-appropriate language
- SEO awareness when relevant

**`analyst`** — Data expert:
- Quantitative analysis
- Metrics and KPI tracking
- Data visualization recommendations
- Statistical rigor

**`security`** — Security specialist:
- Vulnerability assessment
- OWASP top 10 awareness
- Secure coding practices
- Incident response planning

**`designer`** — UX/UI expert:
- User experience optimization
- Accessibility standards (WCAG)
- Visual design principles
- Component patterns

**`pm`** — Project coordinator:
- Task breakdown and estimation
- Priority management
- Risk tracking
- Status reporting

### Hierarchical Delegation

When a task is assigned via `bt delegate`:

1. **CEO** receives the task and breaks it into subtasks
2. **Directors** (CTO, CFO, CMO) receive relevant subtasks
3. **Team members** execute the work
4. **Results flow up** with confidence scores
5. **CEO** synthesizes and presents final output

For each subtask:
```json
{
  "id": "task-001",
  "title": "Review authentication implementation",
  "assigned_to": "security",
  "delegated_by": "cto",
  "priority": "high",
  "status": "in_progress",
  "dependencies": ["task-000"],
  "deadline": null,
  "result": null,
  "confidence": null
}
```

### Consensus Protocols

When making team decisions via `bt decide`:

**`unanimous`** — All roles must agree:
- Each role states position with reasoning
- If disagreement: discuss, then re-vote
- Max 3 rounds, then escalate to CEO

**`majority`** — >50% agreement:
- Each role votes with brief reasoning
- Majority wins
- Dissenting opinions logged

**`weighted`** — Votes weighted by domain expertise:
- For technical decisions: CTO vote = 3×, Developer = 2×, others = 1×
- For business decisions: CEO = 3×, Analyst = 2×, others = 1×
- For design decisions: Designer = 3×, Writer = 2×, others = 1×

**`executive`** — CEO decides after hearing all:
- All roles present their analysis
- CEO makes final call with reasoning
- Fastest protocol for time-sensitive decisions

### Meeting Protocols

**`standup`** — Quick status (< 2 minutes per role):
- What I completed since last standup
- What I'm working on now
- Any blockers

**`review`** — Detailed deliverable review:
- Present work product
- Each reviewer gives structured feedback
- Action items generated

**`brainstorm`** — Idea generation:
- No criticism in first round
- All roles contribute ideas freely
- Second round: evaluate and rank ideas
- Output: prioritized idea list

**`retro`** — Retrospective:
- What went well?
- What didn't go well?
- What should we change?
- Action items for improvement

**`war-room`** — Crisis response:
- All roles on deck
- Focus on immediate resolution
- Parallel investigation streams
- Status updates every 5 minutes

### Pre-Built Team Templates

**`startup`** (4 agents): CEO, CTO, Developer, Designer
- Best for: New projects, MVPs, rapid prototyping

**`dev-team`** (5 agents): Lead Developer, 2 Developers, Reviewer, QA
- Best for: Coding tasks, feature implementation

**`content`** (5 agents): Editor, 2 Writers, SEO Specialist, Designer
- Best for: Content creation, documentation, marketing

**`research`** (5 agents): Lead Researcher, 3 Analysts, Writer
- Best for: Market research, competitive analysis, reports

**`security`** (5 agents): CISO, 2 Pentesters, Compliance, Incident Response
- Best for: Security audits, vulnerability assessments

### Commands

**`bt init [template]`** — Initialize Brain Trust:
- Create `.brain-trust/` directory
- Set up team from template (or custom)
- Generate initial config

Output:
```
╔═══════════════════════════════════════════╗
║     Brain Trust — Initialization          ║
╠═══════════════════════════════════════════╣
║  Template: startup                        ║
║                                           ║
║  Creating .brain-trust/ directory...  ✅  ║
║  Setting up roles:                        ║
║    ✅ CEO      — Strategic decisions      ║
║    ✅ CTO      — Technical architecture   ║
║    ✅ Developer — Implementation          ║
║    ✅ Designer  — UI/UX design            ║
║  Writing config.json...              ✅   ║
║  Creating tasks/ directory...        ✅   ║
║  Creating decisions/ directory...    ✅   ║
║  Creating meetings/ directory...     ✅   ║
║                                           ║
║  Brain Trust initialized with 4 agents.   ║
║  Run `bt team` to see your team.          ║
║  Run `bt delegate <task>` to get started. ║
╚═══════════════════════════════════════════╝
```

**`bt team`** — Show current team:
```
╔═══════════════════════════════════════╗
║         Brain Trust Team              ║
╠═══════════════════════════════════════╣
║ CEO      — Strategic decisions        ║
║ CTO      — Technical architecture     ║
║ Dev 1    — Frontend implementation    ║
║ Dev 2    — Backend implementation     ║
║ Reviewer — Code quality               ║
║ Designer — UI/UX design               ║
╠═══════════════════════════════════════╣
║ Template: startup | Agents: 6         ║
╚═══════════════════════════════════════╝
```

**`bt add-role <name> <description>`** — Add custom role

Output:
```
✅ Role added: data-engineer

  Name:        data-engineer
  Description: ETL pipeline design, data warehouse architecture,
               SQL optimization, and data quality monitoring
  Reports to:  CTO
  Saved to:    .brain-trust/agents/data-engineer.md

  Team size: 4 → 5 agents
  Run `bt team` to see updated roster.
```

**`bt assign <task> --to <role>`** — Assign task to specific role

Output:
```
╔═══════════════════════════════════════════╗
║         Task Assigned                     ║
╠═══════════════════════════════════════════╣
║  Task:     Review API rate limiting logic ║
║  ID:       task-007                       ║
║  Assigned: security                       ║
║  Priority: high                           ║
║  Status:   in_progress                    ║
║                                           ║
║  Security specialist is now analyzing     ║
║  the rate limiting implementation for     ║
║  bypass vulnerabilities and DDoS          ║
║  protection gaps...                       ║
╚═══════════════════════════════════════════╝
```

**`bt delegate <task>`** — Auto-delegate (CEO routes to best role)

Output:
```
╔═══════════════════════════════════════════════════╗
║         CEO — Task Delegation                     ║
╠═══════════════════════════════════════════════════╣
║  Task: "Redesign the checkout flow for mobile"    ║
║                                                   ║
║  CEO Analysis:                                    ║
║  This task requires UX research, UI design, and   ║
║  frontend implementation. Breaking into subtasks:  ║
║                                                   ║
║  Subtask 1: Audit current mobile checkout UX      ║
║    → Assigned to: Designer (task-008)              ║
║  Subtask 2: Implement new checkout components     ║
║    → Assigned to: Developer (task-009)             ║
║    → Depends on: task-008                          ║
║  Subtask 3: Review accessibility compliance       ║
║    → Assigned to: Reviewer (task-010)              ║
║    → Depends on: task-009                          ║
║                                                   ║
║  Delegation complete. 3 subtasks created.         ║
║  Run `bt tasks` to track progress.                ║
╚═══════════════════════════════════════════════════╝
```

**`bt meeting <type>`** — Run meeting protocol

Output:
```
╔═══════════════════════════════════════════════════════╗
║         Brain Trust — Standup Meeting                 ║
║         2026-03-01 14:00 UTC                          ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  🧑 CEO:                                              ║
║    Done: Reviewed Q1 roadmap priorities               ║
║    Now:  Evaluating partnership proposal              ║
║    Blockers: None                                     ║
║                                                       ║
║  👨‍💻 CTO:                                              ║
║    Done: Merged auth refactor PR (#142)               ║
║    Now:  Designing database migration plan            ║
║    Blockers: Need CFO approval on cloud budget        ║
║                                                       ║
║  🔧 Developer:                                        ║
║    Done: Checkout component v2 (task-009)             ║
║    Now:  Writing unit tests for checkout              ║
║    Blockers: None                                     ║
║                                                       ║
║  🎨 Designer:                                          ║
║    Done: Mobile checkout wireframes (task-008) ✅     ║
║    Now:  High-fidelity mockups for review             ║
║    Blockers: Waiting for brand color update           ║
║                                                       ║
║  Minutes saved to: .brain-trust/meetings/             ║
║    2026-03-01-standup.md                              ║
╚═══════════════════════════════════════════════════════╝
```

**`bt decide <question> --protocol <type>`** — Make team decision

Output:
```
╔═══════════════════════════════════════════════════════╗
║     Brain Trust Decision — Weighted Protocol          ║
╠═══════════════════════════════════════════════════════╣
║  Question: "Should we migrate from REST to GraphQL?"  ║
║                                                       ║
║  CTO (weight 3x):        ✅ YES                       ║
║    "Reduces over-fetching by 60%. Client teams        ║
║     already requesting flexible queries."             ║
║                                                       ║
║  Developer (weight 2x):  ⚠️ CONDITIONAL YES           ║
║    "Yes, but phase it. Start with read queries,       ║
║     keep REST for writes until tooling matures."      ║
║                                                       ║
║  Security (weight 1x):   ❌ NO                        ║
║    "GraphQL introduces new attack vectors: deep       ║
║     queries, introspection leaks. Need rate limiting."║
║                                                       ║
║  Designer (weight 1x):   ✅ YES                       ║
║    "Faster frontend iteration with query flexibility."║
║                                                       ║
║  ═══════════════════════════════════════════════════   ║
║  Result: YES (weighted score: 8/10)                   ║
║  Action: Phased migration, read-first approach        ║
║  Dissent logged: Security concerns noted              ║
║  Decision saved to: .brain-trust/decisions/log.jsonl  ║
╚═══════════════════════════════════════════════════════╝
```

**`bt status`** — Project overview:
- Active tasks by role
- Completed vs pending
- Blockers
- Next milestones

Output:
```
╔═══════════════════════════════════════════════════════╗
║           Brain Trust — Project Status                ║
╠═══════════════════════════════════════════════════════╣
║  Active Tasks: 5 │ Completed: 12 │ Blocked: 1        ║
║                                                       ║
║  By Role:                                             ║
║  CEO       │ 1 active  │ 3 completed │ 0 blocked     ║
║  CTO       │ 1 active  │ 4 completed │ 1 blocked     ║
║  Developer │ 2 active  │ 3 completed │ 0 blocked     ║
║  Designer  │ 1 active  │ 2 completed │ 0 blocked     ║
║                                                       ║
║  Blockers:                                            ║
║  🚫 task-011: DB migration plan (CTO)                 ║
║     Waiting on: CFO budget approval                   ║
║                                                       ║
║  Next Milestones:                                     ║
║  📌 Mar 05 — Checkout redesign complete               ║
║  📌 Mar 10 — API v2 beta release                      ║
║  📌 Mar 15 — Security audit complete                  ║
╚═══════════════════════════════════════════════════════╝
```

**`bt report [daily|weekly]`** — Generate report

Output:
```
📄 Weekly Report generated: .brain-trust/reports/2026-03-01.md

  # Brain Trust Weekly Report — 2026-03-01

  ## Summary
  - Tasks completed this week: 8
  - Tasks in progress: 5
  - Blocked tasks: 1
  - Decisions made: 3
  - Meetings held: 5 (3 standups, 1 review, 1 brainstorm)

  ## Highlights
  - Checkout redesign wireframes approved
  - Auth refactor merged (PR #142)
  - GraphQL migration decision: approved (phased)

  ## Risks
  - DB migration blocked on budget approval (3 days)
  - Designer waiting on brand color update

  Report saved to .brain-trust/reports/2026-03-01.md (3.8 KB)
```

**`bt tasks`** — List all tasks

Output:
```
╔═══════════════════════════════════════════════════════════╗
║                Brain Trust — All Tasks                    ║
╠═══════════════════════════════════════════════════════════╣
║  ID       │ Task                        │ Role      │ St  ║
║  ─────────┼─────────────────────────────┼───────────┼──── ║
║  task-008 │ Mobile checkout wireframes  │ Designer  │ ✅  ║
║  task-009 │ Checkout components v2      │ Developer │ ●   ║
║  task-010 │ Accessibility review        │ Reviewer  │ ○   ║
║  task-011 │ DB migration plan           │ CTO       │ 🚫  ║
║  task-012 │ Unit tests for checkout     │ Developer │ ●   ║
║  task-013 │ Partnership evaluation      │ CEO       │ ●   ║
║  task-014 │ Hi-fi mockups              │ Designer  │ ●   ║
║  task-015 │ Rate limiting review        │ Security  │ ●   ║
║                                                           ║
║  Legend: ✅ completed │ ● in_progress │ ○ pending │ 🚫 blocked ║
║  Total: 1 completed │ 5 active │ 1 pending │ 1 blocked   ║
╚═══════════════════════════════════════════════════════════╝
```

**`bt escalate <task>`** — Escalate blocked task to higher level

Output:
```
╔═══════════════════════════════════════════════════╗
║         Task Escalation                           ║
╠═══════════════════════════════════════════════════╣
║  Task:      task-011 (DB migration plan)          ║
║  From:      CTO                                   ║
║  Escalated: CEO                                   ║
║  Reason:    Blocked 3 days — awaiting CFO budget  ║
║             approval for cloud infrastructure     ║
║                                                   ║
║  CEO Response:                                    ║
║  "Approving $2,400/month cloud budget directly.   ║
║   CFO to reconcile in Q2 review. CTO proceed     ║
║   with migration plan immediately."               ║
║                                                   ║
║  ✅ Blocker resolved. task-011 status: in_progress║
║  Decision logged to decisions/log.jsonl           ║
╚═══════════════════════════════════════════════════╝
```

**`bt disband`** — Remove Brain Trust from project

Output:
```
╔═══════════════════════════════════════════════════╗
║         Brain Trust — Disband                     ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ⚠️ This will remove the Brain Trust team from    ║
║  this project. Data will be preserved.            ║
║                                                   ║
║  Current state:                                   ║
║    Active tasks: 5 (will be marked abandoned)     ║
║    Completed tasks: 12 (preserved in archive)     ║
║    Decisions: 3 (preserved in log)                ║
║    Meetings: 9 minutes saved                      ║
║                                                   ║
║  Confirm disband? (yes/no): yes                   ║
║                                                   ║
║  ✅ Brain Trust disbanded.                         ║
║  Archive saved to: .brain-trust/archive/          ║
║  Run `bt init` to create a new team.              ║
╚═══════════════════════════════════════════════════╝
```

### Data Storage

```
.brain-trust/
├── config.json              # Team composition and rules
├── tasks/
│   ├── active.jsonl         # Current tasks
│   └── completed.jsonl      # Finished tasks
├── decisions/
│   └── log.jsonl            # All decisions with reasoning
├── meetings/
│   └── {date}-{type}.md     # Meeting minutes
├── agents/
│   └── {role}.md            # Role definitions
└── reports/
    └── {date}.md            # Generated reports
```

## Error Handling

Brain Trust handles orchestration failures gracefully to prevent task loss and ensure the team structure remains consistent.

### Consensus Failure

| Scenario | Handling |
|---|---|
| **Unanimous protocol: no agreement after 3 rounds** | Escalate to CEO for executive decision. Log all role positions and reasoning. Final output includes a "Dissent" section noting unresolved disagreements. |
| **Majority protocol: exact tie** | Invoke weighted voting as tiebreaker (domain expert gets 2x weight). If still tied, escalate to CEO. |
| **Weighted protocol: all weights equal** | Fall back to majority vote. If still tied, CEO decides. |
| **No roles provide input** | Abort the decision. Report which roles failed to respond. Suggest re-running with a simpler team template. |

### Role Timeout

| Scenario | Handling |
|---|---|
| **Single role unresponsive during meeting** | Skip after 30-second timeout. Note the missing perspective in the meeting minutes. Continue with available roles. |
| **Multiple roles unresponsive** | If >50% of roles fail, abort the meeting. Log partial results. Suggest re-running with a smaller team. |
| **CEO unresponsive during escalation** | Fall back to CTO for technical decisions, CFO for business decisions, or the highest-ranking available role. |

### Budget Exceeded

| Scenario | Handling |
|---|---|
| **Token budget exceeded mid-task** | Complete the current role's output, then pause. Report partial results and remaining tasks. Suggest using Context Slim to free capacity before continuing. |
| **Task generates excessive subtasks (>20)** | Cap subtask generation at 20. CEO consolidates remaining work into grouped tasks. Warn user about scope complexity. |
| **Meeting exceeds time budget** | Summarize each remaining role's position in 1 sentence instead of full analysis. Mark the meeting as "abbreviated" in minutes. |

### Model API Error

| Scenario | Handling |
|---|---|
| **API rate limit during multi-role discussion** | Queue remaining roles and process sequentially with 2-second delays. Meeting quality is preserved but takes longer. |
| **API timeout** | Retry the current role's response once. If it fails again, record "No response" for that role and continue. |
| **Context length exceeded** | Compress earlier role outputs using semantic summarization. Each role's full output is preserved in `.brain-trust/meetings/` but the working context uses compressed versions. |
| **Invalid response format** | Re-prompt the role with stricter formatting instructions. If it fails twice, have the PM role reformat the output. |

### Data Integrity

- **Config file corrupted**: Rebuild from template defaults. Warn user that custom role modifications may be lost.
- **Task state inconsistency** (e.g., completed task still in active list): Run `bt status --repair` to reconcile task states.
- **Meeting minutes incomplete**: Always write minutes incrementally (after each role speaks), not at the end. This prevents total loss on mid-meeting failure.

## Brain Trust vs Other Multi-Agent Systems

| Feature | Brain Trust | AutoGPT | CrewAI | LangChain Agents |
|---|---|---|---|---|
| **Architecture** | Single agent, multi-perspective (role adoption) | Autonomous single agent with self-prompting | Multi-agent with role-based task delegation | Modular agent chains with tool use |
| **Cost per Run** | Zero additional cost (same context, one model call) | High — recursive self-prompting = many API calls | Medium-High — one API call per agent per task | Medium — one call per chain step |
| **Role System** | 10+ predefined roles with custom role support | No roles — single autonomous agent | Role-based agents with backstory/goals | Tool-specialized agents |
| **Consensus Protocols** | 4 built-in (unanimous, majority, weighted, executive) | None — single decision maker | Task output aggregation only | None — sequential chain |
| **Meeting Types** | 5 formats (standup, review, brainstorm, retro, war-room) | None | None | None |
| **Hierarchical Delegation** | CEO > Directors > Team — tasks flow down, results flow up | Flat — self-assigns subtasks | Flat or sequential task pipeline | Sequential chain |
| **Templates** | 5 pre-built team templates (startup, dev-team, etc.) | N/A | Custom crew definitions | Pre-built chain templates |
| **Setup Complexity** | `bt init [template]` — one command | Python environment + config + API keys | Python code + role definitions + API keys | Python code + tool configs + API keys |
| **Hallucination Risk** | Low — structured roles constrain output scope | High — autonomous loops amplify errors | Medium — role constraints help | Medium — tool grounding helps |
| **Token Efficiency** | High — all roles share one context window | Low — each loop iteration uses full context | Low — each agent has separate context | Medium — chain passes summaries |
| **Determinism** | High — same roles + protocol = consistent structure | Low — autonomous decisions vary widely | Medium — task routing varies | Medium-High — chain structure is fixed |
| **OpenClaw Integration** | Native — designed for OpenClaw ecosystem | Standalone Python application | Standalone Python framework | Standalone Python framework |

## FAQ

**Q: Does this actually run multiple LLM instances?**
A: No — it's a single agent adopting different role perspectives. The power is in structured thinking from multiple viewpoints, not parallel API calls. This keeps costs at zero.

**Q: How many roles should I use?**
A: Start with 3-5 for most tasks. More roles = more thorough but slower. Use templates as starting points.

**Q: Can I customize role behaviors?**
A: Yes. Edit the role files in `.brain-trust/agents/` to modify any role's expertise and behavior.

**Q: What happens if roles disagree and consensus cannot be reached?**
A: It depends on the protocol. In `unanimous` mode, after 3 failed rounds, the CEO makes the final call. In `majority` mode, a tie triggers weighted voting. In all cases, dissenting opinions are logged so you can review the full debate.

**Q: Can I use Brain Trust for non-technical tasks (marketing, writing, strategy)?**
A: Absolutely. The `content` template (Editor, 2 Writers, SEO Specialist, Designer) is designed for content work. The `research` template is ideal for market research and competitive analysis. You can also create fully custom teams with `bt add-role`.

**Q: How does hierarchical delegation differ from just asking the agent directly?**
A: Direct questions get one perspective. Hierarchical delegation forces structured decomposition: the CEO breaks the problem into subtasks, assigns them to specialists, collects results with confidence scores, and synthesizes a final answer. This catches blind spots that a single perspective misses.

**Q: Does Brain Trust work with other skills simultaneously?**
A: Yes. Brain Trust is an orchestration layer — it can use any other installed skill as part of its workflow. For example, the Security role might invoke Skill Guardian, or the Analyst role might use Agent Dashboard data.

**Q: What is the maximum team size?**
A: There is no hard limit, but practical effectiveness peaks at 8-10 roles. Beyond that, consensus discussions become verbose and the context window fills faster. For large projects, use hierarchical teams where each director manages 2-3 team members.

**Q: Can I save and reuse team configurations across projects?**
A: Yes. The team configuration is stored in `.brain-trust/config.json`. Copy this file to new projects or create named templates with `bt init` followed by customization. Role definitions in `.brain-trust/agents/` are portable between projects.

**Q: How do I track what Brain Trust decided and why?**
A: Every decision is logged to `.brain-trust/decisions/log.jsonl` with full reasoning from each role, the protocol used, vote counts, and the final outcome. Meeting minutes are saved to `.brain-trust/meetings/`. Use `bt report` to generate human-readable summaries.
