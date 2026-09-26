export default defineNuxtConfig({
  srcDir: 'app/',
  ssr: false,
  nitro: { preset: 'github-pages' },
  compatibilityDate: '2025-07-15',
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'A Bailey Events | Wedding Planning & Coordination',
      meta: [
        {
          name: 'description',
          content: 'Wedding planning, day-of coordination, bloom bars and event rentals in Cookstown, Ontario. Let us make your special day stunning and stress free.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&family=Great+Vibes&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/base.css'],
  modules: ['@nuxtjs/tailwindcss'],
  components: [{ path: '~/components', pathPrefix: false }],
})
