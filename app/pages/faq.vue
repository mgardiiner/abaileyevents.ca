<script setup lang="ts">
const faq = useContent('faq')

usePageSeo(faq.seo)

// Marked up here only: the service pages show one group each, and Google wants each FAQ marked once.
useJsonLd('faq', () => ({
  '@type': 'FAQPage',
  mainEntity: faq.groups.flatMap((group) => group.items).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}))
</script>

<template>
  <div>
    <PageHeader :eyebrow="faq.eyebrow" :title="faq.title" :intro="faq.intro" />
    <FaqSection />
    <CtaBand />
  </div>
</template>
