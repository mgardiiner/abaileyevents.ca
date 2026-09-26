<script setup lang="ts">
const about = useContent('about')

const failed = reactive(new Set<string>())
</script>

<!-- About page: a loose row of photos in alternating heights, leading to the gallery -->
<template>
  <section class="bg-white px-6 py-24 md:py-28">
    <p v-reveal class="text-center"><span class="eyebrow">{{ about.strip.title }}</span></p>
    <div class="mx-auto mt-12 grid max-w-wrap grid-cols-2 items-start gap-3 sm:gap-5 md:grid-cols-4">
      <div
        v-for="(photo, i) in about.strip.photos"
        :key="photo.src"
        v-reveal
        class="overflow-hidden rounded-sm bg-cream"
        :class="i % 2 ? 'mt-10 aspect-[4/5] md:mt-16' : 'aspect-[3/4]'"
      >
        <PhotoPlaceholder v-if="failed.has(photo.src)" :file="photo.src" />
        <img v-else :src="photo.src" :alt="photo.alt" loading="lazy" class="h-full w-full object-cover" @error="failed.add(photo.src)">
      </div>
    </div>
    <div v-reveal class="mt-12 text-center">
      <NuxtLink to="/gallery" class="btn btn-ghost">{{ about.strip.cta }}</NuxtLink>
    </div>
  </section>
</template>
