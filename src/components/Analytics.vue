<template>

  <Page>
    <div slot="header">
      <Calendar v-bind:is-range="true" v-on:dateSelected="getLogData"/>
    </div>
    <div slot="body">
      <bar-chart></bar-chart>
      <line-chart></line-chart>
    </div>
  </Page>

</template>

<script>
import Page from './base/Page.vue';
import Storage from '../mixins/storage.js';
import Calendar from './calendar/Calendar.vue';
import LineChart from './charts/LineChart.vue';
import BarChart from './charts/BarChart.vue';

export default {
  name: 'Analytics',
  mixins: [ Storage ],
  components: {
    Page,
    Calendar,
    LineChart,
    BarChart
  },
  data() {
    return {
    }
  },
  methods: {
    getLogData(newDate) {
      console.log(newDate);
    }
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
