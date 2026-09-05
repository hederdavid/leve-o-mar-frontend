<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-vue-next'
import BottleVisual from '@/components/common/BottleVisual.vue'

interface HeroSlide {
  id: number
  badge: string
  tagline: string
  title: string
  highlightText: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  offerPillText: string
  imageUrl: string
  beachName: string
  bgColorClass: string
}

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: 'OFERTA DA TEMPORADA 2026',
    tagline: 'Águas Preservadas do Litoral Brasileiro',
    title: 'COMPRE 2 GARRAFAS =',
    highlightText: 'GANHE O RÓTULO PERSONALIZADO',
    description: 'Traga a pureza e a energia do oceano para a sua decoração com rótulo artesanal e coordenadas reais gravadas.',
    primaryCtaText: 'APROVEITAR AGORA',
    primaryCtaLink: '/colecao',
    secondaryCtaText: 'Personalizar Rótulo',
    secondaryCtaLink: '/personalizar',
    offerPillText: 'Válido para todas as 48 praias do Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    beachName: 'Fernando de Noronha',
    bgColorClass: 'from-[#0B3C5D]/10 via-[#F7F4EE] to-[#EDE7DA]'
  },
  {
    id: 2,
    badge: 'EDIÇÃO LIMITADA COLECIONÁVEL',
    tagline: 'Eleita a Melhor Praia do Planeta',
    title: 'BAÍA DO SANCHO',
    highlightText: 'A ÁGUA ESMERALDA NOBRE',
    description: 'Vidro lapidado com reflexo solar, rolha de cortiça impermeável e água turquesa colhida nos recifes protegidos de Noronha.',
    primaryCtaText: 'GARANTIR MEU LOTE',
    primaryCtaLink: '/produto/baia-do-sancho-pe',
    secondaryCtaText: 'Ver no Mapa',
    secondaryCtaLink: '/mapa',
    offerPillText: 'Lote numerado: Restam poucas unidades',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    beachName: 'Baía do Sancho',
    bgColorClass: 'from-[#05BFDB]/15 via-[#F7F4EE] to-[#E2E8F0]'
  },
  {
    id: 3,
    badge: 'ATELIÊ DE PRESENTES AFETIVOS',
    tagline: 'Memórias Inesquecíveis em Vidro',
    title: 'O PRESENTE PERFEITO',
    highlightText: 'CALIGRAFADO AO VIVO',
    description: 'Escolha a praia especial da sua história e grave o nome de quem você ama com dedicatória exclusiva no papel algodão.',
    primaryCtaText: 'PERSONALIZAR MEU PRESENTE',
    primaryCtaLink: '/personalizar',
    secondaryCtaText: 'Explorar Catálogo',
    secondaryCtaLink: '/colecao',
    offerPillText: 'Caligrafia de Cortesia + Certificado Incluso',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80',
    beachName: 'Maragogi',
    bgColorClass: 'from-[#E86A58]/15 via-[#F7F4EE] to-[#FDE8E4]'
  }
]

const currentSlide = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

function setSlide(idx: number) {
  currentSlide.value = idx
}

