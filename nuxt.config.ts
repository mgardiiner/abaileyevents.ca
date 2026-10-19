import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'

// Static builds bake runtime config into the client bundle, so ship only the
// preview password's hash, never the password itself.
const previewPassword = process.env.PREVIEW_PASSWORD ?? ''

// Pre-launch means the coming-soon gate is still in place, and that is the
// file itself — not PREVIEW_PASSWORD, which gates HARDER when it is empty
// (the middleware then redirects everyone, with no password that lets you in).
// While the file exists, every page ships noindex and robots.txt disallows
// everything, so the prerendered HTML can never be indexed ahead of launch.
// The site is live, so the file is gone; restoring it from git puts the gate,
// noindex and the closed robots.txt back on the next build.
const preLaunch = existsSync(new URL('app/middleware/coming-soon.global.ts', import.meta.url))

// The website editor signs in with ADMIN_PASSWORD and publishes with ADMIN_GITHUB_TOKEN. The bundle
// is public, so the token ships only encrypted with a key derived from the password (PBKDF2-SHA256
// + AES-256-GCM); app/admin/sealed-key.ts opens it in the browser. Without both, the editor asks
// for a GitHub key instead.
const SEAL_ROUNDS = 600_000
function sealAdminKey(password = '', token = '') {
  if (!password || !token) return ''
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', pbkdf2Sync(password, salt, SEAL_ROUNDS, 32, 'sha256'), iv)
  const data = Buffer.concat([cipher.update(token, 'utf8'), cipher.final(), cipher.getAuthTag()])
  return [SEAL_ROUNDS, salt.toString('base64'), iv.toString('base64'), data.toString('base64')].join('.')
}

export default defineNuxtConfig({
  srcDir: 'app/',
  // Prerender to real HTML. With ssr:false the deploy served an empty
  // <div id="__nuxt"></div>, so crawlers saw no title, copy or headings.
  // While the coming-soon gate is on, preLaunch below keeps all of it out of
  // the index anyway.
  ssr: true,
  nitro: {
    preset: 'github-pages',
    prerender: {
      // about.html, not about/index.html: GitHub Pages 301s /about to /about/ for a folder, which
      // left every canonical, sitemap entry and nav link pointing at a redirect. It serves
      // about.html at /about directly.
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/', '/404.html', '/sitemap.xml', '/robots.txt', '/llms.txt', '/coming-soon'],
      failOnError: true,
    },
  },
  routeRules: {
    // Browser-only: the editor, the gate's cookie-setting pages.
    '/admin': { ssr: false, index: false },
    '/preview': { ssr: false, index: false },
    '/logout': { ssr: false, index: false },
  },
  // No page fetches data (content is bundled JSON), so each _payload.json was empty; it also
  // left an about/ folder beside about.html for GitHub Pages to redirect into.
  experimental: { payloadExtraction: false },
  compatibilityDate: '2025-07-15',
  // Off 3000 so this never shares a port with the Trend Hunter dev server.
  devServer: { port: 3001 },
  // Glide to #anchors like #packages; page changes still jump straight to the top.
  router: { options: { scrollBehaviorType: 'smooth' } },
  runtimeConfig: {
    public: {
      previewHash: previewPassword ? createHash('sha256').update(previewPassword).digest('hex') : '',
      adminKey: sealAdminKey(process.env.ADMIN_PASSWORD?.trim(), process.env.ADMIN_GITHUB_TOKEN?.trim()),
      preLaunch,
    },
  },
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en-CA' },
      title: 'ABailey Events — Wedding Planning, Bloom Bar & Décor Rentals | Simcoe Muskoka',
      meta: [
        // Belt and braces with robots.txt: nothing is indexable until launch.
        ...(preLaunch ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
        {
          name: 'description',
          content: 'ABailey Events — wedding planning and coordination, Bloom Bar services and décor rentals across Simcoe Muskoka. From vision to celebration, making your moments bloom.',
        },
        // The card a shared link unfurls into; each page sets its own og:title and og:description.
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ABailey Events' },
        { property: 'og:locale', content: 'en_CA' },
        { property: 'og:image', content: 'https://abaileyevents.ca/images/share.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Bridal shoes, wedding rings and a white rose bouquet on a veil' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&family=Great+Vibes&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/base.css'],
  modules: ['@nuxtjs/tailwindcss'],
  components: [{ path: '~/components', pathPrefix: false }],
})
