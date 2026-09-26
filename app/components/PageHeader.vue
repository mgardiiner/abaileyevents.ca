<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; emphasis?: string; intro?: string }>()
</script>

<!-- Top of every inner page: title block on the hero wash, with an optional photo composition in the slot -->
<template>
  <header class="bg-page relative overflow-hidden px-6 pb-16 pt-[132px] md:pb-20 md:pt-[164px]">
    <div class="mx-auto max-w-wrap text-center">
      <span class="eyebrow">{{ eyebrow }}</span>
      <h1 class="mx-auto mt-5 max-w-[18ch] text-[clamp(2.7rem,6vw,4.6rem)] font-light leading-[1.02] text-ink">
        {{ title }}
        <em v-if="emphasis" class="block font-light italic text-sage-deep">{{ emphasis }}</em>
      </h1>
      <p v-if="intro" class="mx-auto mt-6 max-w-[58ch] text-[1.05rem] text-ink-muted">
        {{ intro }}
        <slot name="intro" />
      </p>
    </div>
    <slot />
  </header>
</template>
