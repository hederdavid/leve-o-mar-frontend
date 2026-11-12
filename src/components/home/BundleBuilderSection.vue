<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockProducts } from '@/mocks/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import confetti from 'canvas-confetti'
import { toast } from 'vue-sonner'
import {
  Sparkles,
  Plus,
  X,
  ShoppingBag,
  Package,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  Check
} from 'lucide-vue-next'
import { analytics } from '@/services/analytics'

const cartStore = useCartStore()

// Pré-seleciona as duas primeiras praias populares para dar contexto imediato
const selectedBottles = ref<(Product | null)[]>([
  mockProducts[0] || null,
  mockProducts[1] || null,
  null
])

const bundleDedication = ref('')
const activeSlotIndex = ref<number | null>(null)
const isModalOpen = ref(false)

const isComplete = computed(() => {
  return selectedBottles.value.every((b) => b !== null)
})

const originalTotal = computed(() => {
  return selectedBottles.value.reduce((acc, b) => acc + (b?.price || 0), 0)
})

const discountAmount = computed(() => {
  return originalTotal.value * 0.15
})

const bundleTotal = computed(() => {
  return originalTotal.value - discountAmount.value
})

function openPicker(slotIndex: number) {
  activeSlotIndex.value = slotIndex
  isModalOpen.value = true
}

function selectBottle(product: Product) {
  if (activeSlotIndex.value !== null) {
    selectedBottles.value[activeSlotIndex.value] = product
    isModalOpen.value = false
    activeSlotIndex.value = null
  }
}

function removeBottle(index: number) {
  selectedBottles.value[index] = null
}

function handleAddBundleToCart() {
  if (!isComplete.value) return

  selectedBottles.value.forEach((bottle, idx) => {
    if (bottle) {
      // Aplica o desconto de 15% proporcional em cada garrafa do combo
      const discountedProduct: Product = {
        ...bottle,
        price: parseFloat((bottle.price * 0.85).toFixed(2))
      }

      cartStore.addItem(discountedProduct, {
        dedicationText: bundleDedication.value ? `${bundleDedication.value} (Frasco ${idx + 1}/3)` : undefined,
        giftMessage: 'Trio do Litoral Brasileiro · 15% OFF Especial',
        includeCollectorCertificate: true
      })
    }
  })

  analytics.track('bundle_created', {
    beaches: selectedBottles.value.map((b) => b?.beachName),
    originalTotal: originalTotal.value,
    discountAmount: discountAmount.value,
    bundleTotal: bundleTotal.value
  })

  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#0B3C5D', '#05BFDB', '#D97706', '#E86A58']
  })

  toast.success('Trio do Litoral adicionado às suas aventuras!', {
    description: `Economia de R$ ${discountAmount.value.toFixed(2).replace('.', ',')} + Caixa Coletiva de Pinho inclusa.`
  })
}
</script>

