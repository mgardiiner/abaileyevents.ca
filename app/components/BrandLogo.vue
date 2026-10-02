<script setup lang="ts">
// badge keeps the artwork's cream inside the ring, for dark backgrounds
defineProps<{ compact?: boolean, badge?: boolean }>()
</script>

<template>
  <!-- Transparent cut-outs of the supplied artwork (abailey-events-logo.jpg), so the logo sits on any
       background. Compact is the circle, monogram and roses without the wordmark. -->
  <img v-if="compact" :src="badge ? '/images/abailey-events-mark-badge.webp' : '/images/abailey-events-mark.webp'" alt="" aria-hidden="true" width="400" height="363" class="shrink-0 object-contain">
  <img v-else src="/images/abailey-events-logo.webp" alt="ABailey Events — Bloom Bar services, wedding coordinator, décor rentals and event planning" width="720" height="720" class="h-auto">
</template>
