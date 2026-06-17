<script setup lang="ts">
import { computed } from 'vue'
import { Pipette } from 'lucide-vue-next'
import { colorPresets } from '../data/colorPresets'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const props = withDefaults(
  defineProps<{
    presets?: readonly string[]
    label?: string
    size?: 'sm' | 'md'
  }>(),
  {
    presets: () => colorPresets,
    size: 'md',
  },
)

const model = defineModel<string>({ required: true })
const { t } = usePlaygroundLocale()

const swatchSize = computed(() => (props.size === 'sm' ? 'size-4' : 'size-6'))

function normalizeHex(hex: string): string {
  return hex.toLowerCase()
}

const isCustom = computed(
  () => !props.presets.some((preset) => normalizeHex(preset) === normalizeHex(model.value)),
)

function isSelected(color: string): boolean {
  return normalizeHex(color) === normalizeHex(model.value)
}
</script>

<template>
  <div>
    <p
      v-if="label"
      class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]"
    >
      {{ label }}
    </p>
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="color in presets"
        :key="color"
        type="button"
        class="rounded-full transition-transform hover:scale-110"
        :class="swatchSize"
        :style="{
          backgroundColor: color,
          boxShadow: isSelected(color) ? `0 0 10px ${color}` : undefined,
          outline: isSelected(color) ? `2px solid ${color}` : undefined,
        }"
        :aria-label="t('colorPicker.selectColor', { color })"
        @click="model = color"
      />
      <label
        class="relative inline-flex cursor-pointer items-center justify-center rounded-full border border-dashed border-[#4D6A87] transition-colors hover:border-primary"
        :class="swatchSize"
        :style="
          isCustom
            ? {
                backgroundColor: model,
                boxShadow: `0 0 10px ${model}`,
                outline: `2px solid ${model}`,
                borderStyle: 'solid',
                borderColor: model,
              }
            : undefined
        "
        :title="t('colorPicker.pickCustom')"
      >
        <input
          type="color"
          :value="model"
          class="absolute inset-0 cursor-pointer opacity-0"
          @input="model = ($event.target as HTMLInputElement).value"
        />
        <Pipette v-if="!isCustom" :size="size === 'sm' ? 10 : 12" class="text-[#4D6A87]" />
      </label>
      <span v-if="isCustom" class="font-mono text-[10px] text-[#4D6A87]">{{ model }}</span>
    </div>
  </div>
</template>
