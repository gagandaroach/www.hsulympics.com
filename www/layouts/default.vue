<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div class="flex flex-col bg-black min-h-screen justify-between">
    <div class="flex p-3 justify-center bg-red-700 text-white">
      <p class="text-2xl">{{ title }}</p>
    </div>
    <slot />
    <div class="flex p-5 justify-center">
      <div :class="buttonClass">
        <NuxtLink to="/teams">Teams</NuxtLink>
      </div>
      <div :class="buttonClassBig">
        <NuxtLink to="/dashboard">Scores</NuxtLink>
      </div>
      <div :class="buttonClass">
        <NuxtLink to="/games">Games</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const webpageMainTitle = "Hsulympics 2022"
const title = useState('title', () => webpageMainTitle)

useHead({
  titleTemplate: (titleChunk) => {
    const newTitle = titleChunk ? `${titleChunk} - ${webpageMainTitle}` : webpageMainTitle
    console.log(newTitle);
    title.value = newTitle;
    return newTitle;
  },
});
const appConfig = useAppConfig();
const buttonClass = "flex p-3 rounded-xl m-3 " + appConfig.theme.colors.primary;
const buttonClassBig = "flex p-5 rounded-xl " + appConfig.theme.colors.primary;
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
