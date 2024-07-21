<template>
  <div class="overlay" v-show="board.hasWon() || board.hasLost()">
    <p class="message">{{ contents }}</p>
    <button class="tryAgain" @click="onrestart">Try again</button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  onrestart: {
    type: Function,
    required: true,
  },
});

const contents = computed(() => {
  if (props.board.hasWon()) {
    return "Good Job!";
  } else if (props.board.hasLost()) {
    return "Game Over";
  } else {
    return "";
  }
});
</script>
