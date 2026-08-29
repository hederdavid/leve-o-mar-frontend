import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CookieConsentBanner from '../common/CookieConsentBanner.vue'

describe('CookieConsentBanner.vue', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza o aviso de privacidade e cookies', async () => {
    const wrapper = mount(CookieConsentBanner)
    // Forçar exibição
    ;(wrapper.vm as any).isVisible = true
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Sua Privacidade no Litoral')
    expect(wrapper.text()).toContain('Aceitar Todos')
    expect(wrapper.text()).toContain('Apenas Essenciais')
  })

  it('grava no localStorage ao clicar em Aceitar Todos', async () => {
    const wrapper = mount(CookieConsentBanner)
    ;(wrapper.vm as any).isVisible = true
    await wrapper.vm.$nextTick()

    const acceptButton = wrapper.findAll('button').find((b) => b.text().includes('Aceitar Todos'))
    expect(acceptButton).toBeDefined()
    await acceptButton!.trigger('click')

    expect(localStorage.getItem('leve-o-mar:cookie-consent')).toBe('accepted')
  })
})
