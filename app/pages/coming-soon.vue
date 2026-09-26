<script setup lang="ts">
import comingSoon from '~/data/coming-soon.json'
import contact from '~/data/contact.json'

definePageMeta({ layout: false })
useHead({ title: comingSoon.pageTitle })
</script>

<template>
  <main class="bg-hero relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-[90px] text-center text-ink">
    <BotanicalSprig class="pointer-events-none absolute -bottom-10 -left-[70px] w-[240px] rotate-[8deg] opacity-50 sm:w-[340px]" color="#7D8B74" />
    <BotanicalSprig class="pointer-events-none absolute -right-[60px] top-[60px] w-[220px] -rotate-6 -scale-x-100 opacity-60 sm:w-[300px]" color="#B4A186" />

    <p class="relative mb-10 font-serif text-[1.5rem] tracking-[0.06em] text-ink">
      <b class="font-semibold">ABailey</b> Events <span class="text-sage">❀</span>
    </p>
    <p class="relative mb-[22px] text-xs font-medium uppercase tracking-[0.34em] text-sage-deep">{{ comingSoon.kicker }}</p>
    <h1 class="relative mx-auto max-w-[14ch] text-[clamp(2.8rem,7.5vw,5.2rem)] text-ink">
      {{ comingSoon.title }} <em class="italic text-sage">{{ comingSoon.titleEmphasis }}</em>.
    </h1>
    <p class="relative mb-2 mt-5 font-script text-[clamp(1.6rem,3.4vw,2.4rem)] text-sage-deep">{{ comingSoon.scriptLine }}</p>
    <p class="relative mx-auto mb-[38px] mt-2.5 max-w-[52ch] text-[1.05rem] text-ink-muted">{{ comingSoon.sub }}</p>
    <div class="relative flex flex-wrap justify-center gap-4">
      <a class="btn btn-solid" :href="contact.messageUrl" target="_blank" rel="noopener">{{ comingSoon.cta }}</a>
      <a class="btn btn-ghost" :href="contact.instagramUrl" target="_blank" rel="noopener">{{ comingSoon.followCta }}</a>
    </div>
    <p class="absolute inset-x-0 bottom-[26px] text-[0.68rem] uppercase tracking-[0.3em] text-sage-deep">Serving {{ contact.serviceArea }}</p>
  </main>
</template>
