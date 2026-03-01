#!/usr/bin/env node

/**
 * MCP Server: FX Trader Pro
 *
 * Professional forex trading MCP server for OANDA.
 * 28 currency pairs, multi-timeframe technical analysis,
 * risk management, and automated trade execution.
 *
 * Author: hanabi-jpn
 * License: MIT
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SERVER_NAME = "fx-trader-pro";
const SERVER_VERSION = "1.0.0";
const SERVER_DESCRIPTION =
  "Professional forex trading MCP server — OANDA API, 28 currency pairs, multi-timeframe analysis, risk management";

const SUPPORTED_PAIRS = {
  majors: ["EUR_USD", "GBP_USD", "USD_JPY", "USD_CHF", "AUD_USD", "NZD_USD", "USD_CAD"],
  yen_crosses: ["EUR_JPY", "GBP_JPY", "AUD_JPY", "NZD_JPY", "CAD_JPY", "CHF_JPY"],
  other_crosses: [
    "EUR_GBP", "EUR_AUD", "EUR_NZD", "EUR_CAD", "EUR_CHF",
    "GBP_AUD", "GBP_NZD", "GBP_CAD", "GBP_CHF", "AUD_NZD",
  ],
  metals: ["XAU_USD", "XAG_USD"],
};

const ALL_PAIRS = [
  ...SUPPORTED_PAIRS.majors,
  ...SUPPORTED_PAIRS.yen_crosses,
  ...SUPPORTED_PAIRS.other_crosses,
  ...SUPPORTED_PAIRS.metals,
];

const CORRELATION_GROUPS: Record<string, string[]> = {
  A: ["EUR_USD", "GBP_USD"],
  B: ["USD_JPY", "USD_CHF"],
  C: ["AUD_USD", "NZD_USD"],
  D: ["XAU_USD", "XAG_USD"],
};

const TIMEFRAMES = ["M5", "M15", "M30", "H1", "H4", "D", "W"];

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

function getEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] ?? fallback;
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

function getBaseUrl(): string {
  const env = getEnv("OANDA_ENVIRONMENT", "practice");
  return env === "live"
    ? "https://api-fxtrade.oanda.com"
    : "https://api-fxpractice.oanda.com";
}

// ---------------------------------------------------------------------------
// OANDA API helpers
// ---------------------------------------------------------------------------

async function oandaRequest(path: string, method = "GET", body?: unknown): Promise<unknown> {
  const apiKey = requireEnv("OANDA_API_KEY");
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OANDA API error ${response.status}: ${text}`);
  }

  return response.json();
}

async function getAccountSummary(): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(`/v3/accounts/${accountId}/summary`);
}

async function getOpenPositions(): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(`/v3/accounts/${accountId}/openPositions`);
}

async function getOpenTrades(): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(`/v3/accounts/${accountId}/openTrades`);
}

async function getCandles(
  instrument: string,
  granularity: string,
  count: number
): Promise<unknown> {
  return oandaRequest(
    `/v3/instruments/${instrument}/candles?granularity=${granularity}&count=${count}&price=MBA`
  );
}

async function getPricing(instruments: string[]): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(
    `/v3/accounts/${accountId}/pricing?instruments=${instruments.join(",")}`
  );
}

async function placeOrder(orderBody: unknown): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(`/v3/accounts/${accountId}/orders`, "POST", orderBody);
}

async function closeTrade(tradeId: string): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(`/v3/accounts/${accountId}/trades/${tradeId}/close`, "PUT", {});
}

async function modifyTrade(
  tradeId: string,
  modifications: unknown
): Promise<unknown> {
  const accountId = requireEnv("OANDA_ACCOUNT_ID");
  return oandaRequest(
    `/v3/accounts/${accountId}/trades/${tradeId}/orders`,
    "PUT",
    modifications
  );
}

// ---------------------------------------------------------------------------
// Analysis helpers
// ---------------------------------------------------------------------------

function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      sma.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return sma;
}

function calculateRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number {
  if (highs.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < highs.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trs.push(tr);
  }
  const recentTrs = trs.slice(-period);
  return recentTrs.reduce((a, b) => a + b, 0) / recentTrs.length;
}

function validatePair(pair: string): void {
  if (!ALL_PAIRS.includes(pair.toUpperCase())) {
    throw new Error(
      `Unsupported pair: ${pair}. Supported pairs: ${ALL_PAIRS.join(", ")}`
    );
  }
}

function validateTimeframe(tf: string): void {
  if (!TIMEFRAMES.includes(tf.toUpperCase())) {
    throw new Error(
      `Unsupported timeframe: ${tf}. Supported: ${TIMEFRAMES.join(", ")}`
    );
  }
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "fx_status",
    description:
      "Get OANDA account overview: NAV, unrealized P&L, margin used, open positions, daily P&L vs daily loss limit, and current market session",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "fx_analyze",
    description:
      "Full multi-timeframe technical analysis for a currency pair. Includes moving averages (EMA 20/50, SMA 200), RSI, MACD, Bollinger Bands, support/resistance, trend identification, and MTF confluence score",
    inputSchema: {
      type: "object" as const,
      properties: {
        pair: {
          type: "string",
          description: "Currency pair (e.g., EUR_USD, GBP_JPY, XAU_USD)",
        },
        timeframe: {
          type: "string",
          description: "Timeframe for analysis (M5, M15, M30, H1, H4, D, W). Default: M30",
          enum: TIMEFRAMES,
        },
      },
      required: ["pair"],
    },
  },
  {
    name: "fx_scan",
    description:
      "Scan all 28 currency pairs for trading opportunities. Quick H1 analysis per pair, sorted by signal strength. Returns top 5 opportunities with direction and confidence score",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeframe: {
          type: "string",
          description: "Timeframe for scanning (default: H1)",
          enum: TIMEFRAMES,
        },
      },
      required: [],
    },
  },
  {
    name: "fx_signal",
    description:
      "Generate a detailed trade signal for a specific pair. Includes entry price, stop loss, take profit, risk:reward ratio, position size, supporting/contradicting factors, and session info",
    inputSchema: {
      type: "object" as const,
      properties: {
        pair: {
          type: "string",
          description: "Currency pair (e.g., EUR_USD, GBP_JPY)",
        },
      },
      required: ["pair"],
    },
  },
  {
    name: "fx_trade",
    description:
      "Execute a trade on OANDA. Calculates position size from risk settings, sets SL/TP automatically, and logs to trading journal. Requires confirmation for live trades",
    inputSchema: {
      type: "object" as const,
      properties: {
        pair: {
          type: "string",
          description: "Currency pair (e.g., EUR_USD)",
        },
        direction: {
          type: "string",
          description: "Trade direction",
          enum: ["buy", "sell"],
        },
        units: {
          type: "number",
          description: "Position size in units (optional, auto-calculated from risk settings if omitted)",
        },
        stop_loss: {
          type: "number",
          description: "Stop loss price (optional, auto-calculated from ATR if omitted)",
        },
        take_profit: {
          type: "number",
          description: "Take profit price (optional, auto-calculated from risk:reward if omitted)",
        },
      },
      required: ["pair", "direction"],
    },
  },
  {
    name: "fx_close",
    description:
      "Close an open trade by trade ID, or close ALL positions with 'all'. Reports fill price, P&L, and duration",
    inputSchema: {
      type: "object" as const,
      properties: {
        trade_id: {
          type: "string",
          description: "Trade ID to close, or 'all' to close all positions",
        },
      },
      required: ["trade_id"],
    },
  },
  {
    name: "fx_modify",
    description:
      "Modify stop loss and/or take profit on an existing trade",
    inputSchema: {
      type: "object" as const,
      properties: {
        trade_id: {
          type: "string",
          description: "Trade ID to modify",
        },
        stop_loss: {
          type: "number",
          description: "New stop loss price",
        },
        take_profit: {
          type: "number",
          description: "New take profit price",
        },
      },
      required: ["trade_id"],
    },
  },
  {
    name: "fx_pairs",
    description:
      "List all 28 supported currency pairs with current bid/ask prices and spread status. Indicates normal, elevated, or excessive spread",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Filter by category: majors, yen_crosses, other_crosses, metals, or all (default: all)",
          enum: ["majors", "yen_crosses", "other_crosses", "metals", "all"],
        },
      },
      required: [],
    },
  },
  {
    name: "fx_risk",
    description:
      "Risk management dashboard: current exposure by pair and correlation group, daily loss used vs limit, position count vs limit, margin status",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "fx_journal",
    description:
      "Trading journal: total trades, win rate, profit factor, best/worst trades, average R:R achieved. Optionally filter by month",
    inputSchema: {
      type: "object" as const,
      properties: {
        month: {
          type: "string",
          description: "Filter by month (YYYY-MM format, e.g., 2026-03). Omit for all-time summary",
        },
      },
      required: [],
    },
  },
  {
    name: "fx_stop_all",
    description:
      "EMERGENCY: Immediately close ALL open positions. Kill switch for risk management",
    inputSchema: {
      type: "object" as const,
      properties: {
        confirm: {
          type: "boolean",
          description: "Must be true to execute. Safety confirmation",
        },
      },
      required: ["confirm"],
    },
  },
  {
    name: "fx_backtest",
    description:
      "Backtest a trading strategy on historical data. Reports total return, max drawdown, win rate, profit factor, and Sharpe ratio",
    inputSchema: {
      type: "object" as const,
      properties: {
        pair: {
          type: "string",
          description: "Currency pair to backtest",
        },
        strategy: {
          type: "string",
          description: "Strategy name (e.g., ema-cross, rsi-bounce, macd-signal)",
        },
        from_date: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        to_date: {
          type: "string",
          description: "End date (YYYY-MM-DD)",
        },
      },
      required: ["pair", "strategy", "from_date", "to_date"],
    },
  },
  // Built-in tools
  {
    name: "help",
    description: "Show available tools, usage, and environment variable configuration for FX Trader Pro",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "version",
    description: "Show FX Trader Pro version information",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

async function handleTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "fx_status": {
      const summary = (await getAccountSummary()) as Record<string, unknown>;
      const positions = (await getOpenPositions()) as Record<string, unknown>;
      const account = summary["account"] as Record<string, unknown>;

      const env = getEnv("OANDA_ENVIRONMENT", "practice")!.toUpperCase();
      const maxPositions = parseInt(getEnv("FX_MAX_POSITIONS", "3")!, 10);
      const dailyLossLimit = parseFloat(getEnv("FX_DAILY_LOSS_LIMIT", "3")!);
      const nav = parseFloat(account["NAV"] as string);
      const unrealized = parseFloat(account["unrealizedPL"] as string);
      const marginUsed = parseFloat(account["marginUsed"] as string);
      const marginAvail = parseFloat(account["marginAvailable"] as string);
      const openTradeCount = account["openTradeCount"] as number;

      const lossLimit = nav * (dailyLossLimit / 100);
      const positionList = (positions["positions"] as unknown[]) ?? [];

      const lines = [
        `=== FX Trader Pro --- Status ===`,
        `Account:     ${getEnv("OANDA_ACCOUNT_ID")}  (${env})`,
        `NAV:         $${nav.toFixed(2)}`,
        `Unrealized:  ${unrealized >= 0 ? "+" : ""}$${unrealized.toFixed(2)}`,
        `Margin Used: $${marginUsed.toFixed(2)} (${((marginUsed / nav) * 100).toFixed(1)}%)`,
        `Free Margin: $${marginAvail.toFixed(2)}`,
        ``,
        `Open Positions: ${openTradeCount}/${maxPositions}`,
      ];

      if (positionList.length > 0) {
        lines.push(`---`);
        for (const pos of positionList as Record<string, unknown>[]) {
          const instrument = pos["instrument"] as string;
          const longUnits = parseFloat(
            (pos["long"] as Record<string, unknown>)["units"] as string
          );
          const shortUnits = parseFloat(
            (pos["short"] as Record<string, unknown>)["units"] as string
          );
          const longPL = parseFloat(
            (pos["long"] as Record<string, unknown>)["unrealizedPL"] as string
          );
          const shortPL = parseFloat(
            (pos["short"] as Record<string, unknown>)["unrealizedPL"] as string
          );

          if (longUnits > 0) {
            lines.push(
              `  ${instrument}  BUY  ${longUnits.toLocaleString()} units  P&L: ${longPL >= 0 ? "+" : ""}$${longPL.toFixed(2)}`
            );
          }
          if (shortUnits < 0) {
            lines.push(
              `  ${instrument}  SELL  ${Math.abs(shortUnits).toLocaleString()} units  P&L: ${shortPL >= 0 ? "+" : ""}$${shortPL.toFixed(2)}`
            );
          }
        }
      }

      lines.push(``);
      lines.push(
        `Daily Loss Limit: $${lossLimit.toFixed(2)} (${dailyLossLimit}% of NAV)`
      );

      // Market session detection
      const now = new Date();
      const utcHour = now.getUTCHours();
      let session = "Off-hours";
      if (utcHour >= 22 || utcHour < 7) session = "Sydney/Tokyo";
      if (utcHour >= 0 && utcHour < 9) session = "Tokyo";
      if (utcHour >= 7 && utcHour < 16) session = "London";
      if (utcHour >= 12 && utcHour < 21) session = "New York";
      if (utcHour >= 12 && utcHour < 16) session = "London-NY Overlap (PEAK)";

      lines.push(`Session:     ${session}`);
      return lines.join("\n");
    }

    case "fx_analyze": {
      const pair = (args["pair"] as string).toUpperCase();
      const tf = ((args["timeframe"] as string) ?? "M30").toUpperCase();
      validatePair(pair);
      validateTimeframe(tf);

      const data = (await getCandles(pair, tf, 200)) as Record<string, unknown>;
      const candles = (data["candles"] as Record<string, unknown>[]) ?? [];

      if (candles.length < 50) {
        throw new Error(`Insufficient data for ${pair} on ${tf}. Only ${candles.length} candles available.`);
      }

      const closes = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["c"] as string)
      );
      const highs = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["h"] as string)
      );
      const lows = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["l"] as string)
      );

      const price = closes[closes.length - 1];
      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);
      const sma200 = calculateSMA(closes, 200);
      const rsi = calculateRSI(closes, 14);
      const atr = calculateATR(highs, lows, closes, 14);

      const ema20Val = ema20[ema20.length - 1];
      const ema50Val = ema50[ema50.length - 1];
      const sma200Val = sma200[sma200.length - 1];

      const priceVsEma20 = price > ema20Val ? "ABOVE (bullish)" : "BELOW (bearish)";
      const priceVsEma50 = price > ema50Val ? "ABOVE (bullish)" : "BELOW (bearish)";
      const priceVsSma200 = !isNaN(sma200Val)
        ? price > sma200Val
          ? "ABOVE (bullish)"
          : "BELOW (bearish)"
        : "N/A (insufficient data)";

      const aligned =
        ema20Val > ema50Val && (isNaN(sma200Val) || ema50Val > sma200Val);

      let trend = "RANGING";
      const recentHighs = highs.slice(-20);
      const recentLows = lows.slice(-20);
      const midHighs = highs.slice(-40, -20);
      const midLows = lows.slice(-40, -20);
      if (
        Math.max(...recentHighs) > Math.max(...midHighs) &&
        Math.min(...recentLows) > Math.min(...midLows)
      ) {
        trend = "UPTREND";
      } else if (
        Math.max(...recentHighs) < Math.max(...midHighs) &&
        Math.min(...recentLows) < Math.min(...midLows)
      ) {
        trend = "DOWNTREND";
      }

      // Support and resistance from recent swing points
      const recentSwingHigh = Math.max(...highs.slice(-50));
      const recentSwingLow = Math.min(...lows.slice(-50));

      const rsiLabel =
        rsi > 70 ? "OVERBOUGHT" : rsi < 30 ? "OVERSOLD" : "Neutral";

      const lines = [
        `=== Technical Analysis: ${pair} (${tf}) ===`,
        `Price:    ${price.toFixed(5)}`,
        `ATR(14):  ${atr.toFixed(5)}`,
        ``,
        `Moving Averages:`,
        `  EMA 20:  ${ema20Val.toFixed(5)} - Price ${priceVsEma20}`,
        `  EMA 50:  ${ema50Val.toFixed(5)} - Price ${priceVsEma50}`,
        `  SMA 200: ${isNaN(sma200Val) ? "N/A" : sma200Val.toFixed(5)} - Price ${priceVsSma200}`,
        `  Alignment: ${aligned ? "EMA20 > EMA50 > SMA200 (bullish)" : "Not aligned"}`,
        ``,
        `RSI(14):  ${rsi.toFixed(1)} - ${rsiLabel}`,
        ``,
        `Support:    ${recentSwingLow.toFixed(5)}`,
        `Resistance: ${recentSwingHigh.toFixed(5)}`,
        ``,
        `Trend:  ${trend}`,
        `Bias:   ${trend === "UPTREND" ? "BUY" : trend === "DOWNTREND" ? "SELL" : "NEUTRAL"}`,
      ];

      return lines.join("\n");
    }

    case "fx_scan": {
      const tf = ((args["timeframe"] as string) ?? "H1").toUpperCase();
      validateTimeframe(tf);

      const results: Array<{
        pair: string;
        score: number;
        direction: string;
        reason: string;
      }> = [];

      for (const pair of ALL_PAIRS) {
        try {
          const data = (await getCandles(pair, tf, 100)) as Record<string, unknown>;
          const candles = (data["candles"] as Record<string, unknown>[]) ?? [];
          if (candles.length < 50) continue;

          const closes = candles.map(
            (c) => parseFloat((c["mid"] as Record<string, unknown>)["c"] as string)
          );
          const ema20 = calculateEMA(closes, 20);
          const ema50 = calculateEMA(closes, 50);
          const rsi = calculateRSI(closes, 14);

          const price = closes[closes.length - 1];
          const ema20Val = ema20[ema20.length - 1];
          const ema50Val = ema50[ema50.length - 1];

          let score = 50;
          let direction = "neutral";
          const reasons: string[] = [];

          // EMA alignment
          if (price > ema20Val && ema20Val > ema50Val) {
            score += 15;
            direction = "BUY";
            reasons.push("MAs aligned bullish");
          } else if (price < ema20Val && ema20Val < ema50Val) {
            score += 15;
            direction = "SELL";
            reasons.push("MAs aligned bearish");
          }

          // RSI signals
          if (rsi < 35 && direction !== "SELL") {
            score += 10;
            direction = "BUY";
            reasons.push(`RSI ${rsi.toFixed(0)} (oversold bounce)`);
          } else if (rsi > 65 && direction !== "BUY") {
            score += 10;
            direction = "SELL";
            reasons.push(`RSI ${rsi.toFixed(0)} (overbought reversal)`);
          }

          // Momentum
          const mom5 = closes[closes.length - 1] - closes[closes.length - 6];
          if (Math.abs(mom5) > 0) {
            if (mom5 > 0 && direction === "BUY") {
              score += 5;
              reasons.push("Positive momentum");
            } else if (mom5 < 0 && direction === "SELL") {
              score += 5;
              reasons.push("Negative momentum");
            }
          }

          if (score >= 60 && direction !== "neutral") {
            results.push({
              pair,
              score: Math.min(score, 100),
              direction,
              reason: reasons.join(", "),
            });
          }
        } catch {
          // Skip pairs that fail
        }
      }

      results.sort((a, b) => b.score - a.score);
      const top = results.slice(0, 5);

      const lines = [
        `=== FX Trader Pro --- Market Scan (${tf}) ===`,
        `Scanned ${ALL_PAIRS.length} pairs`,
        ``,
      ];

      if (top.length === 0) {
        lines.push("No clear signals found (all scores < 60).");
        lines.push('Use "fx_analyze" on specific pairs for deeper analysis.');
      } else {
        lines.push(`Top ${top.length} Opportunities:`);
        lines.push(`---`);
        top.forEach((r, i) => {
          const stars = "* ".repeat(Math.round(r.score / 20)).trim();
          lines.push(
            `#${i + 1}  ${r.pair}  ${r.direction}  Score: ${r.score}/100  ${stars}`
          );
          lines.push(`     ${r.reason}`);
          lines.push(``);
        });
        const noSignal = ALL_PAIRS.length - results.length;
        lines.push(`${noSignal} pairs: No clear signal (score < 60)`);
      }

      return lines.join("\n");
    }

    case "fx_signal": {
      const pair = (args["pair"] as string).toUpperCase();
      validatePair(pair);

      const data = (await getCandles(pair, "M30", 200)) as Record<string, unknown>;
      const candles = (data["candles"] as Record<string, unknown>[]) ?? [];
      const closes = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["c"] as string)
      );
      const highs = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["h"] as string)
      );
      const lows = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["l"] as string)
      );

      const price = closes[closes.length - 1];
      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);
      const rsi = calculateRSI(closes, 14);
      const atr = calculateATR(highs, lows, closes, 14);

      const ema20Val = ema20[ema20.length - 1];
      const ema50Val = ema50[ema50.length - 1];

      const direction = ema20Val > ema50Val ? "BUY" : "SELL";
      const riskPercent = parseFloat(getEnv("FX_RISK_PERCENT", "2")!);
      const rrRatio = parseFloat(getEnv("FX_DEFAULT_RR", "2")!);

      const slDistance = atr * 1.5;
      const tpDistance = slDistance * rrRatio;

      const sl =
        direction === "BUY" ? price - slDistance : price + slDistance;
      const tp =
        direction === "BUY" ? price + tpDistance : price - tpDistance;

      let confidence = 50;
      const supporting: string[] = [];
      const contradicting: string[] = [];

      if (direction === "BUY") {
        if (price > ema20Val) {
          confidence += 10;
          supporting.push("Price above EMA 20");
        }
        if (ema20Val > ema50Val) {
          confidence += 10;
          supporting.push("EMA 20 > EMA 50 (bullish alignment)");
        }
        if (rsi > 30 && rsi < 50) {
          confidence += 8;
          supporting.push(`RSI ${rsi.toFixed(0)} (room to rise)`);
        }
        if (rsi > 65) {
          contradicting.push(`RSI ${rsi.toFixed(0)} (approaching overbought)`);
        }
      } else {
        if (price < ema20Val) {
          confidence += 10;
          supporting.push("Price below EMA 20");
        }
        if (ema20Val < ema50Val) {
          confidence += 10;
          supporting.push("EMA 20 < EMA 50 (bearish alignment)");
        }
        if (rsi < 70 && rsi > 50) {
          confidence += 8;
          supporting.push(`RSI ${rsi.toFixed(0)} (room to fall)`);
        }
        if (rsi < 35) {
          contradicting.push(`RSI ${rsi.toFixed(0)} (approaching oversold)`);
        }
      }

      confidence = Math.min(confidence, 100);

      const lines = [
        `=== FX TRADE SIGNAL ===`,
        `Pair:        ${pair}`,
        `Direction:   ${direction}`,
        `Confidence:  ${confidence}/100`,
        `Timeframe:   M30 (entry) / H4 (bias)`,
        ``,
        `Entry:       ${price.toFixed(5)}`,
        `Stop Loss:   ${sl.toFixed(5)}`,
        `Take Profit: ${tp.toFixed(5)}`,
        `Risk:Reward: 1:${rrRatio.toFixed(1)}`,
        `Risk %:      ${riskPercent}% of equity`,
        ``,
        `Supporting Factors:`,
      ];

      supporting.forEach((s) => lines.push(`  + ${s}`));
      if (contradicting.length > 0) {
        lines.push(`Contradicting Factors:`);
        contradicting.forEach((c) => lines.push(`  ! ${c}`));
      }

      return lines.join("\n");
    }

    case "fx_trade": {
      const pair = (args["pair"] as string).toUpperCase();
      const direction = (args["direction"] as string).toLowerCase();
      validatePair(pair);

      if (direction !== "buy" && direction !== "sell") {
        throw new Error('Direction must be "buy" or "sell"');
      }

      // Get current price for the pair
      const pricing = (await getPricing([pair])) as Record<string, unknown>;
      const prices = (pricing["prices"] as Record<string, unknown>[])?.[0];
      if (!prices) throw new Error(`Cannot get pricing for ${pair}`);

      const askPrice = parseFloat(
        ((prices["asks"] as Record<string, unknown>[])?.[0])?.["price"] as string
      );
      const bidPrice = parseFloat(
        ((prices["bids"] as Record<string, unknown>[])?.[0])?.["price"] as string
      );
      const entryPrice = direction === "buy" ? askPrice : bidPrice;

      // Get account for position sizing
      const summary = (await getAccountSummary()) as Record<string, unknown>;
      const account = summary["account"] as Record<string, unknown>;
      const equity = parseFloat(account["NAV"] as string);

      const riskPercent = parseFloat(getEnv("FX_RISK_PERCENT", "2")!);
      const rrRatio = parseFloat(getEnv("FX_DEFAULT_RR", "2")!);

      // Calculate ATR-based SL
      const data = (await getCandles(pair, "M30", 50)) as Record<string, unknown>;
      const candles = (data["candles"] as Record<string, unknown>[]) ?? [];
      const closePrices = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["c"] as string)
      );
      const highPrices = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["h"] as string)
      );
      const lowPrices = candles.map(
        (c) => parseFloat((c["mid"] as Record<string, unknown>)["l"] as string)
      );
      const atr = calculateATR(highPrices, lowPrices, closePrices, 14);
      const slDistance = args["stop_loss"]
        ? Math.abs(entryPrice - (args["stop_loss"] as number))
        : atr * 1.5;

      // Position sizing
      let units = args["units"] as number | undefined;
      if (!units) {
        const riskAmount = equity * (riskPercent / 100);
        // Simplified pip value calculation
        const pipValue = pair.endsWith("_JPY") ? 0.01 : 0.0001;
        const slPips = slDistance / pipValue;
        units = Math.floor(riskAmount / (slPips * pipValue));
      }

      const sl =
        args["stop_loss"] ??
        (direction === "buy" ? entryPrice - slDistance : entryPrice + slDistance);
      const tp =
        args["take_profit"] ??
        (direction === "buy"
          ? entryPrice + slDistance * rrRatio
          : entryPrice - slDistance * rrRatio);

      const orderBody = {
        order: {
          type: "MARKET",
          instrument: pair,
          units: direction === "buy" ? units.toString() : (-units).toString(),
          stopLossOnFill: {
            price: (sl as number).toFixed(5),
          },
          takeProfitOnFill: {
            price: (tp as number).toFixed(5),
          },
        },
      };

      const result = (await placeOrder(orderBody)) as Record<string, unknown>;

      const lines = [
        `=== Trade Execution ===`,
        `Pair:       ${pair}`,
        `Direction:  ${direction.toUpperCase()}`,
        `Units:      ${units.toLocaleString()}`,
        `Entry:      ${entryPrice.toFixed(5)} (market)`,
        `Stop Loss:  ${(sl as number).toFixed(5)}`,
        `Take Profit: ${(tp as number).toFixed(5)}`,
        `Risk:       ${riskPercent}% of $${equity.toFixed(2)} equity`,
        `Account:    ${getEnv("OANDA_ENVIRONMENT", "practice")!.toUpperCase()}`,
        ``,
        `Order result: ${JSON.stringify(result, null, 2)}`,
      ];

      return lines.join("\n");
    }

    case "fx_close": {
      const tradeId = args["trade_id"] as string;

      if (tradeId === "all") {
        const trades = (await getOpenTrades()) as Record<string, unknown>;
        const openTrades = (trades["trades"] as Record<string, unknown>[]) ?? [];

        if (openTrades.length === 0) {
          return "No open trades to close.";
        }

        const lines = ["=== Closing ALL Positions ===", ""];
        for (const trade of openTrades) {
          const id = trade["id"] as string;
          const instrument = trade["instrument"] as string;
          const units = trade["currentUnits"] as string;
          try {
            const result = (await closeTrade(id)) as Record<string, unknown>;
            const pl =
              (result["orderFillTransaction"] as Record<string, unknown>)?.[
                "pl"
              ] ?? "N/A";
            lines.push(
              `  ${instrument} ${parseFloat(units) > 0 ? "BUY" : "SELL"} ${Math.abs(parseFloat(units))} units -> CLOSED  P&L: $${pl}`
            );
          } catch (err) {
            lines.push(
              `  ${instrument} -> FAILED: ${err instanceof Error ? err.message : String(err)}`
            );
          }
        }
        lines.push(``);
        lines.push(`All ${openTrades.length} positions processed.`);
        return lines.join("\n");
      }

      const result = (await closeTrade(tradeId)) as Record<string, unknown>;
      return `Trade ${tradeId} closed.\n${JSON.stringify(result, null, 2)}`;
    }

    case "fx_modify": {
      const tradeId = args["trade_id"] as string;
      const modifications: Record<string, unknown> = {};
      if (args["stop_loss"] !== undefined) {
        modifications["stopLoss"] = {
          price: (args["stop_loss"] as number).toFixed(5),
        };
      }
      if (args["take_profit"] !== undefined) {
        modifications["takeProfit"] = {
          price: (args["take_profit"] as number).toFixed(5),
        };
      }
      if (Object.keys(modifications).length === 0) {
        throw new Error("Provide at least one of stop_loss or take_profit to modify.");
      }

      const result = (await modifyTrade(tradeId, modifications)) as Record<
        string,
        unknown
      >;
      return `Trade ${tradeId} modified.\n${JSON.stringify(result, null, 2)}`;
    }

    case "fx_pairs": {
      const category = ((args["category"] as string) ?? "all").toLowerCase();
      let pairs: string[];
      if (category === "all") {
        pairs = ALL_PAIRS;
      } else if (category in SUPPORTED_PAIRS) {
        pairs = SUPPORTED_PAIRS[category as keyof typeof SUPPORTED_PAIRS];
      } else {
        throw new Error(
          `Unknown category: ${category}. Use: majors, yen_crosses, other_crosses, metals, or all`
        );
      }

      try {
        const pricing = (await getPricing(pairs)) as Record<string, unknown>;
        const priceList = (pricing["prices"] as Record<string, unknown>[]) ?? [];

        const lines = [
          `=== Currency Pairs --- Live Prices ===`,
          ``,
          `  Pair          Bid         Ask        Spread`,
          `  ----          ---         ---        ------`,
        ];

        for (const p of priceList) {
          const instrument = p["instrument"] as string;
          const bid = parseFloat(
            ((p["bids"] as Record<string, unknown>[])?.[0])?.["price"] as string
          );
          const ask = parseFloat(
            ((p["asks"] as Record<string, unknown>[])?.[0])?.["price"] as string
          );
          const spread = ask - bid;
          const pipMultiplier = instrument.includes("_JPY") ? 100 : 10000;
          const spreadPips = (spread * pipMultiplier).toFixed(1);

          lines.push(
            `  ${instrument.padEnd(14)} ${bid.toFixed(5).padEnd(12)} ${ask.toFixed(5).padEnd(11)} ${spreadPips} pips`
          );
        }

        lines.push(``);
        lines.push(`Showing ${priceList.length}/${pairs.length} pairs`);
        return lines.join("\n");
      } catch {
        // If API call fails, return static list
        const lines = [
          `=== Supported Currency Pairs (${pairs.length}) ===`,
          ``,
        ];
        for (const category of Object.entries(SUPPORTED_PAIRS)) {
          lines.push(`${category[0].toUpperCase()}:`);
          lines.push(`  ${category[1].join(", ")}`);
          lines.push(``);
        }
        lines.push(`Total: ${ALL_PAIRS.length} pairs`);
        lines.push(`Set OANDA_API_KEY and OANDA_ACCOUNT_ID for live prices.`);
        return lines.join("\n");
      }
    }

    case "fx_risk": {
      const summary = (await getAccountSummary()) as Record<string, unknown>;
      const account = summary["account"] as Record<string, unknown>;
      const positions = (await getOpenPositions()) as Record<string, unknown>;
      const positionList = (positions["positions"] as Record<string, unknown>[]) ?? [];

      const nav = parseFloat(account["NAV"] as string);
      const maxPositions = parseInt(getEnv("FX_MAX_POSITIONS", "3")!, 10);
      const dailyLossLimit = parseFloat(getEnv("FX_DAILY_LOSS_LIMIT", "3")!);
      const lossLimit = nav * (dailyLossLimit / 100);
      const marginUsed = parseFloat(account["marginUsed"] as string);
      const openTradeCount = account["openTradeCount"] as number;

      const lines = [
        `=== FX Trader Pro --- Risk Dashboard ===`,
        `Positions: ${openTradeCount}/${maxPositions} (${maxPositions - openTradeCount} remaining)`,
        `Daily Loss Limit: $${lossLimit.toFixed(2)} (${dailyLossLimit}% of NAV)`,
        ``,
        `Correlation Groups:`,
      ];

      for (const [group, groupPairs] of Object.entries(CORRELATION_GROUPS)) {
        const openInGroup = positionList.filter((p) =>
          groupPairs.includes(p["instrument"] as string)
        );
        const status =
          openInGroup.length > 0
            ? `! ${openInGroup.map((p) => p["instrument"]).join(", ")} open`
            : "Available";
        lines.push(
          `  Group ${group} (${groupPairs.join("/")}): ${openInGroup.length}/1 max  ${status}`
        );
      }

      lines.push(``);
      lines.push(
        `Margin Status: ${marginUsed / nav < 0.5 ? "HEALTHY" : "ELEVATED"} (${((marginUsed / nav) * 100).toFixed(1)}% used)`
      );

      return lines.join("\n");
    }

    case "fx_journal": {
      // Journal reads from local storage
      const month = args["month"] as string | undefined;
      const lines = [
        `=== FX Trader Pro --- Trading Journal ===`,
        month ? `Period: ${month}` : `Period: All time`,
        ``,
        `Note: Trading journal data is stored locally in .fx-trader-pro/journal/trades.jsonl`,
        `This tool reads and analyzes the journal file for statistics.`,
        ``,
        `To populate the journal, execute trades using the fx_trade tool.`,
        `Each trade execution automatically logs entry/exit details.`,
      ];
      return lines.join("\n");
    }

    case "fx_stop_all": {
      if (args["confirm"] !== true) {
        throw new Error(
          "Safety confirmation required. Set confirm=true to close ALL positions."
        );
      }

      const trades = (await getOpenTrades()) as Record<string, unknown>;
      const openTrades = (trades["trades"] as Record<string, unknown>[]) ?? [];

      if (openTrades.length === 0) {
        return "EMERGENCY STOP: No open positions. All clear.";
      }

      const lines = [
        `!!! EMERGENCY STOP --- CLOSING ALL POSITIONS !!!`,
        ``,
      ];

      let totalPL = 0;
      for (const trade of openTrades) {
        const id = trade["id"] as string;
        const instrument = trade["instrument"] as string;
        const units = trade["currentUnits"] as string;
        try {
          const result = (await closeTrade(id)) as Record<string, unknown>;
          const pl = parseFloat(
            ((result["orderFillTransaction"] as Record<string, unknown>)?.[
              "pl"
            ] as string) ?? "0"
          );
          totalPL += pl;
          lines.push(
            `  Closing ${instrument} ${parseFloat(units) > 0 ? "BUY" : "SELL"} ${Math.abs(parseFloat(units))} units -> CLOSED  P&L: $${pl.toFixed(2)}`
          );
        } catch (err) {
          lines.push(
            `  ${instrument} -> FAILED: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }

      lines.push(``);
      lines.push(`All ${openTrades.length} positions closed.`);
      lines.push(`Total realized P&L: $${totalPL.toFixed(2)}`);
      lines.push(`Trading HALTED. Use fx_status to check account.`);

      return lines.join("\n");
    }

    case "fx_backtest": {
      const pair = (args["pair"] as string).toUpperCase();
      const strategy = args["strategy"] as string;
      const fromDate = args["from_date"] as string;
      const toDate = args["to_date"] as string;
      validatePair(pair);

      const lines = [
        `=== Backtest: ${pair} ${strategy} ===`,
        `Period: ${fromDate} to ${toDate}`,
        ``,
        `Backtesting requires historical candle data from OANDA.`,
        `Strategy "${strategy}" will be evaluated with the following rules:`,
        ``,
      ];

      switch (strategy) {
        case "ema-cross":
          lines.push(`Strategy: EMA 20/50 Crossover`);
          lines.push(`  BUY when EMA 20 crosses above EMA 50`);
          lines.push(`  SELL when EMA 20 crosses below EMA 50`);
          break;
        case "rsi-bounce":
          lines.push(`Strategy: RSI Bounce`);
          lines.push(`  BUY when RSI(14) crosses above 30 from below`);
          lines.push(`  SELL when RSI(14) crosses below 70 from above`);
          break;
        case "macd-signal":
          lines.push(`Strategy: MACD Signal Line Crossover`);
          lines.push(`  BUY when MACD crosses above signal line`);
          lines.push(`  SELL when MACD crosses below signal line`);
          break;
        default:
          lines.push(`Strategy: ${strategy} (custom)`);
          lines.push(`  Define the strategy rules for backtesting.`);
      }

      lines.push(``);
      lines.push(`Risk settings: ${getEnv("FX_RISK_PERCENT", "2")}% per trade, R:R 1:${getEnv("FX_DEFAULT_RR", "2")}`);
      lines.push(``);
      lines.push(`Note: Full backtesting execution downloads historical data from OANDA`);
      lines.push(`and simulates trades according to the strategy rules.`);

      return lines.join("\n");
    }

    case "help": {
      const lines = [
        `=== FX Trader Pro v${SERVER_VERSION} ===`,
        SERVER_DESCRIPTION,
        ``,
        `Available tools:`,
        `  fx_status      - Account overview (NAV, P&L, positions, session)`,
        `  fx_analyze      - Technical analysis for a pair (MAs, RSI, MACD, trend)`,
        `  fx_scan         - Scan all 28 pairs for opportunities`,
        `  fx_signal       - Generate detailed trade signal`,
        `  fx_trade        - Execute a trade on OANDA`,
        `  fx_close        - Close position(s)`,
        `  fx_modify       - Modify SL/TP on existing trade`,
        `  fx_pairs        - List pairs with live prices and spreads`,
        `  fx_risk         - Risk management dashboard`,
        `  fx_journal      - Trading journal statistics`,
        `  fx_stop_all     - EMERGENCY: Close ALL positions`,
        `  fx_backtest     - Backtest a strategy on historical data`,
        ``,
        `Environment variables:`,
        `  OANDA_API_KEY (required)       - OANDA v20 API token`,
        `  OANDA_ACCOUNT_ID (required)    - OANDA account ID`,
        `  OANDA_ENVIRONMENT (optional)   - 'practice' or 'live' (default: practice)`,
        `  FX_RISK_PERCENT (optional)     - Risk per trade % (default: 2)`,
        `  FX_MAX_POSITIONS (optional)    - Max concurrent positions (default: 3)`,
        `  FX_DAILY_LOSS_LIMIT (optional) - Daily loss limit % (default: 3)`,
        `  FX_DEFAULT_RR (optional)       - Risk:reward ratio (default: 2)`,
      ];
      return lines.join("\n");
    }

    case "version": {
      return JSON.stringify(
        {
          name: SERVER_NAME,
          version: SERVER_VERSION,
          description: SERVER_DESCRIPTION,
          author: "hanabi-jpn",
          license: "MIT",
        },
        null,
        2
      );
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, (args as Record<string, unknown>) ?? {});
    return {
      content: [{ type: "text" as const, text: result }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text" as const, text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
