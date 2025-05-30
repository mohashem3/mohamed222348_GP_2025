<template>
  <div class="profile-wrapper">
    <!-- Full-width wrapper aligned under navbar -->
    <div class="flex w-full min-h-screen pt-24 mb-24 px-10">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-md border-r px-6 py-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <UserIcon class="w-5 h-5 text-indigo-600" />
          Profile
        </h2>

        <ul class="space-y-3 text-sm">
          <li>
            <button @click="activeTab = 'reviews'" :class="tabClasses('reviews')">
              <DocumentTextIcon class="w-5 h-5" />
              Review History
            </button>
          </li>
          <li>
            <button @click="activeTab = 'watchlist'" :class="tabClasses('watchlist')">
              <HeartIcon class="w-5 h-5" />
              Watchlist
            </button>
          </li>
          <li>
            <button @click="activeTab = 'info'" :class="tabClasses('info')">
              <UserCircleIcon class="w-5 h-5" />
              Personal Info
            </button>
          </li>
          <li>
            <button @click="activeTab = 'recommendations'" :class="tabClasses('recommendations')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L16.5 12l-6.75-5v10z"
                />
              </svg>
              Recommendations
            </button>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <section class="flex-1 bg-gray-50 px-10 py-8">
        <!-- Header & Filter for REVIEWS only -->
        <div v-if="activeTab === 'reviews'" class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ activeTabTitle }} ({{ filteredReviews.length }})
          </h2>

          <div class="flex justify-end">
            <select
              v-model="filterOption"
              class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="positive">Show Positive Reviews</option>
              <option value="negative">Show Negative Reviews</option>
              <option value="neutral">Show Neutral Reviews</option>
            </select>
          </div>
        </div>

        <!-- REVIEW HISTORY TAB -->
        <div v-if="activeTab === 'reviews'">
          <div v-if="paginatedReviews.length">
            <div v-for="review in paginatedReviews" :key="review.id" class="border-b pb-6 mb-6">
              <div class="flex justify-between items-center mb-1">
                <div
                  @click="goToMovie(review.movieId, review.movieTitle)"
                  class="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition"
                >
                  {{ review.movieTitle }}
                </div>
                <span
                  class="inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide transition-shadow duration-300 ease-in-out text-center min-w-[140px]"
                  :class="[
                    review.sentiment === 'positive'
                      ? 'bg-green-100 text-green-800 shadow-[0_0_15px_4px_rgba(74,222,128,0.5)]'
                      : review.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 shadow-[0_0_15px_4px_rgba(248,113,113,0.5)]'
                        : 'bg-yellow-100 text-yellow-800 shadow-[0_0_15px_4px_rgba(234,179,8,0.5)]',
                  ]"
                  :title="`This is how our AI interpreted the review sentiment with ${review.confidence || 100}% confidence.`"
                >
                  {{ review.sentiment.toUpperCase() }}
                  <template v-if="review.confidence !== undefined && review.confidence !== null">
                    ({{ review.confidence }}%)
                  </template>
                </span>
              </div>

              <p class="text-gray-500 text-sm mb-1">
                {{ review.createdAtFormatted }}
              </p>

              <div class="flex items-center gap-1 text-yellow-400 mb-1">
                <template v-for="n in 5" :key="n">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4"
                    :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    <path
                      d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 20.077
                      4.665 24 6 15.281 0 9.423l8.332-1.268z"
                    />
                  </svg>
                </template>
              </div>

              <p class="text-gray-700 leading-relaxed">
                {{ review.reviewText }}
              </p>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center mt-6 space-x-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border text-sm font-medium"
              >
                Prev
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium',
                  page === currentPage ? 'bg-indigo-500 text-white' : 'border',
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
          <p v-else class="text-gray-500">You haven’t written any reviews yet.</p>
        </div>

        <!-- WATCHLIST -->
        <div v-if="activeTab === 'watchlist'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              {{ activeTabTitle }} ({{ watchlistMovies.length }})
            </h2>

            <button
              @click="handleClearWatchlist"
              class="bg-red-100 hover:bg-red-200 text-red-800 font-medium px-4 py-2 rounded transition text-sm"
              :disabled="!watchlistMovies.length"
            >
              Clear Watchlist
            </button>
          </div>

          <div v-if="paginatedWatchlist.length">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <MovieCard
                v-for="movie in paginatedWatchlist"
                :key="movie.movieId"
                :movie-id="movie.movieId"
                :title="movie.title"
                :poster="movie.poster"
                :genre="movie.genre || []"
                :release-date="movie.releaseDate || ''"
                @removed="removeFromWatchlistState"
              />
            </div>

            <!-- Watchlist Pagination -->
            <div class="flex justify-center gap-2">
              <button
                @click="changeWatchlistPage(watchlistPage - 1)"
                :disabled="watchlistPage === 1"
                class="px-3 py-1 rounded border text-sm font-medium"
              >
                Prev
              </button>

              <button
                v-for="page in totalWatchlistPages"
                :key="page"
                @click="changeWatchlistPage(page)"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium',
                  page === watchlistPage ? 'bg-indigo-500 text-white' : 'border',
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="changeWatchlistPage(watchlistPage + 1)"
                :disabled="watchlistPage === totalWatchlistPages"
                class="px-3 py-1 rounded border text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>

          <p v-else class="text-gray-500">Your watchlist is empty.</p>
        </div>

        <!-- PERSONAL INFO TAB -->
        <div
          v-if="activeTab === 'info'"
          class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl px-10 py-12 space-y-10"
        >
          <!-- Avatar -->
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg"
            >
              {{ avatarInitials }}
            </div>
            <p class="text-sm text-gray-500 mt-2">Avatar generated from your name</p>
          </div>

          <!-- Editable Fields -->
          <div class="space-y-8">
            <!-- Username -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <div class="flex items-center gap-4">
                <input
                  v-model="editableFields.name"
                  :readonly="!editMode.name"
                  class="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                />
                <div v-if="editMode.name" class="flex gap-2">
                  <button
                    @click="saveName"
                    class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                  <button
                    @click="editMode.name = false"
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  v-else
                  @click="editMode.name = true"
                  class="text-indigo-600 font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                v-model="editableFields.email"
                readonly
                class="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p class="text-xs text-gray-400 mt-1">Email can’t be changed</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div class="flex items-center gap-4">
                <input
                  v-model="editableFields.password"
                  :readonly="!editMode.password"
                  type="password"
                  placeholder="********"
                  class="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 shadow-sm"
                />
                <div v-if="editMode.password" class="flex gap-2">
                  <button
                    @click="savePassword"
                    class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                  <button
                    @click="editMode.password = false"
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  v-else
                  @click="editMode.password = true"
                  class="text-indigo-600 font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 💡 Recommendations Tab -->
        <div v-if="activeTab === 'recommendations'" class="px-4 sm:px-6 md:px-8 mt-6">
          <!-- Review-Based Recommendations -->
          <div
            class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md mb-6"
          >
            <h3 class="text-2xl font-bold mb-2">Your Personalized Movie Picks 🍿</h3>
            <p class="text-sm md:text-base">
              Based on your <span class="font-semibold">review history</span>, we found your
              favorite genre is <span class="font-semibold underline">{{ favoriteGenreName }}</span
              >. Here are some handpicked movies we think you'll love.
            </p>
          </div>

          <div v-if="recommendedMovies.length">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <MovieCard
                v-for="movie in recommendedMovies"
                :key="movie.id"
                :movie-id="movie.id"
                :title="movie.title"
                :poster="movie.poster_path"
                :genre="movie.genre_ids"
                :release-date="movie.release_date"
              />
            </div>
          </div>
          <p v-else class="text-gray-500 mb-12">No review-based recommendations available yet.</p>

          <!-- Watchlist-Based Recommendations -->
          <div
            class="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-md mb-6"
          >
            <h3 class="text-2xl font-bold mb-2">More Suggestions Based on Your Watchlist 🎯</h3>
            <p class="text-sm md:text-base">
              Looks like you're into
              <span class="font-semibold underline">{{ favoriteWatchlistGenreName }}</span> movies.
              These picks might also be your taste.
            </p>
          </div>

          <div v-if="watchlistBasedRecommendations.length">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <MovieCard
                v-for="movie in watchlistBasedRecommendations"
                :key="movie.id"
                :movie-id="movie.id"
                :title="movie.title"
                :poster="movie.poster_path"
                :genre="movie.genre_ids"
                :release-date="movie.release_date"
              />
            </div>
          </div>
          <p v-else class="text-gray-500 mb-12">
            No watchlist-based recommendations available yet.
          </p>

          <!-- Actor-Based Recommendations -->
          <div
            class="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md mb-6"
          >
            <h3 class="text-2xl font-bold mb-2">Movies Featuring Your Top-Rated Actors 🌟</h3>
            <p class="text-sm md:text-base">
              Based on your ratings, we noticed you enjoy performances by
              <span
                v-for="(actor, index) in topRatedActorNames"
                :key="index"
                class="font-semibold underline"
              >
                {{ actor }}<span v-if="index < topRatedActorNames.length - 1">,</span>
              </span>
              . Here are some of their best movies.
            </p>
          </div>

          <div v-if="actorBasedRecommendations.length">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <MovieCard
                v-for="movie in actorBasedRecommendations"
                :key="movie.id"
                :movie-id="movie.id"
                :title="movie.title"
                :poster="movie.poster_path"
                :genre="movie.genre_ids"
                :release-date="movie.release_date"
              />
            </div>
          </div>
          <p v-else class="text-gray-500">No actor-based recommendations available yet.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  margin-bottom: 500px; /* or whatever value you want */
}
</style>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { UserIcon, DocumentTextIcon, HeartIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { currentUser } from '../firebase/userState'
import { getReviewsByUser } from '../firebase/reviewService'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import MovieCard from '@/components/MovieCard.vue'
import { clearWatchlist } from '../firebase/watchlistService'
import Swal from 'sweetalert2'
import { updateUserPassword, updateUserName } from '@/firebase/firebaseService'
import { getMoviesByGenre, getGenreMap, getActorMovies } from '@/services/tmdb'

import { toRaw } from 'vue'
console.log('raw currentUser:', toRaw(currentUser.value))

const router = useRouter()

// Tabs
const activeTab = ref('reviews')

const editMode = reactive({
  name: false,
  email: false,
  password: false,
})

const favoriteGenreId = ref(null)
const favoriteGenreName = ref('')
const recommendedMovies = ref([])

// Watchlist-based recommendations
const favoriteWatchlistGenreId = ref(null)
const favoriteWatchlistGenreName = ref('')
const watchlistBasedRecommendations = ref([])

const topRatedActorIds = ref([]) // Store TMDB person_ids of top 5 actors
const topRatedActorNames = ref([]) // Store their names for UI display
const actorBasedRecommendations = ref([]) // Movies to recommend based on those actors

// Reviews State
const allUserReviews = ref([])
const currentPage = ref(1)
const reviewsPerPage = 5
const filterOption = ref('newest')

const avatarInitials = computed(() => {
  const name = currentUser.value?.displayName || ''
  return name.slice(0, 2).toUpperCase() || '??'
})

// Navigation
const goToMovie = (movieId, title) => {
  router.push({ name: 'MovieDetails', params: { id: movieId }, query: { title } })
}

const detectFavoriteGenre = async () => {
  const genreCount = {}
  const genreMap = await getGenreMap() // { 28: 'Action', 12: 'Adventure', ... }

  for (const review of allUserReviews.value) {
    if (review.sentiment !== 'positive') continue // ✅ Only count positive reviews

    const genres = review.genre_ids
    if (Array.isArray(genres)) {
      for (const gid of genres) {
        genreCount[gid] = (genreCount[gid] || 0) + 1
      }
    }
  }

  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  if (sorted.length > 0) {
    const [topGenreId] = sorted[0]
    favoriteGenreId.value = parseInt(topGenreId)

    const nameEntry = Object.entries(genreMap).find(
      ([id]) => parseInt(id) === favoriteGenreId.value,
    )
    favoriteGenreName.value = nameEntry ? nameEntry[1] : 'Unknown'
  } else {
    favoriteGenreId.value = null
    favoriteGenreName.value = 'None yet'
  }
}

const detectWatchlistFavoriteGenre = async () => {
  const genreCount = {}
  const genreMap = await getGenreMap() // { 28: 'Action', 35: 'Comedy', ... }

  for (const movie of watchlistMovies.value) {
    const genreName = movie.primaryGenre?.trim()
    if (genreName) {
      genreCount[genreName] = (genreCount[genreName] || 0) + 1
    }
  }

  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  if (sorted.length > 0) {
    const [topGenreName] = sorted[0]
    favoriteWatchlistGenreName.value = topGenreName

    // Reverse lookup to get the genre ID from genreMap
    const genreEntry = Object.entries(genreMap).find(([, name]) => name === topGenreName)
    favoriteWatchlistGenreId.value = genreEntry ? parseInt(genreEntry[0]) : null
  } else {
    favoriteWatchlistGenreName.value = 'None yet'
    favoriteWatchlistGenreId.value = null
  }
}

const detectTopRatedActors = async () => {
  const userId = currentUser.value?.uid
  if (!userId) return

  // Step 1: Fetch all cast ratings from Firestore
  const castRatingsSnap = await getDocs(collection(db, 'users', userId, 'cast_ratings'))
  const ratings = castRatingsSnap.docs.map((doc) => doc.data())

  // Step 2: Count only ratings >= 4
  const positiveCounts = {} // { actorId: count }

  for (const r of ratings) {
    const id = r.castId
    const score = Number(r.rating)
    if (score >= 4) {
      positiveCounts[id] = (positiveCounts[id] || 0) + 1
    }
  }

  // Step 3: Sort by count and pick top 5
  const sorted = Object.entries(positiveCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  topRatedActorIds.value = sorted.map(([id]) => id)

  // Step 4: Fetch actor names from TMDB using person endpoint
  const names = []
  for (const id of topRatedActorIds.value) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
      )
      const data = await res.json()
      names.push(data.name || 'Unknown')
    } catch (err) {
      console.warn(`Failed to fetch actor name for ID ${id}`, err)
      names.push('Unknown')
    }
  }

  topRatedActorNames.value = names
}

