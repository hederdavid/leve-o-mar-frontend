<script setup lang="ts">
import { ref } from 'vue'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import EcommerceHeroSlider from '@/components/home/EcommerceHeroSlider.vue'
import TrustBar from '@/components/home/TrustBar.vue'
import SeasonCollection from '@/components/home/SeasonCollection.vue'
import BundleBuilderSection from '@/components/home/BundleBuilderSection.vue'
import DestinationsMapSection from '@/components/home/DestinationsMapSection.vue'
import SensoryUnboxingSection from '@/components/home/SensoryUnboxingSection.vue'
import SocialGallerySection from '@/components/home/SocialGallerySection.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'

const isSearchOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main class="flex-grow">
      <!-- Carrossel Promocional de Alto Impacto -->
      <EcommerceHeroSlider />
      
      <!-- Barra de Benefícios & Confiança do E-commerce -->
      <TrustBar />

      <!-- Vitrine de Produtos da Temporada -->
      <SeasonCollection />

      <!-- Construtor Interativo do Trio do Litoral (15% OFF) -->
      <BundleBuilderSection />

      <!-- Mapa Interativo do Litoral -->
      <DestinationsMapSection />

      <!-- Unboxing Sensorial & Envio Seguro -->
      <SensoryUnboxingSection />

      <!-- Galeria Social & Depoimentos -->
      <SocialGallerySection />
      <TestimonialsSection />
    </main>

    <FooterNavigation />

    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
