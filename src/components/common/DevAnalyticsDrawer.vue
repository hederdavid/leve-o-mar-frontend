<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { analytics, type AnalyticsEvent } from '@/services/analytics'
import { toast } from 'vue-sonner'
import {
  Activity,
  X,
  Trash2,
  Copy,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ChevronRight,
  Radio,
  Zap,
  Clock
} from 'lucide-vue-next'

const isOpen = ref(false)
const selectedEvent = ref<AnalyticsEvent | null>(null)
const activeTab = ref<'funnel' | 'events' | 'vitals'>('funnel')

const events = analytics.events
const vitals = analytics.webVitals

// Cálculo do funil de conversão baseado nos eventos coletados
const funnelStats = computed(() => {
  const views = events.value.filter((e) => e.name === 'view_product').length
  const carts = events.value.filter((e) => e.name === 'add_to_cart').length
  const checkouts = events.value.filter((e) => e.name === 'checkout_step').length
  const purchases = events.value.filter((e) => e.name === 'complete_purchase').length

  const cartRate = views > 0 ? ((carts / views) * 100).toFixed(1) : '0'
  const checkoutRate = carts > 0 ? ((checkouts / carts) * 100).toFixed(1) : '0'
  const purchaseRate = checkouts > 0 ? ((purchases / checkouts) * 100).toFixed(1) : '0'

  return {
    views,
    carts,
    checkouts,
    purchases,
    cartRate,
    checkoutRate,
    purchaseRate
  }
})

function toggleDrawer() {
  isOpen.value = !isOpen.value
}

function handleClear() {
  analytics.clearEvents()
  selectedEvent.value = null
  toast.success('Logs de telemetria limpos com sucesso.')
}

function copyLogs() {
  navigator.clipboard.writeText(JSON.stringify(events.value, null, 2))
  toast.success('Logs de telemetria copiados em formato JSON!')
}

