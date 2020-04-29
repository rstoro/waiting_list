<template>
  <div class="card group-card">
    <header class="card-header">
      <p class="card-header-title group-card-header">
        <span class="icon icon-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span>{{ group.fullname }}</span>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options" @click="isSelected = !isSelected">
        <span class="time">
          <font-awesome-icon :icon="['fas', 'clock']"/>
          {{ formatTime(group.secondsSinceEpoch) }}
        </span>
        <span class="icon">
          <!-- NOTE: this is crap, I wish there was a conditional to prevent this garbage. -->
          <font-awesome-icon v-if="isSelected" :icon="['fas', 'angle-right']"/>
          <font-awesome-icon v-if="!isSelected" :icon="['fas', 'angle-down']"/>
        </span>
      </a>
    </header>

    <div v-if="isSelected" class="card-content">
      <transition name="selected">
        <div class="content">
          <p>{{ formatAddedOn(group.epochInSeconds) }}</p>
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
export default {
  name: 'GroupCard',
  data: () => {
    return {
      'isSelected': false,
      'displayTime': 0
    }
  },
  props: {
    'group': {}
  },
  watch: {
    'group.secondsSinceEpoch': {
      handler(value) {
        const vm = this;
        if (vm.group.secondsSinceEpoch === 0) {
          vm.group.secondsSinceEpoch = (Date.now() / 1000 | 0) - vm.group.epochInSeconds
        }

        setTimeout(() => {
          vm.group.secondsSinceEpoch++;
        }, 1000);
      }, 
      immediate: true
    }
  },
  methods: {
    formatTime: function(secondsSinceEpoch) { return formatTime(secondsSinceEpoch) },
    formatAddedOn: function(epochInSeconds) { return formatAddedOn(epochInSeconds) }
  }
}

function formatAddedOn(epochInSeconds) {
  return `Added to list ${new Date(epochInSeconds * 1000)}`
}

function formatTime(secondsSinceEpoch) {
  //NOTE: this is pretty expensive...
  return new Date(secondsSinceEpoch * 1000).toISOString().substr(11, 8); //hh:MM:ss
}
</script>

<style scoped>
.icon-margin-right {
  margin-right: 8px;
}
.group-card-header {
  font-weight: 100;
}
.group-card {
  margin-bottom: 8px;
}
.time {
  padding-right: 16px;
}
/* TODO: group-selected animations */
</style>