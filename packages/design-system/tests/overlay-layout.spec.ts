import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Modal from '@/components/overlay/Modal.vue'
import Drawer from '@/components/overlay/Drawer.vue'
import Container from '@/components/layout/Container.vue'
import Stack from '@/components/layout/Stack.vue'
import Grid from '@/components/layout/Grid.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarMenuItem from '@/components/navigation/SidebarMenuItem.vue'
import SidebarMenuGroup from '@/components/navigation/SidebarMenuGroup.vue'
import Tooltip from '@/components/overlay/Tooltip.vue'
import Popover from '@/components/overlay/Popover.vue'

describe('Modal', () => {
  it('shows content when open', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { default: 'Modal body' },
      attachTo: document.body,
    })
    expect(document.body.textContent).toContain('Modal body')
    wrapper.unmount()
  })

  it('closes on escape', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value }),
      },
      attachTo: document.body,
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})

describe('Drawer', () => {
  it('teleports panel when open', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, placement: 'right' },
      slots: { default: 'Drawer content' },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('Drawer content')
    wrapper.unmount()
  })

  it('updates panel edge when placement changes', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, placement: 'right' },
      slots: { default: 'Drawer content' },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const panel = document.body.querySelector('[role="dialog"]')
    expect(panel?.className).toContain('right-0')

    await wrapper.setProps({ placement: 'bottom' })
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(panel?.className).toContain('bottom-0')
    expect(panel?.className).not.toContain('right-0')
    wrapper.unmount()
  })
})

