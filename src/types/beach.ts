export type BrazilianRegion = 'Nordeste' | 'Sudeste' | 'Sul' | 'Norte' | 'Centro-Oeste'

export type WaterType = 'Piscinas Naturais' | 'Mar Calmo & Cristalino' | 'Ondas Selvagens' | 'Águas Doces de Rio'

export interface GeoCoordinates {
  lat: number
  lng: number
}

export interface BeachSensoryTags {
  waterColor: string
  sandTexture: string
  aromaProfile: string[]
  temperatureAvg: string
}

export interface Beach {
  id: string
  name: string
  slug: string
  city: string
  state: string
  uf: string
  region: BrazilianRegion
  coordinates: GeoCoordinates
  waterType: WaterType
  headline: string
  description: string
  history: string
  curiosities: string[]
  coverImage: string
  galleryImages: string[]
  sensory: BeachSensoryTags
  featured: boolean
}
