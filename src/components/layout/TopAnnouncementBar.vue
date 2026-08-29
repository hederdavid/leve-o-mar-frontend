<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Sparkles, Truck, CreditCard, ShieldCheck } from 'lucide-vue-next'

const announcements = [
  {
    id: 1,
    icon: Truck,
    text: 'Frete Grátis acima de R$ 79,90',
    link: '/colecao',
    highlight: 'Aproveite'
  },
  {
    id: 2,
    icon: Sparkles,
    text: 'Ganhe 10% OFF com o cupom MAR10',
    link: '/colecao',
    highlight: 'Copiar'
  },
  {
    id: 3,
    icon: CreditCard,
    text: 'Até 6x sem juros ou 5% no Pix',
    link: '/personalizar',
    highlight: 'Personalizar'
  },
  {
    id: 4,
    icon: ShieldCheck,
    text: 'Garantia de Chegada Segura do Vidro',
    link: '/sobre',
    highlight: 'Saiba Mais'
  }
]

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function next() {
  currentIndex.value = (currentIndex.value + 1) % announcements.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + announcements.length) % announcements.length
}

function startTimer() {
  timer = setInterval(next, 4000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <div
    class="bg-[#0B3C5D] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-4 select-none relative z-50 border-b border-white/10"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Seta Esquerda (Touch Target mínimo 44x44px no mobile) -->
      <button
        type="button"
        aria-label="Anúncio anterior"
        class="w-10 h-10 sm:w-8 sm:h-8 hover:bg-white/15 rounded-full transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
        @click="prev"
      >
        <ChevronLeft :size="16" />
      </button>

      <!-- Conteúdo do Anúncio Animado -->
      <div class="flex-1 flex items-center justify-center text-center overflow-hidden px-2">
        <router-link
          :to="announcements[currentIndex]?.link || '/colecao'"
          class="inline-flex items-center gap-1.5 sm:gap-2 group hover:underline font-medium transition-all max-w-full"
        >
          <component :is="announcements[currentIndex]?.icon" :size="14" class="text-[#F59E0B] flex-shrink-0" />
          <span class="truncate">{{ announcements[currentIndex]?.text }}</span>
          <span class="text-[#F59E0B] font-bold underline text-[10px] sm:text-[11px] group-hover:text-white transition-colors flex-shrink-0 ml-1">
            {{ announcements[currentIndex]?.highlight }} &rarr;
          </span>
        </router-link>
      </div>

      <!-- Seta Direita (Touch Target mínimo 44x44px no mobile) -->
      <button
        type="button"
        aria-label="Próximo anúncio"
        class="w-10 h-10 sm:w-8 sm:h-8 hover:bg-white/15 rounded-full transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
        @click="next"
      >
        <ChevronRight :size="16" />
      </button>

    </div>
  </div>
</template>
