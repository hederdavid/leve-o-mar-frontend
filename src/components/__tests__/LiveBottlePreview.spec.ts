import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiveBottlePreview from '../customizer/LiveBottlePreview.vue'
import { mockProducts } from '@/mocks/products'

describe('LiveBottlePreview.vue', () => {
  const product = mockProducts[0]!

  it('renderiza o nome do destinatário e mensagem personalizada no rótulo', () => {
    const wrapper = mount(LiveBottlePreview, {
      props: {
        product,
        recipientName: 'Para Mariana',
        customMessage: 'Lembrança do nosso verão em Noronha',
        fontStyle: 'cursive',
        glassType: 'lapidado'
      }
    })

    expect(wrapper.text()).toContain('Para Mariana')
    expect(wrapper.text()).toContain('Lembrança do nosso verão em Noronha')
    expect(wrapper.text()).toContain(product.beachName)
  })
})
