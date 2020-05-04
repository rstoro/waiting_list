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
      <p>
        Would you like to message <b>{{ group.fullname }}</b> at <b>{{ group.phonenumber }}</b>:
      </p>
      <p>
        'We have your lanes available etc. etc.'?
      </p>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger margin-right" 
          @click="cancelMessageGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'ban']"/>
        </span>
        <span>{{ cancelMessageGroupText }}</span>
      </button>
      <button class="button is-outlined is-normal is-success" 
          @click="confirmMessageGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </span>
        <span>{{ confirmMessageGroupText }}</span>
      </button>
    </div>

  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'MessageGroupModal',
  components: {
    Modal
  },
  data: () => {
    return {
      'cancelMessageGroupText': 'No',
      'confirmMessageGroupText': 'Yes'
    }
  },
  props: {
    'group': {},
    'showModal': false
  },
  methods: {
    confirmMessageGroup: function() { return confirmMessageGroup(this) },
    cancelMessageGroup: function() { return cancelMessageGroup(this) }
  }
}

function confirmMessageGroup(vm) {
  return;
}

function cancelMessageGroup(vm) {
  vm.$emit('closeMessageGroupModal');
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