<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/auth'
import type { Order } from '@/types/order'
import { mockProducts } from '@/mocks/products'
import { RouterLink } from 'vue-router'
import {
  Compass,
  Award,
  MapPin,
  Lock,
  CheckCircle2,
  Droplets,
  ArrowUpRight
} from 'lucide-vue-next'

interface Props {
  user: User
  orders: Order[]
}

const props = defineProps<Props>()

const collectedBeachSlugs = computed(() => {
  const set = new Set<string>()
  props.orders.forEach((o) => {
    o.items.forEach((item) => {
      set.add(item.product.slug)
    })
  })
  return set
})

const totalBeaches = computed(() => mockProducts.length)
const collectedCount = computed(() => collectedBeachSlugs.value.size)
const percentageExplored = computed(() =>
  Math.round((collectedCount.value / (totalBeaches.value || 1)) * 100)
)
</script>

<template>
  <div class="space-y-8">
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A2B42] via-[#0B3C5D] to-[#144272] text-white shadow-xl relative overflow-hidden">
      <div class="relative z-10 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#05BFDB] text-xs font-semibold backdrop-blur-md mb-4">
          <Compass :size="14" />
          <span>Passaporte de Navegação do Litoral</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-serif font-bold">
          Seu Diário da Costa Brasileira
        </h1>

        <p class="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
          Cada garrafa colecionada registra um carimbo permanente em seu passaporte náutico. Acompanhe a porcentagem do litoral que você já levou para casa.
        </p>

        <div class="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
          <div class="flex items-center justify-between text-xs font-semibold mb-2">
            <span>Progresso da Costa</span>
            <span class="text-[#05BFDB] font-bold">{{ collectedCount }} de {{ totalBeaches }} praias ({{ percentageExplored }}%)</span>
          </div>

          <div class="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-[#05BFDB] to-[#E86A58] rounded-full transition-all duration-700"
              :style="{ width: `${Math.max(percentageExplored, 8)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-serif font-bold text-[#0A2B42]">Carimbos Náuticos por Destino</h2>
          <p class="text-xs text-[#5A738E]">Selos oficiais gravados no arquivamento de cada água.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in mockProducts"
          :key="product.id"
          class="p-5 rounded-3xl border transition-all flex flex-col justify-between"
          :class="[
            collectedBeachSlugs.has(product.slug)
              ? 'bg-white border-[#0A2B42]/30 shadow-md ring-1 ring-[#0A2B42]/10'
              : 'bg-[#FBF9F5]/70 border-dashed border-[#D9D3C7]'
          ]"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                :class="
                  collectedBeachSlugs.has(product.slug)
                    ? 'bg-[#0A2B42] text-white'
                    : 'bg-[#EAE5D9] text-[#5A738E]'
                "
              >
                {{ product.state }} · {{ product.region }}
              </span>

              <div
                v-if="collectedBeachSlugs.has(product.slug)"
                class="flex items-center gap-1 text-[11px] font-bold text-[#05BFDB]"
              >
                <CheckCircle2 :size="14" />
                <span>Catalogado</span>
              </div>
              <div v-else class="flex items-center gap-1 text-[11px] text-[#8A9BA8]">
                <Lock :size="13" />
                <span>A desbravar</span>
              </div>
            </div>

            <div class="flex items-center gap-3 my-2">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all flex-shrink-0"
                :class="
                  collectedBeachSlugs.has(product.slug)
                    ? 'border-[#D4AF37] bg-[#FAF8F5] text-[#0A2B42]'
                    : 'border-[#D9D3C7] bg-white text-[#8A9BA8]'
                "
              >
                <Compass :size="20" :class="collectedBeachSlugs.has(product.slug) ? 'text-[#D4AF37]' : ''" />
              </div>

              <div class="min-w-0">
                <h3 class="text-sm font-bold text-[#0A2B42] truncate">{{ product.beachName }}</h3>
                <p class="text-[11px] text-[#5A738E] truncate">{{ product.city }}</p>
              </div>
            </div>

            <p class="text-xs text-[#4F6D7A] line-clamp-2 mt-2 leading-relaxed">
              {{ product.tagline }}
            </p>
          </div>

          <div class="pt-4 mt-4 border-t border-[#F0EDE4] flex items-center justify-between">
            <span class="text-[10px] font-mono text-[#5A738E]">
              {{ product.coordinates.lat.toFixed(2) }}°, {{ product.coordinates.lng.toFixed(2) }}°
            </span>

            <RouterLink
              v-if="!collectedBeachSlugs.has(product.slug)"
              :to="`/produto/${product.slug}`"
              class="text-xs font-semibold text-[#0A2B42] hover:text-[#05BFDB] flex items-center gap-1 transition-colors"
            >
              <span>Colecionar</span>
              <ArrowUpRight :size="13" />
            </RouterLink>
            <span v-else class="text-[11px] font-semibold text-[#0A2B42]">
              Lote Arquivado
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
