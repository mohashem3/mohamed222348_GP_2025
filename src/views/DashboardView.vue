<template>
  <div class="flex pt-20 bg-gray-50 min-h-screen">
    <!-- Sidebar for switching tabs -->
    <SideBar :activeTab="activeTab" @change-tab="setActiveTab" />

    <!-- Main content -->
    <div class="flex-1 bg-gray-50 min-h-screen p-6">
      <DashboardTab v-if="activeTab === 'dashboard'" />
      <ReviewHistoryTab v-else-if="activeTab === 'reviews'" />
      <WatchlistTab v-else-if="activeTab === 'watchlist'" />
      <ProfileTab v-else-if="activeTab === 'profile'" />
      <RecommendationsTab v-else-if="activeTab === 'recommendations'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import SideBar from '@/components/SideBar.vue'
import DashboardTab from '@/components/DashboardTab.vue'
import ReviewHistoryTab from '@/components/ReviewHistoryTab.vue'
import WatchlistTab from '@/components/WatchlistTab.vue'
import ProfileTab from '@/components/ProfileTab.vue'
import RecommendationsTab from '@/components/RecommendationsTab.vue'

// reactive tab value
const activeTab = ref('dashboard')

// handler for Sidebar tab switch
function setActiveTab(tabKey) {
  activeTab.value = tabKey
}
</script>
