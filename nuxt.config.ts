// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "nuxt-svgo"],
  css: ["@/assets/css/main.css"],
  serverHandlers: [
    { route: '/api/leaderboard', handler: '~/server/api/leaderboard.ts' }
  ],
  app: {
    head: {
      title: 'Play 2048 Game Online | Free & Addictive Puzzle Game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Enjoy the 2048 game online for free. Merge tiles to reach the 2048 tile in this fun and addictive puzzle game. Play now!' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
});
