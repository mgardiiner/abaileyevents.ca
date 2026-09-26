<script setup lang="ts">
import services from '~/data/services.json'
</script>

<template>
  <section id="services" class="bg-ivory px-6 py-24">
    <SectionIntro :eyebrow="services.eyebrow" :title="services.title" :intro="services.intro" />
    <div class="mx-auto mt-[54px] grid max-w-wrap gap-[34px] md:grid-cols-3">
      <div v-for="service in services.items" :key="service.title" v-reveal>
        <div class="h-full rounded border border-forest/10 bg-white px-[30px] py-11 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
          <ServiceIcon :name="service.icon" class="mx-auto mb-5 h-[54px] w-[54px] text-sage-deep" />
          <h3 class="mb-3 text-2xl text-forest">{{ service.title }}</h3>
          <p class="text-[0.95rem] text-ink-muted">{{ service.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