<template>
  <section class="py-16 sm:py-24 bg-[#EBE7DE]/60 border-y border-[#E6E1D6] relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Cabeçalho da Seção -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D6CFC0] text-xs font-bold text-[#D97706] mb-4">
          <Sparkles :size="13" />
          <span>EXPERIÊNCIA EXCLUSIVA DO COLECIONADOR</span>
        </div>

        <h2 class="font-serif-editorial text-3xl sm:text-5xl font-extrabold text-[#0A2B42] leading-tight">
          Monte seu Trio do Litoral
        </h2>

        <p class="text-sm sm:text-base text-[#5A738E] mt-3">
          Reúna as 3 praias mais marcantes da sua história. Receba <strong>15% de desconto automático</strong>, caixa coletiva rústica de pinho e caligrafia personalizada em cada rótulo.
        </p>
      </div>

      <!-- Container do Construtor -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Os 3 Slots de Garrafas -->
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="(bottle, index) in selectedBottles"
            :key="index"
            class="relative rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white border"
            :class="bottle ? 'border-[#0B3C5D]/30 shadow-md p-4' : 'border-dashed border-2 border-[#D6CFC0] p-6 hover:border-[#0B3C5D] cursor-pointer min-h-[340px] items-center justify-center text-center'"
            @click="!bottle ? openPicker(index) : null"
          >
            <!-- Slot Preenchido com Garrafa -->
            <template v-if="bottle">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#F7F4EE] px-2 py-0.5 rounded-full border border-[#E6E1D6]">
                  Praia {{ index + 1 }} de 3
                </span>
                
                <button
                  type="button"
                  aria-label="Trocar garrafa"
                  class="w-7 h-7 text-[#8A9BA8] hover:text-[#E86A58] rounded-full hover:bg-[#FDF3F1] flex items-center justify-center transition-colors cursor-pointer"
                  @click.stop="removeBottle(index)"
                >
                  <X :size="14" />
                </button>
              </div>

              <!-- Foto da Garrafa -->
              <div class="w-full h-44 rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E6E1D6] my-2 relative group">
                <img
                  :src="bottle.bottleImage"
                  :alt="bottle.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  class="absolute inset-0 bg-[#0A2B42]/50 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  @click.stop="openPicker(index)"
                >
                  Trocar Praia
                </button>
              </div>

              <div>
                <h4 class="font-serif-editorial text-base font-bold text-[#0A2B42] truncate">
                  {{ bottle.beachName }}
                </h4>
                <p class="text-[11px] text-[#5A738E] truncate">
                  {{ bottle.city }}, {{ bottle.uf }}
                </p>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EDE4]">
                  <span class="text-xs text-[#8A9BA8] line-through">
                    R$ {{ bottle.price.toFixed(2).replace('.', ',') }}
                  </span>
                  <span class="text-xs font-bold text-[#0B3C5D]">
                    R$ {{ (bottle.price * 0.85).toFixed(2).replace('.', ',') }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Slot Vazio -->
            <template v-else>
              <div class="w-14 h-14 rounded-full bg-[#F7F4EE] border border-[#D6CFC0] flex items-center justify-center text-[#0B3C5D] mb-3 group-hover:scale-110 transition-transform shadow-inner">
                <Plus :size="22" />
              </div>
              <h4 class="font-serif-editorial text-base font-bold text-[#0A2B42]">
                Escolha a {{ index + 1 }}ª Praia
              </h4>
              <p class="text-xs text-[#5A738E] mt-1 max-w-[180px]">
                Clique para selecionar o destino da sua coleção
              </p>
              <button
                type="button"
                class="mt-4 px-4 py-2 rounded-full bg-[#0B3C5D] text-white text-xs font-bold hover:bg-[#0A2B42] transition-colors cursor-pointer"
                @click.stop="openPicker(index)"
              >
                Selecionar
              </button>
            </template>
          </div>
        </div>

        <!-- Painel Lateral: Resumo do Combo, Benefícios & CTA -->
        <div class="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E6E1D6] shadow-xl space-y-5">
          <div class="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
            <h3 class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
              Resumo do seu Trio
            </h3>
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-full"
              :class="isComplete ? 'bg-[#05BFDB]/15 text-[#0B3C5D]' : 'bg-[#EBE7DE] text-[#5A738E]'"
            >
              {{ selectedBottles.filter(b => b !== null).length }} de 3 selecionadas
            </span>
          </div>

          <!-- Corteses & Benefícios Inclusos -->
          <div class="space-y-2.5 text-xs text-[#5A738E]">
            <div class="flex items-center gap-2.5 text-[#0A2B42]">
              <Package :size="15" class="text-[#0B3C5D] flex-shrink-0" />
              <span><strong>Caixa Rústica Coletiva de Pinho</strong> (Inclusa)</span>
            </div>
            <div class="flex items-center gap-2.5 text-[#0A2B42]">
              <PenTool :size="15" class="text-[#0B3C5D] flex-shrink-0" />
              <span><strong>Caligrafia Afetiva Personalizada</strong> nos 3 rótulos</span>
            </div>
            <div class="flex items-center gap-2.5 text-[#0A2B42]">
              <ShieldCheck :size="15" class="text-[#0B3C5D] flex-shrink-0" />
              <span><strong>Seguro Vidro Antichoque</strong> com berço náutico</span>
            </div>
          </div>

          <!-- Campo Opcional de Dedicatória -->
          <div class="pt-2 border-t border-[#F0EDE4]">
            <label class="block text-xs font-bold text-[#0A2B42] mb-1.5">
              Dedicatória para a Caixa Coletiva (Opcional):
            </label>
            <input
              v-model="bundleDedication"
              type="text"
              placeholder="Ex: Nossos verões no litoral brasileiro"
              class="w-full text-xs px-3 py-2 rounded-xl bg-[#F7F4EE] border border-[#D6CFC0] text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
            />
          </div>

          <!-- Totalizador de Preço -->
          <div class="pt-3 border-t border-[#F0EDE4] space-y-1.5 text-xs">
            <div class="flex justify-between text-[#5A738E]">
              <span>Valor individual somado:</span>
              <span class="line-through">R$ {{ originalTotal.toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-[#D97706] font-bold">
              <span>Desconto de Colecionador (15% OFF):</span>
              <span>- R$ {{ discountAmount.toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-[#F0EDE4]">
              <span class="font-bold text-[#0A2B42] text-sm">Preço do Trio:</span>
              <div class="text-right">
                <span class="font-serif-editorial text-2xl font-bold text-[#0B3C5D]">
                  R$ {{ bundleTotal.toFixed(2).replace('.', ',') }}
                </span>
                <span class="block text-[10px] text-[#5A738E]">
                  ou 3x de R$ {{ (bundleTotal / 3).toFixed(2).replace('.', ',') }} sem juros
                </span>
              </div>
            </div>
          </div>

          <!-- Botão Adicionar Trio -->
          <button
            type="button"
            :disabled="!isComplete"
            class="w-full py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            :class="isComplete ? 'bg-[#0B3C5D] hover:bg-[#0A2B42] text-white' : 'bg-[#D6CFC0] text-[#5A738E]'"
            @click="handleAddBundleToCart"
          >
            <ShoppingBag :size="16" />
            <span>{{ isComplete ? 'Adicionar Trio Completo à Sacola' : 'Selecione as 3 Praias para Liberar' }}</span>
          </button>
        </div>

      </div>

    </div>

    <!-- Modal de Seleção de Praia -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A2B42]/70 backdrop-blur-md animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-2xl bg-[#F7F4EE] rounded-2xl shadow-2xl border border-[#E6E1D6] overflow-hidden flex flex-col max-h-[85vh]">
          
          <div class="p-4 sm:p-5 border-b border-[#E6E1D6] flex items-center justify-between bg-white">
            <div>
              <h3 class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
                Escolha a Praia para o Slot {{ (activeSlotIndex ?? 0) + 1 }}
              </h3>
              <p class="text-xs text-[#5A738E]">
                Selecione qualquer uma das praias do acervo Leve o Mar
              </p>
            </div>
            <button
              type="button"
              class="p-1.5 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors cursor-pointer"
              @click="isModalOpen = false"
            >
              <X :size="20" />
            </button>
          </div>

          <div class="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="product in mockProducts"
              :key="product.id"
              class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E6E1D6] hover:border-[#0B3C5D] transition-all cursor-pointer shadow-sm group"
              @click="selectBottle(product)"
            >
              <img
                :src="product.bottleImage"
                :alt="product.beachName"
                class="w-14 h-16 object-cover rounded-lg border border-[#E6E1D6] flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-serif-editorial text-sm font-bold text-[#0A2B42] group-hover:text-[#0B3C5D] truncate">
                  {{ product.beachName }}
                </h4>
                <p class="text-[11px] text-[#5A738E] truncate">
                  {{ product.city }}, {{ product.uf }}
                </p>
                <div class="flex items-center justify-between mt-1 pt-1 border-t border-[#F0EDE4]">
                  <span class="text-xs font-bold text-[#0B3C5D]">
                    R$ {{ product.price.toFixed(2).replace('.', ',') }}
                  </span>
                  <span class="text-[10px] text-[#D97706] font-semibold">
                    15% OFF no combo
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>
  </section>
</template>
