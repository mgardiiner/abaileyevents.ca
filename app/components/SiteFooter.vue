<script setup lang="ts">
import contact from '~/data/contact.json'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-forest text-cream">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-sm sm:flex-row sm:justify-between sm:px-6">
      <p>&copy; {{ year }} A Bailey Events &middot; {{ contact.location }}</p>
      <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="hover:text-blush">@{{ contact.instagram }}</a>
    </div>
  </footer>
</template>
