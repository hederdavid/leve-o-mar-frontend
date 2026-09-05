import type { CartItem, ShippingOption } from './cart'

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO'

export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING_BOTTLE' | 'SHIPPED' | 'DELIVERED'

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

export type TrackingPhase =
  | 'WATER_COLLECTION'
  | 'PURIFICATION_BOTTLING'
  | 'SEALING_CALLIGRAPHY'
  | 'SECURE_PACKAGING'
  | 'TRANSIT'
  | 'DELIVERED'

export interface TrackingEvent {
  phase: TrackingPhase
  title: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  timestamp: string
  isCompleted: boolean
  isCurrent: boolean
}

export interface BottleCertificate {
  id: string
  certificateNumber: string
  beachName: string
  state: string
  coordinates: { lat: number; lng: number }
  collectionDate: string
  batchNumber: string
  waterTone: string
  tideCondition: string
  dedicationText?: string
  curatorSignature: string
}

export interface Order {
  id: string
  orderNumber: string
  trackingCode: string
  customer: CustomerInfo
  shippingAddress: CustomerAddress
  items: CartItem[]
  shippingOption: ShippingOption
  paymentMethod: PaymentMethod
  subtotal: number
  shippingTotal: number
  discount: number
  total: number
  status: OrderStatus
  createdAt: string
  estimatedDeliveryDate: string
  qrCodePix?: string
  trackingEvents: TrackingEvent[]
  certificates: BottleCertificate[]
}
