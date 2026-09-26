<script setup lang="ts">
import rentals from '~/data/rentals.json'

interface RentalItem {
  name: string
  price: string
  description?: string
  photo?: string
  photoAlt?: string
}

const items: RentalItem[] = rentals.items
// Items without a photo yet (or whose file failed to load) show a soft tinted tile.
const failed = reactive(new Set<string>())
</script>

<!-- Décor Rentals page body: the package, how renting works, then individual pieces -->
<template>
  <div>
    <section id="rental-package" class="bg-ivory px-6 pb-24 pt-8 md:pb-28">
      <div v-reveal class="mx-auto max-w-wrap">
        <PackageCard :pkg="rentals.package" />
      </div>
    </section>

    <section id="how-it-works" class="bg-cream px-6 py-24 md:py-28">
      <SectionIntro :eyebrow="rentals.steps.eyebrow" :title="rentals.steps.title" />
      <ol class="mx-auto mt-14 grid max-w-wrap gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <li v-for="(step, i) in rentals.steps.items" :key="step.title" v-reveal class="border-t border-ink/10 pt-6 text-center sm:text-left">
          <p class="font-serif text-[2.4rem] font-light italic leading-none text-sage">0{{ i + 1 }}</p>
          <h3 class="mb-2 mt-4 text-[1.5rem] font-normal text-ink">{{ step.title }}</h3>
          <p class="text-[0.93rem] text-ink-muted">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <section id="individual-rentals" class="bg-white px-6 py-24 md:py-28">
      <div class="mx-auto max-w-wrap">
        <p v-reveal class="text-center"><span class="eyebrow">{{ rentals.itemsTitle }}</span></p>
        <div v-if="items.length" class="mt-10 grid gap-[22px] min-[520px]:grid-cols-2 md:grid-cols-3">
          <article v-for="item in items" :key="item.name" v-reveal class="overflow-hidden rounded-sm bg-white shadow-soft ring-1 ring-ink/[0.06]">
            <div class="relative aspect-[4/3]">
              <img v-if="item.photo && !failed.has(item.photo)" :src="item.photo" :alt="item.photoAlt ?? item.name" loading="lazy" class="h-full w-full object-cover" @error="item.photo && failed.add(item.photo)">
              <div v-else class="ph-tint-1 absolute inset-0 flex items-center justify-center">
                <ServiceIcon name="flower" class="h-11 w-11 text-sage-deep opacity-60" />
              </div>
            </div>
            <div class="px-6 py-5">
              <div class="flex items-baseline justify-between gap-3">
                <h3 class="text-[1.3rem] text-ink">{{ item.name }}</h3>
                <span class="whitespace-nowrap font-serif text-[1.25rem] text-sage-deep">{{ item.price }}</span>
              </div>
              <p v-if="item.description" class="mt-1.5 text-[0.9rem] text-ink-muted">{{ item.description }}</p>
            </div>
          </article>
        </div>
        <p v-reveal class="mx-auto mt-5 max-w-[52ch] text-center font-serif text-[1.3rem] italic text-ink-soft">{{ rentals.itemsNote }}</p>
        <div v-reveal class="mt-9 flex flex-wrap justify-center gap-4">
          <NuxtLink class="btn btn-solid" to="/contact">{{ rentals.cta }}</NuxtLink>
          <NuxtLink class="btn btn-ghost" to="/decor-rentals#rentals-faq">{{ rentals.faqCta }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
