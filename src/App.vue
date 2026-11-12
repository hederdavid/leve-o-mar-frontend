<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import CookieConsentBanner from '@/components/common/CookieConsentBanner.vue'
import SocialProofToast from '@/components/common/SocialProofToast.vue'
import SkipToContent from '@/components/common/SkipToContent.vue'
import VLibrasWidget from '@/components/common/VLibrasWidget.vue'
</script>

<template>
  <SkipToContent />
  <Toaster
    position="top-right"
    :toast-options="{
      style: {
        background: '#F7F4EE',
        color: '#0A2B42',
        border: '1px solid #E6E1D6',
        borderRadius: '16px'
      }
    }"
  />
  <RouterView />
  <CookieConsentBanner />
  <SocialProofToast />
  <VLibrasWidget />
</template>
