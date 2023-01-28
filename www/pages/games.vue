<template>
  <section>
    <div>
      <div v-if="!hsuStore.live"
        class="container flex flex-col text-hsu-red tracking-wide md:text-lg text-xs mx-auto mt-60 text-center">
        <div>wouldn't hs-you like to know : )</div>
      </div>

      <div v-else class="">
        <!-- All Game Cards Container -->
        <div v-if="hsuStore.loaded" v-for="(game, index) in hsuStore.games" :key="index" class="">
          <!-- Game Card -->
          <div v-if="game.show === 'TRUE'"
            class="flex flex-col text-white mx-auto mt-6 md:mx-36 mb-20 text-base md:text-2xl space-y-2 p-1 md:p-0 border-stone-900">
            <div class="p-4 bg-stone-900 rounded-sm">
              <div>
                <p class="text-sm md:text-base text-slate-500 text-start lg:absolute p-1">Game {{ game.id }}</p>
                <h1 class="text-6xl text-hsu-red mb-6 text-center">
                  {{ game.name }}
                </h1>
              </div>
              <!-- if desktop -->
              <div class="flex flex-row text-center lg:block hidden">
                <table class="table-auto border-collapse w-full h-auto">
                  <thead>
                    <tr class="text-hsu-red">
                      <th v-if="game.order" class="p-1 w-1/3">Objective</th>
                      <th v-if="game.order" class="p-1 w-1/3">Format</th>
                      <th v-if="game.order" class="p-1 w-1/3">Team Order</th>
                      <th v-if="!game.order" class="p-1 w-1/2">Objective</th>
                      <th v-if="!game.order" class="p-1 w-1/2">Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="py-3">
                      <td v-if="game.order" class="p-1 align-top px-4 w-1/3">{{ game.obj }}</td>
                      <td v-if="game.order" class="p-1 align-top px-4 w-1/3">{{ game.format }}</td>
                      <td v-if="game.order" class="p-1 align-top px-4 w-1/3">{{ game.order }}</td>
                      <td v-if="!game.order" class="p-1 align-top px-4 w-1/2">{{ game.obj }}</td>
                      <td v-if="!game.order" class="p-1 align-top px-4 w-1/2">{{ game.format }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- if mobile -->
              <div class="flex flex-col lg:hidden visible">
                <div>
                  <h2 class="text-hsu-red mt-2">Objective</h2>
                  <p>{{ game.obj }}</p>
                </div>
                <div>
                  <h2 class="text-hsu-red mt-2">Format</h2>
                  <p>{{ game.format }}</p>
                </div>
                <div>
                  <h2 v-if="game.order" class="text-hsu-red mt-2">Team Order</h2>
                  <p>{{ game.order }}</p>
                </div>
              </div>
            </div>
            <!-- Image and Rules -->
            <div class="px-4">
              <!-- Image -->
              <img v-if="game.img" :src="`https://drive.google.com/uc?id=${game.img}`" alt="Google Drive Game Details"
                class="aspect-auto h-96 md:h-[30rem] xl:h-[35rem] w-auto md:float-right m-2 md:m-6 mx-auto hidden md:block"
                onerror='this.style.display = "none"' />
              <!-- Rules Section -->
              <h2 class="text-hsu-red">Rules</h2>
              <div v-for="[index, rule_str] in game.rules.split('\n').entries()" :key="index" class="">
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
              <div v-if="game.scoring" class="">
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
              <!-- Image -->
              <img v-if="game.img" :src="`https://drive.google.com/uc?id=${game.img}`" alt="Google Drive Game Details"
                class="aspect-auto h-auto w-64 md:float-right m-2 mt-12 mx-auto block md:hidden"
                onerror='this.style.display = "none"' />
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

useHead({
  title: "Games",
});

const class_list = "list-inside pl-8"
</script>
