<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

/**
 * ProgressTracker — multi-step progress indicator.
 *
 * Renders an ordered list of steps, each with a visual indicator (circle)
 * showing the completed / current / future state. A connector line is drawn
 * between consecutive steps.
 *
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7
 */

export interface ProgressStep {
  /** Display label shown below the step indicator. */
  label: string
  /** Completion percentage for this step (0–100). */
  percentageComplete: number
}

export interface ProgressTrackerProps {
  /** Array of steps to render. */
  steps: ProgressStep[]
  /** Index (0-based) of the currently active step. */
  currentIndex: number
  /** Accessible label for the overall progress list (`aria-label`). */
  label?: string
}

type StepState = 'completed' | 'current' | 'future'

const props = defineProps<ProgressTrackerProps>()

const emit = defineEmits<{
  /** Emitted when a completed step is clicked; payload is the step index. */
  stepClick: [index: number]
}>()

/** Derive the visual state for step at index `i`. */
function getStepState(i: number): StepState {
  if (props.steps[i]?.percentageComplete === 100) return 'completed'
  if (i === props.currentIndex) return 'current'
  return 'future'
}

/** CSS classes applied to each `<li>` based on its state. */
function stepClasses(i: number): string {
  const state = getStepState(i)
  return cn(
    'relative flex flex-col items-center',
    // Allow clicking on completed steps
    state === 'completed' ? 'cursor-pointer' : 'cursor-default',
  )
}

/** Inline style object for the step indicator circle. */
function indicatorStyle(i: number): Record<string, string> {
  const state = getStepState(i)
  if (state === 'completed') {
    return {
      backgroundColor: 'var(--success)',
      border: '2px solid var(--success)',
      color: 'var(--success-foreground, #fff)',
    }
  }
  if (state === 'current') {
    return {
      backgroundColor: 'transparent',
      border: '2px solid var(--primary)',
      color: 'var(--primary)',
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent)',
    }
  }
  // future
  return {
    backgroundColor: 'transparent',
    border: '2px solid var(--muted-foreground)',
    color: 'var(--muted-foreground)',
  }
}

/** Inline style for the connector line between steps. */
function connectorStyle(i: number): Record<string, string> {
  // The connector is filled (colored) when the step is completed
  const state = getStepState(i)
  return {
    backgroundColor:
      state === 'completed'
        ? 'var(--success)'
        : 'var(--muted-foreground)',
    opacity: state === 'completed' ? '1' : '0.3',
  }
}

/** Label color per state. */
function labelStyle(i: number): Record<string, string> {
  const state = getStepState(i)
  if (state === 'completed') return { color: 'var(--success)' }
  if (state === 'current') return { color: 'var(--primary)', fontWeight: '600' }
  return { color: 'var(--muted-foreground)' }
}

/** Handle click: only emit for completed steps. */
function onStepClick(i: number): void {
  if (getStepState(i) === 'completed') {
    emit('stepClick', i)
  }
}

const stepCount = computed(() => props.steps.length)
</script>

<template>
  <!-- role="list" satisfies REQ 15.6 -->
  <ol
    role="list"
    :aria-label="label"
    class="flex items-start gap-0"
  >
    <li
      v-for="(step, i) in steps"
      :key="i"
      role="listitem"
      :aria-current="i === currentIndex ? 'step' : undefined"
      :class="[stepClasses(i), 'flex-1 flex flex-col items-center']"
      @click="onStepClick(i)"
    >
      <!-- Step row: indicator + connector -->
      <div class="flex w-full items-center">
        <!-- Indicator circle -->
        <span
          class="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-200"
          :style="indicatorStyle(i)"
          aria-hidden="true"
        >
          <!-- Checkmark for completed state -->
          <svg
            v-if="steps[i].percentageComplete === 100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            class="size-4"
            aria-hidden="true"
          >
            <path
              d="M3 8l3.5 3.5L13 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <!-- Step number for non-completed states -->
          <span
            v-else
            class="text-xs font-semibold leading-none"
          >{{ i + 1 }}</span>
        </span>

        <!-- Connector line (shown for all steps except the last) -->
        <span
          v-if="i < stepCount - 1"
          class="h-0.5 flex-1 transition-all duration-200"
          :style="connectorStyle(i)"
          aria-hidden="true"
        />
      </div>

      <!-- Step label -->
      <span
        class="mt-2 text-center text-xs leading-tight"
        :style="labelStyle(i)"
      >{{ step.label }}</span>
    </li>
  </ol>
</template>
