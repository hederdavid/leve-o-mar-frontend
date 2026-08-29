<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import LiveBottlePreview from '@/components/customizer/LiveBottlePreview.vue'
import CustomizerSidebar from '@/components/customizer/CustomizerSidebar.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'

const isSearchOpen = ref(false)
const isLoading = ref(true)
const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)

// Estados de Customização Reativa
const recipientName = ref('')
const customMessage = ref('')
const fontStyle = ref<'serif' | 'cursive' | 'sans'>('cursive')
const glassType = ref<'lapidado' | 'fosco' | 'ambar'>('lapidado')

async function loadProducts() {
  isLoading.value = true
  try {
    const res = await productService.getAll()
    products.value = res.products
    selectedProduct.value = res.products[0] || null
  } catch (err) {
    console.error('Erro ao carregar produtos para personalização:', err)
  } finally {
    isLoading.value = false
  }
}

function handleSelectProduct(product: Product) {
  selectedProduct.value = product
}

function handleUpdateCustomization(data: {
  recipientName: string
  customMessage: string
  fontStyle: 'serif' | 'cursive' | 'sans'
  glassType: 'lapidado' | 'fosco' | 'ambar'
}) {
  recipientName.value = data.recipientName
  customMessage.value = data.customMessage
  fontStyle.value = data.fontStyle
  glassType.value = data.glassType
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      
      <!-- Cabeçalho -->
      <div class="mb-8 text-center max-w-2xl mx-auto">
        <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
          Estúdio de Personalização
        </span>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#0A2B42]">
          Crie sua Garrafa Sob Medida
        </h1>
        <p class="text-xs sm:text-sm text-[#5A738E] mt-1.5">
          Veja a caligrafia e as coordenadas do destino sendo gravadas no rótulo de algodão em tempo real.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 text-center space-y-3">
        <div class="w-10 h-10 border-3 border-[#0B3C5D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-xs text-[#5A738E]">Preparando o ateliê das águas...</p>
      </div>

      <!-- Split View: Preview da Garrafa + Painel de Customização -->
      <div v-else-if="selectedProduct" class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Coluna Esquerda: Preview da Garrafa com Rótulo ao Vivo -->
        <div class="lg:col-span-6 lg:sticky lg:top-24">
          <LiveBottlePreview
            :product="selectedProduct"
            :recipient-name="recipientName"
            :custom-message="customMessage"
            :font-style="fontStyle"
            :glass-type="glassType"
          />
        </div>

        <!-- Coluna Direita: Controles de Customização -->
        <div class="lg:col-span-6">
          <CustomizerSidebar
            :products="products"
            :selected-product="selectedProduct"
            @select-product="handleSelectProduct"
            @update-customization="handleUpdateCustomization"
          />
        </div>

      </div>

    </main>

    <FooterNavigation />
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
