<script setup lang="ts">
function skipToMain() {
  const main = document.getElementById('main-content')
  if (main) {
    main.setAttribute('tabindex', '-1')
    main.focus()
  }
}
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2.5 focus:bg-[#0B3C5D] focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#05BFDB] text-xs font-bold transition-all"
    @click.prevent="skipToMain"
  >
    Pular para o conteúdo principal
  </a>
</template>
