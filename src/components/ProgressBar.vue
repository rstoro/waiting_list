<template>
<div class="progress-bar-wrapper">
  <div class="timer" v-bind:style="{'color': timerNumberColor}">{{formatTime(timerNumberInMs)}}</div>
  <div class="progress-bar-container">
    <div class="progress-bar" v-bind:style="{'width': `${ barPercentageComplete }%`, 'background-color': barColor}"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    timerNumberInMs: {
      type: Number,
      default: 0
    },
    timerNumberColor: {
      type: String,
      default: '#2793da'
    },
    barPercentageComplete: {
      type: Number,
      default: 100
    },
    barColor: {
      type: String,
      default: '#2793da'
    }
  },
  methods: {
    formatTime: function(time) {
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    }
  }
}
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
}
.progress-bar-wrapper > .timer {
  font-weight: 550;
}
.progress-bar-wrapper > .progress-bar-container {
  width: 100%;
  border: 1px solid #dbdbdb;
  background-color: transparent;
}
.progress-bar-wrapper > .progress-bar-container > .progress-bar {
  height: 8px;
}
</style>