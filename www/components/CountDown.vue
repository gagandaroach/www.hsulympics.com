<template>
  <div class="flex m-auto text-center text-white">
    <Transition>
      <div v-if="loaded" class="flex flex-row space-x-12 md:space-x-16 m-auto">
        <div class="flex flex-col space-y-2">
          <div class="text-4xl md:text-6xl">{{ days }}</div>
          <div class="text-white">{{ days > 1 ? "days" : "day" }}</div>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="text-4xl md:text-6xl">{{ hours }}</div>
          <div class="text-white">{{ hours > 1 ? "hours" : "hour" }}</div>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="text-4xl md:text-6xl">{{ minutes }}</div>
          <div class="text-white">{{ minutes > 1 ? "mins" : "min" }}</div>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="text-4xl md:text-6xl">{{ seconds }}</div>
          <div class="text-white">secs</div>
          <!-- <div>{{ seconds_to_la }}</div> -->
          <!-- <div>{{ seconds_to_launch() }}</div> -->
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
let interval = null;

export default {
  name: "vuejsCountDown",
  props: {
    deadline: {
      type: String,
    },
    end: {
      type: String,
    },
    stop: {
      type: Boolean,
    },
  },
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      date: null,
      diff: 0,
    };
  },
  created() {
    if (!this.deadline && !this.end) {
      throw new Error("Missing props 'deadline' or 'end'");
    }

    let endTime = this.deadline ? this.deadline : this.end;
    this.date = Math.trunc(Date.parse(endTime.replace(/-/g, "/")) / 1000);

    if (!this.date) {
      throw new Error("Invalid props value, correct the 'deadline' or 'end'");
    }

    interval = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 250);
  },
  computed: {
    seconds() {
      return Math.trunc(this.diff) % 60;
    },

    minutes() {
      return Math.trunc(this.diff / 60) % 60;
    },

    hours() {
      return Math.trunc(this.diff / 60 / 60) % 24;
    },

    days() {
      return Math.trunc(this.diff / 60 / 60 / 24);
    },

    loaded() {
      return this.diff > 0;
    },
  },
  watch: {
    now(value) {
      this.diff = 1674925200 - this.now;
      if (this.diff <= 0 || this.stop) {
        this.diff = 0;
        // Remove interval
        clearInterval(interval);
      }
    },
  },
  filters: {
    twoDigits(value) {
      if (value.toString().length <= 1) {
        return "0" + value.toString();
      }
      return value.toString();
    },
  },
  destroyed() {
    clearInterval(interval);
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
