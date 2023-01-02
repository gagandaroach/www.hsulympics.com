<template>
  <section>
    <div class="">
      <div v-if="!pending" v-for="(team, index) in sheets['Teams']" :key="index">
        <div class="container flex flex-col text-white bg-black border-2 border-solid border-red-900 rounded-lg m-3 mx-auto p-3">
          <h1 class="text-2xl text-yellow-400 mb-2">Team {{team.name}}</h1>
          <p class="text-base text-red-400"> {{team.bio}} </p>
          <p class="text-center mt-4">Roster</p>
          <div ></div>
          <!-- <p>_id: {{ team.id }}</p> -->
          <!-- <p>_dump: {{ team }}</p> -->
          <div v-for="(player, index) in teamPlayers(sheets, team.id)" :key="index">
            <div class="flex justify-center space-x-2">
              <div class="my-auto text-lg text-red-500"> {{ player.name }}</div>
              <div class="my-auto text-sm">Year of the {{ player.zodiac }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
  </section>
</template>

<script setup>
  useHead({
    title: "Teams"
  });
  const { pending, data: sheets } = useLazyFetch('/api/sheets')
  function teamPlayers(sheets, team_id) {
    const players = sheets['Players'];
    let team_players = {};
    for (const player in players) {
      if (Object.hasOwnProperty.call(players, player)) {
        const p = players[player];
        if (p.team === team_id) {
          team_players[player] = p;
        }
      }
    }
    return team_players
  }
</script>
