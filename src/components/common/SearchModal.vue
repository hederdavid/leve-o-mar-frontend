<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { mockProducts } from '@/mocks/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { Search, X, Plus } from 'lucide-vue-next'

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

const searchResults = ref<Product[]>([])

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
      p.categoryTag.toLowerCase().includes(q)
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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col items-center pt-6 px-4 bg-[#0A2B42]/70 backdrop-blur-md animate-fade-in">
    <div class="w-full max-w-3xl bg-[#F7F4EE] rounded-2xl shadow-2xl border border-[#E6E1D6] overflow-hidden">
      <div class="flex items-center px-5 py-4 border-b border-[#E6E1D6] gap-3">
        <Search :size="20" class="text-[#5A738E] flex-shrink-0" />
        
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Buscar destinos... Maragogi, Jericoacoara, Noronha"
          class="w-full bg-transparent text-[#0A2B42] text-sm sm:text-base placeholder-[#5A738E]/70 focus:outline-none font-medium"
        />

        <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#EBE7DE] text-[#5A738E] rounded border border-[#D6CFC0]">
          ESC
        </span>

        <button
          type="button"
          class="p-1 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-4 space-y-3">
        <div v-if="searchQuery.trim() && searchResults.length === 0" class="py-8 text-center text-[#5A738E] text-xs sm:text-sm">
          Nenhum destino encontrado para "<span class="font-bold text-[#0A2B42]">{{ searchQuery }}</span>".
        </div>

        <div
          v-for="product in searchResults"
          :key="product.id"
          class="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F0EDE4] border border-[#EBE7DE] transition-colors gap-4"
        >
          <router-link
            :to="`/produto/${product.slug}`"
            class="flex items-center gap-3 flex-1 cursor-pointer"
            @click="emit('close')"
          >
            <img
              :src="product.bottleImage"
              :alt="product.beachName"
              class="w-12 h-12 object-cover rounded-lg border border-[#E6E1D6]"
            />
            <div>
              <div class="font-serif-editorial text-sm font-bold text-[#0A2B42] hover:text-[#0B3C5D]">
                {{ product.beachName }}
              </div>
              <div class="text-[11px] text-[#5A738E]">
                {{ product.categoryTag }} · {{ product.uf }}, Brasil
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
              class="p-2 rounded-full bg-[#0B3C5D] text-white hover:bg-[#0A2B42] transition-colors"
              @click="cartStore.addItem(product); emit('close')"
            >
              <Plus :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
