<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Hsulympics 2022` : 'Hsulympics 2022';
    }
  })
</script>
