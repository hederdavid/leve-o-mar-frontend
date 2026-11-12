<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { orderService, type ShippingCalculationResult } from '@/services/orderService'
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Package,
  Droplet,
  Compass,
  Sparkles,
  Gift,
  Heart,
  Truck,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'

interface Props {
  product: Product
  reviewsCount: number
  averageRating: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'scrollToReviews'): void
}>()

const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const quantity = ref(1)
const selectedGlassVariation = ref<'Cristal Lapidado' | 'Fosco Sea Glass' | 'Âmbar Naval'>('Cristal Lapidado')
const selectedSealColor = ref<'Azul Oceano' | 'Dourado Solar' | 'Coral Costeiro'>('Dourado Solar')
const selectedFontStyle = ref<'cursive' | 'serif' | 'sans'>('cursive')
const isCustomGift = ref(false)
const giftMessage = ref('')
const recipientName = ref('')

const glassVariations: Array<{ id: 'Cristal Lapidado' | 'Fosco Sea Glass' | 'Âmbar Naval'; label: string; badge: string }> = [
  { id: 'Cristal Lapidado', label: 'Cristal Lapidado 500ml', badge: 'Clássico' },
  { id: 'Fosco Sea Glass', label: 'Fosco Sea Glass 500ml', badge: 'Texturizado' },
  { id: 'Âmbar Naval', label: 'Âmbar Naval UV 500ml', badge: 'Colecionador' }
]

const sealOptions: Array<{ id: 'Azul Oceano' | 'Dourado Solar' | 'Coral Costeiro'; hex: string }> = [
  { id: 'Dourado Solar', hex: '#D97706' },
  { id: 'Azul Oceano', hex: '#0B3C5D' },
  { id: 'Coral Costeiro', hex: '#E86A58' }
]

function fillSampleCustomization() {
  selectedGlassVariation.value = 'Fosco Sea Glass'
  selectedSealColor.value = 'Dourado Solar'
  selectedFontStyle.value = 'cursive'
  isCustomGift.value = true
  recipientName.value = 'Para Marina Costa Navegante'
  giftMessage.value = `Que a calmaria e a luz das águas de ${props.product.beachName} estejam sempre por perto.`
}

watch(
  () => route.query.personalizar,
  (val) => {
    if (val === '1' || val === 'true') {
      fillSampleCustomization()
    } else {
      isCustomGift.value = false
      recipientName.value = ''
      giftMessage.value = ''
    }
  },
  { immediate: true }
)

const shippingCep = ref('')
const isCalculatingShipping = ref(false)
const shippingResult = ref<ShippingCalculationResult | null>(null)
const shippingError = ref<string | null>(null)

function formatCepInput(event: Event) {
  const input = event.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.length > 8) val = val.slice(0, 8)
  if (val.length > 5) {
    val = `${val.slice(0, 5)}-${val.slice(5)}`
  }
  shippingCep.value = val
  if (shippingError.value) shippingError.value = null
}

async function handleCalculateShipping() {
  const clean = shippingCep.value.replace(/\D/g, '')
  if (clean.length !== 8) {
    shippingError.value = 'Digite um CEP válido com 8 dígitos.'
    return
  }

  isCalculatingShipping.value = true
  shippingError.value = null
  shippingResult.value = null

  try {
    const res = await orderService.lookupShippingAndAddress(clean)
    shippingResult.value = res
  } catch (err: unknown) {
    shippingError.value = err instanceof Error ? err.message : 'Não foi possível calcular o frete para este CEP.'
  } finally {
    isCalculatingShipping.value = false
  }
}

function increment() {
  if (quantity.value < props.product.stock) {
    quantity.value++
  }
}

function decrement() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function handleAddToCart() {
  cartStore.addItem(props.product, {
    giftMessage: isCustomGift.value ? giftMessage.value : undefined,
    dedicationText: isCustomGift.value ? giftMessage.value : undefined,
    recipientName: isCustomGift.value ? recipientName.value : undefined,
    glassType: selectedGlassVariation.value,
    corkType: `Rolha de Cortiça com Lacre ${selectedSealColor.value}`,
    waxSealColor: selectedSealColor.value,
    fontStyle: selectedFontStyle.value,
    includeCollectorCertificate: true
  })
}
</script>

