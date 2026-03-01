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

**`fx analyze <pair> [timeframe]`** — Full technical analysis

**`fx scan`** — Scan ALL 28 pairs for opportunities:
- Quick analysis on H1 for each pair
- Sort by signal strength
- Show top 5 opportunities

**`fx signal <pair>`** — Generate detailed trade signal

**`fx trade <pair> <buy|sell> [units]`** — Execute trade:
- Calculate position size if units not specified
- Set SL and TP automatically
- Confirm before execution (always)
- Log to journal

**`fx close <trade-id|all>`** — Close position(s)

**`fx modify <trade-id> --sl <price> --tp <price>`** — Modify SL/TP

**`fx journal`** — Show trading journal summary:
- Total trades, win rate, profit factor
- Best/worst trades
- Average R:R achieved

**`fx journal --month <YYYY-MM>`** — Monthly report

**`fx pairs`** — List all pairs with current prices and spreads

**`fx risk`** — Risk dashboard:
- Current exposure by pair and correlation group
- Daily loss used vs limit
- Position count vs limit

**`fx stop-all`** — EMERGENCY: Close ALL positions immediately

**`fx backtest <pair> <strategy> --from <date> --to <date>`** — Backtest a strategy:
- Download historical data
- Simulate trades
- Report: total return, max drawdown, win rate, profit factor, Sharpe ratio

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
