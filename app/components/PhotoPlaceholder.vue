<script setup lang="ts">
// Stands in for a photo whose file is missing, naming the exact file to add.
withDefaults(defineProps<{ file: string; label?: string; tint?: number }>(), { label: 'Your photo here', tint: 1 })
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center" :class="`ph-tint-${tint}`">
    <div class="p-5 text-center text-sage-deep">
      <svg class="mx-auto mb-3 h-11 w-11 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
        <circle cx="12" cy="9" r="2" />
        <path d="M12 7C11.2 5.2 9.2 4.8 8 6c-1.2 1.2-.8 3.2 1 4M12 7c.8-1.8 2.8-2.2 4-1 1.2 1.2.8 3.2-1 4M9 10c-2 .3-2.8 2.1-2 3.4.8 1.3 2.8 1.3 4 0M15 10c2 .3 2.8 2.1 2 3.4-.8 1.3-2.8 1.3-4 0M12 11v9M12 20c0-2.4 1.6-3.7 3.6-3.9M12 20c0-2.4-1.6-3.7-3.6-3.9" />
      </svg>
      <div class="font-serif text-xl italic">{{ label }}</div>
      <div class="mt-2 text-[0.68rem] uppercase tracking-[0.14em] opacity-70">{{ file }}</div>
    </div>
  </div>
</template>