const fetchRecommendedMovies = async () => {
  if (!favoriteGenreName.value) return

  try {
    const movies = await getMoviesByGenre(favoriteGenreName.value)
    const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))
    const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))

    recommendedMovies.value = movies
      .filter((movie) => !watchlistIds.has(String(movie.id)) && !reviewedIds.has(String(movie.id)))
      .slice(0, 12)
  } catch (err) {
    console.error('Error fetching recommended movies:', err)
  }
}

const fetchWatchlistBasedRecommendations = async () => {
  if (!favoriteWatchlistGenreName.value) return

  try {
    const movies = await getMoviesByGenre(favoriteWatchlistGenreName.value)
    const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))
    const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))

    watchlistBasedRecommendations.value = movies
      .filter((movie) => !watchlistIds.has(String(movie.id)) && !reviewedIds.has(String(movie.id)))
      .slice(0, 12)
  } catch (err) {
    console.error('Error fetching watchlist-based recommendations:', err)
  }
}

const fetchActorBasedRecommendations = async () => {
  try {
    const allMovieIds = new Set()

    // Step 1–2: Gather all unique movie IDs from top 5 actors
    for (const actorId of topRatedActorIds.value) {
      const movies = await getActorMovies(actorId) // from tmdb.js helper
      for (const movie of movies) {
        allMovieIds.add(movie.id)
      }
    }

    // Step 3: Filter out reviewed + watchlist
    const reviewedIds = new Set(allUserReviews.value.map((r) => String(r.movieId)))
    const watchlistIds = new Set(watchlistMovies.value.map((m) => String(m.id)))

    const filteredMovieIds = [...allMovieIds].filter(
      (id) => !reviewedIds.has(String(id)) && !watchlistIds.has(String(id)),
    )

    // Step 4–5: Fetch full movie data for top N (e.g. 15)
    const topMovies = []
    for (const id of filteredMovieIds.slice(0, 15)) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
        )

        const data = await res.json()
        topMovies.push(data)
      } catch (err) {
        console.warn(`Failed to fetch movie ${id}:`, err)
      }
    }

    actorBasedRecommendations.value = topMovies
  } catch (err) {
    console.error('Error in fetchActorBasedRecommendations:', err)
  }
}

