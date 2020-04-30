<template>
  <div class="card group-card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span>{{ group.fullname }}</span>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options" 
          @click="isSelected = !isSelected">
        <span class="icon-margin-right">
          <font-awesome-icon :icon="['fas', 'clock']"/>
        </span>
        <span class="time">{{ formatTime(group.secondsSinceEpoch) }}</span>
        <span class="icon rotate-icon" v-bind:class="{'rotate': isSelected}">
          <font-awesome-icon :icon="['fas', 'angle-right']"/>
        </span>
      </a>
    </header>

    <transition name="accordion"
        v-on:before-enter="beforeEnter" 
        v-on:enter="enter"
        v-on:before-leave="beforeLeave" 
        v-on:leave="leave">
      <div v-if="isSelected" class="group-card-body">
        <div class="group-card-content">
          <textarea class="textarea" type="text" placeholder="Notes" 
              v-model="group.notes"></textarea>
        </div>

        <div class="group-card-footer">
          <p class="is-size-7 has-text-weight-light">
            {{ formatAddedOn(group.epochInSeconds) }}
          </p>
          <div class="group-card-buttons">
            <button class="button group-card-button is-outlined is-normal is-danger button-margin-left" 
                @click="deleteGroup(uid)">
              <span class="icon is-small">
                <font-awesome-icon :icon="['fas', 'trash-alt']"/>
              </span>
              <span>{{ deleteText }}</span>
            </button>
            <button class="button group-card-button is-outlined is-normal is-success button-margin-left" 
                @click="messageGroup()">
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
        vm.counter = setTimeout(() => {
          vm.group.secondsSinceEpoch = (Date.now() / 1000 | 0) - vm.group.epochInSeconds
        }, 1000);
      }, 
      immediate: true
    }
  },
  methods: {
    formatTime: function(secondsSinceEpoch) { return formatTime(secondsSinceEpoch) },
    formatAddedOn: function(epochInSeconds) { return formatAddedOn(epochInSeconds) },
    deleteGroup: function(uid) { return deleteGroup(this, uid) },
    messageGroup: function() { return messageGroup(this) },
    beforeEnter: function(el) { return removeHeight(el) },
    enter: function(el) { return addScrollHeight(el) },
    beforeLeave: function(el) { addScrollHeight(el) },
    leave: function(el) { removeHeight(el) }
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
  console.log(`Mock SMS: Phone Number ${vm.group.phonenumber} messaged!`);
  console.error('SMS Service Integration Required.');
}

function removeHeight(el) {
  el.style.height = '0';
}

function addScrollHeight(el) {
  el.style.height = el.scrollHeight + 'px';
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
.group-card .card-header-icon .rotate-icon {
  transform: rotate(0deg);
  transition-duration: 0.3s;
}
.group-card .card-header-icon .rotate-icon.rotate {
  transform: rotate(90deg);
  transition-duration: 0.3s;
}
.group-card .group-card-body {
  transition: all 0.3s ease-out;
  overflow: hidden;
}
.group-card .group-card-body .group-card-content {
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
</style>