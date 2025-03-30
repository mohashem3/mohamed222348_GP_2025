<template>
  <div class="pt-24 pb-32 px-6 lg:px-20 bg-gradient-to-b from-white via-gray-50 to-gray-100">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-4">About SentimentCinema 🎬</h1>
      <p class="text-gray-600 max-w-2xl mx-auto text-lg mb-10">
        We help movie lovers discover what audiences really feel — through data, not just ratings.
      </p>
    </div>

    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">🎯 Our Mission</h2>
        <p class="text-gray-600 leading-relaxed">
          Our platform transforms user reviews into real-time sentiment analysis using AI. We aim to
          give you the emotional pulse of every movie, so you never waste a watch again.
        </p>

        <h2 class="text-2xl font-bold text-gray-800">🚀 What We Built</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Live Sentiment Analysis on every movie</li>
          <li>User-generated reviews & smart rating system</li>
          <li>Side-by-side movie comparison powered by AI</li>
          <li>Real-time charts and user history</li>
        </ul>
      </div>

      <div class="relative">
        <img
          src="@/assets/img/cinema_img1.jpg"
          alt="Cinema Illustration"
          class="rounded-xl shadow-lg w-full"
        />
        <p class="text-xs text-gray-400 mt-2 text-center">Illustration: unDraw</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto mt-20 text-center">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">👨‍💻 Built by Students. For Everyone.</h2>
      <p class="text-gray-600 text-lg mb-6">
        SentimentCinema was created as a graduation project by a passionate student who love movies,
        tech, and meaningful data.
      </p>
      <div class="flex justify-center gap-4">
        <a
          href="#"
          class="bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition"
        >
          Meet the Team
        </a>
        <a
          href="mailto:your@email.com"
          class="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for now
</script>
