<script setup lang="ts">
const rentals = useContent('rentals')

usePageSeo(rentals.seo)
const failed = reactive(new Set<string>())
</script>

<template>
  <div>
    <PageHeader :eyebrow="rentals.eyebrow" :title="rentals.title" :emphasis="rentals.emphasis" :intro="rentals.intro">
      <!-- A staggered pair: the arched frame echoes the ceremony arch it shows -->
      <div class="mx-auto mt-14 grid max-w-[780px] grid-cols-2 items-start gap-4 sm:gap-8">
        <div
          v-for="(photo, i) in rentals.photos"
          :key="photo.src"
          class="relative aspect-[4/5] overflow-hidden bg-cream"
          :class="i === 0 ? 'rounded-t-full' : 'mt-12 rounded-sm sm:mt-20'"
        >
          <PhotoPlaceholder v-if="failed.has(photo.src)" :file="photo.src" />
          <img v-else :src="photo.src" :alt="photo.alt" class="h-full w-full object-cover" @error="failed.add(photo.src)">
        </div>
      </div>
    </PageHeader>
    <RentalsSection />
    <FaqSection only="rentals" />
    <CtaBand />
  </div>
</template>
