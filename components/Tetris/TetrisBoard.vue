<template>
  <div class="tetris-board bg-gray-900 p-1 rounded">
    <div v-for="(row, y) in displayBoard" :key="y" class="flex">
      <div v-for="(cell, x) in row" :key="x" class="w-6 h-6 border border-gray-800">
        <div :class="getCellClass(cell)" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTetrisStore } from '~/store/tetris';
import { computed } from 'vue';

const tetrisStore = useTetrisStore();
const { board, currentPiece, currentPosition } = storeToRefs(tetrisStore);

const displayBoard = computed(() => {
  const display = board.value.map(row => [...row]);
  if (currentPiece.value) {
    currentPiece.value.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = currentPosition.value.y + y;
          const boardX = currentPosition.value.x + x;
          if (boardY >= 0 && boardY < display.length && boardX >= 0 && boardX < display[0].length) {
            display[boardY][boardX] = value;
          }
        }
      });
    });
  }
  return display;
});

const getCellClass = (cell) => {
  if (cell === 0) return 'bg-gray-800';
  const colors = ['bg-cyan-400', 'bg-yellow-400', 'bg-purple-400', 'bg-green-400',
                  'bg-red-400', 'bg-blue-400', 'bg-orange-400'];
  return colors[cell - 1] || 'bg-gray-800';
};
</script>
