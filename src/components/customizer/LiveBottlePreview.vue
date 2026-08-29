<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import { Sparkles, Compass, Droplet } from 'lucide-vue-next'

interface Props {
  product: Product
  recipientName: string
  customMessage: string
  fontStyle: 'serif' | 'cursive' | 'sans'
  glassType: 'lapidado' | 'fosco' | 'ambar'
}

const props = withDefaults(defineProps<Props>(), {
  recipientName: '',
  customMessage: '',
  fontStyle: 'cursive',
  glassType: 'lapidado'
})

// Estilo de fonte para a caligrafia do rótulo
const fontClass = computed(() => {
  if (props.fontStyle === 'cursive') return 'font-serif italic'
  if (props.fontStyle === 'serif') return 'font-serif-editorial'
  return 'font-sans tracking-wide'
})

// Efeito de acabamento do vidro
const glassOverlay = computed(() => {
  if (props.glassType === 'fosco') return 'backdrop-blur-[2px] bg-white/20'
  if (props.glassType === 'ambar') return 'bg-amber-900/25 mix-blend-color-burn'
  return 'bg-white/10'
})
</script>

<template>
  <div class="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] mx-auto flex items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-white via-[#F7F4EE]/60 to-[#EDE7DA] border border-[#E6E1D6] shadow-2xl overflow-hidden select-none">
    
    <!-- Reflexos de Luz do Sol e Água -->
    <div class="absolute -top-20 -left-20 w-64 h-64 bg-[#05BFDB]/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

    <!-- Container da Garrafa e Rótulo -->
    <div class="relative w-56 sm:w-64 h-[85%] flex flex-col items-center justify-end">
      
      <!-- Rolha de Cortiça Natural com Selo de Cera -->
      <div class="relative z-20 flex flex-col items-center">
        <!-- Selo de Cera Marítima -->
        <div class="w-7 h-7 rounded-full bg-[#0B3C5D] border-2 border-[#D97706] shadow-md flex items-center justify-center -mb-2 z-30">
          <Sparkles :size="12" class="text-[#F59E0B]" />
        </div>
        <!-- Rolha em Cortiça -->
        <div class="w-12 sm:w-14 h-9 bg-gradient-to-r from-[#8B5A2B] via-[#C49A6C] to-[#8B5A2B] rounded-t-lg shadow-inner border border-[#6F441F]/40" />
      </div>

      <!-- Gargalo da Garrafa -->
      <div class="w-16 sm:w-18 h-12 bg-white/30 border-x-2 border-white/60 backdrop-blur-sm relative z-10" />

      <!-- Corpo Principal da Garrafa com Água do Mar -->
      <div class="relative w-full h-[76%] rounded-b-[40px] rounded-t-2xl overflow-hidden border-2 border-white/80 shadow-2xl flex flex-col justify-end">
        
        <!-- Imagem Real da Água do Destino no Interior -->
        <img
          :src="product.bottleImage"
          :alt="product.beachName"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter contrast-105"
        />

        <!-- Camada de Vidro (Lapidado / Fosco / Âmbar) -->
        <div :class="['absolute inset-0 pointer-events-none transition-all duration-500', glassOverlay]" />

        <!-- Reflexo Especular de Vidro -->
        <div class="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-black/10 pointer-events-none" />

        <!-- RÓTULO EM PAPEL ALGODÃO COM CALIGRAFIA AO VIVO -->
        <div class="relative z-30 mx-4 sm:mx-5 mb-8 p-3.5 sm:p-4 bg-[#FBF9F5] border border-[#D6CFC0] rounded-xl shadow-lg text-center space-y-1.5 transition-all">
          
          <!-- Cabeçalho do Rótulo -->
          <div class="flex items-center justify-between border-b border-[#E6E1D6] pb-1">
            <span class="text-[7px] font-bold tracking-[0.2em] text-[#0B3C5D] uppercase">Leve o Mar</span>
            <span class="text-[7px] font-mono text-[#5A738E]">LOTE #{{ product.editionNumber }}</span>
          </div>

          <!-- Nome do Destino -->
          <div>
            <h4 class="font-serif-editorial text-sm sm:text-base font-bold text-[#0A2B42] leading-tight">
              {{ product.beachName }}
            </h4>
            <div class="flex items-center justify-center gap-1 text-[8px] text-[#5A738E] font-mono mt-0.5">
              <Compass :size="9" class="text-[#D97706]" />
              <span>{{ product.coordinates.lat.toFixed(2) }}°, {{ product.coordinates.lng.toFixed(2) }}°</span>
            </div>
          </div>

          <!-- CALIGRAFIA PERSONALIZADA DO CLIENTE EM TEMPO REAL -->
          <div class="py-1.5 px-1 bg-white/70 rounded border border-[#EBE7DE] min-h-[44px] flex flex-col justify-center">
            <span v-if="recipientName" class="text-[9px] font-bold text-[#0B3C5D] block truncate">
              {{ recipientName }}
            </span>
            <p
              :class="[
                'text-[10px] text-[#0A2B42] leading-snug line-clamp-2',
                fontClass
              ]"
            >
              {{ customMessage || '“Que a luz e a energia deste mar tragam calmaria ao seu coração.”' }}
            </p>
          </div>

          <!-- Rodapé do Rótulo -->
          <div class="flex items-center justify-between pt-1 border-t border-[#E6E1D6] text-[7px] text-[#5A738E]">
            <span class="flex items-center gap-0.5">
              <Droplet :size="8" class="text-[#05BFDB]" />
              <span>Água Preservada</span>
            </span>
            <span class="font-semibold">{{ product.volume }}</span>
          </div>

        </div>

      </div>

    </div>

    <!-- Badge Flutuante de Customização Ativa -->
    <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#E6E1D6] text-[10px] font-bold text-[#0B3C5D] shadow-sm flex items-center gap-1">
      <Sparkles :size="12" class="text-[#E86A58]" />
      <span>Pré-visualização em Tempo Real</span>
    </div>

  </div>
</template>
