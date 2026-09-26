<script setup lang="ts">
const contact = useContent('contact')
</script>

<!-- Full-width photo band that closes most pages with a way to get in touch -->
<template>
  <section id="book" class="relative isolate overflow-hidden px-6 py-28 text-center md:py-36">
    <img :src="contact.band.photo" :style="photoFocus(contact.band.photo)" alt="" loading="lazy" class="absolute inset-0 -z-20 h-full w-full object-cover">
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-ink/50 to-ink/65" aria-hidden="true" />
    <div v-reveal>
      <p class="font-script text-[clamp(2rem,4.5vw,2.8rem)] text-beige">{{ contact.scriptLine }}</p>
      <h2 class="mx-auto mt-1 max-w-[18ch] text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-[1.05] text-ivory">{{ contact.band.title }}</h2>
      <p class="mx-auto mt-5 max-w-[48ch] text-cream/85">{{ contact.band.body }}</p>
      <div class="mt-9 flex flex-wrap justify-center gap-4">
        <NuxtLink to="/contact" class="btn btn-light">{{ contact.band.cta }}</NuxtLink>
        <a :href="contact.messageUrl" target="_blank" rel="noopener" class="btn btn-ghost-light">{{ contact.cta }}</a>
      </div>
    </div>
  </section>
</template>
