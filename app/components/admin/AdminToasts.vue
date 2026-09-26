<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { dismissToast, editor } from '~/admin/editor'
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-3" aria-live="polite">
    <TransitionGroup
      enter-from-class="translate-y-3 opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
    >
      <div
        v-for="toast in editor.toasts"
        :key="toast.id"
        class="pointer-events-auto flex max-w-xl items-center gap-3 rounded-xl px-4 py-3 text-[0.93rem] shadow-lift ring-1"
        :class="toast.tone === 'error' ? 'bg-[#FBEAE6] text-[#7A2A1D] ring-[#A23B2A]/20' : toast.tone === 'success' ? 'bg-sage-mist text-ink ring-sage/30' : 'bg-white text-ink ring-ink/10'"
      >
        <p class="flex-1">{{ toast.message }}</p>
        <button v-if="toast.action" type="button" class="shrink-0 font-medium underline underline-offset-4" @click="toast.action.run(); dismissToast(toast.id)">{{ toast.action.label }}</button>
        <button type="button" class="-mr-1 shrink-0 rounded-full p-1 opacity-60 hover:opacity-100" title="Dismiss" @click="dismissToast(toast.id)"><X class="h-4 w-4" /><span class="sr-only">Dismiss</span></button>
      </div>
    </TransitionGroup>
  </div>
</template>
