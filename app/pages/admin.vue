<script setup lang="ts">
import { Eye, ExternalLink, LayoutGrid, LoaderCircle, LogOut, X } from 'lucide-vue-next'
import '~/assets/css/admin.css'
import { SITE_URL, type EditorError } from '~/admin/backend'
import { configure, editor, resume, sectionChanges, signOut } from '~/admin/editor'
import { findSection, sections, type PreviewTarget } from '~/admin/sections'

// The website editor: sign in, change the words, prices and photos on any page with a live
// preview beside it, then publish. See app/admin/ for how it reads and saves the site.
definePageMeta({ layout: false })
useHead({
  title: 'Website editor · ABailey Events',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

configure({ previewHash: useRuntimeConfig().public.previewHash })

const route = useRoute()
const section = computed(() => findSection(route.query.page))
const siteUrl = computed(() => editor.backend === 'local' ? '/' : SITE_URL)

const notice = ref<EditorError | null>(null)
const starting = ref(true)
onMounted(async () => {
  if (editor.mode === 'signed-out') notice.value = await resume()
  starting.value = false
})

// The preview sits beside the editor on wide screens and opens over it on smaller ones.
const target = ref<PreviewTarget>({ path: '/' })
const previewOpen = ref(false)
watch(section, (next) => {
  if (next) target.value = next.preview
  previewOpen.value = false
}, { immediate: true })
const wide = ref(false)
onMounted(() => {
  const query = window.matchMedia('(min-width: 1280px)')
  wide.value = query.matches
  query.addEventListener('change', event => wide.value = event.matches)
})
</script>

<template>
  <div class="min-h-dvh bg-ivory text-ink">
    <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink/10 bg-white/95 px-4 backdrop-blur sm:px-6">
      <NuxtLink to="/admin" class="whitespace-nowrap font-serif text-[1.2rem] tracking-[0.04em] text-ink sm:text-[1.35rem]">
        <b class="font-semibold">ABailey</b> Events <RoseMark class="inline-block h-[1.1em] w-[1.1em] align-[-0.16em] text-sage" :weight="1.4" />
      </NuxtLink>
      <span class="hidden rounded-full bg-sage-mist px-2.5 py-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-sage-deep sm:inline">Website editor</span>
      <span v-if="editor.backend === 'local'" class="whitespace-nowrap rounded-full max-sm:hidden bg-[#FBF5E8] px-2.5 py-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8A6A2C]">Local files</span>
      <div class="ml-auto flex items-center gap-1.5">
        <button v-if="section && editor.mode === 'ready' && !wide && !previewOpen" type="button" class="a-btn a-btn-quiet !min-h-[40px] !px-4" @click="previewOpen = true">
          <Eye class="h-4 w-4" aria-hidden="true" /> Preview
        </button>
        <a :href="siteUrl" target="_blank" rel="noopener" class="a-btn a-btn-quiet !min-h-[40px] !px-4 max-sm:!hidden">
          View website <ExternalLink class="h-4 w-4" aria-hidden="true" />
        </a>
        <button v-if="editor.mode === 'ready'" type="button" class="a-icon-btn" title="Sign out" @click="signOut">
          <LogOut class="h-5 w-5" /><span class="sr-only">Sign out</span>
        </button>
      </div>
    </header>

    <div v-if="starting || editor.mode === 'loading'" class="grid min-h-[70dvh] place-items-center">
      <p class="flex items-center gap-2.5 text-ink-muted"><LoaderCircle class="h-5 w-5 animate-spin" aria-hidden="true" /> Opening your website…</p>
    </div>

    <AdminSignIn v-else-if="editor.mode === 'signed-out'" :notice="notice" />

    <div v-else class="lg:grid" :class="section && wide ? 'lg:grid-cols-[232px_minmax(0,1fr)_minmax(0,1.05fr)]' : 'lg:grid-cols-[232px_minmax(0,1fr)]'">
      <nav aria-label="Pages" class="sticky top-16 hidden h-[calc(100dvh-64px)] overflow-y-auto border-r border-ink/10 bg-white/60 px-3 py-5 lg:block">
        <NuxtLink to="/admin" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] transition-colors" :class="!section ? 'bg-sage-mist font-medium text-ink' : 'text-ink-soft hover:bg-ink/5'">
          <LayoutGrid class="h-[18px] w-[18px] text-sage-deep" aria-hidden="true" /> Overview
        </NuxtLink>
        <p class="mb-1.5 mt-5 px-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-faint">Pages</p>
        <NuxtLink
          v-for="item in sections"
          :key="item.id"
          :to="{ query: { page: item.id } }"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] transition-colors"
          :class="section?.id === item.id ? 'bg-sage-mist font-medium text-ink' : 'text-ink-soft hover:bg-ink/5'"
          :aria-current="section?.id === item.id ? 'page' : undefined"
        >
          <component :is="item.icon" class="h-[18px] w-[18px] shrink-0 text-sage-deep" aria-hidden="true" />
          <span class="flex-1">{{ item.title }}</span>
          <span v-if="sectionChanges(item)" class="h-2 w-2 rounded-full bg-sage" title="Has unpublished changes" />
        </NuxtLink>
      </nav>

      <main class="min-w-0">
        <AdminSectionEditor v-if="section" :key="section.id" :section="section" @focus="target = $event" />
        <AdminDashboard v-else />
      </main>

      <aside
        v-show="section && (wide || previewOpen)"
        class="z-40 flex flex-col bg-[#F1ECE4]"
        :class="wide ? 'sticky top-16 h-[calc(100dvh-64px)] border-l border-ink/10' : 'fixed inset-0 top-16'"
        aria-label="Preview"
      >
        <div v-if="!wide" class="flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-2">
          <p class="text-[0.9rem] text-ink-muted">Only you can see unpublished changes.</p>
          <button type="button" class="a-btn a-btn-primary !min-h-[40px] shrink-0 !px-4" @click="previewOpen = false">
            <X class="h-4 w-4" aria-hidden="true" /> Close preview
          </button>
        </div>
        <AdminPreview :target="target" />
      </aside>
    </div>

    <template v-if="editor.mode === 'ready'">
      <AdminPublishBar />
      <AdminToasts />
      <AdminPhotoChooser />
      <AdminFocusDialog />
    </template>
  </div>
</template>
