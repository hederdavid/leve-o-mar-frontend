<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order, BottleCertificate, OrderStatus } from '@/types/order'
import {
  Package,
  Truck,
  Award,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-vue-next'

interface Props {
  orders: Order[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'openTracking', order: Order): void
  (e: 'openCertificate', cert: BottleCertificate): void
}>()

const statusFilter = ref<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL')

const filteredOrders = computed(() => {
  if (statusFilter.value === 'ACTIVE') {
    return props.orders.filter((o) => o.status !== 'DELIVERED')
  }
  if (statusFilter.value === 'DELIVERED') {
    return props.orders.filter((o) => o.status === 'DELIVERED')
  }
  return props.orders
})

function formatPrice(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'Aguardando Pagamento'
    case 'PAID':
      return 'Pagamento Confirmado'
    case 'PREPARING_BOTTLE':
      return 'Envase & Lacre Artesanal'
    case 'SHIPPED':
      return 'Carga em Trânsito'
    case 'DELIVERED':
      return 'Entregue ao Colecionador'
    default:
      return status
  }
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'SHIPPED':
      return 'bg-[#05BFDB]/10 text-[#0A2B42] border-[#05BFDB]/30'
    case 'DELIVERED':
      return 'bg-green-50 text-green-800 border-green-200'
    case 'PREPARING_BOTTLE':
    case 'PAID':
      return 'bg-[#F7F4EE] text-[#0A2B42] border-[#D9D3C7]'
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E1D6] pb-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-[#0A2B42]">Minhas Garrafas & Pedidos</h1>
        <p class="text-xs text-[#5A738E] mt-1">Histórico completo de expedições e águas catalogadas.</p>
      </div>

      <div class="flex items-center gap-1 bg-[#EAE5D9] p-1 rounded-xl">
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          :class="statusFilter === 'ALL' ? 'bg-white text-[#0A2B42] shadow-sm' : 'text-[#5A738E] hover:text-[#0A2B42]'"
          @click="statusFilter = 'ALL'"
        >
          Todos ({{ orders.length }})
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          :class="statusFilter === 'ACTIVE' ? 'bg-white text-[#0A2B42] shadow-sm' : 'text-[#5A738E] hover:text-[#0A2B42]'"
          @click="statusFilter = 'ACTIVE'"
        >
          Em Rota
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          :class="statusFilter === 'DELIVERED' ? 'bg-white text-[#0A2B42] shadow-sm' : 'text-[#5A738E] hover:text-[#0A2B42]'"
          @click="statusFilter = 'DELIVERED'"
        >
          Entregues
        </button>
      </div>
    </div>

    <div v-if="filteredOrders.length === 0" class="p-12 text-center bg-white rounded-3xl border border-[#E6E1D6]">
      <Package :size="32" class="mx-auto text-[#8A9BA8] mb-3" />
      <h3 class="text-base font-serif font-bold text-[#0A2B42]">Nenhum pedido encontrado nesta categoria</h3>
      <p class="text-xs text-[#5A738E] mt-1">Explore nossa coleção e guarde seu primeiro fragmento de mar.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white border border-[#E6E1D6] rounded-3xl p-6 shadow-sm space-y-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EDE4] pb-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-mono text-sm font-bold text-[#0A2B42]">{{ order.orderNumber }}</span>
            <span class="text-xs text-[#8A9BA8]">·</span>
            <span class="text-xs text-[#5A738E] flex items-center gap-1">
              <Calendar :size="13" />
              {{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              :class="getStatusColor(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-[#5A738E]">Total:</span>
            <span class="font-bold text-[#0A2B42]">{{ formatPrice(order.total) }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-start gap-4 p-3 bg-[#FBF9F5] rounded-2xl border border-[#EAE5D9]"
          >
            <img
              :src="item.product.bottleImage || item.product.images?.primary"
              :alt="item.product.name"
              class="w-16 h-20 object-cover rounded-xl bg-white border border-[#D9D3C7]"
            />

            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#E86A58]">
                  {{ item.product.beachName }} · {{ item.product.state }}
                </span>
                <span class="text-xs font-semibold text-[#0A2B42]">{{ formatPrice(item.product.price) }}</span>
              </div>

              <h4 class="text-sm font-bold text-[#0A2B42] truncate">{{ item.product.name }}</h4>

              <p v-if="item.customization?.dedicationText" class="text-xs italic text-[#4F6D7A] font-serif mt-1">
                "{{ item.customization.dedicationText }}"
              </p>

              <div class="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-[#5A738E]">
                <span>Qtd: {{ item.quantity }}</span>
                <span>·</span>
                <span>{{ item.customization?.glassType || 'Vidro Borossilicato' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div class="text-xs text-[#5A738E] flex items-center gap-1.5">
            <MapPin :size="14" class="text-[#E86A58]" />
            <span>Entrega em {{ order.shippingAddress.city }} - {{ order.shippingAddress.state }}</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-if="order.certificates && order.certificates.length > 0"
              type="button"
              class="px-3.5 py-2 rounded-xl border border-[#D4AF37] text-[#0A2B42] hover:bg-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              @click="emit('openCertificate', order.certificates[0]!)"
            >
              <Award :size="14" class="text-[#D4AF37]" />
              <span>Ver Certificado</span>
            </button>

            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-[#0A2B42] text-white hover:bg-[#144272] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              @click="emit('openTracking', order)"
            >
              <Truck :size="14" />
              <span>Rastrear Garrafa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
