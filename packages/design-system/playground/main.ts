import { createApp } from 'vue'
import App from './App.vue'
import '../src/styles/index.css'
import './styles/playground.css'

const savedTheme = localStorage.getItem('ds-playground-theme')
const isDark = savedTheme !== 'light'
document.documentElement.classList.toggle('dark', isDark)
document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'

createApp(App).mount('#app')
