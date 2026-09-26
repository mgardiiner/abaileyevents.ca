<script setup lang="ts">
import { ChevronLeft, ChevronRight, ImagePlus, RefreshCw, Trash2 } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'
import { choosePhoto, editor, getAt, notify, photoUrl, removeWithUndo, setAt } from '~/admin/editor'
import type { PhotosField } from '~/admin/sections'

// A row of photos: `{ src, alt }` records, or with `fromGallery`, paths of gallery photos.
const props = defineProps<{ field: PhotosField, file: ContentName, path: string }>()

type Item = string | { src: string, alt: string }
const items = computed(() => (getAt(editor.draft[props.file], props.path) ?? []) as Item[])
const srcOf = (item: Item) => typeof item === 'string' ? item : item.src

const gallery = computed(() => (editor.draft.gallery?.items ?? []) as { src: string, alt: string, caption: string }[])
const galleryItem = (path: string) => gallery.value.find(item => item.src === path)

const full = computed(() => props.field.max !== undefined && items.value.length >= props.field.max)
const atMinimum = computed(() => props.field.min !== undefined && items.value.length <= props.field.min)
const countNote = computed(() => {
  const { min, max } = props.field
  if (min !== undefined && min === max) return `This spot always shows ${min} photos. Click a photo to swap it.`
  if (max !== undefined) return `Up to ${max} photos.`
  return ''
})

async function pick(index?: number) {
  const path = await choosePhoto({ folder: props.field.folder, fromGallery: props.field.fromGallery, title: props.field.label })
  if (!path) return
  if (props.field.fromGallery && items.value.some((item, i) => i !== index && srcOf(item) === path)) {
    notify('That photo is already in this spot.')
    return
  }
  const next: Item = props.field.fromGallery ? path : { src: path, alt: galleryItem(path)?.alt ?? '' }
  if (!getAt(editor.draft[props.file], props.path)) setAt(editor.draft[props.file], props.path, [])
  if (index === undefined) items.value.push(next)
  else items.value.splice(index, 1, next)
}

function move(from: number, to: number) {
  const [item] = items.value.splice(from, 1)
  items.value.splice(to, 0, item!)
}
</script>

<template>
  <div class="grid gap-3">
    <p v-if="countNote" class="a-help -mt-1">{{ countNote }}</p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div v-for="(item, i) in items" :key="`${i}-${srcOf(item)}`" class="grid content-start gap-2">
        <button type="button" class="group relative aspect-[4/5] overflow-hidden rounded-lg bg-cream ring-1 ring-ink/10" title="Swap this photo" @click="pick(i)">
          <img :src="photoUrl(srcOf(item))" alt="" loading="lazy" class="h-full w-full object-cover transition-opacity group-hover:opacity-75">
          <span class="absolute left-2 top-2 grid h-7 min-w-7 place-items-center rounded-full bg-white/90 px-2 text-[0.8rem] font-medium text-ink shadow-sm">{{ i + 1 }}</span>
          <span class="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 rounded-full bg-white/90 py-1.5 text-[0.8rem] font-medium text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <RefreshCw class="h-3.5 w-3.5" aria-hidden="true" /> Swap photo
          </span>
        </button>
        <div class="flex items-center justify-between">
          <div class="flex">
            <button type="button" class="a-icon-btn" :disabled="i === 0" title="Move earlier" @click="move(i, i - 1)">
              <ChevronLeft class="h-5 w-5" /><span class="sr-only">Move earlier</span>
            </button>
            <button type="button" class="a-icon-btn" :disabled="i === items.length - 1" title="Move later" @click="move(i, i + 1)">
              <ChevronRight class="h-5 w-5" /><span class="sr-only">Move later</span>
            </button>
          </div>
          <button v-if="!atMinimum" type="button" class="a-icon-btn hover:!text-[#A23B2A]" title="Remove this photo" @click="removeWithUndo(items, i, 'Photo')">
            <Trash2 class="h-[18px] w-[18px]" /><span class="sr-only">Remove</span>
          </button>
        </div>
        <input
          v-if="typeof item !== 'string'"
          v-model="item.alt"
          type="text"
          class="a-input !py-2 !text-[0.9rem]"
          placeholder="Describe this photo"
          :aria-label="`Describe photo ${i + 1}`"
        >
        <p v-else class="truncate text-[0.82rem] text-ink-muted">{{ galleryItem(item)?.caption || 'Gallery photo' }}</p>
      </div>
      <button v-if="!full" type="button" class="a-add aspect-[4/5] !min-h-0 flex-col" @click="pick()">
        <ImagePlus class="h-6 w-6" aria-hidden="true" /> Add a photo
      </button>
    </div>
  </div>
</template>
