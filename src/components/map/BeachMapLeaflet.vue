<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Beach } from '@/types/beach'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { Volume2, VolumeX, Compass, Sparkles } from 'lucide-vue-next'

interface Props {
  beaches: Beach[]
  products: Product[]
  selectedBeachId?: string | null
  heightClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedBeachId: null,
  heightClass: 'h-[540px]'
})

const emit = defineEmits<{
  (e: 'selectBeach', beach: Beach): void
}>()

const router = useRouter()
const cartStore = useCartStore()

const mapContainer = ref<HTMLDivElement | null>(null)
let mapInstance: L.Map | null = null
const markersMap = new Map<string, L.Marker>()

// Áudio Sensorial do Mar com Web Audio API
const isAudioPlaying = ref(false)
let audioCtx: AudioContext | null = null
let noiseNode: AudioNode | null = null

function toggleOceanAudio() {
  if (isAudioPlaying.value) {
    if (audioCtx) {
      audioCtx.close()
      audioCtx = null
    }
    isAudioPlaying.value = false
  } else {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const bufferSize = audioCtx.sampleRate * 2
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const whiteNoise = audioCtx.createBufferSource()
      whiteNoise.buffer = buffer
      whiteNoise.loop = true

      // Filtro para simular ondas do mar
      const filter = audioCtx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(400, audioCtx.currentTime)

      // Modulador de volume das ondas
      const gainNode = audioCtx.createGain()
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      whiteNoise.start()

      noiseNode = whiteNoise
      isAudioPlaying.value = true
    } catch (e) {
      console.warn('Áudio não suportado no navegador:', e)
    }
  }
}

// Cores temáticas por tipo de água
function getWaterPinColor(waterType: string): string {
  if (waterType.includes('Piscinas')) return '#05BFDB'
  if (waterType.includes('Calmo')) return '#009688'
  if (waterType.includes('Ondas')) return '#0B3C5D'
  if (waterType.includes('Doce')) return '#10B981'
  return '#E86A58'
}

function createCustomPin(beach: Beach, isSelected: boolean): L.DivIcon {
  const pinColor = getWaterPinColor(beach.waterType)
  
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group ${isSelected ? 'z-50' : 'z-10'}">
        <!-- Anel Pulsante da Cor da Água -->
        <div class="absolute -inset-3 rounded-full ${isSelected ? 'animate-ping opacity-90' : 'opacity-30'} transition-all pointer-events-none" style="background-color: ${pinColor}"></div>
        
        <!-- Marcador Central Náutico -->
        <div class="relative w-8 h-8 rounded-full border-2 ${isSelected ? 'border-[#F59E0B] ring-4 ring-[#F59E0B]/50 scale-125' : 'border-white'} shadow-2xl flex items-center justify-center transition-all group-hover:scale-125" style="background-color: ${pinColor}">
          <svg class="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>

        <!-- Rótulo Flutuante -->
        <div class="absolute -bottom-6 ${isSelected ? 'bg-[#0B3C5D] text-[#F59E0B] scale-110 font-black' : 'bg-[#0A2B42]/90 text-white font-bold'} text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none transition-all">
          ${beach.name}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })
}

function createPopupContent(beach: Beach, product?: Product): string {
  const price = product ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'R$ 149,00'
  const productSlug = product?.slug || beach.slug

  return `
    <div class="p-1 max-w-[240px] text-[#0A2B42] font-sans">
      <div class="relative h-28 rounded-xl overflow-hidden mb-2">
        <img src="${beach.coverImage}" alt="${beach.name}" class="w-full h-full object-cover"/>
        <div class="absolute top-2 left-2 bg-[#0B3C5D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
          ${beach.waterType}
        </div>
      </div>
      
      <div class="space-y-1">
        <div class="font-serif font-bold text-sm text-[#0A2B42] leading-tight">${beach.name}</div>
        <div class="text-[10px] text-[#5A738E] font-medium">${beach.city}, ${beach.uf} · Brasil</div>
        <div class="text-[10px] text-[#5A738E] line-clamp-2">${beach.description}</div>
      </div>

      <div class="flex items-center justify-between mt-3 pt-2 border-t border-[#E6E1D6]">
        <div>
          <div class="text-[8px] text-[#5A738E] uppercase">Garrafa Artesanal</div>
          <div class="font-serif font-bold text-xs text-[#0B3C5D]">${price}</div>
        </div>
        
        <a href="/produto/${productSlug}" class="px-3 py-1 bg-[#0B3C5D] text-white text-[10px] font-bold rounded-full hover:bg-[#0A2B42] transition-colors">
          Ver Garrafa
        </a>
      </div>
    </div>
  `
}

function initMap() {
  if (!mapContainer.value) return

  // Centro inicial no litoral do Nordeste / Bahia
  mapInstance = L.map(mapContainer.value, {
    center: [-13.5, -39.0],
    zoom: 5,
    zoomControl: false
  })

  // Camada náutica CartoDB Voyager
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18
  }).addTo(mapInstance)

  // Zoom no canto inferior direito
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

  renderMarkers()

  setTimeout(() => {
    mapInstance?.invalidateSize()
  }, 250)
}

