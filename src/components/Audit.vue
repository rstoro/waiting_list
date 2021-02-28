<template>

  <Page>
    <div slot="header" class="audit-header">
      <Calendar v-on:dateSelected="get"/>
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
              <td class="has-text-centered">{{ getLogAttr(user.id, 'CREATE') }}</td>
              <td class="has-text-centered">{{ getLogAttr(user.id, 'SENT') }}</td>
              <td class="has-text-centered">{{ getLogAttr(user.id, 'ARRIVE') }}</td>
              <!-- <td>{{ getLogAttr(user.id, 'FAILED') }}</td> -->
            </tr>
          </tbody>
      </table>
      <div class="true-center" v-else>
        <span class="has-text-grey">{{ noLogsExistText() }}</span>
      </div>
    </div>
  </Page>
  
</template>

<script>
import Storage from '../mixins/storage.js';
import Page from './base/Page.vue';
import Calendar from './calendar/Calendar.vue';

let logdate = null;

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
      users: []
    }
  },
  methods: {
    get(newLogdate) {
      logdate = newLogdate;
      this.users = [];

      const logdata = this.getLog(logdate);
      if (logdata === null) {
        return;
      }

      const loadedUsers = []
      logdata.forEach(log => {
        const loadedUser = loadedUsers.find(user => user.id === log.id);
        if (loadedUser === null || loadedUser === undefined) {
          loadedUsers.push({
            'id': log.id,
            'fullname': log.fullname, 
            'phonenumber': log.phonenumber,
            'actions': { [log.action]: log.time.split(' ')[0] }
          });
        }
        else {
          loadedUser.actions[log.action] = log.time.split(' ')[0];
        }
      });

      this.users = loadedUsers;

      // NOTE: by default, sort direction is in descending order
      this.selectedHeader = this.tableHeaders.findIndex(h => h.text === 'Created');
      this.sortDirection = 'desc';
    },
    getLogAttr(id, action) {
      return this.users.find(user => user.id === id).actions[action] || 'N/A';
    },
    noLogsExistText() {
      return `There are no logs for ${new Date(logdate).toDateString()}.`;
    },
    formatPhoneNumber(pn) {
      return `${pn.substr(0,2)} (${pn.substr(2,3)}) ${pn.substr(5,3)}-${pn.substr(8)}`;
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
            this.users.sort((a, b) => a.actions['CREATE'] > b.actions['CREATE'] ? 1 : -1);
            break;
          case 3:   // action -> messaged
            this.users.sort((a, b) => { 
              const d1 = a.actions['SENT'] !== undefined 
                  ? new Date(`${logdate} ${b.actions['SENT']}`)
                  : new Date();
              const d2 = b.actions['SENT'] !== undefined 
                  ? new Date(`${logdate} ${b.actions['SENT']}`)
                  : new Date();

              return d1 > d2 ? 1 : -1;
            });
            break;
          case 4:   // action -> arrived
            this.users.sort((a, b) => { 
              const d1 = a.actions['ARRIVE'] !== undefined 
                  ? new Date(`${logdate} ${b.actions['ARRIVE']}`)
                  : new Date();
              const d2 = b.actions['ARRIVE'] !== undefined 
                  ? new Date(`${logdate} ${b.actions['ARRIVE']}`)
                  : new Date();

              return d1 > d2 ? 1 : -1;
            });
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
        const createdMatch = this.getLogAttr(user.id, 'CREATE')
            .toLowerCase()
            .match(escapedMatchingStr);
        const sentMatch = this.getLogAttr(user.id, 'SENT')
            .toLowerCase()
            .match(escapedMatchingStr);
        const arrivedMatch = this.getLogAttr(user.id, 'ARRIVE')
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
