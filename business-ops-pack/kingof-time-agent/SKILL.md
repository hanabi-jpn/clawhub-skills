---
name: kingof-time-agent
description: Attendance and time tracking automation — daily/monthly data, payroll sync via Japan's leading attendance system
author: hanabi-jpn
version: 1.0.0
tags:
  - attendance
  - time-tracking
  - payroll
  - japan
  - hr
  - overtime
  - shifts
  - labor-compliance
---

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   ██╗  ██╗██╗███╗   ██╗ ██████╗      ██████╗ ███████╗           ║
  ║   ██║ ██╔╝██║████╗  ██║██╔════╝     ██╔═══██╗██╔════╝           ║
  ║   █████╔╝ ██║██╔██╗ ██║██║  ███╗    ██║   ██║█████╗             ║
  ║   ██╔═██╗ ██║██║╚██╗██║██║   ██║    ██║   ██║██╔══╝             ║
  ║   ██║  ██╗██║██║ ╚████║╚██████╔╝    ╚██████╔╝██║                ║
  ║   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝      ╚═════╝ ╚═╝              ║
  ║                                                                  ║
  ║      ████████╗██╗███╗   ███╗███████╗                             ║
  ║      ╚══██╔══╝██║████╗ ████║██╔════╝                             ║
  ║         ██║   ██║██╔████╔██║█████╗                               ║
  ║         ██║   ██║██║╚██╔╝██║██╔══╝                               ║
  ║         ██║   ██║██║ ╚═╝ ██║███████╗                             ║
  ║         ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝                            ║
  ║                   A G E N T                                      ║
  ║        Attendance Intelligence Platform                          ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
```

`skill: kingof-time-agent` `platform: King of Time` `protocol: REST API` `lang: en/ja` `attendance: cloud`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/kingof-time-agent)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Attendance](https://img.shields.io/badge/attendance-cloud_%231_JP-blue)]()

> **Command your workforce attendance data from the terminal -- clock punches, overtime, leave, and payroll on Japan's market-leading time management system.**

---

## Overview

King of Time Agent brings Japan's most widely deployed cloud attendance system directly to your command line. Used by over 58,000 companies and 3.6 million employees across Japan, King of Time (KOT) is the de facto standard for time and attendance management in Japanese enterprises. This agent provides complete API access to clock-in/out records, daily and monthly attendance summaries, overtime calculations, paid leave balances, shift schedules, and payroll-ready exports.

Japanese labor law imposes strict requirements on attendance management: the Labor Standards Act mandates accurate recording of working hours, the 36 Agreement (saburoku kyoutei) caps overtime hours, and recent reforms enforce the "work style reform" (hatarakikata kaikaku) upper limits of 45 hours/month and 360 hours/year overtime. Violations carry penalties. King of Time Agent monitors these thresholds in real time, providing alerts before employees breach legal limits. The agent also handles Japan-specific attendance patterns including flex time (furekkusu taimu), deemed working hours for outside sales (minashi roudou), and special leave categories like condolence leave (kibiki kyuuka) and maternity leave. Integration with payroll systems enables seamless end-of-month data export with overtime premiums pre-calculated at the statutory rates (25% normal overtime, 35% holiday work, 50% late-night premium).

```
  ┌─────────────────────────────────────────────────────────────┐
  │            KING OF TIME AGENT ARCHITECTURE                   │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │   Terminal CLI                                              │
  │       │                                                     │
  │       ▼                                                     │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Command    │───▶│  API Auth     │───▶│  KOT Cloud  │  │
  │   │  Parser     │    │  (Bearer Tkn) │    │  API v1     │  │
  │   └─────────────┘    └───────────────┘    └──────┬──────┘  │
  │        │                                         │         │
  │        ▼                                         ▼         │
  │   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
  │   │  Attendance │    │  Overtime     │    │  Leave      │  │
  │   │  Tracker    │    │  Calculator   │    │  Manager    │  │
  │   └──────┬──────┘    └───────┬───────┘    └──────┬──────┘  │
  │          │                   │                   │         │
  │          └───────────────────┼───────────────────┘         │
  │                              │                             │
  │                              ▼                             │
  │                    ┌───────────────────┐                   │
  │                    │  Compliance       │                   │
  │                    │  Engine (36 Agr.) │                   │
  │                    └────────┬──────────┘                   │
  │                             │                              │
  │                ┌────────────┼────────────┐                 │
  │                ▼            ▼            ▼                 │
  │          ┌──────────┐ ┌──────────┐ ┌──────────┐           │
  │          │ Payroll  │ │ Reports  │ │ Alerts   │           │
  │          │ Export   │ │ Monthly  │ │ System   │           │
  │          └──────────┘ └──────────┘ └──────────┘           │
  │                                                            │
  └─────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

