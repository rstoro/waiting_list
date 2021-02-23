<template>
  <button ref="calendarTrigger" type="button">Change</button>
</template>

<script>
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar.min.js';

export default {
  name: 'Calendar',
  props: {
    isRange: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const getValue = () => {
      const dates = [];
      calendar.value().split(' - ').forEach(d => {
          const newD = d.split('/');
          newD.push(newD.shift());
          newD.push(newD.shift());
          dates.push(newD.join('/'));
        });

      return dates.length === 1 ? dates[0] : dates;
    }

    const calendar = bulmaCalendar.attach(
      this.$refs.calendarTrigger, { 
        startDate: new Date(),
        endDate: new Date(),
        type: 'date',
        isRange: this.isRange,
        showFooter: false
      }
    )[0];

    let prevDate = getValue();
    this.$emit('dateSelected', prevDate);

    calendar.on('select', () => {
      const newVal = getValue();
      if (prevDate !== newVal) {
        prevDate = newVal;
        this.$emit('dateSelected', newVal);
      }
    });
  }
}
</script>

<style scoped>
</style>