const handleClearWatchlist = async () => {
  if (!currentUser.value?.uid) return

  const result = await Swal.fire({
    title: 'Clear Watchlist?',
    text: 'This will remove all movies from your watchlist.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, clear it!',
  })

  if (result.isConfirmed) {
    const success = await clearWatchlist(currentUser.value.uid)
    if (success) {
      watchlistMovies.value = []
      watchlistPage.value = 1
      Swal.fire('Cleared!', 'Your watchlist has been emptied.', 'success')
    } else {
      Swal.fire('Error', 'Failed to clear watchlist.', 'error')
    }
  }
}

// Tab style classes
const tabClasses = (tab) =>
  `w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg transition whitespace-nowrap
   ${
     activeTab.value === tab
       ? 'bg-indigo-100 text-indigo-800 font-semibold'
       : 'text-gray-600 hover:bg-gray-100'
   }`

// Section title
const activeTabTitle = computed(() => {
  switch (activeTab.value) {
    case 'reviews':
      return 'Your Reviews'
    case 'watchlist':
      return 'Your Watchlist'
    case 'info':
      return 'Your Personal Info'
    case 'recommendations':
      return 'Recommended for You'

    default:
      return ''
  }
})

// Filtered + Paginated Reviews
const filteredReviews = computed(() => {
  const sorted = [...allUserReviews.value]

  if (filterOption.value === 'positive') {
    return sorted.filter((r) => r.sentiment === 'positive')
  } else if (filterOption.value === 'negative') {
    return sorted.filter((r) => r.sentiment === 'negative')
  } else if (filterOption.value === 'neutral') {
    return sorted.filter((r) => r.sentiment === 'neutral')
  } else if (filterOption.value === 'oldest') {
    return sorted.sort((a, b) => a.createdAt - b.createdAt)
  } else {
    // newest
    return sorted.sort((a, b) => b.createdAt - a.createdAt)
  }
})

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * reviewsPerPage
  const end = start + reviewsPerPage
  return filteredReviews.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredReviews.value.length / reviewsPerPage))

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const watchlistMovies = ref([])
const watchlistPage = ref(1)
const moviesPerPage = 9

