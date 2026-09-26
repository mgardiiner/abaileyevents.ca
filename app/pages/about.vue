<script setup lang="ts">
const about = useContent('about')

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
