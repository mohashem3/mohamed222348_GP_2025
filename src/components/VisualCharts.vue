<template>
  <div>
    <!-- Chart Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <!-- Sentiment Breakdown -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center mb-2">
          Sentiment Breakdown
        </h2>
        <div class="flex justify-center mb-4">
          <span class="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-light">
            Summary of your overall review opinions.
          </span>
        </div>
        <canvas id="sentimentChart"></canvas>
      </div>

      <!-- Watchlist Genre Distribution -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center mb-2">
          Watchlist Genre Distribution
        </h2>
        <div class="flex justify-center mb-4">
          <span class="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-light">
            Represents which genres you save to watch later.
          </span>
        </div>
        <canvas id="genreChart"></canvas>
      </div>
    </div>

    <!-- Genre Sentiment Breakdown -->
    <div class="bg-white rounded-xl shadow p-6 mb-10">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center mb-2">
        Genre Sentiment Breakdown
      </h2>
      <div class="flex justify-center mb-4">
        <span class="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-light">
          Your opinion on each genre — whether you loved it, disliked it, or felt neutral.
        </span>
      </div>
      <canvas id="genreSentimentChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { getReviewsByUser } from '@/firebase/reviewService'
import { currentUser } from '@/firebase/userState'
import { db } from '@/firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { getGenreMap } from '@/services/tmdb'

const sentimentData = ref({ positive: 0, negative: 0, neutral: 0 })
const genreCounts = ref({})
const genreSentimentStats = ref({})

// Count sentiments
const calculateSentimentStats = (reviews) => {
  const stats = { positive: 0, negative: 0, neutral: 0 }
  for (const review of reviews) {
    const sentiment = review.sentiment?.toLowerCase()
    if (sentiment === 'positive') stats.positive++
    else if (sentiment === 'negative') stats.negative++
    else stats.neutral++
  }
  sentimentData.value = stats
}

// Watchlist genre count
const calculateGenreDistribution = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'watchlist'))
  const counts = {}

  snapshot.forEach((doc) => {
    const data = doc.data()
    const genreName = data.primaryGenre
    if (genreName) {
      counts[genreName] = (counts[genreName] || 0) + 1
    }
  })

  genreCounts.value = counts
}

// Genre sentiment breakdown
const calculateGenreSentimentStats = async (reviews) => {
  const genreMap = await getGenreMap()
  const stats = {}

  for (const review of reviews) {
    const genreId = review.genre_ids?.[0]
    const genreName = genreMap[Number(genreId)] || 'Unknown'
    const sentiment = review.sentiment?.toLowerCase() || 'neutral'

    if (!stats[genreName]) {
      stats[genreName] = { positive: 0, negative: 0, neutral: 0 }
    }
    stats[genreName][sentiment]++
  }

  genreSentimentStats.value = stats
}

onMounted(async () => {
  if (!currentUser.value?.uid) return
  const uid = currentUser.value.uid

  const reviews = await getReviewsByUser(uid)
  calculateSentimentStats(reviews)
  await calculateGenreDistribution(uid)
  await calculateGenreSentimentStats(reviews)

  // Pie Chart – Sentiment Breakdown
  new Chart(document.getElementById('sentimentChart'), {
    type: 'pie',
    data: {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [
            sentimentData.value.positive,
            sentimentData.value.negative,
            sentimentData.value.neutral,
          ],
          backgroundColor: ['#34D399', '#F87171', '#FBBF24'],
        },
      ],
    },
  })

  // Doughnut – Watchlist Genre Distribution
  const genreLabels = Object.keys(genreCounts.value)
  const genreData = Object.values(genreCounts.value)
  const genreColors = [
    '#6366F1',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#60A5FA',
    '#A78BFA',
    '#F472B6',
    '#34D399',
    '#F87171',
    '#FBBF24',
  ]

  new Chart(document.getElementById('genreChart'), {
    type: 'doughnut',
    data: {
      labels: genreLabels,
      datasets: [
        {
          data: genreData,
          backgroundColor: genreColors.slice(0, genreLabels.length),
        },
      ],
    },
  })

  // Stacked Bar Chart – Genre Sentiment Breakdown
  const sentimentLabels = Object.keys(genreSentimentStats.value)
  const positiveData = []
  const negativeData = []
  const neutralData = []

  sentimentLabels.forEach((genre) => {
    const entry = genreSentimentStats.value[genre]
    positiveData.push(entry.positive || 0)
    negativeData.push(entry.negative || 0)
    neutralData.push(entry.neutral || 0)
  })

  new Chart(document.getElementById('genreSentimentChart'), {
    type: 'bar',
    data: {
      labels: sentimentLabels,
      datasets: [
        {
          label: 'Positive',
          data: positiveData,
          backgroundColor: '#34D399',
          barThickness: 20,
        },
        {
          label: 'Negative',
          data: negativeData,
          backgroundColor: '#F87171',
          barThickness: 20,
        },
        {
          label: 'Neutral',
          data: neutralData,
          backgroundColor: '#FBBF24',
          barThickness: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function (context) {
              const genre = context.chart.data.labels[context.dataIndex]
              const value = context.raw
              return `${value} ${context.dataset.label.toLowerCase()} review${value === 1 ? '' : 's'} in ${genre}`
            },
          },
        },
      },
      scales: {
        x: { stacked: false }, // ❌ disable stacked
        y: {
          stacked: false, // ❌ disable stacked
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
})
</script>

<style scoped>
canvas {
  max-height: 320px;
}
</style>
