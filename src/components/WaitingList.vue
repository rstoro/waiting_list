<template>
  <div class="waiting-list">
    <section class="hero waiting-list-header">
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
    <CreateGroupModal v-bind:showModal="showModal"
        v-on:closeCreateGroupModal="showModal = false"
        v-on:newGroupCreated="addNewGroup"/>

    <div class="waiting-list-body">
      <div class="true-center" v-if="groups === [] || groups === null || groups.length === 0">
        <div>
          <span class="has-text-grey-light">{{ noGroupsExistText }}</span>
        </div>
        <div>
          <span>
            <a @click="showModal = true">
              <span class="icon-margin-right">
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
            <GroupCard v-bind:group="group" v-bind:uid="index"
                v-on:deleteGroup="removeGroupFromGroups"/>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
import CreateGroupModal from './CreateGroupModal.vue';
import GroupCard from './GroupCard.vue';

export default {
  name: 'WaitingList',
  components: {
    CreateGroupModal,
    GroupCard
  },
  data: () => {
    return {
      'waitingListText': 'Waiting List',
      'createNewGroupText': 'Create New Group',
      'noGroupsExistText': 'There are currently no groups on the waiting list.',
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
.icon-margin-right {
  margin-right: 8px;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
