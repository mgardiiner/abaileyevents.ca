<script setup lang="ts">
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'
import { editor, getAt, removeWithUndo, setAt } from '~/admin/editor'
import type { ListField } from '~/admin/sections'

const props = defineProps<{ field: ListField, file: ContentName, path: string }>()

const items = computed(() => (getAt(editor.draft[props.file], props.path) ?? []) as string[])
const list = ref<HTMLElement>()

function add() {
  if (!getAt(editor.draft[props.file], props.path)) setAt(editor.draft[props.file], props.path, [])
  items.value.push('')
  nextTick(() => {
    const boxes = list.value?.querySelectorAll<HTMLElement>('input, textarea')
    boxes?.[boxes.length - 1]?.focus()
  })
}

function move(from: number, to: number) {
  const [item] = items.value.splice(from, 1)
  items.value.splice(to, 0, item!)
}

const vAutosize = {
  mounted: (el: HTMLTextAreaElement) => resize(el),
  updated: (el: HTMLTextAreaElement) => resize(el),
}
function resize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 2}px`
}
</script>

<template>
  <div ref="list" class="grid gap-2">
    <div v-for="(item, i) in items" :key="i" class="flex items-start gap-1.5">
      <textarea
        v-if="field.multiline"
        v-model="items[i]"
        v-autosize
        rows="3"
        class="a-input resize-none"
        :aria-label="`${field.itemLabel} ${i + 1}`"
      />
      <input v-else v-model="items[i]" type="text" class="a-input" :aria-label="`${field.itemLabel} ${i + 1}`">
      <div class="flex shrink-0" :class="field.multiline ? 'flex-col' : ''">
        <button type="button" class="a-icon-btn" :disabled="i === 0" :title="`Move this ${field.itemLabel.toLowerCase()} up`" @click="move(i, i - 1)">
          <ArrowUp class="h-[18px] w-[18px]" /><span class="sr-only">Move up</span>
        </button>
        <button type="button" class="a-icon-btn" :disabled="i === items.length - 1" :title="`Move this ${field.itemLabel.toLowerCase()} down`" @click="move(i, i + 1)">
          <ArrowDown class="h-[18px] w-[18px]" /><span class="sr-only">Move down</span>
        </button>
        <button type="button" class="a-icon-btn hover:!text-[#A23B2A]" :title="`Remove this ${field.itemLabel.toLowerCase()}`" @click="removeWithUndo(items, i, field.itemLabel)">
          <Trash2 class="h-[18px] w-[18px]" /><span class="sr-only">Remove</span>
        </button>
      </div>
    </div>
    <button type="button" class="a-add" @click="add">
      <Plus class="h-[18px] w-[18px]" aria-hidden="true" /> {{ field.addLabel }}
    </button>
  </div>
</template>