function renderMarkers() {
  if (!mapInstance) return

  markersMap.forEach((m) => m.remove())
  markersMap.clear()

  props.beaches.forEach((beach) => {
    const isSelected = beach.id === props.selectedBeachId
    const product = props.products.find((p) => p.beachId === beach.id)

    const marker = L.marker([beach.coordinates.lat, beach.coordinates.lng], {
      icon: createCustomPin(beach, isSelected),
      zIndexOffset: isSelected ? 1000 : 0
    })

    const popup = L.popup({
      closeButton: true,
      className: 'custom-beach-popup',
      offset: [0, -10]
    }).setContent(createPopupContent(beach, product))

    marker.bindPopup(popup)

    marker.on('click', () => {
      emit('selectBeach', beach)
      if (mapInstance) {
        mapInstance.flyTo([beach.coordinates.lat, beach.coordinates.lng], 8, { duration: 1.2 })
      }
    })

    marker.addTo(mapInstance!)
    markersMap.set(beach.id, marker)
  })
}

// Expedição de sobrevoo por região
function flyToRegion(region: 'nordeste' | 'sudeste' | 'sul' | 'norte' | 'brasil') {
  if (!mapInstance) return

  if (region === 'nordeste') {
    mapInstance.flyTo([-8.0, -35.5], 6, { duration: 1.5 })
  } else if (region === 'sudeste') {
    mapInstance.flyTo([-21.5, -41.5], 7, { duration: 1.5 })
  } else if (region === 'sul') {
    mapInstance.flyTo([-28.0, -48.6], 7, { duration: 1.5 })
  } else if (region === 'norte') {
    mapInstance.flyTo([-2.44, -54.9], 7, { duration: 1.5 })
  } else {
    mapInstance.flyTo([-14.23, -48.0], 4, { duration: 1.5 })
  }
}

watch(
  () => props.selectedBeachId,
  (newId) => {
    renderMarkers()
    if (!newId || !mapInstance) return
    const selected = props.beaches.find((b) => b.id === newId)
    if (selected) {
      mapInstance.flyTo([selected.coordinates.lat, selected.coordinates.lng], 8, { duration: 1.2 })
      setTimeout(() => {
        const marker = markersMap.get(newId)
        if (marker) {
          marker.openPopup()
        }
      }, 500)
    }
  }
)

watch(
  () => props.beaches,
  () => {
    renderMarkers()
    setTimeout(() => {
      mapInstance?.invalidateSize()
    }, 150)
  },
  { deep: true }
)

onMounted(initMap)

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
})

defineExpose({
  flyToRegion
})
</script>

<template>
  <div class="relative w-full rounded-3xl overflow-hidden border border-[#E6E1D6] shadow-xl bg-[#EBE7DE]">
    
    <!-- Barra Superior de Expedição por Região -->
    <div class="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      
      <!-- Pílulas de Viagem Rápida -->
      <div class="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#E6E1D6] shadow-md pointer-events-auto overflow-x-auto">
        <span class="text-[10px] font-bold text-[#0A2B42] uppercase px-2 hidden sm:inline">Expedição:</span>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-semibold text-[#0A2B42] hover:bg-[#F0EDE4] transition-colors"
          @click="flyToRegion('brasil')"
        >
          Brasil Todo
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-semibold text-[#0B3C5D] hover:bg-[#F0EDE4] transition-colors"
          @click="flyToRegion('nordeste')"
        >
          🌴 Nordeste
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-semibold text-[#0B3C5D] hover:bg-[#F0EDE4] transition-colors"
          @click="flyToRegion('sudeste')"
        >
          🏖️ Sudeste
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-semibold text-[#0B3C5D] hover:bg-[#F0EDE4] transition-colors"
          @click="flyToRegion('sul')"
        >
          🐋 Sul
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-semibold text-[#0B3C5D] hover:bg-[#F0EDE4] transition-colors"
          @click="flyToRegion('norte')"
        >
          💧 Norte
        </button>
      </div>

      <!-- Botão de Som Sensorial das Ondas -->
      <button
        type="button"
        :class="[
          'p-2.5 rounded-full backdrop-blur-md border shadow-md transition-all pointer-events-auto flex items-center gap-1.5 text-xs font-bold',
          isAudioPlaying
            ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] animate-pulse'
            : 'bg-white/90 text-[#0A2B42] border-[#E6E1D6] hover:bg-[#FAF8F5]'
        ]"
        @click="toggleOceanAudio"
      >
        <component :is="isAudioPlaying ? Volume2 : VolumeX" :size="15" />
        <span class="hidden md:inline">{{ isAudioPlaying ? 'Som do Mar Ativo' : 'Ligar Som do Mar' }}</span>
      </button>

    </div>

    <!-- Container do Leaflet -->
    <div ref="mapContainer" :class="['w-full', heightClass]" />

  </div>
</template>

<style>
/* Estilos Customizados do Leaflet */
.custom-leaflet-pin {
  background: transparent;
  border: none;
}

.leaflet-popup-content-wrapper {
  border-radius: 20px !important;
  box-shadow: 0 15px 35px -5px rgba(10, 43, 66, 0.25) !important;
  padding: 6px !important;
  background: #ffffff !important;
  border: 1px solid #E6E1D6 !important;
}

.leaflet-popup-tip {
  background: #ffffff !important;
}
</style>
