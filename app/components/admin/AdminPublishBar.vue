<script setup lang="ts">
import { CircleCheck, CircleAlert, ExternalLink, LoaderCircle, TriangleAlert, X } from 'lucide-vue-next'
import { EditorError, SITE_URL } from '~/admin/backend'
import { changeCount, changedSections, discardAll, dismissDeploy, editor, hasChanges, load, notify, problems, publish, signOut, type Problem } from '~/admin/editor'

const changes = computed(() => hasChanges())
const areas = computed(() => changedSections())
const count = computed(changeCount)
const siteUrl = computed(() => editor.backend === 'local' ? '/' : SITE_URL)

const confirmDialog = ref<HTMLDialogElement>()
const problemDialog = ref<HTMLDialogElement>()
const errorDialog = ref<HTMLDialogElement>()
const found = ref<Problem[]>([])
const failure = ref<{ title: string, body: string, detail?: string, action?: { label: string, run: () => void } } | null>(null)
// Signed in with the editor password, the GitHub key is out of sight, so errors about it say
// "the editor" rather than "your key".
const passwordSignIn = !!useRuntimeConfig().public.adminKey

function start() {
  found.value = problems()
  if (found.value.length) return problemDialog.value?.showModal()
  confirmDialog.value?.showModal()
}

async function confirm() {
  confirmDialog.value?.close()
  try {
    await publish()
  }
  catch (error) {
    failure.value = explain(error)
    errorDialog.value?.showModal()
  }
}

function explain(error: unknown): NonNullable<typeof failure.value> {
  const code = error instanceof EditorError ? error.code : 'failed'
  if (code === 'conflict') {
    return {
      title: 'Your website was updated somewhere else',
      body: 'While you were editing, part of the website you changed was also published from another device or by someone else. To keep both safe, load the latest version first. Your changes to other parts are kept; you may need to redo the ones in that part.',
      action: { label: 'Load the latest version', run: () => load().catch(() => undefined) },
    }
  }
  if (code === 'offline') return { title: 'Couldn\'t reach the internet', body: 'Check your connection and try publishing again. Your changes are saved on this device, so nothing is lost.' }
  const detail = error instanceof Error ? error.message : String(error)
  if (code === 'bad-key') {
    return passwordSignIn
      ? { title: 'The editor\'s access has stopped working', body: 'Its access to your website may have expired. Ask the person who set up your website to renew it. Your changes are saved on this device and will be here when it\'s fixed.', detail }
      : { title: 'Your access key has stopped working', body: 'It may have expired. Sign in again with a new key. Your changes are saved on this device and will be here when you do.', action: { label: 'Sign in again', run: signOut } }
  }
  if (code === 'read-only') {
    return {
      title: passwordSignIn ? 'The editor isn\'t allowed to publish yet' : 'This key can\'t publish',
      body: `${passwordSignIn ? 'The editor can open your website but isn\'t allowed to save changes to it.' : 'Your access key can view the website but not save changes to it.'} Ask the person who set up your website to allow publishing. Your changes are saved on this device, so nothing is lost: press Publish again once it's fixed.`,
      detail,
    }
  }
  return { title: 'Something went wrong', body: 'Your changes weren\'t published, but they\'re still saved on this device. Please try again in a minute. If it keeps happening, let the person who set up your website know.', detail }
}

function goTo(problem: Problem) {
  problemDialog.value?.close()
  navigateTo({ query: { page: problem.section.id }, hash: `#${problem.group.id}` })
}

function discard() {
  if (window.confirm('Throw away all your unpublished changes? This can\'t be undone.')) {
    discardAll()
    notify('Your unpublished changes were discarded.')
  }
}

