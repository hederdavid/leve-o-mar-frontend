<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/orderService'
import { demoUser } from '@/services/authService'
import type { ShippingOption } from '@/types/cart'
import InteractiveCreditCard from '@/components/checkout/InteractiveCreditCard.vue'
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
  ShieldCheck,
  ChevronRight,
  User,
  ShoppingBag
} from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()

// Etapas do Checkout
const currentStep = ref<number>(1) // 1: Identificação, 2: Endereço/Frete, 3: Pagamento, 4: Sucesso

// Dados do Cliente
const customerName = ref('')
const customerEmail = ref('')
const customerCpf = ref('')
const customerPhone = ref('')

// Dados do Endereço
const cep = ref('45000-000')
const street = ref('Avenida Beira Mar')
const number = ref('1042')
const complement = ref('Apto 302')
const neighborhood = ref('Praia Nobre')
const city = ref('Vitória da Conquista')
const state = ref('BA')
const isSearchingCep = ref(false)

// Opções de Frete
const shippingOptions = ref<ShippingOption[]>([])
const selectedShipping = ref<ShippingOption | null>(null)

// Pagamento
const paymentMethod = ref<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')

// Dados do Cartão
const cardNumber = ref('')
const cardHolder = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const installments = ref('1')
const isCardFlipped = ref(false)

// Cupom de Desconto
const couponCode = ref('')
const discountPercent = ref(0)
const isCouponApplied = ref(false)

// Estado de Finalização
const isSubmitting = ref(false)
const orderNumber = ref('')

// Preencher com Conta Demo (1-Clique)
function fillDemoUser() {
  customerName.value = demoUser.name
  customerEmail.value = demoUser.email
  customerPhone.value = demoUser.phone || ''
  customerCpf.value = demoUser.cpf || ''
  toast.success('Dados do colecionador preenchidos automaticamente!')
  currentStep.value = 2
}

async function searchCep() {
  isSearchingCep.value = true
  try {
    const options = await orderService.calculateShipping(cep.value)
    shippingOptions.value = options
    selectedShipping.value = options[0] || null
    toast.success('Frete calculado com proteção de vidro!')
  } catch (err: any) {
    toast.error(err.message || 'Erro ao consultar CEP.')
  } finally {
    isSearchingCep.value = false
  }
}

function applyCoupon() {
  if (couponCode.value.trim().toUpperCase() === 'MAR10' || couponCode.value.trim().toUpperCase() === 'LEVEOMAR') {
    discountPercent.value = 10
    isCouponApplied.value = true
    toast.success('Cupom de 10% aplicado com sucesso!')
  } else {
    toast.error('Cupom inválido. Tente o código "MAR10".')
  }
}

function copyPixKey() {
  navigator.clipboard.writeText('00020126360014BR.GOV.BCB.PIX0114+55779999999995204000053039865404189.905802BR5910LEVE O MAR')
  toast.success('Código Pix Copia e Cola copiado para a área de transferência!')
}

// Cálculos de Totais
const discountAmount = computed(() => {
  if (!isCouponApplied.value) return 0
  return (cartStore.subtotal * discountPercent.value) / 100
})

const shippingAmount = computed(() => selectedShipping.value?.price || 0)

const finalTotal = computed(() => {
  return Math.max(0, cartStore.subtotal + shippingAmount.value - discountAmount.value)
})

