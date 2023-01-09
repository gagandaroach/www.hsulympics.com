<!-- https://nuxt.com/docs/getting-started/views#layouts -->
<template>
  <div class="flex flex-col bg-black min-h-screen min-w-screen">
    <div :class="headerClass">
      <div>

        <div class="flex flex-col">
          <div class="flex flex-row">
            <img :src="HsuChar" alt="" class="flex bg-black mr-1 md:h-10 h-6" />
            <NuxtLink to="/" :class="headerTitleClass" :active-class="headerTitleActiveClass">Hsulympics VI</NuxtLink>
          </div>

          <div class="flex flex-col space-y-1">
            <p :class="headerPlugClass">Year of the Rabbit</p>
            <!-- <p :class="headerPlugClass">
              powered by <NuxtLink to="https://www.daroach.net" target="_blank" :class="headerPlugClass">daroach.net</NuxtLink>
            </p> -->
          </div>

        </div>

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
import HsuChar from "assets/svgs/hsuCharacter.svg";

const webpageMainTitle = "Hsulympics 2022"
const localTitleChunk = useState('title', () => webpageMainTitle)
useHead({
  titleTemplate: (titleChunk) => {
    const newTitle = titleChunk ? `${titleChunk} - ${webpageMainTitle}` : webpageMainTitle
    console.log(newTitle);
    localTitleChunk.value = titleChunk ? `${webpageMainTitle} - ${titleChunk}` : webpageMainTitle;
    return newTitle;
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
 ]
});


const headerClass = "flex justify-between text-white md:p-3 p-1";
const headerTitleClass = "flex md:text-4xl text-base";
const headerPlugClass = "md:text-base text-xs tracking-widest";
const headerTitleActiveClass = ""
const buttonCommonClass = "flex text-center md:text-lg text-xs md:p-3 p-1 hover:border-yellow-400";
const buttonClass = `${buttonCommonClass} my-2 self-center`;
const buttonActiveClass = `${buttonCommonClass} text-red-600`;
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
