<template>
  <Modal v-if="showModal">
    <h1 slot="header" class="subtitle is-4">New Group</h1>
    <div slot="body">
      <div class="full-name">
        <div class="field">
          <p class="control has-icons-left">
            <input class="input" type="text" placeholder="Full Name" v-model="newFullname">
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'user']"/>
            </span>
          </p>
        </div>
      </div>
      <div class="phone-number">
        <div class="field">
          <p class="control has-icons-left">
            <input class="input" type="text" placeholder="Phone Number" v-model="newPhonenumber">
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'phone']"/>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="button is-danger button-margin-left" @click="cancelNewGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'ban']"/>
        </span>
        <span>Cancel</span>
      </button>
      <button class="button is-success button-margin-left" @click="addNewGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </span>
        <span>Add Group</span>
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'NewGroupModal',
  components: {
    Modal
  },
  props: [
    'showModal'
  ],
  data: () => {
    return {
      'newFullname': '',
      'newPhonenumber': ''
    }
  },
  methods: {
    cancelNewGroup: function() { cancelNewGroup(this) },
    addNewGroup: function() { addNewGroup(this) }
  }
}

function cancelNewGroup(vm) {
  resetModal(vm);
  vm.$emit('closeNewGroupModal');
}

function addNewGroup(vm) {
  //TODO: data check group attributes before this point 
  vm.$emit('newGroupCreated', {
    'fullname': vm.fullname, 
    'phonenumber': vm.phonenumber,
    'epochInSeconds': Date.now() / 1000 | 0, //NOTE: prevents new date object from being created
    'secondsSinceEpoch': () => { (Date.now() / 1000 | 0) - this.epochInSeconds }
  })
  
  //TODO: notify user of successful addition
  resetModal(vm);
  vm.$emit('closeNewGroupModal');
}

function resetModal(vm) {
  vm.newFullname = '';
  vm.newPhonenumber = '';
}
</script>

<style scoped>
.button-margin-left {
  margin-left: 8px;
}
.full-name {
  padding-bottom: 8px;
}
</style>