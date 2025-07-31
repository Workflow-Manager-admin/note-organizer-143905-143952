<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'TopbarHeader' })
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import IconMoon from './icons/IconMoon.vue'
import IconSun from './icons/IconSun.vue'

defineProps<{
  onSidebarToggle: () => void
}>()

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <button class="sidebar-toggle" @click="onSidebarToggle" aria-label="Toggle sidebar">&#9776;</button>
    <span class="app-title">Note Organizer</span>
    <div class="topbar-actions" v-if="auth.isAuthenticated">
      <router-link class="username" :to="{ name: 'profile' }">{{ auth.user?.username }}</router-link>
      <button class="theme-toggle-btn" @click="theme.toggleTheme" :aria-label="theme.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        <IconSun v-if="theme.theme === 'light'" />
        <IconMoon v-else />
      </button>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 1.5rem;
  background: var(--color-background-soft, #f8f8f8);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 2px 4px 0 rgba(69, 87, 105, 0.02);
}
.app-title {
  color: #223A5E;
  font-weight: 700;
  letter-spacing: 0.06em;
  font-size: 1.2rem;
  flex: 1;
  margin-left: 1rem;
}
.sidebar-toggle {
  font-size: 2rem;
  background: none;
  border: none;
  color: var(--color-heading,#223A5E);
  cursor: pointer;
  margin-right: 1rem;
  display: none;
}
.topbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.username {
  color: #4F8EF7;
  text-decoration: none;
  font-weight: 500;
  margin-right: 1rem;
}
.logout-btn, .theme-toggle-btn {
  background: none;
  border: none;
  color: #223A5E;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.75rem;
  border-radius: 18px;
  transition: background 0.1s;
}
.logout-btn:hover, .theme-toggle-btn:hover {
  background: #F7B32B30;
}
@media (max-width: 900px) {
  .sidebar-toggle {
    display: block;
  }
  .app-title {
    margin-left: 0;
  }
}
</style>
