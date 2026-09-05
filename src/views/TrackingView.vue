<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import type { Order, TrackingPhase } from '@/types/order'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import {
  Search,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Droplets,
  FlaskConical,
  PenTool,
  Package,
  Anchor,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const searchInput = ref('')
const currentOrder = ref<Order | null>(null)
const hasSearched = ref(false)

function searchTracking(codeToSearch?: string) {
  const query = codeToSearch || searchInput.value
  if (!query) return

  hasSearched.value = true
  const found = ordersStore.getOrderByTracking(query)
  currentOrder.value = found || null

  if (codeToSearch) {
    searchInput.value = codeToSearch
    router.replace({ params: { code: codeToSearch } })
  }
}

function getPhaseIcon(phase: TrackingPhase) {
  switch (phase) {
    case 'WATER_COLLECTION':
      return Droplets
    case 'PURIFICATION_BOTTLING':
      return FlaskConical
    case 'SEALING_CALLIGRAPHY':
      return PenTool
    case 'SECURE_PACKAGING':
      return Package
    case 'TRANSIT':
      return Truck
    case 'DELIVERED':
      return Anchor
    default:
      return Package
  }
}

onMounted(() => {
  const codeParam = route.params.code as string
  if (codeParam) {
    searchInput.value = codeParam
    searchTracking(codeParam)
  } else if (ordersStore.orders.length > 0) {
    searchInput.value = ordersStore.orders[0]?.trackingCode || ''
    searchTracking(searchInput.value)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader />

    <main class="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A2B42]/5 text-[#0A2B42] text-xs font-semibold mb-3">
          <Truck :size="14" class="text-[#05BFDB]" />
          <span>Monitoramento de Cargas Frágeis</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-[#0A2B42]">
          Rastrear Garrafa do Mar
        </h1>
        <p class="text-sm text-[#4F6D7A] mt-2">
          Acompanhe cada etapa artesanal: desde a coleta na praia até o desembarque em seu endereço.
        </p>

        <form class="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto" @submit.prevent="searchTracking()">
          <div class="relative flex-grow">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A738E]" :size="18" />
            <input
              v-model="searchInput"
              type="text"
              placeholder="Digite o código (ex: LOM-BR-849201BR)"
              class="w-full pl-11 pr-4 py-3 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] uppercase font-mono shadow-sm"
            />
          </div>
          <button
            type="submit"
            class="py-3 px-6 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Consultar</span>
            <ArrowRight :size="14" />
          </button>
        </form>

        <div class="mt-3 flex items-center justify-center gap-2 text-xs text-[#5A738E]">
          <span>Exemplos para teste:</span>
          <button
            type="button"
            class="underline hover:text-[#0A2B42] font-mono cursor-pointer"
            @click="searchTracking('LOM-BR-849201BR')"
          >
            LOM-BR-849201BR
          </button>
          <span>·</span>
          <button
            type="button"
            class="underline hover:text-[#0A2B42] font-mono cursor-pointer"
            @click="searchTracking('LOM-BR-572190BR')"
          >
            LOM-BR-572190BR
          </button>
        </div>
      </div>

      <div v-if="currentOrder" class="bg-white border border-[#E6E1D6] rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EDE4] pb-6">
          <div>
            <span class="text-xs uppercase font-bold tracking-wider text-[#5A738E]">Código de Rastreamento</span>
            <h2 class="text-xl sm:text-2xl font-mono font-bold text-[#0A2B42] mt-0.5">
              {{ currentOrder.trackingCode }}
            </h2>
            <p class="text-xs text-[#4F6D7A] mt-1">
              Pedido {{ currentOrder.orderNumber }} · {{ currentOrder.shippingOption.carrier }}
            </p>
          </div>

          <div class="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E1D6] text-right">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Previsão de Entrega</span>
            <p class="text-base font-bold text-[#0A2B42] flex items-center gap-1.5 mt-0.5 justify-end">
              <Calendar :size="16" class="text-[#E86A58]" />
              <span>{{ new Date(currentOrder.estimatedDeliveryDate).toLocaleDateString('pt-BR') }}</span>
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] mb-6 flex items-center gap-2">
            <Clock :size="15" class="text-[#05BFDB]" />
            <span>Linha do Tempo da Expedição Náutica</span>
          </h3>

          <div class="relative pl-6 space-y-6 border-l-2 border-[#D9D3C7] ml-4">
            <div
              v-for="(event, index) in currentOrder.trackingEvents"
              :key="index"
              class="relative"
            >
              <div
                class="absolute -left-[33px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                :class="[
                  event.isCompleted
                    ? 'bg-[#0A2B42] border-[#0A2B42] text-white'
                    : event.isCurrent
                      ? 'bg-white border-[#05BFDB] text-[#05BFDB] ring-4 ring-[#05BFDB]/20 animate-pulse'
                      : 'bg-white border-[#D9D3C7] text-[#8A9BA8]'
                ]"
              >
                <component :is="getPhaseIcon(event.phase)" :size="14" />
              </div>

              <div
                class="p-4 rounded-2xl border transition-all"
                :class="[
                  event.isCurrent
                    ? 'bg-white border-[#05BFDB] shadow-md'
                    : event.isCompleted
                      ? 'bg-white/80 border-[#E6E1D6]'
                      : 'bg-[#FBF9F5]/60 border-[#EAE5D9] opacity-60'
                ]"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h4 class="text-sm font-bold text-[#0A2B42]">{{ event.title }}</h4>
                  <span class="text-[11px] font-mono text-[#5A738E]">{{ event.timestamp }}</span>
                </div>

                <p class="text-xs text-[#4F6D7A] mt-1 leading-relaxed">{{ event.description }}</p>

                <div class="mt-2.5 flex items-center gap-2 text-[11px] text-[#5A738E]">
                  <MapPin :size="13" class="text-[#E86A58]" />
                  <span>{{ event.location }}</span>
                  <span v-if="event.coordinates" class="font-mono text-[10px] bg-[#EAE5D9] px-2 py-0.5 rounded-full text-[#0A2B42]">
                    {{ event.coordinates.lat.toFixed(4) }}, {{ event.coordinates.lng.toFixed(4) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E1D6] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-[#0A2B42]">
            <ShieldCheck :size="16" class="text-[#05BFDB]" />
            <span>Transporte Especializado com Embalagem Colmeia Antichoque</span>
          </div>

          <span class="text-xs text-[#5A738E]">
            Destino: {{ currentOrder.shippingAddress.city }} - {{ currentOrder.shippingAddress.state }}
          </span>
        </div>
      </div>

      <div v-else-if="hasSearched" class="p-12 text-center bg-white rounded-3xl border border-[#E6E1D6]">
        <Truck :size="32" class="mx-auto text-[#8A9BA8] mb-3" />
        <h3 class="text-base font-serif font-bold text-[#0A2B42]">Código de rastreamento não localizado</h3>
        <p class="text-xs text-[#5A738E] mt-1">
          Verifique o código digitado ou acesse sua conta para conferir suas garrafas.
        </p>
      </div>
    </main>

    <FooterNavigation />
  </div>
</template>
