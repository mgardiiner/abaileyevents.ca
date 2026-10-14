// Prerendered at build time. While the coming-soon gate is on (preLaunch, see
// nuxt.config.ts), the whole site is disallowed; otherwise this is the live version.
export default defineEventHandler((event) => {
  const { preLaunch } = useRuntimeConfig(event).public

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  if (preLaunch) {
    return 'User-Agent: *\nDisallow: /\n'
  }

  return `User-Agent: *
Disallow: /admin
Disallow: /preview
Disallow: /logout

Sitemap: https://abaileyevents.ca/sitemap.xml
`
})
