<script setup lang="ts">
const faq = useContent('faq')

usePageSeo(faq.seo)
</script>

<template>
  <div>
    <PageHeader :eyebrow="faq.eyebrow" :title="faq.title" :intro="faq.intro" />
    <FaqSection />
    <CtaBand />
  </div>
</template>
