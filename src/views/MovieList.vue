<template>
  <div class="movie-view bg-gray-100 min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-center mb-6">Movies</h1>

      <!-- Loading/Error -->
      <p v-if="loading" class="text-center text-gray-500">Loading movies...</p>
      <p v-if="error" class="text-center text-red-500">{{ error }}</p>

      <!-- Movie Grid -->
      <div
        v-if="!loading && !error"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movieId="movie.id"
          :title="movie.title"
          :genre="movie.genre_ids"
          :description="movie.overview"
          :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          :releaseDate="movie.release_date"
          :matchedGenre="this.$route.query.genre"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && !error"
        class="flex justify-center mt-10 space-x-2 text-sm font-medium"
      >
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
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'
import {
  fetchPopularMovies,
  searchMoviesByTitle,
  getActorMovies,
  searchMoviesByDirector,
  searchMoviesByGenre,
} from '@/services/tmdb'

export default {
  components: { MovieCard },
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      selectedGenres: [],
    }
  },
  computed: {
    visiblePages() {
      const range = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      for (let i = start; i <= end; i++) range.push(i)
      return range
    },
    filteredMovies() {
      if (this.selectedGenres.length === 0) return this.movies
      return this.movies.filter((movie) =>
        movie.genre_ids?.some((id) => this.selectedGenres.includes(id)),
      )
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
    async searchByTitle(title) {
      this.loading = true
      this.error = null
      try {
        const data = await searchMoviesByTitle(title)
        this.movies = data
        this.totalPages = 1
      } catch (err) {
        this.error = 'Failed to search movies'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async searchByActor(actorId) {
      this.loading = true
      this.error = null
      try {
        const data = await getActorMovies(actorId)
        this.movies = data
        this.totalPages = 1
      } catch (err) {
        this.error = 'Failed to fetch actor movies'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async searchByDirector(name) {
      this.loading = true
      this.error = null
      try {
        const data = await searchMoviesByDirector(name)
        this.movies = data
        this.totalPages = 1
      } catch (err) {
        this.error = 'Failed to search movies by director'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async searchByGenre(query) {
      this.loading = true
      this.error = null
      try {
        const data = await searchMoviesByGenre(query)
        this.movies = data
        this.totalPages = 1
      } catch (err) {
        this.error = 'Failed to search movies by genre'
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
    handleGenreFilter(selectedGenres) {
      this.selectedGenres = selectedGenres
    },
  },
  watch: {
    '$route.query.title': {
      immediate: true,
      handler(newTitle) {
        if (newTitle) {
          this.searchByTitle(newTitle)
        }
      },
    },
    '$route.query.actor': {
      immediate: true,
      handler(newActorId) {
        if (newActorId) {
          this.searchByActor(newActorId)
        }
      },
    },
    '$route.query.director': {
      immediate: true,
      handler(newDirector) {
        if (newDirector) {
          this.searchByDirector(newDirector)
        }
      },
    },
    '$route.query.genre': {
      immediate: true,
      handler(newGenre) {
        if (newGenre) {
          this.searchByGenre(newGenre)
        }
      },
    },
  },
  created() {
    if (!this.$route.query.title && !this.$route.query.actor) {
      this.loadMovies()
    }
  },
}
</script>

<style scoped>
.movie-view {
  margin-top: 120px;
}
</style>

<style scoped>
.movie-view {
  text-align: center;
  padding: 20px;
  background: #f4f4f4;
  margin-top: 100px;
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
