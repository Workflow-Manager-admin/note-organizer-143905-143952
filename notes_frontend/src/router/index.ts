import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/AuthView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/AuthView.vue') },
  { path: '/', name: 'notes', component: () => import('../views/NotesListView.vue'), meta: { requiresAuth: true } },
  { path: '/category/:id', name: 'category-notes', component: () => import('../views/NotesListView.vue'), meta: { requiresAuth: true }, props: true },
  { path: '/notes/new', name: 'note-new', component: () => import('../views/NoteEditView.vue'), meta: { requiresAuth: true } },
  { path: '/notes/:id', name: 'note-detail', component: () => import('../views/NoteDetailView.vue'), meta: { requiresAuth: true }, props: true },
  { path: '/notes/:id/edit', name: 'note-edit', component: () => import('../views/NoteEditView.vue'), meta: { requiresAuth: true }, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    next({ name: 'notes' })
  } else {
    next()
  }
})

export default router
