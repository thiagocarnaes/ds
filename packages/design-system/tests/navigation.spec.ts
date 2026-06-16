import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from '@/components/navigation/Tabs.vue'
import TabList from '@/components/navigation/TabList.vue'
import Tab from '@/components/navigation/Tab.vue'
import TabPanel from '@/components/navigation/TabPanel.vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'
import BreadcrumbItem from '@/components/navigation/BreadcrumbItem.vue'
import Pagination from '@/components/navigation/Pagination.vue'
import SidebarMenu from '@/components/navigation/SidebarMenu.vue'
import SidebarMenuGroup from '@/components/navigation/SidebarMenuGroup.vue'
import SidebarMenuItem from '@/components/navigation/SidebarMenuItem.vue'
import { SIDEBAR_MENU_INJECTION_KEY } from '@/components/navigation/sidebarMenuContext'

describe('Tabs', () => {
  it('shows active panel', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'one' },
      slots: {
        default: `
          <TabList>
            <Tab value="one">One</Tab>
            <Tab value="two">Two</Tab>
          </TabList>
          <TabPanel value="one">Panel one</TabPanel>
          <TabPanel value="two">Panel two</TabPanel>
        `,
      },
      global: {
        components: { TabList, Tab, TabPanel },
      },
    })
    expect(wrapper.text()).toContain('Panel one')
  })
})

describe('Breadcrumb', () => {
  it('marks current page', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: `
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Tasks</BreadcrumbItem>
        `,
      },
      global: { components: { BreadcrumbItem } },
    })
    expect(wrapper.find('[aria-current="page"]').exists()).toBe(true)
  })
})

describe('Pagination', () => {
  it('emits page change', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 1 },
    })
    const page2 = wrapper.findAll('button').find((b) => b.text() === '2')
    expect(page2).toBeTruthy()
    await page2!.trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([2])
  })
})

describe('SidebarMenu', () => {
  it('uses the same row height when collapsed and expanded', () => {
    const expanded = mount(SidebarMenuItem, {
      props: { id: 'dashboard', label: 'Dashboard' },
      global: {
        provide: {
          [SIDEBAR_MENU_INJECTION_KEY as symbol]: {
            collapsed: { value: false },
            showLabels: { value: true },
            isActive: () => false,
            isGroupActive: () => false,
            setActive: () => undefined,
          },
        },
      },
    })

    const collapsed = mount(SidebarMenuItem, {
      props: { id: 'dashboard', label: 'Dashboard' },
      global: {
        provide: {
          [SIDEBAR_MENU_INJECTION_KEY as symbol]: {
            collapsed: { value: true },
            showLabels: { value: false },
            isActive: () => false,
            isGroupActive: () => false,
            setActive: () => undefined,
          },
        },
      },
    })

    expect(expanded.find('button').classes()).toContain('h-8')
    expect(expanded.find('button').classes()).toContain('w-full')
    expect(collapsed.find('button').classes()).toContain('h-8')
    expect(collapsed.find('button').classes()).toContain('w-full')
  })

  it('opens nested groups on hover and selects items', async () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        activeId: 'components.forms.input',
        openKeys: ['components', 'components.forms'],
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
            </SidebarMenuGroup>
            <SidebarMenuGroup id="components.feedback" label="Feedback">
              <SidebarMenuItem id="components.feedback.alert" label="Alert" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    expect(wrapper.text()).not.toContain('Input')

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Forms')
    expect(document.body.textContent).not.toContain('Alert')

    const feedbackGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Feedback'),
    )
    await feedbackGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Alert')

    const alertButton = [...document.body.querySelectorAll('button')].find((btn) => btn.textContent === 'Alert')
    await alertButton!.dispatchEvent(new Event('click'))
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['components.feedback.alert'])

    wrapper.unmount()
  })

  it('highlights only the active item when groups are open', async () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        activeId: 'components.forms.input',
        openKeys: ['components', 'components.forms'],
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
              <SidebarMenuItem id="components.forms.select" label="Select" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    const formsGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Forms'),
    )
    await formsGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('Input')
    expect(wrapper.find('button[aria-expanded]').classes()).toContain('text-primary')

    wrapper.unmount()
  })

  it('highlights nested group row when a child item is active in flyout', async () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        activeId: 'components.forms.input',
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    const formsGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Forms'),
    )

    expect(formsGroup?.classList.contains('text-primary')).toBe(true)

    wrapper.unmount()
  })

  it('closes sibling nested flyout when hovering another group', async () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        activeId: 'components.forms.input',
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
              <SidebarMenuItem id="components.forms.select" label="Select" />
            </SidebarMenuGroup>
            <SidebarMenuGroup id="components.feedback" label="Feedback">
              <SidebarMenuItem id="components.feedback.alert" label="Alert" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    const formsGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Forms'),
    )
    await formsGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Select')

    const feedbackGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Feedback'),
    )
    await feedbackGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Alert')
    expect(document.body.textContent).not.toContain('Select')

    wrapper.unmount()
  })

  it('shows nested items in a flyout when collapsed', async () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        collapsed: true,
        activeId: 'components.forms.input',
        openKeys: ['components', 'components.forms'],
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    expect(wrapper.text()).not.toContain('Input')

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    const formsGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Forms'),
    )
    await formsGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Input')

    wrapper.unmount()
  })

  it('keeps parent flyout open while a nested flyout is open', async () => {
    vi.useFakeTimers()

    const wrapper = mount(SidebarMenu, {
      props: {
        activeId: 'components.forms.input',
      },
      attachTo: document.body,
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.find('button[aria-expanded]').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    const formsGroup = [...document.body.querySelectorAll('button[aria-expanded]')].find((btn) =>
      btn.textContent?.includes('Forms'),
    )
    await formsGroup!.dispatchEvent(new Event('mouseenter'))
    await wrapper.vm.$nextTick()

    const componentsFlyout = document.body.querySelector('[data-sidebar-depth="0"]')
    const formsFlyout = document.body.querySelector('[data-sidebar-depth="1"]')

    expect(componentsFlyout).toBeTruthy()
    expect(formsFlyout).toBeTruthy()

    componentsFlyout!.dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true, relatedTarget: formsFlyout }),
    )

    await vi.advanceTimersByTimeAsync(250)
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[data-sidebar-depth="0"]')).toBeTruthy()
    expect(document.body.querySelector('[data-sidebar-depth="1"]')).toBeTruthy()

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('highlights the parent group icon when collapsed and a nested item is active', () => {
    const wrapper = mount(SidebarMenu, {
      props: {
        collapsed: true,
        activeId: 'components.forms.input',
      },
      slots: {
        default: `
          <SidebarMenuGroup id="components" label="Components">
            <SidebarMenuGroup id="components.forms" label="Forms">
              <SidebarMenuItem id="components.forms.input" label="Input" />
            </SidebarMenuGroup>
          </SidebarMenuGroup>
        `,
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    const componentsIcon = wrapper.find('button[aria-expanded] span')
    expect(componentsIcon.classes()).toContain('text-primary')
    expect(componentsIcon.classes()).toContain('bg-primary/15')

    wrapper.unmount()
  })
})
