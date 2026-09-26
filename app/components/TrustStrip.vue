<script setup lang="ts">
import hero from '~/data/hero.json'
</script>

<template>
  <div class="bg-forest px-6 py-5 text-cream">
    <div class="mx-auto flex max-w-wrap flex-wrap justify-center gap-x-[46px] gap-y-3.5 text-[0.74rem] uppercase tracking-[0.22em]">
      <span v-for="(item, i) in hero.trust" :key="item" class="inline-flex items-center gap-2.5">
        {{ item }}
        <span v-if="i < hero.trust.length - 1" class="h-[5px] w-[5px] flex-none rounded-full bg-blush" />
      </span>
    </div>
  </div>
</template>
