import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { analytics } from '@/services/analytics'
import { useSeo } from '@/composables/useSeo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Garrafas Temáticas com Água do Mar e Memórias do Litoral',
        description: 'Coleção de garrafas artesanais com água do mar microfiltrada, coordenadas GPS e caligrafia afetiva das praias mais paradisíacas do Brasil.'
      }
    },
    {
      path: '/produto/:slug',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: {
        title: 'Detalhes da Garrafa Costeira',
        description: 'Explore as coordenadas, notas olfativas marinhas e certificado de autenticidade desta praia colecionável.'
      }
    },
    {
      path: '/colecao',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
      meta: {
        title: 'Catálogo de Praias & Garrafas Colecionáveis',
        description: 'Filtre praias brasileiras por região, tipo de mar e tom da água: Maragogi, Jericoacoara, Fernando de Noronha e mais.'
      }
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: {
        title: 'Carrinho de Compras & Cálculo de Frete',
        description: 'Revise suas garrafas selecionadas, simule o frete com seguro para vidro e aplique cupons promocionais.'
      }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        title: 'Checkout Seguro com Proteção de Vidro',
        description: 'Finalize sua aquisição com seguro total contra quebras, berço antichoque e certificado numerado.'
      }
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'Manifesto & Preservação Oceânica',
        description: 'Conheça o processo de microfiltragem biológica, a curadoria oceânica e o compromisso sustentável com o litoral.'
      }
    },
    {
      path: '/personalizar',
      name: 'customizer',
      component: () => import('../views/CustomizerView.vue'),
      meta: {
        title: 'Personalizador de Rótulo & Garrafa',
        description: 'Grave sua dedicatória personalizada no rótulo, escolha a rolha naval e visualize a garrafa em tempo real.'
      }
    },
    {
      path: '/mapa',
      name: 'map',
      component: () => import('../views/MapView.vue'),
      meta: {
        title: 'Mapa Interativo do Litoral Brasileiro',
        description: 'Navegue geograficamente pelas praias capturadas em nossas garrafas em um mapa náutico com Leaflet.'
      }
    },
    {
      path: '/conta',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        title: 'Área do Colecionador & Passaporte',
        description: 'Acompanhe seus pedidos, resgate certificados de autenticidade e colecione carimbos no Passaporte do Litoral.'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'Acessar Conta do Colecionador',
        description: 'Entre para consultar seus pedidos, carimbos do passaporte e certificados náuticos.'
      }
    },
    {
      path: '/cadastro',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        title: 'Criar Passaporte de Colecionador',
        description: 'Cadastre-se para iniciar sua coleção oficial de águas do mar brasileiro.'
      }
    },
    {
      path: '/rastreio/:code?',
      name: 'tracking',
      component: () => import('../views/TrackingView.vue'),
      meta: {
        title: 'Rastreamento Sensorial de Pedidos',
        description: 'Acompanhe a coleta, filtragem mineral, caligrafia e expedição da sua garrafa em tempo real.'
      }
    }
  ]
})

router.afterEach((to) => {
  const metaTitle = (to.meta.title as string) || ''
  const metaDesc = (to.meta.description as string) || ''

  useSeo({
    title: metaTitle,
    description: metaDesc,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  })

  analytics.pageview(to.fullPath, metaTitle)
})

export default router
