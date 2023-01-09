<template>
  <div class="container flex-col m-auto my-14 md:my-20 text-white text-center">
    <div class="w-36 h-36 m-auto mb-6">
      <img :src="HsuChar" alt="" :class="hsuCharClass">
    </div>

    <div class="flex flex-row text-center text-white">
      <div class="flex flex-col md:flex-row mx-auto space-y-14 md:space-x-14 md:space-y-0">
        <div
          v-if="!pending"
          v-for="(team, index) in sheets['Teams']"
          :key="index"
        >
          <div class="flex flex-col">
            <h1 class="text-3xl mb-2 text-red-600">{{ team.name }}</h1>
            <div
              v-for="(player, index) in teamPlayers(sheets, team.id)"
              :key="index"
            >
              <div class="flex flex-rowm space-x-1">
                <!-- <div class="my-auto text-sm">{{ player.zodiac }}</div> -->
                <div class="my-auto text-lg mx-auto">{{ player.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>Loading...</div>
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

useHead({
  title: "Teams",
});
const { pending, data: sheets } = useLazyFetch("/api/sheets");
function teamPlayers(sheets, team_id) {
  const players = sheets["Players"];
  let team_players = {};
  for (const player in players) {
    if (Object.hasOwnProperty.call(players, player)) {
      const p = players[player];
      if (p.team === team_id) {
        team_players[player] = p;
      }
    }
  }
  return team_players;
}
</script>
