<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Mail } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { FormField, Input } from '@/index'

const { t } = usePlaygroundLocale()

const email = ref('ana@acme.io')
const withIcon = ref(true)
const mode = ref<'default' | 'helper' | 'error' | 'success'>('default')

const showTrailingIcon = computed(() => mode.value === 'success')

const code = computed(
  () => `<FormField
  label="Email"
  required
  :helper="showHelper ? 'Work email only' : undefined"
  :error="hasError ? 'Invalid email' : undefined"
  :success="isValid"
>
  <template #default="{ id }">
    <div class="relative">
      <Mail
        v-if="withIcon"
        :size="14"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        :id="id"
        v-model="email"
        type="email"
        :class="withIcon ? 'pl-9' : undefined"
        :success="isValid"
      />
      <Check
        v-if="isValid"
        :size="14"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"
      />
    </div>
  </template>
</FormField>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          :style="
            withIcon
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="withIcon = true"
        >
          {{ t('inputsPlayground.modeWithIcon') }}
        </button>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          :style="
            !withIcon
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="withIcon = false"
        >
          {{ t('inputsPlayground.modePlain') }}
        </button>
      </div>

      <FormField
        :label="t('inputsPlayground.fields.email')"
        required
        :helper="mode === 'helper' ? t('inputsPlayground.helpers.emailValid') : undefined"
        :error="mode === 'error' ? 'Invalid email address' : undefined"
        :success="mode === 'success'"
      >
        <template #default="{ id }">
          <div class="relative">
            <Mail
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              v-model="email"
              type="email"
              placeholder="you@company.com"
              :class="withIcon ? (showTrailingIcon ? 'pl-9 pr-9' : 'pl-9') : showTrailingIcon ? 'pr-9' : undefined"
              :error="mode === 'error'"
              :success="mode === 'success'"
            />
            <Check
              v-if="showTrailingIcon"
              :size="14"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"
            />
          </div>
        </template>
      </FormField>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
        <button
          v-for="item in ['default', 'helper', 'error', 'success']"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
          :style="playgroundOptionStyle(mode === item)"
          @click="mode = item as typeof mode"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
