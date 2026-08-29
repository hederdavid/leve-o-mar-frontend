import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BottleVisual from '../common/BottleVisual.vue'

describe('BottleVisual.vue', () => {
  it('renderiza o componente com o nome do destino e tag corretamente', () => {
    const wrapper = mount(BottleVisual, {
      props: {
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        beachName: 'Maragogi',
        tag: '✦ Galvão dos Corais'
      }
    })

    expect(wrapper.text()).toContain('Maragogi')
    expect(wrapper.text()).toContain('✦ Galvão dos Corais')
    expect(wrapper.find('img').attributes('src')).toBe(
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    )
  })
})
