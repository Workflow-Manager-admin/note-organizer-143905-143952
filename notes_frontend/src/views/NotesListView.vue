<script setup lang="ts">
import { useRoute } from 'vue-router'
import NoteList from '../components/NoteList.vue'

const route = useRoute()
</script>

<template>
  <NoteList :categoryId="route.params.id ? Number(route.params.id) : undefined" />
</template>
