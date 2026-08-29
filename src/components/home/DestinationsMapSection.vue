<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { beachService } from '@/services/beachService'
import { productService } from '@/services/productService'
import type { Beach } from '@/types/beach'
import type { Product } from '@/types/product'
import BeachMapLeaflet from '@/components/map/BeachMapLeaflet.vue'
import { ArrowRight, Compass } from 'lucide-vue-next'

const beaches = ref<Beach[]>([])
const products = ref<Product[]>([])
const selectedBeachId = ref<string | null>(null)

async function loadMapData() {
  try {
    const [beachesData, productsData] = await Promise.all([
      beachService.getAll(),
      productService.getAll()
    ])
    beaches.value = beachesData
    products.value = productsData.products
    selectedBeachId.value = beachesData[0]?.id || null
  } catch (e) {
    console.error('Erro ao carregar dados do mapa na Home:', e)
  }
}

function handleSelectBeach(beach: Beach) {
  selectedBeachId.value = beach.id
}

onMounted(() => {
  loadMapData()
})
</script>

<template>
  <section id="mapa" class="py-16 lg:py-24 bg-[#F7F4EE] border-b border-[#E6E1D6]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Coluna Esquerda: Texto Editorial & Destinos Selecionáveis -->
        <div class="lg:col-span-5 space-y-6">
          <div class="flex items-center gap-2">
            <span class="w-8 h-[2px] bg-[#E86A58]" />
            <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase">
              Mapa das Águas Brasileiras
            </span>
          </div>

          <h2 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42] leading-tight">
            Explore 48 praias <br />
            <span class="italic font-normal">e suas águas preservadas</span>
          </h2>

          <p class="text-sm sm:text-base text-[#5A738E] leading-relaxed">
            Do turquesa cristalino dos recifes de Noronha ao esmeralda dos rios do Tapajós. Clique nas praias para ver a garrafa de cada mar.
          </p>

          <!-- Lista de Destinos Rápidos -->
          <div class="space-y-2 pt-2 max-h-56 overflow-y-auto pr-1">
            <button
              v-for="b in beaches"
              :key="b.id"
              type="button"
              :class="[
                'w-full text-left px-4 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer',
                selectedBeachId === b.id
                  ? 'bg-[#0B3C5D] text-white shadow-md scale-[1.01]'
                  : 'bg-white hover:bg-[#F0EDE4] text-[#0A2B42] border border-[#E6E1D6]'
              ]"
              @click="selectedBeachId = b.id"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: selectedBeachId === b.id ? '#F59E0B' : '#05BFDB' }"
                />
                <span class="text-xs sm:text-sm font-bold truncate">{{ b.name }}</span>
              </div>
              <span
                :class="[
                  'text-[10px] uppercase font-mono flex-shrink-0',
                  selectedBeachId === b.id ? 'text-white/80' : 'text-[#5A738E]'
                ]"
              >
                {{ b.uf }} · {{ b.waterType }}
              </span>
            </button>
          </div>

          <div class="pt-4">
            <router-link
              to="/mapa"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow-lg transition-all hover:scale-105"
            >
              <span>Abrir Expedição em Tela Cheia</span>
              <ArrowRight :size="15" />
            </router-link>
          </div>
        </div>

        <!-- Coluna Direita: Mapa Interativo Leaflet -->
        <div class="lg:col-span-7">
          <BeachMapLeaflet
            v-if="beaches.length > 0"
            :beaches="beaches"
            :products="products"
            :selected-beach-id="selectedBeachId"
            height-class="h-[480px]"
            @select-beach="handleSelectBeach"
          />
        </div>

      </div>
    </div>
  </section>
</template>
