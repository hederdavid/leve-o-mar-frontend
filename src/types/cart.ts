import type { Product } from './product'

export interface CartCustomization {
  giftMessage?: string
  recipientName?: string
  dedicationText?: string
  includeCollectorCertificate?: boolean
  glassType?: string
  fontStyle?: 'serif' | 'cursive' | 'sans'
  corkType?: string
  waxSealColor?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  customization?: CartCustomization
  addedAt: string
}

export interface ShippingOption {
  id: string
  name: string
  carrier: string
  price: number
  estimatedDays: number
  isFragileProtected: boolean
}

export interface CartSummary {
  subtotal: number
  shippingPrice: number
  discount: number
  total: number
  itemCount: number
}
