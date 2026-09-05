import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CollectorPassport from '../account/CollectorPassport.vue'
import { demoUser } from '@/services/authService'
import { mockOrders } from '@/mocks/orders'

describe('CollectorPassport.vue', () => {
  it('renderiza o passaporte náutico e a contagem de praias catalogadas', () => {
    const wrapper = mount(CollectorPassport, {
      props: {
        user: demoUser,
        orders: mockOrders
      },
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    expect(wrapper.text()).toContain('Passaporte de Navegação do Litoral')
    expect(wrapper.text()).toContain('Progresso da Costa')
    expect(wrapper.text()).toContain('Maragogi')
  })
})
