<template>
  <div class="calendar">
    <button ref="calendarTrigger" type="button">Change</button>
  </div>
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
      // HACK: this can be an array or a string, this checks comparison for both
      if (JSON.stringify(prevDate) !== JSON.stringify(newVal)) {
        prevDate = newVal;
        this.$emit('dateSelected', newVal);
      }
    });
  }
}
</script>

<style>
 .calendar .datetimepicker-dummy .datetimepicker-dummy-wrapper {
  border-radius: 4px;
  border-color: #dbdbdb;
  box-shadow: inset 0 0.0625em 0.125em rgba(10, 10, 10, 0.05);
}
</style>
