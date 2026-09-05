import type { Order } from '@/types/order'
import { mockProducts } from './products'

export const mockOrders: Order[] = [
  {
    id: 'order-101',
    orderNumber: 'LOM-849201',
    trackingCode: 'LOM-BR-849201BR',
    customer: {
      name: 'Heder Moreira David',
      email: 'heder@leveomar.com.br',
      phone: '(77) 99876-5432',
      cpf: '123.456.789-00'
    },
    shippingAddress: {
      cep: '45000-000',
      street: 'Avenida Beira Mar',
      number: '1042',
      complement: 'Apto 302',
      neighborhood: 'Praia Nobre',
      city: 'Vitória da Conquista',
      state: 'BA'
    },
    items: [
      {
        id: 'item-101-1',
        product: mockProducts[0]!,
        quantity: 1,
        customization: {
          dedicationText: 'Para quem carrega a calmaria das marés no peito.',
          glassType: 'Vidro Borossilicato Lapidado',
          corkType: 'Rolha de Cortiça com Lacre de Cera Naval Dourada',
          waxSealColor: '#D4AF37'
        },
        addedAt: '2025-02-28T14:30:00Z'
      }
    ],
    shippingOption: {
      id: 'sedex-expresso',
      name: 'Sedex Expresso Brisa',
      carrier: 'Sedex Direto com Embalagem Antichoque',
      price: 42.5,
      estimatedDays: 2,
      isFragileProtected: true
    },
    paymentMethod: 'CREDIT_CARD',
    subtotal: 89.9,
    shippingTotal: 42.5,
    discount: 0,
    total: 132.4,
    status: 'SHIPPED',
    createdAt: '2025-03-01T10:15:00Z',
    estimatedDeliveryDate: '2025-03-06T18:00:00Z',
    trackingEvents: [
      {
        phase: 'WATER_COLLECTION',
        title: 'Coleta nas Coordenadas Naturais',
        description: 'Amostra de 500ml colhida na maré baixa nas Galés de Maragogi (-9.0122, -35.2225).',
        location: 'Maragogi, AL',
        coordinates: { lat: -9.0122, lng: -35.2225 },
        timestamp: '01/03/2025 às 06:30',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'PURIFICATION_BOTTLING',
        title: 'Microfiltragem & Preservação Mineral',
        description: 'Processo de purificação biológica em microporos que preserva os sais naturais e transparência.',
        location: 'Ateliê Costeiro Leve o Mar, Recife - PE',
        timestamp: '02/03/2025 às 11:20',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'SEALING_CALLIGRAPHY',
        title: 'Caligrafia Afetiva & Lacre Naval',
        description: 'Rótulo manuscrito com a dedicatória solicitada e aplicação do lacre em cera naval dourada.',
        location: 'Ateliê Costeiro Leve o Mar, Recife - PE',
        timestamp: '02/03/2025 às 16:45',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'SECURE_PACKAGING',
        title: 'Embalagem Antichoque & Certificação',
        description: 'Garrafa acomodada no ninho de papel colmeia marinho com seguro de transporte de vidro ativado.',
        location: 'Centro de Expedição Costeira, Salvador - BA',
        timestamp: '03/03/2025 às 08:10',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'TRANSIT',
        title: 'Em Rota para o Destino',
        description: 'Carga frágil em trânsito com monitoramento térmico e de vibração.',
        location: 'Unidade de Tratamento, Feira de Santana - BA',
        timestamp: '03/03/2025 às 19:40',
        isCompleted: false,
        isCurrent: true
      },
      {
        phase: 'DELIVERED',
        title: 'Chegada ao Seu Porto',
        description: 'Entrega final ao colecionador no endereço cadastrado.',
        location: 'Vitória da Conquista, BA',
        timestamp: 'Previsão: 06/03/2025',
        isCompleted: false,
        isCurrent: false
      }
    ],
    certificates: [
      {
        id: 'cert-101-1',
        certificateNumber: 'CERT-2025-AL-0428',
        beachName: 'Maragogi',
        state: 'Alagoas',
        coordinates: { lat: -9.0122, lng: -35.2225 },
        collectionDate: '01 de Março de 2025',
        batchNumber: 'LOTE-2025/AL-06',
        waterTone: 'Turquesa Galés Translúcido',
        tideCondition: 'Maré Baixa 0.2m (Lua Nova)',
        dedicationText: 'Para quem carrega a calmaria das marés no peito.',
        curatorSignature: 'Cap. Gabriel Valente - Curadoria Marítima Leve o Mar'
      }
    ]
  },
  {
    id: 'order-102',
    orderNumber: 'LOM-572190',
    trackingCode: 'LOM-BR-572190BR',
    customer: {
      name: 'Heder Moreira David',
      email: 'heder@leveomar.com.br',
      phone: '(77) 99876-5432',
      cpf: '123.456.789-00'
    },
    shippingAddress: {
      cep: '45000-000',
      street: 'Avenida Beira Mar',
      number: '1042',
      complement: 'Apto 302',
      neighborhood: 'Praia Nobre',
      city: 'Vitória da Conquista',
      state: 'BA'
    },
    items: [
      {
        id: 'item-102-1',
        product: mockProducts[2] || mockProducts[1]!,
        quantity: 1,
        customization: {
          dedicationText: 'Lembrança eterna do santuário de águas profundas.',
          glassType: 'Vidro Cristalino Lapidado',
          corkType: 'Rolha de Cortiça Natural Selada'
        },
        addedAt: '2025-01-15T09:00:00Z'
      }
    ],
    shippingOption: {
      id: 'pac-seguro',
      name: 'Entrega Padrão Marítima (PAC Protegido)',
      carrier: 'Correios com Seguro Vidro',
      price: 24.9,
      estimatedDays: 6,
      isFragileProtected: true
    },
    paymentMethod: 'PIX',
    subtotal: 94.9,
    shippingTotal: 24.9,
    discount: 10.0,
    total: 109.8,
    status: 'DELIVERED',
    createdAt: '2025-01-15T09:25:00Z',
    estimatedDeliveryDate: '2025-01-21T16:00:00Z',
    trackingEvents: [
      {
        phase: 'WATER_COLLECTION',
        title: 'Coleta nas Coordenadas Naturais',
        description: 'Água pura coletada sob autorização ambiental na Baía do Sancho (-3.8536, -32.4439).',
        location: 'Fernando de Noronha, PE',
        coordinates: { lat: -3.8536, lng: -32.4439 },
        timestamp: '15/01/2025 às 07:00',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'PURIFICATION_BOTTLING',
        title: 'Microfiltragem & Preservação Mineral',
        description: 'Filtragem por membranas com retenção biológica e equilíbrio salino.',
        location: 'Ateliê Costeiro Leve o Mar, Recife - PE',
        timestamp: '16/01/2025 às 10:00',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'SEALING_CALLIGRAPHY',
        title: 'Caligrafia Afetiva & Lacre Naval',
        description: 'Gravação da dedicatória e aplicação da rolha de cortiça sustentável.',
        location: 'Ateliê Costeiro Leve o Mar, Recife - PE',
        timestamp: '16/01/2025 às 15:30',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'SECURE_PACKAGING',
        title: 'Embalagem Antichoque & Certificação',
        description: 'Embalada com proteção dupla de papel kraft expandido.',
        location: 'Centro de Expedição, Recife - PE',
        timestamp: '17/01/2025 às 09:00',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'TRANSIT',
        title: 'Transporte Aéreo & Terrestre',
        description: 'Voo operado com destino à base de distribuição da Bahia.',
        location: 'Salvador - BA',
        timestamp: '19/01/2025 às 14:20',
        isCompleted: true,
        isCurrent: false
      },
      {
        phase: 'DELIVERED',
        title: 'Entregue ao Colecionador',
        description: 'Garrafa entregue em perfeitas condições. Agradecemos por levar o mar.',
        location: 'Vitória da Conquista, BA',
        timestamp: '21/01/2025 às 15:40',
        isCompleted: true,
        isCurrent: true
      }
    ],
    certificates: [
      {
        id: 'cert-102-1',
        certificateNumber: 'CERT-2025-FN-0112',
        beachName: mockProducts[2]?.beachName || 'Baía do Sancho',
        state: 'Pernambuco',
        coordinates: { lat: -3.8536, lng: -32.4439 },
        collectionDate: '15 de Janeiro de 2025',
        batchNumber: 'LOTE-2025/FN-02',
        waterTone: 'Verde Esmeralda Oceânico',
        tideCondition: 'Maré Alta 1.8m (Lua Crescente)',
        dedicationText: 'Lembrança eterna do santuário de águas profundas.',
        curatorSignature: 'Dra. Marina Castro - Biologia Marinha Leve o Mar'
      }
    ]
  }
]
