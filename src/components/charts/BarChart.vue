<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    stacked: {
      type: Boolean,
      required: false,
      default: true
    },
    chartData: {
      type: Object,
      default: function() {
        return {
          labels: ['No Data'],
          datasets: [{
            borderWidth:0,
            backgroundColor: '#f14668',
            data: []
          }]
        }
      }
    },
    xAxisLabel: {
      type: String,
      required: false,
      default: ''
    },
    yAxisLabel: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      options: {
        xAxisID: 'x',
        yAxisID: 'y',
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true },
            gridLines: { display: true },
            stacked: this.stacked,
            scaleLabel: {
              display: true,
              labelString: this.yAxisLabel
            }
          }],
          xAxes: [{
            gridLines: { display: false },
            stacked: this.stacked,
            scaleLabel: {
              display: true,
              labelString: this.xAxisLabel
            }
          }]
        },
        legend: { display: true },
        responsive: true,
        maintainAspectRatio: false,
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.options);
    }
  }
}
</script>
