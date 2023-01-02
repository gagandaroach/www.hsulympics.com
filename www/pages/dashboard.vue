<template>
  <section>
    <p>DASHBOARD PLACEHOLDER</p>
    {{ data }}
  </section>
</template>

<script setup lang="ts">
  useHead({
    title: "Scores Dashboard"
  });
  const { data: data } = await useFetch('/api/sheets');
  
</script>
