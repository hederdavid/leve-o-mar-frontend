<script setup lang="ts">
import { onMounted } from 'vue'

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => void
    }
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  function initVLibras() {
    if (window.VLibras?.Widget) {
      try {
        new window.VLibras.Widget('https://vlibras.gov.br/app')
      } catch {
        // Fallback silencioso caso ocorra bloqueio de terceiros
      }
    }
  }

  if (window.VLibras?.Widget) {
    initVLibras()
    return
  }

  if (!document.getElementById('vlibras-script')) {
    const script = document.createElement('script')
    script.id = 'vlibras-script'
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.onload = () => {
      initVLibras()
    }
    script.onerror = () => {
      // Ignora falha de rede/bloqueador de anúncios
    }
    document.body.appendChild(script)
  }
})
</script>

<template>
  <!-- Widget Oficial do VLibras (Acessibilidade em Língua Brasileira de Sinais) -->
  <div vw class="enabled" aria-label="Acessibilidade em Libras">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
</template>
