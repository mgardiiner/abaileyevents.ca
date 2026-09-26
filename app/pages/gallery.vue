<script setup lang="ts">
const contact = useContent('contact')
const gallery = useContent('gallery')

usePageSeo(gallery.seo)
</script>

<template>
  <div>
    <PageHeader :eyebrow="gallery.eyebrow" :title="gallery.title" :emphasis="gallery.emphasis" :intro="gallery.intro">
      <template #intro>
        <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="text-sage-deep underline">@{{ contact.instagram }}</a>.
      </template>
    </PageHeader>
    <GallerySection />
    <CtaBand />
  </div>
</template>
