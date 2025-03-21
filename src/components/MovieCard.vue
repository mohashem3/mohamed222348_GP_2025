<template>
  <div class="movie-card">
    <!-- Movie Poster -->
    <div class="movie-poster">
      <img :src="poster" :alt="title" />
    </div>

    <!-- Movie Info -->
    <div class="movie-info">
      <h3 class="movie-title">{{ title }}</h3>
      <p class="movie-genre">{{ genre }}</p>
      <p class="movie-description">{{ description }}</p>

      <!-- Actions -->
      <div class="movie-actions">
        <button @click="handleReview">Review</button>
        <button @click="handleDetails">Details</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    genre: String,
    description: String,
    poster: String, // URL for movie poster
  },
  methods: {
    handleReview() {
      alert(`Reviewing ${this.title}`)
    },
    handleDetails() {
      alert(`Details for ${this.title}`)
    },
  },
}
</script>

<style scoped>
.movie-card {
  width: 250px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: #fff;
  transition: transform 0.2s ease-in-out;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.movie-info {
  padding: 10px;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
}

.movie-genre {
  color: #888;
  font-size: 14px;
}

.movie-description {
  font-size: 12px;
  margin: 8px 0;
}

.movie-actions {
  display: flex;
  justify-content: space-between;
}

.movie-actions button {
  background: #6200ea;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.movie-actions button:hover {
  background: #3700b3;
}
</style>
