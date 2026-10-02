<script setup lang="ts">
const gallery = useContent('gallery')

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
const filters = computed(() => [
  { id: 'all', label: 'All' },
  ...gallery.categories.filter(category => items.some(shot => shot.categories.includes(category.id))),
])
// Links like /gallery?category=bloom-bar open on that filter.
const requested = route.query.category
const active = ref(typeof requested === 'string' && filters.value.some(filter => filter.id === requested) ? requested : 'all')
const shots = computed(() => active.value === 'all' ? items : items.filter(shot => shot.categories.includes(active.value)))

// Show a page of photos at a time so the page stays a reasonable length.
const visible = ref(gallery.pageSize)
const shown = computed(() => shots.value.slice(0, visible.value))
const galleryGrid = ref<HTMLElement | null>(null)
const columnMetrics = ref({ count: 2, width: 160, gap: 10 })

// Each photo joins the shortest column. Replaying the same prefix keeps existing
// photos in place when more are added, without leaving gaps between batches.
const columns = computed(() => {
  const { count, width, gap } = columnMetrics.value
  const result: Shot[][] = Array.from({ length: count }, () => [])
  const heights = Array<number>(count).fill(0)
  for (const shot of shown.value) {
    const shortest = heights.indexOf(Math.min(...heights))
    result[shortest]!.push(shot)
    heights[shortest]! += width * (shot.w && shot.h ? shot.h / shot.w : 5 / 4) + gap
  }
  return result
})

let resizeObserver: ResizeObserver | undefined
function measureColumns() {
  if (!galleryGrid.value) return
  const styles = window.getComputedStyle(galleryGrid.value)
  const count = styles.gridTemplateColumns.split(' ').length
  const gap = parseFloat(styles.columnGap) || 0
  const width = (galleryGrid.value.clientWidth - gap * (count - 1)) / count
  const previous = columnMetrics.value
  if (count !== previous.count || width !== previous.width || gap !== previous.gap) {
    columnMetrics.value = { count, width, gap }
  }
}
onMounted(() => {
  measureColumns()
  resizeObserver = new ResizeObserver(measureColumns)
  resizeObserver.observe(galleryGrid.value!)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const loadingMore = ref(false)
watch(active, () => { visible.value = gallery.pageSize })

async function showMore() {
  if (loadingMore.value) return
  loadingMore.value = true
  const scrollTop = window.scrollY
  visible.value = Math.min(visible.value + gallery.pageSize, shots.value.length)
  await nextTick()
  // Restore after layout, including when the final click removes the focused button.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  window.scrollTo({ top: scrollTop, behavior: 'instant' })
  loadingMore.value = false
}

// Photos whose file failed to load render a placeholder naming the file instead.
const failed = reactive(new Set<string>())
</script>

<template>
  <section id="photos" class="bg-ivory px-6 pb-24 [overflow-anchor:none] md:pb-28">
    <div v-if="filters.length > 2" class="mx-auto flex max-w-wrap flex-wrap justify-center gap-2.5" role="group" aria-label="Filter photos by event type">
      <button v-for="filter in filters" :key="filter.id" type="button" class="chip" :aria-pressed="active === filter.id" @click="active = filter.id">
        {{ filter.label }}
      </button>
    </div>
    <!-- Masonry: each photo keeps its own shape; the sizes in gallery.json reserve space while it loads -->
    <div ref="galleryGrid" class="mx-auto mt-10 grid max-w-wrap grid-cols-2 items-start gap-2.5 sm:gap-3.5 md:grid-cols-3">
      <div v-for="(column, index) in columns" :key="`${active}-${index}`" class="flex min-w-0 flex-col gap-2.5 sm:gap-3.5">
        <figure v-for="shot in column" :key="shot.src" class="group relative overflow-hidden rounded-sm bg-cream">
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
    </div>
    <div v-if="shots.length > visible" class="mt-10 text-center">
      <button type="button" class="btn btn-ghost" :disabled="loadingMore" @click="showMore">
        Show More Photos ({{ shots.length - visible }})
      </button>
    </div>
  </section>
</template>
