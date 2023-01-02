<template>
  <section>
    <div class="container mx-auto">
      <div v-if="pending">
        Loading...
      </div>
      <div v-else class="text-white">
        <table class="table-auto">
          <thead>
            <tr>
              <th>Team</th>
              <th v-for="(score, index) in sheets['Scores']" :key="index">
                <div v-if="score.show === 'TRUE'" >
                  Game {{score.id}}
                </div>
              </th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in sheets['Teams']" :key="index">
              <td>{{ team.name }}</td>
              <td v-for="(score, index2) in sheets['Scores']" :key="index2">
                <div v-if="score.show === 'TRUE'" >
                  {{score.scores[team.id - 1]}}
                </div>
              </td>
              <td>TODO</td>
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
  useHead({
    title: "Scoreboard"
  });
  const { pending, data: sheets } = useLazyFetch('/api/sheets');
</script>
