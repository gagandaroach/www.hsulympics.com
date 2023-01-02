<template>
  <section>
    <div class="container mx-auto">
      <div v-if="pending">Loading...</div>
      <div v-else class="text-white">
        <table class="table-auto">
          <thead>
            <tr>
              <th>Team</th>
              <th v-for="(score, index) in sheets['Scores']" :key="index">
                <div v-if="score.show === 'TRUE'">Game {{ score.id }}</div>
              </th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in sheets['Teams']" :key="index">
              <td>{{ team.name }}</td>
              <td v-for="(score, index2) in sheets['Scores']" :key="index2">
                <div v-if="score.show === 'TRUE'">
                  {{ score.scores[team.id - 1] }}
                </div>
              </td>
              <td>
                {{ computeTotalScore(sheets['Scores'], team.id - 1) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div v-if="!pending" v-for="(score, index) in sheets['Scores']" :key="index">
        <div class="flex flex-col bg-blue-100 rounded-lg m-3 p-3">
          <h1 class="text-xl mb-2">{{score.id}}</h1>
          <p>scores: {{ score.scores }}</p>
          <p>dump: {{ score }}</p>
        </div>
      </div> -->
    </div>
  </section>
</template>
<script setup>
// {                                                                                                                          17:06:51
//   '1': { id: '1', scores: [ '10', '5', '3', '1', '5' ], show: 'TRUE' },
//   '2': { id: '2', scores: [ '9', '7', '2', '1', '7' ], show: 'TRUE' },
//   '3': { id: '3', scores: [ '8', '12', '3', '3', '12' ], show: 'TRUE' },
//   '4': { id: '4', scores: [ '8', '3', '3', '0', '3' ], show: 'TRUE' },
//   '5': { id: '5', scores: [ '5', '6', '1', '1', '6' ], show: 'TRUE' },
//   '6': { id: '6', scores: [ '5', '9', '4', '4', '4' ], show: 'TRUE' },
//   '7': { id: '7', scores: [ '7', '5', '5', '5', '5' ], show: 'FALSE' },
//   '8': { id: '8', scores: [ '12', '2', '6', '6', '6' ], show: 'FALSE' },
//   '9': { id: '9', scores: [ '3', '3', '4', '5', '4' ], show: 'FALSE' },
//   '10': { id: '10', scores: [ '6', '12', '3', '6', '4' ], show: 'FALSE' }
// }
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


</script>
