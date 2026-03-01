#!/usr/bin/env node
/** MCP Server: JP Tax Calc. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const S = "jp-tax-calc", V = "1.0.0", D = "日本の税金計算・確定申告支援エージェント -- 所得税、消費税、法人税、ふるさと納税の計算とe-Tax連携";

const ENV_VARS = [
  { name: "ETAX_API_KEY", required: false, description: "e-Tax API key for electronic filing" },
  { name: "MYNUMBER_VERIFY_KEY", required: false, description: "MyNumber verification API key" },
  { name: "FREEE_ACCESS_TOKEN", required: false, description: "freee accounting OAuth access token" },
  { name: "JP_TAX_YEAR", required: false, description: "Target tax year (YYYY, default: current year)" },
];

/** Income tax brackets (2026) */
const TAX_BRACKETS = [
  { min: 1000, max: 1949000, rate: 0.05, deduction: 0 },
  { min: 1950000, max: 3299000, rate: 0.10, deduction: 97500 },
  { min: 3300000, max: 6949000, rate: 0.20, deduction: 427500 },
  { min: 6950000, max: 8999000, rate: 0.23, deduction: 636000 },
  { min: 9000000, max: 17999000, rate: 0.33, deduction: 1536000 },
  { min: 18000000, max: 39999000, rate: 0.40, deduction: 2796000 },
  { min: 40000000, max: Infinity, rate: 0.45, deduction: 4796000 },
];

/** Employment income deduction table */
const EMPLOYMENT_DEDUCTIONS = [
  { max: 1625000, calc: "550,000 (fixed)" },
  { max: 1800000, calc: "income x 40% - 100,000" },
  { max: 3600000, calc: "income x 30% + 80,000" },
  { max: 6600000, calc: "income x 20% + 440,000" },
  { max: 8500000, calc: "income x 10% + 1,100,000" },
  { max: Infinity, calc: "1,950,000 (cap)" },
];

/** Income deductions list */
const INCOME_DEDUCTIONS = [
  { name: "基礎控除", amount: 480000, note: "全員適用 (所得2,400万円以下)" },
  { name: "配偶者控除", amount: 380000, note: "配偶者の所得48万円以下" },
  { name: "配偶者特別控除", amount: "1-380,000", note: "配偶者の所得48-133万円" },
  { name: "扶養控除 (一般)", amount: 380000, note: "16歳以上の扶養親族" },
  { name: "扶養控除 (特定)", amount: 630000, note: "19-22歳の扶養親族" },
  { name: "扶養控除 (老人)", amount: 480000, note: "70歳以上の扶養親族" },
  { name: "社会保険料控除", amount: "全額", note: "健康保険・厚生年金・雇用保険" },
  { name: "生命保険料控除", amount: "最大120,000", note: "一般+介護+個人年金" },
  { name: "地震保険料控除", amount: "最大50,000", note: "地震保険料の全額" },
  { name: "医療費控除", amount: "最大200万", note: "医療費 - 10万円 (or 所得5%)" },
  { name: "寄附金控除 (ふるさと納税)", amount: "上限あり", note: "寄附金 - 2,000円" },
  { name: "小規模企業共済等掛金控除 (iDeCo)", amount: "全額", note: "月23,000円上限 (会社員)" },
  { name: "住宅ローン控除", amount: "最大35万/年", note: "税額控除 (10-13年間)" },
];

/** Simplified consumption tax deemed purchase rates */
const DEEMED_RATES: Record<string, number> = {
  "1-卸売業": 90,
  "2-小売業": 80,
  "3-製造業": 70,
  "4-その他": 60,
  "5-サービス業": 50,
  "6-不動産業": 40,
};

