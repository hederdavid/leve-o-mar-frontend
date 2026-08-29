import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductReviews from '../product/ProductReviews.vue'

describe('ProductReviews.vue', () => {
  const mockReviewList = [
    {
      id: 'rev-1',
      productId: 'maragogi',
      author: 'Carolina Mendes',
      city: 'São Paulo',
      uf: 'SP',
      rating: 5,
      title: 'Espetacular',
      comment: 'A garrafa é linda e a água tem uma cor incrível.',
      createdAt: 'Hoje',
      isVerifiedPurchase: true
    },
    {
      id: 'rev-2',
      productId: 'maragogi',
      author: 'Lucas Vasconcelos',
      city: 'Belo Horizonte',
      uf: 'MG',
      rating: 4,
      title: 'Muito boa',
      comment: 'Adorei a rolha selada.',
      createdAt: 'Ontem',
      isVerifiedPurchase: true
    }
  ]

  const mockStats = {
    averageRating: 4.5,
    totalReviews: 2,
    ratingDistribution: { 5: 50, 4: 50, 3: 0, 2: 0, 1: 0 }
  }

  it('exibe a nota média e depoimentos de colecionadores', () => {
    const wrapper = mount(ProductReviews, {
      props: {
        productId: 'maragogi',
        reviews: mockReviewList,
        stats: mockStats
      }
    })

    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('Carolina Mendes')
    expect(wrapper.text()).toContain('Lucas Vasconcelos')
  })
})
