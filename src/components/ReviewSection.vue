<template>
  <div class="review-submission">
    <h2 class="section-title">Submit Your Review</h2>

    <textarea
      v-model="reviewText"
      placeholder="Write your review here..."
      class="review-input"
      rows="4"
    ></textarea>

    <button class="submit-btn" @click="handleSubmitReview">Submit Review</button>

    <p v-if="reviewSuccess" class="success-message">Review submitted successfully! ✅</p>
    <p v-if="reviewError" class="error-message">{{ reviewError }}</p>
  </div>
</template>

<script>
import { submitReview } from '@/firebase/reviewService'
import { getAuth } from 'firebase/auth'

export default {
  name: 'ReviewSection',
  props: {
    movieId: {
      type: [String, Number],
      required: true,
    },
    movieTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reviewText: '',
      reviewSuccess: false,
      reviewError: null,
    }
  },
  methods: {
    async handleSubmitReview() {
      if (!this.reviewText.trim()) {
        this.reviewError = 'Review cannot be empty!'
        return
      }

      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        this.reviewError = 'You must be logged in to submit a review!'
        return
      }

      try {
        await submitReview(user.uid, this.movieId, this.reviewText, 'neutral')
        this.reviewSuccess = true
        this.reviewText = ''
        this.reviewError = null
      } catch (error) {
        console.error('Error submitting review:', error)
        this.reviewError = 'Failed to submit review. Try again later.'
      }
    },
  },
}
</script>

<style scoped>
.review-submission {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.review-input {
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  margin-bottom: 15px;
}

.submit-btn {
  background: linear-gradient(to right, #7d2ae7, #01c2cc);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background: linear-gradient(to right, #01c2cc, #7d2ae7);
}
</style>
