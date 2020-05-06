<template>
  <ProgressBar v-bind:display-text="formatTime(secondsRemaining)"
      v-bind:display-color="'orange'"
      v-bind:bar-percentage-complete="100"
      v-bind:bar-color="'red'"/> 
</template>

<script>
import ProgressBar from './ProgressBar.vue';

export default {
  name: 'GroupProgressBar',
  components: {
    ProgressBar
  },
  props: {
    startedAt: {
      type: Number,
      required: true
    },
    countdownLength: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      secondsRemaining: 0
    }
  },
  mounted() {
    const vm = this;
    
    const secondsSinceCountdownStarted = (vm.startedAt / 1000 | 0) + (vm.countdownLength / 1000 | 0) - (Date.now() / 1000 | 0);
    vm.secondsRemaining = secondsSinceCountdownStarted <= 0 ? 0 : secondsSinceCountdownStarted
  
    vm.unwatch_countdown = vm.$watch('secondsRemaining', function(newValue, oldValue) {
    // early out unsub
    if (newValue < oldValue && vm.secondsRemaining <= 0) {
      vm.unwatch_countdown();
      vm.secondsRemaining = 0;
      return;
    }

    //subtract from time
    setTimeout(() => {
      vm.secondsRemaining -= 1;
    }, 1000)

    // determine bar width

    // determine bar color
    // 72 199 116
    // 255 221 87
    // 241 70 104
    }, {
      immediate: true
    });
  },
  methods: {
    formatTime: function(time) {
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    }
  }
}
</script>

<style scoped>

</style>