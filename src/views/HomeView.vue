<script setup>
import { ref, onMounted } from 'vue'
import HomeSlider from '@/components/HomeSlider.vue'
import MovieSwiper from '@/components/MovieSwiper.vue'
import { fetchPopularMovies } from '@/services/tmdb'
import { getSentimentStats } from '@/firebase/reviewService'

const allMovies = ref([])

onMounted(async () => {
  try {
    let allResults = []

    // Fetch multiple pages
    for (let page = 1; page <= 15; page++) {
      const data = await fetchPopularMovies(page)
      allResults = allResults.concat(data.results)
    }

    // Add sentiment stats
    const moviesWithStats = await Promise.all(
      allResults.map(async (movie) => {
        const { positiveCount, reviewCount } = await getSentimentStats(movie.id)
        return { ...movie, positiveCount, reviewCount }
      }),
    )

    allMovies.value = moviesWithStats
  } catch (err) {
    console.error('Failed to fetch movies:', err)
  }
})
</script>

<template>
  <HomeSlider />

  <MovieSwiper title="Newest Releases" :allMovies="allMovies" filterType="newest" />
  <MovieSwiper title="Top Rated" :allMovies="allMovies" filterType="topRated" />
  <MovieSwiper title="Action Movies" :allMovies="allMovies" filterType="action" />
  <MovieSwiper title="Comedy Movies" :allMovies="allMovies" filterType="comedy" />
</template>
