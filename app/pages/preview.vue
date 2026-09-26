<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Preview · ABailey Events', meta: [{ name: 'robots', content: 'noindex' }] })

const { previewHash } = useRuntimeConfig().public
const preview = useCookie('preview', { maxAge: 60 * 60 * 24 * 7 })
const password = ref('')
const error = ref('')

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}

async function unlock() {
  error.value = ''
  if (!previewHash || (await sha256(password.value)) !== previewHash) {
    error.value = 'Incorrect password.'
    return
  }
  preview.value = previewHash
  // Let the cookie write flush before the middleware reads it on the next route.
  await nextTick()
  await navigateTo('/')
}
</script>

<template>
  <main class="bg-hero flex min-h-svh flex-col items-center justify-center px-6 py-[90px] text-center text-ink">
    <p class="mb-10 font-serif text-[1.5rem] tracking-[0.06em] text-ink">
      <b class="font-semibold">ABailey</b> Events <RoseMark class="inline-block h-[1.1em] w-[1.1em] align-[-0.16em] text-sage" :weight="1.4" />
    </p>
    <h1 class="text-[clamp(2.4rem,6vw,3.6rem)] text-ink">
      Site <em class="italic text-sage">preview</em>.
    </h1>
    <p class="mb-8 mt-3 text-[1.05rem] text-ink-muted">Enter the password to see the full site.</p>

    <form class="flex w-full max-w-[440px] flex-col gap-3 sm:flex-row" novalidate @submit.prevent="unlock">
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        aria-label="Password"
        autocomplete="current-password"
        required
        class="min-w-0 flex-1 rounded-full border border-ink/20 bg-ivory/70 px-6 py-[13px] text-ink placeholder:text-ink-faint focus:border-sage-deep focus:outline-none"
      >
      <button type="submit" class="btn btn-solid">View Site</button>
    </form>
    <p v-if="error" class="mt-4 text-sm text-ink-soft" role="alert">{{ error }}</p>
  </main>
</template>
