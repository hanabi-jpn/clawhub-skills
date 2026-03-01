# Trade Signal Report

**Signal ID:** `{{signal_id}}`
**Generated:** {{generated_time}}
**Expires:** {{expiry_time}}
**Status:** {{status}}

---

## Signal Overview

| Field | Value |
|-------|-------|
| Pair | **{{pair}}** |
| Direction | **{{direction}}** |
| Timeframe | {{timeframe}} |
| Signal Strength | {{strength}}/10 |
| Confidence | {{confidence}}% |
| Strategy | {{strategy_name}} |

---

## Entry Plan

| Parameter | Value |
|-----------|-------|
| Entry Type | {{entry_type}} |
| Entry Price | **{{entry_price}}** |
| Entry Zone | {{entry_zone_low}} - {{entry_zone_high}} |
| Current Price | {{current_price}} |
| Distance to Entry | {{distance_pips}} pips |

---

## Risk Management

| Parameter | Value |
|-----------|-------|
| Stop Loss | **{{stop_loss}}** |
| Stop Distance | {{stop_distance_pips}} pips |
| Take Profit 1 | **{{tp1}}** ({{tp1_pips}} pips, {{tp1_rr}}R) |
| Take Profit 2 | {{tp2}} ({{tp2_pips}} pips, {{tp2_rr}}R) |
| Take Profit 3 | {{tp3}} ({{tp3_pips}} pips, {{tp3_rr}}R) |
| Risk:Reward | 1:{{risk_reward}} |
| Risk Amount | ${{risk_amount}} ({{risk_pct}}% of account) |
| Position Size | {{position_size}} units |

### Partial Exit Plan
| Level | % of Position | Target | R-Multiple |
|-------|--------------|--------|------------|
| TP1 | {{tp1_partial_pct}}% | {{tp1}} | {{tp1_rr}}R |
| TP2 | {{tp2_partial_pct}}% | {{tp2}} | {{tp2_rr}}R |
| TP3 | {{tp3_partial_pct}}% | {{tp3}} | {{tp3_rr}}R |

---

## Technical Analysis

### Multi-Timeframe Confluence

| Timeframe | Trend | Key Level | Signal |
|-----------|-------|-----------|--------|
| Monthly | {{monthly_trend}} | {{monthly_level}} | {{monthly_signal}} |
| Weekly | {{weekly_trend}} | {{weekly_level}} | {{weekly_signal}} |
| Daily | {{daily_trend}} | {{daily_level}} | {{daily_signal}} |
| H4 | {{h4_trend}} | {{h4_level}} | {{h4_signal}} |
| H1 | {{h1_trend}} | {{h1_level}} | {{h1_signal}} |
| M15 | {{m15_trend}} | {{m15_level}} | {{m15_signal}} |

### Indicators

| Indicator | Value | Signal |
|-----------|-------|--------|
| RSI (14) | {{rsi_14}} | {{rsi_signal}} |
| MACD | {{macd_value}} | {{macd_signal}} |
| EMA 20 | {{ema_20}} | {{ema_20_signal}} |
| EMA 50 | {{ema_50}} | {{ema_50_signal}} |
| EMA 200 | {{ema_200}} | {{ema_200_signal}} |
| Bollinger Bands | {{bb_position}} | {{bb_signal}} |
| ATR (14) | {{atr_14}} pips | {{atr_signal}} |
| Stochastic | {{stoch_value}} | {{stoch_signal}} |
| ADX | {{adx_value}} | {{adx_signal}} |
| Volume | {{volume_status}} | {{volume_signal}} |

### Key Levels

| Level Type | Price | Distance | Notes |
|------------|-------|----------|-------|
{{#each key_levels}}
| {{type}} | {{price}} | {{distance_pips}} pips | {{notes}} |
{{/each}}

### Chart Patterns
{{#each patterns}}
- **{{name}}** on {{timeframe}}: {{description}} (Reliability: {{reliability}}%)
{{/each}}

---

## Fundamental Context

### Economic Calendar (Next 24h)
| Time (UTC) | Currency | Event | Impact | Forecast | Previous |
|------------|----------|-------|--------|----------|----------|
{{#each calendar_events}}
| {{time}} | {{currency}} | {{event}} | {{impact}} | {{forecast}} | {{previous}} |
{{/each}}

### Macro Environment
- **{{base_currency}} Outlook:** {{base_outlook}}
- **{{quote_currency}} Outlook:** {{quote_outlook}}
- **Interest Rate Differential:** {{rate_diff}} bps ({{rate_diff_direction}})
- **Risk Sentiment:** {{risk_sentiment}}
- **Relevant News:** {{news_summary}}

---

## Correlation Check

| Correlated Pair | Correlation | Direction | Conflict |
|-----------------|-------------|-----------|----------|
{{#each correlations}}
| {{pair}} | {{correlation}} | {{direction}} | {{conflict}} |
{{/each}}

**Open Position Conflicts:** {{open_conflicts}}

---

## Session Analysis

| Factor | Assessment |
|--------|------------|
| Current Session | {{current_session}} |
| Optimal Session | {{optimal_session}} |
| Session Alignment | {{session_alignment}} |
| Liquidity Level | {{liquidity_level}} |
| Spread Currently | {{current_spread}} pips |
| Volatility (ATR) | {{volatility_assessment}} |

---

## Checklist

- [{{trend_alignment_check}}] Higher timeframe trend alignment
- [{{key_level_check}}] Entry at key support/resistance level
- [{{indicator_confluence_check}}] Minimum 3 indicator confluence
- [{{rr_check}}] Risk:Reward >= 1:2
- [{{calendar_check}}] No high-impact news within 2 hours
- [{{correlation_check}}] No correlation conflicts with open positions
- [{{session_check}}] Within optimal trading session
- [{{spread_check}}] Spread within acceptable range
- [{{risk_check}}] Risk within daily/weekly limits
- [{{emotional_check}}] No emotional trading indicators

**Checklist Score:** {{checklist_score}}/10

---

## Signal Reasoning

### Why This Trade
{{reasoning_why}}

### Invalidation Conditions
{{#each invalidation_conditions}}
- {{description}} (Price: {{price}})
{{/each}}

### What Could Go Wrong
{{#each risks}}
- **{{risk}}:** {{mitigation}}
{{/each}}

---

## Signal Metadata

```json
{
  "signal_id": "{{signal_id}}",
  "generated": "{{generated_time}}",
  "model_version": "{{model_version}}",
  "strategy": "{{strategy_name}}",
  "backtest_win_rate": "{{backtest_win_rate}}%",
  "backtest_profit_factor": {{backtest_pf}},
  "similar_setups_30d": {{similar_count}},
  "similar_setups_win_rate": "{{similar_win_rate}}%"
}
```

---

*Generated by FX Trader Pro v{{version}}*
*This signal is informational only. Always perform your own analysis before trading.*
*Past signal performance does not guarantee future results.*
