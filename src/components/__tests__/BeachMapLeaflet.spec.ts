import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BeachMapLeaflet from '../map/BeachMapLeaflet.vue'
import { mockBeaches } from '@/mocks/beaches'
import { mockProducts } from '@/mocks/products'

describe('BeachMapLeaflet.vue', () => {
  setActivePinia(createPinia())

  it('renderiza os controles de expedição por região e botão de som do mar', () => {
    const wrapper = mount(BeachMapLeaflet, {
      props: {
        beaches: mockBeaches,
        products: mockProducts,
        selectedBeachId: mockBeaches[0]?.id
      },
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.text()).toContain('Nordeste')
    expect(wrapper.text()).toContain('Sudeste')
    expect(wrapper.text()).toContain('Sul')
    expect(wrapper.text()).toContain('Norte')
    expect(wrapper.text()).toContain('Som do Mar')
  })
})
