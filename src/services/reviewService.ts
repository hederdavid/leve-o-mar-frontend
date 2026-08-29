import { mockReviews } from '@/mocks/reviews'
import type { Review, ReviewStats, NewReviewPayload } from '@/types/review'
import { delay } from './delay'

// Armazenamento reativo em memória para novos comentários adicionados durante a sessão
const reviewsStore = [...mockReviews]

export const reviewService = {
  async getByProductId(productId: string, starFilter?: number | null): Promise<Review[]> {
    await delay(200)
    let list = reviewsStore.filter((r) => r.productId === productId)

    if (starFilter && starFilter >= 1 && starFilter <= 5) {
      list = list.filter((r) => r.rating === starFilter)
    }

    return [...list]
  },

  async getStatsByProductId(productId: string): Promise<ReviewStats> {
    await delay(150)
    const list = reviewsStore.filter((r) => r.productId === productId)

    if (list.length === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        ratingDistribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const total = list.length
    const sum = list.reduce((acc, r) => acc + r.rating, 0)
    const average = parseFloat((sum / total).toFixed(1))

    const distribution = {
      5: Math.round((list.filter((r) => r.rating === 5).length / total) * 100),
      4: Math.round((list.filter((r) => r.rating === 4).length / total) * 100),
      3: Math.round((list.filter((r) => r.rating === 3).length / total) * 100),
      2: Math.round((list.filter((r) => r.rating === 2).length / total) * 100),
      1: Math.round((list.filter((r) => r.rating === 1).length / total) * 100)
    }

    return {
      averageRating: average,
      totalReviews: total,
      ratingDistribution: distribution
    }
  },

  async addReview(payload: NewReviewPayload): Promise<Review> {
    await delay(350)
    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      productId: payload.productId,
      author: payload.author,
      city: payload.city,
      uf: payload.uf,
      rating: payload.rating,
      title: payload.title || 'Avaliação de Colecionador',
      comment: payload.comment,
      createdAt: 'Hoje',
      isVerifiedPurchase: true,
      likesCount: 0
    }

    reviewsStore.unshift(newReview)
    return newReview
  }
}
