<template>
  <section>
    <div>

    <div v-if="hideGames" class="container flex flex-col text-hsu-red tracking-wide md:text-lg text-xs mx-auto mt-60 text-center">
      <div>
        wouldn't hs-you like to know : )
      </div>
    </div>

    <div v-else class="">
      <div v-if="hsuStore.loaded" v-for="(game, index) in hsuStore.games" :key="index">
        <div v-if="game.show === 'TRUE'" class="container flex flex-col text-white bg-black border-2 border-solid border-red-900 rounded-lg m-3 mx-auto p-3">
          <h1 class="text-2xl text-yellow-400 mb-2">{{game.name}}</h1>
          <p class="text-base text-red-400">Objective</p>
          <p>{{ game.obj }}</p>
          <p class="text-base text-red-400">Rules</p>
          <p>{{ game.rules }}</p>
          <p class="text-base text-red-400">Format</p>
          <p>{{ game.format }}</p>
          <p class="text-base text-red-400">Scoring</p>
          <p>{{ game.scoring }}</p>
          <!-- <p>_dump: {{ game }}</p> -->
        </div>
      </div>
      <div v-else class="text-white text-center">
        Loading...
      </div>
    </div>
      
    </div>
  </section>
</template>

<script setup>
  import { useHsuDataStore } from "~/stores/hsuData";

  const hsuStore = useHsuDataStore()
  if (!hsuStore.loaded) {
    hsuStore.refreshSheets()
  };

  useHead({
    title: "Games"
  });
  
  const hideGames = true;
  
</script>
