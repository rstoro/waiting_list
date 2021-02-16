<template>
  <div class="analytics">
    <div class="analytics-body">
      
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'Analytics',
  components: {},
  data() {
    return {
    }
  },
  methods: {},
  created() {
    console.log('created')
  }
}
</script>

<style scoped>
.analytics {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.analytics-body {
  display: flex;
  flex-flow: column;
  flex: 1;
  overflow: auto;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
