<template>
  <div class="pl-8 pr-6 pb-12 bg-gray-50 min-h-screen">
    <!-- Main Title -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <!-- Avatar + Welcome -->
    <!-- Avatar + Welcome -->
    <div class="flex items-start gap-2.5 mb-4">
      <!-- Avatar -->
      <div
        class="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-white text-lg font-bold shadow-inner border-2 border-white"
      >
        {{ userInitials }}
      </div>

      <!-- Welcome Text -->
      <div class="mt-2.5 leading-none">
        <p
          class="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text"
        >
          Welcome, {{ userName }}
        </p>
      </div>
    </div>

    <!-- First Row: 2 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <!-- Total Reviews -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Total Reviews
        </h3>
        <p class="text-3xl font-bold text-indigo-600">
          {{ reviews.length }}
        </p>
      </div>

      <!-- Most Reviewed Genre -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Most Reviewed Genre
        </h3>
        <p class="text-xl font-bold text-pink-600">
          {{ mostReviewedGenre || 'N/A' }}
        </p>
      </div>
    </div>

    <!-- Animated KPI Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <KpiCard
        title="Your Top Rated Movies"
        :items="topRatedMovies"
        color="text-green-600"
        titleClass="text-sm font-semibold text-gray-500 uppercase tracking-wide"
      />
      <KpiCard
        title="Your Top Rated Actors"
        :items="topActors"
        color="text-blue-600"
        titleClass="text-sm font-semibold text-gray-500 uppercase tracking-wide"
      />
      <KpiCard
        title="Your Top Rated Directors"
        :items="topDirectors"
        color="text-purple-600"
        titleClass="text-sm font-semibold text-gray-500 uppercase tracking-wide"
      />
    </div>

    <!-- All Visual Charts -->
    <VisualCharts />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getReviewsByUser } from '@/firebase/reviewService'
import { currentUser } from '@/firebase/userState'
import { db } from '@/firebase/firebaseConfig'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getGenreMap } from '@/services/tmdb'
import KpiCard from '@/components/kpiCard.vue'
import VisualCharts from '@/components/VisualCharts.vue'

// State
const reviews = ref([])
const mostReviewedGenre = ref('')
const topRatedMovies = ref([])
const topActors = ref([])
const topDirectors = ref([])

const userName = computed(() => currentUser.value?.displayName || 'User')
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

onMounted(async () => {
  if (!currentUser.value?.uid) return
  const userId = currentUser.value.uid

  // 1. Fetch user's reviews
  reviews.value = await getReviewsByUser(userId)

  // 2. Most Reviewed Genre
  const genreMap = await getGenreMap()
  const genreCount = {}
  for (const review of reviews.value) {
    const genreId = review.genre_ids?.[0]
    if (genreId) {
      genreCount[genreId] = (genreCount[genreId] || 0) + 1
    }
  }
  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  mostReviewedGenre.value = sortedGenres.length ? genreMap[sortedGenres[0][0]] || 'Unknown' : 'N/A'

  // 3. Top Rated Movies (only 5-star ratings)
  const fiveStarMovies = reviews.value.filter((r) => r.rating === 5 && r.movieTitle)
  const uniqueTitles = [...new Set(fiveStarMovies.map((r) => r.movieTitle))]
  topRatedMovies.value = uniqueTitles.slice(0, 3)

  // 4. Top Rated Actors and Directors (only 5-star ratings)
  const q = query(collection(db, 'users', userId, 'cast_ratings'), orderBy('rating', 'desc'))
  const snapshot = await getDocs(q)

  const actors = []
  const directors = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    if (data.rating === 5) {
      if (data.role === 'Actor') actors.push(data)
      else if (data.role === 'Director') directors.push(data)
    }
  })

  topActors.value = actors.slice(0, 3).map((a) => a.castName)
  topDirectors.value = directors.slice(0, 3).map((d) => d.castName)
})
</script>
