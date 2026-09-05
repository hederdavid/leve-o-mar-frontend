import type { ShippingOption } from '@/types/cart'
import type { Order, BottleCertificate, TrackingEvent } from '@/types/order'
import { delay } from './delay'

export interface ShippingAddressInfo {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
}

export interface ShippingCalculationResult {
  address: ShippingAddressInfo
  options: ShippingOption[]
}

function getRegionFromUf(uf: string): 'sudeste' | 'sul' | 'centro-oeste' | 'nordeste' | 'norte' {
  const cleanUf = uf.toUpperCase()
  if (['SP', 'RJ', 'MG', 'ES'].includes(cleanUf)) return 'sudeste'
  if (['PR', 'SC', 'RS'].includes(cleanUf)) return 'sul'
  if (['DF', 'GO', 'MT', 'MS'].includes(cleanUf)) return 'centro-oeste'
  if (['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(cleanUf)) return 'nordeste'
  return 'norte'
}

function estimateUfFromCepPrefix(cleanCep: string): string {
  const prefix = parseInt(cleanCep.substring(0, 2), 10)
  if (prefix >= 1 && prefix <= 19) return 'SP'
  if (prefix >= 20 && prefix <= 28) return 'RJ'
  if (prefix === 29) return 'ES'
  if (prefix >= 30 && prefix <= 39) return 'MG'
  if (prefix >= 40 && prefix <= 48) return 'BA'
  if (prefix === 49) return 'SE'
  if (prefix >= 50 && prefix <= 56) return 'PE'
  if (prefix === 57) return 'AL'
  if (prefix === 58) return 'PB'
  if (prefix === 59) return 'RN'
  if (prefix >= 60 && prefix <= 63) return 'CE'
  if (prefix === 64) return 'PI'
  if (prefix === 65) return 'MA'
  if (prefix >= 66 && prefix <= 68) return 'PA'
  if (prefix === 69) return 'AM'
  if (prefix >= 70 && prefix <= 73) return 'DF'
  if (prefix >= 74 && prefix <= 76) return 'GO'
  if (prefix === 77) return 'TO'
  if (prefix === 78) return 'MT'
  if (prefix === 79) return 'MS'
  if (prefix >= 80 && prefix <= 87) return 'PR'
  if (prefix >= 88 && prefix <= 89) return 'SC'
  if (prefix >= 90 && prefix <= 99) return 'RS'
  return 'SP'
}

function buildShippingOptions(uf: string): ShippingOption[] {
  const region = getRegionFromUf(uf)

  switch (region) {
    case 'sudeste':
      return [
        {
          id: 'pac-seguro',
          name: 'Entrega Padrão Marítima (PAC Protegido)',
          carrier: 'Correios com Seguro Vidro',
          price: 18.9,
          estimatedDays: 4,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Sedex Expresso Brisa',
          carrier: 'Sedex Direto com Embalagem Antichoque',
          price: 32.5,
          estimatedDays: 2,
          isFragileProtected: true
        },
        {
          id: 'loggi-eco',
          name: 'Transportadora Especial Frágil Eco',
          carrier: 'Jadlog Blue Antichoque',
          price: 24.9,
          estimatedDays: 3,
          isFragileProtected: true
        }
      ]
    case 'sul':
      return [
        {
          id: 'pac-seguro',
          name: 'Entrega Padrão Marítima (PAC Protegido)',
          carrier: 'Correios com Seguro Vidro',
          price: 23.9,
          estimatedDays: 5,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Sedex Expresso Brisa',
          carrier: 'Sedex Direto com Embalagem Antichoque',
          price: 38.9,
          estimatedDays: 2,
          isFragileProtected: true
        },
        {
          id: 'loggi-eco',
          name: 'Transportadora Especial Frágil Eco',
          carrier: 'Jadlog Blue Antichoque',
          price: 28.5,
          estimatedDays: 4,
          isFragileProtected: true
        }
      ]
    case 'centro-oeste':
      return [
        {
          id: 'pac-seguro',
          name: 'Entrega Padrão Marítima (PAC Protegido)',
          carrier: 'Correios com Seguro Vidro',
          price: 27.9,
          estimatedDays: 6,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Sedex Expresso Brisa',
          carrier: 'Sedex Direto com Embalagem Antichoque',
          price: 44.9,
          estimatedDays: 3,
          isFragileProtected: true
        },
        {
          id: 'loggi-eco',
          name: 'Transportadora Especial Frágil Eco',
          carrier: 'Jadlog Blue Antichoque',
          price: 33.9,
          estimatedDays: 5,
          isFragileProtected: true
        }
      ]
    case 'nordeste':
      return [
        {
          id: 'pac-seguro',
          name: 'Entrega Padrão Marítima (PAC Protegido)',
          carrier: 'Correios com Seguro Vidro',
          price: 29.9,
          estimatedDays: 7,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Sedex Expresso Brisa',
          carrier: 'Sedex Direto com Embalagem Antichoque',
          price: 49.9,
          estimatedDays: 3,
          isFragileProtected: true
        },
        {
          id: 'loggi-eco',
          name: 'Transportadora Especial Frágil Eco',
          carrier: 'Jadlog Blue Antichoque',
          price: 36.5,
          estimatedDays: 5,
          isFragileProtected: true
        }
      ]
    case 'norte':
    default:
      return [
        {
          id: 'pac-seguro',
          name: 'Entrega Padrão Marítima (PAC Protegido)',
          carrier: 'Correios com Seguro Vidro',
          price: 36.9,
          estimatedDays: 9,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Sedex Expresso Brisa',
          carrier: 'Sedex Direto com Embalagem Antichoque',
          price: 62.9,
          estimatedDays: 4,
          isFragileProtected: true
        },
        {
          id: 'loggi-eco',
          name: 'Transportadora Especial Frágil Eco',
          carrier: 'Jadlog Blue Antichoque',
          price: 45.0,
          estimatedDays: 6,
          isFragileProtected: true
        }
      ]
  }
}

export const orderService = {
  async lookupShippingAndAddress(cep: string): Promise<ShippingCalculationResult> {
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. Por favor, digite 8 números.')
    }

    let addressInfo: ShippingAddressInfo = {
      cep: `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`,
      street: '',
      neighborhood: '',
      city: '',
      state: estimateUfFromCepPrefix(cleanCep)
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = (await response.json()) as {
          cep?: string
          logradouro?: string
          bairro?: string
          localidade?: string
          uf?: string
          erro?: boolean | string
        }

        if (data.erro === true || data.erro === 'true') {
          throw new Error('CEP não localizado nas agências postais. Verifique o número informado.')
        }

        addressInfo = {
          cep: data.cep || addressInfo.cep,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || 'Sua Cidade',
          state: data.uf || addressInfo.state
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('CEP não localizado')) {
        throw err
      }
      // Se a requisição de rede falhar (ex: offline ou timeout), segue com estimativa regional resiliente
      if (!addressInfo.city) {
        addressInfo.city = 'Sua Região'
      }
    }

    const options = buildShippingOptions(addressInfo.state)

    return {
      address: addressInfo,
      options
    }
  },

  async calculateShipping(cep: string): Promise<ShippingOption[]> {
    const result = await this.lookupShippingAndAddress(cep)
    return result.options
  },

  async createOrder(
    orderPayload: Omit<Order, 'id' | 'orderNumber' | 'trackingCode' | 'status' | 'createdAt' | 'estimatedDeliveryDate' | 'trackingEvents' | 'certificates'>
  ): Promise<Order> {
    await delay(500)
    const num = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `LOM-${num}`
    const trackingCode = `LOM-BR-${num}BR`
    const now = new Date()
    const deliveryDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()

    const firstProduct = orderPayload.items[0]?.product

    const trackingEvents: TrackingEvent[] = [
      {
        phase: 'WATER_COLLECTION',
        title: 'Coleta nas Coordenadas Naturais',
        description: `Amostra de 500ml arquivada nas coordenadas de ${firstProduct?.beachName || 'Praia Brasileira'}.`,
        location: `${firstProduct?.city || 'Litoral'}, ${firstProduct?.state || 'BR'}`,
        coordinates: firstProduct?.coordinates,
        timestamp: now.toLocaleDateString('pt-BR') + ' às 08:00',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'PURIFICATION_BOTTLING',
        title: 'Microfiltragem & Preservação Mineral',
        description: 'Processo biológico que preserva os minerais marinhos e a cor natural da água.',
        location: 'Ateliê Costeiro Leve o Mar',
        timestamp: now.toLocaleDateString('pt-BR') + ' às 11:30',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'SEALING_CALLIGRAPHY',
        title: 'Caligrafia Afetiva & Lacre Naval',
        description: 'Gravação da dedicatória personalizada e selagem hermética da rolha de cortiça.',
        location: 'Ateliê Costeiro Leve o Mar',
        timestamp: now.toLocaleDateString('pt-BR') + ' às 14:15',
        isCompleted: false,
        isCurrent: true
      },
      {
        phase: 'SECURE_PACKAGING',
        title: 'Embalagem Antichoque & Certificação',
        description: 'Acondicionamento no berço de papel colmeia marinho com seguro ativado.',
        location: 'Centro de Expedição Costeira',
        timestamp: 'Pendente',
        isCompleted: false,
        isCurrent: false
      },
      {
        phase: 'TRANSIT',
        title: 'Em Rota para o Destino',
        description: 'Carga frágil com monitoramento térmico sob os cuidados da transportadora.',
        location: `${orderPayload.shippingOption.carrier}`,
        timestamp: 'Previsão: 2 dias',
        isCompleted: false,
        isCurrent: false
      },
      {
        phase: 'DELIVERED',
        title: 'Chegada ao Seu Porto',
        description: `Entrega final ao colecionador em ${orderPayload.shippingAddress.city} - ${orderPayload.shippingAddress.state}.`,
        location: `${orderPayload.shippingAddress.city} - ${orderPayload.shippingAddress.state}`,
        timestamp: `Previsão: ${new Date(deliveryDate).toLocaleDateString('pt-BR')}`,
        isCompleted: false,
        isCurrent: false
      }
    ]

    const certificates: BottleCertificate[] = orderPayload.items.map((item, idx) => ({
      id: `cert-${Date.now()}-${idx}`,
      certificateNumber: `CERT-${now.getFullYear()}-${item.product.uf || 'BR'}-${num + idx}`,
      beachName: item.product.beachName,
      state: item.product.state,
      coordinates: item.product.coordinates,
      collectionDate: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      batchNumber: `LOTE-${now.getFullYear()}/${item.product.uf || 'BR'}-01`,
      waterTone: item.product.waterType || 'Águas Cristalinas',
      tideCondition: 'Maré Baixa 0.3m (Lua Nova)',
      dedicationText: item.customization?.dedicationText,
      curatorSignature: 'Curadoria Oceanográfica Leve o Mar'
    }))

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      trackingCode,
      status: 'PAID',
      createdAt: now.toISOString(),
      estimatedDeliveryDate: deliveryDate,
      trackingEvents,
      certificates,
      qrCodePix:
        '00020126360014BR.GOV.BCB.PIX0114+55779999999995204000053039865404189.905802BR5910LEVE O MAR6009VITORIA DA62070503***6304ABCD',
      ...orderPayload
    }

    return newOrder
  }
}
