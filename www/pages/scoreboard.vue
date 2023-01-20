<template>
  <section class="container mx-auto space-y-2">
    <div v-if="hideScoreboard" class="container flex flex-col text-hsu-red md:text-lg text-xs mx-auto mt-60 text-center">
      coming hs-oon
    </div>
    <div v-else>
      <!-- Headline -->
      <div class="flex justify-between my-4">
        <div class="flex flex-col space-y-2">
          <div :class="headlineTextClass">Scoreboard</div>
          <div :class="headlineRefreshClass">
            Last Updated: {{ lastUpdated }}
          </div>
        </div>
        <div class="flex flex-col space-y-2 space-x-2">
          <!-- <div :class="headlineButtonClass">
          Reload Data (disabled) -->
          <!-- <div :class="headlineButtonClass" @click="refresh()">
          Reload Data
        </div> -->
          <!-- <div :class="headlineButtonClass">
          Rotate Table (TODO)
        </div> -->
        </div>
      </div>
      <!-- Scoreboard Table -->
      <div class="flex">
        <div v-if="pending && firstLoad">Loading...</div>
        <div v-else class="text-white">
          <table :class="tableClass">
            <thead>
              <tr>
                <th :class="tableHeaderTeamClass">Team</th>
                <th
                  v-for="(score, index) in activeGameScores(sheets['Scores'])"
                  :key="index"
                  :class="tableHeaderGameClass"
                >
                  Game {{ score.id }}
                </th>
                <th :class="tableHeaderTotalClass">Total Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, index) in sheets['Teams']" :key="index">
                <td :class="tableRowTeamClass">{{ team.name }}</td>
                <td
                  v-for="(score, index2) in activeGameScores(sheets['Scores'])"
                  :key="index2"
                  :class="tableRowGameClass"
                >
                  <!-- Debug Sanity Check -->
                  <!-- team: {{team.id - 1 }}, game: {{ score.id }}, score: {{ score.scores[team.id - 1] }} -->
                  <!-- Single Score Display -->
                  {{ score.scores[team.id - 1] }}
                </td>
                <td :class="tableRowTotalClass">
                  {{ computeTotalScore(sheets["Scores"], team.id - 1) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-16">
            <div class="text-xl">Team Placement Stats:</div>
            <div>will use these computed props to dynamically color table</div>
            <div>
              team placement : {{ winningTeamIndexes(sheets["Scores"]) }}
            </div>
            <div>team 1 in first? : {{ isInFirst(sheets["Scores"], 0) }}</div>
            <div>team 2 in second? : {{ isInSecond(sheets["Scores"], 1) }}</div>
            <div>team 4 in second? : {{ isInSecond(sheets["Scores"], 3) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useIntervalFn } from "@vueuse/core"; // VueUse helper, install it

useHead({
  title: "Scoreboard",
});

const hideScoreboard = true;

const { pending, data: sheets, refresh } = useLazyFetch("/api/sheets");

const rotateTable = useState("rotateTable", () => false);
const lastUpdated = useState("lastUpdated", () => new Date().toUTCString());
const firstLoad = useState("firstLoad", () => true);

watch(sheets, (newSheets) => {
  lastUpdated.value = new Date().toUTCString();
  firstLoad.value = false;
});

const { pause, resume, isActive } = useIntervalFn(() => {
  refresh();
}, 5000);

const tableClass =
  "table-auto border-collapse border border-slate-500 mt-8 bg-black";

const tableHeaderBaseClass = `md:text-2xl text-base p-3`;
const tableHeaderTeamClass = `${tableHeaderBaseClass}`;
const tableHeaderGameClass = `${tableHeaderBaseClass} text-yellow-400`;
const tableHeaderTotalClass = `${tableHeaderBaseClass} text-red-500`;

const tableRowBaseClass = `p-1 text-xl text-center border border-slate-500 `;
const tableRowTeamClass = `${tableRowBaseClass} p-3`;
const tableRowGameClass = `${tableRowBaseClass} hover:bg-red-900`;
const tableRowTotalClass = `${tableRowBaseClass} text-right pr-3`;

const headlineTextClass = "text-4xl md:text-7xl text-white";
const headlineRefreshClass = "text-sm md:text-base text-white";
const headlineButtonClass =
  "flex p-3 m-auto text-white bg-red-700 hover:bg-yellow-400 mr-2";

function computeTotalScore(game_scores_sheet, team_index) {
  let score = 0;
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (game_score.show === "TRUE") {
        const curr_score = parseInt(game_score.scores[team_index]);
        score += curr_score;
      }
    }
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
