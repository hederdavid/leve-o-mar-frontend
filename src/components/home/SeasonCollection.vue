<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockProducts } from '@/mocks/products'
import type { Product } from '@/types/product'
import BottleVisual from '@/components/common/BottleVisual.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { Plus, Heart } from 'lucide-vue-next'

const activeFilter = ref<string>('Todas as Praias')
const filters = ['Todas as Praias', 'Nordeste', 'Sul / Sudeste', 'Praias Paradisíacas', 'Lote Limitado']

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const filteredProducts = computed(() => {
  if (activeFilter.value === 'Todas as Praias') return mockProducts
  if (activeFilter.value === 'Nordeste') return mockProducts.filter((p) => p.region === 'Nordeste')
  if (activeFilter.value === 'Sul / Sudeste') return mockProducts.filter((p) => p.region === 'Sul' || p.region === 'Sudeste')
  if (activeFilter.value === 'Praias Paradisíacas') return mockProducts.filter((p) => p.waterType === 'Piscinas Naturais' || p.waterType === 'Mar Calmo & Cristalino')
  if (activeFilter.value === 'Lote Limitado') return mockProducts.filter((p) => p.isLimitedEdition)
  return mockProducts
})

function handleAddToCart(product: Product) {
  cartStore.addItem(product)
}
</script>

<template>
  <section id="colecao" class="py-16 lg:py-24 bg-[#F7F4EE] border-b border-[#E6E1D6]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
            Temporada 2025
          </span>
          <h2 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42]">
            Coleção da Temporada
          </h2>
          <p class="text-sm sm:text-base text-[#5A738E] mt-2 max-w-lg">
            Cada destino capturado com cuidado artístico e memória sensorial.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            :class="[
              'px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all',
              activeFilter === filter
                ? 'bg-[#0B3C5D] text-white shadow-md'
                : 'bg-white text-[#0A2B42] hover:bg-[#EBE7DE] border border-[#E6E1D6]'
            ]"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
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

          <!-- Visual da Garrafa com Link -->
          <router-link :to="`/produto/${product.slug}`" class="py-6 flex justify-center items-center cursor-pointer">
            <BottleVisual
              :imageUrl="product.bottleImage"
              :beachName="product.beachName"
              :tag="product.highlightTag"
              heightClass="h-52 sm:h-60"
            />
          </router-link>

          <!-- Informações e Ação do Card -->
          <div class="pt-4 border-t border-[#F0EDE4] flex flex-col justify-between flex-grow">
            <div>
              <span class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase block">
                {{ product.categoryTag }}
              </span>
              <router-link :to="`/produto/${product.slug}`">
                <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42] mt-0.5 group-hover:text-[#0B3C5D] transition-colors">
                  {{ product.beachName }}
                </h3>
              </router-link>
              <span class="text-xs text-[#5A738E] block">
                {{ product.uf }} · Brasil
              </span>
            </div>

            <div class="flex items-center justify-between mt-4 pt-2">
              <div>
                <span class="text-[9px] font-semibold tracking-wider text-[#5A738E] uppercase block">A partir de</span>
                <span class="font-serif-editorial text-base font-bold text-[#0A2B42]">
                  R$ {{ product.price.toFixed(2).replace('.', ',') }}
                </span>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-semibold tracking-wide shadow transition-all active:scale-95"
                @click="handleAddToCart(product)"
              >
                <Plus :size="14" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
