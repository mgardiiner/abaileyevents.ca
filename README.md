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

## Website editor

`/admin` is a point-and-click editor for everything in `app/data/`: words, prices, packages, FAQ, reviews, contact details and photos, with a live preview of each page beside the form. Photos are resized in the browser (1600px on the long edge) before upload, and gallery photos get their event folder, categories and description in the same step. Work in progress is saved on the device until it's published.

**Signing in** takes the editor password. The editor publishes with a GitHub [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) limited to `mgardiiner/abaileyevents.ca`, with **Contents: Read and write** and **Actions: Read-only**. Set both in `.env` (and in the repo's Actions secrets, e.g. with `npm run sync-secrets`):

```
ADMIN_PASSWORD=a long passphrase
ADMIN_GITHUB_TOKEN=github_pat_…
```

The site is static, so the build can't keep a secret: it ships the token encrypted with a key derived from the password (PBKDF2-SHA256, 600,000 rounds, then AES-256-GCM), and the sign-in screen decrypts it in the browser. Anyone can download the encrypted token and try passwords against it, so use a long password and keep the token limited to this repo. Changing either value takes effect on the next deploy. Without them, the sign-in screen asks for the token itself (an "access key"), which also works as a fallback. The token stays in the browser and is sent only to the GitHub API.

**Publishing** makes one commit on `main` with the changed data files and new photos, which runs the normal deploy. The editor shows the deploy's progress and says when the change is live (about two minutes). If the site changed somewhere else since the editor loaded it, publishing stops and offers to load the latest version instead of overwriting it.

**Locally**, `npm run dev` adds an "Edit the files on this computer" button to the sign-in screen, which reads and writes `app/data/` and `public/images/` directly (`modules/admin-local.ts`, dev server only).

The forms are defined in `app/admin/sections.ts`. A new field in a data file only needs an entry there to become editable.

## Editing content

Most changes can be made in the website editor above. By hand, all copy lives in `app/data/*.json`, so text changes never touch the components. Each page's browser-tab title and search description sit under `seo` in its file.

| File | Page | What it holds |
|---|---|---|
| `hero.json` | Home | Hero headline (the tagline), kicker, subline, buttons, slideshow photos and the trust strip |
| `services.json` | Home, Event Planning | The three offering cards on Home (`offerings`, in priority order, with the price badge text in `meta`), plus the Event Planning page header, wedding planning block and Bloom Bar section |
| `packages.json` | Event Planning | Wedding packages: starting price, five at-a-glance `highlights`, full `features` and "the goal" inside expandable details, plus the custom-quote box. The wedding planning block reads its prices from here |
| `rentals.json` | Décor Rentals | Header photos, the Elegant & Timeless package (the same highlights/details layout, with fees always visible), the "How renting works" steps and individual rental items |
| `gallery.json` | Gallery, Home | Photos, captions, credits and event-type filters; `highlights` picks the five photos shown on Home |
| `about.json` | About, Home | About copy, portrait, fact chips, the photo strip, and the short "Meet Ayla" block on Home |
| `testimonials.json` | Home, About | Kind Words carousel: `quote` is a verbatim excerpt, `fullQuote` opens in the full-review dialog, `cite` credits the author, and `context` describes the event or relationship. It advances every seven seconds, with manual navigation and a pause control; reduced-motion preferences disable automatic scrolling initially |
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

The form posts directly to [FormSubmit](https://formsubmit.co/ajax-documentation) using `form.endpoint` in `contact.json`, with requests addressed to `abaileyweddings@gmail.com`. Contact, quote and consultation requests share this form. The payload includes the visitor's `email`, `_replyto`, `_subject`, request type and all entered event details. A honeypot filters bots; a 15-second timeout and failure message let visitors retry or email directly when the service cannot accept a request.

**One-time activation is required:** the first submission sends a confirmation email to `abaileyweddings@gmail.com`. The owner must click its activation link, then submit a fresh test request and confirm that it arrives with the correct reply-to address and event details. An accepted HTTP response alone does not prove inbox delivery. Keep the preview restriction until delivery has been verified and launch is approved.

The endpoint can be changed to another JSON-compatible form service in the editor. Leaving `form.endpoint` empty restores the fallback that opens the visitor's email app.

The supplied logo is kept unchanged at `public/images/abailey-events-logo.jpg`. The site shows transparent cut-outs of it, so it sits on any background: `abailey-events-logo.webp` (the complete artwork, on the Coming Soon page), `abailey-events-mark.webp` (the circle, monogram and roses, in the header) and `abailey-events-mark-badge.webp` (the same mark with the cream kept inside the circle, in the footer). `BrandLogo.vue` picks between them. A new version of the logo needs new cut-outs made from it.

### Still placeholder

- **Rental items** in `rentals.json`: none listed yet.
- **Draft copy** for the planning, Bloom Bar and décor rental descriptions (`services.json`, `rentals.json`) is ready for review.

## Layout

- `app/pages/` has one file per menu tab: `index` (Home), `event-planning` (planning, packages, Bloom Bar), `decor-rentals`, `gallery`, `about`, `faq` and `contact`. Packages live on Event Planning; the Home "View Packages" button and that page's jump links go to `/event-planning#packages`
- `app/components/` components are auto-imported without a path prefix; `PageHeader` tops each inner page and `CtaBand` closes most of them
- `app/composables/useContent.ts` is how components read `app/data/`; the editor's preview swaps in unpublished changes through it (`app/plugins/admin-preview.client.ts`)
- `app/admin/` holds the website editor's logic (forms, drafts, photos, publishing) and `app/components/admin/` its screens; `app/pages/admin.vue` ties them together
- `app/composables/usePageSeo.ts` sets a page's title and description from its `seo` data
- `app/plugins/reveal.ts` registers `v-reveal`, the scroll-in fade; `hash-scroll.client.ts` scrolls to the section when a link like `/event-planning#packages` is opened from outside the site, or clicked again once the address already points there
- `app/assets/css/base.css` holds shared classes (`.btn`, `.eyebrow`, background washes)
- `tailwind.config.js` holds the brand palette from the client brief (white roses → ivory and cream, sage green, beige, black text → ink) and fonts (Cormorant Garamond, Jost, Great Vibes)
