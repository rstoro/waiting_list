<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  data() {
    return {
      chartData: {
        labels: ['test1', 'test2', 'test3', 'test4'],
        datasets: [
          {
            label: 'test',
            data: [100, 700, 300, 500],
            fill: false,
            borderColor: '#3273dc',
            backgroundColor: '#3273dc',
            pointBorderColor: '#3273dc',
            pointBackgroundColor: '#3273dc',
            borderWidth: 1
          }
        ]
      },
      options: {
        xAxisID: 'test x',
        yAxisID: 'test y',
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true },
            gridLines: { display: true }
          }],
          xAxes: [{
            gridLines: { display: false }
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
  }
}
</script>
