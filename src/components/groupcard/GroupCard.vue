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
      <div class="group-card-content" 
          v-if="isSelected">
        <GroupCardContent v-bind:group="group"
          v-on:setDisplayMessageGroupModal="setDisplayMessageGroupModal"
          v-on:setDisplayArrivedGroupModal="setDisplayArrivedGroupModal"
          v-on:setDisplayDeleteGroupModal="setDisplayDeleteGroupModal"/>
      </div>
    </transition>

    <MessageGroupModal v-bind:showModal="displayMessageGroupModal"
        v-bind:index="index"
        v-on:closeMessageGroupModal="displayMessageGroupModal = false"
        v-on:confirmMessageGroup="messageGroup"
        v-bind:group="group"/>

    <ArrivedGroupModal v-bind:showModal="displayArrivedGroupModal"
        v-bind:index="index"
        v-on:closeArrivedGroupModal="displayArrivedGroupModal = false"
        v-on:confirmArrivedGroup="logArrival"
        v-bind:group="group"/>
    
    <DeleteGroupModal v-bind:showModal="displayDeleteGroupModal"
        v-bind:index="index"
        v-on:closeDeleteGroupModal="displayDeleteGroupModal = false"
        v-on:confirmDeleteGroup="deleteGroup"
        v-bind:group="group"/>
      
  </div>
</template>

<script>
import MessageGroupModal from './modals/MessageGroupModal.vue';
import ArrivedGroupModal from './modals/ArrivedGroupModal.vue';
import DeleteGroupModal from './modals/DeleteGroupModal.vue';
import GroupCardHeader from './components/GroupCardHeader.vue';
import GroupCardContent from './components/GroupCardContent.vue';

export default {
  name: 'GroupCard',
  components: {
    MessageGroupModal,
    ArrivedGroupModal,
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
    return {
      isSelected: false,
      displayMessageGroupModal: false,
      displayArrivedGroupModal: false,
      displayDeleteGroupModal: false
    }
  },
  methods: {
    setGroupSelected(value) {
      this.isSelected = value;
    },
    setDisplayMessageGroupModal(value) {
      this.displayMessageGroupModal = value;
    },
    setDisplayArrivedGroupModal(value) {
      this.displayArrivedGroupModal = value;
    },
    setDisplayDeleteGroupModal(value) {
      this.displayDeleteGroupModal = value;
    },
    logArrival(index) {
      this.displayArrivedGroupModal = false;
      this.$emit('groupArrived', index);
    },
    deleteGroup(index) {
      this.displayDeleteGroupModal = false;
      this.$emit('deleteGroup', index);
    },
    messageGroup(data) {
      this.displayMessageGroupModal = false;
      this.$emit('sendTextMessage', data, this.index);
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