When operating as the King of Time Agent, adhere to the following rules:

1. Authenticate using `KOT_ACCESS_TOKEN` as a Bearer token in all API requests.
2. Default API base to `https://api.kingtime.jp/v1` unless overridden by `KOT_API_BASE`.
3. Always scope requests to `KOT_COMPANY_ID` when operating in multi-company environments.
4. Display all times in 24-hour format (HH:MM) and in JST (Asia/Tokyo) by default.
5. Overtime calculations must follow Japanese labor law: 25% premium for regular OT, 35% for holiday work, 50% for late-night (22:00-05:00), and 60% for OT exceeding 60 hours/month.
6. Track the 36 Agreement limits and emit warnings at 80% threshold (36 hours/month, 288 hours/year by default).
7. Paid leave balance must show both granted days and remaining days, including carry-over from previous fiscal year.
8. Never modify clock records without `--confirm` flag; attendance data is legally regulated.
9. Shift management must validate that assigned shifts do not violate minimum rest period (11 hours between shifts recommended).
10. Monthly closing operations should verify all employees have complete attendance data before generating payroll export.
11. Flex time calculations must use the settlement period (seisan kikan) defined in company rules (weekly, monthly, or quarterly).
12. Late arrivals and early departures must be flagged separately from absences.
13. Display employee names in Japanese order (family name first) unless `--western` flag is set.
14. Payroll export must include statutory breakdown: regular hours, OT hours (by premium tier), holiday hours, late-night hours, and deductions.
15. Handle API pagination for large employee lists; never silently truncate.
16. Cache employee master data for 24 hours to reduce API calls on repeated lookups.
17. Alert thresholds must be configurable per employee group (management, regular, part-time).
18. All clock operations must log the source (CLI, terminal, mobile) for audit compliance.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `KOT_ACCESS_TOKEN` | Yes | -- | API access token from KOT admin console |
| `KOT_API_BASE` | No | `https://api.kingtime.jp/v1` | API base URL |
| `KOT_COMPANY_ID` | No | -- | Company ID (required for multi-company setups) |

Set these in your shell profile or `.env` file:

```bash
export KOT_ACCESS_TOKEN="kot_tk_abc123def456ghi789jkl012"
export KOT_API_BASE="https://api.kingtime.jp/v1"
export KOT_COMPANY_ID="company_001"
```

---

## Commands

### `kot attendance` -- View daily attendance records

```bash
$ kot attendance --date 2026-02-28

  Daily Attendance (2026-02-28, Friday)
  ══════════════════════════════════════════════════════════════

  Employee         Dept.        Clock In   Clock Out  Work Hrs  OT Hrs   Status
  ───────────────  ───────────  ─────────  ─────────  ────────  ───────  ────────
  Tanaka Kenji     Engineering  08:52      19:30      9:38      1:38     OT
  Suzuki Yui       Sales        09:01      18:05      8:04      0:04     Normal
  Yamamoto Daiki   HR           08:45      17:45      8:00      0:00     Normal
  Sato Mio         Engineering  09:15      21:02      10:47     2:47     OT [!]
  Watanabe Ren     Sales        --:--      --:--      --:--     --:--    Absent
  Ito Sakura       Marketing    09:00      18:30      8:30      0:30     Normal
  Nakamura Haruto  Engineering  08:30      22:15      12:45     4:45     OT [!!]
  Kobayashi Aoi    Accounting   09:05      18:00      7:55      0:00     Normal

  Summary:  8 employees | 7 present | 1 absent | 3 overtime
  [!] = approaching 36-agreement limit  [!!] = exceeds daily threshold

  ── attendance data retrieved in 0.38s ──
```

