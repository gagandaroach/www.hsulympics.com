<template>
  <div class="container flex-col m-auto my-14 md:my-20 text-white text-center">
    <img :src="HsuChar" alt="" :class="hsuCharClass">
    <div>
      <h1 class="text-4xl">Hsulympics VI</h1>
      <p class="text-base">January 28, 2023</p>
    </div>
      <!-- <p class="text-base">San Mateo, CA</p> -->
    <div class="flex flex-row m-10">
      <CountDown end="January 28, 2023" />
    </div>
    <div>
      test store
      <div>
        {{  hsuStore.loaded }}
      </div>
    </div>
  </div>
</template>

<script setup>
import HsuChar from "assets/svgs/hsuCharacter.svg";
import { useHsuDataStore } from "~/stores/hsuData";

const hsuStore = useHsuDataStore()
hsuStore.refreshSheets()

const hsuCharClass = "w-64 h-64 m-auto";

</script>