export interface User {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
