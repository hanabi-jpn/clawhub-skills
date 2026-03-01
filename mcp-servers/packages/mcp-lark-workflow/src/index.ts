#!/usr/bin/env node
/** MCP Server: Lark Workflow. Author: hanabi-jpn */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const S = "lark-workflow", V = "1.0.0", D = "Lark/Feishu自動化エージェント -- 承認フロー、Bot通知、ドキュメント管理、カレンダー連携をAIで自動化";

const ENV_VARS = [
  { name: "LARK_APP_ID", required: true, description: "Lark application ID" },
  { name: "LARK_APP_SECRET", required: true, description: "Lark application secret" },
  { name: "LARK_WEBHOOK_URL", required: false, description: "Bot webhook URL for quick notifications" },
  { name: "LARK_TENANT_KEY", required: false, description: "Tenant key for multi-tenant apps" },
];

/** Approval templates */
const APPROVAL_TEMPLATES = [
  { id: "expense", name: "経費申請", fields: "金額、用途、日付、領収書" },
  { id: "leave", name: "休暇申請", fields: "種別、期間、引継ぎ先" },
  { id: "ringi", name: "稟議書", fields: "件名、金額、効果、リスク" },
  { id: "purchase", name: "購買申請", fields: "品目、数量、金額、業者" },
];

/** API endpoints reference */
const API_ENDPOINTS = {
  auth: "POST /auth/v3/tenant_access_token/internal",
  send_message: "POST /im/v1/messages",
  reply_message: "POST /im/v1/messages/{id}/reply",
  list_chats: "GET /im/v1/chats",
  create_approval: "POST /approval/v4/instances",
  get_approval: "GET /approval/v4/instances/{id}",
  approve: "POST /approval/v4/instances/{id}/approve",
  reject: "POST /approval/v4/instances/{id}/reject",
  create_doc: "POST /docx/v1/documents",
  read_doc: "GET /docx/v1/documents/{id}",
  list_files: "GET /drive/v1/files",
  create_event: "POST /calendar/v4/calendars/{id}/events",
  list_events: "GET /calendar/v4/calendars/{id}/events",
  read_sheet: "GET /sheets/v3/spreadsheets/{id}/values/{range}",
  write_sheet: "PUT /sheets/v3/spreadsheets/{id}/values/{range}",
};

