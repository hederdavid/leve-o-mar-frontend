import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthenticityCertificateModal from '../account/AuthenticityCertificateModal.vue'
import { mockOrders } from '@/mocks/orders'

describe('AuthenticityCertificateModal.vue', () => {
  it('renderiza certificado oficial com lote e praia quando aberto', () => {
    const cert = mockOrders[0]!.certificates[0]!
    const wrapper = mount(AuthenticityCertificateModal, {
      props: {
        isOpen: true,
        certificate: cert
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Certificado de Autenticidade')
    expect(wrapper.text()).toContain(cert.certificateNumber)
    expect(wrapper.text()).toContain(cert.beachName)
  })

  it('não renderiza nada quando isOpen for false', () => {
    const cert = mockOrders[0]!.certificates[0]!
    const wrapper = mount(AuthenticityCertificateModal, {
      props: {
        isOpen: false,
        certificate: cert
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
