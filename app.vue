<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "http://schema.org",
        "@type": "WebApplication",
        "name": "2048 Game",
        "url": "https://your-2048-game-url.com",
        "description": "Play the addictive 2048 puzzle game online for free. Merge tiles to reach the 2048 tile and beyond!",
        "applicationCategory": "Game",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0"
        }
      })
    },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-G7LW7NNWR8',
      async: true
    }
  ],
  __dangerouslyDisableSanitizersByTagID: {
    'gtag': ['innerHTML']
  },
  innerHTML: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-G7LW7NNWR8');
  `
})
</script>
