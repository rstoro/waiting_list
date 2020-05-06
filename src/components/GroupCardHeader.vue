<template>
  <header class="card-header group-card-header">
    <p class="card-header-title group-card-title">
      <span class="large-margin-right">{{ index }}</span>
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'user']"/>
      </span>
      <span class="has-text-weight-medium">{{ group.fullname }}</span>
    </p>
    <div class="group-card-countdown">
      <GroupProgressBar v-if="group.messageSentEpoch !== null"
          v-bind:started-at="group.messageSentEpoch"
          v-bind:countdown-length="60 * 1000"/> 
    </div>
    <a href="#" class="card-header-icon group-card-icon" aria-label="more options" 
        @click="toggleSelected()">
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'clock']"/>
      </span>
      <span class="time">{{ formatTime(secondsSinceEpoch) }}</span>
      <span class="icon rotate-icon" v-bind:class="{'rotate': isSelected}">
        <font-awesome-icon :icon="['fas', 'angle-right']"/>
      </span>
    </a>
  </header>
</template>

<script>
import GroupProgressBar from './GroupProgressBar.vue';

export default {
  name: 'GroupCardHeader',
  components: {
    GroupProgressBar
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const vm = this;

    return {
      secondsSinceEpoch: (Date.now() / 1000 | 0) - (vm.group.epoch / 1000 | 0),
    }
  },
  methods: {
    formatTime(time) {
      //NOTE: this is pretty expensive...
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    },
    toggleSelected() {
      const vm = this;
      vm.$emit('setGroupSelected', !vm.isSelected);
    }
  },
  mounted() {
    const vm = this;

    vm.epoch_timer = vm.$watch('secondsSinceEpoch', function(newValue, oldValue) {
      setTimeout(() => {
        vm.secondsSinceEpoch += 1; 
      }, 1000);
    }, {
      immediate: true
    });
  }
}
</script>

<style scoped>
.group-card .group-card-countdown {
  display: flex;
  flex: 3;
  align-items: center;
}

.group-card .group-card-title {
  flex-grow: 0;
  flex: 1;
  justify-content: flex-start;
}

.group-card .group-card-icon {
  flex: 1;
  justify-content: flex-end;
}

.group-card .card-header-icon .rotate-icon {
  transform: rotate(0deg);
  transition-duration: 0.3s;
}
.group-card .card-header-icon .rotate-icon.rotate {
  transform: rotate(90deg);
  transition-duration: 0.3s;
}
</style>