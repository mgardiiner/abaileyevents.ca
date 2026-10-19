<script setup lang="ts">
const services = useContent('services')
const packages = useContent('packages')

usePageSeo(services.seo)
useJsonLd('services', () => ({
  '@graph': [
    ...packages.items.map((item) => ({
      '@type': 'Service',
      name: item.name,
      serviceType: 'Wedding planning',
      description: item.summary,
      provider: BUSINESS,
      areaServed: AREA_SERVED,
      offers: offerFor(item.price, Boolean(item.pricePrefix)),
    })),
    {
      '@type': 'Service',
      name: services.bloomBar.title,
      serviceType: 'Bloom Bar',
      description: services.bloomBar.body[0],
      provider: BUSINESS,
      areaServed: AREA_SERVED,
    },
  ],
}))
const { page } = services
const photoFailed = ref(false)
</script>

<template>
  <div>
    <PageHeader :eyebrow="page.eyebrow" :title="page.title" :emphasis="page.emphasis" :intro="page.intro">
      <nav class="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3" aria-label="On this page">
        <NuxtLink v-for="section in page.sections" :key="section.id" :to="`/event-planning#${section.id}`" class="link-caps">{{ section.label }}</NuxtLink>
      </nav>
      <!-- A wide panorama, unlike the tall frames further down -->
      <div v-if="!photoFailed" class="mx-auto mt-14 max-w-wrap overflow-hidden rounded-sm md:mt-16">
        <img :src="page.photo" :style="photoFocus(page.photo)" :alt="page.photoAlt" class="aspect-[4/3] w-full object-cover object-[center_35%] sm:aspect-[16/9] md:aspect-[21/8]" @error="photoFailed = true">
      </div>
    </PageHeader>
    <PlanningSection />
    <PackagesSection />
    <BloomBarSection />
    <FaqSection only="planning" />
    <CtaBand />
  </div>
</template>
