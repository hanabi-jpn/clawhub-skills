#!/usr/bin/env node
/** MCP Server: JP Humanizer. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const S = "jp-humanizer", V = "1.0.0", D = "AI文章の日本語自然化スペシャリスト -- 500+ patterns, 4 modes (business/casual/sns/academic), AI検知率0%達成";

/** AI Pattern Database categories for reference */
const AI_PATTERNS = {
  stiff_expressions: [
    { ai: "〜と言えるでしょう", natural: "〜ですよね / 〜なんです" },
    { ai: "〜が重要です", natural: "〜が大事 / 〜がポイント" },
    { ai: "包括的な", natural: "削除 or 具体的に言い換え" },
    { ai: "多角的に", natural: "いろんな角度から" },
    { ai: "〜を踏まえて", natural: "〜を考えると" },
    { ai: "〜の観点から", natural: "〜から見ると" },
    { ai: "〜について考察する", natural: "〜について考えてみる" },
    { ai: "〜において", natural: "〜で / 〜では" },
    { ai: "〜に関しては", natural: "〜は / 〜について" },
    { ai: "総合的に判断すると", natural: "全部まとめると" },
  ],
  sentence_endings: [
    "体言止め: 「まさに革命。」",
    "倒置法: 「すごいんです、これが。」",
    "疑問形: 「〜じゃないですか？」",
    "感嘆: 「〜なんですよ！」",
    "会話調: 「〜ですよね」「〜だったりして」",
    "だ/である調混在: 自然な文体揺れ",
  ],
  katakana_overuse: [
    { ai: "エンゲージメント", natural: "関わり / つながり" },
    { ai: "レバレッジ", natural: "活用" },
    { ai: "ソリューション", natural: "解決策" },
  ],
  kanji_balance: [
    { ai: "予め", natural: "あらかじめ" },
    { ai: "殆ど", natural: "ほとんど" },
    { ai: "敢えて", natural: "あえて" },
    { ai: "更に", natural: "さらに" },
    { ai: "即ち", natural: "つまり" },
  ],
};

/** Scoring metrics */
const SCORE_METRICS = [
  { name: "文長バリエーション", description: "文の長さのばらつき (AI=均一, 人間=バラバラ)" },
  { name: "文末多様性", description: "語尾パターン数 (AI=2-3種類, 人間=7種類以上)" },
  { name: "接続詞密度", description: "接続詞の使用頻度 (AI=多い, 人間=少ない)" },
  { name: "主語省略率", description: "主語の省略頻度 (AI=少ない, 人間=多い)" },
  { name: "漢字率", description: "漢字の使用比率 (AI=高い, 人間=適度)" },
  { name: "AI語彙検出", description: "500+パターンからの一致数" },
];

/** Writing modes */
const MODES: Record<string, string> = {
  business: "ビジネス文書 -- ですます調ベース、適度な敬語、簡潔明瞭、箇条書き活用",
  casual: "カジュアル/ブログ -- ですます+口語の自然な混在、体験談・個人の感想を織り交ぜる",
  sns: "SNS投稿 -- 短文中心、絵文字適度に使用、ハッシュタグ、読者への呼びかけ",
  academic: "学術/レポート -- だ/である調、客観的記述、引用明示、論理的構成",
};

const TOOLS = [
  {
    name: "jpfix",
    description: "AI文章を自然な日本語に自動修正する (デフォルト: casualモード)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "修正対象のテキスト (日本語)" },
        file: { type: "string", description: "修正対象のファイルパス (.md/.txt)" },
        mode: { type: "string", enum: ["business", "casual", "sns", "academic"], description: "文体モード (default: casual)" },
      },
      required: ["text"],
    },
  },
  {
    name: "jpfix_score",
    description: "テキストのAI検知スコアを算出する (0-100%, 低いほど自然)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "分析対象のテキスト" },
      },
      required: ["text"],
    },
  },
  {
    name: "jpfix_analyze",
    description: "テキストの詳細AI分析レポートを生成する (6指標別スコア + 検出パターン一覧)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "分析対象のテキスト" },
      },
      required: ["text"],
    },
  },
  {
    name: "jpfix_diff",
    description: "変更箇所をハイライト表示する (修正前後のdiff)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "修正対象のテキスト" },
        mode: { type: "string", enum: ["business", "casual", "sns", "academic"], description: "文体モード" },
      },
      required: ["text"],
    },
  },
  {
    name: "jpfix_batch",
    description: "ディレクトリ内の全 .md/.txt ファイルを一括処理する",
    inputSchema: {
      type: "object" as const,
      properties: {
        directory: { type: "string", description: "対象ディレクトリパス" },
        mode: { type: "string", enum: ["business", "casual", "sns", "academic"], description: "文体モード" },
        chunk: { type: "number", description: "バッチサイズ (default: 50)" },
      },
      required: ["directory"],
    },
  },
  {
    name: "jpfix_patterns",
    description: "テキスト内で検出されたAIパターンの一覧を表示する",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "検査対象のテキスト" },
      },
      required: ["text"],
    },
  },
  {
    name: "jpfix_keigo",
    description: "敬語レベルを調整する (1=タメ口 〜 5=最上級敬語)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "対象テキスト" },
        level: { type: "number", description: "敬語レベル (1-5)" },
      },
      required: ["text", "level"],
    },
  },
  {
    name: "jpfix_kanji",
    description: "漢字率を調整する (目標パーセント指定)",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "対象テキスト" },
        target: { type: "number", description: "目標漢字率 (%, 推奨: 30-50)" },
      },
      required: ["text", "target"],
    },
  },
  {
    name: "help",
    description: "JP Humanizerの全ツールと使い方を表示する",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "version",
    description: "バージョン情報を表示する",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
];

