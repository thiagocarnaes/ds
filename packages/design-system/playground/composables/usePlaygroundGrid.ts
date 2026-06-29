import { onMounted, onUnmounted, ref } from 'vue'

export function usePlaygroundGrid() {
  const viewportCols = ref(4)

  function syncViewportCols(): void {
    const w = window.innerWidth
    if (w >= 1024) {
      viewportCols.value = 4
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

  return { viewportCols }
}
