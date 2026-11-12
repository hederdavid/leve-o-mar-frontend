<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { orderService } from '@/services/orderService'
import { demoUser } from '@/services/authService'
import { mockProducts } from '@/mocks/products'
import { mockOrders } from '@/mocks/orders'
import type { ShippingOption } from '@/types/cart'
import type { Order } from '@/types/order'
import InteractiveCreditCard from '@/components/checkout/InteractiveCreditCard.vue'
import SecurityVerificationPanel from '@/components/checkout/SecurityVerificationPanel.vue'
import OrderConfirmationEmail from '@/components/checkout/OrderConfirmationEmail.vue'
import confetti from 'canvas-confetti'
import { toast } from 'vue-sonner'
import {
  Lock,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  FileText,
  Copy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  Mail,
  Edit3,
  Eye
} from 'lucide-vue-next'
import { analytics } from '@/services/analytics'

const route = useRoute()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const createdOrder = ref<Order | null>(null)
const currentStep = ref<number>(1)

const mainCheckoutSteps = [
  { id: 1, targetStep: 1, label: 'Identificação' },
  { id: 2, targetStep: 2, label: 'Entrega' },
  { id: 3, targetStep: 3, label: 'Pagamento' },
  { id: 4, targetStep: 5, label: 'Revisão' }
]

const activeVisualStepId = computed(() => {
  if (currentStep.value === 1) return 1
  if (currentStep.value === 2) return 2
  if (currentStep.value === 3 || currentStep.value === 4) return 3
  return 4
})

const customerName = ref('Marina Costa Navegante')
const customerEmail = ref('marina.navegante@exemplo.com.br')
const customerCpf = ref('111.222.333-44')
const customerPhone = ref('(71) 99812-3456')
const checkoutMode = ref<'GUEST' | 'ACCOUNT'>('GUEST')
const lgpdConsent = ref(true)

const cep = ref(cartStore.shippingCep || '40140-130')
const street = ref('Avenida Oceânica')
const number = ref('240')
const complement = ref('Apto 502')
const neighborhood = ref('Barra')
const city = ref('Salvador')
const state = ref('BA')
const isSearchingCep = ref(false)
const billingSameAsShipping = ref(true)

const shippingOptions = ref<ShippingOption[]>([])
const selectedShipping = ref<ShippingOption | null>(cartStore.selectedShipping)

const paymentMethod = ref<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')

const cardNumber = ref('4532 0000 1111 2222')
const cardHolder = ref('MARINA C NAVEGANTE')
const cardExpiry = ref('12/29')
const cardCvv = ref('789')
const installments = ref('3')
const isCardFlipped = ref(false)

const couponCode = ref(cartStore.couponCode || 'MAR10')
const discountPercent = ref(10)
const isCouponApplied = ref(true)
const termsAccepted = ref(true)

const isSubmitting = ref(false)
const orderNumber = ref('LOM-849201')
const authProtocol = ref('AUTH-3DS-849201-BR')

const maskedCardDisplay = computed(() => {
  const clean = cardNumber.value.replace(/\D/g, '')
  const last4 = clean.slice(-4) || '2222'
  const brand = clean.startsWith('5') ? 'Mastercard' : clean.startsWith('6') ? 'Elo' : 'Visa'
  return `${brand} •••• ${last4}`
})

const discountAmount = computed(() => {
  if (!isCouponApplied.value) return 0
  return (cartStore.subtotal * discountPercent.value) / 100
})

const shippingAmount = computed(() => selectedShipping.value?.price || 29.9)

const finalTotal = computed(() => {
  return Math.max(0, cartStore.subtotal + shippingAmount.value - discountAmount.value)
})

const totalFormatted = computed(() => `R$ ${finalTotal.value.toFixed(2).replace('.', ',')}`)

const activeOrderForDisplay = computed<Order>(() => {
  if (createdOrder.value) {
    return createdOrder.value
  }
  const fallbackItemProduct = cartStore.items[0]?.product || mockProducts[0]!
  return (
    ordersStore.orders[0] ||
    mockOrders[0] || {
      id: 'order-demo-849201',
      orderNumber: orderNumber.value,
      trackingCode: 'LOM-BR-849201BR',
      customer: {
        name: customerName.value,
        email: customerEmail.value,
        phone: customerPhone.value,
        cpf: customerCpf.value
      },
      shippingAddress: {
        cep: cep.value,
        street: street.value,
        number: number.value,
        complement: complement.value,
        neighborhood: neighborhood.value,
        city: city.value,
        state: state.value
      },
      items:
        cartStore.items.length > 0
          ? cartStore.items
          : [
              {
                id: 'demo-item-1',
                product: fallbackItemProduct,
                quantity: 1,
                customization: {
                  glassType: 'Fosco Sea Glass',
                  recipientName: 'Para Marina Costa Navegante',
                  giftMessage: 'Que a calmaria do mar acompanhe cada novo dia.'
                },
                addedAt: new Date().toISOString()
              }
            ],
      shippingOption: selectedShipping.value || {
        id: 'pac-seguro',
        name: 'Entrega Padrão Marítima (PAC Protegido)',
        carrier: 'Correios com Seguro Vidro',
        price: 29.9,
        estimatedDays: 7,
        isFragileProtected: true
      },
      paymentMethod: paymentMethod.value,
      subtotal: cartStore.subtotal || 89.9,
      shippingTotal: shippingAmount.value,
      discount: discountAmount.value,
      total: finalTotal.value || 107.8,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      trackingEvents: [],
      certificates: []
    }
  )
})

