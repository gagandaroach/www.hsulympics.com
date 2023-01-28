<template>
  <div class="container flex-col m-auto my-14 md:my-20 text-white text-center">
    <img v-if="hsuStore.live" :src="HsuRabbit" alt="" class="w-64 h-64 m-auto">
    <img v-else :src="HsuChar" alt="" class="w-64 h-64 m-auto">
    <div class="mt-2 text-hsu-red">
      <h1 class="text-4xl">Hsulympics VI</h1>
      <p class="text-base">January 28, 2023</p>
    </div>
      <!-- <p class="text-base">San Mateo, CA</p> -->
    <div v-if="!hsuStore.live" class="flex flex-row m-10">
      <CountDown end="January 28, 2023" />
    </div>
    <div v-else class="md:text-5xl text-2xl flex flex-col space-y-3 md:space-y-6 mt-12 text-gray-200 mb-24">
        <div>I pledge to uphold the Hsulympic code</div>
        <div>Regardless if I am young or old</div>
        <div>To try my best once the games have begun</div>
        <div>But to focus on having fun</div>
        <div>Because the Hsulympics are the family games</div>
        <div>Where everyone is a winner</div>
        <div>And family unity is the champion</div>
      </div>
    <!-- <div>
      test store
      <div>
        {{  hsuStore.loaded }}
      </div>
      <div v-if="hsuStore.loaded">
        {{ hsuStore.teams }}
      </div>
    </div> -->
  </div>
</template>

<script setup>
import HsuChar from "assets/svgs/hsuCharacter.svg";
import HsuRabbit from "assets/svgs/rabbit_web_home_page.svg";
import { useHsuDataStore } from "~/stores/hsuData";

const hsuStore = useHsuDataStore();
if (!hsuStore.loaded) {
  hsuStore.refreshSheets()
};
</script>