<script setup lang="ts">
import testimonials from '~/data/testimonials.json'
</script>

<template>
  <section id="reviews" class="bg-forest px-6 py-24 text-cream">
    <SectionIntro :eyebrow="testimonials.eyebrow" :title="testimonials.title" dark />
    <div class="mx-auto mt-[54px] grid max-w-wrap gap-[26px] md:grid-cols-3">
      <div v-for="item in testimonials.items" :key="item.cite" v-reveal class="rounded border border-ivory/15 bg-ivory/5 px-[30px] py-9">
        <span class="font-serif text-5xl leading-none text-blush">“</span>
        <p class="mb-[18px] mt-2 font-serif text-[1.12rem] italic text-cream">{{ item.quote }}</p>
        <cite class="text-[0.72rem] not-italic uppercase tracking-[0.22em] text-blush">— {{ item.cite }}</cite>
      </div>
    </div>
    <p v-if="testimonials.placeholder" class="mt-7 text-center text-[0.8rem] italic text-cream/55">{{ testimonials.note }}</p>
  </section>
</template>
