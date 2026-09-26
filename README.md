# abaileyevents.ca

Marketing site for **ABailey Events**: Ayla Bailey, a WPIC-certified wedding planner and coordinator in Cookstown, Ontario.

Nuxt 4 (client-rendered) + Tailwind, deployed to GitHub Pages at [abaileyevents.ca](https://abaileyevents.ca).

## Development

```bash
npm install
npm run dev        # http://localhost:3001
```

## Build

```bash
npm run generate   # static output -> .output/public
npm run preview
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` (Node 22), which generates the site, copies `CNAME` into the output and publishes it to GitHub Pages.

## Editing content

All copy lives in `app/data/*.json`, one file per section, so text changes never touch the components:

| File | Section |
|---|---|
| `hero.json` | Hero headline, kicker, subline, and the trust strip |
| `services.json` | The three service cards (`icon` is `calendar`, `flower` or `rentals`) |
| `packages.json` | Package cards; `featured: true` highlights one, `flag` adds its badge |
| `events.json` | Past-events gallery (photos in `public/images/events/`) |
| `about.json` | About Ayla, portrait path, fact chips |
| `testimonials.json` | Kind Words quotes; set `placeholder: false` once they're real |
| `contact.json` | Instagram links, service areas, contact block copy |
| `coming-soon.json` | The pre-launch coming-soon page |

A photo whose file is missing renders a placeholder naming the expected path, so you can add images by filename.

### Still placeholder

- **Package prices** in `packages.json` are samples. Once they're real, remove each `priceNote` and the `note` line.
- **About** in `about.json`: the third paragraph and the `[Fun fact]` chip.
- **Testimonials** in `testimonials.json`: all three quotes.
- **Photos** are Instagram captures at ~950px. Replace them with originals using the same filenames for sharper images.

## Layout

- `app/pages/index.vue` stacks the section components
- `app/components/` components are auto-imported without a path prefix
- `app/plugins/reveal.ts` registers `v-reveal`, the scroll-in fade
- `app/assets/css/base.css` holds shared classes (`.btn`, `.eyebrow`, background washes)
- `tailwind.config.js` holds the brand palette (ivory, cream, blush, sage, forest, ink, gold) and fonts (Cormorant Garamond, Jost, Great Vibes)
