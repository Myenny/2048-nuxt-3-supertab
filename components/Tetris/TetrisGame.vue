<template>
  <div class="tetris-game">
    <h2 class="text-2xl font-bold mb-4">Tetris</h2>
    <div class="flex flex-col md:flex-row gap-4">
      <div 
        class="tetris-touch-area"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchmove.prevent
      >
        <TetrisBoard />
      </div>
      <div class="flex flex-col gap-4">
        <div class="bg-gray-800 p-4 rounded">
          <h3 class="text-xl font-bold mb-2">Score: {{ score }}</h3>
          <h3 class="text-xl font-bold">Level: {{ level }}</h3>
        </div>
        <TetrisControls ref="controls" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTetrisStore } from '~/store/tetris';
import { onMounted, onUnmounted, ref } from 'vue';
import TetrisBoard from './TetrisBoard.vue';
import TetrisControls from './TetrisControls.vue';

const tetrisStore = useTetrisStore();
const { score, level, gameOver } = storeToRefs(tetrisStore);
const controls = ref(null);

let touchStartTime = 0;
let touchTimer = null;

const handleKeyDown = (event) => {
  if (gameOver.value) return;
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      tetrisStore.moveLeft();
      break;
    case 'ArrowRight':
      event.preventDefault();
      tetrisStore.moveRight();
      break;
    case 'ArrowDown':
      event.preventDefault();
      tetrisStore.moveDown();
      break;
    case 'ArrowUp':
      event.preventDefault();
      tetrisStore.rotate();
      break;
  }
};

const handleTouchStart = (event) => {
  if (gameOver.value) return;
  
  touchStartTime = new Date().getTime();
  touchTimer = setTimeout(() => {
    controls.value.startMove('down');
  }, 200); // Start accelerated downward movement after 200ms
};

const handleTouchEnd = (event) => {
  if (gameOver.value) return;
  
  clearTimeout(touchTimer);
  controls.value.stopMove();
  
  const touchEndTime = new Date().getTime();
  const touchDuration = touchEndTime - touchStartTime;
  
  if (touchDuration < 200) {
    // If the touch duration is less than 200ms, consider it a tap and rotate the piece
    tetrisStore.rotate();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  tetrisStore.startGame();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  tetrisStore.stopGame();
});
</script>

<style scoped>
.tetris-touch-area {
  touch-action: none; /* Prevents default touch actions like scrolling */
}
</style>
