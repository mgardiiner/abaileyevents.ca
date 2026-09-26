<script setup lang="ts">
import services from '~/data/services.json'

const { bloomBar } = services
const failed = reactive(new Set<string>())
</script>

<template>
  <section id="bloom-bar" class="relative overflow-hidden bg-white px-6 py-24 md:py-32">
    <div class="mx-auto grid max-w-wrap items-center gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
      <!-- A round photo with a slim portrait detail tucked beside it -->
      <div v-reveal class="relative mx-auto w-full max-w-[440px]">
        <div class="aspect-square overflow-hidden rounded-full bg-cream">
          <PhotoPlaceholder v-if="failed.has(bloomBar.photo)" :file="bloomBar.photo" />
          <img v-else :src="bloomBar.photo" :alt="bloomBar.photoAlt" loading="lazy" class="h-full w-full object-cover object-[center_40%]" @error="failed.add(bloomBar.photo)">
        </div>
        <div class="absolute -bottom-8 -left-2 hidden aspect-[2/3] w-[34%] overflow-hidden rounded-t-full border-[6px] border-white bg-cream shadow-lift sm:block lg:-left-10">
          <img v-if="!failed.has(bloomBar.detail)" :src="bloomBar.detail" :alt="bloomBar.detailAlt" loading="lazy" class="h-full w-full object-cover" @error="failed.add(bloomBar.detail)">
        </div>
      </div>
      <div v-reveal>
        <p class="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-sage-deep">{{ bloomBar.tag }}</p>
        <h2 class="mb-5 mt-3 text-[clamp(2.2rem,4vw,3.1rem)] font-light leading-[1.05] text-ink">{{ bloomBar.title }}</h2>
        <p v-for="paragraph in bloomBar.body" :key="paragraph" class="mb-3.5 text-ink-soft">{{ paragraph }}</p>
        <p class="mb-3 mt-7 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-ink-muted">{{ bloomBar.perfectForLabel }}</p>
        <ul class="grid w-fit grid-cols-2 gap-x-10 gap-y-1.5 font-serif text-[1.2rem] italic text-ink-soft">
          <li v-for="occasion in bloomBar.perfectFor" :key="occasion" class="flex items-center gap-2.5">
            <span class="not-italic text-[0.7rem] text-sage" aria-hidden="true">❀</span>{{ occasion }}
          </li>
        </ul>
        <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <NuxtLink to="/contact" class="btn btn-solid">{{ bloomBar.cta }}</NuxtLink>
          <NuxtLink :to="{ path: '/gallery', query: { category: 'bloom-bar' } }" class="link-caps">{{ bloomBar.galleryCta }}</NuxtLink>
        </div>
      </div>
    </div>
    <p v-reveal class="mx-auto mt-24 max-w-[60ch] text-center font-serif text-[1.25rem] italic text-ink-soft [text-wrap:balance]">
      {{ services.also }}
      <NuxtLink to="/contact" class="not-italic text-sage-deep underline decoration-sage/50 underline-offset-4 hover:text-ink">{{ services.alsoCta }}</NuxtLink>.
    </p>
  </section>
</template>
