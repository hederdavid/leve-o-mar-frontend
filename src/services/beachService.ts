import { mockBeaches } from '@/mocks/beaches'
import type { Beach, BrazilianRegion } from '@/types/beach'
import { delay } from './delay'

export const beachService = {
  async getAll(): Promise<Beach[]> {
    await delay(250)
    return [...mockBeaches]
  },

  async getFeatured(): Promise<Beach[]> {
    await delay(200)
    return mockBeaches.filter((b) => b.featured)
  },

  async getById(id: string): Promise<Beach> {
    await delay(200)
    const beach = mockBeaches.find((b) => b.id === id)
    if (!beach) {
      throw new Error(`Praia não encontrada com o ID: "${id}"`)
    }
    return { ...beach }
  },

  async getBySlug(slug: string): Promise<Beach> {
    await delay(200)
    const beach = mockBeaches.find((b) => b.slug === slug)
    if (!beach) {
      throw new Error(`Praia não encontrada com o slug: "${slug}"`)
    }
    return { ...beach }
  },

  async getByRegion(region: BrazilianRegion): Promise<Beach[]> {
    await delay(200)
    return mockBeaches.filter((b) => b.region === region)
  },

  async search(query: string): Promise<Beach[]> {
    await delay(250)
    const q = query.trim().toLowerCase()
    if (!q) return [...mockBeaches]

    return mockBeaches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.uf.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q)
    )
  }
}
