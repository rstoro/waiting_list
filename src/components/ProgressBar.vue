<template>
<div class="progress-bar-wrapper">
  <div class="display" v-bind:style="{'color': displayColor}">{{displayText}}</div>
  <div class="progress-bar-container">
    <div class="progress-bar" v-bind:style="{'width': `${ barPercentageComplete }%`, 'background-color': barColor}"></div>
  </div>
</div>
</template>

<script>
export default {
  //TODO: add validator to colors
  name: 'ProgressBar',
  props: {
    displayText: {
      type: String,
      default: '00:00:00'
    },
    displayColor: {
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
  }
}
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
}
.progress-bar-wrapper > .display {
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