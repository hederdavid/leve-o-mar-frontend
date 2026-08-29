import type { User } from '@/types/auth'
import { delay } from './delay'

export const demoUser: User = {
  id: 'user-demo-123',
  name: 'Heder Moreira David',
  email: 'heder@leveomar.com.br',
  phone: '(77) 99876-5432',
  cpf: '123.456.789-00',
  createdAt: '2025-01-10T00:00:00Z'
}

export const authService = {
  async getDemoUser(): Promise<User> {
    await delay(150)
    return { ...demoUser }
  },

  async login(email: string): Promise<User> {
    await delay(300)
    return {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'Colecionador do Mar',
      email,
      phone: '(11) 98765-4321',
      cpf: '000.000.000-00',
      createdAt: new Date().toISOString()
    }
  }
}
