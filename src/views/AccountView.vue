<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'
import type { Order, BottleCertificate } from '@/types/order'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import AccountOverview from '@/components/account/AccountOverview.vue'
import AccountOrdersList from '@/components/account/AccountOrdersList.vue'
import CollectorPassport from '@/components/account/CollectorPassport.vue'
import AccountWishlist from '@/components/account/AccountWishlist.vue'
import AccountAddresses from '@/components/account/AccountAddresses.vue'
import OrderTrackingModal from '@/components/account/OrderTrackingModal.vue'
import AuthenticityCertificateModal from '@/components/account/AuthenticityCertificateModal.vue'
import {
  Compass,
  Package,
  MapPin,
  Heart,
  Home,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ArrowRight
} from 'lucide-vue-next'

type TabKey = 'visao-geral' | 'pedidos' | 'passaporte' | 'desejos' | 'enderecos'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const wishlistStore = useWishlistStore()

const currentTab = ref<TabKey>('visao-geral')
const isAuthModalOpen = ref(false)

const isTrackingModalOpen = ref(false)
const selectedOrderForTracking = ref<Order | null>(null)

const isCertificateModalOpen = ref(false)
const selectedCertificate = ref<BottleCertificate | null>(null)

watch(
  () => route.query.tab,
  (newTab) => {
    if (
      newTab === 'visao-geral' ||
      newTab === 'pedidos' ||
      newTab === 'passaporte' ||
      newTab === 'desejos' ||
      newTab === 'enderecos'
    ) {
      currentTab.value = newTab
    }
  },
  { immediate: true }
)