const paginatedWatchlist = computed(() => {
  const start = (watchlistPage.value - 1) * moviesPerPage
  return watchlistMovies.value.slice(start, start + moviesPerPage)
})

const totalWatchlistPages = computed(() => Math.ceil(watchlistMovies.value.length / moviesPerPage))

const changeWatchlistPage = (page) => {
  if (page >= 1 && page <= totalWatchlistPages.value) {
    watchlistPage.value = page
  }
}

const removeFromWatchlistState = (movieId) => {
  watchlistMovies.value = watchlistMovies.value.filter((m) => m.movieId !== movieId)
}

import { updateProfile } from 'firebase/auth'

import { auth } from '@/firebase/firebaseConfig'

// Personal Info States
const isEditingName = ref(false)
const isEditingPassword = ref(false)
const editableFields = reactive({
  name: '',
  email: '',
  password: '',
})

// Save Display Name
const saveName = async () => {
  if (!auth.currentUser || !editableFields.name.trim()) return
  try {
    await updateProfile(auth.currentUser, { displayName: editableFields.name })
    await updateUserName(auth.currentUser.uid, editableFields.name)
    currentUser.value.name = editableFields.name
    isEditingName.value = false
    Swal.fire('Updated!', 'Your name has been updated.', 'success')
  } catch (err) {
    console.error('Error updating name:', err)
    Swal.fire('Error', 'Failed to update name.', 'error')
  }
}

