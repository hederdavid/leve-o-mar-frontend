<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { mockAccessories } from '@/mocks/accessories'
import { mockProducts } from '@/mocks/products'
import { orderService, type ShippingCalculationResult } from '@/services/orderService'
import type { Product } from '@/types/product'
import type { ShippingOption } from '@/types/cart'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { toast } from 'vue-sonner'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Home,
  CheckCircle2,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  Tag,
  Package
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const isSearchOpen = ref(false)
const cepInput = ref(cartStore.shippingCep || '40140-130')
const isCalculatingShipping = ref(false)
const shippingResult = ref<ShippingCalculationResult | null>(null)
const shippingError = ref<string | null>(null)
const isShippingHighlighted = ref(false)

const couponInput = ref(cartStore.couponCode || '')
const isCouponApplied = ref(
  cartStore.couponCode.trim().toUpperCase() === 'MAR10' ||
    cartStore.couponCode.trim().toUpperCase() === 'LEVEOMAR'
)

const FREE_SHIPPING_THRESHOLD = 79.9

const freeShippingProgress = computed(() =>
  Math.min(100, Math.round((cartStore.subtotal / FREE_SHIPPING_THRESHOLD) * 100))
)

const remainingForFreeShipping = computed(() =>
  Math.max(0, FREE_SHIPPING_THRESHOLD - cartStore.subtotal)
)

const hasFreeShipping = computed(() => cartStore.subtotal >= FREE_SHIPPING_THRESHOLD)

const discountAmount = computed(() => {
  if (!isCouponApplied.value) return 0
  return (cartStore.subtotal * 10) / 100
})

const shippingAmount = computed(() => cartStore.selectedShipping?.price || 0)

const finalTotal = computed(() =>
  Math.max(0, cartStore.subtotal + shippingAmount.value - discountAmount.value)
)

function formatCepInput(event: Event) {
  const input = event.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.length > 8) val = val.slice(0, 8)
  if (val.length > 5) {
    val = `${val.slice(0, 5)}-${val.slice(5)}`
  }
  cepInput.value = val
  if (shippingError.value) shippingError.value = null
}

async function handleCalculateShipping() {
  const clean = cepInput.value.replace(/\D/g, '')
  if (clean.length !== 8) {
    shippingError.value = 'Informe um CEP válido com 8 dígitos.'
    return
  }

  isCalculatingShipping.value = true
  shippingError.value = null

  try {
    const result = await orderService.lookupShippingAndAddress(clean)
    shippingResult.value = result
    const currentSelected = result.options.find((o) => o.id === cartStore.selectedShipping?.id)
    const optionToSelect = currentSelected || result.options[0] || null
    cartStore.setShipping(result.address.cep, optionToSelect)
  } catch (err: unknown) {
    shippingError.value = err instanceof Error ? err.message : 'Erro ao calcular frete.'
  } finally {
    isCalculatingShipping.value = false
  }
}

function selectShippingOption(opt: ShippingOption) {
  cartStore.setShipping(cepInput.value, opt)
  toast.success(`Modalidade "${opt.name}" selecionada!`)
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase()
  if (code === 'MAR10' || code === 'LEVEOMAR') {
    isCouponApplied.value = true
    cartStore.couponCode = code
    toast.success('Cupom de 10% OFF aplicado ao carrinho!')
  } else {
    toast.error('Cupom inválido. Utilize o código promocional MAR10.')
  }
}

function isAccessoryInCart(id: string): boolean {
  return cartStore.items.some((i) => i.product.id === id)
}

function handleAddAccessory(acc: Product) {
  cartStore.addItem(acc)
  cartStore.closeDrawer()
}

