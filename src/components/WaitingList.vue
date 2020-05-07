<template>
  <div class="waiting-list">
    <section class="hero waiting-list-header">
      <div class="hero-body groups-header">
        <h1 class="title">
          <span class="small-margin-right">
            <font-awesome-icon :icon="['fas', 'list']"/>
          </span>
          <span>{{ waitingListText }}</span>
        </h1>
        <a class="card-header-icon" @click="showModal = true">
          <span class="small-margin-right">
            <font-awesome-icon :icon="['fas', 'users']"/>
          </span>
          <span class="has-icons-left">{{ createNewGroupText }}</span>
        </a>
      </div>
    </section>

    <div class="waiting-list-body">
      <div class="true-center" v-if="groups === [] || groups === null || groups.length === 0">
        <div>
          <span class="has-text-grey-light">{{ noGroupsExistText }}</span>
        </div>
        <div>
          <span>
            <a @click="showModal = true">
              <span class="small-margin-right">
                <font-awesome-icon :icon="['fas', 'users']"/>
              </span>
              <span class="has-icons-left">{{ createNewGroupText }}</span>
            </a>
          </span>
        </div>
      </div>
      <section class="section" v-else>
        <div class="container" v-dragula="groups" drake="group_cards">
          <div v-for="(group, index) in groups" :key="`${group.fullname}_${index}`">
            <GroupCard v-bind:group="group" 
                v-bind:index="index"
                v-on:deleteGroup="removeGroupFromGroups"
                v-on:sendTextMessage="sendTextMessage"/>
          </div>
        </div>
      </section>
    </div>

    <!-- HACK: redesign modal component to NOT REQUIRED showModal prop for animations -->
    <CreateGroupModal v-bind:showModal="showModal"
        v-on:closeCreateGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

  </div>
  
</template>

<script>
import CreateGroupModal from './CreateGroupModal.vue';
import GroupCard from './GroupCard.vue';
import twilio_api from '../twilio_api';
import twilio from 'twilio';

//TODO: create logger...

export default {
  name: 'WaitingList',
  components: {
    CreateGroupModal,
    GroupCard
  },
  data() {
    return {
      waitingListText: 'Waiting List',
      createNewGroupText: 'Create New Group',
      noGroupsExistText: 'There are currently no groups on the waiting list.',
      showModal: false,
      groups: (localStorage.getItem('groups')) ? JSON.parse(localStorage.getItem('groups')) : {}
    }
  },
  methods: {
    //TODO: error checking on this
    sendTextMessage(data, index) {
      const vm = this;
      //NOTE: chromium throws some header errors when sending this request.
      //      just pretend like they are not there.
      vm.client.messages.create({
        body: data.message,
        from: twilio_api.from_number,
        to: data.phonenumber
      }).then(message => {
        //TODO: toast success
        vm.groups[index].messageSentEpoch = Date.now();
      }).catch(error => {
        //TODO: toast error
        vm.groups[index].messageSentEpoch = null;
      });
    },
    addNewGroup(newGroup) {
      const vm = this;
      newGroup.phonenumber = newGroup.phonenumber.replace(/\D+/g, '');
      vm.groups.push(newGroup);
    },
    removeGroupFromGroups(index) {
      const vm = this;
      vm.groups.splice(index, 1);
    }
  },
  watch: {
    groups: {
      handler() {
        const vm = this;
        localStorage.setItem('groups', JSON.stringify(vm.groups));
      },
      deep: true
    }
  },
  created() {
    const vm = this;
    
    // create twilio client used for api call
    vm.client = new twilio( twilio_api.account_sid, twilio_api.auth_token );
    
    // create dragula custom service
    const service = vm.$dragula.$service;
    service.options('group_cards', {
      direction: 'verticle',
      invalid: function(el, handle) {
        return el.id === 'create-group-modal' || el.id === 'message-group-modal' || el.id ==='delete-group-modal';
      }
    });
  }
}
</script>

<style scoped>
.waiting-list {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.waiting-list-header {
  display: flex;
  flex-flow: row;
}
.waiting-list-body {
  display: flex;
  flex-flow: column;
  flex: 1;
  overflow: auto;
}
.groups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dbdbdb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.groups-header > .title {
  margin: 0;
  padding: 8px;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
