<template>
  <div class="w-64 bg-white shadow-lg min-h-screen p-6 space-y-3">
    <h2 class="text-xl font-bold text-gray-800 mb-4">🎬 SentimentCinema</h2>

    <button
      v-for="item in tabs"
      :key="item.key"
      @click="$emit('change-tab', item.key)"
      :class="[
        'w-full text-left px-4 py-2 rounded-md font-medium',
        props.activeTab === item.key
          ? 'bg-pink-500 text-white'
          : 'text-gray-700 hover:bg-pink-100 hover:text-pink-800 border',
      ]"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  activeTab: String,
})

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'reviews', label: 'Review History' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'profile', label: 'Profile' },
  { key: 'recommendations', label: 'Recommendations' },
]
</script>
