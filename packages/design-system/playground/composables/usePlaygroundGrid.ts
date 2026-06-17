import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type { CategoryKey } from '../i18n/types'

export function usePlaygroundGrid(activeCat: Ref<CategoryKey>) {
  const viewportCols = ref(1)

  function syncViewportCols(): void {
    const w = window.innerWidth
    if (w >= 1024) {
      viewportCols.value = activeCat.value !== 'all' ? 2 : 4
    } else if (w >= 768) {
      viewportCols.value = 2
    } else {
      viewportCols.value = 1
    }
  }

  onMounted(() => {
    syncViewportCols()
    window.addEventListener('resize', syncViewportCols, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', syncViewportCols)
  })

  watch(activeCat, syncViewportCols)

  return { viewportCols }
}
