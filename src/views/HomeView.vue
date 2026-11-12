<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const isSearchOpen = ref(false)
const searchInitialQuery = ref('')

watch(
  () => route.query.busca,
  (busca) => {
    if (typeof busca === 'string' && busca.trim()) {
      searchInitialQuery.value = busca.trim()
      isSearchOpen.value = true
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="searchInitialQuery = ''; isSearchOpen = true" />

    <main id="main-content" class="flex-grow">
      <EcommerceHeroSlider />
      <TrustBar />
      <SeasonCollection />
      <BundleBuilderSection />
      <DestinationsMapSection />
      <SensoryUnboxingSection />
      <SocialGallerySection />
      <TestimonialsSection />
    </main>

    <FooterNavigation />

    <SearchModal
      :is-open="isSearchOpen"
      :initial-query="searchInitialQuery"
      @close="isSearchOpen = false"
    />
    <CartDrawer />
  </div>
</template>
