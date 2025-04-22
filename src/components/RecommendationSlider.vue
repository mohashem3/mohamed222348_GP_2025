<template>
  <div class="movies-section mt-10 mb-16">
    <h2 class="section-title">You Might Also Like</h2>
    <swiper :modules="[Navigation]" :slides-per-view="4" :space-between="20" navigation>
      <swiper-slide v-for="movie in recommended" :key="movie.id">
        <MovieCard
          :movieId="movie.id"
          :title="movie.title"
          :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          :genre="[movie.genre_ids?.[0]]"
          :releaseDate="movie.release_date"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import MovieCard from './MovieCard.vue'
import 'swiper/css'
import 'swiper/css/navigation'
import axios from 'axios'

const props = defineProps({
  genreId: Number,
  currentMovieId: Number,
})

const recommended = ref([])

onMounted(async () => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${props.genreId}&sort_by=popularity.desc`,
  )
  // Filter out the current movie and pick 10 random ones
  recommended.value = data.results
    .filter((m) => m.id !== props.currentMovieId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
})
</script>

<style scoped>
.movies-section {
  margin-top: 40px;
}
.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
  text-align: center;
}
</style>