function addSampleBottleIfEmpty() {
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

watch(
  () => route.query.frete,
  (frete) => {
    if (frete === '1' || frete === 'true') {
      isShippingHighlighted.value = true
      if (!cepInput.value) {
        cepInput.value = '40140-130'
      }
      handleCalculateShipping()
    } else {
      isShippingHighlighted.value = false
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (cartStore.selectedShipping && !shippingResult.value) {
    handleCalculateShipping()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main id="main-content" class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs font-semibold text-[#5A738E] mb-6">
        <RouterLink to="/" class="hover:text-[#0A2B42] flex items-center gap-1">
          <Home :size="13" />
          <span>Início</span>
        </RouterLink>
        <ChevronRight :size="12" />
        <RouterLink to="/colecao" class="hover:text-[#0A2B42]">
          Coleção
        </RouterLink>
        <ChevronRight :size="12" />
        <span class="text-[#0A2B42] font-bold">
          {{ isShippingHighlighted ? 'Carrinho & Cálculo de Frete e Prazo' : 'Carrinho de Compras' }}
        </span>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span class="text-xs font-bold tracking-[0.2em] text-[#E86A58] uppercase block">
            {{ isShippingHighlighted ? 'Simulação Logística para Vidro Frágil' : 'Sua Coleção Selecionada' }}
          </span>
          <h1 class="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#0A2B42] mt-1">
            {{ isShippingHighlighted ? 'Cálculo de Frete e Prazo de Entrega' : 'Carrinho de Compras' }}
          </h1>
        </div>

        <RouterLink
          to="/colecao"
          class="text-xs font-bold text-[#0B3C5D] hover:text-[#E86A58] underline inline-flex items-center gap-1"
        >
          <span>Continuar explorando o litoral</span>
          <ArrowRight :size="13" />
        </RouterLink>
      </div>

      <div v-if="cartStore.items.length === 0" class="card-maritimo p-12 text-center bg-white space-y-5 max-w-xl mx-auto">
        <div class="w-16 h-16 bg-[#EBE7DE] text-[#0B3C5D] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag :size="28" />
        </div>
        <div class="space-y-1">
          <h2 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">Seu carrinho está vazio</h2>
          <p class="text-xs sm:text-sm text-[#5A738E]">
            Escolha uma praia do nosso catálogo ou adicione uma garrafa personalizada de demonstração.
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <RouterLink
            to="/colecao"
            class="px-6 py-3 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow transition-all"
          >
            Explorar Catálogo de Praias
          </RouterLink>
          <button
            type="button"
            class="px-6 py-3 bg-[#F7F4EE] hover:bg-[#EBE7DE] text-[#0A2B42] border border-[#D6CFC0] text-xs font-bold rounded-full transition-all cursor-pointer"
            @click="addSampleBottleIfEmpty"
          >
            Inserir Garrafa Exemplo na Sacola
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 space-y-6">
          <div class="p-4 rounded-2xl bg-white border border-[#E6E1D6] shadow-sm">
            <div class="flex items-center justify-between text-xs mb-2 font-medium">
              <span v-if="!hasFreeShipping" class="flex items-center gap-1.5 text-[#0A2B42]">
                <Truck :size="15" class="text-[#0B3C5D]" />
                <span>
                  Faltam <strong>R$ {{ remainingForFreeShipping.toFixed(2).replace('.', ',') }}</strong> para desbloquear
                  <strong>Benefício de Embalagem & Seguro VIP</strong>
                </span>
              </span>
              <span v-else class="flex items-center gap-1.5 text-[#0B3C5D] font-bold">
                <CheckCircle2 :size="15" class="text-emerald-600" />
                <span>Meta atingida! Embalagem Antiimpacto de Vidro e Certificado Inclusos.</span>
              </span>
              <span class="text-xs font-mono font-bold text-[#5A738E]">{{ freeShippingProgress }}%</span>
            </div>
            <div class="w-full h-2 bg-[#EBE7DE] rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#05BFDB] to-[#0B3C5D] transition-all duration-500 rounded-full"
                :style="{ width: `${freeShippingProgress}%` }"
              />
            </div>
          </div>

          <div class="space-y-4">
            <article
              v-for="item in cartStore.items"
              :key="item.id"
              class="card-maritimo p-5 bg-white flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div class="flex gap-4 flex-1 min-w-0">
                <RouterLink
                  :to="`/produto/${item.product.slug}`"
                  class="w-24 h-28 bg-[#F7F4EE] rounded-2xl overflow-hidden flex-shrink-0 border border-[#E6E1D6]"
                >
                  <img
                    :src="item.product.bottleImage"
                    :alt="item.product.beachName"
                    class="w-full h-full object-cover"
                  />
                </RouterLink>

                <div class="space-y-1.5 flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase block">
                        {{ item.product.categoryTag }} · {{ item.product.city }}, {{ item.product.uf }}
                      </span>
                      <RouterLink :to="`/produto/${item.product.slug}`">
                        <h2 class="font-serif-editorial text-lg font-bold text-[#0A2B42] hover:text-[#0B3C5D]">
                          {{ item.product.name }}
                        </h2>
                      </RouterLink>
                    </div>

                    <button
                      type="button"
                      aria-label="Remover garrafa do carrinho"
                      class="p-2 text-[#5A738E] hover:text-[#E86A58] hover:bg-[#FDF3F1] rounded-full transition-colors cursor-pointer"
                      @click="cartStore.removeItem(item.id)"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>

                  <div
                    v-if="item.customization"
                    class="p-2.5 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] text-xs text-[#5A738E] space-y-1"
                  >
                    <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                      <span v-if="item.customization.glassType">
                        <strong class="text-[#0A2B42]">Variação:</strong> {{ item.customization.glassType }}
                      </span>
                      <span v-if="item.customization.corkType">
                        <strong class="text-[#0A2B42]">Vedação:</strong> {{ item.customization.corkType }}
                      </span>
                    </div>
                    <p v-if="item.customization.recipientName" class="text-[11px] font-bold text-[#0B3C5D]">
                      Rótulo dedicado a: {{ item.customization.recipientName }}
                    </p>
                    <p v-if="item.customization.giftMessage || item.customization.dedicationText" class="text-[11px] italic">
                      "{{ item.customization.giftMessage || item.customization.dedicationText }}"
                    </p>
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center border border-[#D6CFC0] rounded-full bg-[#F7F4EE] px-2 py-1">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        class="w-7 h-7 flex items-center justify-center text-[#0A2B42] hover:bg-white rounded-full cursor-pointer"
                        @click="cartStore.updateQuantity(item.id, -1)"
                      >
                        <Minus :size="13" />
                      </button>
                      <span class="text-xs font-bold px-3 text-[#0A2B42]">{{ item.quantity }}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        class="w-7 h-7 flex items-center justify-center text-[#0A2B42] hover:bg-white rounded-full cursor-pointer"
                        @click="cartStore.updateQuantity(item.id, 1)"
                      >
                        <Plus :size="13" />
                      </button>
                    </div>

                    <div class="text-right">
                      <span class="text-[10px] text-[#5A738E] block">
                        Unitário: R$ {{ item.product.price.toFixed(2).replace('.', ',') }}
                      </span>
                      <span class="font-serif-editorial text-lg font-extrabold text-[#0A2B42]">
                        R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="card-maritimo p-5 bg-white space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Sparkles :size="16" class="text-[#D97706]" />
                <h3 class="text-xs font-bold text-[#0A2B42] uppercase tracking-wider">
                  Complete sua Experiência
                </h3>
              </div>
              <span class="text-[11px] text-[#5A738E]">Acessórios do Ateliê</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="acc in mockAccessories"
                :key="acc.id"
                class="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6E1D6] flex flex-col justify-between gap-2"
              >
                <div class="flex items-center gap-2.5">
                  <img
                    :src="acc.bottleImage"
                    :alt="acc.name"
                    class="w-11 h-11 rounded-lg object-cover border border-[#D6CFC0] flex-shrink-0"
                  />
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-[#0A2B42] truncate">{{ acc.name }}</h4>
                    <span class="text-xs font-bold text-[#0B3C5D] block">
                      R$ {{ acc.price.toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  :disabled="isAccessoryInCart(acc.id)"
                  class="w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer disabled:cursor-default"
                  :class="
                    isAccessoryInCart(acc.id)
                      ? 'bg-[#EBE7DE] text-[#5A738E]'
                      : 'bg-[#0B3C5D] text-white hover:bg-[#0A2B42]'
                  "
                  @click="handleAddAccessory(acc)"
                >
                  <Check v-if="isAccessoryInCart(acc.id)" :size="13" />
                  <Plus v-else :size="13" />
                  <span>{{ isAccessoryInCart(acc.id) ? 'Incluído' : 'Adicionar' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <section
            aria-labelledby="shipping-calc-heading"
            class="card-maritimo p-6 bg-white space-y-4 transition-all"
            :class="isShippingHighlighted ? 'ring-2 ring-[#0B3C5D] shadow-xl' : ''"
          >
            <div class="flex items-center justify-between pb-3 border-b border-[#E6E1D6]">
              <div class="flex items-center gap-2">
                <Truck :size="18" class="text-[#0B3C5D]" />
                <h2 id="shipping-calc-heading" class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
                  Cálculo de Frete e Prazo
                </h2>
              </div>

              <button
                type="button"
                class="text-[11px] font-semibold text-[#0B3C5D] hover:underline cursor-pointer"
                @click="cepInput = '40140-130'; handleCalculateShipping()"
              >
                Usar CEP principal (40140-130)
              </button>
            </div>

            <form class="space-y-3" @submit.prevent="handleCalculateShipping">
              <label for="cart-cep-input" class="text-xs font-semibold text-[#5A738E] block">
                Informe o CEP de destino para simular transportadoras de carga frágil:
              </label>
              <div class="flex gap-2">
                <input
                  id="cart-cep-input"
                  :value="cepInput"
                  name="cep"
                  type="text"
                  inputmode="numeric"
                  autocomplete="postal-code"
                  maxlength="9"
                  placeholder="40140-130"
                  class="flex-1 text-xs font-mono px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] text-[#0A2B42] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
                  @input="formatCepInput"
                />
                <button
                  type="submit"
                  :disabled="isCalculatingShipping"
                  class="px-5 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Loader2 v-if="isCalculatingShipping" :size="14" class="animate-spin" />
                  <span>{{ isCalculatingShipping ? 'Calculando...' : 'Calcular Frete' }}</span>
                </button>
              </div>
            </form>

            <div
              v-if="shippingError"
              role="alert"
              class="flex items-center gap-2 p-3 bg-[#FDF3F1] border border-[#F5C2BC] rounded-xl text-xs text-[#E86A58]"
            >
              <AlertCircle :size="15" class="flex-shrink-0" />
              <span>{{ shippingError }}</span>
            </div>

            <div v-if="shippingResult" class="space-y-3 pt-1 animate-fade-in">
              <div class="flex items-center justify-between text-xs bg-[#F7F4EE] px-3 py-2 rounded-xl border border-[#E6E1D6]">
                <span class="font-bold text-[#0A2B42] flex items-center gap-1.5">
                  <CheckCircle2 :size="14" class="text-[#05BFDB]" />
                  <span>{{ shippingResult.address.city }} - {{ shippingResult.address.state }}</span>
                </span>
                <span class="font-mono text-[11px] text-[#5A738E]">CEP {{ shippingResult.address.cep }}</span>
              </div>

              <fieldset class="space-y-2">
                <legend class="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider mb-1">
                  Escolha a modalidade de envio com seguro vidro:
                </legend>
                <label
                  v-for="opt in shippingResult.options"
                  :key="opt.id"
                  class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all"
                  :class="
                    cartStore.selectedShipping?.id === opt.id
                      ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm'
                      : 'border-[#E6E1D6] bg-white hover:bg-[#FAF8F5]'
                  "
                >
                  <div class="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shipping-option"
                      :checked="cartStore.selectedShipping?.id === opt.id"
                      class="text-[#0B3C5D] focus:ring-[#0B3C5D]"
                      @change="selectShippingOption(opt)"
                    />
                    <div>
                      <span class="text-xs font-bold text-[#0A2B42] block">{{ opt.name }}</span>
                      <span class="text-[11px] text-[#5A738E] block">
                        {{ opt.carrier }} · Entrega em até <strong>{{ opt.estimatedDays }} dias úteis</strong>
                      </span>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-[#0B3C5D] ml-2">
                    R$ {{ opt.price.toFixed(2).replace('.', ',') }}
                  </span>
                </label>
              </fieldset>

              <div class="flex items-center gap-2 text-[11px] text-[#5A738E] bg-[#EBE7DE]/50 p-2.5 rounded-xl">
                <Package :size="14" class="text-[#0B3C5D] flex-shrink-0" />
                <span>Inclui berço antichoque de papel colmeia e apólice contra avarias no transporte.</span>
              </div>
            </div>
          </section>

          <section aria-labelledby="order-summary-heading" class="card-maritimo p-6 bg-white space-y-5">
            <h2 id="order-summary-heading" class="font-serif-editorial text-xl font-bold text-[#0A2B42] pb-3 border-b border-[#E6E1D6]">
              Resumo do Carrinho
            </h2>

            <form class="space-y-2" @submit.prevent="applyCoupon">
              <div class="flex items-center justify-between">
                <label for="cart-coupon-input" class="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag :size="12" class="text-[#E86A58]" />
                  <span>Cupom de Desconto</span>
                </label>
                <span class="text-[10px] font-semibold text-[#0B3C5D]">1ª compra: MAR10</span>
              </div>
              <div class="flex gap-2">
                <input
                  id="cart-coupon-input"
                  v-model="couponInput"
                  name="coupon"
                  type="text"
                  autocorrect="off"
                  autocapitalize="characters"
                  placeholder="MAR10"
                  class="flex-1 text-xs font-bold uppercase px-3 py-2 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none"
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            </form>

            <div class="space-y-2 text-xs text-[#5A738E] pt-3 border-t border-[#F0EDE4]">
              <div class="flex justify-between">
                <span>Subtotal ({{ cartStore.totalItemsCount }} {{ cartStore.totalItemsCount === 1 ? 'item' : 'itens' }})</span>
                <span class="font-bold text-[#0A2B42]">R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>

              <div class="flex justify-between">
                <span>Embalagem Antiimpacto Sea Glass</span>
                <span class="font-bold text-emerald-700">Cortesia</span>
              </div>

              <div class="flex justify-between">
                <span>Frete com Seguro Vidro</span>
                <span class="font-bold text-[#0B3C5D]">
                  {{
                    cartStore.selectedShipping
                      ? `R$ ${cartStore.selectedShipping.price.toFixed(2).replace('.', ',')} (${cartStore.selectedShipping.estimatedDays} dias úteis)`
                      : 'Calcule acima'
                  }}
                </span>
              </div>

              <div v-if="isCouponApplied" class="flex justify-between text-[#E86A58] font-bold">
                <span>Desconto Cupom (10%)</span>
                <span>- R$ {{ discountAmount.toFixed(2).replace('.', ',') }}</span>
              </div>

              <div class="flex justify-between text-sm font-bold text-[#0A2B42] pt-3 border-t border-[#E6E1D6]">
                <span>Total Estimado</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#0B3C5D]">
                  R$ {{ finalTotal.toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="w-full py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-sm rounded-full shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              @click="router.push('/checkout')"
            >
              <span>Avançar para Identificação & Checkout</span>
              <ArrowRight :size="16" />
            </button>

            <div class="flex items-center justify-center gap-2 text-[11px] text-[#5A738E]">
              <ShieldCheck :size="14" class="text-[#0B3C5D]" />
              <span>Transação protegida por criptografia TLS 1.3 e Direito de Arrependimento (7 dias).</span>
            </div>
          </section>
        </div>
      </div>
    </main>

    <FooterNavigation />
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