function setTab(tab: TabKey) {
  currentTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

function handleOpenTracking(order: Order) {
  selectedOrderForTracking.value = order
  isTrackingModalOpen.value = true
}

function handleOpenCertificate(cert: BottleCertificate) {
  selectedCertificate.value = cert
  isCertificateModalOpen.value = true
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    isAuthModalOpen.value = true
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader />

    <main id="main-content" class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div v-if="!authStore.isAuthenticated" class="max-w-md mx-auto text-center py-16 bg-white p-8 rounded-3xl border border-[#E6E1D6] shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-[#0A2B42] text-white flex items-center justify-center mx-auto mb-4">
          <Compass :size="24" />
        </div>
        <h1 class="text-2xl font-serif font-bold text-[#0A2B42]">Acesso ao Farol</h1>
        <p class="text-xs text-[#5A738E] mt-2 mb-6">
          Identifique-se para visualizar suas garrafas, rastrear encomendas e carimbar seu passaporte da costa brasileira.
        </p>

        <div class="space-y-3">
          <button
            type="button"
            class="w-full py-3 px-4 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors cursor-pointer"
            @click="isAuthModalOpen = true"
          >
            Entrar ou Criar Conta
          </button>
          <button
            type="button"
            class="w-full py-3 px-4 rounded-xl border border-[#0A2B42] text-[#0A2B42] text-xs font-semibold hover:bg-[#F7F4EE] transition-colors cursor-pointer"
            @click="authStore.loginAsDemo"
          >
            Acesso Rápido Demo (Heder David)
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside class="lg:col-span-1 bg-white border border-[#E6E1D6] rounded-3xl p-5 shadow-sm space-y-6">
          <div class="flex items-center gap-3 pb-5 border-b border-[#F0EDE4]">
            <div v-if="authStore.user?.avatarUrl" class="w-12 h-12 rounded-2xl overflow-hidden border border-[#D9D3C7] flex-shrink-0">
              <img :src="authStore.user.avatarUrl" :alt="authStore.user.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 rounded-2xl bg-[#0A2B42] text-white flex items-center justify-center flex-shrink-0">
              <UserIcon :size="22" />
            </div>

            <div class="min-w-0">
              <h2 class="text-sm font-bold text-[#0A2B42] truncate">{{ authStore.user?.name }}</h2>
              <span class="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#0A2B42]">
                {{ authStore.user?.collectorTier }}
              </span>
            </div>
          </div>

          <nav class="space-y-1">
            <button
              type="button"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="
                currentTab === 'visao-geral'
                  ? 'bg-[#0A2B42] text-white shadow-sm'
                  : 'text-[#4F6D7A] hover:bg-[#F7F4EE] hover:text-[#0A2B42]'
              "
              @click="setTab('visao-geral')"
            >
              <div class="flex items-center gap-2.5">
                <Compass :size="16" />
                <span>O Farol (Visão Geral)</span>
              </div>
            </button>

            <button
              type="button"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="
                currentTab === 'pedidos'
                  ? 'bg-[#0A2B42] text-white shadow-sm'
                  : 'text-[#4F6D7A] hover:bg-[#F7F4EE] hover:text-[#0A2B42]'
              "
              @click="setTab('pedidos')"
            >
              <div class="flex items-center gap-2.5">
                <Package :size="16" />
                <span>Minhas Garrafas & Pedidos</span>
              </div>
              <span
                class="px-2 py-0.5 text-[10px] rounded-full"
                :class="currentTab === 'pedidos' ? 'bg-white/20 text-white' : 'bg-[#EAE5D9] text-[#0A2B42]'"
              >
                {{ ordersStore.orders.length }}
              </span>
            </button>

            <button
              type="button"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="
                currentTab === 'passaporte'
                  ? 'bg-[#0A2B42] text-white shadow-sm'
                  : 'text-[#4F6D7A] hover:bg-[#F7F4EE] hover:text-[#0A2B42]'
              "
              @click="setTab('passaporte')"
            >
              <div class="flex items-center gap-2.5">
                <MapPin :size="16" />
                <span>Passaporte do Litoral</span>
              </div>
            </button>

            <button
              type="button"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="
                currentTab === 'desejos'
                  ? 'bg-[#0A2B42] text-white shadow-sm'
                  : 'text-[#4F6D7A] hover:bg-[#F7F4EE] hover:text-[#0A2B42]'
              "
              @click="setTab('desejos')"
            >
              <div class="flex items-center gap-2.5">
                <Heart :size="16" />
                <span>Praias Desejadas</span>
              </div>
              <span
                v-if="wishlistStore.count > 0"
                class="px-2 py-0.5 text-[10px] rounded-full"
                :class="currentTab === 'desejos' ? 'bg-white/20 text-white' : 'bg-[#E86A58] text-white'"
              >
                {{ wishlistStore.count }}
              </span>
            </button>

            <button
              type="button"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="
                currentTab === 'enderecos'
                  ? 'bg-[#0A2B42] text-white shadow-sm'
                  : 'text-[#4F6D7A] hover:bg-[#F7F4EE] hover:text-[#0A2B42]'
              "
              @click="setTab('enderecos')"
            >
              <div class="flex items-center gap-2.5">
                <Home :size="16" />
                <span>Endereços de Entrega</span>
              </div>
            </button>
          </nav>

          <div class="pt-4 border-t border-[#F0EDE4]">
            <button
              type="button"
              class="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#D9534F] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
              @click="handleLogout"
            >
              <LogOut :size="16" />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </aside>

        <section class="lg:col-span-3">
          <AccountOverview
            v-if="currentTab === 'visao-geral'"
            :user="authStore.user!"
            :orders="ordersStore.orders"
            @change-tab="setTab"
            @open-tracking="handleOpenTracking"
            @open-certificate="handleOpenCertificate"
          />

          <AccountOrdersList
            v-else-if="currentTab === 'pedidos'"
            :orders="ordersStore.orders"
            @open-tracking="handleOpenTracking"
            @open-certificate="handleOpenCertificate"
          />

          <CollectorPassport
            v-else-if="currentTab === 'passaporte'"
            :user="authStore.user!"
            :orders="ordersStore.orders"
          />

          <AccountWishlist
            v-else-if="currentTab === 'desejos'"
          />

          <AccountAddresses
            v-else-if="currentTab === 'enderecos'"
            :user="authStore.user!"
          />
        </section>
      </div>
    </main>

    <FooterNavigation />

    <AuthModal
      :is-open="isAuthModalOpen"
      @close="isAuthModalOpen = false"
    />

    <OrderTrackingModal
      :is-open="isTrackingModalOpen"
      :order="selectedOrderForTracking"
      @close="isTrackingModalOpen = false"
    />

    <AuthenticityCertificateModal
      :is-open="isCertificateModalOpen"
      :certificate="selectedCertificate"
      @close="isCertificateModalOpen = false"
    />
  </div>
</template>
