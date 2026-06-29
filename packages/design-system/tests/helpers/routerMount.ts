import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import App from '../../playground/App.vue'
import HomePage from '../../playground/views/HomePage.vue'
import FoundationsPage from '../../playground/views/FoundationsPage.vue'
import ComponentsCatalogPage from '../../playground/views/ComponentsCatalogPage.vue'
import DocumentationPage from '../../playground/views/DocumentationPage.vue'

export function createTestRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: HomePage },
      { path: '/foundations', component: FoundationsPage },
      { path: '/catalog', component: ComponentsCatalogPage },
      { path: '/docs', component: DocumentationPage },
    ],
  })
  return router
}

export async function mountAppWithRouter(initialPath = '/') {
  const router = createTestRouter()
  await router.push(initialPath)
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router] },
    attachTo: document.body,
  })
  await nextTick()
  return { wrapper, router }
}
