<template>
  <section>
    <div>
      <div
        v-if="hideGames"
        class="container flex flex-col text-hsu-red tracking-wide md:text-lg text-xs mx-auto mt-60 text-center"
      >
        <div>wouldn't hs-you like to know : )</div>
      </div>

      <div v-else class="">
        <div
          v-if="hsuStore.loaded"
          v-for="(game, index) in hsuStore.games"
          :key="index"
          class=""
        >
          <div
            v-if="game.show === 'TRUE'"
            class="flex flex-col text-white mx-auto px-3 md:mx-12 my-8 text-xl space-y-1"
          >
            <h1 class="text-4xl text-hsu-red mb-2 text-center">
              {{ game.name }}
            </h1>
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
            <div>
              <h2 class="text-hsu-red">Rules</h2>
              <div v-for="[index, rule_str] in game.rules.split('\n').entries()" :key="index">
                <!-- 0 -->
                <p class="mt-2" v-if="parseInt(rule_str[0])==0">{{rule_str.substr(1)}}</p>
                <!-- 1 -->
                <ul v-if="parseInt(rule_str[0])==1" :class="`list-disc ${class_list}`">
                  <li>
                    {{rule_str.substr(1)}}
                  </li>
                </ul>
                <!-- 2 hollow -->
                <ul v-if="parseInt(rule_str[0])==2" :class="`list-[circle] ${class_list}`">
                  <ul :class="`list-[circle] ${class_list}`">
                    <li>
                      {{rule_str.substr(1)}}
                    </li>
                  </ul>
                </ul>
                <!-- 3 square -->
                <ul v-if="parseInt(rule_str[0])==3" :class="`list-[square] ${class_list}`">
                  <ul :class="`list-[square] ${class_list}`">
                    <ul :class="`list-[square] ${class_list}`">
                      <li>
                        {{rule_str.substr(1)}}
                      </li>
                    </ul>
                  </ul>
                </ul>
                <!-- 4 triangle -->
                <ul v-if="parseInt(rule_str[0])==4" :class="`list-disc ${class_list}`">
                  <ul :class="`list-disc ${class_list}`">
                    <ul :class="`list-disc ${class_list}`">
                      <ul :class="`list-disc ${class_list}`">
                        <li>
                          {{rule_str.substr(1)}}
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
                <p class="mt-2" v-if="parseInt(str[0])==0">{{str.substr(1)}}</p>
                <!-- 1 -->
                <ul v-if="parseInt(str[0])==1" :class="`list-disc ${class_list}`">
                  <li>
                    {{str.substr(1)}}
                  </li>
                </ul>
                <!-- 2 hollow -->
                <ul v-if="parseInt(str[0])==2" :class="`list-[circle] ${class_list}`">
                  <ul :class="`list-[circle] ${class_list}`">
                    <li>
                      {{str.substr(1)}}
                    </li>
                  </ul>
                </ul>
                <!-- 3 square -->
                <ul v-if="parseInt(str[0])==3" :class="`list-[square] ${class_list}`">
                  <ul :class="`list-[square] ${class_list}`">
                    <ul :class="`list-[square] ${class_list}`">
                      <li>
                        {{str.substr(1)}}
                      </li>
                    </ul>
                  </ul>
                </ul>
                <!-- 4 triangle -->
                <ul v-if="parseInt(str[0])==4" :class="`list-disc ${class_list}`">
                  <ul :class="`list-disc ${class_list}`">
                    <ul :class="`list-disc ${class_list}`">
                      <ul :class="`list-disc ${class_list}`">
                        <li>
                          {{str.substr(1)}}
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
