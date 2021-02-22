<template>
  <Page>
    <a slot="header" class="create-group-btn" @click="showModal = true">
      <span class="small-margin-right">
        <font-awesome-icon :icon="['fas', 'users']"/>
      </span>
      <span class="has-icons-left">{{ createNewGroupText }}</span>
    </a>

    <div slot="body" class="waiting-list-body">
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

      <div v-else>
        <div v-dragula="groups" drake="group_cards">
          <div v-for="(group, index) in groups" v-bind:key="`${group.fullname}_${index}`">
            <GroupCard v-bind:group="group" 
                v-bind:index="index"
                v-on:deleteGroup="removeGroupFromGroups"
                v-on:sendTextMessage="sendTextMessage"/>
          </div>
        </div>
      </div>

      <!-- HACK: redesign modal component to NOT REQUIRED -->
      <!-- showModal prop for animations -->
      <CreateGroupModal v-bind:showModal="showModal"
          v-on:closeCreateGroupModal="showModal = false"
          v-on:newGroupCreated="addNewGroup"/>
    </div>

  </Page>
  
</template>

<script>
import twilio from 'twilio';
import { openNotificationAlert } from './base/NotificationAlert.vue';
import Page from './base/Page.vue';
import CreateGroupModal from './groupcard/modals/CreateGroupModal.vue';
import GroupCard from './groupcard/GroupCard.vue';
import storage from '../mixins/storage.js';

export default {
  name: 'WaitingList',
  components: {
    Page,
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
      groups: []
    }
  },
  mounted() {
    const loadedGroups = JSON.parse(this.loadFile('groups.json') || '[]');
    if (loadedGroups === null) {
      this.createFile('groups.json');
    }
    else {
      this.groups.push(...loadedGroups);
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
        this.log('SENT', this.groups[index].id);
        openNotificationAlert({
          message: `Message successfully sent to "${ this.groups[index].fullname }".`,
          colour: 'success',
          duration: 5000
        });
      }).catch(error => {
        this.groups[index].messageSentEpoch = null;
        this.log('FAILED', this.groups[index].id);
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
      this.log('CREATE', newGroup.id);
      this.storeUser(newGroup.id, JSON.stringify({ 
        'id': newGroup.id,
        'fullname': newGroup.fullname,
        'phonenumber': newGroup.phonenumber
      }));
      openNotificationAlert({
        message: `Successfuly created group "${ newGroup.fullname }".`,
        colour: 'success',
        duration: 5000
      });
      newGroup.phonenumber = newGroup.phonenumber.replace(/\D+/g, '');
      this.groups.push(newGroup);
    },
    removeGroupFromGroups(index) {
      this.log('DELETE', this.groups[index].id);
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
        this.saveFile('groups.json', JSON.stringify(this.groups) || []);
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
.create-group-btn {
  display: flex;
  justify-content: flex-end;
}
.waiting-list-body {
  height: 100%;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
