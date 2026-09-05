import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BundleBuilderSection from '../home/BundleBuilderSection.vue'

describe('BundleBuilderSection.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza o título da seção e os benefícios do combo', () => {
    const wrapper = mount(BundleBuilderSection, {
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.text()).toContain('Monte seu Trio do Litoral')
    expect(wrapper.text()).toContain('15% de desconto automático')
    expect(wrapper.text()).toContain('Caixa Rústica Coletiva de Pinho')
  })

  it('exibe o resumo de preço com desconto de 15% para o combo', () => {
    const wrapper = mount(BundleBuilderSection, {
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.text()).toContain('Desconto de Colecionador (15% OFF)')
  })
})
