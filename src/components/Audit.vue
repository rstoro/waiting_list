<template>

  <Page>
    <div slot="header" class="audit-header">
      <Calendar v-on:dateSelected="loadLogdata"/>
      <div class="filter field">
        <p class="control has-icons-left">
          <span class="filter-icon icon has-text-info is-left">
            <font-awesome-icon :icon="['fas', 'filter']"/>
          </span>
          <input class="input" type="text" placeholder="Filter" v-model="search">
        </p>
      </div>
    </div>
    <div slot="body" class="audit-content">
      <table class="table is-striped audit-table" v-if="users.length !== 0">
          <thead>
            <tr>
              <th v-for="(tableHeader, index) in tableHeaders" class="has-text-centered">
                <a @click="sortColumn(index)" class="audit-table-header-item">
                  <span>
                    <font-awesome-icon :icon="['fas', tableHeader.icon]"/>
                  </span>
                  <span>{{ tableHeader.text }}</span>
                  <span v-if="selectedHeader === index">
                    <font-awesome-icon :icon="['fas', 'angle-down']"
                        class="rotate-icon"
                        v-bind:class="{'rotate': sortDirection === 'asc'}"/>
                  </span>
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers">
              <td class="overflow-protection has-text-centered">{{ user.fullname }}</td>
              <td class="has-text-centered">{{ formatPhoneNumber(user.phonenumber) }}</td>
              <td class="has-text-centered">{{ formatDate(user.epoch) }}</td>
              <td class="has-text-centered">{{ formatDate(user.messageSentEpoch) }}</td>
              <td class="has-text-centered">{{ formatDate(user.arrivalEpoch) }}</td>
            </tr>
          </tbody>
      </table>
      <div class="true-center" v-else>
        <span class="has-text-grey">{{ noLogsExistText }}</span>
      </div>
    </div>
  </Page>
  
</template>

<script>
import Storage from '../mixins/storage.js';
import Page from './base/Page.vue';
import Calendar from './calendar/Calendar.vue';

export default {
  name: 'Audit',
  components: { 
    Page,
    Calendar
  },
  mixins: [ Storage ],
  data() {
    return {
      auditText: 'Audit',
      sortDirection: 'desc',
      tableHeaders: [
        { 'text': 'Name', 'icon': 'user' },
        { 'text': 'Phonenumber', 'icon': 'phone' },
        { 'text': 'Created', 'icon': 'clock' },
        { 'text': 'Sent', 'icon': 'hourglass-half' },
        { 'text': 'Arrived', 'icon': 'taxi' },
      ],
      selectedHeader: null,
      search: '',
      users: [],
      noLogsExistText: `There are no logs for ${new Date().toDateString()}.`
    }
  },
  methods: {
    loadLogdata(logdate) {
      this.noLogsExistText = `There are no logs for ${new Date(logdate).toDateString()}.`;
      this.users = this.loadGroups(logdate);
      this.sortColumn(2);
    },
    formatDate(timestamp) {
      return timestamp === null 
        ? 'N/A' 
        : new Date(timestamp).toTimeString().split(' ')[0];
    },
    formatPhoneNumber(pn) {
      return `${pn.substr(0,1)} (${pn.substr(1,3)}) ${pn.substr(4,3)}-${pn.substr(7)}`;
    },
    sortColumn(index) {
      if (this.selectedHeader === index) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.users.reverse();
      }
      else {
        this.selectedHeader = index;
        this.sortDirection = 'desc';
        switch(index) {
          case 0:   // name
            this.users.sort((a, b) => a.fullname > b.fullname ? 1 : -1);
            break;
          case 1:   // phonenumber
            this.users.sort((a, b) => a.phonenumber > b.phonenumber ? 1 : -1);
            break;
          case 2:   // action -> created
            this.users.sort((a, b) => a.epoch > b.epoch ? 1 : -1);
            break;
          case 3:   // action -> messaged
            this.users.sort((a, b) => a.messageSentEpoch > b.messageSentEpoch ? 1 : -1);
            break;
          case 4:   // action -> arrived
            this.users.sort((a, b) => a.arrivalEpoch > b.arrivalEpoch ? 1 : -1);
            break;
          default:  // default
            break;
        }
      }

    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const escapedMatchingStr = this.search.toLowerCase().replace(/\(|\)|-|\s/g, '');
        const nameMatch = user.fullname.toLowerCase().match(escapedMatchingStr);
        const phoneMatch = user.phonenumber.match(escapedMatchingStr);
        const createdMatch = new Date(user.epoch)
            .toTimeString()
            .split(' ')[0]
            .toLowerCase()
            .match(escapedMatchingStr);
        const sentMatch = user.messageSentEpoch === null
            ? 'N/A'
            : new Date(user.messageSentEpoch)
                .toTimeString()
                .split(' ')[0]
                .toLowerCase()
                .match(escapedMatchingStr);
        const arrivedMatch = user.arrivalEpoch === null
            ? 'N/A'
            : new Date(user.arrivalEpoch)
                .toTimeString()
                .split(' ')[0]
                .toLowerCase()
                .match(escapedMatchingStr);
        return nameMatch || phoneMatch || createdMatch || sentMatch || arrivedMatch;
      });
    }
  }
}
</script>

<style scoped>
.audit-header {
  display: flex;
}
.audit-header > * {
  flex-grow: 1;
  flex-basis: 0;
}
.audit-header > *:not(:last-child) {
  padding-right: 8px;
}
.audit-header > *:not(:first-child) {
  padding-left: 8px;
}
.audit-content {
  height: 100%;
}
.audit-table {
  width: 100%; 
  table-layout: fixed;
}
.audit-table th > a > *:not(:last-child) {
  margin-right: 8px;
}
.audit-table-header-item {
  user-select: none;
}
.fitler-icon {
  padding-left: 4px;
}
.rotate-icon {
  transition-duration: 0.1s;
  transform: rotate(0deg);
}
.rotate-icon.rotate {
  transition-duration: 0.1s;
  transform: rotate(-180deg);
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
.overflow-protection {
  overflow: hidden;
  overflow-wrap: break-word;
  /* text-overflow: ellipsis; */
}
</style>
