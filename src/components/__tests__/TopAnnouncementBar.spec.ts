import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopAnnouncementBar from '../layout/TopAnnouncementBar.vue'

describe('TopAnnouncementBar.vue', () => {
  it('renderiza o texto promocional de frete grátis', () => {
    const wrapper = mount(TopAnnouncementBar)

    expect(wrapper.text()).toContain('Frete Grátis')
    expect(wrapper.text()).toContain('R$ 79,90')
  })
})
