<script setup lang="ts">
const links = useContent('nav')

const route = useRoute()
const scrolled = ref(false)
const open = ref(false)

// Links to a section (#packages) never show as the current page.
function isCurrent(to: string) {
  return !to.includes('#') && (route.path.replace(/\/$/, '') || '/') === to
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

watch(() => route.fullPath, () => { open.value = false })
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav
    class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-[18px] transition-[background-color,box-shadow] duration-300 sm:px-7"
    :class="scrolled || open ? 'bg-ivory/95 shadow-nav backdrop-blur' : ''"
  >
    <NuxtLink to="/" class="font-serif text-[1.35rem] tracking-[0.06em] text-ink">
      <b class="font-semibold">ABailey</b> Events <RoseMark class="inline-block h-[1.1em] w-[1.1em] align-[-0.16em] text-sage" :weight="1.4" />
    </NuxtLink>
    <button class="text-2xl text-ink lg:hidden" aria-label="Menu" :aria-expanded="open" @click="open = !open">☰</button>
    <ul
      class="absolute inset-x-0 top-full flex-col gap-5 bg-ivory p-6 shadow-menu lg:static lg:flex lg:flex-row lg:items-center lg:gap-5 lg:bg-transparent lg:p-0 lg:shadow-none xl:gap-[30px]"
      :class="open ? 'flex' : 'hidden'"
    >
      <li class="lg:hidden">
        <NuxtLink to="/" class="text-[0.78rem] uppercase tracking-[0.18em] text-ink">Home</NuxtLink>
      </li>
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="border-b pb-[3px] text-[0.78rem] uppercase tracking-[0.18em] text-ink transition-colors hover:border-sage lg:tracking-[0.14em] xl:tracking-[0.18em]"
          :class="isCurrent(link.to) ? 'border-sage' : 'border-transparent'"
          :aria-current="isCurrent(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/contact"
          class="inline-block rounded-full border border-ink px-5 py-[9px] text-[0.78rem] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-ivory lg:tracking-[0.14em] xl:tracking-[0.18em]"
          :class="isCurrent('/contact') ? 'bg-ink text-ivory' : 'text-ink'"
        >
          Contact
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
