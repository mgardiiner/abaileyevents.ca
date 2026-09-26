<script setup lang="ts">
const contact = useContent('contact')
const hero = useContent('hero')
const links = useContent('nav')

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-sage-deep px-6 pb-9 pt-16 text-[0.9rem] text-ivory/85">
    <div class="mx-auto grid max-w-wrap gap-12 text-center md:grid-cols-[1.5fr_1fr_1.2fr] md:gap-10 md:text-left">
      <div>
        <NuxtLink to="/" class="font-serif text-[1.7rem] tracking-[0.06em] text-ivory"><b class="font-semibold">ABailey</b> Events <span class="text-beige">❀</span></NuxtLink>
        <p class="mt-1 font-script text-[1.45rem] leading-snug text-beige [text-wrap:balance]">{{ hero.tagline }}</p>
        <p class="mx-auto mt-4 max-w-[34ch] text-[0.85rem] md:mx-0">WPIC Certified wedding planner &amp; coordinator, based in {{ contact.location }} and serving {{ contact.serviceArea }}.</p>
      </div>
      <nav aria-label="Footer">
        <p class="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-beige">Explore</p>
        <ul class="mx-auto grid w-fit grid-cols-2 gap-x-10 gap-y-2 text-left md:mx-0 md:w-auto md:grid-cols-1">
          <li><NuxtLink to="/" class="hover:text-ivory">Home</NuxtLink></li>
          <li v-for="link in links" :key="link.to"><NuxtLink :to="link.to" class="hover:text-ivory">{{ link.label }}</NuxtLink></li>
        </ul>
      </nav>
      <div>
        <p class="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-beige">Get in touch</p>
        <ul class="grid gap-2">
          <li><a :href="`mailto:${contact.email}`" class="hover:text-ivory">{{ contact.email }}</a></li>
          <li><a :href="contact.instagramUrl" target="_blank" rel="noopener" class="hover:text-ivory">@{{ contact.instagram }} on Instagram</a></li>
          <li>Serving {{ contact.serviceArea }}</li>
        </ul>
        <NuxtLink to="/contact" class="btn btn-ghost-light mt-7">{{ contact.band.cta }}</NuxtLink>
      </div>
    </div>
    <p class="mx-auto mt-14 max-w-wrap border-t border-ivory/20 pt-6 text-center text-[0.72rem] tracking-[0.08em] text-ivory/80">© {{ year }} ABailey Events · {{ contact.location }}</p>
  </footer>
</template>
