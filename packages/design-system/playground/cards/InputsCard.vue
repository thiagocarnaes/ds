<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { FormField, Input } from '@/index'

const { t } = usePlaygroundLocale()

const showPassword = ref(false)
const withIcon = ref(true)
</script>

<template>
  <PlayCard :label="t('cards.inputs.label')" accent-color="#00E5B0" :tag="t('cards.inputs.tag')">
    <template #icon><Mail :size="14" /></template>
    <div class="mb-4 flex gap-2">
      <button
        type="button"
        class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
        :style="
          withIcon
            ? { background: 'rgba(0,229,176,0.15)', color: '#00E5B0' }
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
            ? { background: 'rgba(0,229,176,0.15)', color: '#00E5B0' }
            : { color: '#4D6A87' }
        "
        @click="withIcon = false"
      >
        {{ t('inputsPlayground.modePlain') }}
      </button>
    </div>
    <div class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      <FormField :label="t('inputsPlayground.fields.fullName')">
        <template #default="{ id }">
          <div class="relative">
            <User
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              model-value="Ana Martins"
              :class="withIcon ? 'pl-9' : undefined"
            />
          </div>
        </template>
      </FormField>
      <FormField
        :label="t('inputsPlayground.fields.email')"
        :helper="t('inputsPlayground.helpers.emailValid')"
        success
        required
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
              model-value="ana@acme.io"
              success
              :class="withIcon ? 'pl-9 pr-9' : 'pr-9'"
            />
            <Check
              :size="14"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"
            />
          </div>
        </template>
      </FormField>
      <FormField :label="t('inputsPlayground.fields.password')">
        <template #default="{ id }">
          <div class="relative">
            <Lock
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              :type="showPassword ? 'text' : 'password'"
              model-value="••••••••"
              :class="withIcon ? 'pl-9 pr-9' : 'pr-9'"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="14" />
              <Eye v-else :size="14" />
            </button>
          </div>
        </template>
      </FormField>
      <FormField
        :label="t('inputsPlayground.fields.username')"
        :error="t('inputsPlayground.helpers.usernameTaken')"
      >
        <template #default="{ id }">
          <div class="relative">
            <User
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              model-value="ana_dev"
              error
              :class="withIcon ? 'pl-9 pr-9' : 'pr-9'"
            />
            <AlertCircle
              :size="14"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
            />
          </div>
        </template>
      </FormField>
      <FormField :label="t('inputsPlayground.fields.phone')">
        <template #default="{ id }">
          <div class="relative">
            <Phone
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              model-value="+55 11 99999-9999"
              :class="withIcon ? 'pl-9' : undefined"
            />
          </div>
        </template>
      </FormField>
      <FormField
        :label="t('inputsPlayground.fields.website')"
        :helper="t('inputsPlayground.helpers.websiteLocked')"
      >
        <template #default="{ id }">
          <div class="relative">
            <Globe
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              :placeholder="t('inputsPlayground.websitePlaceholder')"
              disabled
              :class="withIcon ? 'pl-9' : undefined"
            />
          </div>
        </template>
      </FormField>
    </div>
    <div class="mt-4 flex flex-wrap gap-3 text-[10px] text-[#4D6A87]">
      <span>● {{ t('inputsPlayground.states.default') }}</span>
      <span style="color: #00d4ff">● {{ t('inputsPlayground.states.focus') }}</span>
      <span style="color: #ff3d57">● {{ t('inputsPlayground.states.error') }}</span>
      <span style="color: #00e5b0">● {{ t('inputsPlayground.states.success') }}</span>
      <span>● {{ t('inputsPlayground.states.disabled') }}</span>
    </div>
  </PlayCard>
</template>
