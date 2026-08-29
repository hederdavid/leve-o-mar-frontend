<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, ZoomIn } from 'lucide-vue-next'

interface Props {
  mainImage: string
  beachName: string
  isLimitedEdition?: boolean
  galleryImages: string[]
}

const props = withDefaults(defineProps<Props>(), {
  isLimitedEdition: false,
  galleryImages: () => []
})

// Lista combinada de fotos para exibição
const allPhotos = ref<string[]>([props.mainImage, ...props.galleryImages])
const activeIndex = ref(0)
const isZoomed = ref(false)

function selectImage(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="flex flex-col-reverse lg:flex-row gap-4 items-center lg:items-start">
    
    <!-- Miniaturas Laterais Verticais -->
    <div class="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 w-full lg:w-24 flex-shrink-0">
      <button
        v-for="(img, idx) in allPhotos"
        :key="idx"
        type="button"
        :class="[
          'relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white flex-shrink-0 cursor-pointer shadow-sm',
          activeIndex === idx
            ? 'border-[#0B3C5D] ring-2 ring-[#0B3C5D]/20 scale-105'
            : 'border-[#E6E1D6] hover:border-[#5A738E] opacity-75 hover:opacity-100'
        ]"
        @click="selectImage(idx)"
      >
        <img
          :src="img"
          :alt="`${beachName} foto ${idx + 1}`"
          class="w-full h-full object-cover rounded-xl"
        />
      </button>
    </div>

    <!-- Foto Principal em Destaque -->
    <div class="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#E6E1D6] shadow-xl group">
      
      <!-- Badge de Edição Limitada -->
      <div
        v-if="isLimitedEdition"
        class="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-[#E86A58] text-white text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5"
      >
        <Sparkles :size="13" />
        <span>Edição Limitada</span>
      </div>

      <!-- Imagem em Destaque com Zoom Suave -->
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b from-white via-[#F7F4EE]/50 to-[#EDE7DA]/60">
        <img
          :src="allPhotos[activeIndex] || mainImage"
          :alt="beachName"
          class="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
        />

        <!-- Reflexo de Vidro Artístico -->
        <div class="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none" />
      </div>

      <!-- Indicador de Foto -->
      <div class="absolute bottom-4 right-4 bg-[#0A2B42]/70 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
        {{ activeIndex + 1 }} / {{ allPhotos.length }}
      </div>
    </div>

  </div>
</template>
