<script setup lang="ts">
const about = useContent('about')

const failed = reactive(new Set<string>())
</script>

<!-- Top of the About page -->
<template>
  <section id="about" class="bg-page px-6 pb-24 pt-[128px] md:pb-28 md:pt-[164px]">
    <div class="mx-auto grid max-w-wrap items-center gap-16 md:grid-cols-[6fr_5fr] md:gap-20">
      <div v-reveal class="order-2 md:order-1">
        <span class="eyebrow">{{ about.eyebrow }}</span>
        <h1 class="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-light leading-[1.02] text-ink">{{ about.heading }}</h1>
        <p class="mb-6 mt-1 font-script text-[2rem] text-sage-deep">{{ about.scriptLine }}</p>
        <p v-for="paragraph in about.paragraphs" :key="paragraph" class="mb-4 text-ink-soft">{{ paragraph }}</p>
        <div class="mb-9 mt-7 flex flex-wrap gap-3">
          <span v-for="fact in about.facts" :key="fact" class="rounded-full border border-sage px-[18px] py-2 text-[0.72rem] uppercase tracking-[0.16em] text-sage-deep">{{ fact }}</span>
        </div>
        <NuxtLink class="btn btn-solid" to="/contact">{{ about.cta }}</NuxtLink>
      </div>
      <!-- A portrait on an offset beige block, with a round detail over its corner -->
      <div v-reveal class="relative isolate order-1 mx-auto w-full max-w-[400px] md:order-2">
        <div class="absolute -bottom-5 -left-5 -z-10 h-full w-full bg-beige/70" aria-hidden="true" />
        <div class="relative aspect-[4/5] overflow-hidden bg-ivory">
          <PhotoPlaceholder v-if="failed.has(about.portrait)" :file="about.portrait" label="Your portrait here" />
          <img v-else :src="about.portrait" :alt="about.portraitAlt" class="h-full w-full object-cover" @error="failed.add(about.portrait)">
        </div>
        <div class="absolute -right-6 -top-8 hidden h-[128px] w-[128px] overflow-hidden rounded-full border-[6px] border-ivory bg-cream shadow-lift sm:block lg:-right-12">
          <img v-if="!failed.has(about.detail)" :src="about.detail" :alt="about.detailAlt" class="h-full w-full object-cover" @error="failed.add(about.detail)">
        </div>
      </div>
    </div>
  </section>
</template>
