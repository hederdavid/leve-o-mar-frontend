import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AuthModal from '../auth/AuthModal.vue'

describe('AuthModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('não renderiza conteúdo quando isOpen for false', () => {
    const wrapper = mount(AuthModal, {
      props: { isOpen: false },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renderiza título e abas quando isOpen for true', () => {
    const wrapper = mount(AuthModal, {
      props: { isOpen: true },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('O Farol do Colecionador')
    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.text()).toContain('Criar Conta')
  })

  it('emite evento close ao clicar no botão de fechar', async () => {
    const wrapper = mount(AuthModal, {
      props: { isOpen: true },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    const closeBtn = wrapper.find('button[aria-label="Fechar modal"]')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
