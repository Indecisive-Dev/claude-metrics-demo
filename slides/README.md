# Tinybird Benefits Presentation

A Slidev presentation styled with Tinybird's brand colors and typography.

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Export to PDF
npm run export
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Green | `#61C454` | Primary accent, links, highlights |
| Coral | `#EC6D62` | Secondary accent |
| Yellow | `#F5C451` | Tertiary accent |
| Cyan | `#00D9FF` | Additional accent |
| Dark BG | `#0A0A0A` | Background |

## Custom CSS Classes

Use these in your slides for brand-consistent styling:

```html
<span class="text-cyan">Cyan text</span>
<span class="text-coral">Coral text</span>
<span class="text-yellow">Yellow text</span>
<span class="text-green">Green text</span>

<div class="card">Card container</div>
<div class="highlight-box">Highlighted content</div>

<div class="metric">1M+</div>
<div class="metric-label">Queries per second</div>
```

## Editing Slides

Edit `slides.md` to add your content. Each slide is separated by `---`.

See [Slidev documentation](https://sli.dev/) for more features.
