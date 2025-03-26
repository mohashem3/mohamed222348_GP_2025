<template>
  <div class="movies-section">
    <h2 class="section-title">{{ title }}</h2>
    <swiper
      :modules="modules"
      :navigation="true"
      :slides-per-view="4"
      :space-between="20"
      :loop="false"
      class="mySwiper"
    >
      <swiper-slide v-for="movie in filteredMovies" :key="movie.id">
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

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import MovieCard from './MovieCard.vue'

export default {
  components: {
    Swiper,
    SwiperSlide,
    MovieCard,
  },
  props: {
    title: String,
    allMovies: Array,
    filterType: String,
  },
  data() {
    return {
      modules: [Navigation],
    }
  },
  computed: {
    filteredMovies() {
      if (!this.allMovies) return []

      const filtered = (() => {
        switch (this.filterType) {
          case 'topRated':
            return this.allMovies.filter((m) => {
              const positive = m.positiveCount || 0
              const total = m.reviewCount || 0
              if (total === 0) return false
              const percentage = (positive / total) * 100
              return percentage >= 70
            })
          case 'action':
            return this.allMovies.filter((m) => m.genre_ids?.[0] === 28)
          case 'comedy':
            return this.allMovies.filter((m) => m.genre_ids?.[0] === 35)
          case 'drama':
            return this.allMovies.filter((m) => m.genre_ids?.[0] === 18)
          case 'newest':
            return this.allMovies.filter((m) => m.release_date?.startsWith('2025'))
          default:
            return this.allMovies
        }
      })()

      console.log(`[${this.title}] Filtered movies count:`, filtered.length)
      return filtered
    },
  },
}
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

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
