// Prerendered at build time (see nitro.prerender.routes in nuxt.config.ts),
// so GitHub Pages serves it as a static file. The gate pages (/coming-soon,
// /preview, /logout, /admin) are deliberately absent.
const SITE = 'https://abaileyevents.ca'

const paths = [
  '/',
  '/about',
  '/event-planning',
  '/decor-rentals',
  '/gallery',
  '/faq',
  '/contact',
]

export default defineEventHandler((event) => {
  const urls = paths.map((path) => `  <url><loc>${SITE}${path}</loc></url>`).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
