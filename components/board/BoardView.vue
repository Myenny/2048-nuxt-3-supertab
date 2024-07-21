<template>
  <BoardScore
    :score="board.score"
    :highScore="highScore"
    :timer="formatTime(board.timer)"
  />
  <div class="board" tabIndex="1" ref="boardContainer">
    <div v-for="(r_item, r_i) in board.cells" :key="r_i" class="cell-container">
      <BoardCell v-for="(c_item, c_i) in r_item" :key="c_i" />
    </div>
    <BoardTileView v-for="(tile, i) in tiles" :tile="tile" :key="i" />
    <BoardGameEndOverlay 
      :board="board" 
      :onrestart="onRestart" 
      :score="board.score" 
      @scoreSubmitted="handleScoreSubmitted"
      @leaderboardUpdated="handleLeaderboardUpdated"
    />
  </div>
  <Leaderboard ref="leaderboardRef" />
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { Board } from "./Board";
import BoardCell from "./BoardCell.vue";
import BoardTileView from "./BoardTileView.vue";
import BoardGameEndOverlay from "./BoardGameEndOverlay.vue";
import "./style.scss";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 0 -> left, 1 -> up, 2 -> right, 3 -> down
enum DirectionEnum {
  left = 0,
  up = 1,
  right = 2,
  down = 3,
}

const boardContainer = ref(null);
const board = ref(new Board());
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.pause) return;
  if (board.value.hasWon()) {
    return;
  }
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
    var direction = event.keyCode - 37;
    handleMove(direction);
  }
};

const { direction } = usePointerSwipe(boardContainer, {
  onSwipeEnd: (e) => {
    if (props.pause) return;
    if (board.value.hasWon()) return;

    handleMove(
      DirectionEnum[direction.value as unknown as DirectionEnum] as any
    );
  },
});
const moveCount = ref(0);
function handleMove(dir: number) {
  board.value.move(dir);
  moveCount.value++;
}
const props = defineProps({
  maxMoves: {
    type: Number,
    default: 0,
    required: true,
  },
  pause: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const emit = defineEmits(["max-moves"]);
watch(moveCount, (count) => {
  if (props.maxMoves && count % props.maxMoves === 0) {
    emit("max-moves");
  }
});

const onRestart = () => {
  moveCount.value = 0;
  board.value = new Board();
  board.value.resetTimer();
  board.value.startTimer();
};
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  board.value.startTimer();
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  board.value.stopTimer();
});
const tiles = computed(() => {
  return board.value.tiles.filter((tile) => tile.value != 0);
});

const highScore = ref(parseInt(localStorage.getItem("highScore") ?? "0"));
function updateHighScore(newScore: number) {
  if (newScore > highScore.value) {
    highScore.value = newScore;
    // Store the new high score in local storage
    localStorage.setItem("highScore", String(highScore.value));
  }
}


// Listen for changes in the score
watch(
  () => board.value.score,
  (newValue) => {
    updateHighScore(newValue);
  }
);

watch(
  () => board.value.hasWon() || board.value.hasLost(),
  (gameEnded) => {
    if (gameEnded) {
      board.value.stopTimer();
      submitScore();
    }
  }
);

const leaderboardRef = ref(null);

const handleScoreSubmitted = (updatedLeaderboard) => {
  console.log('Score submitted successfully');
};

const handleLeaderboardUpdated = (newLeaderboard) => {
  if (leaderboardRef.value) {
    leaderboardRef.value.updateLeaderboard(newLeaderboard);
  }
};

const submitScore = async () => {
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: 'Player', // You might want to get this from user input
        score: board.value.score,
        gameTime: board.value.timer,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit score');
    }
    const { updatedLeaderboard } = await response.json();
    handleLeaderboardUpdated(updatedLeaderboard);
    console.log('Score submitted successfully');
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};
</script>
