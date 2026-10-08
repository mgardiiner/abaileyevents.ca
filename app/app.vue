<script setup lang="ts">
// Per-page canonical and og:url, so every prerendered page points at itself.
const route = useRoute()
const canonical = computed(
  () => `https://abaileyevents.ca${route.path === '/' ? '' : route.path.replace(/\/$/, '')}`
)

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
