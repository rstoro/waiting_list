<template>
  <Modal id="delete-group-modal" v-if="showModal">

    <h1 slot="header" class="title is-4 delete-group-header">
      <span class="small-margin-right has-text-danger">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
      </span>
      <span>{{ confirmDeleteHeaderText }}</span>
    </h1>

    <div slot="body" class="delete-group-body">
      <p>{{ confirmDeleteBodyText }}</p>
      <p class="delete-group-name">
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span class="has-text-weight-medium"><b>{{ group.fullname }}</b></span>
      </p>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger small-margin-right" 
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
import Modal from '../../base/Modal.vue'

export default {
  name: 'DeleteGroupModal',
  components: {
    Modal
  },
  data() {
    return {
      confirmDeleteHeaderText: 'Delete Group',
      confirmDeleteBodyText: 'Would you like to delete the following group from the waiting list?',
      cancelDeleteGroupText: 'Cancel',
      confirmDeleteGroupText: 'Delete Group'
    }
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true,
      default: false
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    confirmDeleteGroup() {
      this.$emit('closeDeleteGroupModal');
      this.$emit('confirmDeleteGroup', this.index);
    },
    cancelDeleteGroup() {
      this.$emit('closeDeleteGroupModal');
    }
  }
}

</script>

<style scoped>
.delete-group-header {
  height: 40px;
  display: flex;
  align-items: center;
}
.delete-group-body {
  padding-top: 16px;
  padding-bottom: 16px;
}
.delete-group-name {
  padding-top: 16px;
}
</style>