### `kot clock` -- Manage clock-in/out punches

```bash
$ kot clock --employee tanaka-k --action in --time "09:00"

  Clock Record Created
  ══════════════════════════════════════════════════════════════

  Employee:      Tanaka Kenji (ID: EMP-0042)
  Date:          2026-03-01 (Monday)
  Action:        Clock In
  Time:          09:00 JST
  Source:        CLI (kot-agent)
  Record ID:     CLK-20260301-0042-IN

  [OK] Clock-in recorded successfully.

$ kot clock --employee tanaka-k --action out --time "18:30"

  Clock Record Created
  ══════════════════════════════════════════════════════════════

  Employee:      Tanaka Kenji (ID: EMP-0042)
  Date:          2026-03-01 (Monday)
  Action:        Clock Out
  Time:          18:30 JST
  Source:        CLI (kot-agent)
  Record ID:     CLK-20260301-0042-OUT

  Working hours: 8:30 (Regular: 8:00 + OT: 0:30)

  [OK] Clock-out recorded successfully.
```

### `kot monthly` -- Monthly attendance summary

```bash
$ kot monthly --employee tanaka-k --period 2026-02

  Monthly Attendance: Tanaka Kenji (February 2026)
  ══════════════════════════════════════════════════════════════

  Working Days:         20 / 20 (100% attendance)
  Total Work Hours:     184:30
  Regular Hours:        160:00
  Overtime Hours:        24:30

  Overtime Breakdown:
  ─────────────────────────────────────────────────────────────
  Regular OT (x1.25):          18:30
  Holiday OT (x1.35):           4:00  (Feb 11 National Holiday)
  Late Night (x1.50):           2:00  (22:00-05:00)

  Late Arrivals:        1 (Feb 12, 09:15 — 15 min)
  Early Departures:     0
  Absences:             0

  Paid Leave Used:      0 days (Remaining: 14.0 days)
  36 Agreement Status:  24:30 / 45:00 hrs (54.4%) -- OK

  ── report generated in 0.52s ──
```

### `kot overtime` -- Overtime tracking and compliance monitoring

```bash
$ kot overtime --period 2026-02 --threshold 80

  Overtime Compliance Report (February 2026)
  ══════════════════════════════════════════════════════════════

  36 Agreement Limits: 45 hrs/month | 360 hrs/year
  Alert Threshold: 80% (36 hrs/month | 288 hrs/year)

  Employee         Dept.        Month OT   % Limit   YTD OT    % Annual   Alert
  ───────────────  ───────────  ─────────  ────────  ────────  ─────────  ──────
  Nakamura Haruto  Engineering  42:15      93.9%     312:30    86.8%      [!!]
  Sato Mio         Engineering  38:00      84.4%     298:00    82.8%      [!]
  Tanaka Kenji     Engineering  24:30      54.4%     220:15    61.2%      --
  Ito Sakura       Marketing    12:00      26.7%     108:00    30.0%      --
  Suzuki Yui       Sales         8:30      18.9%      76:30    21.3%      --

  ALERTS:
  ─────────────────────────────────────────────────────────────
  [!!] CRITICAL: Nakamura Haruto at 93.9% monthly limit (2:45 remaining)
  [!!] CRITICAL: Nakamura Haruto at 86.8% annual limit (47:30 remaining)
  [!]  WARNING:  Sato Mio at 84.4% monthly limit (7:00 remaining)
  [!]  WARNING:  Sato Mio at 82.8% annual limit (62:00 remaining)

  ── 2 employees require immediate attention ──
```

### `kot leave` -- Paid leave balance and requests

