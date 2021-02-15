<template>
  <Modal id="message-group-modal" v-if="showModal">

    <h1 slot="header" class="title is-4 message-group-header">
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'envelope']"/>
      </span>
      <span>{{ messageGroupHeaderText }}</span>
    </h1>

    <div slot="body" class="message-group-body">
      <p class="has-text-left">{{ messageGroupBodyText }}</p>
      <div class="text-area">
        <div class="text-area-header">
          <p class="has-text-left">
            <span class="small-margin-right">
              <font-awesome-icon :icon="['fas', 'user']"/>
            </span>
            <span class="has-text-weight-medium"><b>{{ group.fullname }}</b></span>
          </p>
          <p class="has-text-right">
            <span class="small-margin-right">
              <font-awesome-icon :icon="['fas', 'phone']"/>
            </span>
            <span class="has-text-weight-medium"><b>{{ group.phonenumber }}</b></span>
          </p>
        </div>
        <textarea class="textarea has-fixed-size" type="text" placeholder="Message" v-bind:value="getMessageText" 
            v-bind:disabled="$waitingListConfig.companyData.isMessageEditable ? false : true"></textarea>
      </div>
    </div>

    <div slot="footer">
      <button class="button is-outlined is-normal is-danger small-margin-right" 
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
import Modal from './Modal.vue';

export default {
  name: 'MessageGroupModal',
  components: {
    Modal
  },
  data() {
    return {
      messageGroupHeaderText: 'Message Group',
      messageGroupBodyText: 'Would you like to send the following message?',
      cancelMessageGroupText: 'Cancel',
      confirmMessageGroupText: 'Message Group',
      companyName: this.$waitingListConfig.companyData.companyName
    }
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    confirmMessageGroup() {
      this.$emit('confirmMessageGroup', {
        message: this.getMessageText, 
        phonenumber: this.group.phonenumber
      });
    },
    cancelMessageGroup() {
      this.$emit('closeMessageGroupModal');
    }
  },
  computed: {
    getMessageText() {
      return `Hello ${ this.group.fullname }, this is ${ this.$waitingListConfig.companyData.companyName }!  Your lane is now available!  If you are not here within ${ this.group.holdTime } minutes, your reservation will be lost.  We look forward to seeing you soon!`
    },
  }
}
</script>

<style scoped>
.message-group-header {
  height: 40px;
  display: flex;
  align-items: center;
}
.message-group-body {
  padding-top: 16px;
  padding-bottom: 16px;
}
.text-area {
  padding-top: 32px;
  display: flex;
  flex-flow: column;
}
.text-area-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
</style>
