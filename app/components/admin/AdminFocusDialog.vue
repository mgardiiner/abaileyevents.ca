<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import { closeFocusChooser, editor, focusOf, focusStyle, photoUrl, setFocus, type FocusPoint } from '~/admin/editor'

// "Choose what shows": tap or drag on a photo to mark the part that matters most, and see how it
// comes out in the shapes the website crops photos to.
const dialog = ref<HTMLDialogElement>()
const frame = ref<HTMLElement>()
const step = ref(0)
const paths = computed(() => editor.focusRequest?.paths ?? [])
const path = computed(() => paths.value[step.value] ?? '')
const point = computed(() => focusOf(path.value))
const last = computed(() => step.value >= paths.value.length - 1)

// Each photo's focus as it was when shown, so Cancel can put it back.
let before: FocusPoint = [50, 50]
const remember = () => before = [...focusOf(path.value)] as FocusPoint
watch(() => editor.focusRequest, (request) => {
  if (!request) return dialog.value?.close()
  step.value = 0
  remember()
  if (!dialog.value?.open) dialog.value?.showModal()
})
watch(path, remember)

const shapes = [
  { label: 'Tall', box: 'aspect-[4/5] rounded-t-full' },
  { label: 'Round', box: 'aspect-square rounded-full' },
  { label: 'Square', box: 'aspect-square rounded-lg' },
  { label: 'Wide', box: 'aspect-[16/9] rounded-lg' },
]

let dragging = false
function place(event: PointerEvent) {
  const box = frame.value?.getBoundingClientRect()
  if (!box?.width) return
  const clamp = (n: number) => Math.min(100, Math.max(0, n))
  setFocus(path.value, [clamp((event.clientX - box.left) / box.width * 100), clamp((event.clientY - box.top) / box.height * 100)])
}
function press(event: PointerEvent) {
  dragging = true
  frame.value?.setPointerCapture(event.pointerId)
  place(event)
}
const drag = (event: PointerEvent) => dragging && place(event)
const release = () => dragging = false

// Arrow keys move the mark for anyone not using a mouse or touch.
function nudge(event: KeyboardEvent) {
  const moves: Record<string, FocusPoint> = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }
  const move = moves[event.key]
  if (!move) return
  event.preventDefault()
  const [x, y] = point.value
  setFocus(path.value, [Math.min(100, Math.max(0, x + move[0])), Math.min(100, Math.max(0, y + move[1]))])
}

function cancel() {
  if (path.value) setFocus(path.value, before)
  closeFocusChooser()
}
function next() {
  if (last.value) return closeFocusChooser()
  step.value++
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto max-h-[calc(100dvh-24px)] w-[min(980px,calc(100vw-24px))] max-w-none overflow-y-auto rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50"
    aria-labelledby="focus-title"
    @cancel.prevent="cancel"
  >
    <div v-if="path" class="grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_240px]">
      <div class="min-w-0">
        <p v-if="paths.length > 1" class="text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink-faint">Photo {{ step + 1 }} of {{ paths.length }}</p>
        <h2 id="focus-title" class="font-serif text-[2rem] leading-tight text-ink">Choose what shows</h2>
        <p class="a-help mt-1.5 max-w-[52ch]">Tap the most important part of the photo, like a face or the flowers. Wherever your website trims this photo to fit a shape, it keeps that part in view.</p>

        <div class="mt-5 grid place-items-center rounded-xl bg-ivory p-3">
          <div
            ref="frame"
            class="relative inline-block max-w-full cursor-crosshair touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4"
            tabindex="0"
            role="slider"
            aria-label="Most important part of the photo"
            :aria-valuetext="`${point[0]}% across, ${point[1]}% down`"
            @pointerdown="press"
            @pointermove="drag"
            @pointerup="release"
            @pointercancel="release"
            @keydown="nudge"
          >
            <img :src="photoUrl(path)" alt="" draggable="false" class="block max-h-[min(42dvh,520px)] w-auto max-w-full rounded-lg md:max-h-[min(56dvh,520px)]">
            <span
              class="pointer-events-none absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(34,33,31,0.35),0_4px_14px_rgba(34,33,31,0.35)]"
              :style="{ left: `${point[0]}%`, top: `${point[1]}%` }"
              aria-hidden="true"
            >
              <span class="h-2 w-2 rounded-full bg-white shadow-[0_0_0_1px_rgba(34,33,31,0.35)]" />
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <p class="a-label">How it looks</p>
          <div class="mt-3 grid grid-cols-4 items-end gap-3 md:grid-cols-2">
            <figure v-for="shape in shapes" :key="shape.label" class="grid gap-1.5">
              <div class="overflow-hidden bg-cream ring-1 ring-ink/10" :class="shape.box">
                <img :src="photoUrl(path)" alt="" class="h-full w-full object-cover" :style="focusStyle(path)">
              </div>
              <figcaption class="text-center text-[0.78rem] text-ink-muted">{{ shape.label }}</figcaption>
            </figure>
          </div>
        </div>

        <!-- Stays in reach at the bottom of a phone screen while the dialog scrolls. -->
        <div class="mt-auto grid gap-2.5 max-md:sticky max-md:bottom-0 max-md:-mx-5 max-md:-mb-5 max-md:border-t max-md:border-ink/10 max-md:bg-white max-md:px-5 max-md:py-3 sm:max-md:-mx-8 sm:max-md:-mb-8 sm:max-md:px-8">
          <button type="button" class="a-btn a-btn-quiet w-full" @click="setFocus(path, null)">
            <RotateCcw class="h-4 w-4" aria-hidden="true" /> Use the middle
          </button>
          <div class="grid grid-cols-2 gap-2.5">
            <button type="button" class="a-btn a-btn-quiet" @click="cancel">Cancel</button>
            <button type="button" class="a-btn a-btn-primary" @click="next">{{ last ? 'Done' : 'Next photo' }}</button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
