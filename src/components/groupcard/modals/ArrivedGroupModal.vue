<template>
  <Modal id="delete-group-modal" v-if="showModal">

    <h1 slot="header" class="title is-4 delete-group-header">
      <span class="small-margin-right has-text-warning">
        <font-awesome-icon :icon="['fas', 'taxi']"/>
      </span>
      <span>{{ confirmArrivedHeaderText }}</span>
    </h1>

    <div slot="body" class="delete-group-body">
      <p>{{ confirmArrivedBodyText }}</p>
      <p class="delete-group-name">
        <span class="small-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span class="has-text-weight-medium"><b>{{ group.fullname }}</b></span>
      </p>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger small-margin-right" 
          @click="cancelArrivedGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'ban']"/>
        </span>
        <span>{{ cancelArrivedGroupText }}</span>
      </button>
      <button class="button is-outlined is-normal is-warning" 
          @click="confirmArrivedGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </span>
        <span>{{ confirmArrivedGroupText }}</span>
      </button>
    </div>

  </Modal>
</template>

<script>
import Modal from '../../base/Modal.vue'

export default {
  name: 'ArrivedGroupModal',
  components: {
    Modal
  },
  data() {
    return {
      confirmArrivedHeaderText: 'Arrived Group',
      confirmArrivedBodyText: 'Would you like to mark the following group as \'arrived\' and remove them from the list?',
      cancelArrivedGroupText: 'No',
      confirmArrivedGroupText: 'Yes'
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
    confirmArrivedGroup() {
      this.$emit('closeArrivedGroupModal');
      this.$emit('confirmArrivedGroup', this.index);
    },
    cancelArrivedGroup() {
      this.$emit('closeArrivedGroupModal');
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
