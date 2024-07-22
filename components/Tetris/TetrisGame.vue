<template>
  <div class="tetris-game">
    <h2 class="text-2xl font-bold mb-4">Tetris</h2>
    <div class="flex flex-col md:flex-row gap-4">
      <TetrisBoard />
      <div class="flex flex-col gap-4">
        <div class="bg-gray-800 p-4 rounded">
          <h3 class="text-xl font-bold mb-2">Score: {{ score }}</h3>
          <h3 class="text-xl font-bold">Level: {{ level }}</h3>
        </div>
        <TetrisControls />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTetrisStore } from '~/store/tetris';
import { onMounted, onUnmounted } from 'vue';
import TetrisBoard from './TetrisBoard.vue';
import TetrisControls from './TetrisControls.vue';

const tetrisStore = useTetrisStore();
const { score, level, gameOver } = storeToRefs(tetrisStore);

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

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  tetrisStore.startGame();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  tetrisStore.stopGame();
});
</script>
