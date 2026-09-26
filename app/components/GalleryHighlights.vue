<script setup lang="ts">
const contact = useContent('contact')
const gallery = useContent('gallery')

// The home page shows the hand-picked highlights, in the order they are listed.
const shots = computed(() => gallery.highlights.flatMap(src => gallery.items.filter(item => item.src === src)))
const failed = reactive(new Set<string>())
</script>

<template>
  <section id="gallery" class="bg-white px-6 py-24 md:py-28">
    <SectionIntro :eyebrow="gallery.eyebrow" :title="gallery.homeTitle" :intro="gallery.intro">
      <a :href="contact.instagramUrl" target="_blank" rel="noopener" class="text-sage-deep underline">@{{ contact.instagram }}</a>.
    </SectionIntro>
    <!-- One large feature photo beside four smaller ones -->
    <div class="mx-auto mt-14 grid max-w-wrap grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-4 md:grid-rows-[250px_250px]">
      <NuxtLink
        v-for="(shot, i) in shots"
        :key="shot.src"
        v-reveal
        to="/gallery"
        class="group relative overflow-hidden rounded-sm bg-cream"
        :class="i === 0 ? 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto' : 'aspect-square md:aspect-auto'"
      >
        <PhotoPlaceholder v-if="failed.has(shot.src)" :file="shot.src" />
        <img v-else :src="shot.src" :style="photoFocus(shot.src)" :alt="shot.alt" loading="lazy" class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" @error="failed.add(shot.src)">
        <span class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-ink/60 px-4 pb-3 pt-10 text-[0.7rem] uppercase tracking-[0.14em] text-ivory transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
          {{ shot.caption }}
        </span>
      </NuxtLink>
    </div>
    <div v-reveal class="mt-12 text-center">
      <NuxtLink to="/gallery" class="btn btn-ghost">{{ gallery.homeCta }}</NuxtLink>
    </div>
  </section>
</template>
