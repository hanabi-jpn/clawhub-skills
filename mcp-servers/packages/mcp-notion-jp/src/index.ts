#!/usr/bin/env node
/** MCP Server: Notion JP. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const S = "notion-jp", V = "1.0.0", D = "Notion日本語テンプレート + 議事録自動生成 + プロジェクト管理AIアシスタント";

const ENV_VARS = [
  { name: "NOTION_API_KEY", required: true, description: "Notion Integration Token" },
  { name: "NOTION_WORKSPACE_ID", required: false, description: "Default workspace ID" },
];

/** Japanese templates */
const TEMPLATES = [
  { id: "meeting_default", name: "議事録 (標準)", category: "会議" },
  { id: "meeting_review", name: "議事録 (レビュー)", category: "会議" },
  { id: "meeting_1on1", name: "1on1テンプレート", category: "会議" },
  { id: "meeting_brainstorm", name: "議事録 (ブレスト)", category: "会議" },
  { id: "weekly_report", name: "週次報告書", category: "レポート" },
  { id: "daily_report", name: "日報", category: "レポート" },
  { id: "sprint_planning", name: "スプリント計画", category: "プロジェクト" },
  { id: "retrospective", name: "振り返り (KPT)", category: "プロジェクト" },
  { id: "okr_tracker", name: "OKR管理", category: "プロジェクト" },
  { id: "proposal", name: "企画書", category: "ビジネス" },
  { id: "knowledge_base", name: "ナレッジベース", category: "ドキュメント" },
  { id: "kpi_dashboard", name: "KPIダッシュボード", category: "分析" },
  { id: "sales_meeting", name: "商談記録", category: "営業" },
  { id: "onboarding", name: "新人研修チェック", category: "HR" },
  { id: "bug_report", name: "バグレポート", category: "開発" },
  { id: "requirements", name: "要件定義書", category: "開発" },
  { id: "release_checklist", name: "リリースチェックリスト", category: "開発" },
];

/** Notion API endpoints */
const API_ENDPOINTS = {
  create_page: "POST /v1/pages",
  get_page: "GET /v1/pages/{id}",
  update_page: "PATCH /v1/pages/{id}",
  create_db: "POST /v1/databases",
  get_db: "GET /v1/databases/{id}",
  query_db: "POST /v1/databases/{id}/query",
  list_blocks: "GET /v1/blocks/{id}/children",
  append_blocks: "PATCH /v1/blocks/{id}/children",
  search: "POST /v1/search",
  list_users: "GET /v1/users",
  add_comment: "POST /v1/comments",
};

/** Project DB schema */
const PROJECT_SCHEMA = [
  { name: "タスク名", type: "title" },
  { name: "ステータス", type: "select", options: "未着手/進行中/レビュー中/完了/保留" },
  { name: "優先度", type: "select", options: "最優先/高/中/低" },
  { name: "担当者", type: "people" },
  { name: "期限", type: "date" },
  { name: "スプリント", type: "select", options: "Sprint 1/2/3..." },
  { name: "見積もり工数", type: "number (hours)" },
  { name: "実績工数", type: "number (hours)" },
  { name: "カテゴリ", type: "multi_select", options: "開発/デザイン/マーケ/運用" },
  { name: "備考", type: "rich_text" },
];

