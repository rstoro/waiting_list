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
    this.start_color = { r: 72, g: 199, b: 116 };
    this.mid_color = { r: 255, g: 221, b: 87 };
    this.end_color = { r: 241, g: 70, b: 104 };

    const timeRemaining = (this.startedAt / 1000 | 0) + (this.countdownLength / 1000 | 0) - (Date.now() / 1000 | 0);
    const secondsRemaining = timeRemaining <= 0 ? 0 : timeRemaining; 
    
    return {
      secondsRemaining: secondsRemaining,
      barPercent: Math.floor(secondsRemaining / (this.countdownLength / 1000 | 0) * 100),
      barAndDisplayColor: secondsRemaining <= 0 ? { ...this.end_color } : { ...this.start_color }
    }
  },
  mounted() {
    const get_color_difference = (c_start, c_end, percent_transitioned) => Math.ceil(c_start + ((c_end - c_start) * (percent_transitioned / 100)));

    this.unwatch_countdown = this.$watch('secondsRemaining', function(newValue, oldValue) {
      if (this.secondsRemaining <= 0) {
        if (this.unwatch_countdown != null) {
          this.unwatch_countdown();
        }

        return;
      }

      setTimeout(() => {
        this.secondsRemaining -= 1;
        this.barPercent = Math.floor(this.secondsRemaining / (this.countdownLength / 1000 | 0) * 100);

        if (this.secondsRemaining > (this.countdownLength / 1000 | 0) * 0.5) {
          this.barAndDisplayColor['r'] = get_color_difference(this.start_color['r'], this.mid_color['r'], (100 - this.barPercent) * 2);
          this.barAndDisplayColor['g'] = get_color_difference(this.start_color['g'], this.mid_color['g'], (100 - this.barPercent) * 2);
          this.barAndDisplayColor['b'] = get_color_difference(this.start_color['b'], this.mid_color['b'], (100 - this.barPercent) * 2);  
        }
        else {
          this.barAndDisplayColor['r'] = get_color_difference(this.mid_color['r'], this.end_color['r'], (100 - this.barPercent - 50) * 2);
          this.barAndDisplayColor['g'] = get_color_difference(this.mid_color['g'], this.end_color['g'], (100 - this.barPercent - 50) * 2);
          this.barAndDisplayColor['b'] = get_color_difference(this.mid_color['b'], this.end_color['b'], (100 - this.barPercent - 50) * 2);
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