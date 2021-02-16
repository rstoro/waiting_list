<template>
  <div class="waiting-list">
    <a class="create-group-btn" @click="showModal = true">
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'users']"/>
      </span>
      <span class="has-icons-left">{{ createNewGroupText }}</span>
    </a>

    <div class="line-wrapper"><div class="line"></div></div>

    <div class="true-center" v-if="groups === [] || groups === {} || groups === null || groups.length === 0">
      <div>
        <span class="has-text-grey">{{ noGroupsExistText }}</span>
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

    <div class="waiting-list-content" v-else>
      <div class="container" v-dragula="groups" drake="group_cards">
        <div v-for="(group, index) in groups" v-bind:key="`${group.fullname}_${index}`">
          <GroupCard v-bind:group="group" 
              v-bind:index="index"
              v-on:deleteGroup="removeGroupFromGroups"
              v-on:sendTextMessage="sendTextMessage"/>
        </div>
      </div>
    </div>

    <!-- HACK: redesign modal component to NOT REQUIRED showModal prop for animations -->
    <CreateGroupModal v-bind:showModal="showModal"
        v-on:closeCreateGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

  </div>
  
</template>

<script>
import twilio from 'twilio';
import { openNotificationAlert } from './NotificationAlert.vue'
import CreateGroupModal from './CreateGroupModal.vue';
import GroupCard from './GroupCard.vue';
import storage from '../mixins/storage.js';

//TODO: create logger...

export default {
  name: 'WaitingList',
  components: {
    CreateGroupModal,
    GroupCard,
  },
  mixins: [ storage ],
  data() {
    return {
      waitingListText: 'Waiting List',
      createNewGroupText: 'Create New Group',
      noGroupsExistText: 'There are currently no groups on the waiting list.',
      showModal: false,
      groups: this.loadFile('groups')
    }
  },
  methods: {
    //TODO: more robust error checking on this
    sendTextMessage(data, index) {
      //NOTE: chromium throws some header errors when sending this request.
      //      just pretend like they are not there.
      this.client.messages.create({
        body: data.message,
        from: this.$waitingListConfig.twilioData.fromNumber,
        to: data.phonenumber
      }).then(message => {
        this.groups[index].messageSentEpoch = Date.now();
        openNotificationAlert({
          message: `Message successfully sent to "${ this.groups[index].fullname }".`,
          colour: 'success',
          duration: 5000
        });
      }).catch(error => {
        this.groups[index].messageSentEpoch = null;
        openNotificationAlert({
          message: `${ error['name'] }: ${ error['message'] }`,
          colour: 'danger',
          duration: 5000
        });
        setTimeout(() => {
          openNotificationAlert({
            message: `Message failed to send to "${ this.groups[index].fullname }".`,
            colour: 'danger',
            duration: 5000
          });
        }, 1500);
      });
    },
    addNewGroup(newGroup) {
      openNotificationAlert({
        message: `Successfuly created group "${ newGroup.fullname }".`,
        colour: 'success',
        duration: 5000
      });
      newGroup.phonenumber = newGroup.phonenumber.replace(/\D+/g, '');
      this.groups.push(newGroup);
      console.log(this.groups);
    },
    removeGroupFromGroups(index) {
      const d = new Date(this.groups[index].epoch);
      const filename = `${d.getUTCFullYear()}${d.getUTCMonth() + 1}${d.getUTCDate()}`;
      this.appendFile(filename, this.groups[index]);
      openNotificationAlert({
        message: `Successfuly deleted group "${ this.groups[index].fullname }".`,
        colour: 'success',
        duration: 5000
      });
      this.groups.splice(index, 1);
    }
  },
  watch: {
    groups: {
      handler() {
        this.saveFile('groups', JSON.stringify(this.groups));
      },
      deep: true
    }
  },
  created() {
    // create twilio client used for api call
    this.client = new twilio( 
      this.$waitingListConfig.twilioData.accountSid, 
      this.$waitingListConfig.twilioData.authToken 
    );
    
    // create dragula custom service
    if (!this.$dragula.$service.find('group_cards')) {
      this.$dragula.$service.options('group_cards', {
        direction: 'verticle',
        invalid: function(el, handle) {
          return el.id === 'create-group-modal' || el.id === 'message-group-modal' || el.id ==='delete-group-modal';
        }
      });
    }
  }
    
}
</script>

<style scoped>
.waiting-list {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}
.create-group-btn {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px;
}
.waiting-list-content {
  padding: 0 16px 64px 16px;
  overflow-y: scroll;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
.line-wrapper {
  padding: 24px 16px;
}
.line {
  border-top: 2px solid rgb(10, 10, 10, 0.1);
  font-size: 1px;
}
</style>
