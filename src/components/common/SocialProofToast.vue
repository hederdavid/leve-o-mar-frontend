<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircle2, ShieldCheck, X } from 'lucide-vue-next'

interface ProofEvent {
  id: string
  buyerName: string
  buyerLocation: string
  productName: string
  beachName: string
  imageUrl: string
  timeAgo: string
  detail: string
}

const proofEvents: ProofEvent[] = [
  {
    id: '1',
    buyerName: 'Mariana S.',
    buyerLocation: 'Florianópolis, SC',
    productName: 'Garrafa Baía dos Porcos',
    beachName: 'Fernando de Noronha',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    timeAgo: 'há 2 minutos',
    detail: 'Seguro Vidro ativado'
  },
  {
    id: '2',
    buyerName: 'Rodrigo M.',
    buyerLocation: 'Belo Horizonte, MG',
    productName: 'Trio do Litoral',
    beachName: 'Combo 3 Praias Brasileiras',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=200&q=80',
    timeAgo: 'há 6 minutos',
    detail: 'Com caligrafia afetiva no rótulo'
  },
  {
    id: '3',
    buyerName: 'Camila T.',
    buyerLocation: 'São Paulo, SP',
    productName: 'Garrafa Maragogi',
    beachName: 'Alagoas',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80',
    timeAgo: 'há 11 minutos',
    detail: 'Com suporte de madeira nobre'
  },
  {
    id: '4',
    buyerName: 'Lucas P.',
    buyerLocation: 'Curitiba, PR',
    productName: 'Garrafa Praia dos Carneiros',
    beachName: 'Pernambuco',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=200&q=80',
    timeAgo: 'há 19 minutos',
    detail: 'Certificado de autenticidade emitido'
  },
  {
    id: '5',
    buyerName: 'Beatriz V.',
    buyerLocation: 'Rio de Janeiro, RJ',
    productName: 'Garrafa Jericoacoara',
    beachName: 'Ceará',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=200&q=80',
    timeAgo: 'há 27 minutos',
    detail: 'Edição limitada numerada'
  }
]

const currentIndex = ref(0)
const isVisible = ref(false)
const isDismissed = ref(false)
let displayTimer: ReturnType<typeof setTimeout> | null = null
let intervalTimer: ReturnType<typeof setInterval> | null = null

function showNext() {
  if (isDismissed.value) return
  isVisible.value = true

  displayTimer = setTimeout(() => {
    isVisible.value = false
    currentIndex.value = (currentIndex.value + 1) % proofEvents.length
  }, 6000)
}

function dismiss() {
  isVisible.value = false
  isDismissed.value = true
  if (displayTimer) clearTimeout(displayTimer)
  if (intervalTimer) clearInterval(intervalTimer)
}

onMounted(() => {
  // Primeira notificação após 8 segundos
  const initialDelay = setTimeout(() => {
    showNext()
    // Notificações subsequentes a cada 28 segundos
    intervalTimer = setInterval(() => {
      showNext()
    }, 28000)
  }, 8000)

  onUnmounted(() => {
    clearTimeout(initialDelay)
    if (displayTimer) clearTimeout(displayTimer)
    if (intervalTimer) clearInterval(intervalTimer)
  })
})
</script>

<template>
  <Transition
    enter-active-class="transform transition ease-out duration-500"
    enter-from-class="translate-y-8 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transform transition ease-in duration-300"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-8 opacity-0 scale-95"
  >
    <div
      v-if="isVisible && !isDismissed && proofEvents[currentIndex]"
      class="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E6E1D6] p-3 rounded-2xl shadow-xl max-w-sm pointer-events-auto"
      role="status"
      aria-live="polite"
    >
      <!-- Foto Miniatura do Produto / Destino -->
      <img
        :src="proofEvents[currentIndex]!.imageUrl"
        :alt="proofEvents[currentIndex]!.productName"
        class="w-12 h-12 rounded-xl object-cover border border-[#E6E1D6] flex-shrink-0"
      />

      <!-- Detalhes do Colecionador & Resgate -->
      <div class="flex-1 min-w-0 pr-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-[#0A2B42]">
          <span class="truncate">{{ proofEvents[currentIndex]!.buyerName }}</span>
          <span class="text-[10px] text-[#5A738E] font-normal truncate">({{ proofEvents[currentIndex]!.buyerLocation }})</span>
          <CheckCircle2 :size="12" class="text-[#05BFDB] flex-shrink-0" />
        </div>

        <p class="text-xs font-serif-editorial font-bold text-[#0B3C5D] truncate mt-0.5">
          {{ proofEvents[currentIndex]!.productName }}
        </p>

        <div class="flex items-center gap-1.5 text-[10px] text-[#5A738E] mt-0.5">
          <ShieldCheck :size="11" class="text-[#D97706] flex-shrink-0" />
          <span class="truncate">{{ proofEvents[currentIndex]!.detail }}</span>
          <span class="text-[#8A9BA8]">·</span>
          <span class="flex-shrink-0">{{ proofEvents[currentIndex]!.timeAgo }}</span>
        </div>
      </div>

      <!-- Botão Fechar -->
      <button
        type="button"
        aria-label="Dispensar notificações"
        class="text-[#8A9BA8] hover:text-[#0A2B42] p-1 rounded-full hover:bg-[#EBE7DE] transition-colors flex-shrink-0 cursor-pointer -mt-4 -mr-1"
        @click="dismiss"
      >
        <X :size="14" />
      </button>
    </div>
  </Transition>
</template>