describe('layout components', () => {
  it('Container applies max width class', () => {
    const wrapper = mount(Container, { props: { maxWidth: 'lg' } })
    expect(wrapper.classes().some((c) => c.includes('max-w'))).toBe(true)
  })

  it('Stack stacks children', () => {
    const wrapper = mount(Stack, {
      props: { direction: 'vertical', gap: 4 },
      slots: { default: '<div>A</div><div>B</div>' },
    })
    expect(wrapper.classes().some((c) => c.includes('flex'))).toBe(true)
  })

  it('Stack switches direction when the prop changes', async () => {
    const wrapper = mount(Stack, { props: { direction: 'vertical', gap: 4 } })
    expect(wrapper.classes()).toContain('flex-col')

    await wrapper.setProps({ direction: 'horizontal' })
    expect(wrapper.classes()).toContain('flex-row')
    expect(wrapper.classes()).not.toContain('flex-col')
  })

  it('Grid applies grid', () => {
    const wrapper = mount(Grid, { props: { cols: 2 } })
    expect(wrapper.classes().some((c) => c.includes('grid'))).toBe(true)
  })

  it('AppLayout renders header, menu, content, and footer slots', () => {
    const wrapper = mount(AppLayout, {
      props: { showHeader: true, showMenu: true, showFooter: true },
      slots: {
        header: 'Header area',
        'menu': 'Menu area',
        default: 'Content area',
        footer: 'Footer area',
      },
    })
    expect(wrapper.text()).toContain('Header area')
    expect(wrapper.text()).toContain('Menu area')
    expect(wrapper.text()).toContain('Content area')
    expect(wrapper.text()).toContain('Footer area')
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('aside').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('AppLayout stretches default slot wrapper to full content height', () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, class: 'h-96' },
      slots: {
        'menu': 'Menu',
        default: '<div data-test="content">Content</div>',
      },
    })
    expect(wrapper.find('main > div').classes()).toContain('h-full')
  })

  it('toggles footer visibility when showFooter changes', async () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, showFooter: true, class: 'h-96' },
      slots: {
        'menu': 'Menu',
        default: 'Content',
        footer: '<span data-testid="footer">Footer</span>',
      },
    })
    expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)

    await wrapper.setProps({ showFooter: false })
    expect(wrapper.find('[data-testid="footer"]').exists()).toBe(false)

    await wrapper.setProps({ showFooter: true })
    expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)
  })

  it('AppLayout hides regions when showProps are false', () => {
    const wrapper = mount(AppLayout, {
      props: { showHeader: false, showMenu: false, showFooter: false },
      slots: {
        header: 'Header area',
        'menu': 'Menu area',
        default: 'Content area',
        footer: 'Footer area',
      },
    })
    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.text()).toContain('Content area')
  })

  it('AppLayout starts collapsed when defaultMenuCollapsed is true', () => {
    const wrapper = mount(AppLayout, {
      props: { defaultMenuCollapsed: true, showMenu: true },
      slots: { menu: 'Menu area', default: 'Content' },
    })
    expect(wrapper.find('aside').attributes('data-menu-collapsed')).toBe('true')
  })

  it('AppLayout toggles menu collapsed state', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        menuCollapsible: true,
        'onUpdate:menuCollapsed': (value: boolean) => wrapper.setProps({ menuCollapsed: value }),
      },
      slots: {
        default: 'Content',
      },
    })
    await wrapper.find('button[aria-label="Collapse menu"]').trigger('click')
    expect(wrapper.emitted('update:menuCollapsed')?.[0]).toEqual([true])
  })

  it('AppLayout renders built-in menu toggle with chevron icon', () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, menuCollapsed: false },
      slots: { default: 'Content' },
    })

    const toggle = wrapper.find('button[aria-label="Collapse menu"]')
    expect(toggle.exists()).toBe(true)
    expect(toggle.find('svg').exists()).toBe(true)
  })

  it('AppLayout hides menu toggle when menuCollapsible is false', () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, menuCollapsible: false },
      slots: { default: 'Content' },
    })

    expect(wrapper.find('button[aria-label="Collapse menu"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Expand menu"]').exists()).toBe(false)
  })

  it('AppLayout pins a SidebarMenuGroup with matching settingsMenuId to the footer', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        settingsMenu: true,
        settingsMenuId: 'prefs',
      },
      slots: {
        menu: `
          <SidebarMenuGroup id="prefs" label="Preferences">
            <SidebarMenuItem id="prefs.profile" label="Profile" />
            <SidebarMenuItem id="prefs.team" label="Team" />
          </SidebarMenuGroup>
        `,
        default: 'Content',
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Preferences')
  })

  it('AppLayout pins a lone SidebarMenuItem with matching settingsMenuId to the footer', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        settingsMenu: true,
      },
      attachTo: document.body,
      slots: {
        menu: `
          <span data-testid="nav">Nav</span>
          <SidebarMenuItem id="settings" label="Settings" />
        `,
        default: 'Content',
      },
      global: {
        components: { SidebarMenuItem },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.find('[data-testid="nav"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Settings')

    wrapper.unmount()
  })

  it('AppLayout renders pinned settings group children in flyout on hover', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        settingsMenu: true,
      },
      attachTo: document.body,
      slots: {
        menu: `
          <SidebarMenuGroup id="settings" label="Settings" flyout-placement="up">
            <SidebarMenuItem id="settings.profile" label="Profile" />
            <SidebarMenuItem id="settings.team" label="Team" />
          </SidebarMenuGroup>
        `,
        default: 'Content',
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).not.toContain('Profile')
    expect(wrapper.text()).not.toContain('Team')
    expect(wrapper.text()).toContain('Settings')

    const settingsTrigger = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Settings'))
    expect(settingsTrigger).toBeDefined()
    await settingsTrigger!.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(
      [...document.body.querySelectorAll('button')].some((button) => button.textContent?.includes('Profile')),
    ).toBe(true)

    wrapper.unmount()
  })

  it('AppLayout ignores settings ids when settingsMenu is false', () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        settingsMenu: false,
      },
      slots: {
        menu: `
          <SidebarMenuItem id="dashboard" label="Dashboard" />
          <SidebarMenuItem id="settings" label="Settings" />
        `,
        default: 'Content',
      },
      global: {
        components: { SidebarMenuItem },
      },
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Settings')

    wrapper.unmount()
  })

  it('AppLayout shows pinned settings group children in flyout on hover, not inline', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        menuCollapsed: false,
        settingsMenu: true,
      },
      attachTo: document.body,
      slots: {
        menu: `
          <SidebarMenuItem id="dashboard" label="Dashboard" />
          <SidebarMenuGroup id="settings" label="Settings" flyout-placement="up">
            <SidebarMenuItem id="settings.profile" label="Profile" />
            <SidebarMenuItem id="settings.team" label="Team" />
          </SidebarMenuGroup>
        `,
        default: 'Content',
      },
      global: {
        components: { SidebarMenuGroup, SidebarMenuItem },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).not.toContain('Profile')
    expect(wrapper.text()).not.toContain('Team')

    const settingsTrigger = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Settings'))
    expect(settingsTrigger).toBeDefined()
    await settingsTrigger!.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(
      [...document.body.querySelectorAll('button')].some((button) => button.textContent?.includes('Profile')),
    ).toBe(true)

    wrapper.unmount()
  })

  it('AppLayout renders content-width footer inside content column', () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, showFooter: true, footerWidth: 'content' },
      slots: {
        'menu': 'Menu area',
        default: 'Content area',
        footer: 'Footer area',
      },
    })

    expect(wrapper.findAll('footer')).toHaveLength(1)
    expect(wrapper.text()).toContain('Footer area')

    const shell = wrapper.find('[style*="grid-area: shell"]')
    expect(shell.find('aside').exists()).toBe(true)
    expect(shell.find('footer').exists()).toBe(true)
    expect(wrapper.find('[style*="grid-area: footer"]').exists()).toBe(false)
  })

  it('AppLayout shows panel overlay when panelOpen is true', () => {
    const wrapper = mount(AppLayout, {
      props: { showMenu: true, panelOpen: true },
      slots: {
        'menu': 'Menu',
        default: 'Content area',
        panel: `
          <template #default="{ closePanel }">
            <button @click="closePanel()">Close panel</button>
            <span>Panel body</span>
          </template>
        `,
      },
    })

    expect(wrapper.text()).toContain('Panel body')
    expect(wrapper.find('[data-app-layout-panel]').exists()).toBe(true)
    expect(wrapper.find('[data-app-layout-panel-resize]').exists()).toBe(true)
  })

  it('AppLayout closes panel on backdrop click', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        panelOpen: true,
        'onUpdate:panelOpen': (value: boolean) => wrapper.setProps({ panelOpen: value }),
      },
      slots: {
        'menu': 'Menu',
        default: 'Content',
        panel: 'Panel',
      },
    })

    await wrapper.find('button[aria-label="Close panel"]').trigger('click')
    expect(wrapper.emitted('update:panelOpen')?.[0]).toEqual([false])
  })

  it('AppLayout closes panel on escape', async () => {
    const wrapper = mount(AppLayout, {
      props: {
        showMenu: true,
        panelOpen: true,
        'onUpdate:panelOpen': (value: boolean) => wrapper.setProps({ panelOpen: value }),
      },
      slots: {
        'menu': 'Menu',
        default: 'Content',
        panel: 'Panel',
      },
      attachTo: document.body,
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(wrapper.emitted('update:panelOpen')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})

describe('Tooltip', () => {
  it('teleports content to body on hover', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Collapse menu', placement: 'right' },
      slots: { default: '<button type="button">Toggle</button>' },
      attachTo: document.body,
    })

    await wrapper.find('span.inline-flex').trigger('mouseenter')
    await flushPromises()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toBe('Collapse menu')
    wrapper.unmount()
  })

  it('applies appearance classes to the tooltip bubble', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Hint', appearance: 'primary' },
      slots: { default: '<button type="button">Toggle</button>' },
      attachTo: document.body,
    })

    await wrapper.find('span.inline-flex').trigger('mouseenter')
    await flushPromises()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const bubble = document.body.querySelector('[role="tooltip"]')
    expect(bubble?.className).toContain('bg-popover')
    expect(bubble?.className).toContain('border-transparent')
    wrapper.unmount()
  })
})

describe('Popover', () => {
  it('applies appearance classes to the panel', () => {
    const wrapper = mount(Popover, {
      props: { open: true, appearance: 'primary' },
      slots: {
        trigger: '<button type="button">Open</button>',
        content: '<p>Panel</p>',
      },
    })

    expect(wrapper.find('.bg-popover').exists()).toBe(true)
    expect(wrapper.find('.border-transparent').exists()).toBe(true)
  })
})
