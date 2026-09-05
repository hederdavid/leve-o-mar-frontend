<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Lock, Package, Sparkles, Instagram, PinIcon } from 'lucide-vue-next'

const newsletterEmail = ref('')

function handleSubscribe() {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    toast.error('Por favor, digite um e-mail válido.')
    return
  }
  toast.success('Inscrição confirmada na Newsletter da Temporada!', {
    description: 'Você receberá os lançamentos de novos destinos em primeira mão.'
  })
  newsletterEmail.value = ''
}
</script>

<template>
  <footer class="bg-[#0B3C5D] text-white pt-16 pb-12 border-t border-[#0A2B42]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
        <div class="lg:col-span-5 space-y-6">
          <div>
            <span class="font-serif-editorial text-3xl font-bold tracking-tight text-white block">
              Leve o Mar
            </span>
            <span class="text-[10px] font-semibold tracking-[0.25em] text-[#E86A58] uppercase block mt-0.5">
              Destinos que cabem em uma garrafa
            </span>
          </div>

          <p class="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm">
            Colecionáveis artesanais de afeto que trazem a essência, a história e a brisa das praias brasileiras para dentro da sua casa.
          </p>

          <div class="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 max-w-md space-y-3">
            <span class="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase block">
              Newsletter da Temporada
            </span>
            <p class="text-xs text-white/80">
              Receba o lançamento dos próximos destinos por temporada.
            </p>

            <form @submit.prevent="handleSubscribe" class="flex items-center gap-2">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="seu@email.com"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B] border border-white/15"
              />
              <button
                type="submit"
                class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0A2B42] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-2 sm:col-span-4 space-y-4">
          <h4 class="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
            Destinos
          </h4>
          <ul class="space-y-2.5 text-xs text-white/70">
            <li><router-link to="/mapa" class="text-[#F59E0B] font-bold hover:text-white transition-colors">Mapa de Praias</router-link></li>
            <li><router-link to="/colecao" class="hover:text-white transition-colors">Nordeste</router-link></li>
            <li><router-link to="/colecao" class="hover:text-white transition-colors">Sul / Sudeste</router-link></li>
            <li><router-link to="/colecao" class="hover:text-white transition-colors">Praias Paradisíacas</router-link></li>
            <li><router-link to="/personalizar" class="hover:text-white transition-colors">Personalizar Rótulo</router-link></li>
          </ul>
        </div>

        <div class="lg:col-span-2 sm:col-span-4 space-y-4">
          <h4 class="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
            Sobre
          </h4>
          <ul class="space-y-2.5 text-xs text-white/70">
            <li><router-link to="/sobre" class="hover:text-white transition-colors">Nossa História</router-link></li>
            <li><router-link to="/#decor" class="hover:text-white transition-colors">Decor com Mar</router-link></li>
            <li><router-link to="/sobre" class="hover:text-white transition-colors">Como Funciona</router-link></li>
            <li><router-link to="/sobre" class="hover:text-white transition-colors">Sustentabilidade</router-link></li>
            <li><router-link to="/conta" class="hover:text-white transition-colors">O Farol (Minha Conta)</router-link></li>
          </ul>
        </div>

        <div class="lg:col-span-3 sm:col-span-4 space-y-6">
          <div class="space-y-4">
            <h4 class="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
              Suporte
            </h4>
            <ul class="space-y-2.5 text-xs text-white/70">
              <li><router-link to="/rastreio" class="hover:text-white transition-colors">Rastrear Garrafa</router-link></li>
              <li><router-link to="/sobre#faq" class="hover:text-white transition-colors">FAQ</router-link></li>
              <li><a href="#" class="hover:text-white transition-colors">Política de Trocas</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div class="space-y-2 pt-2">
            <h4 class="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
              Redes
            </h4>
            <div class="flex items-center gap-3">
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Instagram">
                <Instagram :size="16" />
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Pinterest">
                <PinIcon :size="16" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <div class="flex flex-wrap items-center gap-6 text-[11px]">
          <div class="flex items-center gap-1.5">
            <Lock :size="14" class="text-[#F59E0B]" />
            <span>Pagamento Seguro</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Package :size="14" class="text-[#F59E0B]" />
            <span>Envio Seguro de Vidro</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Sparkles :size="14" class="text-[#F59E0B]" />
            <span>Produto Artesanal</span>
          </div>
        </div>

        <div class="text-[11px]">
          © 2025 Leve o Mar · Todos os direitos reservados
        </div>
      </div>
    </div>
  </footer>
</template>
