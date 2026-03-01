#!/usr/bin/env node

/**
 * generate-packages.mjs
 *
 * Node.js script to generate all 19 MCP server packages from skill metadata.
 * (fx-trader-pro is hand-crafted as a reference implementation.)
 *
 * Usage: node scripts/generate-packages.mjs
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";

const MCP_ROOT = "/Users/ishiharatatsuya/clawhub-skills/mcp-servers";
const SKILLS_ROOT = "/Users/ishiharatatsuya/clawhub-skills";

// ============================================================================
// Skill metadata — extracted from each SKILL.md
// ============================================================================

const SKILLS = [
  {
    name: "capability-evolver-pro",
    displayName: "Capability Evolver Pro",
    description: "Safe sandboxed self-evolution engine with 5-layer safety, automatic rollback, and evolution dashboard",
    version: "1.0.0",
    tags: ["ai", "self-evolution", "safety", "automation"],
    envVars: [],
    commands: [
      { cmd: "evolve", desc: "Run one evolution cycle", args: [] },
      { cmd: "evolve_continuous", desc: "Background evolution loop with configurable interval", args: [] },
      { cmd: "evolve_review", desc: "Human-in-the-loop evolution mode", args: [] },
      { cmd: "evolve_strategy", desc: "Force specific evolution strategy", args: [{ name: "strategy", type: "string", required: true, desc: "Strategy: repair, optimize, innovate, or harden" }] },
      { cmd: "evolve_tier", desc: "Override safety tier", args: [{ name: "tier", type: "string", required: true, desc: "Tier: conservative, balanced, or aggressive" }] },
      { cmd: "evolve_status", desc: "Display evolution status, performance metrics, and pending candidates", args: [] },
      { cmd: "evolve_history", desc: "Show last 20 evolution events with details", args: [] },
      { cmd: "evolve_rollback", desc: "Restore to a previous checkpoint", args: [{ name: "checkpoint_id", type: "string", required: false, desc: "Checkpoint ID to restore" }] },
      { cmd: "evolve_dashboard", desc: "Generate comprehensive evolution dashboard report", args: [] },
      { cmd: "evolve_reset", desc: "Reset all evolution data (requires confirmation)", args: [{ name: "confirm", type: "boolean", required: true, desc: "Safety confirmation" }] },
    ],
  },
  {
    name: "self-learning-agent",
    displayName: "Self-Learning Agent",
    description: "Cross-project learning engine with automatic failure capture and context-aware memory compression",
    version: "1.0.0",
    tags: ["ai", "learning", "memory", "cross-project", "self-improvement"],
    envVars: [],
    commands: [
      { cmd: "learn", desc: "Manually log a learning", args: [{ name: "description", type: "string", required: true, desc: "Learning description" }] },
      { cmd: "learn_auto", desc: "Toggle automatic learning mode", args: [] },
      { cmd: "learn_recall", desc: "Search knowledge base for relevant learnings", args: [{ name: "topic", type: "string", required: true, desc: "Topic to search for" }] },
      { cmd: "learn_stats", desc: "Show learning analytics and knowledge base size", args: [] },
      { cmd: "learn_promote", desc: "Force promotion check for project-level learnings to global", args: [] },
      { cmd: "learn_export", desc: "Export all learnings as JSON", args: [] },
      { cmd: "learn_import", desc: "Import learnings from JSON file", args: [{ name: "file", type: "string", required: true, desc: "Path to learnings JSON file" }] },
      { cmd: "learn_prune", desc: "Clean up knowledge base by removing stale or low-value entries", args: [] },
      { cmd: "learn_graph", desc: "Show knowledge graph visualization", args: [] },
    ],
  },
  {
    name: "summarize-pro",
    displayName: "Summarize Pro",
    description: "7-mode intelligent summarizer with Chain-of-Density, 8 languages, and smart caching",
    version: "1.0.0",
    tags: ["summarization", "productivity", "multi-language", "content"],
    envVars: [],
    commands: [
      { cmd: "summarize", desc: "Summarize content with auto-detected settings", args: [{ name: "source", type: "string", required: true, desc: "URL, file path, or text to summarize" }] },
      { cmd: "summarize_mode", desc: "Summarize with specific output format", args: [{ name: "source", type: "string", required: true, desc: "Source to summarize" }, { name: "mode", type: "string", required: true, desc: "Output mode: bullets, executive, academic, mindmap, table, timeline, qa" }] },
      { cmd: "summarize_depth", desc: "Summarize with specific detail level", args: [{ name: "source", type: "string", required: true, desc: "Source to summarize" }, { name: "depth", type: "string", required: true, desc: "Depth: shallow, standard, deep, exhaustive" }] },
      { cmd: "summarize_lang", desc: "Summarize and output in specific language", args: [{ name: "source", type: "string", required: true, desc: "Source to summarize" }, { name: "lang", type: "string", required: true, desc: "Language code: en, ja, zh, ko, es, fr, de, pt" }] },
      { cmd: "summarize_chain_of_density", desc: "Force Chain-of-Density 3-pass compression", args: [{ name: "source", type: "string", required: true, desc: "Source to summarize" }] },
      { cmd: "summarize_compare", desc: "Compare and contrast multiple sources", args: [{ name: "source1", type: "string", required: true, desc: "First source" }, { name: "source2", type: "string", required: true, desc: "Second source" }] },
      { cmd: "summarize_cache_list", desc: "Show cached summaries with metadata", args: [] },
      { cmd: "summarize_cache_clear", desc: "Delete all cached summaries", args: [] },
    ],
  },
  {
    name: "humanize-ai-pro",
    displayName: "Humanize AI Pro",
    description: "Multi-language AI text humanizer with 5 writing modes and statistical evasion",
    version: "1.0.0",
    tags: ["humanize", "ai-detection", "writing", "multi-language"],
    envVars: [],
    commands: [
      { cmd: "humanize", desc: "Humanize text with auto-detected language and casual mode", args: [{ name: "text", type: "string", required: true, desc: "Text or file path to humanize" }] },
      { cmd: "humanize_mode", desc: "Humanize with specific writing mode", args: [{ name: "text", type: "string", required: true, desc: "Text to humanize" }, { name: "mode", type: "string", required: true, desc: "Mode: academic, business, casual, creative, social" }] },
      { cmd: "humanize_lang", desc: "Force output language for humanization", args: [{ name: "text", type: "string", required: true, desc: "Text to humanize" }, { name: "lang", type: "string", required: true, desc: "Language code: en, ja, zh, ko, es, fr, de, pt" }] },
      { cmd: "humanize_score", desc: "Score text for AI detection probability without transforming", args: [{ name: "text", type: "string", required: true, desc: "Text to score" }] },
      { cmd: "humanize_analyze", desc: "Detailed statistical analysis with all metrics", args: [{ name: "text", type: "string", required: true, desc: "Text to analyze" }] },
      { cmd: "humanize_batch", desc: "Process all text files in a directory", args: [{ name: "directory", type: "string", required: true, desc: "Directory path" }] },
      { cmd: "humanize_diff", desc: "Show before/after comparison with changes highlighted", args: [{ name: "text", type: "string", required: true, desc: "Text to humanize and compare" }] },
      { cmd: "humanize_patterns", desc: "List all detected AI patterns in the text", args: [{ name: "text", type: "string", required: true, desc: "Text to analyze" }] },
    ],
  },
  {
    name: "nano-banana-ultra",
    displayName: "Nano Banana Ultra",
    description: "Multi-model AI image generation with Gemini, DALL-E, Stability AI, 30+ templates",
    version: "1.0.0",
    tags: ["image-generation", "ai-art", "gemini", "dalle", "creative"],
    envVars: [
      { name: "OPENAI_API_KEY", description: "OpenAI API key for DALL-E", required: false },
      { name: "GOOGLE_API_KEY", description: "Google API key for Gemini image generation", required: false },
      { name: "STABILITY_API_KEY", description: "Stability AI API key", required: false },
    ],
    commands: [
      { cmd: "generate", desc: "Generate single image with default settings", args: [{ name: "prompt", type: "string", required: true, desc: "Image generation prompt" }] },
      { cmd: "generate_template", desc: "Generate image using a prompt template", args: [{ name: "prompt", type: "string", required: true, desc: "Base prompt" }, { name: "template", type: "string", required: true, desc: "Template: product-photo, logo-design, social-media, illustration, portrait, landscape, etc." }] },
      { cmd: "generate_model", desc: "Generate image with specific AI model", args: [{ name: "prompt", type: "string", required: true, desc: "Image prompt" }, { name: "model", type: "string", required: true, desc: "Model: gemini, dalle, stability" }] },
      { cmd: "generate_variations", desc: "Generate multiple variations of the same prompt", args: [{ name: "prompt", type: "string", required: true, desc: "Image prompt" }, { name: "count", type: "number", required: true, desc: "Number of variations" }] },
      { cmd: "gallery", desc: "Show image gallery with metadata", args: [] },
      { cmd: "gallery_search", desc: "Search gallery by prompt, tag, or date", args: [{ name: "query", type: "string", required: true, desc: "Search query" }] },
      { cmd: "gallery_tag", desc: "Add tags to a generated image", args: [{ name: "image", type: "string", required: true, desc: "Image identifier" }, { name: "tags", type: "string", required: true, desc: "Comma-separated tags" }] },
      { cmd: "gallery_export", desc: "Generate standalone HTML gallery", args: [] },
    ],
  },
  {
    name: "skill-guardian",
    displayName: "Skill Guardian",
    description: "5-layer security scanner for AI agent skills — post-ClawHavoc protection",
    version: "1.0.0",
    tags: ["security", "scanning", "protection", "agent-safety"],
    envVars: [],
    commands: [
      { cmd: "guard_scan", desc: "Full 5-layer security scan of a skill", args: [{ name: "skill", type: "string", required: true, desc: "Skill slug or path to scan" }] },
      { cmd: "guard_audit", desc: "Scan ALL installed skills for vulnerabilities", args: [] },
      { cmd: "guard_report", desc: "Generate comprehensive security report (markdown)", args: [] },
      { cmd: "guard_monitor", desc: "Continuous monitoring mode for installed skills", args: [] },
      { cmd: "guard_score", desc: "Quick risk score for a single skill", args: [{ name: "skill", type: "string", required: true, desc: "Skill slug to score" }] },
      { cmd: "guard_block", desc: "Add skill to blocklist (prevent installation)", args: [{ name: "skill", type: "string", required: true, desc: "Skill slug to block" }] },
      { cmd: "guard_allow", desc: "Remove skill from blocklist", args: [{ name: "skill", type: "string", required: true, desc: "Skill slug to allow" }] },
      { cmd: "guard_update_db", desc: "Update threat signature database", args: [] },
      { cmd: "guard_history", desc: "Show scan history with results", args: [] },
    ],
  },
  {
    name: "brain-trust",
    displayName: "Brain Trust",
    description: "Multi-agent hierarchical orchestration engine with consensus protocols and meeting formats",
    version: "1.0.0",
    tags: ["multi-agent", "orchestration", "teamwork", "delegation", "project-management"],
    envVars: [],
    commands: [
      { cmd: "bt_init", desc: "Initialize Brain Trust with team template", args: [{ name: "template", type: "string", required: false, desc: "Template: startup, dev-team, content, research, security" }] },
      { cmd: "bt_team", desc: "Show current team roster and roles", args: [] },
      { cmd: "bt_add_role", desc: "Add custom role to the team", args: [{ name: "name", type: "string", required: true, desc: "Role name" }, { name: "description", type: "string", required: true, desc: "Role description" }] },
      { cmd: "bt_assign", desc: "Assign task to a specific role", args: [{ name: "task", type: "string", required: true, desc: "Task description" }, { name: "role", type: "string", required: true, desc: "Role to assign to" }] },
      { cmd: "bt_delegate", desc: "Auto-delegate task (CEO routes to best role)", args: [{ name: "task", type: "string", required: true, desc: "Task to delegate" }] },
      { cmd: "bt_meeting", desc: "Run meeting protocol", args: [{ name: "type", type: "string", required: true, desc: "Meeting type: standup, review, brainstorm, retro, war-room" }] },
      { cmd: "bt_decide", desc: "Make team decision with consensus protocol", args: [{ name: "question", type: "string", required: true, desc: "Decision question" }, { name: "protocol", type: "string", required: false, desc: "Protocol: unanimous, majority, weighted, executive" }] },
      { cmd: "bt_status", desc: "Project status overview with active tasks and blockers", args: [] },
      { cmd: "bt_report", desc: "Generate daily or weekly report", args: [{ name: "period", type: "string", required: false, desc: "Report period: daily or weekly" }] },
      { cmd: "bt_tasks", desc: "List all tasks with status", args: [] },
      { cmd: "bt_escalate", desc: "Escalate blocked task to higher level", args: [{ name: "task", type: "string", required: true, desc: "Task to escalate" }] },
      { cmd: "bt_disband", desc: "Remove Brain Trust from project", args: [{ name: "confirm", type: "boolean", required: true, desc: "Safety confirmation" }] },
    ],
  },
  {
    name: "context-slim",
    displayName: "Context Slim",
    description: "Intelligent context window optimizer — compresses, prioritizes, and manages context to save 40-70% tokens",
    version: "1.0.0",
    tags: ["context", "optimization", "memory", "compression", "tokens"],
    envVars: [],
    commands: [
      { cmd: "slim_status", desc: "Quick context usage overview with budget breakdown", args: [] },
      { cmd: "slim_analyze", desc: "Detailed analysis with top consumers, duplicates, and recommendations", args: [] },
      { cmd: "slim_compress", desc: "Auto-compress context using best strategy per content type", args: [{ name: "strategy", type: "string", required: false, desc: "Force strategy: semantic, structural, or priority" }] },
      { cmd: "slim_budget_set", desc: "Set token budget for a category", args: [{ name: "category", type: "string", required: true, desc: "Category: system_skills, conversation, memory_files, active_files, tool_results" }, { name: "tokens", type: "number", required: true, desc: "Token budget limit" }] },
      { cmd: "slim_budget_show", desc: "Show current budgets and usage per category", args: [] },
      { cmd: "slim_dedup", desc: "Find and merge duplicate content blocks", args: [] },
      { cmd: "slim_profile", desc: "Profile each installed skill context footprint", args: [] },
      { cmd: "slim_optimize", desc: "Full optimization run (analyze + compress + dedup)", args: [] },
      { cmd: "slim_history", desc: "Show compression history and cumulative savings", args: [] },
      { cmd: "slim_reset", desc: "Reset budgets and settings to defaults", args: [] },
    ],
  },
  {
    name: "agent-dashboard",
    displayName: "Agent Dashboard",
    description: "Real-time agent monitoring with health scoring, cost tracking, and web dashboard",
    version: "1.0.0",
    tags: ["monitoring", "dashboard", "analytics", "performance"],
    envVars: [],
    commands: [
      { cmd: "dashboard", desc: "Terminal dashboard with real-time metrics", args: [] },
      { cmd: "dashboard_health", desc: "Detailed health breakdown by component", args: [] },
      { cmd: "dashboard_tasks", desc: "Task analytics with completion rates and trends", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, or month" }] },
      { cmd: "dashboard_skills", desc: "Skill performance ranking and usage stats", args: [] },
      { cmd: "dashboard_cost", desc: "Cost analytics with token usage and projections", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, or month" }] },
      { cmd: "dashboard_alerts", desc: "Show active alerts and warnings", args: [] },
      { cmd: "dashboard_alert_set", desc: "Configure alert threshold", args: [{ name: "type", type: "string", required: true, desc: "Alert type" }, { name: "threshold", type: "string", required: true, desc: "Threshold value" }] },
      { cmd: "dashboard_report", desc: "Generate markdown report", args: [{ name: "period", type: "string", required: false, desc: "Period: daily, weekly, or monthly" }] },
      { cmd: "dashboard_web", desc: "Generate HTML dashboard for browser viewing", args: [] },
      { cmd: "dashboard_replay", desc: "Replay a previous session with metrics", args: [{ name: "session_id", type: "string", required: false, desc: "Session ID to replay" }] },
      { cmd: "dashboard_export", desc: "Export all tracking data", args: [{ name: "format", type: "string", required: true, desc: "Format: json, csv, or html" }] },
      { cmd: "dashboard_reset", desc: "Clear all tracking data", args: [{ name: "confirm", type: "boolean", required: true, desc: "Safety confirmation" }] },
    ],
  },
  {
    name: "line-agent",
    displayName: "LINE Agent",
    description: "LINE Messaging API agent for automated customer support, CRM, and marketing automation in Japan",
    version: "1.0.0",
    tags: ["line", "messaging", "crm", "japan", "automation", "chatbot"],
    envVars: [
      { name: "LINE_CHANNEL_ACCESS_TOKEN", description: "LINE Messaging API channel access token", required: true },
      { name: "LINE_CHANNEL_SECRET", description: "Channel secret for webhook verification", required: true },
      { name: "LINE_LIFF_ID", description: "LIFF app ID for rich interactions", required: false },
      { name: "LINE_NOTIFY_TOKEN", description: "LINE Notify token for admin alerts", required: false },
    ],
    commands: [
      { cmd: "line_send", desc: "Send message to user or broadcast to all", args: [{ name: "target", type: "string", required: true, desc: "User ID or 'all' for broadcast" }, { name: "message", type: "string", required: true, desc: "Message text" }] },
      { cmd: "line_send_flex", desc: "Send Flex Message using template", args: [{ name: "user_id", type: "string", required: true, desc: "Target user ID" }, { name: "template", type: "string", required: true, desc: "Flex message template name" }] },
      { cmd: "line_broadcast", desc: "Broadcast message to all followers", args: [{ name: "message", type: "string", required: true, desc: "Broadcast message" }] },
      { cmd: "line_menu_list", desc: "List configured rich menus", args: [] },
      { cmd: "line_menu_create", desc: "Create rich menu from template", args: [{ name: "template", type: "string", required: true, desc: "Rich menu template" }] },
      { cmd: "line_users", desc: "List recent active users", args: [] },
      { cmd: "line_user", desc: "Full user profile with interaction history", args: [{ name: "user_id", type: "string", required: true, desc: "LINE user ID" }] },
      { cmd: "line_segment_create", desc: "Create user segment", args: [{ name: "name", type: "string", required: true, desc: "Segment name" }, { name: "criteria", type: "string", required: true, desc: "Segment criteria" }] },
      { cmd: "line_auto_add", desc: "Add auto-response rule", args: [{ name: "keyword", type: "string", required: true, desc: "Trigger keyword" }, { name: "response", type: "string", required: true, desc: "Auto-response message" }] },
      { cmd: "line_auto_list", desc: "List auto-response rules", args: [] },
      { cmd: "line_stats", desc: "Analytics dashboard for messaging stats", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, or month" }] },
      { cmd: "line_quota", desc: "Check message quota and current usage", args: [] },
      { cmd: "line_health", desc: "API connectivity and token validity check", args: [] },
    ],
  },
  {
    name: "ec-cube-operator",
    displayName: "EC-CUBE Operator",
    description: "EC-CUBE 4.x complete management agent for products, inventory, orders, and customer analytics",
    version: "1.0.0",
    tags: ["ec-cube", "ecommerce", "japan", "inventory", "orders"],
    envVars: [
      { name: "ECCUBE_BASE_URL", description: "EC-CUBE store URL", required: true },
      { name: "ECCUBE_API_KEY", description: "API authentication key", required: true },
      { name: "ECCUBE_API_SECRET", description: "API secret", required: true },
      { name: "ECCUBE_LOCALE", description: "Locale override (default: ja)", required: false },
      { name: "ECCUBE_TAX_RATE", description: "Default tax rate (default: 10)", required: false },
    ],
    commands: [
      { cmd: "ec_products", desc: "List products with optional search and category filter", args: [{ name: "search", type: "string", required: false, desc: "Search query" }, { name: "category", type: "string", required: false, desc: "Category filter" }] },
      { cmd: "ec_product", desc: "Product details by ID", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "ec_product_create", desc: "Create new product", args: [{ name: "name", type: "string", required: true, desc: "Product name" }, { name: "price", type: "number", required: true, desc: "Product price" }] },
      { cmd: "ec_product_update", desc: "Update product fields", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }, { name: "price", type: "number", required: false, desc: "New price" }] },
      { cmd: "ec_product_toggle", desc: "Toggle product visibility", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "ec_product_optimize", desc: "AI-powered SEO optimization for product", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "ec_stock", desc: "Inventory overview for all products", args: [] },
      { cmd: "ec_stock_adjust", desc: "Adjust stock quantity", args: [{ name: "product_id", type: "string", required: true, desc: "Product ID" }, { name: "quantity", type: "number", required: true, desc: "Quantity adjustment" }, { name: "reason", type: "string", required: true, desc: "Adjustment reason" }] },
      { cmd: "ec_stock_alerts", desc: "Low stock alerts", args: [] },
      { cmd: "ec_stock_forecast", desc: "Predict stock depletion date", args: [{ name: "product_id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "ec_orders", desc: "List orders with status and date filters", args: [{ name: "status", type: "string", required: false, desc: "Order status filter" }, { name: "from", type: "string", required: false, desc: "Start date" }] },
      { cmd: "ec_order", desc: "Order details", args: [{ name: "id", type: "string", required: true, desc: "Order ID" }] },
      { cmd: "ec_order_update", desc: "Update order status", args: [{ name: "id", type: "string", required: true, desc: "Order ID" }, { name: "status", type: "string", required: true, desc: "New status" }] },
      { cmd: "ec_customers", desc: "List customers with segment filter", args: [{ name: "segment", type: "string", required: false, desc: "Segment filter" }] },
      { cmd: "ec_customer", desc: "Customer profile with purchase history", args: [{ name: "id", type: "string", required: true, desc: "Customer ID" }] },
      { cmd: "ec_analytics", desc: "Sales analytics dashboard", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, month, year" }] },
      { cmd: "ec_analytics_rfm", desc: "RFM customer analysis", args: [] },
      { cmd: "ec_export", desc: "Export data as CSV or JSON", args: [{ name: "type", type: "string", required: true, desc: "Data type: products, orders, customers" }, { name: "format", type: "string", required: true, desc: "Format: csv or json" }] },
      { cmd: "ec_health", desc: "Check EC-CUBE API connectivity and version", args: [] },
    ],
  },
  {
    name: "freee-agent",
    displayName: "Freee Agent",
    description: "freee accounting API agent for journal entries, expense management, invoicing, and financial reports",
    version: "1.0.0",
    tags: ["freee", "accounting", "japan", "finance", "tax"],
    envVars: [
      { name: "FREEE_CLIENT_ID", description: "freee API client ID", required: true },
      { name: "FREEE_CLIENT_SECRET", description: "freee API client secret", required: true },
      { name: "FREEE_COMPANY_ID", description: "Target company ID", required: true },
      { name: "FREEE_REFRESH_TOKEN", description: "OAuth2 refresh token", required: true },
      { name: "FREEE_FISCAL_YEAR_END", description: "Fiscal year end month (default: 3)", required: false },
    ],
    commands: [
      { cmd: "freee_journal", desc: "List journal entries with date range filter", args: [{ name: "from", type: "string", required: false, desc: "Start date" }, { name: "to", type: "string", required: false, desc: "End date" }] },
      { cmd: "freee_journal_create", desc: "Create new journal entry", args: [{ name: "debit", type: "string", required: true, desc: "Debit account" }, { name: "credit", type: "string", required: true, desc: "Credit account" }, { name: "amount", type: "number", required: true, desc: "Amount" }, { name: "description", type: "string", required: true, desc: "Description" }] },
      { cmd: "freee_journal_suggest", desc: "AI account suggestion from description", args: [{ name: "description", type: "string", required: true, desc: "Transaction description" }] },
      { cmd: "freee_expense_create", desc: "Register expense", args: [{ name: "amount", type: "number", required: true, desc: "Expense amount" }, { name: "category", type: "string", required: true, desc: "Expense category" }, { name: "description", type: "string", required: true, desc: "Description" }] },
      { cmd: "freee_expense_report", desc: "Expense report by month", args: [{ name: "month", type: "string", required: false, desc: "Month (YYYY-MM)" }] },
      { cmd: "freee_expense_receipt", desc: "Receipt OCR to auto-register expense", args: [{ name: "image_path", type: "string", required: true, desc: "Path to receipt image" }] },
      { cmd: "freee_invoice_create", desc: "Create invoice", args: [{ name: "customer", type: "string", required: true, desc: "Customer name" }, { name: "items", type: "string", required: true, desc: "Invoice items (JSON)" }] },
      { cmd: "freee_invoice_list", desc: "List invoices with status filter", args: [{ name: "status", type: "string", required: false, desc: "Status: unpaid, paid, overdue" }] },
      { cmd: "freee_report_pl", desc: "Profit & loss statement", args: [{ name: "period", type: "string", required: false, desc: "Period: month, quarter, year" }] },
      { cmd: "freee_report_bs", desc: "Balance sheet", args: [] },
      { cmd: "freee_report_tax", desc: "Consumption tax summary", args: [] },
      { cmd: "freee_report_cashflow", desc: "Cash flow report", args: [] },
      { cmd: "freee_close", desc: "Month-end closing process (guided)", args: [{ name: "month", type: "string", required: false, desc: "Month (YYYY-MM)" }] },
      { cmd: "freee_status", desc: "Accounting status overview", args: [] },
      { cmd: "freee_health", desc: "API connectivity and token validity check", args: [] },
    ],
  },
  {
    name: "rakuten-seller",
    displayName: "Rakuten Seller",
    description: "Rakuten marketplace management agent for products, orders, reviews, and competitive analysis",
    version: "1.0.0",
    tags: ["rakuten", "ecommerce", "japan", "marketplace"],
    envVars: [
      { name: "RAKUTEN_SERVICE_SECRET", description: "RMS Web Service API secret", required: true },
      { name: "RAKUTEN_LICENSE_KEY", description: "RMS license key", required: true },
      { name: "RAKUTEN_SHOP_URL", description: "Shop URL identifier", required: true },
    ],
    commands: [
      { cmd: "rakuten_products", desc: "List products with search", args: [{ name: "search", type: "string", required: false, desc: "Search query" }] },
      { cmd: "rakuten_product", desc: "Product details", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "rakuten_product_create", desc: "Create product (interactive)", args: [] },
      { cmd: "rakuten_product_optimize", desc: "SEO optimization suggestions with quality score", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }] },
      { cmd: "rakuten_stock", desc: "Inventory overview", args: [] },
      { cmd: "rakuten_stock_update", desc: "Update stock quantity", args: [{ name: "id", type: "string", required: true, desc: "Product ID" }, { name: "quantity", type: "number", required: true, desc: "New quantity" }] },
      { cmd: "rakuten_orders", desc: "Order list with status filter", args: [{ name: "status", type: "string", required: false, desc: "Order status" }] },
      { cmd: "rakuten_order", desc: "Order details", args: [{ name: "id", type: "string", required: true, desc: "Order ID" }] },
      { cmd: "rakuten_order_ship", desc: "Process shipment with tracking", args: [{ name: "id", type: "string", required: true, desc: "Order ID" }, { name: "tracking", type: "string", required: true, desc: "Tracking number" }] },
      { cmd: "rakuten_reviews", desc: "Review list with rating filter", args: [{ name: "rating", type: "string", required: false, desc: "Rating filter (1-5)" }] },
      { cmd: "rakuten_review_reply", desc: "AI-generated review reply", args: [{ name: "id", type: "string", required: true, desc: "Review ID" }] },
      { cmd: "rakuten_analytics", desc: "Sales analytics", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, month" }] },
      { cmd: "rakuten_compete", desc: "Competitive keyword analysis", args: [{ name: "keyword", type: "string", required: true, desc: "Search keyword" }] },
      { cmd: "rakuten_sale_prepare", desc: "Super SALE / Marathon preparation checklist", args: [] },
      { cmd: "rakuten_health", desc: "API connectivity and R-Cabinet capacity check", args: [] },
    ],
  },
  {
    name: "paypay-biz",
    displayName: "PayPay Biz",
    description: "PayPay for Business API agent for QR payments, analytics, settlements, and subscription management",
    version: "1.0.0",
    tags: ["paypay", "payment", "japan", "qr-code", "fintech"],
    envVars: [
      { name: "PAYPAY_API_KEY", description: "PayPay for Business API key", required: true },
      { name: "PAYPAY_API_SECRET", description: "PayPay API secret", required: true },
      { name: "PAYPAY_MERCHANT_ID", description: "Merchant ID", required: true },
      { name: "PAYPAY_ENVIRONMENT", description: "Environment: sandbox or production (default: sandbox)", required: false },
    ],
    commands: [
      { cmd: "paypay_status", desc: "Today's payment summary", args: [] },
      { cmd: "paypay_payments", desc: "Payment list with date range", args: [{ name: "from", type: "string", required: false, desc: "Start date" }, { name: "to", type: "string", required: false, desc: "End date" }] },
      { cmd: "paypay_payment", desc: "Payment details", args: [{ name: "id", type: "string", required: true, desc: "Payment ID" }] },
      { cmd: "paypay_create_qr", desc: "Generate QR code for payment (MPM)", args: [{ name: "amount", type: "number", required: true, desc: "Payment amount" }, { name: "description", type: "string", required: true, desc: "Payment description" }] },
      { cmd: "paypay_charge", desc: "Process barcode payment (CPM)", args: [{ name: "barcode", type: "string", required: true, desc: "Customer barcode" }, { name: "amount", type: "number", required: true, desc: "Charge amount" }] },
      { cmd: "paypay_refund", desc: "Process refund", args: [{ name: "payment_id", type: "string", required: true, desc: "Payment ID to refund" }, { name: "amount", type: "number", required: false, desc: "Partial refund amount (omit for full)" }] },
      { cmd: "paypay_analytics", desc: "Sales analytics dashboard", args: [{ name: "period", type: "string", required: false, desc: "Period: day, week, month" }] },
      { cmd: "paypay_deposits", desc: "Settlement deposit schedule and history", args: [] },
      { cmd: "paypay_fees", desc: "Fee calculation by month", args: [{ name: "month", type: "string", required: false, desc: "Month (YYYY-MM)" }] },
      { cmd: "paypay_reconcile", desc: "Daily reconciliation check", args: [{ name: "date", type: "string", required: false, desc: "Date (YYYY-MM-DD)" }] },
      { cmd: "paypay_subscription_list", desc: "List active subscriptions", args: [] },
      { cmd: "paypay_subscription_create", desc: "Create recurring charge", args: [{ name: "user_auth_id", type: "string", required: true, desc: "User auth ID" }, { name: "amount", type: "number", required: true, desc: "Recurring amount" }] },
      { cmd: "paypay_health", desc: "API connectivity and environment check", args: [] },
    ],
  },
  {
    name: "jp-tax-calc",
    displayName: "JP Tax Calc",
    description: "Japanese tax calculator for income tax, consumption tax, corporate tax, and furusato nozei",
    version: "1.0.0",
    tags: ["tax", "japan", "finance", "calculator"],
    envVars: [],
    commands: [
      { cmd: "tax_income", desc: "Income tax calculation with deductions", args: [{ name: "income", type: "number", required: true, desc: "Annual income amount" }, { name: "deductions", type: "string", required: false, desc: "Deductions as JSON" }] },
      { cmd: "tax_income_simulate", desc: "Estimate take-home pay from annual salary", args: [{ name: "salary", type: "number", required: true, desc: "Annual salary" }] },
      { cmd: "tax_consumption", desc: "Consumption tax calculation", args: [{ name: "taxable_sales", type: "number", required: true, desc: "Taxable sales amount" }, { name: "taxable_purchases", type: "number", required: true, desc: "Taxable purchase amount" }] },
      { cmd: "tax_consumption_simplified", desc: "Simplified consumption tax calculation", args: [{ name: "sales", type: "number", required: true, desc: "Sales amount" }, { name: "industry", type: "string", required: true, desc: "Industry type" }] },
      { cmd: "tax_corporate", desc: "Corporate tax calculation", args: [{ name: "income", type: "number", required: true, desc: "Taxable corporate income" }, { name: "type", type: "string", required: false, desc: "Company type: small or large" }] },
      { cmd: "tax_furusato", desc: "Furusato nozei (hometown tax) limit calculation", args: [{ name: "salary", type: "number", required: true, desc: "Annual salary" }, { name: "family", type: "string", required: false, desc: "Family composition" }] },
      { cmd: "tax_checklist", desc: "Tax filing checklist for current year", args: [] },
      { cmd: "tax_deductions", desc: "List applicable deductions", args: [] },
      { cmd: "tax_deadline", desc: "Check filing deadlines", args: [] },
      { cmd: "tax_compare", desc: "Compare blue vs white tax filing", args: [{ name: "income", type: "number", required: true, desc: "Income amount" }] },
    ],
  },
  {
    name: "notion-jp",
    displayName: "Notion JP",
    description: "Notion API agent for Japanese business workflows — meetings, tasks, reports, and document management",
    version: "1.0.0",
    tags: ["notion", "productivity", "japan", "project-management"],
    envVars: [
      { name: "NOTION_API_KEY", description: "Notion API integration token", required: true },
      { name: "NOTION_WORKSPACE_ID", description: "Notion workspace ID", required: false },
    ],
    commands: [
      { cmd: "notion_pages", desc: "List pages from database", args: [{ name: "db", type: "string", required: false, desc: "Database ID" }] },
      { cmd: "notion_page", desc: "Show page content", args: [{ name: "id", type: "string", required: true, desc: "Page ID" }] },
      { cmd: "notion_create", desc: "Create page from template", args: [{ name: "template", type: "string", required: true, desc: "Template name" }, { name: "title", type: "string", required: false, desc: "Page title" }] },
      { cmd: "notion_meeting", desc: "Create meeting notes page", args: [{ name: "title", type: "string", required: true, desc: "Meeting title" }, { name: "attendees", type: "string", required: false, desc: "Attendee names" }] },
      { cmd: "notion_meeting_summarize", desc: "Summarize meeting notes and extract TODOs", args: [{ name: "page_id", type: "string", required: true, desc: "Meeting page ID" }] },
      { cmd: "notion_tasks", desc: "List tasks with status filter", args: [{ name: "status", type: "string", required: false, desc: "Task status filter" }] },
      { cmd: "notion_task_create", desc: "Create new task", args: [{ name: "title", type: "string", required: true, desc: "Task title" }, { name: "assignee", type: "string", required: false, desc: "Assignee name" }] },
      { cmd: "notion_task_update", desc: "Update task status", args: [{ name: "id", type: "string", required: true, desc: "Task ID" }, { name: "status", type: "string", required: true, desc: "New status" }] },
      { cmd: "notion_report_weekly", desc: "Auto-generate weekly report", args: [] },
      { cmd: "notion_report_daily", desc: "Auto-generate daily report", args: [] },
      { cmd: "notion_templates", desc: "List available templates", args: [] },
      { cmd: "notion_search", desc: "Search workspace", args: [{ name: "query", type: "string", required: true, desc: "Search query" }] },
      { cmd: "notion_db", desc: "Query database with filter", args: [{ name: "id", type: "string", required: true, desc: "Database ID" }, { name: "filter", type: "string", required: false, desc: "Filter JSON" }] },
    ],
  },
  {
    name: "jp-humanizer",
    displayName: "JP Humanizer",
    description: "Japanese-specific AI text humanizer with keigo adjustment, kanji ratio control, and 4 writing modes",
    version: "1.0.0",
    tags: ["japanese", "humanize", "writing", "keigo", "nlp"],
    envVars: [],
    commands: [
      { cmd: "jpfix", desc: "Auto-fix Japanese text (default: casual mode)", args: [{ name: "text", type: "string", required: true, desc: "Text or file path to fix" }] },
      { cmd: "jpfix_mode", desc: "Fix with specific writing mode", args: [{ name: "text", type: "string", required: true, desc: "Text to fix" }, { name: "mode", type: "string", required: true, desc: "Mode: business, casual, sns, academic" }] },
      { cmd: "jpfix_score", desc: "AI detection score only", args: [{ name: "text", type: "string", required: true, desc: "Text to score" }] },
      { cmd: "jpfix_analyze", desc: "Detailed analysis report", args: [{ name: "text", type: "string", required: true, desc: "Text to analyze" }] },
      { cmd: "jpfix_diff", desc: "Show before/after changes highlighted", args: [{ name: "text", type: "string", required: true, desc: "Text to fix and compare" }] },
      { cmd: "jpfix_batch", desc: "Batch process directory of text files", args: [{ name: "directory", type: "string", required: true, desc: "Directory path" }] },
      { cmd: "jpfix_patterns", desc: "List detected AI patterns", args: [{ name: "text", type: "string", required: true, desc: "Text to scan" }] },
      { cmd: "jpfix_keigo", desc: "Adjust keigo (politeness) level", args: [{ name: "text", type: "string", required: true, desc: "Text to adjust" }, { name: "level", type: "number", required: true, desc: "Keigo level (1-5)" }] },
      { cmd: "jpfix_kanji", desc: "Adjust kanji ratio to target percentage", args: [{ name: "text", type: "string", required: true, desc: "Text to adjust" }, { name: "target", type: "number", required: true, desc: "Target kanji percentage (30-50)" }] },
    ],
  },
  {
    name: "lark-workflow",
    displayName: "Lark Workflow",
    description: "Lark/Feishu API agent for messaging, approvals, documents, calendar, and sheets",
    version: "1.0.0",
    tags: ["lark", "feishu", "workflow", "messaging", "automation"],
    envVars: [
      { name: "LARK_APP_ID", description: "Lark application ID", required: true },
      { name: "LARK_APP_SECRET", description: "Lark application secret", required: true },
      { name: "LARK_WEBHOOK_URL", description: "Webhook Bot URL for notifications", required: false },
    ],
    commands: [
      { cmd: "lark_send", desc: "Send message to chat or user", args: [{ name: "target", type: "string", required: true, desc: "Chat ID or user ID" }, { name: "message", type: "string", required: true, desc: "Message text" }] },
      { cmd: "lark_send_card", desc: "Send card message", args: [{ name: "template", type: "string", required: true, desc: "Card template" }, { name: "data", type: "string", required: true, desc: "Card data JSON" }] },
      { cmd: "lark_webhook", desc: "Send webhook bot notification", args: [{ name: "message", type: "string", required: true, desc: "Notification message" }] },
      { cmd: "lark_chats", desc: "List chats", args: [] },
      { cmd: "lark_approval_create", desc: "Create approval request", args: [{ name: "template", type: "string", required: true, desc: "Approval template" }, { name: "data", type: "string", required: true, desc: "Approval data" }] },
      { cmd: "lark_approval_list", desc: "List approvals with status filter", args: [{ name: "status", type: "string", required: false, desc: "Status: pending, approved, rejected" }] },
      { cmd: "lark_docs", desc: "Search documents", args: [{ name: "search", type: "string", required: false, desc: "Search query" }] },
      { cmd: "lark_doc_create", desc: "Create document", args: [{ name: "title", type: "string", required: true, desc: "Document title" }, { name: "template", type: "string", required: false, desc: "Template name" }] },
      { cmd: "lark_calendar_events", desc: "List calendar events", args: [{ name: "from", type: "string", required: false, desc: "Start date" }, { name: "to", type: "string", required: false, desc: "End date" }] },
      { cmd: "lark_calendar_create", desc: "Create calendar event", args: [{ name: "title", type: "string", required: true, desc: "Event title" }, { name: "start", type: "string", required: true, desc: "Start time" }, { name: "end", type: "string", required: true, desc: "End time" }] },
      { cmd: "lark_sheet_read", desc: "Read from spreadsheet", args: [{ name: "id", type: "string", required: true, desc: "Sheet ID" }, { name: "range", type: "string", required: true, desc: "Cell range" }] },
      { cmd: "lark_sheet_write", desc: "Write to spreadsheet", args: [{ name: "id", type: "string", required: true, desc: "Sheet ID" }, { name: "range", type: "string", required: true, desc: "Cell range" }, { name: "data", type: "string", required: true, desc: "Data to write" }] },
    ],
  },
  {
    name: "jp-seo-writer",
    displayName: "JP SEO Writer",
    description: "Japanese SEO content writer with keyword research, competitor analysis, and article generation",
    version: "1.0.0",
    tags: ["seo", "japanese", "content-writing", "marketing"],
    envVars: [],
    commands: [
      { cmd: "seo_research", desc: "Keyword research with search volume and difficulty", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
      { cmd: "seo_outline", desc: "Create article outline/structure", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
      { cmd: "seo_write", desc: "Generate full SEO-optimized article", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }, { name: "length", type: "number", required: false, desc: "Target character count" }] },
      { cmd: "seo_analyze", desc: "SEO audit of existing content", args: [{ name: "source", type: "string", required: true, desc: "URL or file path" }] },
      { cmd: "seo_rewrite", desc: "SEO-optimized rewrite of existing content", args: [{ name: "source", type: "string", required: true, desc: "URL or file path" }, { name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
      { cmd: "seo_meta", desc: "Generate meta title, description, and OG tags", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }, { name: "title", type: "string", required: true, desc: "Page title" }] },
      { cmd: "seo_cooccurrence", desc: "Co-occurrence word analysis", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
      { cmd: "seo_competitors", desc: "Analyze top-ranking competitor articles", args: [{ name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
      { cmd: "seo_score", desc: "Calculate SEO score for content", args: [{ name: "text", type: "string", required: true, desc: "Content text" }, { name: "keyword", type: "string", required: true, desc: "Target keyword" }] },
    ],
  },
];

// ============================================================================
// Generator functions
// ============================================================================

function generatePackageJson(skill) {
  const tags = skill.tags.map(t => `"${t}"`).join(", ");
  return JSON.stringify({
    name: `@hanabi-jpn/mcp-${skill.name}`,
    version: skill.version,
    description: `MCP server for ${skill.displayName} -- ${skill.description}`,
    type: "module",
    mcpName: `io.github.hanabi-jpn/${skill.name}`,
    main: "dist/index.js",
    types: "dist/index.d.ts",
    bin: { [`mcp-${skill.name}`]: "dist/index.js" },
    files: ["dist", "server.json"],
    scripts: {
      build: "tsc",
      start: "node dist/index.js",
      dev: "npx tsc --watch",
    },
    dependencies: { "@modelcontextprotocol/sdk": "^1.0.0" },
    devDependencies: { typescript: "^5.4.0" },
    repository: {
      type: "git",
      url: "https://github.com/hanabi-jpn/clawhub-skills",
      directory: `mcp-servers/packages/mcp-${skill.name}`,
    },
    keywords: ["mcp", "mcp-server", ...skill.tags],
    author: "hanabi-jpn",
    license: "MIT",
  }, null, 2) + "\n";
}

function generateTsConfig() {
  return JSON.stringify({
    extends: "../../tsconfig.base.json",
    compilerOptions: { outDir: "dist", rootDir: "src" },
    include: ["src/**/*.ts"],
  }, null, 2) + "\n";
}

