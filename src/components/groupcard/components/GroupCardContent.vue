<template>
  <div>
    <div class="group-card-body">
      <textarea class="textarea" type="text" placeholder="Notes" 
          v-model="group.notes"></textarea>
    </div>

    <div class="group-card-footer">
      <div class="group-card-info">
        <p class="is-size-7 has-text-weight-light has-text-left">
          {{ formatMessagedOn(group.messageSentEpoch) }}
        </p>
        <p class="is-size-7 has-text-weight-light has-text-left">
          {{ formatAddedOn(group.epoch) }}
        </p>
        <p class="is-size-7 has-text-weight-light has-text-left">
          {{ formatPhoneNumber(group.phonenumber) }}
        </p>
      </div>
      <div class="group-card-buttons">
        <button class="button group-card-button is-outlined is-normal is-danger button-margin-left" 
            @click="displayDeleteGroupModal(true)">
          <span class="icon is-small">
            <font-awesome-icon :icon="['fas', 'trash-alt']"/>
          </span>
          <span>{{ deleteText }}</span>
        </button>
        <button class="button group-card-button is-outlined is-normal is-success button-margin-left" 
            @click="displayMessageGroupModal(true)"
            v-if="group.messageSentEpoch == null">
          <span class="icon is-small">
            <font-awesome-icon :icon="['fas', 'envelope']"/>
          </span>
          <span>{{ messageText }}</span>
        </button>
        <button class="button group-card-button is-outlined is-normal is-success button-margin-left" 
            @click=""
            v-bind:disabled="group.arrivalEpoch != null"
            v-else>
          <span class="icon is-small">
            <font-awesome-icon :icon="['fas', 'check']"/>
          </span>
          <span>{{ arrivedText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupCardContent',
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messageText: 'Message',
      editText: 'Edit',
      deleteText: 'Delete',
      arrivedText: 'Arrived'
    }
  },
  methods: {
    displayDeleteGroupModal(value) {
      this.$emit('setDisplayDeleteGroupModal', value);
    },
    displayMessageGroupModal(value) {
      this.$emit('setDisplayMessageGroupModal', value);
    },
    formatAddedOn(epoch) {
      return `Added ${new Date(epoch)}`;
    },
    formatPhoneNumber(phonenumber) {
      return `+${phonenumber.substr(0,1)} (${phonenumber.substr(1,3)}) ${phonenumber.substr(4,3)}-${phonenumber.substr(7)}`;
    },
    formatMessagedOn(messageSentEpoch) {
      return messageSentEpoch === null 
        ? 'Has not been messaged.' 
        : `Messaged ${new Date(messageSentEpoch)}`;
    },
  }
}
</script>

<style scoped>
.group-card-body {
  padding: 16px;
  display: flex;
}
.group-card-info {
  display: flex;
  flex-flow: column;
}
.group-card-footer {
  padding: 16px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border-top: 1px solid #ededed;
}
.group-card-footer > .group-card-buttons {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.group-card-footer > .group-card-buttons > .group-card-button {
  margin-left: 8px;
}
</style>
