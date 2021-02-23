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
              <th>
                <span class="small-margin-right">
                  <font-awesome-icon :icon="['fas', 'user']"/>
                </span>
                <span class="has-icons-left">Name</span>
              </th>
              <th>
                <span class="small-margin-right">
                  <font-awesome-icon :icon="['fas', 'phone']"/>
                </span>
                <span class="has-icons-left">Phonenumber</span>
              </th>
              <th>
                <span class="small-margin-right">
                  <font-awesome-icon :icon="['fas', 'clock']"/>
                </span>
                <span class="has-icons-left">Created</span>
              </th>
              <th>
                <span class="small-margin-right">
                  <font-awesome-icon :icon="['fas', 'hourglass-half']"/>
                </span>
                <span class="has-icons-left">Messaged</span>
              </th>
              <th>
                <span class="small-margin-right">
                  <font-awesome-icon :icon="['fas', 'taxi']"/>
                </span>
                <span class="has-icons-left">Arrived</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers">
              <td class="overflow-protection">{{ user.fullname }}</td>
              <td>{{ user.phonenumber }}</td>
              <td>{{ getLogAttr(user.id, 'CREATE') }}</td>
              <td>{{ getLogAttr(user.id, 'SENT') }}</td>
              <td>{{ getLogAttr(user.id, 'ARRIVED') }}</td>
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
import storage from '../mixins/storage.js';
import Page from './base/Page.vue';
import Calendar from './calendar/Calendar.vue';

let logdate = null;

export default {
  name: 'Audit',
  components: { 
    Page,
    Calendar
  },
  mixins: [ storage ],
  data() {
    return {
      auditText: 'Audit',
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
    },
    getLogAttr(id, action) {
      return this.users.find(user => user.id === id).actions[action] || 'N/A';
    },
    noLogsExistText() {
      return `There are no logs for ${new Date(logdate).toDateString()}.`;
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const escapedMatchingStr = this.search
            .toLowerCase()
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nameMatch = user.fullname.toLowerCase().match(escapedMatchingStr);
        const phoneMatch = user.phonenumber.toLowerCase().match(escapedMatchingStr);
        return nameMatch || phoneMatch;
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
.audit-content table { 
  width: 100%; 
}
.audit-table {
  table-layout: fixed;
}
.fitler-icon {
  padding-left: 4px;
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
