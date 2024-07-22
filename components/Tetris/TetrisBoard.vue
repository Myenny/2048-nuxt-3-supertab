<template>
  <div class="tetris-board bg-gray-900 p-1 rounded">
    <div v-for="(row, y) in board" :key="y" class="flex">
      <div v-for="(cell, x) in row" :key="x" class="w-6 h-6 border border-gray-800">
        <div :class="getCellClass(cell)" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTetrisStore } from '~/store/tetris';

const tetrisStore = useTetrisStore();
const { board } = storeToRefs(tetrisStore);

const getCellClass = (cell) => {
  if (cell === 0) return 'bg-gray-800';
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  return colors[cell - 1] || 'bg-gray-800';
};
</script>
