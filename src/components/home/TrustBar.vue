<script setup lang="ts">
import { Truck, ShieldCheck, CreditCard, Droplet } from 'lucide-vue-next'

const benefits = [
  {
    icon: Truck,
    title: 'Frete Grátis acima de R$ 79,90',
    description: 'Entrega rápida para todo o território nacional'
  },
  {
    icon: ShieldCheck,
    title: 'Embalagem Antiimpacto',
    description: 'Casulo moldado com garantia contra quebra de vidro'
  },
  {
    icon: CreditCard,
    title: 'Até 6x Sem Juros',
    description: 'Ou 5% de desconto extra via Pix instantâneo'
  },
  {
    icon: Droplet,
    title: 'Águas 100% Preservadas',
    description: 'Coleta ética e rolha de cortiça com lacre vegetal'
  }
]
</script>

<template>
  <div class="bg-white border-b border-[#E6E1D6] py-6 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(item, idx) in benefits"
          :key="idx"
          class="flex items-center gap-3.5 p-2"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-[#EBE7DE] text-[#0B3C5D] flex items-center justify-center flex-shrink-0 shadow-sm">
            <component :is="item.icon" :size="22" class="text-[#0B3C5D]" />
          </div>
          <div>
            <h4 class="font-serif-editorial text-sm font-bold text-[#0A2B42] leading-tight">
              {{ item.title }}
            </h4>
            <p class="text-[11px] text-[#5A738E] mt-0.5 leading-snug">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
