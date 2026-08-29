<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import {
  Sparkles,
  ShoppingBag,
  Gift,
  Check,
  Compass,
  Droplet,
  Type
} from 'lucide-vue-next'

interface Props {
  products: Product[]
  selectedProduct: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'selectProduct', product: Product): void
  (e: 'updateCustomization', data: {
    recipientName: string
    customMessage: string
    fontStyle: 'serif' | 'cursive' | 'sans'
    glassType: 'lapidado' | 'fosco' | 'ambar'
  }): void
}>()

const cartStore = useCartStore()

const recipientName = ref('')
const customMessage = ref('')
const fontStyle = ref<'serif' | 'cursive' | 'sans'>('cursive')
const glassType = ref<'lapidado' | 'fosco' | 'ambar'>('lapidado')
const includeCertificate = ref(true)

function handleStateChange() {
  emit('updateCustomization', {
    recipientName: recipientName.value,
    customMessage: customMessage.value,
    fontStyle: fontStyle.value,
    glassType: glassType.value
  })
}

function handleAddToCart() {
  cartStore.addItem(props.selectedProduct, {
    recipientName: recipientName.value || undefined,
    giftMessage: customMessage.value || undefined,
    includeCollectorCertificate: includeCertificate.value
  })
}
</script>

<template>
  <div class="card-maritimo p-6 sm:p-8 bg-white space-y-6">
    
    <div>
      <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block mb-1">
        Ateliê Leve o Mar
      </span>
      <h2 class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">
        Personalize sua Garrafa
      </h2>
      <p class="text-xs text-[#5A738E] mt-1">
        Escolha o destino e grave sua dedicatória personalizada no rótulo de algodão.
      </p>
    </div>

    <!-- PASSO 1: Escolha da Praia / Destino -->
    <div class="space-y-3 pt-2">
      <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
        <Compass :size="14" class="text-[#0B3C5D]" />
        <span>1. Escolha a Praia de Origem</span>
      </label>

      <div class="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
        <button
          v-for="p in products"
          :key="p.id"
          type="button"
          :class="[
            'p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer',
            selectedProduct.id === p.id
              ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm ring-1 ring-[#0B3C5D]'
              : 'border-[#E6E1D6] hover:bg-[#FAF8F5]'
          ]"
          @click="emit('selectProduct', p)"
        >
          <img
            :src="p.bottleImage"
            :alt="p.beachName"
            class="w-8 h-8 rounded-lg object-cover border border-[#D6CFC0]"
          />
          <div class="min-w-0 flex-1">
            <div class="text-xs font-bold text-[#0A2B42] truncate">{{ p.beachName }}</div>
            <div class="text-[9px] text-[#5A738E] truncate">{{ p.uf }} · {{ p.waterType }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- PASSO 2: Acabamento do Vidro -->
    <div class="space-y-3 pt-4 border-t border-[#F0EDE4]">
      <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
        <Droplet :size="14" class="text-[#0B3C5D]" />
        <span>2. Acabamento do Frasco</span>
      </label>

      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border text-center transition-all text-xs font-semibold',
            glassType === 'lapidado'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="glassType = 'lapidado'; handleStateChange()"
        >
          Lapidado
        </button>

        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border text-center transition-all text-xs font-semibold',
            glassType === 'fosco'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="glassType = 'fosco'; handleStateChange()"
        >
          Fosco
        </button>

        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border text-center transition-all text-xs font-semibold',
            glassType === 'ambar'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="glassType = 'ambar'; handleStateChange()"
        >
          Âmbar
        </button>
      </div>
    </div>

    <!-- PASSO 3: Dedicatória & Tipografia no Rótulo -->
    <div class="space-y-3 pt-4 border-t border-[#F0EDE4]">
      <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
        <Gift :size="14" class="text-[#E86A58]" />
        <span>3. Caligrafia do Rótulo</span>
      </label>

      <div class="space-y-2.5">
        <div>
          <label class="text-[11px] font-semibold text-[#5A738E] block mb-1">Para quem é o presente?</label>
          <input
            v-model="recipientName"
            type="text"
            placeholder="Ex: Para Mariana"
            class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
            @input="handleStateChange"
          />
        </div>

        <div>
          <label class="text-[11px] font-semibold text-[#5A738E] block mb-1">Mensagem Afetiva (Gravada ao vivo)</label>
          <textarea
            v-model="customMessage"
            rows="2"
            maxlength="90"
            placeholder="Ex: Que a brisa de Noronha esteja sempre com você..."
            class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
            @input="handleStateChange"
          />
          <div class="text-right text-[10px] text-[#5A738E]">{{ customMessage.length }}/90 caracteres</div>
        </div>

        <!-- Estilo Tipográfico -->
        <div>
          <label class="text-[11px] font-semibold text-[#5A738E] block mb-1">Estilo de Caligrafia</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              :class="[
                'py-1.5 px-2 rounded-lg border text-xs font-serif italic transition-all',
                fontStyle === 'cursive'
                  ? 'border-[#0B3C5D] bg-[#F7F4EE] text-[#0B3C5D] font-bold'
                  : 'border-[#E6E1D6] text-[#5A738E]'
              ]"
              @click="fontStyle = 'cursive'; handleStateChange()"
            >
              Cursiva
            </button>

            <button
              type="button"
              :class="[
                'py-1.5 px-2 rounded-lg border text-xs font-serif-editorial transition-all',
                fontStyle === 'serif'
                  ? 'border-[#0B3C5D] bg-[#F7F4EE] text-[#0B3C5D] font-bold'
                  : 'border-[#E6E1D6] text-[#5A738E]'
              ]"
              @click="fontStyle = 'serif'; handleStateChange()"
            >
              Serif Clássica
            </button>

            <button
              type="button"
              :class="[
                'py-1.5 px-2 rounded-lg border text-xs font-sans transition-all',
                fontStyle === 'sans'
                  ? 'border-[#0B3C5D] bg-[#F7F4EE] text-[#0B3C5D] font-bold'
                  : 'border-[#E6E1D6] text-[#5A738E]'
              ]"
              @click="fontStyle = 'sans'; handleStateChange()"
            >
              Minimal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preço & Botão de Adicionar ao Carrinho -->
    <div class="pt-4 border-t border-[#E6E1D6] space-y-4">
      <div class="flex items-baseline justify-between">
        <div>
          <span class="text-[10px] text-[#5A738E] uppercase tracking-wider block">Total Personalizado</span>
          <span class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">
            R$ {{ selectedProduct.price.toFixed(2).replace('.', ',') }}
          </span>
        </div>
        <span class="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-full">
          Personalização Grátis
        </span>
      </div>

      <button
        type="button"
        class="w-full py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-sm rounded-full shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        @click="handleAddToCart"
      >
        <ShoppingBag :size="18" />
        <span>Adicionar Garrafa Personalizada</span>
      </button>
    </div>

  </div>
</template>
