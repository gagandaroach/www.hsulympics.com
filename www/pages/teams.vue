<template>
  <section>
    <div class="">
      <div v-for="(team, index) in data['data']['Teams']" :key="index">
        <div class="container flex flex-col bg-blue-100 rounded-lg m-3 mx-auto p-3">
          <h1 class="text-xl mb-2">{{team.name}}</h1>
          <p>Players: {{ team.members }}</p>
          <p>_id: {{ team.id }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  useHead({
    title: "Teams"
  });
  const { data: data } = useFetch('/api/sheets')
</script>
