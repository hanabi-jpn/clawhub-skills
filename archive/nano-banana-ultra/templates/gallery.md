# Nano Banana Ultra - Image Gallery

**Generated:** {{timestamp}}
**Gallery Path:** {{gallery_path}}
**Period:** {{period_start}} to {{period_end}}

---

## Gallery Statistics

```
╔═════════════════════════════════════════════════╗
║            Gallery Overview                     ║
╠═════════════════════════════════════════════════╣
║ Total Images:      {{total_images}}             ║
║ Total Disk Usage:  {{total_disk_usage}}          ║
║ Average Score:     {{avg_quality_score}} / 10    ║
║ Favorite Count:    {{favorite_count}}            ║
║ Date Range:        {{date_range}}                ║
╚═════════════════════════════════════════════════╝
```

---

## Model Distribution

```
Gemini      {{gemini_bar}}  {{gemini_count}} images ({{gemini_pct}}%)
DALL-E 3    {{dalle_bar}}  {{dalle_count}} images ({{dalle_pct}}%)
Stability   {{stability_bar}}  {{stability_count}} images ({{stability_pct}}%)
```

---

## Template Usage

| Template | Count | Avg Score | Best Image |
|----------|-------|-----------|------------|
{{#template_stats}}
| {{template_name}} | {{template_count}} | {{template_avg_score}} | {{template_best_image}} |
{{/template_stats}}

---

## Recent Images

### {{date_section_1}}

| Preview | Filename | Prompt | Model | Template | Score |
|---------|----------|--------|-------|----------|-------|
{{#date_section_1_images}}
| {{preview_icon}} | `{{filename}}` | {{prompt_summary}} | {{model}} | {{template}} | {{quality_score}} |
{{/date_section_1_images}}

### {{date_section_2}}

| Preview | Filename | Prompt | Model | Template | Score |
|---------|----------|--------|-------|----------|-------|
{{#date_section_2_images}}
| {{preview_icon}} | `{{filename}}` | {{prompt_summary}} | {{model}} | {{template}} | {{quality_score}} |
{{/date_section_2_images}}

### {{date_section_3}}

| Preview | Filename | Prompt | Model | Template | Score |
|---------|----------|--------|-------|----------|-------|
{{#date_section_3_images}}
| {{preview_icon}} | `{{filename}}` | {{prompt_summary}} | {{model}} | {{template}} | {{quality_score}} |
{{/date_section_3_images}}

---

## Top Rated Images

| Rank | Filename | Prompt | Model | Score | Date |
|------|----------|--------|-------|-------|------|
{{#top_rated}}
| {{rank}} | `{{filename}}` | {{prompt_summary}} | {{model}} | {{quality_score}} | {{date}} |
{{/top_rated}}

---

## Favorites

{{#favorites}}
### {{fav_filename}}
- **Prompt:** {{fav_prompt}}
- **Model:** {{fav_model}}
- **Template:** {{fav_template}}
- **Resolution:** {{fav_resolution}}
- **Score:** {{fav_score}} / 10
- **Tags:** {{fav_tags}}
- **Created:** {{fav_date}}
{{/favorites}}

{{#no_favorites}}
No images have been favorited yet. Use `gallery tag <image> favorite` to mark images.
{{/no_favorites}}

---

## Category Breakdown

### By Category

```
Commercial   {{commercial_bar}}  {{commercial_count}} images
Creative     {{creative_bar}}  {{creative_count}} images
Marketing    {{marketing_bar}}  {{marketing_count}} images
Photography  {{photography_bar}}  {{photography_count}} images
Design       {{design_bar}}  {{design_count}} images
Business     {{business_bar}}  {{business_count}} images
Branding     {{branding_bar}}  {{branding_count}} images
UI Design    {{ui_bar}}  {{ui_count}} images
```

### By Resolution

| Resolution | Count | Percentage |
|------------|-------|-----------|
| 1K | {{res_1k_count}} | {{res_1k_pct}}% |
| 2K | {{res_2k_count}} | {{res_2k_pct}}% |
| 4K | {{res_4k_count}} | {{res_4k_pct}}% |

### By Aspect Ratio

| Aspect Ratio | Count | Common Use |
|-------------|-------|------------|
| 1:1 | {{ar_1_1_count}} | Social media, icons |
| 16:9 | {{ar_16_9_count}} | Banners, landscapes |
| 3:4 | {{ar_3_4_count}} | Portraits, fashion |
| 4:3 | {{ar_4_3_count}} | Illustrations |
| 9:16 | {{ar_9_16_count}} | Stories |
| 3:2 | {{ar_3_2_count}} | Photography |
| 2:3 | {{ar_2_3_count}} | Infographics |

---

## Tag Cloud

{{#tag_cloud}}
`{{tag_name}}` ({{tag_count}}) | {{/tag_cloud}}

---

## Quality Score Distribution

```
10/10:  {{score_10_bar}}  {{score_10_count}} images
 9/10:  {{score_9_bar}}  {{score_9_count}} images
 8/10:  {{score_8_bar}}  {{score_8_count}} images
 7/10:  {{score_7_bar}}  {{score_7_count}} images
 6/10:  {{score_6_bar}}  {{score_6_count}} images
 5/10:  {{score_5_bar}}  {{score_5_count}} images
<5/10:  {{score_low_bar}}  {{score_low_count}} images
N/A:    {{score_na_bar}}  {{score_na_count}} images (not scored)
```

---

## Generation Activity

```
Week 1:  {{week1_bar}}  {{week1_count}} images
Week 2:  {{week2_bar}}  {{week2_count}} images
Week 3:  {{week3_bar}}  {{week3_count}} images
Week 4:  {{week4_bar}}  {{week4_count}} images
```

**Peak Day:** {{peak_day}} ({{peak_count}} images)
**Most Used Model:** {{most_used_model}}
**Most Used Template:** {{most_used_template}}

---

## Batch History

{{#batch_history}}
| Batch | Date | Items | Completed | Failed | Duration |
|-------|------|-------|-----------|--------|----------|
| {{batch_id}} | {{batch_date}} | {{batch_total}} | {{batch_completed}} | {{batch_failed}} | {{batch_duration}} |
{{/batch_history}}

{{#no_batches}}
No batch generations recorded yet.
{{/no_batches}}

---

## Disk Usage Breakdown

| Directory | Files | Size | Percentage |
|-----------|-------|------|-----------|
{{#disk_usage}}
| `{{dir_name}}/` | {{dir_files}} | {{dir_size}} | {{dir_pct}}% |
{{/disk_usage}}
| **Total** | **{{total_files}}** | **{{total_size}}** | **100%** |

---

## Export Options

- `gallery export md` -- Export this gallery as Markdown (current file)
- `gallery export html` -- Generate standalone HTML gallery with image previews
- `gallery search <query>` -- Search by prompt, tag, date, or model
- `gallery tag <image> <tags...>` -- Add tags to an image
- `gallery favorites` -- Show only favorited images

---

*Gallery generated by Nano Banana Ultra v1.0.0*
*{{total_images}} images | {{total_disk_usage}} | Avg score: {{avg_quality_score}}/10*
