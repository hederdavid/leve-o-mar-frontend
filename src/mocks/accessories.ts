import type { Product } from '@/types/product'

export const mockAccessories: Product[] = [
  {
    id: 'acc-suporte-madeira',
    beachId: 'atelie-costeiro',
    beachName: 'Ateliê Costeiro',
    city: 'São Sebastião',
    state: 'São Paulo',
    uf: 'SP',
    region: 'Sudeste',
    waterType: 'Mar Calmo & Cristalino',
    categoryTag: 'ACESSÓRIO DECORATIVO',
    highlightTag: '✦ Madeira Nobre',
    coordinates: { lat: -23.76, lng: -45.41 },
    name: 'Base de Madeira Maciça Entalhada',
    slug: 'base-madeira-macica',
    tagline: 'Base rústica artesanal em madeira nobre de reaproveitamento para apoio estável da garrafa.',
    price: 39.9,
    originalPrice: 49.9,
    volume: '500ml',
    glassFinish: 'Vidro Cristalino Lapidado',
    editionNumber: 'ACC-01',
    totalBatchQuantity: 150,
    stock: 45,
    rating: 4.9,
    reviewCount: 38,
    isLimitedEdition: false,
    isBestSeller: true,
    isNewRelease: false,
    sensoryNotes: {
      top: 'Aroma suave de madeira nobre encerada',
      heart: 'Textura acetinada ao toque',
      base: 'Acabamento impermeabilizante natural'
    },
    sandDetails: {
      origin: 'Ateliê de Marcenaria Náutica',
      color: 'Madeira tom mel natural',
      granulometry: 'Superfície polida à mão',
      collectionDate: '2025'
    },
    story: 'Esculpida em madeira nobre de reaproveitamento, garante que sua garrafa de memórias se torne o centro das atenções na estante.',
    bottleImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    images: {
      primary: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      sensory: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      labelCloseup: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: { heightCm: 3.5, diameterCm: 9.5, weightGrams: 280 }
  },
  {
    id: 'acc-caixa-pinho',
    beachId: 'atelie-costeiro',
    beachName: 'Ateliê Costeiro',
    city: 'Florianópolis',
    state: 'Santa Catarina',
    uf: 'SC',
    region: 'Sul',
    waterType: 'Mar Calmo & Cristalino',
    categoryTag: 'EMBALAGEM DE PRESENTE',
    highlightTag: '✦ Caixa Coletiva',
    coordinates: { lat: -27.59, lng: -48.54 },
    name: 'Caixa Rústica de Pinho com Palha Marinha',
    slug: 'caixa-rustica-pinho',
    tagline: 'Embalagem afetiva de presente em pinho com nó náutico e palha natural de proteção.',
    price: 49.9,
    originalPrice: 65.0,
    volume: '500ml',
    glassFinish: 'Vidro Cristalino Lapidado',
    editionNumber: 'ACC-02',
    totalBatchQuantity: 200,
    stock: 60,
    rating: 5.0,
    reviewCount: 52,
    isLimitedEdition: false,
    isBestSeller: true,
    isNewRelease: false,
    sensoryNotes: {
      top: 'Fragrância rústica de pinho verde',
      heart: 'Palha de coco natural de amortecimento',
      base: 'Fecho em corda náutica de algodão trançado'
    },
    sandDetails: {
      origin: 'Ateliê Sul Náutico',
      color: 'Pinho cru claro',
      granulometry: 'Acabamento rústico lixado',
      collectionDate: '2025'
    },
    story: 'Criada para quem deseja presentear alguém especial com toda a magia de uma garrafa resgatada do mar.',
    bottleImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    images: {
      primary: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      sensory: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      labelCloseup: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: { heightCm: 28.0, diameterCm: 11.0, weightGrams: 420 }
  },
  {
    id: 'acc-base-led',
    beachId: 'atelie-costeiro',
    beachName: 'Ateliê Costeiro',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    uf: 'RJ',
    region: 'Sudeste',
    waterType: 'Mar Calmo & Cristalino',
    categoryTag: 'ILUMINAÇÃO AMBIENTE',
    highlightTag: '✦ Efeito Ondas',
    coordinates: { lat: -22.98, lng: -43.20 },
    name: 'Base Luminária LED Luz Quente',
    slug: 'base-luminaria-led',
    tagline: 'Base iluminada USB que projeta os tons da água do mar em seu ambiente.',
    price: 59.9,
    originalPrice: 79.9,
    volume: '500ml',
    glassFinish: 'Vidro Cristalino Lapidado',
    editionNumber: 'ACC-03',
    totalBatchQuantity: 120,
    stock: 35,
    rating: 4.98,
    reviewCount: 44,
    isLimitedEdition: false,
    isBestSeller: true,
    isNewRelease: true,
    sensoryNotes: {
      top: 'Luz âmbar suave 2700K anti-ofuscante',
      heart: 'Refração cintilante da água na parede',
      base: 'Alimentação USB universal com interruptor de toque'
    },
    sandDetails: {
      origin: 'Ateliê Iluminação Costeira',
      color: 'Madeira clara com difusor acrílico',
      granulometry: 'Superfície acetinada',
      collectionDate: '2025'
    },
    story: 'Transforme sua garrafa em um abajur poético à noite. Os reflexos da água e dos corais dançam suavemente no ambiente.',
    bottleImage: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=600&q=80',
    images: {
      primary: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
      secondary: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      sensory: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      labelCloseup: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80'
    },
    dimensions: { heightCm: 2.8, diameterCm: 10.0, weightGrams: 210 }
  }
]
