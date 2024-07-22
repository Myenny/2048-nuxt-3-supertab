<template>
  <div class="tetris-controls bg-gray-800 p-4 rounded">
    <div class="grid grid-cols-3 gap-2">
      <button @touchstart="startMove('left')" @touchend="stopMove" @mousedown="startMove('left')" @mouseup="stopMove" @mouseleave="stopMove" class="col-start-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        ←
      </button>
      <button @click="rotate" class="col-start-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        ↻
      </button>
      <button @touchstart="startMove('right')" @touchend="stopMove" @mousedown="startMove('right')" @mouseup="stopMove" @mouseleave="stopMove" class="col-start-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        →
      </button>
      <button @touchstart="startMove('down')" @touchend="stopMove" @mousedown="startMove('down')" @mouseup="stopMove" @mouseleave="stopMove" class="col-start-2 col-span-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        ↓
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTetrisStore } from '~/store/tetris';
import { ref } from 'vue';

const tetrisStore = useTetrisStore();

const moveInterval = ref(null);

const startMove = (direction) => {
  if (moveInterval.value) return;

  const move = () => {
    switch (direction) {
      case 'left':
        tetrisStore.moveLeft();
        break;
      case 'right':
        tetrisStore.moveRight();
        break;
      case 'down':
        tetrisStore.moveDown();
        break;
    }
  };

  move(); // Execute immediately
  moveInterval.value = setInterval(move, 100); // Then every 100ms
};

const stopMove = () => {
  if (moveInterval.value) {
    clearInterval(moveInterval.value);
    moveInterval.value = null;
  }
};

const rotate = () => tetrisStore.rotate();
</script>
