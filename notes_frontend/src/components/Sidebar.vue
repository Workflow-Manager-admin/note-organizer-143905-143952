<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'SidebarNav' })
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../stores/categories'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

const router = useRouter()
const auth = useAuthStore()
const catStore = useCategoryStore()
const localOpen = ref(props.open)

watch(() => props.open, (val) => { localOpen.value = val })
watch(localOpen, (val) => emit('update:open', val))

onMounted(() => {
  if (auth.isAuthenticated) catStore.fetchCategories()
})

function gotoCategory(id: number | null) {
  router.push(id ? { name: 'category-notes', params: { id } } : { name: 'notes' })
  localOpen.value = false
}
async function addCategory() {
  const name = prompt('Category name?')
  if (!name) return
  await catStore.createCategory(name)
}
</script>

<template>
  <nav :class="['sidebar', { open: localOpen }]" v-if="auth.isAuthenticated">
    <div class="sidebar-header">
      <span class="sidebar-title">Categories</span>
      <button class="add-btn" @click="addCategory" title="Add category">+</button>
    </div>
    <ul class="sidebar-list">
      <li :class="{ active: $route.name === 'notes' }" @click="gotoCategory(null)">All Notes</li>
      <li 
        v-for="c in catStore.categories" 
        :key="c.id"
        :class="{ active: Number($route.params.id) === c.id }"
        @click="gotoCategory(c.id)"
      >{{ c.name }}</li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #223A5E;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(.6,-0.4,.3,1.4);
  position: relative;
  z-index: 1050;
  border-right: 2px solid #e4eaf2;
  height: 100vh;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 1.25rem 1rem 0.75rem 1rem;
  color: #F7B32B;
}
.sidebar-title {
  font-size: 1.14rem;
  letter-spacing: 0.032em;
}
.add-btn {
  background: none;
  color: #F7B32B;
  font-weight: 700;
  font-size: 1.5rem;
  border: none;
  border-radius: 1000px;
  cursor: pointer;
}
.sidebar-list {
  margin: 0;
  padding: 0.4rem 0;
  list-style: none;
}
.sidebar-list li {
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  color: #fff;
  border-left: 4px solid transparent;
  transition: background 0.12s, border-left 0.2s;
}
.sidebar-list li:hover, .sidebar-list li.active {
  background: #4F8EF733;
  border-left: 4px solid #F7B32B;
}
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-110%);
    position: absolute;
    left: 0; top: 0;
    bottom: 0;
    z-index: 1002;
    height: 100vh;
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 1px 0 10px #223a5e70;
    background: #223A5E;
  }
}
</style>
