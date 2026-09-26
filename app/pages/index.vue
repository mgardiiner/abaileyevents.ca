<script setup lang="ts">
import contact from '~/data/contact.json'
</script>

<template>
  <section class="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
    <p class="font-script text-4xl text-gold sm:text-5xl">Welcome</p>
    <h1 class="mt-4 font-serif text-4xl leading-tight text-forest sm:text-6xl">
      Let us make your special day stunning and stress free
    </h1>
    <p class="mt-6 max-w-xl text-lg font-light text-ink/80">
      Wedding planning &amp; coordination, bloom bars and event rentals in {{ contact.location }}.
    </p>
    <a
      :href="contact.messageUrl"
      target="_blank"
      rel="noopener"
      class="mt-10 rounded-full border border-sage-deep px-8 py-3 text-sm font-medium uppercase tracking-widest text-sage-deep transition hover:bg-sage-deep hover:text-ivory"
    >
      Send us a message
    </a>
  </section>
</template>
