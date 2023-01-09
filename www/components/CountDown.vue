<template>
  <div class="flex flex-row text-center text-white space-x-12 md:space-x-16 m-auto">
    <div class="flex flex-col space-y-2">
      <div class="text-2xl md:text-6xl" >{{days}}</div>
      <div>days</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="text-2xl md:text-6xl" >{{ hrs }}</div>
      <div>hrs</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="text-2xl md:text-6xl" >{{ mins }}</div>
      <div>mins</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="text-2xl md:text-6xl" >{{ secs }}</div>
      <div>secs</div>
      <!-- <div>{{ seconds_to_la }}</div> -->
      <!-- <div>{{ seconds_to_launch() }}</div> -->
    </div>
  </div>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core' // VueUse helper, install it

let stls = useState('secs_to_launch_state', () => 1673251944811.582);

let launch_day = new Date();
launch_day.setTime(1674925200 * 1000);

const days = 18;
const hrs = 4;
const mins = 3;
const secs = 50;

function time_to_launch() {
    data = {}
    let today = new Date();
    const total_seconds = launch_day - today / 1000;
    
    let days = int(total_seconds/86400)

    data['days'] = days
    return days
}

// const { pause, resume, isActive } = useIntervalFn(() => {
//     refresh_seconds();
// }, 500);

</script>
