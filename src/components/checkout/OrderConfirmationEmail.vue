<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Order } from '@/types/order'
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  Truck,
  FileText,
  Sparkles,
  ArrowLeft,
  Compass,
  Lock,
  Printer
} from 'lucide-vue-next'

export interface OrderConfirmationEmailProps {
  order: Order
  maskedCard?: string
  authProtocol?: string
}

const props = withDefaults(defineProps<OrderConfirmationEmailProps>(), {
  maskedCard: 'Visa •••• 2222',
  authProtocol: 'AUTH-3DS-994821-BR'
})

const emit = defineEmits<{
  (e: 'backToSuccess'): void
}>()

const formattedDate = computed(() => {
  try {
    return new Date(props.order.createdAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Hoje às 14:30'
  }
})

const formattedDeliveryDate = computed(() => {
  try {
    return new Date(props.order.estimatedDeliveryDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Em até 5 dias úteis'
  }
})

const paymentMethodLabel = computed(() => {
  if (props.order.paymentMethod === 'CREDIT_CARD') {
    return `Cartão de Crédito (${props.maskedCard})`
  }
  if (props.order.paymentMethod === 'PIX') {
    return 'Pix Instantâneo'
  }
  return 'Boleto Bancário'
})

function handlePrintEmail() {
  if (typeof window !== 'undefined' && typeof window.print === 'function') {
    window.print()
  }
}
</script>

<template>
  <section
    aria-labelledby="email-confirmation-heading"
    class="max-w-3xl mx-auto space-y-6 animate-fade-in"
  >
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E6E1D6] shadow-sm">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-xs font-bold text-[#0B3C5D] hover:text-[#0A2B42] cursor-pointer"
        @click="emit('backToSuccess')"
      >
        <ArrowLeft :size="15" />
        <span>Voltar ao Resumo do Pedido</span>
      </button>

      <div class="flex items-center gap-2">
        <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Mail :size="13" />
          <span>E-mail de Confirmação Enviado</span>
        </span>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl border border-[#D6CFC0] bg-[#F7F4EE] hover:bg-[#EBE7DE] text-xs font-bold text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
          @click="handlePrintEmail"
        >
          <Printer :size="13" />
          <span>Imprimir</span>
        </button>
      </div>
    </div>

    <div class="card-maritimo overflow-hidden bg-white border border-[#D6CFC0] shadow-2xl rounded-3xl">
      <div class="bg-[#0A2B42] text-white p-5 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#E86A58]" />
            <span class="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span class="w-3 h-3 rounded-full bg-emerald-400" />
            <span class="text-xs font-mono text-white/80 ml-2">Caixa de Entrada</span>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1">
              <ShieldCheck :size="12" />
              <span>Remetente Verificado (DKIM / SPF)</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 flex items-center gap-1">
              <Lock :size="11" />
              <span>TLS 1.3</span>
            </span>
          </div>
        </div>

        <div class="space-y-1.5 text-xs">
          <h1 id="email-confirmation-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-white">
            🌊 Pedido Confirmado #{{ order.orderNumber }} — Sua coleção costeira está sendo preparada!
          </h1>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-white/80 pt-1 text-[11px]">
            <p><strong class="text-white">De:</strong> Curadoria Leve o Mar &lt;tripulacao@leveomar.com.br&gt;</p>
            <p><strong class="text-white">Data:</strong> {{ formattedDate }}</p>
            <p><strong class="text-white">Para:</strong> {{ order.customer.name }} &lt;{{ order.customer.email }}&gt;</p>
            <p><strong class="text-white">Autenticação:</strong> <span class="font-mono">{{ authProtocol }}</span></p>
          </div>
        </div>
      </div>

      <div class="p-6 sm:p-10 space-y-8 bg-[#FBF9F5]">
        <div class="text-center space-y-2 pb-6 border-b border-[#E6E1D6]">
          <span class="font-serif-editorial text-2xl sm:3xl font-extrabold tracking-tight text-[#0A2B42] block">
            LEVE O MAR
          </span>
          <span class="text-[9px] font-bold tracking-[0.28em] text-[#E86A58] uppercase block">
            Águas do Brasil &amp; Memórias Costeiras
          </span>
          <p class="text-xs sm:text-sm text-[#5A738E] max-w-lg mx-auto pt-2">
            Olá, <strong class="text-[#0A2B42]">{{ order.customer.name }}</strong>! Recebemos a confirmação do seu pagamento e nossa curadoria já iniciou a preparação artesanal e o lacre em cera da sua garrafa.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl bg-white border border-[#E6E1D6] space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E] block">Número do Pedido</span>
            <span class="font-mono text-base font-extrabold text-[#0B3C5D] block">{{ order.orderNumber }}</span>
            <span class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 :size="12" />
              <span>Pagamento Aprovado</span>
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-[#E6E1D6] space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E] block">Código de Rastreio</span>
            <span class="font-mono text-base font-extrabold text-[#0A2B42] block">{{ order.trackingCode }}</span>
            <span class="text-[11px] text-[#5A738E] block">{{ order.shippingOption.carrier }}</span>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-[#E6E1D6] space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E] block">Previsão de Entrega</span>
            <span class="text-xs font-bold text-[#0A2B42] block">{{ formattedDeliveryDate }}</span>
            <span class="text-[11px] text-[#0B3C5D] font-semibold block">Seguro Vidro Ativo</span>
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
            Itens da Sua Coleção
          </h2>

          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="p-4 rounded-2xl bg-white border border-[#E6E1D6] flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <img
                  :src="item.product.bottleImage"
                  :alt="item.product.beachName"
                  class="w-14 h-16 rounded-xl object-cover border border-[#D6CFC0] flex-shrink-0"
                />
                <div class="space-y-0.5 min-w-0">
                  <h3 class="font-serif-editorial text-sm font-bold text-[#0A2B42] truncate">
                    {{ item.product.name }} ({{ item.product.beachName }} - {{ item.product.uf }})
                  </h3>
                  <p class="text-[11px] text-[#5A738E]">
                    Quantidade: <strong>{{ item.quantity }}</strong>
                    <span v-if="item.customization?.glassType"> · Acabamento: <strong>{{ item.customization.glassType }}</strong></span>
                  </p>
                  <p
                    v-if="item.customization?.recipientName || item.customization?.giftMessage || item.customization?.dedicationText"
                    class="text-[11px] text-[#E86A58] italic truncate"
                  >
                    Rótulo: {{ item.customization?.recipientName || 'Colecionador' }} — "{{ item.customization?.giftMessage || item.customization?.dedicationText }}"
                  </p>
                </div>
              </div>

              <span class="text-xs sm:text-sm font-bold text-[#0B3C5D] flex-shrink-0">
                R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl bg-white border border-[#E6E1D6] space-y-2 text-xs">
            <div class="flex items-center gap-2 font-bold text-[#0A2B42] pb-2 border-b border-[#F0EDE4]">
              <Truck :size="15" class="text-[#0B3C5D]" />
              <span>Endereço de Entrega</span>
            </div>
            <p class="font-bold text-[#0A2B42]">{{ order.customer.name }}</p>
            <p class="text-[#5A738E]">
              {{ order.shippingAddress.street }}, {{ order.shippingAddress.number }}
              <span v-if="order.shippingAddress.complement"> · {{ order.shippingAddress.complement }}</span>
            </p>
            <p class="text-[#5A738E]">
              {{ order.shippingAddress.neighborhood }} · {{ order.shippingAddress.city }} - {{ order.shippingAddress.state }}
            </p>
            <p class="font-mono text-[11px] text-[#0B3C5D]">CEP: {{ order.shippingAddress.cep }}</p>
            <p class="text-[11px] text-[#5A738E] pt-1">
              Modalidade: <strong>{{ order.shippingOption.name }}</strong>
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-[#E6E1D6] space-y-2 text-xs">
            <div class="flex items-center gap-2 font-bold text-[#0A2B42] pb-2 border-b border-[#F0EDE4]">
              <FileText :size="15" class="text-[#0B3C5D]" />
              <span>Resumo Financeiro</span>
            </div>
            <div class="flex justify-between text-[#5A738E]">
              <span>Meio de Pagamento</span>
              <span class="font-bold text-[#0A2B42]">{{ paymentMethodLabel }}</span>
            </div>
            <div class="flex justify-between text-[#5A738E]">
              <span>Subtotal dos Produtos</span>
              <span>R$ {{ order.subtotal.toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-[#5A738E]">
              <span>Frete com Seguro Vidro</span>
              <span>R$ {{ order.shippingTotal.toFixed(2).replace('.', ',') }}</span>
            </div>
            <div v-if="order.discount > 0" class="flex justify-between text-[#E86A58] font-bold">
              <span>Desconto Aplicado</span>
              <span>- R$ {{ order.discount.toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-sm font-extrabold text-[#0B3C5D] pt-2 border-t border-[#F0EDE4]">
              <span>Total Pago</span>
              <span>R$ {{ order.total.toFixed(2).replace('.', ',') }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="order.certificates && order.certificates.length > 0"
          class="p-4 rounded-2xl bg-[#EBE7DE]/70 border border-[#D6CFC0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-[#0A2B42]">
              <Sparkles :size="15" class="text-[#D97706]" />
              <span>Certificado de Autenticidade Anexo: {{ order.certificates[0]?.certificateNumber }}</span>
            </div>
            <p class="text-[11px] text-[#5A738E]">
              Lote {{ order.certificates[0]?.batchNumber }} · Coordenadas {{ order.certificates[0]?.coordinates.lat.toFixed(4) }}°, {{ order.certificates[0]?.coordinates.lng.toFixed(4) }}° · Chave NF-e: 3526 1100 0000 0001 5500 1000 8492 0110
            </p>
          </div>

          <RouterLink
            :to="`/rastreio/${order.trackingCode}`"
            class="px-5 py-2.5 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold inline-flex items-center gap-1.5 flex-shrink-0"
          >
            <Compass :size="14" />
            <span>Rastrear Expedição</span>
          </RouterLink>
        </div>

        <div class="pt-4 border-t border-[#E6E1D6] text-[11px] text-[#5A738E] text-center space-y-1">
          <p>
            Trocas e devoluções gratuitas em até 7 dias corridos após o recebimento (Código de Defesa do Consumidor, Art. 49).
          </p>
          <p>
            Leve o Mar Comércio Digital de Colecionáveis Costeiros LTDA · Salvador, BA.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