<template>
  <div class="space-y-6">
    
    <!-- Tag da Categoria & Coordenadas -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="text-xs font-bold tracking-widest text-[#D97706] uppercase">
        {{ product.categoryTag }}
      </span>

      <div class="flex items-center gap-1.5 text-xs text-[#5A738E] font-mono bg-[#EBE7DE] px-2.5 py-1 rounded-full border border-[#D6CFC0]">
        <Compass :size="13" class="text-[#0B3C5D]" />
        <span>{{ product.coordinates.lat.toFixed(4) }}°, {{ product.coordinates.lng.toFixed(4) }}°</span>
      </div>
    </div>

    <!-- Título Principal & Localização -->
    <div>
      <h1 class="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#0A2B42] leading-tight">
        {{ product.name }}
      </h1>
      <p class="text-sm font-semibold text-[#5A738E] mt-1">
        Destino {{ product.beachName }} · {{ product.city }}, {{ product.uf }} · Brasil
      </p>
    </div>

    <!-- Avaliação Média & Link para Reviews -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1 text-[#F59E0B]">
        <Star v-for="i in 5" :key="i" :size="16" class="fill-[#F59E0B]" />
      </div>
      <span class="text-xs font-bold text-[#0A2B42]">{{ averageRating.toFixed(1) }} / 5.0</span>
      <button
        type="button"
        class="text-xs text-[#0B3C5D] hover:text-[#E86A58] underline font-medium"
        @click="emit('scrollToReviews')"
      >
        ({{ reviewsCount }} opiniões de colecionadores)
      </button>
    </div>

    <!-- Destaque da Água do Mar & Rolha -->
    <div class="p-4 rounded-2xl bg-white border border-[#E6E1D6] shadow-sm space-y-2">
      <div class="flex items-center gap-2 text-xs font-bold text-[#0A2B42]">
        <Droplet :size="15" class="text-[#05BFDB] fill-[#05BFDB]/20" />
        <span>Água do Mar Capturada:</span>
        <span class="font-normal text-[#5A738E]">{{ product.tagline }}</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-[#5A738E]">
        <Sparkles :size="14" class="text-[#D97706]" />
        <span>Frasco {{ product.volume }} em {{ product.glassFinish }} com rolha de cortiça selada.</span>
      </div>
    </div>

    <!-- Preço & Parcelamento -->
    <div class="pt-2">
      <div class="flex items-baseline gap-3">
        <span class="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#0A2B42]">
          R$ {{ product.price.toFixed(2).replace('.', ',') }}
        </span>
        <span v-if="product.originalPrice" class="text-sm text-[#5A738E] line-through">
          R$ {{ product.originalPrice.toFixed(2).replace('.', ',') }}
        </span>
      </div>
      <p class="text-xs text-[#5A738E] mt-1">
        ou em até <strong>3x de R$ {{ (product.price / 3).toFixed(2).replace('.', ',') }}</strong> sem juros no cartão
      </p>
    </div>

    <div class="pt-3 border-t border-[#E6E1D6] space-y-4">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-[#0A2B42] uppercase tracking-wider">
            Acabamento do Vidro
          </span>
          <span class="text-[11px] font-semibold text-[#0B3C5D]">{{ selectedGlassVariation }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            v-for="v in glassVariations"
            :key="v.id"
            type="button"
            class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
            :class="
              selectedGlassVariation === v.id
                ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-sm'
                : 'border-[#D6CFC0] bg-white text-[#0A2B42] hover:bg-[#F7F4EE]'
            "
            @click="selectedGlassVariation = v.id"
          >
            <span class="text-[10px] uppercase tracking-wider block opacity-75">{{ v.badge }}</span>
            <span class="text-xs font-bold block mt-0.5">{{ v.label }}</span>
          </button>
        </div>
      </div>

      <div>
        <span class="text-xs font-bold text-[#0A2B42] uppercase tracking-wider block mb-2">
          Lacre de Cera Naval na Rolha
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="seal in sealOptions"
            :key="seal.id"
            type="button"
            class="px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            :class="
              selectedSealColor === seal.id
                ? 'border-[#0A2B42] bg-white text-[#0A2B42] ring-2 ring-[#0B3C5D]/20 shadow-sm'
                : 'border-[#D6CFC0] bg-[#F7F4EE] text-[#5A738E] hover:bg-white'
            "
            @click="selectedSealColor = seal.id"
          >
            <span class="w-3 h-3 rounded-full border border-black/10" :style="{ backgroundColor: seal.hex }" />
            <span>{{ seal.id }}</span>
          </button>
        </div>
      </div>

      <div class="pt-2 border-t border-[#F0EDE4]">
        <div class="flex items-center justify-between gap-2">
          <label class="flex items-center gap-2 text-xs font-bold text-[#0A2B42] cursor-pointer">
            <input
              v-model="isCustomGift"
              type="checkbox"
              class="rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
            />
            <Gift :size="15" class="text-[#E86A58]" />
            <span>Personalizar Rótulo com Dedicatória (Cortesia)</span>
          </label>

          <button
            type="button"
            class="text-[11px] font-semibold text-[#0B3C5D] hover:text-[#E86A58] underline cursor-pointer"
            @click="fillSampleCustomization"
          >
            Sugerir dedicatória desta praia
          </button>
        </div>

        <div v-if="isCustomGift" class="mt-3 space-y-3 p-4 bg-white rounded-2xl border border-[#E6E1D6] shadow-sm animate-fade-in">
          <div>
            <label for="gift-recipient" class="text-[11px] font-bold text-[#5A738E] block mb-1">
              Nome no Rótulo (Destinatário ou Colecionador)
            </label>
            <input
              id="gift-recipient"
              v-model="recipientName"
              type="text"
              placeholder="Ex: Para Marina Costa Navegante"
              class="w-full text-xs px-3 py-2 rounded-lg bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
            />
          </div>

          <div>
            <label for="gift-message" class="text-[11px] font-bold text-[#5A738E] block mb-1">
              Dedicatória Caligrafada no Papel de Algodão
            </label>
            <textarea
              id="gift-message"
              v-model="giftMessage"
              rows="2"
              placeholder="Mensagem afetiva para o rótulo da garrafa..."
              class="w-full text-xs px-3 py-2 rounded-lg bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
            />
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-semibold text-[#5A738E]">Estilo da Caligrafia:</span>
            <div class="flex gap-1.5">
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer"
                :class="selectedFontStyle === 'cursive' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-[#F7F4EE] text-[#5A738E] border-[#D6CFC0]'"
                @click="selectedFontStyle = 'cursive'"
              >
                Manuscrita
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer"
                :class="selectedFontStyle === 'serif' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-[#F7F4EE] text-[#5A738E] border-[#D6CFC0]'"
                @click="selectedFontStyle = 'serif'"
              >
                Clássica Serif
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer"
                :class="selectedFontStyle === 'sans' ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]' : 'bg-[#F7F4EE] text-[#5A738E] border-[#D6CFC0]'"
                @click="selectedFontStyle = 'sans'"
              >
                Minimalista
              </button>
            </div>
          </div>

          <div v-if="recipientName || giftMessage" class="p-3 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#D97706] block">
              Preview do Rótulo Personalizado ({{ selectedGlassVariation }} · Lacre {{ selectedSealColor }})
            </span>
            <p class="text-xs font-bold text-[#0A2B42]">{{ recipientName || 'Colecionador do Mar' }}</p>
            <p class="text-xs italic text-[#5A738E]">"{{ giftMessage }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações de Compra: Quantidade & Botão -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      
      <!-- Seletor de Quantidade -->
      <div class="flex items-center justify-between border border-[#D6CFC0] rounded-full bg-white px-3 py-2 w-full sm:w-32">
        <button
          type="button"
          class="p-1 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full disabled:opacity-30"
          :disabled="quantity <= 1"
          @click="decrement"
        >
          <Minus :size="14" />
        </button>
        <span class="text-sm font-bold text-[#0A2B42]">{{ quantity }}</span>
        <button
          type="button"
          class="p-1 text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full disabled:opacity-30"
          :disabled="quantity >= product.stock"
          @click="increment"
        >
          <Plus :size="14" />
        </button>
      </div>

      <!-- Botão Adicionar ao Carrinho & Favoritar -->
      <div class="flex-1 flex gap-2">
        <button
          type="button"
          class="flex-1 py-3.5 px-6 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          @click="handleAddToCart"
        >
          <ShoppingBag :size="18" />
          <span>Adicionar às Minhas Aventuras</span>
        </button>

        <button
          type="button"
          :aria-label="wishlistStore.isInWishlist(product.id) ? 'Remover dos favoritos' : 'Salvar nas praias desejadas'"
          class="w-12 h-12 rounded-full border border-[#D6CFC0] bg-white hover:bg-[#F7F4EE] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
          :class="wishlistStore.isInWishlist(product.id) ? 'text-[#E86A58]' : 'text-[#8A9BA8] hover:text-[#0A2B42]'"
          @click="wishlistStore.toggleWishlist(product)"
        >
          <Heart :size="20" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>

    <!-- Selos de Confiança -->
    <div class="grid grid-cols-2 gap-3 pt-3 text-[11px] text-[#5A738E]">
      <div class="flex items-center gap-2">
        <Package :size="15" class="text-[#0B3C5D] flex-shrink-0" />
        <span>Embalagem antiimpacto para vidro</span>
      </div>
      <div class="flex items-center gap-2">
        <ShieldCheck :size="15" class="text-[#0B3C5D] flex-shrink-0" />
        <span>Certificado de autenticidade</span>
      </div>
    </div>

    <!-- Calculadora de Frete em Tempo Real com ViaCEP -->
    <div class="pt-4 border-t border-[#E6E1D6] space-y-3">
      <div class="flex items-center gap-2">
        <Truck :size="16" class="text-[#0B3C5D]" />
        <h3 class="text-xs font-bold text-[#0A2B42] uppercase tracking-wider">
          Calcular Frete e Prazo de Entrega
        </h3>
      </div>

      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            :value="shippingCep"
            type="text"
            maxlength="9"
            placeholder="00000-000"
            class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#D6CFC0] text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] font-mono"
            @input="formatCepInput"
            @keyup.enter="handleCalculateShipping"
          />
        </div>

        <button
          type="button"
          :disabled="isCalculatingShipping"
          class="px-5 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
          @click="handleCalculateShipping"
        >
          <Loader2 v-if="isCalculatingShipping" :size="14" class="animate-spin" />
          <span>{{ isCalculatingShipping ? 'Consultando...' : 'Calcular' }}</span>
        </button>
      </div>

      <!-- Erro ao calcular CEP -->
      <div
        v-if="shippingError"
        class="flex items-center gap-2 p-2.5 bg-[#FDF3F1] border border-[#F5C2BC] rounded-xl text-xs text-[#E86A58]"
      >
        <AlertCircle :size="15" class="flex-shrink-0" />
        <span>{{ shippingError }}</span>
      </div>

      <!-- Opções Calculadas via API -->
      <div
        v-if="shippingResult"
        class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] space-y-3 animate-fade-in"
      >
        <div class="flex items-center justify-between text-xs border-b border-[#F0EDE4] pb-2">
          <div class="flex items-center gap-1.5 font-bold text-[#0A2B42]">
            <CheckCircle2 :size="14" class="text-[#05BFDB]" />
            <span>Destino: {{ shippingResult.address.city }} - {{ shippingResult.address.state }}</span>
          </div>
          <span class="text-[10px] text-[#5A738E] font-mono">CEP: {{ shippingResult.address.cep }}</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="opt in shippingResult.options"
            :key="opt.id"
            class="flex items-center justify-between p-2 rounded-lg bg-[#F7F4EE] border border-[#EBE7DE] text-xs hover:border-[#0B3C5D] transition-colors"
          >
            <div>
              <div class="font-bold text-[#0A2B42]">{{ opt.name }}</div>
              <div class="text-[10px] text-[#5A738E]">{{ opt.carrier }} · Chega em até {{ opt.estimatedDays }} dias úteis</div>
            </div>
            <div class="text-right font-bold text-[#0B3C5D]">
              R$ {{ opt.price.toFixed(2).replace('.', ',') }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 text-[10px] text-[#5A738E] pt-1">
          <ShieldCheck :size="13" class="text-[#0B3C5D] flex-shrink-0" />
          <span>Envio com berço de papel colmeia e seguro integral contra quebra de vidro.</span>
        </div>
      </div>
    </div>

  </div>
</template>
