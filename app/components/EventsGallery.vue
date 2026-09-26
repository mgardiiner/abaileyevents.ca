<script setup lang="ts">
import contact from '~/data/contact.json'
import events from '~/data/events.json'

// Photos whose file failed to load render a placeholder naming the file instead.
const failed = reactive(new Set<string>())
</script>

<template>
  <section id="events" class="px-6 py-24">
    <SectionIntro :eyebrow="events.eyebrow" :title="events.title" :intro="events.intro">
      <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="text-sage-deep underline">@{{ contact.instagram }}</a>.
    </SectionIntro>
    <div class="mx-auto mt-[54px] grid max-w-wrap gap-[18px] min-[520px]:grid-cols-2 md:grid-cols-3">
      <figure v-for="shot in events.items" :key="shot.src" v-reveal class="group relative aspect-[4/5] overflow-hidden rounded border border-forest/10 bg-white">
        <PhotoPlaceholder v-if="failed.has(shot.src)" :file="shot.src" :tint="shot.tint" />
        <img v-else :src="shot.src" :alt="shot.alt" loading="lazy" class="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-105" @error="failed.add(shot.src)">
        <figcaption
          class="absolute inset-x-0 bottom-0 px-[18px] pb-3.5 pt-9 text-[0.82rem] uppercase tracking-[0.12em]"
          :class="failed.has(shot.src) ? 'text-sage-deep' : 'bg-gradient-to-b from-transparent to-ink/70 text-ivory'"
        >
          {{ shot.caption }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>
