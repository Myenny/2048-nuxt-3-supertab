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
import { useStore } from 'vuex';

const store = useStore();

const moveLeft = () => store.dispatch('tetris/moveLeft');
const moveRight = () => store.dispatch('tetris/moveRight');
const moveDown = () => store.dispatch('tetris/moveDown');
const rotate = () => store.dispatch('tetris/rotate');
</script>
