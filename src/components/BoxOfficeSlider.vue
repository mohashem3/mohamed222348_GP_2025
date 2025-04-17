<template>
  <div class="movies-section">
    <h2 class="section-title">Top Box Office</h2>
    <swiper
      :modules="[Navigation]"
      :navigation="true"
      :slides-per-view="4"
      :space-between="20"
      :loop="false"
    >
      <swiper-slide v-for="movie in movies" :key="movie.id">
        <MovieCard
          :movieId="movie.id"
          :title="movie.title"
          :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          :genre="movie.genres || movie.genre_ids"
          :releaseDate="movie.release_date"
          :revenue="movie.revenue"
          :rank="movies.indexOf(movie) + 1"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import MovieCard from './MovieCard.vue'
import { fetchTopBoxOfficeMovies } from '@/services/tmdb'

const movies = ref([])

onMounted(async () => {
  movies.value = await fetchTopBoxOfficeMovies()
})
</script>

<style scoped>
.movies-section {
  margin: 40px 0;
}
.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
  text-align: center;
}
</style>