async function finalizeOrder() {
  isSubmitting.value = true
  try {
    await orderService.createOrder({
      customer: {
        name: customerName.value || 'Colecionador do Mar',
        email: customerEmail.value || 'cliente@leveomar.com.br',
        phone: customerPhone.value || '',
        cpf: customerCpf.value || ''
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
      items: cartStore.items,
      shippingOption: selectedShipping.value || {
        id: 'pac-seguro',
        name: 'PAC Seguro Vidro',
        carrier: 'Correios',
        price: 24.9,
        estimatedDays: 6,
        isFragileProtected: true
      },
      paymentMethod: paymentMethod.value,
      subtotal: cartStore.subtotal,
      shippingTotal: shippingAmount.value,
      discount: discountAmount.value,
      total: finalTotal.value
    })

    orderNumber.value = `LOM-${Math.floor(100000 + Math.random() * 900000)}`
    currentStep.value = 4

    // Disparar celebração sensorial de confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#0B3C5D', '#E86A58', '#F59E0B', '#05BFDB']
    })

    cartStore.clearCart()
  } catch (err) {
    toast.error('Erro ao processar pedido. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  searchCep()
})
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EE] text-[#0A2B42]">
    
    <!-- Header de Checkout Seguro -->
    <header class="bg-white border-b border-[#E6E1D6] py-4 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <router-link to="/" class="flex flex-col select-none">
          <span class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">Leve o Mar</span>
          <span class="text-[8px] font-bold tracking-[0.25em] text-[#E86A58] uppercase -mt-0.5">Checkout Seguro</span>
        </router-link>

        <div class="flex items-center gap-2 text-xs font-semibold text-[#0B3C5D] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#E6E1D6]">
          <Lock :size="14" class="text-[#F59E0B]" />
          <span>Ambiente 100% Criptografado</span>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal do Checkout -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- TELA DE SUCESSO DO PEDIDO -->
      <div v-if="currentStep === 4" class="max-w-2xl mx-auto card-maritimo p-8 sm:p-12 text-center space-y-6 bg-white animate-fade-in">
        <div class="w-20 h-20 bg-[#F59E0B]/20 text-[#D97706] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Sparkles :size="40" />
        </div>

        <div>
          <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block">Compra Concluída com Sucesso</span>
          <h1 class="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#0A2B42] mt-1">
            Sua Coleção está a Caminho!
          </h1>
          <p class="text-xs sm:text-sm text-[#5A738E] mt-2">
            Enviamos a confirmação e o certificado digital para <strong>{{ customerEmail || 'seu e-mail' }}</strong>.
          </p>
        </div>

        <div class="p-4 bg-[#F7F4EE] rounded-2xl border border-[#E6E1D6] inline-block space-y-1">
          <div class="text-[11px] text-[#5A738E] uppercase tracking-wider font-semibold">Código do Pedido</div>
          <div class="font-mono text-xl font-bold text-[#0B3C5D] tracking-widest">{{ orderNumber }}</div>
        </div>

        <div class="p-4 rounded-2xl bg-[#EBE7DE]/50 border border-[#D6CFC0] text-xs text-[#5A738E] max-w-md mx-auto text-left space-y-2">
          <div class="flex items-center gap-2 font-bold text-[#0A2B42]">
            <ShieldCheck :size="16" class="text-[#0B3C5D]" />
            <span>Garantia de Envio de Vidro Protegido</span>
          </div>
          <p>
            Sua garrafa está sendo lacrada e embalada em casulo antiimpacto. O código de rastreamento dos Correios será atualizado em breve.
          </p>
        </div>

        <div class="pt-4">
          <router-link
            to="/"
            class="px-8 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow-lg transition-all inline-block"
          >
            Voltar para a Página Inicial
          </router-link>
        </div>
      </div>

      <!-- FLUXO NORMAL DE CHECKOUT EM 2 COLUNAS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Coluna Esquerda: Etapas do Formulário -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- ETAPA 1: Identificação do Colecionador -->
          <div class="card-maritimo p-6 sm:p-8 bg-white space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-[#E6E1D6]">
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-full bg-[#0B3C5D] text-white font-bold text-xs flex items-center justify-center">1</span>
                <h2 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">Identificação do Colecionador</h2>
              </div>

              <!-- Botão Preencher Demo -->
              <button
                type="button"
                class="text-[11px] font-bold text-[#E86A58] hover:underline cursor-pointer bg-[#FDF3F1] px-2.5 py-1 rounded-full border border-[#E86A58]/30"
                @click="fillDemoUser"
              >
                ⚡ Preencher Conta Demo
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">Nome Completo *</label>
                <input
                  v-model="customerName"
                  type="text"
                  placeholder="Ex: Heder Moreira David"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                />
              </div>

              <div>
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">E-mail para Rastreio *</label>
                <input
                  v-model="customerEmail"
                  type="email"
                  placeholder="Ex: seu@email.com"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                />
              </div>

              <div>
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">Telefone / WhatsApp *</label>
                <input
                  v-model="customerPhone"
                  type="tel"
                  placeholder="(77) 99999-9999"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                />
              </div>

              <div>
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">CPF (para nota fiscal) *</label>
                <input
                  v-model="customerCpf"
                  type="text"
                  placeholder="000.000.000-00"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                />
              </div>
            </div>
          </div>

          <!-- ETAPA 2: Endereço & Frete Seguro para Vidro -->
          <div class="card-maritimo p-6 sm:p-8 bg-white space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-[#E6E1D6]">
              <span class="w-7 h-7 rounded-full bg-[#0B3C5D] text-white font-bold text-xs flex items-center justify-center">2</span>
              <h2 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">Endereço & Entrega Protegida</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div class="sm:col-span-6">
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">CEP *</label>
                <div class="flex gap-2">
                  <input
                    v-model="cep"
                    type="text"
                    placeholder="45000-000"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                  <button
                    type="button"
                    class="px-4 py-2 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl hover:bg-[#0A2B42]"
                    @click="searchCep"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <div class="sm:col-span-6">
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">Cidade / UF</label>
                <input
                  :value="`${city} - ${state}`"
                  readonly
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#EBE7DE]/70 border border-[#D6CFC0] text-[#5A738E]"
                />
              </div>

              <div class="sm:col-span-8">
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">Rua / Avenida *</label>
                <input
                  v-model="street"
                  type="text"
                  placeholder="Rua..."
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                />
              </div>

              <div class="sm:col-span-4">
                <label class="text-xs font-semibold text-[#5A738E] block mb-1">Número *</label>
                <input
                  v-model="number"
                  type="text"
                  placeholder="123"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                />
              </div>
            </div>

            <!-- Seleção do Frete Seguro -->
            <div class="pt-2 space-y-2">
              <label class="text-xs font-bold text-[#0A2B42] block">Selecione o Frete para Itens Frágeis:</label>
              
              <div class="space-y-2">
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
                      :checked="selectedShipping?.id === opt.id"
                      class="text-[#0B3C5D] focus:ring-[#0B3C5D]"
                      @change="selectedShipping = opt"
                    />
                    <div>
                      <div class="text-xs font-bold text-[#0A2B42]">{{ opt.name }}</div>
                      <div class="text-[10px] text-[#5A738E]">Prazo estimado: {{ opt.estimatedDays }} dias úteis · {{ opt.carrier }}</div>
                    </div>
                  </div>

                  <span class="text-xs font-bold text-[#0B3C5D]">
                    R$ {{ opt.price.toFixed(2).replace('.', ',') }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- ETAPA 3: Método de Pagamento & Cartão 3D Interativo -->
          <div class="card-maritimo p-6 sm:p-8 bg-white space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-[#E6E1D6]">
              <span class="w-7 h-7 rounded-full bg-[#0B3C5D] text-white font-bold text-xs flex items-center justify-center">3</span>
              <h2 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">Forma de Pagamento</h2>
            </div>

            <!-- Abas de Pagamento (Cartão, Pix, Boleto) -->
            <div class="grid grid-cols-3 gap-3">
              <button
                type="button"
                :class="[
                  'py-3 px-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold',
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-md'
                    : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
                ]"
                @click="paymentMethod = 'CREDIT_CARD'"
              >
                <CreditCard :size="18" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                :class="[
                  'py-3 px-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold',
                  paymentMethod === 'PIX'
                    ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-md'
                    : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
                ]"
                @click="paymentMethod = 'PIX'"
              >
                <QrCode :size="18" />
                <span>Pix Instantâneo</span>
              </button>

              <button
                type="button"
                :class="[
                  'py-3 px-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold',
                  paymentMethod === 'BOLETO'
                    ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-md'
                    : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
                ]"
                @click="paymentMethod = 'BOLETO'"
              >
                <FileText :size="18" />
                <span>Boleto Bancário</span>
              </button>
            </div>

            <!-- Formulário: Cartão de Crédito com Cartão 3D -->
            <div v-if="paymentMethod === 'CREDIT_CARD'" class="space-y-6 pt-2">
              
              <!-- Cartão 3D Interativo que Gira no CVV -->
              <InteractiveCreditCard
                :card-number="cardNumber"
                :card-holder="cardHolder"
                :card-expiry="cardExpiry"
                :card-cvv="cardCvv"
                :is-flipped="isCardFlipped"
              />

              <div class="space-y-3">
                <div>
                  <label class="text-xs font-semibold text-[#5A738E] block mb-1">Número do Cartão</label>
                  <input
                    v-model="cardNumber"
                    type="text"
                    maxlength="19"
                    placeholder="4532 8901 2345 6789"
                    class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div>
                  <label class="text-xs font-semibold text-[#5A738E] block mb-1">Nome Impresso no Cartão</label>
                  <input
                    v-model="cardHolder"
                    type="text"
                    placeholder="Ex: HEDER M DAVID"
                    class="w-full text-xs uppercase px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs font-semibold text-[#5A738E] block mb-1">Validade</label>
                    <input
                      v-model="cardExpiry"
                      type="text"
                      maxlength="5"
                      placeholder="12/28"
                      class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-semibold text-[#5A738E] block mb-1">CVV (Código de Segurança)</label>
                    <input
                      v-model="cardCvv"
                      type="text"
                      maxlength="4"
                      placeholder="123"
                      class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                      @focus="isCardFlipped = true"
                      @blur="isCardFlipped = false"
                    />
                  </div>
                </div>

                <div>
                  <label class="text-xs font-semibold text-[#5A738E] block mb-1">Opções de Parcelamento</label>
                  <select
                    v-model="installments"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] text-[#0A2B42] font-semibold"
                  >
                    <option value="1">1x de R$ {{ finalTotal.toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="2">2x de R$ {{ (finalTotal / 2).toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="3">3x de R$ {{ (finalTotal / 3).toFixed(2).replace('.', ',') }} (sem juros)</option>
                    <option value="6">6x de R$ {{ (finalTotal / 6).toFixed(2).replace('.', ',') }} (sem juros)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Formulário: Pix -->
            <div v-else-if="paymentMethod === 'PIX'" class="p-6 bg-[#F7F4EE] rounded-3xl border border-[#E6E1D6] text-center space-y-4">
              <span class="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider block">Pagamento Instantâneo</span>
              <div class="w-44 h-44 bg-white p-3 rounded-2xl mx-auto border border-[#D6CFC0] shadow-md flex items-center justify-center">
                <!-- Mock QR Code SVG -->
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
                <p class="text-xs text-[#5A738E]">Abra o aplicativo do seu banco e escaneie o código acima.</p>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EBE7DE] text-[#0A2B42] border border-[#D6CFC0] rounded-xl text-xs font-bold shadow-sm"
                  @click="copyPixKey"
                >
                  <Copy :size="14" />
                  <span>Copiar Código Pix (Copia e Cola)</span>
                </button>
              </div>
            </div>

            <!-- Formulário: Boleto -->
            <div v-else-if="paymentMethod === 'BOLETO'" class="p-6 bg-[#F7F4EE] rounded-3xl border border-[#E6E1D6] text-center space-y-3">
              <span class="text-xs font-bold text-[#0B3C5D] uppercase tracking-wider block">Boleto Bancário</span>
              <p class="text-xs text-[#5A738E]">Vencimento em 3 dias úteis. A confirmação ocorre em até 24 horas.</p>
              <div class="p-3 bg-white rounded-xl border border-[#D6CFC0] font-mono text-xs text-[#0A2B42] select-all">
                23793.38128 60000.000003 01000.654321 9 950000000000
              </div>
            </div>

          </div>
        </div>

        <!-- Coluna Direita: Resumo do Pedido & Ação de Finalizar -->
        <div class="lg:col-span-5 space-y-6">
          <div class="card-maritimo p-6 sm:p-8 bg-white space-y-6 sticky top-24">
            <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42] pb-3 border-b border-[#E6E1D6]">
              Resumo da Coleção
            </h3>

            <!-- Itens do Carrinho -->
            <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
              <div
                v-for="item in cartStore.items"
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
                  <div class="text-[10px] text-[#5A738E]">Qtd: {{ item.quantity }} · {{ item.product.uf }}</div>
                  <div v-if="item.customization?.recipientName" class="text-[9px] text-[#E86A58] italic truncate">
                    Para: {{ item.customization.recipientName }}
                  </div>
                </div>
                <span class="text-xs font-bold text-[#0B3C5D]">
                  R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <!-- Cupom de Desconto -->
            <div class="pt-3 border-t border-[#F0EDE4] space-y-2">
              <label class="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">
                Cupom de Desconto (Dica: use "MAR10")
              </label>
              <div class="flex gap-2">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="MAR10"
                  class="w-full text-xs px-3 py-2 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] uppercase font-bold focus:outline-none"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl hover:bg-[#0A2B42]"
                  @click="applyCoupon"
                >
                  Aplicar
                </button>
              </div>
            </div>

            <!-- Totais Detalhados -->
            <div class="pt-3 border-t border-[#F0EDE4] space-y-2 text-xs text-[#5A738E]">
              <div class="flex justify-between">
                <span>Subtotal ({{ cartStore.totalItemsCount }} itens)</span>
                <span class="font-bold text-[#0A2B42]">R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>

              <div class="flex justify-between">
                <span>Frete Seguro Vidro</span>
                <span class="font-bold text-[#0B3C5D]">
                  {{ shippingAmount === 0 ? 'A calcular' : `R$ ${shippingAmount.toFixed(2).replace('.', ',')}` }}
                </span>
              </div>

              <div v-if="isCouponApplied" class="flex justify-between text-[#E86A58] font-bold">
                <span>Desconto (10%)</span>
                <span>- R$ {{ discountAmount.toFixed(2).replace('.', ',') }}</span>
              </div>

              <div class="flex justify-between text-sm font-bold text-[#0A2B42] pt-3 border-t border-[#E6E1D6]">
                <span>Total Final</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#0B3C5D]">
                  R$ {{ finalTotal.toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <!-- Botão de Finalizar -->
            <button
              type="button"
              :disabled="isSubmitting || cartStore.items.length === 0"
              class="w-full py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-sm rounded-full shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              @click="finalizeOrder"
            >
              <span v-if="isSubmitting">Processando e Gravando Rótulo...</span>
              <template v-else>
                <span>Confirmar e Finalizar Minha Coleção</span>
                <ArrowRight :size="16" />
              </template>
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
