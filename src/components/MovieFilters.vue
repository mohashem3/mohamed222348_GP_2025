<script setup>
import { ref, watch, defineEmits } from 'vue'

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 53, name: 'Thriller' },
  { id: 27, name: 'Horror' },
]

const selectedGenres = ref([])
const emit = defineEmits(['genre-filter'])

watch(selectedGenres, () => {
  emit('genre-filter', selectedGenres.value)
})
</script>

<template>
  <aside class="bg-white rounded-xl shadow p-6 space-y-8">
    <div>
      <h3 class="text-sm font-bold text-gray-800 mb-3">Genres</h3>
      <ul class="space-y-2">
        <li v-for="genre in genres" :key="genre.id">
          <label class="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              class="form-checkbox text-pink-600"
              :value="genre.id"
              v-model="selectedGenres"
            />
            <span>{{ genre.name }}</span>
          </label>
        </li>
      </ul>
    </div>
  </aside>
</template>
