import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialProofToast from '../common/SocialProofToast.vue'

describe('SocialProofToast.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe notificação de resgate de garrafa após tempo de espera inicial', async () => {
    const wrapper = mount(SocialProofToast)

    expect(wrapper.find('[role="status"]').exists()).toBe(false)

    // Avança 8.5 segundos para acionar o timer de exibição
    vi.advanceTimersByTime(8500)
    await wrapper.vm.$nextTick()

    const toast = wrapper.find('[role="status"]')
    expect(toast.exists()).toBe(true)
    expect(toast.text()).toContain('Mariana S.')
    expect(toast.text()).toContain('Garrafa Baía dos Porcos')
  })

  it('permite que o usuário dispense a notificação ao clicar no botão fechar', async () => {
    const wrapper = mount(SocialProofToast)

    vi.advanceTimersByTime(8500)
    await wrapper.vm.$nextTick()

    const closeBtn = wrapper.find('button[aria-label="Dispensar notificações"]')
    expect(closeBtn.exists()).toBe(true)

    await closeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
})
