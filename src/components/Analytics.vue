<template>

  <Page>
    <div slot="header">
      <div class="analytics-header">
        <div class="analytics-header-row">
          <Calendar v-bind:is-range="false" v-on:dateSelected="loadLogdata"/>
        </div>
      </div>
    </div>
    <div slot="body" class="analytics-body">
      <div class="columns is-multiline" v-if="dataExists">
        <div class="column is-full">
          <div class="columns">
            <div class="column">
              <span><b>Average Wait Time</b>&nbsp;{{formatAvg(avgWait)}}</span>
            </div>
            <div class="column">
              <span><b>Average Travel Time</b>&nbsp;{{formatAvg(avgTravel)}}</span>
            </div>
            <div class="column">
              <span><b>Average Total Time</b>&nbsp;{{formatAvg(avgTotal)}}</span>
            </div>
          </div>
        </div>
        <div class="column is-one-third">
          <doughnut-chart v-bind:chart-data="showedNoShowedChartData"
                          v-bind:center-text="showedNoShowedChartText"></doughnut-chart>
        </div>
        <div class="column is-two-thirds">
          <bar-chart v-bind:chart-data="timesChartData"
                     v-bind:x-axis-label="'Time of Day'"
                     v-bind:y-axis-label="'Minutes'"></bar-chart>
        </div>
      </div>
      <div class="true-center" v-else>
        <span class="has-text-grey">{{ noDataExistsText }}</span>
      </div>
    </div>
  </Page>

</template>

<script>
import Page from './base/Page.vue';
import Storage from '../mixins/storage.js';
import Calendar from './calendar/Calendar.vue';
import Dropdown from './dropdown/Dropdown.vue';
import BarChart from './charts/BarChart.vue';
import DoughnutChart from './charts/DoughnutChart.vue';

export default {
  name: 'Analytics',
  mixins: [ Storage ],
  components: {
    Page,
    Calendar,
    Dropdown,
    BarChart,
    DoughnutChart 
  },
  data() {
    return {
      showedNoShowedChartData: {},
      timesChartData: {},
      noDataExistsText: '',
      showedNoShowedChartText: '',
      avgWait: 0,
      avgTravel: 0,
      avgTotal: 0,
      dataExists: false
    }
  },
  methods: {
    loadLogdata(logdate) {
      this.noDataExistsText = `There is no data for ${new Date(logdate).toDateString()}.`;

      const users = this.loadGroups(logdate);
      if (users === null || users === undefined || users.length === 0) {
        this.dataExists = false;
        return
      }

      this.dataExists = true;
      this.timesChartData = this.getTimesChart(users);
      this.showedNoShowedChartData = this.getShowedNoShowedChartData(users);
      this.showedNoShowedChartText = this.getShowedNoShowedChartText(users);
      [this.avgWait, this.avgTravel, this.avgTotal] = this.getAverages(users);
    },
    formatAvg(n) {
      const f = n => n < 10 ? '0' + n : n;
      const [hours, minutes, seconds] = [
        Math.floor(n / 60 / 60), 
        Math.floor(n / 60),
        Math.floor(n % 60)
      ].map(f);
      return `${hours}:${minutes}:${seconds}`;
    },
    getSecondsFromTimestamp(t) {
      const [hours, minutes, seconds] = t.split(' ')[0].split(':').map(n => parseInt(n));
      return hours * 60 * 60 + minutes * 60 + seconds;
    },
    getTimesChart(users) {
      // user times data
      const labels = [];
      const messagedDataset = {
        label: 'Messaged', data: [], backgroundColor: '#ffdd57', borderWidth: 0
      };
      const arrivedDataset = {
        label: 'Arrived', data: [], backgroundColor: '#48c774', borderWidth: 0
      };
      const deletedDataset = {
        label: 'Deleted', data: [], backgroundColor: '#f14668', borderWidth: 0
      };

      users.forEach( user => {
        // set the label
        labels.push(new Date(user.epoch).toTimeString().split(' ')[0]);
        
        // if they were messaged
        messagedDataset['data'].push(user.messageSentEpoch !== null
          ? (user.messageSentEpoch - user.epoch) / 1000 / 60
          : 0
        );

        arrivedDataset['data'].push(user.arrivalEpoch !== null
          ? (user.arrivalEpoch - user.messageSentEpoch) / 1000 / 60
          : 0
        );


        if (user.messageSentEpoch === null) {
          // if they did not arrive and were not messaged
          deletedDataset['data'].push((user.deletedEpoch - user.epoch) / 1000 / 60);
        }
        else {
          // if they did not arrive and were messaged
          deletedDataset['data'].push(user.arrivalEpoch === null
            ? (user.deletedEpoch - user.messageSentEpoch) / 1000 / 60
            : 0
          );
        }
      });

      return {
        labels: labels,
        datasets: [
          messagedDataset,
          arrivedDataset,
          deletedDataset
        ]
      };
    },
    getShowedNoShowedChartData(users) {
      const showedCount = users.reduce((acc, user) => {
        return user.arrivalEpoch !== null ? acc + 1 : acc;
      }, 0);
      const noShowedCount = users.length - showedCount;

      return {
        labels: ['Showed', 'No Showed'],
        datasets: [
          {
            borderWidth: 0,
            backgroundColor: ['#48c774', '#f14668'],
            data: [ showedCount, noShowedCount ]
          }
        ]
      };
    },
    getShowedNoShowedChartText(users) {
      const showedCount = users.reduce((acc, user) => {
        return user.arrivalEpoch !== null ? acc + 1 : acc;
      }, 0);
      const noShowedCount = users.length - showedCount;

      return showedCount !== 0 
        ? Math.round((showedCount / (showedCount + noShowedCount)) * 100) + '%'
        : '0';
    },
    getAverages(users) {
      return users
        .reduce((acc, user) => {
            if (user.messageSentEpoch !== null) {
              acc[0] += (user.messageSentEpoch - user.epoch) / 1000;

              if (user.arrivalEpoch !== null) {
                acc[1] += (user.arrivalEpoch - user.messageSentEpoch) / 1000;
              }
            }

            //NOTE: deleted time will be same as arrival if arrived
            if (user.deletedEpoch !== null) {
              acc[2] += (user.deletedEpoch - user.epoch) / 1000;
            }

            return acc;
          }, [0, 0, 0])
        .map(avg => avg / users.length);
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
