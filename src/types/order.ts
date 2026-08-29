import type { CartItem, ShippingOption } from './cart'

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO'

export interface CustomerAddress {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  cpf: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: CustomerInfo
  shippingAddress: CustomerAddress
  items: CartItem[]
  shippingOption: ShippingOption
  paymentMethod: PaymentMethod
  subtotal: number
  shippingTotal: number
  discount: number
  total: number
  status: 'PENDING' | 'PAID' | 'PREPARING_BOTTLE' | 'SHIPPED' | 'DELIVERED'
  createdAt: string
  qrCodePix?: string
}
