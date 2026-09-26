<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'
import { clone, editor, getAt, isChanged, removeWithUndo, setAt } from '~/admin/editor'
import type { CardsField } from '~/admin/sections'

const props = defineProps<{ field: CardsField, file: ContentName, path: string }>()

const items = computed(() => (getAt(editor.draft[props.file], props.path) ?? []) as Record<string, any>[])
const editable = computed(() => !!props.field.addLabel)

// Open cards are tracked by item, so they stay open when moved.
const open = ref(new Set<object>())
const isOpen = (item: object) => open.value.has(toRaw(item))
function toggle(item: object) {
  const raw = toRaw(item)
  if (open.value.has(raw)) open.value.delete(raw)
  else open.value.add(raw)
}

const root = ref<HTMLElement>()

function add() {
  if (!getAt(editor.draft[props.file], props.path)) setAt(editor.draft[props.file], props.path, [])
  items.value.push(clone(props.field.template ?? {}))
  const added = items.value[items.value.length - 1]!
  open.value.add(toRaw(added))
  nextTick(() => {
    const cards = root.value?.querySelectorAll<HTMLElement>('[data-card]')
    const card = cards?.[cards.length - 1]
    card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    card?.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true })
  })
}

function move(from: number, to: number) {
  const [item] = items.value.splice(from, 1)
  items.value.splice(to, 0, item!)
}

const titleOf = (item: Record<string, any>) => String(item[props.field.titleKey] ?? '').trim()
</script>

<template>
  <div ref="root" class="grid gap-2.5">
    <template v-if="field.compact">
      <div v-for="(item, i) in items" :key="i" class="grid gap-4 rounded-lg border border-ink/10 bg-ivory/50 p-4">
        <AdminField v-for="sub in field.fields" :key="sub.key" :field="sub" :file="file" :base="`${path}.${i}`" :label="`${field.itemLabel} ${i + 1}`" />
      </div>
    </template>

    <template v-else>
      <div v-for="(item, i) in items" :key="i" data-card class="overflow-hidden rounded-lg border border-ink/10 bg-white">
        <div class="flex items-center gap-1 pr-1.5">
          <button type="button" class="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left hover:bg-ivory/70" :aria-expanded="isOpen(item)" @click="toggle(item)">
            <ChevronDown class="h-5 w-5 shrink-0 text-ink-faint transition-transform" :class="isOpen(item) ? 'rotate-180' : ''" aria-hidden="true" />
            <span class="min-w-0">
              <span class="block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-faint">{{ field.itemLabel }} {{ i + 1 }}</span>
              <span class="block truncate font-medium" :class="titleOf(item) ? 'text-ink' : 'italic text-ink-faint'">{{ titleOf(item) || 'Not filled in yet' }}</span>
            </span>
            <span v-if="field.noteKey && item[field.noteKey]" class="ml-auto shrink-0 rounded-full bg-ivory px-3 py-1 text-[0.9rem] text-ink-soft ring-1 ring-ink/10">{{ item[field.noteKey] }}</span>
            <span v-if="isChanged(file, `${path}.${i}`)" class="ml-auto h-2 w-2 shrink-0 rounded-full bg-sage" title="Changed" />
          </button>
          <template v-if="editable">
            <button type="button" class="a-icon-btn" :disabled="i === 0" :title="`Move this ${field.itemLabel.toLowerCase()} up`" @click="move(i, i - 1)">
              <ArrowUp class="h-[18px] w-[18px]" /><span class="sr-only">Move up</span>
            </button>
            <button type="button" class="a-icon-btn" :disabled="i === items.length - 1" :title="`Move this ${field.itemLabel.toLowerCase()} down`" @click="move(i, i + 1)">
              <ArrowDown class="h-[18px] w-[18px]" /><span class="sr-only">Move down</span>
            </button>
            <button type="button" class="a-icon-btn hover:!text-[#A23B2A]" :title="`Remove this ${field.itemLabel.toLowerCase()}`" @click="removeWithUndo(items, i, field.itemLabel)">
              <Trash2 class="h-[18px] w-[18px]" /><span class="sr-only">Remove</span>
            </button>
          </template>
        </div>
        <div v-if="isOpen(item)" class="grid gap-6 border-t border-ink/10 bg-ivory/40 px-4 py-5 sm:px-5">
          <AdminField v-for="sub in field.fields" :key="sub.key" :field="sub" :file="file" :base="`${path}.${i}`" />
        </div>
      </div>
    </template>

    <button v-if="editable" type="button" class="a-add" @click="add">
      <Plus class="h-[18px] w-[18px]" aria-hidden="true" /> {{ field.addLabel }}
    </button>
  </div>
</template>
