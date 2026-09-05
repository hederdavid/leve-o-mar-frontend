<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/auth'
import type { Order, BottleCertificate } from '@/types/order'
import {
  Compass,
  Package,
  Award,
  Truck,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-vue-next'

interface Props {
  user: User
  orders: Order[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'changeTab', tab: 'pedidos' | 'passaporte' | 'desejos' | 'enderecos'): void
  (e: 'openTracking', order: Order): void
  (e: 'openCertificate', cert: BottleCertificate): void
}>()

const activeOrder = computed(() =>
  props.orders.find((o) => o.status !== 'DELIVERED') || props.orders[0]
)

const totalBottles = computed(() =>
  props.orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
)

const certificatesCount = computed(() =>
  props.orders.reduce((sum, o) => sum + (o.certificates?.length || 0), 0)
)
</script>

<template>
  <div class="space-y-8">
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A2B42] to-[#144272] text-white shadow-xl relative overflow-hidden">
      <div class="relative z-10 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#05BFDB] text-xs font-semibold backdrop-blur-md mb-4">
          <Compass :size="14" />
          <span>{{ user.collectorTier }}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-serif font-bold leading-tight">
          Bem-vindo ao seu porto, {{ user?.name ? user.name.split(' ')[0] : 'Colecionador' }}.
        </h1>

        <p class="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
          Você já arquivou fragmentos do litoral brasileiro em seu acervo pessoal. Suas garrafas preservam o sal, a luz e a memória das praias.
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            class="px-5 py-2.5 rounded-full bg-[#05BFDB] text-[#0A2B42] text-xs font-bold hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
            @click="emit('changeTab', 'passaporte')"
          >
            <span>Ver Passaporte do Litoral</span>
            <ArrowRight :size="14" />
          </button>

          <button
            type="button"
            class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
            @click="emit('changeTab', 'pedidos')"
          >
            Minhas Garrafas
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 bg-white border border-[#E6E1D6] rounded-2xl shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-[#0A2B42]/5 text-[#0A2B42] flex items-center justify-center mb-3">
          <Package :size="18" />
        </div>
        <p class="text-[11px] font-bold uppercase tracking-wider text-[#5A738E]">Garrafas Guardadas</p>
        <p class="text-2xl font-serif font-bold text-[#0A2B42] mt-1">{{ totalBottles }}</p>
      </div>

      <div class="p-5 bg-white border border-[#E6E1D6] rounded-2xl shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-[#05BFDB]/10 text-[#05BFDB] flex items-center justify-center mb-3">
          <MapPin :size="18" />
        </div>
        <p class="text-[11px] font-bold uppercase tracking-wider text-[#5A738E]">Praias Catalogadas</p>
        <p class="text-2xl font-serif font-bold text-[#0A2B42] mt-1">{{ user.beachesCount }}</p>
      </div>

      <div class="p-5 bg-white border border-[#E6E1D6] rounded-2xl shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-[#E86A58]/10 text-[#E86A58] flex items-center justify-center mb-3">
          <Award :size="18" />
        </div>
        <p class="text-[11px] font-bold uppercase tracking-wider text-[#5A738E]">Insígnias Náuticas</p>
        <p class="text-2xl font-serif font-bold text-[#0A2B42] mt-1">{{ user.badges.length }}</p>
      </div>

      <div class="p-5 bg-white border border-[#E6E1D6] rounded-2xl shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-3">
          <ShieldCheck :size="18" />
        </div>
        <p class="text-[11px] font-bold uppercase tracking-wider text-[#5A738E]">Certificados Emitidos</p>
        <p class="text-2xl font-serif font-bold text-[#0A2B42] mt-1">{{ certificatesCount }}</p>
      </div>
    </div>

    <div v-if="activeOrder" class="p-6 bg-white border border-[#E6E1D6] rounded-3xl shadow-sm space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EDE4] pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#05BFDB]/10 text-[#05BFDB] flex items-center justify-center">
            <Truck :size="20" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-[#0A2B42]">
              Expedição em Andamento · Pedido {{ activeOrder.orderNumber }}
            </h2>
            <p class="text-xs text-[#5A738E]">
              Previsão de entrega: {{ new Date(activeOrder.estimatedDeliveryDate).toLocaleDateString('pt-BR') }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors cursor-pointer flex items-center gap-1.5"
          @click="emit('openTracking', activeOrder)"
        >
          <span>Rastrear no Diário</span>
          <ArrowRight :size="14" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div class="flex items-center gap-4">
          <img
            :src="activeOrder.items[0]?.product.bottleImage || activeOrder.items[0]?.product.images?.primary"
            :alt="activeOrder.items[0]?.product.name"
            class="w-16 h-20 object-cover rounded-xl bg-[#F7F4EE] border border-[#E6E1D6]"
          />
          <div>
            <p class="text-xs uppercase font-bold text-[#E86A58]">{{ activeOrder.items[0]?.product.beachName }}</p>
            <p class="text-sm font-bold text-[#0A2B42]">{{ activeOrder.items[0]?.product.name }}</p>
            <p class="text-xs text-[#5A738E] mt-0.5">Destino: {{ activeOrder.shippingAddress.city }} - {{ activeOrder.shippingAddress.state }}</p>
          </div>
        </div>

        <div class="p-3 bg-[#FBF9F5] rounded-xl border border-[#E6E1D6] text-xs space-y-1">
          <div class="flex items-center justify-between text-[#5A738E]">
            <span>Status Atual</span>
            <span class="font-bold text-[#05BFDB]">
              {{ activeOrder.status === 'SHIPPED' ? 'Carga em Trânsito' : 'Em Preparação' }}
            </span>
          </div>
          <div class="w-full h-2 bg-[#EAE5D9] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#05BFDB] rounded-full transition-all duration-500"
              :style="{ width: activeOrder.status === 'SHIPPED' ? '80%' : '40%' }"
            ></div>
          </div>
          <p class="text-[11px] text-[#4F6D7A] text-right">
            Código: <span class="font-mono font-semibold">{{ activeOrder.trackingCode }}</span>
          </p>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-serif font-bold text-[#0A2B42]">Insígnias Conquistadas</h2>
        <button
          type="button"
          class="text-xs font-semibold text-[#0A2B42] hover:text-[#05BFDB] cursor-pointer"
          @click="emit('changeTab', 'passaporte')"
        >
          Ver todas
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="badge in user.badges"
          :key="badge.id"
          class="p-4 bg-white border border-[#E6E1D6] rounded-2xl shadow-sm flex items-start gap-3"
        >
          <div class="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#D9D3C7] flex items-center justify-center text-[#0A2B42] flex-shrink-0">
            <Award :size="20" class="text-[#D4AF37]" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-[#0A2B42]">{{ badge.title }}</h3>
            <p class="text-[11px] text-[#5A738E] mt-0.5 leading-relaxed">{{ badge.description }}</p>
            <span class="text-[10px] font-mono text-[#8A9BA8] mt-1 block">Conquistada em {{ badge.unlockedAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
