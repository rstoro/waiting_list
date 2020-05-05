<template>
  <div class="card group-card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="large-margin-right">{{ uid+1 }}</span>
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span class="has-text-weight-medium">{{ group.fullname }}</span>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options" 
          @click="isSelected = !isSelected">
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'clock']"/>
        </span>
        <span class="time">{{ formatTime() }}</span>
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
          <div class="group-card-info">
            <p class="is-size-7 has-text-weight-light has-text-left">
              {{ formatMessagedOn() }}
            </p>
            <p class="is-size-7 has-text-weight-light has-text-left">
              {{ formatAddedOn() }}
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

import twilio_api from '../twilio_api';
const twilio = require( 'twilio' );
const client = new twilio( twilio_api.account_sid, twilio_api.auth_token );

export default {
  name: 'GroupCard',
  components: {
    MessageGroupModal,
    DeleteGroupModal
  },
  data: () => {
    return {
      'isSelected': false,
      'displayMessageGroupModal': false,
      'displayDeleteGroupModal': false,
      'displayTime': 0,
      'counter': {},
      'textText': 'Text',
      'editText': 'Edit',
      'deleteText': 'Delete',
    }
  },
  props: {
    'group': {},
    'uid': 0
  },
  watch: {
    //TODO: maybe unsubcribe this at some point?
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
    formatTime: function() { return formatTime(this) },
    formatAddedOn: function() { return formatAddedOn(this) },
    formatMessagedOn: function() { return formatMessagedOn(this) },
    deleteGroup: function(uid) { return deleteGroup(this, uid) },
    messageGroup: function(data) { return messageGroup(this, data) },
    beforeEnter: function(el) { return removeHeight(el) },
    enter: function(el) { return addScrollHeight(el) },
    beforeLeave: function(el) { addScrollHeight(el) },
    leave: function(el) { removeHeight(el) }
  }
}

function formatTime(vm) {
  //NOTE: this is pretty expensive...
  return new Date(vm.group.secondsSinceEpoch * 1000).toISOString().substr(11, 8); //hh:MM:ss
}

function formatAddedOn(vm) {
  return `Added ${new Date(vm.group.epochInSeconds * 1000)}`;
}

function formatMessagedOn(vm) {
  return vm.group.messageSentAt === null 
    ? 'Has not been messaged.' 
    : `Messaged ${new Date(vm.group.messageSentAt * 1000)}`;
}

function deleteGroup(vm) {
  vm.displayDeleteGroupModal = false;
  vm.$emit('deleteGroup', vm.uid);
}

function messageGroup(vm, data) {
  vm.displayMessageGroupModal = false;
  vm.group.messageSentAt = Date.now() / 1000 | 0;

<<<<<<< HEAD
  vm.$emit('sendTextMessage', data);
=======
  //NOTE: chromium throws some header errors when sending this request.
  //      just pretend like they are not there.
  client.messages.create({
    body: data.message,
    from: twilio_api.from_number,
    to: data.phonenumber
  }).then(message => {
    //TODO: log this message
  });
>>>>>>> 3740a8f2ea58b3856c1cdd0b379c5196c0ac881a

  // vm.counter = setTimeout(() => {
  //         vm.group.secondsSinceEpoch = (Date.now() / 1000 | 0) - vm.group.epochInSeconds
  //       }, 1000);
  //TODO: countdown, 30 minutes until void
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