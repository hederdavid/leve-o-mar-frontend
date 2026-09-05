<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { mockAccessories } from '@/mocks/accessories'
import type { Product } from '@/types/product'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
  Check
} from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const isSuccessOrder = ref(false)
const orderNumber = ref('')

const FREE_SHIPPING_THRESHOLD = 79.9

const freeShippingProgress = computed(() => {
  return Math.min(100, Math.round((cartStore.subtotal / FREE_SHIPPING_THRESHOLD) * 100))
})

const remainingForFreeShipping = computed(() => {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - cartStore.subtotal)
})

const hasFreeShipping = computed(() => {
  return cartStore.subtotal >= FREE_SHIPPING_THRESHOLD
})

function isAccessoryInCart(id: string): boolean {
  return cartStore.items.some((i) => i.product.id === id)
}

function handleAddAccessory(acc: Product) {
  cartStore.addItem(acc)
}

function goToCheckout() {
  cartStore.closeDrawer()
  router.push('/checkout')
}

function handleFinish() {
  isSuccessOrder.value = false
  cartStore.closeDrawer()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="cartStore.isDrawerOpen"
      class="fixed inset-0 z-[9999] overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Overlay Escurecido com Blur -->
      <div
        class="fixed inset-0 bg-[#0A2B42]/60 backdrop-blur-sm transition-opacity"
        @click="cartStore.closeDrawer"
      />

      <!-- Painel Lateral Deslizante (Ocupa 100% da tela em telas pequenas) -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div class="w-screen max-w-full sm:max-w-md bg-[#F7F4EE] border-l border-[#E6E1D6] shadow-2xl flex flex-col justify-between">
        
        <!-- Cabeçalho do Carrinho -->
        <div class="p-4 sm:p-6 border-b border-[#E6E1D6] flex items-center justify-between bg-white/70 backdrop-blur-sm">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-[#0B3C5D] text-white flex items-center justify-center shadow-sm">
              <ShoppingBag :size="16" />
            </div>
            <div>
              <h2 class="font-serif-editorial text-base sm:text-lg font-bold text-[#0A2B42]">
                Suas Aventuras
              </h2>
              <span class="text-[10px] sm:text-[11px] text-[#5A738E] block -mt-0.5">
                {{ cartStore.totalItemsCount }} {{ cartStore.totalItemsCount === 1 ? 'garrafa selecionada' : 'garrafas selecionadas' }}
              </span>
            </div>
          </div>

          <!-- Botão Fechar com Touch Target Mínimo de 44x44px -->
          <button
            type="button"
            aria-label="Fechar carrinho"
            class="w-11 h-11 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors flex items-center justify-center cursor-pointer"
            @click="cartStore.closeDrawer"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Barra Dinâmica de Frete Grátis -->
        <div class="px-4 sm:px-6 py-2.5 bg-[#EBE7DE]/70 border-b border-[#E6E1D6]">
          <div class="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span v-if="!hasFreeShipping" class="flex items-center gap-1.5 text-[#0A2B42]">
              <Truck :size="13" class="text-[#0B3C5D]" />
              <span>Faltam <strong>R$ {{ remainingForFreeShipping.toFixed(2).replace('.', ',') }}</strong> para <strong>Frete Grátis</strong></span>
            </span>
            <span v-else class="flex items-center gap-1.5 text-[#0B3C5D] font-bold">
              <CheckCircle2 :size="13" class="text-[#05BFDB]" />
              <span>Frete Grátis com Seguro Vidro Desbloqueado!</span>
            </span>
            <span class="text-[10px] text-[#5A738E] font-bold font-mono">{{ freeShippingProgress }}%</span>
          </div>
          <div class="w-full h-1.5 bg-[#D6CFC0] rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-[#05BFDB] to-[#0B3C5D] transition-all duration-500 rounded-full"
              :style="{ width: `${freeShippingProgress}%` }"
            />
          </div>
        </div>

        <!-- Lista de Itens do Carrinho -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div v-if="isSuccessOrder" class="py-12 text-center space-y-4">
            <div class="w-16 h-16 bg-[#F59E0B]/20 text-[#D97706] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sparkles :size="32" />
            </div>
            <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">
              Pedido Confirmado!
            </h3>
            <p class="text-xs text-[#5A738E] max-w-xs mx-auto">
              Sua memória em garrafa está sendo preparada artesanalmente com embalagem antiimpacto e seguro de transporte.
            </p>
            <div class="p-3 bg-white rounded-xl border border-[#EBE7DE] inline-block text-xs font-mono font-bold text-[#0B3C5D]">
              Código: {{ orderNumber }}
            </div>
            <div class="pt-4">
              <button
                type="button"
                class="px-6 py-3 bg-[#0B3C5D] text-white text-xs font-bold rounded-full shadow hover:bg-[#0A2B42] transition-colors min-h-[44px]"
                @click="handleFinish"
              >
                Voltar à Loja
              </button>
            </div>
          </div>

          <div v-else-if="cartStore.items.length === 0" class="py-16 text-center space-y-4">
            <div class="w-16 h-16 bg-[#EBE7DE] text-[#5A738E] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag :size="28" />
            </div>
            <div>
              <p class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
                Sua sacola está vazia
              </p>
              <p class="text-xs text-[#5A738E] mt-1 max-w-xs mx-auto">
                Explore nossas coleções e escolha a sua primeira praia para colecionar.
              </p>
            </div>
            <button
              type="button"
              class="px-6 py-3 bg-[#0B3C5D] text-white text-xs font-bold rounded-full shadow hover:bg-[#0A2B42] transition-colors min-h-[44px]"
              @click="cartStore.closeDrawer"
            >
              Explorar Praias do Litoral
            </button>
          </div>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="card-maritimo p-3 sm:p-4 flex gap-3 relative overflow-hidden bg-white shadow-sm"
          >
            <!-- Foto da Garrafa -->
            <div class="w-16 h-20 sm:w-20 sm:h-24 bg-[#F7F4EE] rounded-xl overflow-hidden flex-shrink-0 border border-[#E6E1D6]">
              <img
                :src="item.product.bottleImage"
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Dados do Item -->
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h4 class="font-serif-editorial text-xs sm:text-sm font-bold text-[#0A2B42] truncate">
                    {{ item.product.beachName }}
                  </h4>
                  
                  <!-- Botão Remover (Touch Target Mínimo) -->
                  <button
                    type="button"
                    aria-label="Remover item"
                    class="w-8 h-8 -mr-1 -mt-1 text-[#5A738E] hover:text-[#E86A58] flex items-center justify-center rounded-full hover:bg-[#FDF3F1] transition-colors cursor-pointer"
                    @click="cartStore.removeItem(item.id)"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>

                <span class="text-[10px] text-[#5A738E] block truncate">
                  {{ item.product.categoryTag }} · {{ item.product.uf }}
                </span>

                <!-- Mensagem de Presente Customizada -->
                <div
                  v-if="item.customization?.recipientName || item.customization?.giftMessage"
                  class="mt-1 p-1.5 bg-[#F7F4EE] rounded-lg border border-[#EBE7DE] text-[9px] text-[#5A738E] space-y-0.5"
                >
                  <span v-if="item.customization.recipientName" class="font-bold text-[#0B3C5D] block truncate">
                    Para: {{ item.customization.recipientName }}
                  </span>
                  <span v-if="item.customization.giftMessage" class="italic block truncate">
                    "{{ item.customization.giftMessage }}"
                  </span>
                </div>
              </div>

              <!-- Quantidade & Preço -->
              <div class="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EDE4]">
                <div class="flex items-center border border-[#D6CFC0] rounded-full bg-white px-1 py-0.5">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    class="w-8 h-8 flex items-center justify-center text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full transition-colors cursor-pointer"
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  >
                    <Minus :size="12" />
                  </button>
                  <span class="text-xs font-bold px-2 text-[#0A2B42]">{{ item.quantity }}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    class="w-8 h-8 flex items-center justify-center text-[#0A2B42] hover:bg-[#EBE7DE] rounded-full transition-colors cursor-pointer"
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  >
                    <Plus :size="12" />
                  </button>
                </div>

                <div class="text-right">
                  <span class="font-serif-editorial text-xs sm:text-sm font-bold text-[#0A2B42]">
                    R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Upsell 1-Clique: Acessórios & Complementos do Ateliê -->
          <div v-if="cartStore.items.length > 0" class="pt-4 border-t border-[#E6E1D6] space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[#0A2B42] uppercase tracking-wider">
                Complemente suas Garrafas
              </span>
              <span class="text-[10px] text-[#5A738E]">1-Clique para adicionar</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="acc in mockAccessories"
                :key="acc.id"
                class="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#E6E1D6] gap-2.5 shadow-sm"
              >
                <img
                  :src="acc.bottleImage"
                  :alt="acc.name"
                  class="w-11 h-11 object-cover rounded-lg border border-[#E6E1D6] flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-[#0A2B42] truncate">{{ acc.name }}</h5>
                  <span class="text-[10px] text-[#5A738E] block truncate">{{ acc.categoryTag }}</span>
                  <span class="text-xs font-bold text-[#0B3C5D]">
                    R$ {{ acc.price.toFixed(2).replace('.', ',') }}
                  </span>
                </div>
                <button
                  type="button"
                  :disabled="isAccessoryInCart(acc.id)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 disabled:cursor-default"
                  :class="isAccessoryInCart(acc.id) ? 'bg-[#EBE7DE] text-[#5A738E]' : 'bg-[#0B3C5D] text-white hover:bg-[#0A2B42] active:scale-95'"
                  @click="handleAddAccessory(acc)"
                >
                  <Check v-if="isAccessoryInCart(acc.id)" :size="13" />
                  <Plus v-else :size="13" />
                  <span>{{ isAccessoryInCart(acc.id) ? 'Na Sacola' : 'Adicionar' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Rodapé do Carrinho com Totais & Botão de Checkout -->
        <div v-if="cartStore.items.length > 0" class="p-4 sm:p-6 bg-white border-t border-[#E6E1D6] space-y-3 sm:space-y-4">
          <div class="space-y-1.5 text-xs text-[#5A738E]">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-[#0A2B42]">
                R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}
              </span>
            </div>
            <div class="flex justify-between items-center text-[11px] text-[#0B3C5D]">
              <span class="flex items-center gap-1">
                <ShieldCheck :size="13" />
                <span>Embalagem Antiimpacto de Vidro</span>
              </span>
              <span class="font-semibold text-[#0B3C5D]">Grátis</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-[#0A2B42] pt-2 border-t border-[#F0EDE4]">
              <span>Total</span>
              <span class="font-serif-editorial text-lg text-[#0B3C5D]">
                R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-4 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[48px]"
            @click="goToCheckout"
          >
            <span>Prosseguir para o Checkout Seguro</span>
            <ArrowRight :size="16" />
          </button>
        </div>

      </div>
    </div>
  </div>
</Teleport>
</template>
