# Nano Banana Ultra

> Advanced AI image generation and editing with multi-model support, prompt engineering templates, batch workflows, and intelligent gallery management.

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** image-generation, ai-art, gemini, dalle, design, creative

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
**`generate <prompt> --template <name>`** — Use prompt template
**`generate <prompt> --model <gemini|dalle|stability>`** — Choose model
**`generate <prompt> --variations <n>`** — Generate n variations
**`generate <prompt> --resolution <1k|2k|4k>`** — Set resolution
**`generate batch <csv-or-json>`** — Batch generation from file
**`edit <image> <instruction>`** — Edit existing image
**`edit <image> --upscale <resolution>`** — Upscale image
**`edit <image> --style "<style>"`** — Apply style transfer
**`gallery`** — Show image gallery
**`gallery search <query>`** — Search images
**`gallery tag <image> <tags...>`** — Tag images
**`gallery export <md|html>`** — Export gallery
**`templates`** — List all prompt templates
**`templates show <name>`** — Show template details with examples
**`compare <prompt>`** — Generate on all available models

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
