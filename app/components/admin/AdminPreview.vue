<script setup lang="ts">
import { LoaderCircle, Monitor, Smartphone } from 'lucide-vue-next'
import { editor, previewFiles } from '~/admin/editor'
import type { PreviewTarget } from '~/admin/sections'

// The real website in a frame, showing the unpublished draft (plugins/admin-preview.client.ts
// swaps it in) and following along to whatever is being edited.
const props = defineProps<{ target: PreviewTarget }>()

const frame = ref<HTMLIFrameElement>()
const box = ref<HTMLElement>()
const ready = ref(false)
const initialSrc = props.target.path + (props.target.hash ?? '')

// On a phone or small tablet the computer view would be too small to read, so start in phone view.
const device = ref<'computer' | 'phone'>(import.meta.client && window.innerWidth < 768 ? 'phone' : 'computer')
const siteWidth = computed(() => device.value === 'phone' ? 390 : 1280)
const boxSize = reactive({ width: 0, height: 0 })
const scale = computed(() => boxSize.width ? Math.min(1, (boxSize.width - (device.value === 'phone' ? 32 : 0)) / siteWidth.value) : 1)

let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    boxSize.width = entry!.contentRect.width
    boxSize.height = entry!.contentRect.height
  })
  if (box.value) observer.observe(box.value)
  window.addEventListener('message', onMessage)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('message', onMessage)
})

function post(message: unknown) {
  frame.value?.contentWindow?.postMessage(message, location.origin)
}
const sendContent = () => post({ type: 'admin:content', files: previewFiles() })
const go = () => post({ type: 'admin:go', path: props.target.path, hash: props.target.hash })

function onMessage(event: MessageEvent) {
  if (event.origin !== location.origin || event.source !== frame.value?.contentWindow) return
  if (event.data?.type === 'admin:ready') {
    ready.value = true
    sendContent()
  }
}

let timer: ReturnType<typeof setTimeout> | undefined
watch(() => [editor.draft, editor.photos], () => {
  clearTimeout(timer)
  timer = setTimeout(sendContent, 150)
}, { deep: true })
watch(() => props.target, (next, previous) => {
  if (next.path !== previous?.path || next.hash !== previous?.hash) go()
})
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between gap-3 px-4 py-2.5 max-sm:justify-center">
      <p class="text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink-faint max-sm:hidden">Preview, with your changes</p>
      <div class="flex rounded-full bg-ink/[0.06] p-1" role="group" aria-label="Preview size">
        <button type="button" class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.82rem] font-medium transition-colors" :class="device === 'computer' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'" :aria-pressed="device === 'computer'" @click="device = 'computer'">
          <Monitor class="h-4 w-4" aria-hidden="true" /> Computer
        </button>
        <button type="button" class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.82rem] font-medium transition-colors" :class="device === 'phone' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'" :aria-pressed="device === 'phone'" @click="device = 'phone'">
          <Smartphone class="h-4 w-4" aria-hidden="true" /> Phone
        </button>
      </div>
    </div>
    <div ref="box" class="relative min-h-0 flex-1 overflow-hidden" :class="device === 'phone' ? 'bg-ink/[0.04]' : ''">
      <iframe
        ref="frame"
        :src="initialSrc"
        title="Preview of your website with your changes"
        class="absolute top-0 border-0 bg-ivory"
        :class="device === 'phone' ? 'left-1/2 rounded-[28px] shadow-lift ring-8 ring-ink/80' : 'left-0'"
        :style="{
          width: `${siteWidth}px`,
          height: `${(boxSize.height - (device === 'phone' ? 32 : 0)) / scale}px`,
          transform: device === 'phone' ? `translate(-50%, 16px) scale(${scale})` : `scale(${scale})`,
          transformOrigin: device === 'phone' ? 'top center' : 'top left',
        }"
      />
      <div v-if="!ready" class="absolute inset-0 grid place-items-center bg-ivory/80">
        <p class="flex items-center gap-2 text-ink-muted"><LoaderCircle class="h-5 w-5 animate-spin" aria-hidden="true" /> Loading preview…</p>
      </div>
    </div>
  </div>
</template>