```bash
$ kot leave --team engineering

  Paid Leave Summary: Engineering Department
  ══════════════════════════════════════════════════════════════

  Employee         Granted   Carried   Used    Remaining  Expiring
  ───────────────  ────────  ────────  ──────  ─────────  ──────────
  Tanaka Kenji     20.0      3.0       9.0     14.0       3.0 (Mar 31)
  Sato Mio         20.0      5.0       2.0     23.0       5.0 (Mar 31)
  Nakamura Haruto  12.0      0.0       1.0     11.0       --
  Kimura Yuto      15.0      2.0       8.0      9.0       2.0 (Mar 31)

  WARNINGS:
  ─────────────────────────────────────────────────────────────
  [!] Nakamura Haruto: Only 1 day used this year (min 5 days required by law)
  [!] Tanaka Kenji: 3.0 carry-over days expiring Mar 31
  [!] Kimura Yuto: 2.0 carry-over days expiring Mar 31

  Legal requirement: Each employee must take minimum 5 days paid leave per year.

  ── leave data as of 2026-03-01 ──
```

### `kot shifts` -- Shift schedule management

```bash
$ kot shifts --team sales --week 2026-03-02

  Shift Schedule: Sales Department (Week of Mar 2, 2026)
  ══════════════════════════════════════════════════════════════

  Employee       Mon 3/2     Tue 3/3     Wed 3/4     Thu 3/5     Fri 3/6
  ─────────────  ──────────  ──────────  ──────────  ──────────  ──────────
  Suzuki Yui     09:00-18:00 09:00-18:00 09:00-18:00 Day Off     09:00-18:00
  Watanabe Ren   10:00-19:00 10:00-19:00 Day Off     10:00-19:00 10:00-19:00
  Morita Hana    09:00-18:00 Day Off     09:00-18:00 09:00-18:00 09:00-18:00
  Ogawa Sora     Flex        Flex        Flex        Flex        Flex

  Legend: Flex = Core 10:00-15:00, settle monthly
  Rest compliance: All shifts have 11+ hrs between end and next start [OK]

  ── shift schedule retrieved in 0.29s ──
```

### `kot employees` -- Employee master data

```bash
$ kot employees --dept engineering --status active

  Employee Directory: Engineering
  ══════════════════════════════════════════════════════════════

  ID        Name             Position            Start Date   Type       Work Pattern
  ────────  ───────────────  ──────────────────  ───────────  ─────────  ────────────
  EMP-0042  Tanaka Kenji     Senior Engineer     2019-04-01   Full-time  Standard
  EMP-0088  Sato Mio         Engineer            2021-10-01   Full-time  Standard
  EMP-0103  Nakamura Haruto  Lead Engineer       2018-04-01   Full-time  Flex
  EMP-0156  Kimura Yuto      Junior Engineer     2023-04-01   Full-time  Standard
  EMP-0201  Chen Wei         Contract Engineer   2025-06-01   Contract   Standard

  ── 5 active employees in Engineering ──
```

### `kot export` -- Export attendance data for payroll

```bash
$ kot export --period 2026-02 --format csv --payroll

  Payroll Export (February 2026)
  ══════════════════════════════════════════════════════════════

  Employees:       28
  Period:          2026-02-01 to 2026-02-28
  Format:          CSV (payroll-compatible)

  Columns:
    emp_id, name, dept, regular_hrs, ot_125_hrs, ot_135_hrs,
    ot_150_hrs, ot_160_hrs, late_count, absence_days, leave_used

  Output:          ./payroll_2026-02.csv

  [████████████████████████████████████████] 28/28

  Validation:
    All employees have complete records     [OK]
    No unresolved clock errors              [OK]
    36-agreement limits verified            [OK]

  [OK] Exported 28 employee records to payroll_2026-02.csv (6.2 KB)
```

### `kot report` -- Attendance analytics and trends

