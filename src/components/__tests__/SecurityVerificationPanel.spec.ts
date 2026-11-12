import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SecurityVerificationPanel from '../checkout/SecurityVerificationPanel.vue'

describe('SecurityVerificationPanel.vue', () => {
  const defaultProps = {
    customerName: 'Marina Costa Navegante',
    customerPhone: '(71) 99812-3456',
    customerCep: '40140-130',
    maskedCard: '•••• •••• •••• 2222',
    totalFormatted: 'R$ 194,80',
    paymentMethod: 'CREDIT_CARD' as const
  }

  it('renderiza as validações de segurança (TLS 1.3/PCI-DSS, AVS, Dispositivo e Antifraude)', () => {
    const wrapper = mount(SecurityVerificationPanel, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Verificação de Segurança do Pagamento')
    expect(wrapper.text()).toContain('Criptografia TLS 1.3 & Tokenização PCI-DSS')
    expect(wrapper.text()).toContain('Verificação de Endereço (AVS)')
    expect(wrapper.text()).toContain('Dispositivo e Localização Reconhecidos')
    expect(wrapper.text()).toContain('Monitoramento Antifraude em Tempo Real')
    expect(wrapper.text()).toContain('40140-130')
  })

  it('renderiza campo único de OTP seguindo boas práticas de WebOTP e SMS origin-bound', () => {
    const wrapper = mount(SecurityVerificationPanel, {
      props: defaultProps
    })

    const otpInput = wrapper.find('#otp-input')
    expect(otpInput.exists()).toBe(true)
    expect(otpInput.attributes('type')).toBe('text')
    expect(otpInput.attributes('inputmode')).toBe('numeric')
    expect(otpInput.attributes('autocomplete')).toBe('one-time-code')
    expect(otpInput.attributes('maxlength')).toBe('6')
    expect(wrapper.text()).toContain('@leveomar.com.br #849201')
  })

  it('exibe erro quando o código OTP tem menos de 6 dígitos e emite verified com 6 dígitos', async () => {
    const wrapper = mount(SecurityVerificationPanel, {
      props: defaultProps
    })

    const otpInput = wrapper.find('#otp-input')
    await otpInput.setValue('123')
    await wrapper.find('#otp-form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Digite o código numérico de 6 dígitos enviado para autenticação.')
    expect(wrapper.emitted('verified')).toBeFalsy()

    const fillBtn = wrapper.findAll('button').find((b) => b.text().includes('Usar código recebido'))
    expect(fillBtn).toBeDefined()
    await fillBtn!.trigger('click')
    expect((otpInput.element as HTMLInputElement).value).toBe('849201')

    await wrapper.find('#otp-form').trigger('submit.prevent')
    expect(wrapper.emitted('verified')).toBeTruthy()
    expect(wrapper.emitted('verified')?.[0]?.[0]).toBe('849201')
  })
})
