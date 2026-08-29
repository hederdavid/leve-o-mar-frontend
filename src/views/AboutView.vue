<script setup lang="ts">
import { ref } from 'vue'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import SearchModal from '@/components/common/SearchModal.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { Droplet, Sparkles, ShieldCheck, Heart, ChevronDown, Compass, ArrowRight } from 'lucide-vue-next'

const isSearchOpen = ref(false)

const openFaq = ref<number | null>(0)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const faqs = [
  {
    question: 'Quanto tempo a água do mar dura dentro da garrafa?',
    answer:
      'A água do mar é perfeitamente preservada por tempo indeterminado. Nosso processo de envase inclui microfiltragem para remoção de resíduos orgânicos e vedação hermética da rolha de cortiça natural com cera vegetal marítima, impedindo a evaporação e proliferação bacteriana, mantendo a tonalidade e transparência originais.'
  },
  {
    question: 'A rolha veda totalmente contra vazamentos?',
    answer:
      'Sim! Utilizamos cortiça natural de alta densidade tratada e selada com uma película impermeabilizante náutica. Cada garrafa passa por rigoroso teste de estanqueidade antes do despacho.'
  },
  {
    question: 'E se a garrafa quebrar durante o transporte?',
    answer:
      'Desenvolvemos uma embalagem com casulo moldado antiimpacto em espuma reciclável de alta resistência. Todas as nossas remessas possuem Seguro de Transporte Incluso. Se houver qualquer avaria, enviamos uma nova garrafa imediatamente sem custo.'
  },
  {
    question: 'Posso personalizar o rótulo com uma dedicatória de presente?',
    answer:
      'Com certeza! Na página de qualquer garrafa, basta selecionar a opção "Gravar dedicatória personalizada no rótulo" antes de adicionar ao carrinho. Nós caligrafamos o nome e sua mensagem afetiva no papel algodão artesanal como cortesia.'
  }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader @open-search="isSearchOpen = true" />

    <main class="flex-grow">
      
      <!-- Hero Editorial da História -->
      <section class="py-16 lg:py-24 bg-[#F7F4EE] bg-dots-pattern border-b border-[#E6E1D6] text-center">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span class="text-xs font-semibold tracking-[0.25em] text-[#E86A58] uppercase block">
            Nossa História & Manifesto
          </span>

          <h1 class="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A2B42] leading-[1.15]">
            A Poesia e a Alma do Mar <br />
            <span class="italic font-normal">em Cada Garrafa</span>
          </h1>

          <p class="text-base sm:text-lg text-[#5A738E] leading-relaxed max-w-2xl mx-auto">
            O Leve o Mar nasceu de um sentimento universal: a saudade da brisa, da luz do sol no horizonte e da energia purificadora que só o oceano nos traz.
          </p>
        </div>
      </section>

      <!-- Manifesto da Marca -->
      <section class="py-16 lg:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div class="md:col-span-5 relative">
            <div class="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#E6E1D6]">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="Mar cristalino brasileiro"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Card de Destaque -->
            <div class="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-[#EBE7DE] max-w-[200px] text-center">
              <span class="text-[10px] font-bold text-[#E86A58] uppercase tracking-wider block">Coordenadas Reais</span>
              <span class="font-serif-editorial text-xs font-bold text-[#0A2B42] block mt-0.5">Gravadas no Rótulo</span>
            </div>
          </div>

          <div class="md:col-span-7 space-y-5">
            <h2 class="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#0A2B42] leading-tight">
              Mais que um objeto de decoração, uma âncora de memórias afetivas.
            </h2>
            <p class="text-sm text-[#5A738E] leading-relaxed">
              Cada praia do Brasil possui sua própria assinatura oceânica. O verde esmeralda do reflexo das falésias de Trancoso, o turquesa límpido dos corais de Fernando de Noronha ou a maresia vigorosa do Atlântico Sul no Rosa.
            </p>
            <p class="text-sm text-[#5A738E] leading-relaxed">
              Ao capturar a água do mar em frascos de vidro lapidado com rolhas de cortiça natural, criamos portais para você revisitar suas melhores viagens e manter a calmaria do litoral presente no seu cotidiano.
            </p>
          </div>
        </div>
      </section>

      <!-- Os 3 Pilares da Coleção -->
      <section class="py-16 bg-[#F0EDE4] border-y border-[#E6E1D6]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block mb-1">Artesanato & Ética</span>
            <h2 class="font-serif-editorial text-3xl font-bold text-[#0A2B42]">Como Cada Garrafa é Criada</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card-maritimo p-8 bg-white space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-[#F7F4EE] text-[#0B3C5D] flex items-center justify-center shadow-sm">
                <Droplet :size="24" class="text-[#05BFDB]" />
              </div>
              <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">1. Coleta Consciente</h3>
              <p class="text-xs sm:text-sm text-[#5A738E] leading-relaxed">
                A água é colhida artesanalmente em pontos preservados durante a maré limpa, sem perturbar o ecossistema marinho ou a vida dos recifes.
              </p>
            </div>

            <div class="card-maritimo p-8 bg-white space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-[#F7F4EE] text-[#0B3C5D] flex items-center justify-center shadow-sm">
                <Sparkles :size="24" class="text-[#D97706]" />
              </div>
              <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">2. Vidro & Vedação</h3>
              <p class="text-xs sm:text-sm text-[#5A738E] leading-relaxed">
                Utilizamos vidro lapidado que valoriza o prisma da luz solar e rolha de cortiça 100% natural selada com resina vegetal contra evaporação.
              </p>
            </div>

            <div class="card-maritimo p-8 bg-white space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-[#F7F4EE] text-[#0B3C5D] flex items-center justify-center shadow-sm">
                <Compass :size="24" class="text-[#0B3C5D]" />
              </div>
              <h3 class="font-serif-editorial text-xl font-bold text-[#0A2B42]">3. Rótulo com Coordenadas</h3>
              <p class="text-xs sm:text-sm text-[#5A738E] leading-relaxed">
                Impresso em papel algodão artesanal de alta gramatura, cada rótulo registra a história e as coordenadas geográficas exatas do destino.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ - Perguntas Frequentes (Accordion) -->
      <section class="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-xs font-bold tracking-widest text-[#E86A58] uppercase block mb-1">Dúvidas Frequentes</span>
          <h2 class="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#0A2B42]">Perguntas da Comunidade</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="card-maritimo bg-white overflow-hidden"
          >
            <button
              type="button"
              class="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              @click="toggleFaq(index)"
            >
              <span class="font-serif-editorial text-base sm:text-lg font-bold text-[#0A2B42]">
                {{ faq.question }}
              </span>
              <ChevronDown
                :size="18"
                :class="[
                  'text-[#5A738E] transition-transform duration-300 flex-shrink-0',
                  openFaq === index ? 'rotate-180 text-[#0B3C5D]' : ''
                ]"
              />
            </button>

            <div
              v-if="openFaq === index"
              class="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5A738E] leading-relaxed border-t border-[#F0EDE4] animate-fade-in"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <router-link
            to="/colecao"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold rounded-full shadow-xl transition-all hover:scale-105"
          >
            <span>Conhecer Todas as Garrafas da Coleção</span>
            <ArrowRight :size="16" />
          </router-link>
        </div>
      </section>

    </main>

    <FooterNavigation />
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>
