<template>
  <section>
    <div class="container mx-auto">
      <div v-if="!pending" v-for="(score, index) in sheets['Scores']" :key="index">
        <div class="flex flex-col bg-blue-100 rounded-lg m-3 p-3">
          <h1 class="text-xl mb-2">{{score.id}}</h1>
          <p>{{ score.scores }}</p>
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
    title: "Scores Dashboard"
  });
  const { pending, data: sheets } = useLazyFetch('/api/sheets')
</script>
