<template>
  <section>
    <div class="">
      <div v-if="!pending" v-for="(game, index) in sheets['Games']" :key="index">
        <div v-if="game.show === 'TRUE'" class="container flex flex-col bg-blue-100 rounded-lg m-3 mx-auto p-3">
          <h1 class="text-xl mb-2">{{game.name}}</h1>
          <p>Objective: {{ game.obj }}</p>
          <p>_id: {{ game.id }}</p>
          <p>_show: {{ game.show }}</p>
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
    title: "Games"
  });
  const { pending, data: sheets } = useLazyFetch('/api/sheets')
</script>
