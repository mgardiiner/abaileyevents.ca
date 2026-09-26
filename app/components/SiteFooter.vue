<script setup lang="ts">
import contact from '~/data/contact.json'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-forest px-6 py-11 text-center text-[0.8rem] text-cream/75">
    <a href="#top" class="mb-3.5 inline-block font-serif text-2xl tracking-[0.06em] text-ivory"><b class="font-semibold">ABailey</b> Events ❀</a>
    <p class="mb-[18px] text-[0.68rem] uppercase tracking-[0.2em]">{{ contact.areas.join(' · ') }}</p>
    <p class="opacity-60">WPIC Certified Wedding Planner &amp; Coordinator · © {{ year }} ABailey Events</p>
  </footer>
</template>
