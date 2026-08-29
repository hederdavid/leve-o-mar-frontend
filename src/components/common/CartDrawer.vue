<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import confetti from 'canvas-confetti'
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, Sparkles, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const isCheckingOut = ref(false)
const isSuccessOrder = ref(false)
const orderNumber = ref('')

function goToCheckout() {
  cartStore.closeDrawer()
  router.push('/checkout')
}

function handleCheckout() {
  isCheckingOut.value = true
  setTimeout(() => {
    isCheckingOut.value = false
    isSuccessOrder.value = true
    orderNumber.value = `LOM-${Math.floor(100000 + Math.random() * 900000)}`
    
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0B3C5D', '#E86A58', '#F59E0B', '#05BFDB']
    })

    cartStore.clearCart()
  }, 1000)
}

function handleFinish() {
  isSuccessOrder.value = false
  cartStore.closeDrawer()
}
</script>

<template>
  <div
    v-if="cartStore.isDrawerOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-[#0A2B42]/60 backdrop-blur-sm transition-opacity"
      @click="cartStore.closeDrawer"
    />

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-[#F7F4EE] border-l border-[#E6E1D6] shadow-2xl flex flex-col justify-between">
        <div class="p-6 border-b border-[#E6E1D6] flex items-center justify-between bg-white/50 backdrop-blur-sm">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#0B3C5D] text-white flex items-center justify-center">
              <ShoppingBag :size="16" />
            </div>
            <div>
              <h2 class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
                Suas Aventuras
              </h2>
              <span class="text-[11px] text-[#5A738E] block -mt-0.5">
                {{ cartStore.totalItemsCount }} {{ cartStore.totalItemsCount === 1 ? 'garrafa selecionada' : 'garrafas selecionadas' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="p-2 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors"
            @click="cartStore.closeDrawer"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
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
                class="px-6 py-2.5 bg-[#0B3C5D] text-white text-xs font-bold rounded-full shadow hover:bg-[#0A2B42] transition-colors"
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
            <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">
              Sua coleção está vazia
            </h3>
            <p class="text-xs text-[#5A738E] max-w-xs mx-auto">
              Escolha uma de nossas praias para começar a sua viagem sensorial e colecionar momentos.
            </p>
            <a
              href="#colecao"
              class="inline-block px-6 py-2.5 bg-[#0B3C5D] text-white text-xs font-bold rounded-full shadow hover:bg-[#0A2B42] transition-colors mt-2"
              @click="cartStore.closeDrawer"
            >
              Explorar Destinos
            </a>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="p-3.5 bg-white rounded-2xl border border-[#EBE7DE] shadow-sm flex items-center gap-3.5"
            >
              <img
                :src="item.product.bottleImage"
                :alt="item.product.beachName"
                class="w-14 h-14 object-cover rounded-xl border border-[#E6E1D6] flex-shrink-0"
              />

              <div class="flex-1 min-w-0">
                <h4 class="font-serif-editorial text-sm font-bold text-[#0A2B42] truncate">
                  {{ item.product.beachName }}
                </h4>
                <div class="text-[10px] text-[#5A738E]">
                  {{ item.product.categoryTag }} · {{ item.product.uf }}
                </div>
                <div class="text-xs font-bold text-[#0B3C5D] mt-1">
                  R$ {{ item.product.price.toFixed(2).replace('.', ',') }}
                </div>
              </div>

              <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  aria-label="Remover item"
                  class="text-[#5A738E] hover:text-[#E86A58] p-1 transition-colors"
                  @click="cartStore.removeItem(item.id)"
                >
                  <Trash2 :size="14" />
                </button>

                <div class="flex items-center border border-[#E6E1D6] rounded-lg bg-[#F7F4EE] px-1 py-0.5">
                  <button
                    type="button"
                    class="p-1 text-[#0A2B42] hover:bg-[#EBE7DE] rounded"
                    @click="cartStore.updateQuantity(item.id, -1)"
                  >
                    <Minus :size="10" />
                  </button>
                  <span class="px-2 text-xs font-bold text-[#0A2B42]">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="p-1 text-[#0A2B42] hover:bg-[#EBE7DE] rounded"
                    @click="cartStore.updateQuantity(item.id, 1)"
                  >
                    <Plus :size="10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cartStore.items.length > 0 && !isSuccessOrder" class="p-6 bg-white border-t border-[#E6E1D6] space-y-4">
          <div class="flex items-center gap-2 text-[11px] text-[#5A738E] bg-[#F7F4EE] p-2.5 rounded-xl border border-[#EBE7DE]">
            <ShieldCheck :size="16" class="text-[#0B3C5D] flex-shrink-0" />
            <span>Embalagem reforçada antiimpacto e seguro de transporte inclusos.</span>
          </div>

          <div class="space-y-1.5 text-xs text-[#5A738E]">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-semibold text-[#0A2B42]">
                R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Frete Seguro Vidro</span>
              <span class="font-semibold text-[#0B3C5D]">Grátis para todo o Brasil</span>
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
            class="w-full py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            @click="goToCheckout"
          >
            <span>Prosseguir para o Checkout Seguro</span>
            <ArrowRight :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
