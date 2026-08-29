# Skill: Visualizador 3D e Interativo de Garrafas (`3d-bottle-viewer.md`)

Esta skill define as diretrizes para implementar a experiência de visualização 3D e rotação interativa 360° das garrafas de praia do **Leve o Mar**.

---

## 🍾 Objetivos do Visualizador 3D

1. **Exibição do Frasco em Detalhes**:
   - Rotação 360° suave acionada por arraste do mouse ou touch.
   - Zoom nos detalhes do rótulo afetivo (história, coordenadas, caligrafia).
   - Renderização realista de reflexo de vidro (*sea glass*) e rolha de cortiça natural.
2. **Duplo Modo de Renderização**:
   - **Modo GLTF/GLB com `<model-viewer>`**: Para modelos tridimensionais completos quando o arquivo `.glb` estiver disponível.
   - **Modo Interativo CSS 3D Parallax / Turntable**: Fallback hiper-realista com camadas de iluminação, profundidade e rotação interativa.

---

## 🛠️ Exemplo de Implementação com `<model-viewer>` (`src/components/product/BottleViewer3D.vue`)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '@google/model-viewer'
import { RotateCw, ZoomIn, Sparkles } from 'lucide-vue-next'

interface Props {
  modelSrc?: string
  posterImage: string
  beachName: string
  editionNumber: string
}

const props = withDefaults(defineProps<Props>(), {
  modelSrc: ''
})

const isInteracting = ref(false)
const isLoaded = ref(false)

function onModelLoaded() {
  isLoaded.value = true
}
</script>

<template>
  <div class="bottle-viewer-card">
    <div class="bottle-viewer-badge">
      <Sparkles class="icon-sparkle" :size="14" />
      <span>Visualizador Imersivo • Lote {{ editionNumber }}</span>
    </div>

    <!-- Modelo 3D ou Turntable Realista -->
    <div class="viewer-container">
      <model-viewer
        v-if="modelSrc"
        :src="modelSrc"
        :poster="posterImage"
        :alt="`Visualização 3D da Garrafa ${beachName}`"
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        shadow-intensity="1.2"
        exposure="1.0"
        loading="lazy"
        class="model-viewer-element"
        @load="onModelLoaded"
      />

      <!-- Fallback Interativo de Alta Resolução -->
      <div v-else class="interactive-bottle-preview">
        <img :src="posterImage" :alt="beachName" class="bottle-poster-img" />
        <div class="glass-reflection-overlay" />
      </div>
    </div>

    <div class="viewer-hint">
      <RotateCw :size="16" />
      <span>Arraste para girar a garrafa em 360°</span>
    </div>
  </div>
</template>

<style scoped>
.bottle-viewer-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #ffffff 0%, #F5EBE0 100%);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px -15px rgba(10, 38, 71, 0.1);
  overflow: hidden;
}

.bottle-viewer-badge {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  background: rgba(10, 38, 71, 0.06);
  color: #0A2647;
  font-size: 0.75rem;
  font-weight: 600;
}

.viewer-container {
  width: 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-viewer-element {
  width: 100%;
  height: 100%;
}

.interactive-bottle-preview {
  position: relative;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottle-poster-img {
  max-height: 380px;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(10, 38, 71, 0.2));
  transition: transform 0.4s ease;
}

.bottle-poster-img:hover {
  transform: scale(1.03) rotate(-2deg);
}

.viewer-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #144272;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
}
</style>
```
