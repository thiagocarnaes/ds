<script setup lang="ts">
import { computed } from 'vue'
import { Copy } from 'lucide-vue-next'
import { useCopy } from '../composables/useCopy'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { highlightUsage } from '../utils/highlightUsage'

const props = defineProps<{
  code: string
}>()

const { t } = usePlaygroundLocale()
const { copied, copy } = useCopy(props.code)
const highlighted = computed(() => highlightUsage(props.code))
</script>

<template>
  <div class="pg-usage-dark ds-usage-block min-w-0">
    <div class="mb-2 flex items-center justify-between gap-3">
      <p class="pg-usage-label font-mono text-[9px] uppercase tracking-wider">{{ t('usage.label') }}</p>
      <button
        type="button"
        class="pg-usage-copy inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] transition-colors"
        @click="copy(code)"
      >
        <Copy :size="12" />
        {{ copied ? t('usage.copied') : t('usage.copy') }}
      </button>
    </div>
    <pre
      class="pg-usage-code ds-usage-code rounded-lg p-3 font-mono text-[10px] leading-relaxed"
    ><code v-html="highlighted" /></pre>
  </div>
</template>
