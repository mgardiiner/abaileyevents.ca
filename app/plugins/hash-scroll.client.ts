export default defineNuxtPlugin((nuxtApp) => {
  const scrollTo = (hash: string, behavior: ScrollBehavior = 'auto') => {
    const id = decodeURIComponent(hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ behavior })
  }

  // Opening a link like /event-planning#packages from outside the site: the router tries to
  // scroll before the section has rendered, so scroll to it once the first page has finished.
  nuxtApp.hooks.hookOnce('page:finish', () => {
    requestAnimationFrame(() => scrollTo(useRoute().hash))
  })

  // Clicking a link to the section the address already points at (#packages again) isn't a
  // navigation, so the router doesn't scroll; do it here instead.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href*="#"]')
    if (!(link instanceof HTMLAnchorElement) || !link.hash) return
    if (link.pathname === location.pathname && link.hash === location.hash) scrollTo(link.hash, 'smooth')
  })
})
