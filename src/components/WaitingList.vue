<template>
  <div class="waiting-list">
    <div class="card">
      <header class="card-header groups-header">
        <p class="card-header-title">Waiting List</p>
        <a class="card-header-icon" @click="toggleModal()">
          <span class="icon icon-margin-right">
            <font-awesome-icon :icon="['fas', 'users']"/>
          </span>
          <span>Create New Group</span>
        </a>
      </header>
        <Modal v-if="showModal">
          <h1 slot="header" class="subtitle is-4">New Group</h1>
          <div slot="body">
            <div class="full-name">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" type="text" placeholder="Full Name" v-model="newFullname">
                  <span class="icon is-small is-left">
                    <font-awesome-icon :icon="['fas', 'user']"/>
                  </span>
                </p>
              </div>
            </div>
            <div class="phone-number">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" type="text" placeholder="Phone Number" v-model="newPhonenumber">
                  <span class="icon is-small is-left">
                    <font-awesome-icon :icon="['fas', 'phone']"/>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div slot="footer">
            <button class="button is-danger button-margin-left" @click="cancelNewGroup()">
              <span class="icon is-small">
                <font-awesome-icon :icon="['fas', 'ban']"/>
              </span>
              <span>Cancel</span>
            </button>
            <button class="button is-success button-margin-left" @click="addNewGroup()">
              <span class="icon is-small">
                <font-awesome-icon :icon="['fas', 'check']"/>
              </span>
              <span>Add Group</span>
            </button>
          </div>
        </Modal>
      <div class="card-content">
        <div class="content">
          <div v-for="(group, index) in groups" :key="`group-${index}`" class="card">
            <header class="card-header">
              <p class="card-header-title remove-font-weight">
                <span class="icon icon-margin-right">
                  <font-awesome-icon :icon="['fas', 'user']"/>
                </span>
                <span>{{ group.fullname }}</span>
              </p>
              <a href="#" class="card-header-icon" aria-label="more options" @click="selectGroup(index)">
                <span class="icon">
                  <!-- NOTE: this is crap, I wish there was a conditional to prevent this garbage. -->
                  <font-awesome-icon v-if="groupSelected === index" :icon="['fas', 'angle-right']"/>
                  <font-awesome-icon v-if="groupSelected !== index" :icon="['fas', 'angle-down']"/>
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div v-if="groupSelected === index" class="card-content">
              <transition name="group-selected">
                <div class="content">
                  <p>Phone Number:&nbsp;{{ group.phonenumber }}</p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <!-- <footer class="card-footer">
      </footer> -->
    </div>
  </div>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'WaitingList',
  components: {
    Modal
  },
  data: () => {
    return { 
      showModal: false,
      newFullname: "",
      newPhonenumber: "",
      groupSelected: null,
      groups: [new Group("Ryan Storo", "1234567890"), new Group("Destiny Gauthier", "9876543210")]
    }
  },
  methods: {
    toggleModal: function() { toggleModal(this) },
    cancelNewGroup: function() { cancelNewGroup(this) },
    addNewGroup: function() { addNewGroup(this) },
    selectGroup: function(index) { selectGroup(this, index) }
  }
}

function cancelNewGroup(vm) {
  resetNewGroupVariables(vm);
  toggleModal(vm);
}

function addNewGroup(vm) {
  //TODO: data check group attributes before this point 
  vm.groups.push(new Group(vm.newFullname, vm.newPhonenumber));
  //TODO: notify user of successful addition
  resetNewGroupVariables(vm);
  toggleModal(vm);
  console.log(vm.groups);
}

function selectGroup(vm, index) {
  if (vm.groupSelected === index) {
    vm.groupSelected = null;
  }
  else {
    vm.groupSelected = index;
  }
}

function toggleModal(vm){
  vm.showModal = !vm.showModal;
}

function resetNewGroupVariables(vm) {
  vm.newFullname = "";
  vm.newPhonenumber = "";
}

class Group {
  constructor(fullname, phonenumber) {
    this.fullname = fullname;
    this.phonenumber = phonenumber;
    this.epochInSeconds = Date.now() / 1000 | 0; //NOTE: prevents new date object from being created
    this.secondsSinceEpoch = () => { (Date.now() / 1000 | 0) - this.epochInSeconds }
  }
}

</script>

<style scoped>
  .waiting-list {
    margin: 32px;
  }
  .groups-header {
    background-color: whitesmoke;
  }
  .icon-margin-right {
    margin-right: 8px;
  }
  .full-name {
    padding-bottom: 8px;
  }
  .button-margin-left {
    margin-left: 8px;
  }
  .remove-font-weight {
    font-weight: 100;
  }
  /* TODO: group-selected animations */
</style>
