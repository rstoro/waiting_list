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
        <span class="has-text-grey">{{ noDataMessage }}</span>
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
    // TODO: chart data types: time, date, wait:message, message:arrival, wait:arrival
    //                         show:no-show
    //       chart types: bar, graph, doughnut, scatter with best fit (do we need others?)
    //       data to be displayed: averages (what else?)
    return {
      showedNoShowedChartData: {},
      timesChartData: {},
      noDataMessage: '',
      showedNoShowedChartText: '',
      avgWait: 0,
      avgTravel: 0,
      avgTotal: 0,
      dataExists: false
    }
  },
  methods: {
    loadLogdata(newDate) {
      // NOTE: time-on-list is equal to showed plus noShowed
      const logs = this.getLog(newDate);

      // set flag
      this.dataExists = logs !== null ? true : false;

      // early out
      if (!this.dataExists) {
        this.noDataMessage = `There is no data for ${new Date(newDate).toDateString()}.`;
        return;
      }

      // user data
      const users = [];
      logs.forEach(log => {
        const currentUser = users.find(user => user.id === log.id);
        if (currentUser === null || currentUser === undefined) {
          users.push({
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

      this.populateTimesChart(users);
      this.populateShowedNoShowedChart(users);
      this.populateAverages(users);
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
    populateTimesChart(users) {
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
        const createdAt = user['actions']['CREATE'];
        const addedT = this.getSecondsFromTimestamp(createdAt);
        labels.push(createdAt)
        
        // if they were messaged
        const messagedAt = user['actions']['SENT'];
        messagedDataset['data'].push(messagedAt !== null && messagedAt !== undefined 
          ? (this.getSecondsFromTimestamp(messagedAt) - addedT) / 60
          : 0
        );

        // if they arrived
        const arrivedAt = user['actions']['ARRIVE'];
        arrivedDataset['data'].push(arrivedAt !== null && arrivedAt !== undefined
          ? (this.getSecondsFromTimestamp(arrivedAt) - this.getSecondsFromTimestamp(messagedAt)) / 60
          : 0
        );

        if (messagedAt === null || messagedAt === undefined) {
          // if they do not arrive and were not messaged
          const deletedAt = user['actions']['DELETE'];
          deletedDataset['data'].push(deletedAt !== null && deletedAt !== undefined
            ? (this.getSecondsFromTimestamp(deletedAt) - addedT) / 60
            : 0
          );
        }
        else {
          // if they do not arrive and were messaged
          const deletedAt = user['actions']['DELETE'];
          deletedDataset['data'].push(deletedAt !== null && deletedAt !== undefined
            ? Math.round((this.getSecondsFromTimestamp(deletedAt) - this.getSecondsFromTimestamp(messagedAt)) / 60)
            : 0
          );
        }
      });

      this.timesChartData = {
        labels: labels,
        datasets: [
          messagedDataset,
          arrivedDataset,
          deletedDataset
        ]
      }
    },
    populateShowedNoShowedChart(users) {
      // showed-noshowed data
      const showedCount = users.reduce((acc, user) => {
        return user['actions']['ARRIVE'] ? acc + 1 : acc;
      }, 0);
      const noShowedCount = users.length - showedCount;

      // showed-noshowed chart data
      this.showedNoShowedChartData = {
        labels: ['Showed', 'No Showed'],
        datasets: [
          {
            borderWidth: 0,
            backgroundColor: ['#48c774', '#f14668'],
            data: [ showedCount, noShowedCount ]
          }
        ]
      }

      // showed-noshowed display text
      const showedPercentage = showedCount === 0 
        ? 0 
        : Math.round((showedCount / (showedCount + noShowedCount)) * 100);
      this.showedNoShowedChartText = `${showedPercentage}%`;
    },
    populateAverages(users) {
      const averages = users.reduce((acc, user) => {
        const addedT = this.getSecondsFromTimestamp(user['actions']['CREATE']);

        const sent = user['actions']['SENT'];
        if (sent !== null && sent != undefined) {
          // add to total wait time
          const sentT = this.getSecondsFromTimestamp(sent);
          acc[0] += sentT - addedT;

          // add to total travel time and total time on list 
          // (NOTE: cannot be deleted if arrived)
          const arrived = user['actions']['ARRIVE'];
          if (arrived !== null && arrived != undefined) {
            acc[1] += this.getSecondsFromTimestamp(arrived) - sentT;
            acc[2] += this.getSecondsFromTimestamp(arrived) - addedT;
          }
        }

        // add to total time on list 
        // (NOTE: can be deleted at any time)
        const deleted = user['actions']['DELETE'];
        if (deleted !== null && deleted != undefined) {
          acc[2] += this.getSecondsFromTimestamp(deleted) - addedT;
        }

        return acc;

      }, [0, 0, 0]);

      // set data
      [this.avgWait, this.avgTravel, this.avgTotal] = averages.map(avg => {
        return avg / users.length;
      });
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
