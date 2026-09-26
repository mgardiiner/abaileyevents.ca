<script setup lang="ts">
import { ChevronDown, ChevronLeft } from 'lucide-vue-next'
import { fileOf, groupChanges } from '~/admin/editor'
import type { Group, PreviewTarget, Section } from '~/admin/sections'

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ focus: [target: PreviewTarget] }>()

// The preview follows whichever part of the page is being worked on.
const focus = (group: Group) => emit('focus', group.preview ?? props.section.preview)
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 pb-44 pt-6 sm:px-8 sm:pt-10">
    <NuxtLink to="/admin" class="-ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.9rem] text-ink-muted hover:text-ink lg:hidden">
      <ChevronLeft class="h-4 w-4" aria-hidden="true" /> All pages
    </NuxtLink>
    <div class="mt-2 flex items-center gap-3.5 lg:mt-0">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-sage-deep shadow-sm ring-1 ring-ink/5">
        <component :is="section.icon" class="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h1 class="font-serif text-[2.3rem] font-light leading-none text-ink">{{ section.title }}</h1>
        <p class="mt-1.5 text-ink-muted">{{ section.blurb }}</p>
      </div>
    </div>

    <template v-for="group in section.groups" :key="group.id">
      <details v-if="group.folded" :id="group.id" class="a-card group/fold mt-5 scroll-mt-24" @focusin="focus(group)" @pointerdown="focus(group)">
        <summary class="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 sm:px-7">
          <span>
            <span class="block font-serif text-[1.45rem] leading-tight text-ink">{{ group.title }}</span>
            <span v-if="group.help" class="a-help mt-1 block">{{ group.help }}</span>
          </span>
          <ChevronDown class="h-5 w-5 shrink-0 text-ink-faint transition-transform group-open/fold:rotate-180" aria-hidden="true" />
        </summary>
        <div class="grid gap-7 border-t border-ink/10 px-5 py-6 sm:px-7">
          <AdminField v-for="(field, i) in group.fields" :key="field.key ?? i" :field="field" :file="fileOf(field, group)" />
        </div>
      </details>

      <section v-else :id="group.id" class="a-card mt-5 scroll-mt-24" @focusin="focus(group)" @pointerdown="focus(group)">
        <header class="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-7">
          <div>
            <h2 class="font-serif text-[1.45rem] leading-tight text-ink">{{ group.title }}</h2>
            <p v-if="group.help" class="a-help mt-1">{{ group.help }}</p>
          </div>
          <span v-if="groupChanges(group)" class="mt-1 shrink-0 rounded-full bg-sage-mist px-2.5 py-0.5 text-[0.78rem] font-medium text-sage-deep">
            {{ groupChanges(group) }} changed
          </span>
        </header>
        <div class="grid gap-7 px-5 py-6 sm:px-7">
          <AdminField v-for="(field, i) in group.fields" :key="field.key ?? i" :field="field" :file="fileOf(field, group)" />
        </div>
      </section>
    </template>
  </div>
</template>
