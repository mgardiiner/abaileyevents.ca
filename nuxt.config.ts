import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto'

// Static builds bake runtime config into the client bundle, so ship only the
// preview password's hash, never the password itself.
const previewPassword = process.env.PREVIEW_PASSWORD ?? ''

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
  ssr: false,
  nitro: { preset: 'github-pages' },
  compatibilityDate: '2025-07-15',
  // Off 3000 so this never shares a port with the Trend Hunter dev server.
  devServer: { port: 3001 },
  // Glide to #anchors like #packages; page changes still jump straight to the top.
  router: { options: { scrollBehaviorType: 'smooth' } },
  runtimeConfig: {
    public: {
      previewHash: previewPassword ? createHash('sha256').update(previewPassword).digest('hex') : '',
      adminKey: sealAdminKey(process.env.ADMIN_PASSWORD?.trim(), process.env.ADMIN_GITHUB_TOKEN?.trim()),
    },
  },
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ABailey Events — Wedding Planning, Bloom Bar & Décor Rentals | Simcoe Muskoka',
      meta: [
        {
          name: 'description',
          content: 'ABailey Events — wedding planning and coordination, Bloom Bar services and décor rentals across Simcoe Muskoka. From vision to celebration, making your moments bloom.',
        },
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
