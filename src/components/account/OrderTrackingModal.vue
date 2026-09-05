<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Order, TrackingPhase } from '@/types/order'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import {
  X,
  Copy,
  Check,
  MapPin,
  Calendar,
  ShieldCheck,
  Droplets,
  FlaskConical,
  PenTool,
  Package,
  Truck,
  Anchor,
  Clock
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  order: Order | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { copy, copied } = useClipboard()

function copyTrackingCode() {
  if (props.order?.trackingCode) {
    copy(props.order.trackingCode)
    toast.success('Código de rastreamento copiado!')
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && order"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A2B42]/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-2xl max-h-[90vh] bg-[#F7F4EE] border border-[#E6E1D6] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div class="px-6 py-5 border-b border-[#E6E1D6] bg-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#0A2B42] text-white flex items-center justify-center">
              <Truck :size="20" />
            </div>
            <div>
              <h2 class="text-lg font-serif font-bold text-[#0A2B42]">Diário da Expedição</h2>
              <p class="text-xs text-[#5A738E]">Pedido {{ order.orderNumber }} · {{ order.items.length }} garrafa(s)</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar rastreamento"
            class="p-2 rounded-full text-[#5A738E] hover:text-[#0A2B42] hover:bg-[#EAE5D9] transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-6 flex-grow">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-[#E6E1D6]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Código de Rastreamento</span>
              <div class="flex items-center gap-2 mt-1">
                <span class="font-mono text-sm font-bold text-[#0A2B42]">{{ order.trackingCode }}</span>
                <button
                  type="button"
                  aria-label="Copiar código de rastreamento"
                  class="p-1 rounded text-[#5A738E] hover:text-[#0A2B42] transition-colors cursor-pointer"
                  @click="copyTrackingCode"
                >
                  <component :is="copied ? Check : Copy" :size="15" :class="copied ? 'text-green-600' : ''" />
                </button>
              </div>
            </div>

            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Previsão de Entrega</span>
              <div class="flex items-center gap-1.5 mt-1 text-sm font-semibold text-[#0A2B42]">
                <Calendar :size="15" class="text-[#E86A58]" />
                <span>{{ new Date(order.estimatedDeliveryDate).toLocaleDateString('pt-BR') }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] mb-4 flex items-center gap-2">
              <Clock :size="14" class="text-[#05BFDB]" />
              <span>Etapas do Envase & Navegação</span>
            </h3>

            <div class="relative pl-6 space-y-6 border-l-2 border-[#D9D3C7] ml-4">
              <div
                v-for="(event, index) in order.trackingEvents"
                :key="index"
                class="relative group"
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

                  <p class="text-xs text-[#4F6D7A] mt-1.5 leading-relaxed">{{ event.description }}</p>

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
        </div>

        <div class="p-4 bg-white border-t border-[#E6E1D6] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#0A2B42]">
            <ShieldCheck :size="16" class="text-[#05BFDB]" />
            <span>Seguro Vidro Protegido & Transporte Climatizado</span>
          </div>

          <button
            type="button"
            class="px-5 py-2.5 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors cursor-pointer"
            @click="emit('close')"
          >
            Concluir Visualização
          </button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>
