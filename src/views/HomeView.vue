<script setup>
import { ref, onMounted } from 'vue'
import HomeSlider from '@/components/HomeSlider.vue'
import MovieSwiper from '@/components/MovieSwiper.vue'
import GenreTags from '@/components/GenreTags.vue'
import TopCastSlider from '@/components/TopCastSlider.vue'

import { fetchPopularMovies } from '@/services/tmdb'
import { getSentimentStats } from '@/firebase/reviewService'
import { getTopRatedCastByRole } from '@/firebase/castRatingService'

const allMovies = ref([])
const topActors = ref([])
const topDirectors = ref([])

onMounted(async () => {
  try {
    let allResults = []

    // 📥 Fetch multiple pages of popular movies
    for (let page = 1; page <= 15; page++) {
      const data = await fetchPopularMovies(page)
      allResults = allResults.concat(data.results)
    }

    // 🔢 Add sentiment stats to each movie
    const moviesWithStats = await Promise.all(
      allResults.map(async (movie) => {
        const { positiveCount, reviewCount } = await getSentimentStats(movie.id)
        return { ...movie, positiveCount, reviewCount }
      }),
    )

    allMovies.value = moviesWithStats

    // 🌟 Fetch Top 20 Actors & Directors with avg ratings
    topActors.value = await getTopRatedCastByRole('Actor')
    topDirectors.value = await getTopRatedCastByRole('Director')
  } catch (err) {
    console.error('Failed to fetch homepage data:', err)
  }
})
</script>

<template>
  <HomeSlider />
  <GenreTags />

  <!-- ⭐ Cast Sliders -->
  <TopCastSlider title="Top Rated Actors" :castList="topActors" />
  <TopCastSlider title="Top Rated Directors" :castList="topDirectors" />

  <!-- 🎬 Movie Sections -->
  <MovieSwiper title="Newest Releases" :allMovies="allMovies" filterType="newest" />
  <MovieSwiper title="Top Rated" :allMovies="allMovies" filterType="topRated" />
  <MovieSwiper title="Action Movies" :allMovies="allMovies" filterType="action" />
  <MovieSwiper title="Comedy Movies" :allMovies="allMovies" filterType="comedy" />
</template>
