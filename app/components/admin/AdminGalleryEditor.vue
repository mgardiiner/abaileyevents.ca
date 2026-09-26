<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsDown, ChevronsUp, CircleAlert, Crosshair, ImagePlus, LoaderCircle, Star, Trash2, X } from 'lucide-vue-next'
import { addPhoto, chooseFocus, editor, focusStyle, notify, photoSize, photoUrl } from '~/admin/editor'
import { UnsupportedPhotoError, folderLabel, slugify } from '~/admin/photos'
import type { Field } from '~/admin/sections'

interface Shot {
  src: string
  w?: number
  h?: number
  alt: string
  caption: string
  credit?: string
  categories: string[]
}

const gallery = computed(() => editor.draft.gallery as { items: Shot[], highlights: string[], categories: { id: string, label: string }[], pageSize: number })
const items = computed(() => gallery.value.items)
const categories = computed(() => gallery.value.categories)
const isHighlight = (shot: Shot) => gallery.value.highlights.includes(shot.src)

// --- Filtering the grid ---
const filter = ref('all')
const shown = computed(() => items.value.filter((shot) => {
  if (filter.value === 'all') return true
  if (filter.value === 'undescribed') return !shot.alt.trim()
  if (filter.value === 'home') return isHighlight(shot)
  return shot.categories.includes(filter.value)
}))
const undescribed = computed(() => items.value.filter(shot => !shot.alt.trim()).length)

// --- Editing one photo ---
const shotFields: Field[] = [
  { type: 'text', key: 'caption', label: 'Caption', help: 'Shown over the photo when someone points at or taps it, like "J & M · First Dance".' },
  { type: 'textarea', key: 'alt', label: 'Description', help: 'What\'s in the photo, in a sentence. Google and screen readers use this.' },
  { type: 'text', key: 'credit', label: 'Photographer', help: 'Optional. Shown with the caption.' },
]
const selected = ref<Shot | null>(null)
const selectedIndex = computed(() => selected.value ? items.value.indexOf(selected.value) : -1)
const dialog = ref<HTMLDialogElement>()

function openShot(shot: Shot) {
  selected.value = shot
  nextTick(() => dialog.value?.showModal())
}
function closeShot() {
  dialog.value?.close()
}

function move(shot: Shot, to: number) {
  const from = items.value.indexOf(shot)
  if (from < 0) return
  items.value.splice(from, 1)
  items.value.splice(Math.max(0, Math.min(to, items.value.length)), 0, shot)
}

function toggleCategory(shot: Shot, id: string) {
  const i = shot.categories.indexOf(id)
  if (i >= 0) shot.categories.splice(i, 1)
  else shot.categories.push(id)
}

function toggleHighlight(shot: Shot) {
  const list = gallery.value.highlights
  const i = list.indexOf(shot.src)
  if (i >= 0) {
    list.splice(i, 1)
    notify('Taken off the Home page. Pick another so it still shows five.')
  }
  else if (list.length >= 5) {
    notify('The Home page already shows 5 photos. Take one off first (the ones with a star).', { tone: 'error' })
  }
  else {
    list.push(shot.src)
  }
}

function remove(shot: Shot) {
  const index = items.value.indexOf(shot)
  const highlight = gallery.value.highlights.indexOf(shot.src)
  items.value.splice(index, 1)
  if (highlight >= 0) gallery.value.highlights.splice(highlight, 1)
  closeShot()
  notify(highlight >= 0 ? 'Photo removed from the gallery and the Home page.' : 'Photo removed from the gallery.', {
    action: {
      label: 'Undo',
      run: () => {
        items.value.splice(index, 0, shot)
        if (highlight >= 0) gallery.value.highlights.splice(highlight, 0, shot.src)
      },
    },
  })
}

// Dragging on a computer, as well as the arrow buttons.
const dragging = ref<Shot | null>(null)
function drop(target: Shot) {
  if (dragging.value && dragging.value !== target) move(dragging.value, items.value.indexOf(target))
  dragging.value = null
}

