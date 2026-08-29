<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { beachService } from '@/services/beachService'
import { productService } from '@/services/productService'
import type { Beach } from '@/types/beach'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import BeachMapLeaflet from '@/components/map/BeachMapLeaflet.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { Compass, Droplet, Sparkles, ShoppingBag, ArrowRight } from 'lucide-vue-next'

const isSearchOpen = ref(false)
const isLoading = ref(true)
const beaches = ref<Beach[]>([])
const products = ref<Product[]>([])
const selectedBeach = ref<Beach | null>(null)

const cartStore = useCartStore()

async function loadData() {
  isLoading.value = true
  try {
    const [beachesData, productsData] = await Promise.all([
      beachService.getAll(),
      productService.getAll()
    ])
    beaches.value = beachesData
    products.value = productsData.products
    selectedBeach.value = beachesData[0] || null
  } catch (err) {
    console.error('Erro ao carregar mapa de praias:', err)
  } finally {
    isLoading.value = false
  }
}

function handleSelectBeach(beach: Beach) {
  selectedBeach.value = beach
}

function getSelectedProduct(): Product | undefined {
  if (!selectedBeach.value) return undefined
  return products.value.find((p) => p.beachId === selectedBeach.value?.id)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      
      <!-- Cabeçalho da Página do Mapa -->
      <div class="mb-8 text-center max-w-2xl mx-auto">
        <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
          Navegação Geográfica
        </span>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42]">
          Mapa das Águas Brasileiras
        </h1>
        <p class="text-xs sm:text-sm text-[#5A738E] mt-1.5">
          Explore o litoral brasileiro e descubra a tonalidade, história e garrafa de cada praia.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 text-center space-y-3">
        <div class="w-10 h-10 border-3 border-[#0B3C5D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-xs text-[#5A738E]">Carregando coordenadas e marés do litoral...</p>
      </div>

      <!-- Grid 2 Colunas: Mapa + Diário de Bordo -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Coluna Esquerda: Mapa Interativo Leaflet -->
        <div class="lg:col-span-8">
          <BeachMapLeaflet
            :beaches="beaches"
            :products="products"
            :selected-beach-id="selectedBeach?.id"
            height-class="h-[600px]"
            @select-beach="handleSelectBeach"
          />
        </div>

        <!-- Coluna Direita: Diário de Bordo da Praia Selecionada -->
        <div v-if="selectedBeach" class="lg:col-span-4 space-y-4">
          <div class="card-maritimo p-6 bg-white space-y-5">
            
            <!-- Foto da Praia Selecionada -->
            <div class="relative aspect-video rounded-2xl overflow-hidden border border-[#E6E1D6] shadow-sm">
              <img
                :src="selectedBeach.coverImage"
                :alt="selectedBeach.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 left-3 bg-[#0B3C5D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow">
                {{ selectedBeach.waterType }}
              </div>
            </div>

            <!-- Dados da Praia -->
            <div>
              <div class="flex items-center gap-1 text-xs text-[#D97706] font-mono">
                <Compass :size="13" />
                <span>{{ selectedBeach.coordinates.lat.toFixed(4) }}°, {{ selectedBeach.coordinates.lng.toFixed(4) }}°</span>
              </div>
              <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42] mt-0.5">
                {{ selectedBeach.name }}
              </h3>
              <p class="text-xs text-[#5A738E] font-medium">
                {{ selectedBeach.city }}, {{ selectedBeach.uf }} · Região {{ selectedBeach.region }}
              </p>
            </div>

            <p class="text-xs text-[#5A738E] leading-relaxed">
              {{ selectedBeach.description }}
            </p>

            <!-- Card da Garrafa Correspondente -->
            <div v-if="getSelectedProduct()" class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE] flex items-center justify-between gap-3">
              <img
                :src="getSelectedProduct()?.bottleImage"
                :alt="getSelectedProduct()?.name"
                class="w-14 h-14 object-cover rounded-xl border border-[#D6CFC0]"
              />
              <div class="flex-1 min-w-0">
                <span class="text-[9px] font-bold text-[#E86A58] uppercase block">Garrafa Preservada</span>
                <div class="font-serif-editorial text-xs font-bold text-[#0A2B42] truncate">
                  {{ getSelectedProduct()?.name }}
                </div>
                <div class="text-xs font-bold text-[#0B3C5D]">
                  R$ {{ getSelectedProduct()?.price.toFixed(2).replace('.', ',') }}
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="space-y-2 pt-2">
              <button
                v-if="getSelectedProduct()"
                type="button"
                class="w-full py-3 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-xs rounded-full shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                @click="cartStore.addItem(getSelectedProduct()!)"
              >
                <ShoppingBag :size="15" />
                <span>Adicionar ao Carrinho</span>
              </button>

              <router-link
                v-if="getSelectedProduct()"
                :to="`/produto/${getSelectedProduct()?.slug}`"
                class="w-full py-2.5 bg-white hover:bg-[#FAF8F5] text-[#0A2B42] font-semibold text-xs rounded-full border border-[#D6CFC0] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Ver Detalhes & Avaliações</span>
                <ArrowRight :size="14" />
              </router-link>
            </div>

          </div>
        </div>

      </div>

    </main>

    <FooterNavigation />
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
