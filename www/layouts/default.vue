<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div class="flex flex-col bg-black min-h-screen min-w-screen">
    <div :class="headerClass">
      <div class="flex flex-col space-y-1">
        <NuxtLink to="/" :class="headerTitleClass" :active-class="headerTitleActiveClass">The Hsulympics Website</NuxtLink>
        <p :class="headerPlugClass">
          powered by <NuxtLink to="https://www.daroach.net" target="_blank" :class="headerPlugClass">daroach.net</NuxtLink>
        </p>
      </div>
      <div class="flex space-x-2">
        <div>
          <NuxtLink to="/scoreboard" :class="buttonClass" :active-class="buttonActiveClass">Scoreboard</NuxtLink>
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


const headerClass = "flex justify-between bg-red-900 text-white md:p-3 p-1";
const headerTitleClass = "md:text-4xl text-base";
const headerPlugClass = "md:text-sm text-xs text-red-500";
const headerTitleActiveClass = ""
const buttonCommonClass = "flex text-center md:text-lg text-sm border-2 border-solid border-red-900 hover:border-yellow-400";
const buttonClass = `${buttonCommonClass} bg-red-700 my-2 self-center p-3`;
const buttonActiveClass = `${buttonCommonClass} text-black border-yellow-400 bg-yellow-400`;

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
