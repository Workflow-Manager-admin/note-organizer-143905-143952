<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNoteStore } from '../stores/notes'
import { useCategoryStore } from '../stores/categories'
import { useRouter } from 'vue-router'

const props = defineProps<{ noteId?: number | null }>()
const noteStore = useNoteStore()
const catStore = useCategoryStore()
const router = useRouter()

const mode = ref<'edit' | 'new'>(props.noteId ? 'edit' : 'new')

const form = ref<{ title: string; content: string; category_id: number | null }>({
  title: '',
  content: '',
  category_id: null
})

onMounted(async () => {
  await catStore.fetchCategories()
  if (mode.value === 'edit' && props.noteId) {
    const n = await noteStore.fetchNote(props.noteId)
    if (n) {
      form.value.title = n.title
      form.value.content = n.content
      // If n.category_id is undefined, set to null for the form.
      form.value.category_id = typeof n.category_id === 'number' ? n.category_id : null
    }
  }
})

async function saveNote() {
  if (!form.value.title.trim()) {
    alert('Title required')
    return
  }
  // always pass undefined if null (avoid null in category_id)
  const payload: { title: string; content: string; category_id?: number } = {
    title: form.value.title,
    content: form.value.content,
    ...(form.value.category_id != null ? { category_id: form.value.category_id } : {})
  }
  if (mode.value === 'new') {
    const note = await noteStore.createNote(payload)
    if (note) router.push({ name: 'note-detail', params: { id: note.id } })
  } else if (props.noteId) {
    await noteStore.updateNote(props.noteId, payload)
    router.push({ name: 'note-detail', params: { id: props.noteId } })
  }
}
async function deleteNote() {
  if (props.noteId && confirm('Delete this note?')) {
    await noteStore.deleteNote(props.noteId)
    router.push({ name: 'notes' })
  }
}
</script>

<template>
  <div class="note-editor">
    <div class="editor-header">
      <input 
        v-model="form.title"
        class="editor-title"
        type="text" 
        placeholder="Title"
        autofocus
      />
      <select v-model="form.category_id" class="editor-category">
        <option :value="null">No Category</option>
        <option v-for="cat in catStore.categories" :value="cat.id" :key="cat.id">{{ cat.name }}</option>
      </select>
      <button
        v-if="mode === 'edit'"
        class="delete-btn"
        title="Delete"
        @click="deleteNote"
      >🗑️</button>
    </div>
    <textarea 
      v-model="form.content"
      class="editor-content"
      rows="14"
      placeholder="Start your note..."></textarea>
    <button class="save-btn" @click="saveNote">
      {{ mode === 'edit' ? 'Update' : 'Create Note' }}
    </button>
  </div>
</template>

<style scoped>
.note-editor {
  max-width: 630px;
  margin: 1.5rem auto;
  background: #fff;
  border: 1.7px solid #edf0f7;
  box-shadow: 0 2px 10px #223a5e11;
  border-radius: 9px;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.editor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.6rem;
}
.editor-title {
  flex: 1 1 70%;
  font-size: 1.13rem;
  font-weight: 600;
  border: none;
  border-bottom: 2.5px solid #4F8EF7;
  background: transparent;
  padding: 0.36rem 0.3rem;
  margin-right: 1rem;
  outline: none;
  color: #223A5E;
}
.editor-category {
  font-size: 0.96rem;
  border-radius: 7px;
  border: 1.4px solid #dde4ee;
  padding: 0.30rem 0.7rem;
  outline: none;
}
.delete-btn {
  background: none;
  border: none;
  color: #F06161;
  font-size: 1.15rem;
  margin-left: 0.7rem;
  cursor: pointer;
  padding: 0.12rem 0.6rem;
  border-radius: 7px;
  transition: background 0.11s;
}
.delete-btn:hover {
  background: #F7B32B33;
}
.editor-content {
  width: 100%;
  font-size: 1.04rem;
  border-radius: 7px;
  border: 1.5px solid #dde4ee;
  background: #fcfcff;
  min-height: 9rem;
  resize: vertical;
  padding: 0.8rem 0.92rem;
  color: #223a5e;
  outline: none;
  transition: border 0.12s;
}
.save-btn {
  align-self: flex-end;
  background: #4F8EF7;
  color: #fff;
  border-radius: 7px;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 0.56rem 1.7rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 16px #4F8EF730;
  transition: background 0.16s;
}
.save-btn:hover {
  background: #2c69ca;
}
</style>
