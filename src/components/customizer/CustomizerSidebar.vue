<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'
import { Sparkles, ShoppingBag, Droplet, PenTool, Check, Heart } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  products: Product[]
  selectedProduct: Product | null
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

function handleStateChange() {
  emit('updateCustomization', {
    recipientName: recipientName.value,
    customMessage: customMessage.value,
    fontStyle: fontStyle.value,
    glassType: glassType.value
  })
}

function handleAddToCart() {
  if (!props.selectedProduct) return

  cartStore.addItem(props.selectedProduct, {
    recipientName: recipientName.value.trim() || undefined,
    giftMessage: customMessage.value.trim() || undefined,
    fontStyle: fontStyle.value,
    glassType: glassType.value
  })
}
</script>

<template>
  <div class="card-maritimo p-4 sm:p-6 lg:p-8 bg-white space-y-5 sm:space-y-6 shadow-md">
    
    <!-- PASSO 1: Escolha do Destino e Água -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
          <Droplet :size="14" class="text-[#0B3C5D]" />
          <span>1. Escolha a Praia</span>
        </label>
        <span class="text-[10px] text-[#5A738E] font-medium">{{ products.length }} praias disponíveis</span>
      </div>

      <!-- Carrossel / Grid de Destinos Selecionáveis com Touch Targets de 44px -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        <button
          v-for="p in products"
          :key="p.id"
          type="button"
          :class="[
            'p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer min-h-[48px]',
            selectedProduct?.id === p.id
              ? 'border-[#0B3C5D] bg-[#F7F4EE] shadow-sm ring-1 ring-[#0B3C5D]'
              : 'border-[#E6E1D6] hover:bg-[#FAF8F5]'
          ]"
          @click="emit('selectProduct', p)"
        >
          <img
            :src="p.bottleImage"
            :alt="p.beachName"
            class="w-9 h-9 rounded-lg object-cover border border-[#D6CFC0] flex-shrink-0"
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
            'p-2.5 rounded-xl border flex items-center justify-center transition-all text-xs font-semibold min-h-[44px] cursor-pointer',
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
            'p-2.5 rounded-xl border flex items-center justify-center transition-all text-xs font-semibold min-h-[44px] cursor-pointer',
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
            'p-2.5 rounded-xl border flex items-center justify-center transition-all text-xs font-semibold min-h-[44px] cursor-pointer',
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

    <!-- PASSO 3: Tipografia do Rótulo -->
    <div class="space-y-3 pt-4 border-t border-[#F0EDE4]">
      <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
        <PenTool :size="14" class="text-[#0B3C5D]" />
        <span>3. Estilo de Caligrafia</span>
      </label>

      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[48px] cursor-pointer',
            fontStyle === 'cursive'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="fontStyle = 'cursive'; handleStateChange()"
        >
          <span class="italic font-serif text-sm">Cursiva</span>
          <span class="text-[9px] opacity-80">Afetiva</span>
        </button>

        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[48px] cursor-pointer',
            fontStyle === 'serif'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="fontStyle = 'serif'; handleStateChange()"
        >
          <span class="font-serif font-bold text-xs">Clássica</span>
          <span class="text-[9px] opacity-80">Elegante</span>
        </button>

        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[48px] cursor-pointer',
            fontStyle === 'sans'
              ? 'border-[#0B3C5D] bg-[#0B3C5D] text-white shadow'
              : 'border-[#E6E1D6] bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE]'
          ]"
          @click="fontStyle = 'sans'; handleStateChange()"
        >
          <span class="font-sans font-bold text-xs uppercase">Moderna</span>
          <span class="text-[9px] opacity-80">Minimal</span>
        </button>
      </div>
    </div>

    <!-- PASSO 4: Textos da Dedicatória -->
    <div class="space-y-4 pt-4 border-t border-[#F0EDE4]">
      <label class="text-xs font-bold uppercase tracking-wider text-[#0A2B42] flex items-center gap-1.5">
        <Heart :size="14" class="text-[#E86A58]" />
        <span>4. Mensagem Gravada no Papel Algodão</span>
      </label>

      <div class="space-y-3">
        <div>
          <label class="text-[11px] font-semibold text-[#5A738E] block mb-1">Nome do Destinatário ou do Lar</label>
          <input
            v-model="recipientName"
            type="text"
            maxlength="28"
            placeholder="Ex: Família Medeiros"
            class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
            @input="handleStateChange"
          />
        </div>

        <div>
          <label class="text-[11px] font-semibold text-[#5A738E] block mb-1">Dedicatória / Frase de Memória</label>
          <input
            v-model="customMessage"
            type="text"
            maxlength="45"
            placeholder="Ex: Onde o nosso amor começou..."
            class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
            @input="handleStateChange"
          />
          <span class="text-[10px] text-[#5A738E] mt-1 block">
            {{ 45 - customMessage.length }} caracteres restantes
          </span>
        </div>
      </div>
    </div>

    <!-- Resumo e Botão de Adicionar com Touch Target Mínimo -->
    <div class="pt-4 border-t border-[#E6E1D6] space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] text-[#5A738E] uppercase tracking-wider block">Valor com Personalização</span>
          <div class="font-serif-editorial text-2xl font-bold text-[#0B3C5D]">
            R$ {{ selectedProduct ? selectedProduct.price.toFixed(2).replace('.', ',') : '149,00' }}
          </div>
        </div>
        <div class="text-[10px] text-right text-[#5A738E]">
          <span class="text-[#0B3C5D] font-bold flex items-center justify-end gap-1">
            <Sparkles :size="12" />
            <span>Caligrafia de Cortesia</span>
          </span>
          <span>Frete Grátis acima de R$ 79,90</span>
        </div>
      </div>

      <button
        type="button"
        :disabled="!selectedProduct"
        class="w-full py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 min-h-[48px] cursor-pointer"
        @click="handleAddToCart"
      >
        <ShoppingBag :size="16" />
        <span>Adicionar Garrafa Personalizada ao Carrinho</span>
      </button>
    </div>

  </div>
</template>
