<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  initialMode?: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
  initialMode: 'login'
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const authStore = useAuthStore()

const currentMode = ref<'login' | 'register'>('login')
const isLoading = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPhone = ref('')
const registerCpf = ref('')
const registerPassword = ref('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      currentMode.value = props.initialMode
    }
  }
)

async function handleLogin() {
  if (!loginEmail.value) return
  isLoading.value = true
  try {
    await authStore.login(loginEmail.value, loginPassword.value)
    emit('success')
    emit('close')
  } finally {
    isLoading.value = false
  }
}

async function handleDemoLogin() {
  isLoading.value = true
  try {
    await authStore.loginAsDemo()
    emit('success')
    emit('close')
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  if (!registerName.value || !registerEmail.value) return
  isLoading.value = true
  try {
    await authStore.register({
      name: registerName.value,
      email: registerEmail.value,
      phone: registerPhone.value,
      cpf: registerCpf.value
    })
    emit('success')
    emit('close')
  } finally {
    isLoading.value = false
  }
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
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-[#0A2B42]/60 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
      <div
        class="relative w-full max-w-lg my-auto max-h-[calc(100dvh-2rem)] flex flex-col bg-[#F7F4EE] border border-[#E6E1D6] rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          type="button"
          aria-label="Fechar modal"
          class="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-[#4F6D7A] hover:text-[#0A2B42] hover:bg-[#EAE5D9] transition-colors z-10 cursor-pointer"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>

        <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-7 sm:pb-3 text-center flex-shrink-0">
          <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0A2B42] text-[#F7F4EE] mb-2 sm:mb-3 shadow-sm">
            <Compass :size="22" />
          </div>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#0A2B42]">
            O Farol do Colecionador
          </h2>
          <p class="text-xs sm:text-sm text-[#4F6D7A] mt-0.5">
            Acesse suas garrafas, rastreie expedições e explore o litoral brasileiro.
          </p>
        </div>

        <div class="px-6 sm:px-8 py-1.5 flex-shrink-0">
          <div class="grid grid-cols-2 p-1 bg-[#EAE5D9] rounded-2xl">
            <button
              type="button"
              class="py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              :class="
                currentMode === 'login'
                  ? 'bg-white text-[#0A2B42] shadow-sm'
                  : 'text-[#4F6D7A] hover:text-[#0A2B42]'
              "
              @click="currentMode = 'login'"
            >
              Entrar
            </button>
            <button
              type="button"
              class="py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              :class="
                currentMode === 'register'
                  ? 'bg-white text-[#0A2B42] shadow-sm'
                  : 'text-[#4F6D7A] hover:text-[#0A2B42]'
              "
              @click="currentMode = 'register'"
            >
              Criar Conta
            </button>
          </div>
        </div>

        <div class="px-6 py-4 sm:px-8 sm:py-5 overflow-y-auto flex-grow">
          <form v-if="currentMode === 'login'" class="space-y-3.5" @submit.prevent="handleLogin">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                E-mail Cadastrado
              </label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
                <input
                  v-model="loginEmail"
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  class="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                Senha de Acesso
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
                <input
                  v-model="loginPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full mt-1 py-3 sm:py-3.5 px-6 rounded-xl bg-[#0A2B42] text-white font-medium hover:bg-[#144272] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer text-xs sm:text-sm"
            >
              <span>{{ isLoading ? 'Navegando...' : 'Acessar Minha Coleção' }}</span>
              <ArrowRight :size="16" />
            </button>

            <div class="relative my-3 sm:my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-[#D9D3C7]"></div>
              </div>
              <div class="relative flex justify-center text-[11px] sm:text-xs">
                <span class="px-3 bg-[#F7F4EE] text-[#4F6D7A] font-medium">ou teste instantaneamente</span>
              </div>
            </div>

            <button
              type="button"
              class="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-[#0A2B42] text-[#0A2B42] hover:bg-[#0A2B42] hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              @click="handleDemoLogin"
            >
              <ShieldCheck :size="16" />
              <span>Acesso Rápido com Conta Demo (Heder David)</span>
            </button>
          </form>

          <form v-else class="space-y-3" @submit.prevent="handleRegister">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                Nome Completo
              </label>
              <div class="relative">
                <UserIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
                <input
                  v-model="registerName"
                  type="text"
                  required
                  placeholder="Nome do Colecionador"
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                E-mail
              </label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
                <input
                  v-model="registerEmail"
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                  Telefone
                </label>
                <div class="relative">
                  <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="16" />
                  <input
                    v-model="registerPhone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    class="w-full pl-10 pr-3 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                  CPF
                </label>
                <input
                  v-model="registerCpf"
                  type="text"
                  placeholder="000.000.000-00"
                  class="w-full px-3 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1">
                Criar Senha
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
                <input
                  v-model="registerPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full mt-1 py-3 sm:py-3.5 px-6 rounded-xl bg-[#0A2B42] text-white font-medium hover:bg-[#144272] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer text-xs sm:text-sm"
            >
              <span>{{ isLoading ? 'Registrando...' : 'Criar Perfil de Colecionador' }}</span>
              <ArrowRight :size="16" />
            </button>
          </form>
        </div>

        <div class="px-6 py-3 sm:px-8 sm:py-3.5 bg-[#EAE5D9]/60 border-t border-[#E6E1D6] flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#4F6D7A] flex-shrink-0">
          <CheckCircle2 :size="14" class="text-[#05BFDB]" />
          <span>Seus dados de expedição e certificados protegidos com segurança</span>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>
