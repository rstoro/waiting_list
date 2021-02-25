<template>
  <div style="height: 100%;">
  <div class="true-center">
    Not yet implemented.
  </div>
  <Page v-if="false">
    <div slot="header">
      <div class="analytics-header">
        <div class="analytics-header-row">
          <Calendar v-bind:is-range="true" v-on:dateSelected="getLogData"/>
        </div>
        <div class="analytics-header-row">
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="['test1', 'test2', 'test3']" 
                    v-bind:buttonText="'Chart Type'"
                    v-bind:value="comparisonType"
                    v-on:input="setComparisonType"/>
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="['test1', 'test2', 'test3']" 
                    v-bind:isDisabled="comparisonType === ''"
                    v-bind:buttonText="'X Axis'"
                    v-model="chartType"/>
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="['test1', 'test2', 'test3']" 
                    v-bind:isDisabled="comparisonType === ''"
                    v-bind:buttonText="'Y Axis'"
                    v-model="chartType"/>
        </div>
      </div>
    </div>
    <div slot="body">
      <bar-chart></bar-chart>
      <line-chart></line-chart>
    </div>
  </Page>
  </div>

</template>

<script>
import Page from './base/Page.vue';
import Storage from '../mixins/storage.js';
import Calendar from './calendar/Calendar.vue';
import Dropdown from './dropdown/Dropdown.vue';
import LineChart from './charts/LineChart.vue';
import BarChart from './charts/BarChart.vue';

export default {
  name: 'Analytics',
  mixins: [ Storage ],
  components: {
    Page,
    Calendar,
    Dropdown,
    LineChart,
    BarChart
  },
  data() {
    return {
      chartData: {},
      chartType: '',
      comparisonType: ''
    }
  },
  methods: {
    getLogData(dateRange) {
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      const logData = this.getLogs(startDate, endDate);
      console.log(logData);
      // TODO: populate charts from data
      this.resetSelections();
    },
    resetSelections() {
      this.comparisonType = '';
      this.chartType = '';
    },
    setComparisonType(e) {
      if (e === this.comparisonType) {
        return
      }

      this.comparisonType = e;
      this.chartType = '';
    }
  }
}
</script>

<style scoped>
.analytics-header > *:not(:first-child) {
  padding-top: 16px;
}
.analytics-header > .analytics-header-row {
  display: flex;
}
.analytics-header > .analytics-header-row > * {
  flex-grow: 1;
  flex-basis: 0;
}
.analytics-header > .analytics-header-row > *:not(:first-child) {
  padding-left: 8px;
}
.analytics-header > .analytics-header-row > *:not(:last-child) {
  padding-right: 8px;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
