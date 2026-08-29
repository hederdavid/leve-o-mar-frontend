<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    alt: 'Sala com decoração artesanal e garrafas Leve o Mar',
    author: '@LUCAS.DECOR',
    room: 'Sala de Estar'
  },
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    alt: 'Mesa de centro com madeira e garrafa colecionável',
    author: '@ANA.INTERIORES',
    room: 'Mesa de Centro'
  },
  {
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    alt: 'Aparador com iluminação suave e conchas',
    author: '@STUDIO.MAR',
    room: 'Hall de Entrada'
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    alt: 'Quarto com vista para o mar e brisa costeira',
    author: '@MARIANA.MAR',
    room: 'Quarto Costeiro',
    isSpecial: true
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    alt: 'Ambiente aconchegante praiano',
    author: '@BRUNO.CASA',
    room: 'Living Room'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Pôr do sol na praia',
    author: '@LEVEOMAR.OFICIAL',
    room: 'Inspiração Costeira'
  }
]
</script>

<template>
  <section id="decor" class="py-16 lg:py-24 bg-[#F7F4EE] border-b border-[#E6E1D6]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
            #LEVEOMAR
          </span>
          <h2 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42]">
            O Mar na Casa de <br class="hidden sm:inline" />
            <span class="italic font-normal">Quem Coleciona</span>
          </h2>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#0A2B42] hover:text-[#E86A58] uppercase transition-colors"
        >
          <span>Ver no Instagram</span>
          <ArrowUpRight :size="15" />
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-md group cursor-pointer border border-[#EBE7DE]"
        >
          <img
            :src="photo.url"
            :alt="photo.alt"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-[#0A2B42]/80 via-transparent to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

          <div class="absolute bottom-4 left-4 z-10 text-white">
            <div class="text-[11px] font-bold tracking-wider uppercase text-[#F59E0B]">
              {{ photo.author }}
            </div>
            <div class="text-xs font-medium text-white/90">
              {{ photo.room }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
