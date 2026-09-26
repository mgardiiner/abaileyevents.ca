<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; intro?: string }>()
</script>

<template>
  <div v-reveal class="mx-auto max-w-wrap text-center">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2 class="mb-5 mt-4 text-[clamp(2.3rem,4.8vw,3.4rem)] font-light leading-[1.05] text-ink">{{ title }}</h2>
    <p v-if="intro" class="mx-auto max-w-[56ch] text-ink-muted">
      {{ intro }}
      <slot />
    </p>
  </div>
</template>
