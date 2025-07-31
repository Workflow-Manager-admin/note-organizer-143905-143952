import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

export type Note = {
  id: number
  title: string
  content: string
  category_id?: number
  created_at: string
  updated_at?: string
}

// PUBLIC_INTERFACE
export const useNoteStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])

  async function fetchNotes(category_id?: number) {
    notes.value = await api.get<Note[]>('/notes', category_id ? { category_id } : undefined)
    return notes.value
  }
  async function fetchNote(id: number) {
    return await api.get<Note>(`/notes/${id}`)
  }
  async function createNote(data: Partial<Note>) {
    const note = await api.post<Note>('/notes', data)
    notes.value.push(note)
    return note
  }
  async function updateNote(id: number, data: Partial<Note>) {
    const note = await api.put<Note>(`/notes/${id}`, data)
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx !== -1) notes.value[idx] = note
    return note
  }
  async function deleteNote(id: number) {
    await api.delete(`/notes/${id}`)
    notes.value = notes.value.filter(n => n.id !== id)
  }

  return { notes, fetchNotes, fetchNote, createNote, updateNote, deleteNote }
})
