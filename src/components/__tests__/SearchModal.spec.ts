import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import SearchModal from '../common/SearchModal.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/colecao', name: 'catalog', component: { template: '<div>Catalog</div>' } },
      { path: '/produto/:slug', name: 'product-detail', component: { template: '<div>Product</div>' } }
    ]
  })
}

describe('SearchModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renderiza elemento semântico <search> e filtra resultados com initialQuery (Tela 03)', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(SearchModal, {
      props: {
        isOpen: true,
        initialQuery: 'Noronha'
      },
      global: {
        plugins: [router],
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.find('search').exists()).toBe(true)
    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('Noronha')
    expect(wrapper.text()).toContain('Fernando de Noronha')
  })

  it('exibe estado vazio amigável quando nenhum destino corresponde à busca', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(SearchModal, {
      props: {
        isOpen: true,
        initialQuery: 'AtlantidaInexistente999'
      },
      global: {
        plugins: [router],
        stubs: {
          teleport: true
        }
      }
    })

    expect(wrapper.text()).toContain('AtlantidaInexistente999')
  })
})
