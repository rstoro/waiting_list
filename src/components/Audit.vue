<template>

  <Page>
    <div slot="header">
      <Calendar v-on:dateSelected="getLogData"/>
      <div class="filter field">
        <p class="control has-icons-left">
          <span class="filter-icon icon has-text-info is-left">
            <font-awesome-icon :icon="['fas', 'filter']"/>
          </span>
          <input class="input" type="text" placeholder="Filter" v-model="search">
        </p>
      </div>
    </div>
    <div slot="body">
      <table class="audit-table table">
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
            <td>{{ user.fullname }}</td>
            <td>{{ user.phonenumber }}</td>
            <td>{{ getLogAttr(user.id, 'CREATE') }}</td>
            <td>{{ getLogAttr(user.id, 'MESSAGE') }}</td>
            <td>{{ getLogAttr(user.id, 'ARRIVE') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Page>
  
</template>

<script>
import storage from '../mixins/storage.js';
import Page from './base/Page.vue';
import Calendar from './calendar/Calendar.vue';

let log = [];

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
    getLogData(logDate) {
      // reset log
      log = []

      // get path based on datetime selected
      const dirPath = `logs/${logDate.getFullYear()}/${logDate.getMonth() + 1}/${logDate.getDate()}`;
      const dirList = this.listDir(dirPath) || [];
      dirList.forEach(fileName => {
        const filePath = `${dirPath}/${fileName}`;

        if (fileName === 'log') {
          this.loadFile(filePath).split(/\r?\n/).forEach(dataPoint => {
            const data = dataPoint.split(',');

            if (dataPoint !== '') {
              log.push(['id', 'action', 'datetime'].reduce((acc, key, i) => {
                acc[key] = data[i];
                return acc;
              }, {}));
            }
          });
        }
        else {
          this.users.push(JSON.parse(this.loadFile(filePath)));
        }
      });
    },
    getLogAttr(id, action) {
      // TODO: this is not working, figure it out.
      // make log a hash for faster searching?
      // TODO: this relly should be a relational database.
      log.forEach(dataPoint => {
        if (dataPoint.id === id && dataPoint.action === action) {
          console.log('hit')
          return 'wow' + dataPoint.datetime.split(' ', 1)[0];
        }
      });

      return 'a';
    },
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        return user.fullname.match(this.search) || user.phonenumber.match(this.search);
      });
    }
  },
  created() {
    this.getLogData(new Date());
  }
}
</script>

<style scoped>
.audit-table {
  width: 100%;
}
.filter {
  padding-top: 16px;
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
</style>
