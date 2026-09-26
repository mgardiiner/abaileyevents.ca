<script setup lang="ts">
import { Eye, EyeOff, KeyRound, LoaderCircle } from 'lucide-vue-next'
import { EditorError, SITE_REPO, SITE_URL } from '~/admin/backend'
import { signIn } from '~/admin/editor'
import { openSealedKey } from '~/admin/sealed-key'

const props = defineProps<{ notice?: EditorError | null }>()

// With a key sealed into the build (see nuxt.config.ts) the editor asks for its password; the
// GitHub access key stays available as a fallback, e.g. while a renewed key waits for a deploy.
const sealed = useRuntimeConfig().public.adminKey as string
const usePassword = ref(!!sealed)

const secret = ref('')
const remember = ref(true)
const showSecret = ref(false)
const busy = ref(false)
const error = ref('')
const dev = import.meta.dev

const messages: Record<string, string> = {
  'bad-key': 'That key didn\'t work. Check it was copied in full, with nothing missing at either end.',
  'no-access': 'That key works, but it can\'t open this website. It needs access to the abaileyevents.ca site.',
  'offline': 'Couldn\'t connect. Check your internet connection and try again.',
  'failed': 'Something went wrong signing in. Please try again in a minute.',
}
// The password was right but the key inside it has been revoked or has expired.
const expiredKey = 'Your password is right, but the website\'s access key has stopped working (it may have expired). Ask whoever set up your website to renew it.'

watchEffect(() => {
  if (!props.notice) return
  error.value = props.notice.code !== 'bad-key'
    ? messages[props.notice.code] ?? messages.failed!
    : usePassword.value ? 'You\'ve been signed out. Please enter your password again.' : 'Your saved key has stopped working (it may have expired). Please enter a new one.'
})

async function submit(kind: 'github' | 'local' = 'github') {
  if (kind === 'github' && !secret.value.trim()) {
    error.value = usePassword.value ? 'Type your password to sign in.' : 'Paste your access key to sign in.'
    return
  }
  busy.value = true
  error.value = ''
  try {
    let key = secret.value.trim()
    if (kind === 'github' && usePassword.value) {
      if (!globalThis.crypto?.subtle) {
        error.value = `The editor needs a secure connection. Open ${SITE_URL}/admin (with https) and try again.`
        return
      }
      const opened = await openSealedKey(sealed, secret.value)
      if (!opened) {
        error.value = 'That password isn\'t right. Check caps lock is off and try again.'
        return
      }
      key = opened
    }
    await signIn(kind, key, remember.value)
  }
  catch (reason) {
    const code = reason instanceof EditorError ? reason.code : 'failed'
    error.value = code === 'bad-key' && usePassword.value ? expiredKey : messages[code] ?? messages.failed!
  }
  finally {
    busy.value = false
  }
}

function switchMode() {
  usePassword.value = !usePassword.value
  secret.value = ''
  error.value = ''
}
</script>

<template>
  <div class="bg-page flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 py-12">
    <div class="a-card w-full max-w-md p-7 sm:p-9">
      <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-mist text-sage-deep">
        <KeyRound class="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 class="mt-5 text-center font-serif text-[2.2rem] leading-tight text-ink">Website editor</h1>
      <p class="mx-auto mt-2 max-w-[32ch] text-center text-ink-muted">Sign in to update your website's words, prices and photos.</p>

      <form class="mt-8 grid gap-5" @submit.prevent="submit()">
        <!-- Lets password managers offer to save and fill the editor password. -->
        <input v-if="usePassword" type="text" name="username" autocomplete="username" value="ABailey Events editor" class="sr-only" tabindex="-1" aria-hidden="true">
        <div class="grid gap-2">
          <label for="editor-secret" class="a-label">{{ usePassword ? 'Password' : 'Access key' }}</label>
          <div class="relative">
            <input
              id="editor-secret"
              v-model="secret"
              :type="showSecret ? 'text' : 'password'"
              autocomplete="current-password"
              spellcheck="false"
              autocapitalize="off"
              class="a-input !pr-12"
              :class="usePassword ? '' : 'font-mono !text-[0.95rem]'"
              :placeholder="usePassword ? '' : 'Paste your key here'"
            >
            <button type="button" class="a-icon-btn absolute right-1 top-1/2 -translate-y-1/2" :title="showSecret ? 'Hide' : 'Show'" @click="showSecret = !showSecret">
              <EyeOff v-if="showSecret" class="h-[18px] w-[18px]" /><Eye v-else class="h-[18px] w-[18px]" />
              <span class="sr-only">{{ showSecret ? 'Hide' : 'Show' }} {{ usePassword ? 'password' : 'key' }}</span>
            </button>
          </div>
        </div>
        <label class="flex items-center gap-3 text-[0.95rem] text-ink-soft">
          <input v-model="remember" type="checkbox" class="h-5 w-5 rounded accent-[#55624D]">
          Keep me signed in on this device
        </label>
        <p v-if="error" class="a-error rounded-lg bg-[#FBEAE6] px-4 py-3" role="alert">{{ error }}</p>
        <button type="submit" class="a-btn a-btn-primary w-full" :disabled="busy">
          <LoaderCircle v-if="busy" class="h-5 w-5 animate-spin" aria-hidden="true" />
          {{ busy ? 'Opening your website…' : 'Sign in' }}
        </button>
        <button v-if="dev" type="button" class="a-btn a-btn-quiet w-full" :disabled="busy" @click="submit('local')">
          Edit the files on this computer
        </button>
      </form>

      <details v-if="usePassword" class="mt-8 rounded-lg bg-ivory px-4 py-3 text-[0.9rem] text-ink-muted">
        <summary class="cursor-pointer font-medium text-ink-soft">Forgotten the password?</summary>
        <p class="mt-2">Ask the person who set up your website. They can tell you the password, or change it for you.</p>
        <button type="button" class="mt-3 text-[0.85rem] underline underline-offset-4 hover:text-ink" @click="switchMode">Sign in with an access key instead</button>
      </details>
      <details v-else class="mt-8 rounded-lg bg-ivory px-4 py-3 text-[0.9rem] text-ink-muted">
        <summary class="cursor-pointer font-medium text-ink-soft">What's an access key?</summary>
        <p class="mt-2">It works like a password that lets this page save changes to your website. The person who set up your website can make one for you. You only need to enter it once on each device.</p>
        <p class="mt-2 text-[0.82rem]">For whoever sets it up: a GitHub fine-grained personal access token for <code>{{ SITE_REPO }}</code> with <em>Contents: Read and write</em> and <em>Actions: Read-only</em>.</p>
        <button v-if="sealed" type="button" class="mt-3 text-[0.85rem] underline underline-offset-4 hover:text-ink" @click="switchMode">Sign in with the password instead</button>
      </details>
    </div>
  </div>
</template>