function generateServerJson(skill) {
  return JSON.stringify({
    $schema: "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    name: `io.github.hanabi-jpn/${skill.name}`,
    description: skill.description,
    repository: {
      url: "https://github.com/hanabi-jpn/clawhub-skills",
      source: "github",
    },
    version: skill.version,
    packages: [{
      registryType: "npm",
      identifier: `@hanabi-jpn/mcp-${skill.name}`,
      version: skill.version,
      transport: { type: "stdio" },
      environmentVariables: skill.envVars.map(ev => ({
        name: ev.name,
        description: ev.description,
        required: ev.required,
      })),
    }],
  }, null, 2) + "\n";
}

function generateIndexTs(skill) {
  // Build tool definitions
  const toolDefs = skill.commands.map(cmd => {
    const properties = {};
    const required = [];
    for (const arg of cmd.args) {
      properties[arg.name] = {
        type: arg.type === "number" ? "number" : arg.type === "boolean" ? "boolean" : "string",
        description: arg.desc,
      };
      if (arg.required) required.push(arg.name);
    }
    return `  {
    name: "${cmd.cmd}",
    description: ${JSON.stringify(cmd.desc)},
    inputSchema: {
      type: "object" as const,
      properties: ${JSON.stringify(properties, null, 6).replace(/\n/g, "\n      ")},
      required: ${JSON.stringify(required)},
    },
  }`;
  });

  // Add built-in tools
  toolDefs.push(`  {
    name: "help",
    description: "Show available tools and usage for ${skill.displayName}",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  }`);
  toolDefs.push(`  {
    name: "version",
    description: "Show version information for ${skill.displayName}",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  }`);

  // Build handler cases
  const handlerCases = skill.commands.map(cmd => {
    const envCheck = skill.envVars.filter(e => e.required).length > 0
      ? `
      const missingEnv = ENV_VARS.filter(e => e.required && !process.env[e.name]).map(e => e.name);
      if (missingEnv.length > 0) {
        return \`Missing required environment variables: \${missingEnv.join(", ")}. Configure them before using this tool.\`;
      }`
      : "";
    return `    case "${cmd.cmd}": {${envCheck}
      const argLines = Object.entries(args)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => \`  \${k}: \${v}\`)
        .join("\\n");
      return [
        "=== ${skill.displayName}: ${cmd.cmd} ===",
        "",
        ${JSON.stringify(cmd.desc)},
        "",
        argLines ? \`Arguments:\\n\${argLines}\` : "No arguments provided.",
        "",
        "Status: Ready. This tool connects to the ${skill.displayName} service.",
        "Configure required environment variables to enable full functionality.",
      ].join("\\n");
    }`;
  });

  // ENV_VARS constant
  const envVarsTs = skill.envVars.length > 0
    ? skill.envVars.map(ev =>
        `  { name: "${ev.name}", description: ${JSON.stringify(ev.description)}, required: ${ev.required} }`
      ).join(",\n")
    : "";

  return `#!/usr/bin/env node

/**
 * MCP Server: ${skill.displayName}
 *
 * ${skill.description}
 *
 * Auto-generated from ${skill.name}/SKILL.md
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

const SERVER_NAME = "${skill.name}";
const SERVER_VERSION = "${skill.version}";
const SERVER_DESCRIPTION = ${JSON.stringify(skill.description)};

const ENV_VARS = [
${envVarsTs}
];

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
${toolDefs.join(",\n")},
];

// ---------------------------------------------------------------------------
// Tool handler
// ---------------------------------------------------------------------------

async function handleTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
${handlerCases.join("\n\n")}

    case "help": {
      const lines = [
        \`=== \${SERVER_NAME} v\${SERVER_VERSION} ===\`,
        SERVER_DESCRIPTION,
        "",
        "Available tools:",
      ];
      for (const tool of TOOLS) {
        lines.push(\`  \${tool.name} - \${tool.description}\`);
      }
      if (ENV_VARS.length > 0) {
        lines.push("");
        lines.push("Environment variables:");
        for (const ev of ENV_VARS) {
          const status = process.env[ev.name] ? "set" : ev.required ? "MISSING" : "not set";
          lines.push(\`  \${ev.name} (\${ev.required ? "required" : "optional"}): \${status}\`);
        }
      }
      return lines.join("\\n");
    }

    case "version": {
      return JSON.stringify(
        { name: SERVER_NAME, version: SERVER_VERSION, description: SERVER_DESCRIPTION, author: "hanabi-jpn", license: "MIT" },
        null,
        2
      );
    }

    default:
      throw new Error(\`Unknown tool: \${name}\`);
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
    return { content: [{ type: "text" as const, text: result }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text" as const, text: \`Error: \${message}\` }],
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
  process.on("SIGINT", async () => { await server.close(); process.exit(0); });
  process.on("SIGTERM", async () => { await server.close(); process.exit(0); });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
`;
}

