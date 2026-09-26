<script setup lang="ts">
const hero = useContent('hero')

const kickerParts = computed(() => hero.kicker.split(' · '))

// Crossfade through the hero photos; visitors who prefer reduced motion keep the first.
const current = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    current.value = (current.value + 1) % hero.slides.length
  }, 5000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <header id="top" class="bg-hero relative overflow-hidden px-6 pb-24 pt-[112px] lg:flex lg:min-h-svh lg:items-center lg:pb-20 lg:pt-[104px]">
    <RoseBloom class="pointer-events-none absolute -bottom-[60px] -left-[70px] w-[200px] rotate-[10deg] opacity-30 sm:-bottom-[70px] sm:-left-[80px] sm:w-[260px]" color="#7D8B74" bunch />

    <div class="relative mx-auto grid w-full max-w-wrap items-center gap-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
      <div class="text-center lg:text-left">
        <!-- Each part of the kicker gets its own line on phones instead of wrapping mid-phrase -->
        <p class="mb-6 flex flex-col items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.34em] text-sage-deep sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
          <template v-for="(part, i) in kickerParts" :key="part">
            <span v-if="i" class="hidden text-sage sm:inline" aria-hidden="true">·</span>
            <span>{{ part }}</span>
          </template>
        </p>
        <h1 class="text-[clamp(3.1rem,7vw,5.6rem)] font-light leading-[0.98] text-ink">
          {{ hero.title }}
          <em class="block font-light italic text-sage-deep">{{ hero.titleEmphasis }}</em>
        </h1>
        <p class="mt-5 font-script text-[clamp(1.7rem,3vw,2.3rem)] text-sage-deep">{{ hero.scriptLine }}</p>
        <p class="mx-auto mb-10 mt-4 max-w-[46ch] text-[1.05rem] text-ink-muted lg:mx-0">{{ hero.sub }}</p>
        <div class="flex flex-wrap justify-center gap-4 lg:justify-start">
          <NuxtLink v-for="(cta, i) in hero.ctas" :key="cta.href" class="btn" :class="i === 0 ? 'btn-solid' : 'btn-ghost'" :to="cta.href">{{ cta.label }}</NuxtLink>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[360px] sm:max-w-[420px]">
        <div class="absolute -right-4 -top-4 h-full w-full rounded-t-full border border-beige-deep/70" aria-hidden="true" />
        <div class="relative aspect-[4/5] overflow-hidden rounded-t-full bg-cream shadow-lift">
          <img
            v-for="(slide, i) in hero.slides"
            :key="slide.src"
            :src="slide.src"
            :style="photoFocus(slide.src)"
            :alt="slide.alt"
            :aria-hidden="i !== current"
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out"
            :class="i === current ? 'opacity-100' : 'opacity-0'"
          >
        </div>
        <div class="absolute -bottom-9 -left-10 hidden h-[150px] w-[150px] overflow-hidden rounded-full border-[6px] border-ivory shadow-lift sm:block">
          <img :src="hero.accent.src" :style="photoFocus(hero.accent.src)" :alt="hero.accent.alt" class="h-full w-full object-cover">
        </div>
        <div class="absolute -bottom-4 right-2 flex gap-2" aria-hidden="true">
          <span
            v-for="(slide, i) in hero.slides"
            :key="slide.src"
            class="h-1.5 w-1.5 rounded-full transition-colors duration-500"
            :class="i === current ? 'bg-sage-deep' : 'bg-sage/30'"
          />
        </div>
      </div>
    </div>
  </header>
</template>
