<template>
  <div class="card group-card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span>{{ group.fullname }}</span>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options" @click="isSelected = !isSelected">
        <span class="icon-margin-right">
          <font-awesome-icon :icon="['fas', 'clock']"/>
        </span>
        <span class="time">{{ formatTime(group.secondsSinceEpoch) }}</span>
        <span class="icon">
          <!-- NOTE: this is crap, I wish there was a conditional to prevent this garbage. -->
          <font-awesome-icon v-if="isSelected" :icon="['fas', 'angle-right']"/>
          <font-awesome-icon v-if="!isSelected" :icon="['fas', 'angle-down']"/>
        </span>
      </a>
    </header>

    <div v-if="isSelected">
      <transition name="selected">
        <div>
          
          <div class="group-card-content">
            <textarea class="textarea" type="text" placeholder="Notes" v-model="group.notes"></textarea>
          </div>

          <div class="group-card-footer">
            <p class="is-size-7 has-text-weight-light">{{ formatAddedOn(group.epochInSeconds) }}</p>
            <div class="group-card-buttons">
              <button class="button group-card-button is-outlined is-normal is-danger button-margin-left" @click="deleteGroup(uid)">
                <span class="icon is-small">
                  <font-awesome-icon :icon="['fas', 'trash-alt']"/>
                </span>
                <span>{{ deleteText }}</span>
              </button>
              <button class="button group-card-button is-outlined is-normal is-success button-margin-left" @click="messageGroup()">
                <span class="icon is-small">
                  <font-awesome-icon :icon="['fas', 'envelope']"/>
                </span>
                <span>{{ textText }}</span>
              </button>
            </div>
          </div>

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
      'displayTime': 0,
      'counter': {},
      'textText': 'Text',
      'editText': 'Edit',
      'deleteText': 'Delete'
    }
  },
  props: {
    'group': {},
    'uid': 0
  },
  watch: {
    'group.secondsSinceEpoch': {
      handler(value) {
        const vm = this;
        if (vm.group.secondsSinceEpoch === 0) {
          vm.group.secondsSinceEpoch = (Date.now() / 1000 | 0) - vm.group.epochInSeconds
        }

        vm.counter = setTimeout(() => {
          vm.group.secondsSinceEpoch++;
        }, 1000);
      }, 
      immediate: true
    }
  },
  methods: {
    formatTime: function(secondsSinceEpoch) { return formatTime(secondsSinceEpoch) },
    formatAddedOn: function(epochInSeconds) { return formatAddedOn(epochInSeconds) },
    deleteGroup: function(uid) { return deleteGroup(this, uid)},
    messageGroup: function() { return messageGroup(this)}
  }
}

function formatAddedOn(epochInSeconds) {
  return `Added ${new Date(epochInSeconds * 1000)}`;
}

function formatTime(secondsSinceEpoch) {
  //NOTE: this is pretty expensive...
  return new Date(secondsSinceEpoch * 1000).toISOString().substr(11, 8); //hh:MM:ss
}

function deleteGroup(vm, uid) {
  vm.$emit('deleteGroup', uid);
}

function messageGroup(vm) {
  console.error('SMS Service Integration Required.')
}

</script>

<style scoped>
.group-card {
  margin-bottom: 8px;
}
.group-card .time {
  padding-right: 16px;
}
.group-card .icon-margin-right {
  margin-right: 8px;
}
.group-card .group-card-content {
  padding: 16px;
  display: flex;
}
.group-card .group-card-footer {
  padding: 16px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border-top: 1px solid #ededed;
}
.group-card .group-card-footer > .group-card-buttons {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.group-card .group-card-footer > .group-card-buttons > .group-card-button {
  margin-left: 8px;
}
/* TODO: group-selected animations */
</style>