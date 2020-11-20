<template>
  <div class="progress-bar-wrapper">
    <div class="display" v-bind:style="{'color': `rgb(${displayColor['r']},${displayColor['g']},${displayColor['b']})`}">{{ displayText }}</div>
    <div class="progress-bar-container">
      <div class="progress-bar" v-bind:style="{'width': `${ barPercentageComplete }%`, 'background-color': `rgb(${barColor['r']},${barColor['g']},${barColor['b']})`}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    displayText: {
      type: String,
      default: '00:00:00'
    },
    displayColor: {
      type: Object,
      default: function() {
        return {r: 39, g: 147, b: 218}
      },
      validator: function(value) {
        return value['r'] != null && value['g'] != null && value['b'] != null
      }
    },
    barPercentageComplete: {
      type: Number,
      default: 100
    },
    barColor: {
      type: Object,
      default: function() {
        return {r: 39, g: 147, b: 218}
      },
      validator: function(value) {
        return value['r'] != null && value['g'] != null && value['b'] != null
      }
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
  display: flex;
  justify-content: center;
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