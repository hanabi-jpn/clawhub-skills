#!/usr/bin/env python3
"""
GPT Store Configuration Generator for hanabi-jpn Skills
========================================================
Reads all 43 SKILL.md files from the clawhub-skills package directories
(ec-master-pack/, finance-accounting-pack/, marketing-growth-pack/,
business-ops-pack/, security-devops-pack/) and generates GPT Store-compatible
JSON configuration files.

Usage:
    python3 generate-configs.py

Output:
    configs/<skill-slug>.json  (43 files)
"""

import json
import os
import re
import sys
from pathlib import Path

# Base directory containing all skill folders
SKILLS_DIR = Path(__file__).parent.parent
OUTPUT_DIR = Path(__file__).parent / "configs"

# Skill-to-package mapping for path resolution
SKILL_PACKAGES = {
    "ec-cube-operator": "ec-master-pack", "rakuten-seller": "ec-master-pack",
    "stripe-japan-agent": "ec-master-pack", "base-stores-agent": "ec-master-pack",
    "amazon-japan-seller": "ec-master-pack", "yahoo-shopping-agent": "ec-master-pack",
    "mercari-shops-agent": "ec-master-pack", "shopify-japan": "ec-master-pack",
    "makeshop-agent": "ec-master-pack",
    "freee-agent": "finance-accounting-pack", "paypay-biz": "finance-accounting-pack",
    "jp-tax-calc": "finance-accounting-pack", "moneyforward-agent": "finance-accounting-pack",
    "yayoi-agent": "finance-accounting-pack", "misoca-agent": "finance-accounting-pack",
    "airpay-agent": "finance-accounting-pack", "square-japan": "finance-accounting-pack",
    "e-tax-agent": "finance-accounting-pack", "japan-invoice": "finance-accounting-pack",
    "jp-humanizer": "marketing-growth-pack", "jp-seo-writer": "marketing-growth-pack",
    "google-ads-agent": "marketing-growth-pack", "ga4-search-console": "marketing-growth-pack",
    "google-maps-biz": "marketing-growth-pack", "social-media-publisher": "marketing-growth-pack",
    "sansan-agent": "marketing-growth-pack", "hubspot-japan": "marketing-growth-pack",
    "line-agent": "business-ops-pack", "lark-workflow": "business-ops-pack",
    "notion-jp": "business-ops-pack", "google-workspace-agent": "business-ops-pack",
    "chatwork-agent": "business-ops-pack", "kintone-agent": "business-ops-pack",
    "smarthr-agent": "business-ops-pack", "backlog-agent": "business-ops-pack",
    "kingof-time-agent": "business-ops-pack", "line-works-agent": "business-ops-pack",
    "jooto-agent": "business-ops-pack", "slack-japan-agent": "business-ops-pack",
    "cybozu-garoon": "business-ops-pack",
    "mac-sentinel": "security-devops-pack", "repo-guardian": "security-devops-pack",
    "credential-vault": "security-devops-pack",
}

