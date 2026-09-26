<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; intro?: string; dark?: boolean }>()
</script>

<template>
  <div v-reveal class="mx-auto max-w-wrap text-center">
    <span class="eyebrow" :class="{ 'eyebrow--light': dark }">{{ eyebrow }}</span>
    <h2 class="mb-[18px] mt-3.5 text-[clamp(2rem,4.5vw,3rem)]" :class="dark ? 'text-ivory' : 'text-forest'">{{ title }}</h2>
    <p v-if="intro" class="mx-auto max-w-[56ch] text-ink-muted">
      {{ intro }}
      <slot />
    </p>
  </div>
</template>
