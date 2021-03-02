<template>

  <Page>
    <div slot="header">
      <div class="analytics-header">
        <div class="analytics-header-row">
          <Calendar v-bind:is-range="false" v-on:dateSelected="loadLogdata"/>
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
    <div slot="body" class="analytics-body">
      <div class="columns is-multiline is-mobile" v-if="chartData.length !== 0">
        <div class="column is-half">
          <doughnut-chart v-bind:chart-data="showedNoShowedChartData"
                          v-bind:center-text="showedNoShowedChartText"></doughnut-chart>
        </div>
        <div class="column is-one-quarter">
          wow
        </div>
        <div class="column is-one-quarter">
          wow2
        </div>
        <div class="column is-full">
          wow3
        </div>
      </div>
      <!--<bar-chart></bar-chart>
      <line-chart></line-chart>-->
      <div class="true-center" v-else>
        <span class="has-text-grey">{{ noDataExistText() }}</span>
      </div>
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
import DoughnutChart from './charts/DoughnutChart.vue';

let logdate;

export default {
  name: 'Analytics',
  mixins: [ Storage ],
  components: {
    Page,
    Calendar,
    Dropdown,
    LineChart,
    BarChart,
    DoughnutChart 
  },
  data() {
    // TODO: chart data types: time, date, wait:message, message:arrival, wait:arrival
    //                         show:no-show
    //       chart types: bar, graph, doughnut, scatter with best fit (do we need others?)
    //       data to be displayed: averages (what else?)
    return {
      showedNoShowedChartText: '',
      showedNoShowedChartData: {},
      chartData: []
    }
  },
  methods: {
    loadLogdata(newDate) {
      // set prev
      logdate = newDate;

      // reset chartData
      this.chartData = [];

      // NOTE: time-on-list is equal to showed plus noShowed
      const logs = this.getLog(logdate);

      // early out
      if (logs === null) {
        return;
      }

      logs.forEach(log => {
        const currentUser = this.chartData.find(user => user.id === log.id);
        if (currentUser === null || currentUser === undefined) {
          this.chartData.push({
            'id': log.id,
            'fullname': log.fullname,
            'phonenumber': log.phonenumber,
            'actions': { [log.action]: log.time.split(' ')[0] }
          });
        }
        else {
          currentUser.actions[log.action] = log.time.split(' ')[0];
        }
      });

      // populate data
      const showedCount = this.chartData.reduce( (acc, user) => {
        return user['actions']['ARRIVE'] ? acc + 1 : acc;
      }, 0);
      const noShowedCount = this.chartData.length - showedCount;
      this.showedNoShowedChartData = this.buildShowedNoShowedChartData(
        showedCount,
        noShowedCount
      );
      this.showedNoShowedChartText = this.getShowedNoShowedRatio(
        showedCount,
        noShowedCount
      );

      /*
      this.avgOnListTime = (tData['showed']['val'] + tData['noShowed']['val']) / (tData['showed']['count'] + tData['noShowed']['count']);
      this.avgWaitTime = tData['waitTime']['val'] / tData['waitTime']['count'];
      this.avgTravelTime = tData['travelTime']['val'] / tData['travelTime']['count'];
      this.showNoShowRatio = `${tData['showed']['count']}:${tData['noShowed']['count']}`;
      */

    },
    getSecondsFromTimestamp(t) {
      const [hours, minutes, seconds] = t.split(' ')[0].split(':').map(n => parseInt(n));
      return hours * 60 * 60 + minutes * 60 + seconds;
    },
    getShowedNoShowedRatio(showed, noShowed) {
      const total = showed + noShowed;
      const showedPercentage = showed === 0 ? 0 : Math.round((showed / total) * 100);
      return `${showedPercentage}%`;
    },
    buildShowedNoShowedChartData(showed, noShowed) {
      return {
        labels: ['Showed', 'No Showed'],
        datasets: [
          {
            borderWidth: 0,
            backgroundColor: ['#48c774', '#f14668'],
            data: [ showed, noShowed ]
          }
        ]
      }
    },
    noDataExistText() {
      return `There is no data for ${new Date(logdate).toDateString()}.`;
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
.analytics-body {
  height: 100%;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
