import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

export const useCategoryStore = defineStore('categories', () => {
  type Category = { id: number, name: string }
  const categories = ref<Category[]>([])

  // PUBLIC_INTERFACE
  async function fetchCategories() {
    categories.value = await api.get<Category[]>('/categories')
  }
  // PUBLIC_INTERFACE
  async function createCategory(name: string) {
    const cat = await api.post<Category>('/categories', { name })
    categories.value.push(cat)
    return cat
  }
  // PUBLIC_INTERFACE
  function categoryName(id: number) {
    return categories.value.find(c => c.id === id)?.name || ''
  }
  return { categories, fetchCategories, createCategory, categoryName }
})
