<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { BottleCertificate } from '@/types/order'
import {
  X,
  Award,
  Compass,
  MapPin,
  Printer,
  ShieldCheck,
  Droplets,
  Calendar
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  certificate: BottleCertificate | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

function printCertificate() {
  window.print()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && certificate"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A2B42]/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-xl bg-[#FAF8F5] border-2 border-[#D4AF37]/50 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none"
      >
        <button
          type="button"
          aria-label="Fechar certificado"
          class="absolute top-4 right-4 p-2 rounded-full text-[#5A738E] hover:text-[#0A2B42] hover:bg-[#EAE5D9] transition-colors print:hidden cursor-pointer"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>

        <div class="border border-[#D4AF37]/30 rounded-2xl p-6 relative bg-gradient-to-b from-white to-[#F7F4EE]">
          <div class="text-center pb-6 border-b border-[#E6E1D6]">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0A2B42] text-[#D4AF37] mb-3 shadow-md">
              <Award :size="24" />
            </div>
            <p class="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0A2B42]">
              República Federativa do Brasil · Costa Atlântica
            </p>
            <h2 class="text-2xl sm:text-3xl font-serif font-extrabold text-[#0A2B42] mt-1">
              Certificado de Autenticidade
            </h2>
            <p class="text-xs font-mono text-[#D4AF37] mt-1 font-bold">
              {{ certificate.certificateNumber }}
            </p>
          </div>

          <div class="py-6 space-y-4 text-center">
            <p class="text-xs text-[#4F6D7A] leading-relaxed max-w-md mx-auto">
              Certificamos que esta garrafa contém água do mar autêntica coletada no destino preservado abaixo, envasada artesanalmente em vidro borossilicato lapidado com vedação hermética em rolha de cortiça.
            </p>

            <div class="p-4 bg-white rounded-xl border border-[#E6E1D6] text-left grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Destino Costeiro</span>
                <p class="text-sm font-bold text-[#0A2B42] flex items-center gap-1.5 mt-0.5">
                  <MapPin :size="14" class="text-[#E86A58]" />
                  <span>{{ certificate.beachName }}, {{ certificate.state }}</span>
                </p>
              </div>

              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Coordenadas Geográficas</span>
                <p class="text-xs font-mono font-semibold text-[#0A2B42] flex items-center gap-1.5 mt-0.5">
                  <Compass :size="14" class="text-[#05BFDB]" />
                  <span>{{ certificate.coordinates.lat.toFixed(4) }}° S, {{ certificate.coordinates.lng.toFixed(4) }}° O</span>
                </p>
              </div>

              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Data da Coleta</span>
                <p class="text-xs font-medium text-[#0A2B42] flex items-center gap-1.5 mt-0.5">
                  <Calendar :size="14" class="text-[#5A738E]" />
                  <span>{{ certificate.collectionDate }}</span>
                </p>
              </div>

              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Lote / Maré</span>
                <p class="text-xs font-medium text-[#0A2B42] flex items-center gap-1.5 mt-0.5">
                  <Droplets :size="14" class="text-[#05BFDB]" />
                  <span>{{ certificate.batchNumber }} · {{ certificate.tideCondition }}</span>
                </p>
              </div>
            </div>

            <div v-if="certificate.dedicationText" class="p-3 bg-[#FAF8F5] rounded-xl border border-[#D9D3C7] text-left">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#5A738E]">Dedicatória Caligrafada</span>
              <p class="text-xs italic text-[#0A2B42] mt-1 font-serif">
                "{{ certificate.dedicationText }}"
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-[#E6E1D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p class="text-[11px] font-serif font-bold text-[#0A2B42]">{{ certificate.curatorSignature }}</p>
              <p class="text-[9px] uppercase tracking-wider text-[#5A738E]">Curadoria & Controle de Qualidade Marítima</p>
            </div>

            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAE5D9] text-[#0A2B42] text-[10px] font-bold">
              <ShieldCheck :size="14" class="text-[#05BFDB]" />
              <span>Selo Oceanográfico Oficial</span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between print:hidden">
          <p class="text-xs text-[#5A738E]">Fragmento único da costa brasileira</p>
          <div class="flex gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-[#0A2B42] text-[#0A2B42] hover:bg-[#EAE5D9] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              @click="printCertificate"
            >
              <Printer :size="14" />
              <span>Imprimir Certificado</span>
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-[#0A2B42] text-white hover:bg-[#144272] text-xs font-semibold cursor-pointer transition-colors"
              @click="emit('close')"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>