function ensureCartHasSampleItem() {
  if (cartStore.items.length === 0 && currentStep.value <= 6) {
    const sample = mockProducts[1] || mockProducts[0]
    if (sample) {
      cartStore.addItem(sample, {
        glassType: 'Fosco Sea Glass',
        corkType: 'Rolha de Cortiça com Lacre Dourado Solar',
        recipientName: 'Para Marina Costa Navegante',
        giftMessage: 'Que a calmaria das águas de Fernando de Noronha acompanhe cada novo dia.',
        dedicationText: 'Que a calmaria das águas de Fernando de Noronha acompanhe cada novo dia.',
        includeCollectorCertificate: true
      })
      cartStore.closeDrawer()
    }
  }
}

function fillSavedProfile() {
  customerName.value = demoUser.name
  customerEmail.value = demoUser.email
  customerPhone.value = demoUser.phone || '(71) 99812-3456'
  customerCpf.value = demoUser.cpf || '111.222.333-44'
  toast.success('Dados do seu perfil carregados.')
}

function goToStep(step: number) {
  currentStep.value = step
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function searchCep() {
  isSearchingCep.value = true
  try {
    const result = await orderService.lookupShippingAndAddress(cep.value)
    shippingOptions.value = result.options
    selectedShipping.value =
      result.options.find((o) => o.id === selectedShipping.value?.id) || result.options[0] || null
    if (result.address.city && result.address.city !== 'Sua Cidade') {
      city.value = result.address.city
    }
    if (result.address.state) {
      state.value = result.address.state
    }
    if (result.address.street) {
      street.value = result.address.street
    }
    if (result.address.neighborhood) {
      neighborhood.value = result.address.neighborhood
    }
    cartStore.setShipping(cep.value, selectedShipping.value)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao consultar CEP.'
    toast.error(message)
  } finally {
    isSearchingCep.value = false
  }
}

function applyCoupon() {
  if (
    couponCode.value.trim().toUpperCase() === 'MAR10' ||
    couponCode.value.trim().toUpperCase() === 'LEVEOMAR'
  ) {
    discountPercent.value = 10
    isCouponApplied.value = true
    cartStore.couponCode = couponCode.value.trim().toUpperCase()
    toast.success('Cupom de 10% aplicado com sucesso!')
  } else {
    toast.error('Cupom inválido. Tente o código "MAR10".')
  }
}

function copyPixKey() {
  navigator.clipboard.writeText(
    '00020126360014BR.GOV.BCB.PIX0114+55719981234565204000053039865404189.905802BR5910LEVE O MAR'
  )
  toast.success('Código Pix Copia e Cola copiado para a área de transferência!')
}

async function finalizeOrder(verifiedOtpCode?: string) {
  isSubmitting.value = true
  try {
    if (verifiedOtpCode) {
      authProtocol.value = `AUTH-3DS-${verifiedOtpCode}-BR`
    }

    const itemsToOrder =
      cartStore.items.length > 0
        ? [...cartStore.items]
        : activeOrderForDisplay.value.items

    const newOrder = await orderService.createOrder({
      customer: {
        name: customerName.value || 'Marina Costa Navegante',
        email: customerEmail.value || 'marina.navegante@exemplo.com.br',
        phone: customerPhone.value || '(71) 99812-3456',
        cpf: customerCpf.value || '111.222.333-44'
      },
      shippingAddress: {
        cep: cep.value,
        street: street.value,
        number: number.value,
        complement: complement.value,
        neighborhood: neighborhood.value,
        city: city.value,
        state: state.value
      },
      items: itemsToOrder,
      shippingOption: selectedShipping.value || {
        id: 'pac-seguro',
        name: 'Entrega Padrão Marítima (PAC Protegido)',
        carrier: 'Correios com Seguro Vidro',
        price: 29.9,
        estimatedDays: 7,
        isFragileProtected: true
      },
      paymentMethod: paymentMethod.value,
      subtotal: cartStore.subtotal || activeOrderForDisplay.value.subtotal,
      shippingTotal: shippingAmount.value,
      discount: discountAmount.value,
      total: finalTotal.value || activeOrderForDisplay.value.total
    })

    createdOrder.value = newOrder
    orderNumber.value = newOrder.orderNumber
    ordersStore.addOrder(newOrder)
    currentStep.value = 7

    analytics.track('complete_purchase', {
      orderNumber: newOrder.orderNumber,
      total: newOrder.total,
      subtotal: newOrder.subtotal,
      paymentMethod: paymentMethod.value,
      itemsCount: newOrder.items.length,
      city: newOrder.shippingAddress.city,
      state: newOrder.shippingAddress.state,
      authProtocol: authProtocol.value
    })

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#0B3C5D', '#E86A58', '#F59E0B', '#05BFDB']
      })
    } catch {
      // Ignora erro de canvas em ambiente de teste JSDOM
    }
  } catch {
    toast.error('Erro ao processar pedido. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => route.query.step,
  (stepParam) => {
    const parsed = Number(stepParam)
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 8) {
      currentStep.value = parsed
      ensureCartHasSampleItem()
    }
  },
  { immediate: true }
)

