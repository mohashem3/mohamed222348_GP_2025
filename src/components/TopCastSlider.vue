<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { ref } from 'vue'

// Accept data from parent
defineProps({
  title: String,
  castList: Array, // [{ castId, castName, role, profile }]
})

const activeIndex = ref(0)
const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex
}
</script>

<template>
  <div class="py-16 relative overflow-visible min-h-[360px]">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
      {{ title }}
    </h2>

    <swiper
      :modules="[Navigation]"
      :slides-per-view="5"
      :space-between="20"
      navigation
      grabCursor
      class="pb-8"
      @slideChange="onSlideChange"
      @swiper="(swiper) => (activeIndex = swiper.activeIndex)"
    >
      <swiper-slide
        v-for="(person, index) in castList"
        :key="person.castId"
        :class="{ 'featured-slide': index === activeIndex + 2 }"
      >
        <div class="cast-card bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
          <!-- 🖼️ Profile + Rank -->
          <div class="relative w-24 h-24 mb-3">
            <img
              :src="person.profile || 'https://placehold.co/96x96?text=No+Image'"
              alt="Cast"
              class="w-full h-full object-cover rounded-full border-2 border-gray-200"
            />
            <div
              class="absolute top-0 left-0 bg-yellow-400 text-xs text-white px-2 py-0.5 rounded-br-xl font-semibold"
            >
              #{{ index + 1 }}
            </div>
          </div>

          <!-- 🎭 Name + Role -->
          <h3 class="text-sm font-semibold text-gray-800 text-center">
            {{ person.castName }}
          </h3>
          <p class="text-xs text-gray-500 italic mb-1">{{ person.role }}</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.cast-card {
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  width: 170px;
  height: 270px;
}

.featured-slide .cast-card {
  transform: scale(1.2);
  width: 200px;
  height: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 20;
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}
</style>
