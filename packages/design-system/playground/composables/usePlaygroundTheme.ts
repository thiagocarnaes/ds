import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'ds-playground-theme'

function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

export function usePlaygroundTheme() {
  const isDark = ref(true)

  function toggleTheme(): void {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    isDark.value = saved !== 'light'
    applyTheme(isDark.value)
  })

  return { isDark, toggleTheme }
}
