import type { CustomerAddress } from './order'

export interface UserBadge {
  id: string
  title: string
  description: string
  category: 'REGIONS' | 'WATER_TYPES' | 'TIME_COLLECTOR'
  unlockedAt: string
}

export interface SavedAddress extends CustomerAddress {
  id: string
  label: string
  isDefault: boolean
}

export type CollectorTier = 'Explorador da Areia' | 'Navegador da Costa' | 'Guardião dos Mares'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  avatarUrl?: string
  createdAt: string
  collectorTier: CollectorTier
  beachesCount: number
  badges: UserBadge[]
  addresses: SavedAddress[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
