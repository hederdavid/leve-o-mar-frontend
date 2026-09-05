export interface PassportStamp {
  id: string
  beachId: string
  beachName: string
  state: string
  region: string
  coordinates: {
    lat: number
    lng: number
  }
  waterTone: string
  collectedAt: string
  orderNumber: string
  batchNumber: string
}

export interface CoastlineStats {
  totalCoastBeaches: number
  collectedCount: number
  percentageExplored: number
  regionsRepresented: string[]
}
