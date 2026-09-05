<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import { User as UserIcon, Mail, Phone, Lock, ArrowRight, Compass } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const cpf = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleRegister() {
  if (!name.value || !email.value) return
  isLoading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      phone: phone.value,
      cpf: cpf.value
    })
    router.push('/conta')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader />

    <main class="flex-grow flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-lg bg-white border border-[#E6E1D6] rounded-3xl p-8 md:p-10 shadow-xl">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0A2B42] text-white mb-4 shadow-sm">
            <Compass :size="24" />
          </div>
          <h1 class="text-3xl font-serif font-bold text-[#0A2B42]">Novo Colecionador</h1>
          <p class="text-sm text-[#4F6D7A] mt-2">
            Inicie seu passaporte marítimo e guarde fragmentos do oceano brasileiro.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
              Nome Completo
            </label>
            <div class="relative">
              <UserIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
              <input
                v-model="name"
                type="text"
                required
                placeholder="Seu nome completo"
                class="w-full pl-11 pr-4 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
              E-mail
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                class="w-full pl-11 pr-4 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
                Telefone
              </label>
              <div class="relative">
                <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="16" />
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  class="w-full pl-10 pr-3 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
                CPF
              </label>
              <input
                v-model="cpf"
                type="text"
                placeholder="000.000.000-00"
                class="w-full px-4 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
              Criar Senha
            </label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
              <input
                v-model="password"
                type="password"
                required
                placeholder="Mínimo de 6 caracteres"
                class="w-full pl-11 pr-4 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0A2B42] text-white font-medium hover:bg-[#144272] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
          >
            <span>{{ isLoading ? 'Criando conta...' : 'Concluir Cadastro & Embarcar' }}</span>
            <ArrowRight :size="16" />
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-[#4F6D7A]">
          <span>Já faz parte do nosso porto? </span>
          <RouterLink to="/login" class="text-[#0A2B42] font-semibold underline underline-offset-4 hover:text-[#05BFDB]">
            Entrar
          </RouterLink>
        </div>
      </div>
    </main>

    <FooterNavigation />
  </div>
</template>
