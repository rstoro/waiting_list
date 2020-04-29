<template>
  <div>

    <div class="groups-header">
      <h1 class="title">Waiting List</h1>
      <a class="card-header-icon" @click="showModal = true">
        <span class="icon icon-margin-right">
          <font-awesome-icon :icon="['fas', 'users']"/>
        </span>
        <span>Create New Group</span>
      </a>
    </div>

    <NewGroupModal v-bind:show-modal="showModal" v-on:closeNewGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup()"/>

    <div class="card-content">
      <div class="content">
        <div v-for="(group, index) in groups" :key="`group-${index}`" class="card">
          <GroupCard v-bind:group="group"/>
        </div>
      </div>

      <!-- <footer class="card-footer">
      </footer> -->

    </div>
  </div>
</template>

<script>
import NewGroupModal from './NewGroupModal.vue'
import GroupCard from './GroupCard.vue'

export default {
  name: 'WaitingList',
  components: {
    NewGroupModal,
    GroupCard
  },
  data: () => {
    return {
      'showModal': false,
      'groups': [DEBUGcreateGroup('Ryan Storo', 1234567890), DEBUGcreateGroup('Destiny Gauthier', '9876543210')]
    }
  },
  methods: {
    addNewGroup: function(newGroup) {
      const vm = this;
      vm.groups.push(newGroup);
    }
  }
}

function DEBUGcreateGroup(fullname, phonenumber) {
  return {
    'fullname': fullname, 
    'phonenumber': phonenumber,
    'epochInSeconds': Date.now() / 1000 | 0, //NOTE: prevents new date object from being created
    'secondsSinceEpoch': () => { (Date.now() / 1000 | 0) - this.epochInSeconds }
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
  background-color: whitesmoke;
}
.groups-header > .title {
  margin: 0;
  padding-left: 8px;
}
.icon-margin-right {
  margin-right: 8px;
}
</style>
