<script setup lang="ts">
import { BookOpen, ExternalLink, Package } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'

const PACKAGE = '@tcarnaes/design-system'
const VERSION = '0.1.2'

const installCmd = `npm install ${PACKAGE} vue`

const mainTs = `import { createApp } from 'vue'
import App from './App.vue'
import '${PACKAGE}/styles.css'

createApp(App).mount('#app')`

const basicUsage = `<script setup lang="ts">
import { Button, FormField, Input } from '${PACKAGE}'
import { ref } from 'vue'

const email = ref('')
<\/script>

<template>
  <FormField label="Email">
    <Input v-model="email" placeholder="you@company.com" />
  </FormField>
  <Button appearance="primary">Save</Button>
</template>`

const toastUsage = `<script setup lang="ts">
import { Button, ToastHost, useToast } from '${PACKAGE}'

const toast = useToast()

function onSave() {
  toast.success('Changes saved.')
}
<\/script>

<template>
  <ToastHost />
  <Button appearance="primary" @click="onSave">Save</Button>
</template>`

const darkMode = `document.documentElement.classList.toggle('dark', isDark)`

const componentGroups = [
  {
    category: 'Actions',
    items: ['Button', 'IconButton', 'Link'],
  },
  {
    category: 'Forms',
    items: ['Input', 'Textarea', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'Toggle', 'Select', 'Label', 'FormField'],
  },
  {
    category: 'Feedback',
    items: ['Alert', 'Badge', 'Spinner', 'Progress', 'Skeleton', 'Toast', 'ToastHost'],
  },
  {
    category: 'Navigation',
    items: ['Tabs', 'TabList', 'Tab', 'TabPanel', 'Breadcrumb', 'BreadcrumbItem', 'Pagination', 'SidebarMenu*'],
  },
  {
    category: 'Data display',
    items: ['Card', 'Divider', 'Avatar', 'AvatarGroup', 'Lozenge', 'Table*', 'List', 'ListItem', 'EmptyState'],
  },
  {
    category: 'Overlay',
    items: ['Modal', 'Dialog', 'Tooltip', 'Popover', 'Drawer'],
  },
  {
    category: 'Layout',
    items: ['Container', 'Stack', 'Grid', 'AppLayout'],
  },
  {
    category: 'Utils',
    items: ['cn', 'useToast', 'buttonVariants', 'iconography'],
  },
]
</script>

<template>
  <div class="pg-docs">
    <div class="pg-docs-hero pg-playground-panel rounded-2xl p-6 md:p-8">
      <div class="mb-4 flex items-center gap-2">
        <BookOpen :size="16" class="text-primary" />
        <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">Documentation</span>
      </div>
      <h2 class="mb-2 text-2xl font-bold" style="color: var(--pg-text)">Install &amp; use</h2>
      <p class="pg-text-subtle mb-6 max-w-2xl text-sm leading-relaxed">
        Vue 3 component library with design tokens, Tailwind CSS 4, and light/dark mode support.
        Import the CSS once, then use components anywhere in your app.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs"
          style="background: var(--pg-nav-active-bg); color: var(--pg-accent)"
        >
          <Package :size="14" />
          {{ PACKAGE }}@{{ VERSION }}
        </span>
        <a
          href="https://www.npmjs.com/package/@tcarnaes/design-system"
          target="_blank"
          rel="noopener noreferrer"
          class="pg-text-muted inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--pg-accent)]"
        >
          npm
          <ExternalLink :size="12" />
        </a>
        <a
          href="https://github.com/thiagocarnaes/ds"
          target="_blank"
          rel="noopener noreferrer"
          class="pg-text-muted inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--pg-accent)]"
        >
          GitHub
          <ExternalLink :size="12" />
        </a>
      </div>
    </div>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">Requirements</h3>
      <ul class="pg-text-subtle list-inside list-disc space-y-1 text-sm">
        <li>Vue <code class="pg-docs-inline">^3.5.0</code> (peer dependency)</li>
        <li>Node.js 18+</li>
      </ul>
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">1. Install</h3>
      <p class="pg-text-subtle mb-3 text-sm">Add the package and Vue to your project.</p>
      <UsageBlock :code="installCmd" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">2. Import styles</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        Load the compiled CSS in your app entry point before mounting.
      </p>
      <UsageBlock :code="mainTs" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">3. Use components</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        Import named exports from the package. TypeScript types are included.
      </p>
      <UsageBlock :code="basicUsage" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">Toasts</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        Mount <code class="pg-docs-inline">ToastHost</code> once at the root, then call
        <code class="pg-docs-inline">useToast()</code> from any component.
      </p>
      <UsageBlock :code="toastUsage" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">Dark mode</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        Toggle the <code class="pg-docs-inline">dark</code> class on
        <code class="pg-docs-inline">&lt;html&gt;</code> to switch semantic tokens.
      </p>
      <UsageBlock :code="darkMode" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">Exported components</h3>
      <div class="pg-playground-panel overflow-hidden rounded-xl">
        <div
          v-for="group in componentGroups"
          :key="group.category"
          class="border-b px-4 py-3 last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <p class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
            {{ group.category }}
          </p>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="item in group.items"
              :key="item"
              class="pg-docs-tag rounded-md px-2 py-0.5 font-mono text-[10px]"
            >
              {{ item }}
            </code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