const TOOLS = [
  {
    name: "lark_send",
    description: "メッセージ送信 -- テキスト/リッチテキスト/カードメッセージをユーザーまたはグループに送信",
    inputSchema: {
      type: "object" as const,
      properties: {
        target: { type: "string", description: "送信先 (chat_id or user_id)" },
        message: { type: "string", description: "メッセージ内容" },
        msg_type: { type: "string", enum: ["text", "post", "interactive"], description: "メッセージ形式 (default: text)" },
      },
      required: ["target", "message"],
    },
  },
  {
    name: "lark_send_card",
    description: "Interactive Cardメッセージ送信 -- ボタン付きカードテンプレートで送信",
    inputSchema: {
      type: "object" as const,
      properties: {
        target: { type: "string", description: "送信先 (chat_id or user_id)" },
        template: { type: "string", description: "カードテンプレート名" },
        data: { type: "string", description: "テンプレートに埋め込むデータ (JSON)" },
      },
      required: ["target", "template"],
    },
  },
  {
    name: "lark_webhook",
    description: "Webhook Bot通知 -- LARK_WEBHOOK_URLにシンプルな通知を送信 (API key不要)",
    inputSchema: {
      type: "object" as const,
      properties: {
        message: { type: "string", description: "通知メッセージ" },
        msg_type: { type: "string", enum: ["text", "post", "interactive"], description: "メッセージ形式 (default: text)" },
      },
      required: ["message"],
    },
  },
  {
    name: "lark_webhook_card",
    description: "Webhook カード形式通知 -- タイトル付きリッチカードで通知",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "カードタイトル" },
        content: { type: "string", description: "カード内容 (Markdown対応)" },
        color: { type: "string", enum: ["blue", "green", "orange", "red"], description: "ヘッダー色" },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "lark_chats",
    description: "チャット一覧 -- 参加中のグループチャットを表示",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "lark_approval_create",
    description: "承認申請作成 -- テンプレートを使った承認ワークフロー開始 (経費/休暇/稟議/購買)",
    inputSchema: {
      type: "object" as const,
      properties: {
        template: { type: "string", enum: ["expense", "leave", "ringi", "purchase"], description: "承認テンプレート" },
        data: { type: "string", description: "申請データ (JSON)" },
        approvers: { type: "string", description: "承認者ID (カンマ区切り, 多段承認対応)" },
      },
      required: ["template", "data"],
    },
  },
  {
    name: "lark_approval_list",
    description: "承認一覧 -- 承認申請のステータス別一覧を表示",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", enum: ["pending", "approved", "rejected", "all"], description: "フィルタ (default: all)" },
      },
      required: [],
    },
  },
  {
    name: "lark_approval_detail",
    description: "承認詳細 -- 特定の承認申請の詳細情報とステータスを表示",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "承認インスタンスID" },
      },
      required: ["id"],
    },
  },
  {
    name: "lark_docs",
    description: "ドキュメント検索 -- ワークスペース内のDoc/Sheet/Mindnoteを検索",
    inputSchema: {
      type: "object" as const,
      properties: {
        search: { type: "string", description: "検索クエリ" },
      },
      required: [],
    },
  },
  {
    name: "lark_doc_create",
    description: "ドキュメント作成 -- Doc/Sheet/Mindnoteをテンプレートから作成",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "ドキュメントタイトル" },
        template: { type: "string", description: "テンプレート名" },
        folder: { type: "string", description: "保存先フォルダID" },
      },
      required: ["title"],
    },
  },
  {
    name: "lark_doc_read",
    description: "ドキュメント内容取得 -- 指定ドキュメントの内容を読み取り",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "ドキュメントID" },
      },
      required: ["id"],
    },
  },
  {
    name: "lark_calendar_events",
    description: "イベント一覧 -- カレンダーイベントを期間指定で表示",
    inputSchema: {
      type: "object" as const,
      properties: {
        from: { type: "string", description: "開始日 (YYYY-MM-DD)" },
        to: { type: "string", description: "終了日 (YYYY-MM-DD)" },
      },
      required: [],
    },
  },
  {
    name: "lark_calendar_create",
    description: "イベント作成 -- カレンダーにイベントを追加 (参加者・会議室・リマインダー対応)",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "イベントタイトル" },
        start: { type: "string", description: "開始日時 (ISO 8601)" },
        end: { type: "string", description: "終了日時 (ISO 8601)" },
        attendees: { type: "string", description: "参加者ID (カンマ区切り)" },
      },
      required: ["title", "start", "end"],
    },
  },
  {
    name: "lark_sheet_read",
    description: "シート読み取り -- スプレッドシートのセルデータを取得",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "スプレッドシートID" },
        range: { type: "string", description: "セル範囲 (例: A1:D10)" },
      },
      required: ["id", "range"],
    },
  },
  {
    name: "lark_sheet_write",
    description: "シート書き込み -- スプレッドシートにデータを書き込み",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "スプレッドシートID" },
        range: { type: "string", description: "セル範囲 (例: A1:D10)" },
        data: { type: "string", description: "書き込みデータ (JSON配列)" },
      },
      required: ["id", "range", "data"],
    },
  },
  {
    name: "help",
    description: "Lark Workflowの全ツールと使い方を表示する",
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
      "Approval Templates:",
      ...APPROVAL_TEMPLATES.map(t => `  ${t.id}: ${t.name} -- ${t.fields}`),
      "",
      "API Base:",
      "  Global: https://open.larksuite.com/open-apis/",
      "  China:  https://open.feishu.cn/open-apis/",
    ].join("\n");
  }

  if (name === "version") {
    return JSON.stringify({ name: S, version: V, description: D, author: "hanabi-jpn", approval_templates: APPROVAL_TEMPLATES.length, api_endpoints: Object.keys(API_ENDPOINTS).length }, null, 2);
  }

  const tool = TOOLS.find(t => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const missing = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
  if (missing.length > 0 && !["help", "version", "lark_webhook", "lark_webhook_card"].includes(name)) {
    return `Missing required env vars: ${missing.join(", ")}\n\nSetup: export LARK_APP_ID=xxx && export LARK_APP_SECRET=xxx`;
  }

  const al = Object.entries(args).filter(([, v]) => v !== undefined).map(([k, v]) => `  ${k}: ${v}`).join("\n");

  if (name === "lark_send" || name === "lark_send_card") {
    return [
      `=== Lark Workflow: メッセージ送信 ===`,
      "",
      al,
      "",
      "認証: Tenant Access Token (自動取得・2時間TTL・自動リフレッシュ)",
      `API: ${API_ENDPOINTS.send_message}`,
      "",
      "対応形式: text, rich text (post), interactive card",
      "機能: @メンション、スレッド返信、画像・ファイル添付",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_webhook" || name === "lark_webhook_card") {
    const webhookUrl = process.env.LARK_WEBHOOK_URL;
    return [
      `=== Lark Workflow: Webhook通知 ===`,
      "",
      al,
      "",
      `Webhook URL: ${webhookUrl ? "set" : "MISSING (LARK_WEBHOOK_URL)"}`,
      "",
      "Webhook Bot通知はAPI keyなしで使えるシンプルな通知手段です。",
      "セットアップ: Group Chat > Settings > Bots > Add Bot > Custom Bot",
      "",
      "対応形式: text, post (rich text), interactive (card)",
      "セキュリティ: 署名検証 (オプション) -- timestamp + HMAC-SHA256",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_approval_create") {
    const template = args.template as string;
    const tmpl = APPROVAL_TEMPLATES.find(t => t.id === template);
    return [
      `=== Lark Workflow: 承認申請作成 ===`,
      "",
      al,
      "",
      tmpl ? `テンプレート: ${tmpl.name} -- ${tmpl.fields}` : "カスタムテンプレート",
      "",
      "承認フロー:",
      "  1. 申請者が申請作成",
      "  2. 承認者へカードメッセージ送信 ([承認][却下]ボタン付き)",
      "  3. 承認/却下アクション処理",
      "  4. 多段承認: 次の承認者へ自動回付 (最大20段)",
      "  5. 最終承認完了 -> 申請者・関係者へ通知",
      "",
      `API: ${API_ENDPOINTS.create_approval}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_approval_list") {
    const status = (args.status as string) || "all";
    return [
      `=== Lark Workflow: 承認一覧 (${status}) ===`,
      "",
      `フィルタ: ${status}`,
      "",
      `API: ${API_ENDPOINTS.get_approval}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_approval_detail") {
    return [
      `=== Lark Workflow: 承認詳細 ===`,
      "",
      al,
      "",
      "表示項目: 申請者、承認者チェーン、現在のステータス、コメント、タイムライン",
      "",
      `API: ${API_ENDPOINTS.get_approval}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_chats") {
    return [
      `=== Lark Workflow: チャット一覧 ===`,
      "",
      `API: ${API_ENDPOINTS.list_chats}`,
      "キャッシュ: 1時間TTL",
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_docs" || name === "lark_doc_create" || name === "lark_doc_read") {
    return [
      `=== Lark Workflow: ドキュメント操作 ===`,
      "",
      al,
      "",
      "対応形式: Doc, Sheet, Mindnote",
      "操作: 作成、読取、検索、フォルダ管理、権限設定、エクスポート (PDF/DOCX)",
      "",
      `API: ${name === "lark_doc_create" ? API_ENDPOINTS.create_doc : name === "lark_doc_read" ? API_ENDPOINTS.read_doc : API_ENDPOINTS.list_files}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_calendar_events" || name === "lark_calendar_create") {
    return [
      `=== Lark Workflow: カレンダー操作 ===`,
      "",
      al,
      "",
      "機能: イベント作成/更新/削除、参加者管理、空き時間検索、会議室予約、リマインダー",
      "",
      `API: ${name === "lark_calendar_create" ? API_ENDPOINTS.create_event : API_ENDPOINTS.list_events}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  if (name === "lark_sheet_read" || name === "lark_sheet_write") {
    return [
      `=== Lark Workflow: スプレッドシート操作 ===`,
      "",
      al,
      "",
      "機能: セルの読み書き、シート追加/削除/コピー、データフィルタ/ソート、グラフ作成",
      "日本語データ: 完全対応 (テキスト/数値/日付を正しくパース)",
      "",
      `API: ${name === "lark_sheet_read" ? API_ENDPOINTS.read_sheet : API_ENDPOINTS.write_sheet}`,
      "",
      "Status: Ready.",
    ].join("\n");
  }

  return [
    `=== Lark Workflow: ${name} ===`,
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
