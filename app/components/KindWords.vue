<script setup lang="ts">
import testimonials from '~/data/testimonials.json'
</script>

<template>
  <section id="reviews" class="bg-sage-mist px-6 py-24 md:py-28">
    <SectionIntro :eyebrow="testimonials.eyebrow" :title="testimonials.title" />
    <div class="mx-auto mt-14 grid max-w-wrap gap-14 md:grid-cols-3 md:gap-0 md:divide-x md:divide-sage/30">
      <figure v-for="item in testimonials.items" :key="item.cite" v-reveal class="text-center md:px-10">
        <span class="block font-serif text-[4.5rem] leading-[0.5] text-sage" aria-hidden="true">“</span>
        <blockquote class="mt-6 font-serif text-[1.25rem] font-light italic leading-relaxed text-ink">{{ item.quote }}</blockquote>
        <figcaption class="mt-6 text-[0.68rem] uppercase tracking-[0.24em] text-sage-deep">{{ item.cite }}</figcaption>
      </figure>
    </div>
    <p v-if="testimonials.placeholder" class="mt-14 text-center text-[0.8rem] italic text-ink-muted">{{ testimonials.note }}</p>
  </section>
</template>
