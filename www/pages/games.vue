<template>
  <section>
    <div class="">
      <div v-for="(game, index) in data['data']['Games']" :key="index">
        <div v-if="game.show === 'TRUE'" class="container flex flex-col bg-blue-100 rounded-lg m-3 mx-auto p-3">
          <h1 class="text-xl mb-2">{{game.name}}</h1>
          <p>Objective: {{ game.obj }}</p>
          <p>_id: {{ game.id }}</p>
          <p>_show: {{ game.show }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  useHead({
    title: "Games"
  });
  const { data: data } = useFetch('/api/sheets')
</script>
