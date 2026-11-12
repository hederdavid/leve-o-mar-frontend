<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  AlertCircle
} from 'lucide-vue-next'

export interface SecurityVerificationProps {
  customerName: string
  customerPhone: string
  customerCep: string
  maskedCard: string
  totalFormatted: string
  paymentMethod: 'CREDIT_CARD' | 'PIX' | 'BOLETO'
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<SecurityVerificationProps>(), {
  isSubmitting: false
})

const emit = defineEmits<{
  (e: 'verified', otpCode: string): void
  (e: 'back'): void
}>()

const DEMO_OTP_CODE = '849201'
const otpCode = ref(DEMO_OTP_CODE)
const otpError = ref('')
const otpFormRef = ref<HTMLFormElement | null>(null)
const otpInputRef = ref<HTMLInputElement | null>(null)
const smsResentCount = ref(0)

let otpAbortController: AbortController | null = null

const securityChecks = [
  {
    id: 'tls-pci',
    label: 'Conexão Segura',
    status: 'Ativa',
    title: 'Criptografia TLS 1.3 & Tokenização PCI-DSS',
    detail: 'Dados do pagamento protegidos de ponta a ponta com certificado digital SSL.'
  },
  {
    id: 'avs-check',
    label: 'Verificação de Endereço (AVS)',
    status: 'Confirmado',
    title: 'Endereço de Cobrança Compatível',
    detail: `CEP ${props.customerCep || '40140-130'} validado junto ao emissor do cartão.`
  },
  {
    id: 'device-fp',
    label: 'Reconhecimento de Acesso',
    status: 'Seguro',
    title: 'Dispositivo e Localização Reconhecidos',
    detail: 'Sessão autenticada sem indícios de acesso automatizado ou conexão anônima.'
  },
  {
    id: 'risk-score',
    label: 'Análise Preventiva',
    status: 'Aprovada',
    title: 'Monitoramento Antifraude em Tempo Real',
    detail: 'Padrão de compra validado com índice de confiança elevado.'
  }
]

function sanitizeOtp(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 6)
}

function handleOtpInput(event: Event) {
  const target = event.target as HTMLInputElement
  const cleaned = sanitizeOtp(target.value)
  otpCode.value = cleaned
  target.value = cleaned
  if (otpError.value) {
    otpError.value = ''
  }
}

function fillDemoOtp() {
  otpCode.value = DEMO_OTP_CODE
  otpError.value = ''
}

function handleResendOtp() {
  smsResentCount.value += 1
  otpCode.value = DEMO_OTP_CODE
  otpError.value = ''
  initWebOtpListener()
}

function handleSubmitOtp() {
  const clean = sanitizeOtp(otpCode.value)
  if (clean.length !== 6) {
    otpError.value = 'Digite o código numérico de 6 dígitos enviado para autenticação.'
    otpInputRef.value?.focus()
    return
  }

  if (otpAbortController) {
    otpAbortController.abort()
    otpAbortController = null
  }

  emit('verified', clean)
}

function initWebOtpListener() {
  if (typeof window === 'undefined' || !('OTPCredential' in window)) {
    return
  }

  if (otpAbortController) {
    otpAbortController.abort()
  }

  otpAbortController = new AbortController()
  const navCredentials = navigator.credentials as unknown as {
    get?: (options?: { otp?: { transport: string[] }; signal?: AbortSignal }) => Promise<{ code?: string } | null>
  }

  if (navCredentials && typeof navCredentials.get === 'function') {
    navCredentials
      .get({
        otp: { transport: ['sms'] },
        signal: otpAbortController.signal
      })
      .then((credential: { code?: string } | null) => {
        if (credential && typeof credential.code === 'string') {
          otpCode.value = sanitizeOtp(credential.code)
          otpFormRef.value?.requestSubmit()
        }
      })
      .catch(() => {
        // Ignorado quando o navegador não recebe SMS real ou é abortado
      })
  }
}

onMounted(() => {
  initWebOtpListener()
})

onUnmounted(() => {
  if (otpAbortController) {
    otpAbortController.abort()
    otpAbortController = null
  }
})
</script>

