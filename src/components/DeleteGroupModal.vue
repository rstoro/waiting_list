<template>
  <Modal v-if="showModal">

    <h1 slot="header" class="title is-4 message-group-header">
      <span class="margin-right">
        <font-awesome-icon :icon="['fas', 'phone']"/>
      </span>
      <span class="has-text-weight-medium margin-right">{{ 'TO BE IMPLIMENTED' }}</span>
      <span class="margin-right">
        <font-awesome-icon :icon="['fas', 'envelope']"/>
      </span>
      <!-- <span class="has-text-weight-medium">{{ group.fullname }}</span> -->
    </h1>

    <div slot="body">
      <p>wow</p>
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
      'cancelDeleteGroupText': 'No',
      'confirmDeleteGroupText': 'Yes'
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