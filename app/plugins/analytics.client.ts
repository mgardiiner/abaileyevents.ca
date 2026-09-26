// Cloudflare Web Analytics: cookie-free visit counts, including the router's page changes.
// The token isn't secret; it ends up in the page either way.
const TOKEN = '9dea19a27cb5499ebd8956992c294ab6'

// Leave out local dev, the website editor (and the site framed inside it), and anyone signed in
// through /preview, so the owner's own visits don't count.
export default defineNuxtPlugin(() => {
  if (import.meta.dev || window.parent !== window) return
  const path = location.pathname.replace(/\/$/, '') || '/'
  if (['/preview', '/logout', '/admin'].includes(path)) return
  const { previewHash } = useRuntimeConfig().public
  if (previewHash && useCookie('preview').value === previewHash) return

  const script = document.createElement('script')
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.dataset.cfBeacon = JSON.stringify({ token: TOKEN, spa: true })
  document.head.append(script)
})