onMounted(() => {
  ensureCartHasSampleItem()
  if (authStore.user) {
    customerName.value = authStore.user.name
    customerEmail.value = authStore.user.email
    customerPhone.value = authStore.user.phone || '(71) 99812-3456'
    customerCpf.value = authStore.user.cpf || '111.222.333-44'
  }
  searchCep()
})
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EE] text-[#0A2B42]">
    <header class="bg-white border-b border-[#E6E1D6] py-4 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <RouterLink to="/" class="flex flex-col select-none">
          <span class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">Leve o Mar</span>
          <span class="text-[8px] font-bold tracking-[0.25em] text-[#E86A58] uppercase -mt-0.5">
            Checkout Seguro
          </span>
        </RouterLink>

        <nav
          v-if="currentStep <= 6"
          aria-label="Etapas do Checkout"
          class="flex items-center gap-2 sm:gap-3"
        >
          <ol class="flex items-center gap-1.5 sm:gap-2">
            <li v-for="step in mainCheckoutSteps" :key="step.id" class="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                :aria-current="activeVisualStepId === step.id ? 'step' : undefined"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                :class="
                  activeVisualStepId === step.id
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] shadow-sm'
                    : activeVisualStepId > step.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#F7F4EE] text-[#5A738E] border-[#E6E1D6] hover:text-[#0A2B42]'
                "
                @click="goToStep(step.targetStep)"
              >
                <span
                  class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono"
                  :class="activeVisualStepId === step.id ? 'bg-white/20 text-white' : 'bg-black/10'"
                >
                  {{ step.id }}
                </span>
                <span class="hidden sm:inline">{{ step.label }}</span>
              </button>
            </li>
          </ol>
        </nav>

        <div class="flex items-center gap-2 text-xs font-semibold text-[#0B3C5D] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#E6E1D6]">
          <Lock :size="14" class="text-[#F59E0B]" />
          <span>Ambiente Protegido SSL 256-bit</span>
        </div>
      </div>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="currentStep === 8">
        <OrderConfirmationEmail
          :order="activeOrderForDisplay"
          :masked-card="maskedCardDisplay"
          :auth-protocol="authProtocol"
          @back-to-success="goToStep(7)"
        />
      </div>

      <div
        v-else-if="currentStep === 7"
        class="max-w-2xl mx-auto card-maritimo p-8 sm:p-10 text-center space-y-6 bg-white animate-fade-in"
      >
        <div class="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 :size="42" />
        </div>

        <div class="space-y-1">
          <span class="text-xs font-bold tracking-widest text-emerald-700 uppercase block">
            Pedido Confirmado
          </span>
          <h1 class="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#0A2B42]">
            Pagamento Aprovado com Sucesso!
          </h1>
          <p class="text-xs sm:text-sm text-[#5A738E]">
            O comprovante e o certificado de autenticidade foram enviados para
            <strong class="text-[#0A2B42]">{{ customerEmail }}</strong>.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div class="p-3.5 bg-[#F7F4EE] rounded-2xl border border-[#E6E1D6]">
            <span class="text-[10px] text-[#5A738E] uppercase font-bold block">Número do Pedido</span>
            <span class="font-mono text-base font-extrabold text-[#0B3C5D]">{{ activeOrderForDisplay.orderNumber }}</span>
          </div>
          <div class="p-3.5 bg-[#F7F4EE] rounded-2xl border border-[#E6E1D6]">
            <span class="text-[10px] text-[#5A738E] uppercase font-bold block">Autenticação 3D Secure</span>
            <span class="font-mono text-xs font-bold text-emerald-700">{{ authProtocol }}</span>
          </div>
          <div class="p-3.5 bg-[#F7F4EE] rounded-2xl border border-[#E6E1D6]">
            <span class="text-[10px] text-[#5A738E] uppercase font-bold block">Código de Rastreamento</span>
            <span class="font-mono text-xs font-bold text-[#0A2B42]">{{ activeOrderForDisplay.trackingCode }}</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-[#EBE7DE]/60 border border-[#D6CFC0] text-xs text-[#5A738E] text-left space-y-1.5">
          <div class="flex items-center justify-between font-bold text-[#0A2B42]">
            <span class="flex items-center gap-1.5">
              <ShieldCheck :size="16" class="text-[#0B3C5D]" />
              <span>Garantia de Envio Protegido Ativa</span>
            </span>
            <span class="text-emerald-700">{{ totalFormatted }}</span>
          </div>
          <p>
            Pagamento aprovado via <strong>{{ maskedCardDisplay }}</strong>. Sua garrafa está sendo preparada artesanalmente com lacre de cera naval e embalagem antiimpacto.
          </p>
        </div>

        <div class="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            class="px-6 py-3.5 bg-[#E86A58] hover:bg-[#d45947] text-white text-xs font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            @click="goToStep(8)"
          >
            <Mail :size="16" />
            <span>Visualizar E-mail de Confirmação</span>
          </button>

          <RouterLink
            :to="`/rastreio/${activeOrderForDisplay.trackingCode}`"
            class="px-6 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Truck :size="16" />
            <span>Acompanhar Expedição</span>
          </RouterLink>

          <RouterLink
            to="/conta?tab=pedidos"
            class="px-5 py-3.5 border border-[#0B3C5D] text-[#0B3C5D] hover:bg-[#0B3C5D] hover:text-white text-xs font-bold rounded-full transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Package :size="16" />
            <span>Meus Pedidos</span>
          </RouterLink>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 space-y-6">
          <section
            v-if="currentStep === 1"
            aria-labelledby="step-identificacao-heading"
            class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6E1D6]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#E86A58] block">
                  Dados Pessoais
                </span>
                <h1 id="step-identificacao-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
                  Identificação do Cliente
                </h1>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
                :class="
                  checkoutMode === 'GUEST'
                    ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm'
                    : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                "
                @click="checkoutMode = 'GUEST'"
              >
                <span class="text-xs font-bold text-[#0A2B42] block">Compra Rápida (Sem Senha)</span>
                <span class="text-[11px] text-[#5A738E] block mt-0.5">
                  Informe apenas os dados essenciais para emissão da Nota Fiscal e entrega.
                </span>
              </button>

              <button
                type="button"
                class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
                :class="
                  checkoutMode === 'ACCOUNT'
                    ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm'
                    : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                "
                @click="checkoutMode = 'ACCOUNT'; fillSavedProfile()"
              >
                <span class="text-xs font-bold text-[#0A2B42] block">Conta de Colecionador</span>
                <span class="text-[11px] text-[#5A738E] block mt-0.5">
                  Acumule selos no Passaporte do Mar e acompanhe seus certificados.
                </span>
              </button>
            </div>

            <form class="space-y-4" @submit.prevent="goToStep(2)">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="checkout-name" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    id="checkout-name"
                    v-model="customerName"
                    name="name"
                    type="text"
                    autocomplete="name"
                    required
                    placeholder="Marina Costa Navegante"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label for="checkout-email" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    E-mail para Confirmação e Rastreio *
                  </label>
                  <input
                    id="checkout-email"
                    v-model="customerEmail"
                    name="email"
                    type="email"
                    autocomplete="email"
                    autocorrect="off"
                    autocapitalize="none"
                    spellcheck="false"
                    required
                    placeholder="marina.navegante@exemplo.com.br"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label for="checkout-phone" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    id="checkout-phone"
                    v-model="customerPhone"
                    name="phone"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    required
                    placeholder="(71) 99812-3456"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label for="checkout-cpf" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    CPF (para emissão de Nota Fiscal) *
                  </label>
                  <input
                    id="checkout-cpf"
                    v-model="customerCpf"
                    name="cpf"
                    type="text"
                    inputmode="numeric"
                    required
                    placeholder="111.222.333-44"
                    class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>
              </div>

              <div class="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] space-y-2">
                <label class="flex items-start gap-2.5 text-xs text-[#0A2B42] cursor-pointer">
                  <input
                    v-model="lgpdConsent"
                    type="checkbox"
                    required
                    class="mt-0.5 rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
                  />
                  <span>
                    Seus dados estão protegidos conforme a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> e serão utilizados exclusivamente para emissão da Nota Fiscal e envio do pedido.
                  </span>
                </label>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Entrega</span>
                  <ArrowRight :size="16" />
                </button>
              </div>
            </form>
          </section>

          <section
            v-else-if="currentStep === 2"
            aria-labelledby="step-endereco-heading"
            class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
          >
            <div class="flex items-center justify-between pb-4 border-b border-[#E6E1D6]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#E86A58] block">
                  Logística Especializada
                </span>
                <h1 id="step-endereco-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
                  Endereço e Entrega
                </h1>
              </div>
            </div>

            <form class="space-y-5" @submit.prevent="goToStep(3)">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div class="sm:col-span-6">
                  <label for="checkout-cep" class="text-xs font-semibold text-[#5A738E] block mb-1">CEP de Entrega *</label>
                  <div class="flex gap-2">
                    <input
                      id="checkout-cep"
                      v-model="cep"
                      name="cep"
                      type="text"
                      inputmode="numeric"
                      autocomplete="shipping postal-code"
                      required
                      placeholder="40140-130"
                      class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                    />
                    <button
                      type="button"
                      class="px-4 py-2 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl hover:bg-[#0A2B42] cursor-pointer"
                      @click="searchCep"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                <div class="sm:col-span-6">
                  <label for="checkout-city-uf" class="text-xs font-semibold text-[#5A738E] block mb-1">Cidade / UF</label>
                  <input
                    id="checkout-city-uf"
                    :value="`${city} - ${state}`"
                    readonly
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#EBE7DE]/70 border border-[#D6CFC0] text-[#0A2B42] font-semibold"
                  />
                </div>

                <div class="sm:col-span-8">
                  <label for="checkout-street" class="text-xs font-semibold text-[#5A738E] block mb-1">Rua / Avenida *</label>
                  <input
                    id="checkout-street"
                    v-model="street"
                    name="street"
                    type="text"
                    autocomplete="shipping address-line1"
                    required
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                  />
                </div>

                <div class="sm:col-span-4">
                  <label for="checkout-number" class="text-xs font-semibold text-[#5A738E] block mb-1">Número *</label>
                  <input
                    id="checkout-number"
                    v-model="number"
                    name="number"
                    type="text"
                    required
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                  />
                </div>

                <div class="sm:col-span-6">
                  <label for="checkout-neighborhood" class="text-xs font-semibold text-[#5A738E] block mb-1">Bairro *</label>
                  <input
                    id="checkout-neighborhood"
                    v-model="neighborhood"
                    name="neighborhood"
                    type="text"
                    required
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                  />
                </div>

                <div class="sm:col-span-6">
                  <label for="checkout-complement" class="text-xs font-semibold text-[#5A738E] block mb-1">Complemento</label>
                  <input
                    id="checkout-complement"
                    v-model="complement"
                    name="complement"
                    type="text"
                    autocomplete="shipping address-line2"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                  />
                </div>
              </div>

              <fieldset class="pt-2 space-y-2">
                <legend class="text-xs font-bold text-[#0A2B42] mb-2">
                  Opções de Frete com Seguro Vidro:
                </legend>
                <label
                  v-for="opt in shippingOptions"
                  :key="opt.id"
                  :class="[
                    'p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all',
                    selectedShipping?.id === opt.id
                      ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm'
                      : 'border-[#E6E1D6] hover:bg-[#FAF8F5]'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <input
                      type="radio"
                      name="checkout-shipping-opt"
                      :checked="selectedShipping?.id === opt.id"
                      class="text-[#0B3C5D] focus:ring-[#0B3C5D]"
                      @change="selectedShipping = opt; cartStore.setShipping(cep, opt)"
                    />
                    <div>
                      <div class="text-xs font-bold text-[#0A2B42]">{{ opt.name }}</div>
                      <div class="text-[11px] text-[#5A738E]">
                        Prazo estimado: <strong>{{ opt.estimatedDays }} dias úteis</strong> · {{ opt.carrier }}
                      </div>
                    </div>
                  </div>

                  <span class="text-xs font-bold text-[#0B3C5D]">
                    R$ {{ opt.price.toFixed(2).replace('.', ',') }}
                  </span>
                </label>
              </fieldset>

              <div class="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6]">
                <label class="flex items-center gap-2.5 text-xs font-semibold text-[#0A2B42] cursor-pointer">
                  <input
                    v-model="billingSameAsShipping"
                    type="checkbox"
                    class="rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
                  />
                  <span>
                    O endereço de cobrança da fatura do cartão é o mesmo endereço de entrega acima.
                  </span>
                </label>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  class="px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
                  @click="goToStep(1)"
                >
                  <ArrowLeft :size="15" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Pagamento</span>
                  <ArrowRight :size="16" />
                </button>
              </div>
            </form>
          </section>

          <section
            v-else-if="currentStep === 3"
            aria-labelledby="step-metodo-pagamento-heading"
            class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
          >
            <div class="flex items-center justify-between pb-4 border-b border-[#E6E1D6]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#E86A58] block">
                  Opções de Pagamento
                </span>
                <h1 id="step-metodo-pagamento-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
                  Escolha a Forma de Pagamento
                </h1>
              </div>
            </div>

            <fieldset class="space-y-3">
              <legend class="text-xs font-bold text-[#5A738E] mb-2">
                Selecione como prefere pagar o seu pedido:
              </legend>

              <label
                class="p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition-all"
                :class="
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-[#0B3C5D] bg-[#F7F4EE] ring-1 ring-[#0B3C5D] shadow-sm'
                    : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                "
              >
                <div class="flex items-start gap-3">
                  <input
                    v-model="paymentMethod"
                    type="radio"
                    name="payment-method-choice"
                    value="CREDIT_CARD"
                    class="mt-1 text-[#0B3C5D] focus:ring-[#0B3C5D]"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <CreditCard :size="16" class="text-[#0B3C5D]" />
                      <span class="text-sm font-bold text-[#0A2B42]">Cartão de Crédito (Até 6x sem juros)</span>
                    </div>
                    <p class="text-xs text-[#5A738E] mt-1">
                      Aceitamos Visa, Mastercard, Elo e Amex com confirmação imediata e proteção 3D Secure.
                    </p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#0B3C5D] text-white flex-shrink-0">
                  Aprovação Imediata
                </span>
              </label>

              <label
                class="p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition-all"
                :class="
                  paymentMethod === 'PIX'
                    ? 'border-[#0B3C5D] bg-[#F7F4EE] ring-1 ring-[#0B3C5D] shadow-sm'
                    : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                "
              >
                <div class="flex items-start gap-3">
                  <input
                    v-model="paymentMethod"
                    type="radio"
                    name="payment-method-choice"
                    value="PIX"
                    class="mt-1 text-[#0B3C5D] focus:ring-[#0B3C5D]"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <QrCode :size="16" class="text-[#0B3C5D]" />
                      <span class="text-sm font-bold text-[#0A2B42]">Pix Instantâneo</span>
                    </div>
                    <p class="text-xs text-[#5A738E] mt-1">
                      Pagamento rápido via QR Code ou chave Copia e Cola com liberação imediata do pedido.
                    </p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">
                  Instantâneo 24/7
                </span>
              </label>

              <label
                class="p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition-all"
                :class="
                  paymentMethod === 'BOLETO'
                    ? 'border-[#0B3C5D] bg-[#F7F4EE] ring-1 ring-[#0B3C5D] shadow-sm'
                    : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                "
              >
                <div class="flex items-start gap-3">
                  <input
                    v-model="paymentMethod"
                    type="radio"
                    name="payment-method-choice"
                    value="BOLETO"
                    class="mt-1 text-[#0B3C5D] focus:ring-[#0B3C5D]"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <FileText :size="16" class="text-[#0B3C5D]" />
                      <span class="text-sm font-bold text-[#0A2B42]">Boleto Bancário</span>
                    </div>
                    <p class="text-xs text-[#5A738E] mt-1">
                      Pagamento à vista em qualquer banco ou lotérica. Compensação em até 1 dia útil.
                    </p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#EBE7DE] text-[#5A738E] flex-shrink-0">
                  1 dia útil
                </span>
              </label>
            </fieldset>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div class="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] text-xs flex items-center gap-2">
                <Lock :size="15" class="text-[#0B3C5D] flex-shrink-0" />
                <span class="text-[#5A738E]">Criptografia TLS 1.3</span>
              </div>
              <div class="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] text-xs flex items-center gap-2">
                <ShieldCheck :size="15" class="text-[#0B3C5D] flex-shrink-0" />
                <span class="text-[#5A738E]">Padrão PCI-DSS</span>
              </div>
              <div class="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] text-xs flex items-center gap-2">
                <CheckCircle2 :size="15" class="text-emerald-600 flex-shrink-0" />
                <span class="text-[#5A738E]">Compra Garantida</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button
                type="button"
                class="px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
                @click="goToStep(2)"
              >
                <ArrowLeft :size="15" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                @click="goToStep(4)"
              >
                <span>Preencher Dados do Pagamento</span>
                <ArrowRight :size="16" />
              </button>
            </div>
          </section>

          <section
            v-else-if="currentStep === 4"
            aria-labelledby="step-dados-pagamento-heading"
            class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6E1D6]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#E86A58] block">
                  Pagamento Seguro
                </span>
                <h1 id="step-dados-pagamento-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
                  Dados do Pagamento
                </h1>
              </div>

              <button
                type="button"
                class="text-xs font-bold text-[#0B3C5D] hover:underline cursor-pointer"
                @click="goToStep(3)"
              >
                Trocar forma de pagamento
              </button>
            </div>

            <form v-if="paymentMethod === 'CREDIT_CARD'" class="space-y-6" @submit.prevent="goToStep(5)">
              <InteractiveCreditCard
                :card-number="cardNumber"
                :card-holder="cardHolder"
                :card-expiry="cardExpiry"
                :card-cvv="cardCvv"
                :is-flipped="isCardFlipped"
              />

              <div class="space-y-3">
                <div>
                  <label for="cc-number-input" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    Número do Cartão *
                  </label>
                  <input
                    id="cc-number-input"
                    v-model="cardNumber"
                    name="cc-number"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    maxlength="19"
                    required
                    placeholder="4532 0000 1111 2222"
                    class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label for="cc-holder-input" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    Nome Impresso no Cartão *
                  </label>
                  <input
                    id="cc-holder-input"
                    v-model="cardHolder"
                    name="cc-name"
                    type="text"
                    autocomplete="cc-name"
                    required
                    placeholder="MARINA C NAVEGANTE"
                    class="w-full text-xs uppercase px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="cc-expiry-input" class="text-xs font-semibold text-[#5A738E] block mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      id="cc-expiry-input"
                      v-model="cardExpiry"
                      name="cc-exp"
                      type="text"
                      inputmode="numeric"
                      autocomplete="cc-exp"
                      maxlength="5"
                      required
                      placeholder="12/29"
                      class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label for="cc-cvv-input" class="text-xs font-semibold text-[#5A738E] block mb-1">
                      CVV (Código de Segurança) *
                    </label>
                    <input
                      id="cc-cvv-input"
                      v-model="cardCvv"
                      name="cc-csc"
                      type="text"
                      inputmode="numeric"
                      autocomplete="cc-csc"
                      maxlength="4"
                      required
                      placeholder="789"
                      class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                      @focus="isCardFlipped = true"
                      @blur="isCardFlipped = false"
                    />
                  </div>
                </div>

                <div>
                  <label for="cc-installments" class="text-xs font-semibold text-[#5A738E] block mb-1">
                    Parcelamento
                  </label>
                  <select
                    id="cc-installments"
                    v-model="installments"
                    name="installments"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] text-[#0A2B42] font-semibold"
                  >
                    <option value="1">1x de R$ {{ finalTotal.toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="2">2x de R$ {{ (finalTotal / 2).toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="3">3x de R$ {{ (finalTotal / 3).toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="6">6x de R$ {{ (finalTotal / 6).toFixed(2).replace('.', ',') }} (sem juros)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  class="px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
                  @click="goToStep(3)"
                >
                  <ArrowLeft :size="15" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Revisar Pedido</span>
                  <ArrowRight :size="16" />
                </button>
              </div>
            </form>

            <div v-else-if="paymentMethod === 'PIX'" class="space-y-6">
              <div class="p-6 bg-[#F7F4EE] rounded-3xl border border-[#E6E1D6] text-center space-y-4">
                <span class="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider block">
                  QR Code Pix Instantâneo
                </span>
                <div class="w-44 h-44 bg-white p-3 rounded-2xl mx-auto border border-[#D6CFC0] shadow-md flex items-center justify-center">
                  <svg viewBox="0 0 100 100" class="w-full h-full text-[#0A2B42] fill-current">
                    <rect x="10" y="10" width="25" height="25" fill="#0B3C5D" />
                    <rect x="65" y="10" width="25" height="25" fill="#0B3C5D" />
                    <rect x="10" y="65" width="25" height="25" fill="#0B3C5D" />
                    <rect x="42" y="42" width="16" height="16" fill="#F59E0B" />
                    <rect x="40" y="15" width="10" height="20" fill="#0B3C5D" />
                    <rect x="15" y="45" width="20" height="10" fill="#0B3C5D" />
                    <rect x="65" y="55" width="20" height="30" fill="#0B3C5D" />
                    <rect x="45" y="70" width="15" height="15" fill="#0B3C5D" />
                  </svg>
                </div>

                <div class="space-y-2">
                  <p class="text-xs text-[#5A738E]">Escaneie o QR Code no aplicativo do seu banco ou copie o código:</p>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EBE7DE] text-[#0A2B42] border border-[#D6CFC0] rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                    @click="copyPixKey"
                  >
                    <Copy :size="14" />
                    <span>Copiar Código Pix (Copia e Cola)</span>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <button
                  type="button"
                  class="px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
                  @click="goToStep(3)"
                >
                  <ArrowLeft :size="15" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  @click="goToStep(5)"
                >
                  <span>Revisar Pedido</span>
                  <ArrowRight :size="16" />
                </button>
              </div>
            </div>

            <div v-else class="space-y-6">
              <div class="p-6 bg-[#F7F4EE] rounded-3xl border border-[#E6E1D6] text-center space-y-3">
                <span class="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider block">
                  Boleto Bancário Registrado
                </span>
                <p class="text-xs text-[#5A738E]">Vencimento em 3 dias úteis. Linha digitável:</p>
                <div class="p-3 bg-white rounded-xl border border-[#D6CFC0] font-mono text-xs text-[#0A2B42] select-all">
                  23793.38128 60000.000003 01000.654321 9 950000000000
                </div>
              </div>

              <div class="flex items-center justify-between">
                <button
                  type="button"
                  class="px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center gap-1.5 cursor-pointer"
                  @click="goToStep(3)"
                >
                  <ArrowLeft :size="15" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  class="px-7 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  @click="goToStep(5)"
                >
                  <span>Revisar Pedido</span>
                  <ArrowRight :size="16" />
                </button>
              </div>
            </div>
          </section>

          <section
            v-else-if="currentStep === 5"
            aria-labelledby="step-revisao-heading"
            class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
          >
            <div class="flex items-center justify-between pb-4 border-b border-[#E6E1D6]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#E86A58] block">
                  Conferência Final
                </span>
                <h1 id="step-revisao-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
                  Revisão do Pedido
                </h1>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#0A2B42] uppercase tracking-wider text-[10px]">Dados do Cliente</span>
                  <button
                    type="button"
                    class="text-[#0B3C5D] hover:underline inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                    @click="goToStep(1)"
                  >
                    <Edit3 :size="11" />
                    <span>Editar</span>
                  </button>
                </div>
                <p class="font-bold text-[#0A2B42]">{{ customerName }}</p>
                <p class="text-[#5A738E]">{{ customerEmail }}</p>
                <p class="text-[#5A738E]">CPF: {{ customerCpf }} · Tel: {{ customerPhone }}</p>
              </div>

              <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#0A2B42] uppercase tracking-wider text-[10px]">Endereço &amp; Entrega</span>
                  <button
                    type="button"
                    class="text-[#0B3C5D] hover:underline inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                    @click="goToStep(2)"
                  >
                    <Edit3 :size="11" />
                    <span>Editar</span>
                  </button>
                </div>
                <p class="font-bold text-[#0A2B42]">{{ street }}, {{ number }} {{ complement ? `(${complement})` : '' }}</p>
                <p class="text-[#5A738E]">{{ neighborhood }} · {{ city }} - {{ state }} · CEP {{ cep }}</p>
                <p class="text-[#0B3C5D] font-semibold">
                  {{ selectedShipping?.name || 'PAC Seguro Vidro' }} (Até {{ selectedShipping?.estimatedDays || 7 }} dias úteis)
                </p>
              </div>

              <div class="sm:col-span-2 p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] flex flex-wrap items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <span class="font-bold text-[#0A2B42] uppercase tracking-wider text-[10px] block">
                    Forma de Pagamento
                  </span>
                  <p class="font-bold text-[#0A2B42]">
                    <template v-if="paymentMethod === 'CREDIT_CARD'">
                      Cartão de Crédito {{ maskedCardDisplay }} · Titular {{ cardHolder }} · {{ installments }}x sem juros
                    </template>
                    <template v-else-if="paymentMethod === 'PIX'">
                      Pix Instantâneo · Aprovação Imediata
                    </template>
                    <template v-else>
                      Boleto Bancário · Vencimento em 3 dias úteis
                    </template>
                  </p>
                </div>
                <button
                  type="button"
                  class="text-[#0B3C5D] hover:underline inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  @click="goToStep(4)"
                >
                  <Edit3 :size="11" />
                  <span>Alterar</span>
                </button>
              </div>
            </div>

            <div class="space-y-2.5">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#0A2B42]">
                Itens do Pedido
              </h2>
              <div
                v-for="item in activeOrderForDisplay.items"
                :key="item.id"
                class="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <img
                    :src="item.product.bottleImage"
                    :alt="item.product.beachName"
                    class="w-12 h-14 object-cover rounded-xl border border-[#D6CFC0] flex-shrink-0"
                  />
                  <div class="min-w-0 text-xs">
                    <p class="font-serif-editorial font-bold text-[#0A2B42] truncate">
                      {{ item.product.name }} ({{ item.product.beachName }} - {{ item.product.uf }})
                    </p>
                    <p class="text-[11px] text-[#5A738E]">
                      Qtd: {{ item.quantity }}
                      <span v-if="item.customization?.glassType"> · Acabamento: {{ item.customization.glassType }}</span>
                    </p>
                    <p v-if="item.customization?.recipientName" class="text-[11px] text-[#E86A58] italic truncate">
                      Dedicatória: {{ item.customization.recipientName }} — "{{ item.customization.giftMessage || item.customization.dedicationText }}"
                    </p>
                  </div>
                </div>
                <span class="text-xs font-bold text-[#0B3C5D] flex-shrink-0">
                  R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-[#EBE7DE]/60 border border-[#D6CFC0] space-y-2 text-xs text-[#0A2B42]">
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input
                  v-model="termsAccepted"
                  type="checkbox"
                  class="mt-0.5 rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
                />
                <span>
                  Confirmo que revisei os itens, endereço de entrega e valores discriminados acima. Troca ou devolução gratuita garantida em até 7 dias corridos após o recebimento.
                </span>
              </label>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                class="w-full sm:w-auto px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                @click="goToStep(4)"
              >
                <ArrowLeft :size="15" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                :disabled="!termsAccepted"
                class="w-full sm:w-auto px-8 py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold rounded-full shadow-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                @click="goToStep(6)"
              >
                <ShieldCheck :size="18" />
                <span>Finalizar Compra ({{ totalFormatted }})</span>
              </button>
            </div>
          </section>

          <SecurityVerificationPanel
            v-else-if="currentStep === 6"
            :customer-name="customerName"
            :customer-phone="customerPhone"
            :customer-cep="cep"
            :masked-card="maskedCardDisplay"
            :total-formatted="totalFormatted"
            :payment-method="paymentMethod"
            :is-submitting="isSubmitting"
            @back="goToStep(5)"
            @verified="finalizeOrder"
          />
        </div>

        <aside class="lg:col-span-5 space-y-6">
          <div class="card-maritimo p-6 sm:p-8 bg-white space-y-6 sticky top-28">
            <div class="flex items-center justify-between pb-3 border-b border-[#E6E1D6]">
              <h2 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">
                Resumo do Pedido
              </h2>
              <RouterLink
                to="/carrinho"
                class="text-[11px] font-bold text-[#0B3C5D] hover:underline inline-flex items-center gap-1"
              >
                <Eye :size="12" />
                <span>Editar Sacola</span>
              </RouterLink>
            </div>

            <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
              <div
                v-for="item in activeOrderForDisplay.items"
                :key="item.id"
                class="flex items-center gap-3 p-2.5 rounded-xl bg-[#F7F4EE] border border-[#EBE7DE]"
              >
                <img
                  :src="item.product.bottleImage"
                  :alt="item.product.beachName"
                  class="w-12 h-12 object-cover rounded-lg border border-[#D6CFC0]"
                />
                <div class="flex-1 min-w-0">
                  <div class="font-serif-editorial text-xs font-bold text-[#0A2B42] truncate">
                    {{ item.product.beachName }}
                  </div>
                  <div class="text-[10px] text-[#5A738E]">
                    Qtd: {{ item.quantity }} · {{ item.product.uf }}
                    <span v-if="item.customization?.glassType"> · {{ item.customization.glassType }}</span>
                  </div>
                  <div v-if="item.customization?.recipientName" class="text-[9px] text-[#E86A58] italic truncate">
                    {{ item.customization.recipientName }}
                  </div>
                </div>
                <span class="text-xs font-bold text-[#0B3C5D]">
                  R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-[#F0EDE4] space-y-2">
              <label for="checkout-coupon" class="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">
                Cupom de Desconto
              </label>
              <div class="flex gap-2">
                <input
                  id="checkout-coupon"
                  v-model="couponCode"
                  type="text"
                  placeholder="Digite seu cupom"
                  class="w-full text-xs px-3 py-2 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] uppercase font-bold focus:outline-none"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl hover:bg-[#0A2B42] cursor-pointer"
                  @click="applyCoupon"
                >
                  Aplicar
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-[#F0EDE4] space-y-2 text-xs text-[#5A738E]">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-bold text-[#0A2B42]">
                  R$ {{ (cartStore.subtotal || activeOrderForDisplay.subtotal).toFixed(2).replace('.', ',') }}
                </span>
              </div>

              <div class="flex justify-between">
                <span>Frete ({{ selectedShipping?.name || 'PAC Protegido' }})</span>
                <span class="font-bold text-[#0B3C5D]">
                  R$ {{ shippingAmount.toFixed(2).replace('.', ',') }}
                </span>
              </div>

              <div v-if="isCouponApplied" class="flex justify-between text-[#E86A58] font-bold">
                <span>Desconto Cupom (10%)</span>
                <span>- R$ {{ discountAmount.toFixed(2).replace('.', ',') }}</span>
              </div>

              <div class="flex justify-between text-sm font-bold text-[#0A2B42] pt-3 border-t border-[#E6E1D6]">
                <span>Total</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#0B3C5D]">
                  {{ totalFormatted }}
                </span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] text-[11px] text-[#5A738E] flex items-center gap-2">
              <Sparkles :size="15" class="text-[#D97706] flex-shrink-0" />
              <span>Certificado de Autenticidade e embalagem antiimpacto inclusos gratuitamente.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
