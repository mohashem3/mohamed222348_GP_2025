<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register required chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  labels: Array,
  values: Array,
  colors: {
    type: Array,
    default: () => ['#10b981', '#ef4444'], // green, red only
  },
})

const chartData = {
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.colors || ['#10b981', '#ef4444', '#9ca3af'], // green, red, gray
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#374151', // text-gray-700
        font: { size: 14 },
      },
    },
  },
}
</script>
