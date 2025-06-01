<template>
  <div class="w-64 bg-white shadow-lg sticky top-0 h-screen p-6 space-y-4">
    <!-- Logo -->
    <div class="flex items-center gap-2 mb-4">
      <img :src="BlogIcon" alt="Logo" class="w-6 h-6 align-middle" />
      <h2 class="text-xl font-bold text-gray-800 leading-none pt-1">SentimentCinema</h2>
    </div>

    <!-- Sidebar Tabs -->
    <button
      v-for="item in tabs"
      :key="item.key"
      @click="$emit('change-tab', item.key)"
      :class="[
        'w-full flex items-center gap-3 px-4 py-2 rounded-md font-medium transition',
        props.activeTab === item.key
          ? 'bg-pink-500 text-white'
          : 'text-gray-700 hover:bg-pink-100 hover:text-pink-800 border',
      ]"
    >
      <component
        :is="item.icon"
        :class="[
          item.key === 'recommendations' ? 'min-w-[1.25rem] min-h-[1.25rem] w-5 h-5' : 'w-5 h-5',
          'transition flex-shrink-0',
        ]"
      />

      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import {
  HomeIcon,
  DocumentTextIcon,
  HeartIcon,
  UserCircleIcon,
  StarIcon,
} from '@heroicons/vue/24/solid'
import BlogIcon from '@/assets/img/blog-icon.svg'

const props = defineProps({
  activeTab: String,
})

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { key: 'recommendations', label: 'Recommendations', icon: StarIcon },
  { key: 'watchlist', label: 'Watchlist', icon: HeartIcon },
  { key: 'reviews', label: 'Review History', icon: DocumentTextIcon },
  { key: 'profile', label: 'Profile', icon: UserCircleIcon },
]
</script>
