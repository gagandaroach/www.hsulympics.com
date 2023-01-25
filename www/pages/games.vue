<template>
  <section>
    <div>
      <div v-if="hideGames"
        class="container flex flex-col text-hsu-red tracking-wide md:text-lg text-xs mx-auto mt-60 text-center">
        <div>wouldn't hs-you like to know : )</div>
      </div>

      <div v-else class="">
        <!-- All Game Cards Container -->
        <div v-if="hsuStore.loaded" v-for="(game, index) in hsuStore.games" :key="index" class="">
          <!-- Game Card -->
          <div v-if="game.show === 'TRUE'"
            class="flex flex-col text-white mx-auto mt-6 md:mx-36 mb-12 text-base md:text-xl space-y-2 p-1 md:p-0">
            <div class="border-slate-500 border p-4">
              <div>
                <p class="text-sm md:text-base text-slate-500 text-start md:absolute p-1">Game {{ game.id }}</p>
                <h1 class="text-6xl text-hsu-red mb-6 text-center">
                  {{ game.name }}
                </h1>
              </div>
              <!-- if desktop -->
              <div class="flex flex-row text-center lg:visible collapse">
                <table class="table-auto border-collapse w-full h-auto bg-black">
                  <thead>
                    <tr class="text-hsu-red">
                      <th v-if="game.order" class="p-1 border-solid border-slate-500 border w-1/3">Objective</th>
                      <th v-if="game.order" class="p-1 border-solid border-slate-500 border w-1/3">Format</th>
                      <th v-if="game.order" class="p-1 border-solid border-slate-500 border w-1/3">Team Order</th>
                      <th v-if="!game.order" class="p-1 border-solid border-slate-500 border w-1/2">Objective</th>
                      <th v-if="!game.order" class="p-1 border-solid border-slate-500 border w-1/2">Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="py-3">
                      <td v-if="game.order" class="p-1 border-solid border-slate-500 border text-justify align-top px-4 w-1/3">{{ game.obj }}</td>
                      <td v-if="game.order" class="p-1 border-solid border-slate-500 border text-justify align-top px-4 w-1/3">{{ game.format }}</td>
                      <td v-if="game.order" class="p-1 border-solid border-slate-500 border text-justify align-top px-4 w-1/3">{{ game.order }}</td>
                      <td v-if="!game.order" class="p-1 border-solid border-slate-500 border text-justify align-top px-4 w-1/2">{{ game.obj }}</td>
                      <td v-if="!game.order" class="p-1 border-solid border-slate-500 border text-justify align-top px-4 w-1/2">{{ game.format }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- if mobile -->
              <div class="flex flex-col lg:hidden visible">
                <div>
                  <h2 class="text-hsu-red">Objective</h2>
                  <p>{{ game.obj }}</p>
                </div>
                <div>
                  <h2 class="text-hsu-red">Format</h2>
                  <p>{{ game.format }}</p>
                </div>
                <div>
                  <h2 v-if="game.order" class="text-hsu-red">Order</h2>
                  <p>{{ game.order }}</p>
                </div>
              </div>
            </div>
            <!-- Image and Rules -->
            <div>
              <h2 class="text-hsu-red">Rules</h2>
              <!-- Image -->
              <img :src="`https://drive.google.com/uc?id=${game.img}`" alt="Google Drive Game Details" class="aspect-auto h-96 w-auto md:float-right m-2 md:m-6" onerror='this.style.display = "none"' />
              <!-- Rules Section -->
              <div v-for="[index, rule_str] in game.rules.split('\n').entries()" :key="index">
                <!-- 0 -->
                <p class="mt-2" v-if="parseInt(rule_str[0]) == 0">{{ rule_str.substr(1) }}</p>
                <!-- 1 -->
                <ul v-if="parseInt(rule_str[0]) == 1" :class="`list-disc ${class_list}`">
                  <li>
                    {{ rule_str.substr(1) }}
                  </li>
                </ul>
                <!-- 2 hollow -->
                <ul v-if="parseInt(rule_str[0]) == 2" :class="`list-[circle] ${class_list}`">
                  <ul :class="`list-[circle] ${class_list}`">
                    <li>
                      {{ rule_str.substr(1) }}
                    </li>
                  </ul>
                </ul>
                <!-- 3 square -->
                <ul v-if="parseInt(rule_str[0]) == 3" :class="`list-[square] ${class_list}`">
                  <ul :class="`list-[square] ${class_list}`">
                    <ul :class="`list-[square] ${class_list}`">
                      <li>
                        {{ rule_str.substr(1) }}
                      </li>
                    </ul>
                  </ul>
                </ul>
                <!-- 4 triangle -->
                <ul v-if="parseInt(rule_str[0]) == 4" :class="`list-disc ${class_list}`">
                  <ul :class="`list-disc ${class_list}`">
                    <ul :class="`list-disc ${class_list}`">
                      <ul :class="`list-disc ${class_list}`">
                        <li>
                          {{ rule_str.substr(1) }}
                        </li>
                      </ul>
                    </ul>
                  </ul>
                </ul>
              </div>
              <!-- <p>{{ game.rules.split('\n') }}</p> -->
            </div>
            <div v-if="game.scoring">
              <h2 class="text-hsu-red">Scoring</h2>
              <div v-for="[index, str] in game.scoring.split('\n').entries()" :key="index">
                <!-- 0 -->
                <p class="mt-2" v-if="parseInt(str[0]) == 0">{{ str.substr(1) }}</p>
                <!-- 1 -->
                <ul v-if="parseInt(str[0]) == 1" :class="`list-disc ${class_list}`">
                  <li>
                    {{ str.substr(1) }}
                  </li>
                </ul>
                <!-- 2 hollow -->
                <ul v-if="parseInt(str[0]) == 2" :class="`list-[circle] ${class_list}`">
                  <ul :class="`list-[circle] ${class_list}`">
                    <li>
                      {{ str.substr(1) }}
                    </li>
                  </ul>
                </ul>
                <!-- 3 square -->
                <ul v-if="parseInt(str[0]) == 3" :class="`list-[square] ${class_list}`">
                  <ul :class="`list-[square] ${class_list}`">
                    <ul :class="`list-[square] ${class_list}`">
                      <li>
                        {{ str.substr(1) }}
                      </li>
                    </ul>
                  </ul>
                </ul>
                <!-- 4 triangle -->
                <ul v-if="parseInt(str[0]) == 4" :class="`list-disc ${class_list}`">
                  <ul :class="`list-disc ${class_list}`">
                    <ul :class="`list-disc ${class_list}`">
                      <ul :class="`list-disc ${class_list}`">
                        <li>
                          {{ str.substr(1) }}
                        </li>
                      </ul>
                    </ul>
                  </ul>
                </ul>
              </div>
            </div>
            <!-- <p>_dump: {{ game }}</p> -->
          </div>
        </div>
        <div v-else class="text-white text-center">Loading...</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useHsuDataStore } from "~/stores/hsuData";

const hsuStore = useHsuDataStore();
if (!hsuStore.loaded) {
  hsuStore.refreshSheets();
}

useHead({
  title: "Games",
});

const hideGames = false;
const class_list = "list-inside pl-8"
</script>