```bash
$ kot report --type department --period 2026-02

  Department Attendance Report (February 2026)
  ══════════════════════════════════════════════════════════════

  Department     Headcount  Avg Work/Day  Avg OT/Month  Attendance%  Late Count
  ─────────────  ─────────  ────────────  ────────────  ───────────  ──────────
  Engineering    5          9:15          26:30         98.0%        2
  Sales          4          8:20          10:15         95.0%        1
  Marketing      3          8:35          14:00         100.0%       0
  Accounting     4          8:05           4:30         100.0%       0
  HR             3          8:10           2:45         100.0%       0

  Company-wide:
    Average overtime:      14:24 / employee
    Attendance rate:       98.6%
    Remote work ratio:     32% (Mon/Fri highest)

  Trend (3-month):
    Dec 2025:  12:50 avg OT  |  97.8% attendance
    Jan 2026:  15:20 avg OT  |  98.2% attendance
    Feb 2026:  14:24 avg OT  |  98.6% attendance

  ── report generated in 1.8s ──
```

### `kot alerts` -- Compliance alerts and notifications

```bash
$ kot alerts --active

  Active Compliance Alerts
  ══════════════════════════════════════════════════════════════

  CRITICAL (2):
  ─────────────────────────────────────────────────────────────
  [!!] Nakamura Haruto (Engineering)
       Monthly OT: 42:15 / 45:00 (93.9%) - only 2:45 hrs remaining
       Annual OT: 312:30 / 360:00 (86.8%)
       Action: Restrict overtime assignments immediately

  [!!] Sato Mio (Engineering)
       Annual OT: 298:00 / 360:00 (82.8%)
       Action: Plan workload reduction for Q4

  WARNINGS (3):
  ─────────────────────────────────────────────────────────────
  [!]  Nakamura Haruto: Only 1/5 required paid leave days taken (8 months remaining)
  [!]  Tanaka Kenji: 3.0 carry-over leave days expire 2026-03-31
  [!]  Watanabe Ren: 3 absences in February (requires manager follow-up)

  INFO (1):
  ─────────────────────────────────────────────────────────────
  [i]  Monthly closing for February 2026 is pending (due: Mar 5)

  ── 6 active alerts as of 2026-03-01 09:00 JST ──
```

---

## Workflow Diagram

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  IC Card     │     │  Mobile App  │     │  Web Portal  │
  │  Terminal    │     │  GPS Stamp   │     │  Manual Entry│
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  King of Time Cloud │
                   │  (Raw Punch Data)   │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  KOT Agent CLI      │
                   │  (kot commands)     │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  Daily/      │   │  Overtime &  │   │  Leave       │
  │  Monthly     │   │  Compliance  │   │  Balance     │
  │  Attendance  │   │  Monitor     │   │  Tracker     │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Monthly Closing    │
                   │  + Validation       │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  Payroll     │   │  Manager     │   │  Compliance  │
  │  CSV Export  │   │  Reports     │   │  Alerts      │
  └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_INVALID: 401 Unauthorized` | Expired or revoked access token | Generate new token in KOT admin under API Settings > Access Tokens |
| `CLOCK_DUPLICATE: Punch already exists` | Clock-in/out already recorded for this time slot | Use `kot attendance --date` to view existing records; use `--override` with `--confirm` to replace |
| `EMPLOYEE_NOT_FOUND: EMP-XXXX` | Invalid employee ID or inactive employee | Check ID with `kot employees --all`; inactive employees require `--include-inactive` |
| `PERIOD_LOCKED: February 2026 is closed` | Monthly attendance already finalized | Request admin to reopen period via `kot admin --unlock 2026-02` |
| `OVERTIME_LIMIT: 36-agreement breach detected` | Employee exceeded statutory overtime cap | Immediately review workload; document exemption if special clause applies |
| `SHIFT_CONFLICT: Insufficient rest between shifts` | Less than 11 hours between shift end and next start | Adjust shift schedule to ensure minimum interval; use `kot shifts --validate` |
| `EXPORT_INCOMPLETE: 3 employees missing clock data` | Some employees have gaps in attendance records | Run `kot attendance --missing --period 2026-02` to identify and resolve gaps |

---

## Data Storage

```
~/.kingof-time/
├── config/
│   └── config.yaml
├── cache/
│   ├── employees.json
│   └── schedules.json
├── reports/
│   ├── attendance/
│   └── overtime/
├── exports/
│   └── csv/
└── logs/
    └── agent.log
