import type { ShippingOption } from '@/types/cart'
import type { Order } from '@/types/order'
import { delay } from './delay'

export const orderService = {
  async calculateShipping(cep: string): Promise<ShippingOption[]> {
    await delay(350)
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. Digite 8 dígitos.')
    }

    return [
      {
        id: 'pac-seguro',
        name: 'Entrega Padrão Marítima (PAC Protegido)',
        carrier: 'Correios com Seguro Vidro',
        price: 24.9,
        estimatedDays: 6,
        isFragileProtected: true
      },
      {
        id: 'sedex-expresso',
        name: 'Sedex Expresso Brisa',
        carrier: 'Sedex Direto com Embalagem Antichoque',
        price: 42.5,
        estimatedDays: 2,
        isFragileProtected: true
      },
      {
        id: 'loggi-eco',
        name: 'Transportadora Especial Frágil Eco',
        carrier: 'Jadlog / Loggi Blue',
        price: 31.0,
        estimatedDays: 4,
        isFragileProtected: true
      }
    ]
  },

  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>): Promise<Order> {
    await delay(500)
    const orderNumber = `LOM-${Math.floor(100000 + Math.random() * 900000)}`

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      qrCodePix:
        '00020126360014BR.GOV.BCB.PIX0114+55779999999995204000053039865404189.905802BR5910LEVE O MAR6009VITORIA DA62070503***6304ABCD',
      ...orderPayload
    }

    return newOrder
  }
}
