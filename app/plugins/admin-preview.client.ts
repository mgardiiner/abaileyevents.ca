import type { ContentName } from '~/composables/useContent'

// Inside the website editor's preview frame, show the editor's unpublished changes in place of
// the published copy, and follow it to whichever page or section is being edited.
export default defineNuxtPlugin(() => {
  if (window.parent === window) return
  try {
    if (!window.parent.location.pathname.startsWith('/admin')) return
  }
  catch {
    return // framed by another site
  }

  const router = useRouter()
  document.documentElement.dataset.adminPreview = ''

  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== window.parent) return
    const message = event.data
    if (message?.type === 'admin:content') {
      for (const [name, data] of Object.entries(message.files)) patchContent(name as ContentName, data)
    }
    if (message?.type === 'admin:go') {
      const { path, hash } = message as { path: string, hash?: string }
      if (router.currentRoute.value.path !== path) return router.push({ path, hash })
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
  window.parent.postMessage({ type: 'admin:ready' }, location.origin)
})
