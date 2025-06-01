<template>
  <div class="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-8">
    <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">Compare Two Movies</h2>

    <div class="flex flex-col md:flex-row justify-center items-start gap-12 relative">
      <!-- Movie 1 Panel -->
      <div class="w-full max-w-md relative animate-fade-in" ref="target1">
        <input
          v-model="search1"
          @input="searchTMDB(1)"
          type="text"
          placeholder="Search Movie 1..."
          class="w-full px-6 py-4 rounded-xl border-2 border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 text-gray-800 placeholder-purple-500 font-semibold text-base tracking-wide transition"
        />

        <ul
          v-if="results1.length && search1.trim() && !selected1"
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

        <div
          v-if="selected1 && isVisible1"
          class="mt-6 flex flex-col items-center gap-4 animate-fade-in"
        >
          <MovieCard
            :movieId="selected1.id"
            :title="selected1.title"
            :poster="`https://image.tmdb.org/t/p/w500${selected1.poster_path}`"
            :genre="selected1.genre_ids"
            :releaseDate="selected1.release_date"
          />

          <h3 class="text-xl font-semibold text-gray-700 mb-4 text-center">
            Audience Reaction (AI-Powered)
          </h3>

          <PieChart
            v-if="pieData1"
            :labels="pieData1.labels"
            :values="pieData1.values"
            :colors="pieData1.colors"
          />

          <!-- Summary Card -->
          <div
            v-if="summary1 && !isSummarizing1"
            class="w-full bg-white p-6 rounded-2xl border border-purple-200 shadow-[0_0_60px_rgba(168,85,247,0.3)] ring-4 ring-purple-100"
          >
            <div class="flex justify-center mb-4">
              <div
                class="inline-block px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow"
              >
                AI-Powered Analysis of User Reviews
              </div>
            </div>

            <div
              class="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto mb-6 shadow-inner"
            >
              {{ summary1 }}
            </div>

            <div v-if="positives1.length" class="mb-4">
              <div
                class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-green-700 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-gray-200 mb-3"
              >
                Positive Points
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(item, i) in positives1"
                  :key="'pos1-' + i"
                  class="bg-green-50 border border-green-300 text-green-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <div v-if="negatives1.length">
              <div
                class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-red-700 shadow-[0_0_20px_rgba(248,113,113,0.3)] border border-gray-200 mb-3"
              >
                Negative Points
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(item, i) in negatives1"
                  :key="'neg1-' + i"
                  class="bg-red-50 border border-red-300 text-red-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gradient Divider -->
      <div
        class="hidden md:block w-[2px] h-[720px] bg-gradient-to-b from-purple-400 via-indigo-400 to-pink-400 opacity-60 rounded-full"
      ></div>

      <!-- Movie 2 Panel -->
      <div class="w-full max-w-md relative animate-fade-in" ref="target2">
        <input
          v-model="search2"
          @input="searchTMDB(2)"
          type="text"
          placeholder="Search Movie 2..."
          class="w-full px-6 py-4 rounded-xl border-2 border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-300 text-gray-800 placeholder-rose-500 font-semibold text-base tracking-wide transition"
        />

        <ul
          v-if="results2.length && search2.trim() && !selected2"
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

        <div
          v-if="selected2 && isVisible2"
          class="mt-6 flex flex-col items-center gap-4 animate-fade-in"
        >
          <MovieCard
            :movieId="selected2.id"
            :title="selected2.title"
            :poster="`https://image.tmdb.org/t/p/w500${selected2.poster_path}`"
            :genre="selected2.genre_ids"
            :releaseDate="selected2.release_date"
          />

          <h3 class="text-xl font-semibold text-gray-700 mb-4 text-center">
            Audience Reaction (AI-Powered)
          </h3>

          <PieChart
            v-if="pieData2"
            :labels="pieData2.labels"
            :values="pieData2.values"
            :colors="pieData2.colors"
          />

          <div
            v-if="summary2 && !isSummarizing2"
            class="w-full bg-white p-6 rounded-2xl border border-purple-200 shadow-[0_0_60px_rgba(168,85,247,0.3)] ring-4 ring-purple-100"
          >
            <div class="flex justify-center mb-4">
              <div
                class="inline-block px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow"
              >
                AI-Powered Analysis of User Reviews
              </div>
            </div>

            <div
              class="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto mb-6 shadow-inner"
            >
              {{ summary2 }}
            </div>

            <div v-if="positives2.length" class="mb-4">
              <div
                class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-green-700 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-gray-200 mb-3"
              >
                Positive Points
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(item, i) in positives2"
                  :key="'pos2-' + i"
                  class="bg-green-50 border border-green-300 text-green-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <div v-if="negatives2.length">
              <div
                class="inline-block px-5 py-2 text-base font-semibold rounded-full bg-white text-red-700 shadow-[0_0_20px_rgba(248,113,113,0.3)] border border-gray-200 mb-3"
              >
                Negative Points
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(item, i) in negatives2"
                  :key="'neg2-' + i"
                  class="bg-red-50 border border-red-300 text-red-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Comparison -->
    <div class="mt-20 flex justify-center">
      <button
        @click="clearComparison"
        class="bg-gradient-to-r from-pink-500 to-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full transition duration-200 shadow-lg"
      >
        Clear Comparison
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>

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

