<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">Leaderboard</h2>
    <ul class="space-y-2 mb-4">
      <li v-for="(entry, index) in leaderboard" :key="index" class="flex justify-between items-center text-white">
        <span class="font-semibold">{{ index + 1 }}. {{ entry.playerName }}</span>
        <span>{{ entry.score }} ({{ formatTime(entry.gameTime) }})</span>
      </li>
    </ul>
    <form @submit.prevent="submitScore" class="space-y-2">
      <input v-model="playerName" type="text" placeholder="Enter your name" class="w-full p-2 rounded" required>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit Score</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface LeaderboardEntry {
  playerName: string;
  score: number;
  gameTime: number;
}

const leaderboard = ref<LeaderboardEntry[]>([])
const playerName = ref('')

const fetchLeaderboard = async () => {
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
}

const submitScore = async () => {
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: playerName.value,
        score: 0, // Replace with actual score
        gameTime: 0, // Replace with actual game time
      }),
    })
    if (response.ok) {
      await fetchLeaderboard()
      playerName.value = ''
    } else {
      console.error('Failed to submit score')
    }
  } catch (error) {
    console.error('Error submitting score:', error)
  }
}

onMounted(fetchLeaderboard)

// Listen for the custom event
if (process.client) {
  window.addEventListener('leaderboardUpdated', fetchLeaderboard)
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>
