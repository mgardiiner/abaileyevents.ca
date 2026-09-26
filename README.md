# abaileyevents.ca

Marketing site for **A Bailey Events**, a wedding planning and coordination business in Cookstown, Ontario.

Nuxt 4 (client-rendered) + Tailwind, deployed to GitHub Pages at [abaileyevents.ca](https://abaileyevents.ca).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run generate   # static output -> .output/public
npm run preview
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which generates the site, copies `CNAME` into the output and publishes it to GitHub Pages.

## Layout

- `app/pages/` holds the routes
- `app/components/` components are auto-imported without a path prefix
- `app/data/*.json` holds the site content (contact details, etc.)
- `tailwind.config.js` holds the brand palette (ivory, cream, blush, sage, forest, gold) and fonts (Cormorant Garamond, Jost, Great Vibes)
