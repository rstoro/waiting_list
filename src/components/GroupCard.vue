<template>
  <div class="card group-card">
    <header class="card-header">
      <p class="card-header-title group-card-title">
        <span class="large-margin-right">{{ uid+1 }}</span>
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span class="has-text-weight-medium">{{ group.fullname }}</span>
      </p>
      <div class="group-card-countdown">
        <ProgressBar v-if="group.messageSentEpoch !== null" 
            v-bind:timer-number-in-ms="60 * 1000"
            v-bind:timer-number-color="'orange'"
            v-bind:bar-percentage-complete="75"
            v-bind:bar-color="'red'"/> 
      </div>
      <a href="#" class="card-header-icon group-card-icon" aria-label="more options" 
          @click="isSelected = !isSelected">
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'clock']"/>
        </span>
        <span class="time">{{ formatTime(secondsSinceEpoch) }}</span>
        <span class="icon rotate-icon" v-bind:class="{'rotate': isSelected}">
          <font-awesome-icon :icon="['fas', 'angle-right']"/>
        </span>
      </a>
    </header>

    <transition name="accordion"
        v-on:before-enter="removeHeight" 
        v-on:enter="addScrollHeight"
        v-on:before-leave="addScrollHeight" 
        v-on:leave="removeHeight">
      <div v-if="isSelected" class="group-card-body">
        <div class="group-card-content">
          <textarea class="textarea" type="text" placeholder="Notes" 
              v-model="group.notes"></textarea>
        </div>

        <div class="group-card-footer">
          <div class="group-card-info">
            <p class="is-size-7 has-text-weight-light has-text-left">
              {{ formatMessagedOn(group.messageSentEpoch) }}
            </p>
            <p class="is-size-7 has-text-weight-light has-text-left">
              {{ formatAddedOn(group.epoch) }}
            </p>
          </div>
          <div class="group-card-buttons">
            <button class="button group-card-button is-outlined is-normal is-danger button-margin-left" 
                @click="displayDeleteGroupModal = true">
              <span class="icon is-small">
                <font-awesome-icon :icon="['fas', 'trash-alt']"/>
              </span>
              <span>{{ deleteText }}</span>
            </button>
            <button class="button group-card-button is-outlined is-normal is-success button-margin-left" 
                @click="displayMessageGroupModal = true">
              <span class="icon is-small">
                <font-awesome-icon :icon="['fas', 'envelope']"/>
              </span>
              <span>{{ textText }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <MessageGroupModal v-bind:showModal="displayMessageGroupModal"
        v-bind:uid="uid"
        v-on:closeMessageGroupModal="displayMessageGroupModal = false"
        v-on:confirmMessageGroup="messageGroup"
        v-bind:group="group"/>
    
    <DeleteGroupModal v-bind:showModal="displayDeleteGroupModal"
        v-bind:uid="uid"
        v-on:closeDeleteGroupModal="displayDeleteGroupModal = false"
        v-on:confirmDeleteGroup="deleteGroup"
        v-bind:group="group"/>
      
  </div>
</template>

<script>
import MessageGroupModal from './MessageGroupModal.vue';
import DeleteGroupModal from './DeleteGroupModal.vue';
import ProgressBar from './ProgressBar.vue';

import twilio_api from '../twilio_api';
const twilio = require( 'twilio' );
const client = new twilio( twilio_api.account_sid, twilio_api.auth_token );

export default {
  name: 'GroupCard',
  components: {
    MessageGroupModal,
    DeleteGroupModal,
    ProgressBar
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    uid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    const vm = this;
    const countdownLength = 60; //seconds
    const secondsSinceCountdownStarted = vm.group.messageSentEpoch === null
      ? countdownLength
      : (vm.group.messageSentEpoch / 1000 | 0) + (countdownLength / 1000 | 0) - (Date.now() / 1000 | 0);

    return {
      isSelected: false,
      displayMessageGroupModal: false,
      displayDeleteGroupModal: false,
      secondsSinceEpoch: (Date.now() / 1000 | 0) - (vm.group.epoch / 1000 | 0),
      textText: 'Text',
      editText: 'Edit',
      deleteText: 'Delete',
      secondsRemaining: secondsSinceCountdownStarted <= 0 ? 0 : secondsSinceCountdownStarted
    }
  },
  mounted: function() {
    const vm = this;

    vm.epoch_timer = vm.$watch('secondsSinceEpoch', function(newValue, oldValue) {
      setTimeout(() => {
        vm.secondsSinceEpoch += 1; 
      }, 1000);
    }, {
      immediate: true
    });
  },
  methods: {
    formatTime(secondsSinceEpoch) {
      //NOTE: this is pretty expensive...
      return new Date(secondsSinceEpoch * 1000).toISOString().substr(11, 8); //hh:MM:ss
    },
    formatAddedOn: function(epoch) {
      return `Added ${new Date(epoch)}`;
     },
    formatMessagedOn: function(messageSentEpoch) {
      return messageSentEpoch === null 
        ? 'Has not been messaged.' 
        : `Messaged ${new Date(messageSentEpoch)}`;
    },
    deleteGroup: function(uid) {
      const vm = this;
      vm.displayDeleteGroupModal = false;
      vm.$emit('deleteGroup', uid);
    },
    messageGroup: function(data) {
      const vm = this;
      vm.displayMessageGroupModal = false;
      vm.group.messageSentEpoch = Date.now();
      vm.$emit('sendTextMessage', data);
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
        console.log(vm.$refs['progress-bar'].stlyes);

        // determine bar color
        // 72 199 116
        // 255 221 87
        // 241 70 104
      }, {
        immediate: true
      });
    },
    removeHeight(el) {
      el.style.height = '0';
    },
    addScrollHeight(el) {
      el.style.height = el.scrollHeight + 'px';
    }
  }
}
</script>

<style scoped>
.group-card {
  margin-bottom: 8px;
}
.group-card .time {
  padding-right: 16px;
}
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
.group-card .group-card-body {
  transition: all 0.3s ease-out;
  overflow: hidden;
}
.group-card .group-card-body .group-card-content {
  padding: 16px;
  display: flex;
}
.group-card .group-card-body .group-card-info {
  display: flex;
  flex-flow: column;
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