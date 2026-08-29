<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'

interface Props {
  cardNumber: string
  cardHolder: string
  cardExpiry: string
  cardCvv: string
  isFlipped: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardNumber: '',
  cardHolder: '',
  cardExpiry: '',
  cardCvv: '',
  isFlipped: false
})

// Detecção de bandeira do cartão baseada no primeiro dígito
const cardBrand = computed(() => {
  const clean = props.cardNumber.replace(/\D/g, '')
  if (clean.startsWith('4')) return { name: 'Visa', color: '#1A1F71' }
  if (clean.startsWith('5')) return { name: 'Mastercard', color: '#EB001B' }
  if (clean.startsWith('6')) return { name: 'Elo', color: '#FFB800' }
  if (clean.startsWith('3')) return { name: 'Amex', color: '#007BC1' }
  return { name: 'Leve o Mar Card', color: '#0B3C5D' }
})

// Formatação do número do cartão
const formattedNumber = computed(() => {
  const clean = props.cardNumber.replace(/\D/g, '').padEnd(16, '•')
  return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)}`
})
</script>

<template>
  <div class="card-perspective w-full max-w-[320px] sm:max-w-sm mx-auto h-48 sm:h-52 select-none">
    <div
      :class="[
        'card-inner relative w-full h-full duration-700 transition-transform shadow-2xl rounded-2xl sm:rounded-3xl',
        { 'is-flipped': isFlipped }
      ]"
    >
      <!-- Frente do Cartão -->
      <div
        class="card-face card-front absolute inset-0 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden text-white bg-gradient-to-br from-[#0B3C5D] via-[#0A2B42] to-[#144272] border border-white/20 shadow-2xl"
      >
        <!-- Textura de Ondas de Fundo -->
        <div class="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#F59E0B]">
            <Sparkles :size="13" />
            <span>Leve o Mar Club</span>
          </div>

          <!-- Bandeira do Cartão -->
          <span class="font-bold text-xs sm:text-sm italic tracking-wider">
            {{ cardBrand.name }}
          </span>
        </div>

        <!-- Chip Dourado e Ícone de Aproximação -->
        <div class="flex items-center gap-2.5 relative z-10">
          <div class="w-9 sm:w-11 h-7 sm:h-8 rounded-lg bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#8C6D23] shadow-inner flex items-center justify-center">
            <div class="w-6 sm:w-7 h-4 sm:h-5 border border-[#8C6D23]/60 rounded-sm" />
          </div>
          <div class="w-5 sm:w-6 h-5 sm:h-6 border-2 border-white/40 border-l-0 rounded-r-full" />
        </div>

        <!-- Número do Cartão -->
        <div class="relative z-10">
          <div class="font-mono text-base sm:text-lg md:text-xl font-bold tracking-wider sm:tracking-widest text-shadow truncate">
            {{ formattedNumber }}
          </div>
        </div>

        <!-- Titular e Validade -->
        <div class="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-wider relative z-10">
          <div>
            <div class="text-[8px] sm:text-[9px] text-white/60">Titular</div>
            <div class="font-semibold truncate max-w-[140px] sm:max-w-[180px]">
              {{ cardHolder || 'NOME DO COLECIONADOR' }}
            </div>
          </div>
          <div>
            <div class="text-[8px] sm:text-[9px] text-white/60">Validade</div>
            <div class="font-mono font-semibold">
              {{ cardExpiry || 'MM/AA' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Verso do Cartão (Exibido ao digitar o CVV) -->
      <div
        class="card-face card-back absolute inset-0 rounded-2xl sm:rounded-3xl py-4 sm:py-6 flex flex-col justify-between overflow-hidden text-white bg-gradient-to-br from-[#0A2B42] via-[#0B3C5D] to-[#082338] border border-white/20 shadow-2xl"
      >
        <!-- Tarja Magnética Preta -->
        <div class="w-full h-9 sm:h-11 bg-black/80 mt-1 sm:mt-2" />

        <!-- Tarja de Assinatura e CVV -->
        <div class="px-4 sm:px-6 space-y-1">
          <div class="text-[8px] sm:text-[9px] text-white/60 text-right pr-1">CVV / CÓDIGO DE SEGURANÇA</div>
          <div class="w-full bg-white/90 rounded-md h-8 sm:h-9 flex items-center justify-end px-3 sm:px-4 text-[#0A2B42] font-mono font-bold text-xs sm:text-sm tracking-widest shadow-inner">
            {{ cardCvv || '•••' }}
          </div>
        </div>

        <!-- Informações de Segurança -->
        <div class="px-4 sm:px-6 text-[8px] sm:text-[9px] text-white/60 text-center">
          Cartão protegido por criptografia de ponta a ponta.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-perspective {
  perspective: 1000px;
}

.card-inner {
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