const summary1 = ref('')
const summary2 = ref('')
const positives1 = ref([])
const positives2 = ref([])
const negatives1 = ref([])
const negatives2 = ref([])
const isSummarizing1 = ref(false)
const isSummarizing2 = ref(false)

import { useIntersectionObserver } from '@vueuse/core'

const isVisible1 = ref(false)
const isVisible2 = ref(false)

const target1 = ref(null)
const target2 = ref(null)

// Only trigger once on first intersection
useIntersectionObserver(
  target1,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isVisible1.value) {
      isVisible1.value = true
    }
  },
  {
    threshold: 0.1,
  },
)

useIntersectionObserver(
  target2,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isVisible2.value) {
      isVisible2.value = true
    }
  },
  {
    threshold: 0.1,
  },
)
import { getReviewTextsByMovie } from '@/firebase/reviewService'

const summarizeReviewsForMovie = async (movieId, field) => {
  const summaryRef = field === 1 ? summary1 : summary2
  const positivesRef = field === 1 ? positives1 : positives2
  const negativesRef = field === 1 ? negatives1 : negatives2
  const loadingRef = field === 1 ? isSummarizing1 : isSummarizing2

  loadingRef.value = true
  summaryRef.value = ''
  positivesRef.value = []
  negativesRef.value = []

  try {
    const reviewTexts = await getReviewTextsByMovie(String(movieId))

    if (reviewTexts.length === 0) {
      summaryRef.value = 'No reviews available to summarize.'
      return
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: reviewTexts }),
    })

    const data = await res.json()
    summaryRef.value = data.summary
    positivesRef.value = data.positives
    negativesRef.value = data.negatives
  } catch (err) {
    summaryRef.value = 'Failed to generate summary.'
    console.error(err)
  } finally {
    loadingRef.value = false
  }
}

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
    search1.value = ''
    search1.value = movie.title
    results1.value = []
    await loadPieChartData(movie.id, field)
    await summarizeReviewsForMovie(movie.id, field)
  } else {
    selected2.value = movie
    search2.value = ''
    search2.value = movie.title
    results2.value = []
    await loadPieChartData(movie.id, field)
    await summarizeReviewsForMovie(movie.id, field)
  }
}

const loadPieChartData = async (movieId, field) => {
  try {
    const reviews = await getReviewsForMovie(String(movieId))
    const positive = reviews.filter((r) => r.sentiment === 'positive').length
    const negative = reviews.filter((r) => r.sentiment === 'negative').length
    const neutral = reviews.filter((r) => r.sentiment === 'neutral').length

    const data = {
      labels: ['Positive', 'Negative', 'Neutral'],
      values: [positive, negative, neutral],
      colors: ['#10B981', '#EF4444', '#FACC15'], // green, red, yellow
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
