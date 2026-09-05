<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { mockProducts } from '@/mocks/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { Search, X, Plus, TrendingUp, Compass, Sparkles, MapPin, ArrowRight } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const cartStore = useCartStore()

const trendingTags = [
  'Fernando de Noronha',
  'Maragogi',
  'Jericoacoara',
  'Arraial do Cabo',
  'Ilhabela',
  'Praia dos Carneiros'
]

const popularCollections = [
  'Piscinas Naturais',
  'Mar Calmo & Cristalino',
  'Edição Limitada'
]

const featuredDestinations = computed(() => {
  return mockProducts.filter((p) => p.isBestSeller).slice(0, 3)
})

const searchResults = ref<Product[]>([])

function selectTag(tag: string) {
  searchQuery.value = tag
}

watch(searchQuery, (query) => {
  const q = query.trim().toLowerCase()
  if (!q) {
    searchResults.value = []
    return
  }
  searchResults.value = mockProducts.filter(
    (p) =>
      p.beachName.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.categoryTag.toLowerCase().includes(q) ||
      p.waterType.toLowerCase().includes(q)
  )
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      setTimeout(() => searchInput.value?.focus(), 100)
    } else {
      searchQuery.value = ''
    }
  }
)

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex flex-col items-center pt-8 sm:pt-16 px-4 bg-[#0A2B42]/70 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-2xl bg-[#F7F4EE] rounded-2xl shadow-2xl border border-[#E6E1D6] overflow-hidden flex flex-col max-h-[85vh]">
        
        <!-- Campo de Pesquisa -->
        <div class="flex items-center px-5 py-4 border-b border-[#E6E1D6] gap-3 bg-white">
          <Search :size="20" class="text-[#0B3C5D] flex-shrink-0" />
          
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por praia, estado, piscinas naturais..."
            class="w-full bg-transparent text-[#0A2B42] text-sm sm:text-base placeholder-[#5A738E]/70 focus:outline-none font-medium"
          />

          <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#EBE7DE] text-[#5A738E] rounded border border-[#D6CFC0]">
            ESC
          </span>

          <button
            type="button"
            aria-label="Fechar busca"
            class="p-1.5 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-6">
          
          <!-- Estado Inicial: Destinos em Alta & Sugestões (Quando a busca está vazia) -->
          <div v-if="!searchQuery.trim()" class="space-y-6">
            
            <!-- Destinos em Alta -->
            <div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-[#0A2B42] uppercase tracking-wider mb-3">
                <TrendingUp :size="14" class="text-[#05BFDB]" />
                <span>Destinos em Alta no Litoral</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in trendingTags"
                  :key="tag"
                  type="button"
                  class="px-3 py-1.5 rounded-full bg-white hover:bg-[#0B3C5D] text-[#0A2B42] hover:text-white border border-[#D6CFC0] text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                  @click="selectTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- Coleções Costeiras -->
            <div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-[#0A2B42] uppercase tracking-wider mb-3">
                <Compass :size="14" class="text-[#D97706]" />
                <span>Coleções Sugeridas</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="col in popularCollections"
                  :key="col"
                  type="button"
                  class="px-3 py-1.5 rounded-full bg-[#EBE7DE] hover:bg-[#0B3C5D] text-[#5A738E] hover:text-white border border-[#D6CFC0] text-xs font-medium transition-all cursor-pointer active:scale-95"
                  @click="selectTag(col)"
                >
                  {{ col }}
                </button>
              </div>
            </div>

            <!-- Garrafas Mais Desejadas -->
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-[#0A2B42] uppercase tracking-wider mb-3">
                <div class="flex items-center gap-1.5">
                  <Sparkles :size="14" class="text-[#D97706]" />
                  <span>Garrafas Mais Desejadas</span>
                </div>
                <router-link
                  to="/catalogo"
                  class="text-[#0B3C5D] hover:underline text-[11px] normal-case font-bold flex items-center gap-0.5 cursor-pointer"
                  @click="emit('close')"
                >
                  <span>Ver todas</span>
                  <ArrowRight :size="12" />
                </router-link>
              </div>

              <div class="space-y-2">
                <div
                  v-for="product in featuredDestinations"
                  :key="product.id"
                  class="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F0EDE4] border border-[#E6E1D6] transition-colors gap-3"
                >
                  <router-link
                    :to="`/produto/${product.slug}`"
                    class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    @click="emit('close')"
                  >
                    <img
                      :src="product.bottleImage"
                      :alt="product.beachName"
                      class="w-12 h-12 object-cover rounded-lg border border-[#E6E1D6] flex-shrink-0"
                    />
                    <div class="min-w-0">
                      <div class="font-serif-editorial text-sm font-bold text-[#0A2B42] hover:text-[#0B3C5D] truncate">
                        {{ product.beachName }}
                      </div>
                      <div class="text-[11px] text-[#5A738E] truncate">
                        {{ product.categoryTag }} · {{ product.city }}, {{ product.uf }}
                      </div>
                    </div>
                  </router-link>

                  <div class="flex items-center gap-3 flex-shrink-0">
                    <span class="text-xs font-bold text-[#0A2B42]">
                      R$ {{ product.price.toFixed(2).replace('.', ',') }}
                    </span>
                    <button
                      type="button"
                      aria-label="Adicionar à sacola"
                      class="p-2 rounded-full bg-[#0B3C5D] text-white hover:bg-[#0A2B42] transition-colors cursor-pointer"
                      @click="cartStore.addItem(product); emit('close')"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Estado de Busca: Resultados Ativos -->
          <div v-else class="space-y-3">
            <div class="text-xs text-[#5A738E] font-medium">
              {{ searchResults.length }} {{ searchResults.length === 1 ? 'destino encontrado' : 'destinos encontrados' }} para "<span class="font-bold text-[#0A2B42]">{{ searchQuery }}</span>"
            </div>

            <!-- Nenhum resultado -->
            <div v-if="searchResults.length === 0" class="py-12 text-center space-y-3">
              <div class="w-12 h-12 bg-[#EBE7DE] text-[#5A738E] rounded-full flex items-center justify-center mx-auto">
                <MapPin :size="20" />
              </div>
              <p class="text-xs sm:text-sm text-[#5A738E] max-w-sm mx-auto">
                Não encontramos nenhuma praia com o termo "<strong class="text-[#0A2B42]">{{ searchQuery }}</strong>". Tente buscar por estado (ex: "Alagoas") ou coleções.
              </p>
              <button
                type="button"
                class="px-5 py-2.5 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold transition-all cursor-pointer"
                @click="searchQuery = ''"
              >
                Limpar Busca
              </button>
            </div>

            <!-- Lista de Resultados -->
            <div
              v-for="product in searchResults"
              :key="product.id"
              class="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F0EDE4] border border-[#E6E1D6] transition-colors gap-3"
            >
              <router-link
                :to="`/produto/${product.slug}`"
                class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                @click="emit('close')"
              >
                <img
                  :src="product.bottleImage"
                  :alt="product.beachName"
                  class="w-12 h-12 object-cover rounded-lg border border-[#E6E1D6] flex-shrink-0"
                />
                <div class="min-w-0">
                  <div class="font-serif-editorial text-sm font-bold text-[#0A2B42] hover:text-[#0B3C5D] truncate">
                    {{ product.beachName }}
                  </div>
                  <div class="text-[11px] text-[#5A738E] truncate">
                    {{ product.categoryTag }} · {{ product.city }}, {{ product.uf }}
                  </div>
                </div>
              </router-link>

              <div class="flex items-center gap-3 flex-shrink-0">
                <div class="text-right">
                  <span class="text-xs font-bold text-[#0A2B42]">
                    R$ {{ product.price.toFixed(2).replace('.', ',') }}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Adicionar garrafa à sacola"
                  class="p-2 rounded-full bg-[#0B3C5D] text-white hover:bg-[#0A2B42] transition-colors cursor-pointer active:scale-95"
                  @click="cartStore.addItem(product); emit('close')"
                >
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>
