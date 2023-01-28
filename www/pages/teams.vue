<template>
  <div class="container flex-col m-auto my-14 md:my-20 text-white text-center">
    <div v-if="hsuStore.loaded" class="w-[15rem] h-[15rem] m-auto mb-6">
      <img v-if="!hsuStore.live" :src="HsuChar" alt="" class="">
      <img v-else :src="HsuRabbit" alt="" class="">
    </div>

    <div v-if="hsuStore.loaded" class="mb-10 text-2xl text-white">
      <div class="text-xl">
        Honorable VIPs
      </div>
      <div>
        Kung Kung & Hao Bu
      </div>
    </div>

    <div class="flex flex-row text-center text-white">
      <div class="flex flex-col md:flex-row mx-auto space-y-14 md:space-x-14 md:space-y-0">
        <!-- Teams -->
        <div
          v-if="hsuStore.loaded"
          v-for="(team, index) in hsuStore.teams"
          :key="index"
        >
          <div class="flex flex-col">
            <h1 class="text-3xl mb-2 text-hsu-red">{{ team.name }}</h1>
            <div
              v-for="(player, index) in hsuStore.teamPlayers(team.id)"
              :key="index"
            >
              <div class="flex flex-rowm space-x-1">
                <!-- <div class="my-auto text-sm">{{ player.zodiac }}</div> -->
                <div class="my-auto text-lg mx-auto">{{ player.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-else>Loading...</div> -->
      </div>
      <!-- <p class="text-base "> {{team.bio}} </p> -->
      <!-- <div ></div> -->
      <!-- <p>_id: {{ team.id }}</p> -->
      <!-- <p>_dump: {{ team }}</p> -->
    </div>

  </div>
</template>

<script setup>
import HsuChar from "assets/svgs/hsuCharacter.svg";
import HsuRabbit from "assets/svgs/rabbit_web_home_page.svg";

import { useHsuDataStore } from "~/stores/hsuData";

useHead({
  title: "Teams",
});

const hsuStore = useHsuDataStore()
if (!hsuStore.loaded) {
  hsuStore.refreshSheets()
};

</script>
