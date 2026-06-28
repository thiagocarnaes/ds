<script setup lang="ts">
import { computed } from 'vue'
import { changelogEntries, type ChangelogType } from '../data/changelogData'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t, locale } = usePlaygroundLocale()

// Show at most 4 entries, filter out any with empty changes arrays
const entries = computed(() =>
  changelogEntries
    .slice(0, 4)
    .filter(entry => entry.changes.length > 0)
)

// Badge styling per change type
function badgeClass(type: ChangelogType): string {
  switch (type) {
    case 'Added':
      return 'bg-green-500/20 text-green-400'
    case 'Changed':
      return 'bg-cyan-500/20 text-cyan-400'
    case 'Fixed':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-green-500/20 text-green-400'
  }
}

// i18n label per change type
function typeLabel(type: ChangelogType): string {
  switch (type) {
    case 'Added':
      return t('homeChangelog.typeAdded')
    case 'Changed':
      return t('homeChangelog.typeChanged')
    case 'Fixed':
      return t('homeChangelog.typeFixed')
    default:
      return type
  }
}

// Format ISO date string to a readable form (e.g. "Jun 16, 2026")
function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const localeStr = locale.value === 'pt-BR' ? 'pt-BR' : 'en-US'
  return date.toLocaleDateString(localeStr, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <!-- Visible only on viewports >= 1024px -->
  <section
    class="hidden lg:block mb-10 lg:mb-14"
    :aria-label="t('homeChangelog.sectionTitle')"
  >
    <h2
      class="mb-6 text-xs font-semibold uppercase tracking-widest"
      style="color: var(--pg-text-muted)"
    >
      {{ t('homeChangelog.sectionTitle') }}
    </h2>

    <div class="flex flex-col gap-4">
      <div
        v-for="entry in entries"
        :key="entry.version"
        class="changelog-entry rounded-xl p-5"
      >
        <!-- Entry header: version + date -->
        <div class="mb-3 flex items-center justify-between gap-4">
          <span
            class="font-mono text-sm font-semibold"
            style="color: var(--pg-text)"
          >
            v{{ entry.version }}
          </span>
          <span
            class="text-xs"
            style="color: var(--pg-text-muted)"
          >
            {{ formatDate(entry.date) }}
          </span>
        </div>

        <!-- Changes list -->
        <ul class="flex flex-col gap-2">
          <li
            v-for="(change, idx) in entry.changes"
            :key="idx"
            class="flex items-start gap-2.5"
          >
            <!-- Type badge -->
            <span
              class="mt-0.5 inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
              :class="badgeClass(change.type)"
            >
              {{ typeLabel(change.type) }}
            </span>
            <!-- Change description -->
            <span
              class="text-xs leading-relaxed"
              style="color: var(--pg-text-subtle)"
            >
              {{ change.desc }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.changelog-entry {
  background: linear-gradient(135deg, var(--pg-card-from), var(--pg-card-to));
  border: 1px solid var(--pg-card-border);
}
</style>
