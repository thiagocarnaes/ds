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
import { FormField, Input } from '@/index'

const showPassword = ref(false)
const withIcon = ref(true)
</script>

<template>
  <PlayCard label="Text Field" accent-color="#00E5B0" tag="with icon · plain">
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
        With icon
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
        Aa Plain
      </button>
    </div>
    <div class="grid grid-cols-2 gap-x-4 gap-y-3">
      <FormField label="Full name">
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
      <FormField label="Email" helper="✓ Valid address" success required>
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
      <FormField label="Password">
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
      <FormField label="Username" error="Username already taken">
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
      <FormField label="Phone">
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
      <FormField label="Website" helper="Locked by admin">
        <template #default="{ id }">
          <div class="relative">
            <Globe
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              placeholder="https://..."
              disabled
              :class="withIcon ? 'pl-9' : undefined"
            />
          </div>
        </template>
      </FormField>
    </div>
    <div class="mt-4 flex flex-wrap gap-3 text-[10px] text-[#4D6A87]">
      <span>● default</span>
      <span style="color: #00d4ff">● focus</span>
      <span style="color: #ff3d57">● error</span>
      <span style="color: #00e5b0">● success</span>
      <span>● disabled</span>
    </div>
  </PlayCard>
</template>
