<template>
  <div class="movie-details">
    <h1 class="movie-title">Movie Details Page</h1>
    <p>Details for Movie ID: {{ movieId }}</p>
    <h2>Movie Title: {{ movieTitle }}</h2>

    <!-- Review Section -->
    <ReviewSection :movieId="movieId" :movieTitle="movieTitle" />
  </div>
</template>

<script>
import ReviewSection from '@/components/ReviewSection.vue'

export default {
  name: 'MovieDetails',
  components: {
    ReviewSection,
  },
  props: ['id'],
  computed: {
    movieId() {
      return this.$route.params.id || 'Unknown'
    },
    movieTitle() {
      return this.$route.query.title || 'Unknown Title'
    },
  },
}
</script>

<style scoped>
.movie-details {
  text-align: center;
  padding: 20px;
}

.review-section {
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #6200ea;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #3700b3;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
