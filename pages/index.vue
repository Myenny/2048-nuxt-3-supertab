<template>
  <div class="container mx-auto max-w-4xl space-y-4 py-4">
    <h1 class="text-3xl font-bold mb-4">Play 2048 and Tetris Online for Free</h1>
    <aside>
      <AdsBanner1 v-if="!hasAccess" />
    </aside>
    <div class="flex flex-col md:flex-row gap-4">
      <main class="sm:py-4 relative flex-grow">
        <ClientOnly>
          <div v-if="currentGame === '2048'">
            <BoardView
              :max-moves="maxMoves"
              :pause="showSquareAd && !hasAccess"
              @max-moves="handleMaxMoves"
            />
          </div>
          <div v-else-if="currentGame === 'tetris'">
            <TetrisGame />
          </div>
          <!-- <AdsSquare v-if="showSquareAd && !hasAccess" @close="handleAdClose" /> -->
        </ClientOnly>
      </main>
      <aside class="md:w-64">
        <div class="mb-4">
          <button @click="currentGame = '2048'" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Play 2048
          </button>
          <button @click="currentGame = 'tetris'" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Play Tetris
          </button>
        </div>
        <Leaderboard />
      </aside>
    </div>
    <section class="prose prose-invert prose-p:text-sm py-8">
      <h2>How to Play 2048</h2>
      <p>
        2048 is a fun puzzle game where the objective is to slide numbered
        tiles on a grid to combine them and create a tile with the number
        2048. Here's how to play:
      </p>

      <h3>For Mobile Users:</h3>
      <p>
        Swipe in any direction (up, down, left, or right) on your screen to
        move the tiles. When two tiles with the same number touch, they merge
        into one!
      </p>

      <h3>For Desktop Users:</h3>
      <p>
        Use your arrow keys (up, down, left, or right) to move the tiles on
        the grid. Just press the arrow key in the direction you want the tiles
        to move.
      </p>

      <h3>Objective:</h3>
      <p>
        The game ends when you can no longer make a move (i.e., when the grid
        is full and no adjacent tiles have the same value). Your goal is to
        reach the 2048 tile, but don't stop there! You can continue playing to
        achieve even higher scores.
      </p>
    </section>
    
    <section class="prose prose-invert prose-p:text-sm py-8">
      <h2>Tips and Strategies for 2048</h2>
      <ul>
        <li>Keep your highest number tile in a corner</li>
        <li>Work towards building a "chain" of descending numbers</li>
        <li>Don't swipe in every direction - be strategic</li>
        <li>Plan ahead and think about the consequences of each move</li>
      </ul>
    </section>

    <section class="prose prose-invert prose-p:text-sm py-8">
      <h2>Why 2048 is an Addictive Puzzle Game</h2>
      <p>
        2048 is incredibly addictive due to its simple yet challenging gameplay. 
        The satisfaction of merging tiles and seeing your score grow keeps players 
        coming back for more. Its easy-to-learn but hard-to-master nature makes it 
        perfect for quick games or extended play sessions.
      </p>
    </section>

    <section class="prose prose-invert prose-p:text-sm py-8">
      <h2>Frequently Asked Questions</h2>
      <h3>What is the highest tile possible in 2048?</h3>
      <p>
        While the game is named 2048, it's possible to create tiles with higher values. 
        The theoretical limit is 131,072, but reaching this is extremely difficult.
      </p>
      <h3>Is there a time limit in 2048?</h3>
      <p>
        No, there's no time limit in 2048. You can take as long as you want for each move.
      </p>
      <h3>Can I undo a move in 2048?</h3>
      <p>
        In the original version, there's no undo feature. However, some variations of the game might include this option.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { hasAccess } from "~/composables/supertab";
import TetrisGame from '~/components/Tetris/TetrisGame.vue';

const maxMoves = process.env.NODE_ENV === "development" ? 0 : 1369;
const currentGame = ref('2048');

useHead({
  title: "Play 2048 and Tetris Online | Free & Addictive Puzzle Games",
  meta: [
    {
      name: "description",
      content: "Enjoy 2048 and Tetris games online for free. Challenge yourself with these fun and addictive puzzle games. Play now!"
    },
    {
      name: "keywords",
      content: "2048 game, Tetris game, play 2048 online, play Tetris online, free puzzle games, addictive puzzle games, online puzzle games"
    },
    {
      hid: "og-image",
      property: "og:image",
      content: "https://enzo.games/splash.png",
    },
  ],
  script: [
    {
      src: "https://onpage-widget.supertab.co/v2/widget.js",
      defer: true,
    },
    {
      src: "./supertab.js",
    },
  ],
});

const showSquareAd = ref(false);
function handleAdClose() {
  showSquareAd.value = false;
}
function handleMaxMoves() {
  showSquareAd.value = true;
}
</script>
