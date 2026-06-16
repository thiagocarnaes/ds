<script setup lang="ts">
import { Maximize2, Zap } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'

defineEmits<{ open: [] }>()
</script>

<template>
  <PlayCard label="AI Chat" accent-color="#A78BFA" tag="new">
    <template #icon><Zap :size="14" /></template>
    <div class="flex h-full flex-col gap-4">
      <div class="pg-chat-surface flex-1 space-y-3 overflow-y-auto rounded-xl p-4">
        <div class="pg-chat-user-bubble ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs">
          Tell me about the Button component
        </div>
        <div class="flex max-w-[85%] gap-2">
          <span class="mt-1 text-primary"><Zap :size="12" /></span>
          <p class="pg-chat-ai-bubble rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed">
            Button supports variants: primary, secondary, outline, ghost, and destructive. Use primary for the main CTA.
          </p>
        </div>
        <div class="pg-chat-user-bubble ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs">
          What about design tokens?
        </div>
        <div class="flex gap-1 px-3 py-2">
          <span class="pg-chat-typing-dot size-1.5 animate-pulse rounded-full" />
          <span
            class="pg-chat-typing-dot size-1.5 animate-pulse rounded-full"
            style="animation-delay: 0.15s"
          />
          <span
            class="pg-chat-typing-dot size-1.5 animate-pulse rounded-full"
            style="animation-delay: 0.3s"
          />
        </div>
      </div>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-medium text-[#7BA3C8] transition-colors hover:text-primary"
        style="border: 1px solid rgba(0,212,255,0.12); background: rgba(0,212,255,0.04)"
        @click="$emit('open')"
      >
        <Maximize2 :size="14" />
        Open chat playground
      </button>
    </div>
  </PlayCard>
</template>
