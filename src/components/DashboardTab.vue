<template>
  <div class="min-h-screen bg-gray-50 p-10">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <!-- First Row: 2 Static KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm text-gray-500 mb-1">Total Reviews</h3>
        <p class="text-3xl font-bold text-indigo-600">42</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm text-gray-500 mb-1">Most Reviewed Genre</h3>
        <p class="text-xl font-bold text-pink-600">Horror</p>
      </div>
    </div>

    <!-- Animated KPI Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <KpiCard title="Your Top Rated Movies" :items="topRatedMovies" color="text-green-600" />
      <KpiCard title="Your Top Rated Actors" :items="topActors" color="text-blue-600" />
      <KpiCard title="Your Top Rated Directors" :items="topDirectors" color="text-purple-600" />
    </div>

    <!-- All Visual Charts -->
    <VisualCharts />
  </div>
</template>

<script setup>
import KpiCard from '@/components/kpiCard.vue'
import VisualCharts from '@/components/VisualCharts.vue'

const topRatedMovies = ['Inception', 'Interstellar', 'The Dark Knight']
const topActors = ['Tom Hardy', 'Leonardo DiCaprio', 'Robert Downey Jr.']
const topDirectors = ['David Fincher', 'Christopher Nolan', 'Denis Villeneuve']
</script>
