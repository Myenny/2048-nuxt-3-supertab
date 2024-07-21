<template>
  <div class="overlay" v-show="show">
    <p class="message">{{ contents }}</p>
    <div v-if="isHighScore" class="mt-4">
      <input
        v-model="playerName"
        type="text"
        placeholder="Enter your name"
        class="p-2 rounded"
      />
      <button @click="submitScore" class="ml-2 bg-blue-500 text-white p-2 rounded">Submit Score</button>
    </div>
    <button class="tryAgain mt-4" @click="restart">Try again</button>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, computed } from "vue";

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  onrestart: {
    type: Function,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['scoreSubmitted']);

const { board, score } = toRefs(props);
const playerName = ref('');
const isHighScore = ref(false);

const show = computed(() => {
  return board.value.hasWon() || board.value.hasLost();
});

const contents = computed(() => {
  if (board.value.hasWon()) {
    return "Good Job!";
  } else if (board.value.hasLost()) {
    return "Game Over";
  } else {
    return "";
  }
});

const restart = () => {
  props.onrestart && props.onrestart();
  playerName.value = '';
  isHighScore.value = false;
};

const submitScore = async () => {
  if (playerName.value.trim().length === 0) {
    alert('Please enter your name');
    return;
  }

  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: playerName.value,
        score: score.value,
        gameTime: props.board.timer,
      }),
    });

    if (response.ok) {
      const { newEntry, updatedLeaderboard } = await response.json();
      emit('scoreSubmitted', updatedLeaderboard);
      restart();
    } else {
      console.error('Failed to submit score');
    }
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};

// Check if the current score is a high score
const checkHighScore = async () => {
  try {
    const response = await fetch('/api/leaderboard');
    if (response.ok) {
      const leaderboard = await response.json();
      isHighScore.value = leaderboard.length < 10 || score.value > leaderboard[leaderboard.length - 1].score;
    }
  } catch (error) {
    console.error('Error checking high score:', error);
  }
};

watch(show, (newValue) => {
  if (newValue) {
    checkHighScore();
  }
});

const handleScoreSubmitted = () => {
  // You can add any additional logic here after a score is submitted
  // For example, you might want to refresh the leaderboard
};
</script>
