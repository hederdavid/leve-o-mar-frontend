<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
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
  Gift
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

const cartStore = useCartStore()

const quantity = ref(1)
const isCustomGift = ref(false)
const giftMessage = ref('')
const recipientName = ref('')

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
    recipientName: isCustomGift.value ? recipientName.value : undefined,
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

    <!-- Personalização de Presente no Rótulo -->
    <div class="pt-2 border-t border-[#E6E1D6]">
      <label class="flex items-center gap-2 text-xs font-bold text-[#0A2B42] cursor-pointer">
        <input
          v-model="isCustomGift"
          type="checkbox"
          class="rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
        />
        <Gift :size="15" class="text-[#E86A58]" />
        <span>Gravar dedicatória personalizada no rótulo (+ Cortesia)</span>
      </label>

      <div v-if="isCustomGift" class="mt-3 space-y-2.5 p-3.5 bg-white rounded-xl border border-[#E6E1D6] animate-fade-in">
        <input
          v-model="recipientName"
          type="text"
          placeholder="Nome do presenteado (ex: Para Mariana)"
          class="w-full text-xs px-3 py-2 rounded-lg bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
        />
        <textarea
          v-model="giftMessage"
          rows="2"
          placeholder="Mensagem afetiva para o rótulo da garrafa..."
          class="w-full text-xs px-3 py-2 rounded-lg bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
        />
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

      <!-- Botão Adicionar ao Carrinho -->
      <button
        type="button"
        class="flex-1 py-3.5 px-6 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        @click="handleAddToCart"
      >
        <ShoppingBag :size="18" />
        <span>Adicionar às Minhas Aventuras</span>
      </button>
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

  </div>
</template>
