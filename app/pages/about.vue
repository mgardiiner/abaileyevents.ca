<script setup lang="ts">
import about from '~/data/about.json'

usePageSeo(about.seo)
</script>

<template>
  <div>
    <AboutSection />
    <MomentsStrip />
    <KindWords />
    <CtaBand />
  </div>
</template>
