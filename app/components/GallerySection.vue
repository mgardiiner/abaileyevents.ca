<script setup lang="ts">
import gallery from '~/data/gallery.json'

interface Shot {
  src: string
  w?: number
  h?: number
  alt: string
  caption: string
  credit?: string
  categories: string[]
}

const items: Shot[] = gallery.items
const route = useRoute()

// Only offer a filter for event types that have at least one photo tagged.
const filters = [
  { id: 'all', label: 'All' },
  ...gallery.categories.filter(category => items.some(shot => shot.categories.includes(category.id))),
]
// Links like /gallery?category=bloom-bar open on that filter.
const requested = route.query.category
const active = ref(typeof requested === 'string' && filters.some(filter => filter.id === requested) ? requested : 'all')
const shots = computed(() => active.value === 'all' ? items : items.filter(shot => shot.categories.includes(active.value)))

// Show a page of photos at a time so the page stays a reasonable length.
const visible = ref(gallery.pageSize)
const shown = computed(() => shots.value.slice(0, visible.value))
watch(active, () => { visible.value = gallery.pageSize })

// Photos whose file failed to load render a placeholder naming the file instead.
const failed = reactive(new Set<string>())
</script>

<template>
  <section id="photos" class="bg-ivory px-6 pb-24 md:pb-28">
    <div v-if="filters.length > 2" class="mx-auto flex max-w-wrap flex-wrap justify-center gap-2.5" role="group" aria-label="Filter photos by event type">
      <button v-for="filter in filters" :key="filter.id" type="button" class="chip" :aria-pressed="active === filter.id" @click="active = filter.id">
        {{ filter.label }}
      </button>
    </div>
    <!-- Masonry: each photo keeps its own shape; the sizes in gallery.json reserve space while it loads -->
    <div class="mx-auto mt-10 max-w-wrap columns-2 gap-2.5 sm:gap-3.5 md:columns-3">
      <figure v-for="shot in shown" :key="shot.src" class="group relative mb-2.5 break-inside-avoid overflow-hidden rounded-sm bg-cream sm:mb-3.5">
        <div v-if="failed.has(shot.src)" class="relative aspect-[4/5]">
          <PhotoPlaceholder :file="shot.src" />
        </div>
        <img v-else :src="shot.src" :alt="shot.alt" :width="shot.w" :height="shot.h" loading="lazy" class="block h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" @error="failed.add(shot.src)">
        <!-- Captions sit on hover where there is hover, and always on touch screens -->
        <figcaption
          class="absolute inset-x-0 bottom-0 px-4 pb-3.5 pt-12 text-[0.7rem] uppercase tracking-[0.14em] transition-opacity duration-500 sm:px-5 sm:text-[0.76rem] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          :class="failed.has(shot.src) ? 'text-sage-deep' : 'bg-gradient-to-b from-transparent to-ink/65 text-ivory'"
        >
          {{ shot.caption }}
          <span v-if="shot.credit" class="mt-0.5 block text-[0.64rem] normal-case tracking-[0.08em] opacity-80">Photo: {{ shot.credit }}</span>
        </figcaption>
      </figure>
    </div>
    <div v-if="shots.length > visible" class="mt-10 text-center">
      <button type="button" class="btn btn-ghost" @click="visible += gallery.pageSize">
        Show More Photos ({{ shots.length - visible }})
      </button>
    </div>
  </section>
</template>
