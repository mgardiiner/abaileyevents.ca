<script setup lang="ts">
// Heavier lines keep it readable at bullet size.
withDefaults(defineProps<{ weight?: number }>(), { weight: 1.5 })
</script>

<!-- A small rose drawn in the text colour, used in the wordmark and as a bullet -->
<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="weight" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12.6 7.9c.7.4 1.6-.1 1.5-.9-.1-1.1-1.4-1.6-2.4-1-1.2.7-1.3 2.5-.3 3.4 1.2 1 3.4.7 4.1-.9" />
    <path d="M8.1 7.4c-.3 3 1.5 5.1 3.9 5.1s4.2-2.1 3.9-5.1" />
    <path d="M8.1 7.4C6.4 7.8 5.7 9.4 6.1 11c.6 2.5 3 4 5.9 4" />
    <path d="M15.9 7.4c1.7.4 2.4 2 2 3.6-.6 2.5-3 4-5.9 4" />
    <path d="M8.1 7.4C9.1 5.3 10.8 4.4 12.5 4.8" />
    <path d="M15.9 7.4c-.6-1.4-1.7-2.3-3-2.5" />
    <path d="M12 15v6.5" />
    <path d="M12 19.4c-2.3.2-3.9-.9-4.4-2.6 2.1-.3 3.8.5 4.4 2.6z" />
    <path d="M12 18.3c2.1 0 3.5-1.1 4-2.7-2-.1-3.4.8-4 2.7z" />
  </svg>
</template>
