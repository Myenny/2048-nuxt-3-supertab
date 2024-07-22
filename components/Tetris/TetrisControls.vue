<template>
  <div class="tetris-controls bg-gray-800 p-4 rounded">
    <div class="grid grid-cols-3 gap-2">
      <button @click="moveLeft" class="col-start-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        ←
      </button>
      <button @click="rotate" class="col-start-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        ↻
      </button>
      <button @click="moveRight" class="col-start-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        →
      </button>
      <button @click="moveDown" class="col-start-2 col-span-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        ↓
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTetrisStore } from '~/store/tetris';

const tetrisStore = useTetrisStore();

const moveLeft = () => tetrisStore.moveLeft();
const moveRight = () => tetrisStore.moveRight();
const moveDown = () => tetrisStore.moveDown();
const rotate = () => tetrisStore.rotate();
</script>
