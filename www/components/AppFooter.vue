<script setup>
const appConfig = useAppConfig();
const buttonClass = "flex p-3 rounded-xl m-3 " + appConfig.theme.colors.primary;
const buttonClassBig = "flex p-5 rounded-xl " + appConfig.theme.colors.primary;
</script>
<template>
  <div class="flex p-5 justify-center">
    <div :class="buttonClass">
      <NuxtLink to="/teams">Teams</NuxtLink>
    </div>
    <div :class="buttonClassBig">
      <NuxtLink to="/dashboard">Scores</NuxtLink>
    </div>
    <div :class="buttonClass">
      <NuxtLink to="/games">Games</NuxtLink>
    </div>
    <!-- <div :class="buttonClass">
      <NuxtLink to="/about">About</NuxtLink>
    </div> -->
  </div>
</template>