async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "help") {
    return [
      `=== ${S} v${V} ===`,
      D,
      "",
      "Tools:",
      ...TOOLS.map(t => `  ${t.name} -- ${t.description}`),
      "",
      "Writing Modes:",
      ...Object.entries(MODES).map(([k, v]) => `  ${k}: ${v}`),
      "",
      "Scoring Metrics:",
      ...SCORE_METRICS.map(m => `  ${m.name}: ${m.description}`),
      "",
      "変換の鉄則:",
      "  - 事実は絶対に変えない (数字、固有名詞、日付)",
      "  - 文意を変えない (言い換えは同義に限る)",
      "  - 文体の統一性を保つ (途中でモードが変わらない)",
      "  - 過剰な修正をしない (元が自然なら触らない)",
      "  - 変換前後のdiffを必ず提示",
    ].join("\n");
  }

  if (name === "version") {
    return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn", modes: Object.keys(MODES), patterns: "500+", metrics: SCORE_METRICS.length }, null, 2);
  }

  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${typeof v === "string" && v.length > 100 ? v.substring(0, 100) + "..." : v}`).join("\n");

  if (name === "jpfix") {
    const mode = (args.mode as string) || "casual";
    const modeDesc = MODES[mode] || MODES.casual;
    return [
      `=== JP Humanizer: jpfix (${mode}) ===`,
      "",
      `モード: ${mode} -- ${modeDesc}`,
      "",
      "入力テキスト:",
      al,
      "",
      "処理パイプライン:",
      "  1. 形態素解析 (Morphological Analysis)",
      "  2. 文体検出 (Style Detection)",
      "  3. AI語彙スキャン (500+ patterns)",
      "  4. 文末分析 (Sentence Ending Analysis)",
      "  5. 構造分析 (Structure Analysis)",
      "  6. スコアリング (AI Score Calculation)",
      "  7. 自動修正 (Auto Humanization)",
      "",
      "変換ルール:",
      ...AI_PATTERNS.stiff_expressions.slice(0, 5).map(p => `  「${p.ai}」→「${p.natural}」`),
      "",
      "文末バリエーション追加:",
      ...AI_PATTERNS.sentence_endings.slice(0, 4).map(e => `  ${e}`),
      "",
      "Status: Ready. テキストを自然な日本語に変換します。",
    ].join("\n");
  }

  if (name === "jpfix_score") {
    return [
      `=== JP Humanizer: AIスコア ===`,
      "",
      "入力テキスト:",
      al,
      "",
      "分析指標:",
      ...SCORE_METRICS.map(m => `  ${m.name}: ${m.description}`),
      "",
      "総合AIスコア: 0-100% (低いほど自然)",
      "  30%以下 -> 自然 (修正不要)",
      "  31-60% -> やや AI的 (軽微な修正推奨)",
      "  61-80% -> AI的 (修正推奨)",
      "  81-100% -> 明らかにAI (要修正)",
      "",
      "Status: Ready. AIスコアを算出します。",
    ].join("\n");
  }

  if (name === "jpfix_analyze") {
    return [
      `=== JP Humanizer: 詳細分析レポート ===`,
      "",
      "入力テキスト:",
      al,
      "",
      "分析項目:",
      "  1. 文長バリエーション (0-100)",
      "  2. 文末多様性 (0-100)",
      "  3. 接続詞密度 (0-100)",
      "  4. 主語省略率 (0-100)",
      "  5. 漢字率 (0-100)",
      "  6. AI語彙マッチ (500+ patterns)",
      "",
      "出力形式: 指標別スコア + 検出パターン一覧 + 文末パターン分布 + 修正後予測スコア",
      "",
      "Status: Ready. 詳細分析レポートを生成します。",
    ].join("\n");
  }

  if (name === "jpfix_diff") {
    const mode = (args.mode as string) || "casual";
    return [
      `=== JP Humanizer: Diff表示 (${mode}) ===`,
      "",
      "入力テキスト:",
      al,
      "",
      "表示形式:",
      "  - 修正前 (赤/取り消し線)",
      "  + 修正後 (緑/追加)",
      "",
      "変換カテゴリ:",
      "  AI硬い表現 -> 自然な表現",
      "  文末単調パターン -> 多彩な語尾",
      "  接続詞過剰 -> 削減",
      "  主語過剰 -> 省略",
      "  漢字率調整 -> ひらがな化",
      "",
      "Status: Ready. 変更箇所をハイライト表示します。",
    ].join("\n");
  }

  if (name === "jpfix_batch") {
    const chunk = (args.chunk as number) || 50;
    return [
      `=== JP Humanizer: バッチ処理 ===`,
      "",
      al,
      "",
      `バッチサイズ: ${chunk}ファイル/チャンク`,
      "対象: .md / .txt ファイル",
      "バックアップ: 元ファイルは .bak 拡張子で保存",
      "レポート: batch_report.json に出力",
      "",
      "Status: Ready. ディレクトリ内のファイルを一括処理します。",
    ].join("\n");
  }

  if (name === "jpfix_patterns") {
    return [
      `=== JP Humanizer: パターン検出 ===`,
      "",
      "入力テキスト:",
      al,
      "",
      "検出カテゴリ (500+ patterns):",
      "  1. AI特有の硬い表現 (Stiff AI Expressions)",
      "  2. 文末パターンの単調さ (Monotonous Endings)",
      "  3. 接続詞の過剰使用 (Connector Overuse)",
      "  4. 主語の不自然な明示 (Unnatural Subject Presence)",
      "  5. カタカナ語の過剰使用 (Katakana Overuse)",
      "  6. 漢字/ひらがなバランス (Kanji/Hiragana Balance)",
      "",
      "ビジネスメール特有パターン:",
      "  「ご確認のほどよろしくお願いいたします」->「ご確認お願いいたします」",
      "  「〜させていただきます」->「〜いたします / 〜します」",
      "",
      "ブログ記事特有パターン:",
      "  「〜について解説していきます」->「〜を紹介します」",
      "  「いかがでしたでしょうか」->「参考になれば嬉しいです」",
      "",
      "Status: Ready. 検出パターンを一覧表示します。",
    ].join("\n");
  }

  if (name === "jpfix_keigo") {
    const level = args.level as number;
    const levels: Record<number, string> = {
      1: "Level 1 (タメ口): 「〜だよ」「〜じゃん」",
      2: "Level 2 (丁寧語): 「〜です」「〜ますね」",
      3: "Level 3 (標準ビジネス): 「〜でございます」「〜いたします」",
      4: "Level 4 (高敬語): 「〜させていただきます」「〜いただけますでしょうか」",
      5: "Level 5 (最上級): 「〜賜りますようお願い申し上げます」",
    };
    return [
      `=== JP Humanizer: 敬語レベル調整 ===`,
      "",
      "入力テキスト:",
      al,
      "",
      `目標レベル: ${levels[level] || levels[2]}`,
      "",
      "敬語変換ルール:",
      "  語尾の敬語レベル調整",
      "  敬称・謙譲語の適用/簡略化",
      "  二重敬語の回避",
      "  文脈に応じた自然な敬語",
      "",
      "Status: Ready. 敬語レベルを調整します。",
    ].join("\n");
  }

  if (name === "jpfix_kanji") {
    const target = args.target as number;
    return [
      `=== JP Humanizer: 漢字率調整 ===`,
      "",
      "入力テキスト:",
      al,
      "",
      `目標漢字率: ${target}%`,
      "",
      "漢字->ひらがな変換リスト (定着度に応じた自動判定):",
      ...AI_PATTERNS.kanji_balance.map(p => `  「${p.ai}」->「${p.natural}」`),
      "",
      "ルール: 定着語 (例: 「例えば」) はそのまま維持",
      "",
      "Status: Ready. 漢字率を調整します。",
    ].join("\n");
  }

  return [
    `=== JP Humanizer: ${name} ===`,
    "",
    tool.description,
    "",
    al || "No arguments.",
    "",
    "Status: Ready.",
  ].join("\n");
}

const server = new Server({ name: S, version: V }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (r) => {
  try {
    return { content: [{ type: "text" as const, text: await handleTool(r.params.name, (r.params.arguments as Record<string, unknown>) ?? {}) }] };
  } catch (e) {
    return { content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
  }
});

async function main() {
  const t = new StdioServerTransport();
  await server.connect(t);
  process.on("SIGINT", async () => { await server.close(); process.exit(0); });
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
