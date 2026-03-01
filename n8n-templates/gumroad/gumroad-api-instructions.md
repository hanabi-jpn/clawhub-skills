# Gumroad API Setup Instructions

How to get a Gumroad Access Token and use the `create-product.sh` script to create the "n8n Japan Business Automation Pack" product via API.

---

## Step 1: Get Your Gumroad Access Token

1. Log in to Gumroad as **hanabi-jpn** at https://gumroad.com
2. Go to **Settings** (gear icon or https://gumroad.com/settings)
3. Click the **Advanced** tab (or go directly to https://gumroad.com/settings/advanced#application-form)
4. Scroll down to the **Applications** section
5. Click **"Create application"**
6. Fill in the form:
   - **Application name**: `hanabi-jpn-cli`
   - **Full redirect URI**: `http://localhost` (not used for API-only access, but required)
7. Click **"Create application"**
8. After creation, you will see your **Application ID** and **Application Secret**
9. Click **"Generate Access Token"** to get a personal access token
10. Copy the access token -- you will need it in the next step

**Important**: The access token gives full access to your Gumroad account. Do not share it or commit it to git. Store it securely.

---

## Step 2: Run the Script

```bash
# Set the access token as an environment variable
export GUMROAD_ACCESS_TOKEN="your_access_token_here"

# Navigate to the script directory
cd /Users/ishiharatatsuya/clawhub-skills/n8n-templates/gumroad/

# Make the script executable (if not already)
chmod +x create-product.sh

# Run the script
bash create-product.sh
```

---

## What the Script Does

1. **Creates the product** via `POST /v2/products` with:
   - Name: "n8n Japan Business Automation Pack"
   - Price: $49 (4900 cents)
   - Description: Full product description from product-listing.md
   - Customizable price enabled (pay-what-you-want with $49 minimum)

2. **Uploads the ZIP file** via `PUT /v2/products/:id` with:
   - File: `hanabi-jpn-n8n-japan-business-pack-v1.zip`

3. **Publishes the product** (sets `published=true`)

4. **Verifies** the product was created correctly and saves product info to `product-info.json`

---

## After the Script Runs

Even after successful API creation, you should manually:

1. **Add a cover image** (1280x720 recommended):
   - Go to https://app.gumroad.com/products/<PRODUCT_ID>/edit
   - Upload a cover image created in Canva
   - Use n8n's brand orange (#FF6D5A) on dark background

2. **Verify the file upload**:
   - Check the Content tab to ensure the ZIP is attached
   - If the API upload failed, manually upload the ZIP from:
     `/Users/ishiharatatsuya/clawhub-skills/n8n-templates/gumroad/hanabi-jpn-n8n-japan-business-pack-v1.zip`

3. **Create a discount code** (optional):
   - Go to the product's Checkout tab
   - Create code: `LAUNCH40` (40% off, limited to 50 uses)

4. **Add tags** in the product editor:
   - n8n, automation, workflow, ChatWork, kintone, Stripe, Japan, business, templates, no-code

5. **Review the product page** and confirm everything looks correct

---

## Gumroad API Reference

Base URL: `https://api.gumroad.com/v2`

### Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update product (upload file, publish) |
| GET | `/products/:id` | Retrieve product details |

### Authentication

All requests include `access_token` as a form field or query parameter.

### Full API Docs

https://app.gumroad.com/api

---

## Troubleshooting

**"access_token is invalid"**
- Your token may have expired. Generate a new one at Settings > Advanced > Applications.

**File upload fails**
- Gumroad API file uploads can be unreliable for larger files.
- Upload manually through the web UI if the API upload fails.
- The script will print manual upload instructions if this happens.

**"jq: command not found"**
- Install jq: `brew install jq`

**Product created but not visible**
- Check that `published=true` was set.
- Go to the product edit page and click Publish manually if needed.

---

## Manual Alternative (No API)

If the API approach does not work, you can create the product entirely through the Gumroad web UI:

1. Go to https://app.gumroad.com
2. Click "New product" in the left sidebar
3. Choose "Digital product"
4. Fill in the details from `product-listing.md`
5. Upload the ZIP from the Content tab
6. Set price to $49
7. Click Publish

See `gumroad-setup.md` for the full step-by-step web UI guide.
