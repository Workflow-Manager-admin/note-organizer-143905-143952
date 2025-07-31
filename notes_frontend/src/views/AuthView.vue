<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const mode = ref(route.name === 'register' ? 'register' : 'login')

const form = ref({ username: '', password: '' })
const errors = ref('')
const working = ref(false)

async function submit() {
  errors.value = ''
  working.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(form.value)
    } else {
      await auth.register(form.value)
      await auth.login(form.value)
    }
    router.push({ name: 'notes' })
  } catch (err) {
    if (err instanceof Error && err.message) {
      errors.value = err.message
    } else {
      errors.value = 'Unknown error'
    }
  }
  working.value = false
}
</script>

<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="submit">
      <h1>{{ mode === 'register' ? 'Register' : 'Login' }}</h1>
      <div class="input-group">
        <input v-model="form.username" placeholder="Username" autocomplete="username" required />
      </div>
      <div class="input-group">
        <input v-model="form.password" placeholder="Password" type="password" autocomplete="current-password" required />
      </div>
      <button class="auth-btn" :disabled="working">
        {{ working ? 'Working...' : (mode === 'login' ? 'Login' : 'Register') }}
      </button>
      <div v-if="errors" class="error-msg">{{ errors }}</div>
      <div class="auth-toggle">
        <span>
          {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
        </span>
        <router-link :to="mode === 'login' ? '/register' : '/login'">
          {{ mode === 'login' ? "Register" : "Log In" }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(120deg, #223A5E 0%, #4F8EF7 100%);
  align-items: center;
  justify-content: center;
  min-height: 500px;
}
.auth-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px #223a5e28;
  padding: 2.7rem 2.1rem 2.3rem 2.1rem;
  min-width: 303px;
  max-width: 312px;
  display: flex;
  flex-direction: column;
  gap: 1.09rem;
}
.auth-form h1 {
  color: #223A5E;
  text-align: center;
  font-weight: 700;
  margin-bottom: 0.2rem;
  letter-spacing: 0.02em;
}
.input-group {
  margin-bottom: 6px;
}
.input-group input {
  width: 100%;
  font-size: 1.07rem;
  padding: 0.7rem;
  border-radius: 7px;
  border: 1.5px solid #c7d7ee;
  background: #f8fafc;
  outline: none;
  color: #162d47;
  font-weight: 500;
  transition: border 0.14s;
}
.input-group input:focus {
  border: 2px solid #4F8EF7;
}
.auth-btn {
  width: 100%;
  background: #F7B32B;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.66rem;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: 0.35rem;
  transition: background 0.1s;
}
.auth-btn:disabled {
  opacity: 0.7;
  background: #4F8EF7;
  cursor: not-allowed;
}
.error-msg {
  color: #F06161;
  text-align: center;
  font-size: 1rem;
  margin-top: 0.16rem;
}
.auth-toggle {
  text-align: center;
  font-size: 0.99rem;
  margin-top: 1rem;
}
.auth-toggle a {
  color: #4F8EF7;
  text-decoration: underline;
  margin-left: 0.3em;
}
</style>
