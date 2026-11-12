import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import CartDrawer from '../common/CartDrawer.vue'
import { useCartStore } from '@/stores/cart'
import { mockProducts } from '@/mocks/products'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/carrinho', name: 'cart', component: { template: '<div>Cart</div>' } },
      { path: '/checkout', name: 'checkout', component: { template: '<div>Checkout</div>' } }
    ]
  })
}

describe('CartDrawer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('exibe confirmação de Produto Adicionado ao Carrinho (Tela 06) e permite ajustar quantidade com delta correto', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const cartStore = useCartStore()
    cartStore.addItem(mockProducts[0]!, {
      recipientName: 'Para Marina Costa Navegante',
      giftMessage: 'Com carinho do litoral baiano'
    })

    const wrapper = mount(CartDrawer, {
      global: {
        plugins: [router],
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Produto Adicionado ao Carrinho')
    expect(wrapper.text()).toContain(mockProducts[0]!.name)

    const plusBtn = wrapper.find('button[aria-label="Aumentar quantidade"]')
    await plusBtn.trigger('click')
    expect(cartStore.items[0]!.quantity).toBe(2)

    const minusBtn = wrapper.find('button[aria-label="Diminuir quantidade"]')
    await minusBtn.trigger('click')
    expect(cartStore.items[0]!.quantity).toBe(1)
  })

  it('navega para a página dedicada /carrinho ao clicar em Ver Carrinho Completo & Calcular Frete', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const cartStore = useCartStore()
    cartStore.addItem(mockProducts[0]!)

    const wrapper = mount(CartDrawer, {
      global: {
        plugins: [router],
        stubs: {
          teleport: true
        }
      }
    })

    const fullCartBtn = wrapper.findAll('button').find((b) => b.text().includes('Ver Carrinho Completo & Calcular Frete'))
    expect(fullCartBtn).toBeDefined()
    await fullCartBtn!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/carrinho')
    expect(cartStore.isDrawerOpen).toBe(false)
  })
})
