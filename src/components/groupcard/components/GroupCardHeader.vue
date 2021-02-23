<template>
  <header class="card-header group-card-header">
    <p class="card-header-title group-card-title">
      <span class="large-margin-right">{{ index + 1 }}</span>
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'user']"/>
      </span>
      <span class="has-text-weight-medium group-card-name">{{ group.fullname }}</span>
    </p>
    <div class="group-card-countdown">
      <GroupProgressBar v-if="group.messageSentEpoch !== null"
          v-bind:started-at="group.messageSentEpoch"
          v-bind:countdown-length="(group.waitTime) * 60 * 1000"/> 
    </div>
    <a href="#" class="card-header-icon group-card-icon" @click="toggleSelected()">
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
    return {
      secondsSinceEpoch: (Date.now() / 1000 | 0) - (this.group.epoch / 1000 | 0),
    }
  },
  methods: {
    formatTime(time) {
      //NOTE: this is pretty expensive...
      return new Date(time * 1000).toISOString().substr(11, 8); //hh:MM:ss
    },
    toggleSelected() {
      this.$emit('setGroupSelected', !this.isSelected);
    }
  },
  mounted() {
    this.epoch_timer = this.$watch('secondsSinceEpoch', function(newValue, oldValue) {
      setTimeout(() => {
        this.secondsSinceEpoch += 1; 
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
  max-width: 25%;
  justify-content: flex-start;
}

.group-card .group-card-title .group-card-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
