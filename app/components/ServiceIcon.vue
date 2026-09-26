<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
    <template v-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h6" />
    </template>
    <template v-else-if="name === 'flower'">
      <circle cx="12" cy="8" r="2.2" />
      <path d="M12 5.8C11 3.6 8.6 3 7.2 4.4 5.8 5.8 6.4 8.2 8.6 9.2M12 5.8c1-2.2 3.4-2.8 4.8-1.4 1.4 1.4.8 3.8-1.4 4.8M8.6 9.2c-2.4.4-3.4 2.6-2.4 4.2 1 1.6 3.4 1.6 4.8 0M15.4 9.2c2.4.4 3.4 2.6 2.4 4.2-1 1.6-3.4 1.6-4.8 0M12 10.2V21M12 21c0-3 2-4.6 4.4-4.8M12 21c0-3-2-4.6-4.4-4.8" />
    </template>
    <template v-else-if="name === 'rentals'">
      <path d="M4 21V10l8-6 8 6v11" />
      <path d="M4 21h16M9 21v-6h6v6M10 10h4" />
    </template>
  </svg>
</template>
