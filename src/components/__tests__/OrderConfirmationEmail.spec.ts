import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import OrderConfirmationEmail from '../checkout/OrderConfirmationEmail.vue'
import { mockOrders } from '@/mocks/orders'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/rastreio/:code?', name: 'tracking', component: { template: '<div>Tracking</div>' } }
    ]
  })
}

describe('OrderConfirmationEmail.vue', () => {
  it('renderiza cabeçalhos de e-mail transacional, selos DKIM/SPF, itens, endereço e NF-e', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const order = mockOrders[0]!
    const wrapper = mount(OrderConfirmationEmail, {
      props: {
        order,
        maskedCard: '•••• •••• •••• 2222',
        authProtocol: 'AUTH-3DS-849201-BR'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('tripulacao@leveomar.com.br')
    expect(wrapper.text()).toContain('marina.navegante@exemplo.com.br')
    expect(wrapper.text()).toContain('DKIM / SPF')
    expect(wrapper.text()).toContain(order.orderNumber)
    expect(wrapper.text()).toContain('Chave NF-e')
  })

  it('emite backToSuccess ao clicar no botão de voltar ao resumo do pedido', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const order = mockOrders[0]!
    const wrapper = mount(OrderConfirmationEmail, {
      props: {
        order,
        maskedCard: '•••• •••• •••• 2222',
        authProtocol: 'AUTH-3DS-849201-BR'
      },
      global: {
        plugins: [router]
      }
    })

    const buttons = wrapper.findAll('button')
    const backBtn = buttons.find((b) => b.text().includes('Voltar ao Resumo do Pedido'))
    expect(backBtn).toBeDefined()
    await backBtn!.trigger('click')

    expect(wrapper.emitted('backToSuccess')).toBeTruthy()
  })
})
