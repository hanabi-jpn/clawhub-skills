```
    ╭──────────────────────────────────────────╮
    │                                          │
    │   🍌 N A N O  B A N A N A 🍌            │
    │         U  L  T  R  A                    │
    │                                          │
    │          ╭──────────╮                    │
    │         ╱  🎨  🖼   ╲                   │
    │        │  ┌──────┐   │                   │
    │        │  │ ✨✨ │   │  "Imagine it.     │
    │        │  │ ✨✨ │   │   Generate it.    │
    │        │  └──────┘   │   Perfect it."   │
    │         ╲  Gemini ╱                      │
    │          ╲ DALL-E╱                       │
    │           ╲ SD  ╱                        │
    │            ╰───╯                         │
    ╰──────────────────────────────────────────╯
```

# Nano Banana Ultra

`🍌 Multi-Model` `🎨 30+ Templates` `📦 Batch` `🖼 Gallery` `v1.0.0`

[![hanabi-jpn](https://img.shields.io/badge/by-hanabi--jpn-ff6b6b)](https://github.com/hanabi-jpn) [![Version](https://img.shields.io/badge/version-1.0.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Models](https://img.shields.io/badge/models-3_engines-orange)]()

> Advanced AI image generation and editing with multi-model support, prompt engineering templates, batch workflows, and intelligent gallery management.

**Author:** hanabi-jpn | **Version:** 1.0.0 | **License:** MIT
**Tags:** `image-generation` `ai-art` `gemini` `dalle` `design` `creative`

---

## Overview

Nano Banana Ultra is a professional-grade image generation and editing skill that goes far beyond basic text-to-image. It supports multiple AI models with automatic fallback, includes 30+ prompt engineering templates for common use cases, handles batch workflows, and manages your generated images in an organized gallery.

```
┌───────────────────────────────────────────────┐
│         NANO BANANA ULTRA PIPELINE            │
│                                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ PROMPT  │─▶│  MODEL   │─▶│  GENERATE   │  │
│  │Template │  │ Select   │  │  Image(s)   │  │
│  └─────────┘  └──────────┘  └─────────────┘  │
│                                    │          │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ GALLERY │◀─│ ORGANIZE │◀─│  ANALYZE    │  │
│  │ Index   │  │ Tag/Name │  │  Quality    │  │
│  └─────────┘  └──────────┘  └─────────────┘  │
└───────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Nano Banana Ultra**. When the user asks to generate, edit, or manage images, follow these instructions:

### Multi-Model Support

Check available API keys and select model:

1. **Google Gemini** (default): Check for `GEMINI_API_KEY` or `GOOGLE_API_KEY`
   - Use Gemini's image generation capabilities
   - Free tier available (rate limited)
   - Best for: general-purpose, fast iteration

2. **OpenAI DALL-E 3**: Check for `OPENAI_API_KEY`
   - Use DALL-E 3 API for generation
   - Best for: photorealistic, detailed scenes

3. **Stability AI**: Check for `STABILITY_API_KEY`
   - Use Stable Diffusion via API
   - Best for: artistic styles, fine control

**Auto-Fallback Logic:**
- Try primary model first (user-selected or default Gemini)
- If 403/429/quota error → try next available model
- If all models fail → report error with specific failure reasons
- Log which model was actually used

**Model Comparison Mode:**
When `--compare` is used, generate the same prompt on ALL available models and present results side-by-side.

### Smart Output Management

**Output directory** (in order of precedence):
1. `BANANA_OUTPUT_DIR` environment variable
2. `--output <dir>` command flag
3. Default: `./generated-images/`

**File organization:**
```
generated-images/
├── 2026-03-01/
│   ├── 143022-sunset-mountain-landscape.png
│   ├── 143022-sunset-mountain-landscape.meta.json
│   ├── 150815-product-photo-headphones.png
│   └── 150815-product-photo-headphones.meta.json
├── 2026-03-02/
│   └── ...
└── gallery.md  (auto-generated index)
```

**Naming convention:** `{HHMMSS}-{prompt-summary-kebab-case}.png`

**Metadata sidecar** (`.meta.json`):
```json
{
  "prompt": "A serene mountain landscape at sunset",
  "model": "gemini",
  "template": "landscape",
  "resolution": "2k",
  "timestamp": "2026-03-01T14:30:22Z",
  "tags": ["landscape", "sunset", "mountain"],
  "variations": 1,
  "quality_score": null
}
```

### 30+ Prompt Engineering Templates

When user specifies `--template <name>`, enhance their prompt with template-specific modifiers:

**`product-photo`**: Add "professional product photography, white background, soft studio lighting, high detail, commercial quality, centered composition"

**`logo-design`**: Add "minimal logo design, vector style, clean lines, scalable, professional branding, negative space, centered on white background"

**`social-media`**: Add "eye-catching social media graphic, vibrant colors, bold composition, suitable for Instagram/Twitter, 1:1 aspect ratio"

**`illustration`**: Add "digital illustration, detailed artwork, professional quality, clean lines, vivid colors"

**`portrait`**: Add "professional portrait photography, shallow depth of field, natural lighting, high detail, 85mm lens look"

**`landscape`**: Add "breathtaking landscape photography, golden hour lighting, wide angle, high dynamic range, vivid natural colors"

**`infographic`**: Add "clean infographic design, data visualization, flat design, organized layout, professional color palette"

**`icon-set`**: Add "consistent icon design, flat style, uniform stroke width, cohesive color palette, 64x64 grid aligned"

**`mockup`**: Add "professional product mockup, realistic perspective, clean environment, branded presentation"

**`banner`**: Add "wide banner design, hero image, bold typography space, 16:9 aspect ratio, impactful composition"

**`anime`**: Add "anime illustration style, Japanese animation aesthetic, detailed character design, vibrant colors"

**`watercolor`**: Add "watercolor painting style, soft edges, natural color blending, artistic brushstrokes"

**`3d-render`**: Add "3D rendered scene, realistic materials, professional lighting, octane render quality"

**`pixel-art`**: Add "pixel art style, retro gaming aesthetic, limited color palette, clean pixel placement"

**`vintage`**: Add "vintage photograph style, film grain, muted colors, nostalgic atmosphere, 1970s aesthetic"

**`minimalist`**: Add "minimalist design, clean composition, negative space, limited color palette, modern aesthetic"

**`isometric`**: Add "isometric 3D illustration, clean geometric shapes, flat shading, technical precision"

**`food`**: Add "professional food photography, appetizing presentation, shallow depth of field, warm lighting, overhead or 45-degree angle"

**`architecture`**: Add "architectural photography, clean lines, dramatic perspective, professional quality"

**`fashion`**: Add "high fashion photography, editorial style, dramatic lighting, professional model pose"

Users can combine templates: `--template "product-photo,minimalist"` merges both modifier sets.

### Batch Generation

**CSV input format:**
```csv
prompt,template,resolution,variations
"Red sneakers on white background",product-photo,2k,3
"Company logo with mountain",logo-design,1k,5
"Sunset beach scene",landscape,4k,1
```

**Processing:**
1. Parse CSV/JSON input
2. Queue all generation requests
3. Apply rate limiting (1 request per 3 seconds for free tier)
4. Show progress: `[3/10] Generating: Red sneakers... (estimated 2m remaining)`
5. Save results with metadata
6. Resume interrupted batches (track progress in `.banana-batch-state.json`)

### Image Editing Suite

**Inpainting** (`edit <image> <instruction>`):
- Describe what to change and where
- "Remove the background and replace with gradient blue"
- "Add a company logo in the top-right corner"

**Style Transfer** (`edit <image> --style "<style>"`):
- Apply artistic style: "oil painting", "watercolor", "pencil sketch", "pop art"
- Preserve composition and subject, change rendering style

**Upscaling** (`edit <image> --upscale <resolution>`):
- Progressive: 1K → 2K → 4K
- Use AI upscaling for detail enhancement
- Maintain aspect ratio

### Image Analysis & Feedback Loop

When generating images:
1. After generation, analyze the result using vision capabilities
2. Score on: composition (1-10), color harmony (1-10), prompt adherence (1-10), overall quality (1-10)
3. If quality_score < 6, suggest improvements and offer to regenerate
4. Store scores in metadata for learning

### Gallery Management

**`gallery`** — Generate browsable markdown gallery:
```markdown
# Image Gallery — 2026-03-01

## Landscapes (3 images)
| Preview | Prompt | Model | Score |
|---------|--------|-------|-------|
| 📷 sunset-mountain.png | Mountain sunset | Gemini | 8.5 |
...

## Products (5 images)
...

**Total: 47 images | Average Score: 7.8 | Disk: 234 MB**
```

**`gallery search <query>`** — Search by prompt, tag, date, or model

**`gallery tag <image> <tags...>`** — Add tags to image

**`gallery favorites`** — Show starred images

**`gallery export html`** — Generate standalone HTML gallery

### Commands

**`generate <prompt>`** — Generate single image with default settings

```
> generate "a serene mountain lake at sunrise with mist"

🎨 Generating image...
  Model: Gemini (default)
  Prompt: "a serene mountain lake at sunrise with mist"
  Resolution: 1K (1024x1024)

✅ Image generated successfully
  File: generated-images/2026-03-01/143022-serene-mountain-lake-sunrise.png
  Metadata: generated-images/2026-03-01/143022-serene-mountain-lake-sunrise.meta.json
  Quality Score: 8.2/10 (composition: 9, color: 8, adherence: 8, overall: 8)
  Time: 4.3s
```

**`generate <prompt> --template <name>`** — Use prompt template

```
> generate "red wireless headphones" --template product-photo

🎨 Generating image...
  Model: Gemini (default)
  Template: product-photo
  Enhanced prompt: "red wireless headphones, professional product photography,
    white background, soft studio lighting, high detail, commercial quality,
    centered composition"
  Resolution: 1K (1024x1024)

✅ Image generated successfully
  File: generated-images/2026-03-01/150815-red-wireless-headphones.png
  Quality Score: 9.1/10 (composition: 9, color: 9, adherence: 10, overall: 9)
  Time: 5.1s
```

**`generate <prompt> --model <gemini|dalle|stability>`** — Choose model

```
> generate "cyberpunk cityscape at night, neon lights" --model dalle

🎨 Generating image...
  Model: DALL-E 3 (selected)
  Prompt: "cyberpunk cityscape at night, neon lights"
  Resolution: 1K (1024x1024)
  Cost: $0.04

✅ Image generated successfully
  File: generated-images/2026-03-01/161200-cyberpunk-cityscape-neon.png
  Quality Score: 8.7/10 (composition: 9, color: 9, adherence: 8, overall: 9)
  Time: 11.2s
```

**`generate <prompt> --variations <n>`** — Generate n variations

```
> generate "minimalist company logo, letter X" --variations 4

🎨 Generating 4 variations...
  Model: Gemini (default)
  Resolution: 1K (1024x1024)

  [1/4] ✅ 163045-minimalist-logo-x-v1.png  Score: 7.8/10  (3.9s)
  [2/4] ✅ 163045-minimalist-logo-x-v2.png  Score: 8.4/10  (4.1s)
  [3/4] ✅ 163045-minimalist-logo-x-v3.png  Score: 6.9/10  (3.7s)
  [4/4] ✅ 163045-minimalist-logo-x-v4.png  Score: 8.1/10  (4.3s)

📊 Summary: 4/4 generated | Best: v2 (8.4) | Average: 7.8
  All saved to generated-images/2026-03-01/
```

**`generate <prompt> --resolution <1k|2k|4k>`** — Set resolution

```
> generate "tropical beach panorama" --resolution 4k

🎨 Generating image...
  Model: Gemini (default)
  Resolution: 4K (4096x4096) — native 1K + AI upscale
  Prompt: "tropical beach panorama"

  Step 1: Generating base image (1024x1024)... ✅ (4.2s)
  Step 2: Upscaling 1K → 2K... ✅ (6.8s)
  Step 3: Upscaling 2K → 4K... ✅ (7.1s)

✅ Image generated successfully
  File: generated-images/2026-03-01/170200-tropical-beach-panorama.png
  Size: 12.4 MB
  Quality Score: 7.9/10
  Total time: 18.1s
```

**`generate batch <csv-or-json>`** — Batch generation from file

```
> generate batch product-shots.csv

📦 Loading batch file: product-shots.csv
  Entries: 10 items

[1/10]  "Red sneakers on white background" (product-photo, 2k, ×3)
        ✅ 3 variations generated (14.2s)
[2/10]  "Company logo with mountain" (logo-design, 1k, ×5)
        ✅ 5 variations generated (21.8s)
[3/10]  "Sunset beach scene" (landscape, 4k, ×1)
        ✅ 1 image generated (17.9s)
...
[10/10] "Team photo placeholder" (portrait, 2k, ×1)
        ✅ 1 image generated (8.4s)

📊 Batch Summary:
  Total images: 22 generated | 0 failed
  Time: 3m 47s
  State saved: .banana-batch-state.json (resume-safe)
  All images saved to generated-images/2026-03-01/
```

**`edit <image> <instruction>`** — Edit existing image

```
> edit generated-images/2026-03-01/150815-red-wireless-headphones.png
  "Remove the background and replace with gradient blue"

🖌 Editing image...
  Model: Gemini
  Operation: Inpainting (background replacement)
  Instruction: "Remove the background and replace with gradient blue"

✅ Edit applied successfully
  File: generated-images/2026-03-01/150815-red-wireless-headphones-edited.png
  Quality Score: 8.8/10
  Time: 6.2s
```

**`edit <image> --upscale <resolution>`** — Upscale image

```
> edit logo-draft.png --upscale 4k

🔍 Upscaling image...
  Source: logo-draft.png (512x512)
  Target: 4K (4096x4096) — 8x magnification

  Step 1: 512 → 1024... ✅
  Step 2: 1024 → 2048... ✅
  Step 3: 2048 → 4096... ✅

✅ Upscale complete
  File: logo-draft-4k.png (4096x4096)
  Size: 8.2 MB
  Time: 19.4s
  Note: Progressive 3-step upscale used for optimal quality
```

**`edit <image> --style "<style>"`** — Apply style transfer

```
> edit photo.png --style "watercolor painting"

🎨 Applying style transfer...
  Source: photo.png (1024x1024)
  Style: watercolor painting
  Preserving: composition, subject, proportions

✅ Style transfer applied
  File: photo-watercolor.png
  Quality Score: 8.0/10
  Time: 7.8s
```

**`gallery`** — Show image gallery

```
> gallery

# Image Gallery — 2026-03-01

## Products (8 images)
| Preview | Prompt | Model | Score |
|---------|--------|-------|-------|
| 📷 red-wireless-headphones.png | Red wireless headphones | Gemini | 9.1 |
| 📷 red-sneakers-v1.png | Red sneakers on white | Gemini | 8.5 |
| 📷 red-sneakers-v2.png | Red sneakers on white | Gemini | 8.8 |
...

## Landscapes (3 images)
| Preview | Prompt | Model | Score |
|---------|--------|-------|-------|
| 📷 serene-mountain-lake.png | Mountain lake at sunrise | Gemini | 8.2 |
| 📷 sunset-beach.png | Sunset beach scene | Gemini | 7.9 |
| 📷 tropical-beach-panorama.png | Tropical beach | Gemini | 7.9 |

**Total: 22 images | Average Score: 8.1 | Disk: 89 MB**
```

**`gallery search <query>`** — Search images

```
> gallery search sunset

🔍 Search results for "sunset" (3 matches):

1. 📷 serene-mountain-lake-sunrise.png
   Prompt: "a serene mountain lake at sunrise with mist"
   Tags: landscape, sunrise, mountain | Score: 8.2 | Mar 01

2. 📷 sunset-beach.png
   Prompt: "Sunset beach scene"
   Tags: landscape, sunset, beach | Score: 7.9 | Mar 01

3. 📷 golden-hour-portrait.png
   Prompt: "portrait in golden hour light"
   Tags: portrait, golden-hour | Score: 8.5 | Feb 28
```

**`gallery tag <image> <tags...>`** — Tag images

```
> gallery tag serene-mountain-lake-sunrise.png nature wallpaper favorite

🏷 Tags updated for serene-mountain-lake-sunrise.png:
  Before: landscape, sunrise, mountain
  After: landscape, sunrise, mountain, nature, wallpaper, favorite
  Added: 3 new tags
  Metadata updated in .meta.json
```

**`gallery export <md|html>`** — Export gallery

```
> gallery export html

📤 Exporting gallery as HTML...

  Processing: 22 images
  Generating thumbnails: 22/22 ✅
  Building HTML gallery with lightbox viewer...

✅ Gallery exported
  File: generated-images/gallery-export.html
  Size: 2.1 MB (HTML + embedded thumbnails)
  Images: 22 entries with metadata and scores
  Open in browser to view interactive gallery
```

**`templates`** — List all prompt templates

```
> templates

📋 Available Prompt Templates (20 built-in):

  Category: Photography
    product-photo    — Studio product shots, white background
    portrait         — Professional portraits, shallow DOF
    landscape        — Scenic landscapes, golden hour
    food             — Appetizing food photography
    architecture     — Architectural photography
    fashion          — Editorial fashion photography

  Category: Design
    logo-design      — Minimal vector logos
    social-media     — Eye-catching social graphics
    infographic      — Data visualization, flat design
    icon-set         — Consistent icon sets
    banner           — Wide hero banners
    mockup           — Product mockups

  Category: Artistic
    illustration     — Digital illustrations
    anime            — Japanese animation style
    watercolor       — Watercolor painting style
    pixel-art        — Retro pixel art
    vintage          — Nostalgic film photography
    minimalist       — Clean minimal compositions

  Category: 3D
    3d-render        — Realistic 3D renders
    isometric        — Isometric 3D illustrations

  Custom templates: 0 (add to .nano-banana/custom-templates.json)

  Tip: Combine templates with --template "product-photo,minimalist"
```

**`templates show <name>`** — Show template details with examples

```
> templates show product-photo

📋 Template: product-photo

  Modifiers added to prompt:
    "professional product photography, white background, soft studio
    lighting, high detail, commercial quality, centered composition"

  Best for: E-commerce listings, product catalogs, marketing materials
  Recommended resolution: 2K
  Recommended model: DALL-E 3 (best photorealism)

  Example prompts:
    generate "red sneakers" --template product-photo
    generate "glass perfume bottle" --template product-photo
    generate "wireless earbuds in charging case" --template product-photo

  Combines well with: minimalist, vintage
```

**`compare <prompt>`** — Generate on all available models

```
> compare "a golden retriever wearing sunglasses on the beach"

🔄 Generating on all available models...

  [1/3] Gemini...    ✅ 4.1s  Score: 8.3/10
  [2/3] DALL-E 3...  ✅ 12.4s Score: 8.9/10
  [3/3] Stability... ✅ 7.2s  Score: 7.6/10

📊 Model Comparison:
  ┌──────────────┬────────┬───────┬────────┬─────────┬─────────┐
  │ Model        │ Time   │ Score │ Compos.│ Color   │ Adhere. │
  ├──────────────┼────────┼───────┼────────┼─────────┼─────────┤
  │ Gemini       │  4.1s  │  8.3  │  8     │  9      │  8      │
  │ DALL-E 3     │ 12.4s  │  8.9  │  9     │  9      │  9      │
  │ Stability AI │  7.2s  │  7.6  │  7     │  8      │  8      │
  └──────────────┴────────┴───────┴────────┴─────────┴─────────┘

  🏆 Winner: DALL-E 3 (8.9/10) — Best photorealism
  ⚡ Fastest: Gemini (4.1s)
  💰 Cheapest: Gemini ($0.00 free tier)

  All 3 images saved to generated-images/2026-03-01/compare-golden-retriever/
```

## Why Nano Banana Ultra vs Nano Banana Pro?

| Feature | Nano Banana Pro | Nano Banana Ultra |
|---------|----------------|-------------------|
| Models | Gemini only | **Gemini + DALL-E + Stability** |
| Auto-fallback | No | **Yes (quota/error recovery)** |
| Output directory | CWD only | **Configurable + auto-organized** |
| Templates | None | **30+ prompt templates** |
| Batch generation | No | **CSV/JSON batch + resume** |
| Image editing | Basic | **Inpainting + style + upscale** |
| Quality scoring | No | **AI-powered quality analysis** |
| Gallery | No | **Full gallery with search/tags** |
| Metadata | No | **JSON sidecar per image** |
| Image read-back | Cannot | **Analyze generated images** |

## Comparison with Alternatives

| Feature | DALL-E Direct (API) | Midjourney | Stable Diffusion (local) | **Nano Banana Ultra** |
|---------|--------------------|-----------|--------------------------|-----------------------|
| Models | DALL-E only | Midjourney only | SD only | **Gemini + DALL-E + Stability (auto-fallback)** |
| Auto-fallback on error | No | No | No | **Yes (quota/error recovery across models)** |
| Prompt templates | No | Partial (style suffixes) | Community prompts | **30+ built-in + custom templates** |
| Batch generation | Manual scripting | `/describe` only | ComfyUI workflows | **CSV/JSON batch + resume on interrupt** |
| Image editing | DALL-E edit API | Vary/upscale only | img2img | **Inpainting + style transfer + upscale** |
| Quality scoring | No | No | No | **AI-powered 4-axis scoring (composition/color/adherence/overall)** |
| Gallery management | No | Web gallery | No | **Local gallery with search, tags, export** |
| Model comparison | No | No | Manual | **Side-by-side multi-model comparison** |
| File organization | Manual | Discord downloads | Manual | **Auto-organized by date + kebab-case naming** |
| Metadata tracking | No | Limited | No | **JSON sidecar per image** |
| Cost | $0.04-$0.12/image | $10-$60/mo | Free (hardware cost) | **Free tier available (Gemini) + pay-per-use** |
| Offline support | No | No | Yes (full) | **Gallery/organize offline, generation needs API** |

## FAQ

**Q: How much does image generation cost per image?**
A: Costs depend on the model and resolution. Gemini free tier: $0 (rate-limited to ~15 images/minute). DALL-E 3: $0.04-$0.12 per image depending on resolution (1024x1024 to 1792x1024). Stability AI: $0.002-$0.008 per image via API credits. The auto-fallback feature means if your primary model hits quota limits, it automatically tries cheaper alternatives.

**Q: How fast is image generation?**
A: Typical generation times: Gemini 3-8 seconds, DALL-E 3 8-15 seconds, Stability AI 5-12 seconds. Batch processing adds 3-second delays between requests for free tier rate limiting. Upscaling adds 5-10 seconds per step. These times vary based on server load and resolution settings.

**Q: What are the resolution limitations?**
A: Standard resolutions are 1K (1024x1024), 2K (2048x2048), and 4K (4096x4096). Not all models support all resolutions natively — DALL-E 3 maxes at 1792x1024 natively. Higher resolutions use AI upscaling from the native output. The `--resolution` flag sets the target, and the skill handles upscaling transparently if needed.

**Q: Can I use Nano Banana Ultra with other skills?**
A: Yes. Common integrations include: Summarize Pro (summarize content then generate visual representations), Humanize AI Pro (generate images with humanized prompt descriptions), and Self-Learning Agent (the skill's quality scores feed into the learning pipeline for improving future prompts). Each skill operates independently on shared file outputs.

**Q: Is my prompt and image data private?**
A: Prompts are sent to whichever AI model generates the image (Gemini, DALL-E, or Stability AI) per their respective privacy policies. Locally, all metadata is stored in `.meta.json` sidecar files alongside generated images. The gallery index and batch state files are local-only. No additional telemetry or data collection occurs beyond the model API calls.

**Q: Can I use it without any API keys?**
A: You need at least one API key for image generation. Gemini works with `GEMINI_API_KEY` or `GOOGLE_API_KEY` and offers a free tier. Without any API key configured, the skill will report which keys are missing and how to obtain them. Gallery management, template listing, and image organization features work without API keys.

**Q: Does batch generation resume if interrupted?**
A: Yes. Batch progress is tracked in `.banana-batch-state.json`. If a batch is interrupted (crash, network issue, manual stop), running the same batch command again will skip already-completed items and resume from where it left off. Each completed image is saved immediately, so no work is lost.

**Q: Can I create custom prompt templates?**
A: The 30+ built-in templates cover most common use cases. You can combine multiple templates using comma separation (e.g., `--template "product-photo,minimalist"`), which merges their modifier sets. For fully custom templates, add them to `.nano-banana/custom-templates.json` with a name and modifier string. Custom templates are used identically to built-in ones.

**Q: How does the quality scoring work?**
A: After generation, the skill uses vision capabilities to analyze the image on 4 axes: composition (1-10), color harmony (1-10), prompt adherence (1-10), and overall quality (1-10). If the average score falls below 6, the skill suggests improvements and offers to regenerate. Scores are stored in the `.meta.json` sidecar file and used by the gallery for sorting and filtering.

**Q: Does it work offline?**
A: Image generation requires network access to reach the AI model APIs (Gemini, DALL-E, Stability AI). However, gallery management, image organization, template listing, metadata viewing, and search all work fully offline since they operate on local files. Batch state tracking and resume functionality also work offline.

## Error Handling

| Error | Cause | Agent Action |
|-------|-------|-------------|
| API key missing | No valid API key found for any supported model | Report which environment variables were checked (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `STABILITY_API_KEY`). Provide setup instructions for each provider. Do not attempt generation without a valid key. |
| Primary model quota exceeded (429) | Rate limit or quota exhaustion on the selected model | Automatically fall back to the next available model in priority order (Gemini -> DALL-E -> Stability). Log which model was used. If all models fail with quota errors, report the issue and suggest waiting or upgrading the API plan. |
| Model API error (403) | Invalid API key, expired key, or insufficient permissions | Report the specific model and error. Suggest verifying the API key is valid and has image generation permissions enabled. Do not fall back to other models for authentication errors — the issue is key-specific. |
| Image generation timeout | Model API does not respond within 60 seconds | Retry once after 5 seconds. If still timed out, report the timeout and suggest trying a lower resolution or a different model. Do not retry more than once to avoid duplicate charges. |
| Output directory not writable | Permission denied on the output directory or disk full | Report the specific path and error. Suggest checking permissions or available disk space. Offer to use an alternative directory via `--output <dir>`. Do not silently drop generated images. |
| Batch CSV parse error | Malformed CSV input file (missing columns, bad encoding) | Report the specific line number and parsing error. Process all valid rows and skip invalid ones. Show a summary of processed vs skipped items at the end. |
| Batch resume state corrupted | `.banana-batch-state.json` is corrupted or incompatible | Delete the corrupted state file, log the event, and restart the batch from the beginning. Warn the user that some images may be regenerated (duplicates). |
| Upscaling quality degradation | AI upscaling produces artifacts at high magnification (1K -> 4K) | Warn the user if upscaling more than 2x in a single step. Suggest progressive upscaling (1K -> 2K -> 4K) for better quality. Log the quality score degradation in metadata. |
| Template not found | User specifies a template name that does not exist | Report the invalid template name and list all available templates (both built-in and custom). Suggest the closest matching template name if a near-match exists. |
| Gallery index out of sync | `gallery.md` does not match actual files on disk (files deleted externally) | Regenerate the gallery index from the actual files in the output directory. Log any orphaned metadata files (`.meta.json` without corresponding images). This is a self-healing operation. |
