import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import CheckoutView from '@/views/CheckoutView.vue'
import { useCartStore } from '@/stores/cart'
import { mockProducts } from '@/mocks/products'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/colecao', name: 'catalog', component: { template: '<div>Catalog</div>' } },
      { path: '/carrinho', name: 'cart', component: { template: '<div>Cart</div>' } },
      { path: '/rastreio/:code?', name: 'tracking', component: { template: '<div>Tracking</div>' } },
      { path: '/conta', name: 'account', component: { template: '<div>Account</div>' } },
      { path: '/checkout', name: 'checkout', component: CheckoutView }
    ]
  })
}

describe('CheckoutView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renderiza o stepper enxuto de 4 etapas e permite percorrer o fluxo completo de checkout', async () => {
    const router = createTestRouter()
    const cartStore = useCartStore()
    cartStore.addItem(mockProducts[0]!, {
      recipientName: 'Para Marina Costa Navegante',
      giftMessage: 'Memória líquida da Praia do Espelho',
      glassType: 'Fosco Sea Glass',
      waxSealColor: 'Dourado Solar'
    })

    await router.push('/checkout?step=1')
    await router.isReady()

    const wrapper = mount(CheckoutView, {
      global: {
        plugins: [router],
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.findAll('nav[aria-label="Etapas do Checkout"] li').length).toBe(4)
    expect(wrapper.text()).toContain('Identificação do Cliente')

    await router.push('/checkout?step=5')
    await flushPromises()
    expect(wrapper.text()).toContain('Revisão do Pedido')
    expect(wrapper.text()).toContain('Marina Costa Navegante')

    await router.push('/checkout?step=6')
    await flushPromises()
    expect(wrapper.text()).toContain('Verificação de Segurança do Pagamento')

    await router.push('/checkout?step=7')
    await flushPromises()
    expect(wrapper.text()).toContain('Pagamento Aprovado com Sucesso!')

    await router.push('/checkout?step=8')
    await flushPromises()
    expect(wrapper.text()).toContain('DKIM / SPF')
  })
})
