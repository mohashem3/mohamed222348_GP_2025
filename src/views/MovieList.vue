<template>
  <div class="movie-view">
    <h1 class="page-title">Movies</h1>

    <p v-if="loading">Loading movies...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error" class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :title="movie.title"
        :genre="movie.genre_ids.join(', ')"
        :description="movie.overview"
        :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
      />
    </div>

    <!-- Pagination Controls -->
    <div v-if="!loading && !error" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span> Page {{ currentPage }} of {{ totalPages }} </span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
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
      currentPage: 1, // Track current page
      totalPages: 1, // Store total pages from API response
    }
  },
  methods: {
    async loadMovies() {
      this.loading = true
      this.error = null

      try {
        const data = await fetchPopularMovies(this.currentPage) // Fetch movies for the current page
        this.movies = data.results
        this.totalPages = data.total_pages // Update total pages from API response
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

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  font-weight: bold;
}
</style>
