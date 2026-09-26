<script setup lang="ts">
import contact from '~/data/contact.json'
</script>

<template>
  <header class="border-b border-cream">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <NuxtLink to="/" class="font-serif text-2xl tracking-wide text-forest">
        A Bailey <span class="font-script text-gold">Events</span>
      </NuxtLink>
      <a
        :href="contact.messageUrl"
        target="_blank"
        rel="noopener"
        class="rounded-full bg-sage-deep px-5 py-2 text-sm font-medium uppercase tracking-widest text-ivory transition hover:bg-forest"
      >
        Inquire
      </a>
    </div>
  </header>
</template>
