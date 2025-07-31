import { defineStore } from 'pinia'
import { ref } from 'vue'

const THEME_KEY = 'theme_preference'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')

  function setTheme(val: 'light' | 'dark') {
    theme.value = val
    localStorage.setItem(THEME_KEY, val)
    document.documentElement.classList.toggle('dark', val === 'dark')
  }
  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }
  return { theme, setTheme, toggleTheme, initTheme }
})
