<template>
  <Modal id="create-group-modal" v-if="showModal">
    
    <h1 slot="header" class="title is-4 create-group-header">
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'user']"/>
      </span>
      <span>{{ createGroupText }}</span>
    </h1>

    <div class="modal-body" slot="body">
      <div class="full-name">
        <div class="field">
          <p class="has-icons-left is-size-7 has-text-danger danger-message"
              v-bind:class="[errors.fullname && newFullname !== null ? '' : 'hide-error']">
            <span class="icon is-small is-left has-text-danger">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
            {{ fullnameRequiredText }}
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
              v-bind:class="[errors.phonenumber && newPhonenumber !== null ? '' : 'hide-error']">
            <span class="icon is-small is-left has-text-danger">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            </span>
            {{ phonenumberRequiredText }}
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
import Modal from './Modal.vue';

export default {
  name: 'CreateGroupModal',
  props: {
    'showModal': false
  },
  components: {
    Modal
  },
  data() {
    return {
      newFullname: null,  //NOTE: null is being treated as untouched...
      newPhonenumber: null,
      newNotes: '',
      errors: {
        fullname: true,
        phonenumber: true
      },
      fullnameRequiredText: 'Name is required.',
      phonenumberRequiredText: 'Valid Phone Number is required.',
      createGroupText: 'Create Group',
      addGroupText: 'Add Group',
      cancelGroupText: 'Cancel'
    }
  },
  methods: {
    cancelNewGroup() {
      this.resetModal();
      this.$emit('closeCreateGroupModal');
    },
    addNewGroup() {
      // NOTE: companyData wait and hold times should be 'copied' into
      //       the group object to be later bound and modified as needed.
      this.$emit('newGroupCreated', {
        fullname: this.newFullname, 
        phonenumber: `+1${ this.newPhonenumber }`,
        notes: this.newNotes,
        epoch: Date.now(), //NOTE: prevents new date object from being created, something something premature micro-optimizations.
        messageSentEpoch: null,
        waitTime: this.$waitingListConfig.companyData.waitTime,
        holdTime: this.$waitingListConfig.companyData.holdTime
      })
      this.cancelNewGroup();
    },
    resetModal() {
      this.newFullname = null;
      this.newPhonenumber = null;
      this.newNotes = null;
      this.errors.phonenumber = true;
      this.errors.fullname = true;
    }
  },
  watch: {
    newFullname: {
      handler(newValue, oldValue) {
        this.newFullname = newValue;
        this.errors.fullname = (this.newFullname === '' || this.newFullname === null);
      }
    },
    newPhonenumber: {
      handler(newValue, oldValue) {
        this.newPhonenumber = newValue;
        this.errors.phonenumber = (this.newPhonenumber === '' || this.newPhonenumber === null || !this.newPhonenumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/));
      }
    }
  }
}
</script>

<style scoped>
.button-margin-left {
  margin-left: 8px;
}
.create-group-header {
  padding-top: 6px;
  padding-bottom: 6px;
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
.hide-error {
  opacity: 0;
}
</style>