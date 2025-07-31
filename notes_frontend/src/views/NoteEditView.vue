<script setup lang="ts">
import { useRoute } from 'vue-router'
import NoteEditor from '../components/NoteEditor.vue'
const route = useRoute()
</script>

<template>
  <NoteEditor :noteId="route.params.id ? Number(route.params.id) : null" />
</template>
