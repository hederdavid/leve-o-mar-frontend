<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import TopAnnouncementBar from './TopAnnouncementBar.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Compass,
  Package,
  LogOut,
  MapPin,
  ChevronDown
} from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'openSearch'): void
}>()

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

const isMobileMenuOpen = ref(false)
const isAuthModalOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const categories = [
  { name: 'Todas as Praias', path: '/colecao' },
  { name: 'Mapa de Destinos', path: '/mapa' },
  { name: 'Personalizar Rótulo', path: '/personalizar', highlight: true },
  { name: 'Nordeste', path: '/colecao' },
  { name: 'Sudeste', path: '/colecao' },
  { name: 'Sul & Centro', path: '/colecao' },
  { name: 'Rastrear Garrafa', path: '/rastreio' },
  { name: 'Nossa História', path: '/sobre' }
]

function handleAccountClick() {
  if (authStore.isAuthenticated) {
    isUserMenuOpen.value = !isUserMenuOpen.value
  } else {
    isAuthModalOpen.value = true
  }
}

function handleLogout() {
  authStore.logout()
  isUserMenuOpen.value = false
  router.push('/')
}

function closeUserMenuOnOutsideClick(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeUserMenuOnOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', closeUserMenuOnOutsideClick)
})
</script>

<template>
  <div class="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E6E1D6] shadow-sm transition-all">
    <TopAnnouncementBar />

    <header class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            aria-label="Abrir menu de navegação"
            class="md:hidden w-11 h-11 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <component :is="isMobileMenuOpen ? X : Menu" :size="22" />
          </button>

          <button
            type="button"
            aria-label="Buscar destinos"
            class="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[#D6CFC0] text-[#5A738E] hover:border-[#0B3C5D] text-xs transition-all shadow-sm w-44 lg:w-64 cursor-pointer min-h-[44px]"
            @click="emit('openSearch')"
          >
            <Search :size="15" class="text-[#0B3C5D]" />
            <span class="truncate">Buscar praia ou estado...</span>
          </button>

          <button
            type="button"
            aria-label="Buscar no mobile"
            class="sm:hidden w-11 h-11 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full flex items-center justify-center cursor-pointer transition-colors"
            @click="emit('openSearch')"
          >
            <Search :size="20" />
          </button>
        </div>

        <div class="flex flex-col items-center select-none text-center px-1">
          <RouterLink to="/" class="flex flex-col items-center group">
            <span class="font-serif-editorial text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A2B42] group-hover:text-[#0B3C5D] transition-colors leading-none">
              LEVE O MAR
            </span>
            <span class="text-[7px] sm:text-[9px] font-bold tracking-[0.24em] sm:tracking-[0.28em] text-[#E86A58] uppercase mt-0.5 sm:mt-1">
              Águas do Brasil em Garrafas
            </span>
          </RouterLink>
        </div>

        <div class="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <RouterLink
            to="/conta?tab=desejos"
            aria-label="Praias desejadas"
            class="relative hidden sm:flex items-center justify-center w-11 h-11 text-[#0A2B42] hover:text-[#E86A58] hover:bg-[#EBE7DE] rounded-full transition-all"
          >
            <Heart :size="18" />
            <span
              v-if="wishlistStore.count > 0"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E86A58] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
            >
              {{ wishlistStore.count }}
            </span>
          </RouterLink>

          <div ref="userMenuRef" class="relative">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full transition-all text-xs font-semibold min-h-[44px] cursor-pointer"
              @click="handleAccountClick"
            >
              <div v-if="authStore.isAuthenticated && authStore.user?.avatarUrl" class="w-7 h-7 rounded-full overflow-hidden border border-[#0A2B42]/20">
                <img :src="authStore.user.avatarUrl" :alt="authStore.user?.name || 'Colecionador'" class="w-full h-full object-cover" />
              </div>
              <User v-else :size="18" />
              <span class="hidden lg:inline max-w-[110px] truncate">
                {{ authStore.isAuthenticated ? authStore.userFirstName : 'Entrar' }}
              </span>
              <ChevronDown v-if="authStore.isAuthenticated" :size="14" class="hidden lg:inline text-[#5A738E]" />
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isUserMenuOpen && authStore.isAuthenticated"
                class="absolute right-0 mt-2 w-64 bg-white border border-[#E6E1D6] rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-[#F0EDE4] bg-[#FBF9F5]">
                  <p class="text-xs font-bold text-[#0A2B42] truncate">{{ authStore.user?.name || 'Colecionador do Mar' }}</p>
                  <p class="text-[11px] text-[#5A738E] truncate">{{ authStore.user?.email || '' }}</p>
                  <span class="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#0A2B42]">
                    {{ authStore.user?.collectorTier || 'Explorador da Areia' }}
                  </span>
                </div>

                <div class="py-1">
                  <RouterLink
                    to="/conta"
                    class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#0A2B42] hover:bg-[#F7F4EE] transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <Compass :size="15" class="text-[#05BFDB]" />
                    <span>O Farol (Visão Geral)</span>
                  </RouterLink>

                  <RouterLink
                    to="/conta?tab=pedidos"
                    class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#0A2B42] hover:bg-[#F7F4EE] transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <Package :size="15" class="text-[#0B3C5D]" />
                    <span>Minhas Garrafas & Pedidos</span>
                  </RouterLink>

                  <RouterLink
                    to="/conta?tab=passaporte"
                    class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#0A2B42] hover:bg-[#F7F4EE] transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <MapPin :size="15" class="text-[#E86A58]" />
                    <span>Passaporte do Litoral</span>
                  </RouterLink>

                  <RouterLink
                    to="/conta?tab=desejos"
                    class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#0A2B42] hover:bg-[#F7F4EE] transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <Heart :size="15" class="text-[#E86A58]" />
                    <span>Praias Desejadas</span>
                  </RouterLink>
                </div>

                <div class="border-t border-[#F0EDE4] pt-1">
                  <button
                    type="button"
                    class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#D9534F] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
                    @click="handleLogout"
                  >
                    <LogOut :size="15" />
                    <span>Encerrar Sessão</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <button
            type="button"
            aria-label="Abrir carrinho"
            class="flex items-center gap-1.5 sm:gap-2 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
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

    <nav class="hidden md:block border-t border-[#EBE7DE] bg-white/70 py-2">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-6 lg:space-x-8 text-xs font-bold tracking-wider uppercase text-[#0A2B42]">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="cat.path"
          :class="[
            'transition-colors py-1.5 hover:text-[#E86A58] flex items-center min-h-[44px]',
            cat.highlight ? 'text-[#E86A58] font-extrabold' : ''
          ]"
        >
          {{ cat.name }}
        </RouterLink>
      </div>
    </nav>

    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white border-t border-[#E6E1D6] p-4 space-y-1 shadow-xl animate-fade-in"
    >
      <RouterLink
        v-for="cat in categories"
        :key="cat.name"
        :to="cat.path"
        :class="[
          'flex items-center px-3 py-3 rounded-xl text-sm font-bold border-b border-[#F0EDE4] min-h-[44px]',
          cat.highlight ? 'text-[#E86A58] bg-[#FDF3F1]' : 'text-[#0A2B42] hover:bg-[#F7F4EE]'
        ]"
        @click="isMobileMenuOpen = false"
      >
        {{ cat.name }}
      </RouterLink>

      <div class="pt-2">
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/conta"
          class="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-[#0A2B42] bg-[#F7F4EE]"
          @click="isMobileMenuOpen = false"
        >
          <Compass :size="16" class="text-[#05BFDB]" />
          <span>O Farol do Colecionador (Minha Conta)</span>
        </RouterLink>
        <button
          v-else
          type="button"
          class="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-white bg-[#0A2B42]"
          @click="isMobileMenuOpen = false; isAuthModalOpen = true"
        >
          <User :size="16" />
          <span>Entrar no Farol</span>
        </button>
      </div>
    </div>

    <AuthModal :is-open="isAuthModalOpen" @close="isAuthModalOpen = false" />
  </div>
</template>
