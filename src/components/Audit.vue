<template>

  <Page>
    <div slot="header">
      <Calendar v-on:dateSelected="setLogData"/>
    </div>
    <div slot="body">
      {{ logData }}
    </div>
  </Page>
  
</template>

<script>
import storage from '../mixins/storage.js';
import Page from './base/Page.vue';
import Calendar from './calendar/Calendar.vue';

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
      logData: []
    }
  },
  methods: {
    setLogData(logDate) {
      const dirPath = `logs/${logDate.getUTCFullYear()}/${logDate.getUTCMonth() + 1}/${logDate.getUTCDate()}`;
      const fileName = 'log';
      this.logData = (this.listDir(dirPath) || []).includes(fileName)
        ? ('' + this.loadFile(`${dirPath}/${fileName}`)).split(/\r?\n/)
        : [];
    }
  },
  created() {
    this.setLogData(new Date());
  }
}
</script>

<style scoped>
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