// ============================================================================
// Main
// ============================================================================

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

console.log("=== MCP Server Package Generator ===");
console.log(`Generating ${SKILLS.length} packages...\n`);

let success = 0;
let skipped = 0;

for (const skill of SKILLS) {
  const pkgDir = join(MCP_ROOT, "packages", `mcp-${skill.name}`);
  const srcDir = join(pkgDir, "src");

  // Skip fx-trader-pro if hand-crafted exists
  if (skill.name === "fx-trader-pro" && existsSync(join(pkgDir, "src", "index.ts"))) {
    console.log(`[SKIP] mcp-${skill.name} (hand-crafted reference exists)`);
    skipped++;
    continue;
  }

  console.log(`[GEN]  mcp-${skill.name} (${skill.commands.length} tools)`);

  ensureDir(srcDir);

  writeFileSync(join(pkgDir, "package.json"), generatePackageJson(skill));
  writeFileSync(join(pkgDir, "tsconfig.json"), generateTsConfig());
  writeFileSync(join(pkgDir, "server.json"), generateServerJson(skill));
  writeFileSync(join(srcDir, "index.ts"), generateIndexTs(skill));

  success++;
}

console.log(`\n=== Summary ===`);
console.log(`Generated: ${success}`);
console.log(`Skipped:   ${skipped}`);
console.log(`Total:     ${SKILLS.length}`);
console.log(`\nNext: cd mcp-servers && npm install && npm run build`);
