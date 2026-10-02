<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'

const testimonials = useContent('testimonials')
type Review = (typeof testimonials.items)[number]

const selectedReview = ref<Review | null>(null)
const reviewDialog = ref<HTMLDialogElement | null>(null)
const reviewTitleId = useId()
const trackId = useId()
const paused = ref(false)
let returnFocusTo: HTMLElement | null = null
let previousOverflow: string | null = null

// The drift loops by sliding the track exactly half its width, so it holds two identical runs.
// A run repeats the reviews until it is wider than any screen, so a short list never leaves a gap.
const run = computed(() => {
  const items = testimonials.items
  if (!items.length) return []
  return Array.from({ length: Math.ceil(6 / items.length) }, () => items).flat()
})
const loop = computed(() => [...run.value, ...run.value])
// About 9 seconds per card: slow enough to read a quote as it passes
const duration = computed(() => `${run.value.length * 9}s`)

async function openReview(item: Review, event: MouseEvent) {
  if (selectedReview.value) return
  returnFocusTo = event.currentTarget as HTMLElement
  selectedReview.value = item
  await nextTick()
  if (!reviewDialog.value) return
  previousOverflow = document.body.style.overflow
  reviewDialog.value.showModal()
  document.body.style.overflow = 'hidden'
}

function restoreScroll() {
  if (previousOverflow === null) return
  document.body.style.overflow = previousOverflow
  previousOverflow = null
}

function onClose() {
  restoreScroll()
  selectedReview.value = null
  returnFocusTo?.focus({ preventScroll: true })
  returnFocusTo = null
}

onBeforeUnmount(restoreScroll)
</script>

