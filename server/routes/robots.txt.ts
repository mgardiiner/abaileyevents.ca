// Prerendered at build time. While the preview gate is on, the whole site is
// disallowed; dropping PREVIEW_PASSWORD flips this to the live version.
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