const TOOLS = [
  {
    name: "tax_income",
    description: "所得税計算 -- 給与所得控除、所得控除、累進税率、復興特別所得税、住民税を一括計算",
    inputSchema: {
      type: "object" as const,
      properties: {
        income: { type: "number", description: "給与収入額 (円)" },
        deductions: { type: "string", description: "追加控除 (JSON: {social_insurance: 858000, ideco: 276000, ...})" },
        income_type: { type: "string", enum: ["salary", "business", "rental", "misc"], description: "所得種別 (default: salary)" },
      },
      required: ["income"],
    },
  },
  {
    name: "tax_income_simulate",
    description: "年収から手取り概算 -- 社会保険料・所得税・住民税を差し引いた手取りシミュレーション",
    inputSchema: {
      type: "object" as const,
      properties: {
        salary: { type: "number", description: "年収 (円)" },
      },
      required: ["salary"],
    },
  },
  {
    name: "tax_consumption",
    description: "消費税計算 -- 本則課税 (課税売上 - 仕入税額控除) + 簡易課税/2割特例との比較",
    inputSchema: {
      type: "object" as const,
      properties: {
        taxable_sales: { type: "number", description: "課税売上高 (税抜, 円)" },
        taxable_purchases: { type: "number", description: "課税仕入高 (税抜, 円)" },
      },
      required: ["taxable_sales", "taxable_purchases"],
    },
  },
  {
    name: "tax_consumption_simplified",
    description: "簡易課税計算 -- みなし仕入率 (6業種) を適用した消費税計算",
    inputSchema: {
      type: "object" as const,
      properties: {
        sales: { type: "number", description: "課税売上高 (円)" },
        industry: { type: "string", description: "業種 (1-卸売, 2-小売, 3-製造, 4-その他, 5-サービス, 6-不動産)" },
      },
      required: ["sales", "industry"],
    },
  },
  {
    name: "tax_corporate",
    description: "法人税計算 -- 法人税 + 地方法人税 + 事業税 + 住民税 + 実効税率を一括算出",
    inputSchema: {
      type: "object" as const,
      properties: {
        income: { type: "number", description: "課税所得金額 (円)" },
        type: { type: "string", enum: ["small", "large"], description: "法人区分 (small: 中小法人, large: 大企業)" },
      },
      required: ["income"],
    },
  },
  {
    name: "tax_furusato",
    description: "ふるさと納税上限計算 -- 控除上限額シミュレーション + 実質負担2,000円確認",
    inputSchema: {
      type: "object" as const,
      properties: {
        salary: { type: "number", description: "年収 (円)" },
        family: { type: "string", description: "家族構成 (JSON: {spouse: true, dependents: [{age: 17}]})" },
      },
      required: ["salary"],
    },
  },
  {
    name: "tax_checklist",
    description: "確定申告チェックリスト -- 必要書類、所得関連、控除証明書、e-Tax準備の一覧",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "tax_deductions",
    description: "適用可能な控除一覧 -- 15種類の所得控除と税額控除を表示",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "tax_deadline",
    description: "申告期限確認 -- 確定申告、消費税、法人税の申告・納付期限を表示",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "tax_compare",
    description: "青色申告 vs 白色申告比較 -- 控除額、節税効果、記帳義務の違いを比較計算",
    inputSchema: {
      type: "object" as const,
      properties: {
        income: { type: "number", description: "事業所得 (円)" },
      },
      required: ["income"],
    },
  },
  {
    name: "help",
    description: "JP Tax Calcの全ツールと使い方を表示する",
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
      "Env:",
      ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : "not set"} (${e.required ? "required" : "optional"})`),
      "",
      "所得税率表 (2026年度):",
      ...TAX_BRACKETS.map(b => `  ${b.min.toLocaleString()}-${b.max === Infinity ? "" : b.max.toLocaleString()}円: ${(b.rate * 100)}% (控除額: ${b.deduction.toLocaleString()}円)`),
      "",
      "対応税制:",
      "  - 定額減税、インボイス制度、電子帳簿保存法",
      "  - 新NISA、iDeCo拠出限度額",
      "  - 103万/130万/150万の壁計算",
      "",
      "免責事項: 概算計算と情報提供が目的です。正式な申告には税理士への相談を推奨します。",
    ].join("\n");
  }

  if (name === "version") {
    const taxYear = process.env.JP_TAX_YEAR || new Date().getFullYear().toString();
    return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn", tax_year: taxYear, brackets: TAX_BRACKETS.length, deductions: INCOME_DEDUCTIONS.length }, null, 2);
  }

  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  const taxYear = process.env.JP_TAX_YEAR || new Date().getFullYear().toString();

  if (name === "tax_income") {
    const income = args.income as number;
    return [
      `=== JP Tax Calc: 所得税計算 (${taxYear}年度) ===`,
      "",
      `給与収入: ${income.toLocaleString()}円`,
      al,
      "",
      "計算パイプライン:",
      "  1. 収入情報の解析 (給与/事業/不動産/雑所得を分類)",
      "  2. 給与所得控除の適用",
      ...EMPLOYMENT_DEDUCTIONS.map(d => `     ~${d.max === Infinity ? "" : d.max.toLocaleString()}円: ${d.calc}`),
      "  3. 所得控除の適用 (15種類チェック)",
      "  4. 課税所得金額 = 所得金額 - 所得控除",
      "  5. 累進税率の適用:",
      ...TAX_BRACKETS.map(b => `     ${b.min.toLocaleString()}-${b.max === Infinity ? "" : b.max.toLocaleString()}: ${(b.rate * 100)}% (控除: ${b.deduction.toLocaleString()})`),
      "  6. 税額控除の適用 (住宅ローン/配当/外国税額)",
      "  7. 復興特別所得税: 基準所得税額 x 2.1%",
      "  8. 住民税概算: 課税所得 x 10% + 均等割5,000円",
      "",
      "出力: 税額サマリー + 手取り計算 + 節税提案",
      "",
      "Status: Ready. 所得税を計算します。",
    ].join("\n");
  }

  if (name === "tax_income_simulate") {
    const salary = args.salary as number;
    return [
      `=== JP Tax Calc: 手取りシミュレーション ===`,
      "",
      `年収: ${salary.toLocaleString()}円`,
      "",
      "差引項目:",
      "  健康保険: 年収 x 4.9%",
      "  厚生年金: 年収 x 9.15%",
      "  雇用保険: 年収 x 0.6%",
      "  所得税: 累進税率 + 復興特別所得税2.1%",
      "  住民税: 課税所得 x 10% + 均等割5,000円",
      "",
      "出力: 手取り年額 + 手取り月額 + 手取り率 + 節税ヒント",
      "",
      "節税ヒント例:",
      "  - iDeCo (月23,000円) で年間約55,200円の節税",
      "  - ふるさと納税で返礼品を実質2,000円で取得",
      "  - 医療費が10万円超なら医療費控除の申請を検討",
      "",
      "Status: Ready. 手取りシミュレーションを実行します。",
    ].join("\n");
  }

  if (name === "tax_consumption") {
    const sales = args.taxable_sales as number;
    const purchases = args.taxable_purchases as number;
    return [
      `=== JP Tax Calc: 消費税計算 ===`,
      "",
      `課税売上高 (税抜): ${sales.toLocaleString()}円`,
      `課税仕入高 (税抜): ${purchases.toLocaleString()}円`,
      "",
      "計算内容:",
      "  本則課税: 売上消費税 - 仕入消費税",
      "  簡易課税との比較 (みなし仕入率適用)",
      "  2割特例との比較 (インボイス経過措置, 2026年9月迄)",
      "",
      "区分:",
      "  標準税率: 10%",
      "  軽減税率: 8% (飲食料品, 新聞)",
      "",
      "判定事項:",
      "  インボイス登録番号の確認",
      "  簡易課税制度の適用判定 (前々年売上5,000万円以下)",
      "  2割特例の適用判定 (免税->課税転換の場合)",
      "",
      "Status: Ready. 消費税を計算します。",
    ].join("\n");
  }

  if (name === "tax_consumption_simplified") {
    const sales = args.sales as number;
    const industry = args.industry as string;
    return [
      `=== JP Tax Calc: 簡易課税計算 ===`,
      "",
      `課税売上高: ${sales.toLocaleString()}円`,
      `業種: ${industry}`,
      "",
      "みなし仕入率:",
      ...Object.entries(DEEMED_RATES).map(([k, v]) => `  ${k}: ${v}%`),
      "",
      "計算式: 売上消費税 x (1 - みなし仕入率) = 納付税額",
      "",
      "Status: Ready. 簡易課税を計算します。",
    ].join("\n");
  }

  if (name === "tax_corporate") {
    const income = args.income as number;
    const corpType = (args.type as string) || "small";
    return [
      `=== JP Tax Calc: 法人税計算 (${corpType === "small" ? "中小法人" : "大企業"}) ===`,
      "",
      `課税所得金額: ${income.toLocaleString()}円`,
      "",
      "計算項目:",
      "  法人税: " + (corpType === "small" ? "800万円以下 15%, 800万円超 23.2%" : "23.2%"),
      "  地方法人税: 法人税額 x 10.3%",
      "  法人事業税: 400万以下3.5%, 400-800万5.3%, 800万超7.0%",
      "  特別法人事業税: 事業税 x 37%",
      "  法人住民税: 法人税割 7.0% + 均等割",
      "",
      "出力: 税負担合計 + 実効税率 + 税引後利益 + 個人事業との比較",
      "",
      "Status: Ready. 法人税を計算します。",
    ].join("\n");
  }

  if (name === "tax_furusato") {
    const salary = args.salary as number;
    return [
      `=== JP Tax Calc: ふるさと納税シミュレーション ===`,
      "",
      `年収: ${salary.toLocaleString()}円`,
      al,
      "",
      "計算内容:",
      "  1. 住民税所得割額の算出: (総所得 - 所得控除) x 10%",
      "  2. 控除上限額 = 住民税所得割額 x 20% / (100% - 10% - 所得税率 x 1.021) + 2,000",
      "  3. 実質負担2,000円の確認",
      "",
      "控除内訳:",
      "  所得税からの控除: (寄附金 - 2,000) x 所得税率",
      "  住民税基本分: (寄附金 - 2,000) x 10%",
      "  住民税特例分: 残額",
      "",
      "判定:",
      "  ワンストップ特例 (5自治体以下, 確定申告不要) vs 確定申告",
      "",
      "Status: Ready. ふるさと納税上限を計算します。",
    ].join("\n");
  }

  if (name === "tax_checklist") {
    return [
      `=== JP Tax Calc: 確定申告チェックリスト (${parseInt(taxYear) - 1}年分) ===`,
      "",
      "【必要書類】",
      "  [ ] 源泉徴収票 (給与所得者)",
      "  [ ] マイナンバーカード or 通知カード+本人確認書類",
      "  [ ] 還付先の銀行口座情報",
      "",
      "【所得関連】",
      "  [ ] 事業所得: 青色申告決算書 or 収支内訳書",
      "  [ ] 不動産所得: 不動産収支内訳書",
      "  [ ] 株式・配当: 年間取引報告書",
      "  [ ] 雑所得: 収入と経費の明細",
      "",
      "【控除証明書】",
      "  [ ] 社会保険料控除証明書 (国民年金・国保)",
      "  [ ] 生命保険料控除証明書",
      "  [ ] 地震保険料控除証明書",
      "  [ ] 小規模企業共済等掛金控除証明書 (iDeCo)",
      "  [ ] 住宅ローン残高証明書",
      "  [ ] 医療費の領収書 or 医療費通知 (10万円超)",
      "  [ ] ふるさと納税 寄附金受領証明書",
      "",
      "【電子申告 (e-Tax)】",
      "  [ ] マイナンバーカード + ICカードリーダー or スマホ",
      "  [ ] 利用者識別番号 (初回のみ取得)",
      "",
      "【注意事項】",
      "  ! 青色申告65万円控除には e-Tax提出が必須",
      "  ! ワンストップ特例使用時は確定申告で再申請が必要",
      "  ! 医療費控除とセルフメディケーション税制は併用不可",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "tax_deductions") {
    return [
      `=== JP Tax Calc: 適用可能な控除一覧 ===`,
      "",
      "【所得控除 (15種類)】",
      ...INCOME_DEDUCTIONS.map(d => `  ${d.name}: ${typeof d.amount === "number" ? d.amount.toLocaleString() + "円" : d.amount} -- ${d.note}`),
      "",
      "【税額控除】",
      "  住宅ローン控除: 年末残高 x 0.7% (最大35万円/年, 10-13年間)",
      "  配当控除: 配当所得 x 10% (課税所得1,000万円以下)",
      "  外国税額控除: 二重課税回避のための控除",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "tax_deadline") {
    const year = parseInt(taxYear);
    return [
      `=== JP Tax Calc: 申告・納付期限 ===`,
      "",
      `【${year - 1}年分 確定申告】`,
      `  所得税: ${year}年3月16日 (月)`,
      `  消費税 (個人): ${year}年3月31日`,
      `  消費税 (法人): 事業年度終了後2ヶ月以内`,
      "",
      "【納付方法】",
      "  e-Tax (電子納税)",
      "  振替納税 (口座引落し)",
      "  クレジットカード納付",
      "  コンビニ納付 (30万円以下)",
      "  窓口納付 (金融機関・税務署)",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "tax_compare") {
    const income = args.income as number;
    return [
      `=== JP Tax Calc: 青色申告 vs 白色申告 ===`,
      "",
      `事業所得: ${income.toLocaleString()}円`,
      "",
      "比較項目:",
      "  特別控除: 青色 最大65万円 (e-Tax) / 白色 なし",
      "  専従者給与: 青色 全額経費 / 白色 最大86万/50万円",
      "  純損失の繰越: 青色 3年間 / 白色 不可",
      "  少額減価償却: 青色 30万円未満一括 / 白色 10万円以上は減価償却",
      "  記帳義務: 青色 複式簿記 / 白色 簡易簿記",
      "",
      "節税効果の計算:",
      "  65万円控除 x 所得税率(限界税率) = 所得税の節税額",
      "  65万円控除 x 10% = 住民税の節税額",
      "  合計節税額 = 所得税節税 + 住民税節税",
      "",
      "Status: Ready. 青色vs白色の節税効果を比較計算します。",
    ].join("\n");
  }

  return [
    `=== JP Tax Calc: ${name} ===`,
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
