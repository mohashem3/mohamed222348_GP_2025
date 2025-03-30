<template>
  <div class="w-full h-[300px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { getReviewsForMovie } from '@/firebase/reviewService'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({ movieId: String })

const reviews = ref([])

onMounted(async () => {
  reviews.value = await getReviewsForMovie(props.movieId)
})

const chartData = computed(() => {
  const counts = [0, 0, 0, 0, 0]
  reviews.value.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      counts[r.rating - 1]++
    }
  })
  return {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: counts,
        backgroundColor: '#f472b6',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}
</script>
