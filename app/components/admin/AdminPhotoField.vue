<script setup lang="ts">
import { Crosshair, ImagePlus } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'
import { chooseFocus, choosePhoto, editor, focusStyle, getAt, isPendingPhoto, photoUrl, setAt } from '~/admin/editor'
import type { PhotoField } from '~/admin/sections'

const props = defineProps<{ field: PhotoField, file: ContentName, base?: string }>()

const at = (key: string) => props.base ? `${props.base}.${key}` : key
const data = computed(() => editor.draft[props.file])
const src = computed({
  get: () => getAt(data.value, at(props.field.key)) as string | undefined,
  set: value => setAt(data.value, at(props.field.key), value),
})
const alt = computed({
  get: () => props.field.altKey ? String(getAt(data.value, at(props.field.altKey)) ?? '') : '',
  set: value => props.field.altKey && setAt(data.value, at(props.field.altKey), value),
})

// Gallery photos already have a description, so reuse it when one is picked here.
const galleryAlt = (path: string) => (editor.draft.gallery?.items as { src: string, alt: string }[] | undefined)?.find(item => item.src === path)?.alt

async function change() {
  const path = await choosePhoto({ folder: props.field.folder, title: props.field.label })
  if (!path || path === src.value) return
  src.value = path
  if (props.field.altKey) alt.value = galleryAlt(path) ?? ''
  // A photo just uploaded goes straight on to choosing what part of it shows.
  if (isPendingPhoto(path)) await chooseFocus([path])
}

function remove() {
  src.value = undefined
  if (props.field.altKey) setAt(data.value, at(props.field.altKey), undefined)
}

const altId = useId()
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row">
    <button type="button" class="group relative grid h-36 w-full shrink-0 place-items-center overflow-hidden rounded-lg bg-cream ring-1 ring-ink/10 sm:h-32 sm:w-40" :title="src ? 'Change this photo' : 'Choose a photo'" @click="change">
      <img v-if="src" :src="photoUrl(src)" alt="" class="h-full w-full object-cover transition-opacity group-hover:opacity-80" :style="focusStyle(src)">
      <span v-else class="flex flex-col items-center gap-1.5 text-[0.85rem] text-sage-deep">
        <ImagePlus class="h-6 w-6" aria-hidden="true" /> Choose a photo
      </span>
    </button>
    <div class="grid min-w-0 flex-1 content-start gap-3">
      <div class="flex flex-wrap gap-2">
        <button type="button" class="a-btn a-btn-quiet" @click="change">{{ src ? 'Change photo' : 'Choose a photo' }}</button>
        <button v-if="src" type="button" class="a-btn a-btn-quiet" @click="chooseFocus([src])">
          <Crosshair class="h-4 w-4" aria-hidden="true" /> Choose what shows
        </button>
        <button v-if="field.optional && src" type="button" class="a-btn a-btn-quiet" @click="remove">Remove photo</button>
      </div>
      <div v-if="field.altKey && src" class="grid gap-1.5">
        <label :for="altId" class="text-[0.88rem] font-medium text-ink">Describe this photo</label>
        <input :id="altId" v-model="alt" type="text" class="a-input" placeholder="Bride and groom under a willow tree">
        <p class="a-help">A few words about what's in it, for Google and for people who use screen readers.</p>
      </div>
    </div>
  </div>
</template>
