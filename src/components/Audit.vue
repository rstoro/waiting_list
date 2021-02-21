<template>

  <Page>
    <div slot="header">
      <Calendar v-on:dateSelected="getLogData"/>
    </div>
    <div slot="body">
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
    }
  },
  methods: {
    getLogData(logDate) {
      console.log(logDate);
    }
    //this.years.push(...this.listDir('logs'));
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
