import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InteractiveCreditCard from '../checkout/InteractiveCreditCard.vue'

describe('InteractiveCreditCard.vue', () => {
  it('renderiza o nome do titular e número mascarado corretamente', () => {
    const wrapper = mount(InteractiveCreditCard, {
      props: {
        cardNumber: '4532890123456789',
        cardHolder: 'HEDER M DAVID',
        cardExpiry: '12/28',
        cardCvv: '123',
        isFlipped: false
      }
    })

    expect(wrapper.text()).toContain('HEDER M DAVID')
    expect(wrapper.text()).toContain('12/28')
    expect(wrapper.text()).toContain('Visa')
    expect(wrapper.find('.card-inner').classes()).not.toContain('is-flipped')
  })

  it('aplica classe is-flipped quando isFlipped for true', () => {
    const wrapper = mount(InteractiveCreditCard, {
      props: {
        cardNumber: '5123456789012345',
        cardHolder: 'MARIANA COSTA',
        cardExpiry: '06/29',
        cardCvv: '999',
        isFlipped: true
      }
    })

    expect(wrapper.find('.card-inner').classes()).toContain('is-flipped')
    expect(wrapper.text()).toContain('Mastercard')
  })
})