```

All tokens are stored encrypted. Attendance data caching respects the company's data retention policy. The audit log records every clock modification and payroll export for labor standards compliance.

---

## Comparison Table

| Feature | KOT Agent (CLI) | KOT Web UI | IEYASU | Jobcan | SmartHR |
|---|---|---|---|---|---|
| Clock in/out | CLI command | Web/IC card | Web/LINE | Web/Slack | No (HR only) |
| 36-agreement monitoring | Real-time alerts | Dashboard | Basic | Basic | No |
| Overtime calc (multi-tier) | Auto (125/135/150/160%) | Auto | Auto | Auto | No |
| Paid leave tracking | Balance + expiry alerts | Balance view | Balance | Balance | Balance |
| Flex time support | Settlement period calc | Yes | Limited | No | No |
| Shift management | CLI + validation | Drag-drop | Basic | Basic | No |
| Payroll export | Multi-format + validation | CSV | CSV | CSV | CSV |
| CLI/scripting | Full automation | No | No | Limited | No |
| Compliance alerts | Proactive, configurable | Basic | No | No | No |
| Multi-company | Per company ID | Per login | Per login | Per login | Per login |
| API access | Native | Limited | Yes | Yes | Yes |
| Employee count support | Unlimited | Unlimited | Free <5 | Free <5 | Free <30 |

---

## FAQ

**Q1: How do I generate a KOT API access token?**
Log into King of Time as an administrator. Navigate to Settings > External System Integration > API and create a new access token with the required scopes (attendance read/write, employee read).

**Q2: Can I clock in/out for multiple employees at once?**
Yes. Use `kot clock --batch employees.csv` where the CSV contains employee IDs and times. Each record is processed individually with full validation.

**Q3: How does the 36 Agreement monitoring work?**
The agent tracks cumulative overtime against configurable limits (default: 45 hrs/month, 360 hrs/year). Alerts trigger at 80% threshold. Special provisions (tokubetsu joukou) for busy periods allow temporary higher limits when configured.

**Q4: Can I handle flex time employees?**
Yes. Flex time employees are identified by their work pattern. The agent calculates overtime based on the settlement period (weekly, monthly, or quarterly) rather than daily thresholds.

**Q5: What happens if an employee forgets to clock out?**
The attendance record shows as incomplete. Use `kot attendance --missing` to find gaps, then `kot clock --employee EMP-XXXX --action out --time "18:00" --retroactive` with `--confirm` to fill in.

**Q6: How accurate are the overtime premium calculations?**
The agent applies the exact statutory rates from the Labor Standards Act: 25% for regular OT, 35% for statutory holiday work, 50% for late-night (22:00-05:00), and 60% for monthly OT exceeding 60 hours. Compound premiums (e.g., late-night holiday work at 60%) are calculated correctly.

**Q7: Can I integrate with specific payroll software?**
The export supports generic CSV format compatible with most Japanese payroll systems (MoneyForward Payroll, freee HR, PCA Payroll). Use `--payroll-format mf` or `--payroll-format freee` for software-specific column mapping.

**Q8: Does the agent support remote/hybrid work tracking?**
Yes. KOT supports location-based clock records. Use `kot attendance --location remote` to filter by work location. The agent displays work-from-home vs. office ratios in reports.

**Q9: How do I handle national holidays automatically?**
King of Time maintains a Japanese national holiday calendar. The agent recognizes these automatically for overtime premium calculations. Custom company holidays can be configured via `kot holidays --add 2026-12-29 --name "Year-end holiday"`.

**Q10: Can I set different alert thresholds for different employee groups?**
Yes. Use `kot alerts --config --group management --threshold 90` to set group-specific thresholds. Managers typically have different 36-agreement provisions than regular employees.

**Q11: Is retroactive clock modification audited?**
Every modification is logged in the audit trail with the original value, new value, timestamp, and the user who made the change. This satisfies labor inspection requirements.

**Q12: How do I handle employees with multiple employment types?**
Employees with dual roles (e.g., part-time + contract) should have separate employee IDs in KOT. The agent aggregates hours across IDs when `--aggregate` flag is used.
