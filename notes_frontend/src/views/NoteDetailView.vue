<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoteStore } from '../stores/notes'
import type { Note } from '../stores/notes'
import { useCategoryStore } from '../stores/categories'

const noteStore = useNoteStore()
const catStore = useCategoryStore()
const route = useRoute()
const router = useRouter()
const noteId = Number(route.params.id)
const note = ref<Note|null>(null)
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  note.value = await noteStore.fetchNote(noteId)
  loading.value = false
})

function editNote() {
  router.push({ name: 'note-edit', params: { id: noteId } })
}
async function deleteNote() {
  if (window.confirm('Delete this note?')) {
    await noteStore.deleteNote(noteId)
    router.push({ name: 'notes' })
  }
}
</script>

<template>
  <div v-if="loading" class="note-view loading">Loading...</div>
  <div v-else-if="note" class="note-view">
    <div class="note-view-header">
      <h1>{{ note.title }}</h1>
      <span v-if="note.category_id" class="note-view-category">
        {{ catStore.categoryName(note.category_id) }}
      </span>
    </div>
    <div class="note-view-content">{{ note.content }}</div>
    <div class="note-view-meta">
      <span class="note-view-time">Updated: {{ new Date(note.updated_at || note.created_at).toLocaleString() }}</span>
      <button class="edit-btn" @click="editNote">Edit</button>
      <button class="delete-btn" @click="deleteNote">Delete</button>
    </div>
  </div>
  <div v-else class="note-view error">Note not found.</div>
</template>

<style scoped>
.note-view {
  max-width: 620px;
  margin: 1.7rem auto;
  background: #fff;
  border: 1.8px solid #e8ecf7;
  border-radius: 10px;
  padding: 1.6rem 1.7rem;
  box-shadow: 0 2px 10px #4F8EF711;
}
.note-view-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 0.49rem;
}
.note-view-header h1 {
  flex: 1 1 auto;
  font-weight: 700;
  color: #223A5E;
  font-size: 1.3rem;
}
.note-view-category {
  background: #4F8EF7;
  color: #fff;
  font-size: 0.91em;
  padding: 0.21em 0.8em;
  border-radius: 6px;
  font-weight: 500;
}
.note-view-content {
  padding: 1.1rem 0;
  color: #223a5e;
  font-size: 1.05rem;
  min-height: 3.5rem;
  white-space: pre-line;
}
.note-view-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.7rem;
  color: #929292;
  font-size: 0.97rem;
}
.edit-btn, .delete-btn {
  background: #F7B32B;
  color: white;
  padding: 0.37em 0.98em;
  font-weight: 600;
  font-size: 1em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 0.4em;
  transition: background 0.13s;
}
.delete-btn {
  background: #F06161;
}
.edit-btn:hover { background: #dc9000;}
.delete-btn:hover { background: #b22d2d;}
.note-view.loading {
  text-align: center;
  margin: 4rem 0;
  color: #aaa;
}
.note-view.error {
  color: #F06161;
  text-align: center;
  margin: 4rem 0;
}
</style>
