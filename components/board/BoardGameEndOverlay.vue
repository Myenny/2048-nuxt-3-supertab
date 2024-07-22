<template>
  <div class="overlay" v-show="board.hasWon() || board.hasLost()">
    <p class="message">{{ contents }}</p>
    <input v-model="playerName" placeholder="Enter your name" class="name-input" />
    <button class="submit-score" @click="submitScore" :disabled="isSubmitted">Submit Score</button>
    <button class="tryAgain" @click="onrestart">Try again</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  onrestart: {
    type: Function,
    required: true,
  },
  onSubmitScore: {
    type: Function,
    required: true,
  },
});

const playerName = ref("");
const isSubmitted = ref(false);

const contents = computed(() => {
  if (props.board.hasWon()) {
    return "Good Job!";
  } else if (props.board.hasLost()) {
    return "Game Over";
  } else {
    return "";
  }
});

const submitScore = async () => {
  if (playerName.value.trim() && !isSubmitted.value) {
    isSubmitted.value = true;
    await props.onSubmitScore(playerName.value);
    // Wait a short time before reloading to ensure the submission is complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
};
</script>

<style scoped>
.name-input {
  margin: 10px 0;
  padding: 5px;
  font-size: 16px;
}

.submit-score {
  margin-right: 10px;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-score:hover {
  background-color: #45a049;
}
</style>
