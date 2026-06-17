<script setup lang="ts">
import { computed } from 'vue'
import { Zap } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { messages, t } = usePlaygroundLocale()

const preview = computed(() => messages.value.chatPlayground.preview)
</script>

<template>
  <PlayCard :label="t('cards.chat.label')" accent-color="#A78BFA" :tag="t('cards.chat.tag')">
    <template #icon><Zap :size="14" /></template>
    <div class="flex h-full flex-col gap-4">
      <div class="pg-chat-surface flex-1 space-y-3 overflow-y-auto rounded-xl p-4">
        <div class="pg-chat-user-bubble ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs">
          {{ preview.userQuestion1 }}
        </div>
        <div class="flex max-w-[85%] gap-2">
          <span class="mt-1 text-primary"><Zap :size="12" /></span>
          <p class="pg-chat-ai-bubble rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed">
            {{ preview.assistantAnswer1 }}
          </p>
        </div>
        <div class="pg-chat-user-bubble ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs">
          {{ preview.userQuestion2 }}
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
    </div>
  </PlayCard>
</template>
