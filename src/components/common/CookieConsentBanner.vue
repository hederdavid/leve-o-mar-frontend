<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { ShieldCheck, Cookie, X, Check } from 'lucide-vue-next'

const consent = useLocalStorage<'accepted' | 'essential' | null>('leve-o-mar:cookie-consent', null)
const isVisible = ref(false)
const showDetails = ref(false)

function acceptAll() {
  consent.value = 'accepted'
  isVisible.value = false
}

function acceptEssential() {
  consent.value = 'essential'
  isVisible.value = false
}

onMounted(() => {
  if (!consent.value) {
    // Exibe com um delay suave após o carregamento da página
    setTimeout(() => {
      isVisible.value = true
    }, 1200)
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in"
  >
    <div class="card-maritimo p-5 sm:p-6 bg-white/95 backdrop-blur-xl border border-[#E6E1D6] shadow-2xl space-y-4">
      
      <!-- Cabeçalho do Aviso -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-[#F7F4EE] border border-[#EBE7DE] text-[#0B3C5D] flex items-center justify-center flex-shrink-0 shadow-inner">
            <Cookie :size="18" class="text-[#D97706]" />
          </div>
          <div>
            <h4 class="font-serif-editorial text-sm font-bold text-[#0A2B42]">
              Sua Privacidade no Litoral
            </h4>
            <span class="text-[10px] text-[#5A738E] font-medium block">
              Conforme as diretrizes da LGPD
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Fechar"
          class="p-1 text-[#5A738E] hover:text-[#0A2B42] rounded-full"
          @click="acceptEssential"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Texto Informativo -->
      <p class="text-xs text-[#5A738E] leading-relaxed">
        Utilizamos cookies e tecnologias similares para personalizar sua expedição pelas praias brasileiras, salvar sua garrafa personalizada e garantir a segurança das suas compras.
      </p>

      <!-- Detalhes Expansíveis Opcionais -->
      <div v-if="showDetails" class="p-3 bg-[#F7F4EE] rounded-xl border border-[#EBE7DE] text-[11px] text-[#5A738E] space-y-1.5 animate-fade-in">
        <div class="flex items-center gap-1.5 font-bold text-[#0A2B42]">
          <ShieldCheck :size="13" class="text-[#0B3C5D]" />
          <span>Cookies Utilizados:</span>
        </div>
        <p>• <strong>Essenciais</strong>: Carrinho de compras, sessão de checkout e segurança.</p>
        <p>• <strong>Personalização</strong>: Salvamento do rótulo e preferências de navegação.</p>
      </div>

      <!-- Ações de Aceite -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <button
          type="button"
          class="text-[11px] font-semibold text-[#5A738E] hover:text-[#0A2B42] underline text-center sm:text-left cursor-pointer"
          @click="showDetails = !showDetails"
        >
          {{ showDetails ? 'Ocultar Detalhes' : 'Preferências de Cookies' }}
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3.5 py-2 rounded-full bg-[#F0EDE4] hover:bg-[#E6E1D6] text-[#0A2B42] text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none"
            @click="acceptEssential"
          >
            Apenas Essenciais
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs font-bold shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
            @click="acceptAll"
          >
            <Check :size="13" />
            <span>Aceitar Todos</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
