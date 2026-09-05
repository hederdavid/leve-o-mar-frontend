import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderTrackingModal from '../account/OrderTrackingModal.vue'
import { mockOrders } from '@/mocks/orders'

describe('OrderTrackingModal.vue', () => {
  it('renderiza código de rastreamento e eventos quando aberto', () => {
    const order = mockOrders[0]!
    const wrapper = mount(OrderTrackingModal, {
      props: {
        isOpen: true,
        order
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(order.trackingCode)
    expect(wrapper.text()).toContain('Diário da Expedição')
    expect(wrapper.text()).toContain('Coleta nas Coordenadas Naturais')
  })

  it('não renderiza modal quando isOpen for false', () => {
    const order = mockOrders[0]!
    const wrapper = mount(OrderTrackingModal, {
      props: {
        isOpen: false,
        order
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
