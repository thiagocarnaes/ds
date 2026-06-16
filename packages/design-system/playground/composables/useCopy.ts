import { ref } from 'vue'

export function useCopy(text: string) {
  const copied = ref(false)

  async function copy(value?: string): Promise<void> {
    await navigator.clipboard.writeText(value ?? text)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1400)
  }

  return { copied, copy }
}