# Skill definitions with metadata for GPT Store (43 skills)
SKILL_CONFIGS = {
    # ═══════════════════════════════════════════════════════════
    # ec-master-pack (9 skills)
    # ═══════════════════════════════════════════════════════════
    "ec-cube-operator": {
        "display_name": "EC-CUBE Operator",
        "category": "Productivity",
        "description": (
            "Complete EC-CUBE 4.x e-commerce management agent for Japanese online stores. "
            "Handles product management, inventory control, order processing, RFM customer "
            "analysis, and sales reporting through the EC-CUBE API."
        ),
        "conversation_starters": [
            "Show today's order summary and sales report",
            "Check inventory levels for low-stock products",
            "Run RFM analysis on our customer database",
            "Update product prices in bulk from this CSV"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "rakuten-seller": {
        "display_name": "Rakuten Seller",
        "category": "Productivity",
        "description": (
            "Rakuten Ichiba shop management AI using the RMS API. Handles product listings, "
            "review management, sales analytics, price optimization, and ranking strategy "
            "for Japan's largest e-commerce marketplace."
        ),
        "conversation_starters": [
            "Analyze my Rakuten shop's sales performance this month",
            "Check and respond to new product reviews",
            "Optimize product pricing based on competitor analysis",
            "What keywords should I target for better ranking?"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "stripe-japan-agent": {
        "display_name": "Stripe Japan Agent",
        "category": "Productivity",
        "description": (
            "Stripe payment management optimized for the Japanese market. "
            "Supports PayPay, konbini payments, bank transfers, subscriptions, "
            "invoicing, and revenue analytics. Handles Japan-specific payment methods "
            "and tax compliance including the qualified invoice system."
        ),
        "conversation_starters": [
            "Show my Stripe payment dashboard for this month",
            "Set up konbini payment integration for my checkout",
            "Create a subscription plan with tiered pricing",
            "Analyze my payment success rates by method"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "base-stores-agent": {
        "display_name": "BASE & STORES Agent",
        "category": "Productivity",
        "description": (
            "Japanese instant-commerce shop management for BASE and STORES platforms. "
            "Product listing, order processing, inventory management, sales analytics, "
            "and multi-shop operations for Japan's popular EC creation platforms "
            "with 2M+ total shops."
        ),
        "conversation_starters": [
            "Show my BASE shop's sales performance this month",
            "List low-stock products across all my shops",
            "Update product prices in bulk from this spreadsheet",
            "Compare my shop performance: BASE vs STORES"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "amazon-japan-seller": {
        "display_name": "Amazon Japan Seller",
        "category": "Productivity",
        "description": (
            "Amazon.co.jp seller automation via SP-API. Product listings, FBA inventory, "
            "order management, advertising campaigns, and performance analytics "
            "for Japan's largest e-commerce marketplace."
        ),
        "conversation_starters": [
            "Show my Amazon Japan sales dashboard this month",
            "Check FBA inventory levels for low-stock items",
            "Optimize my product listing for Amazon Japan search",
            "Analyze my advertising campaign performance"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "yahoo-shopping-agent": {
        "display_name": "Yahoo! Shopping Agent",
        "category": "Productivity",
        "description": (
            "Yahoo! Shopping store automation via Commerce API. Product management, "
            "order processing, promotional campaigns, and sales analytics "
            "for Yahoo! Japan's marketplace platform."
        ),
        "conversation_starters": [
            "Show my Yahoo! Shopping store analytics",
            "Create a promotional campaign for this weekend",
            "Sync inventory across my Yahoo! store",
            "Analyze sales trends and category performance"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "mercari-shops-agent": {
        "display_name": "Mercari Shops Agent",
        "category": "Productivity",
        "description": (
            "Mercari Shops seller management for Japan's largest flea market app (20M+ MAU). "
            "Product listings, order fulfillment, buyer messaging, and sales analytics "
            "for individual and business sellers."
        ),
        "conversation_starters": [
            "List my active Mercari Shops products",
            "Check pending orders and fulfillment status",
            "Analyze my sales trends on Mercari Shops",
            "Draft a reply to a buyer question"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "shopify-japan": {
        "display_name": "Shopify Japan",
        "category": "Productivity",
        "description": (
            "Shopify store management optimized for the Japanese market. "
            "Products, orders, inventory, Japanese payment methods (konbini, bank transfer), "
            "and Shopify Flow automation for Japanese e-commerce businesses."
        ),
        "conversation_starters": [
            "Show my Shopify store dashboard",
            "Set up Japanese payment methods (konbini, bank transfer)",
            "Create a Shopify Flow automation for order processing",
            "Analyze my store's conversion funnel"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "makeshop-agent": {
        "display_name": "MakeShop Agent",
        "category": "Productivity",
        "description": (
            "MakeShop by GMO store automation for Japan's feature-rich EC platform (22,000+ shops). "
            "Product management, order processing, customer data, and analytics "
            "via the MakeShop API."
        ),
        "conversation_starters": [
            "Show my MakeShop store performance",
            "Update product prices in bulk",
            "Generate a customer segment report",
            "Analyze order trends for this quarter"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },

    # ═══════════════════════════════════════════════════════════
    # finance-accounting-pack (10 skills)
    # ═══════════════════════════════════════════════════════════
    "freee-agent": {
        "display_name": "Freee Agent",
        "category": "Productivity",
        "description": (
            "Automated accounting and HR management via freee API. Features AI-powered "
            "journal entries, profit & loss statements, balance sheets, tax filing support, "
            "and payroll processing for Japanese businesses."
        ),
        "conversation_starters": [
            "Show this month's profit and loss statement",
            "Auto-categorize these transactions with AI",
            "Generate a balance sheet for Q4",
            "Help me prepare my tax filing (kakutei shinkoku)"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "paypay-biz": {
        "display_name": "PayPay Biz",
        "category": "Productivity",
        "description": (
            "PayPay business payment management and analytics for Japan's leading QR payment "
            "platform (65M+ users). Features payment tracking, refund processing, sales "
            "analysis, and settlement reporting."
        ),
        "conversation_starters": [
            "Show today's PayPay payment transactions",
            "Process a refund for this transaction",
            "Analyze my PayPay sales trends this month",
            "Generate a settlement report for this period"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "jp-tax-calc": {
        "display_name": "JP Tax Calc",
        "category": "Research",
        "description": (
            "Comprehensive Japanese tax calculator and filing assistant. Covers income tax "
            "(shotokuzei), consumption tax, corporate tax, resident tax, and e-Tax integration. "
            "Helps freelancers and businesses with kakutei shinkoku (tax filing)."
        ),
        "conversation_starters": [
            "Calculate my income tax for this year",
            "What deductions am I eligible for as a freelancer?",
            "Help me estimate quarterly consumption tax",
            "Walk me through the kakutei shinkoku process"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "moneyforward-agent": {
        "display_name": "MoneyForward Agent",
        "category": "Productivity",
        "description": (
            "Cloud accounting automation via MoneyForward, Japan's leading fintech platform. "
            "Automate invoice creation, expense categorization, journal entries, "
            "bank reconciliation, and financial reporting for Japanese businesses."
        ),
        "conversation_starters": [
            "Show this month's profit and loss summary",
            "Auto-categorize my latest bank transactions",
            "Create an invoice for a new client",
            "Generate a quarterly financial report"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "yayoi-agent": {
        "display_name": "Yayoi Agent",
        "category": "Productivity",
        "description": (
            "Accounting automation for Yayoi, Japan's most widely used accounting software. "
            "Smart transaction import, Misoca invoice creation, bank reconciliation, "
            "tax filing preparation, and financial reporting. "
            "Supports Yayoi Online and desktop versions."
        ),
        "conversation_starters": [
            "Import bank transactions and auto-categorize them",
            "Create a Misoca invoice for a new client",
            "Generate my quarterly tax filing summary",
            "Reconcile my bank statement with Yayoi records"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "misoca-agent": {
        "display_name": "Misoca Agent",
        "category": "Productivity",
        "description": (
            "Misoca cloud invoicing automation by Yayoi. Create, send, and track invoices "
            "with Tekikaku Invoice System compliance. Supports quotes, delivery slips, "
            "and receipt generation for Japanese businesses."
        ),
        "conversation_starters": [
            "Create a new invoice for a client",
            "Show all unpaid invoices this month",
            "Generate a Tekikaku-compliant invoice",
            "Convert a quote to an invoice"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "airpay-agent": {
        "display_name": "AirPay Agent",
        "category": "Productivity",
        "description": (
            "AirPay payment terminal management by Recruit. Transaction history, "
            "settlement reports, and multi-payment method analytics covering credit cards, "
            "QR payments, and electronic money for Japanese retail businesses."
        ),
        "conversation_starters": [
            "Show today's transaction summary",
            "Generate a settlement report for this week",
            "Compare payment method usage trends",
            "Check processing fees by payment type"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "square-japan": {
        "display_name": "Square Japan",
        "category": "Productivity",
        "description": (
            "Square POS and payment management for the Japanese market. "
            "Transaction processing, invoice creation, inventory management, "
            "customer directory, and sales analytics via the Square API."
        ),
        "conversation_starters": [
            "Show my Square POS sales dashboard",
            "Create an invoice for a customer",
            "Analyze payment trends by method",
            "Check my inventory levels across locations"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "e-tax-agent": {
        "display_name": "e-Tax Agent",
        "category": "Research",
        "description": (
            "e-Tax electronic tax filing assistant for Japan's National Tax Agency system. "
            "Guides kakutei shinkoku preparation, validates tax forms, "
            "generates XML submissions, and provides step-by-step filing instructions."
        ),
        "conversation_starters": [
            "Help me prepare my kakutei shinkoku",
            "Validate my tax return form data",
            "What documents do I need for e-Tax filing?",
            "Guide me through the e-Tax submission process"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "japan-invoice": {
        "display_name": "Japan Invoice",
        "category": "Productivity",
        "description": (
            "Tekikaku Invoice System (qualified invoice) compliance agent. "
            "Generate, validate, and manage invoices meeting Japan's 2023 invoice requirements. "
            "Registration number validation, tax rate breakdown, and seller information compliance."
        ),
        "conversation_starters": [
            "Generate a Tekikaku-compliant invoice",
            "Validate this invoice for compliance",
            "What are the Tekikaku Invoice System requirements?",
            "Check if this registration number is valid"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },

    # ═══════════════════════════════════════════════════════════
    # marketing-growth-pack (8 skills)
    # ═══════════════════════════════════════════════════════════
    "jp-humanizer": {
        "display_name": "JP Humanizer",
        "category": "Writing",
        "description": (
            "Japanese-specialized AI text humanizer with 500+ transformation patterns. "
            "4 modes: keigo (formal), business, casual, and SNS. Achieves 0% AI detection "
            "by fixing sentence endings, katakana overuse, kanji balance, and unnatural keigo."
        ),
        "conversation_starters": [
            "Humanize this AI-generated Japanese text",
            "Rewrite this in natural casual Japanese (kudaketa nihongo)",
            "Convert this to proper business keigo that sounds human",
            "Score this Japanese text for AI detection patterns"
        ],
        "capabilities": {"web_browsing": False, "dall_e": False, "code_interpreter": True}
    },
    "jp-seo-writer": {
        "display_name": "JP SEO Writer",
        "category": "Writing",
        "description": (
            "Japanese SEO content generator that creates search-rank-optimized articles. "
            "Features keyword analysis, co-occurrence word research (kyokigo bunseki), "
            "article structure planning, E-E-A-T optimization, and Google Japan ranking strategies."
        ),
        "conversation_starters": [
            "Write an SEO article targeting this Japanese keyword",
            "Analyze co-occurrence words for my target keyword",
            "Create an article structure optimized for Google Japan",
            "Score my existing article for E-E-A-T compliance"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "google-ads-agent": {
        "display_name": "Google Ads Agent",
        "category": "Productivity",
        "description": (
            "AI-powered Google Ads campaign management agent. Create, optimize, and audit "
            "PPC campaigns with automated bid optimization, keyword research, ad copy generation, "
            "and performance reporting across Search, Display, Shopping, and YouTube campaigns."
        ),
        "conversation_starters": [
            "Audit my Google Ads account for wasted spend",
            "Create a search campaign for my product launch in Japan",
            "Optimize my bidding strategy based on conversion data",
            "Generate ad copy variations for A/B testing"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "ga4-search-console": {
        "display_name": "GA4 & Search Console",
        "category": "Research",
        "description": (
            "Natural language analytics for Google Analytics 4 and Search Console. "
            "Ask questions about your traffic, SEO performance, conversions, and user behavior "
            "in plain English or Japanese. Generates reports, identifies trends, and provides "
            "actionable SEO recommendations."
        ),
        "conversation_starters": [
            "Show my top 10 landing pages by organic traffic this month",
            "What keywords am I ranking for that have high impressions but low clicks?",
            "Analyze my GA4 conversion funnel and find drop-off points",
            "Compare this month's SEO performance vs last month"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "google-maps-biz": {
        "display_name": "Google Maps Biz",
        "category": "Productivity",
        "description": (
            "Location intelligence and Google Business Profile management agent. "
            "Geocoding, places search, competitor analysis, route optimization, "
            "store locator generation, and review management for physical businesses."
        ),
        "conversation_starters": [
            "Find all competitors within 5km of my store location",
            "Optimize my Google Business Profile for local SEO",
            "Calculate the best delivery route for these 10 addresses",
            "Generate a store locator page for my website"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "social-media-publisher": {
        "display_name": "Social Media Publisher",
        "category": "Lifestyle",
        "description": (
            "Cross-platform social media management agent for X/Twitter, Instagram, "
            "TikTok, and LINE. Content creation, scheduling, analytics, hashtag research, "
            "and engagement tracking. Supports Japanese and English content with "
            "platform-specific optimization."
        ),
        "conversation_starters": [
            "Draft a week of social media posts for my product launch",
            "Analyze my engagement metrics across all platforms",
            "Find trending hashtags for my niche in Japan",
            "Create an Instagram carousel post about our new feature"
        ],
        "capabilities": {"web_browsing": True, "dall_e": True, "code_interpreter": True}
    },
    "sansan-agent": {
        "display_name": "Sansan Agent",
        "category": "Productivity",
        "description": (
            "Business card and contact intelligence agent for Sansan, Japan's leading "
            "B2B contact management platform. Search digitized business cards, "
            "manage contacts, track networking relationships, and sync with CRM systems."
        ),
        "conversation_starters": [
            "Search my business cards for contacts at Toyota",
            "Show recently scanned cards from this week's events",
            "Export contacts tagged with 'potential client'",
            "Find all contacts in the manufacturing industry"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "hubspot-japan": {
        "display_name": "HubSpot Japan",
        "category": "Productivity",
        "description": (
            "HubSpot CRM and marketing automation for Japanese businesses. "
            "Contact management, deal pipeline, email campaigns, form builders, "
            "and analytics with Japanese language support and localized workflows."
        ),
        "conversation_starters": [
            "Show my HubSpot deal pipeline summary",
            "Create an email campaign for our new product",
            "Analyze contact engagement trends this month",
            "Set up a lead nurturing workflow in Japanese"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },

    # ═══════════════════════════════════════════════════════════
    # business-ops-pack (13 skills)
    # ═══════════════════════════════════════════════════════════
    "line-agent": {
        "display_name": "LINE Agent",
        "category": "Lifestyle",
        "description": (
            "LINE Official Account automation and CRM for Japan's #1 messaging platform "
            "(96M+ users). Features AI auto-response, Flex Messages, audience segmentation, "
            "broadcast campaigns, and customer analytics."
        ),
        "conversation_starters": [
            "Set up AI auto-response for my LINE Official Account",
            "Create a Flex Message template for a campaign",
            "Analyze my LINE audience demographics",
            "Schedule a broadcast message to all followers"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "lark-workflow": {
        "display_name": "Lark Workflow",
        "category": "Productivity",
        "description": (
            "Lark (Feishu) workflow automation using the Open API. Automates approval flows, "
            "bot messaging, document generation, calendar management, and notifications "
            "for Japanese and Asian business teams."
        ),
        "conversation_starters": [
            "Set up an approval workflow in Lark",
            "Send a bot notification to my team channel",
            "Create a document from this template",
            "Show pending approval requests in my workflow"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "notion-jp": {
        "display_name": "Notion JP",
        "category": "Productivity",
        "description": (
            "Japanese Notion template generator with 20+ templates. Auto-generates meeting notes "
            "(gijiroku), daily reports (nippo), approval requests (ringisho), KPT retrospectives, "
            "and more with proper Japanese business formatting."
        ),
        "conversation_starters": [
            "Create a meeting notes template (gijiroku) in Notion",
            "Generate a daily report template for my team",
            "Set up a KPT retrospective board in Notion",
            "Create an approval request (ringisho) template"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "google-workspace-agent": {
        "display_name": "Google Workspace Agent",
        "category": "Productivity",
        "description": (
            "Unified Google Workspace management agent for Gmail, Calendar, Drive, Sheets, "
            "and Docs. Automate email workflows, schedule meetings, organize files, "
            "build spreadsheet reports, and generate documents from a single conversational interface."
        ),
        "conversation_starters": [
            "Search my Gmail for unread messages from this week",
            "Create a Google Sheets report from this sales data",
            "Schedule a team meeting on Google Calendar for next Tuesday",
            "Organize my Google Drive files by project"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "chatwork-agent": {
        "display_name": "Chatwork Agent",
        "category": "Productivity",
        "description": (
            "Automation agent for Chatwork, Japan's #1 business messaging platform. "
            "Send messages, create tasks, manage rooms, and build bot integrations "
            "via the ChatWork API v2. Perfect for Japanese team communication workflows."
        ),
        "conversation_starters": [
            "Send a progress update to my project room",
            "Create tasks for all team members from this meeting notes",
            "Set up a webhook bot for automated notifications",
            "Show unread messages across all my Chatwork rooms"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "kintone-agent": {
        "display_name": "Kintone Agent",
        "category": "Productivity",
        "description": (
            "Build, query, and automate Cybozu kintone apps -- Japan's leading no-code "
            "business platform used by 30,000+ companies. Create custom apps, "
            "run queries, build workflows, and integrate with other systems "
            "through the kintone REST API."
        ),
        "conversation_starters": [
            "Query my kintone CRM app for leads from this month",
            "Create a new kintone app for expense tracking",
            "Automate a workflow between kintone and Google Sheets",
            "Show all records with status 'pending review'"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "smarthr-agent": {
        "display_name": "SmartHR Agent",
        "category": "Productivity",
        "description": (
            "HR and labor management automation for SmartHR, Japan's leading cloud HR platform. "
            "Employee onboarding, document generation, payroll integration, "
            "labor compliance checks, and electronic signature management "
            "for Japanese businesses."
        ),
        "conversation_starters": [
            "Start the onboarding process for a new employee",
            "Generate a labor compliance report for this quarter",
            "List all employees with expiring contracts this month",
            "Create an electronic document for signature"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "backlog-agent": {
        "display_name": "Backlog Agent",
        "category": "Productivity",
        "description": (
            "Project management automation for Nulab Backlog, Japan's top PM tool. "
            "Create and manage issues, wikis, milestones, Git repositories, "
            "and sprint boards. Track project progress and generate reports "
            "through the Backlog API."
        ),
        "conversation_starters": [
            "Show all my open issues sorted by priority",
            "Create a new sprint with these user stories",
            "Generate a burndown chart for the current milestone",
            "Update the wiki with today's meeting notes"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "kingof-time-agent": {
        "display_name": "King of Time Agent",
        "category": "Productivity",
        "description": (
            "Attendance and time tracking automation for King of Time, "
            "Japan's leading cloud attendance management system. Daily/monthly reports, "
            "overtime monitoring, shift management, payroll data sync, "
            "and labor law compliance checks."
        ),
        "conversation_starters": [
            "Show today's attendance summary for my team",
            "Who has overtime exceeding 45 hours this month?",
            "Generate the monthly attendance report for payroll",
            "Check shift coverage for next week"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "line-works-agent": {
        "display_name": "LINE WORKS Agent",
        "category": "Productivity",
        "description": (
            "Enterprise communication automation for LINE WORKS (formerly LINE for Business). "
            "Bot messaging, group management, calendar integration, and workflow automation "
            "on Japan's business-grade LINE platform used by 430,000+ organizations."
        ),
        "conversation_starters": [
            "Send a notification to my LINE WORKS team group",
            "Set up a bot for automated daily standup reports",
            "Show my LINE WORKS calendar for this week",
            "Create a survey and distribute to all team members"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "jooto-agent": {
        "display_name": "Jooto Agent",
        "category": "Productivity",
        "description": (
            "Task and project management automation for Jooto by PR TIMES. "
            "Kanban board management, task creation, workflow automation, "
            "and team collaboration for Japanese project teams. "
            "Simple visual project tracking with API integration."
        ),
        "conversation_starters": [
            "Show my Jooto board with current task status",
            "Create a new project board with standard Kanban columns",
            "Move all tasks tagged 'done' to the completed column",
            "Generate a weekly progress report from my board"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "slack-japan-agent": {
        "display_name": "Slack Japan Agent",
        "category": "Productivity",
        "description": (
            "Slack workspace automation for Japanese business teams. Channel management, "
            "workflow builder, app integrations, and bilingual bot responses. "
            "Optimized for Japanese business communication patterns and etiquette."
        ),
        "conversation_starters": [
            "Show unread messages in my Slack channels",
            "Create a workflow for daily standup reports",
            "Set up a bilingual auto-response bot",
            "Analyze team communication patterns this week"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "cybozu-garoon": {
        "display_name": "Cybozu Garoon",
        "category": "Productivity",
        "description": (
            "Cybozu Garoon groupware automation for large Japanese enterprises (6,600+ companies). "
            "Schedule management, workflow approvals, bulletin board posts, "
            "facility reservations, and address book integration via the Garoon REST API."
        ),
        "conversation_starters": [
            "Show my Garoon schedule for this week",
            "Create a workflow approval request",
            "Post an announcement to the bulletin board",
            "Reserve a meeting room for next Tuesday"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },

    # ═══════════════════════════════════════════════════════════
    # security-devops-pack (3 skills)
    # ═══════════════════════════════════════════════════════════
    "mac-sentinel": {
        "display_name": "Mac Sentinel",
        "category": "Programming",
        "description": (
            "macOS security hardening agent for Claude Code environments. "
            "Pre-execution command validation, malicious config detection, "
            "credential hygiene audits, CVE vulnerability scanning, "
            "and endpoint protection. Protects your Mac development setup."
        ),
        "conversation_starters": [
            "Run a full security audit of my Mac",
            "Check for known CVE vulnerabilities on my system",
            "Harden my macOS security settings for development",
            "Scan my Claude Code configs for security issues"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "repo-guardian": {
        "display_name": "Repo Guardian",
        "category": "Programming",
        "description": (
            "Pre-clone repository security scanner for developers. "
            "Detects malicious git hooks, poisoned MCP configurations, "
            "credential-harvesting patterns, prompt injection attacks, "
            "and dependency confusion risks BEFORE you clone or process a repo."
        ),
        "conversation_starters": [
            "Scan this GitHub repo before I clone it",
            "Check this repository for malicious git hooks",
            "Audit the MCP configs and Claude settings in this project",
            "Detect potential prompt injection in this repo's README"
        ],
        "capabilities": {"web_browsing": True, "dall_e": False, "code_interpreter": True}
    },
    "credential-vault": {
        "display_name": "Credential Vault",
        "category": "Programming",
        "description": (
            "Secure API key and credential management for Claude Code. "
            "Encrypted storage using macOS Keychain, automatic rotation policies, "
            "leak detection scanning, safe environment injection, "
            "and audit logging. Never expose secrets in your codebase again."
        ),
        "conversation_starters": [
            "Store my new API key securely in the vault",
            "Check my project for leaked credentials and secrets",
            "Rotate all API keys older than 90 days",
            "Show my credential audit log and expiration status"
        ],
        "capabilities": {"web_browsing": False, "dall_e": False, "code_interpreter": True}
    },
}


def extract_system_prompt(skill_md_path: Path) -> str:
    """Extract the system prompt section from a SKILL.md file."""
    content = skill_md_path.read_text(encoding="utf-8")

    # Try to find "## System Prompt Instructions" section
    system_prompt_patterns = [
        r"## System Prompt Instructions\n(.*?)(?=\n## (?!#)|$)",
        r"## System Prompt\n(.*?)(?=\n## (?!#)|$)",
    ]

    for pattern in system_prompt_patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
            return match.group(1).strip()

    # Fallback: extract everything between "## System Prompt Instructions" and
    # next major section (## without being ###)
    lines = content.split("\n")
    in_system_prompt = False
    prompt_lines = []
    section_count = 0

    for line in lines:
        if re.match(r"^## System Prompt", line):
            in_system_prompt = True
            continue

        if in_system_prompt:
            # Stop at the next ## section that is NOT ### (subsection)
            if re.match(r"^## [^#]", line):
                # Check if we've seen some content (avoid stopping on adjacent sections)
                if prompt_lines:
                    # Check if it's a comparison/FAQ/error section - stop there
                    if any(
                        kw in line.lower()
                        for kw in [
                            "comparison",
                            "faq",
                            "error handling",
                            "why ",
                            "vs ",
                        ]
                    ):
                        break

            prompt_lines.append(line)

    if prompt_lines:
        return "\n".join(prompt_lines).strip()

    # Final fallback: extract from ## Overview onward (but not the header/badges)
    overview_match = re.search(r"## Overview\n(.*?)(?=\n## (?:Comparison|FAQ|Error|Why ))", content, re.DOTALL)
    if overview_match:
        return overview_match.group(1).strip()

    # Last resort: return description from frontmatter
    desc_match = re.search(r'^description:\s*"(.+?)"', content, re.MULTILINE)
    if desc_match:
        return desc_match.group(1)

    return "System prompt not found. Please manually add the instructions from the SKILL.md file."


def extract_full_instructions(skill_slug: str, skill_md_path: Path) -> str:
    """Extract full instructions for GPT system prompt.

    For GPT Store, we want the complete system prompt section
    including all commands, rules, and behavior definitions.
    """
    content = skill_md_path.read_text(encoding="utf-8")

    # Find the start of the system prompt / instructions section
    start_patterns = [
        "## System Prompt Instructions",
        "## System Prompt",
    ]

    start_idx = -1
    for pattern in start_patterns:
        idx = content.find(pattern)
        if idx != -1:
            start_idx = idx
            break

    if start_idx == -1:
        # Try Overview as fallback
        idx = content.find("## Overview")
        if idx != -1:
            start_idx = idx

    if start_idx == -1:
        return f"You are {SKILL_CONFIGS[skill_slug]['display_name']} by hanabi-jpn. {SKILL_CONFIGS[skill_slug]['description']}"

    # Find the end: stop at Comparison, FAQ, Error Handling, or "Why X vs Y" sections
    end_patterns = [
        "\n## Comparison",
        "\n## Why ",
        "\n## FAQ",
        "\n## Error Handling",
        "\n## Error ",
        f"\n## {SKILL_CONFIGS[skill_slug]['display_name']} vs",
    ]

    end_idx = len(content)
    for pattern in end_patterns:
        idx = content.find(pattern, start_idx)
        if idx != -1 and idx < end_idx:
            end_idx = idx

    instructions = content[start_idx:end_idx].strip()

    # Prepend a GPT-specific preamble
    preamble = (
        f"You are **{SKILL_CONFIGS[skill_slug]['display_name']}** by hanabi-jpn. "
        f"{SKILL_CONFIGS[skill_slug]['description']}\n\n"
        "Follow the instructions below precisely.\n\n"
    )

    return preamble + instructions


def generate_config(skill_slug: str) -> dict:
    """Generate a GPT Store config JSON for a single skill."""
    package = SKILL_PACKAGES[skill_slug]
    skill_dir = SKILLS_DIR / package / skill_slug
    skill_md = skill_dir / "SKILL.md"

    if not skill_md.exists():
        print(f"  WARNING: {skill_md} not found, skipping.", file=sys.stderr)
        return None

    config = SKILL_CONFIGS[skill_slug]
    instructions = extract_full_instructions(skill_slug, skill_md)

    return {
        "name": f"{config['display_name']} by hanabi-jpn",
        "description": config["description"],
        "instructions": instructions,
        "conversation_starters": config["conversation_starters"],
        "capabilities": config["capabilities"],
        "category": config["category"],
        "_meta": {
            "skill_slug": skill_slug,
            "source": f"clawhub-skills/{package}/{skill_slug}/SKILL.md",
            "author": "hanabi-jpn",
            "generated_by": "generate-configs.py"
        }
    }


def main():
    """Generate all 43 GPT Store config files."""
    total = len(SKILL_CONFIGS)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("  GPT Store Config Generator for hanabi-jpn Skills")
    print("=" * 60)
    print(f"\n  Skills directory: {SKILLS_DIR}")
    print(f"  Output directory: {OUTPUT_DIR}")
    print(f"  Skills to process: {total}")
    print()

    generated = 0
    failed = 0

    for skill_slug in sorted(SKILL_CONFIGS.keys()):
        print(f"  [{generated + failed + 1:2d}/{total}] Processing {skill_slug}...", end=" ")

        config = generate_config(skill_slug)
        if config is None:
            failed += 1
            print("FAILED")
            continue

        output_path = OUTPUT_DIR / f"{skill_slug}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        # Report instruction length
        inst_len = len(config["instructions"])
        inst_tokens_est = inst_len // 4  # rough estimate
        print(f"OK ({inst_tokens_est:,} tokens est.)")
        generated += 1

    print()
    print("-" * 60)
    print(f"  Generated: {generated}")
    print(f"  Failed:    {failed}")
    print(f"  Output:    {OUTPUT_DIR}/")
    print()

    if generated == total:
        print(f"  All {total} configs generated successfully!")
    else:
        print(f"  WARNING: Expected {total}, got {generated}. Check errors above.")

    print()

    # Summary table
    print("  Skill                     | Category      | Capabilities")
    print("  " + "-" * 70)
    for slug in sorted(SKILL_CONFIGS.keys()):
        cfg = SKILL_CONFIGS[slug]
        caps = []
        if cfg["capabilities"]["web_browsing"]:
            caps.append("Web")
        if cfg["capabilities"]["dall_e"]:
            caps.append("DALL-E")
        if cfg["capabilities"]["code_interpreter"]:
            caps.append("Code")
        caps_str = ", ".join(caps) if caps else "None"
        print(f"  {cfg['display_name']:<27s} | {cfg['category']:<13s} | {caps_str}")

    print()


if __name__ == "__main__":
    main()
