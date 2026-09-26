<script setup lang="ts">
import packages from '~/data/packages.json'
</script>

<template>
  <section id="packages" class="relative overflow-hidden bg-cream px-6 py-24">
    <BotanicalSprig class="pointer-events-none absolute -right-[50px] -top-[30px] w-[260px] rotate-[160deg] opacity-35" color="#55624D" />
    <SectionIntro :eyebrow="packages.eyebrow" :title="packages.title" :intro="packages.intro" />
    <div class="mx-auto mt-[54px] grid max-w-wrap gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="pkg in packages.items" :key="pkg.name" v-reveal>
        <PackageCard :pkg="pkg" />
      </div>
    </div>
    <p v-if="packages.note" v-reveal class="mx-auto mt-[30px] max-w-wrap text-center text-[0.8rem] italic text-ink-faint">{{ packages.note }}</p>
  </section>
</template>
