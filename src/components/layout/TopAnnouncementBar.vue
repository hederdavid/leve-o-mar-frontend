<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Sparkles, Truck, CreditCard, ShieldCheck } from 'lucide-vue-next'

const announcements = [
  {
    id: 1,
    icon: Truck,
    text: 'Frete Grátis para todo o Brasil em compras a partir de R$ 79,90',
    link: '/colecao',
    highlight: 'Aproveite'
  },
  {
    id: 2,
    icon: Sparkles,
    text: 'Ganhe 10% OFF na sua primeira garrafa usando o cupom MAR10',
    link: '/colecao',
    highlight: 'Copiar Cupom'
  },
  {
    id: 3,
    icon: CreditCard,
    text: 'Parcele em até 6x sem juros no cartão ou ganhe 5% no Pix',
    link: '/personalizar',
    highlight: 'Personalizar'
  },
  {
    id: 4,
    icon: ShieldCheck,
    text: 'Garantia de Chegada Segura em embalagem antiimpacto para vidro',
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
    class="bg-[#0B3C5D] text-white text-xs py-2 px-4 select-none relative z-50 border-b border-white/10"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Seta Esquerda -->
      <button
        type="button"
        aria-label="Anúncio anterior"
        class="p-1 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
        @click="prev"
      >
        <ChevronLeft :size="15" />
      </button>

      <!-- Conteúdo do Anúncio Animado -->
      <div class="flex-1 flex items-center justify-center text-center overflow-hidden px-2">
        <router-link
          :to="announcements[currentIndex]?.link || '/colecao'"
          class="inline-flex items-center gap-2 group hover:underline font-medium transition-all"
        >
          <component :is="announcements[currentIndex]?.icon" :size="14" class="text-[#F59E0B] flex-shrink-0" />
          <span class="truncate">{{ announcements[currentIndex]?.text }}</span>
          <span class="hidden sm:inline text-[#F59E0B] font-bold underline text-[11px] group-hover:text-white transition-colors">
            {{ announcements[currentIndex]?.highlight }} &rarr;
          </span>
        </router-link>
      </div>

      <!-- Seta Direita -->
      <button
        type="button"
        aria-label="Próximo anúncio"
        class="p-1 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
        @click="next"
      >
        <ChevronRight :size="15" />
      </button>

    </div>
  </div>
</template>
