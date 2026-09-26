<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: '#7D8B74' })
</script>

<!-- Botanical line art drawn in SVG so it needs no image files -->
<template>
  <svg viewBox="0 0 200 300" fill="none" :stroke="color" stroke-width="1.4" aria-hidden="true">
    <path d="M100 300 C 90 220, 110 160, 95 80" />
    <path d="M97 240 C 60 225, 40 190, 42 160 C 75 170, 95 200, 97 240 Z" opacity=".7" />
    <path d="M98 190 C 135 180, 155 150, 152 118 C 120 128, 100 155, 98 190 Z" opacity=".7" />
    <path d="M96 130 C 65 118, 52 90, 56 62 C 85 74, 96 98, 96 130 Z" opacity=".7" />
    <circle cx="95" cy="66" r="14" opacity=".8" />
    <circle cx="95" cy="66" r="7" opacity=".6" />
  </svg>
</template>
