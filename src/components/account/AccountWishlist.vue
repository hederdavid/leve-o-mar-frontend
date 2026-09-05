<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { mockProducts } from '@/mocks/products'
import { RouterLink } from 'vue-router'
import {
  Heart,
  ShoppingBag,
  Trash2,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-vue-next'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

function formatPrice(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function handleAddToCart(productId: string) {
  const prod = mockProducts.find((p) => p.id === productId)
  if (prod) {
    cartStore.addItem(prod)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-[#E6E1D6] pb-4">
      <h1 class="text-2xl font-serif font-bold text-[#0A2B42]">Praias Desejadas</h1>
      <p class="text-xs text-[#5A738E] mt-1">
        Águas marinhas que você salvou para suas próximas expedições ({{ wishlistStore.count }} itens).
      </p>
    </div>

    <div v-if="wishlistStore.items.length === 0" class="p-12 text-center bg-white rounded-3xl border border-[#E6E1D6]">
      <div class="w-12 h-12 rounded-full bg-[#EAE5D9] flex items-center justify-center mx-auto mb-3 text-[#5A738E]">
        <Heart :size="24" />
      </div>
      <h3 class="text-base font-serif font-bold text-[#0A2B42]">Sua lista de desejos está vazia</h3>
      <p class="text-xs text-[#5A738E] mt-1 mb-6">
        Explore nosso catálogo de praias e clique no ícone de coração para guardar suas garrafas favoritas.
      </p>
      <RouterLink
        to="/colecao"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors"
      >
        <span>Explorar Catálogo</span>
        <ArrowRight :size="14" />
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in wishlistStore.items"
        :key="item.productId"
        class="bg-white border border-[#E6E1D6] rounded-3xl p-5 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div class="relative w-full h-48 rounded-2xl overflow-hidden bg-[#F7F4EE] border border-[#E6E1D6] mb-4">
            <img
              :src="item.imageUrl"
              :alt="item.beachName"
              class="w-full h-full object-cover"
            />
            <button
              type="button"
              aria-label="Remover dos favoritos"
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#E86A58] hover:bg-white flex items-center justify-center shadow-sm cursor-pointer transition-transform active:scale-90"
              @click="wishlistStore.removeFromWishlist(item.productId)"
            >
              <Trash2 :size="15" />
            </button>
          </div>

          <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E86A58]">
            <MapPin :size="12" />
            <span>{{ item.beachName }} · {{ item.state }}</span>
          </div>

          <h3 class="text-base font-bold text-[#0A2B42] mt-1">
            Garrafa Colecionável {{ item.beachName }}
          </h3>

          <p class="text-xs text-[#5A738E] mt-1">{{ item.waterTone }}</p>
        </div>

        <div class="pt-4 mt-4 border-t border-[#F0EDE4] flex items-center justify-between gap-2">
          <span class="text-sm font-bold text-[#0A2B42]">{{ formatPrice(item.price) }}</span>

          <div class="flex items-center gap-2">
            <RouterLink
              :to="`/produto/${item.productSlug}`"
              class="px-3 py-2 rounded-xl text-xs font-semibold text-[#0A2B42] hover:bg-[#F7F4EE] transition-colors"
            >
              Detalhes
            </RouterLink>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl bg-[#0A2B42] text-white hover:bg-[#144272] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              @click="handleAddToCart(item.productId)"
            >
              <ShoppingBag :size="14" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
