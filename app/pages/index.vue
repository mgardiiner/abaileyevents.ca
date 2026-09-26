<script setup lang="ts">
import hero from '~/data/hero.json'

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
