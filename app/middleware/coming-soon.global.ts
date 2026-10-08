export default defineNuxtRouteMiddleware((to) => {
  // Prerendering has no visitor and no cookie, so the gate would redirect every
  // route to /coming-soon and the build would emit no real pages. The gate is a
  // browser gate; let the server render the page and check in the browser.
  // Nothing leaks while preLaunch is set: those pages ship noindex and
  // robots.txt disallows everything (see nuxt.config.ts).
  if (import.meta.server) return

  // GitHub Pages can serve /preview as /preview/, so compare without the trailing slash.
  const path = to.path.replace(/\/$/, '') || '/'
  if (['/coming-soon', '/preview', '/logout', '/admin'].includes(path)) return

  // The cookie holds the password's hash, so changing PREVIEW_PASSWORD logs everyone out.
  const { previewHash } = useRuntimeConfig().public
  const preview = useCookie('preview')
  if (!previewHash || preview.value !== previewHash) {
    return navigateTo('/coming-soon', { redirectCode: 302 })
  }
})
