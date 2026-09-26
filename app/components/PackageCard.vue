<script setup lang="ts">
defineProps<{
  pkg: {
    name: string
    tag: string
    price: string
    priceNote?: string
    featured?: boolean
    flag?: string
    features: string[]
  }
}>()
</script>

<template>
  <div
    class="relative flex h-full flex-col rounded border bg-white px-7 pb-8 pt-[38px] transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    :class="pkg.featured ? 'border-sage shadow-featured' : 'border-forest/10'"
  >
    <span v-if="pkg.flag" class="absolute -top-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sage-deep px-4 py-[5px] text-[0.62rem] uppercase tracking-[0.22em] text-ivory">
      {{ pkg.flag }}
    </span>
    <h3 class="text-[1.45rem] text-forest">{{ pkg.name }}</h3>
    <p class="mb-4 mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-blush-deep">{{ pkg.tag }}</p>
    <p class="mb-1 font-serif text-[2rem] text-sage-deep">
      {{ pkg.price }}
      <small v-if="pkg.priceNote" class="font-sans text-[0.85rem] tracking-[0.05em] text-ink-faint">{{ pkg.priceNote }}</small>
    </p>
    <ul class="mb-[26px] mt-[18px] flex-1">
      <li
        v-for="feature in pkg.features"
        :key="feature"
        class="relative border-b border-dashed border-forest/10 py-2 pl-[26px] text-[0.9rem] text-ink-soft before:absolute before:left-0 before:text-[0.8rem] before:text-blush-deep before:content-['❀'] last:border-b-0"
      >
        {{ feature }}
      </li>
    </ul>
    <a class="btn" :class="pkg.featured ? 'btn-solid' : 'btn-ghost'" href="#contact">Inquire</a>
  </div>
</template>
