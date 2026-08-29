<script setup lang="ts">
import { FileText, Sparkles, Smartphone, Package, ShieldCheck, Waves } from 'lucide-vue-next'

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Rótulo com História & Coordenadas Reais',
    description:
      'Cada garrafa traz um rótulo artesanal com a história da praia, coordenadas geográficas reais e um QR code para exploração digital.'
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Areia e Composição Visual Artística',
    description:
      'Areia autêntica da praia capturada, conchas, e elementos naturais únicos compõem uma obra de arte sensorial dentro de cada garrafa de vidro.'
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Guia Digital Exclusivo do Destino',
    description:
      'Acesse via QR code um guia digital com praias secretas, melhores épocas, sabores locais, hospedagens e experiências autênticas do destino.'
  }
]
</script>

<template>
  <section id="unboxing" class="py-16 lg:py-24 bg-[#F7F4EE] border-b border-[#E6E1D6]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-semibold tracking-[0.2em] text-[#E86A58] uppercase block mb-1">
          Unboxing Sensorial
        </span>
        <h2 class="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B42]">
          O que vem na sua Garrafa
        </h2>
        <p class="text-sm sm:text-base text-[#5A738E] mt-3">
          Uma experiência completa. Da embalagem até o guia digital, cada detalhe foi pensado para transportar você até a praia.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="step in steps"
          :key="step.number"
          class="card-maritimo p-8 relative flex flex-col justify-between overflow-hidden"
        >
          <span class="absolute top-4 right-6 font-serif-editorial text-6xl sm:text-7xl font-extrabold text-[#E5DFD3]/80 select-none pointer-events-none">
            {{ step.number }}
          </span>

          <div>
            <div class="w-12 h-12 rounded-2xl bg-[#EBE7DE] flex items-center justify-center text-[#0B3C5D] mb-6 shadow-sm">
              <component :is="step.icon" :size="22" />
            </div>

            <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42] mb-3 leading-snug">
              {{ step.title }}
            </h3>

            <p class="text-xs sm:text-sm text-[#5A738E] leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-14 bg-[#0B3C5D] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div class="lg:col-span-7 space-y-3">
            <span class="text-xs font-semibold tracking-[0.2em] text-[#F59E0B] uppercase block">
              Frete Especial
            </span>
            <h3 class="font-serif-editorial text-2xl sm:text-3xl font-bold leading-tight">
              Entrega com cuidado de quem ama o mar
            </h3>
            <p class="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
              Embalagem antiimpacto, projetada para proteger o vidro durante o transporte. Cada garrafa chega intacta e pronta para a sua coleção.
            </p>
          </div>

          <div class="lg:col-span-5 space-y-3.5 border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-8">
            <div class="flex items-center gap-3 text-xs sm:text-sm text-white/90">
              <Package :size="18" class="text-[#F59E0B] flex-shrink-0" />
              <span>Embalagem antiimpacto premium</span>
            </div>
            <div class="flex items-center gap-3 text-xs sm:text-sm text-white/90">
              <ShieldCheck :size="18" class="text-[#F59E0B] flex-shrink-0" />
              <span>Seguro de transporte incluso</span>
            </div>
            <div class="flex items-center gap-3 text-xs sm:text-sm text-white/90">
              <Waves :size="18" class="text-[#F59E0B] flex-shrink-0" />
              <span>Verificação de qualidade artesanal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
