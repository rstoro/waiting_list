<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  data() {
    return {
      chartData: {
        labels: ['test1', 'test2', 'test3', 'test4'],
        datasets: [
          {
            label: 'test',
            borderWidth: 1,
            data: [100, 300, 700],
            borderColor: '#3273dc',
            backgroundColor: [ '#48c774', '#ffdd57', '#f14668' ],
            pointBorderColor: '#3273dc',
            pointBackgroundColor: [ '#48c774', '#ffdd57', '#f14668' ],
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