// --- Adding photos ---
const input = ref<HTMLInputElement>()
const addDialog = ref<HTMLDialogElement>()
const files = ref<File[]>([])
const events = computed(() => {
  const folders = new Map<string, string>()
  for (const shot of items.value) {
    const folder = shot.src.match(/^\/images\/gallery\/([^/]+)\//)?.[1]
    if (folder && !folders.has(folder)) folders.set(folder, folderLabel(folder))
  }
  return [...folders].map(([id, label]) => ({ id, label }))
})
const upload = reactive({ event: '', newEvent: '', categories: [] as string[], credit: '', busy: '', errors: [] as string[] })

function chooseFiles(event: Event) {
  const picked = [...((event.target as HTMLInputElement).files ?? [])]
  ;(event.target as HTMLInputElement).value = ''
  if (!picked.length) return
  files.value = picked
  Object.assign(upload, { event: '', newEvent: '', categories: [], credit: '', busy: '', errors: [] })
  nextTick(() => addDialog.value?.showModal())
}

const folder = computed(() => upload.event === 'new' ? slugify(upload.newEvent) : upload.event)
const canAdd = computed(() => !!folder.value && upload.categories.length > 0 && !upload.busy)

async function addPhotos() {
  if (!canAdd.value) return
  const added: Shot[] = []
  upload.errors = []
  for (const [i, file] of files.value.entries()) {
    upload.busy = `Getting photo ${i + 1} of ${files.value.length} ready…`
    try {
      const src = await addPhoto(file, `gallery/${folder.value}`)
      const size = photoSize(src)
      added.push({ src, w: size?.w, h: size?.h, alt: '', caption: '', ...(upload.credit.trim() ? { credit: upload.credit.trim() } : {}), categories: [...upload.categories] })
    }
    catch (error) {
      upload.errors.push(error instanceof UnsupportedPhotoError
        ? `${file.name} isn't a photo type browsers can open. Try saving it as a JPG first.`
        : `${file.name} couldn't be added.`)
    }
  }
  upload.busy = ''
  items.value.unshift(...added)
  if (upload.errors.length) return
  addDialog.value?.close()
  filter.value = 'all'
  if (!added.length) return
  // Step through the new photos to choose what part of each one shows where it's trimmed.
  await chooseFocus(added.map(shot => shot.src))
  notify(`${added.length} photo${added.length === 1 ? '' : 's'} added at the top of the gallery. Click each one to describe it.`, { tone: 'success' })
}
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="a-btn a-btn-primary" @click="input?.click()">
        <ImagePlus class="h-5 w-5" aria-hidden="true" /> Add photos
      </button>
      <input ref="input" type="file" accept="image/*" multiple class="sr-only" tabindex="-1" @change="chooseFiles">
      <p class="a-help">{{ items.length }} photos. The first {{ gallery.pageSize }} show before "Show More", so keep favourites near the top.</p>
    </div>

    <div class="flex flex-wrap gap-2" role="group" aria-label="Show">
      <button type="button" class="chip" :aria-pressed="filter === 'all'" @click="filter = 'all'">All</button>
      <button type="button" class="chip" :aria-pressed="filter === 'home'" @click="filter = 'home'">★ On the Home page</button>
      <button v-for="category in categories" :key="category.id" type="button" class="chip" :aria-pressed="filter === category.id" @click="filter = category.id">{{ category.label }}</button>
      <button v-if="undescribed" type="button" class="chip" :aria-pressed="filter === 'undescribed'" @click="filter = 'undescribed'">Needs a description ({{ undescribed }})</button>
    </div>

    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      <li
        v-for="shot in shown"
        :key="shot.src"
        draggable="true"
        class="group relative"
        :class="dragging === shot ? 'opacity-40' : ''"
        @dragstart="dragging = shot"
        @dragend="dragging = null"
        @dragover.prevent
        @drop.prevent="drop(shot)"
      >
        <button type="button" class="block w-full text-left" @click="openShot(shot)">
          <span class="relative block aspect-square overflow-hidden rounded-lg bg-cream ring-1 ring-ink/10">
            <img :src="photoUrl(shot.src)" :alt="shot.alt" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" :style="focusStyle(shot.src)">
            <span class="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[0.75rem] font-medium text-ink shadow-sm">{{ items.indexOf(shot) + 1 }}</span>
            <span v-if="isHighlight(shot)" class="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#B08A3E] shadow-sm" title="On the Home page">
              <Star class="h-4 w-4 fill-current" aria-hidden="true" /><span class="sr-only">On the Home page</span>
            </span>
            <span v-if="!shot.alt.trim()" class="absolute inset-x-2 bottom-2 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.72rem] font-medium text-[#A23B2A] shadow-sm">
              <CircleAlert class="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Needs a description
            </span>
          </span>
          <span class="mt-1.5 block truncate text-[0.84rem]" :class="shot.caption ? 'text-ink-soft' : 'italic text-ink-faint'">{{ shot.caption || 'No caption' }}</span>
        </button>
      </li>
    </ul>
    <p v-if="!shown.length" class="rounded-lg bg-ivory px-4 py-6 text-center text-ink-muted">No photos here yet.</p>

    <!-- One photo -->
    <dialog ref="dialog" class="m-auto w-[min(920px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50" @close="selected = null" @click.self="closeShot">
      <div v-if="selected" class="grid max-h-[calc(100dvh-24px)] overflow-y-auto md:grid-cols-[1fr_1.1fr]">
        <div class="relative bg-cream md:sticky md:top-0 md:h-full md:max-h-[calc(100dvh-24px)]">
          <img :src="photoUrl(selected.src)" :alt="selected.alt" class="h-72 w-full object-contain md:h-full">
        </div>
        <div class="grid content-start gap-6 p-5 sm:p-7">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-faint">Photo {{ selectedIndex + 1 }} of {{ items.length }}</p>
              <h3 class="mt-1 font-serif text-[1.7rem] leading-tight text-ink">Edit photo</h3>
            </div>
            <button type="button" class="a-icon-btn -mr-2 -mt-1" title="Close" @click="closeShot"><X class="h-5 w-5" /><span class="sr-only">Close</span></button>
          </div>

          <AdminField v-for="field in shotFields" :key="field.key" :field="field" file="gallery" :base="`items.${selectedIndex}`" />

          <fieldset class="grid gap-2.5">
            <legend class="a-label mb-2.5">Event type</legend>
            <div class="flex flex-wrap gap-2">
              <button v-for="category in categories" :key="category.id" type="button" class="chip" :aria-pressed="selected.categories.includes(category.id)" @click="toggleCategory(selected, category.id)">{{ category.label }}</button>
            </div>
            <p v-if="!selected.categories.length" class="a-error">Pick at least one so it shows up under the gallery buttons.</p>
          </fieldset>

          <button type="button" class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors" :class="isHighlight(selected) ? 'border-[#B08A3E]/40 bg-[#FBF5E8]' : 'border-ink/10 hover:bg-ivory'" @click="toggleHighlight(selected)">
            <Star class="h-5 w-5 shrink-0 text-[#B08A3E]" :class="isHighlight(selected) ? 'fill-current' : ''" aria-hidden="true" />
            <span class="grid">
              <span class="a-label">{{ isHighlight(selected) ? 'Shown on the Home page' : 'Show on the Home page' }}</span>
              <span class="a-help">The Home page shows five gallery photos ({{ gallery.highlights.length }} chosen).</span>
            </span>
          </button>

          <div class="grid gap-2">
            <p class="a-label">What shows when it's trimmed</p>
            <p class="a-help -mt-1">The gallery page shows the whole photo. Smaller spots, like the Home page, trim it to a shape.</p>
            <button type="button" class="a-btn a-btn-quiet justify-self-start !px-4" @click="chooseFocus([selected.src])">
              <Crosshair class="h-4 w-4" aria-hidden="true" /> Choose what shows
            </button>
          </div>

          <div class="grid gap-2">
            <p class="a-label">Position</p>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="a-btn a-btn-quiet !px-4" :disabled="selectedIndex === 0" @click="move(selected, 0)"><ChevronsUp class="h-4 w-4" aria-hidden="true" /> To the top</button>
              <button type="button" class="a-btn a-btn-quiet !px-4" :disabled="selectedIndex === 0" @click="move(selected, selectedIndex - 1)"><ArrowUp class="h-4 w-4" aria-hidden="true" /> Earlier</button>
              <button type="button" class="a-btn a-btn-quiet !px-4" :disabled="selectedIndex === items.length - 1" @click="move(selected, selectedIndex + 1)"><ArrowDown class="h-4 w-4" aria-hidden="true" /> Later</button>
              <button type="button" class="a-btn a-btn-quiet !px-4" :disabled="selectedIndex === items.length - 1" @click="move(selected, items.length)"><ChevronsDown class="h-4 w-4" aria-hidden="true" /> To the end</button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
            <button type="button" class="a-btn a-btn-danger" @click="remove(selected)"><Trash2 class="h-4 w-4" aria-hidden="true" /> Remove from gallery</button>
            <button type="button" class="a-btn a-btn-primary" @click="closeShot">Done</button>
          </div>
        </div>
      </div>
    </dialog>

    <!-- Adding photos -->
    <dialog ref="addDialog" class="m-auto w-[min(560px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50" @cancel="upload.busy && $event.preventDefault()">
      <form class="grid max-h-[calc(100dvh-24px)] gap-6 overflow-y-auto p-6 sm:p-8" @submit.prevent="addPhotos">
        <div>
          <h3 class="font-serif text-[1.8rem] leading-tight text-ink">Add {{ files.length }} photo{{ files.length === 1 ? '' : 's' }}</h3>
          <p class="a-help mt-1">They're resized for the web automatically. You can describe each one after.</p>
        </div>

        <div class="grid gap-2">
          <label for="upload-event" class="a-label">Which event are they from?</label>
          <select id="upload-event" v-model="upload.event" class="a-input" :class="upload.event ? '' : 'text-ink-faint'">
            <option value="" disabled>Choose one…</option>
            <option value="new">A new event…</option>
            <optgroup v-if="events.length" label="Events already in your gallery">
              <option v-for="event in events" :key="event.id" :value="event.id">{{ event.label }}</option>
            </optgroup>
          </select>
          <input v-if="upload.event === 'new'" v-model="upload.newEvent" type="text" class="a-input" placeholder="Sarah & Ben's wedding" aria-label="New event name">
        </div>

        <fieldset>
          <legend class="a-label mb-2.5">What kind of event?</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="category in categories" :key="category.id">
              <input v-model="upload.categories" type="checkbox" :value="category.id" class="sr-only">
              <span class="chip">{{ category.label }}</span>
            </label>
          </div>
        </fieldset>

        <div class="grid gap-2">
          <label for="upload-credit" class="a-label">Photographer <span class="font-normal text-ink-muted">(optional)</span></label>
          <input id="upload-credit" v-model="upload.credit" type="text" class="a-input">
        </div>

        <ul v-if="upload.errors.length" class="grid gap-1 rounded-lg bg-[#FBEAE6] px-4 py-3">
          <li v-for="message in upload.errors" :key="message" class="a-error">{{ message }}</li>
        </ul>

        <div class="flex flex-wrap items-center justify-end gap-3">
          <p v-if="upload.busy" class="mr-auto flex items-center gap-2 text-[0.9rem] text-ink-muted"><LoaderCircle class="h-4 w-4 animate-spin" aria-hidden="true" /> {{ upload.busy }}</p>
          <p v-else-if="!canAdd" class="mr-auto text-[0.9rem] text-ink-muted">{{ folder ? 'Pick at least one kind of event.' : 'Choose which event they\'re from.' }}</p>
          <button type="button" class="a-btn a-btn-quiet" :disabled="!!upload.busy" @click="addDialog?.close()">{{ upload.errors.length ? 'Close' : 'Cancel' }}</button>
          <button type="submit" class="a-btn a-btn-primary" :disabled="!canAdd">Add to gallery</button>
        </div>
      </form>
    </dialog>
  </div>
</template>
