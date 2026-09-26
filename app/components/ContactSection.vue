<script setup lang="ts">
import contact from '~/data/contact.json'
</script>

<template>
  <section id="contact" class="bg-contact relative overflow-hidden px-6 py-[120px] text-center">
    <div v-reveal>
      <p class="font-script text-[clamp(2rem,4.5vw,3rem)] text-gold">{{ contact.scriptLine }}</p>
      <h2 class="mb-5 mt-2 text-[clamp(2.2rem,5vw,3.4rem)] text-forest">{{ contact.heading }}</h2>
      <p class="mx-auto mb-10 max-w-[50ch] text-ink-muted">{{ contact.body }}</p>
      <a class="btn btn-solid" :href="contact.messageUrl" target="_blank" rel="noopener">{{ contact.cta }}</a>
      <div>
        <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="mt-[26px] inline-flex items-center gap-2.5 text-[0.85rem] uppercase tracking-[0.16em] text-sage-deep hover:text-forest">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
          @{{ contact.instagram }}
        </a>
      </div>
    </div>
  </section>
</template>
