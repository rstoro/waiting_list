<template>
  <div>
    <section class="hero">
      <div class="hero-body groups-header">
        <h1 class="title">{{ waitingListText }}</h1>
        <a class="card-header-icon" @click="showModal = true">
          <span class="icon-margin-right">
            <font-awesome-icon :icon="['fas', 'users']"/>
          </span>
          <span class="has-icons-left">{{ createNewGroupText }}</span>
        </a>
      </div>
    </section>

    <NewGroupModal v-bind:show-modal="showModal" 
        v-on:closeNewGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

    <section class="section">
      <div class="container">
        <div v-for="(group, index) in groups" :key="`${group.fullname}_${index}`"
            v-dragging="{item: group, list: groups, group: 'group'}">
          <GroupCard v-bind:group="group" v-bind:uid="index"
              v-on:deleteGroup="removeGroupFromGroups" />
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import NewGroupModal from './NewGroupModal.vue';
import GroupCard from './GroupCard.vue';

export default {
  name: 'WaitingList',
  components: {
    NewGroupModal,
    GroupCard
  },
  data: () => {
    return {
      'waitingListText': 'Waiting List',
      'createNewGroupText': 'Create New Group',
      'showModal': false,
      'groups': (localStorage.getItem('groups')) ? JSON.parse(localStorage.getItem('groups')) : {}
    }
  },
  methods: {
    addNewGroup: function(newGroup) { return addNewGroup(this, newGroup) },
    removeGroupFromGroups: function(index) { return removeGroupFromGroups(this, index) }
  },
  watch: {
    'groups': {
      handler() {
        const vm = this;
        localStorage.setItem('groups', JSON.stringify(vm.groups));
      },
      deep: true
    }
  }
}

function addNewGroup(vm, newGroup) {
  newGroup.phonenumber = newGroup.phonenumber.replace(/\D+/g, '');
  vm.groups.push(newGroup);
}

function removeGroupFromGroups(vm, index) {
  vm.groups.splice(index, 1);
}

function DEBUGcreateGroup(fullname, phonenumber, notes) {
  return {
    'fullname': fullname, 
    'phonenumber': phonenumber,
    'notes': notes,
    'epochInSeconds': Date.now() / 1000 | 0, //NOTE: prevents new date object from being created
    'secondsSinceEpoch': 0
  }
}
</script>

<style scoped>
.waiting-list {
  margin: 32px;
}
.groups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}
.groups-header > .title {
  margin: 0;
  padding: 8px;
}
.icon-margin-right {
  margin-right: 8px;
}
</style>
