<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import FooterNavigation from '@/components/layout/FooterNavigation.vue'
import { Mail, Lock, ArrowRight, ShieldCheck, Compass } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value) return
  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    const target = (route.query.redirect as string) || '/conta'
    router.push(target)
  } finally {
    isLoading.value = false
  }
}

async function handleDemoLogin() {
  isLoading.value = true
  try {
    await authStore.loginAsDemo()
    const target = (route.query.redirect as string) || '/conta'
    router.push(target)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F7F4EE] text-[#0A2B42]">
    <NavbarHeader />

    <main class="flex-grow flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md bg-white border border-[#E6E1D6] rounded-3xl p-8 md:p-10 shadow-xl">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0A2B42] text-white mb-4 shadow-sm">
            <Compass :size="24" />
          </div>
          <h1 class="text-3xl font-serif font-bold text-[#0A2B42]">Entrar no Farol</h1>
          <p class="text-sm text-[#4F6D7A] mt-2">
            Acesse seus pedidos, acompanhe coletas e veja seus certificados de autenticidade.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
              E-mail do Colecionador
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

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#0A2B42] mb-1.5">
              Senha
            </label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6D7A]" :size="18" />
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-sm text-[#0A2B42] placeholder-[#8A9BA8] focus:outline-none focus:border-[#0A2B42] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0A2B42] text-white font-medium hover:bg-[#144272] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
          >
            <span>{{ isLoading ? 'Navegando...' : 'Entrar na Minha Conta' }}</span>
            <ArrowRight :size="16" />
          </button>

          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[#E6E1D6]"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 bg-white text-[#4F6D7A] font-medium">ou teste direto</span>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-3 px-4 rounded-xl border border-[#0A2B42] text-[#0A2B42] hover:bg-[#0A2B42] hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            @click="handleDemoLogin"
          >
            <ShieldCheck :size="16" />
            <span>Entrar como Colecionador Demo</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-[#4F6D7A]">
          <span>Ainda não possui garrafas catalogadas? </span>
          <RouterLink to="/cadastro" class="text-[#0A2B42] font-semibold underline underline-offset-4 hover:text-[#05BFDB]">
            Criar conta
          </RouterLink>
        </div>
      </div>
    </main>

    <FooterNavigation />
  </div>
</template>
