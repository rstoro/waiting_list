<template>
  <Modal v-if="showModal">

    <h1 slot="header" class="title is-4 message-group-header">
      <span class="margin-right has-text-danger">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
      </span>
      <span>{{ confirmDeleteHeaderText }}</span>
    </h1>

    <div slot="body">
      <p>{{ confirmDeleteBodyText }}</p>
      <p>
        <span class="margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span class="has-text-weight-medium"><b>{{ group.fullname }}</b></span>
      </p>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger margin-right" 
          @click="cancelDeleteGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'ban']"/>
        </span>
        <span>{{ cancelDeleteGroupText }}</span>
      </button>
      <button class="button is-outlined is-normal is-success" 
          @click="confirmDeleteGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </span>
        <span>{{ confirmDeleteGroupText }}</span>
      </button>
    </div>

  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'DeleteGroupModal',
  components: {
    Modal
  },
  data: () => {
    return {
      'confirmDeleteHeaderText': 'Delete Group',
      'confirmDeleteBodyText': 'Are you sure you want to delete the following group from the waiting list?',
      'cancelDeleteGroupText': 'Cancel',
      'confirmDeleteGroupText': 'Delete Group'
    }
  },
  props: {
    'group': {},
    'showModal': false,
    'uid': null
  },
  methods: {
    confirmDeleteGroup: function() { return confirmDeleteGroup(this) },
    cancelDeleteGroup: function() { return cancelDeleteGroup(this) }
  }
}

function confirmDeleteGroup(vm) {
  vm.$emit('confirmDeleteGroup', vm.uid)
}

function cancelDeleteGroup(vm) {
  vm.$emit('closeDeleteGroupModal');
}

</script>

<style scoped>
.margin-right{
  margin-right: 8px;
}
.message-group-header {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>