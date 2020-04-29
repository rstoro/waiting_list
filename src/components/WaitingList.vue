<template>
  <div>

    <section class="hero">
      <div class="hero-body groups-header">
        <h1 class="title">Waiting List</h1>
        <a class="card-header-icon" @click="showModal = true">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'users']"/>
          </span>
          <span>Create New Group</span>
        </a>
      </div>
    </section>

    <NewGroupModal v-bind:show-modal="showModal" v-on:closeNewGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

    <section class="section">
      <div class="container">
        <div v-for="(group, index) in groups" :key="`group-${index}`">
          <GroupCard v-bind:group="group"/>
        </div>
      </div>
    </section>

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
    addNewGroup: function(newGroup) { return addNewGroup(this, newGroup) }
  }
}

function addNewGroup(vm, newGroup) {
  vm.groups.push(newGroup);
}

function DEBUGcreateGroup(fullname, phonenumber) {
  return {
    'fullname': fullname, 
    'phonenumber': phonenumber,
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
  background-color: whitesmoke;
}
.groups-header > .title {
  margin: 0;
  padding: 8px;
}
</style>
