<template>
  <Modal v-if="showModal">

    <h1 slot="header" class="title is-4 new-group-header">{{ newGroupText }}</h1>

    <div class="modal-body" slot="body">
      <div class="full-name">
        <div class="field">
          <p class="has-icons-left is-size-7 has-text-danger danger-message"
              v-bind:class="[errors.fullname && newFullname !== null ? '' : 'hidden']">
            <span class="icon is-small is-left has-text-danger">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
            {{fullnameRequiredText}}
          </p>
          <p class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="Full Name" 
                v-bind:class="[errors.fullname && newFullname !== null ? 'is-danger' : '']" 
                v-model="newFullname" required>
            <span class="icon is-small is-left"
                v-bind:class="[errors.fullname && newFullname !== null ? 'has-text-danger' : '']">
              <font-awesome-icon :icon="['fas', 'user']"/>
            </span>
            <span v-if="errors.fullname && newFullname !== null" class="icon is-small is-right has-text-danger">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
          </p>
        </div>
      </div>

      <div class="phone-number">
        <div class="field">
          <p class="has-icons-left is-size-7 has-text-danger danger-message"
              v-bind:class="[errors.phonenumber && newPhonenumber !== null ? '' : 'hidden']">
            <span class="icon is-small is-left has-text-danger">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
            {{phonenumberRequiredText}}
          </p>
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="tel" placeholder="Phone Number" 
                v-bind:class="[errors.phonenumber && newPhonenumber !== null ? 'is-danger' : '']"
                v-model="newPhonenumber" required>
            <span class="icon is-small is-left"
                v-bind:class="[errors.phonenumber && newPhonenumber !== null ? 'has-text-danger' : '']">
              <font-awesome-icon :icon="['fas', 'phone']"/>
            </span>
            <span class="icon is-small is-right has-text-danger"
                v-if="errors.phonenumber && newPhonenumber !== null">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
          </div>
        </div>
      </div>

      <div class="notes">
        <div class="field">
          <p class="control has-icons-left">
            <textarea class="textarea" type="text" placeholder="Notes" v-model="newNotes"></textarea>
          </p>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger button-margin-left" @click="cancelNewGroup()">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'ban']"/>
        </span>
        <span>{{ cancelGroupText }}</span>
      </button>
      <button class="button is-outlined is-normal is-success button-margin-left" @click="addNewGroup()" 
          v-bind:disabled="errors.phonenumber || errors.fullname">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fas', 'check']"/>
        </span>
        <span>{{ addGroupText }}</span>
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
      'newFullname': null,  //NOTE: null is being treated as untouched...
      'newPhonenumber': null,
      'newNotes': '',
      'errors': {
        'fullname': true,
        'phonenumber': true
      },
      'fullnameRequiredText': 'Name is required.',
      'phonenumberRequiredText': 'Valid Phone Number is required.',
      'newGroupText': 'New Group',
      'addGroupText': 'Add Group',
      'cancelGroupText': 'Cancel'
    }
  },
  methods: {
    cancelNewGroup: function() { return cancelNewGroup(this) },
    addNewGroup: function() { return addNewGroup(this) }
  },
  watch: {
    'newFullname': {
      handler(value) {
        const vm = this;
        vm.newFullname = value;
        vm.errors.fullname = (vm.newFullname === '' || vm.newFullname === null);
      }
    },
    'newPhonenumber': {
      handler(value) {
        const vm = this;
        vm.newPhonenumber = value;
        vm.errors.phonenumber = (vm.newPhonenumber === '' || vm.newPhonenumber === null || !vm.newPhonenumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/));
      }
    }
  }
}

function cancelNewGroup(vm) {
  resetModal(vm);
  vm.$emit('closeNewGroupModal');
}

function addNewGroup(vm) {
  vm.$emit('newGroupCreated', {
    'fullname': vm.newFullname, 
    'phonenumber': vm.newPhonenumber,
    'notes': vm.newNotes,
    'epochInSeconds': Date.now() / 1000 | 0, //NOTE: prevents new date object from being created
    'secondsSinceEpoch': 0
  })
  
  //NOTE: should we notify user of successful addition?
  cancelNewGroup(vm);
}

function resetModal(vm) {
  vm.newFullname = null;
  vm.newPhonenumber = null;
  vm.newNotes = null;
  vm.errors.phonenumber = true;
  vm.errors.fullname = true;
}

</script>

<style scoped>
.button-margin-left {
  margin-left: 8px;
}
.new-group-header {
  height: 40px;
  display: flex;
  align-items: center;
}
.modal-body > .full-name,
.modal-body > .phone-number {
  margin-bottom: 14px;
}
.modal-body > .notes {
  margin-top: 32px;
  margin-bottom: 16px;
}
.danger-message {
  display: flex;
  height: 18px;
}
.hidden {
  opacity: 0;
}
</style>