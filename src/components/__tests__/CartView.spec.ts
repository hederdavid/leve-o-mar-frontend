import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import CartView from '@/views/CartView.vue'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/orderService'
import { mockProducts } from '@/mocks/products'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/colecao', name: 'catalog', component: { template: '<div>Catalog</div>' } },
      { path: '/produto/:slug', name: 'product-detail', component: { template: '<div>Product</div>' } },
      { path: '/carrinho', name: 'cart', component: CartView },
      { path: '/checkout', name: 'checkout', component: { template: '<div>Checkout</div>' } },
      { path: '/mapa', name: 'map', component: { template: '<div>Map</div>' } },
      { path: '/personalizar', name: 'customizer', component: { template: '<div>Customizer</div>' } },
      { path: '/rastreio/:code?', name: 'tracking', component: { template: '<div>Tracking</div>' } },
      { path: '/sobre', name: 'about', component: { template: '<div>About</div>' } },
      { path: '/conta', name: 'account', component: { template: '<div>Account</div>' } }
    ]
  })
}

describe('CartView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renderiza itens do carrinho (Tela 07) e calcula frete e prazo com CEP (Tela 08)', async () => {
    vi.spyOn(orderService, 'lookupShippingAndAddress').mockResolvedValueOnce({
      address: {
        cep: '40140-130',
        street: 'Avenida Oceânica',
        neighborhood: 'Barra',
        city: 'Salvador',
        state: 'BA'
      },
      options: [
        {
          id: 'pac-maritimo',
          name: 'PAC Marítimo Segurado',
          carrier: 'Correios / Logística Costeira',
          price: 22.9,
          estimatedDays: 6,
          isFragileProtected: true
        },
        {
          id: 'sedex-expresso',
          name: 'Expresso Atlântico (SEDEX)',
          carrier: 'Correios Prioritário',
          price: 37.9,
          estimatedDays: 3,
          isFragileProtected: true
        }
      ]
    })

    const router = createTestRouter()
    const cartStore = useCartStore()
    cartStore.addItem(mockProducts[0]!, {
      recipientName: 'Para Marina Costa Navegante',
      giftMessage: 'Brisa da Bahia',
      glassType: 'Fosco Sea Glass',
      waxSealColor: 'Dourado Solar'
    })

    await router.push('/carrinho')
    await router.isReady()

    const wrapper = mount(CartView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Carrinho de Compras')
    expect(wrapper.text()).toContain(mockProducts[0]!.name)
    expect(wrapper.text()).toContain('Fosco Sea Glass')

    const cepInput = wrapper.find('#cart-cep-input')
    await cepInput.setValue('40140-130')
    const calcBtn = wrapper.findAll('button').find((b) => b.text().includes('Calcular Frete'))
    expect(calcBtn).toBeDefined()
    await calcBtn!.trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Salvador - BA')
    expect(wrapper.text()).toContain('PAC Marítimo Segurado')
    expect(wrapper.text()).toContain('6 dias úteis')
  })

  it('aplica cupom promocional MAR10 com 10% de desconto transparente', async () => {
    const router = createTestRouter()
    const cartStore = useCartStore()
    cartStore.addItem(mockProducts[0]!)

    await router.push('/carrinho')
    await router.isReady()

    const wrapper = mount(CartView, {
      global: {
        plugins: [router]
      }
    })

    const couponInput = wrapper.find('#cart-coupon-input')
    await couponInput.setValue('MAR10')
    const couponForm = couponInput.element.closest('form')
    expect(couponForm).not.toBeNull()
    await wrapper.findAll('form')[1]!.trigger('submit.prevent')

    expect(cartStore.couponCode).toBe('MAR10')
    expect(wrapper.text()).toContain('Desconto Cupom (10%)')
  })
})
