<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const testimonials = [
  {
    quote: 'A garrafa de Noronha ficou perfeita na minha estante. Cada vez que olho, me transporto de volta àquela praia.',
    author: 'Carolina Mendes',
    city: 'São Paulo, SP',
    initial: 'C'
  },
  {
    quote: 'Comprei pra presentear minha mãe e ela chorou. A história que vem no rótulo é lindíssima. Melhor presente que já dei.',
    author: 'Rafael Borges',
    city: 'Recife, PE',
    initial: 'R'
  },
  {
    quote: 'Colecionei 7 garrafas. Minha sala ficou completamente transformada. Todo visitante fica encantado e quer saber onde comprar.',
    author: 'Isabela Costa',
    city: 'Porto Alegre, RS',
    initial: 'I'
  }
]
</script>

<template>
  <section class="py-16 lg:py-20 bg-[#F7F4EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in testimonials"
          :key="index"
          class="card-maritimo p-8 flex flex-col justify-between"
        >
          <div class="flex items-center gap-1 text-[#F59E0B] mb-4">
            <Star v-for="i in 5" :key="i" :size="16" class="fill-[#F59E0B]" />
          </div>

          <p class="font-serif-editorial italic text-base sm:text-lg text-[#0A2B42] leading-relaxed mb-6">
            “{{ item.quote }}”
          </p>

          <div class="flex items-center gap-3 pt-4 border-t border-[#F0EDE4]">
            <div class="w-10 h-10 rounded-full bg-[#0B3C5D] text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {{ item.initial }}
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#0A2B42] leading-tight">
                {{ item.author }}
              </div>
              <div class="text-[11px] text-[#5A738E] leading-tight mt-0.5">
                {{ item.city }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
