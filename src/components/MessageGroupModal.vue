<template>
  <Modal v-if="showModal">

    <h1 slot="header" class="title is-4 message-group-header">
      <span class="margin-right">
        <font-awesome-icon :icon="['fas', 'envelope']"/>
      </span>
      <span class="has-text-weight-medium margin-right">{{ messageGroupHeaderText }}</span>
    </h1>

    <div slot="body">
      <p class="has-text-left">{{ messageGroupBodyText }}</p>
      <div class="text-area">
        <div class="text-area-header">
          <p class="has-text-left">
            <span class="margin-right">
              <font-awesome-icon :icon="['fas', 'user']"/>
            </span>
            <span class="has-text-weight-medium"><b>{{ group.fullname }}</b></span>
          </p>
          <p class="has-text-right">
            <span class="margin-right">
              <font-awesome-icon :icon="['fas', 'phone']"/>
            </span>
            <span class="has-text-weight-medium"><b>{{ group.phonenumber }}</b></span>
          </p>
        </div>
        <textarea class="textarea">

        </textarea>
      </div>
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
      'messageGroupHeaderText': 'Message Group',
      'messageGroupBodyText': 'Would you like to send the following message?',
      'cancelMessageGroupText': 'Cancel',
      'confirmMessageGroupText': 'Message Group'
    }
  },
  props: {
    'group': {},
    'showModal': false,
    'uid': null
  },
  methods: {
    confirmMessageGroup: function() { return confirmMessageGroup(this) },
    cancelMessageGroup: function() { return cancelMessageGroup(this) }
  }
}

function confirmMessageGroup(vm) {
  vm.$emit('confirmMessageGroup', vm.uid)
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
.text-area {
  padding-top: 16px;
  display: flex;
  flex-flow: column;
}
.text-area-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
</style>