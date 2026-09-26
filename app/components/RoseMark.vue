<script setup lang="ts">
// Heavier lines keep it readable at bullet size; sparkle adds two dots, for the wordmark.
withDefaults(defineProps<{ weight?: number, sparkle?: boolean }>(), { weight: 1.5, sparkle: false })
</script>

<!-- A small tilted rose drawn in the text colour, used in the wordmark and as a bullet -->
<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="weight" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g transform="rotate(-14 12 10)">
      <path d="M12.6 7.9c.7.4 1.6-.1 1.5-.9-.1-1.1-1.4-1.6-2.4-1-1.2.7-1.3 2.5-.3 3.4 1.2 1 3.4.7 4.1-.9" />
      <path d="M8.1 7.4c-.3 3 1.5 5.1 3.9 5.1s4.2-2.1 3.9-5.1" />
      <path d="M8.1 7.4C6.4 7.8 5.7 9.4 6.1 11c.6 2.5 3 4 5.9 4" />
      <path d="M15.9 7.4c1.7.4 2.4 2 2 3.6-.6 2.5-3 4-5.9 4" />
      <path d="M8.1 7.4C8.6 5.6 10 4.5 11.8 4.6c-.6.3-.9.8-.9 1.3" />
      <path d="M15.9 7.4c-.3-1.5-1.4-2.6-2.8-2.9.5.4.7.9.6 1.4" />
    </g>
    <path d="M13.2 14.9c.2 2.4-1.8 3.6-1 6.6" />
    <path d="M12.4 19.2c-2.3.3-4-.8-4.6-2.5 2.2-.4 3.9.4 4.6 2.5z" />
    <path d="M12.7 17.3c1.5-.7 3.1-.3 3.3.9.1 1-1.1 1.4-1.6.6" />
    <template v-if="sparkle">
      <circle cx="19.4" cy="4.6" r=".75" fill="currentColor" stroke="none" />
      <circle cx="4.4" cy="5.8" r=".6" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>
