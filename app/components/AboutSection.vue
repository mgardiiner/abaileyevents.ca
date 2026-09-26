<script setup lang="ts">
import about from '~/data/about.json'

const portraitFailed = ref(false)
</script>

<template>
  <section id="about" class="bg-white px-6 py-24">
    <div class="mx-auto grid max-w-wrap items-center gap-10 md:grid-cols-[5fr_6fr] md:gap-[70px]">
      <div v-reveal class="relative aspect-[4/5] overflow-hidden rounded-[200px_200px_4px_4px] border border-forest/10">
        <PhotoPlaceholder v-if="portraitFailed" :file="about.portrait" label="Your portrait here" />
        <img v-else :src="about.portrait" :alt="about.portraitAlt" loading="lazy" class="h-full w-full object-cover" @error="portraitFailed = true">
        <div class="pointer-events-none absolute inset-3 rounded-[190px_190px_2px_2px] border border-ivory/65" />
      </div>
      <div v-reveal>
        <span class="eyebrow">{{ about.eyebrow }}</span>
        <h2 class="mb-1.5 mt-3.5 text-[clamp(2rem,4vw,2.8rem)] text-forest">{{ about.heading }}</h2>
        <p class="mb-5 font-script text-[1.9rem] text-gold">{{ about.scriptLine }}</p>
        <p v-for="paragraph in about.paragraphs" :key="paragraph" class="mb-4 text-ink-soft">{{ paragraph }}</p>
        <div class="mb-[30px] mt-6 flex flex-wrap gap-3">
          <span v-for="fact in about.facts" :key="fact" class="rounded-full border border-sage px-[18px] py-2 text-[0.74rem] uppercase tracking-[0.16em] text-sage-deep">{{ fact }}</span>
        </div>
        <a class="btn btn-solid" href="#contact">{{ about.cta }}</a>
      </div>
    </div>
  </section>
</template>
