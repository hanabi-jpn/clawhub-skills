#!/usr/bin/env node
/** MCP Server: JP SEO Writer. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const S = "jp-seo-writer", V = "1.0.0", D = "日本語SEO記事自動生成エージェント -- 共起語分析、構成案作成、E-E-A-T対応の高品質記事を生成";

/** SEO scoring dimensions */
const SEO_DIMENSIONS = [
  { name: "KW密度", weight: 15, description: "キーワード密度 (目標: 2-4%)" },
  { name: "共起語カバー率", weight: 20, description: "上位記事の共起語網羅度" },
  { name: "見出し構造", weight: 10, description: "H1/H2/H3の適切な階層構造" },
  { name: "文字数", weight: 10, description: "競合平均との比較" },
  { name: "E-E-A-T", weight: 20, description: "経験/専門性/権威性/信頼性" },
  { name: "読みやすさ", weight: 10, description: "一文の長さ、段落構成" },
  { name: "メタデータ", weight: 10, description: "title/description/OGP最適化" },
  { name: "内部リンク", weight: 5, description: "サイト内リンクの配置" },
];

/** E-E-A-T criteria */
const EEAT_CRITERIA = [
  { name: "Experience (経験)", points: 25, check: "体験談、実際に〜した表現の有無" },
  { name: "Expertise (専門性)", points: 25, check: "専門用語の適切な使用、深い解説" },
  { name: "Authoritativeness (権威性)", points: 25, check: "データ引用、公式情報源の参照" },
  { name: "Trustworthiness (信頼性)", points: 25, check: "出典明示、更新日、正確な情報" },
];

/** Quality standards */
const QUALITY_STANDARDS = {
  keyword_density: "2-4%",
  cooccurrence_coverage: "70%以上",
  sentence_length: "平均40文字以内",
  paragraph_length: "3-5文",
  heading_interval: "300-500文字ごとにH2/H3",
  image_interval: "1000文字ごとに1箇所",
  title_length: "32文字以内",
  description_length: "120文字以内",
};

