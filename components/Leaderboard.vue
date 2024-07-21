<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">Leaderboard</h2>
    <ul class="space-y-2">
      <li v-for="(entry, index) in leaderboard" :key="index" class="flex justify-between items-center text-white">
        <span class="font-semibold">{{ index + 1 }}. {{ entry.playerName }}</span>
        <span>{{ entry.score }} ({{ formatTime(entry.gameTime) }})</span>
      </li>
    </ul>
    <form @submit.prevent="submitScore" class="mt-4">
      <input v-model="newScore.playerName" placeholder="Player Name" class="bg-gray-700 text-white p-2 rounded" required>
      <input v-model.number="newScore.score" type="number" placeholder="Score" class="bg-gray-700 text-white p-2 rounded ml-2" required>
      <input v-model.number="newScore.gameTime" type="number" placeholder="Game Time (seconds)" class="bg-gray-700 text-white p-2 rounded ml-2" required>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded ml-2">Submit Score</button>
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
const newScore = ref<LeaderboardEntry>({ playerName: '', score: 0, gameTime: 0 })

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
      body: JSON.stringify(newScore.value),
    })
    if (response.ok) {
      await fetchLeaderboard()
      newScore.value = { playerName: '', score: 0, gameTime: 0 }
    } else {
      console.error('Failed to submit new score')
    }
  } catch (error) {
    console.error('Error submitting new score:', error)
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
