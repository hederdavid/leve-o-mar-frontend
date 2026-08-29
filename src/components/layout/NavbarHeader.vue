<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import TopAnnouncementBar from './TopAnnouncementBar.vue'
import {
  Search,
  User,
  ShoppingBag,
  Compass,
  Sparkles,
  MapPin,
  Menu,
  X,
  ChevronDown
} from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'openSearch'): void
}>()

const router = useRouter()
const cartStore = useCartStore()
const isMobileMenuOpen = ref(false)

const categories = [
  { name: 'Todas as Praias', path: '/colecao' },
  { name: 'Nordeste', path: '/colecao' },
  { name: 'Sudeste', path: '/colecao' },
  { name: 'Sul & Centro', path: '/colecao' },
  { name: 'Personalizar Rótulo ✨', path: '/personalizar', highlight: true },
  { name: 'Mapa de Destinos 🗺️', path: '/mapa' },
  { name: 'Nossa História', path: '/sobre' }
]
</script>

<template>
  <div class="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E6E1D6] shadow-sm transition-all">
    
    <!-- Barra Superior de Anúncios com Carrossel de Texto -->
    <TopAnnouncementBar />

    <!-- Barra Principal: Busca, Logo Central e Ações -->
    <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
      <div class="flex items-center justify-between gap-4">
        
        <!-- Lado Esquerdo: Busca e Menu Mobile -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            class="md:hidden p-2 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-xl"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <component :is="isMobileMenuOpen ? X : Menu" :size="22" />
          </button>

          <!-- Botão de Busca estilo E-commerce -->
          <button
            type="button"
            aria-label="Buscar destinos"
            class="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#D6CFC0] text-[#5A738E] hover:border-[#0B3C5D] text-xs transition-all shadow-sm w-48 lg:w-64 cursor-pointer"
            @click="emit('openSearch')"
          >
            <Search :size="15" class="text-[#0B3C5D]" />
            <span class="truncate">Buscar praia ou estado...</span>
          </button>

          <button
            type="button"
            aria-label="Buscar no mobile"
            class="sm:hidden p-2 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full"
            @click="emit('openSearch')"
          >
            <Search :size="20" />
          </button>
        </div>

        <!-- Centro: Logotipo Nobre do Leve o Mar -->
        <div class="flex flex-col items-center select-none text-center">
          <router-link to="/" class="flex flex-col items-center group">
            <span class="font-serif-editorial text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2B42] group-hover:text-[#0B3C5D] transition-colors leading-none">
              LEVE O MAR
            </span>
            <span class="text-[8px] sm:text-[9px] font-bold tracking-[0.28em] text-[#E86A58] uppercase mt-1">
              Águas do Brasil em Garrafas
            </span>
          </router-link>
        </div>

        <!-- Lado Direito: Minha Conta e Carrinho (Aventuras) -->
        <div class="flex items-center gap-3">
          <router-link
            to="/checkout"
            class="hidden sm:flex items-center gap-1.5 p-2 text-[#0A2B42] hover:text-[#E86A58] hover:bg-[#EBE7DE] rounded-full transition-all text-xs font-semibold"
          >
            <User :size="18" />
            <span class="hidden lg:inline">Minha Conta</span>
          </router-link>

          <!-- Botão Sacola / Carrinho -->
          <button
            type="button"
            aria-label="Abrir carrinho"
            class="flex items-center gap-2 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white px-4 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
            @click="cartStore.openDrawer"
          >
            <ShoppingBag :size="16" />
            <span class="hidden sm:inline">Aventuras</span>
            <span
              v-if="cartStore.totalItemsCount > 0"
              class="px-1.5 py-0.2 bg-[#E86A58] text-white text-[10px] rounded-full font-extrabold animate-pulse"
            >
              {{ cartStore.totalItemsCount }}
            </span>
          </button>
        </div>

      </div>
    </header>

    <!-- Barra de Categorias / Menu Horizontal E-commerce -->
    <nav class="hidden md:block border-t border-[#EBE7DE] bg-white/70 py-2">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-8 text-xs font-bold tracking-wider uppercase text-[#0A2B42]">
        <router-link
          v-for="cat in categories"
          :key="cat.name"
          :to="cat.path"
          :class="[
            'transition-colors py-1 hover:text-[#E86A58]',
            cat.highlight ? 'text-[#E86A58] font-extrabold' : ''
          ]"
        >
          {{ cat.name }}
        </router-link>
      </div>
    </nav>

    <!-- Menu Mobile Dropdown -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white border-t border-[#E6E1D6] p-4 space-y-3 shadow-xl animate-fade-in"
    >
      <router-link
        v-for="cat in categories"
        :key="cat.name"
        :to="cat.path"
        :class="[
          'block py-2 text-sm font-bold border-b border-[#F0EDE4]',
          cat.highlight ? 'text-[#E86A58]' : 'text-[#0A2B42]'
        ]"
        @click="isMobileMenuOpen = false"
      >
        {{ cat.name }}
      </router-link>
    </div>

  </div>
</template>
