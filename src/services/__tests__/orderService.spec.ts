import { describe, it, expect, vi, beforeEach } from 'vitest'
import { orderService } from '../orderService'
import type { Order } from '@/types/order'
import { mockProducts } from '@/mocks/products'

describe('orderService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('calculateShipping and lookupShippingAndAddress', () => {
    it('dispara erro para CEPs com tamanho diferente de 8 dígitos', async () => {
      await expect(orderService.calculateShipping('123')).rejects.toThrow('CEP inválido')
      await expect(orderService.lookupShippingAndAddress('123456789')).rejects.toThrow('CEP inválido')
    })

    it('calcula frete para região Sudeste com proteção contra quebra', async () => {
      // Mock global fetch para simular retorno da API ViaCEP
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cep: '01310-100',
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          uf: 'SP'
        })
      } as Response)

      const result = await orderService.lookupShippingAndAddress('01310-100')

      expect(result.address.city).toBe('São Paulo')
      expect(result.address.state).toBe('SP')
      expect(result.options.length).toBeGreaterThanOrEqual(3)

      const pac = result.options.find((o) => o.id === 'pac-seguro')
      expect(pac).toBeDefined()
      expect(pac?.isFragileProtected).toBe(true)
      expect(pac?.price).toBe(18.9)
    })

    it('calcula frete para região Nordeste', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cep: '40020-000',
          logradouro: 'Praça da Sé',
          bairro: 'Centro Histórico',
          localidade: 'Salvador',
          uf: 'BA'
        })
      } as Response)

      const result = await orderService.lookupShippingAndAddress('40020-000')

      expect(result.address.city).toBe('Salvador')
      expect(result.address.state).toBe('BA')

      const pac = result.options.find((o) => o.id === 'pac-seguro')
      expect(pac).toBeDefined()
      expect(pac?.price).toBe(29.9)
    })

    it('utiliza estimativa regional de fallback se a requisição à API falhar', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'))

      const result = await orderService.lookupShippingAndAddress('01001-000')

      expect(result.address.state).toBe('SP')
      expect(result.options.length).toBeGreaterThan(0)
    })
  })

  describe('createOrder', () => {
    it('cria pedido com eventos de rastreio e certificados de autenticidade', async () => {
      const payload: Parameters<typeof orderService.createOrder>[0] = {
        items: [
          {
            id: 'item-1',
            product: mockProducts[0]!,
            quantity: 1,
            addedAt: new Date().toISOString()
          }
        ],
        subtotal: mockProducts[0]!.price,
        shippingOption: {
          id: 'pac-seguro',
          name: 'PAC Protegido',
          carrier: 'Correios',
          price: 18.9,
          estimatedDays: 4,
          isFragileProtected: true
        },
        shippingTotal: 18.9,
        discount: 0,
        total: mockProducts[0]!.price + 18.9,
        paymentMethod: 'PIX',
        customer: {
          name: 'Mariana Silva',
          email: 'mariana@example.com',
          phone: '(11) 98888-7777',
          cpf: '123.456.789-00'
        },
        shippingAddress: {
          cep: '01310-100',
          street: 'Av Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP'
        }
      }

      const order = await orderService.createOrder(payload)

      expect(order.id).toBeDefined()
      expect(order.orderNumber).toMatch(/^LOM-\d+$/)
      expect(order.trackingCode).toMatch(/^LOM-BR-\d+BR$/)
      expect(order.status).toBe('PAID')
      expect(order.trackingEvents.length).toBe(6)
      expect(order.certificates.length).toBe(1)
      expect(order.certificates[0]?.curatorSignature).toContain('Leve o Mar')
    })
  })
})
