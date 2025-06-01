<template>
  <div class="px-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Your Watchlist ({{ watchlistMovies.length }})
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
          :matched-genre="movie.primaryGenre"
          :release-date="movie.releaseDate || ''"
          @removed="removeFromWatchlistState"
        />
      </div>

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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { currentUser } from '@/firebase/userState'
import MovieCard from '@/components/MovieCard.vue'
import { clearWatchlist } from '@/firebase/watchlistService'

// 🔁 State
const watchlistMovies = ref([])
const watchlistPage = ref(1)
const moviesPerPage = 9

// 💡 Pagination
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

// 🔁 Remove
const removeFromWatchlistState = (movieId) => {
  watchlistMovies.value = watchlistMovies.value.filter((m) => m.movieId !== movieId)
}

// ❌ Clear all
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

// 🧠 Load Watchlist
onMounted(async () => {
  if (currentUser.value?.uid) {
    const snap = await getDocs(collection(db, 'users', currentUser.value.uid, 'watchlist'))
    watchlistMovies.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }
})
</script>
