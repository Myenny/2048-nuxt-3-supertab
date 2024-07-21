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
    }
  ]
})
</script>
