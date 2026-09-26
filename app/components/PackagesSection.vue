<script setup lang="ts">
import packages from '~/data/packages.json'
</script>

<template>
  <section id="packages" class="relative overflow-hidden bg-cream px-6 py-24">
    <BotanicalSprig class="pointer-events-none absolute -right-[50px] hidden md:block -top-[30px] w-[260px] rotate-[160deg] opacity-35" color="#55624D" />
    <SectionIntro :eyebrow="packages.eyebrow" :title="packages.title" :intro="packages.intro" />
    <div class="mx-auto mt-16 grid max-w-wrap gap-10">
      <div v-for="pkg in packages.items" :key="pkg.name" v-reveal>
        <PackageCard :pkg="pkg" />
      </div>
    </div>
    <div v-reveal class="mx-auto mt-16 max-w-[640px] text-center">
      <span class="mx-auto mb-5 block text-[1.1rem] text-sage" aria-hidden="true">❀</span>
      <p class="font-serif text-[2rem] font-light text-ink">{{ packages.custom.title }}</p>
      <p class="mx-auto mb-7 mt-2 max-w-[52ch] text-ink-muted">{{ packages.custom.body }}</p>
      <NuxtLink class="btn btn-ghost" to="/contact">{{ packages.custom.cta }}</NuxtLink>
    </div>
  </section>
</template>
