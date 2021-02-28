<template>

  <Page>
    <div slot="header">
      <div class="analytics-header">
        <div class="analytics-header-row">
          <Calendar v-bind:is-range="true" v-on:dateSelected="getLogData"/>
        </div>
        <!--
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
        -->
      </div>
    </div>
    <div slot="body">
      {{ avgWaitTime }}
      {{ avgTravelTime }}
      {{ avgOnListTime }}
      {{ showNoShowRatio }}
      {{ percentageShowed }}
      {{ percentageNoShowed }}
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
      avgWaitTime: 0,
      avgTravelTime: 0,
      avgOnListTime: 0,
      showNoShowRatio: 0,
      percentageShowed: 0,
      percentageNoShowed: 0
    }
  },
  methods: {
    getLogData(dateRange) {
      // load actionsDict from logs
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      const actionsDict = {};

      // NOTE: time-on-list is equal to showed plus noShowed
      const tData = {
        'waitTime': { 'val': 0, 'count': 0, 'keys': [
          { 'pk': 'SENT', 'fk': 'CREATE' }
        ]},
        'travelTime': { 'val': 0, 'count': 0, 'keys': [
          { 'pk': 'ARRIVE', 'fk': 'SENT' }
        ]},
        'showed': { 'val': 0, 'count': 0, 'keys': [
          { 'pk': 'ARRIVE', 'fk': 'CREATE' }
        ]},
        'noShowed': { 'val': 0, 'count': 0, 'keys': [
          { 'pk': 'DELETE', 'fk': 'CREATE' }
        ]}
      }

      // NOTE: logs are ALWAYS sequential
      this.getLogs(startDate, endDate).forEach(logfile => {
        logfile.forEach(log => {
          const newTime = this.getSecondsFromTimestamp(log.time);

          // set new action for user
          if (log.id in actionsDict) {
            actionsDict[log.id][log.action] = newTime;
          }
          else {
            actionsDict[log.id] = { [log.action]: newTime };
          }

          // check to see if we can update our tData 
          for (const dataType in tData) {
            tData[dataType]['keys'].forEach( key => {

              // check to see if the pk matches the current key
              if (log.action === key['pk']) {

                // update the count of the acc
                tData[dataType]['count'] += 1;

                // add to the cumulative value
                const timeDiff = newTime - actionsDict[log.id][key['fk']];
                tData[dataType]['val'] += timeDiff;
              }
            });
          }

        });
      });

      // populate data
      const tCount = tData['showed']['count'] + tData['noShowed']['count'];
      this.avgOnListTime = (tData['showed']['val'] + tData['noShowed']['val']) / tCount;
      this.avgWaitTime = tData['waitTime']['val'] / tData['waitTime']['count'];
      this.avgTravelTime = tData['travelTime']['val'] / tData['travelTime']['count'];
      this.showNoShowRatio = `${tData['showed']['count']}:${tData['noShowed']['count']}`;
      this.percentageShowed = tData['showed']['count'] / tCount * 100;
      this.percentageNoShowed = tData['noShowed']['count'] / tCount * 100;
    },
    getSecondsFromTimestamp(t) {
      const [hours, minutes, seconds] = t.split(' ')[0].split(':').map(n => parseInt(n));
      return hours * 60 * 60 + minutes * 60 + seconds;
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
