import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductSummary from '../product/ProductSummary.vue'
import { useCartStore } from '@/stores/cart'
import { mockProducts } from '@/mocks/products'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/produto/:slug', name: 'product-detail', component: { template: '<div>Product</div>' } }
    ]
  })
}

describe('ProductSummary.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('permite selecionar acabamento do vidro, lacre de cera e preencher dedicatória', async () => {
    const router = createTestRouter()
    await router.push('/produto/garrafa-praia-do-espelho-ba')
    await router.isReady()

    const product = mockProducts[0]!
    const cartStore = useCartStore()

    const wrapper = mount(ProductSummary, {
      props: {
        product,
        reviewsCount: 12,
        averageRating: 4.9
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Acabamento do Vidro')
    expect(wrapper.text()).toContain('Lacre de Cera Naval na Rolha')

    const suggestBtn = wrapper.findAll('button').find((b) => b.text().includes('Sugerir dedicatória desta praia'))
    expect(suggestBtn).toBeDefined()
    await suggestBtn!.trigger('click')

    expect(wrapper.text()).toContain('Preview do Rótulo Personalizado')
    expect(wrapper.text()).toContain('Para Marina Costa Navegante')

    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('Adicionar às Minhas Aventuras'))
    expect(addBtn).toBeDefined()
    await addBtn!.trigger('click')

    expect(cartStore.items.length).toBe(1)
    expect(cartStore.items[0]!.customization).toBeDefined()
    expect(cartStore.items[0]!.customization?.recipientName).toBe('Para Marina Costa Navegante')
    expect(cartStore.items[0]!.customization?.glassType).toBe('Fosco Sea Glass')
    expect(cartStore.items[0]!.customization?.waxSealColor).toBe('Dourado Solar')
  })
})
