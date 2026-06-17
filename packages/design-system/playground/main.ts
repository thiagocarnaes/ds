import { createApp } from 'vue'
import App from './App.vue'
import '../src/styles/index.css'
import './styles/playground.css'

const savedTheme = localStorage.getItem('ds-playground-theme')
const isDark = savedTheme !== 'light'
document.documentElement.classList.toggle('dark', isDark)
document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'

const savedLocale = localStorage.getItem('ds-playground-locale')
const locale = savedLocale === 'en' || savedLocale === 'pt-BR' ? savedLocale : 'en'
document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en'

createApp(App).mount('#app')
