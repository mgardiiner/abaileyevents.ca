<script setup lang="ts">
const props = defineProps<{
  pkg: {
    name: string
    tag: string
    pricePrefix?: string
    price: string
    summary?: string
    highlights?: string[]
    features: string[]
    terms?: string[]
    goal?: string
    cta: string
  }
}>()

const highlights = computed(() => props.pkg.highlights?.length ? props.pkg.highlights : props.pkg.features.slice(0, 5))
const hasDetails = computed(() => Boolean(props.pkg.highlights?.length || props.pkg.goal || props.pkg.features.length > highlights.value.length))

// Show more swaps the short list for everything included, in the same spot under the points
const open = ref(false)
const listId = useId()
const toggle = ref<HTMLButtonElement | null>(null)

async function toggleDetails() {
  open.value = !open.value
  if (open.value) return
  // The full list can be long: after closing it, bring the button back into view if it scrolled away
  // (under the fixed header counts as out of view)
  await nextTick()
  const box = toggle.value?.getBoundingClientRect()
  if (box && (box.top < 96 || box.bottom > window.innerHeight)) toggle.value?.scrollIntoView({ block: 'center' })
}
</script>

<template>
  <!-- overflow-clip, not hidden: hidden would stop the left column sticking -->
  <div class="grid overflow-clip rounded-sm bg-white shadow-soft ring-1 ring-ink/[0.06] md:grid-cols-[5fr_7fr]">
    <div class="bg-cream/60 px-8 py-10 sm:px-11 sm:py-12">
      <!-- Stays in view beside the full list when it is open -->
      <div class="md:sticky md:top-28">
        <p class="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-sage-deep">{{ pkg.tag }}</p>
        <h3 class="mt-3 text-[clamp(1.9rem,3.2vw,2.5rem)] font-light leading-[1.05] text-ink">{{ pkg.name }}</h3>
        <span class="my-6 block h-px w-12 bg-beige-deep" aria-hidden="true" />
        <p v-if="pkg.pricePrefix" class="text-[0.68rem] uppercase tracking-[0.22em] text-ink-muted">{{ pkg.pricePrefix }}</p>
        <p class="mt-1 font-serif text-[3.2rem] font-light leading-none text-ink">{{ pkg.price }}</p>
        <p v-if="pkg.summary" class="mt-6 text-[0.95rem] text-ink-soft">{{ pkg.summary }}</p>
        <ul v-if="pkg.terms" class="mt-5 space-y-1.5 text-[0.88rem] text-ink-muted">
          <li v-for="term in pkg.terms" :key="term" class="relative pl-5 before:absolute before:left-0 before:text-sage before:content-['—']">{{ term }}</li>
        </ul>
        <div class="pt-9">
          <NuxtLink class="btn btn-solid" to="/contact">{{ pkg.cta }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="px-8 py-10 sm:px-11 sm:py-12">
      <p class="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-ink-muted">{{ open ? 'Everything included' : 'At a glance' }}</p>
      <ul :id="listId">
        <li
          v-for="feature in open ? pkg.features : highlights"
          :key="feature"
          class="relative border-b border-ink/[0.07] py-2.5 pl-6 text-[0.9rem] leading-snug text-ink-soft"
        >
          <RoseMark class="absolute left-0 top-[11px] h-[0.95rem] w-[0.95rem] text-sage" :weight="1.8" />
          {{ feature }}
        </li>
      </ul>
      <p v-if="open && pkg.goal" class="mt-7 font-serif text-[1.2rem] italic leading-snug text-ink-soft">“{{ pkg.goal }}”</p>
      <button
        v-if="hasDetails"
        ref="toggle"
        type="button"
        class="group mt-4 inline-flex min-h-11 items-center gap-2 text-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
        :aria-expanded="open"
        :aria-controls="listId"
        @click="toggleDetails"
      >
        <span class="link-caps">{{ open ? 'Show less' : 'Show more' }}</span>
        <span class="sr-only"> about {{ pkg.name }}</span>
        <span class="text-lg leading-none" aria-hidden="true">{{ open ? '−' : '+' }}</span>
      </button>
    </div>
  </div>
</template>
