<template>
  <swiper
    :modules="[Pagination, Autoplay]"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 4500 }"
    class="mySwiper"
  >
    <!-- HERO SLIDE -->
    <swiper-slide class="swiper-slide-content hero-slide">
      <img :src="heroImg" alt="SentimentCinema Hero" />
      <div class="hero-overlay">
        <h1 class="hero-title">Welcome to <br />SentimentCinema</h1>
        <p class="hero-subtitle">
          Discover movies, analyze reviews, and see what people really feel.
        </p>
        <div class="hero-buttons">
          <button @click="goToExplore" class="hero-btn ghost">Explore Movies</button>
          <button @click="goToReview" class="hero-btn solid">Write Your First Review</button>
        </div>
      </div>
    </swiper-slide>

    <!-- MOVIE SLIDES -->
    <swiper-slide v-for="movie in movies" :key="movie.id" class="swiper-slide-content">
      <img :src="movie.img" :alt="movie.title" />

      <div class="movie-overlay">
        <h2 class="movie-title">{{ movie.title }}</h2>
        <button @click="goToMovie(movie.id, movie.title)" class="review-btn">
          Add Your Review
        </button>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'

// IMAGES
import heroImg from '@/assets/img/cinema_img1.jpg'
import img1 from '@/assets/img/movie_img1.jpg'
import img2 from '@/assets/img/movie_img2.jpg'
import img3 from '@/assets/img/movie_img3.jpg'
import img4 from '@/assets/img/movie_img4.jpg'
import img5 from '@/assets/img/movie_img5.jpg'
import img6 from '@/assets/img/movie_img6.jpg'
import img7 from '@/assets/img/movie_img7.jpeg'

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const router = useRouter()

    const movies = [
      { id: 1011985, title: 'Captain America: Brave New World', img: img1 },
      { id: 603692, title: 'John Wick: Chapter 4', img: img2 },
      { id: 634649, title: 'Spider-Man: No Way Home', img: img3 },
      { id: 76600, title: 'Avatar: The Way of Water', img: img4 },
      { id: 414906, title: 'The Batman', img: img5 },
      { id: 575264, title: 'Mission Impossible: Dead Reckoning Part 1', img: img6 },
      { id: 926393, title: 'The Equalizer 3', img: img7 },
    ]

    const goToMovie = (id, title) => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) router.push('/login')
      else router.push({ name: 'MovieDetails', params: { id }, query: { title } })
    }

    const goToReview = () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) router.push('/login')
      else router.push('/movies')
    }

    const goToExplore = () => {
      router.push('/movies')
    }

    return {
      Pagination,
      Autoplay,
      heroImg,
      movies,
      goToMovie,
      goToReview,
      goToExplore,
    }
  },
}
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 500px;
  font-size: 24px;
  background: #000;
  margin-top: 100px;
  margin-bottom: 100px;
}

/* Slide Container */
.swiper-slide-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slide-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* HERO SLIDE */
.hero-slide img {
  filter: brightness(0.4);
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  color: white;
  max-width: 600px;
  text-align: left;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 18px;
  margin: 16px 0 24px;
  color: #ccc;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.hero-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-btn.solid {
  background-color: #ec4899;
  color: white;
  border: none;
}

.hero-btn.solid:hover {
  background-color: #06b6d4;
}

.hero-btn.ghost {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.hero-btn.ghost:hover {
  background-color: white;
  color: black;
}

/* MOVIE SLIDE */
.movie-overlay {
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.movie-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.review-btn {
  background-color: #ec4899;
  color: white;
  border: none;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.review-btn:hover {
  background-color: #06b6d4;
}
</style>