function handleKeyDown(e: KeyboardEvent) {
  // Atalho Alt + M para abrir/fechar o painel
  if (e.altKey && (e.key === 'm' || e.key === 'M')) {
    e.preventDefault()
    toggleDrawer()
  }
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <!-- Botão Flutuante Discreto de Telemetria -->
  <button
    type="button"
    aria-label="Abrir painel de telemetria e métricas (Alt+M)"
    class="fixed bottom-5 right-5 z-40 bg-[#0A2B42] hover:bg-[#0B3C5D] text-white text-xs font-bold py-2.5 px-3.5 rounded-full shadow-2xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
    @click="toggleDrawer"
  >
    <Activity :size="15" class="text-[#05BFDB] animate-pulse" />
    <span class="hidden sm:inline">Métricas & Telemetria</span>
    <span class="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-[#8A9BA8] group-hover:text-white">
      Alt+M
    </span>
  </button>

  <!-- Gaveta Lateral de Métricas -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metrics-drawer-title"
    >
      <div
        class="fixed inset-0 bg-[#0A2B42]/60 backdrop-blur-sm transition-opacity"
        @click="isOpen = false"
      />

      <div class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div class="w-screen max-w-full sm:max-w-lg bg-[#F7F4EE] border-l border-[#E6E1D6] shadow-2xl flex flex-col justify-between">
          
          <!-- Topo do Painel -->
          <div class="p-5 border-b border-[#E6E1D6] bg-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#0A2B42] text-[#05BFDB] flex items-center justify-center shadow-inner">
                <Cpu :size="18" />
              </div>
              <div>
                <h2 id="metrics-drawer-title" class="font-serif-editorial text-lg font-bold text-[#0A2B42]">
                  Painel de Telemetria & Logs
                </h2>
                <div class="flex items-center gap-1.5 text-[10px] text-[#5A738E] mt-0.5">
                  <Radio :size="10" class="text-[#05BFDB] animate-ping" />
                  <span>{{ analytics.isLive.value ? 'PostHog Cloud Ativo' : 'Simulação de Métricas em Tempo Real' }}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Fechar painel"
              class="p-2 text-[#5A738E] hover:text-[#0A2B42] rounded-full hover:bg-[#EBE7DE] transition-colors cursor-pointer"
              @click="isOpen = false"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Abas de Navegação -->
          <div class="flex border-b border-[#E6E1D6] bg-white text-xs font-bold">
            <button
              type="button"
              class="flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer"
              :class="activeTab === 'funnel' ? 'border-[#0B3C5D] text-[#0B3C5D]' : 'border-transparent text-[#5A738E] hover:text-[#0A2B42]'"
              @click="activeTab = 'funnel'"
            >
              Funil de Conversão
            </button>
            <button
              type="button"
              class="flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer"
              :class="activeTab === 'events' ? 'border-[#0B3C5D] text-[#0B3C5D]' : 'border-transparent text-[#5A738E] hover:text-[#0A2B42]'"
              @click="activeTab = 'events'"
            >
              Logs de Eventos ({{ events.length }})
            </button>
            <button
              type="button"
              class="flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer"
              :class="activeTab === 'vitals' ? 'border-[#0B3C5D] text-[#0B3C5D]' : 'border-transparent text-[#5A738E] hover:text-[#0A2B42]'"
              @click="activeTab = 'vitals'"
            >
              Core Web Vitals
            </button>
          </div>

          <!-- Conteúdo Principal -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            
            <!-- Aba 1: Funil de Conversão -->
            <div v-if="activeTab === 'funnel'" class="space-y-4">
              <div class="p-4 bg-white rounded-2xl border border-[#E6E1D6] shadow-sm space-y-4">
                <div class="flex items-center justify-between text-xs font-bold text-[#0A2B42]">
                  <span class="flex items-center gap-1.5">
                    <TrendingUp :size="14" class="text-[#05BFDB]" />
                    <span>Jornada do Colecionador (Sessão Atual)</span>
                  </span>
                  <span class="text-[10px] text-[#5A738E]">Eventos Acumulados</span>
                </div>

                <!-- Etapa 1: Visualizações -->
                <div class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold text-[#0A2B42]">
                    <span>1. Garrafas Exploradas (view_product)</span>
                    <span>{{ funnelStats.views }}</span>
                  </div>
                  <div class="w-full h-2.5 bg-[#EBE7DE] rounded-full overflow-hidden">
                    <div class="h-full bg-[#0B3C5D] rounded-full" style="width: 100%"></div>
                  </div>
                </div>

                <!-- Etapa 2: Adições à Sacola -->
                <div class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold text-[#0A2B42]">
                    <span>2. Adicionadas à Sacola (add_to_cart)</span>
                    <span>{{ funnelStats.carts }} ({{ funnelStats.cartRate }}% de conversão)</span>
                  </div>
                  <div class="w-full h-2.5 bg-[#EBE7DE] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#05BFDB] rounded-full transition-all duration-500"
                      :style="{ width: `${funnelStats.views > 0 ? Math.min(100, (funnelStats.carts / funnelStats.views) * 100) : 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Etapa 3: Início de Checkout -->
                <div class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold text-[#0A2B42]">
                    <span>3. Início de Checkout (checkout_step)</span>
                    <span>{{ funnelStats.checkouts }} ({{ funnelStats.checkoutRate }}%)</span>
                  </div>
                  <div class="w-full h-2.5 bg-[#EBE7DE] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#D97706] rounded-full transition-all duration-500"
                      :style="{ width: `${funnelStats.carts > 0 ? Math.min(100, (funnelStats.checkouts / funnelStats.carts) * 100) : 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Etapa 4: Pedidos Concluídos -->
                <div class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold text-[#0A2B42]">
                    <span>4. Pedidos Concluídos (complete_purchase)</span>
                    <span>{{ funnelStats.purchases }} ({{ funnelStats.purchaseRate }}%)</span>
                  </div>
                  <div class="w-full h-2.5 bg-[#EBE7DE] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      :style="{ width: `${funnelStats.checkouts > 0 ? Math.min(100, (funnelStats.purchases / funnelStats.checkouts) * 100) : 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="p-3.5 bg-[#EBE7DE]/70 rounded-xl border border-[#D6CFC0] text-xs text-[#5A738E] space-y-1">
                <p class="font-bold text-[#0A2B42]">Dica de Telemetria:</p>
                <p>Navegue pelo catálogo, adicione garrafas ou acessórios e avance até o checkout para ver os indicadores se atualizarem dinamicamente.</p>
              </div>
            </div>

            <!-- Aba 2: Stream de Logs de Eventos -->
            <div v-if="activeTab === 'events'" class="space-y-3">
              <div v-if="events.length === 0" class="py-12 text-center text-xs text-[#5A738E]">
                Nenhum evento registrado até o momento.
              </div>

              <div
                v-for="evt in events"
                :key="evt.id"
                class="p-3 bg-white rounded-xl border border-[#E6E1D6] hover:border-[#0B3C5D] transition-colors cursor-pointer text-xs space-y-1.5 shadow-sm"
                @click="selectedEvent = selectedEvent?.id === evt.id ? null : evt"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 font-mono font-bold text-[#0B3C5D]">
                    <Zap :size="12" class="text-[#D97706]" />
                    <span>{{ evt.name }}</span>
                  </div>
                  <span class="text-[10px] text-[#8A9BA8] font-mono">{{ evt.timestamp }}</span>
                </div>

                <div class="text-[11px] text-[#5A738E] truncate">
                  {{ evt.properties.url || 'Página' }} · {{ Object.keys(evt.properties).length }} propriedades
                </div>

                <!-- Detalhes do Payload ao Clicar -->
                <pre
                  v-if="selectedEvent?.id === evt.id"
                  class="mt-2 p-2.5 bg-[#0A2B42] text-[#05BFDB] rounded-lg text-[10px] font-mono overflow-x-auto max-h-48"
                >{{ JSON.stringify(evt.properties, null, 2) }}</pre>
              </div>
            </div>

            <!-- Aba 3: Core Web Vitals -->
            <div v-if="activeTab === 'vitals'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                
                <!-- LCP -->
                <div class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] shadow-sm">
                  <span class="text-[10px] font-bold text-[#5A738E] uppercase tracking-wider block">LCP (Renderização)</span>
                  <div class="font-serif-editorial text-2xl font-bold text-[#0A2B42] mt-1">
                    {{ vitals.lcp ? `${vitals.lcp}ms` : 'Coletando...' }}
                  </div>
                  <span class="text-[10px] text-emerald-600 font-bold block mt-1">
                    {{ vitals.lcp && vitals.lcp < 2500 ? 'Excelente (< 2.5s)' : 'Em medição' }}
                  </span>
                </div>

                <!-- FCP -->
                <div class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] shadow-sm">
                  <span class="text-[10px] font-bold text-[#5A738E] uppercase tracking-wider block">FCP (1ª Pintura)</span>
                  <div class="font-serif-editorial text-2xl font-bold text-[#0A2B42] mt-1">
                    {{ vitals.fcp ? `${vitals.fcp}ms` : 'Coletando...' }}
                  </div>
                  <span class="text-[10px] text-emerald-600 font-bold block mt-1">
                    {{ vitals.fcp && vitals.fcp < 1800 ? 'Excelente (< 1.8s)' : 'Em medição' }}
                  </span>
                </div>

                <!-- CLS -->
                <div class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] shadow-sm">
                  <span class="text-[10px] font-bold text-[#5A738E] uppercase tracking-wider block">CLS (Deslocamento)</span>
                  <div class="font-serif-editorial text-2xl font-bold text-[#0A2B42] mt-1">
                    {{ vitals.cls !== undefined ? vitals.cls : '0.000' }}
                  </div>
                  <span class="text-[10px] text-emerald-600 font-bold block mt-1">
                    {{ vitals.cls !== undefined && vitals.cls < 0.1 ? 'Excelente (< 0.1)' : 'Estável' }}
                  </span>
                </div>

                <!-- TTFB -->
                <div class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] shadow-sm">
                  <span class="text-[10px] font-bold text-[#5A738E] uppercase tracking-wider block">TTFB (Resposta Inicial)</span>
                  <div class="font-serif-editorial text-2xl font-bold text-[#0A2B42] mt-1">
                    {{ vitals.ttfb ? `${vitals.ttfb}ms` : 'Coletando...' }}
                  </div>
                  <span class="text-[10px] text-emerald-600 font-bold block mt-1">
                    {{ vitals.ttfb && vitals.ttfb < 800 ? 'Excelente (< 800ms)' : 'Em medição' }}
                  </span>
                </div>

              </div>

              <div class="p-3.5 bg-white rounded-xl border border-[#E6E1D6] text-xs text-[#5A738E] space-y-1.5">
                <div class="flex items-center gap-1.5 font-bold text-[#0A2B42]">
                  <CheckCircle2 :size="14" class="text-emerald-600" />
                  <span>Monitoramento Ativo via PerformanceObserver API</span>
                </div>
                <p class="text-[11px]">
                  Os dados são extraídos diretamente do navegador conforme as interações e renderizações ocorrem no DOM.
                </p>
              </div>
            </div>

          </div>

          <!-- Rodapé de Ações do Painel -->
          <div class="p-4 bg-white border-t border-[#E6E1D6] flex items-center justify-between gap-3">
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-[#D6CFC0] bg-white hover:bg-[#F7F4EE] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] transition-colors flex items-center gap-1.5 cursor-pointer"
              @click="copyLogs"
            >
              <Copy :size="13" />
              <span>Copiar JSON</span>
            </button>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-[#F5C2BC] bg-white hover:bg-[#FDF3F1] text-xs font-bold text-[#E86A58] transition-colors flex items-center gap-1.5 cursor-pointer"
              @click="handleClear"
            >
              <Trash2 :size="13" />
              <span>Limpar Logs</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>
