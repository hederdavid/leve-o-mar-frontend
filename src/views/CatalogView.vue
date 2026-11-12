<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import type { Product, ProductFilterParams } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import FilterSidebar from '@/components/catalog/FilterSidebar.vue'
import BottleVisual from '@/components/common/BottleVisual.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { Plus, ArrowUpDown, Heart, ChevronRight, Home } from 'lucide-vue-next'

const isSearchOpen = ref(false)
const isLoading = ref(true)
const products = ref<Product[]>([])
const total = ref(0)
const sortBy = ref<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
const currentParams = ref<ProductFilterParams>({})

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

async function loadProducts() {
  isLoading.value = true
  try {
    const res = await productService.getAll({
      ...currentParams.value,
      sortBy: sortBy.value
    })
    products.value = res.products
    total.value = res.total
  } finally {
    isLoading.value = false
  }
}

function handleFilterChange(params: ProductFilterParams) {
  currentParams.value = params
  loadProducts()
}

function handleSortChange() {
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main id="main-content" class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs font-semibold text-[#5A738E] mb-6">
        <router-link to="/" class="hover:text-[#0A2B42] flex items-center gap-1">
          <Home :size="13" />
          <span>Início</span>
        </router-link>
        <ChevronRight :size="12" />
        <span class="text-[#0A2B42] font-bold">Coleção Completa</span>
        <template v-if="currentParams.region">
          <ChevronRight :size="12" />
          <span class="text-[#E86A58] font-bold">Região {{ currentParams.region }}</span>
        </template>
      </nav>
      
      <!-- Cabeçalho do Catálogo -->
      <div class="mb-10 text-center max-w-2xl mx-auto">
        <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
          Coleção Completa
        </span>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42]">
          Destinos & Águas do Brasil
        </h1>
        <p class="text-xs sm:text-sm text-[#5A738E] mt-2">
          Explore todas as garrafas artesanais colecionáveis com as águas cristalinas do nosso litoral.
        </p>
      </div>

      <!-- Layout 2 Colunas: Filtros + Grid de Produtos -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar de Filtros -->
        <div class="lg:col-span-4 xl:col-span-3">
          <FilterSidebar @filter-change="handleFilterChange" />
        </div>

        <!-- Grid de Produtos e Ordenação -->
        <div class="lg:col-span-8 xl:col-span-9 space-y-6">
          
          <!-- Barra Superior de Resultados e Ordenação -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E6E1D6] shadow-sm">
            <span class="text-xs font-bold text-[#0A2B42]">
              Exibindo <strong>{{ total }}</strong> {{ total === 1 ? 'garrafa encontrada' : 'garrafas encontradas' }}
            </span>

            <div class="flex items-center gap-2 text-xs">
              <ArrowUpDown :size="14" class="text-[#5A738E]" />
              <span class="text-[#5A738E] font-medium">Ordenar por:</span>
              <select
                v-model="sortBy"
                class="px-3 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#D6CFC0] text-[#0A2B42] font-semibold text-xs focus:outline-none"
                @change="handleSortChange"
              >
                <option value="popular">Mais Populares</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhores Avaliações</option>
              </select>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="py-20 text-center space-y-3">
            <div class="w-10 h-10 border-3 border-[#0B3C5D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p class="text-xs text-[#5A738E]">Buscando destinos no litoral...</p>
          </div>

          <!-- Estado Vazio -->
          <div v-else-if="products.length === 0" class="py-20 text-center card-maritimo p-8 space-y-3">
            <p class="font-serif-editorial text-xl font-bold text-[#0A2B42]">Nenhuma garrafa encontrada</p>
            <p class="text-xs text-[#5A738E]">Tente ajustar os filtros na barra lateral para encontrar outras praias.</p>
          </div>

          <!-- Grid de Garrafas -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="product in products"
              :key="product.id"
              class="card-maritimo flex flex-col justify-between p-5 relative overflow-hidden group"
            >
              <button
                type="button"
                :aria-label="wishlistStore.isInWishlist(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                class="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                :class="wishlistStore.isInWishlist(product.id) ? 'text-[#E86A58]' : 'text-[#8A9BA8] hover:text-[#0A2B42]'"
                @click.stop="wishlistStore.toggleWishlist(product)"
              >
                <Heart :size="16" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" />
              </button>

              <div
                v-if="product.isLimitedEdition"
                class="absolute top-4 right-4 z-20 px-2.5 py-0.5 rounded-full bg-[#E86A58] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm"
              >
                Edição Limitada
              </div>

              <!-- Imagem da Garrafa -->
              <router-link :to="`/produto/${product.slug}`" class="py-6 flex justify-center items-center cursor-pointer">
                <BottleVisual
                  :image-url="product.bottleImage"
                  :beach-name="product.beachName"
                  :tag="product.highlightTag"
                  height-class="h-52"
                />
              </router-link>

              <!-- Detalhes do Produto -->
              <div class="pt-4 border-t border-[#F0EDE4] flex flex-col justify-between flex-grow">
                <div>
                  <span class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase block">
                    {{ product.categoryTag }}
                  </span>
                  <router-link :to="`/produto/${product.slug}`">
                    <h3 class="font-serif-editorial text-lg font-bold text-[#0A2B42] mt-0.5 group-hover:text-[#0B3C5D] transition-colors">
                      {{ product.beachName }}
                    </h3>
                  </router-link>
                  <span class="text-xs text-[#5A738E] block">
                    {{ product.city }}, {{ product.uf }}
                  </span>
                </div>

                <div class="flex items-center justify-between mt-4 pt-2 border-t border-[#F0EDE4]/60">
                  <div>
                    <span class="text-[9px] font-semibold text-[#5A738E] uppercase block">A partir de</span>
                    <span class="font-serif-editorial text-base font-bold text-[#0A2B42]">
                      R$ {{ product.price.toFixed(2).replace('.', ',') }}
                    </span>
                  </div>

                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-semibold shadow transition-all active:scale-95"
                    @click="cartStore.addItem(product)"
                  >
                    <Plus :size="13" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
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