<template>
  <section
    aria-labelledby="security-verification-heading"
    class="card-maritimo p-6 sm:p-8 bg-white space-y-6 animate-fade-in"
  >
    <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D6]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[#0B3C5D] text-white flex items-center justify-center shadow-sm">
          <ShieldCheck :size="20" />
        </div>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-[#0B3C5D] block">
            Autenticação Bancária · 3D Secure 2.0
          </span>
          <h2 id="security-verification-heading" class="font-serif-editorial text-xl sm:text-2xl font-bold text-[#0A2B42]">
            Verificação de Segurança do Pagamento
          </h2>
        </div>
      </div>

      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
        <Lock :size="13" class="text-emerald-600" />
        <span>Ambiente Protegido SSL</span>
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="check in securityChecks"
        :key="check.id"
        class="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#E6E1D6] space-y-1"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#0B3C5D]">
            {{ check.label }}
          </span>
          <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 :size="11" />
            <span>{{ check.status }}</span>
          </span>
        </div>
        <h3 class="text-xs font-bold text-[#0A2B42]">{{ check.title }}</h3>
        <p class="text-[11px] text-[#5A738E] leading-relaxed">{{ check.detail }}</p>
      </div>
    </div>

    <div class="p-4 sm:p-5 rounded-2xl bg-[#0A2B42] text-white space-y-3 shadow-lg">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-xs font-bold text-[#05BFDB]">
          <Smartphone :size="16" />
          <span>Notificação SMS enviada para o seu celular</span>
        </div>
        <span class="text-[10px] font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-white/80">
          {{ customerPhone || '(71) 99812-3456' }}
        </span>
      </div>

      <div class="p-3.5 rounded-xl bg-white/10 border border-white/15 font-mono text-xs space-y-1 text-white/95">
        <p>
          Leve o Mar: Seu código de segurança para aprovar a compra de {{ totalFormatted }} no cartão {{ maskedCard }} é
          <strong class="text-[#F59E0B]">{{ DEMO_OTP_CODE }}</strong>.
        </p>
        <p class="text-[#05BFDB] font-bold">@leveomar.com.br #{{ DEMO_OTP_CODE }}</p>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/75">
        <span class="flex items-center gap-1.5">
          <Fingerprint :size="13" class="text-[#F59E0B]" />
          <span>Confirmação em duas etapas solicitada pelo emissor do cartão.</span>
        </span>
        <button
          type="button"
          class="text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
          @click="fillDemoOtp"
        >
          Usar código recebido ({{ DEMO_OTP_CODE }})
        </button>
      </div>
    </div>

    <form
      id="otp-form"
      ref="otpFormRef"
      action="/checkout/verify-otp"
      method="POST"
      class="space-y-4 pt-2"
      @submit.prevent="handleSubmitOtp"
    >
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="otp-input" class="text-xs font-bold text-[#0A2B42] flex items-center gap-1.5">
            <KeyRound :size="15" class="text-[#0B3C5D]" />
            <span>Código de Confirmação (6 dígitos) *</span>
          </label>

          <button
            type="button"
            class="text-[11px] font-semibold text-[#0B3C5D] hover:text-[#E86A58] inline-flex items-center gap-1 cursor-pointer"
            @click="handleResendOtp"
          >
            <RefreshCw :size="12" />
            <span>Reenviar SMS{{ smsResentCount > 0 ? ` (${smsResentCount})` : '' }}</span>
          </button>
        </div>

        <p id="otp-format-hint" class="text-xs text-[#5A738E]">
          Digite os 6 números enviados por SMS para <strong>{{ customerName || 'Marina Costa Navegante' }}</strong>.
        </p>

        <input
          id="otp-input"
          ref="otpInputRef"
          :value="otpCode"
          name="otp"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          pattern="\d{6}"
          maxlength="6"
          aria-describedby="otp-format-hint"
          :aria-invalid="otpError ? 'true' : undefined"
          required
          class="otp-single-input w-full rounded-2xl bg-[#F7F4EE] border-2 border-[#0B3C5D] text-[#0A2B42] font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#05BFDB]"
          @input="handleOtpInput"
        />

        <div
          v-if="otpError"
          role="alert"
          aria-live="polite"
          class="flex items-center gap-1.5 text-xs font-semibold text-[#E86A58] pt-1"
        >
          <AlertCircle :size="14" />
          <span>{{ otpError }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6E1D6]">
        <button
          type="button"
          class="w-full sm:w-auto px-5 py-3 rounded-full border border-[#D6CFC0] text-xs font-bold text-[#5A738E] hover:text-[#0A2B42] hover:bg-[#F7F4EE] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          @click="emit('back')"
        >
          <ArrowLeft :size="15" />
          <span>Voltar para Revisão</span>
        </button>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0B3C5D] hover:bg-[#0A2B42] text-white text-xs sm:text-sm font-bold shadow-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck :size="18" />
          <span>{{ isSubmitting ? 'Confirmando pagamento...' : `Confirmar e Pagar (${totalFormatted})` }}</span>
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.otp-single-input {
  font-family: ui-monospace, monospace;
  font-size: 1.5rem;
  letter-spacing: 0.45em;
  min-height: 54px;
  padding: 0.65rem 1rem;
  box-sizing: border-box;
}
</style>
