export interface Review {
  id: string
  productId: string
  author: string
  city: string
  uf: string
  rating: number // 1 a 5
  title?: string
  comment: string
  createdAt: string
  isVerifiedPurchase: boolean
  likesCount?: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface NewReviewPayload {
  productId: string
  author: string
  city: string
  uf: string
  rating: number
  title?: string
  comment: string
}
