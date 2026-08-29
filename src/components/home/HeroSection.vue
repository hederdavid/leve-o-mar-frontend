<script setup lang="ts">
import BottleVisual from '@/components/common/BottleVisual.vue'
import { ArrowRight, Star } from 'lucide-vue-next'

defineEmits<{
  (e: 'exploreCollection'): void
  (e: 'learnMore'): void
}>()
</script>

<template>
  <section class="relative bg-[#F7F4EE] bg-dots-pattern overflow-hidden pt-10 pb-16 lg:py-20 border-b border-[#E6E1D6]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div class="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div class="flex items-center gap-2">
            <span class="w-8 h-[2px] bg-[#E86A58]" />
            <span class="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#E86A58] uppercase">
              A jornada começa aqui · Colecionáveis de afeto
            </span>
          </div>

          <h1 class="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A2B42] leading-[1.15] tracking-tight">
            Explore e Colecione Destinos em <br class="hidden sm:inline" />
            <span class="italic font-normal">uma Garrafa</span>
          </h1>

          <p class="text-base sm:text-lg text-[#5A738E] leading-relaxed max-w-xl">
            Traga a essência, a história e a brisa das melhores praias brasileiras para dentro da sua casa. Cada garrafa carrega um lugar, uma memória, uma emoção.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <router-link
              to="/colecao"
              class="inline-flex items-center justify-center px-8 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-semibold text-sm rounded-full shadow-lg shadow-[#0B3C5D]/20 transition-all hover:scale-105 active:scale-95"
            >
              Explorar Coleção Atual
            </router-link>

            <router-link
              to="/personalizar"
              class="inline-flex items-center gap-2 text-sm font-bold text-[#E86A58] hover:text-[#0B3C5D] px-4 py-3 transition-colors group bg-white/70 rounded-full border border-[#E6E1D6] shadow-sm"
            >
              <span>Personalizar Rótulo</span>
              <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>

          <div class="grid grid-cols-3 gap-4 pt-8 border-t border-[#E6E1D6]/80 mt-4">
            <div>
              <div class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">48+</div>
              <div class="text-[10px] sm:text-xs font-semibold tracking-wider text-[#5A738E] uppercase mt-0.5">Destinos Capturados</div>
            </div>
            <div>
              <div class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">3.2k</div>
              <div class="text-[10px] sm:text-xs font-semibold tracking-wider text-[#5A738E] uppercase mt-0.5">Colecionadores</div>
            </div>
            <div>
              <div class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">100%</div>
              <div class="text-[10px] sm:text-xs font-semibold tracking-wider text-[#5A738E] uppercase mt-0.5">Feito no Brasil</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 relative flex items-center justify-center min-h-[480px]">
          <div class="absolute top-0 right-4 sm:right-8 z-30 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#EBE7DE] text-left animate-fade-in">
            <span class="text-[10px] font-bold tracking-widest text-[#E86A58] uppercase block">Novo Lançamento</span>
            <span class="font-serif-editorial text-sm font-bold text-[#0A2B42] block">Coleção Verão 2025</span>
            <span class="text-[11px] text-[#5A738E]">8 destinos · Lote limitado</span>
          </div>

          <div class="relative flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-6">
            <div class="flex flex-col items-center">
              <BottleVisual
                imageUrl="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80"
                beachName="Jericoacoara"
                heightClass="h-56 sm:h-64"
              />
              <span class="text-[11px] font-bold tracking-widest text-[#5A738E] uppercase mt-3">JERICOACOARA</span>
            </div>

            <div class="flex flex-col items-center -translate-y-4">
              <BottleVisual
                imageUrl="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80"
                beachName="Fernando de Noronha"
                heightClass="h-72 sm:h-84"
              />
              <span class="text-xs font-bold tracking-widest text-[#0A2B42] uppercase mt-3">FERNANDO DE NORONHA</span>
            </div>

            <div class="flex flex-col items-center">
              <BottleVisual
                imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                beachName="Maragogi"
                heightClass="h-56 sm:h-64"
              />
              <span class="text-[11px] font-bold tracking-widest text-[#5A738E] uppercase mt-3">MARAGOGI</span>
            </div>
          </div>

          <div class="absolute bottom-2 left-4 sm:left-12 z-30 flex items-center gap-2.5 bg-[#0B3C5D] text-white px-4 py-2 rounded-2xl shadow-xl">
            <div class="w-7 h-7 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#0A2B42]">
              <Star :size="15" class="fill-[#0A2B42]" />
            </div>
            <div>
              <div class="text-xs font-bold leading-none">4.9 / 5.0</div>
              <div class="text-[10px] text-white/80 leading-none mt-0.5">1.2k avaliações</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
