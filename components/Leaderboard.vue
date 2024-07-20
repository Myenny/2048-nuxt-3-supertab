<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">Leaderboard</h2>
    <ul class="space-y-2">
      <li v-for="(entry, index) in leaderboard" :key="index" class="flex justify-between items-center text-white">
        <span class="font-semibold">{{ index + 1 }}. {{ entry.player_name }}</span>
        <span>{{ entry.score }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface LeaderboardEntry {
  player_name: string;
  score: number;
}

const leaderboard = ref<LeaderboardEntry[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/api/leaderboard')
    if (response.ok) {
      leaderboard.value = await response.json()
    } else {
      console.error('Failed to fetch leaderboard data')
    }
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
  }
})
</script>
