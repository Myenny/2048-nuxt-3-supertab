<template>
  <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">Leaderboard</h2>
    <ul class="space-y-2 mb-4">
      <li v-for="(entry, index) in leaderboard" :key="index" class="flex justify-between items-center text-white">
        <span class="font-semibold">{{ index + 1 }}. {{ entry.playerName }}</span>
        <span>{{ entry.score }} ({{ formatTime(entry.gameTime) }})</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface LeaderboardEntry {
  playerName: string;
  score: number;
  gameTime: number;
}

const props = defineProps({
  initialLeaderboard: {
    type: Array as () => LeaderboardEntry[],
    default: () => []
  }
})

const leaderboard = ref<LeaderboardEntry[]>(props.initialLeaderboard)

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

onMounted(() => {
  if (leaderboard.value.length === 0) {
    fetchLeaderboard()
  }
})

const updateLeaderboard = (newLeaderboard: LeaderboardEntry[]) => {
  leaderboard.value = newLeaderboard
}
function defineExpose(arg0: { updateLeaderboard: (newLeaderboard: LeaderboardEntry[]) => void; }) {
  throw new Error('Function not implemented.');
}

function defineProps(arg0: { initialLeaderboard: { type: () => LeaderboardEntry[]; default: () => never[]; }; }) {
  throw new Error('Function not implemented.');
}

defineExpose({ updateLeaderboard })

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>

