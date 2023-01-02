<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div class="flex flex-col bg-black min-h-screen justify-between">
    <div :class="headerClass">
      <div class="flex flex-col space-y-1">
        <p class="text-4xl">{{ webpageMainTitle }}</p>
        <p class="text-sm text-gray-100" >website powered by daroach.net</p>
      </div>
      <div class="flex space-x-2">
        <div>
          <NuxtLink to="/dashboard" :class="buttonClass" :active-class="buttonActiveClass">Scoreboard</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/teams" :class="buttonClass" :active-class="buttonActiveClass">Teams</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/games" :class="buttonClass" :active-class="buttonActiveClass">Games</NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
const webpageMainTitle = "Hsulympics 2022"
const localTitleChunk = useState('title', () => webpageMainTitle)
useHead({
  titleTemplate: (titleChunk) => {
    const newTitle = titleChunk ? `${titleChunk} - ${webpageMainTitle}` : webpageMainTitle
    console.log(newTitle);
    localTitleChunk.value = titleChunk ? `${webpageMainTitle} - ${titleChunk}` : webpageMainTitle;
    return newTitle;
  },
});

const appConfig = useAppConfig();
const headerClass = "flex justify-center bg-red-700 text-white justify-between p-3";
const buttonCommonClass = "flex text-lg text-center";
const buttonClass = `${buttonCommonClass} bg-red-800 my-2 self-center p-3 hover:bg-red-600`;
const buttonActiveClass = `${buttonCommonClass} bg-red-600`;
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
