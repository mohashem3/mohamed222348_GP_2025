<template>
  <div class="min-h-screen bg-white pt-80 pb-12 px-4 sm:px-8">
    <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">Compare Two Movies</h2>

    <div class="flex flex-col md:flex-row justify-center items-start gap-12">
      <!-- Movie 1 -->
      <div class="w-full max-w-md relative">
        <input
          v-model="search1"
          @input="searchTMDB(1)"
          type="text"
          placeholder="Search Movie 1..."
          class="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        <ul
          v-if="results1.length && search1.trim()"
          class="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-2 z-10"
        >
          <li
            v-for="movie in results1"
            :key="movie.id"
            @click="selectMovie(1, movie)"
            class="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
          >
            {{ movie.title }}
          </li>
        </ul>

        <div v-if="selected1" class="mt-6 flex flex-col items-center gap-4">
          <MovieCard
            :movieId="selected1.id"
            :title="selected1.title"
            :poster="`https://image.tmdb.org/t/p/w500${selected1.poster_path}`"
            :genre="selected1.genre_ids"
            :releaseDate="selected1.release_date"
          />

          <PieChart
            v-if="pieData1"
            :labels="pieData1.labels"
            :values="pieData1.values"
            :colors="pieData1.colors"
          />
        </div>
      </div>

      <!-- VS Circle -->
      <div
        class="rounded-full bg-gray-100 text-xl font-bold w-14 h-14 flex items-center justify-center shadow mt-10 md:mt-28"
      >
        VS
      </div>

      <!-- Movie 2 -->
      <div class="w-full max-w-md relative">
        <input
          v-model="search2"
          @input="searchTMDB(2)"
          type="text"
          placeholder="Search Movie 2..."
          class="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        <ul
          v-if="results2.length && search2.trim()"
          class="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-2 z-10"
        >
          <li
            v-for="movie in results2"
            :key="movie.id"
            @click="selectMovie(2, movie)"
            class="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
          >
            {{ movie.title }}
          </li>
        </ul>

        <div v-if="selected2" class="mt-6 flex flex-col items-center gap-4">
          <MovieCard
            :movieId="selected2.id"
            :title="selected2.title"
            :poster="`https://image.tmdb.org/t/p/w500${selected2.poster_path}`"
            :genre="selected2.genre_ids"
            :releaseDate="selected2.release_date"
          />

          <PieChart
            v-if="pieData2"
            :labels="pieData2.labels"
            :values="pieData2.values"
            :colors="pieData2.colors"
          />
        </div>
      </div>
    </div>
    <!-- Clear Comparison Button -->
    <div class="mt-16 flex justify-center">
      <button
        @click="clearComparison"
        class="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
      >
        Clear Comparison
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import MovieCard from '@/components/MovieCard.vue'
import PieChart from '@/components/charts/PieChart.vue'
import { getReviewsForMovie } from '@/firebase/reviewService'

const search1 = ref('')
const search2 = ref('')
const results1 = ref([])
const results2 = ref([])
const selected1 = ref(null)
const selected2 = ref(null)
const pieData1 = ref(null)
const pieData2 = ref(null)

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const searchTMDB = async (field) => {
  const query = field === 1 ? search1.value : search2.value
  if (!query.trim()) return

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`,
    )
    if (field === 1) results1.value = res.data.results
    else results2.value = res.data.results
  } catch (err) {
    console.error('TMDB search failed:', err)
  }
}

const selectMovie = async (field, movie) => {
  if (field === 1) {
    selected1.value = movie
    search1.value = movie.title
    results1.value = []
    await loadPieChartData(movie.id, 1)
  } else {
    selected2.value = movie
    search2.value = movie.title
    results2.value = []
    await loadPieChartData(movie.id, 2)
  }
}

const loadPieChartData = async (movieId, field) => {
  try {
    const reviews = await getReviewsForMovie(String(movieId))
    const positive = reviews.filter((r) => r.sentiment === 'positive').length
    const negative = reviews.filter((r) => r.sentiment === 'negative').length

    const data = {
      labels: ['Positive', 'Negative'],
      values: [positive, negative],
      colors: ['#10b981', '#ef4444', '#9ca3af'],
    }

    if (field === 1) pieData1.value = data
    else pieData2.value = data
  } catch (err) {
    console.error('Error loading sentiment data:', err)
  }
}

const clearComparison = () => {
  search1.value = ''
  search2.value = ''
  results1.value = []
  results2.value = []
  selected1.value = null
  selected2.value = null
  pieData1.value = null
  pieData2.value = null
}
</script>
