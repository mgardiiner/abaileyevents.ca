# abaileyevents.ca

Marketing site for **ABailey Events**: wedding planning and coordination, Bloom Bar services and décor rentals across Simcoe Muskoka, run by WPIC-certified planner Ayla Bailey.

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

All copy lives in `app/data/*.json`, so text changes never touch the components. Each page's browser-tab title and search description sit under `seo` in its file.

| File | Page | What it holds |
|---|---|---|
| `hero.json` | Home | Hero headline (the tagline), kicker, subline, buttons, slideshow photos and the trust strip |
| `services.json` | Home, Event Planning | The three offering cards on Home (`offerings`, in priority order, with the price badge text in `meta`), plus the Event Planning page header, wedding planning block and Bloom Bar section |
| `packages.json` | Event Planning | Wedding packages: starting price, inclusions and "the goal" for each, plus the custom-quote box. The wedding planning block reads its prices from here |
| `rentals.json` | Décor Rentals | Header photos, the Elegant & Timeless package, the "How renting works" steps and individual rental items |
| `gallery.json` | Gallery, Home | Photos, captions, credits and event-type filters; `highlights` picks the five photos shown on Home |
| `about.json` | About, Home | About copy, portrait, fact chips, the photo strip, and the short "Meet Ayla" block on Home |
| `testimonials.json` | Home, About | Kind Words quotes; set `placeholder: false` once they're real |
| `faq.json` | FAQ, Event Planning, Décor Rentals | FAQ questions by group. Each group's `id` (`planning`, `rentals`) also shows it on that service page |
| `contact.json` | Contact, every page | Email, Instagram links, service area, contact copy, the form's options, and the photo band (`band`) that closes most pages |
| `nav.json` | Every page | The menu links, shared by the header and footer |
| `coming-soon.json` | Coming soon | The pre-launch coming-soon page |

Home prices on the offering cards (`meta` in `services.json`) are plain text, so update them alongside `packages.json` and `rentals.json` when prices change.

A photo whose file is missing renders a placeholder naming the expected path, so you can add images by filename.

### Adding gallery photos

Resize photos to about 1600px on the long edge before adding them (full-size camera files are 5–7 MB each). Put them in a folder per event under `public/images/gallery/` (e.g. `gallery/sb-wedding/first-dance.jpg`) and add an entry to `gallery.json`:

```json
{ "src": "/images/gallery/sb-wedding/first-dance.jpg", "w": 1067, "h": 1600, "alt": "What the photo shows", "caption": "S & B · First Dance", "credit": "Photographer name", "categories": ["weddings"] }
```

`categories` uses the ids in `categories` (`weddings`, `bloom-bar`, `bridal-showers`, `birthdays`, `corporate`, `rentals`). A filter button only appears once at least one photo uses that category. `credit` is optional. The gallery is a masonry layout where each photo keeps its own shape; `w` and `h` are the file's pixel size and reserve its space while it loads (optional, but the layout jumps without them). The first `pageSize` photos show before "Show More", so keep the favourites at the top. Link to a filtered view with `/gallery?category=bloom-bar`.

### Adding rental items

Add an entry to `items` in `rentals.json`. Leave `photo` out until there is one; the card shows a soft placeholder tile instead:

```json
{ "name": "Gold ceremony arch", "price": "$75", "description": "Optional one-liner", "photo": "/images/rentals/gold-arch.jpg" }
```

### Contact form

With `form.endpoint` empty in `contact.json`, submitting the form opens the visitor's email app with the request addressed to the business email. To have requests arrive without that step, create a form at a service such as [Formspree](https://formspree.io) and paste its endpoint URL into `form.endpoint`. The form posts JSON with `_subject` and `_replyto` set.

### Still placeholder

- **Logo**: the header and footer use a text wordmark until the logo file arrives.
- **Testimonials** in `testimonials.json`: all three quotes.
- **Rental items** in `rentals.json`: none listed yet.
- **Draft copy** for the planning, Bloom Bar and décor rental descriptions (`services.json`, `rentals.json`) is ready for review.
## Layout

- `app/pages/` has one file per menu tab: `index` (Home), `event-planning` (planning, packages, Bloom Bar), `decor-rentals`, `gallery`, `about`, `faq` and `contact`. Packages live on Event Planning; the Home "View Packages" button and that page's jump links go to `/event-planning#packages`
- `app/components/` components are auto-imported without a path prefix; `PageHeader` tops each inner page and `CtaBand` closes most of them
- `app/composables/usePageSeo.ts` sets a page's title and description from its `seo` data
- `app/plugins/reveal.ts` registers `v-reveal`, the scroll-in fade; `hash-scroll.client.ts` scrolls to the section when a link like `/event-planning#packages` is opened from outside the site, or clicked again once the address already points there
- `app/assets/css/base.css` holds shared classes (`.btn`, `.eyebrow`, background washes)
- `tailwind.config.js` holds the brand palette from the client brief (white roses → ivory and cream, sage green, beige, black text → ink) and fonts (Cormorant Garamond, Jost, Great Vibes)
