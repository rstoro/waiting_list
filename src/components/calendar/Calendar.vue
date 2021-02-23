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
      const mmDDyyyy = calendar.value().split('/');
      mmDDyyyy.push(mmDDyyyy.shift());
      mmDDyyyy.push(mmDDyyyy.shift());
      return mmDDyyyy.join('/');
    }

    const calendar = bulmaCalendar.attach(
      this.$refs.calendarTrigger, { 
        startDate: new Date(),
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