// Save Password
const savePassword = async () => {
  if (!auth.currentUser || !editableFields.password.trim()) return

  const { value: currentPassword } = await Swal.fire({
    title: 'Reauthenticate',
    input: 'password',
    inputLabel: 'Enter your current password',
    inputPlaceholder: 'Current password',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off',
    },
    showCancelButton: true,
  })

  if (!currentPassword) return

  try {
    await updateUserPassword(currentPassword, editableFields.password)

    editableFields.password = ''
    isEditingPassword.value = false
    Swal.fire('Updated!', 'Password updated successfully.', 'success')
  } catch (err) {
    console.error('Error updating password:', err)
    Swal.fire('Error', 'Failed to update password. Check your current password.', 'error')
  }
}

// Reset pagination when filter changes
watch(filterOption, () => {
  currentPage.value = 1
})

watch(currentUser, (user) => {
  if (user) {
    editableFields.name = user.name || ''
    editableFields.email = user.email || ''
    editableFields.password = ''
    console.log('✅ editableFields updated:', editableFields)
  }
})

onMounted(async () => {
  if (currentUser.value?.uid) {
    // Load Reviews
    allUserReviews.value = await getReviewsByUser(currentUser.value.uid)

    // Load Watchlist
    const snap = await getDocs(collection(db, 'users', currentUser.value.uid, 'watchlist'))
    watchlistMovies.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    // Review-based Recommendations
    await detectFavoriteGenre()
    await fetchRecommendedMovies()

    // Watchlist-based Recommendations
    await detectWatchlistFavoriteGenre()
    await fetchWatchlistBasedRecommendations()

    // Actor-based Recommendations
    await detectTopRatedActors()
    await fetchActorBasedRecommendations()
  }
})
</script>
