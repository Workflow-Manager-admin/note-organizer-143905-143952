<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useThemeStore } from './stores/theme'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import router from './router'

const themeStore = useThemeStore()

// Responsive sidebar toggle
const sidebarOpen = ref(false)

// Auto-close sidebar on route change for mobile
watch(
  () => router.currentRoute.value.path,
  () => { sidebarOpen.value = false }
)

// Handle system theme preference
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div :class="['app-root', themeStore.theme]">
    <Sidebar v-model:open="sidebarOpen" />
    <div class="main-content">
      <Topbar 
        :on-sidebar-toggle="() => (sidebarOpen = !sidebarOpen)" 
      />
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}
.main-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
@media (max-width: 900px) {
  .app-root {
    flex-direction: column;
  }
  .main-content {
    min-width: 100vw;
  }
}
</style>
