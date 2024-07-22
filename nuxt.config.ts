// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-svgo",
    "@nuxtjs/sitemap"
  ],
  css: ["@/assets/css/main.css"],
  serverHandlers: [
    { route: '/api/leaderboard', handler: '~/server/api/leaderboard.ts' }
  ],
  sitemap: {
    hostname: 'https://your-website-url.com',
    gzip: true,
    exclude: [
      '/admin/**'
    ],
    routes: [
      '/',
      '/terms'
    ]
  },
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
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-G7LW7NNWR8',
          async: true,
        },
        {
          hid: 'gtag',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G7LW7NNWR8');
          `,
          type: 'text/javascript',
          charset: 'utf-8',
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        gtag: ['innerHTML'],
      },
    }
  },
  plugins: ['~/plugins/gtag.client.ts'],
});
