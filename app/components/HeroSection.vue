<script setup lang="ts">
import hero from '~/data/hero.json'
</script>

<template>
  <header id="top" class="bg-hero relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-[90px] pt-[120px] text-center">
    <BotanicalSprig class="pointer-events-none absolute -bottom-10 -left-[70px] w-[240px] rotate-[8deg] opacity-50 sm:w-[340px]" color="#7D8B74" />
    <BotanicalSprig class="pointer-events-none absolute -right-[60px] top-[60px] w-[220px] -rotate-6 -scale-x-100 opacity-50 sm:w-[300px]" color="#CFA294" />

    <p class="relative mb-[22px] text-xs font-medium uppercase tracking-[0.34em] text-sage-deep">{{ hero.kicker }}</p>
    <h1 class="relative mx-auto max-w-[14ch] text-[clamp(2.8rem,7.5vw,5.2rem)] text-forest">
      {{ hero.title }} <em class="italic text-blush-deep">{{ hero.titleEmphasis }}</em>.
    </h1>
    <p class="relative mb-2 mt-5 font-script text-[clamp(1.6rem,3.4vw,2.4rem)] text-gold">{{ hero.scriptLine }}</p>
    <p class="relative mx-auto mb-[38px] mt-2.5 max-w-[52ch] text-[1.05rem] text-ink-muted">{{ hero.sub }}</p>
    <div class="relative flex flex-wrap justify-center gap-4">
      <a class="btn btn-solid" href="#packages">View Packages</a>
      <a class="btn btn-ghost" href="#contact">Let's Chat</a>
    </div>
    <a href="#services" class="absolute inset-x-0 bottom-[26px] mx-auto w-max text-[0.68rem] uppercase tracking-[0.3em] text-sage-deep motion-safe:animate-bob">Scroll ↓</a>
  </header>
</template>
