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

    <!-- HACK: redesign modal component to NOT REQUIRED showModal prop for animations -->
    <NewGroupModal v-bind:showModal="showModal"
        v-on:closeNewGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

    <section class="section">
      <div class="container" v-dragula="groups" drake="group_cards">
        <div v-for="(group, index) in groups" :key="`${group.fullname}_${index}`">
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
