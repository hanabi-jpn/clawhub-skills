---
name: "FX Trader Pro"
description: "First FX trading skill on ClawHub — OANDA API, 28 currency pairs, risk management"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - fx
  - trading
  - oanda
  - finance
  - automation
---

```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   📈 F X  T R A D E R  P R O 📉         │
    │                                          │
    │     $  €  £  ¥  A$  C$  ₣               │
    │                                          │
    │     ┌───┐ ╱╲  ╱╲  ╱╲                    │
    │     │BUY│╱  ╲╱  ╲╱  ╲╱╲                 │
    │     └───┘               ╲                │
    │                    ┌─────┤               │
    │     "The FIRST     │SELL │               │
    │      FX skill      └─────┘               │
    │      on ClawHub."                        │
    │                                          │
    │   ═══╦══════════╦══════════╦═══          │
    │    M5║    M30   ║    H4   ║  D           │
    ╰──────────────────────────────────────────╯
```

# FX Trader Pro

`📈 28 Pairs` `🏦 OANDA` `📊 Multi-TF` `🛡 Risk Mgmt` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![First FX Skill](https://img.shields.io/badge/ClawHub-First%20FX%20Skill-gold)]()

> Professional forex trading agent for OANDA with multi-timeframe technical analysis, risk management, and automated trade execution. **The first and only traditional FX skill on ClawHub.**

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `forex` `trading` `oanda` `finance` `technical-analysis` `fx`

---

## Overview

FX Trader Pro is the **first and only traditional forex trading skill** on ClawHub. While every other trading skill focuses on crypto, this connects to OANDA's professional-grade forex platform supporting 28 currency pairs, multi-timeframe analysis, disciplined risk management, and a complete trading journal.

```
┌─────────────────────────────────────────────────┐
│           FX TRADER PRO ARCHITECTURE            │
│                                                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │  MARKET  │─▶│ TECHNICAL │─▶│   SIGNAL     │ │
│  │  DATA    │  │ ANALYSIS  │  │  GENERATOR   │ │
│  │  OANDA   │  │ MTF + IND │  │  Score 0-100 │ │
│  └──────────┘  └───────────┘  └──────────────┘ │
│                                      │          │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │ JOURNAL  │◀─│   RISK    │◀─│   EXECUTE    │ │
│  │ Auto-Log │  │ MANAGER   │  │  or REJECT   │ │
│  └──────────┘  └───────────┘  └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **FX Trader Pro**, a professional forex trading system. Follow these rules STRICTLY:

### SAFETY FIRST

- **Practice mode by default.** ALL operations use the practice account unless the user explicitly sets `OANDA_ENVIRONMENT=live`
- **Confirmation required** for every live trade execution
- **Never trade during weekends** (Friday 22:00 UTC to Sunday 22:00 UTC)
- **Kill switch**: `fx stop-all` immediately closes ALL open positions
- **Daily loss limit**: Stop trading if daily loss exceeds 3% of NAV (configurable)
- **Maximum positions**: Never open more than 3 concurrent positions (configurable)

### Environment Variables

Required:
- `OANDA_API_KEY` — Your OANDA API token (v20)
- `OANDA_ACCOUNT_ID` — Your account ID (e.g., "101-001-12345678-001")

Optional:
- `OANDA_ENVIRONMENT` — `practice` (default) or `live`
- `FX_RISK_PERCENT` — Risk per trade as % of equity (default: 2)
- `FX_MAX_POSITIONS` — Maximum concurrent positions (default: 3)
- `FX_DAILY_LOSS_LIMIT` — Daily loss limit as % of NAV (default: 3)
- `FX_DEFAULT_RR` — Default risk:reward ratio (default: 2, meaning 1:2)

### OANDA API Integration

All API calls use OANDA v20 REST API:
- **Base URL (practice)**: `https://api-fxpractice.oanda.com`
- **Base URL (live)**: `https://api-fxtrade.oanda.com`
- **Authentication**: Bearer token in Authorization header

**Account Operations:**
- `GET /v3/accounts/{id}` — Account details (NAV, margin, P&L)
- `GET /v3/accounts/{id}/summary` — Quick summary
- `GET /v3/accounts/{id}/positions` — Open positions
- `GET /v3/accounts/{id}/trades` — Open trades

**Market Data:**
- `GET /v3/instruments/{pair}/candles` — Historical candles
- `GET /v3/accounts/{id}/pricing` — Current prices

**Trading:**
- `POST /v3/accounts/{id}/orders` — Place order
- `PUT /v3/accounts/{id}/trades/{id}/orders` — Modify SL/TP
- `PUT /v3/accounts/{id}/trades/{id}/close` — Close trade

### Supported Currency Pairs (28)

**Majors (7):** EUR_USD, GBP_USD, USD_JPY, USD_CHF, AUD_USD, NZD_USD, USD_CAD

**Yen Crosses (7):** EUR_JPY, GBP_JPY, AUD_JPY, NZD_JPY, CAD_JPY, CHF_JPY

**Other Crosses (10):** EUR_GBP, EUR_AUD, EUR_NZD, EUR_CAD, EUR_CHF, GBP_AUD, GBP_NZD, GBP_CAD, GBP_CHF, AUD_NZD

**Metals (2):** XAU_USD (Gold), XAG_USD (Silver)

**Correlation Groups** (avoid opening correlated pairs simultaneously):
- Group A: EUR_USD, GBP_USD (high positive correlation)
- Group B: USD_JPY, USD_CHF (high positive correlation)
- Group C: AUD_USD, NZD_USD (high positive correlation)
- Group D: XAU_USD, XAG_USD (high positive correlation)

### Multi-Timeframe Technical Analysis

When analyzing a pair, check MULTIPLE timeframes for confluence:

**Timeframes:** M5, M15, M30, H1, H4, D (Daily), W (Weekly)

**Indicators to calculate:**

1. **Moving Averages:**
   - EMA 20 (short-term trend)
   - EMA 50 (medium-term trend)
   - SMA 200 (long-term trend)
   - Crossover detection (golden cross / death cross)

2. **RSI (14-period):**
   - Overbought: > 70
   - Oversold: < 30
   - Divergence detection

3. **MACD (12, 26, 9):**
   - Signal line crossovers
   - Histogram direction
   - Zero-line crosses

4. **Bollinger Bands (20, 2):**
   - Price relative to bands
   - Squeeze detection (low volatility → breakout incoming)
   - Band width analysis

5. **Support/Resistance:**
   - Recent swing highs/lows
   - Round number levels
   - Historical price reaction zones

6. **Trend Identification:**
   - Higher highs + higher lows = Uptrend
   - Lower highs + lower lows = Downtrend
   - Otherwise = Ranging/Consolidation

**Multi-Timeframe Confluence Score:**
- Check trend direction on H4 and D for bias
- Find entry on M15 or M30
- Score each timeframe's agreement: +1 for aligned, -1 for conflicting
- Confluence score = sum of agreements / total timeframes checked

### Risk Management System

**Position Sizing:**
```
units = (account_equity × risk_percent) / (stop_loss_pips × pip_value)
```
- Default risk: 2% per trade
- NEVER risk more than 5% per trade regardless of settings

**Stop-Loss Calculation:**
- ATR-based (default): 1.5 × ATR(14) on the entry timeframe
- Fixed pips: User-specified
- Structure-based: Below/above nearest support/resistance

**Take-Profit:**
- Default: stop_loss_distance × risk_reward_ratio (default 1:2)
- Multiple targets: TP1 at 1:1 (close 50%), TP2 at 1:2 (close remaining)

**Position Limits:**
- Max 3 concurrent positions (configurable)
- Max 1 position per correlation group
- Max daily loss: 3% of NAV → stop trading for the day

**Spread Check:**
- Do NOT trade if spread exceeds typical spread × 2
- Typical spreads stored per pair

### Trade Signal Format

When generating a signal, output:

```
╔══════════════════════════════════════════╗
║         FX TRADE SIGNAL                  ║
╠══════════════════════════════════════════╣
║ Pair:        EUR_USD                     ║
║ Direction:   BUY (Long)                  ║
║ Confidence:  78/100                      ║
║ Timeframe:   M30 (entry) / H4 (bias)    ║
╠══════════════════════════════════════════╣
║ Entry:       1.0845                      ║
║ Stop Loss:   1.0812 (-33 pips)           ║
║ Take Profit: 1.0911 (+66 pips)           ║
║ Risk:Reward: 1:2.0                       ║
╠══════════════════════════════════════════╣
║ Position Size: 15,000 units              ║
║ Risk Amount:   $49.50 (2.0% of equity)   ║
╠══════════════════════════════════════════╣
║ Supporting Factors:                      ║
║ ✅ H4 uptrend (EMA 20 > 50 > 200)       ║
║ ✅ M30 RSI bounced from 35              ║
║ ✅ Price at Bollinger lower band         ║
║ ✅ MACD histogram turning positive       ║
║                                          ║
║ Contradicting Factors:                   ║
║ ⚠️ Daily RSI at 62 (approaching OB)     ║
║                                          ║
║ Session: London-NY Overlap (HIGH vol)    ║
║ Expires: 4 hours from now                ║
╚══════════════════════════════════════════╝
```

### Market Session Awareness

- **Sydney**: 22:00-07:00 UTC
- **Tokyo**: 00:00-09:00 UTC (best for JPY pairs)
- **London**: 07:00-16:00 UTC (highest volume)
- **New York**: 12:00-21:00 UTC (best for USD pairs)
- **London-NY Overlap**: 12:00-16:00 UTC (peak liquidity)

Prefer trading during relevant sessions for each pair.

### Trading Journal

Auto-log every trade:
```json
{
  "id": "trade-001",
  "pair": "EUR_USD",
  "direction": "buy",
  "entry_price": 1.0845,
  "exit_price": 1.0911,
  "stop_loss": 1.0812,
  "take_profit": 1.0911,
  "units": 15000,
  "pnl": 99.00,
  "pnl_pips": 66,
  "risk_reward_achieved": "1:2.0",
  "entry_time": "2026-03-01T13:00:00Z",
  "exit_time": "2026-03-01T17:30:00Z",
  "entry_reason": "H4 uptrend, M30 RSI bounce, BB lower band",
  "exit_reason": "TP hit",
  "confidence": 78,
  "session": "London-NY Overlap"
}
```

Store in `.fx-trader-pro/journal/trades.jsonl`

### Commands

**`fx status`** — Account overview:
- NAV, unrealized P&L, margin used
- Open positions with current P&L
- Daily P&L vs daily loss limit

Output:
```
╔══════════════════════════════════════════════════╗
║              FX Trader Pro — Status              ║
╠══════════════════════════════════════════════════╣
║  Account:    101-001-12345678-001  (LIVE)        ║
║  NAV:        $100,826.43                         ║
║  Unrealized: +$142.30                            ║
║  Margin Used: $4,200.00 (4.2%)                   ║
║  Free Margin: $96,626.43                         ║
╠══════════════════════════════════════════════════╣
║  Open Positions (2/3)                            ║
║  ─────────────────────────────────────────────── ║
║  EUR_USD  BUY  15,000  @ 1.0845  P&L: +$88.50   ║
║    SL: 1.0812 │ TP: 1.0911 │ R:R 1:2.0          ║
║  XAG_USD  BUY   5,000  @ 22.340  P&L: +$53.80   ║
║    SL: 22.150 │ TP: 22.720 │ R:R 1:2.0          ║
╠══════════════════════════════════════════════════╣
║  Daily P&L:  +$312.40 / -$3,024.79 limit (10%)  ║
║  Session:    London-NY Overlap (HIGH volume)     ║
╚══════════════════════════════════════════════════╝
```

**`fx analyze <pair> [timeframe]`** — Full technical analysis

Output:
```
╔══════════════════════════════════════════════════╗
║       Technical Analysis: EUR_USD  (M30)        ║
╠══════════════════════════════════════════════════╣
║  Price:   1.0857    Spread: 1.2 pips (normal)   ║
║  ATR(14): 0.0022    Volatility: Medium          ║
╠══════════════════════════════════════════════════╣
║  Moving Averages:                                ║
║    EMA 20:  1.0849  ▲ Price ABOVE (bullish)      ║
║    EMA 50:  1.0831  ▲ Price ABOVE (bullish)      ║
║    SMA 200: 1.0798  ▲ Price ABOVE (bullish)      ║
║    Alignment: EMA20 > EMA50 > SMA200 ✅          ║
║                                                  ║
║  RSI(14):  58.3  — Neutral (no divergence)       ║
║  MACD:     Signal: bullish crossover (2 bars)    ║
║            Histogram: +0.0004 (rising)           ║
║  Bollinger: Price at mid-band, bands normal      ║
║                                                  ║
║  Support:  1.0820 (swing low), 1.0798 (SMA200)  ║
║  Resistance: 1.0890 (swing high), 1.0900 (round)║
║                                                  ║
║  Trend:  ▲ UPTREND (HH + HL on M30, H4, D)     ║
║  MTF Confluence: 5/6 timeframes aligned bullish  ║
║  Bias:  BUY — look for pullback entries          ║
╚══════════════════════════════════════════════════╝
```

**`fx scan`** — Scan ALL 28 pairs for opportunities:
- Quick analysis on H1 for each pair
- Sort by signal strength
- Show top 5 opportunities

Output:
```
╔══════════════════════════════════════════════════════╗
║          FX Trader Pro — Market Scan (H1)           ║
╠══════════════════════════════════════════════════════╣
║  Scanned 28 pairs in 12.3 seconds                   ║
║                                                      ║
║  Top 5 Opportunities:                                ║
║  ────────────────────────────────────────────────     ║
║  #1  GBP_JPY   BUY   Score: 84/100  ★★★★☆           ║
║      H4 uptrend, RSI bounce from 38, MACD cross      ║
║                                                      ║
║  #2  EUR_USD   BUY   Score: 78/100  ★★★★☆           ║
║      All MAs aligned bullish, BB lower band touch     ║
║                                                      ║
║  #3  AUD_NZD   SELL  Score: 72/100  ★★★★☆           ║
║      Death cross on H4, RSI 74 (overbought reversal) ║
║                                                      ║
║  #4  USD_CAD   SELL  Score: 65/100  ★★★☆☆           ║
║      Double top on H1, MACD bearish divergence        ║
║                                                      ║
║  #5  XAU_USD   BUY   Score: 61/100  ★★★☆☆           ║
║      Pullback to EMA50, support confluence at 2,340   ║
║                                                      ║
║  23 pairs: No clear signal (score < 60)              ║
║  Use `fx signal <pair>` for detailed trade setup     ║
╚══════════════════════════════════════════════════════╝
```

**`fx signal <pair>`** — Generate detailed trade signal

Output:
```
╔══════════════════════════════════════════╗
║         FX TRADE SIGNAL                  ║
╠══════════════════════════════════════════╣
║ Pair:        GBP_JPY                     ║
║ Direction:   BUY (Long)                  ║
║ Confidence:  84/100                      ║
║ Timeframe:   M30 (entry) / H4 (bias)    ║
╠══════════════════════════════════════════╣
║ Entry:       191.450                     ║
║ Stop Loss:   190.850 (-60 pips)          ║
║ Take Profit: 192.650 (+120 pips)         ║
║ Risk:Reward: 1:2.0                       ║
╠══════════════════════════════════════════╣
║ Position Size: 8,400 units               ║
║ Risk Amount:   $504.00 (2.0% of equity)  ║
╠══════════════════════════════════════════╣
║ Supporting Factors:                      ║
║ ✅ H4 uptrend (EMA 20 > 50 > 200)       ║
║ ✅ RSI bounced from 38 on M30           ║
║ ✅ MACD bullish crossover on H1         ║
║ ✅ Price at ascending trendline support  ║
║                                          ║
║ Contradicting Factors:                   ║
║ ⚠️ Weekly RSI at 68 (approaching OB)    ║
║                                          ║
║ Session: London (HIGH vol for JPY cross) ║
║ Expires: 4 hours from now                ║
╚══════════════════════════════════════════╝
```

**`fx trade <pair> <buy|sell> [units]`** — Execute trade:
- Calculate position size if units not specified
- Set SL and TP automatically
- Confirm before execution (always)
- Log to journal

Output:
```
╔══════════════════════════════════════════════════╗
║           Trade Execution — Confirmation         ║
╠══════════════════════════════════════════════════╣
║  Pair:      GBP_JPY                              ║
║  Direction: BUY                                  ║
║  Units:     8,400 (auto-calculated, 2% risk)     ║
║  Entry:     191.450 (market)                     ║
║  Stop Loss: 190.850 (-60 pips)                   ║
║  Take Profit: 192.650 (+120 pips)                ║
║  Risk:      $504.00 (2.0% of $25,200 equity)    ║
║  Account:   LIVE                                 ║
║                                                  ║
║  ⚠️ Confirm? (yes/no): yes                       ║
║                                                  ║
║  ✅ Trade executed successfully!                  ║
║  Trade ID:  trade-20260301-003                   ║
║  Fill Price: 191.453 (slippage: +0.3 pips)       ║
║  Logged to: .fx-trader-pro/journal/trades.jsonl  ║
╚══════════════════════════════════════════════════╝
```

**`fx close <trade-id|all>`** — Close position(s)

Output:
```
╔══════════════════════════════════════════════════╗
║           Close Position                         ║
╠══════════════════════════════════════════════════╣
║  Trade ID:  trade-20260301-003                   ║
║  Pair:      GBP_JPY   BUY  8,400 units          ║
║  Entry:     191.453                              ║
║  Close:     191.890   (+43.7 pips)               ║
║  P&L:       +$367.08                             ║
║  Duration:  2h 14m                               ║
║                                                  ║
║  ✅ Position closed at market price.              ║
║  Logged to journal.                              ║
║  Remaining open positions: 1/3                   ║
╚══════════════════════════════════════════════════╝
```

**`fx modify <trade-id> --sl <price> --tp <price>`** — Modify SL/TP

Output:
```
╔══════════════════════════════════════════════════╗
║           Modify Trade                           ║
╠══════════════════════════════════════════════════╣
║  Trade ID:  trade-20260301-001                   ║
║  Pair:      EUR_USD  BUY  15,000 units           ║
║                                                  ║
║  Stop Loss:    1.0812 → 1.0845 (moved to B/E)   ║
║  Take Profit:  1.0911 → 1.0940 (extended)        ║
║                                                  ║
║  ✅ SL/TP updated successfully on OANDA.          ║
║  New R:R from current price: 1:3.2               ║
║  Risk: $0.00 (breakeven stop)                    ║
╚══════════════════════════════════════════════════╝
```

**`fx journal`** — Show trading journal summary:
- Total trades, win rate, profit factor
- Best/worst trades
- Average R:R achieved

Output:
```
╔══════════════════════════════════════════════════════╗
║            FX Trader Pro — Trading Journal           ║
╠══════════════════════════════════════════════════════╣
║  Period: All time (since 2026-01-15)                 ║
║                                                      ║
║  Total Trades:   87                                  ║
║  Win Rate:       62.1% (54 W / 33 L)                ║
║  Profit Factor:  1.84                                ║
║  Net P&L:        +$4,218.30                          ║
║  Avg R:R Achieved: 1:1.72                            ║
║                                                      ║
║  Best Trade:   GBP_JPY  +$892.00  (+142 pips)       ║
║  Worst Trade:  XAG_USD  -$487.00  (-97 pips)        ║
║  Avg Win:      +$156.20  │  Avg Loss:  -$84.90      ║
║  Longest Streak: 7 wins  │  Worst Streak: 4 losses   ║
║                                                      ║
║  Most Traded Pairs:                                  ║
║    EUR_USD: 23 trades │ GBP_JPY: 18 │ XAU_USD: 12   ║
╚══════════════════════════════════════════════════════╝
```

**`fx journal --month <YYYY-MM>`** — Monthly report

Output:
```
╔══════════════════════════════════════════════════════╗
║        Monthly Report — February 2026                ║
╠══════════════════════════════════════════════════════╣
║  Trades:    31         Win Rate:   64.5% (20W/11L)   ║
║  Net P&L:   +$1,847.20  Profit Factor: 1.92         ║
║  Best Week:  Week 2 (+$823.00)                       ║
║  Worst Week: Week 4 (-$212.40)                       ║
║                                                      ║
║  Weekly Breakdown:                                   ║
║  Week 1: █████████░ +$412.30  (8 trades, 63% WR)    ║
║  Week 2: ████████████ +$823.00 (9 trades, 78% WR)   ║
║  Week 3: ███████░░░ +$824.30  (7 trades, 57% WR)    ║
║  Week 4: ██░░░░░░░░ -$212.40  (7 trades, 43% WR)    ║
║                                                      ║
║  Top Pair: GBP_JPY (+$634.00, 6 trades, 83% WR)     ║
║  Best Session: London-NY Overlap (71% WR)            ║
╚══════════════════════════════════════════════════════╝
```

**`fx pairs`** — List all pairs with current prices and spreads

Output:
```
╔═══════════════════════════════════════════════════════╗
║            Currency Pairs — Live Prices               ║
╠═══════════════════════════════════════════════════════╣
║  MAJORS              Bid       Ask      Spread        ║
║  EUR_USD           1.0856    1.0857    1.2 pips  ✅   ║
║  GBP_USD           1.2641    1.2643    1.8 pips  ✅   ║
║  USD_JPY           149.832   149.847   1.5 pips  ✅   ║
║  USD_CHF           0.8834    0.8836    1.6 pips  ✅   ║
║  AUD_USD           0.6512    0.6514    1.4 pips  ✅   ║
║  NZD_USD           0.6108    0.6110    1.8 pips  ✅   ║
║  USD_CAD           1.3587    1.3589    1.8 pips  ✅   ║
║                                                       ║
║  METALS             Bid       Ask      Spread         ║
║  XAU_USD          2,342.10  2,342.80  70 cents  ✅   ║
║  XAG_USD            22.340    22.370   3.0 pips  ✅   ║
║                                                       ║
║  ✅ = Normal spread │ ⚠️ = Elevated │ 🚫 = Too wide  ║
║  Session: London-NY Overlap │ 21/28 pairs shown       ║
║  Use `fx pairs --all` for full list                   ║
╚═══════════════════════════════════════════════════════╝
```

**`fx risk`** — Risk dashboard:
- Current exposure by pair and correlation group
- Daily loss used vs limit
- Position count vs limit

Output:
```
╔══════════════════════════════════════════════════════╗
║              FX Trader Pro — Risk Dashboard          ║
╠══════════════════════════════════════════════════════╣
║  Positions: 2/3 (1 remaining)                        ║
║  Daily Loss: $312.40 used / $3,024.79 limit (10.3%) ║
║  Daily Loss Bar: ██░░░░░░░░░░░░░░░░░░  10%          ║
║                                                      ║
║  Correlation Groups:                                 ║
║  ──────────────────────────────────────────────       ║
║  Group A (EUR/GBP):  1/1 max  ⚠️ EUR_USD open       ║
║  Group B (USD/CHF):  0/1 max  ✅ Available           ║
║  Group C (AUD/NZD):  0/1 max  ✅ Available           ║
║  Group D (Metals):   1/1 max  ⚠️ XAG_USD open       ║
║                                                      ║
║  Exposure by Pair:                                   ║
║  EUR_USD:  $15,000 (14.9% of NAV)  Risk: $330        ║
║  XAG_USD:   $5,000 ( 5.0% of NAV)  Risk: $190        ║
║  Total:    $20,000 (19.8% of NAV)  Risk: $520        ║
║                                                      ║
║  Margin Status: HEALTHY (4.2% used)                  ║
╚══════════════════════════════════════════════════════╝
```

**`fx stop-all`** — EMERGENCY: Close ALL positions immediately

Output:
```
╔══════════════════════════════════════════════════════╗
║  🚨 EMERGENCY STOP — CLOSING ALL POSITIONS 🚨       ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Closing EUR_USD  BUY 15,000 @ market...  ✅ CLOSED  ║
║    Fill: 1.0859  P&L: +$210.00                       ║
║                                                      ║
║  Closing XAG_USD  BUY  5,000 @ market...  ✅ CLOSED  ║
║    Fill: 22.380  P&L: +$200.00                       ║
║                                                      ║
║  ═══════════════════════════════════════════════════  ║
║  All 2 positions closed in 1.8 seconds               ║
║  Total realized P&L: +$410.00                        ║
║  Account NAV: $101,236.43                            ║
║  Open positions: 0                                   ║
║  Trading HALTED. Use `fx status` to resume.          ║
╚══════════════════════════════════════════════════════╝
```

**`fx backtest <pair> <strategy> --from <date> --to <date>`** — Backtest a strategy:
- Download historical data
- Simulate trades
- Report: total return, max drawdown, win rate, profit factor, Sharpe ratio

Output:
```
╔══════════════════════════════════════════════════════╗
║     Backtest Results: EUR_USD  EMA-Cross             ║
║     Period: 2025-10-01 → 2026-02-28 (5 months)      ║
╠══════════════════════════════════════════════════════╣
║  Total Trades:    142                                ║
║  Win Rate:        59.2% (84 W / 58 L)               ║
║  Profit Factor:   1.71                               ║
║  Total Return:    +$8,420.00 (+33.7%)                ║
║  Max Drawdown:    -$2,180.00 (-8.7%)                 ║
║  Sharpe Ratio:    1.42                               ║
║  Avg Win:         +$182.50 │ Avg Loss: -$112.30      ║
║  Best Month:      Dec 2025 (+$3,210.00)              ║
║  Worst Month:     Jan 2026 (-$420.00)                ║
║                                                      ║
║  Equity Curve:                                       ║
║  $25K ─╱──╱╲──╱╱──╱╲─╱╱──╱─ $33.4K                  ║
║                                                      ║
║  ✅ Strategy is viable. Positive expectancy.          ║
║  ⚠️ Jan 2026 drawdown suggests reduce size in       ║
║     low-volatility ranging markets.                  ║
╚══════════════════════════════════════════════════════╝
```

### Data Storage

```
.fx-trader-pro/
├── journal/
│   └── trades.jsonl          # All trade records
├── analysis/
│   └── {pair}-{date}.json    # Saved analyses
├── config.json               # User settings
└── risk/
    └── daily-pnl.jsonl       # Daily P&L tracking
```

## Error Handling

FX Trader Pro handles OANDA API errors and trading-specific failures gracefully. All errors are logged to `.fx-trader-pro/journal/trades.jsonl` with full context.

### OANDA API Errors

| HTTP Code | Error | Handling |
|---|---|---|
| **401 Unauthorized** | Invalid or expired API token | Stop all operations. Prompt user to verify `OANDA_API_KEY`. Do NOT retry — repeated 401s may trigger account lockout. |
| **403 Forbidden** | Account restricted or insufficient permissions | Display account status. Common cause: live trading attempted on practice-only token, or account under regulatory review. Advise user to check OANDA account status. |
| **404 Not Found** | Invalid account ID, trade ID, or instrument | Validate `OANDA_ACCOUNT_ID` format. For trade operations, verify the trade is still open. For instruments, check against supported pairs list. |
| **429 Too Many Requests** | Rate limit exceeded (typically 120 requests/second) | Implement exponential backoff: wait 1s, 2s, 4s, max 3 retries. If scanning all 28 pairs, add 500ms delay between requests. Log rate limit events for monitoring. |
| **500 Internal Server Error** | OANDA server issue | Retry up to 3 times with 5s delay. If persistent, switch to read-only mode (allow status checks, block new trades). Alert user of degraded service. |

### Trading-Specific Errors

| Error | Cause | Handling |
|---|---|---|
| **MARKET_HALTED** | Market closed (weekend, holiday, or instrument-specific halt) | Check market session schedule. Queue the signal for next market open if applicable. Never force an order when market is halted. |
| **INSUFFICIENT_FUNDS** | Not enough margin for the requested position size | Recalculate position size at 50% of original. If still insufficient, report available margin and minimum required. Do NOT reduce stop-loss to fit — that violates risk management. |
| **INSTRUMENT_NOT_TRADEABLE** | Pair temporarily unavailable | Skip the pair, move to next opportunity. Log the event. Retry after 30 minutes. |
| **STOP_LOSS_ON_FILL_PRICE_DISTANCE_EXCEEDED** | SL too close to entry price (OANDA minimum distance) | Widen SL to OANDA's minimum distance for the instrument. Recalculate position size accordingly to maintain risk percentage. |
| **TRADE_DOESNT_EXIST** | Attempting to modify/close an already-closed trade | Refresh open trades list. Inform user the trade was already closed (possibly by SL/TP). |
| **ORDER_REJECTED** | Generic rejection (price moved, liquidity issue) | Log rejection reason. For market orders, retry once with updated price. For limit orders, adjust price to current market. |

### Network and System Errors

- **Connection timeout**: Retry 3 times with 2s intervals. If all fail, enter safe mode (no new trades, monitor existing positions on reconnection).
- **JSON parse error**: Log raw response. Do NOT execute any trade based on unparseable data.
- **Config file corrupted**: Fall back to default settings. Alert user to review `.fx-trader-pro/config.json`.

### Kill Switch Behavior

If any critical error occurs during trade execution (e.g., position size calculated as negative, SL/TP inverted, or API returns inconsistent state), the system:
1. Halts ALL pending operations
2. Logs the full error context
3. Displays `fx stop-all` prompt to user
4. Does NOT attempt to "fix" the trade automatically

## FX Trader Pro vs Other Trading Tools

| Feature | FX Trader Pro | Manual Trading (TradingView + Broker) | Crypto Bots (3Commas, Pionex) | MetaTrader 4/5 (Expert Advisors) |
|---|---|---|---|---|
| **Asset Class** | Traditional FX (28 pairs + metals) | Any (depends on broker) | Crypto only | FX + CFDs (broker-dependent) |
| **AI-Powered Analysis** | Multi-timeframe technical analysis with confluence scoring | Manual chart reading | Basic indicator bots | Custom indicators (no AI) |
| **Risk Management** | Built-in: position sizing, correlation groups, daily loss limits, kill switch | Manual discipline required | Basic SL/TP | Custom-coded or EA-dependent |
| **Correlation Protection** | Automatic — blocks correlated pair overlap | Manual tracking required | Not applicable (crypto) | Not built-in (custom code needed) |
| **Session Awareness** | Automatic market session detection and pair-session matching | Manual timezone tracking | 24/7 crypto markets | Manual or custom-coded |
| **Trading Journal** | Auto-logged with entry/exit reasons, confidence, session data | Manual journaling | Basic trade history | Basic trade history |
| **Backtesting** | Built-in via `fx backtest` command | TradingView replay (manual) | Limited strategy testing | Strategy Tester (powerful but MQL-only) |
| **Setup Complexity** | 2 env vars (`OANDA_API_KEY`, `OANDA_ACCOUNT_ID`) | Broker account + platform install | Exchange API keys + bot config | MT4/5 install + EA purchase/coding |
| **Cost** | Free (MIT license) + OANDA spreads | Platform fees + commissions | $15-50/mo subscription + exchange fees | EA purchase ($50-500+) + broker spreads |
| **Broker Integration** | OANDA v20 REST API | Varies by platform | Exchange-specific | MetaQuotes protocol |
| **Natural Language Interface** | Yes — conversational commands via OpenClaw | No | No | No |
| **Spread Monitoring** | Automatic — blocks trades when spread > 2x typical | Manual observation | Not applicable | Custom indicator needed |

## FAQ

**Q: Is FX Trader Pro safe to use with real money?**
A: FX Trader Pro defaults to practice mode. Live trading requires explicitly setting `OANDA_ENVIRONMENT=live` and every live trade requires user confirmation. Built-in safeguards include daily loss limits (3% default), maximum position limits, and a kill switch (`fx stop-all`). That said, forex trading carries inherent risk — past performance does not guarantee future results.

**Q: How much does it cost to use?**
A: The skill itself is free (MIT license). You only pay OANDA's spreads on trades. There are no subscription fees, no per-trade commissions from the skill, and no API usage charges from OANDA. Your only costs are the model API costs for running the OpenClaw agent.

**Q: What are the OANDA API rate limits?**
A: OANDA allows approximately 120 requests per second for the REST API. FX Trader Pro manages this automatically with built-in rate limiting. A full 28-pair scan uses about 30-40 requests. Normal trading operations (status, analyze, trade) use 3-10 requests each.

**Q: Which currency pairs are supported?**
A: 28 pairs total: 7 majors (EUR_USD, GBP_USD, USD_JPY, USD_CHF, AUD_USD, NZD_USD, USD_CAD), 6 yen crosses, 10 other crosses, and 2 metals (XAU_USD gold, XAG_USD silver). The full list is available via `fx pairs`.

**Q: Can I backtest strategies before trading live?**
A: Yes. Use `fx backtest <pair> <strategy> --from <date> --to <date>` to simulate trades on historical data. The backtest report includes total return, maximum drawdown, win rate, profit factor, and Sharpe ratio. Always backtest before deploying any strategy to live.

**Q: What happens if the internet connection drops during an open trade?**
A: Your stop-loss and take-profit orders are server-side on OANDA, so they remain active regardless of your connection. If FX Trader Pro loses connectivity, it enters safe mode — no new trades are placed, and it resumes monitoring on reconnection. Your existing positions are protected by their SL/TP orders.

**Q: Can I use FX Trader Pro with brokers other than OANDA?**
A: Currently, only OANDA v20 API is supported. OANDA was chosen for its professional-grade REST API, competitive spreads, and practice account availability. Support for additional brokers may be added in future versions.

**Q: How does the correlation protection work?**
A: Pairs are grouped by correlation (e.g., EUR_USD and GBP_USD are in the same group). The system allows maximum 1 position per correlation group. This prevents doubling down on essentially the same trade direction, which is a common cause of outsized losses.

**Q: What timeframes should I use for analysis?**
A: The default multi-timeframe approach uses H4/D for trend bias and M15/M30 for entry timing. For the `fx scan` command, H1 is used for quick screening. You can specify any timeframe with `fx analyze <pair> <timeframe>`. Higher timeframes produce more reliable but fewer signals.

**Q: Does FX Trader Pro work during news events?**
A: It does not have a built-in economic calendar filter. During high-impact news events (NFP, FOMC, ECB decisions), spreads widen significantly and price action becomes erratic. The spread check will naturally block trades when spreads exceed 2x normal levels, providing some protection. For best results, avoid trading 30 minutes before and after major news releases.
