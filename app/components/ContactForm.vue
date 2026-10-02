<script setup lang="ts">
const contact = useContent('contact')

const copy = contact.form

const form = reactive({
  intent: copy.intents[0],
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  location: '',
  services: [] as string[],
  message: '',
  // Honeypot: hidden from people, so anything typed here came from a bot.
  website: '',
})
const status = ref<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle')

// The filled-in fields, labelled for the email ABailey Events receives.
function details() {
  const rows: Record<string, string> = {
    'Request': form.intent ?? '',
    'Name': form.name,
    'Email': form.email,
    'Phone': form.phone,
    'Event type': form.eventType,
    'Event date': form.eventDate,
    'Location / venue': form.location,
    'Interested in': form.services.join(', '),
    'Message': form.message,
  }
  return Object.fromEntries(Object.entries(rows).filter(([, value]) => value))
}

async function submit() {
  if (status.value === 'sending') return
  if (form.website) {
    status.value = 'sent'
    return
  }
  const subject = [form.intent, form.eventType, form.name].filter(Boolean).join(' · ')

  // With no form service configured, open the visitor's email app with the request filled in.
  if (!copy.endpoint) {
    const body = Object.entries(details()).map(([label, value]) => `${label}: ${value}`).join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    status.value = 'mailto'
    return
  }

  status.value = 'sending'
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)
  try {
    const fields = details()
    // Form services use the lowercase email field for reply-to and validation.
    delete fields.Email
    const res = await fetch(copy.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        ...fields,
        email: form.email,
        _subject: subject,
        _replyto: form.email,
        _honey: form.website,
      }),
    })
    // Some form services return a 200 response even when the submission fails.
    const result = await res.json()
    const rejected = result?.success === false || result?.success === 'false'
      || Boolean(result?.error) || (Array.isArray(result?.errors) && result.errors.length > 0)
    status.value = res.ok && !rejected ? 'sent' : 'error'
  }
  catch {
    status.value = 'error'
  }
  finally {
    window.clearTimeout(timeout)
  }
}
</script>

<template>
  <div class="rounded-sm bg-white px-6 py-8 text-left shadow-soft sm:px-10 sm:py-10">
    <div v-if="status === 'sent'" role="status" class="py-14 text-center">
      <p class="font-script text-[2.4rem] text-sage-deep">thank you</p>
      <p class="mx-auto mt-2 max-w-[40ch] text-ink-soft">{{ copy.success }}</p>
    </div>
    <form v-else class="grid gap-6" @submit.prevent="submit">
      <fieldset>
        <legend class="field-label">{{ copy.intentLabel }}</legend>
        <div class="mt-1 flex flex-wrap gap-2">
          <label v-for="intent in copy.intents" :key="intent">
            <input v-model="form.intent" type="radio" name="intent" :value="intent" class="sr-only">
            <span class="chip">{{ intent }}</span>
          </label>
        </div>
      </fieldset>

      <div class="grid gap-5 sm:grid-cols-2">
        <label>
          <span class="field-label">Name *</span>
          <input v-model="form.name" class="field" type="text" name="name" autocomplete="name" required>
        </label>
        <label>
          <span class="field-label">Email *</span>
          <input v-model="form.email" class="field" type="email" name="email" autocomplete="email" required>
        </label>
        <label>
          <span class="field-label">Phone</span>
          <input v-model="form.phone" class="field" type="tel" name="phone" autocomplete="tel">
        </label>
        <label>
          <span class="field-label">Event date</span>
          <input v-model="form.eventDate" class="field" type="date" name="eventDate">
        </label>
        <label>
          <span class="field-label">Event type</span>
          <select v-model="form.eventType" class="field" name="eventType">
            <option value="">Choose one</option>
            <option v-for="type in copy.eventTypes" :key="type">{{ type }}</option>
          </select>
        </label>
        <label>
          <span class="field-label">Location / venue</span>
          <input v-model="form.location" class="field" type="text" name="location">
        </label>
      </div>

      <fieldset>
        <legend class="field-label">Interested in</legend>
        <div class="mt-1 flex flex-wrap gap-2">
          <label v-for="service in copy.services" :key="service">
            <input v-model="form.services" type="checkbox" name="services" :value="service" class="sr-only">
            <span class="chip">{{ service }}</span>
          </label>
        </div>
      </fieldset>

      <label>
        <span class="field-label">Tell us about your celebration *</span>
        <textarea v-model="form.message" class="field min-h-[130px]" name="message" rows="5" required />
      </label>

      <div class="hidden" aria-hidden="true">
        <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off">
      </div>

      <div>
        <button type="submit" class="btn btn-solid w-full sm:w-auto" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : copy.submit }}
        </button>
        <p v-if="status === 'mailto'" role="status" class="mt-4 text-[0.9rem] text-ink-muted">
          {{ copy.mailtoNote }} <a :href="`mailto:${contact.email}`" class="text-sage-deep underline">{{ contact.email }}</a>.
        </p>
        <p v-if="status === 'error'" role="alert" class="mt-4 text-[0.9rem] text-ink-soft">
          {{ copy.error }} <a :href="`mailto:${contact.email}`" class="text-sage-deep underline">{{ contact.email }}</a>.
        </p>
      </div>
    </form>
  </div>
</template>
