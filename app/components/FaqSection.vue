<script setup lang="ts">
const faq = useContent('faq')

// `only` embeds one group (e.g. "rentals") on its service page; without it, every group is listed.
const props = defineProps<{ only?: string }>()
const groups = computed(() => props.only ? faq.groups.filter(group => group.id === props.only) : faq.groups)
</script>

<template>
  <section :id="only ? `${only}-faq` : 'faq'" class="bg-ivory px-6" :class="only ? 'py-24 md:py-28' : 'pb-24 pt-6 md:pb-28'">
    <SectionIntro v-if="only && groups[0]" :eyebrow="faq.eyebrow" :title="groups[0].heading" />
    <div class="mx-auto grid max-w-[780px] gap-12" :class="{ 'mt-12': only }">
      <div v-for="group in groups" :key="group.id" v-reveal>
        <h2 v-if="!only" class="mb-2 font-sans text-[0.74rem] font-medium uppercase tracking-[0.24em] text-sage-deep">{{ group.title }}</h2>
        <div class="border-t border-ink/10">
          <details v-for="item in group.items" :key="item.q" class="group border-b border-ink/10">
            <summary class="flex cursor-pointer items-center justify-between gap-6 py-5 font-serif text-[1.25rem] leading-snug text-ink">
              {{ item.q }}
              <span class="flex-none font-sans text-2xl font-light leading-none text-sage transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="pb-6 pr-10 text-ink-soft">{{ item.a }}</p>
          </details>
        </div>
      </div>
    </div>
    <p v-if="only" v-reveal class="mt-10 text-center">
      <NuxtLink to="/faq" class="link-caps">{{ faq.allCta }}</NuxtLink>
    </p>
  </section>
</template>
