<script setup lang="ts">
const contact = useContent('contact')
</script>

<template>
  <section id="contact" class="bg-page relative overflow-hidden px-6 pb-24 pt-[128px] md:pb-[120px] md:pt-[164px]">
    <div class="mx-auto grid max-w-wrap items-start gap-12 md:grid-cols-[5fr_7fr] md:gap-16">
      <div v-reveal class="text-center md:pt-6 md:text-left">
        <p class="font-script text-[clamp(2rem,4.5vw,3rem)] text-sage-deep">{{ contact.scriptLine }}</p>
        <h1 class="mb-5 mt-2 text-[clamp(2.4rem,5vw,3.6rem)] font-light leading-[1.05] text-ink">{{ contact.heading }}</h1>
        <p class="mx-auto max-w-[50ch] text-ink-muted md:mx-0">{{ contact.body }}</p>

        <ul class="mt-8 inline-grid gap-4 text-left text-[0.95rem] text-ink-soft">
          <li>
            <a :href="`mailto:${contact.email}`" class="inline-flex items-center gap-3 hover:text-sage-deep">
              <svg class="h-5 w-5 flex-none text-sage-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
              {{ contact.email }}
            </a>
          </li>
          <li>
            <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-3 hover:text-sage-deep">
              <svg class="h-5 w-5 flex-none text-sage-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
              {{ contact.followCta }} @{{ contact.instagram }}
            </a>
          </li>
          <li class="inline-flex items-center gap-3">
            <svg class="h-5 w-5 flex-none text-sage-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Serving {{ contact.serviceArea }}
          </li>
        </ul>

        <div class="mt-8">
          <a class="btn btn-ghost" :href="contact.messageUrl" target="_blank" rel="noopener">{{ contact.cta }}</a>
        </div>
        <p class="mt-10 font-serif text-[1.2rem] italic text-ink-soft">
          {{ contact.faqPrompt }}
          <NuxtLink to="/faq" class="link-caps ml-2 font-sans not-italic">{{ contact.faqCta }}</NuxtLink>
        </p>
      </div>
      <div v-reveal>
        <ContactForm />
      </div>
    </div>
  </section>
</template>
