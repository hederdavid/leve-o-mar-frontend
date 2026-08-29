import { mockProducts } from '@/mocks/products'
import type { Product, ProductFilterParams } from '@/types/product'
import { delay } from './delay'

export const productService = {
  async getAll(params?: ProductFilterParams): Promise<{ products: Product[]; total: number }> {
    await delay(300)
    let filtered = [...mockProducts]

    if (params?.region) {
      filtered = filtered.filter((p) => p.region === params.region)
    }

    if (params?.waterType) {
      filtered = filtered.filter((p) => p.waterType === params.waterType)
    }

    if (params?.isLimitedEdition !== undefined) {
      filtered = filtered.filter((p) => p.isLimitedEdition === params.isLimitedEdition)
    }

    if (params?.isBestSeller !== undefined) {
      filtered = filtered.filter((p) => p.isBestSeller === params.isBestSeller)
    }

    if (params?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!)
    }

    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!)
    }

    if (params?.search) {
      const q = params.search.trim().toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.beachName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      )
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'popular':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        case 'newest':
          filtered.sort((a, b) => (b.isNewRelease ? 1 : 0) - (a.isNewRelease ? 1 : 0))
          break
      }
    }

    const total = filtered.length

    if (params?.page && params?.limit) {
      const start = (params.page - 1) * params.limit
      filtered = filtered.slice(start, start + params.limit)
    }

    return {
      products: filtered,
      total
    }
  },

  async getById(id: string): Promise<Product> {
    await delay(200)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error(`Garrafa não encontrada com o ID: "${id}"`)
    }
    return { ...product }
  },

  async getBySlug(slug: string): Promise<Product> {
    await delay(200)
    const product = mockProducts.find((p) => p.slug === slug)
    if (!product) {
      throw new Error(`Garrafa não encontrada com o slug: "${slug}"`)
    }
    return { ...product }
  },

  async getByBeachId(beachId: string): Promise<Product | null> {
    await delay(150)
    const product = mockProducts.find((p) => p.beachId === beachId)
    return product ? { ...product } : null
  },

  async getBestSellers(): Promise<Product[]> {
    await delay(200)
    return mockProducts.filter((p) => p.isBestSeller)
  },

  async getLimitedEditions(): Promise<Product[]> {
    await delay(200)
    return mockProducts.filter((p) => p.isLimitedEdition)
  },

  async getRelated(currentProductId: string, limit = 3): Promise<Product[]> {
    await delay(200)
    return mockProducts.filter((p) => p.id !== currentProductId).slice(0, limit)
  }
}
