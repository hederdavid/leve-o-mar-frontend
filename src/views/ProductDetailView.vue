<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/productService'
import { reviewService } from '@/services/reviewService'
import type { Product } from '@/types/product'
import type { Review, ReviewStats, NewReviewPayload } from '@/types/review'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductSummary from '@/components/product/ProductSummary.vue'
import ProductTabs from '@/components/product/ProductTabs.vue'
import ProductReviews from '@/components/product/ProductReviews.vue'
import BottleVisual from '@/components/common/BottleVisual.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isSearchOpen = ref(false)
const isLoading = ref(true)
const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const reviews = ref<Review[]>([])
const reviewStats = ref<ReviewStats>({
  averageRating: 5.0,
  totalReviews: 0,
  ratingDistribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
})

async function loadProductData(slug: string) {
  isLoading.value = true
  try {
    const data = await productService.getBySlug(slug)
    product.value = data

    // Buscar avaliações e garrafas relacionadas
    const [revs, stats, related] = await Promise.all([
      reviewService.getByProductId(data.id),
      reviewService.getStatsByProductId(data.id),
      productService.getRelated(data.id, 4)
    ])
    reviews.value = revs
    reviewStats.value = stats
    relatedProducts.value = related
  } catch (err) {
    console.error('Produto não encontrado:', err)
  } finally {
    isLoading.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function handleAddReview(payload: NewReviewPayload) {
  if (!product.value) return
  await reviewService.addReview(payload)
  // Atualizar lista e estatísticas
  reviews.value = await reviewService.getByProductId(product.value.id)
  reviewStats.value = await reviewService.getStatsByProductId(product.value.id)
}

function scrollToReviews() {
  const el = document.getElementById('avaliacoes')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  const slug = (route.params.slug as string) || 'fernando-de-noronha-pe'
  loadProductData(slug)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      loadProductData(newSlug as string)
    }
  }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      <!-- Estado de Carregamento -->
      <div v-if="isLoading" class="py-24 text-center space-y-4">
        <div class="w-12 h-12 border-4 border-[#0B3C5D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-sm font-semibold text-[#5A738E]">Carregando os detalhes da praia...</p>
      </div>

      <!-- Detalhes do Produto -->
      <div v-else-if="product" class="space-y-8 animate-fade-in">
        
        <!-- Breadcrumbs de Navegação -->
        <nav class="flex items-center gap-2 text-xs font-semibold text-[#5A738E]">
          <router-link to="/" class="hover:text-[#0A2B42] flex items-center gap-1">
            <ArrowLeft :size="14" />
            <span>Início</span>
          </router-link>
          <ChevronRight :size="12" />
          <router-link to="/#colecao" class="hover:text-[#0A2B42]">
            Coleção da Temporada
          </router-link>
          <ChevronRight :size="12" />
          <span class="text-[#0A2B42] font-bold">{{ product.beachName }}</span>
        </nav>

        <!-- Grid Principal: Galeria + Resumo de Compra -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- Coluna Esquerda: Galeria com Miniaturas Laterais -->
          <div class="lg:col-span-6">
            <ProductGallery
              :main-image="product.bottleImage"
              :beach-name="product.beachName"
              :is-limited-edition="product.isLimitedEdition"
              :gallery-images="[
                product.images.primary,
                product.images.secondary,
                product.images.sensory,
                product.images.labelCloseup
              ]"
            />
          </div>

          <!-- Coluna Direita: Informações & Compra -->
          <div class="lg:col-span-6">
            <ProductSummary
              :product="product"
              :reviews-count="reviewStats.totalReviews"
              :average-rating="reviewStats.averageRating"
              @scroll-to-reviews="scrollToReviews"
            />
          </div>

        </div>

        <!-- Abas Explicativas (A Água, História, Garrafa e Envio) -->
        <ProductTabs :product="product" />

        <!-- Seção de Avaliações com Filtro por Estrelas e Formulário -->
        <ProductReviews
          :product-id="product.id"
          :reviews="reviews"
          :stats="reviewStats"
          @add-review="handleAddReview"
        />

        <!-- Seção "Outros Destinos da Coleção" -->
        <div class="pt-16 border-t border-[#E6E1D6]">
          <div class="flex items-center justify-between mb-8">
            <div>
              <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block">Explore Mais</span>
              <h3 class="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#0A2B42]">
                Outras Garrafas da Coleção
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <router-link
              v-for="item in relatedProducts"
              :key="item.id"
              :to="`/produto/${item.slug}`"
              class="card-maritimo p-5 flex flex-col justify-between group"
            >
              <div class="py-4 flex justify-center">
                <BottleVisual
                  :image-url="item.bottleImage"
                  :beach-name="item.beachName"
                  :tag="item.highlightTag"
                  height-class="h-48"
                />
              </div>

              <div class="pt-3 border-t border-[#F0EDE4]">
                <span class="text-[9px] font-bold text-[#D97706] uppercase block">{{ item.categoryTag }}</span>
                <h4 class="font-serif-editorial text-base font-bold text-[#0A2B42] group-hover:text-[#0B3C5D] transition-colors">
                  {{ item.beachName }}
                </h4>
                <span class="text-xs font-bold text-[#0A2B42] block mt-1">
                  R$ {{ item.price.toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </router-link>
          </div>
        </div>

      </div>
    </main>

    <FooterNavigation />
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
