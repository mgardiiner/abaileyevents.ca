<script setup lang="ts">
const services = useContent('services')

usePageSeo(services.seo)
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
        <img :src="page.photo" :alt="page.photoAlt" class="aspect-[4/3] w-full object-cover object-[center_35%] sm:aspect-[16/9] md:aspect-[21/8]" @error="photoFailed = true">
      </div>
    </PageHeader>
    <PlanningSection />
    <PackagesSection />
    <BloomBarSection />
    <FaqSection only="planning" />
    <CtaBand />
  </div>
</template>
