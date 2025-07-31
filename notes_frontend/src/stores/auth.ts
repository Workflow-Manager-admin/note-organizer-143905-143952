import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

const AUTH_KEY = 'auth_user'

type AuthUser = { id: number; username: string }

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  function load() {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      user.value = data.user as AuthUser
      token.value = data.token as string|null
      isAuthenticated.value = !!token.value
      if (token.value) api.setToken(token.value)
    }
  }
  function save() {
    if (token.value) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user: user.value, token: token.value }))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }
  async function login({ username, password }: { username: string; password: string }) {
    const resp = await api.post('/auth/login', { username, password }) as { token: string, user: AuthUser }
    token.value = resp.token
    user.value = resp.user
    isAuthenticated.value = true
    api.setToken(token.value!)
    save()
  }
  async function register({ username, password }: { username: string; password: string }) {
    await api.post('/auth/register', { username, password })
  }
  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    api.setToken(null)
    save()
  }

  load()

  return { user, token, isAuthenticated, load, login, register, logout }
})
