<script setup lang="ts">
const services = useContent('services')

// Photos whose file failed to load render a placeholder naming the file instead.
const failed = reactive(new Set<string>())
</script>

<!-- Home page overview: one card per offering, in the client's priority order, each linking to its page -->
<template>
  <section id="services" class="bg-ivory px-6 py-24 md:pb-32 md:pt-28">
    <SectionIntro :eyebrow="services.eyebrow" :title="services.title" :intro="services.intro" />
    <div class="mx-auto mt-16 grid max-w-wrap gap-16 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-3 lg:gap-x-12">
      <NuxtLink
        v-for="(item, i) in services.offerings"
        :key="item.title"
        v-reveal
        :to="item.href"
        class="group block text-center md:text-left"
        :class="{ 'md:mt-20': i === 1, 'sm:col-span-2 md:col-span-1': i === 2 }"
      >
        <div class="relative mx-auto aspect-[5/4] max-w-[380px] overflow-hidden rounded-sm bg-cream sm:aspect-[3/4]">
          <PhotoPlaceholder v-if="failed.has(item.photo)" :file="item.photo" />
          <img v-else :src="item.photo" :style="photoFocus(item.photo)" :alt="item.photoAlt" loading="lazy" class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" @error="failed.add(item.photo)">
          <span class="absolute left-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur-sm">{{ item.meta }}</span>
        </div>
        <p class="mt-7 font-serif text-[1.2rem] italic text-sage">0{{ i + 1 }}</p>
        <h3 class="mt-1 text-[1.85rem] font-light leading-[1.1] text-ink">{{ item.title }}</h3>
        <p class="mx-auto mt-3 max-w-[38ch] text-[0.95rem] text-ink-muted md:mx-0">{{ item.summary }}</p>
        <span class="link-caps mt-5">{{ item.cta }}</span>
      </NuxtLink>
    </div>
    <p v-reveal class="mx-auto mt-20 max-w-[60ch] text-center font-serif text-[1.25rem] italic text-ink-soft [text-wrap:balance]">
      {{ services.also }}
      <NuxtLink to="/contact" class="not-italic text-sage-deep underline decoration-sage/50 underline-offset-4 hover:text-ink">{{ services.alsoCta }}</NuxtLink>.
    </p>
  </section>
</template>
