import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { providePlaygroundLocale } from '../../playground/composables/usePlaygroundLocale'
import PaginationDemo from '../../playground/demos/PaginationDemo.vue'
import DataTableDemo from '../../playground/demos/DataTableDemo.vue'
import LayoutDemo from '../../playground/demos/LayoutDemo.vue'
import ModalDemo from '../../playground/demos/ModalDemo.vue'
import DrawerPlayground from '../../playground/components/DrawerPlayground.vue'

const LocaleShell = defineComponent({
  setup(_, { slots }) {
    providePlaygroundLocale()
    return () => slots.default?.()
  },
})

function mountDemo(component: Parameters<typeof mount>[0], props?: Record<string, unknown>) {
  return mount(LocaleShell, {
    slots: { default: () => h(component as Parameters<typeof h>[0], props ?? {}) },
    attachTo: document.body,
  })
}

export { mountDemo, LocaleShell, PaginationDemo, DataTableDemo, LayoutDemo, ModalDemo, DrawerPlayground }
