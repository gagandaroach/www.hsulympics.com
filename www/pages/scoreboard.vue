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
          <table :class="tableClass">
            <thead>
              <tr>
                <th :class="`${tableHeaderBaseClass} border-b-2`">
                  <div class="w-32">
                  
                  </div>
              </th>
                <th
                  v-for="(score, index) in activeGameScores(hsuStore.scores)"
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
                  v-for="(score, index2) in activeGameScores(hsuStore.scores)"
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
                    <div class="flex mx-auto text-right">
                      <p>
                        {{ placement_to_score(score.scores[team.id - 1]) }}
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

          <div class="text-sm md:text-base text-white text-end p-1">
                Last Updated: {{ hsuStore.lastUpdated }}
          </div>

          <div class="mt-16">
            <div class="text-xl">Team Placement Stats:</div>
            <div>will use these computed props to dynamically color table</div>
            <div>
              team placement : {{ winningTeamIndexes(hsuStore.scores) }}
            </div>
            <div>team 1 in first? : {{ isInFirst(hsuStore.scores, 0) }}</div>
            <div>team 2 in second? : {{ isInSecond(hsuStore.scores, 1) }}</div>
            <div>team 4 in second? : {{ isInSecond(hsuStore.scores, 3) }}</div>
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

const hsuStore = useHsuDataStore()
if (!hsuStore.loaded) {
  hsuStore.refreshSheets()
};

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

useHead({
  title: "Scoreboard",
});

const hideScoreboard = false;

const rotateTable = useState("rotateTable", () => false);

const { pause, resume, isActive } = useIntervalFn(() => {
  if (!hideScoreboard) {
    hsuStore.refreshSheets()
  }
}, 5000);

const tableClass ="table-auto border-collapse mt-8 bg-black";
const tableHeaderBaseClass = `md:text-2xl text-base border-hsu-red my-2`;
const tableRowBaseClass = `text-4xl text-center h-12 w-auto border-slate-500 p-2`;

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

function activeGameScores(game_scores_sheet) {
  let active_scores = {};
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (game_score.show === "TRUE") {
        active_scores[game] = game_score;
      }
    }
  }
  return active_scores;
}

function isInSecond(game_scores_sheet, team_index) {
  return winningTeamIndexes(game_scores_sheet)["second"].includes(team_index);
}

function isInFirst(game_scores_sheet, team_index) {
  return winningTeamIndexes(game_scores_sheet)["first"].includes(team_index);
}

function winningTeamIndexes(game_scores_sheet) {
  let num_teams = null;

  // Get Num Teams from the first game score's length
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (num_teams === null) {
        num_teams = game_score.scores.length;
        break;
      }
    }
  }

  // Compute all Scores
  let scores = [];
  let max = 0;
  let secondMax = 0;
  for (let index = 0; index < num_teams; index++) {
    const score = computeTotalScore(game_scores_sheet, index);
    scores.push(score);
    if (score > max) {
      max = score;
    }
    if (score < max && score > secondMax) {
      secondMax = score;
    }
  }

  // Get Max Score IDx
  let max_idx = [];
  let second_idx = [];
  for (let index = 0; index < num_teams; index++) {
    if (scores[index] === max) {
      max_idx.push(index);
    }
    if (scores[index] === secondMax) {
      second_idx.push(index);
    }
  }

  return {
    first: max_idx,
    second: second_idx,
  };
}
</script>
