<template>
<div class="progress-bar-wrapper">
  <div ref="timer" @click="started = true" class="timer">{{formatTime(secondsRemaining)}}</div>
  <div class="progress-bar-container">
    <div ref="progress-bar" class="progress-bar"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    countdownLength: {
      type: Number,
      required: true
    },
    countdownStartedAt: {
      type: Number,
      required: true
    }
  },
  data: function() {
    const vm = this;
    const secondsSinceCountdownStarted = (vm.countdownStartedAt / 1000 | 0) + (vm.countdownLength / 1000 | 0) - (Date.now() / 1000 | 0);

    return {
      secondsRemaining: secondsSinceCountdownStarted <= 0 ? 0 : secondsSinceCountdownStarted
    };
  },
  methods: {
    formatTime: function(time) {
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    }
  },
  mounted: function() {
    const vm = this;

    // animate timer
    // vm.$refs['timer'].animate([
    //   { color: '#48c774' },
    //   { color: '#ffdd57' },
    //   { color: '#f14668' }  
    // ],{
    //   easing: 'linear',
    //   fill: 'forwards',
    //   duration: vm.secondsRemainingInMilliseconds
    // });

    // // animate progress bar
    // vm.$refs['progress-bar'].animate([
    //   { backgroundColor: '#48c774', width: '100%' },
    //   { backgroundColor: '#ffdd57', width: '50%' },
    //   { backgroundColor: '#f14668', width: '0%' }
    // ],{
    //   easing: 'linear',
    //   fill: 'forwards',
    //   duration: vm.secondsRemainingInMilliseconds
    // })

    // create countdown watcher with unsub
    vm.unwatch_countdown = vm.$watch('secondsRemaining', function(newValue, oldValue) {
      if (newValue < oldValue && vm.secondsRemaining <= 0) {
        vm.unwatch_countdown();
        vm.secondsRemaining = 0;
        return;
      }

      setTimeout(() => {
        vm.secondsRemaining -= 1;
      }, 1000);
    }, {
      // start watching the value before the subtraction is applied
      immediate: true
    });
  }
}
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
}
.progress-bar-wrapper > .timer {
  color: #2793da;
  font-weight: 550;
}
.progress-bar-wrapper > .progress-bar-container {
  width: 100%;
  border: 1px solid #dbdbdb;
  background-color: transparent;
}
.progress-bar-wrapper > .progress-bar-container > .progress-bar {
  height: 8px;
  background-color: #2793da;
}
</style>