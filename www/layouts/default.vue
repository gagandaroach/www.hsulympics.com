<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div class="flex flex-col bg-black min-h-screen min-w-screen justify-between">
    <div :class="headerClass">
      <div class="flex flex-col space-y-1">
        <NuxtLink to="/" :class="headerTitleClass">{{ webpageMainTitle }}</NuxtLink>
        <NuxtLink to="https://www.daroach.net" target="_blank" :class="headerPlugClass" >powered by daroach.net</NuxtLink>
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


const headerClass = "flex justify-center bg-red-700 text-white justify-between md:p-3 p-1";
const headerTitleClass = "md:text-4xl text-base";
const headerPlugClass = "md:text-sm text-xs";
const buttonCommonClass = "flex text-center md:text-lg text-sm";
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
