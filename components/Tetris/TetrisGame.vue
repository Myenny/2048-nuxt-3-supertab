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
import { useStore } from 'vuex';
import { computed, onMounted, onUnmounted } from 'vue';
import TetrisBoard from './TetrisBoard.vue';
import TetrisControls from './TetrisControls.vue';

const store = useStore();

const score = computed(() => store.state.tetris.score);
const level = computed(() => store.state.tetris.level);

const handleKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      store.dispatch('tetris/moveLeft');
      break;
    case 'ArrowRight':
      store.dispatch('tetris/moveRight');
      break;
    case 'ArrowDown':
      store.dispatch('tetris/moveDown');
      break;
    case 'ArrowUp':
      store.dispatch('tetris/rotate');
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  store.dispatch('tetris/startGame');
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  store.dispatch('tetris/stopGame');
});
</script>
