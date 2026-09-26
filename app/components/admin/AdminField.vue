<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'
import { editor, getAt, isChanged, isNew, revert, setAt } from '~/admin/editor'
import type { Field } from '~/admin/sections'

const props = defineProps<{ field: Field, file: ContentName, base?: string, label?: string }>()

const at = (key: string) => props.base ? `${props.base}.${key}` : key
const path = computed(() => props.field.key ? at(props.field.key) : '')
const data = computed(() => editor.draft[props.file])
const visible = computed(() => !props.field.showIf || props.field.showIf(data.value))

// Every draft path this field edits, for its "Changed · Undo" note.
const paths = computed(() => {
  const field = props.field
  if (field.type === 'note') return []
  if (field.type === 'photo') return [path.value, ...(field.altKey ? [at(field.altKey)] : [])]
  if (field.type === 'gallery') return [path.value, 'highlights']
  return [path.value]
})
const changed = computed(() => paths.value.some(p => isChanged(props.file, p)))
const fresh = computed(() => !!path.value && isNew(props.file, path.value))

const value = computed({
  get: () => getAt(data.value, path.value),
  set: (next) => {
    // Emptying a box the file never had leaves it out again rather than saving "".
    const cleared = next === '' && getAt(editor.original[props.file], path.value) === undefined
    setAt(data.value, path.value, cleared ? undefined : next)
    if (props.field.type === 'text' && props.field.derive) props.field.derive(String(next), data.value)
  },
})
const switchedOn = computed({
  get: () => props.field.type === 'toggle' && props.field.invert ? !value.value : !!value.value,
  set: on => value.value = props.field.type === 'toggle' && props.field.invert ? !on : on,
})

function undo() {
  for (const p of paths.value) revert(props.file, p)
  if (props.field.type === 'text' && props.field.derive) props.field.derive(String(value.value), data.value)
}

const text = computed(() => String(value.value ?? ''))
const missing = computed(() => (props.field.type === 'text' || props.field.type === 'textarea') && props.field.required && !text.value.trim())
const over = computed(() => (props.field.type === 'text' || props.field.type === 'textarea') && props.field.max ? text.value.length > props.field.max : false)

const id = useId()

// Grow text boxes to fit what's typed. A box inside a closed dialog or fold has no height yet, so it
// measures again once it's shown, or when its width changes.
const sized = new WeakMap<HTMLTextAreaElement, ResizeObserver>()
const vAutosize = {
  mounted(el: HTMLTextAreaElement) {
    let width = 0
    const observer = new ResizeObserver(([entry]) => {
      if (!entry || entry.contentRect.width === width) return
      width = entry.contentRect.width
      resize(el)
    })
    observer.observe(el)
    sized.set(el, observer)
    resize(el)
  },
  updated: (el: HTMLTextAreaElement) => resize(el),
  unmounted: (el: HTMLTextAreaElement) => sized.get(el)?.disconnect(),
}
function resize(el: HTMLTextAreaElement) {
  if (!el.offsetParent) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 2}px`
}
</script>

<template>
  <p v-if="field.type === 'note'" class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-sage-mist/70 px-4 py-3 text-[0.9rem] text-ink-soft">
    {{ field.text }}
    <NuxtLink v-if="field.link" :to="{ query: { page: field.link.section } }" class="inline-flex items-center gap-1 font-medium text-sage-deep underline decoration-sage/50 underline-offset-4 hover:text-ink">
      {{ field.link.label }} <ArrowRight class="h-4 w-4" aria-hidden="true" />
    </NuxtLink>
  </p>

  <AdminGalleryEditor v-else-if="field.type === 'gallery'" />

  <div v-else-if="visible" class="grid gap-2">
    <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <label v-if="field.type !== 'toggle'" :for="id" class="a-label">{{ label ?? field.label }}</label>
      <span v-if="changed && !fresh" class="inline-flex items-center gap-2 text-[0.82rem] text-sage-deep">
        <span class="rounded-full bg-sage-mist px-2 py-0.5 font-medium">Changed</span>
        <button type="button" class="underline underline-offset-4 hover:text-ink" @click="undo">Undo</button>
      </span>
    </div>
    <p v-if="field.help && field.type !== 'toggle'" class="a-help -mt-1">{{ field.help }}</p>

    <input
      v-if="field.type === 'text'"
      :id="id"
      v-model="value"
      type="text"
      class="a-input"
      :placeholder="field.placeholder"
      :aria-invalid="missing || undefined"
    >
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="id"
      v-model="value"
      v-autosize
      rows="3"
      class="a-input min-h-[96px] resize-none"
      :placeholder="field.placeholder"
      :aria-invalid="missing || undefined"
    />
    <input
      v-else-if="field.type === 'number'"
      :id="id"
      v-model.number="value"
      type="number"
      inputmode="numeric"
      :min="field.min"
      :max="field.max"
      class="a-input w-32"
    >
    <label v-else-if="field.type === 'toggle'" :for="id" class="flex cursor-pointer items-start gap-4 rounded-lg border border-ink/10 bg-ivory/60 px-4 py-3.5">
      <input :id="id" v-model="switchedOn" type="checkbox" class="peer sr-only">
      <span class="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-ink/20 transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-sage-deep peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-sage/30" aria-hidden="true" />
      <span class="grid gap-1">
        <span class="a-label">{{ field.label }}</span>
        <span v-if="field.help" class="a-help">{{ field.help }}</span>
        <button v-if="changed" type="button" class="w-fit text-[0.82rem] text-sage-deep underline underline-offset-4" @click.prevent="undo">Undo</button>
      </span>
    </label>
    <AdminListField v-else-if="field.type === 'list'" :field="field" :file="file" :path="path" />
    <AdminCardsField v-else-if="field.type === 'cards'" :field="field" :file="file" :path="path" />
    <AdminPhotoField v-else-if="field.type === 'photo'" :field="field" :file="file" :base="base" />
    <AdminPhotosField v-else-if="field.type === 'photos'" :field="field" :file="file" :path="path" />

    <p v-if="missing" class="a-error">This shows on your website, so it needs something in it.</p>
    <p v-else-if="(field.type === 'text' || field.type === 'textarea') && field.max" class="text-[0.8rem]" :class="over ? 'text-[#A23B2A]' : 'text-ink-faint'">
      {{ text.length }} of about {{ field.max }} characters{{ over ? ', so Google may cut the end off' : '' }}
    </p>
  </div>
</template>
