<script setup lang="ts">
import contact from '~/data/contact.json'
import gallery from '~/data/gallery.json'

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