function startAutoPlay() {
  autoPlayTimer = setInterval(nextSlide, 5000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(startAutoPlay)
onUnmounted(stopAutoPlay)
</script>

<template>
  <section
    class="relative w-full overflow-hidden bg-gradient-to-r select-none border-b border-[#E6E1D6] transition-colors duration-700"
    :class="slides[currentSlide]?.bgColorClass"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      
      <!-- Slide Content Mobile-First -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[380px] sm:min-h-[440px]">
        
        <!-- Coluna Esquerda: Texto Promocional de Alto Impacto -->
        <div class="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left animate-fade-in" :key="currentSlide">
          
          <div class="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E6E1D6] shadow-sm">
            <Sparkles :size="13" class="text-[#E86A58]" />
            <span class="text-[9px] sm:text-xs font-bold tracking-widest text-[#E86A58] uppercase">
              {{ slides[currentSlide]?.badge }}
            </span>
          </div>

          <div>
            <span class="text-[11px] sm:text-sm font-semibold tracking-wider text-[#5A738E] uppercase block mb-1">
              {{ slides[currentSlide]?.tagline }}
            </span>

            <h1 class="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42] leading-tight break-words">
              {{ slides[currentSlide]?.title }}
            </h1>

            <span class="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3C5D] block mt-0.5 sm:mt-1 tracking-tight break-words">
              {{ slides[currentSlide]?.highlightText }}
            </span>
          </div>

          <p class="text-xs sm:text-base text-[#5A738E] leading-relaxed max-w-xl mx-auto lg:mx-0">
            {{ slides[currentSlide]?.description }}
          </p>

          <!-- Ações Promocionais com Touch Targets Mínimos de 44px -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
            <router-link
              :to="slides[currentSlide]?.primaryCtaLink || '/colecao'"
              class="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-[#0B3C5D]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{{ slides[currentSlide]?.primaryCtaText }}</span>
              <ArrowRight :size="16" />
            </router-link>

            <router-link
              v-if="slides[currentSlide]?.secondaryCtaLink"
              :to="slides[currentSlide]?.secondaryCtaLink || '/sobre'"
              class="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white/90 hover:bg-white text-[#0A2B42] font-semibold text-xs sm:text-sm rounded-full border border-[#D6CFC0] shadow-sm transition-all hover:scale-105 flex items-center justify-center min-h-[44px]"
            >
              {{ slides[currentSlide]?.secondaryCtaText }}
            </router-link>
          </div>

          <!-- Pílula de Garantia da Oferta -->
          <div class="pt-1">
            <div class="inline-flex items-center gap-1.5 p-2 px-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-[#EBE7DE] text-[11px] sm:text-xs font-semibold text-[#5A738E] shadow-sm">
              <Sparkles :size="13" class="text-[#D97706]" />
              <span>{{ slides[currentSlide]?.offerPillText }}</span>
            </div>
          </div>

        </div>

        <!-- Coluna Direita: Visual da Garrafa em Destaque -->
        <div class="lg:col-span-5 flex items-center justify-center relative min-h-[260px] sm:min-h-[340px]">
          
          <div class="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-white/60 blur-3xl pointer-events-none" />

          <div class="relative z-10 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-2xl transition-all duration-500 hover:scale-105">
            <BottleVisual
              :image-url="slides[currentSlide]?.imageUrl || ''"
              :beach-name="slides[currentSlide]?.beachName || 'Fernando de Noronha'"
              tag="✦ Água Preservada 2026"
              height-class="h-52 sm:h-64 md:h-72"
            />
          </div>

        </div>

      </div>

    </div>

    <!-- Setas Laterais de Navegação com 44x44px Touch Target -->
    <button
      type="button"
      aria-label="Slide anterior"
      class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#0A2B42] border border-[#E6E1D6] shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      @click="prevSlide"
    >
      <ChevronLeft :size="20" />
    </button>

    <button
      type="button"
      aria-label="Próximo slide"
      class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#0A2B42] border border-[#E6E1D6] shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      @click="nextSlide"
    >
      <ChevronRight :size="20" />
    </button>

    <!-- Indicadores de Pontos (Dots) com Área de Toque Acessível -->
    <div class="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
      <button
        v-for="(slide, idx) in slides"
        :key="slide.id"
        type="button"
        :aria-label="`Ir para o slide ${idx + 1}`"
        class="p-2 cursor-pointer flex items-center justify-center"
        @click="setSlide(idx)"
      >
        <span
          :class="[
            'h-2.5 rounded-full transition-all duration-300 block',
            currentSlide === idx ? 'w-8 bg-[#0B3C5D]' : 'w-2.5 bg-[#0B3C5D]/30 hover:bg-[#0B3C5D]/60'
          ]"
        />
      </button>
    </div>

  </section>
</template>
