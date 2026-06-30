import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/foundations',
      name: 'foundations',
      component: () => import('../views/FoundationsPage.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/ComponentsCatalogPage.vue'),
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('../views/DocumentationPage.vue'),
    },
  ],
})

export default router
