import type { User } from '@/types/auth'
import { delay } from './delay'

export const demoUser: User = {
  id: 'user-demo-123',
  name: 'Marina Costa Navegante',
  email: 'marina.navegante@exemplo.com.br',
  phone: '(71) 99812-3456',
  cpf: '111.222.333-44',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-01-10T00:00:00Z',
  collectorTier: 'Navegador da Costa',
  beachesCount: 2,
  badges: [
    {
      id: 'badge-1',
      title: 'Primeira Garrafa',
      description: 'Iniciou a jornada arquivando as águas do litoral brasileiro.',
      category: 'TIME_COLLECTOR',
      unlockedAt: '15/01/2025'
    },
    {
      id: 'badge-2',
      title: 'Mares Cristalinos',
      description: 'Colecionou águas de piscinas naturais e santuários ecológicos.',
      category: 'WATER_TYPES',
      unlockedAt: '01/03/2025'
    },
    {
      id: 'badge-3',
      title: 'Explorador do Nordeste',
      description: 'Garrafas colecionadas em mais de um estado nordestino.',
      category: 'REGIONS',
      unlockedAt: '01/03/2025'
    }
  ],
  addresses: [
    {
      id: 'addr-1',
      label: 'Residência Principal',
      isDefault: true,
      cep: '40140-130',
      street: 'Avenida Oceânica',
      number: '240',
      complement: 'Apto 502',
      neighborhood: 'Barra',
      city: 'Salvador',
      state: 'BA'
    },
    {
      id: 'addr-2',
      label: 'Casa de Veraneio',
      isDefault: false,
      cep: '45810-000',
      street: 'Rua do Farol Antigo',
      number: '88',
      complement: 'Casa',
      neighborhood: 'Centro Histórico',
      city: 'Porto Seguro',
      state: 'BA'
    }
  ]
}

export const authService = {
  async getDemoUser(): Promise<User> {
    await delay(150)
    return { ...demoUser }
  },

  async login(email: string, password?: string): Promise<User> {
    await delay(300)
    if (email === demoUser.email || email.includes('demo') || email.includes('heder')) {
      return { ...demoUser }
    }

    return {
      id: `user-${Date.now()}`,
      name: email.split('@')[0]?.replace(/[._]/g, ' ') || 'Colecionador do Mar',
      email,
      phone: '(11) 98765-4321',
      cpf: '000.000.000-00',
      createdAt: new Date().toISOString(),
      collectorTier: 'Explorador da Areia',
      beachesCount: 0,
      badges: [
        {
          id: 'badge-new',
          title: 'Primeiro Embarque',
          description: 'Bem-vindo ao porto de memórias do Leve o Mar.',
          category: 'TIME_COLLECTOR',
          unlockedAt: new Date().toLocaleDateString('pt-BR')
        }
      ],
      addresses: []
    }
  },

  async register(userData: { name: string; email: string; phone?: string; cpf?: string }): Promise<User> {
    await delay(350)
    return {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      cpf: userData.cpf,
      createdAt: new Date().toISOString(),
      collectorTier: 'Explorador da Areia',
      beachesCount: 0,
      badges: [
        {
          id: 'badge-reg',
          title: 'Primeiro Embarque',
          description: 'Bem-vindo ao porto de memórias do Leve o Mar.',
          category: 'TIME_COLLECTOR',
          unlockedAt: new Date().toLocaleDateString('pt-BR')
        }
      ],
      addresses: []
    }
  }
}
