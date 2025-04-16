<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  title: String,
  castList: Array, // [{ castId, castName, role, profile, avgRating, totalReviews, careerMovies }]
})

const activeIndex = ref(0)
const router = useRouter()

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex
}

const goToCastPage = (person) => {
  if (person.role === 'Director') {
    router.push({ name: 'Movies', query: { director: person.castName } })
  } else {
    router.push({
      name: 'Movies',
      query: {
        actor: person.castId,
        name: person.castName, // ✅ Add name for H1 display
      },
    })
  }
}
</script>

<template>
  <div class="py-16 relative overflow-visible min-h-[440px]">
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
        <div
          class="cast-card bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
          @click="goToCastPage(person)"
        >
          <!-- 🖼️ Profile + Rank -->
          <div class="relative w-28 h-28 mb-3">
            <img
              :src="
                person.profile
                  ? 'https://image.tmdb.org/t/p/w185' + person.profile
                  : 'https://placehold.co/96x96?text=Actor'
              "
              alt="Cast"
              class="w-full h-full object-contain rounded-full border-2 border-gray-200"
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

          <!-- ⭐ Avg Rating -->
          <div
            class="flex gap-[2px] mb-1"
            :title="`${person.avgRating?.toFixed(1)}/5 based on ${person.totalReviews} ratings`"
          >
            <template v-for="n in 5" :key="n">
              <svg
                class="w-4 h-4"
                :class="n <= Math.round(person.avgRating) ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24
                    12 20.077 4.665 24 6 15.281 0 9.423l8.332-1.268z"
                />
              </svg>
            </template>
          </div>

          <!-- ✅ Career Movies Badge -->
          <span
            class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-800"
          >
            {{ person.careerMovies || 0 }} Career Movie{{ person.careerMovies === 1 ? '' : 's' }}
          </span>
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
  height: 290px;
}

.featured-slide .cast-card {
  transform: scale(1.2);
  width: 200px;
  height: 340px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 20;
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}
</style>
