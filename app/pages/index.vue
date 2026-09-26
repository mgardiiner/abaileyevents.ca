<script setup lang="ts">
const hero = useContent('hero')

usePageSeo(hero.seo)
</script>

<template>
  <div>
    <HeroSection />
    <TrustStrip />
    <ServicesSection />
    <GalleryHighlights />
    <KindWords />
    <AboutTeaser />
    <CtaBand />
  </div>
</template>
