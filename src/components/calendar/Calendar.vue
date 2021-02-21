<template>
  <button ref="calendarTrigger" type="button">Change</button>
</template>

<script>
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar.min.js';

export default {
  name: 'Calendar',
  mounted() {
    let prevDate = new Date();

    const calendar = bulmaCalendar.attach(
      this.$refs.calendarTrigger, { 
        startDate: prevDate,
        type: 'date',
        showFooter: false
      }
    )[0];

    calendar.on('select', () => {
      if (prevDate.toDateString() !== calendar.date.start.toDateString()) {
        prevDate = calendar.date.start;
        this.$emit('dateSelected', calendar.date.start);
      }
    });
  }
}
</script>

<style scoped>
</style>
