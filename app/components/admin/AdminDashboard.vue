<script setup lang="ts">
import { ArrowRight, Eye, ImagePlus, MessageCircleQuestionMark, MessageSquareQuote, PencilLine, Send, Tag } from 'lucide-vue-next'
import { editor, sectionChanges } from '~/admin/editor'
import { sections } from '~/admin/sections'

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
})

const updated = computed(() => editor.updatedAt
  ? new Date(editor.updatedAt).toLocaleString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '')

const shortcuts = [
  { label: 'Change a price', icon: Tag, to: { query: { page: 'prices' } } },
  { label: 'Add gallery photos', icon: ImagePlus, to: { query: { page: 'gallery' } } },
  { label: 'Add or edit a question', icon: MessageCircleQuestionMark, to: { query: { page: 'faq' }, hash: '#planning' } },
  { label: 'Add a review', icon: MessageSquareQuote, to: { query: { page: 'reviews' } } },
]

const steps = [
  { icon: PencilLine, title: 'Make your changes', body: 'Pick a page below and change any words, prices or photos.' },
  { icon: Eye, title: 'Check the preview', body: 'Your website shows the changes as you type, beside the editor (or under Preview on a phone). Only you can see them.' },
  { icon: Send, title: 'Publish', body: 'Press Publish changes at the bottom when you\'re happy. Everyone sees them in about 2 minutes.' },
]
</script>

<template>
  <!-- On a phone the pages come first and the how-it-works steps follow them. -->
  <div class="mx-auto flex max-w-5xl flex-col px-4 pb-40 pt-10 sm:px-8 sm:pt-14">
    <p class="font-script text-[2rem] leading-none text-sage-deep">{{ greeting }},</p>
    <h1 class="mt-2 font-serif text-[clamp(2.4rem,5vw,3.4rem)] font-light leading-[1.05] text-ink">What would you like to update?</h1>
    <p v-if="updated" class="mt-3 text-ink-muted">Your website was last updated {{ updated }}{{ updated.endsWith('.') ? '' : '.' }}</p>

    <div class="max-md:order-last max-md:mt-14">
      <h2 class="text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink-faint md:sr-only">How it works</h2>
      <ol class="mt-3 grid gap-4 md:mt-10 md:grid-cols-3">
        <li v-for="(step, i) in steps" :key="step.title" class="a-card flex gap-4 p-5">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-mist text-sage-deep">
            <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span class="block font-medium text-ink">{{ i + 1 }}. {{ step.title }}</span>
            <span class="mt-1 block text-[0.9rem] leading-snug text-ink-muted">{{ step.body }}</span>
          </span>
        </li>
      </ol>
      <p class="mt-4 text-[0.9rem] text-ink-muted">Nothing changes on your website until you publish, and your work is saved on this device as you go.</p>
    </div>

    <h2 class="mt-10 text-[0.78rem] md:mt-14 font-medium uppercase tracking-[0.16em] text-ink-faint">Quick jobs</h2>
    <div class="mt-3 flex flex-wrap gap-2.5">
      <NuxtLink v-for="shortcut in shortcuts" :key="shortcut.label" :to="shortcut.to" class="a-btn a-btn-quiet">
        <component :is="shortcut.icon" class="h-[18px] w-[18px] text-sage-deep" aria-hidden="true" /> {{ shortcut.label }}
      </NuxtLink>
    </div>

    <h2 class="mt-12 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink-faint">Your pages</h2>
    <ul class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="section in sections" :key="section.id">
        <NuxtLink :to="{ query: { page: section.id } }" class="a-card group flex h-full items-start gap-4 p-5 transition-shadow hover:shadow-lift">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ivory text-sage-deep ring-1 ring-ink/5">
            <component :is="section.icon" class="h-5 w-5" aria-hidden="true" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2 font-serif text-[1.4rem] leading-tight text-ink">
              {{ section.title }}
              <span v-if="sectionChanges(section)" class="h-2 w-2 rounded-full bg-sage" title="Has unpublished changes" />
            </span>
            <span class="mt-1 block text-[0.9rem] leading-snug text-ink-muted">{{ section.blurb }}</span>
          </span>
          <ArrowRight class="mt-1.5 h-5 w-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
