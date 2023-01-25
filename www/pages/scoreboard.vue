<template>
  <section class="mx-auto space-y-2">
    <div v-if="hideScoreboard" class="container flex flex-col text-hsu-red md:text-lg text-xs mx-auto mt-60 text-center">
      coming hs-oon
    </div>
    <div v-else class="mx-auto">
      <!-- Scoreboard Table -->
      <div class="flex mx-auto">
        <div v-if="!hsuStore.loaded" class="text-white text-center">Loading...</div>
        <div v-else class="text-white mx-auto">
          <div class="flex flex-col mr-1">
            <table :class="tableClass">
            <thead>
              <tr>
                <th :class="`${tableHeaderBaseClass} border-b-2`">
                  <div class="w-32">
                  
                  </div>
              </th>
                <th
                  v-for="(score, index) in hsuStore.activeGameScores"
                  :key="index"
                  :class="`${tableHeaderBaseClass} border-b-2 text-yellow-400`"
                >
                <div class="flex flex-row">
                  <div class="w-32 pb-3">
                    {{  hsuStore.games[score.id].name }}
                  </div>
                </div>
                </th>
                <th :class="`${tableHeaderBaseClass} text-hsu-red border-b-2`">
                  <div class="w-32 pb-3">
                    Total Score
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, index) in hsuStore.teams" :key="index">
                <td :class="`${tableRowBaseClass} border-r-2 border-hsu-red`">{{ team.name }}</td>
                <td
                  v-for="(score, index2) in hsuStore.activeGameScores"
                  :key="index2"
                  :class="`${tableRowBaseClass} text-6xl border-b-2`"
                >
                  <!-- Debug Sanity Check -->
                  <!-- team: {{team.id - 1 }}, game: {{ score.id }}, score: {{ score.scores[team.id - 1] }} -->
                  <!-- Single Score Display -->
                  <div class="flex flex-row grow">
                    <div v-if="score.scores[team.id - 1] !== '--'" class="w-6 h-6 m-auto absolute">
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
                    {{ computeTotalScore(hsuStore.scores, team.id - 1) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-sm md:text-base text-slate-500 text-center p-1">
                Last Updated: {{ hsuStore.lastUpdated }}
          </div>
        </div>


          <div class="mt-16">
            <div class="text-xl">Team Placement Stats:</div>
            <!-- <div>will use these computed props to dynamically color table</div>
            <div>
              team placement : {{ winningTeamIndexes(hsuStore.scores) }}
            </div>
            <div>team 1 in first? : {{ isInFirst(hsuStore.scores, 0) }}</div>
            <div>team 2 in second? : {{ isInSecond(hsuStore.scores, 1) }}</div>
            <div>team 4 in second? : {{ isInSecond(hsuStore.scores, 3) }}</div> -->
            <!-- <div>teamScoresForGame(0): {{ hsuStore.teamScoresForGame(0) }}</div> -->
            <div>teamPositionsForGame(1): {{ hsuStore.teamPositionsForGame(1) }}</div>
            <div>teamPositionsForGame(2): {{ hsuStore.teamPositionsForGame(2) }}</div>
            <div>teamPositionsForGame(7): {{ hsuStore.teamPositionsForGame(7) }}</div>
            <div>teamScoresForGame(1): {{ hsuStore.teamScoresForGame(1) }}</div>
            <div>teamScoresForGame(7): {{ hsuStore.teamScoresForGame(7) }}</div>
            <!-- <div>activeGames: {{ hsuStore.activeGames }}</div> -->
            <!-- <div>teams: {{ hsuStore.teams }}</div> -->
            <!-- <div>activeGameScores: {{ hsuStore.activeGameScores }}</div> -->
          </div>
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

const tableClass ="table-auto border-collapse mt-8 bg-black mx-auto";
const tableHeaderBaseClass = `md:text-2xl text-base border-hsu-red my-2`;
const tableRowBaseClass = `text-4xl text-center h-12 w-auto border-slate-500 p-2`;

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

function computeTotalScore(game_scores_sheet, team_index) {
  let score = 0;
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (game_score.show === "TRUE") {
        const curr_score = game_score.scores[team_index];
        if (curr_score !== '--')
        {
          score += parseInt(placement_to_score(curr_score));
        }
      }
    }
  }
  if (score == 0)
  {
    return '--'
  }
  return score;
}

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

const placement_to_score_map = {
  1: 20,
  2: 16,
  3: 13,
  4: 10,
  5: 8
}

function placement_to_score(placement) {
  switch (placement) {
    case "1":
      return placement_to_score_map[placement]
    case "2":
      return placement_to_score_map[placement]
    case "3":
      return placement_to_score_map[placement]
    case "4":
      return placement_to_score_map[placement]
    case "5":
      return placement_to_score_map[placement]
    default:
      return "--"
  }
}
</script>
