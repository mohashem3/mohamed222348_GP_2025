<template>
  <div class="movie-view">
    <h1 class="page-title">Movies</h1>

    <p v-if="loading">Loading movies...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error" class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movieId="movie.id"
        :title="movie.title"
        :genre="movie.genre_ids"
        :description="movie.overview"
        :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :releaseDate="movie.release_date"
      />
    </div>

    <!-- Sexy Tailwind Pagination -->
    <div v-if="!loading && !error" class="flex justify-center mt-10 space-x-2 text-sm font-medium">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Previous
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-4 py-2 rounded-md border',
          currentPage === page
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'
import { fetchPopularMovies } from '@/services/tmdb.js'

export default {
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
    }
  },
  computed: {
    visiblePages() {
      const range = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      for (let i = start; i <= end; i++) {
        range.push(i)
      }
      return range
    },
  },
  methods: {
    async loadMovies() {
      this.loading = true
      this.error = null
      try {
        const data = await fetchPopularMovies(this.currentPage)
        this.movies = data.results
        this.totalPages = data.total_pages
      } catch (err) {
        this.error = 'Failed to load movies'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.loadMovies()
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadMovies()
      }
    },
    goToPage(page) {
      this.currentPage = page
      this.loadMovies()
    },
  },
  created() {
    this.loadMovies()
  },
}
</script>

<style scoped>
.movie-view {
  text-align: center;
  padding: 20px;
  background: #f4f4f4;
  margin-top: 2200px;
  margin-bottom: 100px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Removed old .pagination styles — replaced with Tailwind classes */
</style>
