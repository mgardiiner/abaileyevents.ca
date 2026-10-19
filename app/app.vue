<script setup lang="ts">
// Per-page canonical and og:url, so every prerendered page points at itself.
const route = useRoute()
const canonical = computed(
  () => `${SITE_URL}${route.path === '/' ? '' : route.path.replace(/\/$/, '')}`
)

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
})

// Who the business is, on every page: the entity the page-level data (services, FAQ) hangs off.
const hero = useContent('hero')
const about = useContent('about')
const contact = useContent('contact')
const services = useContent('services')

useJsonLd('site', () => ({
  '@graph': [
    {
      '@type': 'LocalBusiness',
      ...BUSINESS,
      name: 'ABailey Events',
      url: SITE_URL,
      logo: `${SITE_URL}/images/abailey-events-logo.jpg`,
      image: `${SITE_URL}/images/share.jpg`,
      description: hero.seo.description,
      slogan: hero.tagline,
      email: contact.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: contact.location.split(',')[0].trim(),
        addressRegion: 'ON',
        addressCountry: 'CA',
      },
      areaServed: AREA_SERVED,
      sameAs: [contact.instagramUrl],
      founder: { '@id': `${SITE_URL}/about#ayla` },
      knowsAbout: services.offerings.map((offering) => offering.title),
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/about#ayla`,
      name: 'Ayla Bailey',
      jobTitle: 'Wedding Planner',
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}${about.portrait}`,
      worksFor: BUSINESS,
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'WPIC Certified Wedding Planner',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ABailey Events',
      inLanguage: 'en-CA',
      publisher: BUSINESS,
    },
  ],
}))
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
