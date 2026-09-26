<script setup lang="ts">
import { LoaderCircle, Search, Upload, X } from 'lucide-vue-next'
import { addPhoto, closePhotoChooser, editor, photoUrl } from '~/admin/editor'
import { UnsupportedPhotoError, folderLabel } from '~/admin/photos'

const dialog = ref<HTMLDialogElement>()
const request = computed(() => editor.photoRequest)
const tab = ref<'library' | 'upload'>('library')
const query = ref('')
const busy = ref(false)
const error = ref('')

watch(request, (next) => {
  if (!next) return dialog.value?.open && dialog.value.close()
  tab.value = 'library'
  query.value = ''
  error.value = ''
  nextTick(() => dialog.value?.showModal())
})

interface Choice { src: string, label: string }
const galleryItems = computed(() => (editor.draft.gallery?.items ?? []) as { src: string, alt: string, caption: string }[])

// Every photo on the site (or just the gallery's), grouped by folder, newest additions first.
const groups = computed(() => {
  const captions = new Map(galleryItems.value.map(item => [item.src, item.caption || item.alt]))
  const paths = request.value?.fromGallery
    ? galleryItems.value.map(item => item.src)
    : [...new Set([...Object.keys(editor.photos).reverse(), ...editor.images])]
  const needle = query.value.trim().toLowerCase()
  const byGroup = new Map<string, Choice[]>()
  for (const src of paths) {
    const label = captions.get(src) ?? src.split('/').pop()!.replace(/\.\w+$/, '').replace(/-/g, ' ')
    const group = groupOf(src)
    if (needle && !`${label} ${group} ${src}`.toLowerCase().includes(needle)) continue
    if (!byGroup.has(group)) byGroup.set(group, [])
    byGroup.get(group)!.push({ src, label })
  }
  return [...byGroup].map(([title, photos]) => ({ title, photos }))
})

function groupOf(src: string) {
  if (editor.photos[src]?.pending) return 'Added just now'
  const parts = src.replace(/^\/images\//, '').split('/')
  if (parts[0] === 'gallery' && parts.length > 2) return `Gallery · ${folderLabel(parts[1]!)}`
  if (parts.length === 1) return 'Other photos'
  return folderLabel(parts[0]!)
}

function choose(src: string) {
  closePhotoChooser(src)
}

const input = ref<HTMLInputElement>()
const dragOver = ref(false)
async function upload(file: File | undefined) {
  if (!file || !request.value) return
  busy.value = true
  error.value = ''
  try {
    choose(await addPhoto(file, request.value.folder))
  }
  catch (reason) {
    error.value = reason instanceof UnsupportedPhotoError
      ? 'That file isn\'t a photo type browsers can open. Try a JPG or PNG. (Photos picked on an iPhone are converted automatically.)'
      : 'That photo couldn\'t be added. Please try another.'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <dialog ref="dialog" class="m-auto h-[min(760px,calc(100dvh-24px))] w-[min(980px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50" @close="closePhotoChooser(null)" @click.self="dialog?.close()">
    <div v-if="request" class="flex h-full flex-col">
      <div class="flex items-start justify-between gap-4 border-b border-ink/10 px-5 pb-4 pt-5 sm:px-7">
        <div>
          <h3 class="font-serif text-[1.7rem] leading-tight text-ink">Choose a photo</h3>
          <p class="a-help">For “{{ request.title }}”{{ request.fromGallery ? ', from your gallery' : '' }}</p>
        </div>
        <button type="button" class="a-icon-btn -mr-2" title="Close" @click="dialog?.close()"><X class="h-5 w-5" /><span class="sr-only">Close</span></button>
      </div>

      <div v-if="!request.fromGallery" class="flex gap-1 border-b border-ink/10 px-5 sm:px-7" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'library'" class="-mb-px border-b-2 px-3 py-3 text-[0.92rem] font-medium" :class="tab === 'library' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'" @click="tab = 'library'">Your photos</button>
        <button type="button" role="tab" :aria-selected="tab === 'upload'" class="-mb-px border-b-2 px-3 py-3 text-[0.92rem] font-medium" :class="tab === 'upload' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'" @click="tab = 'upload'">Upload a new photo</button>
      </div>

      <div v-if="tab === 'library' || request.fromGallery" class="flex min-h-0 flex-1 flex-col">
        <div class="px-5 pt-4 sm:px-7">
          <label class="relative block">
            <span class="sr-only">Search photos</span>
            <Search class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input v-model="query" type="search" class="a-input !pl-10" placeholder="Search by event or description">
          </label>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2 sm:px-7">
          <section v-for="group in groups" :key="group.title" class="mt-4">
            <h4 class="mb-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-faint">{{ group.title }}</h4>
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              <button v-for="photo in group.photos" :key="photo.src" type="button" class="group relative aspect-square overflow-hidden rounded-md bg-cream ring-1 ring-ink/10 focus-visible:ring-4 focus-visible:ring-sage/40" :title="photo.label" @click="choose(photo.src)">
                <img :src="photoUrl(photo.src)" :alt="photo.label" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
              </button>
            </div>
          </section>
          <p v-if="!groups.length" class="mt-10 text-center text-ink-muted">No photos match “{{ query }}”.</p>
        </div>
      </div>

      <div v-else class="flex flex-1 items-center justify-center p-6">
        <div
          class="flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors"
          :class="dragOver ? 'border-sage-deep bg-sage-mist/50' : 'border-ink/20'"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="dragOver = false; upload($event.dataTransfer?.files[0])"
        >
          <LoaderCircle v-if="busy" class="h-9 w-9 animate-spin text-sage-deep" aria-hidden="true" />
          <Upload v-else class="h-9 w-9 text-sage-deep" aria-hidden="true" />
          <p class="font-serif text-[1.5rem] leading-tight text-ink">{{ busy ? 'Getting your photo ready…' : 'Drop a photo here' }}</p>
          <p class="a-help max-w-sm">It's resized for the web automatically, so any size from your phone or camera is fine.</p>
          <button type="button" class="a-btn a-btn-primary" :disabled="busy" @click="input?.click()">Choose from your device</button>
          <input ref="input" type="file" accept="image/*" class="sr-only" tabindex="-1" @change="upload(($event.target as HTMLInputElement).files?.[0]); ($event.target as HTMLInputElement).value = ''">
          <p v-if="error" class="a-error max-w-sm">{{ error }}</p>
        </div>
      </div>
    </div>
  </dialog>
</template>
