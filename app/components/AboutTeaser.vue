<script setup lang="ts">
const about = useContent('about')

const portraitFailed = ref(false)
</script>

<template>
  <section id="about" class="bg-cream px-6 py-24 md:py-28">
    <div class="mx-auto grid max-w-[1000px] items-center gap-12 md:grid-cols-[360px_minmax(0,1fr)] md:gap-20">
      <div v-reveal class="relative mx-auto w-full max-w-[300px] md:max-w-none">
        <!-- An oval portrait with a hairline oval echoing it -->
        <div class="absolute -inset-3 rounded-[50%] border border-beige-deep/60" aria-hidden="true" />
        <div class="relative aspect-[3/4] overflow-hidden rounded-[50%] bg-ivory">
          <PhotoPlaceholder v-if="portraitFailed" :file="about.portrait" label="Your portrait here" />
          <img v-else :src="about.portrait" :style="photoFocus(about.portrait)" :alt="about.portraitAlt" loading="lazy" class="h-full w-full object-cover" @error="portraitFailed = true">
        </div>
      </div>
      <div v-reveal class="text-center md:text-left">
        <span class="eyebrow">{{ about.teaserEyebrow }}</span>
        <h2 class="mt-4 text-[clamp(2.2rem,4.2vw,3.2rem)] font-light leading-[1.05] text-ink">{{ about.heading }}</h2>
        <p class="mb-5 mt-1 font-script text-[1.9rem] text-sage-deep">{{ about.scriptLine }}</p>
        <p class="text-ink-soft">{{ about.paragraphs[0] }}</p>
        <div class="mb-8 mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
          <span v-for="fact in about.facts" :key="fact" class="rounded-full border border-sage px-[18px] py-2 text-[0.72rem] uppercase tracking-[0.16em] text-sage-deep">{{ fact }}</span>
        </div>
        <NuxtLink to="/about" class="btn btn-ghost">{{ about.teaserCta }}</NuxtLink>
      </div>
    </div>
  </section>
</template>
