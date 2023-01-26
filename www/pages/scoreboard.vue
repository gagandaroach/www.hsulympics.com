<template>
  <section class="mx-auto space-y-2 bg-black">
    <div v-if="hideScoreboard" class="container flex flex-col text-hsu-red md:text-lg text-xs mx-auto mt-60 text-center">
      coming hs-oon
    </div>
    <div v-else class="mx-auto">
      <div class="m-auto">
        <div v-if="!hsuStore.loaded" class="text-white text-center">Loading...</div>
        <div v-else class="text-white mx-auto">
          <!-- Scoreboard Table -->
          <div class="flex flex-col">
            <table :class="tableClass">
              <thead>
                <tr>
                  <th :class="`${tableHeaderBaseClass} border-b-2`">
                    <div class="w-32">
                      <!-- Upper Left Corner Cell -->
                    </div>
                  </th>
                  <th v-for="(score, index) in hsuStore.activeGameScores" :key="index"
                    :class="`${tableHeaderBaseClass} border-b-2 text-yellow-400`">
                    <div class="flex flex-row">
                      <div class="w-32 pb-3">
                        {{ hsuStore.games[score.id].name }}
                      </div>
                    </div>
                  </th>
                  <th :class="`${tableHeaderBaseClass} text-hsu-red border-b-2`">
                    <div class="w-32 pb-3 mx-auto">
                      Total Score
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(team, index) in hsuStore.teams" :key="index">
                  <td :class="`${tableRowBaseClass} border-r-2 border-hsu-red`">{{ team.name }}</td>
                  <td v-for="(score, index2) in hsuStore.activeGameScores" :key="index2"
                    :class="`${tableRowBaseClass} text-6xl border-b-2`">
                    <!-- Debug Sanity Check -->
                    <!-- team: {{team.id - 1 }}, game: {{ score.id }}, score: {{ score.scores[team.id - 1] }} -->
                    <!-- Single Score Display -->
                    <div class="flex flex-row grow">
                      <div v-if="score.scores[team.id - 1] !== '--'" class="w-7 h-7 m-auto absolute">
                        <!-- {{ score.scores[team.id - 1] }} -->
                        <img :src="placement_to_trophy_svg(score.scores[team.id - 1])" alt="" class="bg-black">
                      </div>
                      <div class="flex mx-auto p-4">
                        <p>
                          <!-- {{ placement_to_score(score.scores[team.id - 1]) }} -->
                          {{ hsuStore.teamScoresForGame(score.id)[team.id] }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td :class="`${tableRowBaseClass} text-right text-7xl border-2 border-hsu-red`">
                    {{ hsuStore.totalScores()[team.id] }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Last Updated Line -->
            <div class="text-sm md:text-base text-slate-500 text-end p-1">
              Last Updated: {{ hsuStore.lastUpdated }}
            </div>
            <TeamLeadChart />
          </div>
          <!-- Debugging Data -->
          <!-- <div class="mt-16">
            <div class="text-xl">Team Placement Stats:</div>
            <div>teamPositionsForGame(1): {{ hsuStore.teamPositionsForGame(1) }}</div>
            <div>teamPositionsForGame(2): {{ hsuStore.teamPositionsForGame(2) }}</div>
            <div>teamPositionsForGame(7): {{ hsuStore.teamPositionsForGame(7) }}</div>
            <div>teamScoresForGame(1): {{ hsuStore.teamScoresForGame(1) }}</div>
            <div>teamScoresForGame(7): {{ hsuStore.teamScoresForGame(7) }}</div>
            <div>num_teams: {{ hsuStore.num_teams }}</div>
            <div>totalScores(): {{ hsuStore.totalScores() }}</div>
            <div>activeGameScoresWithScore: {{ hsuStore.activeGameScoresWithScore }}</div>
            <div>teamTotalScores: {{ hsuStore.teamTotalScores() }}</div>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useIntervalFn } from "@vueuse/core"; // VueUse helper, install it
import { useHsuDataStore } from "~/stores/hsuData";

import place1 from "assets/svgs/place1.svg";
import place2 from "assets/svgs/place2.svg";
import place3 from "assets/svgs/place3.svg";
import place4 from "assets/svgs/place4.svg";
import place5 from "assets/svgs/place5.svg";

const tableClass ="table-auto border-collapse mx-auto";
const tableHeaderBaseClass = `md:text-xl text-base border-hsu-red my-2`;
const tableRowBaseClass = `text-4xl text-center h-12 w-auto border-stone-900 p-2`;

const hsuStore = useHsuDataStore()
if (!hsuStore.loaded) {
  hsuStore.refreshSheets()
};

useHead({
  title: "Scoreboard",
});

const hideScoreboard = false;
const rotateTable = useState("rotateTable", () => false);
const { pause, resume, isActive } = useIntervalFn(() => {
  if (!hideScoreboard) {
    hsuStore.refreshSheets()
  }
}, 50000);

function placement_to_trophy_svg(placement) {
  switch (placement) {
    case "1":
      return place1
    case "2":
      return place2
    case "3":
      return place3
    case "4":
      return place4
    case "5":
      return place5
    default:
      return ""
  }
}
</script>
