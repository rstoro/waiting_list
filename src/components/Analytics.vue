<template>

  <Page>
    <div slot="header">
      <div class="analytics-header">
        <div class="analytics-header-row">
          <Calendar v-bind:is-range="true" v-on:dateSelected="getLogData"/>
        </div>
        <div class="analytics-header-row">
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="chartTypes" 
                    v-bind:buttonText="'Chart Type'"
                    v-bind:value="chartType"
                    v-on:input="setChartType"/>
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="xAxisDataTypes"
                    v-bind:isDisabled="chartType === ''"
                    v-bind:buttonText="'X Axis'"
                    v-model="xAxisDataType"/>
          <Dropdown class="display-selection-dropdown"
                    v-bind:values="yAxisDataTypes"
                    v-bind:isDisabled="chartType === ''"
                    v-bind:buttonText="'Y Axis'"
                    v-model="yAxisDataType"/>
        </div>
      </div>
    </div>
    <div slot="body">
      <!--<bar-chart></bar-chart>
      <line-chart></line-chart>-->
    </div>
  </Page>

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
    // TODO: chart data types: time, date, wait:message, message:arrival, wait:arrival
    //                         show:no-show
    //       chart types: bar, graph, doughnut, scatter with best fit (do we need others?)
    //       data to be displayed: averages (what else?)
    return {
      chartType: '',
      chartTypes: [],
      xAxisDataType: '',
      xAxisDataTypes: [],
      yAxisDataType: '',
      yAxisDataTypes: [],
      xAxisData: [],
      yAxisData: []
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
      this.chartType = '';
      this.resetAxisData();
    },
    resetAxisData() {
      this.xAxisData = [];
      this.yAxisData = [];
    },
    setChartType(e) {
      if (e === this.chartType) {
        return
      }

      this.chartType = e;
      this.resetAxisData();
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
