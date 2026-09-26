<script setup lang="ts">
defineProps<{
  pkg: {
    name: string
    tag: string
    pricePrefix?: string
    price: string
    summary?: string
    features: string[]
    terms?: string[]
    goal?: string
    cta: string
  }
}>()
</script>

<template>
  <div class="grid overflow-hidden rounded-sm bg-white shadow-soft ring-1 ring-ink/[0.06] md:grid-cols-[5fr_7fr]">
    <div class="flex flex-col bg-cream/60 px-8 py-10 sm:px-11 sm:py-12">
      <p class="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-sage-deep">{{ pkg.tag }}</p>
      <h3 class="mt-3 text-[clamp(1.9rem,3.2vw,2.5rem)] font-light leading-[1.05] text-ink">{{ pkg.name }}</h3>
      <span class="my-6 block h-px w-12 bg-beige-deep" aria-hidden="true" />
      <p v-if="pkg.pricePrefix" class="text-[0.68rem] uppercase tracking-[0.22em] text-ink-muted">{{ pkg.pricePrefix }}</p>
      <p class="mt-1 font-serif text-[3.2rem] font-light leading-none text-ink">{{ pkg.price }}</p>
      <p v-if="pkg.summary" class="mt-6 text-[0.95rem] text-ink-soft">{{ pkg.summary }}</p>
      <ul v-if="pkg.terms" class="mt-5 space-y-1.5 text-[0.88rem] text-ink-muted">
        <li v-for="term in pkg.terms" :key="term" class="relative pl-5 before:absolute before:left-0 before:text-sage before:content-['—']">{{ term }}</li>
      </ul>
      <p v-if="pkg.goal" class="mt-7 font-serif text-[1.2rem] italic leading-snug text-ink-soft">“{{ pkg.goal }}”</p>
      <div class="mt-auto pt-9">
        <NuxtLink class="btn btn-solid" to="/contact">{{ pkg.cta }}</NuxtLink>
      </div>
    </div>
    <div class="px-8 py-10 sm:px-11 sm:py-12">
      <p class="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-ink-muted">This package includes</p>
      <!-- Short lists stay in one column so they don't leave a half-empty panel -->
      <ul class="gap-x-10" :class="{ 'sm:columns-2 md:columns-1 lg:columns-2': pkg.features.length > 14 }">
        <li
          v-for="feature in pkg.features"
          :key="feature"
          class="relative break-inside-avoid border-b border-ink/[0.07] py-2.5 pl-6 text-[0.9rem] leading-snug text-ink-soft"
        >
          <RoseMark class="absolute left-0 top-[11px] h-[0.95rem] w-[0.95rem] text-sage" :weight="1.8" />
          {{ feature }}
        </li>
      </ul>
    </div>
  </div>
</template>
