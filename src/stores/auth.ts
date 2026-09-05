import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { User } from '@/types/auth'
import { authService, demoUser } from '@/services/authService'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('leve-o-mar:auth-user', null)
  const token = useLocalStorage<string | null>('leve-o-mar:auth-token', null)

  const isAuthenticated = computed(() => {
    return !!user.value && typeof user.value?.name === 'string' && user.value.name.length > 0 && !!token.value
  })

  const userFirstName = computed(() => {
    if (!user.value?.name) return 'Colecionador'
    return user.value.name.trim().split(' ')[0] || 'Colecionador'
  })

  async function login(email: string, password?: string) {
    try {
      const loggedUser = await authService.login(email, password)
      user.value = loggedUser
      token.value = `token-${Date.now()}`
      toast.success(`Bem-vindo a bordo, ${loggedUser.name}!`)
      return loggedUser
    } catch {
      toast.error('Falha ao autenticar. Verifique seus dados.')
      throw new Error('Falha no login')
    }
  }

  async function loginAsDemo() {
    try {
      const loggedUser = await authService.getDemoUser()
      user.value = loggedUser
      token.value = `demo-token-${Date.now()}`
      toast.success(`Sessão iniciada como ${loggedUser.name}`)
      return loggedUser
    } catch {
      toast.error('Não foi possível entrar no modo de demonstração.')
    }
  }

  async function register(payload: { name: string; email: string; phone?: string; cpf?: string }) {
    try {
      const newUser = await authService.register(payload)
      user.value = newUser
      token.value = `token-${Date.now()}`
      toast.success(`Conta criada com sucesso! Bem-vindo, ${newUser.name}.`)
      return newUser
    } catch {
      toast.error('Não foi possível criar sua conta.')
      throw new Error('Falha no cadastro')
    }
  }

  function logout() {
    user.value = null
    token.value = null
    toast.info('Sessão encerrada com segurança.')
  }

  function updateProfile(data: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...data }
      toast.success('Perfil atualizado com sucesso.')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userFirstName,
    login,
    loginAsDemo,
    register,
    logout,
    updateProfile
  }
})
