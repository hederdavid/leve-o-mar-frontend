import type { BrazilianRegion, GeoCoordinates, WaterType } from './beach'

export type BottleVolume = '250ml' | '500ml' | '750ml'

export type GlassFinish = 'Vidro Cristalino Lapidado' | 'Vidro Fosco Sea Glass' | 'Vidro Âmbar Costeiro'

export interface SensoryNotes {
  top: string
  heart: string
  base: string
}

export interface SandDetails {
  origin: string
  color: string
  granulometry: string
  collectionDate: string
}

export interface Product {
  id: string
  beachId: string
  beachName: string
  city: string
  state: string
  uf: string
  region: BrazilianRegion
  waterType: WaterType
  categoryTag: string // ex: "PISCINAS NATURAIS", "DUNAS E LAGOAS", "PARAÍSO INTOCADO"
  highlightTag: string // ex: "✦ Galvão dos Corais", "✦ Paraíso sem Carros"
  coordinates: GeoCoordinates
  name: string
  slug: string
  tagline: string
  price: number
  originalPrice?: number
  volume: BottleVolume
  glassFinish: GlassFinish
  editionNumber: string
  totalBatchQuantity: number
  stock: number
  rating: number
  reviewCount: number
  isLimitedEdition: boolean
  isBestSeller: boolean
  isNewRelease: boolean
  sensoryNotes: SensoryNotes
  sandDetails: SandDetails
  story: string
  bottleImage: string
  images: {
    primary: string
    secondary: string
    sensory: string
    labelCloseup: string
  }
  model3dUrl?: string
  dimensions: {
    heightCm: number
    diameterCm: number
    weightGrams: number
  }
}

export interface ProductFilterParams {
  category?: string
  region?: BrazilianRegion
  waterType?: WaterType
  isLimitedEdition?: boolean
  isBestSeller?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'popular' | 'newest'
  page?: number
  limit?: number
}
