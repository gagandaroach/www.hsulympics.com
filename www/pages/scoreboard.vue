<template>
  <section>
    <div class="container mx-auto">
      <div v-if="pending">Loading...</div>
      <div v-else class="text-white">
        <table :class="tableClass">
          <thead>
            <tr>
              <th :class="tableHeaderTeamClass">Team</th>
              <th v-for="(score, index) in sheets['Scores']" :key="index" :class="tableHeaderGameClass">
                <div v-if="score.show === 'TRUE'">Game {{ score.id }}</div>
              </th>
              <th :class="tableHeaderTotalClass">Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in sheets['Teams']" :key="index">
              <td  :class="tableRowTeamClass">{{ team.name }}</td>
              <td v-for="(score, index2) in sheets['Scores']" :key="index2" :class="tableRowGameClass">
                <div v-if="score.show === 'TRUE'">
                  {{ score.scores[team.id - 1] }}
                </div>
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

const { pending, data: sheets } = useLazyFetch("/api/sheets");

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

const tableClass = "table-auto border-collapse border border-slate-500 mt-8"

const tableHeaderBaseClass = `md:text-xl text-base p-3`;
const tableHeaderTeamClass = `${tableHeaderBaseClass}`;
const tableHeaderGameClass = `${tableHeaderBaseClass} text-yellow-400`;
const tableHeaderTotalClass = `${tableHeaderBaseClass} text-red-500`;

const tableRowBaseClass = `p-1 border border-slate-500 `;
const tableRowTeamClass = `${tableRowBaseClass} p-3`;
const tableRowGameClass = `${tableRowBaseClass}`;
const tableRowTotalClass = `${tableRowBaseClass} text-right pr-3`;

</script>
