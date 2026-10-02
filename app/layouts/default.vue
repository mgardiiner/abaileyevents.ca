<template>
  <!-- overflow-x-clip, not hidden: hidden makes this a scroll box, which stops sticky elements sticking -->
  <div class="min-h-screen bg-ivory text-ink overflow-x-clip">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
