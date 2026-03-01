# Dify Marketplace Plugin Submission Guide

## hanabi-jpn / ClawHub Skills -- Top 10 Plugins

**Last updated**: 2026-03-01
**Target repo**: [langgenius/dify-plugins](https://github.com/langgenius/dify-plugins)

---

## Current Status

Our 10 plugin directories currently contain **manifest.yaml only**. The Dify
marketplace requires complete plugin projects packaged as `.difypkg` binary
files. This guide describes every step needed to go from our current manifests
to merged PRs on the marketplace.

---

## Table of Contents

1. [Overview of Dify Plugin Architecture](#1-overview-of-dify-plugin-architecture)
2. [Gap Analysis: What We Have vs What We Need](#2-gap-analysis)
3. [Step-by-Step: Build a Complete Plugin](#3-step-by-step-build-a-complete-plugin)
4. [Step-by-Step: Package as .difypkg](#4-step-by-step-package-as-difypkg)
5. [Step-by-Step: Submit PR to langgenius/dify-plugins](#5-step-by-step-submit-pr)
6. [PR Template](#6-pr-template)
7. [Per-Plugin Implementation Notes](#7-per-plugin-implementation-notes)
8. [Automation Script](#8-automation-script)
9. [References](#9-references)

---

## 1. Overview of Dify Plugin Architecture

Dify plugins are self-contained Python packages that run inside Dify's plugin
runtime. Each plugin must include:

```
my-plugin/
  manifest.yaml          # Plugin metadata (we already have this)
  main.py                # Entrypoint -- registers tools/endpoints
  requirements.txt       # Python dependencies
  _assets/
    icon.svg             # Plugin icon (referenced in manifest)
  provider/
    my_plugin.yaml       # Provider definition
    my_plugin.py         # Provider implementation (credential validation)
  tools/
    tool_name.yaml       # Tool definition (parameters, descriptions)
    tool_name.py         # Tool implementation (actual logic)
  endpoints/             # (optional) Webhook/callback endpoints
    endpoint.yaml
    endpoint.py
  README.md              # Setup & usage documentation
  PRIVACY.md             # Privacy policy (required for marketplace)
```

### Plugin Types

| Type | Use Case | Our Plugins |
|------|----------|-------------|
| `tool` | Adds tools callable from workflows/agents | Most of ours |
| `model` | Adds LLM/embedding model providers | None |
| `extension` | Agent strategies, moderation, etc. | Our manifests say `extension` but should likely be `tool` |

**Important**: Our manifests currently declare `type: extension` and
`category: agent-strategy`. Based on what other plugins do, most of ours should
be `type: tool` since they provide callable tools (API integrations). Review the
[Dify plugin docs](https://docs.dify.ai/plugins) to confirm the correct type.

---

## 2. Gap Analysis

### What We Have (per plugin)

- `manifest.yaml` with metadata, labels (en_US/ja_JP), credentials

### What We Need (per plugin)

| File | Status | Notes |
|------|--------|-------|
| `manifest.yaml` | Exists (needs review) | May need `type` field change |
| `main.py` | **MISSING** | Plugin entrypoint |
| `requirements.txt` | **MISSING** | e.g., `requests`, `google-auth`, etc. |
| `_assets/icon.svg` | **MISSING** | Need to create SVG icons |
| `provider/*.yaml` | **MISSING** | Provider credential schema |
| `provider/*.py` | **MISSING** | Credential validation logic |
| `tools/*.yaml` | **MISSING** | Tool definitions |
| `tools/*.py` | **MISSING** | Tool implementations (API calls) |
| `README.md` | **MISSING** | Setup/usage docs |
| `PRIVACY.md` | **MISSING** | Data handling policy |
| `.difypkg` | **MISSING** | Built from complete project |

---

## 3. Step-by-Step: Build a Complete Plugin

### 3.1 Install the Dify Plugin CLI

```bash
# Install via pip
pip install dify-plugin-daemon

# Or use the official installer
curl -sSL https://raw.githubusercontent.com/langgenius/dify-plugin-daemon/main/install.sh | bash

# Verify
dify-plugin version
```

### 3.2 Scaffold a New Plugin (Recommended)

```bash
# Initialize a new plugin project from template
dify-plugin init my-plugin

# This creates the full directory structure with boilerplate
```

### 3.3 Manual Build (from our existing manifests)

For each of our 10 plugins, create the required files:

#### main.py (entrypoint)

```python
from dify_plugin import Plugin

plugin = Plugin()

if __name__ == "__main__":
    plugin.run()
```

#### provider/chatwork.yaml (example for chatwork-agent)

```yaml
identity:
  author: hanabi-jpn
  name: chatwork
  label:
    en_US: ChatWork
    ja_JP: ChatWork
  description:
    en_US: ChatWork API integration for business messaging
    ja_JP: ChatWork APIによるビジネスメッセージング連携
  icon: icon.svg
credentials_for_provider:
  chatwork_api_token:
    type: secret-input
    required: true
    label:
      en_US: ChatWork API Token
      ja_JP: ChatWork APIトークン
    placeholder:
      en_US: Enter your ChatWork API token
      ja_JP: ChatWork APIトークンを入力
```

#### provider/chatwork.py (credential validation)

```python
from dify_plugin.errors.model import CredentialsValidateFailedError
from dify_plugin import ToolProvider
import requests


class ChatworkProvider(ToolProvider):
    def _validate_credentials(self, credentials: dict) -> None:
        token = credentials.get("chatwork_api_token")
        if not token:
            raise CredentialsValidateFailedError("API token is required")

        resp = requests.get(
            "https://api.chatwork.com/v2/me",
            headers={"X-ChatWorkToken": token},
        )
        if resp.status_code != 200:
            raise CredentialsValidateFailedError(
                f"Invalid API token: {resp.status_code}"
            )
```

#### tools/send_message.yaml (tool definition)

```yaml
identity:
  name: send_message
  author: hanabi-jpn
  label:
    en_US: Send Message
    ja_JP: メッセージ送信
description:
  human:
    en_US: Send a message to a ChatWork room
    ja_JP: ChatWorkルームにメッセージを送信
  llm: Send a text message to a specified ChatWork room by room ID
parameters:
  - name: room_id
    type: number
    required: true
    label:
      en_US: Room ID
      ja_JP: ルームID
    human_description:
      en_US: The ChatWork room ID to send the message to
      ja_JP: メッセージ送信先のChatWorkルームID
    llm_description: The numeric room ID
    form: llm
  - name: message
    type: string
    required: true
    label:
      en_US: Message
      ja_JP: メッセージ
    human_description:
      en_US: The message content to send
      ja_JP: 送信するメッセージ内容
    llm_description: The text content of the message
    form: llm
```

#### tools/send_message.py (tool implementation)

```python
from typing import Any, Generator
from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage
import requests


class SendMessageTool(Tool):
    def _invoke(
        self, tool_parameters: dict[str, Any]
    ) -> Generator[ToolInvokeMessage, None, None]:
        token = self.runtime.credentials.get("chatwork_api_token")
        room_id = tool_parameters.get("room_id")
        message = tool_parameters.get("message")

        resp = requests.post(
            f"https://api.chatwork.com/v2/rooms/{room_id}/messages",
            headers={"X-ChatWorkToken": token},
            data={"body": message},
        )
        resp.raise_for_status()

        yield self.create_text_message(
            f"Message sent to room {room_id}: {resp.json().get('message_id')}"
        )
```

#### requirements.txt

```
requests>=2.28.0
```

#### _assets/icon.svg

Create a simple SVG icon for each plugin (64x64 recommended).

#### README.md

```markdown
# ChatWork Agent

Dify plugin for ChatWork API integration.

## Setup

1. Get your ChatWork API token from: https://www.chatwork.com/service/packages/chatwork/subpackages/api/token.php
2. Install this plugin in your Dify instance
3. Configure credentials with your API token

## Tools

- **Send Message**: Send messages to ChatWork rooms
- **Get Messages**: Retrieve messages from rooms
- **Manage Tasks**: Create and manage tasks

## Author

- GitHub: [@hanabi-jpn](https://github.com/hanabi-jpn)
- Repository: https://github.com/hanabi-jpn/clawhub-skills
```

#### PRIVACY.md

```markdown
# Privacy Policy

## Data Collection
This plugin sends user-provided parameters (room IDs, messages, etc.) to the
ChatWork API. No personal user data is collected or stored by the plugin itself.

## Data Storage
API credentials are stored within the Dify platform's credential management
system. The plugin does not maintain any independent data storage.

## Third-Party Services
This plugin communicates with the ChatWork API (https://api.chatwork.com/v2/).
Refer to ChatWork's privacy policy for their data handling practices.
```

---

## 4. Step-by-Step: Package as .difypkg

Once you have a complete plugin project:

```bash
cd /path/to/my-plugin/

# Package the plugin
dify-plugin package ./

# This creates: my-plugin-v0.0.1.difypkg in the current directory
# The version comes from manifest.yaml
```

If `dify-plugin` CLI is not available, the `.difypkg` format is essentially a
ZIP archive with a specific structure. You can also package manually:

```bash
cd /path/to/my-plugin/
zip -r ../chatwork-agent-v0.0.1.difypkg . \
  -x '*.pyc' -x '__pycache__/*' -x '.git/*' -x '.DS_Store'
```

**Verify the package** by testing it in a local Dify instance:
```bash
# Start Dify locally with Docker
docker compose up -d

# Install plugin via Dify UI or API
# Navigate to: Settings -> Plugin Management -> Install from file
```

---

## 5. Step-by-Step: Submit PR

### 5.1 Fork the Repository

```bash
# Fork to hanabi-jpn account
gh repo fork langgenius/dify-plugins --clone=false

# Clone the fork
gh repo clone hanabi-jpn/dify-plugins /tmp/dify-plugins-submit
cd /tmp/dify-plugins-submit

# Add upstream remote
git remote add upstream https://github.com/langgenius/dify-plugins.git
git fetch upstream
git checkout main
git merge upstream/main --no-edit
```

### 5.2 Directory Structure in the Repo

The repo uses this structure:
```
langgenius/dify-plugins/
  {organization}/
    {plugin-name}/
      {plugin-name}-v{version}.difypkg
```

For us:
```
hanabi-jpn/
  chatwork-agent/
    chatwork-agent-v0.0.1.difypkg
  google-workspace-agent/
    google-workspace-agent-v0.0.1.difypkg
  google-ads-agent/
    google-ads-agent-v0.0.1.difypkg
  ga4-search-console/
    ga4-search-console-v0.0.1.difypkg
  kintone-agent/
    kintone-agent-v0.0.1.difypkg
  stripe-japan-agent/
    stripe-japan-agent-v0.0.1.difypkg
  fx-trader-pro/
    fx-trader-pro-v0.0.1.difypkg
  smarthr-agent/
    smarthr-agent-v0.0.1.difypkg
  line-agent/
    line-agent-v0.0.1.difypkg
  social-media-publisher/
    social-media-publisher-v0.0.1.difypkg
```

### 5.3 Create One PR Per Plugin (Recommended)

```bash
WORK_DIR="/tmp/dify-plugins-submit"

for plugin in chatwork-agent google-workspace-agent google-ads-agent \
              ga4-search-console kintone-agent stripe-japan-agent \
              fx-trader-pro smarthr-agent line-agent social-media-publisher; do

  cd "$WORK_DIR"
  git checkout main
  git pull upstream main

  BRANCH="feat/add-${plugin}"
  git checkout -b "$BRANCH"

  # Create directory and copy package
  mkdir -p "hanabi-jpn/${plugin}"
  cp "/path/to/built-packages/${plugin}-v0.0.1.difypkg" "hanabi-jpn/${plugin}/"

  # Commit and push
  git add "hanabi-jpn/${plugin}/"
  git commit -m "feat: add ${plugin} plugin by hanabi-jpn"
  git push origin "$BRANCH"

  # Create PR (see template below)
  gh pr create \
    --repo langgenius/dify-plugins \
    --title "feat: Add ${plugin} plugin by hanabi-jpn" \
    --body-file /tmp/pr-body-${plugin}.md \
    --head "hanabi-jpn:${BRANCH}" \
    --base main

  echo "Created PR for ${plugin}"
done
```

### 5.4 Alternative: Single PR for All 10

If submitting all at once is preferred:

```bash
cd "$WORK_DIR"
git checkout main
git checkout -b "feat/add-hanabi-jpn-plugins"

for plugin in chatwork-agent google-workspace-agent google-ads-agent \
              ga4-search-console kintone-agent stripe-japan-agent \
              fx-trader-pro smarthr-agent line-agent social-media-publisher; do
  mkdir -p "hanabi-jpn/${plugin}"
  cp "/path/to/built-packages/${plugin}-v0.0.1.difypkg" "hanabi-jpn/${plugin}/"
done

git add hanabi-jpn/
git commit -m "feat: add 10 ClawHub Skills plugins by hanabi-jpn"
git push origin "feat/add-hanabi-jpn-plugins"

gh pr create \
  --repo langgenius/dify-plugins \
  --title "feat: Add 10 ClawHub Skills plugins by hanabi-jpn" \
  --body-file /tmp/pr-body-all.md \
  --head "hanabi-jpn:feat/add-hanabi-jpn-plugins" \
  --base main
```

---

## 6. PR Template

Based on actual merged PRs (e.g., #2101 Actionbook, #2118 ZenMux), the Dify
repo uses a submission form with these sections:

```markdown
## Plugin Submission

### 1. Metadata
- **Plugin Author**: hanabi-jpn
- **Plugin Name**: chatwork-agent
- **Repository URL**: https://github.com/hanabi-jpn/clawhub-skills

### 2. Submission Type
- [x] New plugin submission
- [ ] Plugin update

### 3. Description

ChatWork Agent -- Automate Japan's #1 business chat platform (410K+ companies).
Send messages, manage tasks, handle rooms, build bots via ChatWork API v2.
Features rate-limit-safe operations, webhook signature validation, bulk
messaging, file management, and full Japanese text support.

**Plugin Type**: Tool
**Languages**: English, Japanese (en_US, ja_JP)

### 4. Checklist
- [x] I am the author of this plugin or have permission to submit it
- [x] My plugin follows the Dify Plugin Publishing Guidelines
- [x] I agree to the Dify Plugin Developer Agreement
- [x] I have tested my plugin on Dify Community Edition
- [x] I have tested my plugin on Dify Cloud
- [x] My plugin provides real value to users

### 5. Documentation Checklist
- [x] README with setup instructions
- [x] Usage documentation
- [x] API/credential requirements documented
- [x] Connection configuration guide
- [x] Source code repository link provided

### 6. Privacy Protection
**Data handling**: This plugin sends user-provided parameters to the ChatWork
API. No personal user data is collected or stored by the plugin itself.

- [x] Privacy policy included per Dify guidelines

### Related
Part of the ClawHub Skills collection -- 40 AI agent skills for the Japanese market.
https://github.com/hanabi-jpn/clawhub-skills
```

---

## 7. Per-Plugin Implementation Notes

### 7.1 chatwork-agent
- **API**: ChatWork API v2 (`https://api.chatwork.com/v2/`)
- **Auth**: API Token header (`X-ChatWorkToken`)
- **Tools**: send_message, get_messages, get_rooms, create_task, get_tasks, manage_room
- **Dependencies**: `requests`
- **Note**: Rate limiting (5 req/sec). Implement retry with backoff.

### 7.2 google-workspace-agent
- **API**: Gmail, Calendar, Drive, Sheets, Docs APIs
- **Auth**: OAuth 2.0 (client_id, client_secret, refresh_token)
- **Tools**: send_email, search_mail, create_event, list_events, upload_file, query_sheet, edit_doc
- **Dependencies**: `google-auth`, `google-api-python-client`, `google-auth-oauthlib`
- **Note**: Needs multiple Google API scopes. Complex OAuth flow.

### 7.3 google-ads-agent
- **API**: Google Ads API v17
- **Auth**: OAuth 2.0 + Developer Token
- **Tools**: get_campaigns, create_campaign, get_keywords, update_bids, get_report
- **Dependencies**: `google-ads`, `protobuf`
- **Note**: Requires Google Ads developer token (apply through Google).

### 7.4 ga4-search-console
- **API**: GA4 Data API + Search Console API
- **Auth**: OAuth 2.0
- **Tools**: run_report, get_realtime, search_analytics, get_sitemaps, url_inspection
- **Dependencies**: `google-analytics-data`, `google-auth`, `google-api-python-client`
- **Note**: GA4 uses the Data API (not UA). Property ID format: `properties/XXXXXX`.

### 7.5 kintone-agent
- **API**: kintone REST API
- **Auth**: API Token or OAuth (per-app tokens, comma-separated for multi-app)
- **Tools**: get_records, create_record, update_record, delete_records, get_app_schema, bulk_update
- **Dependencies**: `requests`
- **Note**: Already a kintone plugin in Dify marketplace (v0.1.2). Differentiate with advanced features or compete on quality.

### 7.6 stripe-japan-agent
- **API**: Stripe API
- **Auth**: Secret Key (`sk_test_` / `sk_live_`)
- **Tools**: create_payment, list_payments, create_invoice, manage_subscriptions, get_balance
- **Dependencies**: `stripe`
- **Note**: Japan-specific: PayPay, konbini, JPY (zero-decimal), dual tax rates.

### 7.7 fx-trader-pro
- **API**: OANDA v20 REST API
- **Auth**: API Key + Account ID
- **Tools**: get_prices, place_order, get_positions, get_candles, calculate_risk
- **Dependencies**: `requests`, `numpy`, `pandas`
- **Note**: Default to practice mode. Include kill switch. Financial tool -- extra scrutiny expected.

### 7.8 smarthr-agent
- **API**: SmartHR API v1
- **Auth**: Access Token + Tenant ID
- **Tools**: get_employees, create_employee, get_departments, generate_document
- **Dependencies**: `requests`
- **Note**: Handles PII (My Number). Emphasize security in privacy policy.

### 7.9 line-agent
- **API**: LINE Messaging API
- **Auth**: Channel Access Token + Channel Secret
- **Tools**: send_message, send_flex, get_profile, get_followers, broadcast, create_richmenu
- **Dependencies**: `line-bot-sdk`
- **Note**: Flex Messages require JSON template building. Include pre-built templates.

### 7.10 social-media-publisher
- **API**: X/Twitter API v2, Instagram Graph API, TikTok API, LINE Messaging API
- **Auth**: Multiple tokens (all optional, use what's configured)
- **Tools**: post_to_all, post_to_x, post_to_instagram, get_analytics, get_trending
- **Dependencies**: `requests`, `tweepy`
- **Note**: Multi-platform. Handle gracefully when only some credentials provided.

---

## 8. Automation Script

Updated `submit.sh` that handles the full pipeline:

```bash
#!/bin/bash
# Full pipeline: build .difypkg + submit PR
set -euo pipefail

PLUGINS_SRC="/Users/ishiharatatsuya/clawhub-skills/dify-plugins"
BUILD_DIR="/tmp/dify-plugin-builds"
SUBMIT_DIR="/tmp/dify-plugins-submit"
GITHUB_USER="hanabi-jpn"
UPSTREAM="langgenius/dify-plugins"

ALL_PLUGINS=(
  chatwork-agent google-workspace-agent google-ads-agent
  ga4-search-console kintone-agent stripe-japan-agent
  fx-trader-pro smarthr-agent line-agent social-media-publisher
)

echo "=== Phase 1: Build .difypkg packages ==="
for plugin in "${ALL_PLUGINS[@]}"; do
  echo "Building ${plugin}..."
  cd "${PLUGINS_SRC}/${plugin}"

  # Verify required files exist
  for f in manifest.yaml main.py requirements.txt; do
    if [[ ! -f "$f" ]]; then
      echo "  ERROR: Missing ${f} in ${plugin}. Cannot package."
      continue 2
    fi
  done

  # Package
  mkdir -p "${BUILD_DIR}"
  dify-plugin package ./ -o "${BUILD_DIR}/${plugin}-v0.0.1.difypkg"
  echo "  Built: ${BUILD_DIR}/${plugin}-v0.0.1.difypkg"
done

echo ""
echo "=== Phase 2: Submit PRs ==="

# Clone fork
if [[ -d "$SUBMIT_DIR" ]]; then rm -rf "$SUBMIT_DIR"; fi
gh repo fork "$UPSTREAM" --clone=false 2>/dev/null || true
gh repo clone "${GITHUB_USER}/dify-plugins" "$SUBMIT_DIR"
cd "$SUBMIT_DIR"
git remote add upstream "https://github.com/${UPSTREAM}.git" 2>/dev/null || true
git fetch upstream
git checkout main
git merge upstream/main --no-edit

for plugin in "${ALL_PLUGINS[@]}"; do
  PKG="${BUILD_DIR}/${plugin}-v0.0.1.difypkg"
  if [[ ! -f "$PKG" ]]; then
    echo "Skipping ${plugin} -- no .difypkg found"
    continue
  fi

  cd "$SUBMIT_DIR"
  git checkout main
  BRANCH="feat/add-${plugin}"
  git checkout -b "$BRANCH"

  mkdir -p "hanabi-jpn/${plugin}"
  cp "$PKG" "hanabi-jpn/${plugin}/"

  git add "hanabi-jpn/${plugin}/"
  git commit -m "feat: add ${plugin} plugin by hanabi-jpn"
  git push origin "$BRANCH" --force

  gh pr create \
    --repo "$UPSTREAM" \
    --title "feat: Add ${plugin} plugin by hanabi-jpn" \
    --head "${GITHUB_USER}:${BRANCH}" \
    --base main \
    --body "$(cat <<PREOF
## Plugin Submission

### 1. Metadata
- **Plugin Author**: hanabi-jpn
- **Plugin Name**: ${plugin}
- **Repository URL**: https://github.com/hanabi-jpn/clawhub-skills

### 2. Submission Type
- [x] New plugin submission

### 3. Description
ClawHub Skills plugin for the Japanese market.
See repository for full documentation.

**Plugin Type**: Tool
**Languages**: English, Japanese

### 4. Checklist
- [x] I am the author of this plugin
- [x] Follows Dify Plugin Publishing Guidelines
- [x] Tested on Dify Community Edition
- [x] Provides real value to users

### 5. Documentation
- [x] README with setup instructions
- [x] Source code repository link

### 6. Privacy
No personal data collected or stored by the plugin.
- [x] Privacy policy included

### Related
Part of ClawHub Skills -- AI agent skills for the Japanese market.
PREOF
)"

  echo "PR created for ${plugin}"
done

echo ""
echo "=== Done ==="
```

---

## 9. References

- **Dify Plugins Repo**: https://github.com/langgenius/dify-plugins
- **Dify Plugin Docs**: https://docs.dify.ai/plugins
- **Plugin Development Guide**: https://docs.dify.ai/plugins/quick-start/develop-plugins
- **Plugin Publishing Guide**: https://docs.dify.ai/plugins/publish-plugins/publish-to-dify-marketplace
- **Dify Plugin SDK (Python)**: https://github.com/langgenius/dify-plugin-daemon
- **Example merged PRs**:
  - #2101 Actionbook (new plugin): `actionbook/actionbook/actionbook-v0.1.1.difypkg`
  - #2118 ZenMux (new plugin): `ZenMux/dify-plugin/zenmux-dify-plugin_0.0.7.difypkg`
  - #2104 kintone v0.1.2 (version bump)

---

## Quick Start Checklist

For each of the 10 plugins, complete these steps in order:

- [ ] 1. Install Dify Plugin CLI: `pip install dify-plugin-daemon`
- [ ] 2. Create `main.py` (entrypoint)
- [ ] 3. Create `provider/` directory with YAML + Python credential validation
- [ ] 4. Create `tools/` directory with YAML definitions + Python implementations
- [ ] 5. Create `requirements.txt` with dependencies
- [ ] 6. Create `_assets/icon.svg`
- [ ] 7. Create `README.md` and `PRIVACY.md`
- [ ] 8. Test locally: `dify-plugin run ./`
- [ ] 9. Package: `dify-plugin package ./`
- [ ] 10. Test `.difypkg` in a Dify instance
- [ ] 11. Fork `langgenius/dify-plugins` to `hanabi-jpn`
- [ ] 12. Create branch, copy `.difypkg`, commit, push
- [ ] 13. Create PR with submission template
- [ ] 14. Respond to reviewer feedback

### Priority Order (recommended)

1. **chatwork-agent** -- Simple API, good first submission
2. **line-agent** -- High demand in Japan market
3. **kintone-agent** -- Already a competitor; differentiate
4. **ga4-search-console** -- Broad appeal
5. **google-workspace-agent** -- Complex but high value
6. **stripe-japan-agent** -- Niche but valuable
7. **smarthr-agent** -- HR market
8. **google-ads-agent** -- Marketing market
9. **social-media-publisher** -- Multi-platform complexity
10. **fx-trader-pro** -- Financial tool, highest scrutiny
