<!-- src/components/VisualCharts.vue -->
<template>
  <div>
    <!-- Chart Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2 text-center">
          Sentiment Breakdown
        </h2>
        <canvas id="sentimentChart"></canvas>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2 text-center">
          Watchlist Genre Distribution
        </h2>
        <canvas id="genreChart"></canvas>
      </div>
    </div>

    <!-- Genre Sentiment Breakdown -->
    <div class="bg-white rounded-xl shadow p-6 mb-10">
      <h2 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2 text-center">
        Genre Sentiment Breakdown
      </h2>
      <canvas id="genreSentimentChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

onMounted(() => {
  new Chart(document.getElementById('sentimentChart'), {
    type: 'pie',
    data: {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [60, 25, 15],
          backgroundColor: ['#34D399', '#F87171', '#FBBF24'],
        },
      ],
    },
  })

  new Chart(document.getElementById('genreChart'), {
    type: 'doughnut',
    data: {
      labels: ['Action', 'Horror', 'Drama', 'Comedy'],
      datasets: [
        {
          data: [14, 10, 9, 6],
          backgroundColor: ['#6366F1', '#EC4899', '#F59E0B', '#10B981'],
        },
      ],
    },
  })

  new Chart(document.getElementById('genreSentimentChart'), {
    type: 'bar',
    data: {
      labels: ['Action', 'Horror', 'Drama', 'Comedy'],
      datasets: [
        {
          label: 'Positive',
          data: [10, 7, 6, 4],
          backgroundColor: '#34D399',
          barThickness: 20,
        },
        {
          label: 'Negative',
          data: [2, 4, 3, 1],
          backgroundColor: '#F87171',
          barThickness: 20,
        },
        {
          label: 'Neutral',
          data: [2, 1, 2, 1],
          backgroundColor: '#FBBF24',
          barThickness: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: {
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
