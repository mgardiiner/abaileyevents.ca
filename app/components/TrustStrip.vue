<script setup lang="ts">
const hero = useContent('hero')
</script>

<template>
  <div class="border-y border-ink/10 bg-cream px-6 py-[18px]">
    <div class="mx-auto flex max-w-wrap flex-wrap justify-center gap-x-8 gap-y-2.5 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-ink-muted">
      <span v-for="(item, i) in hero.trust" :key="item" class="inline-flex items-center gap-8">
        {{ item }}
        <RoseMark v-if="i < hero.trust.length - 1" class="h-[1.1rem] w-[1.1rem] shrink-0 text-sage" :weight="1.8" />
      </span>
    </div>
  </div>
</template>
