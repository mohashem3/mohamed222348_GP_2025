<template>
  <div class="max-w-7xl mx-auto px-4 my-12">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Browse by Genre</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <button
        v-for="genre in genres"
        :key="genre"
        @click="goToGenre(genre)"
        class="py-2 text-sm font-semibold rounded-lg shadow-sm border transition hover:scale-105 duration-200"
        :class="genreStyles[genre.toLowerCase()] || defaultStyle"
      >
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Documentary',
  'Music',
  'Thriller',
  'Adventure',
  'Crime',
]

const genreStyles = {
  action: 'bg-red-50 text-red-600 border-red-300',
  comedy: 'bg-yellow-50 text-yellow-600 border-yellow-300',
  drama: 'bg-purple-50 text-purple-600 border-purple-300',
  fantasy: 'bg-pink-50 text-pink-600 border-pink-300',
  horror: 'bg-gray-100 text-gray-700 border-gray-300',
  romance: 'bg-rose-50 text-rose-600 border-rose-300',
  'sci-fi': 'bg-blue-50 text-blue-600 border-blue-300',
  documentary: 'bg-teal-50 text-teal-600 border-teal-300',
  music: 'bg-indigo-50 text-indigo-600 border-indigo-300',
  thriller: 'bg-orange-50 text-orange-600 border-orange-300',
  adventure: 'bg-sky-50 text-sky-600 border-sky-300',
  crime: 'bg-stone-50 text-stone-600 border-stone-300',
}

const defaultStyle = 'bg-gray-50 text-gray-700 border-gray-300'

const goToGenre = (genre) => {
  router.push({ name: 'Movies', query: { genre } })
}
</script>
