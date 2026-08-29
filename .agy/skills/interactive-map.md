# Skill: Mapa Interativo com Leaflet (`interactive-map.md`)

Esta skill orienta a implementação e customização do mapa interativo de destinos praianos utilizando **Leaflet** no Vue 3 com TypeScript.

---

## 🗺️ Objetivos do Mapa de Destinos

1. Exibir o litoral brasileiro com marcadores customizados estilizados (estilo bússola / concha marinha / garrafa).
2. Permitir zoom suave e centralização dinâmica ao selecionar uma praia ou região.
3. Exibir popups imersivos com foto, nome do destino, estado, tag sensorial e botão "Ver Garrafa da Coleção".
4. Reatividade bidirecional: clicar num card de praia destaca o pino no mapa e vice-versa.

---

## 🛠️ Boas Práticas e Cuidados com Leaflet no Vue 3

1. **Importação do CSS do Leaflet**:
   - Sempre certifique-se de que o CSS do Leaflet está importado (`import 'leaflet/dist/leaflet.css'`).
2. **Ciclo de Vida e Limpeza de Memória**:
   - Instancie o mapa no `onMounted` garantindo que o elemento DOM já existe.
   - Destrua o mapa no `onUnmounted` com `map.remove()` para evitar vazamento de memória e conflitos no HMR do Vite.
3. **Tratamento de Ícones Padrão do Leaflet**:
   - O bundler do Vite pode quebrar os caminhos relativos dos ícones padrão PNG do Leaflet. Use `L.divIcon` com HTML/SVG customizado ou resolva os assets via import.

---

## 🧩 Exemplo de Componente de Mapa (`src/components/map/BeachMapLeaflet.vue`)

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Beach } from '@/types/beach'

interface Props {
  beaches: Beach[]
  selectedBeachId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedBeachId: null
})

const emit = defineEmits<{
  (e: 'selectBeach', beach: Beach): void
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let mapInstance: L.Map | null = null
const markersMap = new Map<string, L.Marker>()

function createCustomPin(beach: Beach, isSelected: boolean): L.DivIcon {
  return L.divIcon({
    className: 'custom-beach-pin',
    html: `
      <div class="pin-wrapper ${isSelected ? 'pin-wrapper--active' : ''}">
        <span class="pin-dot"></span>
        <span class="pin-label">${beach.name}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  })
}

function initMap() {
  if (!mapContainer.value) return

  // Centro do litoral do Brasil (aproximadamente Bahia/Sergipe)
  mapInstance = L.map(mapContainer.value, {
    center: [-14.235, -39.0],
    zoom: 5,
    zoomControl: false
  })

  // Camada de mapa limpa (CartoDB Positron / OpenStreetMap)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 18
  }).addTo(mapInstance)

  // Zoom no canto inferior direito
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

  renderMarkers()
}

function renderMarkers() {
  if (!mapInstance) return

  // Limpar marcadores anteriores
  markersMap.forEach((marker) => marker.remove())
  markersMap.clear()

  props.beaches.forEach((beach) => {
    const isSelected = beach.id === props.selectedBeachId
    const marker = L.marker([beach.coordinates.lat, beach.coordinates.lng], {
      icon: createCustomPin(beach, isSelected)
    })

    marker.on('click', () => {
      emit('selectBeach', beach)
      if (mapInstance) {
        mapInstance.flyTo([beach.coordinates.lat, beach.coordinates.lng], 9, { duration: 1.2 })
      }
    })

    marker.addTo(mapInstance!)
    markersMap.set(beach.id, marker)
  })
}

watch(
  () => props.selectedBeachId,
  (newId) => {
    if (!newId || !mapInstance) return
    const selected = props.beaches.find((b) => b.id === newId)
    if (selected) {
      mapInstance.flyTo([selected.coordinates.lat, selected.coordinates.lng], 9, { duration: 1.2 })
    }
  }
)

watch(() => props.beaches, renderMarkers, { deep: true })

onMounted(initMap)

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div class="beach-map-wrapper">
    <div ref="mapContainer" class="beach-map-container" />
  </div>
</template>

<style scoped>
.beach-map-wrapper {
  position: relative;
  width: 100%;
  height: 520px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 36px -10px rgba(10, 38, 71, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.beach-map-container {
  width: 100%;
  height: 100%;
}
</style>
```
