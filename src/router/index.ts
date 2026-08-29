import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: HomeView
    },
    {
      path: '/produto/:slug',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/colecao',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue')
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/personalizar',
      name: 'customizer',
      component: () => import('../views/CustomizerView.vue')
    },
    {
      path: '/mapa',
      name: 'map',
      component: () => import('../views/MapView.vue')
    }
  ]
})

export default router
