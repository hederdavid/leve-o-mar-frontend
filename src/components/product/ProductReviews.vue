<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Review, ReviewStats, NewReviewPayload } from '@/types/review'
import ProductReviewForm from './ProductReviewForm.vue'
import { Star, CheckCircle, MessageSquarePlus, Filter } from 'lucide-vue-next'

interface Props {
  productId: string
  reviews: Review[]
  stats: ReviewStats
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'addReview', payload: NewReviewPayload): void
}>()

const selectedStarFilter = ref<number | null>(null)
const isWritingReview = ref(false)

const filteredReviews = computed(() => {
  if (!selectedStarFilter.value) return props.reviews
  return props.reviews.filter((r) => r.rating === selectedStarFilter.value)
})

function toggleStarFilter(star: number | null) {
  if (selectedStarFilter.value === star) {
    selectedStarFilter.value = null
  } else {
    selectedStarFilter.value = star
  }
}

function handleNewReview(payload: NewReviewPayload) {
  emit('addReview', payload)
  isWritingReview.value = false
}
</script>

<template>
  <div id="avaliacoes" class="card-maritimo p-6 sm:p-8 bg-white mt-12 space-y-8">
    
    <!-- Cabeçalho e Resumo de Avaliações -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E6E1D6]">
      <div>
        <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block mb-1">
          Opiniões de Quem Já Coleciona
        </span>
        <h3 class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">
          Avaliações do Destino
        </h3>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow transition-all active:scale-95 flex-shrink-0"
        @click="isWritingReview = !isWritingReview"
      >
        <MessageSquarePlus :size="15" />
        <span>Avaliar esta Garrafa</span>
      </button>
    </div>

    <!-- Estatísticas & Barras de Distribuição por Estrela -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      
      <!-- Score Médio -->
      <div class="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#F7F4EE] rounded-3xl border border-[#E6E1D6] text-center">
        <div class="font-serif-editorial text-5xl font-extrabold text-[#0A2B42]">
          {{ stats.averageRating.toFixed(1) }}
        </div>
        <div class="flex items-center gap-1 text-[#F59E0B] my-2">
          <Star v-for="i in 5" :key="i" :size="18" class="fill-[#F59E0B]" />
        </div>
        <span class="text-xs font-semibold text-[#5A738E]">
          Baseado em {{ stats.totalReviews }} depoimentos
        </span>
      </div>

      <!-- Barras de Distribuição por Estrelas (5 a 1) -->
      <div class="md:col-span-8 space-y-2">
        <div
          v-for="star in [5, 4, 3, 2, 1]"
          :key="star"
          class="flex items-center gap-3 text-xs cursor-pointer group"
          @click="toggleStarFilter(star)"
        >
          <span class="w-14 font-semibold text-[#0A2B42] group-hover:text-[#E86A58] transition-colors">
            {{ star }} estrelas
          </span>

          <div class="flex-1 h-3 bg-[#F0EDE4] rounded-full overflow-hidden border border-[#E6E1D6]">
            <div
              class="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
              :style="{ width: `${stats.ratingDistribution[star as 1 | 2 | 3 | 4 | 5] || 0}%` }"
            />
          </div>

          <span class="w-10 text-right font-mono text-[#5A738E]">
            {{ stats.ratingDistribution[star as 1 | 2 | 3 | 4 | 5] || 0 }}%
          </span>
        </div>
      </div>

    </div>

    <!-- Formulário de Avaliação Expansível -->
    <ProductReviewForm
      v-if="isWritingReview"
      :product-id="productId"
      @submit-review="handleNewReview"
      @cancel="isWritingReview = false"
    />

    <!-- Filtros por Estrelas em Pílulas -->
    <div class="flex items-center gap-2 flex-wrap pt-4 border-t border-[#F0EDE4]">
      <span class="text-xs font-bold text-[#0A2B42] flex items-center gap-1 mr-2">
        <Filter :size="14" />
        <span>Filtrar por:</span>
      </span>

      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
          selectedStarFilter === null
            ? 'bg-[#0B3C5D] text-white shadow-sm'
            : 'bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE] border border-[#E6E1D6]'
        ]"
        @click="toggleStarFilter(null)"
      >
        Todas ({{ stats.totalReviews }})
      </button>

      <button
        v-for="star in [5, 4, 3, 2, 1]"
        :key="star"
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all',
          selectedStarFilter === star
            ? 'bg-[#0B3C5D] text-white shadow-sm'
            : 'bg-[#F7F4EE] text-[#5A738E] hover:bg-[#EBE7DE] border border-[#E6E1D6]'
        ]"
        @click="toggleStarFilter(star)"
      >
        <span>{{ star }}</span>
        <Star :size="12" class="fill-current text-[#F59E0B]" />
      </button>
    </div>

    <!-- Lista de Comentários e Depoimentos -->
    <div class="space-y-4 pt-2">
      <div v-if="filteredReviews.length === 0" class="py-8 text-center text-xs text-[#5A738E]">
        Nenhuma avaliação encontrada com esta pontuação.
      </div>

      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="p-5 bg-[#F7F4EE] rounded-2xl border border-[#E6E1D6] space-y-3"
      >
        <!-- Topo da Avaliação -->
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs sm:text-sm text-[#0A2B42]">{{ review.author }}</span>
              <span v-if="review.isVerifiedPurchase" class="inline-flex items-center gap-1 text-[10px] text-[#0B3C5D] bg-white px-2 py-0.5 rounded-full border border-[#D6CFC0]">
                <CheckCircle :size="10" />
                <span>Colecionador Verificado</span>
              </span>
            </div>
            <span class="text-[11px] text-[#5A738E] block mt-0.5">{{ review.city }}, {{ review.uf }}</span>
          </div>

          <div class="text-right">
            <div class="flex items-center gap-0.5 text-[#F59E0B]">
              <Star v-for="i in review.rating" :key="i" :size="13" class="fill-[#F59E0B]" />
            </div>
            <span class="text-[10px] text-[#5A738E] block mt-0.5">{{ review.createdAt }}</span>
          </div>
        </div>

        <!-- Título e Texto do Depoimento -->
        <div>
          <h4 v-if="review.title" class="font-serif-editorial text-sm font-bold text-[#0A2B42] mb-1">
            {{ review.title }}
          </h4>
          <p class="text-xs sm:text-sm text-[#5A738E] leading-relaxed italic">
            “{{ review.comment }}”
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
