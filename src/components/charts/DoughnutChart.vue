<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: {
    centerText: {
      type: String,
      default: ''
    },
    chartData: {
      type: Object,
      default: function() {
        return { 
          labels: ['No Data'],
          datasets: [{ 
            borderWidth: 0,
            backgroundColor: '#f14668', //[ '#48c774', '#ffdd57', '#f14668' ]
            data: []
          }]
        }
      }
    }
  },
  data() {
    return {
      options: {
        legend: { display: true },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted() {
    // I love JS scopes...
    const vm = this;
    vm.addPlugin({
      id: 'draw-text',
      beforeDraw: function(chart) {
        const ctx = chart.chart.ctx;
        const elemWidth = (chart.innerRadius * 2) - (0.50 * (chart.innerRadius * 2));
        const strWidth = ctx.measureText(vm.centerText).width;
        const fontSize = Math.floor(elemWidth / strWidth);
        
        ctx.restore();
        ctx.font = fontSize + 'em Avenir, Helvetica, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#3273dc';
        ctx.fillText(
          vm.centerText,
          (chart.chartArea.left + chart.chartArea.right) / 2,
          (chart.chartArea.top + chart.chartArea.bottom) / 2
        );
        ctx.save();
      }
    });
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.options);
    },
    centerText() {
      this.renderChart(this.chartData, this.options);
    }
  }
}
</script>
