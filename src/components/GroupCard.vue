<template>
  <div class="card group-card">
    <GroupCardHeader v-bind:group="group" 
        v-bind:index="index" 
        v-bind:is-selected="isSelected"
        v-on:setGroupSelected="setGroupSelected"/>

    <transition name="accordion"
        v-on:before-enter="removeHeight" 
        v-on:enter="addScrollHeight"
        v-on:before-leave="addScrollHeight" 
        v-on:leave="removeHeight">
      <div v-if="isSelected" class="group-card-content">
        <GroupCardContent v-bind:group="group"
          v-on:setDisplayMessageGroupModal="setDisplayMessageGroupModal"
          v-on:setDisplayDeleteGroupModal="setDisplayDeleteGroupModal"/>
      </div>
    </transition>

    <MessageGroupModal v-bind:showModal="displayMessageGroupModal"
        v-bind:index="index"
        v-on:closeMessageGroupModal="displayMessageGroupModal = false"
        v-on:confirmMessageGroup="messageGroup"
        v-bind:group="group"/>
    
    <DeleteGroupModal v-bind:showModal="displayDeleteGroupModal"
        v-bind:index="index"
        v-on:closeDeleteGroupModal="displayDeleteGroupModal = false"
        v-on:confirmDeleteGroup="deleteGroup"
        v-bind:group="group"/>
      
  </div>
</template>

<script>
import MessageGroupModal from './MessageGroupModal.vue';
import DeleteGroupModal from './DeleteGroupModal.vue';
import GroupCardHeader from './GroupCardHeader.vue';
import GroupCardContent from './GroupCardContent.vue';

import twilio_api from '../twilio_api';
const twilio = require( 'twilio' );
const client = new twilio( twilio_api.account_sid, twilio_api.auth_token );

export default {
  name: 'GroupCard',
  components: {
    MessageGroupModal,
    DeleteGroupModal,
    GroupCardHeader,
    GroupCardContent
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    const vm = this;

    return {
      isSelected: false,
      displayMessageGroupModal: false,
      displayDeleteGroupModal: false,
    }
  },
  methods: {
    setGroupSelected(value) {
      const vm = this;
      vm.isSelected = value;
    },
    setDisplayMessageGroupModal(value) {
      const vm = this;
      vm.displayMessageGroupModal = value;
    },
    setDisplayDeleteGroupModal(value) {
      const vm = this;
      vm.displayDeleteGroupModal = value;
    },
    deleteGroup(index) {
      const vm = this;
      vm.displayDeleteGroupModal = false;
      vm.$emit('deleteGroup', index);
    },
    messageGroup(data) {
      const vm = this;
      vm.displayMessageGroupModal = false;
      vm.group.messageSentEpoch = Date.now();
      vm.$emit('sendTextMessage', data);
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
.group-card-content {
  transition: all 0.3s ease-out;
  overflow: hidden;
}
</style>