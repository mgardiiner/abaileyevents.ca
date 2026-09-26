<script setup lang="ts">
const packages = useContent('packages')
const services = useContent('services')

const { featured } = services
const failed = reactive(new Set<string>())
</script>

<!-- Event Planning page: wedding planning leads, with each package's starting price -->
<template>
  <section id="wedding-planning" class="bg-ivory px-6 py-24 md:py-28">
    <div class="mx-auto grid max-w-wrap items-center gap-16 md:grid-cols-2 lg:gap-24">
      <div v-reveal>
        <p class="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-sage-deep">{{ featured.tag }}</p>
        <h2 class="mb-5 mt-3 text-[clamp(2.2rem,4vw,3.1rem)] font-light leading-[1.05] text-ink">{{ featured.title }}</h2>
        <p v-for="paragraph in featured.body" :key="paragraph" class="mb-3.5 text-ink-soft">{{ paragraph }}</p>
        <dl class="mb-9 mt-7 border-t border-ink/10">
          <div v-for="pkg in packages.items" :key="pkg.name" class="flex flex-col gap-1 border-b border-ink/10 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="font-serif text-[1.2rem] text-ink">{{ pkg.name }}</dt>
            <dd class="text-[0.68rem] uppercase tracking-[0.16em] text-ink-muted">
              {{ pkg.pricePrefix }} <span class="ml-1 font-serif text-[1.5rem] normal-case tracking-normal text-ink">{{ pkg.price }}</span>
            </dd>
          </div>
        </dl>
        <NuxtLink class="btn btn-solid" to="/event-planning#packages">{{ featured.cta }}</NuxtLink>
      </div>
      <!-- A tall photo in an offset hairline frame, with a small square detail over its lower corner -->
      <div v-reveal class="relative mx-auto w-full max-w-[420px] md:order-first">
        <div class="absolute -right-4 -top-4 h-full w-full border border-beige-deep/70" aria-hidden="true" />
        <div class="relative aspect-[4/5] overflow-hidden bg-cream">
          <PhotoPlaceholder v-if="failed.has(featured.photo)" :file="featured.photo" />
          <img v-else :src="featured.photo" :alt="featured.photoAlt" loading="lazy" class="h-full w-full object-cover" @error="failed.add(featured.photo)">
        </div>
        <div class="absolute -bottom-10 -left-6 hidden aspect-square w-[36%] overflow-hidden border-[6px] border-ivory bg-cream shadow-lift sm:block lg:-left-12">
          <img v-if="!failed.has(featured.detail)" :src="featured.detail" :alt="featured.detailAlt" loading="lazy" class="h-full w-full object-cover" @error="failed.add(featured.detail)">
        </div>
      </div>
    </div>
  </section>
</template>
