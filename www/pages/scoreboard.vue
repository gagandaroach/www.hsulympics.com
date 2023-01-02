<template>
  <section class="container mx-auto space-y-2">
    <!-- Headline -->
    <div class="flex justify-between my-4">
      <div class="flex flex-col space-y-2">
        <div :class="headlineTextClass">Scoreboard</div>
        <div :class="headlineRefreshClass">Last Updated: {{ lastUpdated }}</div>
      </div>
      <div class="flex flex-col space-2">
        <div :class="headlineButtonClass">
        <!-- <div :class="headlineButtonClass" @click="refresh()"> -->
          Reload Data (disabled)
        </div>
        <div :class="headlineButtonClass">
          Rotate Table
        </div>
      </div>
    </div>
    <!-- Scoreboard Table -->
    <div class="flex">
      <div v-if="pending">Loading...</div>
      <div v-else class="text-white">
        <!-- <div>
          Test: {{ activeGameScores(sheets['Scores']) }}
        </div> -->
        <table :class="tableClass">
          <thead>
            <tr>
              <th :class="tableHeaderTeamClass">Team</th>
              <th v-for="(score, index) in activeGameScores(sheets['Scores'])" :key="index" :class="tableHeaderGameClass">
                Game {{ score.id }}
              </th>
              <th :class="tableHeaderTotalClass">Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in sheets['Teams']" :key="index">
              <td  :class="tableRowTeamClass">{{ team.name }}</td>
              <td v-for="(score, index2) in activeGameScores(sheets['Scores'])" :key="index2" :class="tableRowGameClass">
                  <!-- Debug Sanity Check -->
                  <!-- team: {{team.id - 1 }}, game: {{ score.id }}, score: {{ score.scores[team.id - 1] }} -->
                  <!-- Single Score Display -->
                  {{ score.scores[team.id - 1] }}
              </td>
              <td  :class="tableRowTotalClass">
                {{ computeTotalScore(sheets['Scores'], team.id - 1) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
useHead({
  title: "Scoreboard",
});

const { pending, data: sheets, refresh } = useLazyFetch("/api/sheets");

const rotateTable = useState('rotateTable', () => false);
const lastUpdated = useState('lastUpdated', () => "on page load");

const tableClass = "table-auto border-collapse border border-slate-500 mt-8 bg-black";

const tableHeaderBaseClass = `md:text-xl text-base p-3`;
const tableHeaderTeamClass = `${tableHeaderBaseClass}`;
const tableHeaderGameClass = `${tableHeaderBaseClass} text-yellow-400`;
const tableHeaderTotalClass = `${tableHeaderBaseClass} text-red-500`;

const tableRowBaseClass = `p-1 border border-slate-500 `;
const tableRowTeamClass = `${tableRowBaseClass} p-3`;
const tableRowGameClass = `${tableRowBaseClass}`;
const tableRowTotalClass = `${tableRowBaseClass} text-right pr-3`;

const headlineTextClass = "text-4xl md:text-7xl text-white";
const headlineRefreshClass = "text-sm md:text-base text-white";
const headlineButtonClass = "flex p-3 m-auto text-white bg-red-700 hover:bg-yellow-400";

function computeTotalScore(game_scores_sheet, team_index) {
  let score = 0
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (game_score.show === 'TRUE')
      {
        const curr_score = parseInt(game_score.scores[team_index]);
        score += curr_score
      }
    }
  }
  return score
}

function activeGameScores(game_scores_sheet) {
  let active_scores = {}
  for (const game in game_scores_sheet) {
    if (Object.hasOwnProperty.call(game_scores_sheet, game)) {
      const game_score = game_scores_sheet[game];
      if (game_score.show === 'TRUE')
      {
        active_scores[game] = game_score
      }
    }
  }
  return active_scores
}

</script>
