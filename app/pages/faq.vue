<script setup lang="ts">
import faq from '~/data/faq.json'

usePageSeo(faq.seo)
</script>

<template>
  <div>
    <PageHeader :eyebrow="faq.eyebrow" :title="faq.title" :intro="faq.intro" />
    <FaqSection />
    <CtaBand />
  </div>
</template>
