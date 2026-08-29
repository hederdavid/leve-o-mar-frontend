<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { Droplet, BookOpen, Sparkles, ShieldCheck } from 'lucide-vue-next'

interface Props {
  product: Product
}

defineProps<Props>()

const activeTab = ref<'water' | 'history' | 'bottle' | 'shipping'>('water')

const tabs = [
  { id: 'water', label: 'A Água & o Mar', icon: Droplet },
  { id: 'history', label: 'História do Destino', icon: BookOpen },
  { id: 'bottle', label: 'A Garrafa & Artesanato', icon: Sparkles },
  { id: 'shipping', label: 'Envio Protegido', icon: ShieldCheck }
]
</script>

<template>
  <div class="card-maritimo p-6 sm:p-8 bg-white mt-12">
    
    <!-- Navegação em Abas -->
    <div class="flex items-center gap-2 sm:gap-4 border-b border-[#E6E1D6] pb-4 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all',
          activeTab === tab.id
            ? 'bg-[#0B3C5D] text-white shadow-md'
            : 'text-[#5A738E] hover:text-[#0A2B42] hover:bg-[#F0EDE4]'
        ]"
        @click="activeTab = tab.id as any"
      >
        <component :is="tab.icon" :size="15" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Conteúdo das Abas -->
    <div class="pt-6">
      
      <!-- Aba 1: A Água & o Mar -->
      <div v-if="activeTab === 'water'" class="space-y-4 animate-fade-in">
        <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">
          A Essência da Água de {{ product.beachName }}
        </h3>
        <p class="text-sm text-[#5A738E] leading-relaxed">
          Cada garrafa captura a transparência, a salinidade e a luminosidade única desta praia. O tom oceânico é preservado com técnicas de vedação que impedem a evaporação e mantêm a vitalidade da água.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE]">
            <div class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase">Tipo de Mar</div>
            <div class="font-serif-editorial text-base font-bold text-[#0A2B42] mt-1">{{ product.waterType }}</div>
          </div>
          <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE]">
            <div class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase">Tonalidade das Águas</div>
            <div class="font-serif-editorial text-base font-bold text-[#0A2B42] mt-1">{{ product.tagline }}</div>
          </div>
          <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE]">
            <div class="text-[10px] font-bold tracking-widest text-[#D97706] uppercase">Volumetria</div>
            <div class="font-serif-editorial text-base font-bold text-[#0A2B42] mt-1">{{ product.volume }}</div>
          </div>
        </div>
      </div>

      <!-- Aba 2: História do Destino -->
      <div v-if="activeTab === 'history'" class="space-y-4 animate-fade-in">
        <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">
          Memórias e Lendas de {{ product.beachName }}
        </h3>
        <p class="text-sm text-[#5A738E] leading-relaxed">
          {{ product.story }}
        </p>
        <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE] text-xs text-[#5A738E] space-y-1">
          <span class="font-bold text-[#0A2B42] block">Coordenadas Geográficas Oficiais:</span>
          <span>Latitude: {{ product.coordinates.lat }} | Longitude: {{ product.coordinates.lng }} (Gravadas no rótulo de algodão)</span>
        </div>
      </div>

      <!-- Aba 3: A Garrafa & Artesanato -->
      <div v-if="activeTab === 'bottle'" class="space-y-4 animate-fade-in">
        <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">
          Produção Artesanal e Vidro Lapidado
        </h3>
        <p class="text-sm text-[#5A738E] leading-relaxed">
          Nossas garrafas são moldadas com {{ product.glassFinish }}, criando prismas que dispersam a luz ambiente e realçam o azul da água do mar. A vedação é feita com rolha de cortiça 100% natural impermeabilizada com resina de cera vegetal.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE] text-xs">
            <span class="font-bold text-[#0A2B42] block mb-1">Dimensões & Peso</span>
            <span class="text-[#5A738E]">Altura: {{ product.dimensions.heightCm }}cm · Diâmetro: {{ product.dimensions.diameterCm }}cm · Peso: {{ product.dimensions.weightGrams }}g</span>
          </div>
          <div class="p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE] text-xs">
            <span class="font-bold text-[#0A2B42] block mb-1">Lote & Certificado</span>
            <span class="text-[#5A738E]">Edição nº {{ product.editionNumber }} · {{ product.totalBatchQuantity }} unidades produzidas</span>
          </div>
        </div>
      </div>

      <!-- Aba 4: Envio Protegido -->
      <div v-if="activeTab === 'shipping'" class="space-y-4 animate-fade-in">
        <h3 class="font-serif-editorial text-2xl font-bold text-[#0A2B42]">
          Garantia de Chegada Segura do Vidro
        </h3>
        <p class="text-sm text-[#5A738E] leading-relaxed">
          Sabemos o valor afetivo de cada garrafa. Por isso, desenvolvemos uma embalagem com casulo moldado em espuma reciclável de alta densidade que absorve impactos severos durante o transporte. Caso ocorra qualquer avaria, enviamos uma nova garrafa imediatamente sem custos.
        </p>
      </div>

    </div>
  </div>
</template>
