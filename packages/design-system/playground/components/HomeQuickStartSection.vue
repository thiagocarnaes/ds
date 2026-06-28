<script setup lang="ts">
import { ref } from 'vue'
import { Terminal, Copy, Check, BookOpen } from 'lucide-vue-next'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const emit = defineEmits<{
  docs: []
}>()

const { t } = usePlaygroundLocale()

const copied = ref(false)
const canCopy = ref(typeof navigator !== 'undefined' && !!navigator.clipboard)

const installCmd = 'npm install @tcarnaes/design-system'
const importSnippet = "import { Button } from '@tcarnaes/design-system'"

async function copyToClipboard(text: string): Promise<void> {
  if (!canCopy.value) return
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

function handleDocsClick(): void {
  emit('docs')
}
</script>

<template>
  <section class="mb-10 lg:mb-14" :aria-label="t('homeQuickStart.sectionTitle')">
    <h2 class="mb-6 text-xs font-semibold uppercase tracking-widest" style="color: var(--pg-text-muted)">
      {{ t('homeQuickStart.sectionTitle') }}
    </h2>

    <div class="quick-start-card flex flex-col gap-5 rounded-xl p-5">
      <!-- Install command -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium" style="color: var(--pg-text-muted)">
          {{ t('homeQuickStart.installLabel') }}
        </span>
        <div class="code-block flex items-center justify-between gap-3 rounded-lg px-4 py-3">
          <div class="flex min-w-0 items-center gap-2">
            <Terminal
              :size="14"
              aria-hidden="true"
              class="shrink-0"
              style="color: var(--pg-accent)"
            />
            <code class="truncate text-xs font-mono" style="color: var(--pg-text)">
              {{ installCmd }}
            </code>
          </div>

          <!-- Copy button -->
          <button
            v-if="canCopy"
            type="button"
            class="copy-btn shrink-0 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150"
            :aria-label="copied ? t('homeQuickStart.copiedLabel') : t('homeQuickStart.copyAriaLabel')"
            @click="copyToClipboard(installCmd)"
          >
            <Check
              v-if="copied"
              :size="12"
              aria-hidden="true"
              style="color: var(--pg-accent)"
            />
            <Copy
              v-else
              :size="12"
              aria-hidden="true"
            />
            <span>{{ copied ? t('homeQuickStart.copiedLabel') : '' }}</span>
          </button>
        </div>
      </div>

      <!-- Import snippet -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium" style="color: var(--pg-text-muted)">
          {{ t('homeQuickStart.importLabel') }}
        </span>
        <div class="code-block rounded-lg px-4 py-3">
          <code class="text-xs font-mono" style="color: var(--pg-text)">
            {{ importSnippet }}
          </code>
        </div>
      </div>

      <!-- View full docs link -->
      <div class="flex items-center">
        <button
          type="button"
          class="docs-link inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
          :aria-label="`${t('homeQuickStart.docsLink')} — navigate to full documentation`"
          @click="handleDocsClick"
        >
          <BookOpen
            :size="13"
            aria-hidden="true"
          />
          {{ t('homeQuickStart.docsLink') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quick-start-card {
  background: linear-gradient(135deg, var(--pg-card-from), var(--pg-card-to));
  border: 1px solid var(--pg-card-border);
}

.code-block {
  background: var(--pg-surface);
  border: 1px solid var(--pg-border);
}

.copy-btn {
  background: var(--pg-nav-active-bg);
  color: var(--pg-text-muted);
  border: 1px solid var(--pg-border);
}

.copy-btn:hover {
  background: var(--pg-hover-bg);
  color: var(--pg-text);
  border-color: var(--pg-card-border-hover);
}

.copy-btn:focus-visible {
  outline: 2px solid var(--pg-accent);
  outline-offset: 2px;
}

.docs-link {
  color: var(--pg-accent);
}

.docs-link:hover {
  opacity: 0.8;
}

.docs-link:focus-visible {
  outline: 2px solid var(--pg-accent);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
