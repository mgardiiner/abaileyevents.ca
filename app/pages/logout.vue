<script setup lang="ts">
definePageMeta({ layout: false })

useCookie('preview').value = null
await navigateTo('/coming-soon')
</script>

<template>
  <div />
</template>
