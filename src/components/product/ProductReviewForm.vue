<script setup lang="ts">
import { ref } from 'vue'
import { Star, Send, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { NewReviewPayload } from '@/types/review'

interface Props {
  productId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submitReview', payload: NewReviewPayload): void
  (e: 'cancel'): void
}>()

const rating = ref(5)
const hoverRating = ref(0)
const author = ref('')
const city = ref('')
const uf = ref('BA')
const title = ref('')
const comment = ref('')
const isSubmitting = ref(false)

const ufs = ['AL', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']

function setRating(val: number) {
  rating.value = val
}

function handleSubmit() {
  if (!author.value.trim() || !comment.value.trim() || !city.value.trim()) {
    toast.error('Por favor, preencha todos os campos obrigatórios.')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    emit('submitReview', {
      productId: props.productId,
      author: author.value.trim(),
      city: city.value.trim(),
      uf: uf.value,
      rating: rating.value,
      title: title.value.trim() || undefined,
      comment: comment.value.trim()
    })
    isSubmitting.value = false
    toast.success('Avaliação publicada com sucesso!', {
      description: 'Obrigado por compartilhar seu afeto por este destino.'
    })
  }, 400)
}
</script>

<template>
  <div class="p-4 sm:p-6 bg-[#F7F4EE] rounded-2xl sm:rounded-3xl border border-[#E6E1D6] space-y-4 animate-fade-in shadow-inner">
    <div class="flex items-center justify-between">
      <h4 class="font-serif-editorial text-base sm:text-lg font-bold text-[#0A2B42]">
        Deixe sua Avaliação de Colecionador
      </h4>
      <button
        type="button"
        aria-label="Fechar formulário"
        class="w-11 h-11 text-[#5A738E] hover:text-[#0A2B42] rounded-full flex items-center justify-center cursor-pointer"
        @click="emit('cancel')"
      >
        <X :size="18" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <!-- Seletor de Estrelas Interativo com Touch Targets de 44px -->
      <div>
        <label class="text-xs font-bold text-[#0A2B42] block mb-1.5">Sua Nota:</label>
        <div class="flex items-center gap-1">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            :aria-label="`Avaliar com ${star} estrelas`"
            class="w-11 h-11 flex items-center justify-center text-[#F59E0B] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            @click="setRating(star)"
          >
            <Star
              :size="26"
              :class="[
                (hoverRating ? star <= hoverRating : star <= rating)
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-[#D6CFC0]'
              ]"
            />
          </button>
          <span class="text-xs font-bold text-[#0A2B42] ml-1">{{ rating }} de 5</span>
        </div>
      </div>

      <!-- Nome e Cidade/UF -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div class="sm:col-span-6">
          <label class="text-xs font-semibold text-[#5A738E] block mb-1">Seu Nome *</label>
          <input
            v-model="author"
            type="text"
            required
            placeholder="Ex: Carolina Mendes"
            class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-white border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
          />
        </div>
        <div class="sm:col-span-4">
          <label class="text-xs font-semibold text-[#5A738E] block mb-1">Cidade *</label>
          <input
            v-model="city"
            type="text"
            required
            placeholder="Ex: São Paulo"
            class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-white border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs font-semibold text-[#5A738E] block mb-1">UF</label>
          <select
            v-model="uf"
            class="w-full text-xs sm:text-sm px-2.5 py-3 rounded-xl bg-white border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
          >
            <option v-for="state in ufs" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>
      </div>

      <!-- Título da Avaliação -->
      <div>
        <label class="text-xs font-semibold text-[#5A738E] block mb-1">Título da Avaliação</label>
        <input
          v-model="title"
          type="text"
          placeholder="Ex: A cor da água é inacreditável!"
          class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-white border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] min-h-[44px]"
        />
      </div>

      <!-- Comentário / Opinião -->
      <div>
        <label class="text-xs font-semibold text-[#5A738E] block mb-1">Seu Depoimento *</label>
        <textarea
          v-model="comment"
          rows="3"
          required
          placeholder="Conte como a garrafa transformou o seu ambiente..."
          class="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl bg-white border border-[#D6CFC0] focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
        />
      </div>

      <!-- Ações com Touch Targets Mínimos -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          type="button"
          class="px-4 py-3 text-xs font-semibold text-[#5A738E] hover:text-[#0A2B42] text-center min-h-[44px]"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 min-h-[44px] cursor-pointer"
        >
          <Send :size="14" />
          <span>{{ isSubmitting ? 'Enviando...' : 'Publicar Avaliação' }}</span>
        </button>
      </div>

    </form>
  </div>
</template>
