<template>
  <ProgressBar v-bind:display-text="formatTime(secondsRemaining)"
      v-bind:display-color="barAndDisplayColor"
      v-bind:bar-percentage-complete="barPercent"
      v-bind:bar-color="barAndDisplayColor" /> 
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
    const vm = this;

    vm.start_color = { r: 72, g: 199, b: 116 };
    vm.mid_color = { r: 255, g: 221, b: 87 };
    vm.end_color = { r: 241, g: 70, b: 104 };

    const timeRemaining = (vm.startedAt / 1000 | 0) + (vm.countdownLength / 1000 | 0) - (Date.now() / 1000 | 0);
    const secondsRemaining = timeRemaining <= 0 ? 0 : timeRemaining; 
    
    return {
      secondsRemaining: secondsRemaining,
      barPercent: Math.floor(secondsRemaining / (vm.countdownLength / 1000 | 0) * 100),
      barAndDisplayColor: secondsRemaining <= 0 ? vm.end_color : vm.start_color
    }
  },
  mounted() {
    const vm = this;
    const get_color_difference = (c_start, c_end, percent_transitioned) => Math.ceil(c_start + ((c_end - c_start) * (percent_transitioned / 100)));

    vm.unwatch_countdown = vm.$watch('secondsRemaining', function(newValue, oldValue) {
      if (vm.secondsRemaining <= 0) {
        if (vm.unwatch_countdown != null) {
          vm.unwatch_countdown();
        }

        return;
      }

      setTimeout(() => {
        vm.secondsRemaining -= 1;
        
        vm.barPercent = Math.floor(vm.secondsRemaining / (vm.countdownLength / 1000 | 0) * 100);

        if (vm.secondsRemaining > (vm.countdownLength / 1000 | 0) * 0.5) {
          vm.barAndDisplayColor['r'] = get_color_difference(vm.start_color['r'], vm.mid_color['r'], (100 - vm.barPercent) * 2);
          vm.barAndDisplayColor['g'] = get_color_difference(vm.start_color['g'], vm.mid_color['g'], (100 - vm.barPercent) * 2);
          vm.barAndDisplayColor['b'] = get_color_difference(vm.start_color['b'], vm.mid_color['b'], (100 - vm.barPercent) * 2);  
        }
        else {
          vm.barAndDisplayColor['r'] = get_color_difference(vm.mid_color['r'], vm.end_color['r'], (100 - vm.barPercent - 50) * 2);
          vm.barAndDisplayColor['g'] = get_color_difference(vm.mid_color['g'], vm.end_color['g'], (100 - vm.barPercent - 50) * 2);
          vm.barAndDisplayColor['b'] = get_color_difference(vm.mid_color['b'], vm.end_color['b'], (100 - vm.barPercent - 50) * 2);
        }
      }, 1000)
    }, {
      immediate: true
    });
  },
  methods: {
    formatTime(time) {
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    }
  }
}
</script>

<style scoped>

</style>