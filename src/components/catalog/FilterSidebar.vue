<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BrazilianRegion, WaterType } from '@/types/beach'
import type { ProductFilterParams } from '@/types/product'
import { Filter, RotateCcw } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'filterChange', params: ProductFilterParams): void
}>()

const selectedRegion = ref<BrazilianRegion | ''>('')
const selectedWaterType = ref<WaterType | ''>('')
const onlyLimited = ref<boolean>(false)
const maxPrice = ref<number>(250)

const regions: BrazilianRegion[] = ['Nordeste', 'Sudeste', 'Sul', 'Norte']
const waterTypes: WaterType[] = [
  'Piscinas Naturais',
  'Mar Calmo & Cristalino',
  'Ondas Selvagens',
  'Águas Doces de Rio'
]

function emitFilter() {
  emit('filterChange', {
    region: selectedRegion.value || undefined,
    waterType: selectedWaterType.value || undefined,
    isLimitedEdition: onlyLimited.value ? true : undefined,
    maxPrice: maxPrice.value
  })
}

function resetFilters() {
  selectedRegion.value = ''
  selectedWaterType.value = ''
  onlyLimited.value = false
  maxPrice.value = 250
  emitFilter()
}

watch([selectedRegion, selectedWaterType, onlyLimited, maxPrice], emitFilter)
</script>

<template>
  <aside class="w-full lg:w-72 bg-white rounded-3xl p-6 border border-[#E6E1D6] shadow-sm space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-[#E6E1D6]">
      <div class="flex items-center gap-2">
        <Filter :size="16" class="text-[#0B3C5D]" />
        <h3 class="font-serif-editorial text-lg font-bold text-[#0A2B42]">Filtros</h3>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1 text-[11px] font-bold text-[#E86A58] hover:underline cursor-pointer"
        @click="resetFilters"
      >
        <RotateCcw :size="12" />
        <span>Limpar</span>
      </button>
    </div>

    <!-- Filtro por Região -->
    <div class="space-y-3">
      <label class="text-xs font-bold tracking-wider uppercase text-[#0A2B42] block">
        Região Costeira
      </label>
      <div class="space-y-1.5">
        <label
          v-for="reg in regions"
          :key="reg"
          class="flex items-center gap-2 text-xs text-[#5A738E] hover:text-[#0A2B42] cursor-pointer"
        >
          <input
            v-model="selectedRegion"
            type="radio"
            :value="reg"
            class="text-[#0B3C5D] focus:ring-[#0B3C5D]"
          />
          <span>{{ reg }}</span>
        </label>
      </div>
    </div>

    <!-- Filtro por Tipo de Água / Mar -->
    <div class="space-y-3 pt-4 border-t border-[#F0EDE4]">
      <label class="text-xs font-bold tracking-wider uppercase text-[#0A2B42] block">
        Tipo de Água & Mar
      </label>
      <div class="space-y-1.5">
        <label
          v-for="wt in waterTypes"
          :key="wt"
          class="flex items-center gap-2 text-xs text-[#5A738E] hover:text-[#0A2B42] cursor-pointer"
        >
          <input
            v-model="selectedWaterType"
            type="radio"
            :value="wt"
            class="text-[#0B3C5D] focus:ring-[#0B3C5D]"
          />
          <span>{{ wt }}</span>
        </label>
      </div>
    </div>

    <!-- Edição Limitada -->
    <div class="pt-4 border-t border-[#F0EDE4]">
      <label class="flex items-center gap-2 text-xs font-bold text-[#0A2B42] cursor-pointer">
        <input
          v-model="onlyLimited"
          type="checkbox"
          class="rounded text-[#0B3C5D] focus:ring-[#0B3C5D]"
        />
        <span>Apenas Edições Limitadas</span>
      </label>
    </div>

    <!-- Faixa de Preço Máximo -->
    <div class="space-y-3 pt-4 border-t border-[#F0EDE4]">
      <div class="flex justify-between items-center text-xs">
        <label class="font-bold uppercase tracking-wider text-[#0A2B42]">Preço Máximo</label>
        <span class="font-bold text-[#0B3C5D]">R$ {{ maxPrice }},00</span>
      </div>
      <input
        v-model.number="maxPrice"
        type="range"
        min="70"
        max="250"
        step="5"
        class="w-full accent-[#0B3C5D]"
      />
    </div>
  </aside>
</template>
