<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useNoteStore } from '../stores/notes'
import { useCategoryStore } from '../stores/categories'
import { useRouter } from 'vue-router'

const props = defineProps<{ categoryId?: number }>()
const noteStore = useNoteStore()
const catStore = useCategoryStore()
const router = useRouter()
const searchTerm = ref('')

onMounted(async () => {
  await noteStore.fetchNotes(props.categoryId ? Number(props.categoryId) : undefined)
})

watch(() => props.categoryId, async (id) => {
  await noteStore.fetchNotes(id ? Number(id) : undefined)
})

const filteredNotes = computed(() => {
  let notes = noteStore.notes
  if (props.categoryId) {
    notes = notes.filter(n => n.category_id === Number(props.categoryId))
  }
  if (searchTerm.value) {
    const s = searchTerm.value.toLowerCase()
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(s) ||
      (n.content || '').toLowerCase().includes(s)
    )
  }
  return notes
})

function openNote(noteId: number) {
  router.push({ name: 'note-detail', params: { id: noteId } })
}
</script>

<template>
  <section class="notes-list-container">
    <div class="note-list-header">
      <input
        v-model="searchTerm"
        class="note-search"
        type="text"
        placeholder="Search notes..."
      />
      <router-link to="/notes/new" class="add-note-btn">+ New Note</router-link>
    </div>
    <ul class="notes-list">
      <li v-for="note in filteredNotes" :key="note.id" class="note-list-item" @click="openNote(note.id)">
        <div class="note-title">{{ note.title }}</div>
        <div class="note-meta">
          <span v-if="note.category_id">
            <span class="note-category-pill">{{ catStore.categoryName(note.category_id) }}</span>
          </span>
          <span class="note-date">{{ new Date(note.updated_at || note.created_at).toLocaleString() }}</span>
        </div>
        <div class="note-excerpt">{{ note.content?.slice(0,120) }}<span v-if="note.content?.length > 120">…</span></div>
      </li>
      <li v-if="filteredNotes.length === 0" class="note-list-empty">No notes found.</li>
    </ul>
  </section>
</template>

<style scoped>
.notes-list-container {
  padding: 1.5rem 0;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}
.note-list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.note-search {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #dde4ee;
  flex: 1;
  font-size: 1rem;
  background: var(--color-background-mute, #f3f4f6);
}
.add-note-btn {
  background: #F7B32B;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.07rem;
  padding: 0.55rem 1.2rem;
  text-decoration: none;
  transition: box-shadow 0.18s;
}
.add-note-btn:hover {
  box-shadow: 0 4px 18px 0 #F7B32B33;
}
.notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.note-list-item {
  border: 1.5px solid #e6eaf2;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 2px 8px #223a5e0d;
  padding: 1.15rem;
  margin-bottom: 0.96rem;
  cursor: pointer;
  transition: border 0.09s, box-shadow 0.12s;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.note-list-item:hover {
  border-color: #4F8EF7;
  box-shadow: 0 2px 24px #4F8EF730;
}
.note-title {
  font-weight: 700;
  font-size: 1.11rem;
  color: #223A5E;
}
.note-meta {
  margin-top: 0.07rem;
  font-size: 0.93rem;
  color: #737c94;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.note-category-pill {
  background: #4F8EF7;
  color: white;
  border-radius: 7px;
  font-size: 0.82rem;
  padding: 0 0.7em;
  margin-right: 0.5rem;
}
.note-date {
  color: #F7B32B;
  font-size: 0.92em;
}
.note-excerpt {
  margin-top: 0.18em;
  color: #45546a;
  font-size: 0.97rem;
}
.note-list-empty {
  color: #aaa;
  text-align: center;
  padding: 2.2rem 0 1.5rem 0;
  font-size: 1.07rem;
}
</style>
