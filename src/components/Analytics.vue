<template>

  <Page>
    <div slot="header">
      <Calendar v-bind:is-range="true" v-on:dateSelected="getLogData"/>
      <div class="display-selection">
        <Dropdown class="display-selection-dropdown"
                  v-bind:values="['test1', 'test2', 'test3']" 
                  v-bind:buttonText="'Comparison Type'"
                  v-bind:value="comparisonType"
                  v-on:input="setComparisonType"
                  />
        <Dropdown class="display-selection-dropdown"
                  v-bind:values="['test1', 'test2', 'test3']" 
                  v-bind:isDisabled="comparisonType === ''"
                  v-bind:buttonText="'Chart Type'"
                  v-model="chartType"/>
      </div>
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

      const startLogdata = this.getLog(startDate);
      console.log(startLogdata);

      if (startDate !== endDate) {
        const startLogdata = this.getLog(startDate);
      }

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
.display-selection {
  padding-top: 16px;
  display: flex;
}
.display-selection-dropdown {
  padding-right: 16px;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
