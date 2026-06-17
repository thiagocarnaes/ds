<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Checkbox, Switch } from '@/index'

const { messages, t } = usePlaygroundLocale()

const labelOptions = ['terms', 'newsletter', 'twoFactor', 'partial'] as const
type CheckboxLabelKey = (typeof labelOptions)[number]

const stateOptions = ['unchecked', 'checked', 'indeterminate'] as const
type CheckboxMode = (typeof stateOptions)[number]

const labelKey = ref<CheckboxLabelKey>('terms')
const mode = ref<CheckboxMode>('checked')
const checked = ref(true)
const indeterminate = ref(false)
const disabled = ref(false)

const checkboxLabels = computed(() => messages.value.controlsPlayground.drawerCheckboxes)
const currentLabel = computed(() => checkboxLabels.value[labelKey.value])
const useCycleIndeterminate = computed(() => mode.value === 'indeterminate')

function applyMode(next: CheckboxMode): void {
  mode.value = next
  if (next === 'unchecked') {
    checked.value = false
    indeterminate.value = false
    return
  }
  if (next === 'checked') {
    checked.value = true
    indeterminate.value = false
    return
  }
  checked.value = false
  indeterminate.value = true
}

const code = computed(() => {
  const lines = ['<Checkbox']

  if (mode.value === 'indeterminate') {
    lines.push('  v-model="partial"')
    lines.push('  :indeterminate="isIndeterminate"')
    lines.push('  cycle-indeterminate')
    lines.push('  @update:indeterminate="isIndeterminate = $event"')
  } else {
    lines.push('  v-model="checked"')
  }

  if (disabled.value) lines.push('  disabled')

  lines.push('>', `  ${currentLabel.value}`, '</Checkbox>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="pg-playground-preview rounded-xl p-4">
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox
            :key="`${mode}-${disabled}-${labelKey}`"
            v-model="checked"
            :indeterminate="indeterminate"
            :cycle-indeterminate="useCycleIndeterminate"
            :disabled="disabled"
            @update:indeterminate="indeterminate = $event"
          >
            {{ currentLabel }}
          </Checkbox>
        </div>
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">label</p>
        <button
          v-for="item in labelOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(labelKey === item)"
          @click="labelKey = item"
        >
          {{ checkboxLabels[item] }}
        </button>
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
        <button
          v-for="item in stateOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(mode === item)"
          @click="applyMode(item)"
        >
          {{ item }}
        </button>
      </div>

      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <Switch v-model="disabled" size="sm" />
        disabled
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
