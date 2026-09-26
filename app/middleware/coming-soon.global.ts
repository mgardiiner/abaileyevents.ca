export default defineNuxtRouteMiddleware((to) => {
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