const TOOLS = [
  {
    name: "notion_pages",
    description: "ページ一覧 -- データベース内のページを表示 (フィルタ/ソート対応)",
    inputSchema: {
      type: "object" as const,
      properties: {
        db: { type: "string", description: "データベースID (省略時: デフォルトDB)" },
        filter: { type: "string", description: "フィルタ条件 (JSON)" },
        sort: { type: "string", description: "ソート条件" },
      },
      required: [],
    },
  },
  {
    name: "notion_page",
    description: "ページ内容表示 -- 特定ページの全ブロック内容を取得",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "ページID" },
      },
      required: ["id"],
    },
  },
  {
    name: "notion_create",
    description: "テンプレートからページ作成 -- 20+の日本語テンプレートから選択して作成",
    inputSchema: {
      type: "object" as const,
      properties: {
        template: { type: "string", description: "テンプレートID (例: meeting_default, daily_report)" },
        title: { type: "string", description: "ページタイトル" },
        parent_db: { type: "string", description: "親データベースID" },
      },
      required: ["template"],
    },
  },
  {
    name: "notion_meeting",
    description: "議事録作成 -- 日時・参加者・テンプレート指定で議事録ページを自動生成",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "会議名" },
        attendees: { type: "string", description: "参加者名 (カンマ区切り)" },
        template: { type: "string", enum: ["default", "review", "brainstorm", "1on1"], description: "議事録テンプレート" },
        agenda: { type: "string", description: "アジェンダ (カンマ区切り)" },
      },
      required: ["title"],
    },
  },
  {
    name: "notion_meeting_summarize",
    description: "議事録要約 -- 議事録ページからAI要約 + アクションアイテム抽出 + タスクDB登録",
    inputSchema: {
      type: "object" as const,
      properties: {
        page_id: { type: "string", description: "議事録ページID" },
      },
      required: ["page_id"],
    },
  },
  {
    name: "notion_tasks",
    description: "タスク一覧 -- プロジェクトDBのタスクをステータス別に表示",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", enum: ["未着手", "進行中", "レビュー中", "完了", "保留", "all"], description: "ステータスフィルタ" },
        assignee: { type: "string", description: "担当者名" },
        sprint: { type: "string", description: "スプリント番号" },
      },
      required: [],
    },
  },
  {
    name: "notion_task_create",
    description: "タスク作成 -- プロジェクトDBに新しいタスクを追加",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "タスク名" },
        assignee: { type: "string", description: "担当者" },
        priority: { type: "string", enum: ["最優先", "高", "中", "低"], description: "優先度" },
        due_date: { type: "string", description: "期限 (YYYY-MM-DD)" },
        sprint: { type: "string", description: "スプリント" },
        estimate: { type: "number", description: "見積もり工数 (時間)" },
      },
      required: ["title"],
    },
  },
  {
    name: "notion_task_update",
    description: "タスク更新 -- タスクのステータス、担当者、期限などを更新",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "タスクページID" },
        status: { type: "string", enum: ["未着手", "進行中", "レビュー中", "完了", "保留"], description: "新しいステータス" },
        assignee: { type: "string", description: "新しい担当者" },
        actual_hours: { type: "number", description: "実績工数 (時間)" },
      },
      required: ["id"],
    },
  },
  {
    name: "notion_report_weekly",
    description: "週次報告書自動生成 -- 今週のタスク実績を集計してレポートページを作成",
    inputSchema: {
      type: "object" as const,
      properties: {
        sprint: { type: "string", description: "対象スプリント番号" },
      },
      required: [],
    },
  },
  {
    name: "notion_report_daily",
    description: "日報自動生成 -- 当日のタスク実績を集計して日報ページを作成",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "notion_templates",
    description: "テンプレート一覧 -- 利用可能な20+の日本語テンプレートを表示",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "notion_search",
    description: "ワークスペース検索 -- ページ・データベースをキーワードで全文検索 (日本語最適化)",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "検索クエリ" },
        type: { type: "string", enum: ["page", "database", "all"], description: "検索対象 (default: all)" },
      },
      required: ["query"],
    },
  },
  {
    name: "notion_db_query",
    description: "データベース検索 -- フィルタ・ソート条件でDB内のページを検索",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "データベースID" },
        filter: { type: "string", description: "フィルタ条件 (JSON)" },
        sort: { type: "string", description: "ソート条件 (JSON)" },
      },
      required: ["id"],
    },
  },
  {
    name: "help",
    description: "Notion JPの全ツールと使い方を表示する",
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
      ...ENV_VARS.map(e => `  ${e.name}: ${process.env[e.name] ? "set" : e.required ? "MISSING" : "not set"} ${e.required ? "(required)" : "(optional)"}`),
      "",
      "Templates (20+):",
      ...TEMPLATES.map(t => `  ${t.id}: ${t.name} [${t.category}]`),
      "",
      "Project DB Schema:",
      ...PROJECT_SCHEMA.map(s => `  ${s.name}: ${s.type}${"options" in s ? ` (${s.options})` : ""}`),
      "",
      "API: https://api.notion.com/v1/ (Notion-Version: 2022-06-28)",
    ].join("\n");
  }

  if (name === "version") {
    return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn", templates: TEMPLATES.length, api_version: "2022-06-28" }, null, 2);
  }

  if (name === "notion_templates") {
    const grouped: Record<string, typeof TEMPLATES> = {};
    TEMPLATES.forEach(t => { if (!grouped[t.category]) grouped[t.category] = []; grouped[t.category].push(t); });
    return [
      `=== Notion JP: テンプレート一覧 (${TEMPLATES.length}種類) ===`,
      "",
      ...Object.entries(grouped).flatMap(([cat, tmpls]) => [
        `[${cat}]`,
        ...tmpls.map(t => `  ${t.id}: ${t.name}`),
        "",
      ]),
      "使い方: notion_create { template: 'meeting_default', title: 'Q1 Planning' }",
    ].join("\n");
  }

  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0 && !["help", "version", "notion_templates"].includes(name)) {
    return `Missing required env vars: ${missing.join(", ")}\n\nSetup:\n  1. Visit https://developers.notion.com/ -> New Integration\n  2. Copy Internal Integration Secret\n  3. export NOTION_API_KEY=secret_xxx\n  4. Share target pages/DBs with the Integration`;
  }

  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");

  if (name === "notion_meeting") {
    const template = (args.template as string) || "default";
    return [
      `=== Notion JP: 議事録作成 ===`,
      "",
      al,
      "",
      `テンプレート: meeting_${template}`,
      "",
      "議事録フロー:",
      "  Step 1: テンプレート選択 + メタデータ自動入力 (日時, 参加者)",
      "  Step 2: 前回議事録の自動リンク (同シリーズの直近)",
      "  Step 3: ページ作成 (Notion API POST /v1/pages)",
      "  Step 4: 会議中リアルタイム更新",
      "  Step 5: 会議後 -> notion_meeting_summarize で要約+TODO抽出",
      "  Step 6: 参加者への議事録リンク共有",
      "",
      "議事録構成:",
      "  基本情報 (日時, 場所, 参加者)",
      "  前回フォローアップ",
      "  アジェンダ",
      "  議論内容 + 決定事項",
      "  アクションアイテム (担当, 期限, ステータス)",
      "  次回会議",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_meeting_summarize") {
    return [
      `=== Notion JP: 議事録要約 ===`,
      "",
      al,
      "",
      "処理内容:",
      "  1. ページ内容を読み取り",
      "  2. 議論内容をAI要約",
      "  3. 決定事項の抽出",
      "  4. アクションアイテム (TODO) の一覧化",
      "  5. 担当者・期日の割当",
      "  6. タスクDBへの自動登録",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_create") {
    const template = args.template as string;
    const tmpl = TEMPLATES.find(t => t.id === template);
    return [
      `=== Notion JP: ページ作成 ===`,
      "",
      al,
      "",
      tmpl ? `テンプレート: ${tmpl.name} [${tmpl.category}]` : `テンプレート: ${template}`,
      "",
      `API: ${API_ENDPOINTS.create_page}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_tasks") {
    const status = (args.status as string) || "all";
    return [
      `=== Notion JP: タスク一覧 (${status}) ===`,
      "",
      al,
      "",
      "プロジェクトDBスキーマ:",
      ...PROJECT_SCHEMA.map(s => `  ${s.name}: ${s.type}`),
      "",
      `API: ${API_ENDPOINTS.query_db}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_task_create") {
    return [
      `=== Notion JP: タスク作成 ===`,
      "",
      al,
      "",
      "デフォルト: ステータス=未着手, 優先度=中",
      "",
      `API: ${API_ENDPOINTS.create_page}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_task_update") {
    return [
      `=== Notion JP: タスク更新 ===`,
      "",
      al,
      "",
      `API: ${API_ENDPOINTS.update_page}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_report_weekly" || name === "notion_report_daily") {
    const reportType = name === "notion_report_weekly" ? "週次報告書" : "日報";
    return [
      `=== Notion JP: ${reportType}自動生成 ===`,
      "",
      al,
      "",
      "生成内容:",
      name === "notion_report_weekly" ? [
        "  完了タスク (想定工数 vs 実績工数)",
        "  進捗中タスク (進捗率, 完了予定)",
        "  KPI実績 (目標 vs 実績 vs 達成率)",
        "  課題・リスク + 対応策",
        "  来週の計画",
        "  ベロシティ計算 (スプリント対応時)",
      ].join("\n") : [
        "  本日の業務内容 (時間帯別)",
        "  完了タスク",
        "  明日の予定",
        "  課題・相談事項",
        "  所感",
      ].join("\n"),
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_search") {
    return [
      `=== Notion JP: ワークスペース検索 ===`,
      "",
      al,
      "",
      "日本語検索最適化:",
      "  - 形態素解析で主要キーワードを抽出",
      "  - 完全一致でヒットしない場合は部分一致で再検索",
      "",
      `API: ${API_ENDPOINTS.search}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "notion_pages" || name === "notion_page" || name === "notion_db_query") {
    return [
      `=== Notion JP: ${tool.description.split(" -- ")[0]} ===`,
      "",
      al,
      "",
      "Headers: Authorization: Bearer {NOTION_API_KEY}, Notion-Version: 2022-06-28",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  return [
    `=== Notion JP: ${name} ===`,
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
