<template>
  <div class="movies-section">
    <h2 class="section-title">Award-Winning Movies</h2>
    <swiper
      :modules="[Navigation]"
      :navigation="true"
      :slides-per-view="4"
      :space-between="20"
      :loop="false"
      class="mySwiper"
    >
      <swiper-slide v-for="movie in awardMovies" :key="movie.id">
        <div class="relative">
          <!-- Trophy badge -->
          <div
            class="cursor-pointer backdrop-blur-sm bg-yellow-300/90 absolute top-2 left-2 text-yellow-900 text-xs font-bold px-2 py-[2px] rounded-full shadow-lg z-10 flex items-center gap-1"
            title="Won: Best Picture - Academy Awards"
          >
            🏆
            <span class="hidden sm:inline">Winner</span>
          </div>

          <!-- Movie card -->
          <MovieCard
            :movieId="movie.id"
            :title="movie.title"
            :poster="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            :genre="[movie.genre_ids?.[0]]"
            :releaseDate="movie.release_date"
          />
        </div>
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
import { getAwardWinningMovies } from '@/services/tmdb'

const awardMovies = ref([])

onMounted(async () => {
  awardMovies.value = await getAwardWinningMovies()
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