<template>
  <section id="reviews" class="bg-sage-mist py-16 md:py-24">
    <SectionIntro class="px-6" :eyebrow="testimonials.eyebrow" :title="testimonials.title" />
    <div
      class="review-marquee mt-10 md:mt-12"
      :class="{ 'is-paused': paused || selectedReview }"
      :style="{ '--review-duration': duration }"
    >
      <ul :id="trackId" data-review-track class="review-track flex w-max items-stretch gap-6 px-3 md:gap-8" aria-label="Client testimonials">
        <!-- Only the first run is read out and tabbable; the copies after it just fill the loop -->
        <li
          v-for="(item, index) in loop"
          :key="`${index}-${item.cite}`"
          :aria-hidden="index >= testimonials.items.length || undefined"
          :inert="index >= testimonials.items.length || undefined"
          :data-copy="index >= testimonials.items.length || undefined"
          class="review-card relative flex w-[min(80vw,320px)] shrink-0 flex-col items-center bg-ivory px-7 pb-8 pt-12 text-center shadow-soft md:w-[360px] md:px-9"
        >
          <RoseMark class="relative h-7 w-7 text-sage" :weight="1.3" />
          <blockquote class="relative mt-5 font-serif text-[1.2rem] font-light italic leading-relaxed text-ink md:text-[1.25rem]">
            “{{ item.quote }}”
          </blockquote>
          <div class="relative mt-auto flex flex-col items-center pt-6">
            <span class="block h-px w-10 bg-sage/40" aria-hidden="true" />
            <span class="mt-4 block max-w-full break-words font-script text-[1.85rem] leading-tight text-sage-deep">{{ item.cite }}</span>
            <span v-if="item.context" class="mt-1 block text-[0.66rem] uppercase tracking-[0.2em] text-ink-muted">{{ item.context }}</span>
            <button
              v-if="item.fullQuote"
              type="button"
              class="mt-3 min-h-11 px-2 text-[0.8rem] text-sage-deep underline decoration-sage/50 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
              :aria-label="`Read full review from ${item.cite}`"
              aria-haspopup="dialog"
              @click="openReview(item, $event)"
            >
              Read full review
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="testimonials.items.length" class="review-toggle flex justify-center px-6">
      <button
        type="button"
        :aria-controls="trackId"
        :aria-label="paused ? 'Play the testimonials' : 'Pause the testimonials'"
        class="inline-flex min-h-11 items-center gap-2 rounded-full border border-sage/40 px-5 text-[0.7rem] uppercase tracking-[0.2em] text-sage-deep hover:bg-ivory/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
        @click="paused = !paused"
      >
        <component :is="paused ? Play : Pause" class="h-3.5 w-3.5" aria-hidden="true" />
        {{ paused ? 'Play' : 'Pause' }}
      </button>
    </div>
    <p v-if="testimonials.placeholder" class="mt-10 px-6 text-center text-[0.8rem] italic text-ink-muted">{{ testimonials.note }}</p>
    <dialog
      ref="reviewDialog"
      :aria-labelledby="reviewTitleId"
      class="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-sm border border-sage/30 bg-ivory p-0 text-ink shadow-soft backdrop:bg-ink/60"
      @click="event => { if (event.target === reviewDialog) reviewDialog?.close() }"
      @close="onClose"
    >
      <div v-if="selectedReview">
        <div class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-sage/20 bg-ivory px-6 py-3 sm:px-8">
          <h3 :id="reviewTitleId" class="font-serif text-[1.6rem]">Kind words</h3>
          <button
            type="button"
            autofocus
            class="min-h-11 px-3 text-[0.85rem] text-sage-deep underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
            aria-label="Close full review"
            @click="reviewDialog?.close()"
          >Close</button>
        </div>
        <figure class="px-6 py-7 sm:px-8 sm:py-8">
          <figcaption class="mb-6 flex items-center gap-4 border-b border-sage/20 pb-5">
            <RoseMark class="h-8 w-8 shrink-0 text-sage" :weight="1.3" />
            <span>
              <span class="block break-words font-script text-[2rem] leading-tight text-sage-deep">{{ selectedReview.cite }}</span>
              <span v-if="selectedReview.context" class="mt-1 block text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">{{ selectedReview.context }}</span>
            </span>
          </figcaption>
          <blockquote class="space-y-5 text-[1rem] leading-[1.8] text-ink-soft">
            <p v-for="(paragraph, index) in selectedReview.fullQuote.split(/\n\s*\n/)" :key="index" class="whitespace-pre-line">{{ paragraph }}</p>
          </blockquote>
        </figure>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
/* Cards fade in and out at the edges as they drift past. The mask also clips anything outside the
   box, so the padding is deep enough to hold the cards' whole shadow (shadow-soft reaches ~60px down). */
.review-marquee {
  overflow-x: hidden;
  overflow-x: clip;
  padding-block: 1rem 4rem;
  mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
}
.review-track {
  animation: review-drift var(--review-duration) linear infinite;
}
.review-marquee:hover .review-track,
.review-marquee:focus-within .review-track,
.review-marquee.is-paused .review-track {
  animation-play-state: paused;
}
@keyframes review-drift {
  to { transform: translateX(-50%); }
}

/* An arched top, like the photo frame in the hero, with a fine line inside it */
.review-card {
  border-radius: 50% 50% 0.25rem 0.25rem / 7rem 7rem 0.25rem 0.25rem;
}
.review-card::before {
  content: '';
  position: absolute;
  inset: 0.5rem;
  border: 1px solid rgb(125 139 116 / 0.28);
  border-radius: 50% 50% 0.125rem 0.125rem / 6.5rem 6.5rem 0.125rem 0.125rem;
  pointer-events: none;
}

/* Without motion: a row to swipe through instead, with no copies and no pause button */
@media (prefers-reduced-motion: reduce) {
  .review-marquee {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    mask-image: none;
  }
  .review-marquee::-webkit-scrollbar { display: none; }
  .review-track { animation: none; padding-inline: 1.5rem; }
  .review-card { scroll-snap-align: center; }
  .review-card[data-copy],
  .review-toggle { display: none; }
}
</style>