// Leaving while publishing could cut a publish off halfway.
function guard(event: BeforeUnloadEvent) {
  if (editor.publishing) event.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', guard))
onBeforeUnmount(() => window.removeEventListener('beforeunload', guard))

const deployMessage = computed(() => {
  const deploy = editor.deploy
  if (!deploy) return ''
  if (editor.backend === 'local') return 'Saved to the files on this computer.'
  if (deploy.state === 'live') return 'Your changes are live on your website.'
  if (deploy.state === 'failed') return 'Your changes are saved, but the website didn\'t update. Let the person who set up your website know.'
  if (deploy.state === 'unknown') return 'Published! Your website will show the changes within a few minutes.'
  return 'Published! Your website is updating now. This usually takes about 2 minutes, and you can keep editing.'
})
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5">
    <div
      v-if="editor.publishing || editor.deploy || changes"
      class="pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-ink px-5 py-3.5 text-ivory shadow-[0_18px_50px_-12px_rgba(34,33,31,0.55)]"
    >
      <template v-if="editor.publishing">
        <LoaderCircle class="h-5 w-5 animate-spin text-sage-mist" aria-hidden="true" />
        <p class="flex-1" role="status">{{ editor.publishing }}</p>
      </template>

      <template v-else-if="editor.deploy && !changes">
        <CircleCheck v-if="editor.deploy.state === 'live' || editor.deploy.state === 'unknown'" class="h-5 w-5 shrink-0 text-[#B9D3A8]" aria-hidden="true" />
        <TriangleAlert v-else-if="editor.deploy.state === 'failed'" class="h-5 w-5 shrink-0 text-[#F2B8A8]" aria-hidden="true" />
        <LoaderCircle v-else class="h-5 w-5 shrink-0 animate-spin text-sage-mist" aria-hidden="true" />
        <p class="min-w-[12rem] flex-1 text-[0.95rem]" role="status">{{ deployMessage }}</p>
        <a :href="siteUrl" target="_blank" rel="noopener" class="a-btn border border-ivory/30 !min-h-[40px] !px-4 text-ivory hover:bg-ivory hover:text-ink">
          View website <ExternalLink class="h-4 w-4" aria-hidden="true" />
        </a>
        <button type="button" class="a-icon-btn !text-ivory/70 hover:!bg-ivory/10 hover:!text-ivory" title="Close" @click="dismissDeploy"><X class="h-5 w-5" /><span class="sr-only">Close</span></button>
      </template>

      <template v-else>
        <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-[#B9D3A8]" aria-hidden="true" />
        <p class="min-w-[12rem] flex-1 text-[0.95rem] max-sm:basis-[80%]">
          <span class="font-medium">{{ count || 'New' }} unpublished change{{ count === 1 ? '' : 's' }}</span>
          <span v-if="areas.length" class="text-ivory/70"> in {{ areas.map(section => section.title).join(', ') }}</span>
        </p>
        <button type="button" class="px-2 text-[0.9rem] text-ivory/75 underline-offset-4 hover:text-ivory hover:underline" @click="discard">Discard</button>
        <button type="button" class="a-btn bg-ivory !min-h-[42px] text-ink hover:bg-sage-mist max-sm:flex-1" @click="start">Publish changes</button>
      </template>
    </div>

    <dialog ref="confirmDialog" class="pointer-events-auto m-auto w-[min(500px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50">
      <div class="grid gap-5 p-6 sm:p-8">
        <h3 class="font-serif text-[1.9rem] leading-tight text-ink">Publish your changes?</h3>
        <div class="grid gap-2">
          <p class="text-ink-soft">These parts of your website will be updated:</p>
          <ul class="grid gap-1.5">
            <li v-for="section in areas" :key="section.id" class="flex items-center gap-2.5 text-ink">
              <component :is="section.icon" class="h-[18px] w-[18px] text-sage-deep" aria-hidden="true" /> {{ section.title }}
            </li>
            <li v-if="!areas.length" class="text-ink">New photos</li>
          </ul>
        </div>
        <p class="a-help">{{ editor.backend === 'local' ? 'This saves them to the files on this computer.' : 'Everyone will see them in about 2 minutes. Earlier versions are kept, so anything can be put back later.' }}</p>
        <div class="flex flex-wrap justify-end gap-3">
          <button type="button" class="a-btn a-btn-quiet" @click="confirmDialog?.close()">Keep editing</button>
          <button type="button" class="a-btn a-btn-primary" @click="confirm">Publish</button>
        </div>
      </div>
    </dialog>

    <dialog ref="problemDialog" class="pointer-events-auto m-auto w-[min(540px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50">
      <div class="grid max-h-[calc(100dvh-24px)] gap-5 overflow-y-auto p-6 sm:p-8">
        <div class="flex items-start gap-3">
          <CircleAlert class="mt-1.5 h-6 w-6 shrink-0 text-[#A23B2A]" aria-hidden="true" />
          <div>
            <h3 class="font-serif text-[1.8rem] leading-tight text-ink">A few things need filling in</h3>
            <p class="a-help mt-1">These show on your website, so they can't be left empty.</p>
          </div>
        </div>
        <ul class="grid gap-2">
          <li v-for="(problem, i) in found" :key="i">
            <button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg border border-ink/10 px-4 py-3 text-left hover:border-ink/30" @click="goTo(problem)">
              <span>
                <span class="block text-[0.78rem] uppercase tracking-[0.12em] text-ink-faint">{{ problem.section.title }} · {{ problem.group.title }}</span>
                <span class="block text-ink">{{ problem.label }}</span>
              </span>
              <span class="shrink-0 text-[0.88rem] font-medium text-sage-deep">Fix</span>
            </button>
          </li>
        </ul>
        <div class="flex justify-end">
          <button type="button" class="a-btn a-btn-quiet" @click="problemDialog?.close()">Close</button>
        </div>
      </div>
    </dialog>

    <dialog ref="errorDialog" class="pointer-events-auto m-auto w-[min(500px,calc(100vw-24px))] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-ink/50">
      <div v-if="failure" class="grid gap-5 p-6 sm:p-8">
        <h3 class="font-serif text-[1.8rem] leading-tight text-ink">{{ failure.title }}</h3>
        <p class="text-ink-soft">{{ failure.body }}</p>
        <details v-if="failure.detail" class="-mt-2 text-[0.82rem] text-ink-muted">
          <summary class="cursor-pointer">Details for whoever set up your website</summary>
          <p class="mt-1.5 break-words font-mono">{{ failure.detail }}</p>
        </details>
        <div class="flex flex-wrap justify-end gap-3">
          <button type="button" class="a-btn a-btn-quiet" @click="errorDialog?.close()">Close</button>
          <button v-if="failure.action" type="button" class="a-btn a-btn-primary" @click="errorDialog?.close(); failure.action.run()">{{ failure.action.label }}</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
