<script setup lang="ts">
const links = [
  { href: '#services', label: 'Services' },
  { href: '#packages', label: 'Packages' },
  { href: '#events', label: 'Past Events' },
  { href: '#about', label: 'About' },
]

const scrolled = ref(false)
const open = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

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
    <a href="#top" class="font-serif text-[1.35rem] tracking-[0.06em] text-forest" @click="open = false">
      <b class="font-semibold">ABailey</b> Events <span class="text-blush-deep">❀</span>
    </a>
    <button class="text-2xl text-forest md:hidden" aria-label="Menu" :aria-expanded="open" @click="open = !open">☰</button>
    <ul
      class="absolute inset-x-0 top-full flex-col gap-5 bg-ivory p-6 shadow-menu md:static md:flex md:flex-row md:items-center md:gap-[30px] md:bg-transparent md:p-0 md:shadow-none"
      :class="open ? 'flex' : 'hidden'"
    >
      <li v-for="link in links" :key="link.href">
        <a :href="link.href" class="border-b border-transparent pb-[3px] text-[0.78rem] uppercase tracking-[0.18em] text-forest transition-colors hover:border-blush-deep" @click="open = false">
          {{ link.label }}
        </a>
      </li>
      <li>
        <a href="#contact" class="inline-block rounded-full border border-forest px-5 py-[9px] text-[0.78rem] uppercase tracking-[0.18em] text-forest transition-colors hover:bg-forest hover:text-ivory" @click="open = false">
          Let's Chat
        </a>
      </li>
    </ul>
  </nav>
</template>