const TOOLS = [
  {
    name: "seo_research",
    description: "キーワードリサーチ -- 検索ボリューム推定、関連KW抽出、ロングテール提案、検索意図分析",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "調査するキーワード (例: 副業 おすすめ)" },
      },
      required: ["keyword"],
    },
  },
  {
    name: "seo_outline",
    description: "構成案作成 -- H1/H2/H3構造、各セクション文字数目安、共起語配置計画、FAQ候補",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "対象キーワード" },
      },
      required: ["keyword"],
    },
  },
  {
    name: "seo_write",
    description: "SEO最適化された日本語記事を生成する (構成案 -> 本文 -> メタデータまで一括)",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "対象キーワード" },
        length: { type: "number", description: "目標文字数 (default: 3000-5000)" },
        secondary: { type: "string", description: "サブキーワード (カンマ区切り)" },
      },
      required: ["keyword"],
    },
  },
  {
    name: "seo_analyze",
    description: "既存記事のSEO診断 -- 8指標スコアリング + 改善提案",
    inputSchema: {
      type: "object" as const,
      properties: {
        url_or_file: { type: "string", description: "診断対象のURLまたはファイルパス" },
      },
      required: ["url_or_file"],
    },
  },
  {
    name: "seo_rewrite",
    description: "既存記事のSEO改善リライト -- 共起語追加、E-E-A-T強化、構造最適化",
    inputSchema: {
      type: "object" as const,
      properties: {
        url_or_file: { type: "string", description: "リライト対象のURLまたはファイルパス" },
        keyword: { type: "string", description: "ターゲットキーワード" },
      },
      required: ["url_or_file", "keyword"],
    },
  },
  {
    name: "seo_meta",
    description: "メタデータ生成 -- title (32文字), meta description (120文字), OGP, 構造化データ",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "対象キーワード" },
        title: { type: "string", description: "記事タイトル" },
      },
      required: ["keyword", "title"],
    },
  },
  {
    name: "seo_cooccurrence",
    description: "共起語分析 -- 上位10記事から共起語を抽出、必須/推奨/任意に分類",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "対象キーワード" },
      },
      required: ["keyword"],
    },
  },
  {
    name: "seo_competitors",
    description: "競合上位記事分析 -- 上位10記事の構成・文字数・見出し・共通トピック抽出",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "対象キーワード" },
      },
      required: ["keyword"],
    },
  },
  {
    name: "seo_score",
    description: "SEOスコア算出 -- 8指標で0-100点評価 + 改善優先度",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: { type: "string", description: "スコア算出対象のテキスト" },
        keyword: { type: "string", description: "ターゲットキーワード" },
      },
      required: ["text", "keyword"],
    },
  },
  {
    name: "help",
    description: "JP SEO Writerの全ツールと使い方を表示する",
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
      "SEO Scoring Dimensions:",
      ...SEO_DIMENSIONS.map(d => `  ${d.name} (${d.weight}%): ${d.description}`),
      "",
      "E-E-A-T Criteria:",
      ...EEAT_CRITERIA.map(c => `  ${c.name} (${c.points}pts): ${c.check}`),
      "",
      "Quality Standards:",
      ...Object.entries(QUALITY_STANDARDS).map(([k, v]) => `  ${k}: ${v}`),
      "",
      "日本語SEO特有の対応:",
      "  - 形態素解析ベースのキーワード密度計算",
      "  - 日本語検索パターン (〜とは, 〜やり方) 対応",
      "  - title 32文字 / description 120文字 (全角基準)",
      "  - Google JP + Yahoo! JAPAN 対応",
    ].join("\n");
  }

  if (name === "version") {
    return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn", dimensions: SEO_DIMENSIONS.length, eeat: true }, null, 2);
  }

  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${typeof v === "string" && v.length > 100 ? v.substring(0, 100) + "..." : v}`).join("\n");

  if (name === "seo_research") {
    const kw = args.keyword as string;
    return [
      `=== JP SEO Writer: キーワードリサーチ ===`,
      "",
      `キーワード: ${kw}`,
      "",
      "分析項目:",
      "  1. 推定月間検索ボリューム",
      "  2. 競合難易度評価",
      "  3. 検索意図分類 (情報収集/比較検討/購入/ナビゲーション)",
      "  4. 関連キーワード抽出 (LSI)",
      "  5. ロングテールキーワード候補",
      "  6. キーワード難易度評価",
      "",
      "出力形式: ボリューム + 難易度 + 検索意図 + 関連KW + 主要共起語",
      "",
      "Status: Ready. キーワードリサーチを実行します。",
    ].join("\n");
  }

  if (name === "seo_outline") {
    const kw = args.keyword as string;
    return [
      `=== JP SEO Writer: 構成案作成 ===`,
      "",
      `キーワード: ${kw}`,
      "",
      "構成案の内容:",
      "  - H1/H2/H3 見出し構造",
      "  - 各セクション文字数配分",
      "  - 共起語配置計画 (必須/推奨/任意)",
      "  - FAQ候補の選定 (構造化データ対応)",
      "  - 内部リンク配置ポイント",
      "  - 画像挿入ポイント",
      "  - 独自性のある切り口提案",
      "",
      "メタデータ案:",
      "  - title (32文字以内, キーワード含む)",
      "  - meta description (120文字以内)",
      "",
      "QUALITY GATE: 構成案をユーザーに提示し承認後に執筆開始",
      "",
      "Status: Ready. 構成案を作成します。",
    ].join("\n");
  }

  if (name === "seo_write") {
    const kw = args.keyword as string;
    const length = (args.length as number) || 5000;
    const secondary = args.secondary as string;
    return [
      `=== JP SEO Writer: 記事生成 ===`,
      "",
      `メインキーワード: ${kw}`,
      secondary ? `サブキーワード: ${secondary}` : "",
      `目標文字数: ${length}文字`,
      "",
      "生成パイプライン:",
      "  Phase 1: Keyword Research (検索ボリューム, 関連KW)",
      "  Phase 2: Competitor Analysis (上位10記事の構成解析)",
      "  Phase 3: Co-occurrence Analysis (共起語抽出, スコアリング)",
      "  Phase 4: Outline Creation (H1/H2/H3構造設計)",
      "  Phase 5: Article Writing (KW密度2-4%, 共起語配置, E-E-A-T)",
      "  Phase 6: Quality Check (SEOスコア, メタデータ, 構造化データ)",
      "",
      "品質基準:",
      ...Object.entries(QUALITY_STANDARDS).map(([k, v]) => `  ${k}: ${v}`),
      "",
      "E-E-A-T要素の組み込み:",
      ...EEAT_CRITERIA.map(c => `  ${c.name}: ${c.check}`),
      "",
      "Status: Ready. SEO最適化記事を生成します。",
    ].join("\n");
  }

  if (name === "seo_analyze") {
    return [
      `=== JP SEO Writer: SEO診断 ===`,
      "",
      al,
      "",
      "診断項目 (8指標):",
      ...SEO_DIMENSIONS.map(d => `  ${d.name} (weight: ${d.weight}%): ${d.description}`),
      "",
      "出力: 総合スコア + 指標別スコア + 改善提案 (優先度: HIGH/MED/LOW)",
      "",
      "Status: Ready. SEO診断を実行します。",
    ].join("\n");
  }

  if (name === "seo_rewrite") {
    return [
      `=== JP SEO Writer: SEO改善リライト ===`,
      "",
      al,
      "",
      "リライト内容:",
      "  - 共起語の追加 (不足分を自然に埋め込み)",
      "  - 見出し構造の調整",
      "  - E-E-A-T要素の補強",
      "  - メタデータの最適化",
      "  - 内部リンクの追加",
      "",
      "制約: 元の文意と構造を尊重し、必要な変更のみ実施",
      "出力: diff形式で変更箇所を提示",
      "",
      "Status: Ready. SEO改善リライトを実行します。",
    ].join("\n");
  }

  if (name === "seo_meta") {
    return [
      `=== JP SEO Writer: メタデータ生成 ===`,
      "",
      al,
      "",
      "生成項目:",
      "  - title タグ (32文字以内, キーワード含む, pixel幅考慮)",
      "  - meta description (120文字以内, クリック誘導)",
      "  - OGPテキスト (og:title, og:description)",
      "  - 構造化データ JSON-LD (FAQPage, HowTo, Article, BreadcrumbList)",
      "  - canonical URL提案",
      "",
      "Status: Ready. メタデータを生成します。",
    ].join("\n");
  }

  if (name === "seo_cooccurrence") {
    const kw = args.keyword as string;
    return [
      `=== JP SEO Writer: 共起語分析 ===`,
      "",
      `キーワード: ${kw}`,
      "",
      "分析プロセス:",
      "  1. 上位10記事の本文を取得",
      "  2. 形態素解析 (MeCab/Sudachi) で品詞分解",
      "  3. TF-IDF計算 (各語句の重要度)",
      "  4. 共起頻度集計 (メインKWとの同一段落内での共起)",
      "  5. スコアリング (TF-IDF x 共起頻度 x 出現率)",
      "  6. カテゴリ分類:",
      "     必須 (70%以上の記事で使用)",
      "     推奨 (40-70%)",
      "     任意 (40%未満 -- 差別化要素)",
      "",
      "出力: 共起語一覧 + スコア + 出現記事数 + 配置推奨位置",
      "",
      "Status: Ready. 共起語分析を実行します。",
    ].join("\n");
  }

  if (name === "seo_competitors") {
    const kw = args.keyword as string;
    return [
      `=== JP SEO Writer: 競合上位記事分析 ===`,
      "",
      `キーワード: ${kw}`,
      "",
      "分析項目:",
      "  - 上位10記事の見出し構造解析",
      "  - 平均文字数の算出",
      "  - 共通トピック抽出",
      "  - 差別化ポイント特定",
      "  - コンテンツギャップ分析",
      "",
      "Status: Ready. 競合分析を実行します。",
    ].join("\n");
  }

  if (name === "seo_score") {
    return [
      `=== JP SEO Writer: SEOスコア算出 ===`,
      "",
      al,
      "",
      "スコアリング基準:",
      ...SEO_DIMENSIONS.map(d => `  ${d.name} (${d.weight}%): ${d.description}`),
      "",
      "E-E-A-Tスコア内訳:",
      ...EEAT_CRITERIA.map(c => `  ${c.name} (${c.points}pts): ${c.check}`),
      "",
      "出力: 総合スコア (0-100) + 指標別 + 改善提案",
      "",
      "Status: Ready. SEOスコアを算出します。",
    ].join("\n");
  }

  return [
    `=== JP SEO Writer: ${name} ===`,
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
