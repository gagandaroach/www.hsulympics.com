<template>
  <div class="container flex-col m-auto text-white text-center">

    <div>
      <img :src="HsuChar" alt="" :class="hsuCharClass">
    </div>

    <h1 class="text-4xl my-3">Hsulympics VI</h1>
    <p class="text-base">January 28, 2023</p>
    <!-- <p class="text-base">San Mateo, CA</p> -->

  </div>
</template>

<script setup>
import HsuChar from "assets/svgs/hsuCharacter.svg";

const hsuCharClass = "w-64 h-64 m-auto";

</script>